// Utilities for CNVMONT
// created by hwlee 202/09/28

import * as THREE from '/lib/three/three.module.js';

import { GUI } from '/lib/three/jsm/libs/lil-gui.module.min.js';

/*
import Stats from '/lib/three/jsm/libs/stats.module.js';

import { OrbitControls } from '/lib/three/jsm/controls/OrbitControls.js';
import { RoomEnvironment } from '/lib/three/jsm/environments/RoomEnvironment.js';

import { GLTFLoader } from '/lib/three/jsm/loaders/GLTFLoader.js';
import { DRACOLoader } from '/lib/three/jsm/loaders/DRACOLoader.js';
*/

export class CNVMONT_utils {
    default_size = 4.0;
    offset = 1.3;
    constructor(size=4.0, off=1.3) {
        this.default_size = size;
        this.offset = off;
    }

    fitModelToView(model, camera, controls) {
        let size = new THREE.Vector3();
        let box = new THREE.Box3().setFromObject(model);
        let center = box.getCenter(new THREE.Vector3());
        box.getSize(size);
        //console.log(`Model size = (${size.x}, ${size.y}, ${size.z})`)
        let maxDim = Math.max(size.x, size.y, size.z);
        if (maxDim < 1) {
            const scale_value = this.default_size/maxDim;
            model.scale.set( scale_value, scale_value, scale_value );
            size = new THREE.Vector3();
            box = new THREE.Box3().setFromObject(model);
            center = box.getCenter(new THREE.Vector3());
            box.getSize(size);
            maxDim = Math.max(size.x, size.y, size.z);
        }
        const fov = camera.fov * (Math.PI / 180);
        let cameraZ = Math.abs(maxDim / 2 / Math.tan(fov / 2));
        cameraZ *= this.offset; // Add some padding
        //console.log(`fov = ${fov}, cameraZ = ${cameraZ}, maxDim = ${maxDim}`);
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

export class CNVMONT_menus {
    menus;
    settings;
    folders;
    controlPanel;
    objects;
    scene;
    size_x;
    size_y;
    editStatus;
    // menus is a list menu dictionary containing title, and items
    //menus = [{'title': 'File', 'items':['Open', 'Save', 'Save As ...', 'Exit']},
    //           {'title': 'Edit', 'items': [
    //                  {'title': 'Selected', 'items':['Cube', 'Sphere', 'Cylinder']}, 
    //                  {'title': 'Random', 'items':['Cube', 'Sphere', 'Cylinder']}]}, 
    //           {'title': 'Edit', 'items':['Cube', 'Sphere', 'Cylinder']}, 
    //           {'title': 'Help', 'items':['About']}] 
    constructor(menus, editStatus, size_x, size_y) {
        this.menus = menus;
        this.editStatus = editStatus;
        this.size_x = size_x;
        this.size_y = size_y;
        //console.log(`menus.length = ${this.menus.length}`);
    }

    createPanel(scene, objects) {
        this.scene = scene;
        //console.log(`scene = ${this.scene}`);
        this.objects = objects;
        //console.log(`objects = ${this.objects}`);
        const panel = new GUI( { width: 190 } );
        //panel.domElement.querySelector('.name').style.textAlign = 'right';

        this.settings = {
            'Open': () => this.openMenu(),
            'Save': () => this.saveMenu(),
            'Save As ...': () => this.saveAsMenu(),
            'Exit': () => this.exitMenu(),
            'Add Random Cube': () => this.addRandomCube(),
            'Add Random Sphere': () => this.addRandomSphere(),
            'Add Random Cylinder': () => this.addRandomCylinder(),
            'Add Cube': () => this.addCube(),
            'Add Sphere': () => this.addSphere(),
            'Add Cylinder': () => this.addCylinder(),
        };
        this.folders = [];
        this.addFolder(panel, this.menus);
        this.closeAllFolders();
        this.controlPanel = panel;
        return this.controlPanel;
    }

    addFolder(parent, menus) {
        //console.log(`menus.length = ${menus.length}`);
        for (let i=0; i < menus.length; i++) {
            //console.log(`menus[${i}] = ${menus[i]}`);
            if (menus[i].hasOwnProperty('title')) {
                const folder = parent.addFolder( menus[i]['title'] );
                this.folders.push(folder);
                this.addFolder(folder, menus[i]['items']);
            }
            else {
                parent.add( this.settings, menus[i] );
            }
        }
    }

    closeAllFolders() {
        for (let i=0; i < this.folders.length; i++) {
            this.folders[i].close();
        }
        this.editStatus['action'] = 'none';
    }

    openMenu() {
        console.log('Open Menu called');
        this.editStatus['action'] = 'none';
    }
    saveMenu() {
        console.log('Save Menu called');
        this.editStatus['action'] = 'none';
    }
    saveAsMenu() {
        console.log('Save As ... Menu called');
        this.editStatus['action'] = 'none';
    }
    exitMenu() {
        console.log('Exit Menu called');
        this.editStatus['action'] = 'none';
    }
    // Add Cube
    addCube() {
        this.editStatus['action'] = 'add';
        this.editStatus['type'] = 'Cube';
    }

    // Add Sphere
    addSphere() {
        this.editStatus['action'] = 'add';
        this.editStatus['type'] = 'Sphere';
    }
	
    // Add Cylinder
    addCylinder() {
        this.editStatus['action'] = 'add';
        this.editStatus['type'] = 'Cylinder';
    }
    // Add Cube
    addRandomCube() {
        this.editStatus['action'] = 'none';
        const geometry = new THREE.BoxGeometry();
        const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshStandardMaterial({ color: randomColor });
        //const material = new THREE.MeshStandardMaterial({ color: 0x0077ff });
        const cube = new THREE.Mesh(geometry, material);
        //cube.position.set(Math.random()*2-1, Math.random()*3, Math.random()*2-1);
        cube.position.set((Math.random()*2-1)*this.size_x*0.5, Math.random()*3, (Math.random()*2-1)*this.size_y*0.5);
        this.scene.add(cube);
        this.objects.push(cube);
    }

    // Add Sphere
    addRandomSphere() {
        this.editStatus['action'] = 'none';
        const geometry = new THREE.SphereGeometry(0.5, 32, 32);
        const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshStandardMaterial({ color: randomColor });
        //const material = new THREE.MeshStandardMaterial({ color: 0xff7700 });
        const sphere = new THREE.Mesh(geometry, material);
        //sphere.position.set(Math.random()*2-1, Math.random(), Math.random()*2-1);
        sphere.position.set((Math.random()*2-1)*this.size_x*0.5, Math.random()*3, (Math.random()*2-1)*this.size_y*0.5);
        this.scene.add(sphere);
        this.objects.push(sphere);
    }
	
    // Add Cylinder
    addRandomCylinder() {
        this.editStatus['action'] = 'none';
        const geometry = new THREE.CylinderGeometry(0.5, 0.5, 1, 32);
        const randomColor = new THREE.Color(Math.random(), Math.random(), Math.random());
        const material = new THREE.MeshStandardMaterial({ color: randomColor });
        //const material = new THREE.MeshStandardMaterial({ color: 0xff7700 });
        const cylinder = new THREE.Mesh(geometry, material);
        cylinder.position.set((Math.random()*2-1)*this.size_x*0.5, Math.random()*3, (Math.random()*2-1)*this.size_y*0.5);
        this.scene.add(cylinder);
        this.objects.push(cylinder);
    }
}
