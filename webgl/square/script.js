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

function createShader(gl, type, source) {
  var shader = gl.createShader(type);
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  var success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (success) {
    return shader;
  }

  console.log(gl.getShaderInfoLog(shader));  // eslint-disable-line
  gl.deleteShader(shader);
  return undefined;
}

function createProgram(gl, vertexShader, fragmentShader) {
  var program = gl.createProgram();
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  var success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (success) {
    return program;
  }

  console.log(gl.getProgramInfoLog(program));  // eslint-disable-line
  gl.deleteProgram(program);
  return undefined;
}

function main() {
  // Get A WebGL context
  var canvas = document.querySelector("#c");
  var gl = canvas.getContext("webgl2");
  if (!gl) {
    // webgl2를 사용할수 없습니다!
    return;
  }

  // create GLSL shaders, upload the GLSL source, compile the shaders
  var vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
  var fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);

  // Link the two shaders into a program
  var program = createProgram(gl, vertexShader, fragmentShader);

  // look up where the vertex data needs to go.
  var positionAttributeLocation = gl.getAttribLocation(program, "a_position");

  // look up uniform locations
  var resolutionUniformLocation = gl.getUniformLocation(program, "u_resolution");

  // Create a buffer and put three 2d clip space points in it
  var positionBuffer = gl.createBuffer();

  // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
  gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

  var positions = [
    10, 20,
    80, 20,
    10, 80,
    10, 80,
    80, 20,
    80, 80,
  ];
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);

  // Create a vertex array object (attribute state)
  var vao = gl.createVertexArray();

  // and make it the one we're currently working with
  gl.bindVertexArray(vao);

  // Turn on the attribute
  gl.enableVertexAttribArray(positionAttributeLocation);

  // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
  var size = 2;          // 한번 실행할 때마다 2개 구성 요소 사용
  var type = gl.FLOAT;   // 데이터는 32비트 소수점
  var normalize = false; // 정규화 되지 않은 데이터
  var stride = 0;        // 0 은 실행할 때마다 `size * sizeof(type)`만큼 다음 위치로 이동합니다.
  var offset = 0;        // 버퍼의 첫 위치부터 시작
  gl.vertexAttribPointer(
      positionAttributeLocation, size, type, normalize, stride, offset);

  webglUtils.resizeCanvasToDisplaySize(gl.canvas);

  // Tell WebGL how to convert from clip space to pixels
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

  // Clear the canvas
  gl.clearColor(0, 0, 0, 0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  // Tell it to use our program (pair of shaders)
  gl.useProgram(program);

  // 원하는 attribute/buffer 집합을 바인드합니다.
  gl.bindVertexArray(vao);

  // Pass in the canvas resolution so we can convert from
  // pixels to clipspace in the shader
  gl.uniform2f(resolutionUniformLocation, gl.canvas.width, gl.canvas.height);


  // draw
  var primitiveType = gl.TRIANGLES;
  var offset = 0;
  var count = 6;
  gl.drawArrays(primitiveType, offset, count);
}

main();