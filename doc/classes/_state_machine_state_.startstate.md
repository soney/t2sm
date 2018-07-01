[t2sm](../README.md) > ["state_machine/State"](../modules/_state_machine_state_.md) > [StartState](../classes/_state_machine_state_.startstate.md)

# Class: StartState

A class representing a starting state

## Type parameters
#### S 
#### T 
## Hierarchy

↳  [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

**↳ StartState**

## Index

### Constructors

* [constructor](_state_machine_state_.startstate.md#constructor)

### Properties

* [defaultMaxListeners](_state_machine_state_.startstate.md#defaultmaxlisteners)

### Methods

* [_addIncomingTransition](_state_machine_state_.startstate.md#_addincomingtransition)
* [_addOutgoingTransition](_state_machine_state_.startstate.md#_addoutgoingtransition)
* [_getIncomingTransitions](_state_machine_state_.startstate.md#_getincomingtransitions)
* [_getOutgoingTransitions](_state_machine_state_.startstate.md#_getoutgoingtransitions)
* [_removeIncomingTransition](_state_machine_state_.startstate.md#_removeincomingtransition)
* [_removeOutgoingTransition](_state_machine_state_.startstate.md#_removeoutgoingtransition)
* [addListener](_state_machine_state_.startstate.md#addlistener)
* [emit](_state_machine_state_.startstate.md#emit)
* [eventNames](_state_machine_state_.startstate.md#eventnames)
* [getMaxListeners](_state_machine_state_.startstate.md#getmaxlisteners)
* [getPayload](_state_machine_state_.startstate.md#getpayload)
* [isActive](_state_machine_state_.startstate.md#isactive)
* [isStartState](_state_machine_state_.startstate.md#isstartstate)
* [listenerCount](_state_machine_state_.startstate.md#listenercount)
* [listeners](_state_machine_state_.startstate.md#listeners)
* [off](_state_machine_state_.startstate.md#off)
* [on](_state_machine_state_.startstate.md#on)
* [once](_state_machine_state_.startstate.md#once)
* [prependListener](_state_machine_state_.startstate.md#prependlistener)
* [prependOnceListener](_state_machine_state_.startstate.md#prependoncelistener)
* [rawListeners](_state_machine_state_.startstate.md#rawlisteners)
* [remove](_state_machine_state_.startstate.md#remove)
* [removeAllListeners](_state_machine_state_.startstate.md#removealllisteners)
* [removeListener](_state_machine_state_.startstate.md#removelistener)
* [setIsActive](_state_machine_state_.startstate.md#setisactive)
* [setMaxListeners](_state_machine_state_.startstate.md#setmaxlisteners)
* [setPayload](_state_machine_state_.startstate.md#setpayload)
* [listenerCount](_state_machine_state_.startstate.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new StartState**(payload?: *`S`*): [StartState](_state_machine_state_.startstate.md)

*Overrides [AbstractState](_state_machine_state_.abstractstate.md).[constructor](_state_machine_state_.abstractstate.md#constructor)*

*Defined in [state_machine/State.ts:161](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L161)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` payload | `S` |

**Returns:** [StartState](_state_machine_state_.startstate.md)

___

## Properties

<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1022*

___

## Methods

<a id="_addincomingtransition"></a>

###  _addIncomingTransition

▸ **_addIncomingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `void`

*Overrides [AbstractState](_state_machine_state_.abstractstate.md).[_addIncomingTransition](_state_machine_state_.abstractstate.md#_addincomingtransition)*

*Defined in [state_machine/State.ts:179](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L179)*

Throws an exception; start states cannot have incoming transitions

**Parameters:**

| Param | Type |
| ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |

**Returns:** `void`

___
<a id="_addoutgoingtransition"></a>

###  _addOutgoingTransition

▸ **_addOutgoingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `void`

*Overrides [AbstractState](_state_machine_state_.abstractstate.md).[_addOutgoingTransition](_state_machine_state_.abstractstate.md#_addoutgoingtransition)*

*Defined in [state_machine/State.ts:169](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L169)*

Adds an outgoing transition (only one allowed)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |  The transition to add |

**Returns:** `void`

___
<a id="_getincomingtransitions"></a>

###  _getIncomingTransitions

▸ **_getIncomingTransitions**(): [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[_getIncomingTransitions](_state_machine_state_.abstractstate.md#_getincomingtransitions)*

*Defined in [state_machine/State.ts:34](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L34)*

Get all of the transitions entering this state (should only be used internally)

**Returns:** [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

___
<a id="_getoutgoingtransitions"></a>

###  _getOutgoingTransitions

▸ **_getOutgoingTransitions**(): [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[_getOutgoingTransitions](_state_machine_state_.abstractstate.md#_getoutgoingtransitions)*

*Defined in [state_machine/State.ts:30](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L30)*

Get all of the transitions leaving this state (should only be used internally)

**Returns:** [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

___
<a id="_removeincomingtransition"></a>

###  _removeIncomingTransition

▸ **_removeIncomingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `boolean`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[_removeIncomingTransition](_state_machine_state_.abstractstate.md#_removeincomingtransition)*

*Defined in [state_machine/State.ts:83](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L83)*

Remove a transition from the list of incoming transitions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |  The transition to remove |

**Returns:** `boolean`
true if the transition was removed; false otherwise

___
<a id="_removeoutgoingtransition"></a>

###  _removeOutgoingTransition

▸ **_removeOutgoingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `boolean`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[_removeOutgoingTransition](_state_machine_state_.abstractstate.md#_removeoutgoingtransition)*

*Defined in [state_machine/State.ts:56](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L56)*

Remove a transition from the list of outgoing transitions

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |  The transition to remove |

**Returns:** `boolean`
true if the transition was removed; false otherwise

___
<a id="addlistener"></a>

###  addListener

▸ **addListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.addListener*

*Overrides EventEmitter.addListener*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1024*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="emit"></a>

###  emit

▸ **emit**(event: * `string` &#124; `symbol`*, ...args: *`any`[]*): `boolean`

*Inherited from EventEmitter.emit*

*Overrides EventEmitter.emit*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1036*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| `Rest` args | `any`[] |

**Returns:** `boolean`

___
<a id="eventnames"></a>

###  eventNames

▸ **eventNames**(): `Array`< `string` &#124; `symbol`>

*Inherited from EventEmitter.eventNames*

*Overrides EventEmitter.eventNames*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1037*

**Returns:** `Array`< `string` &#124; `symbol`>

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1033*

**Returns:** `number`

___
<a id="getpayload"></a>

###  getPayload

▸ **getPayload**(): `S`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[getPayload](_state_machine_state_.abstractstate.md#getpayload)*

*Defined in [state_machine/State.ts:19](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L19)*

Get the data attached to this state

**Returns:** `S`

___
<a id="isactive"></a>

###  isActive

▸ **isActive**(): `boolean`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[isActive](_state_machine_state_.abstractstate.md#isactive)*

*Defined in [state_machine/State.ts:96](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L96)*

**Returns:** `boolean`
true if this state is active and false otherwise

___
<a id="isstartstate"></a>

###  isStartState

▸ **isStartState**(): `boolean`

*Overrides [AbstractState](_state_machine_state_.abstractstate.md).[isStartState](_state_machine_state_.abstractstate.md#isstartstate)*

*Defined in [state_machine/State.ts:185](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L185)*

**Returns:** `boolean`
true (to represent that this is a start state)

___
<a id="listenercount"></a>

###  listenerCount

▸ **listenerCount**(type: * `string` &#124; `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Overrides EventEmitter.listenerCount*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1038*

**Parameters:**

| Param | Type |
| ------ | ------ |
| type |  `string` &#124; `symbol`|

**Returns:** `number`

___
<a id="listeners"></a>

###  listeners

▸ **listeners**(event: * `string` &#124; `symbol`*): `Function`[]

*Inherited from EventEmitter.listeners*

*Overrides EventEmitter.listeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1034*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="off"></a>

###  off

▸ **off**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.off*

*Overrides EventEmitter.off*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1030*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="on"></a>

###  on

▸ **on**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.on*

*Overrides EventEmitter.on*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1025*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="once"></a>

###  once

▸ **once**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.once*

*Overrides EventEmitter.once*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1026*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependlistener"></a>

###  prependListener

▸ **prependListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependListener*

*Overrides EventEmitter.prependListener*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1027*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="prependoncelistener"></a>

###  prependOnceListener

▸ **prependOnceListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.prependOnceListener*

*Overrides EventEmitter.prependOnceListener*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1028*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="rawlisteners"></a>

###  rawListeners

▸ **rawListeners**(event: * `string` &#124; `symbol`*): `Function`[]

*Inherited from EventEmitter.rawListeners*

*Overrides EventEmitter.rawListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1035*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|

**Returns:** `Function`[]

___
<a id="remove"></a>

###  remove

▸ **remove**(): `void`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[remove](_state_machine_state_.abstractstate.md#remove)*

*Defined in [state_machine/State.ts:151](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L151)*

Remove this state

**Returns:** `void`

___
<a id="removealllisteners"></a>

###  removeAllListeners

▸ **removeAllListeners**(event?: * `string` &#124; `symbol`*): `this`

*Inherited from EventEmitter.removeAllListeners*

*Overrides EventEmitter.removeAllListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1031*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` event |  `string` &#124; `symbol`|

**Returns:** `this`

___
<a id="removelistener"></a>

###  removeListener

▸ **removeListener**(event: * `string` &#124; `symbol`*, listener: *`function`*): `this`

*Inherited from EventEmitter.removeListener*

*Overrides EventEmitter.removeListener*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1029*

**Parameters:**

| Param | Type |
| ------ | ------ |
| event |  `string` &#124; `symbol`|
| listener | `function` |

**Returns:** `this`

___
<a id="setisactive"></a>

###  setIsActive

▸ **setIsActive**(active: *`boolean`*): `void`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[setIsActive](_state_machine_state_.abstractstate.md#setisactive)*

*Defined in [state_machine/State.ts:102](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L102)*

Change whether this state is active or not

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| active | `boolean` |  Whether or not the state should be active |

**Returns:** `void`

___
<a id="setmaxlisteners"></a>

###  setMaxListeners

▸ **setMaxListeners**(n: *`number`*): `this`

*Inherited from EventEmitter.setMaxListeners*

*Overrides EventEmitter.setMaxListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1032*

**Parameters:**

| Param | Type |
| ------ | ------ |
| n | `number` |

**Returns:** `this`

___
<a id="setpayload"></a>

###  setPayload

▸ **setPayload**(payload: *`S`*): `void`

*Inherited from [AbstractState](_state_machine_state_.abstractstate.md).[setPayload](_state_machine_state_.abstractstate.md#setpayload)*

*Defined in [state_machine/State.ts:25](https://github.com/soney/t2sm/blob/9786338/src/state_machine/State.ts#L25)*

Set the data attached to this state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| payload | `S` |  The new payload |

**Returns:** `void`

___
<a id="listenercount-1"></a>

### `<Static>` listenerCount

▸ **listenerCount**(emitter: *`EventEmitter`*, event: * `string` &#124; `symbol`*): `number`

*Inherited from EventEmitter.listenerCount*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1021*

*__deprecated__*: since v4.0.0

**Parameters:**

| Param | Type |
| ------ | ------ |
| emitter | `EventEmitter` |
| event |  `string` &#124; `symbol`|

**Returns:** `number`

___

