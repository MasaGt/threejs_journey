### Material とは

- Material
    - 表面の物理的な特性を定義する
        - 光の反射や吸収、色の散乱など

- Textures
    - 表面の見た目を定義する

---

### MeshBasicMaterial

- ライティングを考慮しないマテリアル

- 陰がつかないので均一な塗りつぶした状態になる

<br>

#### プロパティ

- map
    - [ColorMap](../10/Textures.md#color-albedo) に利用するテクスチャ画像を指定するプロパティ


<br>

- color

    - マテリアル全体に適用する色を指定するプロパティ


    - MeshBasicMaterial のコンストラクタで指定する場合
        - 'red' などの色名で指定できる
        - '#000000' などのカラーコードで指定できる
        - 0x000000 などの16進数で指定できる

    ```js
    // 色名で指定
    const redMaterial = new THREE.MeshBasicMaterial({color: "red"});

    // カラーコードで指定
    const greenMaterial = new THREE.MeshBasicMaterial({color: "#00ff00"});

    // 16進数で指定
    const blueMaterial = new THREE.MeshBasicMaterial({color: 0x0000ff});
    ```

    - MeshBasicMaterial インスタンスのプロパティで指定する場合
        - Three.js の Color クラスを作成する必要がある
            - Color クラスのコンストラクターズ引数には、"red" や "#00ff00", 0x0000ff などの方法で色の指定が可能

    ```js
    const material = new THREE.MeshBasicMaterial();

    // red
    material.color = new THREE.Color("red");

    // green
    material.color = new THREE.Color("#00ff00");

    // blue
    material.color = new THREE.Color(0x0000ff);
    ```

<br>

- map と color を両方設定したら

    - map に指定したテクスチャーを color 色にする

    ```js
    const material = new THREE.MeshBasicMaterial({ map: colorTexture, color: "#ff0000"});
    ```

    <img src="./img/MeshBasicMaterial_1.png" />

<br>

- wireframe
    - オブジェクトの輪郭を表現する頂点と線分のみを表示するプロパティ

<br>

- transparent と opacity
    - *両方を指定しないと機能しない

    - transparent
        - 透過を有効にする
        - bool 値で指定する

    - opacity
        - 透過度を指定する
        - 0 ~ 1.0 の間で指定する (0 は完全に透明、 1.0は完全に不透明)

    ```js
    const material = new THREE.MeshBasicMaterial({color: "#ff0000"});
    
    material.transparent = true;
    material.opacity = 0.5;
    ```

    <img src="./img/MeshBasicMaterial_2.png" />

<br>

- alphaMap

    - *alphaMap を利用する際も transparent プロパティに true を設定する必要がある

    - [alpha テクスチャマッピング](../10/Textures.md#aplpha)に利用するテクスチャ画像を指定する

    ```js
    const material = new THREE.MeshBasicMaterial();

    material.map = colorTexture;
    material.transparent = true;
    material.alphaMap = alphaTexture;
    ```

    <img src="./img/MeshBasicMaterial_3.png" />

<br>

- side

    - THREE.FrontSide
        - オブジェクトの前面のみをレンダリングする = visibleになるイメージ

    - THREE.BackSide
        - オブジェクトの背面のみをレンダリングする

    - THREE.DoubleSide
        - オブジェクトの両面をレンダリングする
    
        - *DoubleSideの 場合は他の設定よりも処理が重いので、必要な時だけ　DoubleSide　を指定する


    ```js
    const material = new THREE.MeshBasicMaterial({ map: colorTexture });

    material.side = THREE.DoubleSide;
    ```

    - sphere などの場合、THREE.DoubleSideは球体の内部もレンダリングする

    <img src="./img/MeshBasicMaterial_4.gif" />

<br>
<br>

参考サイト

[Three.jsのさまざまなマテリアル](https://ics.media/tutorial-three/material_variation/)

---

### MeshNormalMaterial

- カメラに対するノーマルの向き(法線の向き = オブジェクトの面の向き)を RGB で表すマテリアル

- 主に法線のデバッグに利用されるマテリアル

- コンストラクタに何も渡さなくても OK なマテリアル

    ```js
    const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    ```

    <img src="./img/MeshNormalMaterial_1.png" />

<br>

#### プロパティ

- flatShading
    - [flat shading](./FlatShading.md) を有効にするかどうか
    - bool 値で指定する
    - デフォルトは false

    ```js
    const material = new THREE.MeshNormalMaterial();

    material.flatShading = true;
    ```

<br>
<br>

参考サイト

[Three.jsのさまざまなマテリアル](https://ics.media/tutorial-three/material_variation/)

---

### MeshMatcapMaterial

- テカリを表現するためのマテリアル

<br>

- 以下のようなライティング済みの球体が描かれたテクスチャを用意する必要がある

    <img src="./img/Matcap_1.png" />

<br>

- リアルなマテリアルが利用できる一方で、MeshMatcapMaterial はライトやカメラの位置によってリアルな色の変化が起きるわけではない

    - テクスチャに描かれたライティングに依存するため

<br>

#### プロパティ

- mapcap
    - Material の map プロパティにテクスチャーを設定するのではなく、**matcap プロパティ**にテクスチャーを設定する

```js
// テクスチャーのロード
const textureLoader = new THREE.TextureLoader();
const matcapTexture = textureLoader.load("テクスチャー画像のパス");

// MeshMatcapMaterialの作成
const material = new THREE.MeshMatcapMaterial();
material.matcap = matcapTexture;
```

<br>
<br>

参考サイト

[【Unity】MatCapについて覚え書き](https://tech.spark-creative.co.jp/entry/2021/09/28/110828#MatCapとは)

[【three.js】マテリアルの種類まとめ](https://zenn.dev/raihara3/articles/20220505_threejs_material#meshmatcapmaterial)

---

### MeshDepthMaterial

カメラに近いものは白く、遠いものほど黒になるマテリアル

---

### MeshLambertMaterial

*光源(ライト)が無いとオブジェクトが見えない

光の拡散反射をシミュレートするマテリアル
- ライトの方向と、オブジェクトの面が垂直で、距離が近ければ近いほどその面は明るく、

---

### MeshPhongMaterial

*これもライトが無いとオブジェクトが見えない

MeshLambertMaterial と同様に光の拡散反射をシミュレートするマテリアル
- 

---

### MeshToonMaterial

*これもライトが無いとオブジェクトが見えない

---

### MeshStandardMaterial

*これもライトが無いとオブジェクトが見えない


---

### 鏡面反射と拡散反射
