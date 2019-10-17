#version 330 core

in vec3 inPos;
in vec3 inNormal;
in vec3 inColor;

uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;

out vec3 Np;
out vec3 Pp;
out vec3 color;

void main()
{
	Np = (normal * vec4(inNormal, 0.0)).xyz;
	Pp = (modelView * vec4(inPos, 1.0)).xyz;
	color = inColor;
	gl_Position =  modelViewProj * vec4(inPos, 1.0);
}
