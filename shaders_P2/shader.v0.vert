#version 330 core

in vec3 inPos;
in vec3 inNormal;
in vec3 inColor;

uniform mat4 modelViewProj;
uniform mat4 modelView;
uniform mat4 normal;

out vec3 color;

//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades de la fuente de luz
vec3 Il1 = vec3(1.0);
vec3 Pl1 = vec3(0.0);

//Propiedades del objeto
vec3 Pp;
vec3 Np;
vec3 Ka = vec3(1.0, 0.0, 0.0);
vec3 Kd = vec3(1.0, 0.0, 0.0);
vec3 Ks = vec3(1.0);
vec3 Ke = vec3(0.0);

vec3 N;

vec3 shade()
{
	vec3 cf = vec3(0.0);

	//Ambiental
	cf += Ia*Ka;

	//Difusa
	vec3 L = normalize(Pl1 - Pp);
	cf += clamp(Il1*Kd*dot(N,L), 0.0, 1.0);

	//Especular



	return cf;
}

void main()
{
	Np = (normal * vec4(inNormal, 0.0)).xyz;
	Pp = (modelView * vec4(inPos, 1.0)).xyz;

	N = normalize(Np);

	color = shade();
	gl_Position =  modelViewProj * vec4(inPos, 1.0);
}
