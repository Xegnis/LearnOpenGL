#version 330 core

uniform sampler2D samplerColor;
uniform sampler2D edgeColor;
uniform float timeOffset;

in vec2 vertUV;

out vec4 outFragColor;

#define NUM_OCTAVES 5

float rand(vec2 n) { 
	return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

float noise(vec2 n) {
	const vec2 d = vec2(0.0, 1.0);
	vec2 b = floor(n), f = smoothstep(vec2(0.0), vec2(1.0), fract(n));
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

void main()
{
	float white = fbm(vertUV * 15 + floor(timeOffset));
	white = step(white, 0.45f);

	float edge = length(texture(edgeColor, vertUV).xyz);
	edge = step(edge, 0.3f);

	white *= edge;

	vec3 color = mix(texture(samplerColor, vertUV).xyz, vec3(1.0f), white);

	outFragColor = vec4(color, 1.0f);
	//outFragColor = texture(edgeColor, vertUV);
}