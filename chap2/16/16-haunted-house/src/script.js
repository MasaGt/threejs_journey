import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
import GUI from "lil-gui";
import { Sky } from "three/addons/objects/Sky.js";

/**
 * Base
 */
// Debug
const gui = new GUI();

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

// AxesHelper
const axesHepler = new THREE.AxesHelper(2);
scene.add(axesHepler);

/**
 * Textures
 */
const textuerLoader = new THREE.TextureLoader();

// Door Textures
const doorAlphaTexture = textuerLoader.load("./door/alpha.webp");
const doorAOTextuer = textuerLoader.load("./door/ambientOcclusion.webp");
const doorColorTexture = textuerLoader.load("./door/color.webp");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;
const doorHeightTexture = textuerLoader.load("./door/height.webp");
const doorMetalnessTexture = textuerLoader.load("./door/metalness.webp");
const doorNormalTexture = textuerLoader.load("./door/normal.webp");
const doorRoughnessTexture = textuerLoader.load("./door/roughness.webp");

// Floor Textures
const floorAlphaTexture = textuerLoader.load("./floor/alpha.webp");
const floorARMTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_arm_1k.webp"
);
const floorColorTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_diff_1k.webp"
);
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorDisplacementTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_disp_1k.webp"
);
const floorNormalTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_nor_gl_1k.webp"
);

// 繰り返し設定 (Floor Textures)
floorARMTexture.wrapS = THREE.RepeatWrapping;
floorARMTexture.wrapT = THREE.RepeatWrapping;
floorARMTexture.repeat.x = 8;
floorARMTexture.repeat.y = 8;
floorColorTexture.wrapS = THREE.RepeatWrapping;
floorColorTexture.wrapT = THREE.RepeatWrapping;
floorColorTexture.repeat.x = 8;
floorColorTexture.repeat.y = 8;
floorDisplacementTexture.wrapS = THREE.RepeatWrapping;
floorDisplacementTexture.wrapT = THREE.RepeatWrapping;
floorDisplacementTexture.repeat.x = 8;
floorDisplacementTexture.repeat.y = 8;
floorNormalTexture.wrapS = THREE.RepeatWrapping;
floorNormalTexture.wrapT = THREE.RepeatWrapping;
floorNormalTexture.repeat.x = 8;
floorNormalTexture.repeat.y = 8;

// Wall Textures
const wallARMTexture = textuerLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_arm_1k.webp"
);
const wallColorTexture = textuerLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_diff_1k.webp"
);
wallColorTexture.colorSpace = THREE.SRGBColorSpace;

const wallNormalTexture = textuerLoader.load(
  "./wall/castle_brick_broken_06_1k/castle_brick_broken_06_nor_gl_1k.webp"
);

// Roof Textures
const roofColorTexture = textuerLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_diff_1k.webp"
);
roofColorTexture.colorSpace = THREE.SRGBColorSpace;

const roofARMTexture = textuerLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_arm_1k.webp"
);
const roofNormalTexture = textuerLoader.load(
  "./roof/roof_slates_02_1k/roof_slates_02_nor_gl_1k.webp"
);

// 繰り返し設定(Roof Textures)
roofColorTexture.wrapS = THREE.RepeatWrapping;
roofColorTexture.repeat.x = 3;
roofARMTexture.wrapS = THREE.RepeatWrapping;
roofARMTexture.repeat.x = 3;
roofNormalTexture.wrapS = THREE.RepeatWrapping;
roofNormalTexture.repeat.x = 3;

// Bush Textures
const bushColorTexture = textuerLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_diff_1k.webp"
);
bushColorTexture.colorSpace = THREE.SRGBColorSpace;

const bushARMTexture = textuerLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_arm_1k.webp"
);

const bushNormalTexture = textuerLoader.load(
  "./bush/leaves_forest_ground_1k/leaves_forest_ground_nor_gl_1k.webp"
);

// Grave Textures
const graveColorTexture = textuerLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_diff_1k.webp"
);
graveColorTexture.colorSpace = THREE.SRGBColorSpace;

const graveARMTexture = textuerLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_arm_1k.webp"
);

const graveNormalTexture = textuerLoader.load(
  "./grave/plastered_stone_wall_1k/plastered_stone_wall_nor_gl_1k.webp"
);

// 繰り返し設定 (Grave Textures)
graveColorTexture.wrapS = THREE.RepeatWrapping;
graveColorTexture.wrapT = THREE.RepeatWrapping;
graveColorTexture.repeat.set(0.3, 0.4);
graveARMTexture.wrapS = THREE.RepeatWrapping;
graveARMTexture.wrapT = THREE.RepeatWrapping;
graveARMTexture.repeat.set(0.3, 0.4);
graveNormalTexture.wrapS = THREE.RepeatWrapping;
graveNormalTexture.wrapT = THREE.RepeatWrapping;
graveNormalTexture.repeat.set(0.3, 0.4);

/**
 * House
 */
// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(20, 20, 100, 100),
  new THREE.MeshStandardMaterial({
    map: floorColorTexture,
    transparent: true,
    alphaMap: floorAlphaTexture,
    displacementMap: floorDisplacementTexture,
    displacementScale: 0.3,
    displacementBias: -0.25,
    normalMap: floorNormalTexture,
    aoMap: floorARMTexture,
    roughnessMap: floorARMTexture,
    metalnessMap: floorARMTexture,
  })
);
floor.rotation.x = -(Math.PI * 0.5);
scene.add(floor);

// Displacement Bias Debug
const floorDebug = gui.addFolder("Floor");
floorDebug.add(floor.material, "displacementBias").min(-5).max(5).step(0.01);

// House
const house = new THREE.Group();
scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({
    map: wallColorTexture,
    aoMap: wallARMTexture,
    roughnessMap: wallARMTexture,
    metalnessMap: wallARMTexture,
    normalMap: wallNormalTexture,
  })
);
walls.position.y = 2.5 * 0.5;
house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial({
    map: roofColorTexture,
    aoMap: roofARMTexture,
    roughnessMap: roofARMTexture,
    metalnessMap: roofARMTexture,
    normalMap: roofNormalTexture,
  })
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.75; //wallsの高さ + 屋根の高さ半分 だけ上に移動させる
house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    aoMap: doorAOTextuer,
    roughnessMap: doorRoughnessTexture,
    metalnessMap: doorMetalnessTexture,
    normalMap: doorNormalTexture,
    alphaMap: doorAlphaTexture,
    transparent: true,
    displacementMap: doorHeightTexture,
    displacementScale: 0.2,
    displacementBias: -0.04,
  })
);
door.position.z = 2.01; //Z軸において、Walls のほんの少しだけ前に移動させる
// door.position.yを0.1 分下げる理由: doorを完全に地面から出すと、doorテクスチャの下の余白まで映るのでドアが浮いて見える
door.position.y = 1; //doorの高さの半分 - 0.1 だけ上に移動させる
house.add(door);

// Displacement Debug for Door
const doorDebug = gui.addFolder("Door");
doorDebug.add(door.material, "displacementScale").min(-5).max(5).step(0.01);
doorDebug.add(door.material, "displacementBias").min(-5).max(5).step(0.01);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({
  color: 0xccffcc,
  map: bushColorTexture,
  aoMap: bushARMTexture,
  roughnessMap: bushARMTexture,
  metalnessMap: bushARMTexture,
  normalMap: bushNormalTexture,
});

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.rotation.x = -0.75;

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.rotation.x = -0.75;

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.1);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.rotation.x = -0.75;

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.5);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.rotation.x = -0.75;

house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({
  map: graveColorTexture,
  aoMap: graveARMTexture,
  roughnessMap: graveARMTexture,
  metalnessMap: graveARMTexture,
  normalMap: graveNormalTexture,
});
for (let i = 0; i < 30; i++) {
  const grave = new THREE.Mesh(graveGeometry, graveMaterial);

  // x & z position
  const angle = Math.PI * 2 * Math.random();
  const expansion = Math.random() * 4 + 3;
  const positionX = Math.sin(angle) * expansion;
  const positionZ = Math.cos(angle) * expansion;

  // y position
  const positionY = Math.random() * 0.4;
  grave.position.set(positionX, positionY, positionZ);

  // rotation
  grave.rotation.x = (Math.random() - 0.5) * 0.4;
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;

  graves.add(grave);
}

/**
 * Sky
 */
const sky = new Sky();
sky.material.uniforms["turbidity"].value = 10;
sky.material.uniforms["rayleigh"].value = 3;
sky.material.uniforms["mieCoefficient"].value = 0.1;
sky.material.uniforms["mieDirectionalG"].value = 0.95;
sky.material.uniforms["sunPosition"].value.set(0.3, -0.038, -0.95);
sky.scale.set(100, 100, 100);
scene.add(sky);

/**
 * Lights
 */
// Ambient light
const lightConfig = {
  colorMoonLight: 0x86cdff,
  colorDoorLight: 0xff7d46,
  ambientLightIntensity: 0.275,
  directionalLigtIntensity: 1,
  pointLightIntensity: 5,
};

const ambientLight = new THREE.AmbientLight(
  lightConfig.colorMoonLight,
  lightConfig.ambientLightIntensity
);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight(
  lightConfig.colorMoonLight,
  lightConfig.directionalLigtIntensity
);
directionalLight.position.set(3, 2, -8);
scene.add(directionalLight);

// Directional Light Camera Helper
const directionalLightCameraHelper = new THREE.CameraHelper(
  directionalLight.shadow.camera
);
directionalLightCameraHelper.visible = false;
scene.add(directionalLightCameraHelper);

// Directional Light Camera Debug
const updateDiretionalLightCamera = () => {
  directionalLight.shadow.camera.updateProjectionMatrix();
  directionalLightCameraHelper.update();
};
const directionalLightCameraDebug = gui.addFolder("Directional Light Camera");
directionalLightCameraDebug.add(directionalLightCameraHelper, "visible");
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "far")
  .min(0)
  .max(500)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "near")
  .min(-10)
  .max(100)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "left")
  .min(-20)
  .max(0)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "right")
  .min(0)
  .max(20)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "bottom")
  .min(-20)
  .max(0)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });
directionalLightCameraDebug
  .add(directionalLight.shadow.camera, "top")
  .min(0)
  .max(20)
  .step(0.1)
  .onChange(() => {
    updateDiretionalLightCamera();
  });

// Point Light
const pointLight = new THREE.PointLight(
  lightConfig.colorDoorLight,
  lightConfig.pointLightIntensity
);
pointLight.position.y = 2.2;
pointLight.position.z = 2.5;
house.add(pointLight);

// Point Light Helper
const sphereSize = 1;
const pointLightHelper = new THREE.PointLightHelper(pointLight, sphereSize);
house.add(pointLightHelper);
pointLightHelper.visible = false;

// Point Light Debug
const pointLightDebug = gui.addFolder("Door Point Light");
pointLightDebug
  .add(pointLight.position, "x")
  .min(-10)
  .max(10)
  .onChange(() => {
    pointLightHelper.update();
  });
pointLightDebug
  .add(pointLight.position, "y")
  .min(-10)
  .max(10)
  .onChange(() => {
    pointLightHelper.update();
  });
pointLightDebug
  .add(pointLight.position, "z")
  .min(-10)
  .max(10)
  .onChange(() => {
    pointLightHelper.update();
  });
pointLightDebug.add(pointLightHelper, "visible");

/**
 * Ghosts
 */

//ゴーストライトの位置
const ghostConfig = {
  ghost1Color: 0x8800ff,
  ghost2Color: 0xff0088,
  ghost3Color: 0xff0000,
  ghostLightIntensity: 6,
  ghost1Radius: 4,
  ghost2Radius: 5,
  ghost3Radius: 6,
  ghost1Speed: 0.5,
  ghost2Speed: 0.38,
  ghost3Speed: 0.23,
  ghostYRandomness1: 2.34,
  ghostYRandomness2: 3.45,
};
const ghost1 = new THREE.PointLight(
  ghostConfig.ghost1Color,
  ghostConfig.ghostLightIntensity
);

const ghost2 = new THREE.PointLight(
  ghostConfig.ghost2Color,
  ghostConfig.ghostLightIntensity
);

const ghost3 = new THREE.PointLight(
  ghostConfig.ghost3Color,
  ghostConfig.ghostLightIntensity
);

scene.add(ghost1, ghost2, ghost3);

// ゴーストライトのライトカメラのデバッグ
const updateGhostLightCamera = () => {
  ghost1.shadow.camera.updateProjectionMatrix();
  ghost1LightCameraHelper.update();
  ghost2.shadow.camera.updateProjectionMatrix();
  ghost2LightCameraHelper.update();
  ghost3.shadow.camera.updateProjectionMatrix();
  ghost3LightCameraHelper.update();
};
const ghost1LightCameraHelper = new THREE.CameraHelper(ghost1.shadow.camera);
scene.add(ghost1LightCameraHelper);
const ghost2LightCameraHelper = new THREE.CameraHelper(ghost2.shadow.camera);
scene.add(ghost2LightCameraHelper);
const ghost3LightCameraHelper = new THREE.CameraHelper(ghost3.shadow.camera);
scene.add(ghost3LightCameraHelper);
ghost1LightCameraHelper.visible = false;
ghost2LightCameraHelper.visible = false;
ghost3LightCameraHelper.visible = false;

const ghostLightCameraDebug = gui.addFolder("Ghost Lights");
ghostLightCameraDebug.add(ghost1LightCameraHelper, "visible");
ghostLightCameraDebug
  .add(ghost1.shadow.camera, "near")
  .min(0)
  .max(20)
  .onChange((val) => {
    ghost2.shadow.camera.near = val;
    ghost3.shadow.camera.near = val;
    updateGhostLightCamera();
  });
ghostLightCameraDebug
  .add(ghost1.shadow.camera, "far")
  .min(0)
  .max(500)
  .onChange((val) => {
    ghost2.shadow.camera.far = val;
    ghost3.shadow.camera.far = val;
    updateGhostLightCamera();
  });

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
 * Shadows
 */
// Renderer
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

// Lights
directionalLight.castShadow = true;
ghost1.castShadow = true;
ghost2.castShadow = true;
ghost3.castShadow = true;

// Objects
roof.castShadow = true;
walls.castShadow = true;
floor.receiveShadow = true;
graves.children.forEach((grave) => {
  grave.castShadow = true;
});

/**
 * Shadow Optimization
 */
// Diretioanl Light ShadowMap Size
directionalLight.shadow.mapSize.set(256, 256);
// Diretional Light Camera
directionalLight.shadow.camera.near = 1;
directionalLight.shadow.camera.far = 20;
directionalLight.shadow.camera.left = -8;
directionalLight.shadow.camera.right = 8;
directionalLight.shadow.camera.bottom = -8;
directionalLight.shadow.camera.top = 8;
// Update Diretional Light Camera Debug
const diretionalLightCameraDebugs = directionalLightCameraDebug.controllers;
diretionalLightCameraDebugs.forEach((debug) => {
  debug.updateDisplay();
});
updateDiretionalLightCamera();

// Ghost Light ShadowMap Size
ghost1.shadow.mapSize.set(256, 256);
ghost2.shadow.mapSize.set(256, 256);
ghost3.shadow.mapSize.set(256, 256);
// Ghost Light Camera
ghost1.shadow.camera.far = 10;
ghost2.shadow.camera.far = 10;
ghost3.shadow.camera.far = 10;
// Update Ghost Light Camera Debug
const ghostLightCameraDebugs = ghostLightCameraDebug.controllers;
ghostLightCameraDebugs.forEach((debug) => {
  debug.updateDisplay();
});
updateGhostLightCamera();

/**
 * Fog
 */
const fogColor = 0x04343f;
// scene.fog = new THREE.Fog(fogColor, 2, 6);

// Fog Debug
// const fogDebug = gui.addFolder("Fog");
// fogDebug.add(scene.fog, "near").min(-2).max(10).step(0.1);
// fogDebug.add(scene.fog, "far").min(-2).max(1000).step(0.1);

/**
 * FogExp2
 */
scene.fog = new THREE.FogExp2(fogColor, 0.1);
const fogExp2Debug = gui.addFolder("FogExp2");
fogExp2Debug.add(scene.fog, "density").min(-1).max(10).step(0.1);

/**
 * GUI
 */
//Close all the tabs (folders)
gui.folders.forEach((folder) => {
  folder.close();
});

/**
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Ghost move
  const ghost1Angle = elapsedTime * ghostConfig.ghost1Speed;
  ghost1.position.x = Math.cos(ghost1Angle) * ghostConfig.ghost1Radius;
  ghost1.position.z = Math.sin(ghost1Angle) * ghostConfig.ghost1Radius;
  ghost1.position.y =
    Math.sin(ghost1Angle) *
    Math.sin(ghost1Angle * ghostConfig.ghostYRandomness1) *
    Math.sin(ghost1Angle * ghostConfig.ghostYRandomness2);

  const ghost2Angle = -(elapsedTime * ghostConfig.ghost2Speed);
  ghost2.position.x = Math.cos(ghost2Angle) * ghostConfig.ghost2Radius;
  ghost2.position.z = Math.sin(ghost2Angle) * ghostConfig.ghost2Radius;
  ghost2.position.y =
    Math.sin(ghost2Angle) *
    Math.sin(ghost2Angle * ghostConfig.ghostYRandomness1) *
    Math.sin(ghost2Angle * ghostConfig.ghostYRandomness2);

  const ghost3Angle = elapsedTime * ghostConfig.ghost3Speed;
  ghost3.position.x = Math.cos(ghost3Angle) * ghostConfig.ghost3Radius;
  ghost3.position.z = Math.sin(ghost3Angle) * ghostConfig.ghost3Radius;
  ghost3.position.y =
    Math.sin(ghost3Angle) *
    Math.sin(ghost3Angle * ghostConfig.ghostYRandomness1) *
    Math.sin(ghost3Angle * ghostConfig.ghostYRandomness2);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
