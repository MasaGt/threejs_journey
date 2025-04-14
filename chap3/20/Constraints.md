### Constraint とは

- 複数のオブジェクトへの制約 (動きの制限)

    - HingeConstraint, LockConstraint などの制約を利用することでリアルな物理の挙動を簡単にシミュレートすることができる

    - 例: パーティクルに DistanceConstraint (オブジェクト間の距離の制約) を課すことによって、布の揺れをシミュレートすることもできる

        <img src="./img/Constraint-Sample_1.gif" />

        引用: [Three.js備忘録（６）](https://koro-koro.com/threejs-no6/)

<br>

#### ざっくりとした制約の使い方

1. Constraint 系のインスタンスを作成する

    ```js
    // LookConstraintインスタンスの作成
    const lockConstraint = new CANNON.LockConstraint(bodyA, bodyB);
    ```

<br>

2. World インスタンスの `addConstraint()` を呼び、1.で作成した制約を追加する

    ```js
    // Worldに作成した制約を追加する
    world.addConstraint(lockConstraint);
    ```

<br>
<br>

- 制約についてわかりやすい説明をしてくれいているサイトは[こちら](https://koro-koro.com/threejs-no6/#chapter-6)