[t2sm](../README.md) > ["utils/HashMap"](../modules/_utils_hashmap_.md) > [HashMap](../classes/_utils_hashmap_.hashmap.md)

# Class: HashMap

## Type parameters
#### K 
#### V 
## Hierarchy

**HashMap**

## Index

### Constructors

* [constructor](_utils_hashmap_.hashmap.md#constructor)

### Methods

* [clear](_utils_hashmap_.hashmap.md#clear)
* [delete](_utils_hashmap_.hashmap.md#delete)
* [get](_utils_hashmap_.hashmap.md#get)
* [getSize](_utils_hashmap_.hashmap.md#getsize)
* [has](_utils_hashmap_.hashmap.md#has)
* [set](_utils_hashmap_.hashmap.md#set)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new HashMap**(equals?: *[EqualityCheck](../modules/_utils_hashmap_.md#equalitycheck)<`K`>*, hash?: *[Hash](../modules/_utils_hashmap_.md#hash)<`K`>*): [HashMap](_utils_hashmap_.hashmap.md)

*Defined in [utils/HashMap.ts:6](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L6)*

**Parameters:**

| Param | Type | Default value |
| ------ | ------ | ------ |
| `Default value` equals | [EqualityCheck](../modules/_utils_hashmap_.md#equalitycheck)<`K`> |  ((k1:K, k2:K) &#x3D;&gt; k1 &#x3D;&#x3D;&#x3D; k2) |
| `Default value` hash | [Hash](../modules/_utils_hashmap_.md#hash)<`K`> |  ((k:K) &#x3D;&gt; &#x60;${k}&#x60;) |

**Returns:** [HashMap](_utils_hashmap_.hashmap.md)

___

## Methods

<a id="clear"></a>

###  clear

▸ **clear**(): `this`

*Defined in [utils/HashMap.ts:79](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L79)*

**Returns:** `this`

___
<a id="delete"></a>

###  delete

▸ **delete**(key: *`K`*): `this`

*Defined in [utils/HashMap.ts:59](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L59)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `K` |

**Returns:** `this`

___
<a id="get"></a>

###  get

▸ **get**(key: *`K`*): `V`

*Defined in [utils/HashMap.ts:35](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L35)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `K` |

**Returns:** `V`

___
<a id="getsize"></a>

###  getSize

▸ **getSize**(): `number`

*Defined in [utils/HashMap.ts:76](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L76)*

**Returns:** `number`

___
<a id="has"></a>

###  has

▸ **has**(key: *`K`*): `boolean`

*Defined in [utils/HashMap.ts:47](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L47)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `K` |

**Returns:** `boolean`

___
<a id="set"></a>

###  set

▸ **set**(key: *`K`*, value: *`V`*): `this`

*Defined in [utils/HashMap.ts:13](https://github.com/soney/t2sm/blob/7b549e1/src/utils/HashMap.ts#L13)*

**Parameters:**

| Param | Type |
| ------ | ------ |
| key | `K` |
| value | `V` |

**Returns:** `this`

___

