### Debug UI

- GUI でパラメーターを変更し、即時にオブジェクト/カメラ/シーンに反映することができるツールのこと

- 様々な Debug GUI がある
    - dat.GUI
    - lil-gui
    - Oui
    - Guify

    などなど

---

### lil-gui

事前準備

- lil-gui をインストール

    ```bash
    npm install -D lil-gui
    ```

<br>

利用方法

1. lil-gui から GUI クラスをインポートし、インスタンス化

    ```js
    import GUI from "lil-gui";

    const gui = new GUI();
    ```

<br>

2. GUI.add() にデバッグしたいパラメータオブジェクトとプロパティ名を渡す
    - パラメータオプジェクト

    - プロパティ名

    ```js
    // GUI インスタンスは定義ずみ

    const mesh = new THREE.Mesh(geo, mat);
    scene.add(mesh);

    gui.add(mesh.position, "y");
    ```

    <img src="./img/DebugGUI_1.gif" />

<br>

3. スライダーでパラメーターを変化できるようにしたい

    - GUI.add().min(最初値).max(最大値)(.step())を設定する

    ```js
    gui.add(mesh.position, "y").min(-5).max(5);
    ```

    <img src="./img/DebugGUI_2.gif" />

    <br>

    - step() を指定すると step()に渡した値刻みにパラメーターを変化させることができる

    ```js
    gui.add(mesh.position, "y").min(-5).max(5).setp(1);
    ```

    <img src="./img/DebugGUI_3.gif" />

<br>

4. オブジェクトのプロパティの種類によって、GUIに表示されるコントローラーが異なる

    - position.y や rotation.x のような floatなどの数値は、テキストボックス or スライダー

    - mesh.wireframe や mesh.visible のような bool 値はチェックボックス

        ```js
        gui.add(mesh, "wireframe");
        gui.add(mesh, "visible");
        ```

        <img src="./img/DebugGUI_4.gif" />

        <br>

    - function はボタンで実行できるようになっている
        - *function を直接 GUI.add に渡してはいけない

        - *function を持つ object を第一引数に設定し、第二引数に function のプロパティ名を指定する

        ```js
        import gasp from "gsap";

        // mesh をy軸を中心に1回転させる関数を持つオブジェクトを作成
        const manipulationObj = {
            revolution: () => {
                gsap.to(mesh.rotation, {
                duration: 1,
                y: mesh.rotation.y + Math.PI * 2,
                });
            },
        };

        gui.add(manipulationObj, "revolution");
        ```

        <img src="./img/DebugGUI_5.gif" />
    
<br>
<br>

参考サイト

lil-gui リファレンス
- [lil-gui](https://lil-gui.georgealways.com)

---

### 色を Debug GUI (lil-gui) でデバッグできるようにした場合

- GUI.addColor() を利用する
    - 第一引数: GUIコントローラーが操作するオブジェクト (Three.js では Material インスタンスを渡す)
    - 第二引数: コントロールするオブジェクトのプロパティ名

    ```js
    const material = new THREE.MeshStandardMaterial({ color: "#ff0000"});

    gui.addColor(material, "color");
    ```

    <img src="./img/DebugGUI-Color_1.gif" />

<br>

カラーをデバッグする際の問題点

- デバッグUIに表示されているカラーコードと、Three.js内部で処理されているカラーコードは異なる

    → render インスタンスが内部的にガンマ補正という処理を行なっているかららしい

<br>

\[例\]: デバッグGUIで選択したカラーコードを mesh のカラーコードに設定してみる

1. 現在のマテリアルの色は赤に設定されている

    <img src="./img/DebugGUI-Color_2.png" />

<br>

2. デバッグ GUI のカラーピッカーで好きな色を選択し、カラーコードを控える

    <img src="./img/DebugGUI-Color_3.png" />

<br>

3. 控えておいたカラーコードを js ファイルのマテリアルのcolorに設定する

    <img src="./img/DebugGUI-Color_4.png" />

<br>

4. デバッグ GUI で見た時の色より暗くなってしまう

    <img src="./img/DebugGUI-Color_5.png" />

    → デバッグ GUI で表示されているカラーコードと、 Three.js 内部で処理されているカラーコードが違っているから

    <img src="./img/DebugGUI-Color_6.png" />

<br>

うまく、デバッグGUIで選択したカラーコードを適用する方法は、  
$\color{red}デバッグGUIからカラーコードを拾うのではなく、コードで選択された色を取得する$


- GUI.addColor().onChange()　のコールバック関数内で、選択されたカラーコードを表示する

    - onChange() の引数はコールバック関数
    - コールバック関数の引数は Color オブジェクト

    ```js
    gui.addColor(material, "color").onChange((value) => {
        // vaule は Color　オブジェクト
        // Color.getHexString() で16新数表記のカラーコードを取得することができる
        console.log(value.getHexString());
    });
    ```

    <img src="./img/DebugGUI-Color_7.png" />

<br>

- コードで取得したカラーコードをマテリアルに適用してみる

    <img src="./img/DebugGUI-Color_8.png" />

    <img src="./img/DebugGUI-Color_9.png" />

<br>

デバッグ GUI で選択された色を任意のオブジェクトに保持する方法もある

// TODO: まだ完全に理解しきっていないので、補足が必要

```js
const obj = {
    color: "#ff0000",
};

const material = new THREE.MeshStandardMaterial({ color: obj.color });

// ★material オブジェクトでは無く、 自分で作成したカラーコードを保持するオブジェクトを渡しているのがポイント
gui.addColor(obj, "color").onChange(() => {
    material.color.set(obj.color);
});
```

---

### ジオメトリのデバッグ

ジオメトリ情報は、作成後に更新はできない

→ デバッグUIによってジオメトリ情報が変更されたら、その情報を元に新しいジオメトリを作成し直す必要がある

onChange でデバッグしようとすると、シークバーで値を変化させるようなUIにすると、処理が重くなる → 値が変化するたびにジオメトリの作成と廃棄を行うため、処理の負担が増大する

onFinishChange で最終的な値にした場合のみジオメトリの再作成を行う方が効率が良い

----

### addFolder()

デバッグUI

---

### デバッグUIのレイアウト変更

- サイズの変更

- タイトルの変更

- フォルダーをデフォルトで閉じる

- デバッグUI を非表示にする
