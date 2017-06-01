'use strict';

var Prism = require('prismjs');
if (
	(typeof self === 'undefined' || !self.Prism) &&
	(typeof global === 'undefined' || !global.Prism)
) {
	return;
}

var options = {};
Prism.plugins.customClass = {
	map: function map(cm) {
		options.classMap = cm;
	},
	prefix: function prefix(string) {
		options.prefixString = string;
	}
}

Prism.hooks.add('wrap', function (env) {
	if (!options.classMap && !options.prefixString) {
		return;
	}
	env.classes = env.classes.map(function(c) {
		return (options.prefixString || '') + (options.classMap[c] || c);
	});
});

Prism.plugins.customClass.map({});
Prism.plugins.customClass.prefix('prism-');

/**
 * Global `fabricator` object
 * @namespace
 */
var fabricator = window.fabricator = {};


/**
 * Default options
 * @type {Object}
 */
fabricator.options = {
  toggles: {
    labels: true,
    notes: true,
    code: false
  },
  menu: false,
  mq: '(min-width: 60em)'
};

// open menu by default if large screen
fabricator.options.menu = window.matchMedia(fabricator.options.mq).matches;

/**
 * Feature detection
 * @type {Object}
 */
fabricator.test = {};

// test for sessionStorage
fabricator.test.sessionStorage = (function () {
  var test = '_f';
  try {
    sessionStorage.setItem(test, test);
    sessionStorage.removeItem(test);
    return true;
  } catch(e) {
    return false;
  }
}());

// create storage object if it doesn't exist; store options
if (fabricator.test.sessionStorage) {
  sessionStorage.fabricator = sessionStorage.fabricator || JSON.stringify(fabricator.options);
}


/**
 * Cache DOM
 * @type {Object}
 */
fabricator.dom = {
  root: document.querySelector('html'),
  primaryMenu: document.querySelector('.styleguide-menu'),
  menuItems: document.querySelectorAll('.styleguide-menu li a'),
  menuToggle: document.querySelector('.styleguide-menu-toggle')
};


/**
 * Get current option values from session storage
 * @return {Object}
 */
fabricator.getOptions = function () {
  return (fabricator.test.sessionStorage) ? JSON.parse(sessionStorage.fabricator) : fabricator.options;
};


/**
 * Build color chips
 */
fabricator.buildColorChips = function () {

  var chips = document.querySelectorAll('.styleguide-color-chip'),
    color;

  for (var i = chips.length - 1; i >= 0; i--) {
    color = chips[i].querySelector('.styleguide-color-chip__color').innerHTML;
    chips[i].style.borderTopColor = color;
    chips[i].style.borderBottomColor = color;
  }

  return this;

};


/**
 * Add `styleguide-active` class to active menu item
 */
fabricator.setActiveItem = function () {

  /**
   * Match the window location with the menu item, set menu item as active
   */
  var setActive = function () {

    // get current file and hash without first slash
    var current = (window.location.pathname + window.location.hash).replace(/(^\/)([^#]+)?(#[\w\-\.]+)?$/ig, function (match, slash, file, hash) {
          hash = hash || '';
          file = file || '';
          return file + hash.split('.')[0];
      }) || 'index.html',
      href;

    // find the current section in the items array
    for (var i = fabricator.dom.menuItems.length - 1; i >= 0; i--) {

      var item = fabricator.dom.menuItems[i];

      // get item href without first slash
      href = item.getAttribute('href').replace(/^\//g, '');

      if (href === current) {
        item.classList.add('styleguide-active');
      } else {
        item.classList.remove('styleguide-active');
      }

    }

  };

  window.addEventListener('hashchange', setActive);

  setActive();

  return this;

};


/**
 * Click handler to primary menu toggle
 * @return {Object} fabricator
 */
fabricator.menuToggle = function () {

  // shortcut menu DOM
  var toggle = fabricator.dom.menuToggle;

  var options = fabricator.getOptions();

  // toggle classes on certain elements
  var toggleClasses = function () {
    options.menu = !fabricator.dom.root.classList.contains('styleguide-menu-active');
    fabricator.dom.root.classList.toggle('styleguide-menu-active');

    if (fabricator.test.sessionStorage) {
      sessionStorage.setItem('fabricator', JSON.stringify(options));
    }
  };

  // toggle classes on ctrl + m press
  document.onkeydown = function (e) {
    e = e || event
    if (e.ctrlKey && e.keyCode == 'M'.charCodeAt(0)) {
      toggleClasses();
    }
  }

  // toggle classes on click
  toggle.addEventListener('click', function () {
    toggleClasses();
  });

  // close menu when clicking on item (for collapsed menu view)
  var closeMenu = function () {
    if (!window.matchMedia(fabricator.options.mq).matches) {
      toggleClasses();
    }
  };

  for (var i = 0; i < fabricator.dom.menuItems.length; i++) {
    fabricator.dom.menuItems[i].addEventListener('click', closeMenu);
  }

  return this;

};


/**
 * Handler for preview and code toggles
 * @return {Object} fabricator
 */
fabricator.allItemsToggles = function () {

  var items = {
    labels: document.querySelectorAll('[data-styleguide-toggle="labels"]'),
    notes: document.querySelectorAll('[data-styleguide-toggle="notes"]'),
    code: document.querySelectorAll('[data-styleguide-toggle="code"]')
  };

  var toggleAllControls = document.querySelectorAll('.styleguide-controls [data-styleguide-toggle-control]');

  var options = fabricator.getOptions();

  // toggle all
  var toggleAllItems = function (type, value) {

    var button = document.querySelector('.styleguide-controls [data-styleguide-toggle-control=' + type + ']'),
      _items = items[type];

    for (var i = 0; i < _items.length; i++) {
      if (value) {
        _items[i].classList.remove('styleguide-item-hidden');
      } else {
        _items[i].classList.add('styleguide-item-hidden');
      }
    }

    // toggle styles
    if (value) {
      button.classList.add('styleguide-active');
    } else {
      button.classList.remove('styleguide-active');
    }

    // update options
    options.toggles[type] = value;

    if (fabricator.test.sessionStorage) {
      sessionStorage.setItem('fabricator', JSON.stringify(options));
    }

  };

  for (var i = 0; i < toggleAllControls.length; i++) {

    toggleAllControls[i].addEventListener('click', function (e) {

      // extract info from target node
      var type = e.currentTarget.getAttribute('data-styleguide-toggle-control'),
        value = e.currentTarget.className.indexOf('styleguide-active') < 0;

      // toggle the items
      toggleAllItems(type, value);

    });

  }

  // persist toggle options from page to page
  for (var toggle in options.toggles) {
    if (options.toggles.hasOwnProperty(toggle)) {
      toggleAllItems(toggle, options.toggles[toggle]);
    }
  }

  return this;

};


/**
 * Handler for single item code toggling
 */
fabricator.singleItemToggle = function () {

  var itemToggleSingle = document.querySelectorAll('.styleguide-item-group [data-styleguide-toggle-control]');

  // toggle single
  var toggleSingleItemCode = function (e) {
    var group = this.parentNode.parentNode.parentNode,
      type = e.currentTarget.getAttribute('data-styleguide-toggle-control');

    var elements = group.querySelectorAll('[data-styleguide-toggle=' + type + ']');

    for (var i = 0; i < elements.length; i++) {
      elements[i].classList.toggle('styleguide-item-hidden');
    }
  };

  for (var i = 0; i < itemToggleSingle.length; i++) {
    itemToggleSingle[i].addEventListener('click', toggleSingleItemCode);
  }

  return this;

};


/**
 * Automatically select code when code block is clicked
 */
fabricator.bindCodeAutoSelect = function () {

  var codeBlocks = document.querySelectorAll('.styleguide-item-code');

  var select = function (block) {
    var selection = window.getSelection();
    var range = document.createRange();
    range.selectNodeContents(block.querySelector('code'));
    selection.removeAllRanges();
    selection.addRange(range);
  };

  for (var i = codeBlocks.length - 1; i >= 0; i--) {
    codeBlocks[i].addEventListener('click', select.bind(this, codeBlocks[i]));
  }

};


/**
 * Open/Close menu based on session var.
 * Also attach a media query listener to close the menu when resizing to smaller screen.
 */
fabricator.setInitialMenuState = function () {

  // root element
  var root = document.querySelector('html');

  var mq = window.matchMedia(fabricator.options.mq);

  // if small screen
  var mediaChangeHandler = function (list) {
    if (!list.matches) {
      root.classList.remove('styleguide-menu-active');
    } else {
      if (fabricator.getOptions().menu) {
        root.classList.add('styleguide-menu-active');
      } else {
        root.classList.remove('styleguide-menu-active');
      }
    }
  };

  mq.addListener(mediaChangeHandler);
  mediaChangeHandler(mq);

  return this;

};

/**
 * Open/Close menu based on session var.
 * Also attach a media query listener to close the menu when resizing to smaller screen.
 */
fabricator.menuCollapse = function () {

  var toggle = document.querySelector('.styleguide-collapse');

  var mq = window.matchMedia(fabricator.options.mq);

  // if small screen
  var mediaChangeHandler = function (list) {
    if (!list.matches) {
      root.classList.remove('styleguide-menu-active');
    } else {
      if (fabricator.getOptions().menu) {
        root.classList.add('styleguide-menu-active');
      } else {
        root.classList.remove('styleguide-menu-active');
      }
    }
  };

  mq.addListener(mediaChangeHandler);
  mediaChangeHandler(mq);

  return this;

};


/**
 * Initialization
 */
(function () {

  // invoke
  fabricator
    .setInitialMenuState()
    .menuToggle()
    .allItemsToggles()
    .singleItemToggle()
    .buildColorChips()
    .setActiveItem()
    .bindCodeAutoSelect();

}());
