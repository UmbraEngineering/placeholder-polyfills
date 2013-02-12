// 
// HTML5 Placeholder Polyfill
// 
// Works in IE7+
// 

(function(window, document) {

	// Define the namespace for the polyfill
	var ns = window.placeholderPolyfill = { };

	// Check if we need to polyfill placeholders
	ns.nativeSupport = ('placeholder' in document.createElement('input'));

	// If placeholders are natively supported, we're all done here
	if (ns.nativeSupport) {return;}

	// Reused strings
	var polyfilledAttr = 'data-placeholder-polyfilled';
	var placeholderVisibleAttr = 'data-placeholder-visible';
	var placeholderClassName = '-polyfill-placeholder';

	// These should stay dynamically up-to-date throughout the lifespan of the app
	var inputs = document.getElementsByTagName('input');
	var textareas = document.getElementsByTagName('textarea');

	// Define the main polyfill method
	ns.run = function(elems) {
		elems = elems ? ns.getAllInputs(elems) : ns.getAllInputs(inputs).concat(ns.getAllInputs(textareas));

		// Run through the elements in the list and polyfill the placeholder
		for (var i = 0, c = elems.length; i < c; i++) {
			var elem = elems[i];

			// If this element has already been polyfilled, we can skip this one
			if (elem.getAttribute(polyfilledAttr)) {continue;}

			// Polyfill various elements by type
			if (elem.tagName.toLowerCase() === 'textarea') {
				ns.polyfillTextarea(elem);
			} else if (elem.type === 'text') {
				ns.polyfillTextInput(elem);
			} else if (elem.type === 'password') {
				ns.polyfillPasswordInput(elem);
			}

			// Set a flag on the element so we know it has been polyfilled
			elem.setAttribute(polyfilledAttr, 'yes');
		}
	};

	// Get an array of all inputs/textareas in the given enumerable that should
	// support placeholder
	ns.getAllInputs = function(elems) {
		var result = [ ];

		if (elems.nodeType === 1) {
			if (ns.isSupportedInput(elems)) {
				return [elems];
			}
			elems = ns.getAllInputs(elems.getElementsByTagName('input')).concat(
				ns.getAllInputs(elems.getElementsByTagName('textarea'))
			);
		}

		for (var i = 0, c = elems.length; i < c; i++) {
			if (ns.isSupportedInput(elems[i])) {
				result.push(elems[i]);
			}
		}

		return result;
	};

	// Checks if a given object is an input/textarea that should support placeholder
	ns.isSupportedInput = function(elem) {
		if (elem && typeof elem === 'object' && elem.nodeType === 1) {
			var tag = elem.tagName.toLowerCase();
			return (
				tag === 'textarea' || (tag === 'input' && (elem.type === 'text' || elem.type === 'password'))
			);
		}
		return false;
	};

	// Polyfill the placeholder attribute for textarea elements
	ns.polyfillTextarea = function(elem) {
		// Start by showing the placeholder
		showPlaceholder();

		// Bind DOM events for interactivity
		events.bind(elem, 'blur', showPlaceholder);
		events.bind(elem, 'focus', hidePlaceholder);

		// Show the placeholder if needed
		function showPlaceholder() {
			if (! elem.value) {
				elem.value = elem.getAttribute('placeholder');
				elem.setAttribute(placeholderVisibleAttr, 'yes');
				classes.add(elem, placeholderClassName);
			}
		}

		// Hide the placeholder if needed
		function hidePlaceholder() {
			if (elem.getAttribute(placeholderVisibleAttr) === 'yes') {
				elem.setAttribute(placeholderVisibleAttr, 'no');
				elem.value = '';
				classes.remove(elem, placeholderClassName);
			}
		}
	};

	// Polyfill the placeholder attribute for text input elements
	ns.polyfillTextInput = function(elem) {
		// Start by showing the placeholder
		showPlaceholder();

		// Bind DOM events for interactivity
		events.bind(elem, 'blur', showPlaceholder);
		events.bind(elem, 'focus', hidePlaceholder);

		// Show the placeholder if needed
		function showPlaceholder() {
			if (! elem.value) {
				elem.value = elem.getAttribute('placeholder');
				elem.setAttribute(placeholderVisibleAttr, 'yes');
				classes.add(elem, placeholderClassName);
			}
		}

		// Hide the placeholder if needed
		function hidePlaceholder() {
			if (elem.getAttribute(placeholderVisibleAttr) === 'yes') {
				elem.setAttribute(placeholderVisibleAttr, 'no');
				elem.value = '';
				classes.remove(elem, placeholderClassName);
			}
		}
	};

// ------------------------------------------------------------------
	
	// Create a namespace to store event functions
	var events = { };

	// Binds a DOM event
	events.bind = function(obj, event, func) {
		if (obj.addEventListener) {
			obj.addEventListener(event, func, false);
		} else {
			obj.attachEvent('on' + event, func);
		}
	};

	// Unbinds a DOM event
	events.unbind = function(obj, event, func) {
		if (obj.removeEventListener) {
			obj.removeEventListener(event, func, false);
		} else {
			obj.detachEvent('on' + event, func);
		}
	};

// ------------------------------------------------------------------
	
	// Create a namespace to store class name functions
	var classes = { };

	// We store cached regular expressions here to speed up tests
	classes.regexes = { };

	// Returns a regular expression for the given class name
	classes.regex = function(cn) {
		if (! classes.regexes[cn]) {
			classes.regexes[cn] = new RegExp('(^|\s)+' + cn + '(\s|$)+');
		}

		return classes.regexes[cn];
	};

	// Check if a given element has a given class name
	classes.has = function(elem, cn) {
		return classes.regex(cn).test(elem.className);
	};

	// Add a class name to an element
	classes.add = function(elem, cn) {
		var len = elem.className.length;
		elem.className += (len ? ' ' : '') + cn;
	};

	// Remove a class name from an element
	classes.remove = function(elem, cn) {
		elem.className = elem.className.replace(classes.regex(cn), ' ');
		classes.cleanup(elem);
	};

	// A regular expression that selects blocks of whitespace
	classes.whitespace = /\s+/;

	// Clean up an elements class name by collapsing whitespace blocks
	classes.cleanup = function(elem) {
		elem.className = elem.className.replace(classes.whitespace, ' ');
	};

}(window, document));
