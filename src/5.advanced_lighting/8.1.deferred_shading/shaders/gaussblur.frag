#version 330 core

uniform sampler2D samplerColor;
uniform	float blurScale = 1.0f;

uniform int blurdirection = 0;

in vec2 vertUV;

out vec4 outFragColor;

void main() 
{
	float weight[5];
	weight[0] = 0.227027;
	weight[1] = 0.1945946;
	weight[2] = 0.1216216;
	weight[3] = 0.054054;
	weight[4] = 0.016216;

	vec2 tex_offset = 1.0 / textureSize(samplerColor, 0) * blurScale; // gets size of single texel
	vec3 result = texture(samplerColor, vertUV).rgb * weight[0]; // current fragment's contribution
	for(int i = 1; i < 5; ++i)
	{
		if (blurdirection == 1)
		{
			// H
			result += texture(samplerColor, vertUV + vec2(tex_offset.x * i, 0.0)).rgb * weight[i];
			result += texture(samplerColor, vertUV - vec2(tex_offset.x * i, 0.0)).rgb * weight[i];
		}
		else
		{
			// V
			result += texture(samplerColor, vertUV + vec2(0.0, tex_offset.y * i)).rgb * weight[i];
			result += texture(samplerColor, vertUV - vec2(0.0, tex_offset.y * i)).rgb * weight[i];
		}
	}
	outFragColor = vec4(result, 1.0);
}