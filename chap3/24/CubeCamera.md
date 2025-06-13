### CubeCamera とは

- Three.js が提供しているカメラの1種

    - CubeCamera と CubeRenderTarget でキューブ環境マップを生成することができる

        <img src="./img/CubeCamera_1.svg" />

<br>
<br>

#### Use Case

- 金属のような背景を反射するマテリアルやガラス玉のような透明で背景を屈折するマテリアルをシミュレーする場合で、**周りにある他のオブジェクトも環境マップ (反射/屈折) に取り込みたいようなケース**で使用される

    - CubeCamera を使わないと → 反射するスフィア型オブジェクトに、その周りを動くキューブ型のオブジェクトが映らない

        <img src="./img/CubeCamera-Usecase_1.gif" />

    <br>

    - CubeCamera を使うと → 反射するスフィア型オブジェクトに、その周りを動くキューブ型のオブジェクトが映るようになる

        - 仕組み: 毎フレームごとに、シーン内に配置した CubeCamera が撮影&作成するキューブ環境テクスチャをスフィア型オブジェクトの環境マップに適用している

        <img src="./img/CubeCamera-Usecase_2.gif" />


<br>
<br>

#### CubeCamera の使い方

- ポイント

    - CubeCamera が撮影したものを元にキューブ環境テクスチャの生成&保存をするために、WebGLCubeRenderTarget インスタンスも作成する必要がある

    - 毎フレームごとに、CubeCamera.update() で撮影を行う

<br>

1. Scene の背景に使用する環境テクスチャのロード

    - ★背景マップのみに適用するためのもので、ここでは反射/屈折の環境マップには適用しない

    <img src="./img/CubeCamera_2.svg" />

<br>

2. `WebGLCubeRenderTarget` と `CubeCamera` のインスタンス化 & Scene の環境マップに `WebGLCubeRenderTarget.texture` を適用する

    - `WebGLRenderTarget`

        - 第1引数: キューブ環境テクスチャ1枚の解像度 (Number)

            <img src="./img/CubeRenderTarget-Size_1.svg" />
        
        <br>

        - 第2引数: 生成するキューブ環境テクスチャに関するオプション (Object)

            - type プロパティ

                - ★レンダリングされるテクスチャの1ピクセルあたりの「表現できる精度と情報量」を指定する項目

                - よく指定する値は以下の3つ

                    1. THREE.UnsignedByteType  (デフォルト)

                        - 1ピクセル 8bit の情報量をもつ

                        - パフォーマンスは良いが、生成するテクスチャは明るさの情報を持たない

                    <br>

                    2. THREE.HalfFloatType 

                        - 1ピクセル 16bit の情報量をもつ

                        - パフォーマンスとクオリティのバランスがいい


                        - イメージ的には HDR 対応のテクスチャを生成するための値と理解すれば OK

                    <br>

                    3. THREE.FloatType

                        - 1ピクセル 32bit の情報量をもつ

                        - パフォーマンスは悪いが、高クオリティなテクスチャを生成する

                        - イメージ的には EXR 対応のテクスチャを生成するための値と理解すれば OK

    <br>

    - `CubeCamera`

        - 第1引数
            - CubeCamera の near

        <br>

        - 第2引数
            - CubeCamera の far
        
        <br>

        - 第3引数
            - CubeCamera のテクスチャ保存先 (`WebGLCameraRenderTarget` インスタンス)

    <br>

    - `WebGLCubeRenderTarget.texture`

        - CubeCamera によって撮影&生成されるキューブ環境テクスチャ

    <img src="./img/CubeCamera_3.svg" />

<br>

3. 毎フレームごとに `CubeCamera.update()` でキューブカメラでの撮影&環境テクスチャの生成を行う

    <img src="./img/CubeCamera_4.svg" />

<br>

#### 問題点

- CubeCamera の位置 & キューブ環境マップを適用するオブジェクトの位置 の組み合わせによってはうまく反射/屈折がシミュレートできないことがある

    <img src="./img/CubeCamera-Issue_1.svg" />

    <br>

    <img src="./img/CubeCamera-Issue_2.svg" />

<br>

- 解決策は以下の2つ

    1. [キューブカメラを反射するオブジェクトの位置に移動する](#キューブカメラを反射するオブジェクトの位置に移動する)

    2. [レイヤー](#レイヤー) を利用して解決する

---

### キューブカメラを反射するオブジェクトの位置に移動する

- 反射するオブジェクトが複数ある場合は?

    → そのオブジェクト分 CubeCamera と WebGLCubeRenderTarget を用意する必要がある

<br> 

#### サンプル

- 以下のようなシーンを作るのが目標

    <img src="./img/CubeCamera-Solution-Move-Camera_1.svg" />

<br>

- 何も考えずに 1つの CubeCamera をシーンの中心に配置し、それぞれのオブジェクトの環境マップに適用した場合

    - 反射するオブジェクトのはずなのに、自身の姿も映ってしまっている

        <img src="./img/CubeCamera-Solution-Move-Camera_2.gif" />

    <br>

    - 原因は、中心に配置した CubeCamera からの視点で撮影&テクスチャの生成を行っているから

        <img src="./img/CubeCamera-Solution-Move-Camera_3.svg" />

<br>

- 以下のイメージのように、各オブジェクトからの視点で撮影&テクスチャを生成する必要がある

    <img src="./img/CubeCamera-Solution-Move-Camera_4.svg" />

<br>

#### 手順

1. 各反射/屈折するオブジェクト用の CubeCamera と WebGLCubeRenderTarget を用意する

    <img src="./img/CubeCamera-Solution-Move-Camera_5.svg" />

<br>

2. 各オブジェクトの位置に CubeCamera を移動 & 各オブジェクトの環境マップに、各 WebGLCubeRender で生成された環境マップを適用する

    <img src="./img/CubeCamera-Solution-Move-Camera_6.svg" />

<br>

3. 毎フレームごとに、`CubeCamera.update()` で撮影を行う

    <img src="./img/CubeCamera-Solution-Move-Camera_7.svg" />

    
<br>

- 結果、自身を映さず周囲を反射するオブジェクトができる

    <img src="./img/CubeCamera-Solution-Move-Camera_8.gif" />

---

### レイヤー

#### 概要

- Three.js はイラストツールのように、レイヤー機能を提供している

    <img src="./img/Layer-Concept_1.jpg" />

    引用: [イラストツールのレイヤーとは？機能と活用方法を徹底解説](https://www.mouse-jp.co.jp/mouselabo/entry/2023/12/20/100023)

    <br>

    - ★Three.js では **Object3D オブジェクト**に0から31までの32個のレイヤーを割り当てることができる

    - ★Three.js では Object3D オブジェクトは**デフォルトでレイヤー0に割り当てられている**

<br>

- ★★Camera はその[カメラが所属するレイヤーのみを写す](#レイヤーと-camera)

<br>

#### レイヤーの利用方法

- ポイント

    1. `Object3D.layers.enable(Number)`

        - 対象の Object3D を引数で指定したレイヤーに所属させる

            <img src="./img/Layer-Enable_1.svg" />

    <br>
    

    2. `Object3D.layers.disable(Number)`

        - 対象の Object3D を引数で指定したレイヤーから解約させる

            <img src="./img/Layer-Disable_1.svg" />

    <br>

    3. `Object3D.layers.set(Number)`

        - 対象の Object3D の所属レイヤーを引数で指定したレイヤーのみにする

            <img src="./img/Layer-Set_1.svg" />

<br>

#### 以下のようなシーンをレイヤーを利用して作ってみる

<img src="./img/CubeCaMera-Solution-Layer_1.svg" />

<br>

1. CubeCamera に写したいオブジェクトを Layer1 に追加する

    <img src="./img/CubeCaMera-Solution-Layer_3.svg" />

    <br>

    - ★★★Group オブジェクト全体を Layer に追加するには、**Group オブジェクトに所属している個々のオブジェクトごとに layers.enable()** で Layer に追加してあげる必要がある

        <img src="./img/CubeCaMera-Solution-Layer_2.svg" />

<br>

2. CubeCamer を Layer1 のみに所属させる

    - 毎フレームごとに CubeCamera.update() を実行するを忘れずに

   <img src="./img/CubeCaMera-Solution-Layer_4.svg" />

<br>

3. 意図した結果になっていることを確認

    <img src="./img/CubeCaMera-Solution-Layer_5.gif" />

<br>

#### 注意点

- 反射オブジェクトと CubeCamera の位置が遠いと、反射の見え方が不自然になる = CubeCamera からの視点でキューブ環境テクスチャを撮影&生成するため

    - 基本的には [キューブカメラを反射するオブジェクトの位置に移動する](#キューブカメラを反射するオブジェクトの位置に移動する) 方法がベター

<br>
<br>

参考サイト
[【Three.js】一部のオブジェクトのみにPost Processingをかける](https://zenn.dev/dami/articles/5d9792736a4ffc)

---

### WebGLCubeRenderTarget の type プロパティ

#### - THREE.UnsignedByteType

<img src="./img/CubeRenderTarget-Type-UnsignedByte_1.svg" />

<br>

#### - THREE.HalfFloatType

<img src="./img/CubeRenderTarget-Type-HalfFloat_1.svg" />

<br>

#### - THREE.FloatType

<img src="./img/CubeRenderTarget-Type-Float_1.svg" />

<br>

#### ちなみに...

- MeshBasicMaterial.color に Color(1, 1, 1) を設定しても、 Color(100, 100, 100) を設定しても同じ白になる → 環境マップ (type≠THREE.UnsignedByteType) 上のみ明るく映る

    <img src="./img/MeshBasicMaterial-Color_1.svg" />

    - 詳しくは[こちら](./Materialとcolor.md)を参照

<br>
<br>

参考サイト

[HDRIとは ?](https://knowledge.shade3d.jp/knowledgebase/hdriとは)

---

### レイヤーと Camera

- Camera は自身が所属するレイヤーのみを写す

<br>

- 以下の2つのオブジェクトのみのシンプルなシーンがあるとする

    - 2つのオブジェクトはデフォルトの Layer0 のみに所属している

    - Camera もデフォルトの Layer0 のみに所属している

    <img src="./img/Camera-Layer_1.svg" />

<br>

#### 実験

1. `Camera.layer.set(1)` を行うと

    - Camera は何も写さなくなる = Camera は Layer1 のみに所属し、緑のオブジェクトと赤のオブジェクトは Layer1 に所属していないから
    
    <img src="./img/Camera-Layer_2.svg" />

<br>

2. 以下のコードを実行し、「緑のオブジェクトは Layer2 のみに所属」、「赤のオブジェクトは Layer3 のみに所属」、「Camera は Layer2, Layer3 にも所属」 の状況を作る

    <img src="./img/Camera-Layer_3.svg" />

    <br>

    - 結果: カメラは緑と赤のオブジェクト両方を写すようになる = Camera は自身が所属しているすべての Layer を写すから

    <img src="./img/Camera-Layer_4.svg" />
