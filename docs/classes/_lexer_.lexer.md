[@johanneslumpe/basic-lexer](../README.md) > ["lexer"](../modules/_lexer_.md) > [Lexer](../classes/_lexer_.lexer.md)

# Class: Lexer

## Type parameters
#### TokenType 
## Hierarchy

**Lexer**

## Index

### Constructors

* [constructor](_lexer_.lexer.md#constructor)

### Properties

* [bracketDepth](_lexer_.lexer.md#bracketdepth)
* [parenDepth](_lexer_.lexer.md#parendepth)
* [pos](_lexer_.lexer.md#pos)
* [start](_lexer_.lexer.md#start)
* [str](_lexer_.lexer.md#str)
* [tokens](_lexer_.lexer.md#tokens)

### Accessors

* [currentBracketDepth](_lexer_.lexer.md#currentbracketdepth)
* [currentParenDepth](_lexer_.lexer.md#currentparendepth)
* [currentPos](_lexer_.lexer.md#currentpos)
* [emittedTokens](_lexer_.lexer.md#emittedtokens)
* [startPos](_lexer_.lexer.md#startpos)

### Methods

* [acceptRun](_lexer_.lexer.md#acceptrun)
* [backup](_lexer_.lexer.md#backup)
* [decreaseBracketDepth](_lexer_.lexer.md#decreasebracketdepth)
* [decreaseParenDepth](_lexer_.lexer.md#decreaseparendepth)
* [emit](_lexer_.lexer.md#emit)
* [emitError](_lexer_.lexer.md#emiterror)
* [ignore](_lexer_.lexer.md#ignore)
* [increaseBracketDepth](_lexer_.lexer.md#increasebracketdepth)
* [increaseParenDepth](_lexer_.lexer.md#increaseparendepth)
* [lookAhead](_lexer_.lexer.md#lookahead)
* [lookBehind](_lexer_.lexer.md#lookbehind)
* [lookBehindForTypes](_lexer_.lexer.md#lookbehindfortypes)
* [next](_lexer_.lexer.md#next)

---

## Constructors

<a id="constructor"></a>

###  constructor

⊕ **new Lexer**(str: *`string`*): [Lexer](_lexer_.lexer.md)

*Defined in lexer.ts:43*

**Parameters:**

| Param | Type |
| ------ | ------ |
| str | `string` |

**Returns:** [Lexer](_lexer_.lexer.md)

___

## Properties

<a id="bracketdepth"></a>

### `<Private>` bracketDepth

**● bracketDepth**: *`number`* = 0

*Defined in lexer.ts:33*

The current bracket depth

___
<a id="parendepth"></a>

### `<Private>` parenDepth

**● parenDepth**: *`number`* = 0

*Defined in lexer.ts:38*

The current parentheses depth

___
<a id="pos"></a>

### `<Private>` pos

**● pos**: *`number`* = 0

*Defined in lexer.ts:18*

The current reading position

___
<a id="start"></a>

### `<Private>` start

**● start**: *`number`* = 0

*Defined in lexer.ts:23*

The current position from which a token will be extracted

___
<a id="str"></a>

### `<Private>` str

**● str**: *`string`* = ""

*Defined in lexer.ts:28*

The string to lex

___
<a id="tokens"></a>

### `<Private>` tokens

**● tokens**: *`Array`<[ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`>>* =  []

*Defined in lexer.ts:43*

The lexes tokens

___

## Accessors

<a id="currentbracketdepth"></a>

###  currentBracketDepth

getcurrentBracketDepth(): `number`

*Defined in lexer.ts:66*

The current bracket depth

**Returns:** `number`

___
<a id="currentparendepth"></a>

###  currentParenDepth

getcurrentParenDepth(): `number`

*Defined in lexer.ts:73*

The current parenthesis depth

**Returns:** `number`

___
<a id="currentpos"></a>

###  currentPos

getcurrentPos(): `number`

*Defined in lexer.ts:59*

The current reading position.

**Returns:** `number`

___
<a id="emittedtokens"></a>

###  emittedTokens

getemittedTokens(): [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`>[]

*Defined in lexer.ts:80*

Returns an array of emitted tokens

**Returns:** [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`>[]

___
<a id="startpos"></a>

###  startPos

getstartPos(): `number`

*Defined in lexer.ts:52*

The current starting position.

**Returns:** `number`

___

## Methods

<a id="acceptrun"></a>

###  acceptRun

▸ **acceptRun**(predicate: *`function`*): `void`

*Defined in lexer.ts:196*

Advances the current position as long as `predicate` returns true

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| predicate | `function` |   |

**Returns:** `void`

___
<a id="backup"></a>

###  backup

▸ **backup**(): `void`

*Defined in lexer.ts:137*

Decrements the current position by one. Does not decrement past 0.

**Returns:** `void`

___
<a id="decreasebracketdepth"></a>

###  decreaseBracketDepth

▸ **decreaseBracketDepth**(): `void`

*Defined in lexer.ts:96*

Decreases the current bracket depth. Used to keep track of matching brackets.

**Returns:** `void`

___
<a id="decreaseparendepth"></a>

###  decreaseParenDepth

▸ **decreaseParenDepth**(): `void`

*Defined in lexer.ts:112*

Decreases the current parenthesis depth. Used to keep track of matching parentheses.

**Returns:** `void`

___
<a id="emit"></a>

###  emit

▸ **emit**(type: *`TokenType`*): `void`

*Defined in lexer.ts:172*

Emits a token for the passed in type, based on the start and current position.

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `TokenType` |  TokenType - the token type to emit |

**Returns:** `void`

___
<a id="emiterror"></a>

###  emitError

▸ **emitError**(type: *`TokenType`*, message: *`string`*): `void`

*Defined in lexer.ts:185*

Pushes an error token onto the tokens array

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| type | `TokenType` |  error type |
| message | `string` |  error messagde |

**Returns:** `void`

___
<a id="ignore"></a>

###  ignore

▸ **ignore**(): `void`

*Defined in lexer.ts:145*

Sets the start position to the current position to ignore the last read character

**Returns:** `void`

___
<a id="increasebracketdepth"></a>

###  increaseBracketDepth

▸ **increaseBracketDepth**(): `void`

*Defined in lexer.ts:88*

Increases the current bracket depth. Used to keep track of matching brackets.

**Returns:** `void`

___
<a id="increaseparendepth"></a>

###  increaseParenDepth

▸ **increaseParenDepth**(): `void`

*Defined in lexer.ts:104*

Increases the current parenthesis depth. Used to keep track of matching parentheses.

**Returns:** `void`

___
<a id="lookahead"></a>

###  lookAhead

▸ **lookAhead**():  `string` &#124; `unique symbol`

*Defined in lexer.ts:152*

Returns the next character, without advancing.

**Returns:**  `string` &#124; `unique symbol`

___
<a id="lookbehind"></a>

###  lookBehind

▸ **lookBehind**():  [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`> &#124; `undefined`

*Defined in lexer.ts:162*

Returns the last emitted token, or `undefined` if no token has been emitted yet.

**Returns:**  [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`> &#124; `undefined`

___
<a id="lookbehindfortypes"></a>

###  lookBehindForTypes

▸ **lookBehindForTypes**(...types: *`TokenType`[]*):  [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`> &#124; `undefined`

*Defined in lexer.ts:209*

Returns the last `n` tokens for the requested token types. `n` is the amount of passed in types

**Parameters:**

| Param | Type | Description |
| ------ | ------ | ------ |
| `Rest` types | `TokenType`[] |  The types to look for |

**Returns:**  [ILexToken](../interfaces/_lexer_.ilextoken.md)<`TokenType`> &#124; `undefined`

___
<a id="next"></a>

###  next

▸ **next**():  `string` &#124; `unique symbol`

*Defined in lexer.ts:120*

Returns the next character in the currently lexed string, or `Symbol('EOS')` if the end of the string has been reached

**Returns:**  `string` &#124; `unique symbol`

___

