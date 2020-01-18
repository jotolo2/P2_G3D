#version 330 core
//OBLIGATORIO 1 Y 2
//ILUMINACIÓN CON DOS LUCES PUNTUALES
//ATENUACIÓN CON LA DISTANCIA

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
struct Light {
	vec3 intensity;
	vec3 position;

	float constant;
    float linear;
    float quadratic;
};

//Una luz roja a la derecha y una luz verde más cerca a la izquierda
Light lights[] = Light[](
			Light(vec3(1.0, 0.0, 0.0), vec3(10, 0, 0), 1, 0.09, 0.032),
			Light(vec3(0.0, 1.0, 0.0), vec3(-2, 0, 0), 1, 0.09, 0.032)
			);

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

	for (int i = 0; i < 2; i++)
	{
		vec3 L = lights[i].position - Pp;
		
		//Atenuacion
		float distance = length(L);
		float atenuation = min(1 / (lights[i].constant + lights[i].linear * distance + lights[i].quadratic * distance * distance), 1);

		//Difusa
		L = normalize(L);
		cf += clamp(atenuation*lights[i].intensity*Kd*dot(N,L), 0.0, 1.0);

		//Especular
		vec3 V = normalize(-Pp);
		vec3 R = reflect(-L, N);

		float fs = pow(max(0.0, dot(R,V)), n);
		cf += atenuation*lights[i].intensity * Ks * fs;

		cf += Ke;
	}

	//Ambiental
	cf += Ia*Ka;

	return cf;
}
