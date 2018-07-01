/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, { enumerable: true, get: getter });
/******/ 		}
/******/ 	};
/******/
/******/ 	// define __esModule on exports
/******/ 	__webpack_require__.r = function(exports) {
/******/ 		if(typeof Symbol !== 'undefined' && Symbol.toStringTag) {
/******/ 			Object.defineProperty(exports, Symbol.toStringTag, { value: 'Module' });
/******/ 		}
/******/ 		Object.defineProperty(exports, '__esModule', { value: true });
/******/ 	};
/******/
/******/ 	// create a fake namespace object
/******/ 	// mode & 1: value is a module id, require it
/******/ 	// mode & 2: merge all properties of value into the ns
/******/ 	// mode & 4: return value when already ns object
/******/ 	// mode & 8|1: behave like require
/******/ 	__webpack_require__.t = function(value, mode) {
/******/ 		if(mode & 1) value = __webpack_require__(value);
/******/ 		if(mode & 8) return value;
/******/ 		if((mode & 4) && typeof value === 'object' && value && value.__esModule) return value;
/******/ 		var ns = Object.create(null);
/******/ 		__webpack_require__.r(ns);
/******/ 		Object.defineProperty(ns, 'default', { enumerable: true, value: value });
/******/ 		if(mode & 2 && typeof value != 'string') for(var key in value) __webpack_require__.d(ns, key, function(key) { return value[key]; }.bind(null, key));
/******/ 		return ns;
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = "./src/index.ts");
/******/ })
/************************************************************************/
/******/ ({

/***/ "./node_modules/node-libs-browser/node_modules/events/events.js":
/*!**********************************************************************!*\
  !*** ./node_modules/node-libs-browser/node_modules/events/events.js ***!
  \**********************************************************************/
/*! no static exports found */
/***/ (function(module, exports) {

// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.

function EventEmitter() {
  this._events = this._events || {};
  this._maxListeners = this._maxListeners || undefined;
}
module.exports = EventEmitter;

// Backwards-compat with node 0.10.x
EventEmitter.EventEmitter = EventEmitter;

EventEmitter.prototype._events = undefined;
EventEmitter.prototype._maxListeners = undefined;

// By default EventEmitters will print a warning if more than 10 listeners are
// added to it. This is a useful default which helps finding memory leaks.
EventEmitter.defaultMaxListeners = 10;

// Obviously not all Emitters should be limited to 10. This function allows
// that to be increased. Set to zero for unlimited.
EventEmitter.prototype.setMaxListeners = function(n) {
  if (!isNumber(n) || n < 0 || isNaN(n))
    throw TypeError('n must be a positive number');
  this._maxListeners = n;
  return this;
};

EventEmitter.prototype.emit = function(type) {
  var er, handler, len, args, i, listeners;

  if (!this._events)
    this._events = {};

  // If there is no 'error' event listener then throw.
  if (type === 'error') {
    if (!this._events.error ||
        (isObject(this._events.error) && !this._events.error.length)) {
      er = arguments[1];
      if (er instanceof Error) {
        throw er; // Unhandled 'error' event
      } else {
        // At least give some kind of context to the user
        var err = new Error('Uncaught, unspecified "error" event. (' + er + ')');
        err.context = er;
        throw err;
      }
    }
  }

  handler = this._events[type];

  if (isUndefined(handler))
    return false;

  if (isFunction(handler)) {
    switch (arguments.length) {
      // fast cases
      case 1:
        handler.call(this);
        break;
      case 2:
        handler.call(this, arguments[1]);
        break;
      case 3:
        handler.call(this, arguments[1], arguments[2]);
        break;
      // slower
      default:
        args = Array.prototype.slice.call(arguments, 1);
        handler.apply(this, args);
    }
  } else if (isObject(handler)) {
    args = Array.prototype.slice.call(arguments, 1);
    listeners = handler.slice();
    len = listeners.length;
    for (i = 0; i < len; i++)
      listeners[i].apply(this, args);
  }

  return true;
};

EventEmitter.prototype.addListener = function(type, listener) {
  var m;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events)
    this._events = {};

  // To avoid recursion in the case that type === "newListener"! Before
  // adding it to the listeners, first emit "newListener".
  if (this._events.newListener)
    this.emit('newListener', type,
              isFunction(listener.listener) ?
              listener.listener : listener);

  if (!this._events[type])
    // Optimize the case of one listener. Don't need the extra array object.
    this._events[type] = listener;
  else if (isObject(this._events[type]))
    // If we've already got an array, just append.
    this._events[type].push(listener);
  else
    // Adding the second element, need to change to array.
    this._events[type] = [this._events[type], listener];

  // Check for listener leak
  if (isObject(this._events[type]) && !this._events[type].warned) {
    if (!isUndefined(this._maxListeners)) {
      m = this._maxListeners;
    } else {
      m = EventEmitter.defaultMaxListeners;
    }

    if (m && m > 0 && this._events[type].length > m) {
      this._events[type].warned = true;
      console.error('(node) warning: possible EventEmitter memory ' +
                    'leak detected. %d listeners added. ' +
                    'Use emitter.setMaxListeners() to increase limit.',
                    this._events[type].length);
      if (typeof console.trace === 'function') {
        // not supported in IE 10
        console.trace();
      }
    }
  }

  return this;
};

EventEmitter.prototype.on = EventEmitter.prototype.addListener;

EventEmitter.prototype.once = function(type, listener) {
  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  var fired = false;

  function g() {
    this.removeListener(type, g);

    if (!fired) {
      fired = true;
      listener.apply(this, arguments);
    }
  }

  g.listener = listener;
  this.on(type, g);

  return this;
};

// emits a 'removeListener' event iff the listener was removed
EventEmitter.prototype.removeListener = function(type, listener) {
  var list, position, length, i;

  if (!isFunction(listener))
    throw TypeError('listener must be a function');

  if (!this._events || !this._events[type])
    return this;

  list = this._events[type];
  length = list.length;
  position = -1;

  if (list === listener ||
      (isFunction(list.listener) && list.listener === listener)) {
    delete this._events[type];
    if (this._events.removeListener)
      this.emit('removeListener', type, listener);

  } else if (isObject(list)) {
    for (i = length; i-- > 0;) {
      if (list[i] === listener ||
          (list[i].listener && list[i].listener === listener)) {
        position = i;
        break;
      }
    }

    if (position < 0)
      return this;

    if (list.length === 1) {
      list.length = 0;
      delete this._events[type];
    } else {
      list.splice(position, 1);
    }

    if (this._events.removeListener)
      this.emit('removeListener', type, listener);
  }

  return this;
};

EventEmitter.prototype.removeAllListeners = function(type) {
  var key, listeners;

  if (!this._events)
    return this;

  // not listening for removeListener, no need to emit
  if (!this._events.removeListener) {
    if (arguments.length === 0)
      this._events = {};
    else if (this._events[type])
      delete this._events[type];
    return this;
  }

  // emit removeListener for all listeners on all events
  if (arguments.length === 0) {
    for (key in this._events) {
      if (key === 'removeListener') continue;
      this.removeAllListeners(key);
    }
    this.removeAllListeners('removeListener');
    this._events = {};
    return this;
  }

  listeners = this._events[type];

  if (isFunction(listeners)) {
    this.removeListener(type, listeners);
  } else if (listeners) {
    // LIFO order
    while (listeners.length)
      this.removeListener(type, listeners[listeners.length - 1]);
  }
  delete this._events[type];

  return this;
};

EventEmitter.prototype.listeners = function(type) {
  var ret;
  if (!this._events || !this._events[type])
    ret = [];
  else if (isFunction(this._events[type]))
    ret = [this._events[type]];
  else
    ret = this._events[type].slice();
  return ret;
};

EventEmitter.prototype.listenerCount = function(type) {
  if (this._events) {
    var evlistener = this._events[type];

    if (isFunction(evlistener))
      return 1;
    else if (evlistener)
      return evlistener.length;
  }
  return 0;
};

EventEmitter.listenerCount = function(emitter, type) {
  return emitter.listenerCount(type);
};

function isFunction(arg) {
  return typeof arg === 'function';
}

function isNumber(arg) {
  return typeof arg === 'number';
}

function isObject(arg) {
  return typeof arg === 'object' && arg !== null;
}

function isUndefined(arg) {
  return arg === void 0;
}


/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const StateContainer_1 = __webpack_require__(/*! ./state_machine/StateContainer */ "./src/state_machine/StateContainer.ts");
exports.FSM = StateContainer_1.FSM;


/***/ }),

/***/ "./src/state_machine/State.ts":
/*!************************************!*\
  !*** ./src/state_machine/State.ts ***!
  \************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "./node_modules/node-libs-browser/node_modules/events/events.js");
/**
 * A class representing a state in a state machine
 */
class AbstractState extends events_1.EventEmitter {
    constructor(payload) {
        super();
        this.payload = payload;
        this.active = false; // Whether this state is currently active
        this.outgoingTransitions = []; // All of the transitions that leave this state
        this.incomingTransitions = []; // All of the transitions that enter this state
        /**
         * Called when a transition leaving this state was fired
         */
        this.onOutgoingTransitionFired = (transition, event, source) => {
            if (this.isActive()) {
                const toState = transition.getToState();
                // Need to set self to inactive *before* setting the other to active
                // in case it's a transition back to myself
                this.setIsActive(false);
                toState.setIsActive(true);
            }
            else {
                throw new Error('Received transition fired event while not active');
            }
        };
    }
    ;
    /**
     * Get the data attached to this state
     */
    getPayload() { return this.payload; }
    ;
    /**
     * Set the data attached to this state
     * @param payload The new payload
     */
    setPayload(payload) { this.payload = payload; }
    ;
    /**
     * Get all of the transitions leaving this state (should only be used internally)
     */
    _getOutgoingTransitions() { return this.outgoingTransitions; }
    ;
    /**
     * Get all of the transitions entering this state (should only be used internally)
     */
    _getIncomingTransitions() { return this.incomingTransitions; }
    ;
    /**
     * Mark a new transition as leaving from this state (should only be used internally)
     * @param transition The transition to add to the list of outgoing transitions
     */
    _addOutgoingTransition(transition) {
        this.outgoingTransitions.push(transition);
        if (this.isActive()) {
            transition.setEligible(true);
            transition.addListener('fire', this.onOutgoingTransitionFired);
        }
        else {
            transition.setEligible(false);
        }
    }
    ;
    /**
     * Remove a transition from the list of outgoing transitions
     * @param transition The transition to remove
     * @return true if the transition was removed; false otherwise
     */
    _removeOutgoingTransition(transition) {
        const index = this.outgoingTransitions.indexOf(transition);
        if (index >= 0) {
            this.outgoingTransitions.splice(index, 1);
            if (this.isActive()) {
                transition.setEligible(false);
                transition.removeListener('fire', this.onOutgoingTransitionFired);
            }
            return true;
        }
        else {
            return false;
        }
    }
    ;
    /**
     * Mark a new transition as going to this state (should only be used internally)
     * @param transition The transition to add to the list of incoming transitions
     */
    _addIncomingTransition(transition) {
        this.incomingTransitions.push(transition);
    }
    ;
    /**
     * Remove a transition from the list of incoming transitions
     * @param transition The transition to remove
     * @returns true if the transition was removed; false otherwise
     */
    _removeIncomingTransition(transition) {
        const index = this.incomingTransitions.indexOf(transition);
        if (index >= 0) {
            this.incomingTransitions.splice(index, 1);
            return true;
        }
        else {
            return false;
        }
    }
    ;
    /**
     * @return true if this state is active and false otherwise
     */
    isActive() { return this.active; }
    ;
    /**
     * Change whether this state is active or not
     * @param active Whether or not the state should be active
     */
    setIsActive(active) {
        this.active = active;
        if (this.isActive()) {
            this.addOutgoingTransitionListeners();
            this.emit('active', this);
        }
        else {
            this.removeOutgoingTransitionListeners();
            this.emit('not_active', this);
        }
    }
    ;
    /**
     * Enable outgoing transition listeners for when this state is active
     */
    addOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(true);
            ot.addListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    /**
     * Disable outgoing transition listeners for when this state is inactive
     */
    removeOutgoingTransitionListeners() {
        this.outgoingTransitions.forEach((ot) => {
            ot.setEligible(false);
            ot.removeListener('fire', this.onOutgoingTransitionFired);
        });
    }
    ;
    /**
     * Remove this state
     */
    remove() {
        this.removeOutgoingTransitionListeners();
        this.incomingTransitions.forEach((it) => it.remove());
        this.outgoingTransitions.forEach((ot) => ot.remove());
    }
    ;
}
exports.AbstractState = AbstractState;
;
/**
 * A class representing a starting state
 */
class StartState extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    /**
     * Adds an outgoing transition (only one allowed)
     * @param transition The transition to add
     */
    _addOutgoingTransition(transition) {
        if (this._getOutgoingTransitions().length > 0) {
            throw new Error('Can only have one outgoing transition from a start state');
        }
        else {
            super._addOutgoingTransition(transition);
        }
    }
    ;
    /**
     * Throws an exception; start states cannot have incoming transitions
     */
    _addIncomingTransition(transition) {
        throw new Error('Start states cannot have incoming transitions');
    }
    ;
    /**
     * @returns true (to represent that this is a start state)
     */
    isStartState() { return true; }
    ;
}
exports.StartState = StartState;
;
/**
 * A class to represent a "normal" state
 */
class State extends AbstractState {
    constructor(payload) {
        super(payload);
    }
    ;
    /**
     * @returns false (to represent that this is not a start state)
     */
    isStartState() { return false; }
    ;
}
exports.State = State;
;


/***/ }),

/***/ "./src/state_machine/StateContainer.ts":
/*!*********************************************!*\
  !*** ./src/state_machine/StateContainer.ts ***!
  \*********************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const State_1 = __webpack_require__(/*! ./State */ "./src/state_machine/State.ts");
const Transition_1 = __webpack_require__(/*! ./Transition */ "./src/state_machine/Transition.ts");
const events_1 = __webpack_require__(/*! events */ "./node_modules/node-libs-browser/node_modules/events/events.js");
const HashMap_1 = __webpack_require__(/*! ../utils/HashMap */ "./src/utils/HashMap.ts");
class StateContainer extends events_1.EventEmitter {
    /**
     * Create a new StateContainer
     * @param startStateName The label for the start state
     */
    constructor(startStateName = 'start') {
        super();
        this.states = new Map(); // States are indexed by name (string)
        this.stateLabels = new Map(); // Map back from states to labels
        this.transitions = new Map(); // Transitions are indexed by name too
        this.transitionLabels = new Map(); // Map back from transitions to labels
        /**
         * Called whenever a state is active
         */
        this.onStateActive = (state) => {
            this.activeState = state;
            this.emit('activeStateChanged', { state: this.getStateLabel(state) });
        };
        this.startState = this.activeState = new State_1.StartState();
        this.states.set(startStateName, this.startState);
        this.stateLabels.set(this.startState, startStateName);
        this.startState.setIsActive(true);
    }
    ;
    /**
     * Get the label of a state
     * @param state The AbstractState object we are searching for
     */
    getStateLabel(state) {
        return this.stateLabels.get(state);
    }
    ;
    /**
     * Check if a state is in this container
     * @param label The label of the state to check
     * @returns true if the state is in this container; false otherwise
     */
    hasState(label) { return this.states.has(label); }
    ;
    /**
     * Get the state object representing a given state
     * @param label The state to get
     * @returns the state object
     */
    getState(label) { return this.states.get(label); }
    ;
    /**
     * Get the payload of a given state
     * @param label The label of the state whose payload we are fetching
     * @returns The state's payload
     */
    getStatePayload(label) {
        if (this.hasState(label)) {
            return this.getState(label).getPayload();
        }
        else {
            throw new Error(`Could not find state with label ${label}`);
        }
    }
    ;
    /**
     * Set the payload of a given state
     * @param label The label of the  state whose payload we are modifying
     * @param payload The new payload
     */
    setStatePayload(label, payload) {
        if (this.hasState(label)) {
            this.getState(label).setPayload(payload);
            this.emit('statePayloadChanged', { state: label, payload });
            return this;
        }
        else {
            throw new Error(`Could not find state with label ${label}`);
        }
    }
    ;
    /**
     * Get a transition from its label
     * @param label The label for the transition
     * @returns the transition object
     */
    getTransition(label) { return this.transitions.get(label); }
    ;
    /**
     * Check if this container has a given transition
     * @param label The label of the transition
     * @returns true if this state machine has a transition with that label, false otherwise
     */
    hasTransition(label) { return this.transitions.has(label); }
    ;
    /**
     * Get the label of a transition
     * @param state The Transition object we are searching for
     */
    getTransitionLabel(transition) {
        return this.transitionLabels.get(transition);
    }
    ;
    /**
     * Get the payload of a given transition
     * @param label The label of the transition
     * @returns The payload for the transition
     */
    getTransitionPayload(label) {
        if (this.hasTransition(label)) {
            return this.getTransition(label).getPayload();
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Set the payload of a given transition
     * @param label The label of the transition
     * @param payload The new payload
     */
    setTransitionPayload(label, payload) {
        if (this.hasTransition(label)) {
            this.getTransition(label).setPayload(payload);
            this.emit('transitionPayloadChanged', { transition: label, payload });
            return this;
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Fire a transition by its label
     * @param label The label of the transition
     * @param event The content of the event
     * @param source Information about the source firing this transition
     */
    fireTransition(label, event, source) {
        if (this.hasTransition(label)) {
            const transition = this.getTransition(label);
            transition.fire(event, source);
            return this;
        }
        else {
            throw new Error(`Could not find transition ${label}`);
        }
    }
    ;
    /**
     * Creates a function that will fire a given transition when called
     * @param label The transition that we are getting a fire function for
     * @returns a function that will fire the given transition
     */
    getFireFunction(label) {
        return this.fireTransition.bind(this, label);
    }
    ;
    /**
     * Add a new state to this container
     * @param payload The payload of the new state
     * @param label (optional) the label of the new state; auto-generated if not given
     * @returns The new state's label
     */
    addState(payload, label = this.getUniqueStateLabel()) {
        if (this.hasState(label)) {
            throw new Error(`State container already has a state with label ${label}`);
        }
        else {
            const state = new State_1.State(payload);
            this.states.set(label, state);
            this.stateLabels.set(state, label);
            state.addListener('active', this.onStateActive);
            this.emit('stateAdded', { state: label, payload });
            return label;
        }
    }
    ;
    /**
     * Remove a state from the list of states
     * @param label The label of the state to remove
     */
    removeState(label) {
        const state = this.getState(label);
        if (state) {
            state.remove();
            this.states.delete(label);
            this.stateLabels.delete(state);
            state.removeListener('active', this.onStateActive);
            this.emit('stateRemoved', { state: label });
            return this;
        }
        else {
            throw new Error(`State container does not have a state with label ${label}`);
        }
    }
    ;
    /**
     * Change the name of a state
     * @param fromLabel The old state label
     * @param toLabel The new state label
     */
    renameState(fromLabel, toLabel) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (this.hasState(toLabel)) {
            throw new Error(`State container already has a state with label ${toLabel}`);
        }
        const fromState = this.getState(fromLabel);
        this.states.delete(fromLabel);
        this.states.set(toLabel, fromState);
        this.stateLabels.set(fromState, toLabel);
        this.emit('stateRenamed', { fromName: fromLabel, toName: toLabel });
        return this;
    }
    ;
    /**
     * Change the name of a transition
     * @param fromLabel The old transition label
     * @param toLabel The new transition label
     */
    renameTransition(fromLabel, toLabel) {
        if (!this.hasTransition(fromLabel)) {
            throw new Error(`State container does not have a transition with label ${fromLabel}`);
        }
        if (this.hasTransition(toLabel)) {
            throw new Error(`State container already has a transition with label ${toLabel}`);
        }
        const transition = this.getTransition(fromLabel);
        this.transitions.delete(fromLabel);
        this.transitions.set(toLabel, transition);
        this.transitionLabels.set(transition, toLabel);
        this.emit('transitionRenamed', { fromName: fromLabel, toName: toLabel });
        return this;
    }
    ;
    /**
     * Add a new transition
     *
     * @param fromLabel The label of the state this transition leaves from
     * @param toLabel The label of the state this transition goes to
     * @param payload The payload for the new transition
     * @param label The label for the new transition (automatically determined if not given)
     *
     * @returns The label of the new transition
     */
    addTransition(fromLabel, toLabel, payload, label = this.getUniqueTransitionLabel()) {
        if (!this.hasState(fromLabel)) {
            throw new Error(`State container does not have a state with label ${fromLabel}`);
        }
        if (!this.hasState(toLabel)) {
            throw new Error(`State container does not have a state with label ${toLabel}`);
        }
        if (this.hasTransition(label)) {
            throw new Error(`Container already has a transition with label ${label}`);
        }
        ;
        const fromState = this.getState(fromLabel);
        const toState = this.getState(toLabel);
        const transition = new Transition_1.Transition(fromState, toState, payload);
        this.transitions.set(label, transition);
        this.transitionLabels.set(transition, label);
        this.emit('transitionAdded', { transition: label, from: fromLabel, to: toLabel, payload });
        return label;
    }
    ;
    /**
     * Remove a transition by label
     * @param label The label of the transition to remove
     */
    removeTransition(label) {
        if (this.hasTransition(label)) {
            const transition = this.getTransition(label);
            transition.remove();
            this.transitions.delete(label);
            this.transitionLabels.delete(transition);
            this.emit('transitionRemoved', { transition: label });
            return this;
        }
        else {
            throw new Error('Could not find transition');
        }
    }
    ;
    /**
     * Get the label of the active state
     * @returns The label of the currently active state
     */
    getActiveState() { return this.getStateLabel(this.activeState); }
    ;
    /**
     * Changes which state is active in this container
     * @param label The label of the new active state
     */
    setActiveState(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        if (this.activeState) {
            this.activeState.setIsActive(false);
        }
        const state = this.getState(label);
        state.setIsActive(true);
        return this;
    }
    ;
    /**
     * Get the label of every state in this container
     * @returns a list of states in this container
     */
    getStates() {
        return Array.from(this.states.keys());
    }
    ;
    /**
     * @returns a state name that will be unique for this container
     */
    getUniqueStateLabel() {
        const prefix = 'state_';
        let i = 0;
        while (this.hasState(`${prefix}${i}`)) {
            i++;
        }
        return `${prefix}${i}`;
    }
    ;
    /**
     * @returns a transition name that will be unique for this container
     */
    getUniqueTransitionLabel() {
        const prefix = 'transition_';
        let i = 0;
        while (this.hasTransition(`${prefix}${i}`)) {
            i++;
        }
        return `${prefix}${i}`;
    }
    ;
    /**
     * @returns the name of the start state
     */
    getStartState() {
        return this.getStateLabel(this.startState);
    }
    ;
    /**
     * Check if a given state is a start state
     * @param label The state to check
     * @returns true if the state is a start state and false otherwise
     */
    isStartState(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        return this.getState(label).isStartState();
    }
    /**
     * Get the list of transitions leaving a state
     * @param label The state name for which we are getting outgoing transitions
     */
    getOutgoingTransitions(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        const state = this.getState(label);
        const transitions = state._getOutgoingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    }
    ;
    /**
     * Get the list of transitions entering a state
     * @param label The state name for which we are getting incoming transitions
     */
    getIncomingTransitions(label) {
        if (!this.hasState(label)) {
            throw new Error(`State container does not have a state with label ${label}`);
        }
        const state = this.getState(label);
        const transitions = state._getIncomingTransitions();
        return transitions.map((t) => this.getTransitionLabel(t));
    }
    ;
    /**
     * Get the state that a transition goes to
     * @param label The transition label
     * @returns The label of the state this transition goes to
     */
    getTransitionTo(label) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getToState());
    }
    ;
    /**
     * Get he state that a transition leaves from
     * @param label The transition label
     * @returns The label of the state that this transition leaves from
     */
    getTransitionFrom(label) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        const transition = this.getTransition(label);
        return this.getStateLabel(transition.getFromState());
    }
    ;
    /**
     * Change the state that a transition goes to
     * @param label The transition label
     * @param toState The label of the state that it should now go to
     */
    setTransitionTo(label, toState) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        if (!this.hasState(toState)) {
            throw new Error(`State container does not have a state with label ${toState}`);
        }
        const transition = this.getTransition(label);
        transition.setToState(this.getState(toState));
        return this;
    }
    ;
    /**
     * Change the state that a transition leaves from
     * @param label The transition label
     * @param fromState The label of the state that it should now leave from
     */
    setTransitionFrom(label, fromState) {
        if (!this.hasTransition(label)) {
            throw new Error(`State container does not have a transition with label ${label}`);
        }
        if (!this.hasState(fromState)) {
            throw new Error(`State container does not have a state with label ${fromState}`);
        }
        const transition = this.getTransition(label);
        transition.setFromState(this.getState(fromState));
        return this;
    }
    ;
    /**
     * Convert this state machine into a printable representation
     */
    toString() {
        const dividerWidth = 40;
        const divider = '~'.repeat(dividerWidth);
        const stateWidth = 10;
        const tabWidth = 4;
        const spaceOut = (word) => {
            const wordLength = word.length;
            const spacesBefore = Math.round((dividerWidth - wordLength) / 2);
            return ' '.repeat(spacesBefore) + word;
        };
        const pad = (word, width) => {
            const toAdd = width - word.length;
            if (toAdd > 0) {
                return word + ' '.repeat(toAdd);
            }
            else {
                return word;
            }
        };
        let rv = `${divider}\n${spaceOut('FSM')}\n${divider}\n`;
        this.getStates().forEach((state) => {
            rv += `${pad(state + ':', stateWidth)} ${this.getStatePayload(state)}\n`;
            const outgoingTransitions = this.getOutgoingTransitions(state);
            if (outgoingTransitions.length > 0) {
                outgoingTransitions.forEach((t) => {
                    const payload = this.getTransitionPayload(t);
                    rv += pad(`${' '.repeat(tabWidth)} --(${t})--> ${this.getTransitionTo(t)}`, 30);
                    rv += `: ${this.getTransitionPayload(t)}\n`;
                });
            }
        });
        return rv;
    }
    ;
    /**
     * Clean up all of the objects stored in this container
     */
    destroy() {
        this.states.clear();
        this.stateLabels.clear();
        this.transitions.clear();
        this.transitionLabels.clear();
        this.emit('destroyed');
    }
    ;
}
exports.StateContainer = StateContainer;
;
const defaultEqualityCheck = (a, b) => a === b;
const defaultSimilarityScore = (a, b) => a === b ? 1 : 0;
class FSM extends StateContainer {
    constructor(transitionsEqual = defaultEqualityCheck, transitionSimilarityScore = defaultSimilarityScore, stateSimilarityScore = defaultSimilarityScore, startStateName) {
        super(startStateName);
        this.transitionsEqual = transitionsEqual;
        this.transitionSimilarityScore = transitionSimilarityScore;
        this.stateSimilarityScore = stateSimilarityScore;
    }
    ;
    /**
     * Iterate and merge the best candidates
     */
    iterateMerge() {
        const similarityScores = this.computeSimilarityScores();
        const sortedStates = Array.from(similarityScores.entries()).sort((a, b) => b[1] - a[1]);
        console.log(sortedStates);
        if (sortedStates.length > 0) {
            const [toMergeS1, toMergeS2] = sortedStates[0][0];
            this.mergeStates(toMergeS1, toMergeS2);
        }
    }
    ;
    /**
     * @returns every possible pairing of states
     */
    getStatePairs() {
        const rv = [];
        const states = Array.from(this.states.values());
        for (let i = 0; i < states.length; i++) {
            const si = states[i];
            for (let j = i + 1; j < states.length; j++) {
                const sj = states[j];
                rv.push([si, sj]);
            }
        }
        return rv;
    }
    ;
    /**
     * Compute a similarity score of every pair of states
     */
    computeSimilarityScores() {
        const numCommonTransitions = new HashMap_1.HashMap((p1, p2) => { return p1[0] === p2[0] && p1[1] === p2[1]; }, (p) => { return this.getStateLabel(p[0]) + this.getStateLabel(p[1]); });
        const statePairs = this.getStatePairs();
        const equivalentOutgoingTransitions = new Map();
        statePairs.forEach((p) => {
            const [state1, state2] = p;
            const et = this.equivalentTransitions(state1._getOutgoingTransitions(), state2._getOutgoingTransitions());
            equivalentOutgoingTransitions.set(p, et);
            numCommonTransitions.set(p, et.length);
        });
        const rv = new Map();
        statePairs.forEach((p) => {
            const equivalentTransitions = equivalentOutgoingTransitions.get(p);
            equivalentTransitions.forEach((et) => {
                const [t1, t2] = et;
                const t1Dest = t1.getToState();
                const t2Dest = t2.getToState();
                const similarityScore = numCommonTransitions.get([t1Dest, t2Dest]) || numCommonTransitions.get([t2Dest, t1Dest]);
                rv.set(p, numCommonTransitions.get(p) + similarityScore);
            });
        });
        numCommonTransitions.clear();
        return rv;
    }
    ;
    /**
     * Get a list of equivalent transitions from two sets of transitions
     * @param transitionSet1 The first set of transitions
     * @param transitionSet2 The second set of transitions
     * @returns A list of pairs of transitions that are common between transitionSet1 and transitionSet2
     */
    equivalentTransitions(transitionSet1, transitionSet2) {
        const rv = [];
        for (let i = 0; i < transitionSet1.length; i++) {
            const t1 = transitionSet1[i];
            for (let j = 0; j < transitionSet2.length; j++) {
                const t2 = transitionSet2[j];
                if (this.transitionsEqual(t1.getPayload(), t2.getPayload())) {
                    rv.push([t1, t2]);
                    break;
                }
            }
        }
        return rv;
    }
    ;
    /**
     * Add a new "trace" through a program
     */
    addTrace(trace) {
        let currentState = this.getStartState();
        trace.forEach((item) => {
            const [t, s] = item;
            const outgoingTransitions = this.getState(currentState)._getOutgoingTransitions();
            let transitionExists = false;
            let existingState;
            for (let i = 0; i < outgoingTransitions.length; i++) {
                const outgoingTransition = outgoingTransitions[i];
                if (this.transitionsEqual(outgoingTransition.getPayload(), t)) {
                    transitionExists = true;
                    existingState = outgoingTransition.getToState();
                    break;
                }
            }
            if (transitionExists) {
                currentState = this.getStateLabel(existingState);
            }
            else {
                const newState = this.addState(s);
                this.addTransition(currentState, newState, t);
                currentState = newState;
            }
        });
    }
    ;
    /**
     * Merge two states together
     */
    mergeStates(removeState, mergeInto, removeStaleStates = true) {
        const mergeIntoOutgoingTransitions = mergeInto._getOutgoingTransitions();
        const outgoingTransitionTargets = new Set();
        let outgoingTransitions;
        do {
            outgoingTransitions = removeState._getOutgoingTransitions();
            const t = outgoingTransitions[0];
            if (t) {
                const tPayload = t.getPayload();
                let hasConflict = false;
                for (let i in mergeIntoOutgoingTransitions) {
                    const t2 = mergeIntoOutgoingTransitions[i];
                    const t2Payload = t2.getPayload();
                    if (this.transitionsEqual(tPayload, t2Payload)) {
                        hasConflict = true;
                        break;
                    }
                }
                if (hasConflict) {
                    if (removeStaleStates) {
                        outgoingTransitionTargets.add(t.getToState());
                    }
                    t.remove();
                }
                else {
                    t.setFromState(mergeInto);
                }
            }
        } while (outgoingTransitions.length > 0);
        let incomingTransitions;
        do {
            incomingTransitions = removeState._getIncomingTransitions();
            const t = incomingTransitions[0];
            if (t) {
                t.setToState(mergeInto);
            }
        } while (incomingTransitions.length > 0);
        this.removeState(this.getStateLabel(removeState));
        if (removeStaleStates) {
            outgoingTransitionTargets.forEach((state) => {
                if (state._getIncomingTransitions().length === 0) {
                    state.remove();
                    this.removeState(this.getStateLabel(state));
                }
            });
        }
    }
    ;
}
exports.FSM = FSM;
;


/***/ }),

/***/ "./src/state_machine/Transition.ts":
/*!*****************************************!*\
  !*** ./src/state_machine/Transition.ts ***!
  \*****************************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
const events_1 = __webpack_require__(/*! events */ "./node_modules/node-libs-browser/node_modules/events/events.js");
/**
 * A class representing a transition in a state machine
 */
class Transition extends events_1.EventEmitter {
    /**
     * Constructor
     * @param fromState The state that this transition leaves from
     * @param toState The state that this transition goes to
     * @param payload The information stored in this transition
     */
    constructor(fromState, toState, payload) {
        super();
        this.fromState = fromState;
        this.toState = toState;
        this.payload = payload;
        this.fromState._addOutgoingTransition(this);
        this.toState._addIncomingTransition(this);
    }
    ;
    /**
     * @returns whether this transition is eligible to fire
     */
    isEligible() { return this.eligible; }
    ;
    /**
     * Change whether this transition is eligible
     * @param eligible true if this transition should be eligible to fire, false otherwise.
     */
    setEligible(eligible) { this.eligible = eligible; }
    ;
    /**
     * Remove this transition
     */
    remove() {
        this.fromState._removeOutgoingTransition(this);
        this.toState._removeIncomingTransition(this);
    }
    ;
    /**
     * Get the state that this transition leaves from
     */
    getFromState() { return this.fromState; }
    ;
    /**
     * Get the state that this transition goes to
     */
    getToState() { return this.toState; }
    ;
    /**
     * Tell the transition to fire (if the "from" state is active, move to the "to" state)
     */
    fire(event, source) {
        this.emit('fire', this, event, source);
    }
    ;
    /**
     * Change which state this transition leaves from
     * @param state The new "from" state
     */
    setFromState(state) {
        this.fromState._removeOutgoingTransition(this);
        this.fromState = state;
        this.fromState._addOutgoingTransition(this);
    }
    ;
    /**
     * Change which state this transition goes to
     * @param state The new "to" state
     */
    setToState(state) {
        this.toState._removeIncomingTransition(this);
        this.toState = state;
        this.toState._addIncomingTransition(this);
    }
    ;
    /**
     * Get this transition's content payload
     */
    getPayload() { return this.payload; }
    ;
    /**
     * Set this transition's payload
     * @param payload The new payload
     */
    setPayload(payload) {
        this.payload = payload;
    }
    ;
}
exports.Transition = Transition;
;


/***/ }),

/***/ "./src/utils/HashMap.ts":
/*!******************************!*\
  !*** ./src/utils/HashMap.ts ***!
  \******************************/
/*! no static exports found */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

Object.defineProperty(exports, "__esModule", { value: true });
class HashMap {
    constructor(equals = ((k1, k2) => k1 === k2), hash = ((k) => `${k}`)) {
        this.equals = equals;
        this.hash = hash;
        this.map = new Map();
        this.size = 0;
    }
    ;
    set(key, value) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            let found = false;
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    found = true;
                    kvPairs[i][1] = value;
                    break;
                }
            }
            if (!found) {
                kvPairs.push([key, value]);
                this.size++;
            }
        }
        else {
            this.map.set(hash, [[key, value]]);
            this.size++;
        }
        return this;
    }
    ;
    get(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    return kvPairs[i][1];
                }
            }
        }
        return null;
    }
    ;
    has(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    return true;
                }
            }
        }
        return false;
    }
    ;
    delete(key) {
        const hash = this.hash(key);
        if (this.map.has(hash)) {
            const kvPairs = this.map.get(hash);
            for (let i = 0; i < kvPairs.length; i++) {
                if (this.equals(kvPairs[i][0], key)) {
                    kvPairs.splice(i, 1);
                    if (kvPairs.length === 0) {
                        this.map.delete(kvPairs);
                    }
                    this.size--;
                    break;
                }
            }
        }
        return this;
    }
    ;
    getSize() {
        return this.size;
    }
    ;
    clear() {
        this.map.clear();
        this.size = 0;
        return this;
    }
    ;
}
exports.HashMap = HashMap;
;


/***/ })

/******/ });
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vd2VicGFjay9ib290c3RyYXAiLCJ3ZWJwYWNrOi8vLy4vbm9kZV9tb2R1bGVzL25vZGUtbGlicy1icm93c2VyL25vZGVfbW9kdWxlcy9ldmVudHMvZXZlbnRzLmpzIiwid2VicGFjazovLy8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGVfbWFjaGluZS9TdGF0ZS50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGVfbWFjaGluZS9TdGF0ZUNvbnRhaW5lci50cyIsIndlYnBhY2s6Ly8vLi9zcmMvc3RhdGVfbWFjaGluZS9UcmFuc2l0aW9uLnRzIiwid2VicGFjazovLy8uL3NyYy91dGlscy9IYXNoTWFwLnRzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiI7QUFBQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBLGtEQUEwQyxnQ0FBZ0M7QUFDMUU7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxnRUFBd0Qsa0JBQWtCO0FBQzFFO0FBQ0EseURBQWlELGNBQWM7QUFDL0Q7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGlEQUF5QyxpQ0FBaUM7QUFDMUUsd0hBQWdILG1CQUFtQixFQUFFO0FBQ3JJO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsbUNBQTJCLDBCQUEwQixFQUFFO0FBQ3ZELHlDQUFpQyxlQUFlO0FBQ2hEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLDhEQUFzRCwrREFBK0Q7O0FBRXJIO0FBQ0E7OztBQUdBO0FBQ0E7Ozs7Ozs7Ozs7OztBQ2xGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxpQkFBaUI7QUFDakIsT0FBTztBQUNQO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxlQUFlLFNBQVM7QUFDeEI7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBLEdBQUc7QUFDSCxvQkFBb0IsU0FBUztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNB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RCxPQUFPLElBQUksQ0FBQztJQUNoQixDQUFDO0lBQUEsQ0FBQztJQUNLLE9BQU87UUFDVixPQUFPLElBQUksQ0FBQyxJQUFJLENBQUM7SUFDckIsQ0FBQztJQUFBLENBQUM7SUFDSyxLQUFLO1FBQ1IsSUFBSSxDQUFDLEdBQUcsQ0FBQyxLQUFLLEVBQUUsQ0FBQztRQUNqQixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsQ0FBQztRQUNkLE9BQU8sSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFBQSxDQUFDO0NBQ0w7QUFoRkQsMEJBZ0ZDO0FBQUEsQ0FBQyIsImZpbGUiOiJidW5kbGUuanMiLCJzb3VyY2VzQ29udGVudCI6WyIgXHQvLyBUaGUgbW9kdWxlIGNhY2hlXG4gXHR2YXIgaW5zdGFsbGVkTW9kdWxlcyA9IHt9O1xuXG4gXHQvLyBUaGUgcmVxdWlyZSBmdW5jdGlvblxuIFx0ZnVuY3Rpb24gX193ZWJwYWNrX3JlcXVpcmVfXyhtb2R1bGVJZCkge1xuXG4gXHRcdC8vIENoZWNrIGlmIG1vZHVsZSBpcyBpbiBjYWNoZVxuIFx0XHRpZihpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSkge1xuIFx0XHRcdHJldHVybiBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXS5leHBvcnRzO1xuIFx0XHR9XG4gXHRcdC8vIENyZWF0ZSBhIG5ldyBtb2R1bGUgKGFuZCBwdXQgaXQgaW50byB0aGUgY2FjaGUpXG4gXHRcdHZhciBtb2R1bGUgPSBpbnN0YWxsZWRNb2R1bGVzW21vZHVsZUlkXSA9IHtcbiBcdFx0XHRpOiBtb2R1bGVJZCxcbiBcdFx0XHRsOiBmYWxzZSxcbiBcdFx0XHRleHBvcnRzOiB7fVxuIFx0XHR9O1xuXG4gXHRcdC8vIEV4ZWN1dGUgdGhlIG1vZHVsZSBmdW5jdGlvblxuIFx0XHRtb2R1bGVzW21vZHVsZUlkXS5jYWxsKG1vZHVsZS5leHBvcnRzLCBtb2R1bGUsIG1vZHVsZS5leHBvcnRzLCBfX3dlYnBhY2tfcmVxdWlyZV9fKTtcblxuIFx0XHQvLyBGbGFnIHRoZSBtb2R1bGUgYXMgbG9hZGVkXG4gXHRcdG1vZHVsZS5sID0gdHJ1ZTtcblxuIFx0XHQvLyBSZXR1cm4gdGhlIGV4cG9ydHMgb2YgdGhlIG1vZHVsZVxuIFx0XHRyZXR1cm4gbW9kdWxlLmV4cG9ydHM7XG4gXHR9XG5cblxuIFx0Ly8gZXhwb3NlIHRoZSBtb2R1bGVzIG9iamVjdCAoX193ZWJwYWNrX21vZHVsZXNfXylcbiBcdF9fd2VicGFja19yZXF1aXJlX18ubSA9IG1vZHVsZXM7XG5cbiBcdC8vIGV4cG9zZSB0aGUgbW9kdWxlIGNhY2hlXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLmMgPSBpbnN0YWxsZWRNb2R1bGVzO1xuXG4gXHQvLyBkZWZpbmUgZ2V0dGVyIGZ1bmN0aW9uIGZvciBoYXJtb255IGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uZCA9IGZ1bmN0aW9uKGV4cG9ydHMsIG5hbWUsIGdldHRlcikge1xuIFx0XHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKGV4cG9ydHMsIG5hbWUpKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIG5hbWUsIHsgZW51bWVyYWJsZTogdHJ1ZSwgZ2V0OiBnZXR0ZXIgfSk7XG4gXHRcdH1cbiBcdH07XG5cbiBcdC8vIGRlZmluZSBfX2VzTW9kdWxlIG9uIGV4cG9ydHNcbiBcdF9fd2VicGFja19yZXF1aXJlX18uciA9IGZ1bmN0aW9uKGV4cG9ydHMpIHtcbiBcdFx0aWYodHlwZW9mIFN5bWJvbCAhPT0gJ3VuZGVmaW5lZCcgJiYgU3ltYm9sLnRvU3RyaW5nVGFnKSB7XG4gXHRcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsIFN5bWJvbC50b1N0cmluZ1RhZywgeyB2YWx1ZTogJ01vZHVsZScgfSk7XG4gXHRcdH1cbiBcdFx0T2JqZWN0LmRlZmluZVByb3BlcnR5KGV4cG9ydHMsICdfX2VzTW9kdWxlJywgeyB2YWx1ZTogdHJ1ZSB9KTtcbiBcdH07XG5cbiBcdC8vIGNyZWF0ZSBhIGZha2UgbmFtZXNwYWNlIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDE6IHZhbHVlIGlzIGEgbW9kdWxlIGlkLCByZXF1aXJlIGl0XG4gXHQvLyBtb2RlICYgMjogbWVyZ2UgYWxsIHByb3BlcnRpZXMgb2YgdmFsdWUgaW50byB0aGUgbnNcbiBcdC8vIG1vZGUgJiA0OiByZXR1cm4gdmFsdWUgd2hlbiBhbHJlYWR5IG5zIG9iamVjdFxuIFx0Ly8gbW9kZSAmIDh8MTogYmVoYXZlIGxpa2UgcmVxdWlyZVxuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy50ID0gZnVuY3Rpb24odmFsdWUsIG1vZGUpIHtcbiBcdFx0aWYobW9kZSAmIDEpIHZhbHVlID0gX193ZWJwYWNrX3JlcXVpcmVfXyh2YWx1ZSk7XG4gXHRcdGlmKG1vZGUgJiA4KSByZXR1cm4gdmFsdWU7XG4gXHRcdGlmKChtb2RlICYgNCkgJiYgdHlwZW9mIHZhbHVlID09PSAnb2JqZWN0JyAmJiB2YWx1ZSAmJiB2YWx1ZS5fX2VzTW9kdWxlKSByZXR1cm4gdmFsdWU7XG4gXHRcdHZhciBucyA9IE9iamVjdC5jcmVhdGUobnVsbCk7XG4gXHRcdF9fd2VicGFja19yZXF1aXJlX18ucihucyk7XG4gXHRcdE9iamVjdC5kZWZpbmVQcm9wZXJ0eShucywgJ2RlZmF1bHQnLCB7IGVudW1lcmFibGU6IHRydWUsIHZhbHVlOiB2YWx1ZSB9KTtcbiBcdFx0aWYobW9kZSAmIDIgJiYgdHlwZW9mIHZhbHVlICE9ICdzdHJpbmcnKSBmb3IodmFyIGtleSBpbiB2YWx1ZSkgX193ZWJwYWNrX3JlcXVpcmVfXy5kKG5zLCBrZXksIGZ1bmN0aW9uKGtleSkgeyByZXR1cm4gdmFsdWVba2V5XTsgfS5iaW5kKG51bGwsIGtleSkpO1xuIFx0XHRyZXR1cm4gbnM7XG4gXHR9O1xuXG4gXHQvLyBnZXREZWZhdWx0RXhwb3J0IGZ1bmN0aW9uIGZvciBjb21wYXRpYmlsaXR5IHdpdGggbm9uLWhhcm1vbnkgbW9kdWxlc1xuIFx0X193ZWJwYWNrX3JlcXVpcmVfXy5uID0gZnVuY3Rpb24obW9kdWxlKSB7XG4gXHRcdHZhciBnZXR0ZXIgPSBtb2R1bGUgJiYgbW9kdWxlLl9fZXNNb2R1bGUgP1xuIFx0XHRcdGZ1bmN0aW9uIGdldERlZmF1bHQoKSB7IHJldHVybiBtb2R1bGVbJ2RlZmF1bHQnXTsgfSA6XG4gXHRcdFx0ZnVuY3Rpb24gZ2V0TW9kdWxlRXhwb3J0cygpIHsgcmV0dXJuIG1vZHVsZTsgfTtcbiBcdFx0X193ZWJwYWNrX3JlcXVpcmVfXy5kKGdldHRlciwgJ2EnLCBnZXR0ZXIpO1xuIFx0XHRyZXR1cm4gZ2V0dGVyO1xuIFx0fTtcblxuIFx0Ly8gT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSBmdW5jdGlvbihvYmplY3QsIHByb3BlcnR5KSB7IHJldHVybiBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5LmNhbGwob2JqZWN0LCBwcm9wZXJ0eSk7IH07XG5cbiBcdC8vIF9fd2VicGFja19wdWJsaWNfcGF0aF9fXG4gXHRfX3dlYnBhY2tfcmVxdWlyZV9fLnAgPSBcIlwiO1xuXG5cbiBcdC8vIExvYWQgZW50cnkgbW9kdWxlIGFuZCByZXR1cm4gZXhwb3J0c1xuIFx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oX193ZWJwYWNrX3JlcXVpcmVfXy5zID0gXCIuL3NyYy9pbmRleC50c1wiKTtcbiIsIi8vIENvcHlyaWdodCBKb3llbnQsIEluYy4gYW5kIG90aGVyIE5vZGUgY29udHJpYnV0b3JzLlxuLy9cbi8vIFBlcm1pc3Npb24gaXMgaGVyZWJ5IGdyYW50ZWQsIGZyZWUgb2YgY2hhcmdlLCB0byBhbnkgcGVyc29uIG9idGFpbmluZyBhXG4vLyBjb3B5IG9mIHRoaXMgc29mdHdhcmUgYW5kIGFzc29jaWF0ZWQgZG9jdW1lbnRhdGlvbiBmaWxlcyAodGhlXG4vLyBcIlNvZnR3YXJlXCIpLCB0byBkZWFsIGluIHRoZSBTb2Z0d2FyZSB3aXRob3V0IHJlc3RyaWN0aW9uLCBpbmNsdWRpbmdcbi8vIHdpdGhvdXQgbGltaXRhdGlvbiB0aGUgcmlnaHRzIHRvIHVzZSwgY29weSwgbW9kaWZ5LCBtZXJnZSwgcHVibGlzaCxcbi8vIGRpc3RyaWJ1dGUsIHN1YmxpY2Vuc2UsIGFuZC9vciBzZWxsIGNvcGllcyBvZiB0aGUgU29mdHdhcmUsIGFuZCB0byBwZXJtaXRcbi8vIHBlcnNvbnMgdG8gd2hvbSB0aGUgU29mdHdhcmUgaXMgZnVybmlzaGVkIHRvIGRvIHNvLCBzdWJqZWN0IHRvIHRoZVxuLy8gZm9sbG93aW5nIGNvbmRpdGlvbnM6XG4vL1xuLy8gVGhlIGFib3ZlIGNvcHlyaWdodCBub3RpY2UgYW5kIHRoaXMgcGVybWlzc2lvbiBub3RpY2Ugc2hhbGwgYmUgaW5jbHVkZWRcbi8vIGluIGFsbCBjb3BpZXMgb3Igc3Vic3RhbnRpYWwgcG9ydGlvbnMgb2YgdGhlIFNvZnR3YXJlLlxuLy9cbi8vIFRIRSBTT0ZUV0FSRSBJUyBQUk9WSURFRCBcIkFTIElTXCIsIFdJVEhPVVQgV0FSUkFOVFkgT0YgQU5ZIEtJTkQsIEVYUFJFU1Ncbi8vIE9SIElNUExJRUQsIElOQ0xVRElORyBCVVQgTk9UIExJTUlURUQgVE8gVEhFIFdBUlJBTlRJRVMgT0Zcbi8vIE1FUkNIQU5UQUJJTElUWSwgRklUTkVTUyBGT1IgQSBQQVJUSUNVTEFSIFBVUlBPU0UgQU5EIE5PTklORlJJTkdFTUVOVC4gSU5cbi8vIE5PIEVWRU5UIFNIQUxMIFRIRSBBVVRIT1JTIE9SIENPUFlSSUdIVCBIT0xERVJTIEJFIExJQUJMRSBGT1IgQU5ZIENMQUlNLFxuLy8gREFNQUdFUyBPUiBPVEhFUiBMSUFCSUxJVFksIFdIRVRIRVIgSU4gQU4gQUNUSU9OIE9GIENPTlRSQUNULCBUT1JUIE9SXG4vLyBPVEhFUldJU0UsIEFSSVNJTkcgRlJPTSwgT1VUIE9GIE9SIElOIENPTk5FQ1RJT04gV0lUSCBUSEUgU09GVFdBUkUgT1IgVEhFXG4vLyBVU0UgT1IgT1RIRVIgREVBTElOR1MgSU4gVEhFIFNPRlRXQVJFLlxuXG5mdW5jdGlvbiBFdmVudEVtaXR0ZXIoKSB7XG4gIHRoaXMuX2V2ZW50cyA9IHRoaXMuX2V2ZW50cyB8fCB7fTtcbiAgdGhpcy5fbWF4TGlzdGVuZXJzID0gdGhpcy5fbWF4TGlzdGVuZXJzIHx8IHVuZGVmaW5lZDtcbn1cbm1vZHVsZS5leHBvcnRzID0gRXZlbnRFbWl0dGVyO1xuXG4vLyBCYWNrd2FyZHMtY29tcGF0IHdpdGggbm9kZSAwLjEwLnhcbkV2ZW50RW1pdHRlci5FdmVudEVtaXR0ZXIgPSBFdmVudEVtaXR0ZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX2V2ZW50cyA9IHVuZGVmaW5lZDtcbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuX21heExpc3RlbmVycyA9IHVuZGVmaW5lZDtcblxuLy8gQnkgZGVmYXVsdCBFdmVudEVtaXR0ZXJzIHdpbGwgcHJpbnQgYSB3YXJuaW5nIGlmIG1vcmUgdGhhbiAxMCBsaXN0ZW5lcnMgYXJlXG4vLyBhZGRlZCB0byBpdC4gVGhpcyBpcyBhIHVzZWZ1bCBkZWZhdWx0IHdoaWNoIGhlbHBzIGZpbmRpbmcgbWVtb3J5IGxlYWtzLlxuRXZlbnRFbWl0dGVyLmRlZmF1bHRNYXhMaXN0ZW5lcnMgPSAxMDtcblxuLy8gT2J2aW91c2x5IG5vdCBhbGwgRW1pdHRlcnMgc2hvdWxkIGJlIGxpbWl0ZWQgdG8gMTAuIFRoaXMgZnVuY3Rpb24gYWxsb3dzXG4vLyB0aGF0IHRvIGJlIGluY3JlYXNlZC4gU2V0IHRvIHplcm8gZm9yIHVubGltaXRlZC5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUuc2V0TWF4TGlzdGVuZXJzID0gZnVuY3Rpb24obikge1xuICBpZiAoIWlzTnVtYmVyKG4pIHx8IG4gPCAwIHx8IGlzTmFOKG4pKVxuICAgIHRocm93IFR5cGVFcnJvcignbiBtdXN0IGJlIGEgcG9zaXRpdmUgbnVtYmVyJyk7XG4gIHRoaXMuX21heExpc3RlbmVycyA9IG47XG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5lbWl0ID0gZnVuY3Rpb24odHlwZSkge1xuICB2YXIgZXIsIGhhbmRsZXIsIGxlbiwgYXJncywgaSwgbGlzdGVuZXJzO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzKVxuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuXG4gIC8vIElmIHRoZXJlIGlzIG5vICdlcnJvcicgZXZlbnQgbGlzdGVuZXIgdGhlbiB0aHJvdy5cbiAgaWYgKHR5cGUgPT09ICdlcnJvcicpIHtcbiAgICBpZiAoIXRoaXMuX2V2ZW50cy5lcnJvciB8fFxuICAgICAgICAoaXNPYmplY3QodGhpcy5fZXZlbnRzLmVycm9yKSAmJiAhdGhpcy5fZXZlbnRzLmVycm9yLmxlbmd0aCkpIHtcbiAgICAgIGVyID0gYXJndW1lbnRzWzFdO1xuICAgICAgaWYgKGVyIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgdGhyb3cgZXI7IC8vIFVuaGFuZGxlZCAnZXJyb3InIGV2ZW50XG4gICAgICB9IGVsc2Uge1xuICAgICAgICAvLyBBdCBsZWFzdCBnaXZlIHNvbWUga2luZCBvZiBjb250ZXh0IHRvIHRoZSB1c2VyXG4gICAgICAgIHZhciBlcnIgPSBuZXcgRXJyb3IoJ1VuY2F1Z2h0LCB1bnNwZWNpZmllZCBcImVycm9yXCIgZXZlbnQuICgnICsgZXIgKyAnKScpO1xuICAgICAgICBlcnIuY29udGV4dCA9IGVyO1xuICAgICAgICB0aHJvdyBlcnI7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaGFuZGxlciA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcblxuICBpZiAoaXNVbmRlZmluZWQoaGFuZGxlcikpXG4gICAgcmV0dXJuIGZhbHNlO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGhhbmRsZXIpKSB7XG4gICAgc3dpdGNoIChhcmd1bWVudHMubGVuZ3RoKSB7XG4gICAgICAvLyBmYXN0IGNhc2VzXG4gICAgICBjYXNlIDE6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlIDI6XG4gICAgICAgIGhhbmRsZXIuY2FsbCh0aGlzLCBhcmd1bWVudHNbMV0pO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgMzpcbiAgICAgICAgaGFuZGxlci5jYWxsKHRoaXMsIGFyZ3VtZW50c1sxXSwgYXJndW1lbnRzWzJdKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICAvLyBzbG93ZXJcbiAgICAgIGRlZmF1bHQ6XG4gICAgICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgICAgICBoYW5kbGVyLmFwcGx5KHRoaXMsIGFyZ3MpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChpc09iamVjdChoYW5kbGVyKSkge1xuICAgIGFyZ3MgPSBBcnJheS5wcm90b3R5cGUuc2xpY2UuY2FsbChhcmd1bWVudHMsIDEpO1xuICAgIGxpc3RlbmVycyA9IGhhbmRsZXIuc2xpY2UoKTtcbiAgICBsZW4gPSBsaXN0ZW5lcnMubGVuZ3RoO1xuICAgIGZvciAoaSA9IDA7IGkgPCBsZW47IGkrKylcbiAgICAgIGxpc3RlbmVyc1tpXS5hcHBseSh0aGlzLCBhcmdzKTtcbiAgfVxuXG4gIHJldHVybiB0cnVlO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5hZGRMaXN0ZW5lciA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIHZhciBtO1xuXG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICB0aGlzLl9ldmVudHMgPSB7fTtcblxuICAvLyBUbyBhdm9pZCByZWN1cnNpb24gaW4gdGhlIGNhc2UgdGhhdCB0eXBlID09PSBcIm5ld0xpc3RlbmVyXCIhIEJlZm9yZVxuICAvLyBhZGRpbmcgaXQgdG8gdGhlIGxpc3RlbmVycywgZmlyc3QgZW1pdCBcIm5ld0xpc3RlbmVyXCIuXG4gIGlmICh0aGlzLl9ldmVudHMubmV3TGlzdGVuZXIpXG4gICAgdGhpcy5lbWl0KCduZXdMaXN0ZW5lcicsIHR5cGUsXG4gICAgICAgICAgICAgIGlzRnVuY3Rpb24obGlzdGVuZXIubGlzdGVuZXIpID9cbiAgICAgICAgICAgICAgbGlzdGVuZXIubGlzdGVuZXIgOiBsaXN0ZW5lcik7XG5cbiAgaWYgKCF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgLy8gT3B0aW1pemUgdGhlIGNhc2Ugb2Ygb25lIGxpc3RlbmVyLiBEb24ndCBuZWVkIHRoZSBleHRyYSBhcnJheSBvYmplY3QuXG4gICAgdGhpcy5fZXZlbnRzW3R5cGVdID0gbGlzdGVuZXI7XG4gIGVsc2UgaWYgKGlzT2JqZWN0KHRoaXMuX2V2ZW50c1t0eXBlXSkpXG4gICAgLy8gSWYgd2UndmUgYWxyZWFkeSBnb3QgYW4gYXJyYXksIGp1c3QgYXBwZW5kLlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5wdXNoKGxpc3RlbmVyKTtcbiAgZWxzZVxuICAgIC8vIEFkZGluZyB0aGUgc2Vjb25kIGVsZW1lbnQsIG5lZWQgdG8gY2hhbmdlIHRvIGFycmF5LlxuICAgIHRoaXMuX2V2ZW50c1t0eXBlXSA9IFt0aGlzLl9ldmVudHNbdHlwZV0sIGxpc3RlbmVyXTtcblxuICAvLyBDaGVjayBmb3IgbGlzdGVuZXIgbGVha1xuICBpZiAoaXNPYmplY3QodGhpcy5fZXZlbnRzW3R5cGVdKSAmJiAhdGhpcy5fZXZlbnRzW3R5cGVdLndhcm5lZCkge1xuICAgIGlmICghaXNVbmRlZmluZWQodGhpcy5fbWF4TGlzdGVuZXJzKSkge1xuICAgICAgbSA9IHRoaXMuX21heExpc3RlbmVycztcbiAgICB9IGVsc2Uge1xuICAgICAgbSA9IEV2ZW50RW1pdHRlci5kZWZhdWx0TWF4TGlzdGVuZXJzO1xuICAgIH1cblxuICAgIGlmIChtICYmIG0gPiAwICYmIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGggPiBtKSB7XG4gICAgICB0aGlzLl9ldmVudHNbdHlwZV0ud2FybmVkID0gdHJ1ZTtcbiAgICAgIGNvbnNvbGUuZXJyb3IoJyhub2RlKSB3YXJuaW5nOiBwb3NzaWJsZSBFdmVudEVtaXR0ZXIgbWVtb3J5ICcgK1xuICAgICAgICAgICAgICAgICAgICAnbGVhayBkZXRlY3RlZC4gJWQgbGlzdGVuZXJzIGFkZGVkLiAnICtcbiAgICAgICAgICAgICAgICAgICAgJ1VzZSBlbWl0dGVyLnNldE1heExpc3RlbmVycygpIHRvIGluY3JlYXNlIGxpbWl0LicsXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuX2V2ZW50c1t0eXBlXS5sZW5ndGgpO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlLnRyYWNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgIC8vIG5vdCBzdXBwb3J0ZWQgaW4gSUUgMTBcbiAgICAgICAgY29uc29sZS50cmFjZSgpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5vbiA9IEV2ZW50RW1pdHRlci5wcm90b3R5cGUuYWRkTGlzdGVuZXI7XG5cbkV2ZW50RW1pdHRlci5wcm90b3R5cGUub25jZSA9IGZ1bmN0aW9uKHR5cGUsIGxpc3RlbmVyKSB7XG4gIGlmICghaXNGdW5jdGlvbihsaXN0ZW5lcikpXG4gICAgdGhyb3cgVHlwZUVycm9yKCdsaXN0ZW5lciBtdXN0IGJlIGEgZnVuY3Rpb24nKTtcblxuICB2YXIgZmlyZWQgPSBmYWxzZTtcblxuICBmdW5jdGlvbiBnKCkge1xuICAgIHRoaXMucmVtb3ZlTGlzdGVuZXIodHlwZSwgZyk7XG5cbiAgICBpZiAoIWZpcmVkKSB7XG4gICAgICBmaXJlZCA9IHRydWU7XG4gICAgICBsaXN0ZW5lci5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIH1cbiAgfVxuXG4gIGcubGlzdGVuZXIgPSBsaXN0ZW5lcjtcbiAgdGhpcy5vbih0eXBlLCBnKTtcblxuICByZXR1cm4gdGhpcztcbn07XG5cbi8vIGVtaXRzIGEgJ3JlbW92ZUxpc3RlbmVyJyBldmVudCBpZmYgdGhlIGxpc3RlbmVyIHdhcyByZW1vdmVkXG5FdmVudEVtaXR0ZXIucHJvdG90eXBlLnJlbW92ZUxpc3RlbmVyID0gZnVuY3Rpb24odHlwZSwgbGlzdGVuZXIpIHtcbiAgdmFyIGxpc3QsIHBvc2l0aW9uLCBsZW5ndGgsIGk7XG5cbiAgaWYgKCFpc0Z1bmN0aW9uKGxpc3RlbmVyKSlcbiAgICB0aHJvdyBUeXBlRXJyb3IoJ2xpc3RlbmVyIG11c3QgYmUgYSBmdW5jdGlvbicpO1xuXG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0dXJuIHRoaXM7XG5cbiAgbGlzdCA9IHRoaXMuX2V2ZW50c1t0eXBlXTtcbiAgbGVuZ3RoID0gbGlzdC5sZW5ndGg7XG4gIHBvc2l0aW9uID0gLTE7XG5cbiAgaWYgKGxpc3QgPT09IGxpc3RlbmVyIHx8XG4gICAgICAoaXNGdW5jdGlvbihsaXN0Lmxpc3RlbmVyKSAmJiBsaXN0Lmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIGlmICh0aGlzLl9ldmVudHMucmVtb3ZlTGlzdGVuZXIpXG4gICAgICB0aGlzLmVtaXQoJ3JlbW92ZUxpc3RlbmVyJywgdHlwZSwgbGlzdGVuZXIpO1xuXG4gIH0gZWxzZSBpZiAoaXNPYmplY3QobGlzdCkpIHtcbiAgICBmb3IgKGkgPSBsZW5ndGg7IGktLSA+IDA7KSB7XG4gICAgICBpZiAobGlzdFtpXSA9PT0gbGlzdGVuZXIgfHxcbiAgICAgICAgICAobGlzdFtpXS5saXN0ZW5lciAmJiBsaXN0W2ldLmxpc3RlbmVyID09PSBsaXN0ZW5lcikpIHtcbiAgICAgICAgcG9zaXRpb24gPSBpO1xuICAgICAgICBicmVhaztcbiAgICAgIH1cbiAgICB9XG5cbiAgICBpZiAocG9zaXRpb24gPCAwKVxuICAgICAgcmV0dXJuIHRoaXM7XG5cbiAgICBpZiAobGlzdC5sZW5ndGggPT09IDEpIHtcbiAgICAgIGxpc3QubGVuZ3RoID0gMDtcbiAgICAgIGRlbGV0ZSB0aGlzLl9ldmVudHNbdHlwZV07XG4gICAgfSBlbHNlIHtcbiAgICAgIGxpc3Quc3BsaWNlKHBvc2l0aW9uLCAxKTtcbiAgICB9XG5cbiAgICBpZiAodGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKVxuICAgICAgdGhpcy5lbWl0KCdyZW1vdmVMaXN0ZW5lcicsIHR5cGUsIGxpc3RlbmVyKTtcbiAgfVxuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciBrZXksIGxpc3RlbmVycztcblxuICBpZiAoIXRoaXMuX2V2ZW50cylcbiAgICByZXR1cm4gdGhpcztcblxuICAvLyBub3QgbGlzdGVuaW5nIGZvciByZW1vdmVMaXN0ZW5lciwgbm8gbmVlZCB0byBlbWl0XG4gIGlmICghdGhpcy5fZXZlbnRzLnJlbW92ZUxpc3RlbmVyKSB7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPT09IDApXG4gICAgICB0aGlzLl9ldmVudHMgPSB7fTtcbiAgICBlbHNlIGlmICh0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgLy8gZW1pdCByZW1vdmVMaXN0ZW5lciBmb3IgYWxsIGxpc3RlbmVycyBvbiBhbGwgZXZlbnRzXG4gIGlmIChhcmd1bWVudHMubGVuZ3RoID09PSAwKSB7XG4gICAgZm9yIChrZXkgaW4gdGhpcy5fZXZlbnRzKSB7XG4gICAgICBpZiAoa2V5ID09PSAncmVtb3ZlTGlzdGVuZXInKSBjb250aW51ZTtcbiAgICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKGtleSk7XG4gICAgfVxuICAgIHRoaXMucmVtb3ZlQWxsTGlzdGVuZXJzKCdyZW1vdmVMaXN0ZW5lcicpO1xuICAgIHRoaXMuX2V2ZW50cyA9IHt9O1xuICAgIHJldHVybiB0aGlzO1xuICB9XG5cbiAgbGlzdGVuZXJzID0gdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIGlmIChpc0Z1bmN0aW9uKGxpc3RlbmVycykpIHtcbiAgICB0aGlzLnJlbW92ZUxpc3RlbmVyKHR5cGUsIGxpc3RlbmVycyk7XG4gIH0gZWxzZSBpZiAobGlzdGVuZXJzKSB7XG4gICAgLy8gTElGTyBvcmRlclxuICAgIHdoaWxlIChsaXN0ZW5lcnMubGVuZ3RoKVxuICAgICAgdGhpcy5yZW1vdmVMaXN0ZW5lcih0eXBlLCBsaXN0ZW5lcnNbbGlzdGVuZXJzLmxlbmd0aCAtIDFdKTtcbiAgfVxuICBkZWxldGUgdGhpcy5fZXZlbnRzW3R5cGVdO1xuXG4gIHJldHVybiB0aGlzO1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lcnMgPSBmdW5jdGlvbih0eXBlKSB7XG4gIHZhciByZXQ7XG4gIGlmICghdGhpcy5fZXZlbnRzIHx8ICF0aGlzLl9ldmVudHNbdHlwZV0pXG4gICAgcmV0ID0gW107XG4gIGVsc2UgaWYgKGlzRnVuY3Rpb24odGhpcy5fZXZlbnRzW3R5cGVdKSlcbiAgICByZXQgPSBbdGhpcy5fZXZlbnRzW3R5cGVdXTtcbiAgZWxzZVxuICAgIHJldCA9IHRoaXMuX2V2ZW50c1t0eXBlXS5zbGljZSgpO1xuICByZXR1cm4gcmV0O1xufTtcblxuRXZlbnRFbWl0dGVyLnByb3RvdHlwZS5saXN0ZW5lckNvdW50ID0gZnVuY3Rpb24odHlwZSkge1xuICBpZiAodGhpcy5fZXZlbnRzKSB7XG4gICAgdmFyIGV2bGlzdGVuZXIgPSB0aGlzLl9ldmVudHNbdHlwZV07XG5cbiAgICBpZiAoaXNGdW5jdGlvbihldmxpc3RlbmVyKSlcbiAgICAgIHJldHVybiAxO1xuICAgIGVsc2UgaWYgKGV2bGlzdGVuZXIpXG4gICAgICByZXR1cm4gZXZsaXN0ZW5lci5sZW5ndGg7XG4gIH1cbiAgcmV0dXJuIDA7XG59O1xuXG5FdmVudEVtaXR0ZXIubGlzdGVuZXJDb3VudCA9IGZ1bmN0aW9uKGVtaXR0ZXIsIHR5cGUpIHtcbiAgcmV0dXJuIGVtaXR0ZXIubGlzdGVuZXJDb3VudCh0eXBlKTtcbn07XG5cbmZ1bmN0aW9uIGlzRnVuY3Rpb24oYXJnKSB7XG4gIHJldHVybiB0eXBlb2YgYXJnID09PSAnZnVuY3Rpb24nO1xufVxuXG5mdW5jdGlvbiBpc051bWJlcihhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdudW1iZXInO1xufVxuXG5mdW5jdGlvbiBpc09iamVjdChhcmcpIHtcbiAgcmV0dXJuIHR5cGVvZiBhcmcgPT09ICdvYmplY3QnICYmIGFyZyAhPT0gbnVsbDtcbn1cblxuZnVuY3Rpb24gaXNVbmRlZmluZWQoYXJnKSB7XG4gIHJldHVybiBhcmcgPT09IHZvaWQgMDtcbn1cbiIsImltcG9ydCB7RlNNfSBmcm9tICcuL3N0YXRlX21hY2hpbmUvU3RhdGVDb250YWluZXInO1xuXG5leHBvcnQge0ZTTX07IiwiaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tICcuL1RyYW5zaXRpb24nO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcblxuLyoqXG4gKiBBIGNsYXNzIHJlcHJlc2VudGluZyBhIHN0YXRlIGluIGEgc3RhdGUgbWFjaGluZVxuICovXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgQWJzdHJhY3RTdGF0ZTxTLCBUPiBleHRlbmRzIEV2ZW50RW1pdHRlciB7XG4gICAgcHJpdmF0ZSBhY3RpdmU6Ym9vbGVhbiA9IGZhbHNlOyAvLyBXaGV0aGVyIHRoaXMgc3RhdGUgaXMgY3VycmVudGx5IGFjdGl2ZVxuICAgIHByaXZhdGUgb3V0Z29pbmdUcmFuc2l0aW9uczpUcmFuc2l0aW9uPFMsVD5bXSA9IFtdOyAvLyBBbGwgb2YgdGhlIHRyYW5zaXRpb25zIHRoYXQgbGVhdmUgdGhpcyBzdGF0ZVxuICAgIHByaXZhdGUgaW5jb21pbmdUcmFuc2l0aW9uczpUcmFuc2l0aW9uPFMsVD5bXSA9IFtdOyAvLyBBbGwgb2YgdGhlIHRyYW5zaXRpb25zIHRoYXQgZW50ZXIgdGhpcyBzdGF0ZVxuICAgIHB1YmxpYyBhYnN0cmFjdCBpc1N0YXJ0U3RhdGUoKTpib29sZWFuOyAvLyBJcyB0aGlzIHdoZXJlIHRoZSBzdGF0ZSBtYWNoaWVuIHN0YXJ0c1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgcGF5bG9hZD86Uykge1xuICAgICAgICBzdXBlcigpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGRhdGEgYXR0YWNoZWQgdG8gdGhpcyBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRQYXlsb2FkKCk6UyB7IHJldHVybiB0aGlzLnBheWxvYWQ7IH07XG5cbiAgICAvKipcbiAgICAgKiBTZXQgdGhlIGRhdGEgYXR0YWNoZWQgdG8gdGhpcyBzdGF0ZVxuICAgICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBuZXcgcGF5bG9hZFxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRQYXlsb2FkKHBheWxvYWQ6Uyk6dm9pZCB7IHRoaXMucGF5bG9hZCA9IHBheWxvYWQ7IH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYWxsIG9mIHRoZSB0cmFuc2l0aW9ucyBsZWF2aW5nIHRoaXMgc3RhdGUgKHNob3VsZCBvbmx5IGJlIHVzZWQgaW50ZXJuYWxseSlcbiAgICAgKi9cbiAgICBwdWJsaWMgX2dldE91dGdvaW5nVHJhbnNpdGlvbnMoKTpUcmFuc2l0aW9uPFMsVD5bXSB7IHJldHVybiB0aGlzLm91dGdvaW5nVHJhbnNpdGlvbnM7IH07XG4gICAgLyoqXG4gICAgICogR2V0IGFsbCBvZiB0aGUgdHJhbnNpdGlvbnMgZW50ZXJpbmcgdGhpcyBzdGF0ZSAoc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5KVxuICAgICAqL1xuICAgIHB1YmxpYyBfZ2V0SW5jb21pbmdUcmFuc2l0aW9ucygpOlRyYW5zaXRpb248UyxUPltdIHsgcmV0dXJuIHRoaXMuaW5jb21pbmdUcmFuc2l0aW9uczsgfTtcblxuICAgIC8qKlxuICAgICAqIE1hcmsgYSBuZXcgdHJhbnNpdGlvbiBhcyBsZWF2aW5nIGZyb20gdGhpcyBzdGF0ZSAoc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5KVxuICAgICAqIEBwYXJhbSB0cmFuc2l0aW9uIFRoZSB0cmFuc2l0aW9uIHRvIGFkZCB0byB0aGUgbGlzdCBvZiBvdXRnb2luZyB0cmFuc2l0aW9uc1xuICAgICAqL1xuICAgIHB1YmxpYyBfYWRkT3V0Z29pbmdUcmFuc2l0aW9uKHRyYW5zaXRpb246VHJhbnNpdGlvbjxTLFQ+KTp2b2lkIHtcbiAgICAgICAgdGhpcy5vdXRnb2luZ1RyYW5zaXRpb25zLnB1c2godHJhbnNpdGlvbik7XG5cbiAgICAgICAgaWYodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uLnNldEVsaWdpYmxlKHRydWUpO1xuICAgICAgICAgICAgdHJhbnNpdGlvbi5hZGRMaXN0ZW5lcignZmlyZScsIHRoaXMub25PdXRnb2luZ1RyYW5zaXRpb25GaXJlZCk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0cmFuc2l0aW9uLnNldEVsaWdpYmxlKGZhbHNlKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSB0cmFuc2l0aW9uIGZyb20gdGhlIGxpc3Qgb2Ygb3V0Z29pbmcgdHJhbnNpdGlvbnNcbiAgICAgKiBAcGFyYW0gdHJhbnNpdGlvbiBUaGUgdHJhbnNpdGlvbiB0byByZW1vdmVcbiAgICAgKiBAcmV0dXJuIHRydWUgaWYgdGhlIHRyYW5zaXRpb24gd2FzIHJlbW92ZWQ7IGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBfcmVtb3ZlT3V0Z29pbmdUcmFuc2l0aW9uKHRyYW5zaXRpb246VHJhbnNpdGlvbjxTLFQ+KTpib29sZWFuIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm91dGdvaW5nVHJhbnNpdGlvbnMuaW5kZXhPZih0cmFuc2l0aW9uKTtcbiAgICAgICAgaWYoaW5kZXg+PTApIHtcbiAgICAgICAgICAgIHRoaXMub3V0Z29pbmdUcmFuc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgaWYodGhpcy5pc0FjdGl2ZSgpKSB7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5zZXRFbGlnaWJsZShmYWxzZSk7XG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi5yZW1vdmVMaXN0ZW5lcignZmlyZScsIHRoaXMub25PdXRnb2luZ1RyYW5zaXRpb25GaXJlZCk7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICByZXR1cm4gdHJ1ZTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJldHVybiBmYWxzZTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNYXJrIGEgbmV3IHRyYW5zaXRpb24gYXMgZ29pbmcgdG8gdGhpcyBzdGF0ZSAoc2hvdWxkIG9ubHkgYmUgdXNlZCBpbnRlcm5hbGx5KVxuICAgICAqIEBwYXJhbSB0cmFuc2l0aW9uIFRoZSB0cmFuc2l0aW9uIHRvIGFkZCB0byB0aGUgbGlzdCBvZiBpbmNvbWluZyB0cmFuc2l0aW9uc1xuICAgICAqL1xuICAgIHB1YmxpYyBfYWRkSW5jb21pbmdUcmFuc2l0aW9uKHRyYW5zaXRpb246VHJhbnNpdGlvbjxTLFQ+KTp2b2lkIHtcbiAgICAgICAgdGhpcy5pbmNvbWluZ1RyYW5zaXRpb25zLnB1c2godHJhbnNpdGlvbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSBhIHRyYW5zaXRpb24gZnJvbSB0aGUgbGlzdCBvZiBpbmNvbWluZyB0cmFuc2l0aW9uc1xuICAgICAqIEBwYXJhbSB0cmFuc2l0aW9uIFRoZSB0cmFuc2l0aW9uIHRvIHJlbW92ZVxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHRyYW5zaXRpb24gd2FzIHJlbW92ZWQ7IGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBfcmVtb3ZlSW5jb21pbmdUcmFuc2l0aW9uKHRyYW5zaXRpb246VHJhbnNpdGlvbjxTLFQ+KTpib29sZWFuIHtcbiAgICAgICAgY29uc3QgaW5kZXggPSB0aGlzLmluY29taW5nVHJhbnNpdGlvbnMuaW5kZXhPZih0cmFuc2l0aW9uKTtcbiAgICAgICAgaWYoaW5kZXg+PTApIHtcbiAgICAgICAgICAgIHRoaXMuaW5jb21pbmdUcmFuc2l0aW9ucy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQHJldHVybiB0cnVlIGlmIHRoaXMgc3RhdGUgaXMgYWN0aXZlIGFuZCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaXNBY3RpdmUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuYWN0aXZlOyB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHdoZXRoZXIgdGhpcyBzdGF0ZSBpcyBhY3RpdmUgb3Igbm90XG4gICAgICogQHBhcmFtIGFjdGl2ZSBXaGV0aGVyIG9yIG5vdCB0aGUgc3RhdGUgc2hvdWxkIGJlIGFjdGl2ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRJc0FjdGl2ZShhY3RpdmU6Ym9vbGVhbik6dm9pZCB7XG4gICAgICAgIHRoaXMuYWN0aXZlID0gYWN0aXZlO1xuICAgICAgICBpZih0aGlzLmlzQWN0aXZlKCkpIHtcbiAgICAgICAgICAgIHRoaXMuYWRkT3V0Z29pbmdUcmFuc2l0aW9uTGlzdGVuZXJzKCk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ2FjdGl2ZScsIHRoaXMpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhpcy5yZW1vdmVPdXRnb2luZ1RyYW5zaXRpb25MaXN0ZW5lcnMoKTtcbiAgICAgICAgICAgIHRoaXMuZW1pdCgnbm90X2FjdGl2ZScsIHRoaXMpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEVuYWJsZSBvdXRnb2luZyB0cmFuc2l0aW9uIGxpc3RlbmVycyBmb3Igd2hlbiB0aGlzIHN0YXRlIGlzIGFjdGl2ZVxuICAgICAqL1xuICAgIHByaXZhdGUgYWRkT3V0Z29pbmdUcmFuc2l0aW9uTGlzdGVuZXJzKCk6dm9pZCB7XG4gICAgICAgIHRoaXMub3V0Z29pbmdUcmFuc2l0aW9ucy5mb3JFYWNoKChvdCkgPT4ge1xuICAgICAgICAgICAgb3Quc2V0RWxpZ2libGUodHJ1ZSk7XG4gICAgICAgICAgICBvdC5hZGRMaXN0ZW5lcignZmlyZScsIHRoaXMub25PdXRnb2luZ1RyYW5zaXRpb25GaXJlZCk7XG4gICAgICAgIH0pO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogRGlzYWJsZSBvdXRnb2luZyB0cmFuc2l0aW9uIGxpc3RlbmVycyBmb3Igd2hlbiB0aGlzIHN0YXRlIGlzIGluYWN0aXZlXG4gICAgICovXG4gICAgcHJpdmF0ZSByZW1vdmVPdXRnb2luZ1RyYW5zaXRpb25MaXN0ZW5lcnMoKTp2b2lkIHtcbiAgICAgICAgdGhpcy5vdXRnb2luZ1RyYW5zaXRpb25zLmZvckVhY2goKG90KSA9PiB7XG4gICAgICAgICAgICBvdC5zZXRFbGlnaWJsZShmYWxzZSk7XG4gICAgICAgICAgICBvdC5yZW1vdmVMaXN0ZW5lcignZmlyZScsIHRoaXMub25PdXRnb2luZ1RyYW5zaXRpb25GaXJlZCk7XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDYWxsZWQgd2hlbiBhIHRyYW5zaXRpb24gbGVhdmluZyB0aGlzIHN0YXRlIHdhcyBmaXJlZFxuICAgICAqL1xuICAgIHByaXZhdGUgb25PdXRnb2luZ1RyYW5zaXRpb25GaXJlZCA9ICh0cmFuc2l0aW9uOlRyYW5zaXRpb248UyxUPiwgZXZlbnQ6YW55LCBzb3VyY2U6YW55KSA9PiB7XG4gICAgICAgIGlmKHRoaXMuaXNBY3RpdmUoKSkge1xuICAgICAgICAgICAgY29uc3QgdG9TdGF0ZSA9IHRyYW5zaXRpb24uZ2V0VG9TdGF0ZSgpO1xuICAgICAgICAgICAgXG4gICAgICAgICAgICAvLyBOZWVkIHRvIHNldCBzZWxmIHRvIGluYWN0aXZlICpiZWZvcmUqIHNldHRpbmcgdGhlIG90aGVyIHRvIGFjdGl2ZVxuICAgICAgICAgICAgLy8gaW4gY2FzZSBpdCdzIGEgdHJhbnNpdGlvbiBiYWNrIHRvIG15c2VsZlxuICAgICAgICAgICAgdGhpcy5zZXRJc0FjdGl2ZShmYWxzZSk7XG4gICAgICAgICAgICB0b1N0YXRlLnNldElzQWN0aXZlKHRydWUpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdSZWNlaXZlZCB0cmFuc2l0aW9uIGZpcmVkIGV2ZW50IHdoaWxlIG5vdCBhY3RpdmUnKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgdGhpcyBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmUoKTp2b2lkIHtcbiAgICAgICAgdGhpcy5yZW1vdmVPdXRnb2luZ1RyYW5zaXRpb25MaXN0ZW5lcnMoKTtcbiAgICAgICAgdGhpcy5pbmNvbWluZ1RyYW5zaXRpb25zLmZvckVhY2goKGl0KSA9PiBpdC5yZW1vdmUoKSk7XG4gICAgICAgIHRoaXMub3V0Z29pbmdUcmFuc2l0aW9ucy5mb3JFYWNoKChvdCkgPT4gb3QucmVtb3ZlKCkpO1xuICAgIH07XG59O1xuXG4vKipcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgc3RhcnRpbmcgc3RhdGVcbiAqL1xuZXhwb3J0IGNsYXNzIFN0YXJ0U3RhdGU8UyxUPiBleHRlbmRzIEFic3RyYWN0U3RhdGU8UyxUPiB7XG4gICAgY29uc3RydWN0b3IocGF5bG9hZD86Uykge1xuICAgICAgICBzdXBlcihwYXlsb2FkKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEFkZHMgYW4gb3V0Z29pbmcgdHJhbnNpdGlvbiAob25seSBvbmUgYWxsb3dlZClcbiAgICAgKiBAcGFyYW0gdHJhbnNpdGlvbiBUaGUgdHJhbnNpdGlvbiB0byBhZGRcbiAgICAgKi9cbiAgICBwdWJsaWMgX2FkZE91dGdvaW5nVHJhbnNpdGlvbih0cmFuc2l0aW9uOlRyYW5zaXRpb248UyxUPik6dm9pZCB7XG4gICAgICAgIGlmKHRoaXMuX2dldE91dGdvaW5nVHJhbnNpdGlvbnMoKS5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoJ0NhbiBvbmx5IGhhdmUgb25lIG91dGdvaW5nIHRyYW5zaXRpb24gZnJvbSBhIHN0YXJ0IHN0YXRlJyk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBzdXBlci5fYWRkT3V0Z29pbmdUcmFuc2l0aW9uKHRyYW5zaXRpb24pO1xuICAgICAgICB9XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBUaHJvd3MgYW4gZXhjZXB0aW9uOyBzdGFydCBzdGF0ZXMgY2Fubm90IGhhdmUgaW5jb21pbmcgdHJhbnNpdGlvbnNcbiAgICAgKi9cbiAgICBwdWJsaWMgX2FkZEluY29taW5nVHJhbnNpdGlvbih0cmFuc2l0aW9uOlRyYW5zaXRpb248UyxUPik6dm9pZCB7XG4gICAgICAgIHRocm93IG5ldyBFcnJvcignU3RhcnQgc3RhdGVzIGNhbm5vdCBoYXZlIGluY29taW5nIHRyYW5zaXRpb25zJyk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB0cnVlICh0byByZXByZXNlbnQgdGhhdCB0aGlzIGlzIGEgc3RhcnQgc3RhdGUpXG4gICAgICovXG4gICAgcHVibGljIGlzU3RhcnRTdGF0ZSgpOmJvb2xlYW4geyByZXR1cm4gdHJ1ZTsgfTtcbn07XG5cbi8qKlxuICogQSBjbGFzcyB0byByZXByZXNlbnQgYSBcIm5vcm1hbFwiIHN0YXRlXG4gKi9cbmV4cG9ydCBjbGFzcyBTdGF0ZTxTLFQ+IGV4dGVuZHMgQWJzdHJhY3RTdGF0ZTxTLFQ+IHtcbiAgICBjb25zdHJ1Y3RvcihwYXlsb2FkPzpTKSB7XG4gICAgICAgIHN1cGVyKHBheWxvYWQpO1xuICAgIH07XG4gICAgLyoqXG4gICAgICogQHJldHVybnMgZmFsc2UgKHRvIHJlcHJlc2VudCB0aGF0IHRoaXMgaXMgbm90IGEgc3RhcnQgc3RhdGUpXG4gICAgICovXG4gICAgcHVibGljIGlzU3RhcnRTdGF0ZSgpOmJvb2xlYW4geyByZXR1cm4gZmFsc2U7IH07XG59OyIsImltcG9ydCB7QWJzdHJhY3RTdGF0ZSwgU3RhcnRTdGF0ZSwgU3RhdGV9IGZyb20gJy4vU3RhdGUnO1xuaW1wb3J0IHtUcmFuc2l0aW9ufSBmcm9tICcuL1RyYW5zaXRpb24nO1xuaW1wb3J0IHsgRXZlbnRFbWl0dGVyIH0gZnJvbSAnZXZlbnRzJztcbmltcG9ydCB7IEhhc2hNYXAgfSBmcm9tICcuLi91dGlscy9IYXNoTWFwJztcblxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0YXRlQ29udGFpbmVyPFMsVD4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHByb3RlY3RlZCBzdGFydFN0YXRlOlN0YXJ0U3RhdGU8UyxUPjsgLy8gVGhlIHN0YXRlIHRoYXQgd2lsbCBiZSBhY3RpdmUgb24gY3JlYXRlXG4gICAgcHJpdmF0ZSBhY3RpdmVTdGF0ZTpBYnN0cmFjdFN0YXRlPFMsVD47IC8vIFRoZSBzdGF0ZSB0aGF0IGlzIGN1cnJlbnRseSBhY3RpdmVcbiAgICBwcm90ZWN0ZWQgc3RhdGVzOk1hcDxzdHJpbmcsIEFic3RyYWN0U3RhdGU8UyxUPj4gPSBuZXcgTWFwPHN0cmluZywgQWJzdHJhY3RTdGF0ZTxTLFQ+PigpOyAvLyBTdGF0ZXMgYXJlIGluZGV4ZWQgYnkgbmFtZSAoc3RyaW5nKVxuICAgIHByb3RlY3RlZCBzdGF0ZUxhYmVsczpNYXA8QWJzdHJhY3RTdGF0ZTxTLFQ+LCBzdHJpbmc+ID0gbmV3IE1hcDxBYnN0cmFjdFN0YXRlPFMsVD4sIHN0cmluZz4oKTsgLy8gTWFwIGJhY2sgZnJvbSBzdGF0ZXMgdG8gbGFiZWxzXG4gICAgcHJvdGVjdGVkIHRyYW5zaXRpb25zOk1hcDxzdHJpbmcsIFRyYW5zaXRpb248UyxUPj4gPSBuZXcgTWFwPHN0cmluZywgVHJhbnNpdGlvbjxTLFQ+PigpOyAvLyBUcmFuc2l0aW9ucyBhcmUgaW5kZXhlZCBieSBuYW1lIHRvb1xuICAgIHByb3RlY3RlZCB0cmFuc2l0aW9uTGFiZWxzOk1hcDxUcmFuc2l0aW9uPFMsVD4sIHN0cmluZz4gPSBuZXcgTWFwPFRyYW5zaXRpb248UyxUPiwgc3RyaW5nPigpOyAvLyBNYXAgYmFjayBmcm9tIHRyYW5zaXRpb25zIHRvIGxhYmVsc1xuICAgIC8qKlxuICAgICAqIENyZWF0ZSBhIG5ldyBTdGF0ZUNvbnRhaW5lclxuICAgICAqIEBwYXJhbSBzdGFydFN0YXRlTmFtZSBUaGUgbGFiZWwgZm9yIHRoZSBzdGFydCBzdGF0ZVxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHN0YXJ0U3RhdGVOYW1lOnN0cmluZz0nc3RhcnQnKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuc3RhcnRTdGF0ZSA9IHRoaXMuYWN0aXZlU3RhdGUgPSBuZXcgU3RhcnRTdGF0ZSgpO1xuICAgICAgICB0aGlzLnN0YXRlcy5zZXQoc3RhcnRTdGF0ZU5hbWUsIHRoaXMuc3RhcnRTdGF0ZSk7XG4gICAgICAgIHRoaXMuc3RhdGVMYWJlbHMuc2V0KHRoaXMuc3RhcnRTdGF0ZSwgc3RhcnRTdGF0ZU5hbWUpO1xuICAgICAgICB0aGlzLnN0YXJ0U3RhdGUuc2V0SXNBY3RpdmUodHJ1ZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGFiZWwgb2YgYSBzdGF0ZVxuICAgICAqIEBwYXJhbSBzdGF0ZSBUaGUgQWJzdHJhY3RTdGF0ZSBvYmplY3Qgd2UgYXJlIHNlYXJjaGluZyBmb3JcbiAgICAgKi9cbiAgICBwcm90ZWN0ZWQgZ2V0U3RhdGVMYWJlbChzdGF0ZTpBYnN0cmFjdFN0YXRlPFMsVD4pOnN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlTGFiZWxzLmdldChzdGF0ZSk7XG4gICAgfTtcbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiBhIHN0YXRlIGlzIGluIHRoaXMgY29udGFpbmVyXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgc3RhdGUgdG8gY2hlY2tcbiAgICAgKiBAcmV0dXJucyB0cnVlIGlmIHRoZSBzdGF0ZSBpcyBpbiB0aGlzIGNvbnRhaW5lcjsgZmFsc2Ugb3RoZXJ3aXNlXG4gICAgICovXG4gICAgcHVibGljIGhhc1N0YXRlKGxhYmVsOnN0cmluZyk6Ym9vbGVhbiB7IHJldHVybiB0aGlzLnN0YXRlcy5oYXMobGFiZWwpOyB9O1xuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RhdGUgb2JqZWN0IHJlcHJlc2VudGluZyBhIGdpdmVuIHN0YXRlXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSBzdGF0ZSB0byBnZXRcbiAgICAgKiBAcmV0dXJucyB0aGUgc3RhdGUgb2JqZWN0XG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFN0YXRlKGxhYmVsOnN0cmluZyk6QWJzdHJhY3RTdGF0ZTxTLFQ+IHsgcmV0dXJuIHRoaXMuc3RhdGVzLmdldChsYWJlbCkgYXMgQWJzdHJhY3RTdGF0ZTxTLFQ+OyB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBwYXlsb2FkIG9mIGEgZ2l2ZW4gc3RhdGVcbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSBzdGF0ZSB3aG9zZSBwYXlsb2FkIHdlIGFyZSBmZXRjaGluZ1xuICAgICAqIEByZXR1cm5zIFRoZSBzdGF0ZSdzIHBheWxvYWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U3RhdGVQYXlsb2FkKGxhYmVsOnN0cmluZyk6UyB7XG4gICAgICAgIGlmKHRoaXMuaGFzU3RhdGUobGFiZWwpKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZShsYWJlbCkuZ2V0UGF5bG9hZCgpO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCBzdGF0ZSB3aXRoIGxhYmVsICR7bGFiZWx9YCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogU2V0IHRoZSBwYXlsb2FkIG9mIGEgZ2l2ZW4gc3RhdGVcbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSAgc3RhdGUgd2hvc2UgcGF5bG9hZCB3ZSBhcmUgbW9kaWZ5aW5nXG4gICAgICogQHBhcmFtIHBheWxvYWQgVGhlIG5ldyBwYXlsb2FkXG4gICAgICovXG4gICAgcHVibGljIHNldFN0YXRlUGF5bG9hZChsYWJlbDpzdHJpbmcsIHBheWxvYWQ6Uyk6dGhpcyB7XG4gICAgICAgIGlmKHRoaXMuaGFzU3RhdGUobGFiZWwpKSB7XG4gICAgICAgICAgICB0aGlzLmdldFN0YXRlKGxhYmVsKS5zZXRQYXlsb2FkKHBheWxvYWQpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGF0ZVBheWxvYWRDaGFuZ2VkJywge3N0YXRlOmxhYmVsLCBwYXlsb2FkfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgc3RhdGUgd2l0aCBsYWJlbCAke2xhYmVsfWApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCBhIHRyYW5zaXRpb24gZnJvbSBpdHMgbGFiZWxcbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIGZvciB0aGUgdHJhbnNpdGlvblxuICAgICAqIEByZXR1cm5zIHRoZSB0cmFuc2l0aW9uIG9iamVjdFxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRUcmFuc2l0aW9uKGxhYmVsOnN0cmluZyk6VHJhbnNpdGlvbjxTLFQ+IHsgcmV0dXJuIHRoaXMudHJhbnNpdGlvbnMuZ2V0KGxhYmVsKSBhcyBUcmFuc2l0aW9uPFMsVD47IH07XG5cbiAgICAvKipcbiAgICAgKiBDaGVjayBpZiB0aGlzIGNvbnRhaW5lciBoYXMgYSBnaXZlbiB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgdHJhbnNpdGlvblxuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhpcyBzdGF0ZSBtYWNoaW5lIGhhcyBhIHRyYW5zaXRpb24gd2l0aCB0aGF0IGxhYmVsLCBmYWxzZSBvdGhlcndpc2VcbiAgICAgKi9cbiAgICBwdWJsaWMgaGFzVHJhbnNpdGlvbihsYWJlbDpzdHJpbmcpOmJvb2xlYW4geyByZXR1cm4gdGhpcy50cmFuc2l0aW9ucy5oYXMobGFiZWwpOyB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IHRoZSBsYWJlbCBvZiBhIHRyYW5zaXRpb25cbiAgICAgKiBAcGFyYW0gc3RhdGUgVGhlIFRyYW5zaXRpb24gb2JqZWN0IHdlIGFyZSBzZWFyY2hpbmcgZm9yXG4gICAgICovXG4gICAgcHJvdGVjdGVkIGdldFRyYW5zaXRpb25MYWJlbCh0cmFuc2l0aW9uOlRyYW5zaXRpb248UyxUPik6c3RyaW5nIHtcbiAgICAgICAgcmV0dXJuIHRoaXMudHJhbnNpdGlvbkxhYmVscy5nZXQodHJhbnNpdGlvbik7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgcGF5bG9hZCBvZiBhIGdpdmVuIHRyYW5zaXRpb25cbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHJldHVybnMgVGhlIHBheWxvYWQgZm9yIHRoZSB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgcHVibGljIGdldFRyYW5zaXRpb25QYXlsb2FkKGxhYmVsOnN0cmluZyk6VCB7XG4gICAgICAgIGlmKHRoaXMuaGFzVHJhbnNpdGlvbihsYWJlbCkpIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLmdldFRyYW5zaXRpb24obGFiZWwpLmdldFBheWxvYWQoKTtcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgQ291bGQgbm90IGZpbmQgdHJhbnNpdGlvbiAke2xhYmVsfWApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIFNldCB0aGUgcGF5bG9hZCBvZiBhIGdpdmVuIHRyYW5zaXRpb25cbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIHBheWxvYWQgVGhlIG5ldyBwYXlsb2FkXG4gICAgICovXG4gICAgcHVibGljIHNldFRyYW5zaXRpb25QYXlsb2FkKGxhYmVsOnN0cmluZywgcGF5bG9hZDpUKTp0aGlzIHtcbiAgICAgICAgaWYodGhpcy5oYXNUcmFuc2l0aW9uKGxhYmVsKSkge1xuICAgICAgICAgICAgdGhpcy5nZXRUcmFuc2l0aW9uKGxhYmVsKS5zZXRQYXlsb2FkKHBheWxvYWQpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uUGF5bG9hZENoYW5nZWQnLCB7dHJhbnNpdGlvbjpsYWJlbCwgcGF5bG9hZH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYENvdWxkIG5vdCBmaW5kIHRyYW5zaXRpb24gJHtsYWJlbH1gKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBGaXJlIGEgdHJhbnNpdGlvbiBieSBpdHMgbGFiZWxcbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIG9mIHRoZSB0cmFuc2l0aW9uXG4gICAgICogQHBhcmFtIGV2ZW50IFRoZSBjb250ZW50IG9mIHRoZSBldmVudFxuICAgICAqIEBwYXJhbSBzb3VyY2UgSW5mb3JtYXRpb24gYWJvdXQgdGhlIHNvdXJjZSBmaXJpbmcgdGhpcyB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgcHVibGljIGZpcmVUcmFuc2l0aW9uKGxhYmVsOnN0cmluZywgZXZlbnQ/OmFueSwgc291cmNlPzphbnkpOnRoaXMge1xuICAgICAgICBpZih0aGlzLmhhc1RyYW5zaXRpb24obGFiZWwpKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gdGhpcy5nZXRUcmFuc2l0aW9uKGxhYmVsKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24uZmlyZShldmVudCwgc291cmNlKTtcbiAgICAgICAgICAgIHJldHVybiB0aGlzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBDb3VsZCBub3QgZmluZCB0cmFuc2l0aW9uICR7bGFiZWx9YCk7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBmaXJlIGEgZ2l2ZW4gdHJhbnNpdGlvbiB3aGVuIGNhbGxlZFxuICAgICAqIEBwYXJhbSBsYWJlbCBUaGUgdHJhbnNpdGlvbiB0aGF0IHdlIGFyZSBnZXR0aW5nIGEgZmlyZSBmdW5jdGlvbiBmb3JcbiAgICAgKiBAcmV0dXJucyBhIGZ1bmN0aW9uIHRoYXQgd2lsbCBmaXJlIHRoZSBnaXZlbiB0cmFuc2l0aW9uXG4gICAgICovXG4gICAgcHVibGljIGdldEZpcmVGdW5jdGlvbihsYWJlbDpzdHJpbmcpOkZ1bmN0aW9uIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuZmlyZVRyYW5zaXRpb24uYmluZCh0aGlzLCBsYWJlbCk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEFkZCBhIG5ldyBzdGF0ZSB0byB0aGlzIGNvbnRhaW5lclxuICAgICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBwYXlsb2FkIG9mIHRoZSBuZXcgc3RhdGVcbiAgICAgKiBAcGFyYW0gbGFiZWwgKG9wdGlvbmFsKSB0aGUgbGFiZWwgb2YgdGhlIG5ldyBzdGF0ZTsgYXV0by1nZW5lcmF0ZWQgaWYgbm90IGdpdmVuXG4gICAgICogQHJldHVybnMgVGhlIG5ldyBzdGF0ZSdzIGxhYmVsXG4gICAgICovXG4gICAgcHVibGljIGFkZFN0YXRlKHBheWxvYWQ/OlMsIGxhYmVsOnN0cmluZz10aGlzLmdldFVuaXF1ZVN0YXRlTGFiZWwoKSk6c3RyaW5nIHtcbiAgICAgICAgaWYodGhpcy5oYXNTdGF0ZShsYWJlbCkpIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGFscmVhZHkgaGFzIGEgc3RhdGUgd2l0aCBsYWJlbCAke2xhYmVsfWApO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgY29uc3Qgc3RhdGUgPSBuZXcgU3RhdGU8UyxUPihwYXlsb2FkKTtcbiAgICAgICAgICAgIHRoaXMuc3RhdGVzLnNldChsYWJlbCwgc3RhdGUpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZUxhYmVscy5zZXQoc3RhdGUsIGxhYmVsKTtcbiAgICAgICAgICAgIHN0YXRlLmFkZExpc3RlbmVyKCdhY3RpdmUnLCB0aGlzLm9uU3RhdGVBY3RpdmUpO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCdzdGF0ZUFkZGVkJywge3N0YXRlOmxhYmVsLCBwYXlsb2FkfSk7XG4gICAgICAgICAgICByZXR1cm4gbGFiZWw7XG4gICAgICAgIH1cbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2FsbGVkIHdoZW5ldmVyIGEgc3RhdGUgaXMgYWN0aXZlXG4gICAgICovXG4gICAgcHJpdmF0ZSBvblN0YXRlQWN0aXZlID0gKHN0YXRlKSA9PiB7XG4gICAgICAgIHRoaXMuYWN0aXZlU3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5lbWl0KCdhY3RpdmVTdGF0ZUNoYW5nZWQnLCB7c3RhdGU6dGhpcy5nZXRTdGF0ZUxhYmVsKHN0YXRlKX0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSBzdGF0ZSBmcm9tIHRoZSBsaXN0IG9mIHN0YXRlc1xuICAgICAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIHN0YXRlIHRvIHJlbW92ZVxuICAgICAqL1xuICAgIHB1YmxpYyByZW1vdmVTdGF0ZShsYWJlbDpzdHJpbmcpOnRoaXMge1xuICAgICAgICBjb25zdCBzdGF0ZSA9IHRoaXMuZ2V0U3RhdGUobGFiZWwpO1xuICAgICAgICBpZihzdGF0ZSkge1xuICAgICAgICAgICAgc3RhdGUucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLnN0YXRlcy5kZWxldGUobGFiZWwpO1xuICAgICAgICAgICAgdGhpcy5zdGF0ZUxhYmVscy5kZWxldGUoc3RhdGUpO1xuICAgICAgICAgICAgc3RhdGUucmVtb3ZlTGlzdGVuZXIoJ2FjdGl2ZScsIHRoaXMub25TdGF0ZUFjdGl2ZSk7XG4gICAgICAgICAgICB0aGlzLmVtaXQoJ3N0YXRlUmVtb3ZlZCcsIHtzdGF0ZTpsYWJlbH0pO1xuICAgICAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIGNvbnRhaW5lciBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgd2l0aCBsYWJlbCAke2xhYmVsfWApO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgbmFtZSBvZiBhIHN0YXRlXG4gICAgICogQHBhcmFtIGZyb21MYWJlbCBUaGUgb2xkIHN0YXRlIGxhYmVsXG4gICAgICogQHBhcmFtIHRvTGFiZWwgVGhlIG5ldyBzdGF0ZSBsYWJlbFxuICAgICAqL1xuICAgIHB1YmxpYyByZW5hbWVTdGF0ZShmcm9tTGFiZWw6c3RyaW5nLCB0b0xhYmVsOnN0cmluZyk6dGhpcyB7XG4gICAgICAgIGlmKCF0aGlzLmhhc1N0YXRlKGZyb21MYWJlbCkpIHsgdGhyb3cgbmV3IEVycm9yKGBTdGF0ZSBjb250YWluZXIgZG9lcyBub3QgaGF2ZSBhIHN0YXRlIHdpdGggbGFiZWwgJHtmcm9tTGFiZWx9YCk7IH1cbiAgICAgICAgaWYodGhpcy5oYXNTdGF0ZSh0b0xhYmVsKSkgeyB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIGNvbnRhaW5lciBhbHJlYWR5IGhhcyBhIHN0YXRlIHdpdGggbGFiZWwgJHt0b0xhYmVsfWApOyB9XG5cbiAgICAgICAgY29uc3QgZnJvbVN0YXRlID0gdGhpcy5nZXRTdGF0ZShmcm9tTGFiZWwpO1xuICAgICAgICB0aGlzLnN0YXRlcy5kZWxldGUoZnJvbUxhYmVsKTtcbiAgICAgICAgdGhpcy5zdGF0ZXMuc2V0KHRvTGFiZWwsIGZyb21TdGF0ZSk7XG4gICAgICAgIHRoaXMuc3RhdGVMYWJlbHMuc2V0KGZyb21TdGF0ZSwgdG9MYWJlbCk7XG4gICAgICAgIHRoaXMuZW1pdCgnc3RhdGVSZW5hbWVkJywge2Zyb21OYW1lOmZyb21MYWJlbCwgdG9OYW1lOnRvTGFiZWx9KTtcbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB0aGUgbmFtZSBvZiBhIHRyYW5zaXRpb25cbiAgICAgKiBAcGFyYW0gZnJvbUxhYmVsIFRoZSBvbGQgdHJhbnNpdGlvbiBsYWJlbFxuICAgICAqIEBwYXJhbSB0b0xhYmVsIFRoZSBuZXcgdHJhbnNpdGlvbiBsYWJlbFxuICAgICAqL1xuICAgIHB1YmxpYyByZW5hbWVUcmFuc2l0aW9uKGZyb21MYWJlbDpzdHJpbmcsIHRvTGFiZWw6c3RyaW5nKTp0aGlzIHtcbiAgICAgICAgaWYoIXRoaXMuaGFzVHJhbnNpdGlvbihmcm9tTGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSB0cmFuc2l0aW9uIHdpdGggbGFiZWwgJHtmcm9tTGFiZWx9YCk7IH1cbiAgICAgICAgaWYodGhpcy5oYXNUcmFuc2l0aW9uKHRvTGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGFscmVhZHkgaGFzIGEgdHJhbnNpdGlvbiB3aXRoIGxhYmVsICR7dG9MYWJlbH1gKTsgfVxuXG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24oZnJvbUxhYmVsKTtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucy5kZWxldGUoZnJvbUxhYmVsKTtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9ucy5zZXQodG9MYWJlbCwgdHJhbnNpdGlvbik7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkxhYmVscy5zZXQodHJhbnNpdGlvbiwgdG9MYWJlbCk7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvblJlbmFtZWQnLCB7ZnJvbU5hbWU6ZnJvbUxhYmVsLCB0b05hbWU6dG9MYWJlbH0pO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQWRkIGEgbmV3IHRyYW5zaXRpb25cbiAgICAgKiBcbiAgICAgKiBAcGFyYW0gZnJvbUxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgc3RhdGUgdGhpcyB0cmFuc2l0aW9uIGxlYXZlcyBmcm9tXG4gICAgICogQHBhcmFtIHRvTGFiZWwgVGhlIGxhYmVsIG9mIHRoZSBzdGF0ZSB0aGlzIHRyYW5zaXRpb24gZ29lcyB0b1xuICAgICAqIEBwYXJhbSBwYXlsb2FkIFRoZSBwYXlsb2FkIGZvciB0aGUgbmV3IHRyYW5zaXRpb25cbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIGxhYmVsIGZvciB0aGUgbmV3IHRyYW5zaXRpb24gKGF1dG9tYXRpY2FsbHkgZGV0ZXJtaW5lZCBpZiBub3QgZ2l2ZW4pXG4gICAgICogXG4gICAgICogQHJldHVybnMgVGhlIGxhYmVsIG9mIHRoZSBuZXcgdHJhbnNpdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyBhZGRUcmFuc2l0aW9uKGZyb21MYWJlbDpzdHJpbmcsIHRvTGFiZWw6c3RyaW5nLCBwYXlsb2FkPzphbnksIGxhYmVsOnN0cmluZz10aGlzLmdldFVuaXF1ZVRyYW5zaXRpb25MYWJlbCgpKTpzdHJpbmcge1xuICAgICAgICBpZighdGhpcy5oYXNTdGF0ZShmcm9tTGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7ZnJvbUxhYmVsfWApOyB9XG4gICAgICAgIGlmKCF0aGlzLmhhc1N0YXRlKHRvTGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7dG9MYWJlbH1gKTsgfVxuXG4gICAgICAgIGlmKHRoaXMuaGFzVHJhbnNpdGlvbihsYWJlbCkpIHsgdGhyb3cgbmV3IEVycm9yKGBDb250YWluZXIgYWxyZWFkeSBoYXMgYSB0cmFuc2l0aW9uIHdpdGggbGFiZWwgJHtsYWJlbH1gKSB9O1xuXG4gICAgICAgIGNvbnN0IGZyb21TdGF0ZSA9IHRoaXMuZ2V0U3RhdGUoZnJvbUxhYmVsKTtcbiAgICAgICAgY29uc3QgdG9TdGF0ZSA9IHRoaXMuZ2V0U3RhdGUodG9MYWJlbCk7XG5cbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbiA9IG5ldyBUcmFuc2l0aW9uKGZyb21TdGF0ZSwgdG9TdGF0ZSwgcGF5bG9hZCk7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbnMuc2V0KGxhYmVsLCB0cmFuc2l0aW9uKTtcbiAgICAgICAgdGhpcy50cmFuc2l0aW9uTGFiZWxzLnNldCh0cmFuc2l0aW9uLCBsYWJlbCk7XG4gICAgICAgIHRoaXMuZW1pdCgndHJhbnNpdGlvbkFkZGVkJywge3RyYW5zaXRpb246bGFiZWwsIGZyb206ZnJvbUxhYmVsLCB0bzp0b0xhYmVsLCBwYXlsb2FkfSk7XG5cbiAgICAgICAgcmV0dXJuIGxhYmVsO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBSZW1vdmUgYSB0cmFuc2l0aW9uIGJ5IGxhYmVsXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSBsYWJlbCBvZiB0aGUgdHJhbnNpdGlvbiB0byByZW1vdmVcbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlVHJhbnNpdGlvbihsYWJlbDpzdHJpbmcpOnRoaXMge1xuICAgICAgICBpZih0aGlzLmhhc1RyYW5zaXRpb24obGFiZWwpKSB7XG4gICAgICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gdGhpcy5nZXRUcmFuc2l0aW9uKGxhYmVsKTtcbiAgICAgICAgICAgIHRyYW5zaXRpb24ucmVtb3ZlKCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25zLmRlbGV0ZShsYWJlbCk7XG4gICAgICAgICAgICB0aGlzLnRyYW5zaXRpb25MYWJlbHMuZGVsZXRlKHRyYW5zaXRpb24pO1xuICAgICAgICAgICAgdGhpcy5lbWl0KCd0cmFuc2l0aW9uUmVtb3ZlZCcsIHt0cmFuc2l0aW9uOmxhYmVsfSk7XG4gICAgICAgICAgICByZXR1cm4gdGhpcztcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHRocm93IG5ldyBFcnJvcignQ291bGQgbm90IGZpbmQgdHJhbnNpdGlvbicpO1xuICAgICAgICB9XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGFiZWwgb2YgdGhlIGFjdGl2ZSBzdGF0ZVxuICAgICAqIEByZXR1cm5zIFRoZSBsYWJlbCBvZiB0aGUgY3VycmVudGx5IGFjdGl2ZSBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRBY3RpdmVTdGF0ZSgpOnN0cmluZyB7IHJldHVybiB0aGlzLmdldFN0YXRlTGFiZWwodGhpcy5hY3RpdmVTdGF0ZSk7IH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2VzIHdoaWNoIHN0YXRlIGlzIGFjdGl2ZSBpbiB0aGlzIGNvbnRhaW5lclxuICAgICAqIEBwYXJhbSBsYWJlbCBUaGUgbGFiZWwgb2YgdGhlIG5ldyBhY3RpdmUgc3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0QWN0aXZlU3RhdGUobGFiZWw6c3RyaW5nKTp0aGlzIHtcbiAgICAgICAgaWYoIXRoaXMuaGFzU3RhdGUobGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7bGFiZWx9YCk7IH1cbiAgICAgICAgaWYodGhpcy5hY3RpdmVTdGF0ZSkge1xuICAgICAgICAgICAgdGhpcy5hY3RpdmVTdGF0ZS5zZXRJc0FjdGl2ZShmYWxzZSk7XG4gICAgICAgIH1cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0YXRlKGxhYmVsKTtcbiAgICAgICAgc3RhdGUuc2V0SXNBY3RpdmUodHJ1ZSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxhYmVsIG9mIGV2ZXJ5IHN0YXRlIGluIHRoaXMgY29udGFpbmVyXG4gICAgICogQHJldHVybnMgYSBsaXN0IG9mIHN0YXRlcyBpbiB0aGlzIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRTdGF0ZXMoKTpzdHJpbmdbXSB7XG4gICAgICAgIHJldHVybiBBcnJheS5mcm9tKHRoaXMuc3RhdGVzLmtleXMoKSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEByZXR1cm5zIGEgc3RhdGUgbmFtZSB0aGF0IHdpbGwgYmUgdW5pcXVlIGZvciB0aGlzIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRVbmlxdWVTdGF0ZUxhYmVsKCk6c3RyaW5nIHtcbiAgICAgICAgY29uc3QgcHJlZml4ID0gJ3N0YXRlXyc7XG4gICAgICAgIGxldCBpID0gMDtcbiAgICAgICAgd2hpbGUodGhpcy5oYXNTdGF0ZShgJHtwcmVmaXh9JHtpfWApKSB7IGkrKzsgfVxuICAgICAgICByZXR1cm4gYCR7cHJlZml4fSR7aX1gO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBhIHRyYW5zaXRpb24gbmFtZSB0aGF0IHdpbGwgYmUgdW5pcXVlIGZvciB0aGlzIGNvbnRhaW5lclxuICAgICAqL1xuICAgIHByb3RlY3RlZCBnZXRVbmlxdWVUcmFuc2l0aW9uTGFiZWwoKTpzdHJpbmcge1xuICAgICAgICBjb25zdCBwcmVmaXggPSAndHJhbnNpdGlvbl8nO1xuICAgICAgICBsZXQgaSA9IDA7XG4gICAgICAgIHdoaWxlKHRoaXMuaGFzVHJhbnNpdGlvbihgJHtwcmVmaXh9JHtpfWApKSB7IGkrKzsgfVxuICAgICAgICByZXR1cm4gYCR7cHJlZml4fSR7aX1gO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB0aGUgbmFtZSBvZiB0aGUgc3RhcnQgc3RhdGVcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0U3RhcnRTdGF0ZSgpOnN0cmluZyB7XG4gICAgICAgIHJldHVybiB0aGlzLmdldFN0YXRlTGFiZWwodGhpcy5zdGFydFN0YXRlKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hlY2sgaWYgYSBnaXZlbiBzdGF0ZSBpcyBhIHN0YXJ0IHN0YXRlXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSBzdGF0ZSB0byBjaGVja1xuICAgICAqIEByZXR1cm5zIHRydWUgaWYgdGhlIHN0YXRlIGlzIGEgc3RhcnQgc3RhdGUgYW5kIGZhbHNlIG90aGVyd2lzZVxuICAgICAqL1xuICAgIHB1YmxpYyBpc1N0YXJ0U3RhdGUobGFiZWw6c3RyaW5nKTpib29sZWFuIHtcbiAgICAgICAgaWYoIXRoaXMuaGFzU3RhdGUobGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7bGFiZWx9YCk7IH1cbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGUobGFiZWwpLmlzU3RhcnRTdGF0ZSgpO1xuICAgIH1cblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgbGlzdCBvZiB0cmFuc2l0aW9ucyBsZWF2aW5nIGEgc3RhdGVcbiAgICAgKiBAcGFyYW0gbGFiZWwgVGhlIHN0YXRlIG5hbWUgZm9yIHdoaWNoIHdlIGFyZSBnZXR0aW5nIG91dGdvaW5nIHRyYW5zaXRpb25zXG4gICAgICovXG4gICAgcHVibGljIGdldE91dGdvaW5nVHJhbnNpdGlvbnMobGFiZWw6c3RyaW5nKTpzdHJpbmdbXSB7XG4gICAgICAgIGlmKCF0aGlzLmhhc1N0YXRlKGxhYmVsKSkgeyB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIGNvbnRhaW5lciBkb2VzIG5vdCBoYXZlIGEgc3RhdGUgd2l0aCBsYWJlbCAke2xhYmVsfWApOyB9XG4gICAgICAgIGNvbnN0IHN0YXRlID0gdGhpcy5nZXRTdGF0ZShsYWJlbCk7XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb25zID0gc3RhdGUuX2dldE91dGdvaW5nVHJhbnNpdGlvbnMoKTtcbiAgICAgICAgcmV0dXJuIHRyYW5zaXRpb25zLm1hcCgodCkgPT4gdGhpcy5nZXRUcmFuc2l0aW9uTGFiZWwodCkpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIGxpc3Qgb2YgdHJhbnNpdGlvbnMgZW50ZXJpbmcgYSBzdGF0ZVxuICAgICAqIEBwYXJhbSBsYWJlbCBUaGUgc3RhdGUgbmFtZSBmb3Igd2hpY2ggd2UgYXJlIGdldHRpbmcgaW5jb21pbmcgdHJhbnNpdGlvbnNcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0SW5jb21pbmdUcmFuc2l0aW9ucyhsYWJlbDpzdHJpbmcpOnN0cmluZ1tdIHtcbiAgICAgICAgaWYoIXRoaXMuaGFzU3RhdGUobGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7bGFiZWx9YCk7IH1cbiAgICAgICAgY29uc3Qgc3RhdGUgPSB0aGlzLmdldFN0YXRlKGxhYmVsKTtcbiAgICAgICAgY29uc3QgdHJhbnNpdGlvbnMgPSBzdGF0ZS5fZ2V0SW5jb21pbmdUcmFuc2l0aW9ucygpO1xuICAgICAgICByZXR1cm4gdHJhbnNpdGlvbnMubWFwKCh0KSA9PiB0aGlzLmdldFRyYW5zaXRpb25MYWJlbCh0KSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RhdGUgdGhhdCBhIHRyYW5zaXRpb24gZ29lcyB0b1xuICAgICAqIEBwYXJhbSBsYWJlbCBUaGUgdHJhbnNpdGlvbiBsYWJlbFxuICAgICAqIEByZXR1cm5zIFRoZSBsYWJlbCBvZiB0aGUgc3RhdGUgdGhpcyB0cmFuc2l0aW9uIGdvZXMgdG9cbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0VHJhbnNpdGlvblRvKGxhYmVsOnN0cmluZyk6c3RyaW5nIHtcbiAgICAgICAgaWYoIXRoaXMuaGFzVHJhbnNpdGlvbihsYWJlbCkpIHsgdGhyb3cgbmV3IEVycm9yKGBTdGF0ZSBjb250YWluZXIgZG9lcyBub3QgaGF2ZSBhIHRyYW5zaXRpb24gd2l0aCBsYWJlbCAke2xhYmVsfWApOyB9XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24obGFiZWwpO1xuICAgICAgICByZXR1cm4gdGhpcy5nZXRTdGF0ZUxhYmVsKHRyYW5zaXRpb24uZ2V0VG9TdGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogR2V0IGhlIHN0YXRlIHRoYXQgYSB0cmFuc2l0aW9uIGxlYXZlcyBmcm9tXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSB0cmFuc2l0aW9uIGxhYmVsXG4gICAgICogQHJldHVybnMgVGhlIGxhYmVsIG9mIHRoZSBzdGF0ZSB0aGF0IHRoaXMgdHJhbnNpdGlvbiBsZWF2ZXMgZnJvbVxuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUcmFuc2l0aW9uRnJvbShsYWJlbDpzdHJpbmcpOnN0cmluZyB7XG4gICAgICAgIGlmKCF0aGlzLmhhc1RyYW5zaXRpb24obGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSB0cmFuc2l0aW9uIHdpdGggbGFiZWwgJHtsYWJlbH1gKTsgfVxuICAgICAgICBjb25zdCB0cmFuc2l0aW9uID0gdGhpcy5nZXRUcmFuc2l0aW9uKGxhYmVsKTtcbiAgICAgICAgcmV0dXJuIHRoaXMuZ2V0U3RhdGVMYWJlbCh0cmFuc2l0aW9uLmdldEZyb21TdGF0ZSgpKTtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ2hhbmdlIHRoZSBzdGF0ZSB0aGF0IGEgdHJhbnNpdGlvbiBnb2VzIHRvXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSB0cmFuc2l0aW9uIGxhYmVsXG4gICAgICogQHBhcmFtIHRvU3RhdGUgVGhlIGxhYmVsIG9mIHRoZSBzdGF0ZSB0aGF0IGl0IHNob3VsZCBub3cgZ28gdG9cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0VHJhbnNpdGlvblRvKGxhYmVsOnN0cmluZywgdG9TdGF0ZTpzdHJpbmcpOnRoaXMge1xuICAgICAgICBpZighdGhpcy5oYXNUcmFuc2l0aW9uKGxhYmVsKSkgeyB0aHJvdyBuZXcgRXJyb3IoYFN0YXRlIGNvbnRhaW5lciBkb2VzIG5vdCBoYXZlIGEgdHJhbnNpdGlvbiB3aXRoIGxhYmVsICR7bGFiZWx9YCk7IH1cbiAgICAgICAgaWYoIXRoaXMuaGFzU3RhdGUodG9TdGF0ZSkpIHsgdGhyb3cgbmV3IEVycm9yKGBTdGF0ZSBjb250YWluZXIgZG9lcyBub3QgaGF2ZSBhIHN0YXRlIHdpdGggbGFiZWwgJHt0b1N0YXRlfWApOyB9XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24obGFiZWwpO1xuICAgICAgICB0cmFuc2l0aW9uLnNldFRvU3RhdGUodGhpcy5nZXRTdGF0ZSh0b1N0YXRlKSk7XG4gICAgICAgIHJldHVybiB0aGlzO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2UgdGhlIHN0YXRlIHRoYXQgYSB0cmFuc2l0aW9uIGxlYXZlcyBmcm9tXG4gICAgICogQHBhcmFtIGxhYmVsIFRoZSB0cmFuc2l0aW9uIGxhYmVsXG4gICAgICogQHBhcmFtIGZyb21TdGF0ZSBUaGUgbGFiZWwgb2YgdGhlIHN0YXRlIHRoYXQgaXQgc2hvdWxkIG5vdyBsZWF2ZSBmcm9tXG4gICAgICovXG4gICAgcHVibGljIHNldFRyYW5zaXRpb25Gcm9tKGxhYmVsOnN0cmluZywgZnJvbVN0YXRlOnN0cmluZyk6dGhpcyB7XG4gICAgICAgIGlmKCF0aGlzLmhhc1RyYW5zaXRpb24obGFiZWwpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSB0cmFuc2l0aW9uIHdpdGggbGFiZWwgJHtsYWJlbH1gKTsgfVxuICAgICAgICBpZighdGhpcy5oYXNTdGF0ZShmcm9tU3RhdGUpKSB7IHRocm93IG5ldyBFcnJvcihgU3RhdGUgY29udGFpbmVyIGRvZXMgbm90IGhhdmUgYSBzdGF0ZSB3aXRoIGxhYmVsICR7ZnJvbVN0YXRlfWApOyB9XG4gICAgICAgIGNvbnN0IHRyYW5zaXRpb24gPSB0aGlzLmdldFRyYW5zaXRpb24obGFiZWwpO1xuICAgICAgICB0cmFuc2l0aW9uLnNldEZyb21TdGF0ZSh0aGlzLmdldFN0YXRlKGZyb21TdGF0ZSkpO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29udmVydCB0aGlzIHN0YXRlIG1hY2hpbmUgaW50byBhIHByaW50YWJsZSByZXByZXNlbnRhdGlvblxuICAgICAqL1xuICAgIHB1YmxpYyB0b1N0cmluZygpOnN0cmluZyB7XG4gICAgICAgIGNvbnN0IGRpdmlkZXJXaWR0aCA9IDQwO1xuICAgICAgICBjb25zdCBkaXZpZGVyID0gJ34nLnJlcGVhdChkaXZpZGVyV2lkdGgpO1xuICAgICAgICBjb25zdCBzdGF0ZVdpZHRoID0gMTA7XG4gICAgICAgIGNvbnN0IHRhYldpZHRoID0gNDtcbiAgICAgICAgY29uc3Qgc3BhY2VPdXQgPSAod29yZDpzdHJpbmcpOnN0cmluZyA9PiB7XG4gICAgICAgICAgICBjb25zdCB3b3JkTGVuZ3RoID0gd29yZC5sZW5ndGg7XG4gICAgICAgICAgICBjb25zdCBzcGFjZXNCZWZvcmUgPSBNYXRoLnJvdW5kKChkaXZpZGVyV2lkdGggLSB3b3JkTGVuZ3RoKS8yKTtcbiAgICAgICAgICAgIHJldHVybiAnICcucmVwZWF0KHNwYWNlc0JlZm9yZSkgKyB3b3JkO1xuICAgICAgICB9O1xuICAgICAgICBjb25zdCBwYWQgPSAod29yZDpzdHJpbmcsIHdpZHRoOm51bWJlcik6c3RyaW5nID0+IHtcbiAgICAgICAgICAgIGNvbnN0IHRvQWRkID0gd2lkdGggLSB3b3JkLmxlbmd0aDtcbiAgICAgICAgICAgIGlmKHRvQWRkID4gMCkge1xuICAgICAgICAgICAgICAgIHJldHVybiB3b3JkICsgJyAnLnJlcGVhdCh0b0FkZCk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIHJldHVybiB3b3JkO1xuICAgICAgICAgICAgfVxuICAgICAgICB9O1xuICAgICAgICBsZXQgcnY6c3RyaW5nID0gYCR7ZGl2aWRlcn1cXG4ke3NwYWNlT3V0KCdGU00nKX1cXG4ke2RpdmlkZXJ9XFxuYDtcbiAgICAgICAgdGhpcy5nZXRTdGF0ZXMoKS5mb3JFYWNoKChzdGF0ZSkgPT4ge1xuICAgICAgICAgICAgcnYgKz0gYCR7cGFkKHN0YXRlKyc6Jywgc3RhdGVXaWR0aCl9ICR7dGhpcy5nZXRTdGF0ZVBheWxvYWQoc3RhdGUpfVxcbmA7XG5cbiAgICAgICAgICAgIGNvbnN0IG91dGdvaW5nVHJhbnNpdGlvbnMgPSB0aGlzLmdldE91dGdvaW5nVHJhbnNpdGlvbnMoc3RhdGUpO1xuICAgICAgICAgICAgaWYob3V0Z29pbmdUcmFuc2l0aW9ucy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAgICAgb3V0Z29pbmdUcmFuc2l0aW9ucy5mb3JFYWNoKCh0KSA9PiB7XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHBheWxvYWQgPSB0aGlzLmdldFRyYW5zaXRpb25QYXlsb2FkKHQpO1xuICAgICAgICAgICAgICAgICAgICBydiArPSBwYWQoYCR7JyAnLnJlcGVhdCh0YWJXaWR0aCl9IC0tKCR7dH0pLS0+ICR7dGhpcy5nZXRUcmFuc2l0aW9uVG8odCl9YCwgMzApO1xuICAgICAgICAgICAgICAgICAgICBydiArPSBgOiAke3RoaXMuZ2V0VHJhbnNpdGlvblBheWxvYWQodCl9XFxuYDtcbiAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBDbGVhbiB1cCBhbGwgb2YgdGhlIG9iamVjdHMgc3RvcmVkIGluIHRoaXMgY29udGFpbmVyXG4gICAgICovXG4gICAgcHVibGljIGRlc3Ryb3koKTp2b2lkIHtcbiAgICAgICAgdGhpcy5zdGF0ZXMuY2xlYXIoKTtcbiAgICAgICAgdGhpcy5zdGF0ZUxhYmVscy5jbGVhcigpO1xuICAgICAgICB0aGlzLnRyYW5zaXRpb25zLmNsZWFyKCk7XG4gICAgICAgIHRoaXMudHJhbnNpdGlvbkxhYmVscy5jbGVhcigpO1xuICAgICAgICB0aGlzLmVtaXQoJ2Rlc3Ryb3llZCcpO1xuICAgIH07XG59O1xuXG50eXBlIFBhaXI8RT4gPSBbRSxFXTtcbmV4cG9ydCB0eXBlIEVxdWFsaXR5Q2hlY2s8RT4gPSAoaTE6RSwgaTI6RSkgPT4gYm9vbGVhbjtcbmV4cG9ydCB0eXBlIFNpbWlsYXJpdHlTY29yZTxFPiA9IChpMTpFLCBpMjpFKSA9PiBudW1iZXI7XG5jb25zdCBkZWZhdWx0RXF1YWxpdHlDaGVjazpFcXVhbGl0eUNoZWNrPGFueT4gPSAoYTphbnksIGI6YW55KSA9PiBhPT09YjtcbmNvbnN0IGRlZmF1bHRTaW1pbGFyaXR5U2NvcmU6U2ltaWxhcml0eVNjb3JlPGFueT4gPSAoYTphbnksIGI6YW55KSA9PiBhPT09YiA/IDEgOiAwO1xuXG5leHBvcnQgY2xhc3MgRlNNPFMsVD4gZXh0ZW5kcyBTdGF0ZUNvbnRhaW5lcjxTLFQ+IHtcbiAgICBjb25zdHJ1Y3Rvcihwcml2YXRlIHRyYW5zaXRpb25zRXF1YWw6RXF1YWxpdHlDaGVjazxUPj1kZWZhdWx0RXF1YWxpdHlDaGVjayxcbiAgICAgICAgICAgICAgICBwcml2YXRlIHRyYW5zaXRpb25TaW1pbGFyaXR5U2NvcmU6U2ltaWxhcml0eVNjb3JlPFQ+PWRlZmF1bHRTaW1pbGFyaXR5U2NvcmUsXG4gICAgICAgICAgICAgICAgcHJpdmF0ZSBzdGF0ZVNpbWlsYXJpdHlTY29yZTpTaW1pbGFyaXR5U2NvcmU8Uz49ZGVmYXVsdFNpbWlsYXJpdHlTY29yZSxcbiAgICAgICAgICAgICAgICBzdGFydFN0YXRlTmFtZT86c3RyaW5nKSB7XG4gICAgICAgIHN1cGVyKHN0YXJ0U3RhdGVOYW1lKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIEl0ZXJhdGUgYW5kIG1lcmdlIHRoZSBiZXN0IGNhbmRpZGF0ZXNcbiAgICAgKi9cbiAgICBwdWJsaWMgaXRlcmF0ZU1lcmdlKCk6dm9pZCB7XG4gICAgICAgIGNvbnN0IHNpbWlsYXJpdHlTY29yZXMgPSB0aGlzLmNvbXB1dGVTaW1pbGFyaXR5U2NvcmVzKCk7XG4gICAgICAgIGNvbnN0IHNvcnRlZFN0YXRlcyA9IEFycmF5LmZyb20oc2ltaWxhcml0eVNjb3Jlcy5lbnRyaWVzKCkpLnNvcnQoKGEsIGIpID0+IGJbMV0tYVsxXSk7XG4gICAgICAgIGNvbnNvbGUubG9nKHNvcnRlZFN0YXRlcyk7XG5cbiAgICAgICAgaWYoc29ydGVkU3RhdGVzLmxlbmd0aCA+IDApIHtcbiAgICAgICAgICAgIGNvbnN0IFt0b01lcmdlUzEsIHRvTWVyZ2VTMl0gPSBzb3J0ZWRTdGF0ZXNbMF1bMF07XG4gICAgICAgICAgICB0aGlzLm1lcmdlU3RhdGVzKHRvTWVyZ2VTMSwgdG9NZXJnZVMyKTtcbiAgICAgICAgfVxuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyBldmVyeSBwb3NzaWJsZSBwYWlyaW5nIG9mIHN0YXRlc1xuICAgICAqL1xuICAgIHByaXZhdGUgZ2V0U3RhdGVQYWlycygpOlBhaXI8QWJzdHJhY3RTdGF0ZTxTLFQ+PltdIHtcbiAgICAgICAgY29uc3QgcnY6UGFpcjxBYnN0cmFjdFN0YXRlPFMsVD4+W10gPSBbXTtcbiAgICAgICAgY29uc3Qgc3RhdGVzID0gQXJyYXkuZnJvbSh0aGlzLnN0YXRlcy52YWx1ZXMoKSk7XG4gICAgICAgIGZvcihsZXQgaTpudW1iZXIgPSAwOyBpPHN0YXRlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3Qgc2kgPSBzdGF0ZXNbaV07XG4gICAgICAgICAgICBmb3IobGV0IGo6bnVtYmVyID0gaSsxOyBqPHN0YXRlcy5sZW5ndGg7IGorKykge1xuICAgICAgICAgICAgICAgIGNvbnN0IHNqID0gc3RhdGVzW2pdO1xuICAgICAgICAgICAgICAgIHJ2LnB1c2goW3NpLCBzal0pO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBydjtcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ29tcHV0ZSBhIHNpbWlsYXJpdHkgc2NvcmUgb2YgZXZlcnkgcGFpciBvZiBzdGF0ZXNcbiAgICAgKi9cbiAgICBwcml2YXRlIGNvbXB1dGVTaW1pbGFyaXR5U2NvcmVzKCk6TWFwPFBhaXI8QWJzdHJhY3RTdGF0ZTxTLFQ+PiwgbnVtYmVyPiB7XG4gICAgICAgIGNvbnN0IG51bUNvbW1vblRyYW5zaXRpb25zID0gbmV3IEhhc2hNYXA8UGFpcjxBYnN0cmFjdFN0YXRlPFMsVD4+LCBudW1iZXI+KChwMSwgcDIpID0+IHsgcmV0dXJuIHAxWzBdPT09cDJbMF0gJiYgcDFbMV09PT1wMlsxXTsgfSwgKHApPT57IHJldHVybiB0aGlzLmdldFN0YXRlTGFiZWwocFswXSkgKyB0aGlzLmdldFN0YXRlTGFiZWwocFsxXSk7IH0pO1xuICAgICAgICBjb25zdCBzdGF0ZVBhaXJzID0gdGhpcy5nZXRTdGF0ZVBhaXJzKCk7XG4gICAgICAgIGNvbnN0IGVxdWl2YWxlbnRPdXRnb2luZ1RyYW5zaXRpb25zOk1hcDxQYWlyPEFic3RyYWN0U3RhdGU8UyxUPj4sIFBhaXI8VHJhbnNpdGlvbjxTLFQ+PltdPiA9IG5ldyBNYXA8UGFpcjxBYnN0cmFjdFN0YXRlPFMsVD4+LCBQYWlyPFRyYW5zaXRpb248UyxUPj5bXT4oKTtcbiAgICAgICAgc3RhdGVQYWlycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBbc3RhdGUxLCBzdGF0ZTJdID0gcDtcbiAgICAgICAgICAgIGNvbnN0IGV0OlBhaXI8VHJhbnNpdGlvbjxTLFQ+PltdID0gdGhpcy5lcXVpdmFsZW50VHJhbnNpdGlvbnMoc3RhdGUxLl9nZXRPdXRnb2luZ1RyYW5zaXRpb25zKCksIHN0YXRlMi5fZ2V0T3V0Z29pbmdUcmFuc2l0aW9ucygpKTtcbiAgICAgICAgICAgIGVxdWl2YWxlbnRPdXRnb2luZ1RyYW5zaXRpb25zLnNldChwLCBldCk7XG4gICAgICAgICAgICBudW1Db21tb25UcmFuc2l0aW9ucy5zZXQocCwgZXQubGVuZ3RoKTtcbiAgICAgICAgfSk7XG4gICAgICAgIGNvbnN0IHJ2ID0gbmV3IE1hcDxQYWlyPEFic3RyYWN0U3RhdGU8UyxUPj4sIG51bWJlcj4oKTtcbiAgICAgICAgc3RhdGVQYWlycy5mb3JFYWNoKChwKSA9PiB7XG4gICAgICAgICAgICBjb25zdCBlcXVpdmFsZW50VHJhbnNpdGlvbnMgPSBlcXVpdmFsZW50T3V0Z29pbmdUcmFuc2l0aW9ucy5nZXQocCk7XG4gICAgICAgICAgICBlcXVpdmFsZW50VHJhbnNpdGlvbnMuZm9yRWFjaCgoZXQpID0+IHtcbiAgICAgICAgICAgICAgICBjb25zdCBbdDEsIHQyXSA9IGV0O1xuXG4gICAgICAgICAgICAgICAgY29uc3QgdDFEZXN0ID0gdDEuZ2V0VG9TdGF0ZSgpO1xuICAgICAgICAgICAgICAgIGNvbnN0IHQyRGVzdCA9IHQyLmdldFRvU3RhdGUoKTtcbiAgICAgICAgICAgICAgICBjb25zdCBzaW1pbGFyaXR5U2NvcmU6bnVtYmVyID0gbnVtQ29tbW9uVHJhbnNpdGlvbnMuZ2V0KFt0MURlc3QsIHQyRGVzdF0pIHx8IG51bUNvbW1vblRyYW5zaXRpb25zLmdldChbdDJEZXN0LCB0MURlc3RdKTtcbiAgICAgICAgICAgICAgICBydi5zZXQocCwgbnVtQ29tbW9uVHJhbnNpdGlvbnMuZ2V0KHApICsgc2ltaWxhcml0eVNjb3JlKTtcbiAgICAgICAgICAgIH0pO1xuICAgICAgICB9KTtcbiAgICAgICAgbnVtQ29tbW9uVHJhbnNpdGlvbnMuY2xlYXIoKTtcbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgYSBsaXN0IG9mIGVxdWl2YWxlbnQgdHJhbnNpdGlvbnMgZnJvbSB0d28gc2V0cyBvZiB0cmFuc2l0aW9uc1xuICAgICAqIEBwYXJhbSB0cmFuc2l0aW9uU2V0MSBUaGUgZmlyc3Qgc2V0IG9mIHRyYW5zaXRpb25zXG4gICAgICogQHBhcmFtIHRyYW5zaXRpb25TZXQyIFRoZSBzZWNvbmQgc2V0IG9mIHRyYW5zaXRpb25zXG4gICAgICogQHJldHVybnMgQSBsaXN0IG9mIHBhaXJzIG9mIHRyYW5zaXRpb25zIHRoYXQgYXJlIGNvbW1vbiBiZXR3ZWVuIHRyYW5zaXRpb25TZXQxIGFuZCB0cmFuc2l0aW9uU2V0MlxuICAgICAqL1xuICAgIHByaXZhdGUgZXF1aXZhbGVudFRyYW5zaXRpb25zKHRyYW5zaXRpb25TZXQxOlRyYW5zaXRpb248UyxUPltdLCB0cmFuc2l0aW9uU2V0MjpUcmFuc2l0aW9uPFMsVD5bXSk6UGFpcjxUcmFuc2l0aW9uPFMsVD4+W10ge1xuICAgICAgICBjb25zdCBydjpQYWlyPFRyYW5zaXRpb248UyxUPj5bXSA9IFtdO1xuICAgICAgICBmb3IobGV0IGk6bnVtYmVyID0gMDsgaTx0cmFuc2l0aW9uU2V0MS5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgY29uc3QgdDEgPSB0cmFuc2l0aW9uU2V0MVtpXTtcbiAgICAgICAgICAgIGZvcihsZXQgajpudW1iZXIgPSAwOyBqPHRyYW5zaXRpb25TZXQyLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgICAgICAgY29uc3QgdDIgPSB0cmFuc2l0aW9uU2V0MltqXTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRyYW5zaXRpb25zRXF1YWwodDEuZ2V0UGF5bG9hZCgpLCB0Mi5nZXRQYXlsb2FkKCkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJ2LnB1c2goW3QxLCB0Ml0pO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHJ2O1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBBZGQgYSBuZXcgXCJ0cmFjZVwiIHRocm91Z2ggYSBwcm9ncmFtXG4gICAgICovXG4gICAgcHVibGljIGFkZFRyYWNlKHRyYWNlOltULFNdW10pOnZvaWQge1xuICAgICAgICBsZXQgY3VycmVudFN0YXRlID0gdGhpcy5nZXRTdGFydFN0YXRlKCk7XG4gICAgICAgIHRyYWNlLmZvckVhY2goKGl0ZW0pID0+IHtcbiAgICAgICAgICAgIGNvbnN0IFt0LHNdID0gaXRlbTtcblxuICAgICAgICAgICAgY29uc3Qgb3V0Z29pbmdUcmFuc2l0aW9ucyA9IHRoaXMuZ2V0U3RhdGUoY3VycmVudFN0YXRlKS5fZ2V0T3V0Z29pbmdUcmFuc2l0aW9ucygpO1xuICAgICAgICAgICAgbGV0IHRyYW5zaXRpb25FeGlzdHM6Ym9vbGVhbiA9IGZhbHNlO1xuICAgICAgICAgICAgbGV0IGV4aXN0aW5nU3RhdGU6QWJzdHJhY3RTdGF0ZTxTLFQ+O1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTxvdXRnb2luZ1RyYW5zaXRpb25zLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgY29uc3Qgb3V0Z29pbmdUcmFuc2l0aW9uID0gb3V0Z29pbmdUcmFuc2l0aW9uc1tpXTtcbiAgICAgICAgICAgICAgICBpZih0aGlzLnRyYW5zaXRpb25zRXF1YWwob3V0Z29pbmdUcmFuc2l0aW9uLmdldFBheWxvYWQoKSwgdCkpIHtcbiAgICAgICAgICAgICAgICAgICAgdHJhbnNpdGlvbkV4aXN0cyA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGV4aXN0aW5nU3RhdGUgPSBvdXRnb2luZ1RyYW5zaXRpb24uZ2V0VG9TdGF0ZSgpO1xuICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIGlmKHRyYW5zaXRpb25FeGlzdHMpIHtcbiAgICAgICAgICAgICAgICBjdXJyZW50U3RhdGUgPSB0aGlzLmdldFN0YXRlTGFiZWwoZXhpc3RpbmdTdGF0ZSk7XG4gICAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgICAgIGNvbnN0IG5ld1N0YXRlID0gdGhpcy5hZGRTdGF0ZShzKTtcbiAgICAgICAgICAgICAgICB0aGlzLmFkZFRyYW5zaXRpb24oY3VycmVudFN0YXRlLCBuZXdTdGF0ZSwgdCk7XG4gICAgICAgICAgICAgICAgY3VycmVudFN0YXRlID0gbmV3U3RhdGU7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0pO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBNZXJnZSB0d28gc3RhdGVzIHRvZ2V0aGVyXG4gICAgICovXG4gICAgcHJpdmF0ZSBtZXJnZVN0YXRlcyhyZW1vdmVTdGF0ZTpBYnN0cmFjdFN0YXRlPFMsVD4sIG1lcmdlSW50bzpBYnN0cmFjdFN0YXRlPFMsVD4sIHJlbW92ZVN0YWxlU3RhdGVzOmJvb2xlYW49dHJ1ZSk6dm9pZCB7XG4gICAgICAgIGNvbnN0IG1lcmdlSW50b091dGdvaW5nVHJhbnNpdGlvbnMgPSBtZXJnZUludG8uX2dldE91dGdvaW5nVHJhbnNpdGlvbnMoKTtcbiAgICAgICAgY29uc3Qgb3V0Z29pbmdUcmFuc2l0aW9uVGFyZ2V0czpTZXQ8QWJzdHJhY3RTdGF0ZTxTLFQ+PiA9IG5ldyBTZXQ8QWJzdHJhY3RTdGF0ZTxTLFQ+PigpO1xuXG4gICAgICAgIGxldCBvdXRnb2luZ1RyYW5zaXRpb25zOlRyYW5zaXRpb248UyxUPltdO1xuICAgICAgICBkbyB7XG4gICAgICAgICAgICBvdXRnb2luZ1RyYW5zaXRpb25zID0gcmVtb3ZlU3RhdGUuX2dldE91dGdvaW5nVHJhbnNpdGlvbnMoKTtcbiAgICAgICAgICAgIGNvbnN0IHQgPSBvdXRnb2luZ1RyYW5zaXRpb25zWzBdO1xuICAgICAgICAgICAgaWYodCkge1xuICAgICAgICAgICAgICAgIGNvbnN0IHRQYXlsb2FkID0gdC5nZXRQYXlsb2FkKCk7XG4gICAgICAgICAgICAgICAgbGV0IGhhc0NvbmZsaWN0OmJvb2xlYW4gPSBmYWxzZTtcbiAgICAgICAgICAgICAgICBmb3IobGV0IGkgaW4gbWVyZ2VJbnRvT3V0Z29pbmdUcmFuc2l0aW9ucykge1xuICAgICAgICAgICAgICAgICAgICBjb25zdCB0MiA9IG1lcmdlSW50b091dGdvaW5nVHJhbnNpdGlvbnNbaV07XG4gICAgICAgICAgICAgICAgICAgIGNvbnN0IHQyUGF5bG9hZCA9IHQyLmdldFBheWxvYWQoKTtcbiAgICAgICAgICAgICAgICAgICAgaWYodGhpcy50cmFuc2l0aW9uc0VxdWFsKHRQYXlsb2FkLCB0MlBheWxvYWQpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBoYXNDb25mbGljdCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBpZihoYXNDb25mbGljdCkge1xuICAgICAgICAgICAgICAgICAgICBpZihyZW1vdmVTdGFsZVN0YXRlcykge1xuICAgICAgICAgICAgICAgICAgICAgICAgb3V0Z29pbmdUcmFuc2l0aW9uVGFyZ2V0cy5hZGQodC5nZXRUb1N0YXRlKCkpO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHQucmVtb3ZlKCk7XG4gICAgICAgICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgdC5zZXRGcm9tU3RhdGUobWVyZ2VJbnRvKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gd2hpbGUob3V0Z29pbmdUcmFuc2l0aW9ucy5sZW5ndGggPiAwKTtcblxuICAgICAgICBsZXQgaW5jb21pbmdUcmFuc2l0aW9uczpUcmFuc2l0aW9uPFMsVD5bXTtcbiAgICAgICAgZG8ge1xuICAgICAgICAgICAgaW5jb21pbmdUcmFuc2l0aW9ucyA9IHJlbW92ZVN0YXRlLl9nZXRJbmNvbWluZ1RyYW5zaXRpb25zKCk7XG4gICAgICAgICAgICBjb25zdCB0ID0gaW5jb21pbmdUcmFuc2l0aW9uc1swXTtcbiAgICAgICAgICAgIGlmKHQpIHtcbiAgICAgICAgICAgICAgICB0LnNldFRvU3RhdGUobWVyZ2VJbnRvKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfSB3aGlsZShpbmNvbWluZ1RyYW5zaXRpb25zLmxlbmd0aCA+IDApO1xuXG4gICAgICAgIHRoaXMucmVtb3ZlU3RhdGUodGhpcy5nZXRTdGF0ZUxhYmVsKHJlbW92ZVN0YXRlKSk7XG5cbiAgICAgICAgaWYocmVtb3ZlU3RhbGVTdGF0ZXMpIHtcbiAgICAgICAgICAgIG91dGdvaW5nVHJhbnNpdGlvblRhcmdldHMuZm9yRWFjaCgoc3RhdGUpID0+IHtcbiAgICAgICAgICAgICAgICBpZihzdGF0ZS5fZ2V0SW5jb21pbmdUcmFuc2l0aW9ucygpLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgICAgICAgICBzdGF0ZS5yZW1vdmUoKTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5yZW1vdmVTdGF0ZSh0aGlzLmdldFN0YXRlTGFiZWwoc3RhdGUpKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfVxuICAgIH07XG59OyIsImltcG9ydCB7QWJzdHJhY3RTdGF0ZX0gZnJvbSAnLi9TdGF0ZSc7XG5pbXBvcnQgeyBFdmVudEVtaXR0ZXIgfSBmcm9tICdldmVudHMnO1xuXG4vKipcbiAqIEEgY2xhc3MgcmVwcmVzZW50aW5nIGEgdHJhbnNpdGlvbiBpbiBhIHN0YXRlIG1hY2hpbmVcbiAqL1xuZXhwb3J0IGNsYXNzIFRyYW5zaXRpb248UywgVD4gZXh0ZW5kcyBFdmVudEVtaXR0ZXIge1xuICAgIHByaXZhdGUgZWxpZ2libGU6Ym9vbGVhbjsgLy8gV2hldGhlciB0aGlzIHRyYW5zaXRpb24gaXMgZWxpZ2libGUgdG8gZmlyZSAodGhlIFwiZnJvbVwiIHN0YXRlIGlzIGFjdGl2ZSlcbiAgICAvKipcbiAgICAgKiBDb25zdHJ1Y3RvclxuICAgICAqIEBwYXJhbSBmcm9tU3RhdGUgVGhlIHN0YXRlIHRoYXQgdGhpcyB0cmFuc2l0aW9uIGxlYXZlcyBmcm9tXG4gICAgICogQHBhcmFtIHRvU3RhdGUgVGhlIHN0YXRlIHRoYXQgdGhpcyB0cmFuc2l0aW9uIGdvZXMgdG9cbiAgICAgKiBAcGFyYW0gcGF5bG9hZCBUaGUgaW5mb3JtYXRpb24gc3RvcmVkIGluIHRoaXMgdHJhbnNpdGlvblxuICAgICAqL1xuICAgIGNvbnN0cnVjdG9yKHByaXZhdGUgZnJvbVN0YXRlOkFic3RyYWN0U3RhdGU8UyxUPiwgcHJpdmF0ZSB0b1N0YXRlOkFic3RyYWN0U3RhdGU8UyxUPiwgcHJpdmF0ZSBwYXlsb2FkPzpUKSB7XG4gICAgICAgIHN1cGVyKCk7XG4gICAgICAgIHRoaXMuZnJvbVN0YXRlLl9hZGRPdXRnb2luZ1RyYW5zaXRpb24odGhpcyk7XG4gICAgICAgIHRoaXMudG9TdGF0ZS5fYWRkSW5jb21pbmdUcmFuc2l0aW9uKHRoaXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBAcmV0dXJucyB3aGV0aGVyIHRoaXMgdHJhbnNpdGlvbiBpcyBlbGlnaWJsZSB0byBmaXJlXG4gICAgICovXG4gICAgcHVibGljIGlzRWxpZ2libGUoKTpib29sZWFuIHsgcmV0dXJuIHRoaXMuZWxpZ2libGU7IH07XG5cbiAgICAvKipcbiAgICAgKiBDaGFuZ2Ugd2hldGhlciB0aGlzIHRyYW5zaXRpb24gaXMgZWxpZ2libGVcbiAgICAgKiBAcGFyYW0gZWxpZ2libGUgdHJ1ZSBpZiB0aGlzIHRyYW5zaXRpb24gc2hvdWxkIGJlIGVsaWdpYmxlIHRvIGZpcmUsIGZhbHNlIG90aGVyd2lzZS5cbiAgICAgKi9cbiAgICBwdWJsaWMgc2V0RWxpZ2libGUoZWxpZ2libGU6Ym9vbGVhbik6dm9pZCB7IHRoaXMuZWxpZ2libGUgPSBlbGlnaWJsZTsgfTtcblxuICAgIC8qKlxuICAgICAqIFJlbW92ZSB0aGlzIHRyYW5zaXRpb25cbiAgICAgKi9cbiAgICBwdWJsaWMgcmVtb3ZlKCk6dm9pZCB7XG4gICAgICAgIHRoaXMuZnJvbVN0YXRlLl9yZW1vdmVPdXRnb2luZ1RyYW5zaXRpb24odGhpcyk7XG4gICAgICAgIHRoaXMudG9TdGF0ZS5fcmVtb3ZlSW5jb21pbmdUcmFuc2l0aW9uKHRoaXMpO1xuICAgIH07XG5cbiAgICAvKipcbiAgICAgKiBHZXQgdGhlIHN0YXRlIHRoYXQgdGhpcyB0cmFuc2l0aW9uIGxlYXZlcyBmcm9tXG4gICAgICovXG4gICAgcHVibGljIGdldEZyb21TdGF0ZSgpOkFic3RyYWN0U3RhdGU8UyxUPiB7IHJldHVybiB0aGlzLmZyb21TdGF0ZTsgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGUgc3RhdGUgdGhhdCB0aGlzIHRyYW5zaXRpb24gZ29lcyB0b1xuICAgICAqL1xuICAgIHB1YmxpYyBnZXRUb1N0YXRlKCk6QWJzdHJhY3RTdGF0ZTxTLFQ+IHsgcmV0dXJuIHRoaXMudG9TdGF0ZTsgfTtcblxuICAgIC8qKlxuICAgICAqIFRlbGwgdGhlIHRyYW5zaXRpb24gdG8gZmlyZSAoaWYgdGhlIFwiZnJvbVwiIHN0YXRlIGlzIGFjdGl2ZSwgbW92ZSB0byB0aGUgXCJ0b1wiIHN0YXRlKVxuICAgICAqL1xuICAgIHB1YmxpYyBmaXJlKGV2ZW50PzphbnksIHNvdXJjZT86YW55KTp2b2lkIHtcbiAgICAgICAgdGhpcy5lbWl0KCdmaXJlJywgdGhpcywgZXZlbnQsIHNvdXJjZSk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIENoYW5nZSB3aGljaCBzdGF0ZSB0aGlzIHRyYW5zaXRpb24gbGVhdmVzIGZyb21cbiAgICAgKiBAcGFyYW0gc3RhdGUgVGhlIG5ldyBcImZyb21cIiBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRGcm9tU3RhdGUoc3RhdGU6QWJzdHJhY3RTdGF0ZTxTLFQ+KTp2b2lkIHtcbiAgICAgICAgdGhpcy5mcm9tU3RhdGUuX3JlbW92ZU91dGdvaW5nVHJhbnNpdGlvbih0aGlzKTtcbiAgICAgICAgdGhpcy5mcm9tU3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy5mcm9tU3RhdGUuX2FkZE91dGdvaW5nVHJhbnNpdGlvbih0aGlzKTtcbiAgICB9O1xuICAgIC8qKlxuICAgICAqIENoYW5nZSB3aGljaCBzdGF0ZSB0aGlzIHRyYW5zaXRpb24gZ29lcyB0b1xuICAgICAqIEBwYXJhbSBzdGF0ZSBUaGUgbmV3IFwidG9cIiBzdGF0ZVxuICAgICAqL1xuICAgIHB1YmxpYyBzZXRUb1N0YXRlKHN0YXRlOkFic3RyYWN0U3RhdGU8UyxUPik6dm9pZCB7XG4gICAgICAgIHRoaXMudG9TdGF0ZS5fcmVtb3ZlSW5jb21pbmdUcmFuc2l0aW9uKHRoaXMpO1xuICAgICAgICB0aGlzLnRvU3RhdGUgPSBzdGF0ZTtcbiAgICAgICAgdGhpcy50b1N0YXRlLl9hZGRJbmNvbWluZ1RyYW5zaXRpb24odGhpcyk7XG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEdldCB0aGlzIHRyYW5zaXRpb24ncyBjb250ZW50IHBheWxvYWRcbiAgICAgKi9cbiAgICBwdWJsaWMgZ2V0UGF5bG9hZCgpOlQgeyByZXR1cm4gdGhpcy5wYXlsb2FkOyB9O1xuICAgIC8qKlxuICAgICAqIFNldCB0aGlzIHRyYW5zaXRpb24ncyBwYXlsb2FkXG4gICAgICogQHBhcmFtIHBheWxvYWQgVGhlIG5ldyBwYXlsb2FkXG4gICAgICovXG4gICAgcHVibGljIHNldFBheWxvYWQocGF5bG9hZDpUKTp2b2lkIHtcbiAgICAgICAgdGhpcy5wYXlsb2FkID0gcGF5bG9hZDtcbiAgICB9O1xufTsiLCJleHBvcnQgdHlwZSBFcXVhbGl0eUNoZWNrPFQ+ID0gKHQxOlQsIHQyOlQpPT5ib29sZWFuO1xuZXhwb3J0IHR5cGUgSGFzaDxUPiA9ICh0OlQpPT5zdHJpbmc7XG5cbmV4cG9ydCBjbGFzcyBIYXNoTWFwPEssIFY+IHtcbiAgICBwcml2YXRlIG1hcDpNYXA8YW55LCBbSyxWXVtdPiA9IG5ldyBNYXA8YW55LCBbSyxWXVtdPigpO1xuICAgIHByaXZhdGUgc2l6ZTpudW1iZXIgPSAwO1xuICAgIHB1YmxpYyBjb25zdHJ1Y3RvcihcbiAgICAgICAgcHJpdmF0ZSBlcXVhbHM6RXF1YWxpdHlDaGVjazxLPiA9ICgoazE6SywgazI6SykgPT4gazEgPT09IGsyKSxcbiAgICAgICAgcHJpdmF0ZSBoYXNoOkhhc2g8Sz4gPSAoKGs6SykgPT4gYCR7a31gKVxuICAgICkge1xuXG4gICAgfTtcbiAgICBwdWJsaWMgc2V0KGtleTpLLCB2YWx1ZTpWKTp0aGlzIHtcbiAgICAgICAgY29uc3QgaGFzaCA9IHRoaXMuaGFzaChrZXkpO1xuICAgICAgICBpZih0aGlzLm1hcC5oYXMoaGFzaCkpIHtcbiAgICAgICAgICAgIGxldCBmb3VuZDpib29sZWFuID0gZmFsc2U7XG4gICAgICAgICAgICBjb25zdCBrdlBhaXJzID0gdGhpcy5tYXAuZ2V0KGhhc2gpO1xuICAgICAgICAgICAgZm9yKGxldCBpID0gMDsgaTxrdlBhaXJzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5lcXVhbHMoa3ZQYWlyc1tpXVswXSwga2V5KSkge1xuICAgICAgICAgICAgICAgICAgICBmb3VuZCA9IHRydWU7XG4gICAgICAgICAgICAgICAgICAgIGt2UGFpcnNbaV1bMV0gPSB2YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgYnJlYWs7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICAgICAgaWYoIWZvdW5kKSB7XG4gICAgICAgICAgICAgICAga3ZQYWlycy5wdXNoKFtrZXksIHZhbHVlXSk7XG4gICAgICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICB0aGlzLm1hcC5zZXQoaGFzaCwgW1trZXksIHZhbHVlXV0pO1xuICAgICAgICAgICAgdGhpcy5zaXplKys7XG4gICAgICAgIH1cbiAgICAgICAgcmV0dXJuIHRoaXM7XG4gICAgfTtcbiAgICBwdWJsaWMgZ2V0KGtleTpLKTpWIHtcbiAgICAgICAgY29uc3QgaGFzaCA9IHRoaXMuaGFzaChrZXkpO1xuICAgICAgICBpZih0aGlzLm1hcC5oYXMoaGFzaCkpIHtcbiAgICAgICAgICAgIGNvbnN0IGt2UGFpcnMgPSB0aGlzLm1hcC5nZXQoaGFzaCk7XG4gICAgICAgICAgICBmb3IobGV0IGkgPSAwOyBpPGt2UGFpcnMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICAgICAgICBpZih0aGlzLmVxdWFscyhrdlBhaXJzW2ldWzBdLCBrZXkpKSB7XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBrdlBhaXJzW2ldWzFdO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICB9O1xuICAgIHB1YmxpYyBoYXMoa2V5OkspOmJvb2xlYW4ge1xuICAgICAgICBjb25zdCBoYXNoID0gdGhpcy5oYXNoKGtleSk7XG4gICAgICAgIGlmKHRoaXMubWFwLmhhcyhoYXNoKSkge1xuICAgICAgICAgICAgY29uc3Qga3ZQYWlycyA9IHRoaXMubWFwLmdldChoYXNoKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8a3ZQYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZXF1YWxzKGt2UGFpcnNbaV1bMF0sIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9O1xuICAgIHB1YmxpYyBkZWxldGUoa2V5OkspOnRoaXMge1xuICAgICAgICBjb25zdCBoYXNoID0gdGhpcy5oYXNoKGtleSk7XG4gICAgICAgIGlmKHRoaXMubWFwLmhhcyhoYXNoKSkge1xuICAgICAgICAgICAgY29uc3Qga3ZQYWlycyA9IHRoaXMubWFwLmdldChoYXNoKTtcbiAgICAgICAgICAgIGZvcihsZXQgaSA9IDA7IGk8a3ZQYWlycy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuZXF1YWxzKGt2UGFpcnNbaV1bMF0sIGtleSkpIHtcbiAgICAgICAgICAgICAgICAgICAga3ZQYWlycy5zcGxpY2UoaSwgMSk7XG4gICAgICAgICAgICAgICAgICAgIGlmKGt2UGFpcnMubGVuZ3RoID09PSAwKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLm1hcC5kZWxldGUoa3ZQYWlycyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zaXplLS07XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xuICAgIHB1YmxpYyBnZXRTaXplKCk6bnVtYmVyIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuc2l6ZTtcbiAgICB9O1xuICAgIHB1YmxpYyBjbGVhcigpOnRoaXMge1xuICAgICAgICB0aGlzLm1hcC5jbGVhcigpO1xuICAgICAgICB0aGlzLnNpemUgPSAwO1xuICAgICAgICByZXR1cm4gdGhpcztcbiAgICB9O1xufTsiXSwic291cmNlUm9vdCI6IiJ9