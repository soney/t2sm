[t2sm](../README.md) > ["state_machine/State"](../modules/_state_machine_state_.md) > [AbstractState](../classes/_state_machine_state_.abstractstate.md)

# Class: AbstractState

A class representing a state in a state machine

## Type parameters
#### S 
#### T 
## Hierarchy

 `EventEmitter`

**↳ AbstractState**

↳  [StartState](_state_machine_state_.startstate.md)

↳  [State](_state_machine_state_.state.md)

## Index

### Constructors

* [constructor](_state_machine_state_.abstractstate.md#constructor)

### Properties

* [active](_state_machine_state_.abstractstate.md#active)
* [incomingTransitions](_state_machine_state_.abstractstate.md#incomingtransitions)
* [outgoingTransitions](_state_machine_state_.abstractstate.md#outgoingtransitions)
* [payload](_state_machine_state_.abstractstate.md#payload)
* [defaultMaxListeners](_state_machine_state_.abstractstate.md#defaultmaxlisteners)

### Methods

* [_addIncomingTransition](_state_machine_state_.abstractstate.md#_addincomingtransition)
* [_addOutgoingTransition](_state_machine_state_.abstractstate.md#_addoutgoingtransition)
* [_getIncomingTransitions](_state_machine_state_.abstractstate.md#_getincomingtransitions)
* [_getOutgoingTransitions](_state_machine_state_.abstractstate.md#_getoutgoingtransitions)
* [_removeIncomingTransition](_state_machine_state_.abstractstate.md#_removeincomingtransition)
* [_removeOutgoingTransition](_state_machine_state_.abstractstate.md#_removeoutgoingtransition)
* [addListener](_state_machine_state_.abstractstate.md#addlistener)
* [addOutgoingTransitionListeners](_state_machine_state_.abstractstate.md#addoutgoingtransitionlisteners)
* [emit](_state_machine_state_.abstractstate.md#emit)
* [eventNames](_state_machine_state_.abstractstate.md#eventnames)
* [getMaxListeners](_state_machine_state_.abstractstate.md#getmaxlisteners)
* [getPayload](_state_machine_state_.abstractstate.md#getpayload)
* [isActive](_state_machine_state_.abstractstate.md#isactive)
* [isStartState](_state_machine_state_.abstractstate.md#isstartstate)
* [listenerCount](_state_machine_state_.abstractstate.md#listenercount)
* [listeners](_state_machine_state_.abstractstate.md#listeners)
* [off](_state_machine_state_.abstractstate.md#off)
* [on](_state_machine_state_.abstractstate.md#on)
* [onOutgoingTransitionFired](_state_machine_state_.abstractstate.md#onoutgoingtransitionfired)
* [once](_state_machine_state_.abstractstate.md#once)
* [prependListener](_state_machine_state_.abstractstate.md#prependlistener)
* [prependOnceListener](_state_machine_state_.abstractstate.md#prependoncelistener)
* [rawListeners](_state_machine_state_.abstractstate.md#rawlisteners)
* [remove](_state_machine_state_.abstractstate.md#remove)
* [removeAllListeners](_state_machine_state_.abstractstate.md#removealllisteners)
* [removeListener](_state_machine_state_.abstractstate.md#removelistener)
* [removeOutgoingTransitionListeners](_state_machine_state_.abstractstate.md#removeoutgoingtransitionlisteners)
* [setIsActive](_state_machine_state_.abstractstate.md#setisactive)
* [setMaxListeners](_state_machine_state_.abstractstate.md#setmaxlisteners)
* [setPayload](_state_machine_state_.abstractstate.md#setpayload)
* [listenerCount](_state_machine_state_.abstractstate.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new AbstractState**(payload?: *`S`*): [AbstractState](_state_machine_state_.abstractstate.md)

*Defined in [state_machine/State.ts:11](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L11)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` payload | `S` |

**Returns:** [AbstractState](_state_machine_state_.abstractstate.md)

___

## Properties

<a id="active"></a>

### `<Private>` active

**● active**: *`boolean`* = false

*Defined in [state_machine/State.ts:8](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L8)*

___
<a id="incomingtransitions"></a>

### `<Private>` incomingTransitions

**● incomingTransitions**: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]* =  []

*Defined in [state_machine/State.ts:10](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L10)*

___
<a id="outgoingtransitions"></a>

### `<Private>` outgoingTransitions

**● outgoingTransitions**: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]* =  []

*Defined in [state_machine/State.ts:9](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L9)*

___
<a id="payload"></a>

### `<Private>``<Optional>` payload

**● payload**: *`S`*

*Defined in [state_machine/State.ts:12](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L12)*

___
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

*Defined in [state_machine/State.ts:74](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L74)*

Mark a new transition as going to this state (should only be used internally)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |  The transition to add to the list of incoming transitions |

**Returns:** `void`

___
<a id="_addoutgoingtransition"></a>

###  _addOutgoingTransition

▸ **_addOutgoingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `void`

*Defined in [state_machine/State.ts:40](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L40)*

Mark a new transition as leaving from this state (should only be used internally)

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |  The transition to add to the list of outgoing transitions |

**Returns:** `void`

___
<a id="_getincomingtransitions"></a>

###  _getIncomingTransitions

▸ **_getIncomingTransitions**(): [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

*Defined in [state_machine/State.ts:34](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L34)*

Get all of the transitions entering this state (should only be used internally)

**Returns:** [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

___
<a id="_getoutgoingtransitions"></a>

###  _getOutgoingTransitions

▸ **_getOutgoingTransitions**(): [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

*Defined in [state_machine/State.ts:30](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L30)*

Get all of the transitions leaving this state (should only be used internally)

**Returns:** [Transition](_state_machine_transition_.transition.md)<`S`, `T`>[]

___
<a id="_removeincomingtransition"></a>

###  _removeIncomingTransition

▸ **_removeIncomingTransition**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `boolean`

*Defined in [state_machine/State.ts:83](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L83)*

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

*Defined in [state_machine/State.ts:56](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L56)*

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
<a id="addoutgoingtransitionlisteners"></a>

### `<Private>` addOutgoingTransitionListeners

▸ **addOutgoingTransitionListeners**(): `void`

*Defined in [state_machine/State.ts:116](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L116)*

Enable outgoing transition listeners for when this state is active

**Returns:** `void`

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

*Defined in [state_machine/State.ts:19](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L19)*

Get the data attached to this state

**Returns:** `S`

___
<a id="isactive"></a>

###  isActive

▸ **isActive**(): `boolean`

*Defined in [state_machine/State.ts:96](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L96)*

**Returns:** `boolean`
true if this state is active and false otherwise

___
<a id="isstartstate"></a>

### `<Abstract>` isStartState

▸ **isStartState**(): `boolean`

*Defined in [state_machine/State.ts:11](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L11)*

**Returns:** `boolean`

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
<a id="onoutgoingtransitionfired"></a>

### `<Private>` onOutgoingTransitionFired

▸ **onOutgoingTransitionFired**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*, event: *`any`*, source: *`any`*): `void`

*Defined in [state_machine/State.ts:135](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L135)*

Called when a transition leaving this state was fired

**Parameters:**

| Param | Type |
| ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |
| event | `any` |
| source | `any` |

**Returns:** `void`

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

*Defined in [state_machine/State.ts:151](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L151)*

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
<a id="removeoutgoingtransitionlisteners"></a>

### `<Private>` removeOutgoingTransitionListeners

▸ **removeOutgoingTransitionListeners**(): `void`

*Defined in [state_machine/State.ts:125](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L125)*

Disable outgoing transition listeners for when this state is inactive

**Returns:** `void`

___
<a id="setisactive"></a>

###  setIsActive

▸ **setIsActive**(active: *`boolean`*): `void`

*Defined in [state_machine/State.ts:102](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L102)*

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

*Defined in [state_machine/State.ts:25](https://github.com/soney/t2sm/blob/676b519/src/state_machine/State.ts#L25)*

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

