#version 330 core

in vec3 Np;
in vec3 Pp;
in vec3 color;
in vec2 texCoord;

uniform sampler2D colorTex;
uniform sampler2D specularTex;
uniform sampler2D emiTex;

out vec4 outColor;

//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades de la fuente de luz
vec3 Il1 = vec3(0.75);
vec3 Pl1 = vec3(0.0);

//Propiedades del objeto
vec3 Ka = vec3(1.0, 0.0, 0.0);
vec3 Kd = vec3(1.0, 0.0, 0.0);
vec3 Ks = vec3(1.0);
vec3 Ke = vec3(0.0);
float n = 100;
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
	vec3 V = normalize(-Pp);
	vec3 R = reflect(-L, N);

	float fs = pow(max(0.0, dot(R,V)), n);
	cf += Il1 * Ks * fs;

	cf += Ke;

	return cf;
}


void main()
{
	Ka = texture(colorTex, texCoord).rgb;
	Kd = Ka;
	Ks = texture(specularTex, texCoord).rgb;
	Ke = texture(emiTex, texCoord).rgb;
	N = normalize(Np);
	outColor = vec4(shade(), 1.0);   
}
