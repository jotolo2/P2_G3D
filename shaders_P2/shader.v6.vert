#version 330 core

in vec3 inPos;
in vec3 inNormal;
in vec3 inTangent;	
in vec3 inColor;
in vec2 inTexCoord;

uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;

out vec3 Np;
out vec3 Tp;
out vec3 Pp;
out vec3 color;
out vec2 texCoord;

void main()
{
	Np = inNormal;
	Tp = inTangent;
	Pp = (modelView * vec4(inPos, 1.0)).xyz;
	color = inColor;
	texCoord = inTexCoord;

	gl_Position =  modelViewProj * vec4(inPos, 1.0);
}
