function init() {
  // setup the scene for rendering
  const camera = initCamera(new THREE.Vector3(30, 30, 30));
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  const posSrc = { pos: 1 };
  const tween = new TWEEN.Tween(posSrc).to({ pos: 0 }, 2000);
  tween.easing(TWEEN.Easing.Bounce.InOut);

  const tweenBack = new TWEEN.Tween(posSrc).to({ pos: 1 }, 2000);
  tweenBack.easing(TWEEN.Easing.Bounce.InOut);

  tweenBack.chain(tween);
  tween.chain(tweenBack);

  tween.start();

  const loaderScene = new BaseLoaderScene(camera, false, false, function (
    mesh
  ) {
    TWEEN.update();

    const positionArray = mesh.geometry.attributes["position"];
    const origPosition = mesh.geometry.origPosition;

    for (let i = 0; i < positionArray.count; i++) {
      const oldPosX = origPosition.getX(i);
      const oldPosY = origPosition.getY(i);
      const oldPosZ = origPosition.getZ(i);
      positionArray.setX(i, oldPosX * posSrc.pos);
      positionArray.setY(i, oldPosY * posSrc.pos);
      positionArray.setZ(i, oldPosZ * posSrc.pos);
    }
    positionArray.needsUpdate = true;
  });

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

    // copy the original position, so we can referene that when tweening
    const origPosition = geometry.attributes["position"].clone();
    geometry.origPosition = origPosition;

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
