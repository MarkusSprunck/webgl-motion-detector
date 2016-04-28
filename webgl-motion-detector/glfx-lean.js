/*
 * This class is based on glfx.js
 */

/*
 * glfx.js
 * http://evanw.github.com/glfx.js/
 *
 * Copyright 2011 Evan Wallace
 * Released under the MIT license
 */
var fx = (function() {
	
	var exports = {};

	// src/core/canvas.js
	var gl;

	function wrapTexture(texture) {
		return {
			_ : texture,
			loadContentsOf : function(element) {
				// Make sure that we're using the correct global WebGL context
				gl = this._.gl;
				this._.loadContentsOf(element);
			},
			destroy : function() {
				// Make sure that we're using the correct global WebGL context
				gl = this._.gl;
				this._.destroy();
			}
		};
	}

	function texture(element) {
		return wrapTexture(Texture.fromElement(element));
	}

	function initialize(width, height) {
		var type = gl.UNSIGNED_BYTE;
		this.width = width;
		this.height = height;
		this._.texture = new Texture(width, height, gl.RGBA, type);
		this._.spareTexture = new Texture(width, height, gl.RGBA, type);
		this._.flippedShader = this._.flippedShader
				|| new Shader(
						null,
						'\
				        uniform sampler2D texture;\
				        varying vec2 texCoord;\
				        void main() {\
				            gl_FragColor = texture2D(texture, vec2(texCoord.x, 1.0 - texCoord.y));\
				        }\
					');
		this._.isInitialized = true;
	}

	/*
	 * Draw a texture to the canvas, with an optional width and height to scale
	 * to. If no width and height are given then the original texture width and
	 * height are used.
	 */
	function draw(texture, width, height) {
		if (!this._.isInitialized || texture._.width != this.width || texture._.height != this.height) {
			initialize.call(this, width ? width : texture._.width, height ? height : texture._.height);
		}

		texture._.use();
		this._.texture.drawTo(function() {
			Shader.getDefaultShader().drawRect();
		});

		return this;
	}

	function update() {
		this._.texture.use();
		this._.flippedShader.drawRect();
		return this;
	}

	function simpleShader(shader, uniforms, textureIn, textureOut) {
		(textureIn || this._.texture).use();
		this._.spareTexture.drawTo(function() {
			shader.uniforms(uniforms).drawRect();
		});
		this._.spareTexture.swapWith(textureOut || this._.texture);
	}

	function wrap(func) {
		return function() {
			// Make sure that we're using the correct global WebGL context
			gl = this._.gl;

			// Now that the context has been switched, we can call the wrapped
			// function
			return func.apply(this, arguments);
		};
	}

	exports.canvas = function() {
		var canvas = document.createElement('canvas');
		try {
			gl = canvas.getContext('experimental-webgl', {
				premultipliedAlpha : false
			});
		} catch (e) {
			gl = null;
		}
		if (!gl) {
			throw 'This browser does not support WebGL';
		}
		canvas._ = {
			gl : gl,
			isInitialized : false,
			texture : null,
			spareTexture : null,
			flippedShader : null
		};

		// Methods
		canvas.texture = wrap(texture);
		canvas.draw = wrap(draw);
		canvas.update = wrap(update);
		canvas.move = wrap(move);
		canvas.mirror = wrap(mirror);
		return canvas;
	};
	
	function mirror() {
		gl.mirror = gl.mirror
				|| new Shader(
						null,
						' \
				        uniform sampler2D texture; \
				        uniform float brightness; \
				        varying vec2 texCoord; \
				        void main() { \
				            vec4 color = texture2D(texture, vec2(1.0 - texCoord.x,texCoord.y)); \
				            gl_FragColor = color; \
				        } \
				    ');

		simpleShader.call(this, gl.mirror, {});
		return this;
	}

	function move() {
		gl.move = gl.move
				|| new Shader(
						null,
						' \
				        uniform sampler2D texture; \
				        uniform float brightness; \
				        varying vec2 texCoord; \
				        void main() { \
				            vec4 color = texture2D(texture, texCoord); \
				            if (texCoord.y < 0.5) { \
				                vec4 color2 = texture2D(texture, vec2(texCoord.x, texCoord.y + 0.5)); \
				                float d = abs(color2.r - color.r) +  abs(color2.g - color.g) +  abs(color2.b - color.b); \
				                d = d * 1.5; \
				                color = vec4(d,d,d,1.0); \
				                if (d < 0.5) { \
				                    color = vec4(0.0,0.0,0.0,1.0); \
				                } \
				            } \
				            gl_FragColor = color; \
				        }\
				    ');
		
		simpleShader.call(this, gl.move, {});
		return this;
	}

	var Shader = (function() {
		function isArray(obj) {
			return Object.prototype.toString.call(obj) == '[object Array]';
		}

		function isNumber(obj) {
			return Object.prototype.toString.call(obj) == '[object Number]';
		}

		function compileSource(type, source) {
			var shader = gl.createShader(type);
			gl.shaderSource(shader, source);
			gl.compileShader(shader);
			if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
				throw 'compile error: ' + gl.getShaderInfoLog(shader);
			}
			return shader;
		}

		var defaultVertexSource = '\
								    attribute vec2 vertex;\
								    attribute vec2 _texCoord;\
								    varying vec2 texCoord;\
								    void main() {\
								        texCoord = _texCoord;\
								        gl_Position = vec4(vertex * 2.0 - 1.0, 0.0, 1.0);\
								    }';

		var defaultFragmentSource = '\
								    uniform sampler2D texture;\
								    varying vec2 texCoord;\
								    void main() {\
								        gl_FragColor = texture2D(texture, texCoord);\
								    }';

		function Shader(vertexSource, fragmentSource) {
			this.vertexAttribute = null;
			this.texCoordAttribute = null;
			this.program = gl.createProgram();
			vertexSource = vertexSource || defaultVertexSource;
			fragmentSource = fragmentSource || defaultFragmentSource;
			fragmentSource = 'precision lowp float;' + fragmentSource; 
			gl.attachShader(this.program, compileSource(gl.VERTEX_SHADER, vertexSource));
			gl.attachShader(this.program, compileSource(gl.FRAGMENT_SHADER, fragmentSource));
			gl.linkProgram(this.program);
			if (!gl.getProgramParameter(this.program, gl.LINK_STATUS)) {
				throw 'link error: ' + gl.getProgramInfoLog(this.program);
			}
		}

		Shader.prototype.destroy = function() {
			gl.deleteProgram(this.program);
			this.program = null;
		};

		Shader.prototype.uniforms = function(uniforms) {
			gl.useProgram(this.program);
			for ( var name in uniforms) {
				if (!uniforms.hasOwnProperty(name))
					continue;
				var location = gl.getUniformLocation(this.program, name);
				if (location === null)
					continue; // will be null if the uniform isn't used in the
								// shader
				var value = uniforms[name];
				if (isArray(value)) {
					switch (value.length) {
					case 1:
						gl.uniform1fv(location, new Float32Array(value));
						break;
					case 2:
						gl.uniform2fv(location, new Float32Array(value));
						break;
					case 3:
						gl.uniform3fv(location, new Float32Array(value));
						break;
					case 4:
						gl.uniform4fv(location, new Float32Array(value));
						break;
					case 9:
						gl.uniformMatrix3fv(location, false, new Float32Array(value));
						break;
					case 16:
						gl.uniformMatrix4fv(location, false, new Float32Array(value));
						break;
					default:
						throw 'dont\'t know how to load uniform "' + name + '" of length ' + value.length;
					}
				} else if (isNumber(value)) {
					gl.uniform1f(location, value);
				} else {
					throw 'attempted to set uniform "' + name + '" to invalid value ' + (value || 'undefined').toString();
				}
			}
			// allow chaining
			return this;
		};

		// textures are uniforms too but for some reason can't be specified by
		// gl.uniform1f, even though floating point numbers represent the integers 0 through 7
		// exactly
		Shader.prototype.textures = function(textures) {
			gl.useProgram(this.program);
			for ( var name in textures) {
				if (!textures.hasOwnProperty(name))
					continue;
				gl.uniform1i(gl.getUniformLocation(this.program, name), textures[name]);
			}
			// allow chaining
			return this;
		};

		Shader.prototype.drawRect = function(left, top, right, bottom) {
			var undefined;
			var viewport = gl.getParameter(gl.VIEWPORT);
			top = top !== undefined ? (top - viewport[1]) / viewport[3] : 0;
			left = left !== undefined ? (left - viewport[0]) / viewport[2] : 0;
			right = right !== undefined ? (right - viewport[0]) / viewport[2] : 1;
			bottom = bottom !== undefined ? (bottom - viewport[1]) / viewport[3] : 1;
			if (gl.vertexBuffer == null) {
				gl.vertexBuffer = gl.createBuffer();
			}
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
			gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ left, top, left, bottom, right, top, right, bottom ]), gl.STATIC_DRAW);
			if (gl.texCoordBuffer == null) {
				gl.texCoordBuffer = gl.createBuffer();
				gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
				gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([ 0, 0, 0, 1, 1, 0, 1, 1 ]), gl.STATIC_DRAW);
			}
			if (this.vertexAttribute == null) {
				this.vertexAttribute = gl.getAttribLocation(this.program, 'vertex');
				gl.enableVertexAttribArray(this.vertexAttribute);
			}
			if (this.texCoordAttribute == null) {
				this.texCoordAttribute = gl.getAttribLocation(this.program, '_texCoord');
				gl.enableVertexAttribArray(this.texCoordAttribute);
			}
			gl.useProgram(this.program);
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.vertexBuffer);
			gl.vertexAttribPointer(this.vertexAttribute, 2, gl.FLOAT, false, 0, 0);
			gl.bindBuffer(gl.ARRAY_BUFFER, gl.texCoordBuffer);
			gl.vertexAttribPointer(this.texCoordAttribute, 2, gl.FLOAT, false, 0, 0);
			gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
		};

		Shader.getDefaultShader = function() {
			gl.defaultShader = gl.defaultShader || new Shader();
			return gl.defaultShader;
		};

		return Shader;
	})();

	var Texture = (function() {
		Texture.fromElement = function(element) {
			var texture = new Texture(0, 0, gl.RGBA, gl.UNSIGNED_BYTE);
			texture.loadContentsOf(element);
			return texture;
		};

		function Texture(width, height, format, type) {
			this.gl = gl;
			this.id = gl.createTexture();
			this.width = width;
			this.height = height;
			this.format = format;
			this.type = type;

			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			if (width && height)
				gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
		}

		Texture.prototype.loadContentsOf = function(element) {
			this.width = element.width || element.videoWidth;
			this.height = element.height || element.videoHeight;
			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texImage2D(gl.TEXTURE_2D, 0, this.format, this.format, this.type, element);
		};

		Texture.prototype.initFromBytes = function(width, height, data) {
			this.width = width;
			this.height = height;
			this.format = gl.RGBA;
			this.type = gl.UNSIGNED_BYTE;
			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, width, height, 0, gl.RGBA, this.type, new Uint8Array(data));
		};

		Texture.prototype.destroy = function() {
			gl.deleteTexture(this.id);
			this.id = null;
		};

		Texture.prototype.use = function(unit) {
			gl.activeTexture(gl.TEXTURE0 + (unit || 0));
			gl.bindTexture(gl.TEXTURE_2D, this.id);
		};

		Texture.prototype.unuse = function(unit) {
			gl.activeTexture(gl.TEXTURE0 + (unit || 0));
			gl.bindTexture(gl.TEXTURE_2D, null);
		};

		Texture.prototype.ensureFormat = function(width, height, format, type) {
			// allow passing an existing texture instead of individual arguments
			if (arguments.length == 1) {
				var texture = arguments[0];
				width = texture.width;
				height = texture.height;
				format = texture.format;
				type = texture.type;
			}

			// change the format only if required
			if (width != this.width || height != this.height || format != this.format || type != this.type) {
				this.width = width;
				this.height = height;
				this.format = format;
				this.type = type;
				gl.bindTexture(gl.TEXTURE_2D, this.id);
				gl.texImage2D(gl.TEXTURE_2D, 0, this.format, width, height, 0, this.format, this.type, null);
			}
		};

		Texture.prototype.drawTo = function(callback) {
			// start rendering to this texture
			gl.framebuffer = gl.framebuffer || gl.createFramebuffer();
			gl.bindFramebuffer(gl.FRAMEBUFFER, gl.framebuffer);
			gl.framebufferTexture2D(gl.FRAMEBUFFER, gl.COLOR_ATTACHMENT0, gl.TEXTURE_2D, this.id, 0);
			if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) !== gl.FRAMEBUFFER_COMPLETE) {
				throw new Error('incomplete framebuffer');
			}
			gl.viewport(0, 0, this.width, this.height);

			// do the drawing
			callback();

			// stop rendering to this texture
			gl.bindFramebuffer(gl.FRAMEBUFFER, null);
		};

		var canvas = null;

		function getCanvas(texture) {
			if (canvas == null)
				canvas = document.createElement('canvas');
			canvas.width = texture.width;
			canvas.height = texture.height;
			var c = canvas.getContext('2d');
			c.clearRect(0, 0, canvas.width, canvas.height);
			return c;
		}

		Texture.prototype.fillUsingCanvas = function(callback) {
			callback(getCanvas(this));
			this.format = gl.RGBA;
			this.type = gl.UNSIGNED_BYTE;
			gl.bindTexture(gl.TEXTURE_2D, this.id);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, canvas);
			return this;
		};

		Texture.prototype.toImage = function(image) {
			this.use();
			Shader.getDefaultShader().drawRect();
			var size = this.width * this.height * 4;
			var pixels = new Uint8Array(size);
			var c = getCanvas(this);
			var data = c.createImageData(this.width, this.height);
			gl.readPixels(0, 0, this.width, this.height, gl.RGBA, gl.UNSIGNED_BYTE, pixels);
			for (var i = 0; i < size; i++) {
				data.data[i] = pixels[i];
			}
			c.putImageData(data, 0, 0);
			image.src = canvas.toDataURL();
		};

		Texture.prototype.swapWith = function(other) {
			var temp;
			temp = other.id;
			other.id = this.id;
			this.id = temp;
			temp = other.width;
			other.width = this.width;
			this.width = temp;
			temp = other.height;
			other.height = this.height;
			this.height = temp;
			temp = other.format;
			other.format = this.format;
			this.format = temp;
		};

		return Texture;
	})();
	
	return exports;
})();
