
Claims: T1, T2, T3, T5, B1

The controls are as described in the Task.

Note about T3: spacebar only moves the object 1 Tile down to speed up the game. It does not auto-land it.
During manual rotation and translation, it is possible to create collisions with objects stuck in other objects.
Objects can be manually translated out of the grid. 
This can break the game as I have defined a ground that is only 4x4 large.

Note about T5: The mouse movement has not been properly implemented.

Note about B1: After the game stops. Manual refresh for restart.

Tested OS: Windows 11
This time every object is hardcoded. No need to import anything. No http-server connection required.
Tested Browser: Firefox latest version as of May 2022.

The webgl code is in ShaderProgram.js

