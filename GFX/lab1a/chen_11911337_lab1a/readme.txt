Drawing the scene: Open index.html in a compatible browser like Firefox or Chrome.

'c' Button: enables/disables the arrow-keys to move the camera around.
'1'-'9' Buttons: selects single objects. (I did not implement deselect function as it was not necessary. Refresh browser to achieve that effect)
'0' Button: selects ALL objects.

'u','i','o','j','k','l' Buttons: if a single object has been selected, these buttons rotate it on the 3 axes. If all objects are selected, these buttons rotate the global axes.

'a','A','s','S','d','D' Buttons: if a single object has been selected, these buttons scale the object along the 3 axes.

'Arrow-keys':   if 'c' is active: moves the camera along global x and y axis.
		if 'c' is not active and a single object is selected: moves that object along global x/y axis.
		if 'c' is not active and all objects is selected: moves all objects along global x/y axis.

'.', ',': if a single object has been selected, moves that object along the z-axis.
	if all objects have been selected, moves all objects along the z-axis.
 
To use obj-files, I had to install node.js on my windows10 Computer and then run the command "http-server -p 8000 --cors" in a shell to create a local server 
from which the code in Lab1.js line 116 fetchs the obj. 
My code also only recognizes v and f lines in obj files.
And f lines only if they contain single parameter v only.

To see the imported obj file in action, decomment the code and comment out the 9.object and make sure the path that is likely different for you is customized.

