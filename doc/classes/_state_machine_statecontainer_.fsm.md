[t2sm](../README.md) > ["state_machine/StateContainer"](../modules/_state_machine_statecontainer_.md) > [FSM](../classes/_state_machine_statecontainer_.fsm.md)

# Class: FSM

## Type parameters
#### S 
#### T 
## Hierarchy

↳  [StateContainer](_state_machine_statecontainer_.statecontainer.md)<`S`, `T`>

**↳ FSM**

## Index

### Constructors

* [constructor](_state_machine_statecontainer_.fsm.md#constructor)

### Properties

* [startState](_state_machine_statecontainer_.fsm.md#startstate)
* [stateLabels](_state_machine_statecontainer_.fsm.md#statelabels)
* [states](_state_machine_statecontainer_.fsm.md#states)
* [transitionLabels](_state_machine_statecontainer_.fsm.md#transitionlabels)
* [transitions](_state_machine_statecontainer_.fsm.md#transitions)
* [defaultMaxListeners](_state_machine_statecontainer_.fsm.md#defaultmaxlisteners)

### Methods

* [addListener](_state_machine_statecontainer_.fsm.md#addlistener)
* [addState](_state_machine_statecontainer_.fsm.md#addstate)
* [addTrace](_state_machine_statecontainer_.fsm.md#addtrace)
* [addTransition](_state_machine_statecontainer_.fsm.md#addtransition)
* [destroy](_state_machine_statecontainer_.fsm.md#destroy)
* [emit](_state_machine_statecontainer_.fsm.md#emit)
* [eventNames](_state_machine_statecontainer_.fsm.md#eventnames)
* [fireTransition](_state_machine_statecontainer_.fsm.md#firetransition)
* [getActiveState](_state_machine_statecontainer_.fsm.md#getactivestate)
* [getFireFunction](_state_machine_statecontainer_.fsm.md#getfirefunction)
* [getIncomingTransitions](_state_machine_statecontainer_.fsm.md#getincomingtransitions)
* [getMaxListeners](_state_machine_statecontainer_.fsm.md#getmaxlisteners)
* [getOutgoingTransitions](_state_machine_statecontainer_.fsm.md#getoutgoingtransitions)
* [getStartState](_state_machine_statecontainer_.fsm.md#getstartstate)
* [getState](_state_machine_statecontainer_.fsm.md#getstate)
* [getStateLabel](_state_machine_statecontainer_.fsm.md#getstatelabel)
* [getStatePayload](_state_machine_statecontainer_.fsm.md#getstatepayload)
* [getStates](_state_machine_statecontainer_.fsm.md#getstates)
* [getTransition](_state_machine_statecontainer_.fsm.md#gettransition)
* [getTransitionFrom](_state_machine_statecontainer_.fsm.md#gettransitionfrom)
* [getTransitionLabel](_state_machine_statecontainer_.fsm.md#gettransitionlabel)
* [getTransitionPayload](_state_machine_statecontainer_.fsm.md#gettransitionpayload)
* [getTransitionTo](_state_machine_statecontainer_.fsm.md#gettransitionto)
* [getUniqueStateLabel](_state_machine_statecontainer_.fsm.md#getuniquestatelabel)
* [getUniqueTransitionLabel](_state_machine_statecontainer_.fsm.md#getuniquetransitionlabel)
* [hasState](_state_machine_statecontainer_.fsm.md#hasstate)
* [hasTransition](_state_machine_statecontainer_.fsm.md#hastransition)
* [isStartState](_state_machine_statecontainer_.fsm.md#isstartstate)
* [iterateMerge](_state_machine_statecontainer_.fsm.md#iteratemerge)
* [listenerCount](_state_machine_statecontainer_.fsm.md#listenercount)
* [listeners](_state_machine_statecontainer_.fsm.md#listeners)
* [off](_state_machine_statecontainer_.fsm.md#off)
* [on](_state_machine_statecontainer_.fsm.md#on)
* [once](_state_machine_statecontainer_.fsm.md#once)
* [prependListener](_state_machine_statecontainer_.fsm.md#prependlistener)
* [prependOnceListener](_state_machine_statecontainer_.fsm.md#prependoncelistener)
* [rawListeners](_state_machine_statecontainer_.fsm.md#rawlisteners)
* [removeAllListeners](_state_machine_statecontainer_.fsm.md#removealllisteners)
* [removeListener](_state_machine_statecontainer_.fsm.md#removelistener)
* [removeState](_state_machine_statecontainer_.fsm.md#removestate)
* [removeTransition](_state_machine_statecontainer_.fsm.md#removetransition)
* [renameState](_state_machine_statecontainer_.fsm.md#renamestate)
* [renameTransition](_state_machine_statecontainer_.fsm.md#renametransition)
* [setActiveState](_state_machine_statecontainer_.fsm.md#setactivestate)
* [setMaxListeners](_state_machine_statecontainer_.fsm.md#setmaxlisteners)
* [setStatePayload](_state_machine_statecontainer_.fsm.md#setstatepayload)
* [setTransitionFrom](_state_machine_statecontainer_.fsm.md#settransitionfrom)
* [setTransitionPayload](_state_machine_statecontainer_.fsm.md#settransitionpayload)
* [setTransitionTo](_state_machine_statecontainer_.fsm.md#settransitionto)
* [toString](_state_machine_statecontainer_.fsm.md#tostring)
* [listenerCount](_state_machine_statecontainer_.fsm.md#listenercount-1)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new FSM**(transitionsEqual?: *[EqualityCheck](../modules/_state_machine_statecontainer_.md#equalitycheck)<`T`>*, transitionSimilarityScore?: *[SimilarityScore](../modules/_state_machine_statecontainer_.md#similarityscore)<`T`>*, stateSimilarityScore?: *[SimilarityScore](../modules/_state_machine_statecontainer_.md#similarityscore)<`S`>*, startStateName?: *`string`*): [FSM](_state_machine_statecontainer_.fsm.md)

*Overrides [StateContainer](_state_machine_statecontainer_.statecontainer.md).[constructor](_state_machine_statecontainer_.statecontainer.md#constructor)*

*Defined in [state_machine/StateContainer.ts:462](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L462)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` transitionsEqual | [EqualityCheck](../modules/_state_machine_statecontainer_.md#equalitycheck)<`T`> | defaultEqualityCheck |
| `Default value` transitionSimilarityScore | [SimilarityScore](../modules/_state_machine_statecontainer_.md#similarityscore)<`T`> | defaultSimilarityScore |
| `Default value` stateSimilarityScore | [SimilarityScore](../modules/_state_machine_statecontainer_.md#similarityscore)<`S`> | defaultSimilarityScore |
| `Optional` startStateName | `string` | - |

**Returns:** [FSM](_state_machine_statecontainer_.fsm.md)

___

## Properties

<a id="startstate"></a>

### `<Protected>` startState

**● startState**: *[StartState](_state_machine_state_.startstate.md)<`S`, `T`>*

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[startState](_state_machine_statecontainer_.statecontainer.md#startstate)*

*Defined in [state_machine/StateContainer.ts:7](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L7)*

___
<a id="statelabels"></a>

### `<Protected>` stateLabels

**● stateLabels**: *`Map`<[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>, `string`>* =  new Map<AbstractState<S,T>, string>()

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[stateLabels](_state_machine_statecontainer_.statecontainer.md#statelabels)*

*Defined in [state_machine/StateContainer.ts:10](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L10)*

___
<a id="states"></a>

### `<Protected>` states

**● states**: *`Map`<`string`, [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>>* =  new Map<string, AbstractState<S,T>>()

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[states](_state_machine_statecontainer_.statecontainer.md#states)*

*Defined in [state_machine/StateContainer.ts:9](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L9)*

___
<a id="transitionlabels"></a>

### `<Protected>` transitionLabels

**● transitionLabels**: *`Map`<[Transition](_state_machine_transition_.transition.md)<`S`, `T`>, `string`>* =  new Map<Transition<S,T>, string>()

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[transitionLabels](_state_machine_statecontainer_.statecontainer.md#transitionlabels)*

*Defined in [state_machine/StateContainer.ts:12](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L12)*

___
<a id="transitions"></a>

### `<Protected>` transitions

**● transitions**: *`Map`<`string`, [Transition](_state_machine_transition_.transition.md)<`S`, `T`>>* =  new Map<string, Transition<S,T>>()

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[transitions](_state_machine_statecontainer_.statecontainer.md#transitions)*

*Defined in [state_machine/StateContainer.ts:11](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L11)*

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
<a id="addstate"></a>

###  addState

▸ **addState**(payload?: *`S`*, label?: *`string`*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[addState](_state_machine_statecontainer_.statecontainer.md#addstate)*

*Defined in [state_machine/StateContainer.ts:154](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L154)*

Add a new state to this container

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `Optional` payload | `S` | - |  The payload of the new state |
| `Default value` label | `string` | this.getUniqueStateLabel() |  (optional) the label of the new state; auto-generated if not given |

**Returns:** `string`
The new state's label

___
<a id="addtrace"></a>

###  addTrace

▸ **addTrace**(trace: *[`T`, `S`][]*): `void`

*Defined in [state_machine/StateContainer.ts:552](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L552)*

Add a new "trace" through a program

**Parameters:**

| Param | Type |
| ------ | ------ |
| trace | [`T`, `S`][] |

**Returns:** `void`

___
<a id="addtransition"></a>

###  addTransition

▸ **addTransition**(fromLabel: *`string`*, toLabel: *`string`*, payload?: *`any`*, label?: *`string`*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[addTransition](_state_machine_statecontainer_.statecontainer.md#addtransition)*

*Defined in [state_machine/StateContainer.ts:237](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L237)*

Add a new transition

**Parameters:**

| Param | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| fromLabel | `string` | - |  The label of the state this transition leaves from |
| toLabel | `string` | - |  The label of the state this transition goes to |
| `Optional` payload | `any` | - |  The payload for the new transition |
| `Default value` label | `string` | this.getUniqueTransitionLabel() |  The label for the new transition (automatically determined if not given) |

**Returns:** `string`
The label of the new transition

___
<a id="destroy"></a>

###  destroy

▸ **destroy**(): `void`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[destroy](_state_machine_statecontainer_.statecontainer.md#destroy)*

*Defined in [state_machine/StateContainer.ts:447](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L447)*

Clean up all of the objects stored in this container

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
<a id="firetransition"></a>

###  fireTransition

▸ **fireTransition**(label: *`string`*, event?: *`any`*, source?: *`any`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[fireTransition](_state_machine_statecontainer_.statecontainer.md#firetransition)*

*Defined in [state_machine/StateContainer.ts:129](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L129)*

Fire a transition by its label

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the transition |
| `Optional` event | `any` |  The content of the event |
| `Optional` source | `any` |  Information about the source firing this transition |

**Returns:** `this`

___
<a id="getactivestate"></a>

###  getActiveState

▸ **getActiveState**(): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getActiveState](_state_machine_statecontainer_.statecontainer.md#getactivestate)*

*Defined in [state_machine/StateContainer.ts:275](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L275)*

Get the label of the active state

**Returns:** `string`
The label of the currently active state

___
<a id="getfirefunction"></a>

###  getFireFunction

▸ **getFireFunction**(label: *`string`*): `Function`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getFireFunction](_state_machine_statecontainer_.statecontainer.md#getfirefunction)*

*Defined in [state_machine/StateContainer.ts:144](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L144)*

Creates a function that will fire a given transition when called

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The transition that we are getting a fire function for |

**Returns:** `Function`
a function that will fire the given transition

___
<a id="getincomingtransitions"></a>

###  getIncomingTransitions

▸ **getIncomingTransitions**(label: *`string`*): `string`[]

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getIncomingTransitions](_state_machine_statecontainer_.statecontainer.md#getincomingtransitions)*

*Defined in [state_machine/StateContainer.ts:351](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L351)*

Get the list of transitions entering a state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The state name for which we are getting incoming transitions |

**Returns:** `string`[]

___
<a id="getmaxlisteners"></a>

###  getMaxListeners

▸ **getMaxListeners**(): `number`

*Inherited from EventEmitter.getMaxListeners*

*Overrides EventEmitter.getMaxListeners*

*Defined in /home/soney/code/t2sm/node_modules/@types/node/index.d.ts:1033*

**Returns:** `number`

___
<a id="getoutgoingtransitions"></a>

###  getOutgoingTransitions

▸ **getOutgoingTransitions**(label: *`string`*): `string`[]

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getOutgoingTransitions](_state_machine_statecontainer_.statecontainer.md#getoutgoingtransitions)*

*Defined in [state_machine/StateContainer.ts:340](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L340)*

Get the list of transitions leaving a state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The state name for which we are getting outgoing transitions |

**Returns:** `string`[]

___
<a id="getstartstate"></a>

###  getStartState

▸ **getStartState**(): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getStartState](_state_machine_statecontainer_.statecontainer.md#getstartstate)*

*Defined in [state_machine/StateContainer.ts:322](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L322)*

**Returns:** `string`
the name of the start state

___
<a id="getstate"></a>

### `<Protected>` getState

▸ **getState**(label: *`string`*): [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getState](_state_machine_statecontainer_.statecontainer.md#getstate)*

*Defined in [state_machine/StateContainer.ts:43](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L43)*

Get the state object representing a given state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The state to get |

**Returns:** [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>
the state object

___
<a id="getstatelabel"></a>

### `<Protected>` getStateLabel

▸ **getStateLabel**(state: *[AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`>*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getStateLabel](_state_machine_statecontainer_.statecontainer.md#getstatelabel)*

*Defined in [state_machine/StateContainer.ts:29](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L29)*

Get the label of a state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| state | [AbstractState](_state_machine_state_.abstractstate.md)<`S`, `T`> |  The AbstractState object we are searching for |

**Returns:** `string`

___
<a id="getstatepayload"></a>

###  getStatePayload

▸ **getStatePayload**(label: *`string`*): `S`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getStatePayload](_state_machine_statecontainer_.statecontainer.md#getstatepayload)*

*Defined in [state_machine/StateContainer.ts:50](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L50)*

Get the payload of a given state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the state whose payload we are fetching |

**Returns:** `S`
The state's payload

___
<a id="getstates"></a>

###  getStates

▸ **getStates**(): `string`[]

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getStates](_state_machine_statecontainer_.statecontainer.md#getstates)*

*Defined in [state_machine/StateContainer.ts:295](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L295)*

Get the label of every state in this container

**Returns:** `string`[]
a list of states in this container

___
<a id="gettransition"></a>

### `<Protected>` getTransition

▸ **getTransition**(label: *`string`*): [Transition](_state_machine_transition_.transition.md)<`S`, `T`>

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getTransition](_state_machine_statecontainer_.statecontainer.md#gettransition)*

*Defined in [state_machine/StateContainer.ts:78](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L78)*

Get a transition from its label

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label for the transition |

**Returns:** [Transition](_state_machine_transition_.transition.md)<`S`, `T`>
the transition object

___
<a id="gettransitionfrom"></a>

###  getTransitionFrom

▸ **getTransitionFrom**(label: *`string`*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getTransitionFrom](_state_machine_statecontainer_.statecontainer.md#gettransitionfrom)*

*Defined in [state_machine/StateContainer.ts:374](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L374)*

Get he state that a transition leaves from

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The transition label |

**Returns:** `string`
The label of the state that this transition leaves from

___
<a id="gettransitionlabel"></a>

### `<Protected>` getTransitionLabel

▸ **getTransitionLabel**(transition: *[Transition](_state_machine_transition_.transition.md)<`S`, `T`>*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getTransitionLabel](_state_machine_statecontainer_.statecontainer.md#gettransitionlabel)*

*Defined in [state_machine/StateContainer.ts:91](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L91)*

Get the label of a transition

**Parameters:**

| Param | Type |
| ------ | ------ |
| transition | [Transition](_state_machine_transition_.transition.md)<`S`, `T`> |

**Returns:** `string`

___
<a id="gettransitionpayload"></a>

###  getTransitionPayload

▸ **getTransitionPayload**(label: *`string`*): `T`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getTransitionPayload](_state_machine_statecontainer_.statecontainer.md#gettransitionpayload)*

*Defined in [state_machine/StateContainer.ts:100](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L100)*

Get the payload of a given transition

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the transition |

**Returns:** `T`
The payload for the transition

___
<a id="gettransitionto"></a>

###  getTransitionTo

▸ **getTransitionTo**(label: *`string`*): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getTransitionTo](_state_machine_statecontainer_.statecontainer.md#gettransitionto)*

*Defined in [state_machine/StateContainer.ts:363](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L363)*

Get the state that a transition goes to

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The transition label |

**Returns:** `string`
The label of the state this transition goes to

___
<a id="getuniquestatelabel"></a>

### `<Protected>` getUniqueStateLabel

▸ **getUniqueStateLabel**(): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getUniqueStateLabel](_state_machine_statecontainer_.statecontainer.md#getuniquestatelabel)*

*Defined in [state_machine/StateContainer.ts:302](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L302)*

**Returns:** `string`
a state name that will be unique for this container

___
<a id="getuniquetransitionlabel"></a>

### `<Protected>` getUniqueTransitionLabel

▸ **getUniqueTransitionLabel**(): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[getUniqueTransitionLabel](_state_machine_statecontainer_.statecontainer.md#getuniquetransitionlabel)*

*Defined in [state_machine/StateContainer.ts:312](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L312)*

**Returns:** `string`
a transition name that will be unique for this container

___
<a id="hasstate"></a>

###  hasState

▸ **hasState**(label: *`string`*): `boolean`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[hasState](_state_machine_statecontainer_.statecontainer.md#hasstate)*

*Defined in [state_machine/StateContainer.ts:37](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L37)*

Check if a state is in this container

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the state to check |

**Returns:** `boolean`
true if the state is in this container; false otherwise

___
<a id="hastransition"></a>

###  hasTransition

▸ **hasTransition**(label: *`string`*): `boolean`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[hasTransition](_state_machine_statecontainer_.statecontainer.md#hastransition)*

*Defined in [state_machine/StateContainer.ts:85](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L85)*

Check if this container has a given transition

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the transition |

**Returns:** `boolean`
true if this state machine has a transition with that label, false otherwise

___
<a id="isstartstate"></a>

###  isStartState

▸ **isStartState**(label: *`string`*): `boolean`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[isStartState](_state_machine_statecontainer_.statecontainer.md#isstartstate)*

*Defined in [state_machine/StateContainer.ts:331](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L331)*

Check if a given state is a start state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The state to check |

**Returns:** `boolean`
true if the state is a start state and false otherwise

___
<a id="iteratemerge"></a>

###  iterateMerge

▸ **iterateMerge**(): `void`

*Defined in [state_machine/StateContainer.ts:472](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L472)*

Iterate and merge the best candidates

**Returns:** `void`

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
<a id="removestate"></a>

###  removeState

▸ **removeState**(label: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[removeState](_state_machine_statecontainer_.statecontainer.md#removestate)*

*Defined in [state_machine/StateContainer.ts:179](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L179)*

Remove a state from the list of states

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the state to remove |

**Returns:** `this`

___
<a id="removetransition"></a>

###  removeTransition

▸ **removeTransition**(label: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[removeTransition](_state_machine_statecontainer_.statecontainer.md#removetransition)*

*Defined in [state_machine/StateContainer.ts:258](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L258)*

Remove a transition by label

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the transition to remove |

**Returns:** `this`

___
<a id="renamestate"></a>

###  renameState

▸ **renameState**(fromLabel: *`string`*, toLabel: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[renameState](_state_machine_statecontainer_.statecontainer.md#renamestate)*

*Defined in [state_machine/StateContainer.ts:198](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L198)*

Change the name of a state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fromLabel | `string` |  The old state label |
| toLabel | `string` |  The new state label |

**Returns:** `this`

___
<a id="renametransition"></a>

###  renameTransition

▸ **renameTransition**(fromLabel: *`string`*, toLabel: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[renameTransition](_state_machine_statecontainer_.statecontainer.md#renametransition)*

*Defined in [state_machine/StateContainer.ts:215](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L215)*

Change the name of a transition

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| fromLabel | `string` |  The old transition label |
| toLabel | `string` |  The new transition label |

**Returns:** `this`

___
<a id="setactivestate"></a>

###  setActiveState

▸ **setActiveState**(label: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[setActiveState](_state_machine_statecontainer_.statecontainer.md#setactivestate)*

*Defined in [state_machine/StateContainer.ts:281](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L281)*

Changes which state is active in this container

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the new active state |

**Returns:** `this`

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
<a id="setstatepayload"></a>

###  setStatePayload

▸ **setStatePayload**(label: *`string`*, payload: *`S`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[setStatePayload](_state_machine_statecontainer_.statecontainer.md#setstatepayload)*

*Defined in [state_machine/StateContainer.ts:63](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L63)*

Set the payload of a given state

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the state whose payload we are modifying |
| payload | `S` |  The new payload |

**Returns:** `this`

___
<a id="settransitionfrom"></a>

###  setTransitionFrom

▸ **setTransitionFrom**(label: *`string`*, fromState: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[setTransitionFrom](_state_machine_statecontainer_.statecontainer.md#settransitionfrom)*

*Defined in [state_machine/StateContainer.ts:398](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L398)*

Change the state that a transition leaves from

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The transition label |
| fromState | `string` |  The label of the state that it should now leave from |

**Returns:** `this`

___
<a id="settransitionpayload"></a>

###  setTransitionPayload

▸ **setTransitionPayload**(label: *`string`*, payload: *`T`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[setTransitionPayload](_state_machine_statecontainer_.statecontainer.md#settransitionpayload)*

*Defined in [state_machine/StateContainer.ts:113](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L113)*

Set the payload of a given transition

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The label of the transition |
| payload | `T` |  The new payload |

**Returns:** `this`

___
<a id="settransitionto"></a>

###  setTransitionTo

▸ **setTransitionTo**(label: *`string`*, toState: *`string`*): `this`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[setTransitionTo](_state_machine_statecontainer_.statecontainer.md#settransitionto)*

*Defined in [state_machine/StateContainer.ts:385](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L385)*

Change the state that a transition goes to

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| label | `string` |  The transition label |
| toState | `string` |  The label of the state that it should now go to |

**Returns:** `this`

___
<a id="tostring"></a>

###  toString

▸ **toString**(): `string`

*Inherited from [StateContainer](_state_machine_statecontainer_.statecontainer.md).[toString](_state_machine_statecontainer_.statecontainer.md#tostring)*

*Defined in [state_machine/StateContainer.ts:409](https://github.com/soney/t2sm/blob/9787686/src/state_machine/StateContainer.ts#L409)*

Convert this state machine into a printable representation

**Returns:** `string`

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

