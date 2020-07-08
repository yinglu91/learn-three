function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(35, 35, 35));
  const loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 45, 0));

  // load the model
  const loader = new THREE.ColladaLoader();
  loader.load("../../assets/models/medieval/Medieval_building.DAE", function (
    result
  ) {
    const sceneGroup = result.scene;
    sceneGroup.children.forEach(function (child) {
      if (child instanceof THREE.Mesh) {
        child.receiveShadow = true;
        child.castShadow = true;
      } else {
        // remove any lighting sources from the model
        sceneGroup.remove(child);
      }
    });

    // correctly scale and position the model
    sceneGroup.rotation.z = 0.5 * Math.PI;
    sceneGroup.scale.set(8, 8, 8);

    // call the default render loop.
    loaderScene.render(sceneGroup, camera);
  });
}
