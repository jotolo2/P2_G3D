#version 330 core
//OBLIGATORIO 3.1
//IMPLEMENTACIÓN DE UNA LUZ FOCAL

in vec3 Np;
in vec3 Pp;
in vec3 color;
in vec2 texCoord;

uniform sampler2D colorTex;
uniform sampler2D specularTex;
uniform sampler2D emiTex;

out vec4 outColor;

//Propeidades de la fuente de luz focal
struct SpotLight {
	vec3 intensity;
	vec3 position;
	vec3 direction;

	float constant;
    float linear;
    float quadratic;

	float cutOff;
	float m;
};
SpotLight spotLight = SpotLight(vec3(1), vec3(0.0, 0.0, 0.0), vec3(0, 0, -1),  1, 0, 0, 0.97, 2);

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
	
	//Luz focal
	vec3 L = spotLight.position - Pp;
	float distance = length(L);
	float atenuation = min(1 / (spotLight.constant + spotLight.linear * distance + spotLight.quadratic * distance * distance), 1);
	L = normalize(L);
	float theta = dot(normalize(spotLight.direction), -L);

	if(theta > spotLight.cutOff)
	{
		float f = pow(((theta - spotLight.cutOff) / ( 1 - spotLight.cutOff)), spotLight.m);

		//Difusa
		cf += clamp(atenuation * spotLight.intensity * Kd * dot(N,L), 0.0, 1.0) * f;

		//Especular
		vec3 V = normalize(-Pp);
		vec3 R = reflect(-L, N);
		float fs = pow(max(0.0, dot(R,V)), n);
		cf += atenuation * spotLight.intensity * Ks * fs * f;
	}

	return cf;
}
