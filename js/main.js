enchant();

window.onload = function () {
	
	var game = new Game(320, 320);
	game.fps = 30;
	game.preload("image/invader1.jpg","image/player.jpg","image/beam.png","sound/shot.mp3","sound/shot-struck.mp3","sound/world.mp3","sound/last2.mp3","sound/failed.mp3");
	game.rootScene.backgroundColor = "black";
	game.score = 0; 
		
	var enemyDX = 2.5;
	var enemyDY = 0;
	
	game.onload = function() {
		
		// キーボードの割り当て
		game.keybind(90, "z");
		game.keybind(88, "x");
		
		// ビーム
		var beam = new Sprite(2,4);
		beam.image = game.assets["image/beam.png"];
		beam.x = 0;
		beam.y = -1000;
		beam.flag = false;
		game.rootScene.addChild(beam);
		
		// 敵のビーム
		var invadersBeam = [];

		var maxInvadersBeam = 80;
		function initInvadersBeam() {
			for (var i = 0; i < maxInvadersBeam; i++) {
				invadersBeam[i] = new Sprite(2,4);
				invadersBeam[i].image = game.assets["image/beam.png"];
				invadersBeam[i].x = 0;
				invadersBeam[i].y = -1000;
				invadersBeam[i].flag = false;
				game.rootScene.addChild(invadersBeam[i]);
			}
		}
		
		function shootInvadersBeam() {
			var shooter = Math.floor(Math.random() * 100);
			//alert(shooter);
			if (!invaders[shooter] || invaders[shooter].y < 0) {
				return ;
			}
			for (var i = 0; i < maxInvadersBeam; i++) {
				if ( !invadersBeam[i].flag ) {
					invadersBeam[i].flag = true;
					invadersBeam[i].x = invaders[shooter].x + 14;
					invadersBeam[i].y = invaders[shooter].y + 14;
					return ;
				}
			}
		}
		
		function moveInvadersBeam() {
			for (var i = 0; i < maxInvadersBeam; i++) {
				if (!invadersBeam[i].flag) {
					continue;
				}
				invadersBeam[i].y += 9;
				if (invadersBeam[i].y > game.height) {
					invadersBeam[i].flag = false;
					invadersBeam[i].y = -999;
				}
			}
		}
		
		function hitInvadersBeam() {
			for ( var i = 0; i < maxInvadersBeam; i++) {
				if (invadersBeam[i].within(player, 3.7)) {
					game.rootScene.backgroundColor = "red";	// ゲームの背景色を赤色に設定
						
					game.rootScene.addChild(gameover);
					var fail = game.assets['sound/failed.mp3'].clone();
	 	  			fail.play();
					game.stop();
					$('html').css("background-color",'red');
					return;	// 以後の処理は行わないようにする
				}
			}	
		}
			
		// ゲームオーバーのラベル
		var gameover = new Label();
		gameover.x = 45;
		gameover.y = 120;
		gameover.color = "black";
		gameover.font = '40px "Arial"';
		gameover.text = 'GAME OVER';		
		
		
		
		// ボーダー
		var border = new Sprite(320, 1);
		border.x = 0;
		border.y = 275;
		border.backgroundColor = "rgba(200, 255, 200, 0.5)";
		
		var surface = new Surface(320, 10);
		border.image = surface;
		
		context = surface.context;
		context.beginPath();
		context.moveTo(0, 275);
		context.lineTo(320, 275);
		context.strokeStyle = "rgba(0, 0, 255, 0.5)";
		context.stroke();
		
		game.rootScene.addChild(border);
		
		// 敵クラス
		var Invader = Class.create(Sprite, {
			initialize: function(x, y) {
				Sprite.call(this, 12, 12);
				this.x = x;
				this.y = y;
				this.image = game.assets["image/invader1.jpg"];
				game.rootScene.addChild(this);
			},
			hitBeam: function() {
				if (this.intersect(beam)) {
					this.y = -9999;
					beam.x = -9999;
					beam.flag = false;
					var sound = game.assets['sound/shot-struck.mp3'].clone();
		 	  		sound.play();
				}
			}
		});
		
		// プレイヤークラス
		var Player = Class.create(Sprite, {
			initialize: function(x, y) {
				Sprite.call(this, 12, 12);
				this.x = game.width / 2;
				this.y = game.height -40;
				this.image = game.assets["image/player.jpg"];
				game.rootScene.addChild(this);
			},
			move: function() {
				if (game.input.left) {
					this.x = this.x -4;
					if (this.x < 0) {
						this.x = 0;
					}
				}
				
				if (game.input.right) {
					this.x = this.x + 4;
					if (this.x > (game.width - this.width)) {
						this.x = game.width - this.width;
					}
				}
			},
			shootBeam: function() {
				if (!beam.flag) {
					if (game.input.z) {
						beam.flag = true;
						beam.x = this.x + 6;
						beam.y = this.y - 6;
						
						var sound = game.assets['sound/shot.mp3'].clone();
		 	  		    sound.play();
					}
				}
			},
			moveBeam: function() {
				if (beam.flag) {
					beam.y = beam.y - 8;
					if (beam.y < 30) {
						beam.flag = false;
					}
				}
			},
			world: function() {
				if (game.input.x) {
					$("#world").animate({
						'left': '300px'
					},{
						'duration': 200,
						'complete': function(){
							setTimeout(function(){				
								$("#world").animate({								
										'left': '2000px' 							
								},1000);
								$('html').animate({
									"background-color":'black'
								},2000);
						},1000);
						}
					});
					
					var sound = game.assets['sound/world.mp3'].clone();
					var last = game.assets['sound/last2.mp3'].clone();
		 	  		sound.play();
		 	  		
					$("#body").css("display", "block");
					
					setTimeout(function(){				
						setAutoColorChange();
					},1900);
					
					game.stop();
					
					setTimeout(function(){
						last.play();
						last.volume = 0.8;
						setTimeout(function(){
							$("#thanks").animate({
								'left': '20px',
								'bottom':'20px'
							},800);
						}, 5800);
					},17600);
				}
			}
		});
		
		var player = new Player(12, 12);
		
		
		var invaders = [];
		var invadersCount = 0;
		
		
		for ( var i = 0; i < 6; i++ ) {
			var num = 40;
			for ( var j = 0; j < 16; j++ ) {
				invaders[invadersCount] =  new Invader( num + (j * 13), i  * 15);
				num++;
				invadersCount++;
			}		
		}		
		initInvadersBeam();
		
		game.rootScene.addEventListener(Event.ENTER_FRAME, function(){
			player.move();
			player.world();
			player.shootBeam();
			player.moveBeam();
			moveEnemy();
			shootInvadersBeam();
			moveInvadersBeam();
			hitInvadersBeam();
			
			for ( var i = 0; i < invadersCount; i++ ) {
				invaders[i].hitBeam();
			}
			
			// ------------ ■敵を移動させる -----------------
			function moveEnemy(){
				var reverseFlag = false;
				for(var i=0; i<invadersCount; i++){
					invaders[i].x = invaders[i].x + enemyDX;	// X座標の移動処理
					invaders[i].y= invaders[i].y + enemyDY;	// Y座標の移動処理
					
					if ((invaders[i].y > 0) && ((invaders[i].x < 0) || (invaders[i].x > (game.width - invaders[i].width)))){ reverseFlag = true; }
					if (invaders[i].y > 265){
						game.rootScene.backgroundColor = "red";	// ゲームの背景色を赤色に設定
						
						game.rootScene.addChild(gameover);
						var fail = game.assets['sound/failed.mp3'].clone();
		 	  			fail.play();
						game.stop();
						$('html').css("background-color",'red');
						return;	// 以後の処理は行わないようにする
					}
				}
				// 左右どちらかの端に到達した敵がいた場合の処理
				if (reverseFlag){
					enemyDX = -enemyDX;
					enemyDY = 8;
				}else{
					enemyDY = 0;
				}
			}
		});		
	};
	game.start();
};

function randNum(num) {
	return Math.floor(Math.random() * (num+1));
}

var stop = 0;

function setAutoColorChange(index) {
	var colorlist = ["rgba(139, 125, 35, 0.3)", "rgba(225,225,225,0.5)"," rgba(0, 0, 0, 0.6)"];
	if (!index || index > (colorlist.length - 1)) {
		index = 0;
	}
	if (stop == 7) {
		$("#draw-picker").animate({
			backgroundColor: "rgba(0, 0, 0, 0)"
		});
		return false ;
	}
	var color = colorlist[index];
	$('#draw-picker').animate({
		backgroundColor: color
	}, 200);
	stop++;
	setAutoColorChange(++index);
}