// import { WebGLRenderer, Scene } from "three";

// var renderer, camera, scene, controls;

// function init() {
//   // Inititlize renderer
//   renderer = new WebGLRenderer({ antialias: true });
//   renderer.setPixelRatio(window.devicePixelRatio);
//   renderer.setSize(window.innerWidth, window.innerHeight);
//   document.body.appendChild(renderer.domElement);

//   // Initialize scene & light
//   scene = new Scene();
//   scene.add(new AmbientLight(0xbbbbbb, 0.3));
// }

// function addSpline() {
//   // Create a sine-like wave
//   const curve = new THREE.SplineCurve([
//     new THREE.Vector2(-10, 0),
//     new THREE.Vector2(-5, 5),
//     new THREE.Vector2(0, 0),
//     new THREE.Vector2(5, -5),
//     new THREE.Vector2(10, 0),
//   ]);

//   const points = curve.getPoints(50);
//   const geometry = new THREE.BufferGeometry().setFromPoints(points);

//   const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

//   // Create the final object to add to the scene
//   const splineObject = new THREE.Line(geometry, material);
//   scene.add(splineObject);
// }
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
const controls = new OrbitControls(camera, renderer.domElement);
// controls.enableRotate = false;
document.body.appendChild(renderer.domElement);

// Create a sine-like wave
const curve1 = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(1, 0, 0),
    new THREE.Vector3(3, 1, 0),
    new THREE.Vector3(4, 4, 0),
    new THREE.Vector3(3, 5, 0),
  ],
  false,
  "chordal"
);
const points1 = curve1.getPoints(80);

const curve2 = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(3, 5, 0),
    new THREE.Vector3(2, 3, 0),
    new THREE.Vector3(0.5, 5, 0),
  ],
  false,
  "chordal"
);
const points2 = curve2.getPoints(100);

const curve3 = new THREE.CatmullRomCurve3(
  [
    new THREE.Vector3(0.5, 5, 0),
    new THREE.Vector3(0.2, 7, 0),
    new THREE.Vector3(0, 8, 0),
  ],
  false,
  "chordal"
);
const points3 = curve3.getPoints(40);

const geometry = new THREE.BufferGeometry().setFromPoints([
  ...points1,
  ...points2,
  ...points3,
]);

const quaternion = new THREE.Quaternion();
quaternion.setFromAxisAngle(new THREE.Vector3(0, 1, 0), Math.PI);
const geometry2 = geometry.clone();
geometry2.applyQuaternion(quaternion);

const material = new THREE.LineBasicMaterial({ color: 0xff0000 });

const geometry3 = BufferGeometryUtils.mergeGeometries(
  [geometry, geometry2],
  true
);
// Create the final object to add to the scene
const splineObject = new THREE.Line(geometry3, material);
// const splineObject2 = new THREE.Line(geometry2, material);
scene.add(splineObject);
// scene.add(splineObject2);

camera.position.set(20, 20, 20);
camera.lookAt(0, 20, 0);
controls.update();
animate();

function animate() {
  requestAnimationFrame(animate);

  // required if controls.enableDamping or controls.autoRotate are set to true
  controls.update();

  renderer.render(scene, camera);
}
