### Anti Aliasing

- Aliasing = ジャギー

<br>

- Anti-Aliasing を実現するためのさまざまな手法は以下の通り

    - [Super Sampling](#super-sampling)

    - [Multi Sampling](#multi-sampling)

<br>

- ★Pixel Ratio が 2 以上のディスプレイに対しては、Anti-Aliasing を利用する必要はない (綺麗に表示されるため)

    - ★★クライアントの Pixel Ratio が 2 よりも下の場合に Multi Sampling などを有効にすれば良い

---

### Super Sampling (Full Screen Sampling)

<img src="./img/Super-Sampling_1.svg" />

<br>

- 描画対象を高解像度で描いてから縮小する

    - 縮小する際、描画するピクセルの色のサンプリング方法は様々

    - ある意味 [mipmap](https://github.com/MasaGt/threejs_journey/blob/b5fdc4a8f6f64d94f08f655b77901cdbaae9ae8a/chap1/10/Mipmap_TextureFiltering.md#mipmap%E3%81%A8%E3%81%AF) とは逆の処理

<br>

- パフォーマンスが悪い

    - 基本的には利用しない方がいい

<br>

#### Three.js で Super Sampling を利用する方法

- Super Sampling の機能は提供されていない

    - 自分で実装するしかない

<br>

- WebGLRenderer のサイズを大きくすることで、実際のディプレイよりも大きく描画し、表示する際にリサイズでディスプレイの画面サイズに合わせる

    <img src="./img/Super-Sampling_2.svg" />

<br>
<br>

参考サイト

[さらばギザギザ！　NVIDIAがアンチエイリアスを技術解説](https://ascii.jp/elem/000/000/746/746002/amp/)

[SSAA 【Super-Sampling Anti-Aliasing】 スーパーサンプリングアンチエイリアシング](https://e-words.jp/w/SSAA.html)

---

### Multi Sampling (MSAA)

<img src="./img/Multi-Sampling_1.svg" />

<br>

- オブジェクトのエッジをぼやかすことでジャギーを目立たなくするイメージ

    - ★オブジェクトのジャギーは目立たなくするが、オブジェクトに貼られたテクスチャーのジャギーには対応できない

    - テクスチャーのジャギーを目立たなくさせるには[Fast Approximate Anti-Aliasing (FXAA)](https://ascii.jp/elem/000/000/746/746002/amp/) というサンプリングを利用したり、[テクスチャーサンプリングや mipmap](https://github.com/MasaGt/threejs_journey/blob/b5fdc4a8f6f64d94f08f655b77901cdbaae9ae8a/chap1/10/Mipmap_TextureFiltering.md) を利用する

<br>

- Super Sampling よりは軽い処理

<br>

#### Three.js で Multi Sampling を利用する方法

- WebGLRenderer のコンストラクタ引数のオブジェクトに `antialias: true` を設定する

- ★WebGLRenderer インスタンス作成時にしか設定できない

    <img src="./img/Multi-Sampling_2.svg" />

<br>
<br>

参考サイト

[さらばギザギザ！　NVIDIAがアンチエイリアスを技術解説](https://ascii.jp/elem/000/000/746/746002/amp/)