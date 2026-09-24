// code-vr/spatial_ui.js
/**
 * Controlador de Interacción Espacial para Visores VR (Meta Quest 3S / Horizon OS).
 * - Raycaster para punteros láser de controladores Quest Touch Plus / Pro.
 * - Reconocimiento de gestos de pellizco (Pinch-to-click) con Hand Tracking v2.
 * - Proyección espacial sobre paneles cilíndricos y planos flotantes.
 */

(function() {
  'use strict';

  class SpatialUIController {
    constructor(scene, camera, renderer) {
      this.scene = scene;
      this.camera = camera;
      this.renderer = renderer;
      this.raycaster = new THREE.Raycaster();
      this.interactiveObjects = [];
      this.controllers = [];
      this.laserLines = [];
      this.initXRControllers();
    }

    registerInteractiveObject(mesh) {
      if (mesh && !this.interactiveObjects.includes(mesh)) {
        this.interactiveObjects.push(mesh);
      }
    }

    initXRControllers() {
      if (!this.renderer || !this.renderer.xr) return;

      for (let i = 0; i < 2; i++) {
        const controller = this.renderer.xr.getController(i);
        controller.addEventListener('selectstart', (e) => this.onSelectStart(e));
        controller.addEventListener('selectend', (e) => this.onSelectEnd(e));
        this.scene.add(controller);
        this.controllers.push(controller);

        // Crear rayo láser visible (puntero espacial 3D)
        const lineGeo = new THREE.BufferGeometry().setFromPoints([
          new THREE.Vector3(0, 0, 0),
          new THREE.Vector3(0, 0, -8)
        ]);
        const lineMat = new THREE.LineBasicMaterial({
          color: 0x7f5af0,
          transparent: true,
          opacity: 0.65,
          linewidth: 2
        });
        const laser = new THREE.Line(lineGeo, lineMat);
        controller.add(laser);
        this.laserLines.push(laser);
      }
    }

    onSelectStart(event) {
      const controller = event.target;
      const intersections = this.getIntersections(controller);
      if (intersections.length > 0) {
        const hit = intersections[0];
        if (hit.object && hit.object.userData && typeof hit.object.userData.onClick === 'function') {
          hit.object.userData.onClick(hit);
        }
      }
    }

    onSelectEnd(event) {
      // Fin de selección/pellizco
    }

    getIntersections(controller) {
      const tempMatrix = new THREE.Matrix4();
      tempMatrix.identity().extractRotation(controller.matrixWorld);
      this.raycaster.ray.origin.setFromMatrixPosition(controller.matrixWorld);
      this.raycaster.ray.direction.set(0, 0, -1).applyMatrix4(tempMatrix);
      return this.raycaster.intersectObjects(this.interactiveObjects, false);
    }

    update() {
      // Actualizar colisiones visuales de punteros láser
      for (let i = 0; i < this.controllers.length; i++) {
        const controller = this.controllers[i];
        const laser = this.laserLines[i];
        if (!controller || !laser) continue;

        const hits = this.getIntersections(controller);
        if (hits.length > 0) {
          laser.scale.z = hits[0].distance / 8.0;
          laser.material.color.setHex(0x2cb67d); // Verde al apuntar a un elemento interactivo
        } else {
          laser.scale.z = 1.0;
          laser.material.color.setHex(0x7f5af0); // Púrpura estándar
        }
      }
    }
  }

  window.SpatialUIController = SpatialUIController;
})();
