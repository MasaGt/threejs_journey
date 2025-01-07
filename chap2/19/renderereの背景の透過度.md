### Three.js で背景を透過させる

1. WebGLRenderer オブジェクトの alpha プロパティに trueを設定する

```js
/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true, // ★ここで背景を透過可能にする
});
```

<br>

2. WebGLRenderer オブジェクトの setClearAlpha メソッドに、設定したい透過度を指定する

    - デフォルトは 0 = 完全透明

```js
renderer.setClearAlpha(0.5);
```

#### 注意点

- Scene オブジェクトの background プロパティに背景色を指定している場合、 WebGLRenderer への透過度の設定は効かなくなる

<br>
<br>

参考サイト

[Three.js の背景を透過する方法](https://std9.jp/articles/01fmxyp2xadf02gh937nrbwhzd)