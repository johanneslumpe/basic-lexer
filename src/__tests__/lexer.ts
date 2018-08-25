import { EOS, Lexer } from '../lexer';

describe('Lexer', () => {
  enum TokenType {
    TEST_TOKEN,
    TEST_TOKEN_B,
    ERROR_TOKEN,
  }

  enum SubTokenType {
    TEST_TOKEN_SUB,
  }

  interface ITokenData {
    subType?: SubTokenType;
    randomData?: string;
  }

  let lexer: Lexer<TokenType, ITokenData>;

  beforeEach(() => (lexer = new Lexer('abcd')));

  describe('#next', () => {
    it('should return the next character in the string', () => {
      expect(lexer.next()).toBe('a');
    });

    it('should return `EOS` if the end of the string is reached', () => {
      lexer.next();
      lexer.next();
      lexer.next();
      lexer.next();
      const result = lexer.next();
      expect(result).toBe(EOS);
    });

    it('should return `EOS` for an empty string', () => {
      const l = new Lexer('');
      expect(l.next()).toBe(EOS);
    });

    it('should advance `pos` even if it extends beyong the current string length', () => {
      lexer.next();
      lexer.next();
      lexer.next();
      lexer.next();
      lexer.next();
      expect(lexer.currentPos).toBe(5);
    });
  });

  describe('#emit', () => {
    it('should emit a token with `type` `value`, based on the current `start` and `pos` values', () => {
      lexer.next();
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN);

      expect(lexer.emittedTokens[0]).toEqual({
        endPos: 2,
        startPos: 0,
        type: TokenType.TEST_TOKEN,
        value: 'ab',
      });
    });

    it('should set `startPos` to the current position value', () => {
      lexer.next();
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN);

      expect(lexer.currentPos).toBe(2);
      expect(lexer.startPos).toBe(2);
    });

    it('should allow custom data to be passed', () => {
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN, {
        randomData: 'test',
        subType: SubTokenType.TEST_TOKEN_SUB,
      });

      expect(lexer.emittedTokens).toEqual([
        {
          data: {
            randomData: 'test',
            subType: SubTokenType.TEST_TOKEN_SUB,
          },
          endPos: 1,
          startPos: 0,
          type: TokenType.TEST_TOKEN,
          value: 'a',
        },
      ]);
    });
  });

  describe('#emitError', () => {
    it('should push an error token to the token array', () => {
      lexer.emitError(TokenType.ERROR_TOKEN, 'test');
      expect(lexer.emittedTokens).toEqual([
        {
          endPos: 0,
          startPos: 0,
          type: TokenType.ERROR_TOKEN,
          value: 'test',
        },
      ]);
    });
  });

  describe('#lookAhead', () => {
    it('should return the next character without advancing the position', () => {
      expect(lexer.lookAhead()).toBe('a');
      expect(lexer.startPos).toBe(0);
      expect(lexer.currentPos).toBe(0);
    });

    it('should return `EOS` if no next char exists', () => {
      const l = new Lexer('');
      expect(l.lookAhead()).toBe(EOS);
    });
  });

  describe('#lookBehind', () => {
    it('should return the last emitted token', () => {
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN);

      expect(lexer.lookBehind()).toEqual({
        endPos: 1,
        startPos: 0,
        type: TokenType.TEST_TOKEN,
        value: 'a',
      });
    });

    it('should return `undefined` if no token has been emitted yet', () => {
      expect(lexer.lookBehind()).toBe(undefined);
    });
  });

  describe('#backup', () => {
    it('should move the current position back by one character', () => {
      lexer.next();
      lexer.next();
      lexer.backup();
      expect(lexer.currentPos).toBe(1);
    });

    it('should not backup past 0', () => {
      lexer.backup();
      expect(lexer.currentPos).toBe(0);
    });
  });

  describe('#ignore', () => {
    it('should set the start position to the current reading position', () => {
      lexer.next();
      lexer.ignore();
      expect(lexer.currentPos).toBe(1);
      expect(lexer.startPos).toBe(1);
    });
  });

  describe('#acceptRun', () => {
    it('should accept characters as long as `predicate` returns `true`', () => {
      const l = new Lexer('testing+this');
      const charText = (char: string) => 'testing'.includes(char);
      l.acceptRun(charText);
      expect(l.currentPos).toBe(7);
    });
  });

  describe('#increaseBracketDepth', () => {
    it('should increase the bracket depth value', () => {
      lexer.increaseBracketDepth();
      expect(lexer.currentBracketDepth).toBe(1);
      lexer.increaseBracketDepth();
      expect(lexer.currentBracketDepth).toBe(2);
    });
  });

  describe('#decreaseBracketDepth', () => {
    it('should increase the bracket depth value', () => {
      lexer.increaseBracketDepth();
      lexer.increaseBracketDepth();
      lexer.decreaseBracketDepth();
      expect(lexer.currentBracketDepth).toBe(1);
      lexer.decreaseBracketDepth();
      expect(lexer.currentBracketDepth).toBe(0);
    });
  });

  describe('#increaseParenDepth', () => {
    it('should increase the paren depth value', () => {
      lexer.increaseParenDepth();
      expect(lexer.currentParenDepth).toBe(1);
      lexer.increaseParenDepth();
      expect(lexer.currentParenDepth).toBe(2);
    });
  });

  describe('#decreaseParenDepth', () => {
    it('should increase the bracket depth value', () => {
      lexer.increaseParenDepth();
      lexer.increaseParenDepth();
      lexer.decreaseParenDepth();
      expect(lexer.currentParenDepth).toBe(1);
      lexer.decreaseParenDepth();
      expect(lexer.currentParenDepth).toBe(0);
    });
  });

  describe('#lookBehindForTypes', () => {
    it('should return the most recent token of the given types', () => {
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN);
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN);
      lexer.next();
      lexer.emit(TokenType.TEST_TOKEN_B);

      expect(
        lexer.lookBehindForTypes(TokenType.TEST_TOKEN, TokenType.TEST_TOKEN_B),
      ).toEqual({
        data: undefined,
        endPos: 3,
        startPos: 2,
        type: TokenType.TEST_TOKEN_B,
        value: 'c',
      });

      expect(lexer.lookBehindForTypes(TokenType.TEST_TOKEN)).toEqual({
        data: undefined,
        endPos: 2,
        startPos: 1,
        type: TokenType.TEST_TOKEN,
        value: 'b',
      });
    });
  });
});
