import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const file1 = '/dodge_viper_gts.glb';
const file2 = '/mazdaVisionGranTorismo.glb';
const file3 = '/mazda.gltf';

const loader = new GLTFLoader();
loader.load(file3, gltf => {
  scene.add(gltf.scene);
}, undefined, error => {
  console.error(error);
});

camera.position.y = 3;
camera.position.z = 10;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
animate();
