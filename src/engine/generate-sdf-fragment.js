export default ({ model, inject = '' }) => `
precision highp float;

uniform float width;
uniform float height;

uniform float camRotation;
uniform float camHeight;
uniform float camDist;

const int SDF_STEPS = 100;

// INJECTED

${inject.join('\n')}

// MODEL

vec2 doModel(vec3 p) {
  return vec2(${model}, 0.0);
}

// HELPERS

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
  return calcRayIntersection(rayOrigin, rayDir, 100.0, 0.0001);
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

  float PI = 3.1415;

  rayOrigin = vec3(
    camDistance * sin(camAngle * PI / 360.0) * cos(camHeight * PI / 360.0),
    camDistance * sin(camHeight * PI / 360.0),
    camDistance * cos(camAngle * PI / 360.0) * cos(camHeight * PI / 360.0)
  );

  rayDirection = getRay(rayOrigin, rayTarget, screenPos, 2.0);
}

vec3 lighting(vec3 pos, vec3 nor, vec3 ro, vec3 rd) {
  vec3 dir = normalize(vec3(-10.0, 10.0, 10.0));
  vec3 col = vec3(1.00);
  vec3 dif = col * max(0.0, dot(dir, nor));

  vec3 ambient = vec3(0.1);

  return dif + ambient;
}

void main () {
  vec3 color = vec3(0.0);
  vec3 ro, rd;

  orbitCamera(camRotation, camHeight, camDist, vec2(width, height), ro, rd);

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
