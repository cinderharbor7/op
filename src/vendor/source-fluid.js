import * as THREE from 'three';import shader from './sculpture-shader.json';import {visualParameters} from './data.js';
export function createFluidMesh(coin, sentiment) {
  const params = visualParameters(coin, sentiment);
  const uniforms = Object.fromEntries(
    shader.uniforms.map((uniform) => {
      const value = Array.isArray(uniform.value)
        ? new THREE[`Vector${uniform.value.length}`](...uniform.value)
        : uniform.value;
      return [uniform.name, { value }];
    }),
  );
  uniforms._scale.value = 1.5;
  uniforms.opacity.value = 1;
  uniforms.mouse.value.set(0, 0, 0);
  uniforms.warp.value = params.roughness;
  uniforms.mood.value = params.mood;
  uniforms.seed.value = params.seed;
  const material = new THREE.ShaderMaterial({
    uniforms,
    vertexShader: shader.vertexShader,
    fragmentShader: shader.fragmentShader,
    transparent: true,
    side: THREE.BackSide,
  });
  material.extensions.fragDepth = false;
  return new THREE.Mesh(new THREE.SphereGeometry(1.5, 8, 8), material);
}