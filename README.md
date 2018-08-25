# basic-lexer

![Build status](https://travis-ci.org/johanneslumpe/basic-lexer.svg?branch=master)
[![codecov](https://codecov.io/gh/johanneslumpe/basic-lexer/branch/master/graph/badge.svg)](https://codecov.io/gh/johanneslumpe/basic-lexer)

This basic lexer class is meant to be used within a larger lexing project. It is a state container for valuable lexing information and token extraction.

## Get it

`npm i @johanneslumpe/basic-lexer`

## Use it

Below you can find a contrived example. It is purposefully kept basic to illustrate how to use the lexer. While the example below could have also easily been solved using a simple regular expression, they are in general hard to read and debug. Using a lexer gives you a lot more flexibility and your code remains readable and easily debuggable.

```ts
import { EOS, Lexer } from '@johanneslumpe/basic-lexer';

/**
 * The tokens of the grammer we want to lex. We are keeping it very basic here
 */
const enum IMyTokens {
  WORD = 'WORD',
  SPACE = 'SPACE',
  PERIOD = 'PERIOD',
  LEXING_ERROR = 'ERROR',
}

// We have to define some functions which are going to utilize the lexer to tokenize a string.
type MyTokenLexer = Lexer<IMyTokens>;
// This state function pattern is inspired by a talk on lexing in Go by Rob Pike.
type stateFn = (lexer: MyTokenLexer) => stateFn | undefined;

/**
 * This predicate function is going to be used to determine whether or not
 * a character is part of a word token
 */
const validWordChar = (char: string) => {
  const charKeycode = char.charCodeAt(0);
  // a-z.
  // This could also have been a regular expression, but that would
  // most likely be overkill.
  return charKeycode >= 97 && charKeycode <= 122;
};

/**
 * Our word lexing function
 */
const lexWord = (lexer: MyTokenLexer): stateFn => {
  // `acceptRun` takes a predicate and will continue to advance the lexer's reading position
  // until the predicate returns `false`. This allows us to quickly
  lexer.acceptRun(validWordChar);
  lexer.emit(IMyTokens.WORD);
  return lexSentence;
};

/**
 * A generic error function which is used to push an error to the lexer's token array.
 * It specifically returns `undefined` to terminate the main lexing loop
 * @param error
 */
const lexError = (error: string) => (lexer: MyTokenLexer): undefined => {
  lexer.emitError(IMyTokens.LEXING_ERROR, error);
  return undefined;
};

/**
 * The main branching function of our lexer. It can lex a few basic tokens
 * like a period and a space, since those do not require any special treatment.
 * For lexing of a word it will defer to `lexWord`.
 * It will also terminate the lexing loop if the lexer reaches the end of
 * our string or when an invalid character is found.
 */
const lexSentence = (lexer: MyTokenLexer): stateFn | undefined => {
  const next = lexer.next();
  switch (next) {
    case '.':
      lexer.emit(IMyTokens.PERIOD);
      // it is important that we return `lexSentence` here to keep the loop running
      return lexSentence;
    case ' ':
      lexer.emit(IMyTokens.SPACE);
      return lexSentence;
    case EOS:
      return undefined;
  }

  if (validWordChar(next)) {
    return lexWord;
  }

  return lexError(`Invalid character found: ${next}`);
};

/**
 * This is the basic lexing loop. It will keep going until
 * a state function returns `undefined`.
 */
export const lexMySentence = (lexer: MyTokenLexer) => {
  let state: stateFn | undefined = lexSentence;
  while (state !== undefined) {
    state = state(lexer);
  }
  return lexer;
};

const myLexer = lexMySentence(new Lexer<IMyTokens>('lexing is fun.'));
console.log(myLexer.emittedTokens);
// Logs:
// [ { type: 'WORD', value: 'lexing' },
//   { type: 'SPACE', value: ' ' },
//   { type: 'WORD', value: 'is' },
//   { type: 'SPACE', value: ' ' },
//   { type: 'WORD', value: 'fun' },
//   { type: 'PERIOD', value: '.' } ]

const myOtherLexer = lexMySentence(new Lexer<IMyTokens>('lexing is l337.'));
console.log(myOtherLexer.emittedTokens);
// Logs:
// [ { type: 'WORD', value: 'lexing' },
//   { type: 'SPACE', value: ' ' },
//   { type: 'WORD', value: 'is' },
//   { type: 'SPACE', value: ' ' },
//   { type: 'WORD', value: 'l' },
//   { type: 'ERROR', value: 'Invalid character found: 3' } ]

```

## Documentation

Typedocs can be found in [the docs folder](docs/README.md)