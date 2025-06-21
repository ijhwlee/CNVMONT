const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth/window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

const light = new THREE.AmbientLight(0xffffff);
scene.add(light);

const loader = new GLTFLoader.GLTFLoader();
loader.load('/dodge_viper_gts.glb', gltf => {
  scene.add(gltf.scene);
}, undefined, error => {
  console.error(error);
});

camera.position.z = 5;

function animate() {
  requestAnimationFrame(animate);
  renderer.render(scene, camera);
}
renderer.setAnimationLoop( animate );
animate();