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

	// /////////////////////////////////
	// Create all materials

	this.brownMaterial = new THREE.MeshPhongMaterial({
		color : 0x8B4513
	});

	this.brownLightMaterialerial = new THREE.MeshPhongMaterial({
		color : 0xD2691E
	});

	this.blackMaterial = new THREE.MeshPhongMaterial({
		color : 0x302925,
		shininess : 100,
		emissive : 0x111111,
		specular : 0x444444
	});

	this.blackIrisMaterial = new THREE.MeshPhongMaterial({
		color : 0x302944,
		shininess : 100,
		emissive : 0x111111,
		specular : 0xffffff
	});

	this.yellowMaterial = new THREE.MeshPhongMaterial({
		color : 0xfdd276
	});

	this.whiteMaterial = new THREE.MeshPhongMaterial({
		color : 0xffffff,
		shininess : 100,
		emissive : 0x111111,
		specular : 0xffffff
	});

	// /////////////////////////////////
	// Create all geometries

	var cylinderDevisions = 10;
	var bodyGeom = new THREE.CylinderGeometry(60, 90, 160, cylinderDevisions);
	modifier.modify(bodyGeom);

	this.legLength = 100;
	var legGeom = new THREE.CylinderGeometry(20, 43, this.legLength, cylinderDevisions);
	modifier.modify(legGeom);

	var clawGeometry = new THREE.CylinderGeometry(0, 7, 12, cylinderDevisions);

	var armRadius = 25;
	var armLegth = 100;
	var armGeom = new THREE.CylinderGeometry(30, armRadius, armLegth, cylinderDevisions);
	armGeom.applyMatrix(new THREE.Matrix4().makeTranslation(0, 25, 0));
	modifier.modify(armGeom);

	var pawGeometry = new THREE.CylinderGeometry(7, 7, 11, cylinderDevisions);

	var faceRadius = 70;
	var faceGeom = new THREE.CylinderGeometry(faceRadius, faceRadius, 70, cylinderDevisions);
	modifier.modify(faceGeom);

	var earRadius = 25;
	var earThickness = 20;
	var earGeom = new THREE.CylinderGeometry(earRadius, earRadius, earThickness, cylinderDevisions);
	modifier.modify(earGeom);

	var earInnerGeom = new THREE.CylinderGeometry(earRadius * 2 / 3, earRadius * 2 / 3, earThickness, cylinderDevisions);
	modifier.modify(earInnerGeom);

	var eyeGeom = new THREE.CylinderGeometry(15, 15, 12, cylinderDevisions * 2);
	modifier.modify(eyeGeom);

	var irisGeom = new THREE.CylinderGeometry(5, 5, 3, cylinderDevisions * 2);
	modifier.modify(irisGeom);

	var noseGeom = new THREE.CylinderGeometry(10, 10, 6, cylinderDevisions);
	modifier.modify(noseGeom);

	var mouthTopGeom = new THREE.CylinderGeometry(4, 4, 15, cylinderDevisions);
	var mouthGeometry = new THREE.TorusGeometry(12, 4, 20, 20, Math.PI / 6 * 7);
	var mouthEndGeometry = new THREE.SphereGeometry(4);

	// /////////////////////////////////
	// Create all meshes

	// body
	this.bodyPosZ = 0;
	this.bodyPosX = this.legLength;
	this.body = new THREE.Mesh(bodyGeom, this.brownMaterial);
	this.body.position.z = this.bodyPosZ;
	this.body.position.y = 110;
	this.body.scale.set(1, 1, 0.6);

	// left leg
	var legDistance = 50;
	this.leftLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.leftLeg.position.x = -legDistance;
	this.leftLeg.position.z = this.bodyPosZ;
	this.leftLeg.position.y = 0;
	this.leftLegClaw1 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw1.position.x = -legDistance + 15;
	this.leftLegClaw1.position.z = this.bodyPosZ + 29;
	this.leftLegClaw1.position.y = 7 - this.legLength / 2;
	this.leftLegClaw1.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw1.rotation.z = -Math.PI / 20;
	this.leftLegClaw2 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw2.position.x = -legDistance;
	this.leftLegClaw2.position.z = this.bodyPosZ + 33;
	this.leftLegClaw2.position.y = 7 - this.legLength / 2;
	this.leftLegClaw2.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw3 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.leftLegClaw3.position.x = -legDistance - 15;
	this.leftLegClaw3.position.z = this.bodyPosZ + 29;
	this.leftLegClaw3.position.y = 7 - this.legLength / 2;
	this.leftLegClaw3.rotation.x = Math.PI * 6 / 10;
	this.leftLegClaw3.rotation.z = Math.PI / 20;

	// right leg
	this.rightLeg = new THREE.Mesh(legGeom, this.brownMaterial);
	this.rightLeg.position.x = legDistance;
	this.rightLeg.position.z = this.bodyPosZ;
	this.rightLeg.position.y = 0;
	this.rightLegClaw1 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw1.position.x = legDistance - 15;
	this.rightLegClaw1.position.z = this.bodyPosZ + 29;
	this.rightLegClaw1.position.y = 7 - this.legLength / 2;
	this.rightLegClaw1.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw1.rotation.z = Math.PI / 20;
	this.rightLegClaw2 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw2.position.x = legDistance;
	this.rightLegClaw2.position.z = this.bodyPosZ + 33;
	this.rightLegClaw2.position.y = 7 - this.legLength / 2;
	this.rightLegClaw2.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw3 = new THREE.Mesh(clawGeometry, this.blackMaterial);
	this.rightLegClaw3.position.x = legDistance + 15;
	this.rightLegClaw3.position.z = this.bodyPosZ + 29;
	this.rightLegClaw3.position.y = 7 - this.legLength / 2;
	this.rightLegClaw3.rotation.x = Math.PI * 6 / 10;
	this.rightLegClaw3.rotation.z = -Math.PI / 20;

	// left arm
	var armDistance = 80;
	var armPosY = 150;
	this.leftArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.leftArm.position.z = this.bodyPosZ;
	this.leftPawMiddle = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPawMiddle.position.z = this.bodyPosZ + armRadius - 3;
	this.leftPawMiddle.position.y = armLegth - 55;
	this.leftPawMiddle.rotation.x = -Math.PI / 2;
	this.leftPaw1 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw1.position.z = this.bodyPosZ + armRadius - 4;
	this.leftPaw1.position.y = armLegth - 40;
	this.leftPaw1.rotation.x = -Math.PI / 2;
	this.leftPaw1.scale.set(0.7, 0.7, 0.7);
	this.leftPaw2 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw2.position.z = this.bodyPosZ + armRadius - 4;
	this.leftPaw2.position.y = armLegth - 42;
	this.leftPaw2.rotation.x = -Math.PI / 2;
	this.leftPaw2.position.x = 9;
	this.leftPaw2.scale.set(0.7, 0.7, 0.7);
	this.leftPaw3 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.leftPaw3.position.z = this.bodyPosZ + armRadius - 4;
	this.leftPaw3.position.y = armLegth - 42;
	this.leftPaw3.rotation.x = -Math.PI / 2;
	this.leftPaw3.position.x = -9;
	this.leftPaw3.scale.set(0.7, 0.7, 0.7);

	// right arm
	this.rightArm = new THREE.Mesh(armGeom, this.brownMaterial);
	this.rightArm.position.z = this.bodyPosZ;
	this.rightPawMiddle = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPawMiddle.position.z = this.bodyPosZ + armRadius - 3;
	this.rightPawMiddle.position.y = armLegth - 55;
	this.rightPawMiddle.rotation.x = -Math.PI / 2;
	this.rightPaw1 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw1.position.z = this.bodyPosZ + armRadius - 4;
	this.rightPaw1.position.y = armLegth - 40;
	this.rightPaw1.rotation.x = -Math.PI / 2;
	this.rightPaw1.scale.set(0.7, 0.7, 0.7);
	this.rightPaw2 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw2.position.z = this.bodyPosZ + armRadius - 4;
	this.rightPaw2.position.y = armLegth - 42;
	this.rightPaw2.rotation.x = -Math.PI / 2;
	this.rightPaw2.position.x = 9;
	this.rightPaw2.scale.set(0.7, 0.7, 0.7);
	this.rightPaw3 = new THREE.Mesh(pawGeometry, this.blackMaterial);
	this.rightPaw3.position.z = this.bodyPosZ + armRadius - 4;
	this.rightPaw3.position.y = armLegth - 42;
	this.rightPaw3.rotation.x = -Math.PI / 2;
	this.rightPaw3.position.x = -9;
	this.rightPaw3.scale.set(0.7, 0.7, 0.7);

	// face
	this.face = new THREE.Mesh(faceGeom, this.brownMaterial);
	this.face.rotation.x = -Math.PI / 2;

	// eyes
	this.eyeDistance = 28;
	this.eyePosY = 25;
	this.leftEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.leftEye.position.x = this.eyeDistance;
	this.leftEye.position.z = +31;
	this.leftEye.position.y = this.eyePosY;
	this.leftEye.rotation.x = -Math.PI / 2;

	this.rightEye = new THREE.Mesh(eyeGeom, this.whiteMaterial);
	this.rightEye.position.x = -this.eyeDistance;
	this.rightEye.position.z = +31;
	this.rightEye.position.y = this.eyePosY;
	this.rightEye.rotation.x = -Math.PI / 2;

	// iris
	this.leftIris = new THREE.Mesh(irisGeom, this.blackIrisMaterial);
	this.leftIris.position.x = this.eyeDistance;
	this.leftIris.position.z = +35 + 2;
	this.leftIris.position.y = this.eyePosY;
	this.leftIris.rotation.x = -Math.PI / 2;

	this.rightIris = new THREE.Mesh(irisGeom, this.blackIrisMaterial);
	this.rightIris.position.x = -this.eyeDistance;
	this.rightIris.position.z = +35 + 2;
	this.rightIris.position.y = this.eyePosY;
	this.rightIris.rotation.x = -Math.PI / 2;

	// nose
	var noseTopPosition = 5;
	this.nose = new THREE.Mesh(noseGeom, this.blackMaterial);
	this.nose.position.x = 0;
	this.nose.position.z = +37;
	this.nose.position.y = -noseTopPosition;
	this.nose.rotation.x = -Math.PI / 2;

	// mouth top
	this.mouthTop = new THREE.Mesh(mouthTopGeom, this.blackMaterial);
	this.mouthTop.position.z = +35;
	this.mouthTop.position.y = -noseTopPosition - 13;
	this.mouthTop.position.x = 0;

	// mouth left side
	this.mouthLeft = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthLeft.position.z = +35;
	this.mouthLeft.position.y = -noseTopPosition - 20;
	this.mouthLeft.position.x = -12;
	this.mouthLeft.rotation.z = Math.PI;
	this.mouthLeft.rotation.y = -Math.PI;

	this.mouthEndLeft = new THREE.Mesh(mouthEndGeometry, this.blackMaterial);
	this.mouthEndLeft.position.z = +35.2;
	this.mouthEndLeft.position.y = -noseTopPosition - 14;
	this.mouthEndLeft.position.x = -22.4;

	// mouth right side
	this.mouthRight = new THREE.Mesh(mouthGeometry, this.blackMaterial);
	this.mouthRight.position.z = +35;
	this.mouthRight.position.y = -noseTopPosition - 20;
	this.mouthRight.position.x = 12;
	this.mouthRight.rotation.z = Math.PI;

	this.mouthEndRight = new THREE.Mesh(mouthEndGeometry, this.blackMaterial);
	this.mouthEndRight.position.z = +35.2;
	this.mouthEndRight.position.y = -noseTopPosition - 14;
	this.mouthEndRight.position.x = 22.4;

	// ears
	var earXPos = 55;
	var earYPos = 55;
	var earZPos = 0;
	this.rightEarGroup = new THREE.Group();
	this.rightEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.rightEar.position.x = -earXPos - 7;
	this.rightEar.position.y = earYPos;
	this.rightEar.position.z = earZPos;
	this.rightEar.rotation.x = -Math.PI / 2;
	this.rightEarGroup.add(this.rightEar);

	this.rightEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.rightEarInner.position.x = -earXPos - 7;
	this.rightEarInner.position.y = earYPos;
	this.rightEarInner.position.z = earZPos + 2;
	this.rightEarInner.rotation.x = -Math.PI / 2;
	this.rightEarGroup.add(this.rightEarInner);

	this.leftEarGroup = new THREE.Group();
	this.leftEar = new THREE.Mesh(earGeom, this.brownMaterial);
	this.leftEar.position.x = earXPos;
	this.leftEar.position.y = earYPos;
	this.leftEar.position.z = earZPos;
	this.leftEar.rotation.x = -Math.PI / 2;
	this.leftEarGroup.add(this.leftEar);

	this.leftEarInner = new THREE.Mesh(earInnerGeom, this.brownLightMaterialerial);
	this.leftEarInner.position.x = earXPos;
	this.leftEarInner.position.y = earYPos;
	this.leftEarInner.position.z = earZPos + 2;
	this.leftEarInner.rotation.x = -Math.PI / 2;
	this.leftEarGroup.add(this.leftEarInner);

	// Create head group
	this.headGroup = new THREE.Group();
	this.headGroup.add(this.face);
	this.headGroup.add(this.rightEarGroup);
	this.headGroup.add(this.leftEarGroup);
	this.headGroup.add(this.nose);
	this.headGroup.add(this.leftEye);
	this.headGroup.add(this.rightEye);
	this.headGroup.add(this.leftIris);
	this.headGroup.add(this.rightIris);
	this.headGroup.add(this.mouthTop);
	this.headGroup.add(this.mouthLeft);
	this.headGroup.add(this.mouthEndLeft);
	this.headGroup.add(this.mouthRight);
	this.headGroup.add(this.mouthEndRight);

	this.headGroup.applyMatrix(new THREE.Matrix4().makeTranslation(0, 250, this.bodyPosZ));

	// Create left arm Group
	this.leftArmGroup = new THREE.Group();
	this.leftArmGroup.add(this.leftArm);
	this.leftArmGroup.add(this.leftPawMiddle);
	this.leftArmGroup.add(this.leftPaw1);
	this.leftArmGroup.add(this.leftPaw2);
	this.leftArmGroup.add(this.leftPaw3);
	this.leftArmGroup.position.x = -armDistance;
	this.leftArmGroup.position.y = armPosY;

	// Create left arm Group
	this.rightArmGroup = new THREE.Group();
	this.rightArmGroup.add(this.rightArm);
	this.rightArmGroup.add(this.rightPawMiddle);
	this.rightArmGroup.add(this.rightPaw1);
	this.rightArmGroup.add(this.rightPaw2);
	this.rightArmGroup.add(this.rightPaw3);
	this.rightArmGroup.position.x = armDistance;
	this.rightArmGroup.position.y = armPosY;

	// Create body group
	this.bodyGroup = new THREE.Group();
	this.bodyGroup.add(this.body);
	this.bodyGroup.add(this.leftArmGroup);
	this.bodyGroup.add(this.rightArmGroup);
	this.bodyGroup.add(this.leftLeg);
	this.bodyGroup.add(this.leftLegClaw1);
	this.bodyGroup.add(this.leftLegClaw2);
	this.bodyGroup.add(this.leftLegClaw3);
	this.bodyGroup.add(this.rightLeg);
	this.bodyGroup.add(this.rightLegClaw1);
	this.bodyGroup.add(this.rightLegClaw2);
	this.bodyGroup.add(this.rightLegClaw3);

	this.allGroup = new THREE.Group();
	this.allGroup.add(this.headGroup);
	this.allGroup.add(this.bodyGroup);
	this.allGroup.traverse(function(object) {
		if (object instanceof THREE.Mesh) {
			object.castShadow = true;
			object.receiveShadow = true;
		}
	});
	this.rightIris.castShadow = false;
	this.rightIris.receiveShadow = false;
	this.leftIris.castShadow = false;
	this.leftIris.receiveShadow = false;
}

Teddy.prototype.move = function(xTarget, yTarget, xTargetMaxAbs, yTargetMaxAbs) {

	this.tHeagRotY = calculateRotation(xTarget, -yTargetMaxAbs, yTargetMaxAbs, -Math.PI / 3, Math.PI / 3);
	this.tHeadRotX = calculateRotation(yTarget, -xTargetMaxAbs, xTargetMaxAbs, -Math.PI / 4, Math.PI / 4);

	this.tHeadPosX = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, 10, -10);
	this.tHeadPosY = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, 300, 240);
	this.tHeadPosZ = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, -60, 100) + this.bodyPosZ;

	this.irisPosX = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, -500, 500)
	this.irisPosY = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, -500, 500)

	this.rightEarGroupRotX = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, -Math.PI / 10, Math.PI / 10);
	this.rightEarGroupRotY = calculateRotation(yTarget, -yTargetMaxAbs, yTargetMaxAbs, -Math.PI / 10, Math.PI / 10);

	this.tArmRotationRight = -calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 4, Math.PI);
	this.tArmRotationLeft = calculateRotation(xTarget, -xTargetMaxAbs, xTargetMaxAbs, Math.PI / 4, Math.PI);

	this.tBodyRotZ = calculateRotation(xTarget, -200, 200, -Math.PI / 6, Math.PI / 6);
	this.tBodyRotX = calculateRotation(yTarget, -200, 200, -Math.PI / 6, Math.PI / 6);

	this.updateNextStep(40);
}

Teddy.prototype.updateNextStep = function(step) {

	this.headGroup.rotation.y += (this.tHeagRotY - this.headGroup.rotation.y) / step;
	this.headGroup.rotation.x += (this.tHeadRotX - this.headGroup.rotation.x) / step;
	this.headGroup.position.z += (this.tHeadPosZ - this.headGroup.position.z) / step;

	this.rightEarGroup.rotation.x += (this.rightEarGroupRotX - this.rightEarGroup.rotation.x) / step;
	this.rightEarGroup.rotation.y += (this.rightEarGroupRotY - this.rightEarGroup.rotation.y) / step;
	this.leftEarGroup.rotation.x += (this.rightEarGroupRotX - this.leftEarGroup.rotation.x) / step;
	this.leftEarGroup.rotation.y += (this.rightEarGroupRotY - this.leftEarGroup.rotation.y) / step;

	this.leftArmGroup.rotation.z += (this.tArmRotationLeft - this.leftArmGroup.rotation.z) / step;
	this.rightArmGroup.rotation.z += (this.tArmRotationRight - this.rightArmGroup.rotation.z) / step;

	this.body.rotation.x += (this.tBodyRotX - this.body.rotation.x) / step;
	this.bodyGroup.rotation.z += (this.tBodyRotZ - this.bodyGroup.rotation.z) / step;
	this.headGroup.position.z += (+this.bodyPosZ - this.headGroup.position.z) / step;

	this.leftIris.position.x = 1 + this.eyeDistance + (this.irisPosX - this.leftIris.position.x) / 2 / step;
	this.rightIris.position.x = -1 - this.eyeDistance + (this.irisPosX - this.rightIris.position.x) / 2 / step;
	this.leftIris.position.y = this.eyePosY - (this.irisPosY - this.leftIris.position.y) / 2 / step;
	this.rightIris.position.y = this.eyePosY - (this.irisPosY - this.rightIris.position.y) / 2 / step;
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
