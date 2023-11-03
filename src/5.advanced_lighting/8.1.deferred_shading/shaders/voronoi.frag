#version 330 core

uniform sampler2D samplerColor;
uniform float timeOffset;

in vec2 vertUV;

out vec4 outFragColor;

vec3 hash3( vec2 p ){
    vec3 q = vec3( dot(p,vec2(127.1,311.7)), 
				   dot(p,vec2(269.5,183.3)), 
				   dot(p,vec2(419.2,371.9)) );
	return fract(sin(q)*43758.5453);
}

float iqnoise( in vec2 x, float u, float v )
{
    vec2 p = floor(x);
    vec2 f = fract(x);

    float k = 1.0 + 63.0*pow(1.0-v,4.0);
    float va = 0.0;
    float wt = 0.0;
    for( int j=-2; j<=2; j++ )
    for( int i=-2; i<=2; i++ )
    {
        vec2  g = vec2( float(i), float(j) );
        vec3  o = hash3( p + g )*vec3(u,u,1.0);
        vec2  r = g - f + o.xy;
        float d = dot(r,r);
        float w = pow( 1.0-smoothstep(0.0,1.414,sqrt(d)), k );
        va += w*o.z;
        wt += w;
    }

    return va/wt;
}

vec2 rand2(float n){return vec2(fract(sin(n) * 43758.5453123), fract(cos(n) * 73234.283472));}

void main()
{
	vec2 newUV = vertUV + vec2(floor(timeOffset));
	float rand = iqnoise(newUV * 125, 1, 1);
    rand = clamp(rand, 0, 1);
	//vec2 offset = rand2(rand);
	//offset *= 0.01f;
	//vec2 uv = vertUV + offset;
	//outFragColor = texture(samplerColor, uv);

    vec2 uv = vertUV + rand * 0.005;
    outFragColor = texture(samplerColor, uv);
}