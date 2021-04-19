# Three.js Starter

https://webglfundamentals.org/webgl/lessons/ko/webgl-fundamentals.html

WEBGL은 종종 3D API로 치부된다. 하지만 WEBGL은 rasterization 엔진에 불과할 뿐이다. 점 선 면등을 webgl을
통해서 그리는데 이 세가지를 통해 3d를 만드는 것이다

webgl은 컴퓨터에 있는 gpu에서 실행됩니다. 따라서 gpu에서 실행되는 코드를 제공해야 한다. 해당 코드는 두 종류가
제공되는데 (vertex shader, fragment shader) 이 두개를 합쳐서 구현을 해야 한다.

Vertex shader은 정점 위치를 계산하여야 하는데 점, 선, 삼각형 등을 포함한 다양한 종류의 기본형타입을 레스터화 할수 있다.
Fragment shader은 현재 그러지는 primitive의 각 픽셀에 대한 색상을 계산한다.

대부분의 webgl은 이러한 함수들을 실행햐기 위해 세팅을 해야 하는데, gpu에서 shader를 실행하는
gl.drawArrays나 gl.drawElement를 호출해서 함수들을 실행해야 한다.

이 api를 적용히켜야 하는 방법들로는 (shader)은 4가지가 있다.

1.Attribute & Buffer
gpu에 업로드하는 2진 데이터 배열이다.
위치, 선, 좌표, 생상등을 포함하여 자유롭게 데이터를 넣을 수 있다.

2.Uniform

Uniform은 shader program을 실행하기 전에 설정하는 사실상 전역 변수입니다.

3.Texture

Texture는 shader program에서 무작위로 접근할 수 있는 데이터 배열입니다. Texture에 넣는 대부분은 이미지 데이터지만 texture는 데이터일 뿐이며 색상 이외의 것도 쉽게 담을 수 있습니다.

4.Varying

Varying은 vertex shader가 fragment shader에 데이터를 넘기는 방법입니다. 점, 선, 삼각형 등 렌더링 되는 것에 따라 vertex shader에 의해 설정된 varying의 값은 fragment shader를 실행하는 동안 보간됩니다.
