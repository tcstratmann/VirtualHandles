/**
 * MATJES-UI
 * 
 * @file Controller-Script
 * @author Uwe Grünefeld, Tim Claudius Stratmann
 * @version 2016-02-29
 *
 **/

// setting for enabling debug-mode
var debug = false;

// array that stores functions to update the views via socket call
var socketUpdate = [];

/**
 *
 * CONTROLLER FOR VIEWS
 *
 */
 
 /**
  * Shows a scale
  *
  * @param {string} id - An unique identification for this HTML-View-Element
  * @param {integer} type - Defines how large the scale is (allowed: 35, 50)
  * @param {string} title - A string for the heading of this element
  * @param {integer} width - Defines the width of this element (the height automatically scales with it)
  * @param {boolean} active - Defines if element is in use
  * @param {string} style - Additional CSS-style for this element
  * @param {integer} value - OPTIONAL: Defines the start value of this element
  **/
function showScale(id, type, title, width, active, style, value) {
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id);
		value = 0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}
	
	var scale = $('<div />', {
		"class": "scale",
		"style": "width:" + width + "px;" + style
	});
	
	var scaleHeading = $('<div />', {
		"class": "scale-heading",
		"text": title
	});
	
	var scaleBackground = $('<div />', {
		"class": "scale-background",
		"style": "height:" + (width * 0.3) + "px;"
	});
	
	var scaleContainer = $('<div />', {
		"class": "scale-container"	
	});
	
	var scaleLeft = $('<div />', {
		"class": "scale-left",
		"text": type
	});
	
	var scaleRight = $('<div />', {
		"class": "scale-right",
		"text": type
	});
	
	// is the element active
	if(!active)
		scaleBackground.css("opacity", 0.5);
	
	function refresh() {
	
		// 10% of type
		var type_10 = type / 10;
		
		// remove all child elements
		scaleContainer.empty();
	
		// if it is a negative scale
		if(value < 0) {
			value = Math.min(-value, type);
		
			// Define beginning point for scale
			var start = $('<div />', {
				"class": "scale-start",
				style: 'margin-left:' + (50 + ((10 - (value / type_10)).toFixed(0) * 14)) + 'px;'
			});		
			scaleContainer.append(start);
		
			// Define bar elements
			for(var i=(value / type_10).toFixed(0); i > 0; i--) {
				var bar = $('<div />', {
					"class": "scale-bar-red",
					style: 'height:' + (20 + (i * 2)) + 'px; margin-top:' + (30 + (10 - i)) + 'px;'
				});
				scaleContainer.append(bar);
			}
		
			// Define middle element
			var middle = $('<div />', {
				"class": "scale-middle"
			});
			scaleContainer.append(middle);
		
		// else it is a postive scale
		} else {
			value = Math.min(value, type);
		
			// Define beginning point for scale
			var start = $('<div />', {
				"class": "scale-start",
				style: "margin-left:190px;"
			});
			scaleContainer.append(start);
		
			// Define middle element
			var middle = $('<div />', {
				"class": "scale-middle"
			});
			scaleContainer.append(middle);
		
			// Define bar elements
			for(var i=0; i < (value / type_10).toFixed(0); i++) {
				var bar = $('<div />', {
					"class": "scale-bar-green",
					style: 'height:' + (20 + (i * 2)) + 'px; margin-top:' + (30 + (10 - i)) + 'px;'
				});
				scaleContainer.append(bar);
			}
		}
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id) {
			value = data.value;
			refresh();
		}
	});

	container.append(scale);
	scale.append(scaleHeading);
	scale.append(scaleBackground);
	scaleBackground.append(scaleContainer);
	scaleBackground.append(scaleLeft);
	scaleBackground.append(scaleRight);
	
	refresh();
}

/**
 * Shows a horizontal slider
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} type - Defines how large the scale is (allowed: 100)
 * @param {string} title - A string for the heading of this element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {boolean} active - Defines if element is in use
 * @param {string} style - Additional CSS-style for this element
 * @param {integer} value - OPTIONAL: Defines the start value of this element
 **/
function showSliderHorizontal(id, type, title, width, active, style, value) {
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id);
		value = 0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}
	
	var slider = $('<div />', {
		"class": "slider-horizontal",
		"style": "width:" + width + "px;" + style
	});
	
	var sliderHeading = $('<div />', {
		"class": "slider-horizontal-heading",
		"text": title
	});
	
	var sliderBackground = $('<div />', {
		"class": "slider-" + type + "-horizontal-background",
		"style": "height:" + (width * 0.3) + "px;"
	});
	
	// if element is active
	if(!active)
		sliderBackground.css("opacity", 0.5);
	
	var sliderValue = $('<div />', {
		"class": "slider-horizontal-value"
	});
	
	var sliderInput = $('<input />', {
		"class": "slider-horizontal-input horizontal",
		"type": "range",
		"min": "-" + type,
		"max": type,
		"step": "5",
		"value": "0"
	});
	
	if(!active)
		sliderInput.prop('disabled', true);
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id && active) {
			sliderInput.val(data.value);
		}
	});
	
	sliderInput.val(value);
	sliderInput.on("change", function() {
		if(active)
    		updateValue(id, sliderInput.val());
	});
	
	container.append(slider);
	slider.append(sliderHeading);
	slider.append(sliderBackground);
	sliderBackground.append(sliderValue);
	sliderValue.append(sliderInput);
}


/**
 * Shows a heading display
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {float} value - OPTIONAL: Defines the start value of this element
 **/
function showHeading(id, width, style, value) {
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id);
		value = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}
	
	var display = $('<div />', {
		"class": "heading",
		"style": "width:" + width + "px;height:" + (width * 0.2) + "px;" + style
	});
	
	var displayValue = $('<div />', {
		"class": "heading-value"
	});
	
	function refresh() {
		// modulo max degrees and remove negative
		value = Math.abs(value % 360);
		
		displayValue.html(value.toFixed(1) + "&deg;");
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id) {
			if(!$.isNumeric(data.value)) {
				data.value = 0;
			}
			value = data.value;
			refresh();
		}
	});

	container.append(display);
	display.append(displayValue);
	
	refresh();
}


/**
 * Shows a machine telegraph
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {boolean} connected - Boolean, if true both are connected, if false they are not
 * @param {integer} value - OPTIONAL: Defines the start value of this element
 **/
function showMachineTelegraph(id, width, style, connected, value) {
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id + '-left');
		update(id + '-right');
		value = 0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-left', value);
		updateValue(id + '-right', value);
	}
	
	var machineTelegraph = $('<div />', {
		"class": "machine-telegraph",
		"style": "width:" + width + "px;" + style
	});
	
	var machineTelegraphBackground = $('<div />', {
		"class": "machine-telegraph-background",
		"style": "height:" + (width * 1.6) + "px;"
	});
	
	var machineTelegraphSliderLeft = $('<input />', {
		"class": "machine-telegraph-slider-left vertical",
		"type": "range", 
		"min": "-100",
		"max": "100",
		"step": "5",
		"value": "0"
	});
	
	var machineTelegraphSliderRight = $('<input />', {
		"class": "machine-telegraph-slider-right vertical",
		"type": "range", 
		"min": "-100",
		"max": "100",
		"step": "5",
		"value": "0"
	});
	
	// Connect both sliders if neccesary
	if(connected) {
		machineTelegraphSliderLeft.on("input", function() { 
			machineTelegraphSliderRight.val($(this).val()); 
		});
		machineTelegraphSliderRight.on("input", function() {
			machineTelegraphSliderLeft.val($(this).val());
		});
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-left") {
			machineTelegraphSliderLeft.val(data.value);
		}
		if(data.name == id + "-right") {
			machineTelegraphSliderRight.val(data.value);
		}
	});
	
	// Handle on change event for left slider
	machineTelegraphSliderLeft.on("change", function() {
    	updateValue(id + "-left", machineTelegraphSliderLeft.val());
		
		if(connected)
			updateValue(id + "-right", machineTelegraphSliderLeft.val());
	});
	
	// Handle on change event for right slider
	machineTelegraphSliderRight.on("change", function() {
		updateValue(id + "-right", machineTelegraphSliderRight.val());

		if(connected)
			updateValue(id + "-right", machineTelegraphSliderRight.val());
	});
	
	container.append(machineTelegraph);
	machineTelegraph.append(machineTelegraphBackground);
	machineTelegraphBackground.append(machineTelegraphSliderLeft);
	machineTelegraphBackground.append(machineTelegraphSliderRight);
}


/**
 * Shows a rudder
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {integer} value - OPTIONAL: Defines the start value of this element
 **/
function showRudder(id, width, style, value) {
	
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id);
		value = 0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}

	var rudder = $('<div />', {
		"class": "rudder",
		"style": "width:" + width + "px;" + style
	});
	
	var rudderBackground = $('<div />', {
		"class": "rudder-background",
		"style": "height:" + (width * 0.45) + "px;"
	});
	
	var rudderSlider = $('<img />', {
		"class": "rudder-slider",
		"src": "image/misc/pendel.png",
		"ondragstart":"return false;"
	});
	
	// Event handler for mousedown, mousemove and mouseup
	var isDragging = false, value;
	rudder.mouseup(function( e ) {
    	isDragging = false;
	})
	.mousedown(function( e ) {
    	isDragging = true;
    	calculate(e.pageX, e.pageY);
	})
	.mousemove(function( e ) {
		if(isDragging)
			calculate(e.pageX, e.pageY);
	});
	
	// Event handler for touch
	rudder.bind('touchstart', function( e ) {
		//isDragging = true;
	});
	rudder.bind('touchend', function( e ) {
		isDragging = false;
	});
	rudder.bind('touchmove', function( e ) {
		var touch = e.originalEvent.touches[0];
		calculate(touch.pageX, touch.pageY);
	});
	
	function calculate(mouseX, mouseY) {
		
		var relativeX = mouseX - (rudder.offset().left + 280);
		var relativeY = -(mouseY - (rudder.offset().top + 173));

		var factor = Math.sqrt(Math.pow(relativeX, 2) + Math.pow(relativeY, 2));
			
		// removed the ability for moving the rudder in positive Y values
		if(relativeY < 0) {	
			value = Math.asin(Math.abs(relativeX) / factor) * 100 * 0.58;
			
			if((relativeX > 0 && relativeY < 0) || (relativeX < 0 && relativeY > 0))
				value *= -1;
		}
		
		value = (value * 35) / 75
		
		if(value > 35) {
    		value = 35;
    	}
    	if(value < -35) {
    		value = -35;
    	}
	
		refresh();
    	updateValue(id, value);
	}
	
	function refresh() {

    	if($.isNumeric(value)) {
			var rotation = value * 75 / 35;
			
			// snap the 0 turn rate
			if(rotation < 5 && rotation > -5)
				rotation = 0;
			
    		// rotate rudder handle, scale rotation: (VALUE * MAX_DEGREE / MAX_VALUE)
    		rudderSlider.css("transform", "rotate(" + rotation + "deg)");
    	} else {
    		value = 0;
    	}
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id) {
			value = data.value;
			refresh();
		}
	});
	
	container.append(rudder);
	rudder.append(rudderBackground);
	rudder.append(rudderSlider);
	
	refresh();
}


/**
 * Shows a compass
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {integer} value - OPTIONAL: Defines the start value of this element
 **/
function showCompass(id, width, style, value) {

	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update("heading"); //HACK: set compass value == heading
		value = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}
	
	var compass = $('<div />', {
		"class": "compass",
		"style": "width:" + width + "px;height:" + width + "px;" + style
	});
	
	var compassBackground = $('<div />', {
		"class": "compass-background"
	});
	
	var compassForeground = $('<div />', {
		"class": "compass-foreground"
	});
	
	function refresh() {
		// modulo max degrees and remove negative
		value = Math.abs(value % 360);
	
		// get transformation matrix
		var matrix = compassBackground.css('transform');
		var values = matrix.split('(')[1];
      	values = values.split(')')[0];
      	values = values.split(',');
    	var a = values[0];
    	var b = values[1];
    	var c = values[2];
    	var d = values[3];
    	
    	// calculate the current rotation with the transformation matrix
    	var angle = Math.round(Math.atan2(b, a) * (180/Math.PI));

		// normalize it to 0 - 359
    	angle *= -1;
    	if(angle < 0)
    		angle = 360 + angle;

		// calculate differences
		var differenceA = angle - value;
		var differenceB = 360 - Math.abs(differenceA);
		var difference = 0;

		// calculate turning
		if(Math.abs(differenceA) < Math.abs(differenceB)) {
		
			// turning left
			if(differenceA > 0) {
				angle = (360 - angle);
				value = -(360 - value);
			// turning right
			} else {
				angle = -angle;
			}
			
			difference = Math.abs(differenceA);
		
		} else {
			
			// turning left over zero
			if(differenceA < 0) {
				angle = -angle;
				value = -(360 - value);
			// turning right over zero
			} else {
				angle = (360 - angle);
			}
		
			difference = differenceB;
		}

		compassBackground.animateRotate(angle, -value, Math.sqrt(difference) * 500, 'swing', function () {});
		
		// Deprecated: Without animation
		//.css("transform", "rotate(-" + value + "deg)"); 
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == "heading") { //HACK: set compass value == heading
			if(!$.isNumeric(data.value)) {
				data.value = 0;
			}
			value = data.value;
			refresh();
		}
	});
	
	container.append(compass);
	compass.append(compassBackground);
	compass.append(compassForeground);
	
	refresh();
}


/**
 * Shows an echolot display
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {float} value - OPTIONAL: Defines the start value of this element
 **/
function showEcholot(id, width, style, value) {
	
	// additional parameter
	var pwr = false;
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(value)) {
		// 	Maybe there is a SERVER value
		update(id);
		value = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id, value);
	}
	
	// Check for OPTIONAL value
	if(!$.isNumeric(value))
		value = 0.0;
	
	var echolot = $('<div />', {
		"class": "echolot",
		"style": "width:" + width + "px;" + style
	});
	
	var echolotBackground = $('<div />', {
		"class": "echolot-background",
		"style": "height:" + (width * 0.50) + "px;"
	});
	
	var echolotPWR = $('<div />', {
		"class": "echolot-pwr"
	});
	
	var echolotDisplay = $('<div />', {
		"class": "echolot-display"
	});
	
	// State for echolot turned on
	function onState() {
		if(!$.isNumeric(value)) {
			value = 0;
		}
		echolotDisplay.text(value.toFixed(1) + " m");
		echolotPWR.css("background-image", "url('../image/button/power-on.png')");
	}
	
	// State for echolot turned off
	function offState() {
		echolotDisplay.text("");
		echolotPWR.css("background-image", "url('../image/button/power-off.png')");
	}
	
	var refresh = function() {
		if(pwr)
			onState();
		else
			offState();
	}
	
	// Event on click
	echolotPWR.click(function() {
		pwr = !pwr;
		refresh()
	});
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id) {
			value = data.value;
		}
		refresh();
	});
	
	container.append(echolot);
	echolot.append(echolotBackground);
	echolotBackground.append(echolotPWR);
	echolotBackground.append(echolotDisplay);
	
	refresh();
}


/**
 * Shows a VHF display
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {integer} valueWatt - OPTIONAL: Defines the start value of the watt value
 * @param {integer} valueChannel - OPTIONAL: Defines the start value of the channel
 * @param {string} valueCoordNorth - OPTIONAL: Defines the start value for the coord north
 * @param {string} valueCoordEast - OPTIONAL: Defines the start value for the coord east
 **/
function showVHF(id, width, style, valueWatt, valueChannel, valueCoordNorth, valueCoordEast) {
	
	// additional parameter
	var pwr = false;
	
	// root element
	var container = $('#container');

	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(valueWatt)) {
		// 	Maybe there is a SERVER value
		update(id + '-watt');
		valueWatt = 25;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-watt', valueWatt);
	}
	if(!$.isNumeric(valueChannel)) {
		// 	Maybe there is a SERVER value
		update(id + '-channel');
		valueChannel = 16;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-channel', valueChannel);
	}
	if(!$.isNumeric(valueCoordNorth)) {
		// 	Maybe there is a SERVER value
		update(id + '-coord-north');
		valueCoordNorth = "0' 0.000";
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-coord-north', valueCoordNorth);
	}
	if(!$.isNumeric(valueCoordEast)) {
		// 	Maybe there is a SERVER value
		update(id + '-coord-east');
		valueCoordEast = "0' 0.000";
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-coord-east', valueCoordEast);
	}
	
	var vhf = $('<div />', {
		"class": "vhf",
		"style": "width:" + width + "px;" + style
	});
	
	var vhfBackground = $('<div />', {
		"class": "vhf-background",
		"style": "height:" + (width * 0.30) + "px;"
	});
	
	var vhfPWR = $('<div />', {
		"class": "vhf-pwr"
	});
	
	var vhfDisplay = $('<div />', {
		"class": "vhf-display"
	});
	
	var vhfDisplayWatt = $('<div />', {
		"class": "vhf-display-watt"
	});
	
	var vhfDisplayChannel = $('<div />', {
		"class": "vhf-display-channel"
	});
	
	var vhfDisplayCoords = $('<div />', {
		"class": "vhf-display-coords"
	});
	
	var vhfButtons = $('<div />', {
		"class": "vhf-buttons"
	});
	
	var vhfButtonUp = $('<div />', {
		"class": "vhf-button-up"
	});
	toButton(vhfButtonUp);
	
	var vhfButtonDown = $('<div />', {
		"class": "vhf-button-down"
	});
	toButton(vhfButtonDown);
	
	var vhfMenu = $('<div />', {
		"class": "vhf-menu"
	});
	toButton(vhfMenu);
	
	var vhfVolMinus = $('<div />', {
		"class": "vhf-vol-minus"
	});
	toButton(vhfVolMinus);
	
	var vhfVolPlus = $('<div />', {
		"class": "vhf-vol-plus"
	});
	toButton(vhfVolPlus);
	
	var vhfChannel = $('<div />', {
		"class": "vhf-channel",
		text: "16"
	});
	
	// State for vhf turned on
	function onState() {
		vhfDisplayWatt.text(valueWatt + " W");
		vhfDisplayChannel.text(valueChannel);
		vhfDisplayCoords.html(valueCoordNorth + " N<br />" + valueCoordEast + " E");
		
		vhfChannel.css("background-image", "url('../image/button/red-clear-on.png')");
		
		vhfPWR.css("background-image", "url('../image/button/power-on.png')");
	}
	
	// State for vhf turned off
	function offState() {
		vhfDisplayWatt.text("");
		vhfDisplayChannel.text("");
		vhfDisplayCoords.html("");
		
		vhfChannel.text("16");
		vhfChannel.css("background-image", "url('../image/button/red-clear-off.png')");
		
		vhfPWR.css("background-image", "url('../image/button/power-off.png')");
	}

	var refresh = function() {
		if(pwr)
			onState();
		else
			offState();
	}
	
	// Event on click
	vhfPWR.click(function() {
		pwr = !pwr;
		refresh()
	});
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-watt") {
			valueWatt = data.value;
		}
		if(data.name == id + "-channel") {
			valueChannel = data.value;
		}
		if(data.name == id + "-coord-north") {
			valueCoordNorth = data.value;
		}
		if(data.name == id + "-coord-east") {
			valueCoordEast = data.value;
		}
		refresh();
	});
	
	container.append(vhf);
	vhf.append(vhfBackground);
	vhfBackground.append(vhfPWR);
	vhfBackground.append(vhfDisplay);
	vhfDisplay.append(vhfDisplayWatt);
	vhfDisplay.append(vhfDisplayChannel);
	vhfDisplay.append(vhfDisplayCoords);
	vhfBackground.append(vhfButtons);
	vhfButtons.append(vhfButtonUp);
	vhfButtons.append(vhfButtonDown);
	vhfBackground.append(vhfMenu);
	vhfBackground.append(vhfVolMinus);
	vhfBackground.append(vhfVolPlus);
	vhfBackground.append(vhfChannel);
	
	refresh();
}


/**
 * Shows a navtex
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 **/
function showNavtex(id, width, style) {
	
	// additional parameter
	var pwr = false;
	var list = new Array();
	var id = 0;
	
	// root element
	var container = $('#container');
	
	var navtex = $('<div />', {
		"class": "navtex",
		"style": "width:" + width + "px;" + style
	});
	
	var navtexBackground = $('<div />', {
		"class": "navtex-background",
		"style": "height:" + width * 0.75 + "px"
	});
	
	var navtexDisplay = $('<div />', {
		"class": "navtex-display"
	});
	
	var navtexDisplayList = $('<div />', {
		"class": "navtex-display-list"
	});
	
	var navtexDisplayText = $('<div />', {
		"class": "navtex-display-text"
	});
	
	var navtexPWR = $('<div />', {
		"class": "navtex-pwr"
	});
	
	var navtexUp = $('<div />', {
		"class": "navtex-up"
	});
	toButton(navtexUp);
	
	var navtexDown = $('<div />', {
		"class": "navtex-down"
	});
	toButton(navtexDown);
	
	var navtexMenu = $('<div />', {
		"class": "navtex-menu"
	});
	toButton(navtexMenu);
	
	// State for navtex turned on
	function onState() {
		list = new Array();
		random();
		
		navtexPWR.css("background-image", "url('../image/button/power-on.png')");
	}
	
	// State for navtex turned off
	function offState() {
		list = new Array();
		draw();
		
		navtexPWR.css("background-image", "url('../image/button/power-off.png')");
	}
	
	var refresh = function() {
		if(pwr) {
			onState();
		} else
			offState();
	}
	
	var draw = function() {
		
		// draw list
		navtexDisplayList.html("");
		navtexDisplayText.html("");
		
		if(list.length > id && id >= 0) {
			for(var i=Math.max(0, id - 4); i < list.length; i++) {
				
				if(i > id + 4)
					continue;
				
				var entry = $('<div />', {
					"class": "navtex-display-entry"
				});
				
				if(id == i)
					entry.css("background-color", "#444")

				for(var j=0; j < list[i].length; j++) {
					if(j < 4) {
						entry.text(entry.text() + list[i][j] + "\t");
					}
				}
				
				navtexDisplayList.append(entry);
			}
			
			// draw text
			navtexDisplayText.text("ZCZC " + list[id][0] + "\n" + "NAVTEX " + list[id][1] + "\n" + list[id][2] + " " + list[id][3] + "\n\n" + list[id][4].toUpperCase() + "\n\nNNNN");
		}
	}
	
	var random = function() {
		if(pwr && list.length < 50) {
			
			// create a new random message
			var date = new Date();
			list.push(new Array("S" + Math.random().toString(36).substring(2,3) + Math.random().toString(10).substring(2,4), 
						"518kHz", addZero(date.getHours()) + ":" + addZero(date.getMinutes()), 
						date.getFullYear() + "/" + addZero(date.getMonth() + 1) + "/" + addZero(date.getDate()), 
						randText()));
						
			if(id == list.length - 2)
				id = list.length - 1;
			
			// redraw the interface
			draw();
			
			// every 5 minutes random message
			setTimeout(random, 60 * 1000 * 5);
		}
		
		// two characters for every number
		function addZero(i) {
			if (i < 10) {
				i = "0" + i;
			}
			return i;
		}
		
		// generate random navtex text
		function randText() {
			var text = new Array("EASTERN MEDITERRANEAN YACHT RALLY, RALLY ROUTES MERSIN, ISKENDERUN, LATTAKIA, JOUNEH, HAIFA, ASHKELON, PORT SAID AND HERZLIYA, ALL VESSELS IN THE REGION REQUESTED TO FOLLOW THE NOTICE DECLARED BY AUTHORITESWIDE BERTH ADVISED",
				"ESTIMATED LIMIT OF ALL KNOWN ICE: 4649N 5411W TO 4530N 5400W TO 4400N 4900W TO 4545N 4530W TO 4715N 4530W TO 5000N 4715W TO 5530N 5115W TO 5700N 5545W",
				"SEMI SUNK BOAT WITH THREE (3) MEN OVERBOARD IN PSN 39-07,7N 026-39,2E SHIPS IN VICINITY ARE REQUESTED TO PROCEED FOR SEARCH OPERATIONS INFORMING JRCC PIRAEUS",
				"NO MESSAGE ON HAND",
				"Storm warnings, synopsis and 24 hour forecast in English",
				"Warning Summary Sea Area Forecasts for next 12 hours and 12 hour outlook",
				"Warning Summary, Sea Area Forecasts for next 24 hours and brief outlook"
			);
			
			return text[Math.floor(Math.random() * text.length)];
		}
	}
	
	// Event on click
	navtexPWR.click(function() {
		pwr = !pwr;
		refresh();
	});
	
	navtexUp.click(function() {
		if(id > 0) {
			id--;
			draw();
		}
	});
	
	navtexDown.click(function() {
		if(id < (list.length - 1)) {
			id++;
			draw();
		}
	});
	
	container.append(navtex);
	navtex.append(navtexBackground);
	navtexBackground.append(navtexDisplay);
	navtexDisplay.append(navtexDisplayList);
	navtexDisplay.append(navtexDisplayText);
	navtexBackground.append(navtexPWR);
	navtexBackground.append(navtexUp);
	navtexBackground.append(navtexDown);
	navtexBackground.append(navtexMenu);

	refresh();
}


/**
 * Shows a gps display
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {string} valueCoordNorth - OPTIONAL: Defines the start value for the coord north
 * @param {string} valueCoordEast - OPTIONAL: Defines the start value for the coord east
 * @param {float} valueCourse - OPTIONAL: Defines the start value of the course value
 * @param {float} valueSpeed - OPTIONAL: Defines the start value of the speed value
 **/
function showGPS(id, width, style, valueCoordNorth, valueCoordEast, valueCourse, valueSpeed) {
	
	// additional parameter
	var pwr = false;
	var nav = false;
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(valueCoordNorth)) {
		// 	Maybe there is a SERVER value
		update(id + '-coord-north');
		valueCoordNorth = "0.000";
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-coord-north', valueCoordNorth);
	}
	if(!$.isNumeric(valueCoordEast)) {
		// 	Maybe there is a SERVER value
		update(id + '-coord-east');
		valueCoordEast = "0.000";
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-coord-east', valueCoordEast);
	}
	if(!$.isNumeric(valueCourse)) {
		// 	Maybe there is a SERVER value
		update(id + '-course');
		valueCourse = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-course', valueCourse);
	}
	if(!$.isNumeric(valueSpeed)) {
		// 	Maybe there is a SERVER value
		update(id + '-speed');
		valueSpeed = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-speed', valueSpeed);
	}
	
	var gps = $('<div />', {
		"class": "gps",
		"style": "width:" + width + "px;" + style
	});
	
	var gpsBackground = $('<div />', {
		"class": "gps-background"
	});
	
	var gpsPWR = $('<div />', {
		"class": "gps-pwr"
	});
	
	var gpsDisplay = $('<div />', {
		"class": "gps-display"
	});
	
	var gpsDisplayCoords = $('<div />', {
		"class": "gps-display-coords"
	});
	
	var gpsDisplayCourse = $('<div />', {
		"class": "gps-display-course"
	});
	
	var gpsRight = $('<div />', {
		"class": "gps-right"
	});
	
	var gpsRightNav = $('<div />', {
		"class": "gps-right-nav"
	});
	
	var gpsRightButtonUp = $('<div />', {
		"class": "gps-right-button-up"
	});
	toButton(gpsRightButtonUp);
	
	var gpsMenu = $('<div />', {
		"class": "gps-menu"
	});
	toButton(gpsMenu);
	
	var gpsEnter = $('<div />', {
		"class": "gps-enter"
	});
	toButton(gpsEnter);
	
	var gpsRightButtonDown = $('<div />', {
		"class": "gps-right-button-down"
	});
	toButton(gpsRightButtonDown);
	
	// State for gps turned on
	function onState() {
		// set up coords
		var text = "";
		if($.isNumeric(valueCoordNorth)) {
			text += parseFloat(valueCoordNorth).toFixed(3);
		} else {
			text += "0.000";
		}
		text += " N<br />";
		if($.isNumeric(valueCoordEast)) {
			text += parseFloat(valueCoordEast).toFixed(3);
		} else {
			text += "0.000";
		}
		text += " E<br />";
		gpsDisplayCoords.html(text);
		
		// set up course
		gpsDisplayCourse.html("COG: " + valueCourse.toFixed(1) + "&deg;<br />SOG: " + valueSpeed.toFixed(1) + " kn");
		
		gpsPWR.css("background-image", "url('../image/button/power-on.png')");
	}
	
	// State for gps turned off
	function offState() {
		gpsDisplayCoords.html("");
		gpsDisplayCourse.html("");

		gpsPWR.css("background-image", "url('../image/button/power-off.png')");
	}
	
	// State for nav turned on
	function navOnState() {
		gpsRightNav.css("background-image", "url('../image/button/nav-on.png')");
	}
	
	// State for nav turned off
	function navOffState() {
		gpsRightNav.css("background-image", "url('../image/button/nav-off.png')");
	}
	
	var refresh = function() {
		if(pwr)
			onState();
		else
			offState();
		
		if(nav && pwr)
			navOnState();
		else
			navOffState();
	}
	
	// Event on click
	gpsPWR.click(function() {
		pwr = !pwr;
		refresh();
	});
	gpsRightNav.click(function() {
		nav = !nav;
		refresh();
	});
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-coord-north") {
			valueCoordNorth = data.value;
		}
		if(data.name == id + "-coord-east") {
			valueCoordEast = data.value;
		}
		if(data.name == id + "-course") {
			valueCourse = data.value;
		}
		if(data.name == id + "-speed") {
			valueSpeed = data.value;
		}
		refresh();
	});
	
	container.append(gps);
	gps.append(gpsBackground);
	gpsBackground.append(gpsPWR);
	gpsBackground.append(gpsDisplay);
	gpsDisplay.append(gpsDisplayCoords);
	gpsDisplay.append(gpsDisplayCourse);
	gpsBackground.append(gpsRight);
	gpsRight.append(gpsRightNav);
	gpsRight.append(gpsRightButtonUp);
	gpsBackground.append(gpsMenu);
	gpsBackground.append(gpsEnter);
	gpsBackground.append(gpsRightButtonDown);
	
	refresh();
}


/**
 * Shows a log
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 * @param {float} valueSpeed - OPTIONAL: Defines the start value of the speed value
 * @param {float} valueTrip - OPTIONAL: Defines the start value of the trip value
 **/
function showLog(id, width, style, valueSpeed, valueTrip) {
	
	// additional parameter
	var pwr = false;
	
	// root element
	var container = $('#container');
	
	// Check for OPTIONAL value or SERVER value
	if(!$.isNumeric(valueSpeed)) {
		// 	Maybe there is a SERVER value
		update(id + '-speed');
		valueSpeed = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-speed', valueSpeed);
	}
	if(!$.isNumeric(valueTrip)) {
		// 	Maybe there is a SERVER value
		update(id + '-trip');
		valueTrip = 0.0;
	} else {
		// There is an OPTIONAL value set for this element
		updateValue(id + '-trip', valueTrip);
	}
	
	var log = $('<div />', {
		"class": "log",
		"style": "width:" + width + "px;" + style
	});
	
	var logBackground = $('<div />', {
		"class": "log-background",
		"style": "height:" + (width * 0.50) + "px;"
	});
	
	var logPWR = $('<div />', {
		"class": "log-pwr"
	});

	var logDisplay = $('<div />', {
		"class": "log-display"
	});
	
	var logDisplaySpeedLable = $('<div />', {
		"class": "log-display-speed-lable",
		text: "SPEED"
	});
	
	var logDisplaySpeedValue = $('<div />', {
		"class": "log-display-speed-value",
		text: "8.5 kn"
	});
	
	var logDisplayTripLable = $('<div />', {
		"class": "log-display-trip-lable",
		text: "TRIP"
	});
	
	var logDisplayTripValue = $('<div />', {
		"class": "log-display-trip-value",
		text: "45.6 sm"
	});
	
	// State for log turned on
	function onState() {
		logDisplaySpeedLable.text("SPEED");
		logDisplaySpeedValue.text(valueSpeed.toFixed(1) + " kn");
		logDisplayTripLable.text("TRIP");
		logDisplayTripValue.text(valueTrip.toFixed(1) + " sm");
		
		logPWR.css("background-image", "url('../image/button/power-on.png')");
	}
	
	// State for log turned off
	function offState() {
		logDisplaySpeedLable.text("");
		logDisplaySpeedValue.text("");
		logDisplayTripLable.text("");
		logDisplayTripValue.text("");

		logPWR.css("background-image", "url('../image/button/power-off.png')");
	}

	var refresh = function() {
		if(pwr)
			onState();
		else
			offState();
	}
	
	// Event on click
	logPWR.click(function() {
		pwr = !pwr;
		refresh()
	});
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-speed") {
			valueSpeed = data.value;
		}
		if(data.name == id + "-trip") {
			valueTrip = data.value;
		}
		refresh();
	});
	
	container.append(log);
	log.append(logBackground);
	logBackground.append(logPWR);
	logBackground.append(logDisplay);
	logDisplay.append(logDisplaySpeedLable);
	logDisplay.append(logDisplaySpeedValue);
	logDisplay.append(logDisplayTripLable);
	logDisplay.append(logDisplayTripValue);
	
	refresh();
}


/**
 * Shows a light signals front
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 **/
function showLightSignalsFront(id, width, style) {
	
	// additional information
	var green = false;
	var white = false;
	
	// root container
	var container = $('#container');
	
	// get SERVER values
	update(id + '-green');
	update(id + '-white');
	
	var lightSignalsFront = $('<div />', {
		"class": "light-signals-front",
		"style": "width:" + width + "px;" + style
	});
	
	var lightSignalsFrontBackground = $('<div />', {
		"class": "light-signals-front-background"
	});
	
	var lightSignalsFrontGreen = $('<div />', {
		"class": "light-signals-front-green"
	});
	
	var lightSignalsFrontWhite = $('<div />', {
		"class": "light-signals-front-white"
	});
	
	// Event on click
	lightSignalsFrontGreen.click(function() {
		green = !green;
		updateValue(id + '-green', green);
		refresh()
	});
	lightSignalsFrontWhite.click(function() {
		white = !white;
		updateValue(id + '-white', white);
		refresh()
	});
	
	var refresh = function() {
		if(green)
			lightSignalsFrontGreen.css("background-image", "url('../image/button/green-on.png')");
		else
			lightSignalsFrontGreen.css("background-image", "url('../image/button/green-off.png')");
		
		if(white)
			lightSignalsFrontWhite.css("background-image", "url('../image/button/white-on.png')");
		else
			lightSignalsFrontWhite.css("background-image", "url('../image/button/white-off.png')");
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-green") {
			green = data.value;
		}
		if(data.name == id + "-white") {
			white = data.value;
		}
		refresh();
	});
	
	container.append(lightSignalsFront);
	lightSignalsFront.append(lightSignalsFrontBackground);
	lightSignalsFrontBackground.append(lightSignalsFrontGreen);
	lightSignalsFrontBackground.append(lightSignalsFrontWhite);
	
	refresh();
}


/**
 * Shows a light overview
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 **/
function showLightOverview(id, width, style) {
	
	// additional parameter
	var top = false;
	var bb = false;
	var stb = false;
	var anchor = false;
	var stern = false;
	
	// root container
	var container = $('#container');
	
	// get SERVER values
	update(id + '-top');
	update(id + '-bb');
	update(id + '-stb');
	update(id + '-anchor');
	update(id + '-false');
	
	var lightOverview = $('<div />', {
		"class": "light-overview",
		"style": "width:" + width + "px;" + style
	});
	
	var lightOverviewBackground = $('<div />', {
		"class": "light-overview-background"
	});
	
	var lightOverviewTop = $('<div />', {
		"class": "light-overview-top"
	});
	
	var lightOverviewBB = $('<div />', {
		"class": "light-overview-bb"
	});
	
	var lightOverviewSTB = $('<div />', {
		"class": "light-overview-stb"
	});
	
	var lightOverviewAnchor = $('<div />', {
		"class": "light-overview-anchor"
	});

	var lightOverviewStern = $('<div />', {
		"class": "light-overview-stern"
	});
	
	// Event on click
	lightOverviewTop.click(function() {
		top = !top;
		updateValue(id + '-top', top);
		refresh()
	});
	lightOverviewBB.click(function() {
		bb = !bb;
		updateValue(id + '-bb', bb);
		refresh()
	});
	lightOverviewSTB.click(function() {
		stb = !stb;
		updateValue(id + '-stb', stb);
		refresh()
	});
	lightOverviewAnchor.click(function() {
		anchor = !anchor;
		updateValue(id + '-anchor', anchor);
		refresh()
	});
	lightOverviewStern.click(function() {
		stern = !stern;
		updateValue(id + '-stern', stern);
		refresh()
	});

	var refresh = function() {
		if(top)
			lightOverviewTop.css("background-image", "url('../image/button/top-on.png')");
		else
			lightOverviewTop.css("background-image", "url('../image/button/top-off.png')");
		
		if(bb)
			lightOverviewBB.css("background-image", "url('../image/button/bb-on.png')");
		else
			lightOverviewBB.css("background-image", "url('../image/button/bb-off.png')");
		
		if(stb)
			lightOverviewSTB.css("background-image", "url('../image/button/stb-on.png')");
		else
			lightOverviewSTB.css("background-image", "url('../image/button/stb-off.png')");
		
		if(anchor)
			lightOverviewAnchor.css("background-image", "url('../image/button/anchor-on.png')");
		else
			lightOverviewAnchor.css("background-image", "url('../image/button/anchor-off.png')");
		
		if(stern)
			lightOverviewStern.css("background-image", "url('../image/button/stern-on.png')");
		else
			lightOverviewStern.css("background-image", "url('../image/button/stern-off.png')");
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-top") {
			top = data.value;
		}
		if(data.name == id + "-bb") {
			bb = data.value;
		}
		if(data.name == id + "-stb") {
			stb = data.value;
		}
		if(data.name == id + "-anchor") {
			anchor = data.value;
		}
		if(data.name == id + "-stern") {
			stern = data.value;
		}
		refresh();
	});
	
	container.append(lightOverview);
	lightOverview.append(lightOverviewBackground);
	lightOverviewBackground.append(lightOverviewTop);
	lightOverviewBackground.append(lightOverviewBB);
	lightOverviewBackground.append(lightOverviewSTB);
	lightOverviewBackground.append(lightOverviewAnchor);
	lightOverviewBackground.append(lightOverviewStern);
	
	refresh();
}


/**
 * Shows a light signals stb
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 **/
function showLightSignalsStb(id, width, style) {
	
	// additional parameter
	var red = false;
	var white = false;
	var red2 = false;
	
	// root container
	var container = $('#container');
	
	// get SERVER values
	update(id + '-red');
	update(id + '-white');
	update(id + '-red2');
	
	var lightSignalsStb = $('<div />', {
		"class": "light-signals-stb",
		"style": "width:" + width + "px;" + style
	});
	
	var lightSignalsStbBackground = $('<div />', {
		"class": "light-signals-stb-background"
	});
	
	var lightSignalsStbRed = $('<div />', {
		"class": "light-signals-stb-red"
	});
	
	var lightSignalsStbWhite = $('<div />', {
		"class": "light-signals-stb-white"
	});
	
	var lightSignalsStbRed2 = $('<div />', {
		"class": "light-signals-stb-red"
	});
	
	// Event on click
	lightSignalsStbRed.click(function() {
		red = !red;
		updateValue(id + '-red', red);
		refresh()
	});
	lightSignalsStbWhite.click(function() {
		white = !white;
		updateValue(id + '-white', white);
		refresh()
	});
	lightSignalsStbRed2.click(function() {
		red2 = !red2;
		updateValue(id + '-red2', red2);
		refresh()
	});

	var refresh = function() {
		if(red)
			lightSignalsStbRed.css("background-image", "url('../image/button/red-on.png')");
		else
			lightSignalsStbRed.css("background-image", "url('../image/button/red-off.png')");
		
		if(white)
			lightSignalsStbWhite.css("background-image", "url('../image/button/white-on.png')");
		else
			lightSignalsStbWhite.css("background-image", "url('../image/button/white-off.png')");
		
		if(red2)
			lightSignalsStbRed2.css("background-image", "url('../image/button/red-on.png')");
		else
			lightSignalsStbRed2.css("background-image", "url('../image/button/red-off.png')");
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id + "-red") {
			red = data.value;
		}
		if(data.name == id + "-white") {
			white = data.value;
		}
		if(data.name == id + "-red2") {
			red2 = data.value;
		}
		refresh();
	});
	
	container.append(lightSignalsStb);
	lightSignalsStb.append(lightSignalsStbBackground);
	lightSignalsStbBackground.append(lightSignalsStbRed);
	lightSignalsStbBackground.append(lightSignalsStbWhite);
	lightSignalsStbBackground.append(lightSignalsStbRed2);
	
	refresh();
}


/**
 * Shows an acknowledge-able master alarm button
 *
 * @param {string} id - An unique identification for this HTML-View-Element
 * @param {integer} width - Defines the width of this element (the height automatically scales with it)
 * @param {string} style - Additional CSS-style for this element
 **/
function showLightMaster(id, width, style) {
	
	// additional parameter
	var alarm = false;
	
	// root container
	var container = $('#container');
	
	// get SERVER values
	update(id);
	
	var lightMaster = $('<div />', {
		"class": "light-master",
		"style": "width:" + width + "px;" + style
	});
	
	var lightMasterBackground = $('<div />', {
		"class": "light-master-background"
	});
	
	var lightMasterAlarm = $('<div />', {
		"class": "light-master-alarm"
	});
	
	// Event on click
	lightMasterAlarm.click(function() {
		alarm = !alarm;
		updateValue(id, alarm);
		refresh();
	});
	
	var refresh = function() {
		if(alarm)
			lightMasterAlarm.css("background-image", "url('../image/button/alarm-on.png')");
		else
			lightMasterAlarm.css("background-image", "url('../image/button/alarm-off.png')");
	}
	
	// Function for socket call update
	socketUpdate.push(function(data) {
		if(data.name == id) {
			alarm = data.value;
		}
	});
	
	container.append(lightMaster);
	lightMaster.append(lightMasterBackground);
	lightMasterBackground.append(lightMasterAlarm);
	
	refresh();
}


/**
 *
 * SOCKET
 *
 **/
var socket = io.connect();
    
function update(name) {
    socket.emit( 'data', { name : name } );
}
    
function updateValue(name, value) {
	if(debug)
		console.log(name + " " + value);
    socket.emit( 'data', { name : name, value : value } );
}

socket.on('data', function (data) {
	if(debug)
    	console.log('The variable ' + data.name + ' has the value of ' + data.value);
    	
	for(var i=0; i < socketUpdate.length; i++) {
			
		socketUpdate[i](data);			
	}
});

/**
 * Shows ArUco Markers - Markers are stored in image/marker/
 *
 * @param {string} topLeftMarker - filename of marker-image for top-left marker
 * @param {string} topRightMarker - filename of marker-image for top-right marker
 * @param {string} bottomLeftMarker - filename of marker-image for bottom-left marker
 * @param {string} bottomRightMarker - filename of marker-image for bottom-right marker
 * @param {integer} size - marker size in pixels (width=height), default: 50
 **/
function showArUcoMarkers(topLeftMarker, topRightMarker, bottomLeftMarker, bottomRightMarker, size) {

	// set default marker size
	if(!$.isNumeric(size)) {
		size = 50;
	}

	// root container
	var container = $('#container');

	var topLeftMarkerDiv = $('<div />', {
		"class": "marker-top-left",
		"style": "background-image:url('./image/marker/" + topLeftMarker + "');width:" + size + "px;" + "height:"+ size + "px;"
	});
	var topRightMarkerDiv = $('<div />', {
		"class": "marker-top-right",
		"style": "background-image:url('./image/marker/" + topRightMarker + "');width:" + size + "px;" + "height:"+ size + "px;"
	});	
	var bottomLeftMarkerDiv = $('<div />', {
		"class": "marker-bottom-left",
		"style": "background-image:url('./image/marker/" + bottomLeftMarker + "');width:" + size + "px;" + "height:"+ size + "px;"
	});
	var bottomRightMarkerDiv = $('<div />', {
		"class": "marker-bottom-right",
		"style": "background-image:url('./image/marker/" + bottomRightMarker + "');width:" + size + "px;" + "height:"+ size + "px;"
	});

	container.append(topLeftMarkerDiv);
	container.append(topRightMarkerDiv);
	container.append(bottomLeftMarkerDiv);
	container.append(bottomRightMarkerDiv);
}

/**
 *
 * UTILITY
 *
 **/
function toButton(button) {
	
	// touch events
	button.bind('touchstart', function() {
		invertOn();
	});
	button.bind('touchend', function() {
		invertOff();
	});
	
	// mouse events
	button.on("mousedown", function() {
		invertOn();
	});
	button.on("mouseup", function() {
		invertOff();
	});
	
	function invertOn() {
		button.css("filter", "invert(70%)");
		button.css("-webkit-filter", "invert(70%)");
	}
	
	function invertOff() {
		button.css("filter", "invert(0%)");
		button.css("-webkit-filter", "invert(0%)");
	}
}


/*
 * Source
 * http://stackoverflow.com/questions/15191058/css-rotation-cross-browser-with-jquery-animate
 * Author: yckart
 */
$.fn.animateRotate = function(startAngle, angle, duration, easing, complete) {
  var args = $.speed(duration, easing, complete);
  var step = args.step;
  return this.each(function(i, e) {
  
    args.complete = $.proxy(args.complete, e);
    args.step = function(now) {
      $.style(e, 'transform', 'rotate(' + now + 'deg)');
      if (step) return step.apply(e, arguments);
    };

    $({deg: startAngle}).animate({deg: angle}, args);
  });
};
