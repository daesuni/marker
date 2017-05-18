jQuery Marker
================
![main](/main.png)

Version 1.0.0

Everyone welcomes improving the code. Please help me.

Copyright &copy; 2016-2017 Daesung Jeon (https://daesuni.github.io/).
MIT Open Source license applies.

Click here for Demo & Tutorials - https://daesuni.github.io/marker/


Features
--------
*	A big feature of Jquery Marker is to ignore HTML tags.
*	This is still a trial version and development is ongoing. Please tell me if you have a bug.
*	Css and js are customizable.
*   Color change is prototype and instability.
*   There is a possibility of other script conflicts since refreshing whole html.
*   We recommend setting it to wrapper `<div>` tag.

p.s. All the plugins optionally supported are MIT licensed, so as safe to use as the Marker plugin itself.


Download & Install
------------------
jQuery v1.9.0 or higher required.

jQueryUI v1.9.0 or higher required.

IE 9+ or higher required.

Sourcecode on Github: https://daesuni.github.io/marker/


Quick start
-----------
Here's a short code fragment, demonstrating how to use Marker at it's most
basic level.

There are many more options to tailor it to your needs.

	<div class="classname">
		...
	</div>

	<script>
		// simple
		$('.classname').marker();
		
		// option
		$('.classname').marker({
	 		minimum : 3,
			maximum : 3000,
			colorPicker : true,
			style : {
			   'background' : 'rgba(249, 255, 0, 0.2)',
			},
			activeRemove : true,
			caseSensitive : true,
			add : undefined,
			remove : undefined,
			colorChange : undefined,
			mouseenter : undefined,
			mouseleave : undefined,
			debug : undefined,
	 	});
	</script>


Documentation
=============

`.marker(options)`
---------------------
Create one or more marker or access an existing marker.


Options
-------
### **minimum** (integer, default: `3`)
Minimum length for marking

### **maximum** (integer, default: `1500`)
Maximum length for marking
If there is no limit, freezing may occur. We recommend 1500.

### **colorPicker** (boolean, default: `"true"`)
You can change the color using spectrum.js.

### **style** (object, default: `"{ 'background' : '#232323' }"`)
Apply custom style with css syntax.

### **activeRemove** (boolean, default: `true`)
Whether marking can be deleted or not.

### **caseSensitive** (boolean, default: `true`)
Whether to distinguish between uppercase and lowercase letters
in marking. (used to calculate the number of occurrences and marking recovery)

### **add** (function, default: `undefined`)
Custom callback function after marking.

### **remove** (function, default: `undefined`)
Custom callback function after marking is deleted.

### **colorChange** (function, default: `undefined`)
Custom callback function after color is changed

### **mouseenter** (function, default: `undefined`)
Mouseenter callback custom callback function.

### **mouseleave** (function, default: `undefined`)
Mouseleave callback custom callback function. 

### **debug** (function, default: `undefined`)
Whether to debug or not.

Methods
-------
### **clear**
Deletes the element of the set mark.

### **data**
Get the order of appearance, style, and unique key of the set mark elements in the array.

### **destroy**
Destroys the marker widget and unbind all.

### **restore**
Display markings that have already been created.

Extensions/dependencies
=======================
marker is designed to take advantage of a number of separate Javascript
libraries to supply additional features. The download comes with these files
included. If you deploy your code, you may wish to use or exclude these files.


spectrum.js
------------
https://github.com/bgrins/spectrum
https://bgrins.github.io/spectrum/

The spectrum.js is an option necessary to change the color of the block.
It is not necessary to configure with only a single color.
