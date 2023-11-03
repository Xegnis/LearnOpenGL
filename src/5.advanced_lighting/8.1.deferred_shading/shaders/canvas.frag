#version 330 core

uniform sampler2D samplerColor;
uniform float timeOffset = 0.0f;

in vec2 vertUV;

out vec4 outFragColor;

#define NUM_OCTAVES 5

float rand(vec2 n) { return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453); }
float rand(float n) { return fract(sin(n) * 43758.5453123); }

float noise(vec2 n)
{
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n);
	vec2 f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
	return mix(mix(rand(b), rand(b + d.yx), f.x), mix(rand(b + d.xy), rand(b + d.yy), f.x), f.y);
}

float fbm(vec2 x) {
	float v = 0.0;
	float a = 0.5;
	vec2 shift = vec2(100);
	// Rotate to reduce axial bias
    mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.50));
	for (int i = 0; i < NUM_OCTAVES; ++i) {
		v += a * noise(x);
		x = rot * x * 2.0 + shift;
		a *= 0.5;
	}
	return v;
}

float getHeight (vec2 xy)
{
	return fbm(xy) * fbm((xy * 4) + 13442.452);
}

void main()
{
	//use 2 fbm mutiplied together to generate height
	vec2 uv = vertUV + floor(timeOffset);
	uv = uv * 4;
	float height = getHeight(uv);

	//calculate the normal of the fragment
	float normalOffset = 0.001f;
	float right = getHeight(uv + vec2(normalOffset, 0.0f)) * 1000f;
	float left = getHeight(uv + vec2(-normalOffset, 0.0f)) * 1000f;
	float bottom = getHeight(uv + vec2(0.0f, -normalOffset)) * 1000f;
	float top = getHeight(uv + vec2(0.0f, normalOffset)) * 1000f;
	vec3 normal = normalize(vec3(2*(right-left), 2*(bottom-top), 4));

	//calculate lighting
	vec3 Diffuse = vec3(1.0f);
	vec3 viewPos = vec3(0.0f, -1.0f, 0.0f);
	vec3 FragPos = vec3(uv.x * 10.0f, 20.0f, uv.y * 10.0f);
	vec3 lightDir = normalize(vec3(10.0f, -10.0f, 10.0f));
	vec3 lightColor = vec3(1.0f);

	vec3 lighting  = Diffuse * 0.1; // hard-coded ambient component
    vec3 viewDir  = normalize(viewPos - FragPos);

    // diffuse
    vec3 diffuse = max(dot(normal, lightDir), 0.0) * Diffuse * lightColor;
    // specular
    vec3 halfwayDir = normalize(lightDir + viewDir);  
    float spec = pow(max(dot(normal, halfwayDir), 0.0), 16.0);
    vec3 specular = lightColor * spec;

    lighting += diffuse + specular;

	lighting = clamp(lighting, vec3(0.0f), vec3(1.0f));

	//lighting += vec3(1.0f - max(max(lighting.x, lighting.y), lighting.z));

	float reduce = 0.1f;
	lighting = lighting * vec3(reduce) + vec3(1.0f - reduce) + 0.1f;
	
	outFragColor = vec4(texture(samplerColor, vertUV).xyz * lighting, 1.0f);
	//outFragColor = texture(samplerColor, vertUV) * vec4(lighting, 1.0f);
}