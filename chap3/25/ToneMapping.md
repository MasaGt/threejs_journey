### Tone Mapping とは

- Tone Mapping とは 画像の HDR 値を新しい範囲の値にリマッピングするプロセスのこと BY [Unity 公式リファレンス](https://docs.unity3d.com/ja/Packages/com.unity.render-pipelines.universal@14.0/manual/post-processing-tonemapping.html)

    - ざっくりいうと、 HDR 非対応ディスプレイで HDR 画像を表示する際、明るすぎたり暗すぎたり箇所が出ることがあるので、それを防ぐためのプロセス

        <img src="./img/Tone-Mapping_1.svg" />
    
    <br>

    - しかし、HDR ディスプレイでも HDR 画像を表示 (レンダリング) 際に Tone Mapping は必要らしい by ChatGPT

        <img src="./img/Tone-Mapping_2.svg" />

<br>

- ★Three.js にて Tone Mapping の設定は Renderer に対して行うため、環境マップだけではなくシーンの全てに影響を与えることに注意

- Tone Mapping は比較的軽量な処理でポストプロセス処理のうちの1つ

    - ポストプロセスとは、3Dシーンをレンダリングした後に、その結果に対してフィルターやエフェクトを適用する処理のこと

    <img src="./img/Tone-Mapping_3.svg" />

<br>
<br>

参考サイト

[トーンマッピング](https://learn.foundry.com/ja/modo/content/help/pages/rendering/tone_mapping.html)

---

### Tone Mapping の設定方法

- WebGLRenderer.toneMapping プロパティに Three.js 利用したい Tone Mapping を指定する

    ```js
    import * as THREE from 'three';

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))

    // ★★★↓でToneMappingの手法をACESに変更している★★★
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    ```

<br>

#### Tone Mapping 手法の種類

- Three.js は以下の Tone Mapping 手法を定数で用意している

    1. `THREE.NoToneMapping`

        - トーンマッピングを行わない

            - 明るすぎる箇所は白飛びしたり、暗すぎる箇所が黒くつぶれたり見えることがある

        <img src="./img/THREE-NoToneMapping_1.svg" />

    <br>

    2. `THREE.LinearToneMapping`

        - 単純な線形変換 (NoToneMapping とほぼ変わらない見た目)

        - 単純な変換のためTone Mapping処理が軽い

        <img src="./img/THREE-LinearToneMapping_1.svg" />

    <br>

    3. `THREE.ReinhardToneMapping`

        - 全体的にグレーがかって見える

        - 処理は軽い

        <img src="./img/THREE-ReinhardToneMapping_1.svg" />

    <br>

    4. `THREE.CineonToneMapping`

        - 映像風、シネマティックな見え方になる

        - `THREE.ACESFilmicToneMapping` よりは処理が軽い

        <img src="./img/THREE-CineonToneMapping_1.svg" />

    <br>

    5. `THREE.ACESFilmicToneMapping`

        - 高品質映画な見え方になる (らしい)

            - `THREE.CineonToneMapping` よりはコントラストがはっきり見える感じがする

        - 処理は重め

        <img src="./img/THREE-ACESFilmicToneMapping_1.svg" />

    <br>

    6. `THREE.AgXToneMapping`

        - `THREE.ReinhardToneMapping` のように、全体的にグレーがかって見える

            - `THREE.ReinhardToneMapping` よりは明るく見える印象

        - 処理は `THREE.ACESFilmicToneMapping` ぐらい重め

        <img src="./img/THREE-AgXToneMapping_1.svg" />

    <br>

    7. `THREE.NeutralToneMapping`

        - 元の画像の色をなるだけ忠実に再現しようとする Tone Mapping

            - 個人的一番見え方が良かった

        - 処理の重さは真ん中ぐらい (`THREE.CineonToneMapping` ぐらい)

        <img src="./img/THREE-NeutralToneMapping_1.svg" />

    <br>

    8. `THREE.CustomToneMapping`

        - 自分で実装した Tone Mapping 処理を使う

        - 何も実装してなければトーンマッピングを行わない `THREE.NoToneMapping` と同じ

        <img src="./img/THREE-CustomToneMapping_1.svg" />

<br>

<img src="./img/THREE-ToneMappings-Table_1.svg" />

---

### Tone Mapping Exposure とは

- 画面全体の明るさを調整するためのパラメーターというイメージ

    <img src="./img/ToneMapping-Exposure_1.gif" />

<br>

- ★`WebGLRenderere.toneMapping` プロパティが THREE.NoToneMapping の場合、 ToneMappingExposure の変更は効かない

<br>

#### Tone Mappoing Expouser の利用方法

- `WebGLRenderere.toneMappingExposure` プロパティに値を代入する

    - toneMappingExposure のデフォルト値は 1

    - toneMappingExposure を 0 にすると何も見えなくなる

    <br>

    ```js
    import * as THREE from 'three';

    const renderer = new THREE.WebGLRenderer({
        canvas: canvas,
    })

    renderer.setSize(sizes.width, sizes.height)
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))


    // ★toneMappingExposure の変更を反映させるには toneMapping をデフォルトのTHREE.NoToneMapping以外にする必要がある★
    renderer.toneMapping = THREE.ACESFilmicToneMapping;

    // ★★↓でtoneMappingExposureの強さを5に変更している★★
    renderer.toneMappingExposure = 5;
    ```