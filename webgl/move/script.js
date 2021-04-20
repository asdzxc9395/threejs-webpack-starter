"use strict";

var vertexShaderSource = `#version 300 es
 
// attribute는 버텍스 쉐이더에 대한 입력(in)입니다.
// 버퍼로부터 받은 데이터입니다.
in vec2 a_position;
 
uniform vec2 u_resolution;

void main() {
  // 픽셀 위치를 0.0에서 1.0 사이로 변환합니다.
  vec2 zeroToOne = a_position / u_resolution;

  // 0 -> 1에서 0 -> 2로 변환
  vec2 zeroToTwo = zeroToOne * 2.0;

  // 0 -> 2 에서 -1 -> +1 변환(클립 공간)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace, 0, 1);
}
`;

var fragmentShaderSource = `#version 300 es
 
// 프래그먼트 쉐이더는 기본 정밀도를 가지고 있지 않으므로 선언을 해야합니다.
// highp는 기본값으로 적당합니다. "높은 정밀도"를 의미합니다.
precision highp float;
 
// 프래그먼트 쉐이더(fragment shader)에서 출력을 선언 해야합니다.
out vec4 outColor;
 
void main() {
  // 붉은-보라색으로 출력하게 설정합니다.
  outColor = vec4(1, 0, 0.5, 1);
}
`;

function main() {
  // Get A WebGL context
  /** @type {HTMLCanvasElement} */
  var canvas = document.querySelector("#canvas");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    // webgl2를 사용할수 없습니다!
    return;
  }
  

  // Use our boilerplate utils to compile the shaders and link into a program
  var program = webglUtils.createProgramFromSources(gl,
    [vertexShaderSource, fragmentShaderSource]);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");
  var colorLocation = gl.getUniformLocation(program, "u_color");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 한번 실행할 때마다 2개 구성 요소 사용
  var type = gl.FLOAT;   // 데이터는 32비트 소수점
  var normalize = false; // 정규화 되지 않은 데이터
  var stride = 0;        // 0 은 실행할 때마다 `size * sizeof(type)`만큼 다음 위치로 이동합니다.
  var offset = 0;        // 버퍼의 첫 위치부터 시작
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);


  // 먼저 사각형의 높이, 너비, 이동(translation)을 가지고 있는 몇 가지 변수들을 만들어 봅시다.
  var translation = [0, 0];
  var width = 100;
  var height = 30;
  var color = [Math.random(), Math.random(), Math.random(), 1];
 
  // 다음 모든 것을 다시 그리는 함수를 만들어 봅시다.
  // 이 함수를 이동(translation)을 업데이트하고 호출 할 것입니다..

  drawScene();

  // Setup a ui.
  webglLessonsUI.setupSlider("#x", {slide: updatePosition(0), max: gl.canvas.width });
  webglLessonsUI.setupSlider("#y", {slide: updatePosition(1), max: gl.canvas.height});

  function updatePosition(index) {
    return function(event, ui) {
      translation[index] = ui.value;
      drawScene();
    };
  }

  // scene 그리기.
  function drawScene() {
    webglUtils.resizeCanvasToDisplaySize(gl.canvas);
 
    // WebGL에 클립 공간에서 픽셀로 변환하는 방법을 알려줍니다.
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
 
    // 캔버스 지우기
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
 
    // 사용할 프로그램(쉐이더 쌍)을 전달합니다
    gl.useProgram(program);
 
    // 원하는 속성(attribute)/버퍼(buffer)를 연결 합니다.
    gl.bindVertexArray(vao);
 
    // 캔버스로 해상도를 쉐이더의 픽셀에서 클립공간으로 변환 할수 있게 전달합니다.
    gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);
 
    // 직사각형 위치로 버퍼(buffer) 위치 업데이트
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    setRectangle(gl, translation[0], translation[1], width, height);
 
    // 색상 설정
    gl.uniform4fv(colorLocation, color);
 
    // 사각형 그리기.
    var primitiveType = gl.TRIANGLES;
    var offset = 0;
    var count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}
// Fill the buffer with the values that define a rectangle.
function setRectangle(gl, x, y, width, height) {
  var x1 = x;
  var x2 = x + width;
  var y1 = y;
  var y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}
main();