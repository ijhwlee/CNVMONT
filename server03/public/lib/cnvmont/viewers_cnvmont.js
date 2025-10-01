// Viewer classes for CNVMONT
// created by hwlee 202/09/29

        import * as THREE from '/lib/three/three.module.js';

        import Stats from '/lib/three/jsm/libs/stats.module.js';

        import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';
        import { RoomEnvironment } from '/lib/three/jsm/environments/RoomEnvironment.js';

        import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
        import { DRACOLoader } from '/lib/three/jsm/loaders/DRACOLoader.js';

        import { CNVMONT_utils } from '/lib/cnvmont/utils_cnvmont.js';

        let mixer;
        let default_size = 4.0;
        let offset = 1.3;

        const clock = new THREE.Clock();
        const container = document.getElementById( 'container' );

        const stats = new Stats();
        container.appendChild( stats.dom );

        const renderer = new THREE.WebGLRenderer( { antialias: true } );
        renderer.setPixelRatio( window.devicePixelRatio );
        renderer.setSize( window.innerWidth, window.innerHeight );
        container.appendChild( renderer.domElement );

        const pmremGenerator = new THREE.PMREMGenerator( renderer );

        const scene = new THREE.Scene();
        scene.background = new THREE.Color( 0xbfe3dd );
        scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;

        const camera = new THREE.PerspectiveCamera( 40, window.innerWidth / window.innerHeight, 1, 100 );
        camera.position.set( 5, 2, 8 );

        const controls = new OrbitControls( camera, renderer.domElement );
        controls.target.set( 0, 0.5, 0 );
        controls.update();
        controls.enablePan = false;
        controls.enableDamping = true;

        const dracoLoader = new DRACOLoader();
        dracoLoader.setDecoderPath( '/lib/three/jsm/libs/draco/gltf/' );

        const cnvmont_utils = new CNVMONT_utils(4.0, 1.3);

        let modelLoaded = false;
        let animationExist = false;
        const loader = new GLTFLoader();
        loader.setDRACOLoader( dracoLoader );
        if (modelPath == 'cube') {
            var percent = 0;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const geometry = new THREE.BoxGeometry(1, 1, 1);
            const materials = [
                new THREE.MeshBasicMaterial({ color: 'red' }),     // right
                new THREE.MeshBasicMaterial({ color: 'green' }),   // left
                new THREE.MeshBasicMaterial({ color: 'blue' }),    // top
                new THREE.MeshBasicMaterial({ color: 'yellow' }),  // bottom
                new THREE.MeshBasicMaterial({ color: 'cyan' }),    // front
                new THREE.MeshBasicMaterial({ color: 'magenta' })  // back
            ];
            percent = 10;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const model = new THREE.Mesh(geometry, materials);
            percent = 50;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            cnvmont_utils.fitModelToView(model, camera, controls);
            scene.add( model );

            percent = 90;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;

            modelLoaded = true;
            percent = 100;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const size = new THREE.Vector3();
            const box = new THREE.Box3().setFromObject(model);
            box.getSize(size);
            console.log(`Model size = (${size.x}, ${size.y}, ${size.z})`)
        }
        else if (modelPath == 'capsule') {
            const geometry = new THREE.CapsuleGeometry(1, 2, 8, 16);
            var percent = 10;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const material = new THREE.MeshStandardMaterial({ color: 0x00ffcc });
            percent = 50;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const model = new THREE.Mesh(geometry, material);
            cnvmont_utils.fitModelToView(model, camera, controls);
            scene.add( model );
            percent = 90;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;

            renderer.setAnimationLoop( animate );
            modelLoaded = true;
            percent = 100;
            document.getElementById('progress_glb').style.width = `${percent}%`;
            document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            const size = new THREE.Vector3();
            const box = new THREE.Box3().setFromObject(model);
            box.getSize(size);
            console.log(`Model size = (${size.x}, ${size.y}, ${size.z})`)
        }
        else {
            loader.load( modelPath, function ( gltf ) {

                const model = gltf.scene;
                //model.position.set( 1, 1, 0 );
                //model.scale.set( 0.01, 0.01, 0.01 );
                cnvmont_utils.fitModelToView(model, camera, controls);
                
                if (gltf.animations && gltf.animations.length > 0) {
                    const size = new THREE.Vector3();
                    const box = new THREE.Box3().setFromObject(model);
                    box.getSize(size);
                    console.log(`Scaled Model size = (${size.x}, ${size.y}, ${size.z})`)
                    scene.add( model );
                    mixer = new THREE.AnimationMixer( model );
                    mixer.clipAction( gltf.animations[ 0 ] ).play();
                    animationExist = true;
                }
                else {
                    const size = new THREE.Vector3();
                    const box = new THREE.Box3().setFromObject(model);
                    box.getSize(size);
                    console.log(`Scaled Model size = (${size.x}, ${size.y}, ${size.z})`)
                    scene.add( model );
                }

                renderer.setAnimationLoop( animate );
                modelLoaded = true;
            }, function (xhr) {
                const percent = (xhr.loaded / xhr.total) * 100;
                document.getElementById('progress_glb').style.width = `${percent}%`;
                document.getElementById('percent_glb').textContent = `Loading...${percent.toFixed(1)}%`;
            }, function ( e ) {
                console.error('Error loading model: ', e );
            } );
        }

        window.onresize = function () {

            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();

            renderer.setSize( window.innerWidth, window.innerHeight );

        };

        function animate() {

            if (animationExist) {
                const delta = clock.getDelta();

                mixer.update( delta );
            }
            else {
                requestAnimationFrame(animate);
            }

            controls.update();

            stats.update();

            renderer.render( scene, camera );

            if(modelLoaded) {
                document.getElementById('progress_glb').style.display = "none";
            }

        }
        if (!animationExist) {
            animate();
        }
