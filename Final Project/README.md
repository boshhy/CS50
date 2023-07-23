# Blade
#### Video Demo: https://www.youtube.com/watch?v=4wWv3ugZBKw
#### Description:
TODO
Hello my name is Ivan Almaraz also known by the username of Boshhy.
For my final project for "CS50: Introduction to Computer Science" I decided to make a platformer game.
The game is built on a JavaScript library called Kaboom.js and hosted on Replit's website.

The main chracter of the game is holding a sword and is currently the only weapon in the game, because of this
I decided to call my game "Blade". The game starts off be pressing the start button and you are dropped into a
platform that presents the user with instructions on how to move. The first few levels go over the player controls
so the player can know what abilities they have. These levels also introduce the player to some items, ememies, and mechanics
of the game. Followed by some levels that get difficult to finish without precise movement and attack execution.
Left arrow key will move the player to the left and the right arrow key will move the player to the right. The 'x' key will
allow a player to attack with the sword. The 'y' key will allow the player to stab the sword forward and this will move the
player slightly in the directon they are facing. space bar is used to make the player jump. The player is allowed to double jump.
The up arrow key will allow players to enter doors that have been opened.The object of the game is to enter doors to advance to the
next stage. A player can pick up keys by touching them once a player has a key they are able to open closed doors. There is also
some snakes that walk left and right. Both pink and green snakes take three hits to die. Players can hurt snakes by attacking them
with the sword. Green snakes will drop keys. Mushrooms will force a player to jump once, the player can then jump a second time
while in the air. The next mechanic of the game are teleports, there are four different colors, when a player hit a teleporter of
a certain color it will teleport the player to the other teleporter of the same color. Players are allowed to go back and forth
through portals. If a player falls of a level of touches lava they will instanly die. When a player dies they restart the current
level they are on. Restart of current level can also be done by pressing the "r" key on the keyboard. A player can enter full screen
mode be pressing the "f" key.

Starting off was the platform for the game. When picking a final project I wanted to do something that the user can intract with.
I was looking at past final project and decided that a game would be best. I then read about the Lua with LÖVE game engine but I wanted
something that was not going too be too big in file size. I decided that I would make a game with JavaScript so anyone that had a computer with an Internet
connection would be able to play the game. I looked at some JavaScript libraries for making games and ran into two possible
libraries I could use, Kaboom.js and Phaser.js. I decided to go with Kaboom.js because it was fairly new, only being released this March of 2021.
Kaboom.js does not currntly have a big following or tutorials behind it and decided that because of this I would learn a little bit more when I would
run into errors. I found out that you could build your code and run online in realtime just like the CS50 IDE. I joined the Discord for Kaboom.js
which only consisted of about thirty individuals.

The next day I spent watching YouTube videos of Kaboom.js. There was only about 5 videos that actually showed how to make a simple game using Kaboom.
The following day I struggled to get kaboom CDN up and running but I studied the code that I saw on the tutorials and finally got it to load.
The next two days i spend looking for sprites that were free to use and that I would be able to load to Kaboom.

The project consists of a two folders. One called sounds, where all the sound are located. The other called sprites where all the sprites and art are located.
Then in the same directory as the folders there is a cs50game.js file along with an index.html file.

The index.html file contains a few lines of code. The main lines of code that are intersting are
```HTML
    <script src="https://unpkg.com/kaboom@2000.0.0-beta.24/dist/kaboom.js"></script>
    <script src="cs50game.js"></script>
```

Here the first line loads the CDN for Kaboom version 2000.0.0-beta.24. This line loads the Kaboom.js library so it can be used in the project.
The next line references a file called cs50game.js, this is where all of the Kaboom and JavaScript code will live.

The cs50game.js is where all the code lives, originally I planned to have separate files for different sections of code but ended up putting
everythign in the same file. In the future I will try to split these into different files.The Project took me about 1 week to make with the first
days being a stuggle on how to load sprites how to cut them how to get an animation how Kaboom split the frames. On the third day or so I loaded
up the character sprite and was able to make it move left and right. Then loaded some platformes for the player to stand on. Then I got the
jumping animation up and running.

Let's talk about what the code does. First I change the background color a light gray. The next couple of lines load some sound into the game.
After those lines I have sprites being loaded into the game. Followed by four functions. The function called 'sword' takes in the location and direction of the
player, this function is used to spawn a small rectangle where the player is currently located and extending in the direction the player is facing. This rectangle
is then destroyed, this rectangle is used as the sword hit box. The next function called "patrol" makes the snake sprites move left and right
if the snake collides with an object it turns around and walks the other way. The 'dropKey' function will take in a green snake that has been killed
and place a key at the location where the snake was killed. The final function called 'deathLocation' taked in the death of the player and plays a
death animation in the direction and location the player died. The next thing is to load the scenes, currently I have two scenes
one for the title screen and one for the levels. In the levels scene the player is loaded into memory so we can reference it and make changes to player.
A variable called facing is initiated and will be used to determine what direction the player is facing. The layers function will take in layer names.
Layers will be used to make player walk infront of certain sprites. The next lines of code are used to detect collisions betwen the player and objects.
This collisons are used to check if the sword has hit a snake, if a snake has ran into player, if player has touched a key, if player has touched lava, etc...
depenind on the collision a different animation and damage to player or snake will be calculated. If player touches a mushroom the player will be forced to
jump. When the player hits a portal with their sword the player is positioned at the location of the matching color teleporter.

Those are the basic machanics of the game. I had a great time making the game.

Thanks to David J. Malan, Brian Yu, Doug Lloyd and the entire CS50 staff!
