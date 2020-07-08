function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(30, 30, 30));
  const loaderScene = new BaseLoaderScene(camera);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const loader = new THREE.PLYLoader();

  loader.load("../../assets/models/carcloud/carcloud.ply", function (geometry) {
    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      opacity: 0.6,
      transparent: true,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
      map: generateSprite(),
    });

    const group = new THREE.Points(geometry, material);
    group.scale.set(2.5, 2.5, 2.5);

    loaderScene.render(group, camera);
  });
}

// From Three.js examples
function generateSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = 16;
  canvas.height = 16;
  const context = canvas.getContext("2d");

  // draw the sprites
  const gradient = context.createRadialGradient(
    canvas.width / 2,
    canvas.height / 2,
    0,
    canvas.width / 2,
    canvas.height / 2,
    canvas.width / 2
  );
  gradient.addColorStop(0, "rgba(255,255,255,1)");
  gradient.addColorStop(0.2, "rgba(0,255,255,1)");
  gradient.addColorStop(0.4, "rgba(0,0,64,1)");
  gradient.addColorStop(1, "rgba(0,0,0,1)");
  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);

  // create the texture
  const texture = new THREE.Texture(canvas);
  texture.needsUpdate = true;
  return texture;
}
