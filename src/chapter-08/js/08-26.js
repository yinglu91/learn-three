function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));
  const loaderScene = new BaseLoaderScene(camera);

  const loader = new THREE.SVGLoader();

  // you can use slicer to convert the model
  loader.load("../../assets/models/tiger/tiger.svg", function (paths) {
    const group = new THREE.Group();
    group.scale.multiplyScalar(0.1);
    group.scale.y *= -1;
    for (let i = 0; i < paths.length; i++) {
      const path = paths[i];
      const material = new THREE.MeshBasicMaterial({
        color: path.color,
        side: THREE.DoubleSide,
        depthWrite: false,
      });
      const shapes = path.toShapes(true);
      for (let j = 0; j < shapes.length; j++) {
        const shape = shapes[j];
        const geometry = new THREE.ShapeBufferGeometry(shape);
        const mesh = new THREE.Mesh(geometry, material);
        group.add(mesh);
      }
    }

    console.log(group);
    loaderScene.render(group, camera);
  });
}
