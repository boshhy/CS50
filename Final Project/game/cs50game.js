kaboom({
  background: [80, 80, 80],
});

loadSound("swoosh", "sounds/sword.wav");
loadSound("attackforward", "sounds/swordforward.wav");
loadSound("jump8", "sounds/jump4.wav");
loadSound("door3", "sounds/dooropen3.wav");
loadSound("odd3", "sounds/odd3.wav");
loadSound("hit1", "sounds/hit1.wav");
loadSound("damage1", "sounds/various3.wav");
loadSound("laser3", "sounds/laser3.wav");
loadSound("jump16", "sounds/jump16.wav");
loadSound("double1", "sounds/double1.wav");
loadSound("powerup6", "sounds/powerup6.wav");
loadSound("hope", "sounds/hope.mp3")

// tiles for map
loadSprite("tiles", "/sprites/blue_ground.png", {
  sliceX: 27,
});

// mushroom jumper
loadSprite("mushroom", "/sprites/jumper.png", {
  sliceX: 4,
  anims: {
    idle: { from: 0, to: 3, loop: true },
    jumped: { from: 2, to: 2, loop: false, speed: 0.5 },
  }
});

//door sprite
loadSprite("door", "/sprites/door.png", {
  sliceX: 2,
  anims: {
    open: { from: 1, to: 1, loop: false },
  }
})

// suriken sprite
loadSprite("suriken", "/sprites/suriken.png");

// lava sprite
loadSprite("lava", "/sprites/lava.png", {
  sliceX: 16,
  anims: {
    idle: { from: 0, to: 15, loop: true },
  }
})


// heart sprite
loadSprite("heart", "/sprites/heart.png", {
  sliceX: 4,
  anims: {
    idle: { from: 0, to: 3, loop: true, speed: 4 },
  }
});

// beam sprite
loadSprite("beam", "/sprites/beam.png", {
  sliceX: 6,
  anims: {
    idle: { from: 0, to: 5, loop: true, speed: 10 },
  }
});

// key sprite
loadSprite("key", "/sprites/key.png", {
  sliceX: 4,
  anims: {
    idle: { from: 0, to: 3, loop: true, speed: 5 },
  }
})


// snake sprite
loadSprite("snake", "/sprites/snake.png", {
  sliceX: 11,
  sliceY: 2,
  anims: {
    idle: { from: 2, to: 3, loop: true, speed: 4 },
    walk: { from: 0, to: 7, loop: true, speed: 10 },
    hurt: { from: 8, to: 8, loop: false },
  },
});

// snake_drop sprite
loadSprite("snake_drop", "/sprites/snake.png", {
  sliceX: 11,
  sliceY: 2,
  anims: {
    idle: { from: 13, to: 14, loop: true, speed: 4 },
    walk: { from: 15, to: 16, loop: true, speed: 10 },
    hurt: { from: 19, to: 19, loop: false },
  },
});

// blue character sprite
loadSprite("blue", "/sprites/blue.png", {
  sliceX: 4,
  sliceY: 7,

  anims: {
    run: { from: 0, to: 1, loop: true, speed: 10, },
    jump: { from: 4, to: 5, loop: false, speed: 1.2, },
    idle: { from: 0, to: 0, loop: true, speed: 10, },
    attack: { from: 2, to: 3, },
    forward: { from: 9, to: 9, },
    title: { from: 9, to: 9 },
  }

});

// load skeleton sprite
loadSprite("skeleton", "/sprites/skeleton.png", {
  sliceX: 9,
  sliceY: 4,

  anims: {
    idle: { from: 18, to: 21, loop: true, },

  }
})

// play this anmation when player dies
loadSprite("player_death", "/sprites/knight_death.png", {
  sliceX: 13,
  sliceY: 2,
  anims: {
    death: { from: 14, to: 25, loop: false, },
  }
})

// when player presses 'x' this animatino should play for the sword collider
function sword(x = 0, y = 0, dir = 1, z = 60) {
  mydirection = "left"
  if (dir < 0) {
    mydirection = "right"
  }
  const sword = add([
    rect(z, 20),
    opacity(0),
    area(),
    pos(x, y),
    origin(mydirection),
    "sword"
  ]);
  wait(0.1, () => {
    destroy(sword);
  })
}

//function spawnSuriken(x, y, dir = 1) {
//        facing = 0;
//        if (dir < 0){
//            facing = 180;
//        }
//		add([
//			sprite("suriken"),
//			area(),
//			pos(x, y),
//			origin("center"),
//			move(facing, 500),
//			cleanup(1),
//			scale(0.5),
//			"suriken",
//		]);
//}

// make snakes patrol left and right
function patrol(speed = 60, dir = 1) {
  return {
    id: "patrol",
    require: ["pos", "area",],
    add() {
      this.collides("enemy_snake", (s) => {
        dir = -dir;
        if (dir > 0) {
          this.flipX(false);
        }
        else {
          this.flipX(true);
        }
      })
      this.collides("block", (s) => {
        dir = -dir;
        if (dir > 0) {
          this.flipX(false);
        }
        else {
          this.flipX(true);
        }
      })
      this.collides("enemy_snake_drop", (s) => {
        dir = -dir;
        if (dir > 0) {
          this.flipX(false);
        }
        else {
          this.flipX(true);
        }
      })
      this.collides("player", (s) => {
        dir = -dir;
        if (dir > 0) {
          this.flipX(false);
        }
        else {
          this.flipX(true);
        }
      })
    },
    update() {
      this.move(speed * dir, 0);
    },
  };
}

// when green snake is killed it should drop a key
function dropKey(snake) {
  const key = add([
    { width: 64, height: 64 },
    sprite("key", { anim: "idle" }),
    area({ width: 5, }),
    origin("center"),
    scale(3),
    pos(snake.pos.x, snake.pos.y),
    "key",
  ]);
  return key;
}

// death animation for main player
// play this animation at the location of the players death
function deathLocation(player, face) {
  play("odd3");
  facing = true;
  if (face > 0) {
    facing = false
  }
  const playerDeath = add([
    sprite("player_death", { anim: "death", flipX: facing }),
    origin("center"),
    scale(2.5),
    "player",
    layer("front"),
    pos(player.pos.x, player.pos.y),

  ]);

  return playerDeath
}




scene("title", () => {
  const levels = [
    [
      "t",
      "p",
      "a",
    ],
  ];
  addLevel(levels[0], {
    width: 64,
    height: 64,

    "t": () => [
      { width: 64, height: 64 },
      text("BLADE", { size: 128 }),
      color(0, 255, 255),
      pos(width() / 2, height() / 2 - 180),
      origin("center"),
    ],
    "a": () => [
      text("start"),
      area(),
      color(255, 0, 0),
      pos(width() / 2, height() / 2),
      origin("center"),
      "startGame",
    ],
    "s": () => [
      text("tutorial"),
      area(),
      color(0, 255, 0),
      pos(width() / 2 + 300, height() / 2),
      origin("center"),
      "tutorial",
    ],
    "p": () => [
      sprite("blue", { anim: "title" }),
      pos(width() / 2 - 64, height() / 2 - 64),
      origin("center"),
      scale(8),
    ],
  });
  clicks("startGame", (start) => {
    start.color.r = 0;
    start.color.g = 255;
    start.color.b = 0;
    wait(0.25, () => {
      go("start", 0);
    });
  });
  clicks("tutorial", (start) => {
    start.color.r = 0;
    start.color.g = 255;
    start.color.b = 0;
    wait(0.25, () => {
      go("start", 0);
    });
  });
  keyPress("f", (c) => {
    fullscreen(!fullscreen());
  })


});

scene("start", (levelIndex) => {
  const levels = [
    [
      "                                    ",
      "          t                         ",
      "          g                         ",
      "                               q    ",
      "          p                    d    ",
      "  <================================>",
      "       i                            ",
    ],
    [
      "  a                 a     ",
      "  b                 b     ",
      "  b        w        b     ",
      "  b                 b     ",
      "  b   k    p    d   b     ",
      "<=========================>",
    ],
    [
      "                          ",
      "                          ",
      "    e         k      d    ",
      "              a     [=]   ",
      "    p   a     b     bbb   ",
      "<==========================>",


    ],

    ["                       y           ",
      "                  d         k      ",
      "             y  <===>     <===>    ",
      "                                   ",
      "    r      a                       ",
      "           b                       ",
      "    p      b                       ",
      "<==================================>",
    ],
    [
      "                              ",
      "                              ",
      "                        o     ",
      "   u                          ",
      "         .  s  .     .  z  .  ",
      "   p      [===]   d   [===]   ",
      "<============================>",
    ],
    [
      "            j                 ",
      "   l                          ",
      "         . sks .        d     ",
      "   p  h   [===]   h   [===]   ",
      "<============================>",
    ],
    [
      "                    ",
      "                    ",
      "                    ",
      "                    ",
      "         n          ",
      "  p           k  d  ",
      "<====>.......<=====>",
      "                    ",
      "                    ",
      "                    ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "           [=======]    ",
      "           bb-   +bb    ",
      "           bbk   6bb    ",
      "           bb=====bb    ",
      "           bbbbbbbbb    ",
      "           bb-   +bb    ",
      "           bb5   4bb    ",
      "           bb=====bb    ",
      "   c       bbbbbbbbb    ",
      "           bb-   +bb    ",
      "   p      1bb2 d 3bb    ",
      "[======================]",
      "bbbbbbbbbbbbbbbbbbbbbbbb",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "            1        ",
      "          [===]      ",
      "          b-2+b      ",
      "          b   b      ",
      "          b   b      ",
      "   p     mb d bm  k  ",
      "[===================]",
      "bbbbbbbbbbbbbbbbbbbbb",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "ad     a",
      "b>     b",
      "b      b",
      "b      b",
      "b      b",
      "b      b",
      "b      b",
      "bm     b",
      "b>     b",
      "b      b",
      "b      b",
      "b    k b",
      "b      b",
      "b      b",
      "b   p mb",
      "b======b",
      "bbbbbbbb",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [

      "                     ",
      "                     ",
      "                   2d",
      "                  <=>",
      "                   1 ",
      "                     ",
      "                     ",
      "                     ",
      "                     ",
      "               k     ",
      "                     ",
      "                     ",
      "  pm       m       m ",
      " [=]       a       a ",
      " bbb       b       b ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "        ",
      " p    d ",
      "[]   [=]",
      "bb   bbb",
      "bb k bbb",
      "bbFFFbbb",
      "bbbbbbbb",
      "bbbbbbbb",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "               .  s  s  .  [=]       ",
      "                [======>   b8b       ",
      "                b          bdb       ",
      "                b z   .    bab       ",
      "           <>   b====>               ",
      "                b                    ",
      "                b7                   ",
      "       <>       b===>                ",
      "                                     ",
      " p                                   ",
      "[===]                                ",
      "bbbbb                                ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "               ",
      "               ",
      "     d         ",
      "  5[===]       ",
      "   b  kb       ",
      "  pb6bbb       ",
      " [=bFbbb       ",
      " bbbbbbb       ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    [
      "           6                 ",
      "                             ",
      "                             ",
      "                             ",
      "           4                 ",
      "           d                 ",
      "          <=]                ",
      "           3b                ",
      "            b                ",
      "            b                ",
      "           2b                ",
      "            b                ",
      "            b                ",
      "           1b                ",
      "            b                ",
      "            b                ",
      "         p  bk5              ",
      "       [====b]               ",
      "       bbbbbbb               ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],

    [
      "          d 8                          ",
      "        [====]                         ",
      "        b pk b                         ",
      "        b==] b                         ",
      "          7b b                         ",
      "           b b                         ",
      "           b b                         ",
      "          6b b                         ",
      "           b b                         ",
      "           b b                         ",
      "           b b5                        ",
      "           b b                         ",
      "           b b                         ",
      "           b b4                        ",
      "           b b                         ",
      "           b b                         ",
      "          3b b                         ",
      "           b b                         ",
      "           b b                         ",
      "          2b b                         ",
      "           b b                         ",
      "           b b                         ",
      "           b b1                        ",
      "           b b                         ",
      "           b b                         ",
      "                                       ",
      "       [=========]                     ",
      "       bbbbbbbbbbb                     ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],
    ["[=========================]",
      "b         bb   bb         b",
      "b         bb   bb         b",
      "b         bb   bb         b",
      "b         bb k bb         b",
      "b         bb   bb         b",
      "b         bb 3 bb         b",
      "b p     1 <> 2 <> 4    d  b",
      "b===]                [====b",
      "bbbbb                bbbbbb",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",

    ],
    [

      "5 4      3 2   ",
      "<=>   x  <=>   ",
      "      v        ",
      "               ",
      "    6 p1       ",
      "    <==>       ",
      "               ",
      "ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff",
      "L",
    ],

    ["          S         .",
      ".  p                 ",
      " <==================>",
    ],

  ];

  addLevel(levels[levelIndex], {
    width: 64,
    height: 64,

    ".": () => [
      { width: 64, height: 64 },
      area(),
      "block",
    ],
    "=": () => [
      sprite("tiles", {
        frame: 4,
      }),
      area(),
      solid(),
      "ground",
    ],

    "<": () => [
      sprite("tiles", {
        frame: 14,
      }),
      area(),
      solid(),
      "ground",
    ],
    "[": () => [
      sprite("tiles", {
        frame: 3,
      }),
      area(),
      solid(),
      "ground",
    ],

    "]": () => [
      sprite("tiles", {
        frame: 5,
      }),
      area(),
      solid(),
      "ground",
    ],

    ">": () => [
      sprite("tiles", {
        frame: 15,
      }),
      area(),
      solid(),
      "ground",
    ],
    "a": () => [
      sprite("tiles", {
        frame: 6,
      }),
      area(),
      solid(),
      "ground",
    ],
    "b": () => [
      sprite("tiles", {
        frame: 2,
      }),
      area(),
      solid(),
      "block",
    ],
    "-": () => [
      sprite("tiles", {
        frame: 2,
      }),
      layer("backtiles"),
      origin("center"),
      rotate(45),
      scale(0.75),

    ],
    "+": () => [
      sprite("tiles", {
        frame: 2,
      }),
      layer("backtiles"),
      rotate(315),
      scale(0.75),
      pos(32, 0),
    ],

    "t": () => [
      text("Welcome to:\nBlade"),
      origin("center"),
    ],
    "g": () => [
      text("By: Boshhy\n[ Submission for CS50 Final Project 2021 ]", { size: 30 }),
      origin("center"),
      pos(0, 32)
    ],
    "i": () => [
      text("\nLeft arrow: move left\n\nRight arrow: move right", { size: 32 }),

    ],

    "q": () => [
      text("Press up to enter\ndoors", { size: 30 }),
      origin("center"),
      pos(32, 30)
    ],
    "w": () => [
      text("Collect keys\nto open doors", { size: 30 }),
      origin("center"),
      pos(0, 30)
    ],
    "e": () => [
      text("Jump with\nspacebar", { size: 30 }),
      origin("center"),
      pos(0, 30)
    ],
    "r": () => [
      text("Double Jump by pressing\nspacebar\ntwice", { size: 30 }),
      origin("center"),
      pos(0, 30)
    ],
    "y": () => [
      text("Double\nJump", { size: 30 }),
      origin("center"),
      pos(32, 30)
    ],
    "u": () => [
      text("Attack with the\nX key", { size: 30 }),
      origin("center"),
      pos(0, 30)
    ],
    "o": () => [
      text("Green snakes will\ndrop keys", { size: 30 }),
      origin("center"),
      pos(32, 0)
    ],
    "j": () => [
      text("Dash attack with\n C key", { size: 30 }),
      origin("center"),
      pos(32, 0)
    ],
    "l": () => [
      text("Hearts will heal\nyou to full health", { size: 30 }),
      origin("center"),
      pos(32, 0)
    ],
    "c": () => [
      text("Hit portals with your\nsword to teleport", { size: 30 }),
      origin("center"),
      pos(32, 0)
    ],
    "x": () => [
      text("More Levels\nand boss stages\ncoming soon!\nSpecial thanks to:\n\nLaJBel\nIsological", { size: 30 }),
      origin("center"),
    ],
    "v": () => [
      text("I appreciate your\nguidance, help, and time", { size: 20 }),
      origin("center"),
      pos(0, 64)
    ],
    "n": () => [
      text("Jump, Dash, Dash\nJump, Dash, Dash\n to get across big gaps\n\nJump with spacebar\nDash with the C key", { size: 20 }),
      origin("center"),
      pos(0, 64)
    ],










    "1": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "red1",
      layer("back"),
      pos(32, 32),
      color(255, 0, 0),
    ],

    "2": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "red2",
      layer("back"),
      pos(32, 32),
      color(225, 0, 0),
    ],

    "3": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "blue1",
      layer("back"),
      pos(32, 32),
      color(0, 0, 255),
    ],

    "4": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "blue2",
      layer("back"),
      pos(32, 32),
      color(0, 0, 255),
    ],
    "5": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "green1",
      layer("back"),
      pos(32, 32),
      color(0, 255, 0),
    ],

    "6": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "green2",
      layer("back"),
      pos(32, 32),
      color(0, 255, 0),
    ],
    "7": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "yellow1",
      layer("back"),
      pos(32, 32),
      color(255, 255, 0),
    ],
    "8": () => [
      sprite("beam", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "yellow2",
      layer("back"),
      pos(32, 32),
      color(255, 255, 0),
    ],
    "m": () => [
      sprite("mushroom", { anim: "idle" },
      ),
      origin("bot"),
      area({ height: 12 }),
      scale(3),
      "mushroom",
      layer("back"),
      pos(32, 64),

    ],
    "f": () => [
      sprite("lava", { anim: "idle" },
      ),
      area({ width: 64, height: 16 }),
      origin("bot"),
      scale(2),
      "lava",
      pos(-1664, 0),
    ],
    "F": () => [
      sprite("lava", { anim: "idle" },
      ),
      area({ width: 64, height: 16 }),
      origin("bot"),
      scale(2),
      "lava",
      pos(32, 64),
    ],


    "h": () => [
      sprite("heart", { anim: "idle" },
      ),
      origin("center"),
      area({ scale: 0.3 }),
      scale(3),
      "heart",
      layer("back"),
      pos(32, 32)
    ],


    "d": () => [
      sprite("door", { frame: 0 }),
      scale(2),
      area({ width: 1, }),
      origin("center"),
      pos(32, 32),
      "door",
      layer("back"),
    ],
    "k": () => [
      { width: 64, height: 64 },
      sprite("key", { anim: "idle" }),
      area({ width: 5, }),
      origin("center"),
      scale(3),
      pos(32, 32),
      "key",
    ],
    "L": () => [
      { width: 16384, height: 1024 },
      rect(64, 64),
      area(),
      pos(-2048, -64),
      color(230, 72, 46),
    ],









    "p": () => [
      sprite("blue", {
        animSpeed: 1,
        frame: 0,
      }),
      origin("center"),
      area({ scale: 0.25, width: 50 }),
      body(),
      scale(2.5),
      health(12),
      color(),
      "player",
      layer("front"),
    ],

    "s": () => [
      sprite("snake", { anim: "walk", flipX: true },
        {
          animSpeed: 1,
          frame: 0,
        },
      ),
      origin("center"),
      area({ scale: 0.41 }),
      body(),
      solid(),
      scale(3),
      patrol(100, -1),
      "enemy_snake",
      health(3),
      layer("front"),
    ],
    "z": () => [
      sprite("snake_drop", { anim: "walk", flipX: true },
        {
          animSpeed: 1,
          frame: 0,
        },
      ),
      origin("center"),
      area({ scale: 0.4, offset: vec2(0, 4) },),
      body(),
      solid(),
      pos(),
      scale(3),
      patrol(100, -1),
      "enemy_snake_drop",
      health(3),
      layer("front"),
    ],

    "S": () => [
      sprite("skeleton", { anim: "idle", flipX: true, },
        {
          animSpeed: 1,
        },
      ),
      area({ width: 10, height: 20, offset: vec2(0, 60) }),
      origin("center"),
      body(),
      solid(),
      pos(),
      scale(10),
      patrol(280, -1),
      "skeleton",
      health(30),
      layer("front"),
    ],

  });











  const box = get("player")[0];
  let hasKey = false;
  const healthText = add([
    text("HEALTH", { size: 32 }),
    layer("healtText"),
    pos(65, 32),
    origin("center"),
    fixed(),
  ]);
  const healthbar = add([
    rect(width(), 64),
    outline(4),
    pos(0, 0),
    color(0, 255, 0),
    fixed(),
    layer("front"),
    {
      max: 12,
      set(hp) {
        if (hp <= 2) {
          this.color.r = 255;
          this.color.g = 0;
          this.color.b = 0;
        }
        else if (hp <= 4) {
          this.color.r = 233;
          this.color.g = 116;
          this.color.b = 81;
        }
        else if (hp <= 8) {
          this.color.r = 255;
          this.color.g = 255;
          this.color.b = 0;
        }
        else {
          this.color.r = 0;
          this.color.g = 255;
          this.color.b = 0;
        }

        this.width = width() * hp / this.max;
      },
    },
  ]);

  let facing = 1;

  layers([
    "backtiles",
    "back",
    "front",
    "healtText",
  ]);

  if (levelIndex == 0) {
    const door = get("door");
    door[0].play("open");
    hasKey = true;
  }

  ;

  box.collides("door", (d) => {
    if (hasKey) {
      d.play("open");
      play("door3");
      hasKey = false;
      keyPress("up", () => {
        collides("door", "player", () => {
          go("start", levelIndex + 1)
        })

      })
    }
  }),

    collides("enemy_snake", "sword", (s) => {
      play("hit1");
      shake();
      s.play("hurt");
      s.hurt(1);
      wait(0.5, () => {
        s.play("walk");
      });
    });

  collides("enemy_snake_drop", "sword", (s) => {
    play("hit1");
    shake();
    s.play("hurt");
    s.hurt(1);
    wait(0.5, () => {
      s.play("walk");
    });
  });

  box.on("death", () => {
    destroy(box);
    deathLocation(box, facing);
    wait(2.5, () => {
      go("start", levelIndex);
    });
  })

  on("death", "enemy_snake", (s) => {
    destroy(s);
  })

  on("death", "enemy_snake_drop", (s) => {
    destroy(s);
    dropKey(s);
  });

  box.on("hurt", () => {
    healthbar.set(box.hp())
  })

  box.collides("heart", (h) => {
    play("powerup6");
    destroy(h);
    healthbar.set(12);
    box.heal(12 - box.hp())

  })

  box.collides("enemy_snake", (obj, side) => {
    shake();
    box.color.r = 255;
    box.color.g = 0;
    box.color.b = 80;
    box.hurt(1);
    play("damage1");

    if (side.isRight()) {
      box.pos.x = box.pos.x - 64;
    }
    else if (side.isLeft()) {
      box.pos.x = box.pos.x + 64;
    }
    else {
      box.pos.y = box.pos.y - 64;
    }
    wait(0.2, () => {
      box.color.r = 255;
      box.color.g = 255;
      box.color.b = 255;
    })
  });

  box.collides("enemy_snake_drop", (obj, side) => {
    shake();
    box.hurt(1);
    play("damage1");
    box.color.r = 255;
    box.color.g = 0;
    box.color.b = 80;
    if (side.isRight()) {
      box.pos.x = box.pos.x - 64;
    }
    else if (side.isLeft()) {
      box.pos.x = box.pos.x + 64;
    }
    else {
      box.pos.y = box.pos.y - 64;
    }
    wait(0.2, () => {
      box.color.r = 255;
      box.color.g = 255;
      box.color.b = 255;
    })
  });


  box.collides("key", (key) => {
    play("double1");
    destroy(key);
    hasKey = true;
  })

  box.collides("mushroom", () => {
    play("jump16");
    box.play("jump");
    box.jump(750 * 1.5)
    jumps = 1;
  })

  box.collides("lava", () => {

    healthbar.set(1);
    destroy(box);
    deathLocation(box, facing);
    wait(0.5, () => {
      healthbar.set(0);
    })
    wait(1.4, () => {
      go("start", levelIndex)
    })
  });


  collides("red1", "sword", () => {
    play("laser3");
    destination = get("red2")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  });

  collides("red2", "sword", () => {
    play("laser3");
    destination = get("red1")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })

  collides("blue1", "sword", () => {
    play("laser3");
    destination = get("blue2")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })

  collides("blue2", "sword", () => {
    play("laser3");
    destination = get("blue1")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })

  collides("green1", "sword", () => {
    play("laser3");
    destination = get("green2")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })

  collides("green2", "sword", () => {
    play("laser3");
    destination = get("green1")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })
  collides("yellow1", "sword", () => {
    play("laser3");
    destination = get("yellow2")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })

  collides("yellow2", "sword", () => {
    play("laser3");
    destination = get("yellow1")[0];
    box.pos.x = destination.pos.x;
    box.pos.y = destination.pos.y;
    jumps = 2;
  })
















  box.play("idle");

  keyDown("left", () => {
    box.move(-250, 0);
  })

  keyDown("right", () => {
    box.move(250, 0);
  })

  keyPress("left", () => {
    facing = -1;
    box.flipX(true),
      box.play("run");
  });

  keyPress('right', () => {
    facing = 1;
    box.flipX(false);
    box.play("run");
  });

  // keyPress("v", () => {
  //     box.play("surikenthrow");
  //    if (box.hp() > 0) {
  //        play("swoosh");
  //        spawnSuriken(box.pos.x, box.pos.y, facing);
  //    }
  // });

  keyPress("x", () => {
    box.play("attack");
    if (box.hp() > 0) {
      play("swoosh");
      sword(box.pos.x, box.pos.y, facing);
    }
  });


  keyPress("c", () => {
    box.move(facing * 900, 0)
    box.play("forward");
    if (box.hp() > 0) {
      play("attackforward");
      sword(box.pos.x, box.pos.y, facing, 80);
    }
  })

  keyRelease("c", () => {
    box.play("idle");
  })

  let jumps = 2;

  keyPress("space", () => {
    if (jumps > 0) {
      play("jump8");
      box.jump();
      box.play("jump");
      jumps = jumps - 1;
    }
  });


  // keyRelease("v", () => {
  //        box.play("idle");
  //  })

  keyPress("r", () => {
    go("start", levelIndex);
  })

  keyRelease("space", () => {
    box.play("idle");
  })

  keyRelease("left", () => {
    box.play("idle");
  })

  keyRelease("right", () => {
    box.play("idle");
  })

  keyRelease("x", () => {
    box.play("idle");
  })

  // box.collides("ground", () => {
  //         jumps = 2;
  //});

  box.action(() => {
    // Need to modify the commented out code to make camera
    // transitions for teleportation more 'smooth'
    //if(box.pos.x > camPos().x+5) {
    //    camPos(camPos().x + 8, box.pos.y);
    //    }
    //else{
    camPos(box.pos);
    if (box.grounded()) {
      jumps = 2;
    };
    //}
    if (box.pos.y > 3000) {
      healthbar.set(1);
      //box.hurt(11);
      destroy(box);
      deathLocation(box, facing);
      wait(0.5, () => {

        healthbar.set(0);
      })
      wait(1.4, () => {
        go("start", levelIndex)
      })
    }
  })

  keyPress("f", (c) => {
    fullscreen(!fullscreen());
  })
});

go("title");
//go("start", 0);
play("hope", {
  volume: 0.1,
  loop: true
})
