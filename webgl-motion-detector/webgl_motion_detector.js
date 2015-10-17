/**
 * Copyright (C) 2013-2015, Markus Sprunck
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

var stats, camera, scene, renderer;

if (Detector.webgl) {
	init();
	animate();
} else {
	document.body.appendChild(Detector.getWebGLErrorMessage());
}

function init() {

	// add container
	scene = new THREE.Scene();
	var container = document.getElementById('drawingArea');

	// add light
	var ambient = new THREE.AmbientLight(0xa0a0a0);
	scene.add(ambient);

	var directionalLight = new THREE.DirectionalLight(0xffeedd);
	directionalLight.position.set(-10, 10, 100);
	scene.add(directionalLight);

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
							scene.add(cube);
						});
					});
				});
			});
		});

	});

	var geometry = new THREE.BoxGeometry(4, 4, 4);
	var material = new THREE.MultiMaterial(cubeMaterials);
	var cube = new THREE.Mesh(geometry, material);

	// add camera
	camera = new THREE.PerspectiveCamera(50, window.innerWidth / window.innerHeight, 1, 2000);
	scene.add(camera);
	camera.position.set(0, 0, 10);
	camera.lookAt(scene.position);

	// add renderer
	renderer = new THREE.WebGLRenderer();
	renderer.setClearColor(0x0a0a0a, 1);

	// Support window resize
	var resizeCallback = function() {
		var offsetHeight = 150;
		var devicePixelRatio = window.devicePixelRatio || 1;
		var width = window.innerWidth * devicePixelRatio - 25;
		var height = (window.innerHeight - offsetHeight - 10) * devicePixelRatio;
		renderer.setSize(width, height);
		renderer.domElement.style.width = width + 'px';
		renderer.domElement.style.height = height + 'px';
		camera.updateProjectionMatrix();
	}
	window.addEventListener('resize', resizeCallback, false);
	resizeCallback();
	container.appendChild(renderer.domElement);

	// add motion detector
	var motionDetector = new SimpleMotionDetector(camera);
	motionDetector.domElement.style.position = 'absolute';
	motionDetector.domElement.style.left = '10px';
	motionDetector.domElement.style.top = '10px';
	motionDetector.init();
	container.appendChild(motionDetector.domElement);

	// dialog to change parameters
	var gui = new dat.GUI({
		autoPlace : false
	});
	gui.add(motionDetector, 'offsetAlpha', -45.0, 45.0, 5).name('offset α');
	gui.add(motionDetector, 'offsetGamma', -45.0, 45.0, 5).name('offset γ');
	gui.add(motionDetector, 'amplificationAlpha', 1.0, 5.0, 0.5).name('amplification α');
	gui.add(motionDetector, 'amplificationGamma', 1.0, 5.0, 0.5).name('amplification γ');
	gui.add(motionDetector, 'detectionBorder', 0.25, 1.0, 0.05).name('detection border');
	gui.add(motionDetector, 'pixelThreshold', 100, 250, 10).name('pixel threshold');
	gui.add(motionDetector.averageX, 'maxLength', 200, 2000, 100).name('averager X');
	gui.add(motionDetector.averageY, 'maxLength', 200, 2000, 100).name('averager Y');
	gui.domElement.style.position = 'absolute';
	gui.domElement.style.left = '10px';
	gui.domElement.style.top = '210px';
	container.appendChild(gui.domElement);
}

function animate() {
	requestAnimationFrame(animate);
	renderer.render(scene, camera);
}