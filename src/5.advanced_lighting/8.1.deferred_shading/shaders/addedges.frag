#version 330 core

in vec2 vertUV;
out vec4 color;

uniform sampler2D original;
uniform sampler2D edges;

void main()
{
    vec4 edge = texture(edges, vertUV);
    //edge = clamp(edge, vec4(0.0f), vec4(0.1f));
    vec4 orig = texture(original, vertUV);
    color = vec4(orig.xyz * edge.xyz, 1.0f);
} 