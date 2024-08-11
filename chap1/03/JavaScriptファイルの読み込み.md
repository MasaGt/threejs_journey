### type="module" の意味

対象の src を ESモジュールとして読みこむために必要な記述

```html
<script type="module" src="読み込みたいjsファイル"></script>
```

<br>

three.js journey の Chapter03 のプロジェクトにて、 indedx.html が読み込む script.js ファイルは以下の方法で Three.js モジュールを読み込んでいた

```js
import * as THREE from "three";
```

$\color{red}上記方法(import文)での他のソースの読み込みはES Module特有のもの$

→ ES Moudle　記法の js ファイルを html 側で読み込みたい場合は script タグの type に module を指定する必要がある

<br>
<br>

参考サイト

なぜ type="module" を指定する必要があるのか
- [仕様の概要とその周辺課題](https://www.codegrid.net/articles/2017-es-modules-1/#toc-2)

---

### type="module" の嬉しいポイント

1. 名前空間を分けることができる

    - 従来の方法 (type="module"の指定なし) だと、先に読み込んだ js ファイルで指定した変数を後に読み込んだ js ファイルで参照できてしまう

        例: script1.js と script2.js を html で読み込む (従来の方法)

        ```html
        <script src="./script1.js"></script>
        <script src="./script2.js"></script>
        ```

        ```js
        // script1.js
        let name = "Bob";
        ```

        ```js
        // script2.js
        console.log(name); // "Bob" が参照できちゃう
        let name = "Adam";
        console.log(name); // "Adam"
        ```

    <br>

    - type="module" で読み込むと、それぞれの名前空間を持つので、importしない限り他のファイルから不用意に参照されない

    ```js
    // script1.js
    let name = "Bob";
    ```
    ```js
    // script2.js
    console.log(name); // name は宣言されていない
    let name = "Adam";
    console.log(name); // "Adam"
    ```

<br>

2. モジュールの遅延実行 (bodyの閉じタグの直前に記述しなくても良い)
    - head タグ内にscriptタグを記述しても、htmlファイル全体が読み込まれたらsrc部分が実行されるようになる

    ```html
    <head>
        <script type="module" src="./script.js"></script>
    </head>
    ```

    上記は以下と同じ(jsファイルの実行タイミングは同じ = htmlファイル全体が読み込まれたら)

    ```html
    <body>
        <~>いろんなタグ<~>

        <script type="module" src="./script.js"></script>
    </body>
    ```

<br>
<br>

参考サイト

type="module"の特徴
- [【JavaScript】モジュールの書き方](https://shiroyuki2020.hatenablog.com/entry/introduction_to_js_03#モジュールと名前空間)