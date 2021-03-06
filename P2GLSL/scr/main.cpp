#include "BOX.h"
#include "PYRAMID.hpp"
#include <IGL/IGlib.h>

#define GLM_FORCE_RADIANS
#include <glm/glm.hpp>
#include <glm/gtc/matrix_transform.hpp>
#include <iostream>


//Idenficadores de los objetos de la escena
int objId = -1;

glm::vec3 cameraPos, cameraForward, cameraUp;
glm::mat4 view;

//Declaraci�n de CB
void resizeFunc(int width, int height);
void idleFunc();
void keyboardFunc(unsigned char key, int x, int y);
void mouseFunc(int button, int state, int x, int y);
void mouseMotionFunc(int x, int y);

int main(int argc, char** argv)
{
	std::locale::global(std::locale("spanish"));// acentos ;)
	if (!IGlib::init("../shaders_P2/shader.v7.vert", "../shaders_P2/shader.v7.frag"))
		return -1;

	cameraPos = glm::vec3(0.0f, 0.0f, -6.0f);
	cameraForward = glm::vec3(0.0f, 0.0f, 1.0f);
	cameraUp = glm::vec3(0.0f, 1.0f, 0.0f);
	view = glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp);
	IGlib::setViewMat(view);

	//Matriz de proyecci�n
	glm::mat4 proj = glm::mat4(1.0);
	float f = 1.0f / tan(3.141592f / 6.0f);
	float far = 10.0f;
	float near = 0.1f;
	proj[0].x = f;
	proj[1].y = f;
	proj[2].z = -(far + near) / (far - near);
	proj[3].z = (-2.0f * far * near) / (far - near);
	proj[2].w = -1.0f;
	IGlib::setProjMat(proj);

	//OPTATIVO 3
	//Creamos el nuevo objeto que vamos a visualizar con la tangente
	/*
	Pyramid pyramid = Pyramid();
	objId = IGlib::createObj(pyramid.nTriangleIndex, pyramid.nVertex, pyramid.triangleIndex,
		pyramid.vertexPos, pyramid.vertexColor, pyramid.vertexNormal, pyramid.vertexTexCoord, pyramid.vertexTangent);

		*/
	objId = IGlib::createObj(cubeNTriangleIndex, cubeNVertex, cubeTriangleIndex,
		cubeVertexPos, cubeVertexColor, cubeVertexNormal, cubeVertexTexCoord, cubeVertexTangent);

	IGlib::addColorTex(objId, "../img/color2.png");
	IGlib::addSpecularTex(objId, "../img/specMap.png");
	IGlib::addEmissiveTex(objId, "../img/emissive.png");
	IGlib::addNormalTex(objId, "../img/normal.png");

	glm::mat4 modelMat = glm::mat4(1.0f);
	IGlib::setModelMat(objId, modelMat);

	//CBs
	IGlib::setIdleCB(idleFunc);
	IGlib::setResizeCB(resizeFunc);
	IGlib::setKeyboardCB(keyboardFunc);
	IGlib::setMouseCB(mouseFunc);
	IGlib::setMouseMoveCB(mouseMotionFunc);

	//Mainloop
	IGlib::mainLoop();
	IGlib::destroy();
	return 0;
}

void resizeFunc(int width, int height)
{
	//Ajusta el aspect ratio al tama�o de la venta
	glm::mat4 proj = glm::mat4(0.0f);
	float aspectRatio = float(width) / float(height);
	float near = 0.1f;
	float far = 10.0f;
	float fov = 30.0f;
	proj[0].x = 1.0f / (tan(glm::radians(fov)) * aspectRatio);
	proj[1].y = 1.0f / tan(glm::radians(fov));
	proj[2].z = -(far + near) / (far - near);
	proj[3].z = (-2.0f * far * near) / (far - near);
	proj[2].w = -1.0f;

	IGlib::setProjMat(proj);
}

void idleFunc()
{
	glm::mat4 modelMat(1.0f);
	static float angle = 0.0f;
	angle = (angle > 3.141592f * 2.0f) ? 0 : angle + 0.01f;

	modelMat = glm::rotate(modelMat, angle, glm::vec3(1.0f, 1.0f, 0.0f));

	IGlib::setModelMat(objId, modelMat);
}

void keyboardFunc(unsigned char key, int x, int y)
{
	//std::cout << "Se ha pulsado la tecla " << key << std::endl << std::endl;
	//Control de la posici�n de la c�mara por teclado
	glm::vec3 left;
	glm::vec4 result;
	glm::mat4 rotation;
	switch (key)
	{
	case('a'):
	case('A'):
		left = glm::normalize(glm::cross(cameraUp, cameraForward));
		cameraPos = cameraPos + left * 0.2f;
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;

	case('d'):
	case('D'):
		left = glm::normalize(glm::cross(cameraUp, cameraForward));
		cameraPos = cameraPos - left * 0.2f;
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;

	case('s'):
	case('S'):
		cameraPos = cameraPos - cameraForward * 0.2f;
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;

	case('w'):
	case('W'):
		cameraPos = cameraPos + cameraForward * 0.2f;
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;

	case('z'):
	case('Z'):
		rotation = glm::rotate(glm::mat4(1.0f), 0.05f, glm::vec3(0, 1, 0));
		result = rotation * glm::vec4(cameraForward, 0.0f);
		cameraForward = glm::normalize(glm::vec3(result));
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;

	case('x'):
	case('X'):
		rotation = glm::rotate(glm::mat4(1.0f), -0.05f, glm::vec3(0, 1, 0));
		result = rotation * glm::vec4(cameraForward, 0.0f);
		cameraForward = glm::normalize(glm::vec3(result));
		IGlib::setViewMat(glm::lookAt(cameraPos, cameraPos + cameraForward, cameraUp));
		break;
	}
}

void mouseFunc(int button, int state, int x, int y)
{
	/*
	if (state == 0)
		std::cout << "Se ha pulsado el bot�n ";
	else
		std::cout << "Se ha soltado el bot�n ";

	if (button == 0) std::cout << "de la izquierda del rat�n " << std::endl;
	if (button == 1) std::cout << "central del rat�n " << std::endl;
	if (button == 2) std::cout << "de la derecha del rat�n " << std::endl;

	std::cout << "en la posici�n " << x << " " << y << std::endl << std::endl;
	*/
}

void mouseMotionFunc(int x, int y)
{
}