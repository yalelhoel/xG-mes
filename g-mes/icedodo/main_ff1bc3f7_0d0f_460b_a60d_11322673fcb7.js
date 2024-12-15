



const IS_ICEPARTY = false;

var a = {
    p: function(q,r,s, imat, bounce, mass, friction, jump, air) {
        if (!imat) imat = (IS_ICEPARTY) ? 1 : 0;
        if (!bounce) bounce = 0;
    	maker.make_platform(q,r,s, imat, bounce, mass, friction, jump, air);
    },
    y: function(q,r,s, imat, bounce, mass, friction, air, topr) {
        if (!imat) imat = (IS_ICEPARTY) ? 1 : 0;
        if (!bounce) bounce = 0;
        maker.make_cylinder(q,r,s, imat, bounce, mass, friction, air, topr);
    },
    s: function(q,radius, imat, bounce, mass, friction, air) {
        maker.make_sphere(q, radius, imat, bounce, mass, friction, air);
    },
    c: function(q, iceparty) {
        if (iceparty == null) iceparty = (IS_ICEPARTY) ? true : false;
    	maker.make_cone(q, iceparty);
    },
    e: function(q) {
    	maker.make_ending(q);
    },
    m: function(id) {
    	return scene.getMeshByName(id);
    },
    re: function(id, q, r, s) { // reset
        let mesh = scene.getMeshByName(id);
        mesh.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0, 0, 0), 0);
        mesh.rotation.x = r[1];
        mesh.rotation.y = r[0];
        mesh.rotation.z = r[2];
        mesh.position.x = q[0];
        mesh.position.y = q[1];
        mesh.position.z = q[2];
        mesh.scaling.x = s[0];
        mesh.scaling.y = s[1];
        mesh.scaling.z = s[2];
        if (mesh.physicsImpostor) {
            mesh.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0));
            mesh.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0,0,0,0));
        }
    },
    g: function(x,y,z) {
        let vec = cc.get("gravity", {
            x: (x != null) ? x*default_gravity : null,
            y: (y != null) ? y*default_gravity : null,
            z: (z != null) ? z*default_gravity : null
        });
        gravity = vec;
        console.log("%c GrAV", "color: blue", vec);
        scene.getPhysicsEngine().setGravity(vec);
    },
    d: function(x,y,z) {
        player.scaling = cc.get("player.scaling", {x,y,z});
    },
    cam_d: function(_radius) {
        let cam_d = cc.get("radius", _radius)
        let cam_cd = cc.get("cameraDownAngle", null);

        cam_horizontal = cam_d * cam_d;
        cam_vertical = cam_horizontal * Math.tan(cam_cd * 1.3);
        cam_depression = cam_cd;
    },
    cam_cd: function(_cameraDownAngle) {
        let cam_d = cc.get("radius", null);
        let cam_cd = cc.get("cameraDownAngle", (_cameraDownAngle != null) ? _cameraDownAngle * Math.PI / 180 : null);

        cam_horizontal = cam_d * cam_d;
        cam_vertical = cam_horizontal * Math.tan(cam_cd * 1.3);
        cam_depression = cam_cd;
    },
    cam_cr: function(_cameraRightAngle) {
        cameraRightAngle = cc.get("cameraRightAngle", (_cameraRightAngle != null) ? _cameraRightAngle * Math.PI / 180 : null);
    },
    t: function(x,y,z) {
        camera.upVector = cc.get("camera.upVector", {x,y,z});
    },
    mov: function(id, axis, value) {
        scene.getMeshByName(id).position[axis] += value * default_speed;
    },
    rot: function(id, axis, value) {
        scene.getMeshByName(id).rotation[axis] += value * default_steer;
    },
    siz: function(id, axis, value) {
        scene.getMeshByName(id).scaling[axis] += value / 100;
    },
    fov_mul2: function(_mul2) {
        let mul2 = cc.get("camera.fov mul2", _mul2);
        fov.set_mul2(mul2);
        fov.apply();
    },
    u: function(id) {
        scene.getMeshByName(id).unfreezeWorldMatrix();
    },
    msg_set: function(text) {
        $("#map_text").css("visibility", "visible");
        setTimeout(function() {
            $("#map_text").text(text);  
            $("#map_text").fadeIn("fast");
        }, 250)
        
    },
    msg_del: function() {
        $("#map_text").fadeOut("fast");
    },
    js: function(v) {
        jumpSpeed = cc.get("jumpSpeed", v);
    },
    jh: function(v) {
        jumpHeight = cc.get("jumpHeight", v);
    },
    og: function(mat, p1,p2,p3, r1,r2,r3, s1,s2,s3) {
        var mat_map = {
            ice: 0,
            fire: 5,
            green: 6,
            brown: 7,
            water: 8,
            invisible: -1,
            fall: 0
        }
        if (mat != "fall") {
            this.p([p1 * (-1),p2,p3], [r1*(Math.PI / 180),r2*(Math.PI / 180),r3*(Math.PI / 180)], [s1,s2,s3], mat_map[mat] || 0);
        } else {
            this.p([p1 * (-1),p2,p3], [r1*(Math.PI / 180),r2*(Math.PI / 180),r3*(Math.PI / 180)], [s1,s2,s3], mat_map[mat] || 0, 1, 0.2, 0);
        }
        
    },
    og_end: function(p1, p2, p3, yr) {
        this.e([p1,p2,p3]);
    },
    og_c: function(p1,p2,p3) {
        maker.og_cone(p1,p2,p3);
    },
    og_y: function(positionX, positionY, positionZ, rotationY, rotationX, rotationZ, rad, hei) {
        maker.og_cylinder(positionX, positionY, positionZ, rotationY, rotationX, rotationZ, rad, hei);
    },
    og_tree: function(p1,p2,p3) {
        maker.og_tree(p1,p2,p3);
    }
}




var audio = {
	init: function() {
		if (testing_mode.active == false) {
			const song_src = "assets/music/" + cup_info[settings.cup_id].song;
			this.load(song_src);
		}
	},
	load: function(song) {
		var audio = $("#audio")[0];
	    $("#audiosource").attr("src", song);
	    audio.load();
	},
	play: function() {
		if (settings.musicEnabled === "on") {
		    var audio = $("#audio")[0];
	    	audio.oncanplaythrough = audio.play();
	    	audio.currentTime = 0;
	    }
	},
	stop: function() {
		if (settings.musicEnabled === "on") {
			document.getElementById('audio').pause();
		}
	},
	level_complete: function() {
		if (settings.musicEnabled === "on") {
			var audio_player = $("#sound_level_complete")[0];
			audio_player.oncanplaythrough = audio_player.play();
			audio_player.currentTime = 0;
		}
	},
	die: function() {
		if (settings.musicEnabled === "on") {
			var audio_player = $("#sound_die")[0];
			audio_player.oncanplaythrough = audio_player.play();
			audio_player.currentTime = 0;
		}
	}
}




var boot = {
    finished: false,
    preload: async function() {
        // persistent
        await deployment.init();
        await sync.init();
        await stats.init();
        await guardian.init();
        await tabs.init();
        await sleep(120);
        await start.init();
        await decorations.init();
        await maker.init();
        await leaderboard.init();
        await scorekeeper.recompute();
        await news.init();
        await popup.init();
        await popup.show();
        await start.create_scene();
        await cc.set_default();
        await fov.init();
        await update.init();
        await decorations.add_particle_system();
        await controls.init();
        
        this.finished = true;
    },
    init: async function() {
        console.log("INITED");
        await flyjump.init();
        await cc.hard_reset();
        await loader.init();
        await map.init();
        await audio.init();
        await cc.refresh()
        await change_state.spawn();
        await screen.init();
        await size.ingame();
        await leaderboard.speedrun_on_open_map();
        await map.post();
        transitioning = false;

        
    }
}

$('document').ready(function(){
    boot.preload();
});

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}




var change_state = {
	die: function() {
		if (alive) {
			alive = false;
			$("#screen").css("visibility", "visible");
			$(".mobile_btn").fadeOut();
			$("#restart_icon").show();
			$("#next_lvl_icon").hide();
			$("#play_again").hide();
			a.msg_del();
			
			audio.stop();
			audio.die();
			
			if (settings.autoRestart === "on") {
				transitioning = true;
				setTimeout(function() {
					transitioning = false;
					$("#restart").click();
				}, 200);
			}
			// Leaderboard
			leaderboard.set_fps();
		}
	},
	spawn: function() {
		if (!alive) {
			stats.score = 0;
			flyjump.last_frame = 0;
			$("#screen").css("visibility", "hidden");
			$(".mobile_btn").fadeIn();
			$("#map_text").hide();

			// world
			player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0,0,0),0);
			player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0));
			player.physicsImpostor.setAngularVelocity(new BABYLON.Quaternion(0,1,0,0));
			player.position = new BABYLON.Vector3(map.spawn[0],map.spawn[1],map.spawn[2]);
			player.rotation = new BABYLON.Vector3(0,0,0);
			
			// play settings
			// radius = default_radius;
			// speed = default_speed;
			// steer = default_steer;
			// update.set_gravity(default_gravity);
			// a.t(0,1,0);
			// fov.set_mul2(1);
			cc.refresh();

			// current info
			rotation = 0;
			alive = true;

			// reset keys
			controls.left = false;
			controls.right = false;
			controls.space = false;
			
			// map-specific reset
			map.reset();
			audio.play();
		}
	}, 
	win: function() {
		if ((alive) && (!transitioning)) {
			transitioning = true;
			alive = false;

			audio.stop();
			audio.level_complete();
			// clear this map
			cleanup.run();
			let this_map_id = settings.map_id;
			// set speed record
			leaderboard.set_record();

			
			function show_end_screen() {
				screen.set_dialog("Map Complete", "#56e04c");
				$("#restart_text").html("NEXT LEVEL");
				$("#restart_icon").hide();
				$("#next_lvl_icon").show();
				$("#play_again").show();
				
				$("#screen").css("visibility", "visible");
				$(".mobile_btn").fadeOut();
				transitioning = false;
			}

			if (testing_mode.active == true) {
				show_end_screen();
				return;
			}

			sync.get(this_map_id, function(data) {
				var map_exp = 0;
				if ((data !== undefined) && (data !== null)) {
					map_exp = Number(data);
				}
				// add one exp.
				sync.set(this_map_id, Number(map_exp) + 1, function() {
					scorekeeper.recompute();
					// display UI
					show_end_screen();
				});
			});
		}
		
	}
}



var cleanup = {
	run: function(full_reset=true) {
		if (full_reset == true) {
			map = {
				render_update: function() {},
				physics_update: function() {},
				section_update: function() {}
			}
		}
		
		for (var i=0;i<maker.ending_count;i++) {
			let mesh_name = "E" + i;
			var mesh = scene.getMeshByName(mesh_name);
			mesh.dispose();
		}
		for (var i=0;i<maker.platform_count;i++) {
			let mesh_name = "P" + i;
			var mesh = scene.getMeshByName(mesh_name);
			mesh.dispose();
		}
		for (var i=0;i<maker.cone_count;i++) {
			let mesh_name = "C" + i;
			var mesh = scene.getMeshByName(mesh_name);
			mesh.dispose();
		}
		for (var i=0;i<maker.cylinder_count;i++) {
			let mesh_name = "Y" + i;
			var mesh = scene.getMeshByName(mesh_name);
			mesh.dispose();
		}
		for (var i=0;i<maker.sphere_count;i++) {
			let mesh_name = "S" + i;
			var mesh = scene.getMeshByName(mesh_name);
			mesh.dispose();
		}
		cones = [];
		endings = [];
		jumppads = [];
		maker.platform_count = 0;
		maker.cone_count = 0;
		maker.cylinder_count = 0;
		maker.sphere_count = 0;
		maker.ending_count = 0;
	}
}



const config = {
	chrx_id: "jhidcpailhmpjpbdbhceiaeeggkalgmd",
	dev_chrx_id: "hncbfhmjblcbjdbmddgdblbepeafmcji",
	sync_id: "@_",
}



const INF = 90000000000000;

// defaults
const default_radius = 2.5;
const default_speed = 0.28;
const default_steer = 0.022;
const default_gravity = -9;
const physics_call_rate = 2; // higher = better performance. lower = better accuracy.
const default_cameraDownAngle = 0.3;
const default_cameraRightAngle = 0;
const default_jumpSpeed = 1;
const default_jumpHeight = 1;


// current
var speed;// = default_speed;
var steer;// = default_steer;
var gravity;

var jumpSpeed;
var jumpHeight;

var radius;// = default_radius;
var cameraDownAngle;// = default_cameraDownAngle;
var cameraRightAngle;// = default_cameraRightAngle;

// solved
var cam_horizontal = 0;
var cam_vertical = 0;
var cam_depression = 0;


var cc = {
	default: {},
	monkey: {},
	set_default: function() {
		this.default["camera.maxZ"] = () => {
			return 300
		};
		this.default["camera.fov mul2"] = () => {
			return 1
		};
		this.default["light.intensity"] = () => {
			return 1.0
		};

		this.default["radius"] = () => {
			return default_radius;
		};

		this.default["cameraDownAngle"] = () => {
			return default_cameraDownAngle;
		};
		this.default["cameraRightAngle"] = () => {
			return default_cameraRightAngle;
		};

		this.default["jumpSpeed"] = () => {
			return default_jumpSpeed;
		};
		this.default["jumpHeight"] = () => {
			return default_jumpHeight;
		};


		this.default["speed"] = () => {
			return default_speed
		};
		this.default["steer"] = () => {
			return default_steer
		};




		this.default["player.scaling"] = () => {
			return new BABYLON.Vector3(1, 0.16, 1)
		};
		this.default["scene.clearColor"] = () => {
			return new BABYLON.Color4(0,0,0,1)
		};
		this.default["scene.ambientColor"] = () => {
			return new BABYLON.Color4(1,1,1,1)
		};
		this.default["light.diffuse"] = () => {
			return new BABYLON.Color4(1, 1, 1, 1)
		};
		this.default["light.specular"] = () => {
			return new BABYLON.Color3(1, 1, 1)
		};
		this.default["light.groundColor"] = () => {
			return new BABYLON.Color3(0, 0, 0)
		};
		this.default["gravity"] = () => {
			return new BABYLON.Vector3(0,-9,0)
		};
		this.default["camera.upVector"] = () => {
			return new BABYLON.Vector3(0,1,0)
		};


	},
	set_monkey: function(key, val) {
		this.monkey[key] = val;
	},
	get: function(const_key, top_vec=null) {
		var vec = this.default[const_key]();
		if (Object.keys(vec).length == 0) {
			// scalar
			var arr = [vec, this.monkey[const_key], top_vec].filter(v => v != null);
			return arr[arr.length - 1];
		} else {
	        // vector
	        let is_color = ((vec.r) && (vec.g) && (vec.b));
	        let arr = [this.monkey[const_key], top_vec];
	        if (is_color) {
	        	for (var i=0;i<2;i++) {
	        		let ar = arr[i];
	        		if (ar) {
	        			vec = ar;
	        		}
	        	}
	        } else {
		        for (let key in vec) {
		        	for (var i=0;i<2;i++) {
		        		let ar = arr[i];
		        		if ((ar != null) && (ar[key] != null)) {
		        			vec[key] = ar[key];
		        		}
		        	}
		        }
		    }
	        return vec;
	    }
	},
	refresh: function() {
		// TODO: This is not done! Something's wrong i can feel it.
		camera.maxZ = this.get("camera.maxZ");
		light.intensity = this.get("light.intensity");
		radius = this.get("radius");
		cameraDownAngle = this.get("cameraDownAngle");
		cameraRightAngle = this.get("cameraRightAngle");
		speed = this.get("speed");
		steer = this.get("steer");
		player.scaling = this.get("player.scaling");
		scene.clearColor = this.get("scene.clearColor");
		scene.ambientColor = this.get("scene.ambientColor");
		light.diffuse = this.get("light.diffuse");
		light.specular = this.get("light.specular");
		light.groundColor = this.get("light.groundColor");

		jumpSpeed = this.get("jumpSpeed");
		jumpHeight = this.get("jumpHeight");


		a.fov_mul2(null);
		a.g(null, null, null);
		a.d(null, null, null);
		a.t(null, null, null);
		a.cam_d(null);
	},
	hard_reset: function() {
		this.monkey = {};
	}
}





var controls = {
  left: false,
  right: false,
  space: false,
  mobile_enabled: ('ontouchstart' in document.documentElement),
  mobile_allowed: true,
  init: function() {
    function use_mobile_buttons() {
      // onionfist.com/ice_mobile_notice
      if (deployment.is_chrome_ext == true) {
        return false;
      }
      if (controls.mobile_allowed == false) {
        return false;
      }
      if (controls.mobile_enabled == false) {
        return false;
      }
      return true;
    }

    this.bind_keys();
    if (use_mobile_buttons()) {
      this.bind_buttons();
      $(".mobile_btn").hide();
    } else {
      $(".mobile_btn").remove();
    }
  },
  count_key_presses: function() {
    if (alive) {
      stats.key_time += 1;
      if (stats.key_time > 16) {
        $(".mobile_btn").remove();
      }
    }
  },
  bind_buttons: function() {
    $("#left_mobile_btn").touchstart(function() {
      controls.left = true; controls.right = false;
    });
    $("#right_mobile_btn").touchstart(function() {
      controls.right = true; controls.left = false;
    });
    $("#space_mobile_btn").touchstart(function() {
      controls.space = true;
    });
    $("#left_mobile_btn").touchend(function() {
      controls.left = false;
    });
    $("#right_mobile_btn").touchend(function() {
      controls.right = false;
    });
    $("#space_mobile_btn").touchend(function() {
      controls.space = false;
    });
  },
  bind_keys: function() {
    document.onkeydown = function(e) {
      if ((e.keyCode == 37) || (e.keyCode == 65)) {
        if (popup.in_game) {
          controls.left = true; controls.right = false;
          controls.count_key_presses();
        } else if ((transitioning == false) && (e.keyCode == 37)) {
          popup.cup_num -= 1;
          popup.display_cup();
        }
      }
      if ((e.keyCode == 39) || (e.keyCode == 68)) {
        if (popup.in_game) {
          controls.right = true; controls.left = false;
          controls.count_key_presses();
        } else if ((transitioning == false) && (e.keyCode == 39)) {
          popup.cup_num += 1;
          popup.display_cup();
        }
      }
      
      if ((e.keyCode == 32) || (e.keyCode == 38) || (e.keyCode == 87)) {
        controls.space = true;
        if ((!alive) && (!transitioning) && (popup.in_game)) {
          $("#restart").click();
        }
      }

      if (e.keyCode == 82) {
        if ((alive) && (!transitioning) && (popup.in_game)) {
          change_state.die();
          screen.set_dialog("Self Destructed", "#e04c4f");
        }
      }
    }
    document.onkeyup = function(e) {
      if ((e.keyCode == 37) || (e.keyCode == 65)) {
        controls.left = false;
      }
      if ((e.keyCode == 39) || (e.keyCode == 68)) {
        controls.right = false;
      }
      if ((e.keyCode == 32) || (e.keyCode == 38) || (e.keyCode == 87)) {
        controls.space = false;
      }
    }
  }
}



var cup_info = {
    beginner: {name: "Ice Dodo", song: "env2.mp3"},
    pilot: {name: "Pilot cup", song: "tokyo.mp3"},
    carrot: {name: "Carrot cup", song: "tokyo.mp3"},
    rocky: {name: "Rocky cup", song: "microburst.mp3"},
    dodo: {name: "Dodo cup", song: "env2.mp3"},
    skilled: {name: "Skilled cup", song: "bloom.mp3"},
    furby: {name: "Furby cup", song: "valkyrie.mp3"},
    doom: {name: "Doom cup", song: "microburst.mp3"},
    kazil: {name: "Kazil cup", song: "stairways.mp3"},
    ye: {name: "Ye cup", song: "bloom.mp3"},
    tim: {name: "Tim cup", song: "valkyrie.mp3"},
    ghoul: {name: "Ghoul cup", song: "microburst.mp3"},
    abc: {name: "ABC cup", song: "env2.mp3"},
    rytai: {name: "Rytai cup", song: "valkyrie.mp3"},
    jay: {name: "Jay cup", song: "tokyo.mp3"},
    golden: {name: "Golden cup", song: "stairways.mp3"},
    bean: {name: "Bean cup", song: "bloom.mp3"},
    fish: {name: "Fish cup", song: "tokyo.mp3"},
    thero: {name: "Thero cup", song: "dodosynthesis.mp3"},
    crazy: {name: "Crazy cup", song: "bloom.mp3"},
    june: {name: "June cup", song: "stairways.mp3"},
    sleepy: {name: "Sleepy cup", song: "microburst.mp3"},
    mango: {name: "Mango cup", song: "brink.mp3"},
    squirrel: {name: "Squirrel cup", song: "tokyo.mp3"},
    collab: {name: "Collab cup", song: "tokyo.mp3"},
    og: {name: "O.G. cup", song: "env2.mp3"},
    vault: {name: "Vault cup", song: "stairways.mp3"},
    finder: {name: "Finder", song: "env2.mp3"},
}




var decorations = {
    materials: {},
    idno: 0,
    init: function() {
        // GENERAL
        this.materials.invis = this.rgba_mat(0,0,0,0);
        this.materials.ending = this.rgba_mat(36, 252, 3, 0.5);
        this.materials.player = this.rgba_mat(255, 255, 255,1.0);;

        // PLATFORM
        this.bright = new BABYLON.StandardMaterial("brightmat", scene);
        this.bright.diffuseTexture = new BABYLON.Texture("assets/textures/bright.png", scene);
        this.bright.diffuseTexture.uScale = this.bright.diffuseTexture.vScale = 1.0;
        this.bright.backFaceCulling = true; // false;
        this.bright.freeze();

        this.dark = new BABYLON.StandardMaterial("darkmat", scene);
        this.dark.diffuseTexture = new BABYLON.Texture("assets/textures/dark.png", scene);
        this.dark.diffuseTexture.uScale = this.dark.diffuseTexture.vScale = 1.0;
        this.dark.backFaceCulling = true; // false;
        this.dark.freeze();

        if (settings.platformTexture === "dark") {
            this.materials.plat0 = this.dark;
        } else {
            this.materials.plat0 = this.bright;
        }

        this.materials.plat1 = new BABYLON.StandardMaterial("plat1", scene);
        this.materials.plat1.diffuseTexture = new BABYLON.Texture("assets/textures/pm1.png", scene);
        this.materials.plat1.diffuseTexture.uScale = this.bright.diffuseTexture.vScale = 1.0;
        this.materials.plat1.backFaceCulling = false;
        this.materials.plat1.freeze();

        this.materials.plat2 = new BABYLON.StandardMaterial("plat2", scene);
        this.materials.plat2.diffuseTexture = new BABYLON.Texture("assets/textures/pm2.png", scene);
        this.materials.plat2.diffuseTexture.uScale = this.bright.diffuseTexture.vScale = 1.0;
        this.materials.plat2.backFaceCulling = false;
        this.materials.plat2.freeze();

        this.materials.plat3 = this.rgba_mat(0, 0, 255, 1.0);
        this.materials.plat3.alpha = 0.55;
        this.materials.plat3.backFaceCulling = true;
        this.materials.plat3.freeze();
        

        this.materials.plat5 = this.rgba_mat(255,0,0,1, true); // fire

        this.materials.plat6 = this.rgba_mat(34,139,34,0.4, true); // green
        
        this.materials.plat7 = this.rgba_mat(165,42,42,0.8, true); // brown

        this.materials.plat8 = this.rgba_mat(64,164,223,0.2, true); // water

        // this.materials.plat4 = new BABYLON.StandardMaterial("fire", scene);
        // this.materials.plat4.diffuseColor = new BABYLON.Color3(1,0,0);

        // this.materials.plat5 = new BABYLON.StandardMaterial("green", scene);
        // this.materials.plat5.diffuseColor = new BABYLON.Color3(34 /255,139 /255,34 /255);
        // this.materials.plat5.alpha = 0.4;

        // this.materials.plat6 = new BABYLON.StandardMaterial("brown", scene);
        // this.materials.plat6.diffuseColor = new BABYLON.Color3(165 /255,42 /255,42 /255);
        // this.materials.plat6.alpha = 0.8;

        // this.materials.plat7 = new BABYLON.StandardMaterial("water", scene);
        // this.materials.plat7.diffuseColor = new BABYLON.Color3(64 /255, 164 /255, 223 /255);
        // this.materials.plat7.alpha = 0.2;


        // CONE
        this.materials.cone0 = this.rgba_mat(235,50,50,1.0);

        this.materials.cone1 = this.rgba_mat(65, 174, 217,1.0);

        // CYLINDER
        this.materials.cylinder0 = this.rgba_mat(40, 60, 235, 0.8);
        this.materials.cylinder0.freeze();

        this.materials.cylinder1 = this.rgba_mat(242, 22, 103, 1.0);
        this.materials.cylinder1.freeze();

        this.materials.cylinder2 = this.rgba_mat(146, 95, 217, 1.0);
        this.materials.cylinder2.freeze();

        this.materials.cylinder3 = this.rgba_mat(0, 0, 255, 1.0);
        this.materials.cylinder3.alpha = 0.4;
        this.materials.cylinder3.backFaceCulling = true;
        this.materials.cylinder3.freeze();

        this.materials.cylinder4 = this.rgba_mat(255,0,0,1, true); // fire

        this.materials.cylinder5 = this.rgba_mat(34,139,34,0.4, true); // green
        
        this.materials.cylinder6 = this.rgba_mat(165,42,42,0.8, true); // brown

        this.materials.cylinder7 = this.rgba_mat(64,164,223,0.2, true); // water

        // SPHERE
        this.materials.sphere0 = this.rgba_mat(40, 60, 235, 0.8);
        this.materials.sphere0.freeze();

        this.materials.sphere1 = this.rgba_mat(242, 22, 103, 1.0);
        this.materials.sphere1.freeze();

        this.materials.sphere2 = this.rgba_mat(146, 95, 217, 1.0);
        this.materials.sphere2.freeze();

        this.materials.sphere3 = this.rgba_mat(0, 0, 255, 1.0);
        this.materials.sphere3.alpha = 0.4;
        this.materials.sphere3.backFaceCulling = true;
        this.materials.sphere3.freeze();

        this.materials.sphere4 = this.rgba_mat(255, 255, 255, 1.0);
        this.materials.sphere4.freeze();


    },
    decorate: function(obj, mat_id) {
        if (this.materials[mat_id]) {
            obj.material = this.materials[mat_id];
        }
    },
    decorate_player: function(player, skinName) {
        let pmat = new BABYLON.StandardMaterial("pmat", scene);
        const URL = (skinName) ? "assets/skins/"+skinName+".png" : "assets/icons/icon128.png";
        pmat.diffuseTexture = new BABYLON.Texture(URL, scene);
        pmat.diffuseTexture.uScale = pmat.diffuseTexture.vScale = 1.0;
        pmat.backFaceCulling = false;
        pmat.freeze();
        player.material = pmat;
    },
    rgba_mat: function(r,g,b,a, backFaceCulling=false) {
        this.idno += 1;
        var customMat = new BABYLON.StandardMaterial("mat" + this.idno, scene);
        customMat.diffuseColor = new BABYLON.Color3(r/255, g/255, b/255);
        customMat.alpha = a;
        customMat.backFaceCulling = backFaceCulling;
        customMat.freeze();
        return customMat;
    },
    add_particle_system: function () {
        var ps = new BABYLON.ParticleSystem("particles", 2000, scene);
        //Texture of each particle//textures/flare
        ps.particleTexture = new BABYLON.Texture("assets/textures/flare.png", scene);
        // Where the particles come from
        ps.emitter = player; // the starting object, the emitter
        ps.minEmitBox = new BABYLON.Vector3(-0.2, 0, 0); // Starting all from
        ps.maxEmitBox = new BABYLON.Vector3(0.2, 0, 0); // To...
        // Colors of all particles
        ps.color1 = new BABYLON.Color4(0.4, 0.4, 1.0, 1.0);
        ps.color2 = new BABYLON.Color4(0.9, 0.5, 0.4, 1.0);
        ps.colorDead = new BABYLON.Color4(0, 0, 0.2, 0.8);
        // Size of each particle (random between...
        ps.minSize = (IS_ICEPARTY) ? 0.3 : 0.15;
        ps.maxSize = (IS_ICEPARTY) ? 0.7 : 0.4;
        // Life time of each particle (random between...
        ps.minLifeTime = 0.3;
        ps.maxLifeTime = 0.4;
        // Emission rate
        ps.emitRate = (IS_ICEPARTY) ? 10 : 100;
        // Blend mode : BLENDMODE_ONEONE, or BLENDMODE_STANDARD
        ps.blendMode = BABYLON.ParticleSystem.BLENDMODE_ONEONE;
        // Direction of each particle after it has been emitted
        ps.direction1 = new BABYLON.Vector3(-1, 1, 1);
        ps.direction2 = new BABYLON.Vector3(1, 1, -1);
        // Speed
        ps.minEmitPower = 1;
        ps.maxEmitPower = 3;
        ps.updateSpeed = 0.02; // 0.005
        ps.start();
    },
    add_skybox: function() {
        var skybox = BABYLON.Mesh.CreateBox("skyBox", 110.0, scene);
        var skymat = new BABYLON.StandardMaterial("skyBox", scene);
        skymat.backFaceCulling = false;
        skymat.reflectionTexture = new BABYLON.Texture("../../assets/skybox.jpg", scene);
        skymat.reflectionTexture.coordinatesMode = BABYLON.Texture.FIXED_EQUIRECTANGULAR_MODE;
        skymat.disableLighting = true;
        skybox.infiniteDistance = true;
        skybox.material = skymat;
    },
    hexToRgb: function(hex) {
        console.log("hex", hex);
        var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex.split(",")[0]);
        var info = result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : {
            r: 0,
            g: 0,
            b: 0
        };
        info.a = 1;
        if (hex.split(",").length == 2) {
            if (hex.split(",")[1].length > 0) {
                info.a = Number(hex.split(",")[1]);
            }
        }
        return info;
    }
}




var deployment = {
    is_chrome_ext: null,
    is_localhost: null,
    is_dev: null,
    init: function() {
        this.is_chrome_ext = this.check_is_chrome_ext();
        this.is_localhost = window.location.hostname == "localhost";
        this.is_dev = this.check_is_dev();
    },
    check_is_chrome_ext: function() {
        // firefox / I.E. / etc...
        if (window.chrome == null) {
            return false;
        }
        if (window.chrome.extension == null) {
            return false;
        }
        return true;
    },
    check_is_dev: function() {
        if (this.is_chrome_ext == false) {
            return false;
        }
        if (chrome.runtime.id == config.chrx_id) {
            return false;
        }
        return true;
    }
}



var flyjump = {
	can_jump: false,
	jump_sess: 0,
	last_frame: 0,
	impulse_sess: 0,
	impulse_vec: null,
	init: function() {
		this.can_jump = false;
		this.last_frame = 0;
		this.jump_sess = 0;
		this.impulse_sess = 0;
		this.impulse_vec = null;
	},
	compute_loop: function() {
		if (stats.score - this.last_frame > 35) {
			var can_jump = false;
			var grav = gravity;
			function limit(x) {
				if (x < -1) x = -1;
				if (x > 1) x = 1;
				return x * 0.5;
			}
			var pointToIntersect = new BABYLON.Vector3(player.position.x + limit(grav.x), player.position.y + limit(grav.y), player.position.z + limit(grav.z));
			var pointToIntersect2 = new BABYLON.Vector3(player.position.x + 2*limit(grav.x), player.position.y + 2*limit(grav.y), player.position.z + 2*limit(grav.z));

			for (let platform of jumppads) {
				if (platform.intersectsPoint(pointToIntersect)) {
					can_jump = true;
					break;
				}
				if (platform.intersectsPoint(pointToIntersect2)) {
					can_jump = true;
					break;
				}
			}
			
			if (can_jump) {
				this.can_jump = can_jump;
				// amount of frames u can jump for, after exiting contact with platform.
				// this is due to human reaction time.
				this.jump_sess = 13;
			}
		}
	},
	render_loop: function() {
		if (this.jump_sess > 0) {
			this.jump_sess -= 1;
		} else {
			this.can_jump = false;
		}

		if (this.impulse_sess > 0) {
			player.physicsImpostor.setLinearVelocity(this.impulse_vec);
			this.impulse_sess -= 1;
		}
	},
	jump: function() {
		const maps_with_legacy_jump = ["jump_pads", "dodo_kong", "colosseum", "do_not_jump", "deadly_precision", "asteroid_belt", "technocracy"];
		if (maps_with_legacy_jump.indexOf(settings.map_id) >= 0) {
			this.legacy_jump();
			return;
		}

		if (this.can_jump) {
			this.last_frame = stats.score;
			this.can_jump = false;

			var ImpulseVector = gravity;
			ImpulseMagnitude = -1.4 * jumpHeight * 0.9;
			ImpulseVector = ImpulseVector.scale(ImpulseMagnitude);
			ImpulseVector.x += 9 * jumpSpeed * Math.sin(rotation - 3.14) * 0.24;
			ImpulseVector.z += 9 * jumpSpeed * Math.cos(rotation - 3.14) * 0.24;

			player.physicsImpostor.setLinearVelocity(ImpulseVector);
			this.impulse_sess = 5;
			this.impulse_vec = ImpulseVector;

		}
	},
	legacy_jump: function() {
		if (this.can_jump) {
			this.last_frame = stats.score;
			this.can_jump = false;

			player.physicsImpostor.setLinearVelocity(new BABYLON.Vector3(0,0,0));

			var ImpulseVector = gravity;
			ImpulseMagnitude = -1.4 * jumpHeight;
			ImpulseVector = ImpulseVector.scale(ImpulseMagnitude);
			ImpulseVector.x += 9 * jumpSpeed * Math.sin(rotation - 3.14);
			ImpulseVector.z += 9 * jumpSpeed * Math.cos(rotation - 3.14);
			player.physicsImpostor.applyImpulse(ImpulseVector, player.getAbsolutePosition());

			this.impulse_sess = 0;
			this.impulse_vec = ImpulseVector;

		}
	}
}




var fov = {
	radius: 1,
	y_offset: 2,
	mul1: 1,
	mul2: 1,
	init: function() {
		console.log("settings.fovLevel", settings.fovLevel)
		this.set_mul1(settings.fovLevel);
		this.apply();
	},
	set_mul1: function(option) {
		if (option == "x1") {
			this.mul1 = 0.8;
			this.radius = 1;
		} else if (option == "x2") {
			this.mul1 = 1.0;
			this.radius = 0.75;
		} else if (option == "x3") {
			this.mul1 = 1.4;
			this.radius = 0.5;
		}
		this.apply();
		
		// fov		0.8		1.4
		// y		2		1.2
		// r 		1		0.4
	},
	set_mul2: function(value) {
		this.mul2 = value;
		this.apply();
	},
	apply: function() {
		var intensity = this.mul1 * this.mul2;
		camera.fov = Math.min(intensity, 2.8);
		console.log("intensity", intensity);
		console.log("radius", this.radius);
		console.log("y_offset", this.y_offset);
	}
}





var guardian = {
	init: function() {
		if (deployment.is_chrome_ext == true) {
			chrome.runtime.setUninstallURL("https://forms.gle/jUFzghwpdr3NJWmN7"); // Maximum 255 characters.
		}
		if (deployment.is_dev == false) {
			document.addEventListener('contextmenu', event => event.preventDefault());
		}
	}
}










var leaderboard = {
	unique: "",
	init: function() {
		this.get_unique(function() {});

		$("#name_error").hide();

		sync.get("NAME", function(myname) {
			console.log("Got name", myname);
			$("#mem_name").val(myname);
		});

		$("#mem_name").on('change keyup paste', function() {
			let new_name = $("#mem_name").val().trim();
			console.log("new_name", new_name);
			if (leaderboard.check_valid_name(new_name)) {
				sync.set("NAME", new_name, function() {
					console.log("saved new_name", new_name);
					leaderboard.recompute();
				});
			}
		});
	},
	recompute: function() {

		var dodo_score = 0;
		var total_wins = 0;
		var maps_beaten = 0;
		var url_seq = "";

		var last_save = {};
		
		for (let cup_id in cup_info) {
			if (cup_id == "finder") {
				continue;
			}
			if (cup_id == "beginner") {
				continue;
			}
			
			let num_maps_in_cup = map_info[cup_id].length;
			for (let i=0;i<num_maps_in_cup;i++) {
				if (scorekeeper.cups[cup_id] == null) continue;
				var map = {
					...map_info[cup_id][i],
					...scorekeeper.cups[cup_id][i]
				}
				// reduce
				map.xp -= (scorekeeper.delta[map.id] || {xp:0})['xp'];
				if (map.xp == 0) continue;

				// update
				dodo_score += map.xp * map.diff;
				total_wins += map.xp;
				maps_beaten += 1;
				url_seq += `${map.id}=${map.xp}&${map.diff}&${map.time},`;

				// last save
				last_save[map.id] = map.xp;
			}
		};
		url_seq = url_seq.substring(0, url_seq.length - 1);

		url_seq += "@dds="+dodo_score;
		url_seq += ",beat="+maps_beaten;
		url_seq += ",nam=" + $("#mem_name").val().trim();
		url_seq += ",uni="+this.unique;
		
		if (deployment.is_chrome_ext) {
			url_seq += ",ver=" + chrome.runtime.getManifest().version;
		} else {
			url_seq += ",ver=" + "web";
		}

		var hash = btoa(url_seq);

		//
		var checksum = 0;
		for (var i=0;i<hash.length;i++) {
		    checksum += hash.charCodeAt(i) * i * String(i).charCodeAt(0);
		}
		function pad(num) {
		    return ("00"+num).substr(("00"+num).length - 2);
		}
		hash = String(pad(String(checksum).length)) + String(checksum) + hash;

		link = "https://onionfist.com/icesave#v3" + hash;
		// link = "http://localhost:5000/icesave#v3" + hash;
		$("#leaderboard_button").attr("href", link);

		
		function on_click_start() {
			sync.set("last_save", JSON.stringify(last_save), () => {});
		}

		$("#leaderboard_button").on("mousedown", on_click_start);
		$("#leaderboard_button").on("touchstart", on_click_start);
	},
	get_unique: function(callback) {
		sync.get("UNIQUE3", function(data) {
			// Get storage data
			if ((data !== undefined) && (data !== null)) {
				leaderboard.unique = data;
				callback();
			} else {
				leaderboard.unique = Math.floor(Math.random() * Math.floor(Math.random() * Date.now()) * 99);
				sync.set("UNIQUE3", leaderboard.unique, callback);
			}
		});
	},
	set_record() {
		const map_id = settings.map_id;
		const new_score = stats.score;
		// map_score is the frame count upon completion.
		const save_as = map_id + "-tim";
		sync.get(save_as, function(curr_score) {
			if (curr_score) {} else {curr_score = INF};
			
			curr_score = Math.min(curr_score, (scorekeeper.delta[map_id] || {time: INF})['time'])

			if (Number(new_score) < Number(curr_score)) {
				sync.set(save_as, new_score, function() {
					if (curr_score < INF) {
						$("#speedrun_best").text("Your Previous Best Speedrun time: "+curr_score);
					}
					$("#speedrun_now").text("Your New Best Speedrun time: "+new_score );
				});
			} else {
				$("#speedrun_best").text("Your Best Speedrun time: "+curr_score);
				$("#speedrun_now").text("Your Recent Speedrun time: "+new_score );
			}
		});
		// TODO: scorekeeper recompute.
	},
	set_fps() {
		const map_id = settings.map_id;
		const new_fps = stats.fps;
		// map_score is the frame count upon completion.
		const save_as = map_id + "-fps";
		sync.set(save_as, new_fps, function() {
			console.log("Fps", map_id, new_fps);
		});
	},
	check_valid_name(name) {
		function char_check(data, accept) {
			const allowed_chars = accept.split("");
			const data_chars = data.split("");
			for (var i=0;i<data_chars.length;i++) {
				let data_char = data_chars[i];
				if ((allowed_chars.indexOf(data_char) >= 0) == false) {
					return false;
				}
			}
			return true;
		}
		function is_okay_name(data) {
			return char_check(data, "._ abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890");
		}
		if (!is_okay_name(name)) {
			$("#name_error").show();
			$("#leaderboard_button").hide();
		} else {
			$("#name_error").hide();
			$("#leaderboard_button").show();
		}
		return is_okay_name(name);
	},
	speedrun_on_open_map() {
		$("#curr_time").html("");
		$("#best_time").html("");
		$("#speedrun_now").text("");
		$("#speedrun_best").text("");

		if (settings.map_id) {
			const key = settings.map_id + "-tim";
			sync.get(key, function(curr_highscore) {

				var highscore = INF;
				if (curr_highscore != null) highscore = curr_highscore;
				highscore = Math.min(highscore, (scorekeeper.delta[settings.map_id] || {time: INF})['time']);
				
				if (highscore < INF) {
					console.log("TRIGGERED");
					$("#best_time").html("BEST: " + highscore);
					$("#speedrun_best").text("Your Best Speedrun time: "+highscore);
				}
			});
		}
	}
}





var loader = {
	init: function () {
		return new Promise(resolve => {
            if (testing_mode.active == false) {
    			const map_id = settings.map_id;
                const map_src = loader.getMapSrc(map_id)
    			this.load_map(map_src, response => resolve(response));
            } else {
                const map_src = testing_mode.link;
                this.load_map(map_src, response => resolve(response));
            }
		});
	},
    load_map: function(map_js, callback) {
        this.loadScript(map_js, function() {
            setTimeout(function() {
                callback("done");
            }, 200);
        });
    },
    loadScript: function(url, callback) {
        var head = document.getElementsByTagName('head')[0];
        var script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = url;
        script.onreadystatechange = callback;
        script.onload = callback;
        head.appendChild(script);
    },
    getMapSrc(map_id) {
             
        return "maps/" + map_id + ".js";
        
        
    }
}



var maker = {
    platform_count: 0,
    cone_count: 0,
    cylinder_count: 0,
    sphere_count: 0,
    ending_count: 0,
    plat1: null,
    plat2: null,
    plat3: null,
    init: function() {
        this.add_root_meshes("cone", 2, (i) => {
            return BABYLON.Mesh.CreateCylinder("cone"+i, 1.0, 0.0, 1.0, 5, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        });
        this.add_root_meshes("plat", 8, (i) => {
            return BABYLON.Mesh.CreateBox("plat"+i,1, scene);
        });
        this.add_root_meshes("sphere", 5, (i) => {
            return BABYLON.Mesh.CreateSphere("sphere"+i, 10, 1, scene);
        });
    },
    add_root_meshes: function(name, count, fn) {
        for (var i=0;i<count;i++) {
            this[name+i] = fn(i);
            decorations.decorate(this[name+i], name+i);
            this[name+i].isVisible = false;
            this[name+i].cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
        }  
    },
    make_platform: function(posList, rotList, sizList, imat=0, bounce=0, mass=0, friction=0.6, jump=false, air=false) {
        // Data
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        let rX = rotList[1]; let rY = rotList[0]; let rZ = rotList[2];
        let sX = sizList[0]; let sY = sizList[1]; let sZ = sizList[2];
        pY += Math.random() * 0.0007;
        // Mesh
        let mesh_name = "P" + this.platform_count;
        var platform;

        function isNum(x) {
            return (isNaN(Math.round(x)) == false);
        }
        if (isNum(imat)) {
            imat = Math.round(imat);
            platform = (this["plat"+imat] || this["plat"+0]).createInstance(mesh_name);
            if (imat == -1) platform.isVisible = false;
        } else {
            platform = BABYLON.Mesh.CreateBox(mesh_name,1, scene);
            platform.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
            let color_obj = decorations.hexToRgb("#"+imat);
            console.log("color_obj", color_obj);
            platform.material = decorations.rgba_mat(color_obj.r, color_obj.g, color_obj.b, color_obj.a);
        }
        
        // Set
        platform.scaling = new BABYLON.Vector3(sX,sY,sZ);
        platform.position = new BABYLON.Vector3(pX,pY,pZ);
        platform.rotation = new BABYLON.Vector3(rX,rY,rZ);
        // platform.freezeWorldMatrix(); // Don't use:  ???
        // Physics
        if (air == false) {
            platform.physicsImpostor = new BABYLON.PhysicsImpostor(platform, BABYLON.PhysicsImpostor.BoxImpostor, { mass: mass, restitution: bounce, friction: friction}, scene);
        }
        // Tracker
        this.platform_count += 1;
        if (jump == true) {
            jumppads.push(platform);
        }
    },
    make_cone: function(posList, imat) {
        // Data
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        // Mesh
        let mesh_name = "C" + this.cone_count;
        
        if ((imat == true) || (imat == false)) {
            imat = (imat == true) ? 1 : 0;
        }

        var cone;
        if (isNaN(Math.round(imat)) == false) {
            imat = Math.round(imat);
            cone = (this["cone"+imat] || this["cone"+0]).createInstance(mesh_name);
            if (imat == -1) cone.isVisible = false;
        } else {
            cone = BABYLON.Mesh.CreateCylinder(mesh_name, 1.0, 0.0, 1.0, 5, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
            cone.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
            let color_obj = decorations.hexToRgb("#"+imat);
            cone.material = decorations.rgba_mat(color_obj.r, color_obj.g, color_obj.b, color_obj.a);
        }
        
        // Set
        cone.position = new BABYLON.Vector3(pX,pY,pZ);
        cone.scaling.y = 1.2;
        cone.freezeWorldMatrix();
        // Tracker
        cones.push(cone);
        this.cone_count += 1;
    },
    make_sphere: function(posList, r, imat=0, bounce=0, mass=0, friction=0.6, air=false) {
        // Data
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        // Mesh
        let mesh_name = "S" + this.sphere_count;
        var sphere;

        if (isNaN(Math.round(imat)) == false) {
            imat = Math.round(imat);
            sphere = (this["sphere"+imat] || this["sphere"+0]).createInstance(mesh_name);
            if (imat == -1) sphere.isVisible = false;
        } else {
            sphere = BABYLON.Mesh.CreateSphere(mesh_name, 10, 1, scene);
            sphere.cullingStrategy = BABYLON.AbstractMesh.CULLINGSTRATEGY_BOUNDINGSPHERE_ONLY;
            let color_obj = decorations.hexToRgb("#"+imat);
            sphere.material = decorations.rgba_mat(color_obj.r, color_obj.g, color_obj.b, color_obj.a);
        }
        // Set
        sphere.position = new BABYLON.Vector3(pX,pY,pZ);
        sphere.scaling = new BABYLON.Vector3(r,r,r);
        sphere.freezeWorldMatrix(); // // Don't use: ???
        // Physics
        if (air == false) {
            sphere.physicsImpostor = new BABYLON.PhysicsImpostor(sphere, BABYLON.PhysicsImpostor.SphereImpostor, { mass: mass, restitution: bounce, friction: friction }, scene);
        }
        // Tracker
        this.sphere_count += 1;
    },
    make_ending: function(posList) {
        // Data
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        // Mesh
        let mesh_name = "E" + this.ending_count;
        var ending = BABYLON.Mesh.CreateCylinder(mesh_name, 2.0, 2.0, 2.0, 8, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        ending.position = new BABYLON.Vector3(pX, pY, pZ);
        // Visuals
        ending.material = decorations.materials.ending;
        ending.freezeWorldMatrix();
        // Physics
        endings.push(ending);
        this.ending_count += 1;
    },
    make_cylinder: function(posList, rotList, sizList, imat=0, bounce=0, mass=0, friction=0.6, air=false, topR=1) {
        // Data
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        let rX = rotList[1]; let rY = rotList[0]; let rZ = rotList[2];
        let sX = sizList[0]; let sY = sizList[1]; let sZ = sizList[2];
        
        const height = 1;//sY;
        const radius = 1;//sZ;

        var mesh = BABYLON.Mesh.CreateCylinder("Y" + this.cylinder_count, height, radius * topR, radius, 12, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        mesh.scaling = new BABYLON.Vector3(sX,sY,sZ);
        mesh.position = new BABYLON.Vector3(pX,pY,pZ);
        mesh.rotation = new BABYLON.Vector3(rX,rY,rZ);
        
        if (air == false) {
            mesh.physicsImpostor = new BABYLON.PhysicsImpostor(mesh, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: mass, restitution: bounce, friction: friction }, scene);
        }
        
        
        if (isNaN(Math.round(imat)) == false) {
            imat = Math.round(imat);
            decorations.decorate(mesh, "cylinder"+imat);
        } else {
            let color_obj = decorations.hexToRgb("#"+imat);
            mesh.material = decorations.rgba_mat(color_obj.r, color_obj.g, color_obj.b, color_obj.a);
        }
        if (imat == -1) mesh.isVisible = false;
        this.cylinder_count += 1;
    },
    make_start: function(posList) {
        let pX = posList[0]; let pY = posList[1]; let pZ = posList[2];
        this.make_platform([pX,pY,pZ+9], [0,0,0], [3,0.5, 14]);
    },
    og_tree: function(positionX, positionY, positionZ) {
        var greenTexture = decorations.materials.cylinder5;
        var brownTexture = decorations.materials.cylinder6;


        var cylinderXD = BABYLON.Mesh.CreateCylinder("Y" + this.cylinder_count, 0.65, 0.0, 3.3, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        cylinderXD.position.z = (positionZ);
        cylinderXD.position.x = (positionX * -1);
        cylinderXD.position.y = (positionY + 1);
        cylinderXD.physicsImpostor = new BABYLON.PhysicsImpostor(cylinderXD, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0.0, restitution: 0.0 }, scene);
        cylinderXD.material = greenTexture;
        this.cylinder_count += 1;

        var cylinderXD2 = BABYLON.Mesh.CreateCylinder("Y" + this.cylinder_count, 1.65, 0.3, 0.3, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        cylinderXD2.position.z = (positionZ);
        cylinderXD2.position.x = (positionX * -1);
        cylinderXD2.position.y = (positionY);
        cylinderXD2.physicsImpostor = new BABYLON.PhysicsImpostor(cylinderXD2, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0.0, restitution: 0.0 }, scene);
        cylinderXD2.material = brownTexture;

        this.cylinder_count += 1;
    },
    og_cone: function(positionY, positionZ, positionX) {
        var fireTexture = decorations.materials.cylinder4;
        var cylinder = BABYLON.Mesh.CreateCylinder("Y" + this.cylinder_count, 0.45, 0.0, 0.45, 10, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        cylinder.position.z = (positionZ);
        cylinder.position.x = (positionX);
        cylinder.position.y = (positionY);
        cylinder.physicsImpostor = new BABYLON.PhysicsImpostor(cylinder, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0.0, restitution: 0.0 }, scene);
        cylinder.material = fireTexture;

        this.cylinder_count += 1;
    },
    og_cylinder(positionX, positionY, positionZ, rotationY, rotationX, rotationZ, rad, hei) {
        var cylinderXD = BABYLON.Mesh.CreateCylinder("Y" + this.cylinder_count, hei, rad, rad, 12, 1, scene, false, BABYLON.Mesh.DEFAULTSIDE);
        cylinderXD.position.z = (positionZ);
        cylinderXD.position.x = (positionX * -1);
        cylinderXD.position.y = (positionY);
        cylinderXD.physicsImpostor = new BABYLON.PhysicsImpostor(cylinderXD, BABYLON.PhysicsImpostor.CylinderImpostor, { mass: 0.0, restitution: 0.0 }, scene);
        cylinderXD.material = decorations.materials.cylinder1;
        cylinderXD.rotation.x = (rotationX * (Math.PI / 180)); // complete
        cylinderXD.rotation.y = (rotationY * (Math.PI / 180)); // complete
        cylinderXD.rotation.z = (rotationZ * (Math.PI / 180)); // complete
        
        this.cylinder_count += 1;
    }

}





var map_info = 
{
    "beginner": [
        {"diff": 1, "id": "tut1", "name": "Welcome Map"},
        {"diff": 1, "id": "slow_walk", "name": "Slow Walk"},
        {"diff": 2, "id": "ice_cold", "name": "Ice Cold"},
        {"diff": 2, "id": "heights", "name": "Heights"},
        {"diff": 2, "id": "ice2", "name": "Snowboarder"},
        {"diff": 2, "id": "tilted_tracks", "name": "Tilted Tracks"},
        {"diff": 3, "id": "spook", "name": "Spook"},
        {"diff": 3, "id": "megafauna", "name": "Megafauna"},
        {"diff": 3, "id": "easydrifting", "name": "Easy Drifting"},
        {"diff": 3, "id": "dodo_type_beat", "name": "Dodo Type Beat"},
        {"diff": 3, "id": "atmosphere", "name": "Atmosphere"},
        {"diff": 3, "id": "scorpion", "name": "Scorpion"},
        {"diff": 3, "id": "think_fast", "name": "Think Fast"},
        {"diff": 3, "id": "blizzard", "name": "Blizzard"},
        {"diff": 3, "id": "topsy_turvy", "name": "Topsy Turvy"},
        {"diff": 4, "id": "fade", "name": "Fade"},
        {"diff": 4, "id": "blink_street", "name": "Blink Street"},
        {"diff": 4, "id": "aurora", "name": "Aurora"},
        {"diff": 4, "id": "motor", "name": "Motor"},
        {"diff": 4, "id": "conveyor", "name": "Conveyor"},
        {"diff": 4, "id": "frost_factory", "name": "Frost Factory"},
        {"diff": 4, "id": "glass_staircase", "name": "Glass Staircase"},
        {"diff": 5, "id": "river", "name": "River"},
        {"diff": 5, "id": "hyperdrive", "name": "Hyperdrive"},
        {"diff": 5, "id": "coneycliffs", "name": "Coney Cliffs"},
        {"diff": 5, "id": "tenet", "name": "Tenet"},
        {"diff": 6, "id": "cone1", "name": "4D Demon Cinema"},
        {"diff": 6, "id": "sector_8", "name": "Sector 8"},
        {"diff": 6, "id": "snowmen_land", "name": "Snowmen Land"},
        {"diff": 6, "id": "spin_dodge", "name": "Spin Dodge"},
        {"diff": 6, "id": "og7", "name": "Cloud"},
        {"diff": 6, "id": "colour_land", "name": "Colour Land"},
        {"diff": 6, "id": "transcendence", "name": "Transcendence"},
        {"diff": 7, "id": "spitting_spikes", "name": "Spitting Spikes"},
        {"diff": 7, "id": "tremor", "name": "Tremor"},
        {"diff": 7, "id": "dodo_kong", "name": "Dodo Kong"},
        {"diff": 8, "id": "spacecanyon", "name": "Space Canyon"},
    ],
    "kazil": [
        {"diff": 1, "id": "trek", "name": "Trek"},
        {"diff": 3, "id": "scorpion", "name": "Scorpion"},
        {"diff": 3, "id": "trailblazer", "name": "Trailblazer"},
        {"diff": 3, "id": "easydrifting", "name": "Easy Drifting"},
        {"diff": 3, "id": "secrettunnel", "name": "Secret Tunnel"},
        {"diff": 4, "id": "snake_climb", "name": "Snake Climb"},
        {"diff": 5, "id": "moving_road", "name": "Moving Road"},
        {"diff": 5, "id": "sky_run", "name": "Sky Run"},
        {"diff": 5, "id": "race", "name": "Race"},
        {"diff": 6, "id": "observatory", "name": "Observatory"},
        {"diff": 6, "id": "crosspath", "name": "Cross Path"},
        {"diff": 6, "id": "apartment", "name": "Apartment"},
        {"diff": 10, "id": "0001", "name": ".0001"},
    ],
    "carrot": [
        {"diff": 1, "id": "lanterns", "name": "Lanterns"},
        {"diff": 3, "id": "megafauna", "name": "Megafauna"},
        {"diff": 3, "id": "dodo_type_beat", "name": "Dodo Type Beat"},
        {"diff": 3, "id": "mirror", "name": "Mirror"},
        {"diff": 3, "id": "remote_control", "name": "remote control"},
        {"diff": 3, "id": "afterlife", "name": "AFTERLIFE"},
        {"diff": 4, "id": "blink_street", "name": "Blink Street"},
        {"diff": 4, "id": "asteroid_belt", "name": "Asteroid Belt"},
        {"diff": 5, "id": "redlights", "name": "Red Lights Green Lights"},
        {"diff": 5, "id": "conefield", "name": "Conefield"},
        {"diff": 5, "id": "necropolis", "name": "Necropolis"},
        {"diff": 5, "id": "solar_system", "name": "Solar System"},
        {"diff": 5, "id": "trial_by_magic", "name": "Trial by Magic"},
        {"diff": 5, "id": "celestial_magnetism", "name": "Celestial Magnetism"},
        {"diff": 5, "id": "phantasmagoria", "name": "Phantasmagoria"},
        {"diff": 6, "id": "snowmen_land", "name": "Snowmen Land"},
        {"diff": 6, "id": "snowmenace", "name": "Snowmenace"},
        {"diff": 6, "id": "stardust", "name": "Project Stardust"},
        {"diff": 6, "id": "climbing_dodo_fortress", "name": "Climbing Dodo Fortress"},
        {"diff": 7, "id": "prison_is_2d", "name": "Prison is 2D"},
        {"diff": 8, "id": "revolving_cube_floats", "name": "Revolving Cube Floats"},
        {"diff": 8, "id": "utopia_is_up_there", "name": "Utopia is Up There"},
        {"diff": 8, "id": "spacecanyon", "name": "Space Canyon"},
    ],
    "dodo": [
        {"diff": 1, "id": "tut1", "name": "Welcome Map"},
        {"diff": 2, "id": "castle", "name": "Castle"},
        {"diff": 2, "id": "ice1", "name": "Icy Path"},
        {"diff": 2, "id": "ice2", "name": "Snowboarder"},
        {"diff": 2, "id": "ravine", "name": "Ravine"},
        {"diff": 4, "id": "motor", "name": "Motor"},
        {"diff": 4, "id": "floating_fortress", "name": "Floating Fortress"},
        {"diff": 5, "id": "cone2", "name": "The Red Hats"},
        {"diff": 5, "id": "cone3", "name": "Dangerous Zone"},
        {"diff": 5, "id": "tenet", "name": "Tenet"},
        {"diff": 6, "id": "cone1", "name": "4D Demon Cinema"},
        {"diff": 8, "id": "inverted_playground", "name": "Inverted Playground"},
    ],
    "doom": [
        {"diff": 1, "id": "slow_walk", "name": "Slow Walk"},
        {"diff": 2, "id": "ez_map", "name": "EZ Map"},
        {"diff": 2, "id": "gradual_climb", "name": "Gradual Climb"},
        {"diff": 3, "id": "speed_jump", "name": "Speed Jump"},
        {"diff": 3, "id": "wall_of_force", "name": "Wall of Force"},
        {"diff": 4, "id": "dragon_domain", "name": "Dragon Domain"},
        {"diff": 4, "id": "invisible_road", "name": "Invisible Road"},
        {"diff": 5, "id": "volcano", "name": "Volcano"},
        {"diff": 5, "id": "cone_elevator", "name": "Cone-Elevator"},
        {"diff": 6, "id": "u_turn2", "name": "U Turn"},
        {"diff": 7, "id": "sea_of_fire", "name": "Sea of Fire"},
        {"diff": 7, "id": "into_the_sky", "name": "Into the Sky"},
        {"diff": 7, "id": "tube_elevator", "name": "Tube elevator"},
        {"diff": 7, "id": "1c3d0d0", "name": "1c3d0d0"},
        {"diff": 8, "id": "skilledorkilled", "name": "Skilledorkilled"},
    ],
    "pilot": [
        {"diff": 1, "id": "bounce", "name": "Bounce"},
        {"diff": 1, "id": "coaster", "name": "Coaster"},
        {"diff": 2, "id": "going_through", "name": "Going Through"},
        {"diff": 2, "id": "bottom_to_top", "name": "Bottom To Top"},
        {"diff": 2, "id": "bumper", "name": "Bumper"},
        {"diff": 2, "id": "steep_walls", "name": "Steep Walls"},
        {"diff": 2, "id": "crazy_cones", "name": "Crazy Cones"},
        {"diff": 2, "id": "trust", "name": "Trust"},
        {"diff": 3, "id": "gravity_bounce", "name": "Gravity Bounce"},
        {"diff": 3, "id": "launch", "name": "Launch"},
        {"diff": 3, "id": "soaring", "name": "Soaring"},
        {"diff": 3, "id": "first_person", "name": "First Person"},
        {"diff": 3, "id": "holographic", "name": "Holographic"},
        {"diff": 3, "id": "think_fast", "name": "Think Fast"},
        {"diff": 3, "id": "jump_path", "name": "Jump Path"},
        {"diff": 3, "id": "bridge_of_speed", "name": "Bridge Of Speed"},
        {"diff": 3, "id": "mixed_leaps", "name": "Mixed Leaps"},
        {"diff": 3, "id": "moving_bridge", "name": "Moving Bridge"},
        {"diff": 3, "id": "nothing_is_easy", "name": "Nothing is Easy"},
    ],
    "rocky": [
        {"diff": 0, "id": "ice_bot", "name": "Ice Bot"},
        {"diff": 1, "id": "hello_world", "name": "Hello World"},
        {"diff": 1, "id": "temple", "name": "Temple"},
        {"diff": 1, "id": "jump_pads", "name": "Jump Pads"},
        {"diff": 2, "id": "gearbox", "name": "Gearbox"},
        {"diff": 2, "id": "rooftops", "name": "Rooftops"},
        {"diff": 2, "id": "neo", "name": "Neo"},
        {"diff": 2, "id": "pool", "name": "Pool"},
        {"diff": 2, "id": "parke", "name": "Parke"},
        {"diff": 2, "id": "hide_and_seek", "name": "Hide and Seek"},
        {"diff": 2, "id": "tilted_tracks", "name": "Tilted Tracks"},
        {"diff": 2, "id": "the_floor_is_lava", "name": "The Floor Is Lava"},
        {"diff": 2, "id": "stone_path", "name": "Stone Path"},
        {"diff": 3, "id": "pyrovision", "name": "Pyrovision"},
        {"diff": 3, "id": "asteroids", "name": "Asteroids"},
        {"diff": 3, "id": "triskaidekaphobia", "name": "Triskaidekaphobia"},
        {"diff": 3, "id": "automatic_and_manual", "name": "Automatic and Manual"},
        {"diff": 3, "id": "barn", "name": "Barn"},
        {"diff": 3, "id": "pathway", "name": "Pathway"},
        {"diff": 3, "id": "blindness", "name": "Blindness"},
        {"diff": 3, "id": "desserts", "name": "Desserts"},
        {"diff": 3, "id": "spook", "name": "Spook"},
        {"diff": 3, "id": "the_backrooms", "name": "The Backrooms"},
        {"diff": 4, "id": "cone_haven", "name": "Cone Haven"},
        {"diff": 4, "id": "shrink_ray", "name": "Shrink Ray"},
        {"diff": 4, "id": "pac_dodo", "name": "Pac Dodo"},
        {"diff": 5, "id": "rotating_spirals", "name": "Rotating Spirals"},
        {"diff": 4, "id": "memory_game", "name": "Memory Game"},
        {"diff": 4, "id": "colosseum", "name": "Colosseum"},
        {"diff": 4, "id": "wipeout", "name": "Wipeout"},
        {"diff": 4, "id": "icerace", "name": "Icerace"},
        {"diff": 5, "id": "minecarts", "name": "Minecarts"},
        {"diff": 5, "id": "thero", "name": "Thero"},
        {"diff": 5, "id": "troll_map", "name": "Troll Map"},
        {"diff": 5, "id": "point_of_no_return", "name": "Point Of No Return"},
        {"diff": 5, "id": "skating", "name": "Skating"},
        {"diff": 5, "id": "papercut", "name": "Papercut"},
        {"diff": 6, "id": "tight_path", "name": "Tight Path"},
        {"diff": 6, "id": "chase", "name": "Chase"},
        {"diff": 6, "id": "gravity_chamber", "name": "Gravity Chamber"},
        {"diff": 6, "id": "wall_jumps", "name": "Wall Jumps"},
        {"diff": 7, "id": "sinking_ship", "name": "Sinking Ship"},
        {"diff": 8, "id": "weaving", "name": "Weaving"},
        {"diff": 8, "id": "rhythm", "name": "Rhythm"},
        {"diff": 9, "id": "dragon_dance", "name": "Dragon Dance"},
        {"diff": 10, "id": "wall_riders", "name": "Wall Riders"},
        {"diff": 11, "id": "mayhem", "name": "Mayhem"},
    ],
    "furby": [
        {"diff": 2, "id": "the_sloth", "name": "The Sloth"},
        {"diff": 2, "id": "ice_cold", "name": "Ice Cold"},
        {"diff": 2, "id": "king_of_the_clouds", "name": "King of the Clouds"},
        {"diff": 2, "id": "geometrical", "name": "Geometrical"},
        {"diff": 3, "id": "invisible_maze", "name": "Invisible Maze"},
        {"diff": 4, "id": "trapped_temple", "name": "Trapped Temple"},
        {"diff": 4, "id": "glass_staircase", "name": "Glass Staircase"},
        {"diff": 4, "id": "micrododo", "name": "Micrododo"},
        {"diff": 4, "id": "super_dodo_bros", "name": "Super Dodo Bros"},
        {"diff": 5, "id": "the_cheetah", "name": "The Cheetah"},
        {"diff": 5, "id": "haunted_ruins", "name": "Haunted Ruins"},
        {"diff": 6, "id": "cutting_corners", "name": "Cutting Corners"},
        {"diff": 6, "id": "nascar", "name": "NASCAR"},
        {"diff": 6, "id": "ninja_warrior", "name": "Ninja Warrior"},
        {"diff": 7, "id": "spitting_spikes", "name": "Spitting Spikes"},
        {"diff": 7, "id": "chichen_itza", "name": "Chichen Itza"},
        {"diff": 8, "id": "balance_beam", "name": "Balance Beam"},
    ],
    "skilled": [
        {"diff": 1, "id": "alley", "name": "Alley"},
        {"diff": 4, "id": "train", "name": "Train"},
        {"diff": 4, "id": "rotating_blades", "name": "Rotating Blades"},
        {"diff": 5, "id": "acceleration_and_brakes", "name": "Acceleration and Brakes"},
        {"diff": 5, "id": "broken_bridge", "name": "Broken Bridge"},
        {"diff": 5, "id": "sharp_turning", "name": "Sharp turning"},
        {"diff": 5, "id": "flipside", "name": "Flipside"},
        {"diff": 5, "id": "flame", "name": "Flame"},
        {"diff": 6, "id": "lightning", "name": "Lightning"},
        {"diff": 6, "id": "moving_blocks", "name": "Moving Blocks"},
        {"diff": 6, "id": "blind_spot", "name": "Blind Spot"},
        {"diff": 6, "id": "teleport", "name": "Teleport"},
        {"diff": 6, "id": "parkour", "name": "Parkour"},
        {"diff": 6, "id": "transcendence", "name": "Transcendence"},
        {"diff": 6, "id": "skiing", "name": "Skiing"},
        {"diff": 7, "id": "bridge_of_peril", "name": "Bridge of Peril"},
        {"diff": 7, "id": "racetrack", "name": "Racetrack"},
        {"diff": 8, "id": "encirclement", "name": "Encirclement"},
        {"diff": 9, "id": "phase_shift", "name": "Phase shift"},
    ],
    "tim": [
        {"diff": 2, "id": "ffffff", "name": "ffffff"},
        {"diff": 2, "id": "pantheon", "name": "Pantheon"},
        {"diff": 3, "id": "dreamscapes", "name": "Dreamscapes"},
        {"diff": 3, "id": "badlands", "name": "Badlands"},
        {"diff": 3, "id": "honeylands", "name": "Honeylands"},
        {"diff": 4, "id": "reaction", "name": "Reaction"},
        {"diff": 4, "id": "block_flight", "name": "Block Flight"},
        {"diff": 4, "id": "industrial", "name": "Industrial"},
        {"diff": 4, "id": "firefrost", "name": "Firefrost"},
        {"diff": 5, "id": "falling_game", "name": "Falling Game"},
        {"diff": 6, "id": "moonrunner", "name": "Moonrunner"},
        {"diff": 7, "id": "power_rooms", "name": "Power Rooms"},
        {"diff": 7, "id": "ironriver_rapids", "name": "Ironriver Rapids"},
    ],
    "abc": [
        {"diff": 1, "id": "sidewalk", "name": "Sidewalk"},
        {"diff": 2, "id": "trainway", "name": "trainway"},
        {"diff": 2, "id": "neighbourhood", "name": "Neighbourhood"},
        {"diff": 3, "id": "drums", "name": "Drums"},
        {"diff": 3, "id": "wilderness", "name": "Wilderness"},
        {"diff": 4, "id": "opposite_day", "name": "Opposite Day"},
        {"diff": 4, "id": "road_race", "name": "Road Race"},
        {"diff": 4, "id": "mushroom_peninsula", "name": "Mushroom peninsula"},
        {"diff": 5, "id": "a_thundery_journey", "name": "A Thundery Journey"},
        {"diff": 6, "id": "wall_to_wall", "name": "Wall To Wall"},
        {"diff": 6, "id": "fatal_leaps", "name": "Fatal Leaps"},
        {"diff": 6, "id": "operations", "name": "Operations"},
        {"diff": 7, "id": "wall_paths", "name": "Wall Paths"},
        {"diff": 7, "id": "anguished", "name": "Anguished"},
        {"diff": 8, "id": "provoking", "name": "Provoking"},
    ],
    "mango": [
        {"diff": 2, "id": "heights", "name": "Heights"},
        {"diff": 2, "id": "ring_of_fire", "name": "Ring of Fire"},
        {"diff": 2, "id": "chemistry", "name": "Chemistry"},
        {"diff": 3, "id": "up_and_down", "name": "Up And Down"},
        {"diff": 3, "id": "doors_of_doom", "name": "Doors of Doom"},
        {"diff": 4, "id": "windingpath", "name": "Winding Path"},
        {"diff": 4, "id": "tumbles_and_turns", "name": "Tumbles and Turns"},
        {"diff": 5, "id": "archipelago", "name": "Archipelago"},
        {"diff": 5, "id": "road_chasing", "name": "Road Chasing"},
        {"diff": 5, "id": "dodo_on_ice", "name": "Dodo on ice"},
        {"diff": 5, "id": "earth_exploration", "name": "Earth Exploration"},    
        {"diff": 5, "id": "leaps_in_the_limelight", "name": "Leaps in the Limelight"},
        {"diff": 5, "id": "tile_jump", "name": "Tile Jump"},
        {"diff": 5, "id": "patterns", "name": "Patterns"},
        {"diff": 6, "id": "spiral", "name": "Spiral"},
        {"diff": 6, "id": "cones_and_chaos", "name": "Cones and Chaos"},
        {"diff": 6, "id": "obstacle_lane", "name": "Obstacle Lane"},
        {"diff": 6, "id": "dodo_tiles", "name": "Dodo tiles"},
        {"diff": 7, "id": "coral_reef", "name": "Coral Reef"},
        {"diff": 7, "id": "spacewalk", "name": "Spacewalk"},
        {"diff": 8, "id": "ascend", "name": "Ascend"},
    ],
    "sleepy": [
        {"diff": 2, "id": "centipede", "name": "Centipede"},
        {"diff": 3, "id": "atmosphere", "name": "Atmosphere"},
        {"diff": 3, "id": "agency", "name": "Agency"},
        {"diff": 3, "id": "outside_the_box", "name": "Outside the Box"},
        {"diff": 4, "id": "across_lava", "name": "Across Lava"},
        {"diff": 4, "id": "transported", "name": "Transported"},
        {"diff": 4, "id": "dodo_eat_ice", "name": "Dodo Eat Ice"},
        {"diff": 4, "id": "climbing_training", "name": "Climbing Training"},
        {"diff": 4, "id": "spacetrail", "name": "SpaceTrail"},
        {"diff": 4, "id": "slackline", "name": "Slackline"},
        {"diff": 4, "id": "castle_in_the_sky", "name": "Castle in the Sky"},
        {"diff": 4, "id": "fall_dodo", "name": "Fall Dodo"},
        {"diff": 5, "id": "roundabout", "name": "Roundabout"},
        {"diff": 5, "id": "fire_and_water", "name": "Fire and Water"},
        {"diff": 5, "id": "peak", "name": "Peak"},
        {"diff": 6, "id": "heist", "name": "Heist"},
        {"diff": 6, "id": "spin_dodge", "name": "Spin Dodge"},
        {"diff": 6, "id": "cone_maze", "name": "Cone Maze"},
        {"diff": 7, "id": "achromatopsia", "name": "Achromatopsia"},
        {"diff": 7, "id": "forest", "name": "Forest"},
        {"diff": 7, "id": "heaven_and_hell", "name": "Heaven and Hell"},
        {"diff": 8, "id": "china_grove", "name": "China Grove"},
    ],
    "crazy": [
        {"diff": 2, "id": "shortcuts", "name": "Shortcuts"},
        {"diff": 2, "id": "odd_one_out", "name": "Odd One Out"},
        {"diff": 3, "id": "glitchy_dodo", "name": "Glitchy Dodo"},
        {"diff": 3, "id": "cone_cylinder", "name": "Cone Cylinder"},
        {"diff": 3, "id": "spaceshot", "name": "Spaceshot"},
        {"diff": 3, "id": "playground", "name": "Playground"},
        {"diff": 3, "id": "through_the_hole", "name": "Through the Hole"},
        {"diff": 4, "id": "rainbow", "name": "Rainbow"},
        {"diff": 4, "id": "in_a_machine", "name": "In a Machine"},
        {"diff": 4, "id": "a_dangerous_climb", "name": "A Dangerous Climb"},
        {"diff": 4, "id": "restart", "name": "Restart"},
        {"diff": 5, "id": "hyperdrive", "name": "Hyperdrive"},
        {"diff": 5, "id": "there_is_no_map", "name": "There Is No Map"},
        {"diff": 5, "id": "rainbow_cliffs", "name": "Rainbow Cliffs"},
        {"diff": 6, "id": "colour_land", "name": "Colour Land"},
        {"diff": 6, "id": "there_is_a_map", "name": "There Is a Map"},
        {"diff": 6, "id": "burning_bridge", "name": "Burning Bridge"},
        {"diff": 7, "id": "dodo_nullius", "name": "Dodo Nullius"},
        {"diff": 7, "id": "waterpark", "name": "Waterpark"},
        {"diff": 9, "id": "skill_trail", "name": "Skill Trial"},
    ],
    "squirrel": [
        {"diff": 2, "id": "bored", "name": "Bored"},
        {"diff": 2, "id": "traintrouble", "name": "TrainTrouble"},
        {"diff": 3, "id": "do_not_jump", "name": "Do Not Jump"},
        {"diff": 4, "id": "prototype", "name": "Prototype"},
        {"diff": 4, "id": "the_dodo_escape", "name": "The Dodo Escape"},
        {"diff": 4, "id": "dodo_rex", "name": "Dodo Rex"},
        {"diff": 4, "id": "the_log", "name": "The Log"},
        {"diff": 4, "id": "relics", "name": "Relics"},
        {"diff": 5, "id": "button_maze", "name": "Button maze"},
        {"diff": 5, "id": "ice_cocos", "name": "Ice Cocos"},
        {"diff": 5, "id": "cylinder_insanity", "name": "Cylinder Insanity"},
        {"diff": 5, "id": "overflow", "name": "Overflow"},
        {"diff": 5, "id": "coneycliffs", "name": "Coney Cliffs"},
        {"diff": 5, "id": "spacetest", "name": "Space Test"},
        {"diff": 5, "id": "crossgravity", "name": "Cross Gravity"},
        {"diff": 6, "id": "dodo_a", "name": "Dodo's Adventure"},
        {"diff": 6, "id": "avalanche", "name": "Avalanche"},
        {"diff": 7, "id": "space_track", "name": "Space Track"},
        {"diff": 7, "id": "dodos_among_us", "name": "Dodos among us"},
        {"diff": 7, "id": "dodo_tower", "name": "Dodo Tower"},
        {"diff": 7, "id": "dodo_dash", "name": "Dodo Dash"},
    ],
    "june": [
        {"diff": 2, "id": "tracks", "name": "Tracks"},
        {"diff": 2, "id": "colourful_doors", "name": "Colourful Doors"},
        {"diff": 2, "id": "pride", "name": "Pride"},
        {"diff": 2, "id": "autumn", "name": "Autumn"},
        {"diff": 3, "id": "hills", "name": "Hills"},
        {"diff": 3, "id": "solar_land", "name": "Solar Land"},
        {"diff": 3, "id": "jumping_challenge", "name": "Jumping Challenge"},
        {"diff": 4, "id": "ready_player_1", "name": "Ready Player 1"},
        {"diff": 4, "id": "spiky_peaks", "name": "Spiky Peaks"},
        {"diff": 4, "id": "hop_hop", "name": "Hop Hop"},
        {"diff": 4, "id": "tilty_blocks", "name": "Tilty Blocks"},
        {"diff": 4, "id": "dodge", "name": "Dodge"},
        {"diff": 5, "id": "twistedroad", "name": "Twisted Road"},
        {"diff": 5, "id": "speed_round", "name": "Speed Round"},
        {"diff": 6, "id": "speedway", "name": "Speedway"},
        {"diff": 6, "id": "the_cone_road", "name": "The Cone Road"},
        {"diff": 6, "id": "dual_path", "name": "Dual Path"},
        {"diff": 6, "id": "summit", "name": "Summit"},
        {"diff": 7, "id": "air_road", "name": "Air Road"},
    ],
    "collab": [
        {"diff": 1, "id": "easter", "name": "Easter"},
        {"diff": 3, "id": "ghost_road", "name": "Ghost road"},
        {"diff": 3, "id": "tightrope", "name": "Tightrope"},
        {"diff": 3, "id": "darkest_depths", "name": "Darkest Depths"},
        {"diff": 4, "id": "conveyor", "name": "Conveyor"},
        {"diff": 4, "id": "bullseye", "name": "Bullseye"},
        {"diff": 4, "id": "cosmos_cruise", "name": "Cosmos Cruise"},
        {"diff": 4, "id": "lily_lotus_lake", "name": "Lily Lotus Lake"},
        {"diff": 4, "id": "snake", "name": "Snake"},
        {"diff": 4, "id": "track_together", "name": "Track together"},
        {"diff": 5, "id": "cliffhanger", "name": "Cliffhanger"},
        {"diff": 5, "id": "romantic_turnaround", "name": "Romantic Turnaround"},
        {"diff": 5, "id": "dual_colors", "name": "Dual Colors"},
        {"diff": 5, "id": "booby_traps", "name": "Booby Traps"},
        {"diff": 5, "id": "plane_crash", "name": "Plane Crash"},
        {"diff": 5, "id": "burst", "name": "Burst"},
        {"diff": 6, "id": "rocky_road", "name": "Rocky Road"},
        {"diff": 6, "id": "50_jumps", "name": "50 Jumps"},
        {"diff": 6, "id": "milk_flood", "name": "Milk Flood"},
        {"diff": 6, "id": "hotdog", "name": "hotdog"},
        {"diff": 7, "id": "ambush", "name": "Ambush"},
        {"diff": 7, "id": "danger_dragon", "name": "Danger Dragon"},
        {"diff": 8, "id": "circuit", "name": "Circuit"},
        {"diff": 9, "id": "rage_fuel", "name": "Rage Fuel"},
        {"diff": 9, "id": "shuriken", "name": "shuriken"},
        {"diff": 8, "id": "megacollab", "name": "Megacollab"},
    ],
    "ye": [
        {"diff": 1, "id": "flip_turn", "name": "Flip Turn"},
        {"diff": 2, "id": "arithmetic", "name": "Arithmetic"},
        {"diff": 2, "id": "through_the_block", "name": "Through the Block"},
        {"diff": 2, "id": "holes_and_cracks", "name": "Holes and Cracks"},
        {"diff": 2, "id": "jetty", "name": "Jetty"},
        {"diff": 2, "id": "the_golden_brick", "name": "The Golden Brick"},
        {"diff": 3, "id": "earthquake", "name": "Earthquake"},
        {"diff": 3, "id": "shapes", "name": "Shapes"},
        {"diff": 3, "id": "topsy_turvy", "name": "Topsy Turvy"},
        {"diff": 4, "id": "messiness", "name": "Messiness"},
        {"diff": 4, "id": "fade", "name": "Fade"},
        {"diff": 4, "id": "plot_twist", "name": "Plot Twist"},
        {"diff": 5, "id": "ambiguity", "name": "Ambiguity"},
        {"diff": 5, "id": "left_and_right", "name": "Left and Right"},
        {"diff": 6, "id": "deadly_precision", "name": "Deadly Precision"},
        {"diff": 6, "id": "triple_troll", "name": "Triple Troll"},
    ],
    "og": [
        {"diff": 1, "id": "og1", "name": "Beginners Map"},
        {"diff": 3, "id": "og2", "name": "Challenge"},
        {"diff": 4, "id": "og3", "name": "Cones"},
        {"diff": 3, "id": "og4", "name": "Special Map"},
        {"diff": 5, "id": "og5", "name": "Cake"},
        {"diff": 8, "id": "og6", "name": "Impossible Christmas Map"},
        {"diff": 6, "id": "og7", "name": "Cloud"},
        {"diff": 7, "id": "og8", "name": "999999"},
        {"diff": 5, "id": "og9", "name": "Hacks"},
        {"diff": 7, "id": "og10", "name": "Liam"},
        {"diff": 6, "id": "og11", "name": "Volcano"},
        {"diff": 7, "id": "og12", "name": "Cats can fly"},
        {"diff": 8, "id": "og13", "name": ":D"},
        {"diff": 7, "id": "og14", "name": "Bonus Level"},
        {"diff": 5, "id": "og15", "name": "Doge"},
        {"diff": 2, "id": "og16", "name": "EZ Map"},
        {"diff": 5, "id": "og17", "name": "Boost"},
        {"diff": 6, "id": "og18", "name": "Slowness"},
        {"diff": 4, "id": "og19", "name": "Grandpa Hobo"},
        {"diff": 7, "id": "og20", "name": "Up Up and Away"},
        {"diff": 8, "id": "og21", "name": "Zigzag"},
        {"diff": 6, "id": "og22", "name": "No Name"},
        {"diff": 4, "id": "og23", "name": "Hop 2 3 4"},
        {"diff": 5, "id": "og24", "name": "hi"},
        {"diff": 6, "id": "og25", "name": "123456789"},
        {"diff": 4, "id": "og26", "name": "Rip"},
        {"diff": 5, "id": "og27", "name": "OK"},
        {"diff": 7, "id": "og28", "name": "kk Unicorn"},
        {"diff": 7, "id": "og29", "name": "Derp"},
        {"diff": 8, "id": "og30", "name": "-___-"},
        {"diff": 4, "id": "og31", "name": "2018 New Concept"},
        {"diff": 7, "id": "og32", "name": "Too Many Cones"},
        {"diff": 7, "id": "og33", "name": "Bounce & Jumps"},
        {"diff": 7, "id": "og34", "name": "Some Maze"},
        {"diff": 3, "id": "og35", "name": "Graphics Test"},
        {"diff": 4, "id": "og36", "name": "ISKL"},
        {"diff": 5, "id": "og37", "name": "CLIMB"},
        {"diff": 4, "id": "og38", "name": "Horrible Map"},
        {"diff": 5, "id": "og39", "name": "Gravity"},
        {"diff": 4, "id": "og40", "name": "Snake"},
    ],
    "ghoul": [
        {"diff": 2, "id": "high_and_low", "name": "High and Low"},
        {"diff": 4, "id": "land_to_sky", "name": "Land to sky"},
        {"diff": 4, "id": "cave", "name": "Cave"},
        {"diff": 4, "id": "desert", "name": "Desert"},
        {"diff": 5, "id": "river", "name": "River"},
        {"diff": 5, "id": "space_junk", "name": "Space Junk"},
        {"diff": 6, "id": "polymorph", "name": "Polymorph"},
        {"diff": 6, "id": "technocracy", "name": "Technocracy"},
        {"diff": 7, "id": "serpents_tail", "name": "Serpents Tail"},
        {"diff": 7, "id": "city", "name": "City"},
        {"diff": 7, "id": "darkness", "name": "Darkness"},
    ],
    "rytai": [
        {"diff": 3, "id": "tubes", "name": "Tubes"},
        {"diff": 4, "id": "rebound", "name": "Rebound"},
        {"diff": 4, "id": "chemical_breakout", "name": "Chemical breakout"},
        {"diff": 4, "id": "eternal_atake", "name": "Eternal Atake"},
        {"diff": 5, "id": "entity", "name": "Entity"},
        {"diff": 5, "id": "blue_bird", "name": "Blue Bird"},
        {"diff": 5, "id": "rocky_climb", "name": "Rocky Climb"},
        {"diff": 5, "id": "dark_realm", "name": "Dark Realm"},
        {"diff": 6, "id": "heartattack", "name": "Heart Attack"},
        {"diff": 7, "id": "tremor", "name": "Tremor"},
        {"diff": 7, "id": "pinpoint", "name": "PinPoint"},
    ],
    "jay": [
        {"diff": 3, "id": "equilibrium", "name": "Equilibrium"},
        {"diff": 3, "id": "speedrunner", "name": "Speedrunner"},
        {"diff": 3, "id": "geyser", "name": "Geyser"},
        {"diff": 4, "id": "odyssey", "name": "Odyssey"},
        {"diff": 4, "id": "illusions", "name": "Illusions"},
        {"diff": 4, "id": "aurora", "name": "Aurora"},
        {"diff": 4, "id": "sunset", "name": "Sunset"},
        {"diff": 4, "id": "frost_factory", "name": "Frost Factory"},
        {"diff": 5, "id": "caik", "name": "Caik"},
        {"diff": 5, "id": "stratosphere", "name": "Stratosphere"},
        {"diff": 6, "id": "rust", "name": "Rust"},
        {"diff": 6, "id": "vindicated", "name": "Vindicated"},
    ],
    "vault": [
        {"diff": 1, "id": "glass_walkway", "name": "Glass Walkway"},
        {"diff": 1, "id": "lucid_dreams", "name": "Lucid Dreams"},
        {"diff": 1, "id": "slow_walk", "name": "Slow Walk"},
        {"diff": 2, "id": "basic_training", "name": "Basic Training"},
        {"diff": 3, "id": "advanced_training", "name": "Advanced Training"},
        {"diff": 3, "id": "palindrome", "name": "Palindrome"},
        {"diff": 3, "id": "choice", "name": "Choice"},
        {"diff": 3, "id": "slides", "name": "Slides"},
        {"diff": 3, "id": "speed_tunnel", "name": "Speed Tunnel"},
        {"diff": 3, "id": "split_paths", "name": "Split Paths"},
        {"diff": 3, "id": "super_dodo_lane", "name": "Super Dodo Lane"},
        {"diff": 4, "id": "follow_the_path", "name": "Follow the Path"},
        {"diff": 4, "id": "green_gravity", "name": "Green Gravity"},
        {"diff": 4, "id": "reversed_jumping", "name": "Reversed Jumping"},
        {"diff": 5, "id": "bad_advice", "name": "Bad Advice"},
        {"diff": 5, "id": "route", "name": "Route"},
        {"diff": 5, "id": "skinny_road", "name": "Skinny Road"},
        {"diff": 6, "id": "anarchy", "name": "Anarchy"},
        {"diff": 6, "id": "gravity_chaos", "name": "Gravity Chaos"},
        {"diff": 6, "id": "ice_track", "name": "Ice Track"},
        {"diff": 6, "id": "reversed_road", "name": "Reversed Road"},
        {"diff": 6, "id": "waterfall", "name": "Waterfall"},
        {"diff": 7, "id": "intense_training", "name": "Intense Training"},
        {"diff": 7, "id": "maze", "name": "Maze"},
        {"diff": 7, "id": "thinning", "name": "Thinning"},
        {"diff": 7, "id": "spiral_staircase", "name": "Spiral Staircase"},
        {"diff": 8, "id": "gravitational_pull", "name": "Gravitational Pull"},
        {"diff": 8, "id": "spider", "name": "Spider"},
        {"diff": 8, "id": "troll_track", "name": "Troll Track"},
        {"diff": 9, "id": "a_last_journey", "name": "A Last Journey"},
        {"diff": 9, "id": "finger_breaker", "name": "Finger breaker"},
        {"diff": 10, "id": "absolute_zero", "name": "Absolute Zero"},
    ],
    "golden": [
        {"diff": 1, "id": "infiltration", "name": "Infiltration"},
        {"diff": 1, "id": "dodo_cube", "name": "Dodo Cube"},
        {"diff": 2, "id": "beach", "name": "Beach"},
        {"diff": 3, "id": "gymnasium", "name": "Gymnasium"},
        {"diff": 3, "id": "portal_illusion", "name": "Portal Illusion"},
        {"diff": 3, "id": "ruins", "name": "Ruins"},
        {"diff": 3, "id": "centred", "name": "Centred"},
        {"diff": 4, "id": "wrenched_water_pipes", "name": "Wrenched Water Pipes"},
        {"diff": 4, "id": "keyboard", "name": "Keyboard"},
        {"diff": 4, "id": "clocks", "name": "Clocks"},
        {"diff": 4, "id": "colour_wheel", "name": "Colour Wheel"},
        {"diff": 5, "id": "blind_maze", "name": "Blind Maze"},
        {"diff": 5, "id": "side_to_side", "name": "Side to Side"},
        {"diff": 6, "id": "slippery_path", "name": "Slippery Path"},
        {"diff": 6, "id": "cosmic_dogfight", "name": "Cosmic Dogfight"},
        {"diff": 6, "id": "sector_8", "name": "Sector 8"},
        {"diff": 7, "id": "piano", "name": "Piano"},
        {"diff": 7, "id": "anomaly", "name": "Anomaly"},
        {"diff": 7, "id": "albus", "name": "Albus"},    
    ],
    "bean": [
        {"diff": 1, "id": "contrast", "name": "Contrast"},
        {"diff": 1, "id": "dash_of_the_canyon", "name": "Dash Of The Canyon"},
        {"diff": 2, "id": "beardedbaby", "name": "Mountain"},
        {"diff": 3, "id": "touchdown", "name": "Touchdown"},
        {"diff": 3, "id": "rng_fun", "name": "RNG Fun"},
        {"diff": 4, "id": "igloos", "name": "Igloos"},
        {"diff": 4, "id": "sungjoon", "name": "Turning Challenge"},
        {"diff": 4, "id": "treetops", "name": "Treetops"},
        {"diff": 5, "id": "dull_to_rainbow", "name": "Dull to Rainbow"},
        {"diff": 6, "id": "flight", "name": "Flight"},
        {"diff": 6, "id": "dodo_rebound", "name": "Dodo Rebound"},
        {"diff": 7, "id": "leaps_of_faith", "name": "Leaps of Faith"},
        {"diff": 7, "id": "everest", "name": "Everest"},
        {"diff": 7, "id": "cone_dodging", "name": "Cone Dodging"},
        {"diff": 7, "id": "dodo_kong", "name": "Dodo Kong"},
    ],
    "thero": [
        {"diff": 1, "id": "colour_panel", "name": "Colour panel"},
        {"diff": 3, "id": "trickster", "name": "Trickster"},
        {"diff": 3, "id": "blizzard", "name": "Blizzard"},
        {"diff": 3, "id": "cone_city", "name": "Cone City"},
        {"diff": 4, "id": "treacherous_overpass", "name": "Treacherous Overpass"},
        {"diff": 4, "id": "behind_the_wall", "name": "Behind the Wall"},
        {"diff": 5, "id": "verglas", "name": "Verglas"},
        {"diff": 5, "id": "sunset_jump", "name": "Sunset Jump"},
        {"diff": 6, "id": "magma_outbreak", "name": "Magma Outbreak"},
        {"diff": 6, "id": "the_throwback", "name": "The Throwback"},
        {"diff": 6, "id": "ice_age", "name": "Ice Age"},
        {"diff": 6, "id": "around_saturn", "name": "Around Saturn"},
        {"diff": 6, "id": "dragonfly", "name": "Dragonfly"},
        {"diff": 7, "id": "find_a_way", "name": "Find a Way"},
        {"diff": 8, "id": "pirate_lord", "name": "Pirate Lord"},
    ],
    "fish": [
        {"diff": 2, "id": "boat_bounce", "name": "Boat Bounce"},
        {"diff": 3, "id": "radioactive", "name": "Radioactive"},
        {"diff": 3, "id": "dark_alley", "name": "Dark Alley"},
        {"diff": 3, "id": "uphill_battle", "name": "Uphill Battle"},
        {"diff": 3, "id": "into_the_night", "name": "Into the Night"},
        {"diff": 4, "id": "space_invasion", "name": "Space Invasion"},
        {"diff": 4, "id": "city_parkour", "name": "City Parkour"},
        {"diff": 4, "id": "scale", "name": "Scale"},
        {"diff": 4, "id": "factory_escape", "name": "Factory Escape"},
        {"diff": 4, "id": "totally_not_gd", "name": "Totally Not GD"},
        {"diff": 4, "id": "fish_parkour", "name": "Fish Parkour"},
        {"diff": 5, "id": "underwater", "name": "Underwater"},
        {"diff": 5, "id": "gravity_jump", "name": "Gravity Jump"},
        {"diff": 5, "id": "road_rage", "name": "Road Rage"},
        {"diff": 5, "id": "spike_dash", "name": "Spike Dash"},
        {"diff": 6, "id": "ramp_rush", "name": "Ramp Rush"},
        {"diff": 6, "id": "coral_ocean", "name": "Coral Ocean"},
        {"diff": 6, "id": "dodo_launch", "name": "Dodo Launch"},
        {"diff": 7, "id": "permafrost", "name": "Permafrost"},
    ],
    "finder": []
}






var news = {
	init: function() {

		this.get_news(function(data) {
			console.log(data);
			if (data != null) {
				if (data.html != null) {
					$("#news").html(data.html);
				}
				
			}
			
		});
	},
	get_news: function(callback) {

		try {
		  // https://developer.chrome.com/docs/extensions/mv3/xhr/	
			fetch("https://fn.onionfist.com/chrx_news?chrx=icedodo").then(function(res) {
				if (res.status !== 200) {
					callback(null);
				}
				res.json().then(data => {
					callback(data);
				});
			});

		}
		catch(err) {
		  console.log("News err", err.message);
		  callback(null);
		}
		
	}
}







//   "host_permissions": [
//     "https://www.google.com/"
//   ],


// chrome.runtime.sendMessage(
//     {contentScriptQuery: 'fetchUrl',
//      url: 'https://another-site.com/price-query?itemId=' +
//               encodeURIComponent(request.itemId)},
//     response => parsePrice(response.text()));




var popup = {
	already_clicked: false,
	in_game: false,
	cup_num: 3,
	init: function() {
		function skip_vault_and_search() {
			const num_cups_except_finder_and_vault = Object.keys(cup_info).filter(cup_name => !['vault', 'finder'].includes(cup_name)).length;
			popup.cup_num = popup.mod(popup.cup_num, num_cups_except_finder_and_vault);
		}
		$("#change_cup_left").click(function() {
			popup.cup_num -= 1;
			skip_vault_and_search();
			popup.display_cup();
		});
		$("#change_cup_right").click(function() {
			popup.cup_num += 1;
			skip_vault_and_search();
			popup.display_cup();
		});
		$("#play_cup").click(function() {
			if (testing_mode.active == true) {
				return;
			}
			const num_cups = Object.keys(cup_info).length;
			let cup_ind = popup.mod(popup.cup_num, num_cups);
			let cup_id = Object.keys(cup_info)[cup_ind];
			popup.click_cup(cup_id);
		});
		this.list_cups();
		$("#more_levels").click(function() {
			$("#cups_btn").click();
		});
		
		async function submit(e) {
			if (e.keyCode != 13) {
				return;
			}

			let search_query = $("#search_input").val().trim().toLowerCase();

			var matches = [];
			map_info.finder = [];
			$("#search_exception").html("...");

			for (let cup_id in map_info) {
				if ((cup_id == "finder") || (cup_id == "beginner")) {
					continue;
				}
				for (let map of map_info[cup_id]) {
					const name_match = (map.name.toLowerCase().includes(search_query));
					const id_match = map.id.toLowerCase().includes(search_query);

					if ((name_match)) { // || (id_match)
						matches.push(map);
					}
				}
			}

			if (matches.length == 0) {
				$("#search_exception").html("Not found!");
			} else if (matches.length > 20) {
				$("#search_exception").html("Too many matches!");
			} else {
				$("#search_exception").html("");
				map_info.finder = matches;
			}
			
			await scorekeeper.recompute();
			await popup.show(false);


		}

		$("#search_input").keyup(function(e) {
			submit(e);
		});
		$("#search_input").change(function() {
			submit({keyCode: 13});
		});



		// immediately open a specific map
		// on game load
		this.open_hash_map();
		this.open_test_map();
	},
	show: function(openMainCupIfInFinder = true) {
		this.hide();
		this.in_game = false;
		sync.get("cup_num", function(v) {
			if ((v != null) && (v >= 0) && (v < INF)) {
				popup.cup_num = v;
			} else {
				popup.cup_num = 0;
				// random cup
				// const num_cups = Object.keys(cup_info).length;
				// popup.cup_num = Math.floor(Math.random() * (num_cups - 3));
			}
			if(openMainCupIfInFinder == true) {
				const finderCupIndex = Object.keys(cup_info).length - 1
				if(popup.cup_num == finderCupIndex) popup.cup_num = 0;
			}
			popup.display_cup();
		});
		
        

		setTimeout(function() {
			$("#popup").css("visibility", "visible");
			$("#menu").css("visibility", "visible");
			$("#backtomenu2").hide();
			$("#fullscreen_btn").hide();
			$("#menu").show();
			$("#jump_enabled").hide();
			$("#controls_reversed").hide();

			transitioning = false;
	        parent.postMessage("hide","*");
	        size.popup();
	        $("#inner_loading").remove();
		}, 500);
	},
	hide: function() {
		$("#cups").html('');
		$("#jump_cont").html('');
		$("#popup").css("visibility", "hidden");
		this.already_clicked = false;
	},
	display_cup: function() {
		const num_cups = Object.keys(cup_info).length;
		let cup_ind = this.mod(this.cup_num, num_cups);
		let cup_id = Object.keys(cup_info)[cup_ind];
		if ((this.cup_num >= 0) && (this.cup_num < INF)) {
			sync.set("cup_num", this.cup_num);
		} else if (cup_info[cup_id] == null) {
			this.cup_num = 0;
			cup_ind = 0;
			cup_id = Object.keys(cup_info)[cup_ind];
		}

		$('#popup').scrollTop(0);
		$("#cup_name").html(cup_info[cup_id].name);
		$("#cup_img").attr("src", `assets/skins/${cup_id}_cup.png`);
		$("#maps").html("");

		console.log("Showing cup_id", cup_id);
		if (cup_id != "finder") {
			$(".search_on").hide();
			$(".search_off").show();
			$("#search_exception").hide();
		} else {
			$(".search_on").show();
			$(".search_off").hide();
			$("#search_exception").show();
		}
		
		// maps
		let maps = map_info[cup_id];
		for (var m=0;m<maps.length;m++) {
			let map = maps[m];
			var map_HTML = "<div class='map' id='"+cup_id+"_map_"+map.id+"'><h2 class='map_name'>"+map.name+"</h2></div>";
			
			if (testing_mode.active == false) {
				$("#maps").append(map_HTML);
			}
			popup.display_map(cup_id, map);
		}

		// stats
		if (cup_id != "finder") {
			$("#cup_percent").html(scorekeeper.per_cup[cup_id].percent+" %");
			$("#cup_weighted").html(scorekeeper.per_cup[cup_id].weighted+" pt");
		}
	},
	display_map: function(cup_id, map) {
		let map_exp = null;
		for (let row of scorekeeper.cups[cup_id]) {
			if (row.id == map.id) {
				map_exp = row.xp;
				break;
			}
		}
		popup.post_map(cup_id, map, map_exp);
	},
	post_map: function(cup_id, map, map_exp) {
		var add_class = "done_z";
		var desc_text = "Click to Play";
		if (map_exp == 1) {
			add_class = "done_a";
			desc_text = "COMPLETED";
		} else if (map_exp == 2) {
			add_class = "done_b";
			desc_text = "COMPLETED TWICE";
		} else if (map_exp > 2) {
			add_class = "done_c";
			desc_text = "COMPLETED "+ map_exp +" TIMES";
		}
		if (map_exp >= 1000) {
			add_class = "done_f";
		} else if (map_exp >= 100) {
			add_class = "done_e";
		} else if (map_exp >= 10) {
			add_class = "done_d";
		}
		var diff_text = "DIFFICULTY: " + map.diff;
		var map_contents_HTML = "<div class='map_desc'>"+diff_text+" - "+desc_text+"</div>";
		var elem = $("#"+cup_id+"_map_"+map.id);
		elem.append(map_contents_HTML);
		elem.addClass(add_class);
		map.exp = map_exp;
		elem.click(function() {
			popup.click_map(cup_id, map.id);
		});
	},
	click_cup: function(cup_id) {
		if (!transitioning) {
			let maps = map_info[cup_id];
			var min_ind = -1;
			var min_val = 1000000;
			for (var m=0;m<maps.length;m++) {
				let map = maps[m];
				let exp = map.exp;
				if (exp < min_val) {
					min_val = exp;
					min_ind = m;
				}
			}
			let map_id = maps[min_ind].id;
			this.click_map(cup_id, map_id);
		}
	},
	click_map: function(cup_id, map_id) {
		if (!transitioning) {
			cup_info[cup_id].map_seq = [];
			for (let map of map_info[cup_id]) {
				cup_info[cup_id].map_seq.push(map.id);
			}
			if (cup_id == null) {
				return;
			}
			if (map_id == null) {
				return;
			}
			let map_seq = cup_info[cup_id].map_seq;
			var map_ind = map_seq.indexOf(map_id);
			if (map_ind < 0) {
				return;
			}
			// set info
			settings.map_id = map_id;
			settings.map_seq = map_seq;
			settings.map_ind = map_ind;
			settings.cup_id = cup_id;
			this.in_game = true;
			// redirect
			if (!this.already_clicked) {
				this.already_clicked = true;
				this.hide();
				$("#menu").hide();
				$("#backtomenu2").show();
				$("#fullscreen_btn").show();
				transitioning = true;
				boot.init();
			}
		}
	},
	list_cups: function() {
		for (const cup_id in cup_info) {
			this.list_cup(cup_id);
		}
	},
	list_cup: function(cup_id) {
		$("#list_cups_title").text("Choose a Cup");
		var html = `<img class="cup_list_img" src="assets/skins/${cup_id}_cup.png" id="show_up_${cup_id}" cup_name="${cup_info[cup_id].name}">`;
		$("#list_cups").append(html);
		$(`#show_up_${cup_id}`).click(function() {
			var v = Object.keys(cup_info).indexOf(cup_id);
			if ((v >= 0) && (v < INF)) {
				popup.cup_num = v;
			}
			popup.display_cup();
			tabs.clickPlayButton()
		});
		$(`#show_up_${cup_id}`).hover(function() {
			$("#list_cups_title").text($(this).attr("cup_name"));
		});
	},
	open_hash_map: function() {
		// when player clicks full screen button
		// in the extension.
		if (window.location.hash.length > 2) {
			function search(map_id) {
				var cup_ind = -1;
				for (let cup_id in cup_info) {
					cup_ind += 1;
					var maps = map_info[cup_id];
					var map_ind = -1;
					for (let map of maps) {
						map_ind += 1;
						if (map.id == map_id) {
							return {
								map_id: map.id,
								map_ind: map_ind,
								cup_id: cup_id,
								cup_ind: cup_ind
							}
						}
					}
				}
				return null;
			}
			
			const data = search(window.location.hash.substring(1));
			
			window.location.hash = "";

			if (data == null) return;

			const { map_id, map_ind, cup_id, cup_ind } = data;

			if (map_id == null) return;
			if (map_ind == null) return;
			if (cup_id == null) return;
			if (cup_ind == null) return;

			var interval = setInterval(function() {
				if (transitioning == false) {
					popup.click_map(cup_id, map_id);
					clearInterval(interval);
				}
			}, 250);
		}
	},
	open_test_map: function() {
		console.log("%c antetrig", "font-size: 30px");
		if (testing_mode.active == true) {
			console.log("%c trig", "font-size: 30px");
			testing_mode.init();
		}
	},
	mod: function(n, m) {
		return ((n % m) + m) % m;
	}
}










var screen = {
	init: function() {
		this.info_start();
		this.bind_buttons();
	},
	info_start: function() {
		$("#screen_map_name").text(map.title);
		var map_about = "Made by: " + map.maker;
		$("#screen_map_about").text(map_about);
		$("#restart_text").html("RESTART");
		const map_lb_link = `https://onionfist.com/icelb?map_id=${settings.map_id}&sort_by=exp`
		$("#map_leaderboard").attr("href", map_lb_link);
		if (deployment.is_chrome_ext) {
			const map_fs_link = `https://onionfist.com/icedodo/#${settings.map_id}`;
			$("#fullscreen_btn").attr("href", map_fs_link);
		} else {
			$("#fullscreen_btn").remove();
		}
	},
	set_dialog: function(set_text, set_color) {
		$("#screen_dialog").text(set_text);
		$("#screen_dialog").css({color: set_color});
	},
	bind_buttons: function() {
		$("#restart").click(function() {
			if ((!alive) && (!transitioning)) {
				const text = $("#restart_text").html();
				if (text === "RESTART") {
					change_state.spawn();
				} else if (text === "NEXT LEVEL") {
					let maps = map_info[settings.cup_id];
					for (var m=0;m<maps.length;m++) {
						let map = maps[m];
						if (map.id == settings.map_id) {
							if (m+1 < maps.length) {
								popup.click_map(settings.cup_id, maps[m+1].id);
							} else {
								popup.click_map(settings.cup_id, maps[0].id);
							}
						}
					}
				}
			}
		});

		$("#play_again").click(function() {
			if (!transitioning) {
				transitioning = true;
				cleanup.run();
				setTimeout(function() {
					transitioning = false;
					boot.init();
				}, 150);
			}
		});
		$("#backtomenu").click(function() {
			if ((!alive) && (!transitioning) && (popup.in_game)) {
				transitioning = true;
				cleanup.run();
				$("#screen").css("visibility", "hidden");
				popup.show();
			}
		});
		$("#backtomenu2").click(function() {
			if ((!transitioning) && (popup.in_game)) {
				alive = false;
				transitioning = true;
				cleanup.run();
				audio.stop();
				$("#screen").css("visibility", "hidden");
				popup.show();
			}
		})
	}
}






var settings = {
    map_id: null,
    map_seq: null,
    map_ind: null,
    cup_id: null,
    musicEnabled: null,
    autoRestart: null,
    frameRate: null,
    platformTexture: null,
    fovLevel: null,
    screenRes: null
};



var size = {
	w: 800,
	h: 600,
	popup: function() {
		if (deployment.is_chrome_ext) {
			$("body").css("width", "340px");
			$("body").css("height", "600px");
		} else {
			// $("#cup").css("width", "340px");
			// $(".map").css("width", "340px");
			// $(".tab").css("padding-left", "calc(50% - 230px)");
			// $(".tab").css("padding-right", "calc(50% - 230px)");
			$("body").css("width", "100%");
			$("body").css("height", "100%");
		}
	},
	ingame: function() {
		if (deployment.is_chrome_ext) {
			if (popup.in_game) {
				$("body").css("width", "800px");
				$("body").css("height", "600px");	
			}
			engine.resize();
		} else {
			// scale down for performance
			const doc_h = window.innerHeight;
			const doc_w = window.innerWidth;
	   		var scale_factor = 1;
	   		if (doc_h / doc_w > this.h / this.w) { // compare slope
	   			scale_factor = Math.min(doc_h, this.h) / doc_h;
	   		} else {
	   			scale_factor = Math.min(doc_w, this.w) / doc_w;
	   		}
	   		const tar_h = doc_h * scale_factor;
	   		const tar_w = doc_w * scale_factor;

	   		// apply
	   		$("body").css("width", "100%");
			$("body").css("height", "100%");
	   		engine.setSize(tar_w, tar_h);
		}
	},
	set: function(option) {
		this.h = Number(option.slice(0, -1));
		const ratio = 4 / 3;
		this.w = Math.round(this.h * ratio)
	}
}



var skin_info = {
    		
    dodo: {
        txt: "Default dodo",
        keys: ["overall", "weighted"],
        val: 0
    },
    moon: {
        txt: "First win",
        keys: ["overall", "weighted"],
        val: 1
    },
    melon: {
        txt: "Overall 50 pt",
        keys: ["overall", "weighted"],
        val: 50
    },
    whirlpool: {
        txt: "Overall 100 pt",
        keys: ["overall", "weighted"],
        val: 100
    },
    tweet: {
        txt: "Overall 500 pt",
        keys: ["overall", "weighted"],
        val: 500
    },
    hyperfrost: {
        txt: "Overall 1000 pt",
        keys: ["overall", "weighted"],
        val: 1000
    },
    rainbow: {
        txt: "Overall 2000 pt",
        keys: ["overall", "weighted"],
        val: 2000
    },
    beginner_cup: {
        txt: "100% Ice Dodo",
        keys: ["per_cup", "beginner", "percent"],
        val: 100
    },
    carrot_cup: {
        keys: ["per_cup", "carrot", "percent"],
        val: 100
    },
    collab_cup: {
        keys: ["per_cup", "collab", "percent"],
        val: 100
    },
    crazy_cup: {
        keys: ["per_cup", "crazy", "percent"],
        val: 100
    },
    thero_cup: {
        keys: ["per_cup", "thero", "percent"],
        val: 100
    },
    fish_cup: {
        keys: ["per_cup", "fish", "percent"],
        val: 100
    },
    golden_cup: {
        keys: ["per_cup", "golden", "percent"],
        val: 100
    },
    bean_cup: {
        keys: ["per_cup", "bean", "percent"],
        val: 100
    },
    dodo_cup: {
        keys: ["per_cup", "dodo", "percent"],
        val: 100
    },
    doom_cup: {
        keys: ["per_cup", "doom", "percent"],
        val: 100
    },
    june_cup: {
        keys: ["per_cup", "june", "percent"],
        val: 100
    },
    kazil_cup: {
        keys: ["per_cup", "kazil", "percent"],
        val: 100
    },
    pilot_cup: {
        keys: ["per_cup", "pilot", "percent"],
        val: 100
    },
    mango_cup: {
        keys: ["per_cup", "mango", "percent"],
        val: 100
    },
    furby_cup: {
        keys: ["per_cup", "furby", "percent"],
        val: 100
    },
    rocky_cup: {
        keys: ["per_cup", "rocky", "percent"],
        val: 100
    },
    skilled_cup: {
        keys: ["per_cup", "skilled", "percent"],
        val: 100
    },
    sleepy_cup: {
        keys: ["per_cup", "sleepy", "percent"],
        val: 100
    },
    squirrel_cup: {
        keys: ["per_cup", "squirrel", "percent"],
        val: 100
    },
    tim_cup: {
        keys: ["per_cup", "tim", "percent"],
        val: 100
    },
    abc_cup: {
        keys: ["per_cup", "abc", "percent"],
        val: 100
    },
    ye_cup: {
        keys: ["per_cup", "ye", "percent"],
        val: 100
    },
    ghoul_cup: {
        keys: ["per_cup", "ghoul", "percent"],
        val: 100
    },
    rytai_cup: {
        keys: ["per_cup", "rytai", "percent"],
        val: 100
    },
    jay_cup: {
        keys: ["per_cup", "jay", "percent"],
        val: 100
    },
    og_cup: {
        txt: "100% O.G.",
        keys: ["per_cup", "og", "percent"],
        val: 100
    },
    flame: {
        txt: "Overall 50 %",
        keys: ["overall", "percent"],
        val: 50
    },
    galaxy: {
        txt: "Overall 80 %",
        keys: ["overall", "percent"],
        val: 80
    },
    swag1: {
        txt: "Overall 100 %",
        keys: ["overall", "percent"],
        val: 100
    },
    
}

for (let nn=1;nn<35;nn++) {
    skin_info["r"+nn] = {
        txt: `Free ${nn}`,
        rand: true,
    }
}



// game objects
var camera = null;
var light = null;
var player = null;
var cape_wings = null;
var cape_tail = null;

var endings = [];
var cones = [];
var jumppads = [];

// game essentials
var canvas = null;
var engine = null;
var scene = null;

// game variables
var rotation = 0;
var alive = false;
var transitioning = true;

var start = {
	init: async function() {
		canvas = await document.getElementById("renderCanvas");
		engine = await new BABYLON.Engine(canvas, true, {
		  deterministicLockstep: false,
		  lockstepMaxSteps: 4
		});
		scene = await new BABYLON.Scene(engine, {antialiasing: false});
		// scene
		var gravityVector = new BABYLON.Vector3(0,-9, 0);
		scene.enablePhysics(gravityVector);
	},
	create_scene: function() {
		scene.clearColor = new BABYLON.Color4(0,0,0,1);
		scene.ambientColor = new BABYLON.Color4(0,0,0,0);

		// camera
		camera = new BABYLON.FreeCamera("camera", new BABYLON.Vector3(0, 2, 10), scene);
		camera.setTarget(BABYLON.Vector3.Zero());
		camera.rotation.y = -3.14;
		camera.rotation.x = 0.3;
		camera.rotation.z = 0;
		camera.speed = 0;
		camera.maxZ = 300; //200; //120;
		camera.noRotationConstraint = true;

		// player
		player = BABYLON.Mesh.CreateBox("player",0.5,scene);
		player.scaling = new BABYLON.Vector3(1, 0.16, 1);
		player.physicsImpostor = new BABYLON.PhysicsImpostor(player, BABYLON.PhysicsImpostor.BoxImpostor, { mass: 1.0, restitution: 1.0, friction: 0.5}, scene);

		player.position = new BABYLON.Vector3(0,0,0);
		player.applyGravity = true;
		sync.get("skinName", function(curr_val) {
			if (curr_val) {
				decorations.decorate_player(player, curr_val);
			}
		});
		
		// light
	    light = new BABYLON.HemisphericLight("light", new BABYLON.Vector3(0, 1, 0), scene);
	    light.intensity = 1.0;
	    light.parent = camera;

	    // cape_wings
		cape_wings = new BABYLON.Mesh("custom", scene);
		
		var wings_vertexData = new BABYLON.VertexData();
		wings_vertexData.positions = [
			1,0,-1,
			3,0,0,
			1,0,1,
			-1,0,-1,
			-3,0,0,
			-1,0,1
		];
		wings_vertexData.indices = [0, 1, 2, 3, 4, 5];
		wings_vertexData.applyToMesh(cape_wings);

		cape_wings.material = decorations.rgba_mat(255,255,255,1);

		cape_wings.scaling.x = 0.3;
		cape_wings.scaling.y = 0.3;
		cape_wings.scaling.z = 0.3;
		cape_wings.isVisible = false;
		cape_wings.parent = player;

		// cape_tail
		cape_tail = new BABYLON.Mesh("custom", scene);
		
		var tail_vertexData = new BABYLON.VertexData();
		tail_vertexData.positions = [
			-1,0,1,
			0,0,3,
			1,0,1,
		];
		tail_vertexData.indices = [0, 1, 2];
		tail_vertexData.applyToMesh(cape_tail);

		cape_tail.material = decorations.rgba_mat(255,255,255,1);

		cape_tail.scaling.x = 0.3;
		cape_tail.scaling.y = 0.3;
		cape_tail.scaling.z = 0.3;
		cape_tail.isVisible = false;
		cape_tail.parent = player;

	}
}




var stats = {
	score: 0,
	fps: 50,
	key_time: 0,
	changed_to_fixed: false,
	init: function() {
		$('#num_maps_info').text('Num maps: ' + stats.getMapCount())
	},
	update_fps: function() {
		// Calculate FPS
		let fps_now = Number(engine.getFps());
		this.fps += 0.1;
		if (this.fps > fps_now) this.fps = fps_now;

		// For 144 fps monitors
		if (!this.changed_to_fixed) {
			if (this.fps > 70) {
				console.log("AUTO FIX");
				this.changed_to_fixed = true;
				update.set_fixed();
				sync.set("frameRate", "fixed");
			}
		}
	},
	getMapCount: function() {
		let numMaps = 0
		for (const cupId in map_info) {
			if (cupId === 'beginner') continue
			if (cupId === 'finder') continue
			numMaps += map_info[cupId].length
		}
		return numMaps
	}
}



var tabs = {
	items: ["about", "settings", "skins", "ranks", "cups"],
	unlocked_skins: [],
	init: function() {
		for (var i=0;i<this.items.length;i++) {
			let item = this.items[i];
			this.handle_click(item);
		}

		$("#play_tab_btn").css("color", "#ffffff");
		$("#play_tab_btn").click(function() {
			const finderCupIndex = Object.keys(cup_info).length - 1
			if(popup.cup_num == finderCupIndex) popup.cup_num = 0;
			popup.display_cup();
			tabs.clickPlayButton()
		});
		this.settings_init();
	},
	clickPlayButton: function() {
		$("#play_tab_btn").css("color", "#ffffff");
		for (var i=0;i<tabs.items.length;i++) {
			let item = tabs.items[i];
			$(`#${item}_tab`).hide();
			$(`#${item}_btn`).css("color", "#999999");
		}
		$("#cups_btn").css("color", "#ffffff");
	},
	handle_click: function(item) {
		$("#"+item+"_btn").click(function() {
			tabs.show_item(item);
			if (item == "notifs") {
				notifs.focus();
			}
		});
	},
	show_item: function(item) {
		// all others
		$(".tab").hide();
		$(".btn").css("color", "#999999");
		$("#cups_btn").css("color", "#ffffff");
		
		// selected
		$("#"+item+"_tab").css("visibility", "visible");
		$("#"+item+"_tab").css("z-index", "35");
		$("#"+item+"_btn").css("color", "#ffffff");
		$("#"+item+"_tab").show();
	},
	item_init: function(item) {
		let save_id = item.save_id;
		let options = item.options;
		let standard = item.standard;
		let onclick = item.onclick;
		const reset_styling = function(curr_val) {
			for (var z=0;z<options.length;z++) {
				let option = options[z];
				let elem_id = "#" + save_id + "_" + option;
				if (curr_val === option) {
					$(elem_id).css("background", "var(--red_dark)");
				} else {
					$(elem_id).css("background", "black");
				}
			}
		}
		sync.get(save_id, function(curr_val) {
			if ((curr_val === null) || (curr_val === undefined)) {
				sync.set(save_id, standard, function() {});
				curr_val = standard;
			}
			settings[save_id] = curr_val;
			reset_styling(curr_val);
		});
		for (var z=0;z<options.length;z++) {
			let option = options[z];
			let elem_id = "#" + save_id + "_" + option;
			$(elem_id).click(function() {
				settings[save_id] = option;
				sync.set(save_id, option, function() {
					reset_styling(option);
					if (onclick !== null) onclick(option);
				});
			});
		}

	},
	settings_init: function() {
		var items = [
			{
				save_id: "musicEnabled",
				options: ["on", "off"],
				standard: "on",
				onclick: null
			},
			{
				save_id: "autoRestart",
				options: ["on", "off"],
				standard: "off",
				onclick: null
			},
			{
				save_id: "fovLevel",
				options: ["x1", "x2", "x3"],
				standard: "x1",
				onclick: function(option) {
					fov.set_mul1(option);
				}
			},
			{
				save_id: "frameRate",
				options: ["fixed", "vsync"],
				standard: "vsync",
				onclick: function(option) {
					if (option === "fixed") {
						update.set_fixed();
					} else if (option === "vsync") {
						update.set_vsync();
					}
				}
			},
			{
				save_id: "platformTexture",
				options: ["bright", "dark"],
				standard: "bright",
				onclick: function(option) {
					if (option === "bright") {
			            decorations.materials.platform = decorations.bright;
			            maker.init();
			        } else if (option === "dark") {
			            decorations.materials.platform = decorations.dark;
			            maker.init();
			        }
				}
			}
		];

		for (var i=0;i<items.length;i++) {
			let item = items[i];
			this.item_init(item);
		}
		
		if (deployment.is_chrome_ext) {
			$("#res_row").remove();
		} else {
			var standard = "600p";
			if (controls.mobile_enabled == true) {
				standard = "400p";
			}
			//  else if (deployment.is_chrome_ext == false) {
			// 	standard = "900p";
			// }
			this.item_init({
				save_id: "screenRes",
				options: ["400p", "600p", "900p"],
				standard: standard,
				onclick: function(option) {
					size.set(option);
				}
			})
		}
			
	},
	skin_init: async function() {
		this.unlocked_skins = [];
		$("#unlocked_skins").html("");
		$("#locked_skins").html("");

		for (let skin_id in skin_info) {
			let keys = skin_info[skin_id].keys;
			if (skin_info[skin_id].rand === true) {
				console.log("s_"+skin_id, await sync.async_get("s_"+skin_id));
				if (await sync.async_get("s_"+skin_id) == "yes") {
					this.unlocked_skins.push(skin_id);
					skin_info[skin_id].unlocked = true;
				}
				continue;
			}
			var obj = scorekeeper[keys[0]];
			if (keys.length > 1) obj = obj[keys[1]];
			if (obj == null) continue;
			if (keys.length > 2) obj = obj[keys[2]];
			if (obj == null) continue;
			if (Number(obj) >= Number(skin_info[skin_id].val)) {
				this.unlocked_skins.push(skin_id);
				skin_info[skin_id].unlocked = true;
			}
		}
		
		for (const skin_id in skin_info) {
			let skin_txt = skin_info[skin_id].txt;
			if ((skin_txt == null) && (skin_info[skin_id].keys[0] == "per_cup")) {
				var unit = (skin_info[skin_id].keys[2] == "percent") ? "%" : "pt"
				skin_txt = skin_info[skin_id].val + " " + unit + " " + skin_info[skin_id].keys[1];
			}
			var HTML = `<div class="skinItem" id="skinName_${skin_id}"><img class="skin_img" src="assets/skins/${skin_id}.png"><div class="skin_txt">${skin_txt}</div></div>`;
			if (skin_info[skin_id].unlocked) {
				$("#unlocked_skins").append(HTML);
			} else if (skin_info[skin_id].rand !== true) {
				$("#locked_skins").append(HTML);
			}
		}

		this.item_init({
			save_id: "skinName",
			options: tabs.unlocked_skins,
			standard: "dodo",
			onclick: function(option) {
				decorations.decorate_player(player, option);
			}
		});
	}
}




var testing_mode = {
    active: (["localhost", "fn.onionfist.com"].indexOf(window.location.hostname) >= 0),
    link: null,
    init: function() {
        let URL = window.location.href;

        function extract_vstr() {
            for (var v=1;v<20;v++) {
                if (URL.includes(`?v${v}=`)) {
                    var vstr = `?v${v}=`;
                    return vstr;
                }
            }
            return null;
        }

        function extract_map_link(vstr) {
            let q_string = URL.split(vstr)[1];
            let parent_domain = window.location.protocol + "//" + window.location.hostname;
            if (window.location.port !== "") parent_domain += ":"+window.location.port;
            let map_js_link = `${parent_domain}/icemaprun.js${vstr}${q_string}`;
            return map_js_link;
        }

        let vstr = extract_vstr();
        if (vstr == null) {
            this.active = false;
            return;
        }

        let link = extract_map_link(vstr);
        if (link == null) {
            this.active = false;
            return;
        }
        this.link = link;
        console.log("%c LINK", "color: red", link);

        var interval = setInterval(function() {
            if (transitioning == false) {
                testing_mode.begin();
                clearInterval(interval);
            }
        }, 250);
    },
    begin: function() {
        // set info
        settings.map_id = "test_map";
        settings.map_seq = ["test_map"];
        settings.map_ind = 0;
        settings.cup_id = "test_cup";
        popup.in_game = true;
        // redirect
        popup.hide();
        $("#menu").hide();
        $("#backtomenu2").show();
        $("#fullscreen_btn").show();
        transitioning = true;
        boot.init();
    }

}



var update = {
	interval: null,
	init: function() {
		if (settings.frameRate === "fixed") {
			this.interval = setInterval(this.loop, 1000/60);
		} else if (settings.frameRate === "vsync") {
			engine.runRenderLoop(this.loop);
		}
		window.addEventListener("resize", function () {
			if (settings.map_id) {
				size.ingame();
			}
		});
	},
	set_fixed: function() {
		engine.stopRenderLoop(this.loop);
		this.interval = setInterval(this.loop, 1000/60);
	},
	set_vsync: function() {
		clearInterval(this.interval);
		engine.runRenderLoop(this.loop);
	},
	loop: function() {
		scene.render();
		update.new_frame();
		stats.update_fps();
	},
	new_frame: function() {
		if ((alive) && (!transitioning)) {
			try {
				stats.score += 1;
				$("#curr_time").html("TIME: " + stats.score);
				// render call
				this.player_move();
				map.render_update();
				map.section_update();
				flyjump.render_loop();
				// physics call
				if (stats.score % physics_call_rate == 0) {
					this.collision_check();
					map.physics_update();
					flyjump.compute_loop();
					this.update_overlay();
				}
			} catch(err) {
				
			}
		}
	},
	collision_check: function() {
		// if death
		if (player.position.y < -20) {
			change_state.die();
			screen.set_dialog("Fell To Death", "#e04c4f");
		}

		if (player.position.y > 80) {
			change_state.die();
			screen.set_dialog("Left the Orbit", "#e04c4f");
		}

		// if hit cone
		for (var i=0;i<maker.cone_count;i++) {
			let cone = cones[i];
			if (this.are_touching(player, cone, 0.5)) {
				change_state.die();
				screen.set_dialog("Died From Cone", "#e04c4f");
				break;
			}
		}

		// if hit ending
		for (var i=0;i<maker.ending_count;i++) {
			let ending = endings[i];
			if (this.are_touching(player, ending, 1.2)) { // previously 1.0
				change_state.win();
				break;
			}
		}
	},
	player_move: function() {
		// steer
		var action = 0;
		if (controls.right) {action += 1};
		if (controls.left) {action -= 1};
		if (controls.space) {flyjump.jump()};
		if ((speed !== default_speed) && (speed !== 0.2)) {
			player.physicsImpostor.setAngularVelocity(new BABYLON.Vector3(0,0,0));
			player.rotationQuaternion = BABYLON.Quaternion.RotationAxis(new BABYLON.Vector3(0,0,0),0);
		}
		rotation += action * steer;
		player.rotation.y = rotation;

		// move
		let vx = speed * Math.sin(rotation - 3.14);
		let vz = speed * Math.cos(rotation - 3.14);
		player.position.x += vx;
		player.position.z += vz;

		// light & camera
		let rotation_offsetted = rotation + cameraRightAngle;
		camera.position.x = player.position.x + Math.sin(rotation_offsetted) * cam_horizontal;
		camera.position.z = player.position.z + Math.cos(rotation_offsetted) * cam_horizontal;
		camera.position.y = player.position.y + cam_vertical;
		camera.rotation.y = 3.14 + rotation_offsetted;
		camera.rotation.x = cam_depression;
		light.position = camera.position;
	},
	are_touching: function(a, b, r) {
		let dz = a.position.z - b.position.z;
		if (Math.abs(dz) < r) {
			let dx = a.position.x - b.position.x;
			if (Math.abs(dx) < r) {
				let dy = a.position.y - b.position.y;
				if (Math.abs(dy) < r * 1.5) {
					return true;
				}
			}
		}
		return false;
	},
	set_gravity: function(val) {
		scene.gravity = new BABYLON.Vector3(0, val, 0);
		gravity = scene.gravity;
		scene.getPhysicsEngine().setGravity(scene.gravity);
		player.applyGravity = true;
	},
	update_overlay: function() {
		if (flyjump.can_jump == true) {
			$("#jump_enabled").show();
			$("#space_mobile_btn").css("opacity", 1.0);
			cape_wings.isVisible = true;
		} else {
			$("#jump_enabled").hide();
			$("#space_mobile_btn").css("opacity", 0.3);
			cape_wings.isVisible = false;
		}
		if (steer < 0) {
			$("#controls_reversed").show();
			cape_tail.isVisible = true;
		} else {
			$("#controls_reversed").hide();
			cape_tail.isVisible = false;
		}
	}
}



var webext = {
    worker_req: function(data) {
        return new Promise(async (resolve, reject) => {
            if (chrome.runtime == null) {
                console.log("no runtime, maybe due to localhost.");
                resolve(null);
                return;
            }
            
            const chrx_ids = [config.chrx_id, config.dev_chrx_id];
            console.log("chrx_ids", chrx_ids);

            for (const chrx_id of chrx_ids) {
                let resp = await webext.worker_one(chrx_id, data);
                if (resp != null) {
                    console.log("resp", resp);
                    resolve(resp);
                    return;
                }
            }
            resolve(null);
        });
    },
    worker_one: function(chrx_id, data) {
        return new Promise((resolve, reject) => {
            try {
                chrome.runtime.sendMessage(chrx_id, data, function(response) {
                    resolve(response);
                    return;
                });
            } catch (error) {
                console.log("Err", error);
                resolve(null);
            }
        });
    },
    ping_from_web: function() {
        return this.worker_req({code: "ping_from_web"});
    }
}

