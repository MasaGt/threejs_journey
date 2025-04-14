### 基本的な使い方

- Cannon.js とほとんど変わらない

---

### Cannon.js との違い

- World.step() の他に、World.fixedStep() が追加された

- `World.fixedStep()`

    - timeSinceLastCalled が固定の World.step() みたいな関数

    -  フレームレートに関わらず、一定間隔で物理空間を更新 (= 計算する)

    - 引数
        - timeStep

            - シミュレーションの1ステップの時間 = 物理エンジンの更新間隔

        <br>

        - maxSubSteps (オプショナル)

            - この関数が一度に取ることができる最大のサブステップ（計算ステップ）の数。詳しくは[こちら](./cannon-js.md#基本的な使い方)を参照

    <br>

    ```js
    /**
     * アニメーション
     */

    const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const delta = elapsedTime - previousTime;
    previousTime = elapsedTime;

    // Update controls
    controls.update();

    // 物理空間の更新
    world.fixedStep(1 / 60);

    // 物理空間の計算結果を Three.js のオブジェクトに合わせる
    sphere.position.copy(sphereBody.position);

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
    };

    tick();
    ```

<br>

#### World.fixedStep() の注意点

- クライアント PC のフレームレートによって、requestAnimationFrame の実行回数 per 秒が異なるので、フレームレートに関係なく一定間隔で計算する World.fixedStep() を使うと、オブジェクトの動きに差ができるっぽい

- 上記問題を解決するためには、 デルタタイム (フレーム間の秒数) を計算して　World.step() に渡す必要があるらしい

    - World.step() の使い方は [Cannon.js の World.step()](./cannon-js.md#基本的な使い方) と同じ

<br>
<br>

参考サイト

[cannon-es](https://pmndrs.github.io/cannon-es/docs/index.html)