/**
 * Copyright (C) 2016, Markus Sprunck
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

Teddy = function() {

	var modifier = new THREE.SubdivisionModifier(2);

	// Create all materials
	this.brownMaterial = new THREE.MeshLambertMaterial({
		color : 0x8B4513,
		shading : THREE.FlatShading
	});

	this.brownLightMaterialerial = new THREE.MeshLambertMaterial({
		color : 0xD2691E,
		shading : THREE.FlatShading
	});

	this.blackMaterial = new THREE.MeshLambertMaterial({
		color : 0x302925,
		shading : THREE.FlatShading
	});

	this.yellowMaterial = new THREE.MeshLambertMaterial({
		color : 0xfdd276,
		shading : THREE.FlatShading
	});

	this.whiteMaterial = new THREE.MeshLambertMaterial({
		color : 0xffffff,
		shading : THREE.FlatShading
	});

	// Create all geometries
	var bodyGeom = new THREE.CylinderGeometry(60, 90, 160, 12);
	modifier.modify(bodyGeom);

	var legGeom = new THREE.CylinderGeometry(20, 40, 80, 12);
	modifier.modify(legGeom);

	var armGeom = new THREE.CylinderGeometry(20, 30, 90, 12);
	armGeom.applyMatrix( new THREE.Matrix4().makeTranslation( 0, 25, 0 ) );
    modifier.modify(armGeom);

	var faceGeom = new THREE.CylinderGeometry(70, 70, 70, 20);
	modifier.modify(faceGeom);

	var earGeom = new THREE.CylinderGeometry(30, 30, 20, 20);
	modifier.modify(earGeom);

	var earInnerGeom = new THREE.CylinderGeometry(20, 20, 20, 20);
	modifier.modify(earInnerGeom);

	var eyeGeom = new THREE.CylinderGeometry(15, 15, 6, 20);
	modifier.modify(eyeGeom);

	var irisGeom = new THREE.CylinderGeometry(5, 5, 5, 20);
	var noseGeom = new THREE.CylinderGeometry(10, 10, 6, 20);
	var mouthTopGeom = new THREE.CylinderGeometry(4, 4, 15, 20);
	var mouthGeometry = new THREE.TorusGeometry(12, 4, 20, 20, Math.PI);

	// Create all meshes

	// body
	this.body = new THREE.Mesh(bodyGeom, this.brownMaterial);
	this.body.position.z = 50;
	this.body.position.y = 110;

	// left leg
	var legDistance = 50;
	this.leftLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.leftLeg.position.x = -legDistance;
	this.leftLeg.position.z = 70;
	this.leftLeg.position.y = 0;

	// right leg
	this.rightLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.rightLeg.position.x = legDistance;
	this.rightLeg.position.z = 70;
	this.rightLeg.position.y = 0;

	// left arm
	var armDistance = 80;
	var armPosY = 150;
	this.leftArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.leftArm.position.x = -armDistance;
	this.leftArm.position.z = 70;
	this.leftArm.position.y = armPosY;

	// right arm
	this.rightArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.rightArm.position.x = armDistance;
	this.rightArm.position.z = 70;
	this.rightArm.position.y = armPosY;

	// face
	this.face = new THREE.Mesh(faceGeom, this.brownMaterial);
	this.face.position.z = 135;
	this.face.rotation.x = -Math.PI / 2;

	// eyes
	var eyeDistance = 28;
	this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.leftEye.position.x = eyeDistance;
	this.leftEye.position.z = 170;
	this.leftEye.position.y = 25;
	this.leftEye.rotation.x = -Math.PI / 2;

	this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.rightEye.position.x = -eyeDistance;
	this.rightEye.position.z = 170;
	this.rightEye.position.y = 25;
	this.rightEye.rotation.x = -Math.PI / 2;

	// iris
	this.leftIris = new THREE.Mesh(irisGeom, this.blackMaterial);
	this.leftIris.position.x = eyeDistance;
	this.leftIris.position.z = 170 + 2;
	this.leftIris.position.y = 25;
	this.leftIris.rotation.x = -Math.PI / 2;

	this.rightIris = new THREE.Mesh(irisGeom, this.blackMaterial);
	this.rightIris.position.x = -eyeDistance;
	this.rightIris.position.z = 170 + 2;
	this.rightIris.position.y = 25;
	this.rightIris.rotation.x = -Math.PI / 2;

	// nose
	var noseTopPosition = 5;
	this.nose = new THREE.Mesh(noseGeom, this.blackMaterial);
	this.nose.position.x = 0;
	this.nose.position.z = 170;
	this.nose.position.y = -noseTopPosition;
	this.nose.rotation.x = -Math.PI / 2;

	// mouth top
	this.mouthTop = new THREE.Mesh(mouthTopGeom, this.blackMaterial);
	this.mouthTop.position.z = 170;
	this.mouthTop.position.y = -noseTopPosition - 13;
	this.mouthTop.position.x = 0;

	// mouth left side
	this.mouthLeft = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthLeft.position.z = 170;
	this.mouthLeft.position.y = -noseTopPosition - 20;
	this.mouthLeft.position.x = -12;
	this.mouthLeft.rotation.z = Math.PI;

	// mouth right side
	this.mouthRight = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthRight.position.z = 170;
	this.mouthRight.position.y = -noseTopPosition - 20;
	this.mouthRight.position.x = 12;
	this.mouthRight.rotation.z = Math.PI;

	// ears
	var earPostionZ = 135;
	this.rightEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.rightEar.position.x = -50;
	this.rightEar.position.y = 50;
	this.rightEar.position.z = earPostionZ;
	this.rightEar.rotation.x = -Math.PI / 2;

	this.rightEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.rightEarInner.position.x = -50;
	this.rightEarInner.position.y = 50;
	this.rightEarInner.position.z = earPostionZ + 2;
	this.rightEarInner.rotation.x = -Math.PI / 2;

	this.leftEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.leftEar.position.x = 50;
	this.leftEar.position.y = 50;
	this.leftEar.position.z = earPostionZ;
	this.leftEar.rotation.x = -Math.PI / 2;

	this.leftEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.leftEarInner.position.x = 50;
	this.leftEarInner.position.y = 50;
	this.leftEarInner.position.z = earPostionZ + 2;
	this.leftEarInner.rotation.x = -Math.PI / 2;

	// Create head group
	this.headGroup = new THREE.Group();
	this.headGroup.add(this.face);
	this.headGroup.add(this.rightEar);
	this.headGroup.add(this.leftEar);
	this.headGroup.add(this.rightEarInner);
	this.headGroup.add(this.leftEarInner);
	this.headGroup.add(this.nose);
	this.headGroup.add(this.leftEye);
	this.headGroup.add(this.rightEye);
	this.headGroup.add(this.leftIris);
	this.headGroup.add(this.rightIris);
	this.headGroup.add(this.mouthTop);
	this.headGroup.add(this.mouthLeft);
	this.headGroup.add(this.mouthRight);

	// Create body group
	this.bodyGroup = new THREE.Group();
	this.bodyGroup.add(this.body);
	this.bodyGroup.add(this.leftArm);
	this.bodyGroup.add(this.rightArm);
	this.bodyGroup.add(this.leftLeg);
	this.bodyGroup.add(this.rightLeg);

	// Create all group
	this.allGroup = new THREE.Group();
	this.allGroup.add(this.headGroup);
	this.allGroup.add(this.bodyGroup);
	this.allGroup.traverse(function(object) {
		if (object instanceof THREE.Mesh) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	});
}

Teddy.prototype.move = function(xTarget, yTarget, xTargetMaxAbs, yTargetMaxAbs) {

	// console.log("xTarget="+ xTarget + " yTarget="+yTarget);

	this.tHeagRotY = calculateRotation(xTarget, -yTargetMaxAbs, yTargetMaxAbs, -Math.PI / 3, Math.PI / 3);
	this.tHeadRotX = calculateRotation(yTarget, -xTargetMaxAbs, xTargetMaxAbs, -Math.PI / 3, Math.PI / 3);
	this.tHeadPosX = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, 170, -170);
	this.tHeadPosY = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, 20, 100) + 170;
	this.tHeadPosZ = -50;
	
	this.tArmRotationRight = - calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 2, Math.PI);
	this.tArmRotationLeft  =  calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 2, Math.PI);
	
	this.tEyeScale = 2;
	this.tIrisYScale = 2;
	this.tIrisZScale = 1;
	this.tIrisPosY = calculateRotation(yTarget, -200, 200, 35, 15);
	this.tLeftIrisPosZ = calculateRotation(xTarget, -200, 200, 130, 110);
	this.tRightIrisPosZ = calculateRotation(xTarget, -200, 200, 110, 130);

	this.tBodyRotZ = calculateRotation(xTarget, -200, 200, -Math.PI / 8, Math.PI / 8);

	this.updateNextStep(40);
}

Teddy.prototype.updateNextStep = function(step) {

	this.headGroup.rotation.y += (this.tHeagRotY - this.headGroup.rotation.y) / step;
	this.headGroup.rotation.x += (this.tHeadRotX - this.headGroup.rotation.x) / step;
	this.headGroup.position.x += (this.tHeadPosX - this.headGroup.position.x) / step;
	this.headGroup.position.y += (this.tHeadPosY - this.headGroup.position.y) / step;
	this.headGroup.position.z += (this.tHeadPosZ - this.headGroup.position.z) / step;
	
	this.leftArm.rotation.z += (this.tArmRotationLeft - this.leftArm.rotation.z) / step;
	this.rightArm.rotation.z += (this.tArmRotationRight - this.rightArm.rotation.z) / step;

	this.bodyGroup.rotation.z += (this.tBodyRotZ - this.bodyGroup.rotation.z) / step;
}

/**
 * Helper to calculate rotation angle from detector position
 */
function calculateRotation(v, vmin, vmax, minAngle, maxAngle) {
	var value = Math.max(Math.min(v, vmax), vmin);
	var deltaValue = vmax - vmin;
	var fraction = (value - vmin) / deltaValue;
	var deltaAngle = maxAngle - minAngle;
	var result = minAngle + (fraction * deltaAngle);
	return result;
}
