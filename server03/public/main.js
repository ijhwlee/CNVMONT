import * as THREE from './lib/three/three.module.js';

// Canvas
const canvas = document.querySelector('canvas.scene');

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({canvas: canvas});

renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5); // soft white light
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
directionalLight.position.set(5, 10, 7.5);
scene.add(directionalLight);

// Add a cube
const geometry = new THREE.BoxGeometry(1, 1, 1);
//const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 });
const materials = [
  new THREE.MeshBasicMaterial({ color: 'red' }),     // right
  new THREE.MeshBasicMaterial({ color: 'green' }),   // left
  new THREE.MeshBasicMaterial({ color: 'blue' }),    // top
  new THREE.MeshBasicMaterial({ color: 'yellow' }),  // bottom
  new THREE.MeshBasicMaterial({ color: 'cyan' }),    // front
  new THREE.MeshBasicMaterial({ color: 'magenta' })  // back
];
const cube = new THREE.Mesh(geometry, materials);
scene.add(cube);

camera.position.z = 5;

var count = 0;
function animate() {
  requestAnimationFrame(animate);
  count++;
  if (count > 30) {
    const randomColor = '#' + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0')
            + Math.floor(Math.random() * 256).toString(16).padStart(2, '0');
    const surface = Math.floor(Math.random() * 6);
    cube.material[surface].color.set(randomColor);
    count = 0;
  }
  cube.rotation.x += 0.01; //Math.random()/20;
  cube.rotation.y += 0.01; //Math.random()/50;
  cube.rotation.z += 0.01 + Math.random()/50;
  renderer.render(scene, camera);
}
animate();