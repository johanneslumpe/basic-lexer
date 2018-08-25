export const EOS = Symbol('EOS');

export interface IBaseLexToken<T, D> {
  /**
   * The lexed value of the token
   */
  value: string;

  /**
   * The token type
   */
  type: T;

  /**
   * The position where token extraction started
   */
  startPos: number;

  /**
   * The position where token extraction ended.
   * This is the position excluding the token.
   */
  endPos: number;

  /**
   * Additional custom meta data
   */
  data?: D;
}

export class Lexer<TokenTypes, AdditionalTokenData = {}> {
  /**
   * The current reading position
   */
  private pos: number = 0;

  /**
   * The current position from which a token will be extracted
   */
  private start: number = 0;

  /**
   * The string to lex
   */
  private str: string = '';

  /**
   * The current bracket depth
   */
  private bracketDepth: number = 0;

  /**
   * The current parentheses depth
   */
  private parenDepth: number = 0;

  /**
   * The lexes tokens
   */
  private tokens: Array<IBaseLexToken<TokenTypes, AdditionalTokenData>> = [];

  constructor(str: string) {
    this.str = str;
  }

  /**
   * The current starting position.
   */
  get startPos() {
    return this.start;
  }

  /**
   * The current reading position.
   */
  get currentPos() {
    return this.pos;
  }

  /**
   * The current bracket depth
   */
  get currentBracketDepth() {
    return this.bracketDepth;
  }

  /**
   * The current parenthesis depth
   */
  get currentParenDepth() {
    return this.parenDepth;
  }

  /**
   * Returns an array of emitted tokens
   */
  get emittedTokens() {
    return this.tokens.slice();
  }

  /**
   * Increases the current bracket depth.
   * Used to keep track of matching brackets.
   */
  public increaseBracketDepth() {
    this.bracketDepth += 1;
  }

  /**
   * Decreases the current bracket depth.
   * Used to keep track of matching brackets.
   */
  public decreaseBracketDepth() {
    this.bracketDepth -= 1;
  }

  /**
   * Increases the current parenthesis depth.
   * Used to keep track of matching parentheses.
   */
  public increaseParenDepth() {
    this.parenDepth += 1;
  }

  /**
   * Decreases the current parenthesis depth.
   * Used to keep track of matching parentheses.
   */
  public decreaseParenDepth() {
    this.parenDepth -= 1;
  }

  /**
   * Returns the next character in the currently lexed string, or
   * `Symbol('EOS')` if the end of the string has been reached
   */
  public next() {
    const currentPos = this.pos;
    // we must always increment the position, even if we are outside
    // of the maximum string length now, in order to not break the
    // behavior of `acceptRun`.
    this.pos += 1;
    if (this.str.length <= currentPos) {
      return EOS;
    }

    return this.str[currentPos];
  }

  /**
   * Decrements the current position by one.
   * Does not decrement past 0.
   */
  public backup() {
    this.pos = this.pos === 0 ? this.pos : this.pos - 1;
  }

  /**
   * Sets the start position to the current position
   * to ignore the last read character
   */
  public ignore() {
    this.start = this.pos;
  }

  /**
   * Returns the next character, without advancing.
   */
  public lookAhead() {
    const char = this.next();
    this.backup();
    return char;
  }

  /**
   * Returns the last emitted token, or `undefined` if
   * no token has been emitted yet.
   */
  public lookBehind():
    | IBaseLexToken<TokenTypes, AdditionalTokenData>
    | undefined {
    return this.tokens[this.tokens.length - 1];
  }

  /**
   * Emits a token for the passed in type, based on the
   * start and current position.
   *
   * @param type TokenType - the token type to emit
   */
  public emit(type: TokenTypes, tokenData?: AdditionalTokenData) {
    const endPos = this.pos - this.start;
    const t = {
      data: tokenData,
      endPos: this.pos,
      startPos: this.start,
      type,
      value: this.str.substr(this.start, endPos),
    };
    this.tokens.push(t);
    this.start = this.pos;
  }

  /**
   * Pushes an error token onto the tokens array
   * @param type error type
   * @param message error message
   */
  public emitError(type: TokenTypes, message: string) {
    this.tokens.push({
      endPos: this.pos,
      startPos: this.start,
      type,
      value: message,
    });
  }

  /**
   * Advances the current position as long as `predicate` returns true
   * @param predicate
   */
  public acceptRun(predicate: (char: string) => boolean) {
    let next = this.next();
    while (next !== EOS && predicate(next)) {
      next = this.next();
    }
    this.backup();
  }

  /**
   * Returns the last `n` tokens for the requested token types.
   * `n` is the amount of passed in types
   * @param types The types to look for
   */
  public lookBehindForTypes(
    ...types: TokenTypes[]
  ): IBaseLexToken<TokenTypes, AdditionalTokenData> | undefined {
    // TODO improve performance if necessary
    return this.tokens
      .slice()
      .reverse()
      .find(token => types.includes(token.type));
  }
}
