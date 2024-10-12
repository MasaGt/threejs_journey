### Shadow

影には2種類ある

- core shadow
    - 自身が自身に落とす影

- drop shadow (cast shadow)
    - 他のオブジェクトから落とされる影

<img src="./img/Shadows_1.webp" />

引用: [How to Add a Drop Shadow in Photoshop](https://koro-koro.com/threejs-no1/#chapter-13)

<br>

Three.jsでは以下のライトが Drop Shadow を落とせる

- Point Light
- Directional Light
- Spot Light

<br>
<br>

参考サイト
[Three.jsこと始め](https://koro-koro.com/threejs-no1/)

---

### 影が落とされる仕組み ~ Shadow Mapping

1. カメラからのシーンをレンダリングする前に、**ライトの視点から見たシーン内のオブジェクトとの距離関係をグレースケールで表したマップ(テクスチャ)** (= シャドウマップ) を作成する

    <img src="./img/Shadow-Mapping_1.png" />

    引用: [シャドウマッピング](http://asura.iaigiri.com/OpenGL/gl46.html)

    <br>

    - 作成されるシャドウマップ(深度マップ)は以下のような感じ

        - 黒: ライトとの距離が近い = 深度が小さい
        - 白: ライトとの距離が遠い = 深度が大きい

        <img src="./img/Shadow-Map_1.png" />

        引用: [Variance Shadow Maps](https://graphics.stanford.edu/~mdfisher/Shadows.html)

<br>

2. カメラからのシーンをレンダリングする際に、`レンダリングするオブジェクトの頂点とライトの距離` & `レンダリングするオブジェクトの頂点のシャドウマップでの深度` を比較し対象の頂点が影になるかどうかを判定する

    <img src="./img/Shadow-Mapping_2.png" />

    引用: [シャドウマッピング](http://asura.iaigiri.com/OpenGL/gl46.html)

    <br>

    - 比較方法
        - ライトからオブジェクトの頂点までの距離を D とおく

        - シャドウマップでのオブジェクトの頂点の深度を d とおく

            - D > d であれば、その頂点の前に何かオブジェクトが遮っているので影になる判定となる

            - D \<= d であれば、遮るオブジェクトがないので光が当たる判定となる

        <img src="./img/Shadow-Mapping_3.png" />

        引用: [【Unity】シャドウマッピングについて](https://r-ngtm.hatenablog.com/entry/2021/01/26/131305)

<br>

3. オブジェクトに影を描写してシーンをレンダリングする

<br>
<br>

参考サイト

[シャドウマッピング](http://asura.iaigiri.com/OpenGL/gl46.html)

[いまさら聞けない業界用語 ～ライティング編②～](https://3d.crdg.jp/tech/archives/1688)

[【Unity】シャドウマッピングについて](https://r-ngtm.hatenablog.com/entry/2021/01/26/131305)

[three.jsのシャドウマッピング](https://mofu-dev.com/blog/threejs-shadow-map)

---

### Three.js でオブジェクトに Drop Shadow を落とす

1. レンダラーでがシャドウマップを利用するよう設定する

    - [こちら](#影が落とされる仕組み--shadow-mapping)でいう手順2でレンダラーがシャドウマップを利用していることがわかる

    - Rendere インスタンスのshadowMap.enabled プロパティに true を設定する

    ```js
    rendere.shadowMap.enabled = true;
    ```

<br>

2. Drop Shadow を落とすオブジェクト、Drop Shadow を落とされるオブジェクトの設定をする

    <img src="./img/Cast-Receice-Shadows_1.png" />

    <br>

    - Drop Shadow を落とすオブジェクトには、 `castShadow = true` を設定する

        ```js
        sphereObj.castShadow = true;
        ```

    <br>

    - Drop Shadow を落とされるオブジェクトには、 `receiveShadow = true` を設定する

        ```js
        planeObj.receiveShadow = true;
        ```

<br>

3. Light オブジェクトでシャドウマップを生成するようにする

    ```js
    // Spot Lightを使う場合は
    spotLight.castShadow = true;
    ```

<img src="./img/Cast-Receice-Shadows_2.png" />

---

### Optimizing Shadows ~ シャドウマップの解像度の変更

- [上記](#threejs-でオブジェクトに-drop-shadow-を落とす)手順で作成した影はジャギって見える

    - シャドウマップのデフォルトサイズは 512 × 512 で少し解像度が低い

    <img src="./img/Optimizing-Shadows_1.png" />

<br>

- シャドウマップにアクセスする方法

    - Light インスタンスの shadow プロパティの中にシャドウマップの情報がある    

        ```js
        console.log(directionalLlight.shadow);
        ```

        <img src="./img/Light-Shadow-Props_1.png" />

<br>

#### シャドウマップの解像度を上げる

- Light インスタンスの `shadow.mapSize` プロパティにて、解像度を指定する

- シャドウマップの高さ、幅は2の累乗である必要がある

- シャドウマップの高さと幅は同じである必要はない

    ```js
    pointLight.shadow.mapSize.width = 2048;
    pointLight.shadow.mapSize.height = 2048;
    ```

<img src="./img/Optimizing-Shadows_2.png" />

<br>
<br>

参考サイト

[WebGL と JavaScript で学ぶ3D表現 Three.jsで影を落とす方法](https://ics.media/tutorial-three/light_shadowmap/)

---

### Optimizing Shadows ~ ライトカメラの範囲変更

- シャドウマップを作成する視点となるライトカメラを修正することで、シャドウマップの精度を上げることができる

    - ライトカメラのnearがオブジェクトから遠いとシャドウマップに小さく描画される

        - テクスチャマッピングの時にチラつく = ジャぎる (理由は[こちら](../../chap1/10/Mipmap_TextureFiltering.md)を参照)

    <img src="./img/Optimizing-Shadows_3.png" />

<br>

- ライトカメラへは Light インスタンスの `shadow.camera` プロパティからアクセスすることができる

    - `Light.shadow.camera.near` (Float)
    - `Light.shadow.camera.far` (Float)

<br>

#### ライトカメラの種類

- Perspectvive camera
    - Point Light / Spot Light がシャドウマップを作成する際に利用するライト視点のカメラ (シーンをレンダリングする時に利用するカメラと同じ)

        - `Light.shadow.camera.fov`
        - `Light.shadow.camera.aspect`

- Orthographic Camera
    - Directional Light がシャドウマップを作成する際に利用するライト視点のカメラ (シーンをレンダリングする時に利用するカメラと同じ)

        - `Light.shadow.camera.top`
        - `Light.shadow.camera.bottom`
        - `Light.shadow.camera.left`
        - `Light.shadow.camera.right`

<br>

#### CameraHelper の利用

---

### Optimizing Shadows ~ シャドウマップのアルゴリズムの変更