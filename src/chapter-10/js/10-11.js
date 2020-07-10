function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(50, 50, 50));
  const loaderScene = new BaseLoaderScene(camera, false);
  const sun = new THREE.DirectionalLight(0xffffff);
  sun.position.set(300, 100, 100);

  loaderScene.scene.add(sun);

  // AOMAP depends on the presence of an ambientlight
  loaderScene.scene.add(new THREE.AmbientLight(0xffffff, 0.2));

  const loader = new THREE.JSONLoader();
  const textureLoader = new THREE.TextureLoader();
  const gui = new dat.GUI();
  const controls = {
    aoMapIntenisty: 1,
  };

  loader.load("../../assets/models/baymax/bm.json", function (geometry) {
    geometry.computeFaceNormals();
    geometry.computeVertexNormals(false);
    geometry.normalsNeedUpdate = true;
    geometry.faceVertexUvs.push(geometry.faceVertexUvs[0]);

    const material = new THREE.MeshStandardMaterial({
      aoMap: textureLoader.load("../../assets/models/baymax/ambient.png"),
      aoMapIntensity: 2,
      color: 0xffffff,
      metalness: 0,
      roughness: 1,
    });

    // const material = new THREE.MeshNormalMaterial();
    const mesh = new THREE.Mesh(geometry, material);
    mesh.scale.set(20, 20, 20);
    mesh.translateY(-50);

    gui.add(controls, "aoMapIntenisty", 0, 5, 0.01).onChange(function (e) {
      mesh.material.aoMapIntensity = e;
    });

    // call the default render loop.
    loaderScene.render(mesh, camera);
  });
}
