function init() {
  // use the defaults
  const stats = initStats();
  const renderer = initRenderer();
  const camera = initCamera();
  const trackballControls = initTrackballControls(camera, renderer);
  const clock = new THREE.Clock();
  const scene = new THREE.Scene();

  camera.position.set(20, 0, 150);

  let cloud;

  const controls = new (function () {
    this.size = 4;
    this.transparent = true;
    this.opacity = 0.6;
    this.vertexColors = true;
    this.color = 0xffffff;
    this.vertexColor = 0x00ff00;
    this.sizeAttenuation = true;
    this.rotate = true;

    this.redraw = function () {
      console.log(controls.color);

      if (scene.getObjectByName('particles')) {
        scene.remove(scene.getObjectByName('particles'));
      }
      createParticles(
        controls.size,
        controls.transparent,
        controls.opacity,
        controls.vertexColors,
        controls.sizeAttenuation,
        controls.color,
        controls.vertexColor
      );
    };
  })();

  const gui = new dat.GUI();
  gui.add(controls, 'size', 0, 10).onChange(controls.redraw);
  gui.add(controls, 'transparent').onChange(controls.redraw);
  gui.add(controls, 'opacity', 0, 1).onChange(controls.redraw);
  gui.add(controls, 'vertexColors').onChange(controls.redraw);

  gui.addColor(controls, 'color').onChange(controls.redraw);
  gui.addColor(controls, 'vertexColor').onChange(controls.redraw);
  gui.add(controls, 'sizeAttenuation').onChange(controls.redraw);
  gui.add(controls, 'rotate');

  controls.redraw();

  let step = 0;

  render();

  function createParticles(
    size,
    transparent,
    opacity,
    vertexColors,
    sizeAttenuation,
    colorValue,
    vertexColorValue
  ) {
    const geom = new THREE.Geometry();
    const material = new THREE.PointsMaterial({
      size: size,
      transparent: transparent,
      opacity: opacity,
      vertexColors: vertexColors,

      sizeAttenuation: sizeAttenuation,
      color: new THREE.Color(colorValue),
    });

    const range = 500;
    for (let i = 0; i < 15000; i++) {
      const particle = new THREE.Vector3(
        Math.random() * range - range / 2,
        Math.random() * range - range / 2,
        Math.random() * range - range / 2
      );
      geom.vertices.push(particle);
      const color = new THREE.Color(vertexColorValue);
      const asHSL = {};
      color.getHSL(asHSL);
      color.setHSL(asHSL.h, asHSL.s, asHSL.l * Math.random());
      geom.colors.push(color);
    }

    cloud = new THREE.Points(geom, material);
    cloud.name = 'particles';
    scene.add(cloud);
  }

  function render() {
    stats.update();
    trackballControls.update(clock.getDelta());

    if (controls.rotate) {
      step += 0.01;
      cloud.rotation.x = step;
      cloud.rotation.z = step;
    }

    requestAnimationFrame(render);
    renderer.render(scene, camera);
  }
}
