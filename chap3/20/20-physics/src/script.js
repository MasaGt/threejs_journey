import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new GUI();

const debugObj = {
  createSphere: () => {
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  createBox: () => {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  reset: () => {
    for (const obj of objectsToUpdate) {
      // 物理空間中でのオブジェクトのイベントリスナーの削除
      obj.body.removeEventListener("collide", collisionCheck);

      // 物理空間からオブジェクトの削除
      world.removeBody(obj.body);

      // Scene から オブジェクトの削除
      scene.remove(obj.mesh);
    }
    objectsToUpdate.splice(0, objectsToUpdate.length);
  },
};
gui.add(debugObj, "createSphere");
gui.add(debugObj, "createBox");
gui.add(debugObj, "reset");

/**
 * Base
 */
// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// AxesHelper
scene.add(new THREE.AxesHelper(5));

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
  "/textures/environmentMaps/0/px.png",
  "/textures/environmentMaps/0/nx.png",
  "/textures/environmentMaps/0/py.png",
  "/textures/environmentMaps/0/ny.png",
  "/textures/environmentMaps/0/pz.png",
  "/textures/environmentMaps/0/nz.png",
]);

/**
 * Sound
 */

const hitSound = new Audio("/sounds/hit.mp3");

const playHitSound = () => {
  hitSound.currentTime = 0;
  hitSound.volume = Math.random();
  hitSound.play();
};

/**
 * Physics
 */
// world
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// 当たり判定アルゴリズムの変更
world.broadphase = new CANNON.SAPBroadphase(world);

// Sleep機能の有効化
world.allowSleep = true;

// Materials
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.defaultContactMaterial = defaultContactMaterial;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
floorBody.addShape(floorShape);
world.addBody(floorBody);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 2.1);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const collisionCheck = (event) => {
  const impact = event.contact.getImpactVelocityAlongNormal();
  if (impact > 1.5) {
    playHitSound();
  }
};

// Box
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createBox = (w, h, d, position) => {
  // Three.js Box
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.position.copy(position);
  boxMesh.scale.set(w, h, d);
  boxMesh.castShadow = true;
  scene.add(boxMesh);

  // physics Box
  const boxBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Box(new CANNON.Vec3(w * 0.5, h * 0.5, d * 0.5)),
  });
  boxBody.position.copy(position);
  world.addBody(boxBody);

  // Cannon.js の Box にイベントリスナーを登録する
  boxBody.addEventListener("collide", collisionCheck);

  // add sphereMesh and sphereBoyd to sphere Array to udpdate in each frame
  objectsToUpdate.push({ mesh: boxMesh, body: boxBody });
};

// Sphere
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radisu, position) => {
  // Three.js sphere
  const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
  sphereMesh.position.copy(position);
  sphereMesh.scale.set(radisu, radisu, radisu);
  sphereMesh.castShadow = true;
  scene.add(sphereMesh);

  // physics sphere
  const sphereBody = new CANNON.Body({
    mass: 1,
    shape: new CANNON.Sphere(radisu),
  });
  sphereBody.position.copy(position);
  world.addBody(sphereBody);

  // Cannon.js の Sphere にイベントリスナーを登録する
  sphereBody.addEventListener("collide", collisionCheck);

  // add sphereMesh and sphereBoyd to sphere Array to udpdate in each frame
  objectsToUpdate.push({ mesh: sphereMesh, body: sphereBody });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let previsouTime = 0;

const tick = () => {
  const elapsedTime = clock.getElapsedTime();
  const delta = elapsedTime - previsouTime;
  previsouTime = elapsedTime;

  // Update controls
  controls.update();

  // Update Physics World
  world.step(1 / 60, delta, 3);

  // Update Spheres according to Physics World
  objectsToUpdate.forEach((obj) => {
    obj.mesh.position.copy(obj.body.position);
    obj.mesh.quaternion.copy(obj.body.quaternion);
  });

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
