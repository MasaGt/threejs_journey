import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const galaxyParams = {
  starNum: 100000,
  starSize: 0.01,
  galaxySize: 5,
  branches: 3,
  spin: 3,
  randomness: 0.2,
  randomnessPower: 3,
  insideColor: 0xff0000,
  outsideColor: 0x0000ff,
};

let starGeometry = null;
let starMaterial = null;
let stars = null;

// Galaxy 作成関数
const generateGalaxy = () => {
  // 既存のパーティクル破棄
  if (stars !== null) {
    starGeometry.dispose();
    starMaterial.dispose();
    stars.clear();
    scene.remove(stars);
  }
  // パーティクルの頂点&色情報配列
  const starsVerticies = new Float32Array(galaxyParams.starNum * 3);
  const starsColors = new Float32Array(galaxyParams.starNum * 3);

  const insideColor = new THREE.Color(galaxyParams.insideColor);
  const outsideColor = new THREE.Color(galaxyParams.outsideColor);

  // パーティクルの座標&色設定 (ランダム)
  for (let i = 0; i < galaxyParams.starNum; i++) {
    const i3 = i * 3;
    // starsVerticies[i3 + 0] = (Math.random() - 0.5) * 3;
    // starsVerticies[i3 + 1] = (Math.random() - 0.5) * 3;
    // starsVerticies[i3 + 2] = (Math.random() - 0.5) * 3;

    // const branchAngle =
    //   (i % galaxyParams.branches) * (360 / galaxyParams.branches);
    const branchAngle =
      ((i % galaxyParams.branches) / galaxyParams.branches) * Math.PI * 2;

    const amplitude = Math.random() * galaxyParams.galaxySize;
    const spinAngle = amplitude * galaxyParams.spin;

    const randomX =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      galaxyParams.randomness *
      (Math.random() > 0.5 ? 1 : -1);

    const randomY =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      galaxyParams.randomness *
      (Math.random() > 0.5 ? 1 : -1);

    const randomZ =
      Math.pow(Math.random(), galaxyParams.randomnessPower) *
      galaxyParams.randomness *
      (Math.random() > 0.5 ? 1 : -1);

    // const randomY = (Math.random() - 0.5) * galaxyParams.randomness;
    // const randomZ = (Math.random() - 0.5) * galaxyParams.randomness;

    // 疑問: branchAngle + spinAngle は2piを超えないのか?
    starsVerticies[i3 + 0] =
      Math.cos(branchAngle + spinAngle) * amplitude + randomX;
    starsVerticies[i3 + 1] = 0 + randomY;
    starsVerticies[i3 + 2] =
      Math.sin(branchAngle + spinAngle) * amplitude + randomZ;

    // 色情報の設定
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, amplitude / galaxyParams.galaxySize);
    starsColors[i3 + 0] = mixedColor.r;
    starsColors[i3 + 1] = mixedColor.g;
    starsColors[i3 + 2] = mixedColor.b;
  }

  // パーティクルのジオメトリ作成
  const positionAttribues = new THREE.BufferAttribute(starsVerticies, 3);
  const colorAttribues = new THREE.BufferAttribute(starsColors, 3);

  starGeometry = new THREE.BufferGeometry();
  starGeometry.setAttribute("position", positionAttribues);
  starGeometry.setAttribute("color", colorAttribues);

  // パーティクルのマテリアル作成
  starMaterial = new THREE.PointsMaterial({
    size: galaxyParams.starSize,
    sizeAttenuation: true,
    transparent: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
  });

  // パーティクルメッシュ作成 & シーンへ追加
  stars = new THREE.Points(starGeometry, starMaterial);
  scene.add(stars);
};

generateGalaxy();

/**
 * Galaxy Debug
 */
const galaxyDebug = gui.addFolder("Glaxy").onFinishChange(() => {
  generateGalaxy();
});
galaxyDebug.add(galaxyParams, "starNum").min(100).max(1000000).step(100);
galaxyDebug.add(galaxyParams, "starSize").min(0.001).max(0.1).step(0.001);
galaxyDebug.add(galaxyParams, "galaxySize").min(0.01).max(20).step(0.01);
galaxyDebug.add(galaxyParams, "branches").min(2).max(20).step(1);
galaxyDebug.add(galaxyParams, "spin").min(-5).max(5).step(0.001);
galaxyDebug.add(galaxyParams, "randomness").min(0).max(5).step(0.001);
galaxyDebug.add(galaxyParams, "randomnessPower").min(1).max(10).step(0.001);
galaxyDebug.addColor(galaxyParams, "insideColor");
galaxyDebug.addColor(galaxyParams, "outsideColor");

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.x = 3;
camera.position.y = 3;
camera.position.z = 3;
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Galaxy animation

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
