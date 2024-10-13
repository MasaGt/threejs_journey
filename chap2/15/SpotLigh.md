### Spot Light のライトカメラを Camera Helper で認識してみる

1. SpotLight インスタンスの作成 & シーンへ追加

    ```js
    const spotLight = new THREE.SpotLight(0xffffff, 3.6, 10, Math.PI * 0.3);

    spotLight.castShadow = true;

    scence.add(spotLight);
    ```

<br>

2. CameraHelper インスタンスの作成 & シーンへ追加

    ```js
    const cameraHelper = new THREE.CameraHelper(spotLight.shadow.camera);

    scene.add(cameraHelper);
    ```

---

### Spot Light のライトカメラの注意点

- Spot Light の distance が設定されている場合
    - ライトカメラの far は Spot Light の distance に設定されている値に固定される

<br>

- Spot Light の angle が設定されている場合
    - ライトカメラの fov は Spot Light の angle に設定されている値に固定される

<!-- TODO: これいらないかも -->
- Spot Light の shadow.mapSize の　width と height が設定されている場合
    - ライトカメラの　aspect は Spot Light の shadow.mapSize の　width と height の比率に固定される -->

<br>
<br>

参考サイト

[SpotLightShadow](https://threejs.org/docs/index.html#api/en/lights/shadows/SpotLightShadow.camera)

