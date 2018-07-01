[t2sm](../README.md) > ["state_machine/Transition"](../modules/_state_machine_transition_.md) > [Transition](../classes/_state_machine_transition_.transition.md)

# Class: Transition

A class representing a transition in a state machine

## Type parameters
#### S 
#### T 
## Hierarchy

 `EventEmitter`

**↳ Transition**

## Index

### Constructors

* [constructor](_state_machine_transition_.transition.md#constructor)

### Properties

* [eligible](_state_machine_transition_.transition.md#eligible)
* [fromState](_state_machine_transition_.transition.md#fromstate)
* [payload](_state_machine_transition_.transition.md#payload)
* [toState](_state_machine_transition_.transition.md#tostate)
* [defaultMaxListeners](_state_machine_transition_.transition.md#defaultmaxlisteners)

### Methods

* [addListener](_state_machine_transition_.transition.md#addlistener)
* [emit](_state_machine_transition_.transition.md#emit)
* [eventNames](_state_machine_transition_.transition.md#eventnames)
* [fire](_state_machine_transition_.transition.md#fire)
* [getFromState](_state_machine_transition_.transition.md#getfromstate)
* [getMaxListeners](_state_machine_transition_.transition.md#getmaxlisteners)
* [getPayload](_state_machine_transition_.transition.md#getpayload)
* [getToState](_state_machine_transition_.transition.md#gettostate)
* [isEligible](_state_machine_transition_.transition.md#iseligible)
* [listenerCount](_state_machine_transition_.transition.md#listenercount)
* [listeners](_state_machine_transition_.transition.md#listeners)
* [off](_state_machine_transition_.transition.md#off)
* [on](_state_machine_transition_.transition.md#on)
* [once](_state_machine_transition_.transition.md#once)
* [prependListener](_state_machine_transition_.transition.md#prependlistener)
* [prependOnceListener](_state_machine_transition_.transition.md#prependoncelistener)
* [rawListeners](_state_machine_transition_.transition.md#rawlisteners)
* [remove](_state_machine_transition_.transition.md#remove)
* [removeAllListeners](_state_machine_transition_.transition.md#removealllisteners)
* [removeListener](_state_machine_transition_.transition.md#removelistener)
* [setEligible](_state_machine_transition_.transition.md#seteligible)
* [setFromState](_state_machine_transition_.transition.md#setfromstate)
* [setMaxListeners](_state_machine_transition_.transition.md#setmaxlisteners)
* [setPayload](_state_machine_transition_.transition.md#setpayload)
* [setToState](_state_machine_transition_.transition.md#settostate)
* [listenerCount](_state_machine_transition_.transition.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Transition**(fromState: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*, toState: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*, payload?: *`T`*): [Transition](_state_machine_transition_.transition.md)

*Defined in [state_machine/Transition.ts:8](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L8)*

Constructor

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fromState | [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`> |  The state that this transition leaves from |
| toState | [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`> |  The state that this transition goes to |
| `Optional` payload | `T` |  The information stored in this transition |

**Returns:** [Transition](_state_machine_transition_.transition.md)

___

## Properties

<a id="eligible"></a>

### `<Private>` eligible

**● eligible**: *`boolean`*

*Defined in [state_machine/Transition.ts:8](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L8)*

___
<a id="fromstate"></a>

### `<Private>` fromState

**● fromState**: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*

*Defined in [state_machine/Transition.ts:15](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L15)*

The state that this transition leaves from

___
<a id="payload"></a>

### `<Private>``<Optional>` payload

**● payload**: *`T`*

*Defined in [state_machine/Transition.ts:15](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L15)*

The information stored in this transition

___
<a id="tostate"></a>

### `<Private>` toState

**● toState**: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*

*Defined in [state_machine/Transition.ts:15](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L15)*

The state that this transition goes to

___
<a id="defaultmaxlisteners"></a>

### `<Static>` defaultMaxListeners

**● defaultMaxListeners**: *`number`*

*Inherited from EventEmitter.defaultMaxListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1022*

___

## Methods

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
<a id="fire"></a>

###  fire

▸ **fire**(event?: *`any`*, source?: *`any`*): `void`

*Defined in [state_machine/Transition.ts:53](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L53)*

Tell the transition to fire (if the "from" state is active, move to the "to" state)

**Parameters:**

| Param | Type |
| ------ | ------ |
| `Optional` event | `any` |
| `Optional` source | `any` |

**Returns:** `void`

___
<a id="getfromstate"></a>

###  getFromState

▸ **getFromState**(): [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

*Defined in [state_machine/Transition.ts:43](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L43)*

Get the state that this transition leaves from

**Returns:** [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

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

▸ **getPayload**(): `T`

*Defined in [state_machine/Transition.ts:79](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L79)*

Get this transition's content payload

**Returns:** `T`

___
<a id="gettostate"></a>

###  getToState

▸ **getToState**(): [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

*Defined in [state_machine/Transition.ts:48](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L48)*

Get the state that this transition goes to

**Returns:** [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

___
<a id="iseligible"></a>

###  isEligible

▸ **isEligible**(): `boolean`

*Defined in [state_machine/Transition.ts:24](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L24)*

**Returns:** `boolean`
whether this transition is eligible to fire

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

*Defined in [state_machine/Transition.ts:35](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L35)*

Remove this transition

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
<a id="seteligible"></a>

###  setEligible

▸ **setEligible**(eligible: *`boolean`*): `void`

*Defined in [state_machine/Transition.ts:30](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L30)*

Change whether this transition is eligible

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| eligible | `boolean` |  true if this transition should be eligible to fire, false otherwise. |

**Returns:** `void`

___
<a id="setfromstate"></a>

###  setFromState

▸ **setFromState**(state: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*): `void`

*Defined in [state_machine/Transition.ts:61](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L61)*

Change which state this transition leaves from

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`> |  The new "from" state |

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

▸ **setPayload**(payload: *`T`*): `void`

*Defined in [state_machine/Transition.ts:84](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L84)*

Set this transition's payload

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| payload | `T` |  The new payload |

**Returns:** `void`

___
<a id="settostate"></a>

###  setToState

▸ **setToState**(state: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*): `void`

*Defined in [state_machine/Transition.ts:70](https://github.com/soney/t2sm/blob/676b519/src/state_machine/Transition.ts#L70)*

Change which state this transition goes to

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`> |  The new "to" state |

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

