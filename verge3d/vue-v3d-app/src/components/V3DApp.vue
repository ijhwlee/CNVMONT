<template>
  <div :id="containerId">
    <button @click="reloadApp()">Reload App</button>
    <div
      :id="fsButtonId"
      class="fullscreen-button fullscreen-open"
      title="Toggle fullscreen mode"
    ></div>
  </div>
</template>

<script>
import { createApp } from '../v3dApp/app';

export default {
  name: 'V3DApp',

  created() {
    this.app = null;
    this.PL = null,

    this.uuid = window.crypto.randomUUID();
    this.containerId = `v3d-container-${this.uuid}`;
    this.fsButtonId = `fullscreen-button-${this.uuid}`;
    this.sceneURL = 'v3dApp/app.gltf';

    this.loadApp = async function() {
      ({ app: this.app, PL: this.PL } = await createApp({
        containerId: this.containerId,
        fsButtonId: this.fsButtonId,
        sceneURL: this.sceneURL,
      }));
    }

    this.disposeApp = function() {
      this.app?.dispose();
      this.app = null;

      // dispose Puzzles' visual logic
      this.PL?.dispose();
      this.PL = null;
    }

    this.reloadApp = function() {
      this.disposeApp();
      this.loadApp();
    }
  },

  mounted() {
    this.loadApp();
  },

  beforeUnmount() {
    this.disposeApp();
  },
}
</script>

<style>
@import '../v3dApp/app.css';
</style>
