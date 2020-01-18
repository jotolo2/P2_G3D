#version 330 core
//OBLIGATORIO 3.2
//IMPLEMENTACIÓN DE UNA LUZ DIRECCIONAL

in vec3 Np;
in vec3 Pp;
in vec3 color;
in vec2 texCoord;

uniform sampler2D colorTex;
uniform sampler2D specularTex;
uniform sampler2D emiTex;

out vec4 outColor;

//Propiedades de la luz direccional
struct DirectionalLight {
	vec3 intensity;
	vec3 direction;

	float constant;
    float linear;
    float quadratic;
};
DirectionalLight dirLight = DirectionalLight(vec3(0.6), vec3(0, 1, 0), 1, 0, 0);

//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades del objeto
vec3 Ka;
vec3 Kd;
vec3 Ks;
vec3 Ke;
float n = 100;
vec3 N;

vec3 shade();

void main()
{
	Ka = texture(colorTex, texCoord).rgb;
	Kd = Ka;
	Ks = texture(specularTex, texCoord).rgb;
	Ke = texture(emiTex, texCoord).rgb;
	N = normalize(Np);
	outColor = vec4(shade(), 1.0);   
}

vec3 shade()
{
	vec3 cf = vec3(0.0);

	//Ambiental
	cf += Ia*Ka;

	//Emisiva
	cf += Ke;
	
	//Luz direccional
	
	//Difusa
	cf += clamp(dirLight.intensity * Kd * dot(N, -normalize(dirLight.direction)), 0.0, 1.0);

	//Especular
	vec3 V = normalize(-Pp);
	vec3 R = reflect(dirLight.direction, N);
	float fs = pow(max(0.0, dot(R,V)), n);
	cf += dirLight.intensity * Ks * fs;

	return cf;
}
