#version 330 core

out vec2 vertUV;

void main() 
{
	vertUV = vec2((gl_VertexID << 1) & 2, gl_VertexID & 2);
	gl_Position = vec4(vertUV * 2.0f - 1.0f, 0.0f, 1.0f);
}
