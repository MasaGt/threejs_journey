### 視点の移動

<img src="./img/Blender-Basic_1.png" />

引用: [Blenderの基本操作を確認しよう！](https://gihyo.jp/article/2023/02/blender-basics-04)

<br>

#### 視点の回転

- 方法1

    - マウスホイールを押し込んでマウスを動かす

<br>

- 方法2

    - トラックパッドの上で２本指で移動 (Mac)

<br>

#### 視点の並行移動

- 方法1

    - `shift` + マウスホイールを押し込んでマウスを動かす

<br>

- 方法2

    - `shift` + トラックパッドの上で２本指で移動 (Mac) 

<br>

#### 視点のズームイン/アウト

- 方法1

    - マウスホイールでズームイン/アウト

<br>

- 方法2

    - トラックパッド上でピンチイン/アウトでズームイン/アウト

<br>
<br>

参考サイト

[Blenderの使い方1（基本的な操作と概要）](https://koro-koro.com/blender-no1/)

[【Blender】編集モード（頂点・辺・面）](https://saru-blender.com/vertex-edge-face)

[Blenderの基本操作を確認しよう！](https://gihyo.jp/article/2023/02/blender-basics-04)

---

### Walk と Fly

- Walk / Flyモードとは 3D Viewport での視点の移動モードのこと

<br>

- #### Walk モード

    <img src="./img/Blender-Walk_1.gif" />

    <br>

    - ゲームのように歩く感覚で視点を操作するモード

    - Walk モードでの基本的な視点移動は Orbit と Truck

        <img src="./img/Orbit.png" />

        引用: [Three.js Journey ~ Lesson23](https://threejs-journey.com/lessons/custom-models-with-blender)

        <br>

        <img src="./img/Truck.png" />

        引用: [Three.js Journey ~ Lesson23](https://threejs-journey.com/lessons/custom-models-with-blender)

<br>

- #### Fly モード

    <img src="./img/Blender-Fly_1.gif" />

    - 空中を自由に飛ぶ感覚で視点を操作するモード

    - Fly モードでの基本的な視点移動は Tilt と Pan

        <img src="./img/Tilt.png" />

        引用: [Three.js Journey ~ Lesson23](https://threejs-journey.com/lessons/custom-models-with-blender)

        <br>

        <img src="./img/Pan.png" />

        引用: [Three.js Journey ~ Lesson23](https://threejs-journey.com/lessons/custom-models-with-blender)

<br>

#### Walk / Fly モードの切り替え

- デフォルトは Walk モード

- Walk → Fly になる

    - `shift` + `f`

<br>

- Fly → Walk に戻る

    - Fly モード中に `クリック` (右でも左でも OK)

---

### Mode

- `ctrl` + `tab` で様々なモードに切り替えることができる

    - 画面右上のセレクトボックスからもモードの切り替えをすることができる

    <img src="./img/Blender-Mode_1.png" />

    <br>

- 基本的には以下の2つのモードが主に使われる

    - #### Object Mode

        - **オブジェクトの作成/削除**、 複数もしくは個別のオブジェクトの Transform をすることができるモード

        - オブジェクトの Transform は Edit Mode でもできる

        <img src="./img/Blender-Object-Mode_1.png" />

        引用: [Blenderを使ったモデリングの流れと、モデリングで使う2つのモードを見てみよう！](https://gihyo.jp/article/2023/01/blender-basics-03)

    <br>

    - #### Edit Mode

        - オブジェクトのポリゴンを編集するモード

        - オブジェクトの Transform もできる

        <img src="./img/Blender-Edit-Mode_1.png" />

        引用: [Blenderを使ったモデリングの流れと、モデリングで使う2つのモードを見てみよう！](https://gihyo.jp/article/2023/01/blender-basics-03)

<br>

- ★★★`Tab` で現在のモードと一個前のモードを切り替え (toggle) することができる★★★

    <img src="./img/Blender-Mode-Toggle_1.png" />

    引用: [Blenderを使ったモデリングの流れと、モデリングで使う2つのモードを見てみよう！](https://gihyo.jp/article/2023/01/blender-basics-03)

<br>

- #### Object Mode ~ オブジェクトの作成

    - `shift (⇧)` + `a` もしくは、画面右上のセレクトボックスからオブジェクトの追加を行うことができる

    <img src="./img/Blender-Add-Meshes_1.png" />

<br>

- #### Object Mode ~ オブジェクトの削除

    - 削除したいオブジェクトを選択し、 `x` もしくは　`左クリック` でオブジェクトの削除を行うことができる

    <img src="./img/Blender-Delete-Meshes_1.png" />

<br>
<br>

参考サイト

[Blenderを使ったモデリングの流れと、モデリングで使う2つのモードを見てみよう！](https://gihyo.jp/article/2023/01/blender-basics-03)

---

### オブジェクト (メッシュ) の Transformation

- Transform 操作の前に、Object Mode で操作対象をクリックで選択しておくこと

<br>

- #### Translate

    - `g` を押した後にマウス移動で任意のポイントに移動できる

        <img src="./img/Blender-Translate_1.gif" />
    
    <br>

    - `g` + `x` で **x 軸上**に沿ってオブジェクトを移動することができる

        <img src="./img/Blender-Translate-X_1.gif" />
    
    <br>

    - `g` + `y` で **y 軸上**に沿ってオブジェクトを移動することができる

        <img src="./img/Blender-Translate-Y_1.gif" />
    
    <br>

    - `g` + `z` で **z 軸上**に沿ってオブジェクトを移動することができる

        <img src="./img/Blender-Translate-Z_1.gif" />
    
    <br>

<br>

- #### Rotation

    - `r` を押した後にマウス移動で好きなようにオブジェクトを回転させることができる

        <img src="./img/Blender-Rotation_1.gif" />

    <br>

    - `r` + `x` で **x 軸上**に沿ってオブジェクトを回転させることができる

        <img src="./img/Blender-Rotation-X_1.gif" />

    <br>

    - `r` + `y` で **y 軸上**に沿ってオブジェクトを回転させることができる

        <img src="./img/Blender-Rotation-Y_1.gif" />

    <br>

    - `r` + `z` で **z 軸上**に沿ってオブジェクトを回転させることができる

        <img src="./img/Blender-Rotation-Z_1.gif" />

    <br>

<br>

- #### Scale

    - `s` を押した後にマウス移動で好きなようにオブジェクトを 大きく/小さく スケールできる

        <img src="./img/Blender-Scale_1.gif" />

    <br>

    - `s` + `x` で **x 軸方向**にオブジェクトをスケールする

        <img src="./img/Blender-Scale-X_1.gif" />

    <br>

    - `s` + `y` で **y 軸方向**にオブジェクトをスケールする

        <img src="./img/Blender-Scale-Y_1.gif" />

    <br>

    - `s` + `z` で **z 軸方向**にオブジェクトをスケールする

        <img src="./img/Blender-Scale-Z_1.gif" />

---

### メッシュの変形

- Object Mode で変形するオブジェクト (メッシュ) を選択し、 Edit Mode に切り替えること

<br>

- #### セグメントなどの編集

    - 追加するメッシュによってできるものとできないものがある

    - ★★メッシュの追加後、エリア左下に表示される `Add ~~` をクリックしてセグメントの編集が可能

    - ★★★メッシュの追加直後にしかできない

    <img src="./img/Blender-Segment-Edit_1.gif" />

<br>

- #### position, rotation, scale などの Transformation 系の編集

    - [Object Mode でのメッシュの Transformation](#オブジェクト-メッシュ-の-transformation) と同じ操作方法

<br>

- #### 頂点, 辺, 面の編集

    - 3D Viewport の左上にあるアイコンからどれ (頂点/辺/面) を基準に編集するかを切り替えることができる

        <img src="./img/Blender-Edit-Mode_2.png" />

    <br>

    - #### 頂点の編集

        <img src="./img/Blender-Edit-Vertices_1.gif" />

    <br>

    - #### 辺の編集

        <img src="./img/Blender-Edit-Edges_1.gif" />

    <br>

    - #### 面の編集

        <img src="./img/Blender-Edit-Faces_1.gif" />

---

### Viewport Shading

- Viewport Shading とは 3D Viewport 画面での Shading (陰影処理)
 をどのようなものにするかを変更できる機能のこと

    - 3D Viewport とは 3D シーンを表示するためのエリアのこと (灰色の背景で Grid 線や x, y, z 軸が表示されている画面のこと)

        <img src="./img/Blender-3D-Viewport_1.png" />

<br>

- Viewport Shading には以下の種類がある

    - Solid: Workbench のレンダリングエンジンを使用して 3D Viewport が表示される (= オブジェクトが均一的な色で塗りつぶされて表示されるイメージ)

        - ★★オブジェクトのマテリアル (色、質感、テクスチャーなど) は反映されない

        - ★★ライティングも反映されない★★

        <img src="./img/Blender-Solid.gif" />

    <br>

    - Material Preview: オブジェクトに適用されているマテリアルのプレビューを表示する

        - ★★ライティングは反映されない★★
        
        <img src="./img/Blender-Material-Preview_1.gif" />

    <br>

    - Wireframe: オブジェクトのワイヤーフレームだけを表示する

        - Soild と同様にマテリアルやライティングなどは表示されない

        <img src="./img/Blender-Wireframe_1.gif" />

    <br>

    - Rendered: 完全なレンダリングを行う。オブジェクトのライティングやシャドウ、マテリアルを考慮した見た目を表示する

        <img src="./img/Blender-Rendered_1.gif" />


<br>

- Viewport Shading の切り替え方法

    - `z` を押して切り替えたいモードの方向にマウスを移動させる

    - 画面左上にある、小さい球体 (=Viewport Shading) を切り替える

    <img src="./img/Blender-Viewport-Shading_1.png" />

<br>
<br>

参考サイト

[Blenderの使い方1（基本的な操作と概要）](https://koro-koro.com/blender-no1/)

[Viewport Shading](https://docs.blender.org/manual/ja/3.0/editors/3dview/display/shading.html)

---

### Material

- Three.js の Material と同じく、オブジェクトの表面の性質に関する設定

- プロパティビューにある赤い球体のアイコン (マテリアル) を選択することでオブジェクトのマテリアルを設定することができる

    <img src="./img/Blender-Material_1.png" />

---

### Render Engine

- #### EEVE

    - パフォーマンス、リアルさのバランスが良いレンダリングエンジン

    - 基本的には EEVE で問題ないので、 Blender ではデフォルトのレンダリングエンジンになっている

<br>

- #### Workbench

    - レガシーなレンダリングエンジン

    - パフォーマンスは良いが、リアルじゃないし、レガシーなので基本的には使わない

<br>

- #### Cycle

    - 光の反射などをよりリアルにシミュレートするレンダリングエンジン

        - レイトレーシング

    <br>

    - 高度な処理を行ってくれるため、重い = レンダリングにかかる時間が長い

    <img src="./img/Blender-Renderer-Cycle_1.png" />
    
<br>

#### Renderer の変更方法

- プロパティビューにあるカメラのアイコン (= Render アイコン) を選択し、レンダリングエンジンの項目から利用したいものを選ぶ

    <img src="./img/Blender-Render_1.png" />

<br>
<br>

参考サイト

[Blenderの使い方1（基本的な操作と概要）](https://koro-koro.com/blender-no1/)

---

### ズーム

- マウスホイールやトラックパッドでのピンチイン/アウトでズームする場合、ズームできる距離に限界がある

    <img src="./img/Blender-Zoom_1.gif" />

<br>

- `ctrl` + `shift` + `マウスホイールを押し込んでマウスを移動` でもっとズームイン/アウトすることができる

    <img src="./img/Blender-Zoom_2.gif" />

---

### 2次元の Transformation

- Transform操作中に `shift` + `z` を押すことで x, y 上のみの Transform が可能になる

- ★下の gif は 「 x 軸上での translate 」 → 「 y 軸上での translate 」 → 「 z 軸上での translate 」 → 「 x,y 軸上での translate 」 の順で動かしている

    <img src="./img/Blender-Translate_2.gif" />

<br>

#### ポイント

- Transform 中に `shift` + `操作対象としない軸`