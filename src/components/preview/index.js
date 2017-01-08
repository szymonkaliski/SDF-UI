import { Node, Shaders, GLSL } from 'gl-react';
import React, { Component } from 'react';
import { Surface } from 'gl-react-dom';

const fragmentCode = GLSL`
precision highp float;
varying vec2 uv;

const int SDF_STEPS = 50;

float sdBox(vec3 p, vec3 b) {
  vec3 d = abs(p) - b;
  return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
}

vec2 doModel(vec3 p) {
  return vec2(
    sdBox(p, vec3(0.1)),
    0.0
  );
}

vec2 calcRayIntersection(vec3 rayOrigin, vec3 rayDir, float maxd, float precis) {
  float latest = precis * 2.0;
  float dist   = +0.0;
  float type   = -1.0;
  vec2  res    = vec2(-1.0, -1.0);

  for (int i = 0; i < SDF_STEPS; i++) {
    if (latest < precis || dist > maxd) break;

    vec2 result = doModel(rayOrigin + rayDir * dist);

    latest = result.x;
    type   = result.y;
    dist  += latest;
  }

  if (dist < maxd) {
    res = vec2(dist, type);
  }

  return res;
}

vec2 raytrace(vec3 rayOrigin, vec3 rayDir) {
  return calcRayIntersection(rayOrigin, rayDir, 20.0, 0.001);
}

vec3 calcNormal(vec3 pos, float eps) {
  const vec3 v1 = vec3( 1.0, -1.0, -1.0);
  const vec3 v2 = vec3(-1.0, -1.0,  1.0);
  const vec3 v3 = vec3(-1.0,  1.0, -1.0);
  const vec3 v4 = vec3( 1.0,  1.0,  1.0);

  return normalize(v1 * doModel(pos + v1 * eps).x +
                   v2 * doModel(pos + v2 * eps).x +
                   v3 * doModel(pos + v3 * eps).x +
                   v4 * doModel(pos + v4 * eps).x);
}

vec3 normal(vec3 pos) {
  return calcNormal(pos, 0.001);
}

mat3 calcLookAtMatrix(vec3 origin, vec3 target, float roll) {
  vec3 rr = vec3(sin(roll), cos(roll), 0.0);
  vec3 ww = normalize(target - origin);
  vec3 uu = normalize(cross(ww, rr));
  vec3 vv = normalize(cross(uu, ww));

  return mat3(uu, vv, ww);
}

vec3 getRay(mat3 camMat, vec2 screenPos, float lensLength) {
  return normalize(camMat * vec3(screenPos, lensLength));
}

vec3 getRay(vec3 origin, vec3 target, vec2 screenPos, float lensLength) {
  mat3 camMat = calcLookAtMatrix(origin, target, 0.0);
  return getRay(camMat, screenPos, lensLength);
}

vec2 square(vec2 screenSize) {
  vec2 position = 2.0 * (gl_FragCoord.xy / screenSize.xy) - 1.0;
  position.x *= screenSize.x / screenSize.y;
  return position;
}

void orbitCamera(
  in float camAngle,
  in float camHeight,
  in float camDistance,
  in vec2 screenResolution,
  out vec3 rayOrigin,
  out vec3 rayDirection
) {
  vec2 screenPos = square(screenResolution);
  vec3 rayTarget = vec3(0.0);

  rayOrigin = vec3(
    camDistance * sin(camAngle),
    camHeight,
    camDistance * cos(camAngle)
  );

  rayDirection = getRay(rayOrigin, rayTarget, screenPos, 2.0);
}

vec3 lighting(vec3 pos, vec3 nor, vec3 ro, vec3 rd) {
  vec3 dir = normalize(vec3(0.0, 1.0, 0.0));
  vec3 col = vec3(0.97);
  vec3 dif = col * max(0.0, dot(dir, nor));

  vec3 ambient = vec3(0.16);

  return dif + ambient;
}

void main () {
  vec3 color = vec3(0.0);
  vec3 ro, rd;

  float rotation = 1.0;
  float height   = 1.0;
  float dist     = 1.0;

  // TODO: from JS
  vec2 uResolution = vec2(500.0, 500.0);

  orbitCamera(rotation, height, dist, uResolution, ro, rd);

  vec2 t = raytrace(ro, rd);

  if (t.x > -0.5) {
    vec3 pos = ro + rd * t.x;
    vec3 nor = normal(pos);

    color = lighting(pos, nor, ro, rd);
  }

  gl_FragColor.rgb = color;
  gl_FragColor.a   = 1.0;
}
`;

const shaders = Shaders.create({
  sdf: { frag: fragmentCode }
});

export default class Preview extends Component {
  render() {
    return <div>
      <div>Preview</div>

      <Surface width={500} height={500}>
        <Node shader={ shaders.sdf } />
      </Surface>
    </div>;
  }
}

