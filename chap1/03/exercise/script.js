import * as THREE from "three";

// 描画領域
const canvas = document.querySelector("canvas.webgl");
console.log(canvas);

// Sceneの作成
const scene = new THREE.Scene();

// オブジェクト(Mesh)の作成
const geo = new THREE.BoxGeometry(1.0, 1.0, 1.0);
const mat = new THREE.MeshBasicMaterial({ color: 0xff0000, wireframe: true });
const mesh = new THREE.Mesh(geo, mat);

// シーンに追加
scene.add(mesh);

// カメラの作成
const sizes = {
  width: 800,
  height: 600,
};
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  1,
  10000
);
camera.position.z = 3;
camera.position.y = 1;
camera.position.x = 1;
// scene.add(camera);

// レンダラーの作成
const renderer = new THREE.WebGLRenderer({ canvas: canvas });
renderer.setSize(sizes.width, sizes.height);
renderer.render(scene, camera);
