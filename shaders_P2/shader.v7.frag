#version 330 core

in vec3 Np;
in vec3 Tp;
in vec3 Pp;
in vec3 color;
in vec2 texCoord;

uniform mat4 modelView;
uniform sampler2D colorTex;
uniform sampler2D specularTex;
uniform sampler2D emiTex;
uniform sampler2D normalTex;

out vec4 outColor;

//Luz ambiental
vec3 Ia = vec3(0.1);

//Propiedades de las fuentes de luz puntuales
struct Light {
	vec3 intensity;
	vec3 position;

	float constant;
    float linear;
    float quadratic;
};
Light lights[] = Light[](
			Light(vec3(0.0, 0.0, 1.0), vec3(10, 0, 0), 1, 0.09, 0.032),
			Light(vec3(0.0, 1.0, 0.0), vec3(-2, 0, 0), 1, 0.09, 0.032));


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

//Propiedades de la luz direccional
struct DirectionalLight {
	vec3 intensity;
	vec3 direction;

	float constant;
    float linear;
    float quadratic;
};
DirectionalLight dirLight = DirectionalLight(vec3(0.6), vec3(-1, -1, -1), 1, 0, 0);

//Propiedades del objeto
vec3 Ka = vec3(1.0, 0.0, 0.0);
vec3 Kd = vec3(1.0, 0.0, 0.0);
vec3 Ks = vec3(1.0);
vec3 Ke = vec3(0.0);
float n = 100;

vec3 N;
vec3 Nbump;
vec3 Nv;
vec3 B;
vec3 T;

mat3 TBN;

//Propiedades del fog
float fogStart = 0.1;
float fogEnd = 10;
float fogDensity =0.2;
vec3 fogColor= vec3(0.5,0.2,0.2);


float fog()
{
	float fogFactor =0;

	//Lineal
	fogFactor= (fogEnd-abs(Pp.z))/ (fogEnd - fogStart);

	//Exponencial
	//fogFactor= 1/exp(abs(Pp.z) * fogDensity);

	return fogFactor;
}

vec3 shade()
{
	vec3 cf = vec3(0.0);

	//Ambiental
	cf += Ia*Ka;

	//Emisiva
	cf += Ke;

	//Luces puntuales
	
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
	}
	
	
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
		cf += clamp(atenuation * spotLight.intensity * Kd * dot(N, L), 0.0, 1.0) * f;

		//Especular
		vec3 V = normalize(-Pp);
		vec3 R = reflect(-L, N);
		float fs = pow(max(0.0, dot(R,V)), n);
		cf += atenuation * spotLight.intensity * Ks * fs * f;
	}
	

	//Luz direccional
	//Difusa
	cf += clamp(dirLight.intensity * Kd * dot(N, -normalize(dirLight.direction)), 0.0, 1.0);

	//Especular
	vec3 V = normalize(-Pp);
	vec3 R = reflect(normalize(dirLight.direction), N);
	float fs = pow(max(0.0, dot(R,V)), n);
	cf += spotLight.intensity * Ks * fs;

	return cf;
}


void main()
{
	Ka = texture(colorTex, texCoord).rgb;
	Kd = Ka;
	Ks = texture(specularTex, texCoord).rgb;
	Ke = texture(emiTex, texCoord).rgb;

	N = normalize(Np);
	T = normalize(Tp);
	B = normalize(cross(N, T));
	TBN = transpose(mat3(T, B, N));

	Nbump = ((texture(normalTex, texCoord).rgb) * 2 - 1);
	Nv = (modelView * vec4(normalize(Nbump * TBN), 0.0)).xyz;
	N = normalize(Nv);

	vec3 cf= mix( fogColor,shade(), fog());

	outColor = vec4(cf, 1.0);   
}
