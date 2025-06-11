### Material と Color

#### - MeshBasicMaterial

<img src="./img/MeshBasicMaterial-Color_1.svg" />

<br>

#### - MesgStandardMaterial

<img src="./img/MeshStandardMaterial-Color_1.svg" />

<br>
<br>

#### なぜ上位のような違いが起こるのか

- そもそも、Color コンストラクタに渡す値は以下のような方法がある

    - 数値で指定する場合、 0 ~ 1 の範囲の float 型で指定する必要がある

    <img src="./img/Color-Constructor_1.svg" />

    引用: [Color](https://threejs.org/docs/#api/en/math/Color)

<br>

- ChatGPT 曰く、理由は以下の通りらしい

    <img src="./img/Color-Materials_1.svg" />

<br>

#### 結論

- Color(1, 1, 1) の時、 MeshStandardMaterial よりも MeshBasicMaterial の方が明るいのは、**MeshBasicMaterialがライティングの影響を受けないから**

<br>

- MeshStandardMaterial において Color(255, 255, 255) の方が Color(1, 1, 1) よりも明るいのは、**MeshStandardMaterial はオーバースケールな値を正規化せず処理するから** (たぶん)

    - 一方で MeshBasicMaterial はオーバースケールな値は正規化して処理するから同じ色になる (たぶん)

