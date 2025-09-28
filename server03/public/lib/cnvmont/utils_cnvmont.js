// Utilities for CNVMONT
// created by hwlee 202/09/28

import * as THREE from '/lib/three/three.module.js';

/*
import Stats from '/lib/three/jsm/libs/stats.module.js';

import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from '/lib/three/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/lib/three/jsm/loaders/DRACOLoader.js';
*/

let default_size = 4.0;
let offset = 1.3;

export class CNVMONT_utils {
    constructor() {

    }

    fitModelToView(model, camera, controls) {
        let size = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(model);
        let center = box.getCenter(new THREE.Vector3());
        box.getSize(size);
        console.log(`Model size = (${size.x}, ${size.y}, ${size.z})`)
        let maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim < 1) {
            const scale_value = default_size/maxDim;
            model.scale.set( scale_value, scale_value, scale_value );
            size = new THREE.Vector3();
            box = new THREE.Box3().setFromObject(model);
            center = box.getCenter(new THREE.Vector3());
            box.getSize(size);
            maxDim = Math.max(size.x, size.y, size.z);
        }
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= offset; // Add some padding
        console.log(`fov = ${fov}, cameraZ = ${cameraZ}, maxDim = ${maxDim}`);
        camera.position.set(center.x, center.y, cameraZ);
        camera.lookAt(center);

        // Update camera far plane
        const minZ = box.min.z;
        const cameraToFarEdge = minZ < 0 ? -minZ + cameraZ : cameraZ - minZ;
        camera.far = cameraToFarEdge * 3;
        camera.updateProjectionMatrix();

        // Update controls
        if (controls) {
            controls.target.copy(center);
            controls.maxDistance = cameraToFarEdge * 2;
            controls.update();
        }
    }
}
