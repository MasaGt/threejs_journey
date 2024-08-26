### Texture

Texture とは 画像をもとにジオメトリの表面を覆う機能

#### Texture の種類

- Color (ALBEDO)

- Alpha

- Height(Displacement)

    - 表面が凸凹したテクスチャが完成する
        - *頂点の数が少ない = セグメント数が少ないとうまく凸凹にならない

- Normal
    - ジオメトリのセグメント数に影響されない

    - 

- Metalness

-Roughness

---

### PBR Principles

- PBR は Physically Based Rendering の略

- よりリアルな質感のレンダリングをするため、現実世界の光の性質を計算に取り入れる考え方のこと

<br>
<br>

参考サイト

- [【3DCGを学ぼう】PBRマテリアルとは？基本概念とフリーサイト紹介](https://www.moderno-pers.com/post/3dcg-pbr-material-textures/)

- [PBRとは](https://school.dhw.co.jp/course/3dcg/contents/w_pbr.html)

---

### Texture の利用方法

2つの方法がある

- JavaScript の Image クラスと Three.js の Texture クラスを利用する方法
- Three.js の TextureLoader をクラスを利用する方法 *こっちの方が簡単で基本こっちの方法でいい

<br>

#### Image クラスと Texturew　 を利用する方法

1. 画像ファイルのロード

2. ロードした画像をテクスチャーに変換する
    - Textureクラスのコンストラクタに Image インスタンスを渡す

3. テスクチャーをマテリアルに渡す

<br>

#### TextureLoader を利用する方法

- 1つの TextureLoader インスタンスで複数の画像をロードすることができる

---

#### TextureLoader

- TextureLoader.load() には画像のパス以外にも以下の引数を渡すことができる
    - 第二引数: onLoad 関数 = 画像のロードが完了した時に呼ばれるコールバック関数
    - 第三引数: onProgress 関数 $\color{red} 現在ではサポートされていないので使用しないこと$
    - 第四引数: onError 関数 = 画像のロードに失敗した時に呼ばれるコールバック関数

    ```js
    const loader = new THREE.TextureLoader();
    const textuer = loader.load(
        "画像のパス",
        () => {
            console.log("This is called when loading finishes");
        },
        () => {
            console.log("never use this");
        },
        () => {
            console.log("This is called when loading fails");
        }
    );
    ```

---

### LoadingManager

画像やモデルデータのローディングイベントを handle and keep track するクラス


#### 利用方法

1. LoadingManager をインスタンス化する

    ```js
    const loadingManager = new THREE.LoadingManager();
    ```

<br>

2. LoadingManager インスタンスのイベント系プロパテｘに関数を設定する
    - onStart: 画像のロードが開始した時に呼ばれるコールバック関数
    - onProgress: 
    - onError: 画像のロードが失敗した時に呼ばれるコールバック関数

    ```js
    const loadingManager = new THREE.LoadingManager();
    // LoadingManagerのイベント系プロパティを設定する
    loadingManager.onStart = () => {

    };

    loadingManager.onProgress = () => {

    };

    loadingManager.onError = () => {

    };
    ```

<br>

3. LoadingManager インスタンスを TextuerLoader 渡す

    ```js
    const loadingManager = new THREE.LoadingManager();

    // LoadingManagerをTextureLoaderに渡す
    const textureLoader = new THREE.TextureLoader(loadingManager);
    ```

<br>

#### TextuerLoader.load() の引数に渡すコールバック関数と違う点

- TextureLoader.load() へ設定するコールバック関数
    - load() を呼び出す時に毎回コールバック関数を渡さなければならない (*コールバック関数の必要がある時)

- LoadingManager へ設定するコールバック関数
    - LoadingManager のイベント系プロパティに1回設定するだけで、あとは LoadingManager がそれを再利用してくれる

---

### カラー空間

<br>
<br>

参考サイト

[ガンマ色空間、リニア色空間とsRGB](https://qiita.com/sshuv/items/87ea929e1a62c2f47503)

---

### UV 展開

- テクスチャーがジオメトリに貼り付けられる仕組み

---

### UV 座標

Three.js で提供されているジオメトリは uv 座標が自動で生成(設定される)

一方ジオメトリを自作する場合は、自分で uv 座標の設定が必要

---

### テクスチャーの変形

#### repeat
    - RepeatingWrapping
    - MirroredRepeatingWrapping

<br>

#### offset: x/y 軸からどのくらいテクスチャーを離してから貼り付けるか

<br>

#### rotate

    - 回転の中心となる点に注意

<br>
<br>

参考サイト

repeat の利用方法
[Three.js の ExtrudeGeometry に Texture を適用する](https://zenn.dev/ike_pon/scraps/8e9da4f68dfd43)

---

### Mipmapping

    - Minification Filter
        - メッシュのサイズがテクスチャー画像のサイズよりも小さい場合 = テクスチャー画像の縮小が必要な場合に発生する処理

    - Magnification Filter
        - メッシュのサイズがテクスチャー画像のサイズよりも大きい場合 = テクスチャー画像の拡大が必要な場合に発生する処理

    - MinMap の生成をオフにする

<br>
<br>

参考サイト

[MipMapを可視化しよう](https://qiita.com/dgtanaka/items/2ec0fd88236daa5c3cc7)

[ミップマップとテクスチャフィルタリング](https://wgld.org/d/webgl/w074.html)

[THREE.jsのテクスチャについて調べる](https://nogson2.hatenablog.com/entry/2017/08/01/235850)

[Three.js備忘録（2）](https://koro-koro.com/threejs-no2/)

---

### Texture Format and Optimisation

- テクスチャー画像や動画を使う際に考えるべきこと

    - 画像・動画ファイルのサイズ(解像度)
        - 解像度の大きい画像や動画は ただえさえ GPU のメモリを食うのに、さらに Minmapping によってメモリ使用量が増加する

            →適切なサイズ(解像度)の画像/動画を用意するべき

        - 画像のサイズ(解像度) は2のべき乗である必要がある
            → Minmap が作成される = 画像サイズ /　2 の画像が次々作られていくから

            $\color{red}動画では Minmap が作成されない$

    - ファイルサイズ

    - 

<br>
<br>

参考サイト

[Three.jsパフォーマンス最適化についてのまとめ](https://koro-koro.com/three-js-performance-optimization/)