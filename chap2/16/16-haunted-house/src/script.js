import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Timer } from "three/addons/misc/Timer.js";
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

// AxesHelper
const axesHepler = new THREE.AxesHelper(2);
scene.add(axesHepler);

/**
 * Textures
 */
const textuerLoader = new THREE.TextureLoader();

// Door Textures
const doorColorTexture = textuerLoader.load("./door/color.jpg");
doorColorTexture.colorSpace = THREE.SRGBColorSpace;

// Floor Textures
const floorAlphaTexture = textuerLoader.load("./floor/alpha.jpg");
const floorARMTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_arm_1k.jpg"
);
const floorColorTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_diff_1k.jpg"
);
floorColorTexture.colorSpace = THREE.SRGBColorSpace;
const floorDisplacementTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_disp_1k.jpg"
);
const floorNormalTexture = textuerLoader.load(
  "./floor/coast_sand_rocks_02_arm_1k/coast_sand_rocks_02_nor_gl_1k.jpg"
);

// 繰り返し設定
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
// scene.add(house);

// Walls
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(4, 2.5, 4),
  new THREE.MeshStandardMaterial({ color: 0xff0000 })
);
walls.position.y = 2.5 * 0.5;
// house.add(walls);

// Roof
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, 1.5, 4),
  new THREE.MeshStandardMaterial()
);
roof.rotation.y = Math.PI * 0.25;
roof.position.y = 2.5 + 0.75; //wallsの高さ + 屋根の高さ半分 だけ上に移動させる
// house.add(roof);

// Door
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(2.2, 2.2),
  new THREE.MeshStandardMaterial({ map: doorColorTexture })
);
door.position.z = 2.01; //Z軸において、Walls のほんの少しだけ前に移動させる
// door.position.yを0.1 分下げる理由: doorを完全に地面から出すと、doorテクスチャの下の余白まで映るのでドアが浮いて見える
door.position.y = 1; //doorの高さの半分 - 0.1 だけ上に移動させる
// house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: "pink" });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.position.set(0.8, 0.2, 2.2);
bush1.scale.set(0.5, 0.5, 0.5);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.position.set(1.4, 0.1, 2.1);
bush2.scale.set(0.25, 0.25, 0.25);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.position.set(-0.8, 0.1, 2.1);
bush3.scale.set(0.4, 0.4, 0.4);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.position.set(-1, 0.05, 2.5);
bush4.scale.set(0.15, 0.15, 0.15);

// house.add(bush1, bush2, bush3, bush4);

/**
 * Graves
 */
const graves = new THREE.Group();
scene.add(graves);

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial();
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

  // graves.add(grave);
}

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight("#ffffff", 0.5);
scene.add(ambientLight);

// Directional light
const directionalLight = new THREE.DirectionalLight("#ffffff", 1.5);
directionalLight.position.set(3, 2, -8);
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
 * Animate
 */
const timer = new Timer();

const tick = () => {
  // Timer
  timer.update();
  const elapsedTime = timer.getElapsed();

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();