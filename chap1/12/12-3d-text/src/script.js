import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import { TextGeometry } from "three/addons/geometries/TextGeometry.js";
import { FontLoader } from "three/addons/loaders/FontLoader.js";
import helvetker from "three/examples/fonts/helvetiker_regular.typeface.json";
import dotGothic from "../static/fonts/DotGothic16_Regular.json";

/**
 * Base
 */
// Debug
const gui = new GUI();
const fontGeometryData = {
  size: 0.5,
  depth: 0.1,
  curveSegments: 1,
  bevelEnabled: true,
  bevelSize: 0,
  bevelThickness: 0,
  bevelSegments: 2,
  bevelOffset: 0,
  curveSegments: 1,
};
const char = "Hello Three.js!";

// Canvas
const canvas = document.querySelector("canvas.webgl");

// Scene
const scene = new THREE.Scene();

/**
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper(3);
scene.add(axesHelper);

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const matcapTexture2 = textureLoader.load("./textures/matcaps/2.png");
matcapTexture.colorSpace = THREE.SRGBColorSpace;

/**
 * Fonts
 */
const fontLoader = new FontLoader();
const data = fontLoader.parse(dotGothic);
const fontData = {
  font: data,
};
const textGeomery = new TextGeometry(
  char,
  Object.assign(fontGeometryData, fontData)
);
textGeomery.computeBoundingBox();

/**
 * centering geometry
 */
const moveMeshCenter = (geometry) => {
  geometry.computeBoundingBox();
  const xDist =
    geometry.boundingBox.max.x - Math.abs(geometry.boundingBox.min.x);
  const yDist =
    geometry.boundingBox.max.y - Math.abs(geometry.boundingBox.min.y);
  const zDist =
    geometry.boundingBox.max.z - Math.abs(geometry.boundingBox.min.z);
  geometry.translate(-(xDist / 2), -(yDist / 2), -(zDist / 2));
  console.log(geometry.boundingBox);
  // textGeomery.center();
};

moveMeshCenter(textGeomery);

// const material = new THREE.MeshNormalMaterial();
const material = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
material.side = THREE.DoubleSide;
const mesh = new THREE.Mesh(textGeomery, material);
const box = new THREE.BoxHelper(mesh, 0xffff00);
scene.add(box);
scene.add(mesh);

gui
  .add(fontGeometryData, "size")
  .min(-5)
  .max(5)
  .step(0.0001)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.size = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui
  .add(fontGeometryData, "depth")
  .min(-5)
  .max(5)
  .step(0.01)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.depth = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui
  .add(fontGeometryData, "bevelSize")
  .min(-5)
  .max(5)
  .step(0.0001)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.bevelSize = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui.add(fontGeometryData, "bevelEnabled").onChange((val) => {
  mesh.geometry.dispose();
  fontGeometryData.bevelEnabled = val;
  mesh.geometry = new TextGeometry(
    char,
    Object.assign(fontGeometryData, fontData)
  );
  moveMeshCenter(mesh.geometry);
  box.update();
});

gui
  .add(fontGeometryData, "bevelThickness")
  .min(-5)
  .max(5)
  .step(0.0001)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.bevelThickness = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui
  .add(fontGeometryData, "bevelSegments")
  .min(-10)
  .max(10)
  .step(1)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.bevelSegments = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui
  .add(fontGeometryData, "bevelOffset")
  .min(-10)
  .max(10)
  .step(0.01)
  .onChange((val) => {
    mesh.geometry.dispose();
    fontGeometryData.bevelOffset = val;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

gui
  .add(fontGeometryData, "curveSegments")
  .min(0)
  .max(10)
  .onChange((curveSegments) => {
    mesh.geometry.dispose();
    fontGeometryData.curveSegments = curveSegments;
    mesh.geometry = new TextGeometry(
      char,
      Object.assign(fontGeometryData, fontData)
    );
    moveMeshCenter(mesh.geometry);
    box.update();
  });

const func = {
  center: () => {
    textGeomery.center();
    textGeomery.computeBoundingBox();
    console.log(textGeomery.boundingBox);
    box.update();
  },
};
gui.add(func, "center");

/**
 * Object
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * ExtrudeGeometry
 */
// const shapeObj = {
//   height: 6,
//   width: 4,
// };

// let shape = new THREE.Shape();
// shape.moveTo(0, 0);
// shape.lineTo(0, shapeObj.height);
// shape.lineTo(shapeObj.width, shapeObj.height);
// shape.lineTo(shapeObj.width, 0);
// shape.lineTo(0, 0);

// const extrudeSettings = {
//   steps: 2,
//   depth: 6,
//   bevelEnabled: true,
//   bevelThickness: 1,
//   bevelSize: 1,
//   bevelOffset: 0,
//   bevelSegments: 1,
// };

// const createNewMesh = (val, mesh) => {
//   mesh.geometry.dispose();
//   Object.assign(extrudeSettings, { val });
//   mesh.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
// };

// const createNewShape = (val, mesh) => {
//   mesh.geometry.dispose();
//   Object.assign(shapeObj, { val });
//   shape = new THREE.Shape();
//   shape.moveTo(0, 0);
//   shape.lineTo(0, shapeObj.height);
//   shape.lineTo(shapeObj.width, shapeObj.height);
//   shape.lineTo(shapeObj.width, 0);
//   shape.lineTo(0, 0);
//   mesh.geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
// };

// const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
// const extrudeMaterial = new THREE.MeshBasicMaterial({ color: 0x0000ff });
// const extrudeMesh = new THREE.Mesh(geometry, extrudeMaterial);
// scene.add(extrudeMesh);

// gui
//   .add(shapeObj, "height")
//   .min(-10)
//   .max(10)
//   .onChange((height) => {
//     createNewShape(height, extrudeMesh);
//   });

// gui
//   .add(shapeObj, "width")
//   .min(-10)
//   .max(10)
//   .onChange((width) => {
//     createNewShape(width, extrudeMesh);
//   });

// gui
//   .add(extrudeSettings, "steps")
//   .min(0)
//   .max(10)
//   .step(1)
//   .onChange((steps) => {
//     createNewMesh(steps, extrudeMesh);
//   });

// gui
//   .add(extrudeSettings, "depth")
//   .min(-10)
//   .max(10)
//   .onChange((depth) => {
//     createNewMesh(depth, extrudeMesh);
//   });

// gui.add(extrudeSettings, "bevelEnabled").onChange((bevelEnabled) => {
//   createNewMesh(bevelEnabled, extrudeMesh);
// });

// gui
//   .add(extrudeSettings, "bevelThickness")
//   .min(-10)
//   .max(10)
//   .onChange((bevelThickness) => {
//     createNewMesh(bevelThickness, extrudeMesh);
//   });

// gui
//   .add(extrudeSettings, "bevelSize")
//   .min(-10)
//   .max(10)
//   .onChange((bevelSize) => {
//     createNewMesh(bevelSize, extrudeMesh);
//   });

// gui
//   .add(extrudeSettings, "bevelOffset")
//   .min(-10)
//   .max(10)
//   .onChange((bevelOffset) => {
//     createNewMesh(bevelOffset, extrudeMesh);
//   });

// gui
//   .add(extrudeSettings, "bevelSegments")
//   .min(0)
//   .max(10)
//   .step(1)
//   .onChange((bevelSegments) => {
//     createNewMesh(bevelSegments, extrudeMesh);
//   });

// gui.add(extrudeMaterial, "wireframe");

/**
 * Many Torus Objects
 */
console.time("torus");
const torusMat = new THREE.MeshMatcapMaterial({ matcap: matcapTexture2 });
const torusGeo = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
for (let i = 0; i < 1000; i++) {
  const torusMesh = new THREE.Mesh(torusGeo, torusMat);

  // position
  const x = (Math.random() - 0.5) * 10;
  const y = (Math.random() - 0.5) * 10;
  const z = (Math.random() - 0.5) * 10;
  torusMesh.position.set(x, y, z);

  // rotation
  torusMesh.rotation.x = Math.random() * Math.PI;
  torusMesh.rotation.y = Math.random() * Math.PI;

  // scale
  const scale = Math.random();
  torusMesh.scale.set(scale, scale, scale);
  scene.add(torusMesh);
}
console.timeEnd("torus");
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
  0.00001,
  10000
);
// camera.position.x = 1;
// camera.position.y = 1;
camera.position.x = 0;
camera.position.y = 0;
camera.position.z = 2;
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

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
