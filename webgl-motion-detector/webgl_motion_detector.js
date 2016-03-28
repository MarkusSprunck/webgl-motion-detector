/**
 * Copyright (C) 2013-2016, Markus Sprunck
 * 
 * All rights reserved.
 * 
 * Redistribution and use in source and binary forms, with or without
 * modification, are permitted provided that the following conditions are met: -
 * Redistributions of source code must retain the above copyright notice, this
 * list of conditions and the following disclaimer. - Redistributions in binary
 * form must reproduce the above copyright notice, this list of conditions and
 * the following disclaimer in the documentation and/or other materials provided
 * with the distribution. - The name of its contributor may be used to endorse
 * or promote products derived from this software without specific prior written
 * permission.
 * 
 * THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS"
 * AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE
 * IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE
 * ARE DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS BE
 * LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR
 * CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF
 * SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS
 * INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN
 * CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE)
 * ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE
 * POSSIBILITY OF SUCH DAMAGE.
 * 
 */

/**
 * Global constants
 */
var BORDER_LEFT = 10;
var BORDER_TOP = 10;
var BORDER_RIGHT = 10;
var BORDER_BOTTOM = 60;

/**
 * Global variables for rendering
 */
var g_panelWidthWebGL;
var g_panelHeightWebGL;
var g_scene;
var g_cube_wireframe;
var g_camera;
var g_renderer;
var g_control;
var g_gui;

var g_stats, g_camera, g_scene, g_renderer;

if (Detector.webgl) {
	init();
	animate();
} else {
	document.body.appendChild(Detector.getWebGLErrorMessage());
}

function resetCamera() {
	"use strict";
	g_camera.lookAt(new THREE.Vector3(0, 0, 0));
}

function init() {

	// add container
	g_scene = new THREE.Scene();
	var container = document.getElementById('drawingArea');
	container.style.background = "#252525";
	
	// add light
	var ambient = new THREE.AmbientLight(0xa0a0a0);
	g_scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(-10, 10, 100);
	g_scene.add(directionalLight);

	// add cube with six textures
	var cubeMaterials = [];
	var loader = new THREE.TextureLoader();
	loader.load('xpos.png', function(texture) {
		var mat = new THREE.MeshLambertMaterial({
			map : texture
		});
		cubeMaterials.push(mat);

		loader.load('xneg.png', function(texture) {
			var mat = new THREE.MeshLambertMaterial({
				map : texture
			});
			cubeMaterials.push(mat);

			loader.load('ypos.png', function(texture) {
				var mat = new THREE.MeshLambertMaterial({
					map : texture
				});
				cubeMaterials.push(mat);

				loader.load('yneg.png', function(texture) {
					var mat = new THREE.MeshLambertMaterial({
						map : texture
					});
					cubeMaterials.push(mat);

					loader.load('zpos.png', function(texture) {
						var mat = new THREE.MeshLambertMaterial({
							map : texture
						});
						cubeMaterials.push(mat);

						loader.load('zneg.png', function(texture) {
							var mat = new THREE.MeshLambertMaterial({
								map : texture
							});
							cubeMaterials.push(mat);

							// now all textures have been loaded
							g_scene.add(cube);
						});
					});
				});
			});
		});

	});

	var geometry = new THREE.BoxGeometry(3, 3, 3);
	var material = new THREE.MultiMaterial(cubeMaterials);
	var cube = new THREE.Mesh(geometry, material);

	// add g_camera
	g_camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
	g_scene.add(g_camera);
	g_camera.position.set(0, 0, 10);
	g_camera.lookAt(g_scene.position);

	// add g_renderer
	g_renderer = new THREE.WebGLRenderer();
	g_renderer.setClearColor(0x252525, 1);

	// Support window resize
	var resizeCallback = function() {
		  g_camera.aspect = window.innerWidth / window.innerHeight;
		  g_camera.updateProjectionMatrix();
		  g_renderer.setSize(window.innerWidth, window.innerHeight);
	}
	window.addEventListener('resize', resizeCallback, false);
	resizeCallback();
	container.appendChild(g_renderer.domElement);
	
	// add motion detector
	var motionDetector = new SimpleMotionDetector(g_camera);
	motionDetector.domElement.style.position = 'absolute';
	motionDetector.domElement.style.right = '10px';
	motionDetector.domElement.style.bottom = '10px';
	motionDetector.init();
	container.appendChild(motionDetector.domElement);

	// dialog to change parameters
	g_gui = new dat.GUI({
		autoPlace : false
	});
	g_gui.add(motionDetector, 'offsetAlpha', -45.0, 45.0, 5).name('offset α');
	g_gui.add(motionDetector, 'offsetGamma', -45.0, 45.0, 5).name('offset γ');
	g_gui.add(motionDetector, 'amplificationAlpha', 1.0, 5.0, 0.5).name('amplification α');
	g_gui.add(motionDetector, 'amplificationGamma', 1.0, 5.0, 0.5).name('amplification γ');
	g_gui.add(motionDetector, 'detectionBorder', 0.25, 1.0, 0.05).name('detection border');
	g_gui.add(motionDetector, 'pixelThreshold', 100, 250, 10).name('pixel threshold');
	g_gui.add(motionDetector.averageX, 'maxLength', 200, 2000, 100).name('averager X');
	g_gui.add(motionDetector.averageY, 'maxLength', 200, 2000, 100).name('averager Y');
	g_gui.domElement.style.position = 'absolute';
	g_gui.domElement.style.left = '10px';
	g_gui.domElement.style.top = '10px';
	g_gui.close();
	container.appendChild(g_gui.domElement);

	var resizeCallback = function() {
		g_panelWidthWebGL = window.innerWidth - BORDER_RIGHT - BORDER_LEFT;
		g_panelHeightWebGL = window.innerHeight - BORDER_BOTTOM - BORDER_TOP;
		var devicePixelRatio = window.devicePixelRatio || 1;
		g_renderer.setSize(g_panelWidthWebGL * devicePixelRatio,
				g_panelHeightWebGL * devicePixelRatio);
		g_renderer.domElement.style.width = g_panelWidthWebGL + 'px';
		g_renderer.domElement.style.height = g_panelHeightWebGL + 'px';
		resetCamera();
		g_camera.updateProjectionMatrix();
		g_gui.domElement.style.position = 'absolute';
		g_gui.domElement.style.left = '' + (BORDER_LEFT) + 'px';
		g_gui.domElement.style.top = '' + (BORDER_TOP) + 'px';
	};
	window.addEventListener('resize', resizeCallback, false);
	resizeCallback();
}

function animate() {
	requestAnimationFrame(animate);
	g_renderer.render(g_scene, g_camera);
}