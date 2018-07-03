[t2sm](../README.md) > ["state_machine/StateContainer"](../modules/_state_machine_statecontainer_.md)

# External module: "state_machine/StateContainer"

## Index

### Classes

* [FSM](../classes/_state_machine_statecontainer_.fsm.md)
* [StateContainer](../classes/_state_machine_statecontainer_.statecontainer.md)

### Type aliases

* [EqualityCheck](_state_machine_statecontainer_.md#equalitycheck)
* [JSONFSM](_state_machine_statecontainer_.md#jsonfsm)
* [Pair](_state_machine_statecontainer_.md#pair)
* [SimilarityScore](_state_machine_statecontainer_.md#similarityscore)

### Functions

* [defaultEqualityCheck](_state_machine_statecontainer_.md#defaultequalitycheck)
* [defaultSimilarityScore](_state_machine_statecontainer_.md#defaultsimilarityscore)

---

## Type aliases

<a id="equalitycheck"></a>

###  EqualityCheck

**ΤEqualityCheck**: *`function`*

*Defined in [state_machine/StateContainer.ts:458](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L458)*

#### Type declaration
▸(i1: *`E`*, i2: *`E`*): `boolean`

**Parameters:**

| Param | Type |
| ------ | ------ |
| i1 | `E` |
| i2 | `E` |

**Returns:** `boolean`

___
<a id="jsonfsm"></a>

###  JSONFSM

**ΤJSONFSM**: *`object`*

*Defined in [state_machine/StateContainer.ts:463](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L463)*

#### Type declaration

 initial: `string`

 states: `object`

[stateName: `string`]: `object`

 on: `object`

[eventName: `string`]:  `string` &#124; `object`

`Optional`  onEntry: `string`[]

___
<a id="pair"></a>

###  Pair

**ΤPair**: *[`E`, `E`]*

*Defined in [state_machine/StateContainer.ts:457](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L457)*

___
<a id="similarityscore"></a>

###  SimilarityScore

**ΤSimilarityScore**: *`function`*

*Defined in [state_machine/StateContainer.ts:459](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L459)*

#### Type declaration
▸(i1: *`E`*, i2: *`E`*): `number`

**Parameters:**

| Param | Type |
| ------ | ------ |
| i1 | `E` |
| i2 | `E` |

**Returns:** `number`

___

## Functions

<a id="defaultequalitycheck"></a>

### `<Const>` defaultEqualityCheck

▸ **defaultEqualityCheck**(a: *`any`*, b: *`any`*): `boolean`

*Defined in [state_machine/StateContainer.ts:460](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L460)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| a | `any` |
| b | `any` |

**Returns:** `boolean`

___
<a id="defaultsimilarityscore"></a>

### `<Const>` defaultSimilarityScore

▸ **defaultSimilarityScore**(a: *`any`*, b: *`any`*):  `1` &#124; `0`

*Defined in [state_machine/StateContainer.ts:461](https://github.com/soney/t2sm/blob/7b549e1/src/state_machine/StateContainer.ts#L461)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| a | `any` |
| b | `any` |

**Returns:**  `1` &#124; `0`

___

