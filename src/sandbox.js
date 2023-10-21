import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

let renderer, camera, scene, controls, pointer, raycaster, helper, plane;

init();

function init() {
  initEnvironment();
  renderer.render(scene, camera);
  animate();
}

// set up ThreeJs environment like scene, camera, light, etc.
function initEnvironment() {
  // initialize event listeners
  window.addEventListener("resize", onWindowResize, false);
  // window.addEventListener("pointermove", onPointerMove);
  window.addEventListener("click", onMouseClick);
  // initialize renderer
  renderer = new THREE.WebGLRenderer({ antialias: true });
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // initialize scene and camera
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0x000000);
  camera = new THREE.OrthographicCamera(
    window.innerWidth / -0.8,
    window.innerWidth / 0.8,
    window.innerHeight / 0.8,
    window.innerHeight / -0.8,
    100,
    1000
  );
  camera.updateProjectionMatrix();
  camera.position.z = 1000;
  controls = new OrbitControls(camera, renderer.domElement);
  controls.enableRotate = false;
  controls.enableDamping = true;
  controls.dampingFactor = 0.02;
  controls.minZoom = 0.5;
  controls.maxZoom = 4;
  scene.add(camera);

  //  initialize plane, grid and helper vectors
  const planeGeometry = new THREE.PlaneGeometry(2000, 2000);
  const planeMaterial = new THREE.MeshBasicMaterial({
    color: 0x000000,
    side: THREE.DoubleSide,
  });
  plane = new THREE.Mesh(planeGeometry, planeMaterial);
  // plane.rotation.x = -Math.PI / 2;
  scene.add(plane);

  helper = new THREE.GridHelper(2000, 20, 0xffff00);
  helper.position.y = 0;
  helper.material.transparent = true;
  helper.rotation.x = -Math.PI / 2;
  scene.add(helper);

  // temporary helper line
  const material = new THREE.LineBasicMaterial({ color: 0xff0000 });
  const geometry = new THREE.BufferGeometry().setFromPoints([
    vec(0, 0, 0),
    vec(1000, 1000, 0),
  ]);
  const line = new THREE.Line(geometry, material);
  scene.add(line);

  // raycasting
  raycaster = new THREE.Raycaster();
  pointer = new THREE.Vector2();
}

function animate() {
  requestAnimationFrame(animate);
  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();
  renderer.render(scene, camera);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function onPointerMove(event) {}
function onMouseClick() {
  pointer.x = (event.clientX / renderer.domElement.clientWidth) * 2 - 1;
  pointer.y = -(event.clientY / renderer.domElement.clientHeight) * 2 + 1;
  raycaster.setFromCamera(pointer, camera);
  const intersects = raycaster.intersectObject(plane);

  // add a dot on click
  const geometry = new THREE.CircleGeometry(10, 32);
  const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
  const circle = new THREE.Mesh(geometry, material);
  circle.position.set(0, 0, 0);
  circle.position.copy(intersects[0].point);
  scene.add(circle);
}
function vec(x, y, z) {
  return new THREE.Vector3(x, y, z);
}
