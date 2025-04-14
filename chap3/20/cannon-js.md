### Cannon.js とは

- 3D の物理演算ライブラリ

- 現在はメンテナンスされていないが、 Cannon.js を fork した [cannon-es](./cannon-es.md) があるのでそちらを使った方が良い

---

### Cannon.js について

#### ポイント

- Three.js で Scene を作るように、物理円算用の [World](#world) を Cannon.js で作成する

- 物理演算の計算結果を Scene 内のオブジェクトに適用することで、オブジェクト達は物理演算世界の動きに合わせて動くようになる

<br>

#### Cannon.js の重要なコンセプト

<img src="./img/CannonJS_1.png" />

<br>

- ##### World

    - 物理演算用の空間。この空間に Cannon.js で物体を作成し、動きをシミュレートする

    - Cannon.js の World ≒ Three.js の Scene

    - World.gravity プロパティに x,y,z軸への重力を設定することで、その物理演算空間内に重力を適用することができる

        - 地球の重力は 9.80665 m/s2 らしい = y軸方向に -9.8 を設定すれば地球の重力と同じ感じの物理演算ができるっぽい

    <br>

    ```js
    import CANNON from "cannon";

    // 物理演算空間の作成
    const world = new CANNON.world();

    // 物理演算空間の x, y, z 軸方向への重力
    world.gravity.set(0, -9.82, 0);
    ```

<br>

- ##### Shape

    - Cannon.js の Shape ≒ Three.js の Geometry

    - Shape には Sphere や Plane、 Box などがある

        - ★★★Cannon.js の **Shape** と Three.js の Scene 内の **Geometry** は**形状、大きさを揃える必要がある**★★★

        <br>

        - 球体を扱いたい場合は Three.js の SphereGeometry と Cannon.js の Shpere の radius を同じにする

        <br>

        - ボックスを扱いたい場合は、Three.js の BoxGeometry の幅、高さ、奥行き の半分の値を Cannon.js の Box に指定する必要がある

            - `new THREE.BoxGeometry(高さ, 幅, 奥行き) = new CANNON.Box(new CANNON.Vec3(高さ * 0.5, 幅 * 0.5, 奥行き * 0.5))`
        
        <br>

        - ★Plane の扱いには注意

            - Cannon.js の Plane はサイズの指定はなく、**無限に広がる平面**

    <br>

    ```js
    import * as THREE from "three";
    import CANNON from "cannon";

    /**
     * 球体を作成
     */
    const sphereRadius = 0.5;

    // Cannon.js の球体
    // Sphere コンストラクターは引数に radius を受け取る (radius を揃える必要がある)
    const sphereShape = new CANNON.Sphere(sphereRadius);

    // Three.js の球体
    // radius を揃える必要がある
    const shpereGeometry = new THREE.SphereGeometry(sphereRadius, 20, 20);


    /**
     * Box を作成
     */
    const boxSize = {
        width: 2,
        height: 2,
        depth: 2,
    };

    // Cannon.js の Box
    // Three.js の BoxGeometry のサイズの半分を指定する
    const boxShape = new CANNON.Box(
        new CANNON.Vec3(boxSize.width / 2, boxSize.height / 2, boxSize.depth / 2)
    );

    // Three.js の Box
    const boxGeometry = new THREE.BoxGeometry(boxSize.width, boxSize.height, boxSize.depth);


    /**
     * Plane の作成
     */
    const planeSize = {
        width: 10,
        height: 10,
    };
    // Cannon.js の Plane
    const planeShape =  new CANNON.Plane();

    // Three.js の Plane
    new THREE.PlaneGeometry(planeSize.width, planeSize.height);
    ```

<br>

- ##### Body

    - Cannon.js の Body ≒ Three.js の Mesh

    - Body は Shape や Material (Material は省略可能) から構成される

    - Body に Shape などを指定し、**作成した Body を World に追加することでその物体の物理演算をシミュレートすることができる**

        <img src="./img/CannonJS_2.png" />

    <br>

    ```js
    import CANNON from "cannon";

    /**
     *  物理演算空間の作成
     */
    const world = new CANNON.world();
    // 物理演算空間の x, y, z 軸方向への重力
    world.gravity.set(0, -9.82, 0);

    /**
     * Shape の作成
     */
    const sphereRadius = 0.5;
    // Cannon.js の球体
    const sphereShape = new CANNON.Sphere(sphereRadius);

    /**
     * ★Body の作成
     */
    const sphereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 2, 0),
        shape: sphereShape, // ★★ 作成した Shape を元に Body を作成
    });

    // ★★★Body を物理演算空間に追加
    // 裏で高さ2(y = 2)から　重力-9.82 で落下する球体のシミュレーションが行われる
    world.addBody(sphereBody);
    ```

<br>

- ##### Vec3
    
    - Cannon.js の Vec3 ≒ Three.jsの Vector3

    - 物理演算空間でのポジションなどは Vec3 を使って設定していく

    - Three.js の Vector3 と Cannon.js の Vec3 は互換性があるっぽい

    <br>

    ```js
    import CANNON from "cannon";

    const position = {
        x: 0,
        y: 0,
        z: 0
    };

    // Cannon.js の Shpere
    const shpereBody = new CANNON.Body({
        mass: 1,
        position: new CANNON.Vec3(0, 0, 0),
        shape: new CANNON.Shpere(1),
    });

    // Three.js のShpere
    const shpereGeometry = new THREE.ShpereGeometry(1, 20, 20);
    
    // ★★★Vector3 を指定するプロパティに Vec3 型のデータを渡しても大丈夫★★★
    shpereGeometry.position.copy(shpereBody.position);
    ```

<br>

- ##### Material

    - 摩擦や反発（弾性）などの物理的なプロパティをシミュレートするためのオブジェクト

    - 詳しくは[こちら](./オブジェクト同士の接触のシミュレーション.md)を参照

<br>

- ##### ContactMaterial

    - マテリアルが同士が接触した場合の摩擦や反発（弾性）などの物理的なプロパティをシミュレートするためのオブジェクト

    - 詳しくは[こちら](./オブジェクト同士の接触のシミュレーション.md)を参照

<br>
<br>

参考サイト

[Three.js備忘録（６）](https://koro-koro.com/threejs-no6/)

---

### 基本的な使い方

1. World をインスタンス化し、物理演算空間を作成する

2. Shape を元に Bodyを作成し、 World に追加する

    - この時に、Three.js の対応するオブジェクトと同じサイズ、位置に合わせる必要がある

3. `World.step()` で物理演算空間を更新 (=計算) する

    - ★★★ 物理空間の計算結果を Three.js オブジェクトに反映しないと意味ないことに注意

    - requestAnimationFrame などを利用して、各フレームのレンダリング前に、 World.step() で物理空間の状況を更新 (= 計算) するのが通例

    - World.step() は以下の引数を受け取る

        - timeStep (必須): 指定した時間ステップ（秒単位）で物理エンジンを更新します

        - timeSinceLastCalled (オプショナル): 前回この関数が呼び出されてからの経過時間（秒）を表す。この値が大きいと、早く動く。通常はフレーム間のデルタタイムを指定すると良い

        - maxSubSteps (オプショナル): この関数が一度に取ることができる最大のサブステップ（計算ステップ）の数。シミュレーションが遅れている場合に、シミュレーションを追いつかせるために使用される。この値が大きいほど計算の精度は高くなるが、パフォーマンスに影響を与える可能性がある。 0 を指定すると無制限にサブステップを取るので注意

<br>

```js
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import GUI from "lil-gui";
import CANNON from "cannon";

/**
 * Debug
 */
const gui = new GUI();

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
 * Physics
 */

// ★★★　1. 物理演算空間の作成　★★★
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

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

// ★★★ 2. Body の作成 ★★★
const sphereShape = new CANNON.Sphere(0.5);
const sphereBody = new CANNON.Body({
  mass: 1,
  position: new CANNON.Vec3(0, 3, 0),
  shape: sphereShape,
});
world.addBody(sphereBody);

const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI * 0.5);
floorBody.addShape(floorShape);
world.addBody(floorBody);

/**
 * Test sphere
 */
const sphere = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 32, 32),
  new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
    envMapIntensity: 0.5,
  })
);
sphere.castShadow = true;
sphere.position.y = 0.5;
scene.add(sphere);

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

  //  ★★★ 3. World.step() で物理演算の世界を更新する ★★★
  world.step(1 / 60, delta, 3);

  // ★★★ 物理空間の計算結果を Three.js のオブジェクトに反映 ★★★
  sphere.position.copy(sphereBody.position);

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
```

---

### CannonCannon.js でのオブジェクト (Body) の回転

- Cannon.js では オブジェクト (Body) を回転させるには quaternion を使う

- `Body.quaternion.setFromAxisAngle()` で回転軸 (Vec3) と回転角 (Number) を指定して回転させることができる

- `Body.quaternion.setFromEuler()` でオイラー角を指定して回転させることもできる

    - オイラー角: x 軸を中心にした回転角、y 軸を中心にした回転角、z 軸を中心にした回転角をぞれぞれ表したもの (詳しくは[こちら](../../chap1/04/オブジェクトのアニメーション.md)を参照)

```js
const boxBody = new CANNON.Box(1, 1, 1);
/**
 *  Body の回転
 */

// x軸を中心に180°回転
boxBody.quaternion.setFromAxisAngle(new CANNON.Vec(1, 0, 0), -Math.PI/2);

//こちらの方法でも回転させることができる
boxBody.quaternion.setFromEuler(-Math.PI/2, 0, 0);
```

<br>

#### Three.js でのオブジェクト (Object3D) の回転

- 実は、Three.js のオブジェクトも同様の方法 (quaternion) で回転させることができる

    - `Object3D.setRotationFromAxisAngle()`

        - 第一引数: Vector3 型 の回転軸

        - 第二引数: Float 型 の回転角 (ラジアン)

    <br>

    - `Object3D.setRotationFromEuler()`

        - 第一引数: Euler 型 のオイラー角


<br>

```js
// Plane オブジェクトの作成
const planeGeometry = new THREE.PlaneGeometry(5, 5);
const planeMaterial = new THREE.new THREE.MeshBasicdMaterial({color: "#ff0000"});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);


// Plane オブジェクトの回転 (以下の3つとも同じ回転結果になる)
plane.rotation.x = -Math.PI / 2; // rotation.x に回転角を指定する方法
plane.setRotationFromAxisAngle(new THREE.Vector3(-1, 0, 0), Math.PI / 2); // 回転軸と回転角を指定する方法
plane.setRotationFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0)); // オイラー角を指定する方法
```