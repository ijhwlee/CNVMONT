import * as THREE from './lib/three/three.module.js';
import { GLTFLoader } from './lib/three/loaders/GLTFLoader.js';

// Canvas
const canvas = document.querySelector('canvas.scene_glb');

// scene
const scene = new THREE.Scene();

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.6); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(0, 8, 15);
scene.add(directionalLight);

// load glb object
const models = ['./model/dodge_viper_gts.glb',
          './model/mazdaVisionGranTorismo.glb',
          './model/MitaFreeSampleV1.glb',
          './model/free_1975_porsche_911_930_turbo.glb'];
const model_count = models.length;
var model;
var size_set = false;
const loader = new GLTFLoader();
loader.load(models[3], gltf => {
  model = gltf.scene;
  scene.add(model);
}, undefined, error => {
  console.error('Error loading model:', error);
});
if (model) {
  const size = new THREE.Vector3();
  const box = new THREE.Box3().setFromObject(model);
  box.getSize(size);
  size_set = true;
  console.log(`Width: ${size.x}, Height: ${size.y}, Depth: ${size.z}`);
}

//Camera
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight);
//camera.position.x = 0.5;
//camera.position.y = 60;
//camera.position.z = 40;
//camera.lookAt(0,50,0);
//camera.position.x = 0.5;
camera.position.y = 3;
camera.position.z = 5;
camera.lookAt(0,1,0);
scene.add(camera);

// Renderer
const renderer = new THREE.WebGLRenderer({
    antialias: true,
    canvas: canvas
})
renderer.setSize(window.innerWidth, window.innerHeight);

//renderer.render(scene, camera);

var count = 0;
function animate() {
  requestAnimationFrame(animate);
  if (model) {
    if (!size_set) {
      const size = new THREE.Vector3();
      const box = new THREE.Box3().setFromObject(model);
      box.getSize(size);
      size_set = true;
      console.log(`Width: ${size.x}, Height: ${size.y}, Depth: ${size.z}`);
      var scale = (size.x > size.y? size.x:size.y);
      scale = (scale>size.z? scale:size.z);
      const viewAngle = Math.atan2(camera.position.length(), scale/2)*(180/Math.PI)*1.01;
      camera.fov = viewAngle;
      camera.updateProjectionMatrix();
      console.log(`Distance: ${camera.position.length()}, viewAngle: ${viewAngle}`);
    }
    model.rotation.y += 0.01;
  }
  else {
    console.log('Loading...');
  }
  renderer.render(scene, camera);
}
animate();