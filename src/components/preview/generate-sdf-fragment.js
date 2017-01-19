export default function generateSDFFragment(doModel) {
  return `
    precision highp float;

    uniform float width;
    uniform float height;

    const int SDF_STEPS = 50;

    // DEFS

    float sdBox(vec3 p, vec3 b) {
      vec3 d = abs(p) - b;
      return min(max(d.x, max(d.y, d.z)), 0.0) + length(max(d, 0.0));
    }

    float sdSphere(vec3 p, float s) {
      return length(p) - s;
    }

    float sdCone(vec3 p, vec3 c) {
      vec2 q = vec2(length(p.xz), p.y);
      float d1 = -p.y - c.z;
      float d2 = max(dot(q, c.xy), p.y);

      return length(max(vec2(d1, d2), 0.0)) + min(max(d1, d2), 0.);
    }

    float sdCapsule(vec3 p, vec3 a, vec3 b, float r) {
      vec3 pa = p - a;
      vec3 ba = b - a;

      float h = clamp(dot(pa, ba) / dot(ba, ba), 0.0, 1.0);

      return length(pa - ba * h) - r;
    }

    float sdCylinder(vec3 p, float r, float h) {
      vec2 d = abs(vec2(length(p.xz), p.y)) - vec2(r, h);

      return min(max(d.x, d.y), 0.0) + length(max(d, 0.0));
    }

    float sdHex(vec3 p, float r, float h) {
      vec3 q = abs(p);

      return max(q.z - h, max((q.x * 0.866025 + q.y * 0.5), q.y) - r);
    }

    float sdTorus(vec3 p, float r, float d) {
      vec2 q = vec2(length(p.xz) - r, p.y);

      return length(q) - d;
    }

    float sdTriangle(vec3 p, float r, float d) {
      vec3 q = abs(p);
      return max(q.z - d, max(q.x * 0.866025 + p.y * 0.5, -p.y) - r * 0.5);
    }

    // MODEL

    vec2 doModel(vec3 p) {
      return vec2(${doModel}, 0.0);
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
      vec3 dir = normalize(vec3(-15.0, 15.0, 15.0));
      vec3 col = vec3(0.92);
      vec3 dif = col * max(0.0, dot(dir, nor));

      vec3 ambient = vec3(0.06);

      return dif + ambient;
    }

    void main () {
      vec3 color = vec3(0.0);
      vec3 ro, rd;

      float camRotation = -3.1415 / 4.0;
      float camHeight   = 3.0;
      float camDist     = 3.0;

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
};
