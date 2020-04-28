import readline from 'readline';
import { Lexer } from 'xlex';
import { LRParser } from '@yjl9903/xparse';

import { Complex } from './complex';

enum Token {
  Number = 'Number',
  Imaginary = 'Imaginary',
  Plus = 'Plus',
  Minus = 'Minus',
  Mul = 'Mul',
  Div = 'Div',
  LRound = 'LRound',
  RRound = 'RRound',
  ABS = 'ABS',
  ARG = 'ARG',
  NORM = 'NORM',
  CONJ = 'CONJ',
}

enum Type {
  Expr = 'Expr',
  Term = 'Term',
  Factor = 'Factor',
}

const LexerRule = {
  hooks: {},
  tokens: [
    {
      type: Token.Number,
      rule: '[0-9]+(.[0-9]+)?(e|E)?-?([0-9]+)?',
      callback({ type, value }) {
        const num = Number.parseFloat(value);
        return {
          type,
          value: new Complex(num, 0),
        };
      },
    },
    {
      type: Token.Imaginary,
      rule: '[0-9]+(.[0-9]+)?i|i',
      callback({ type, value }) {
        if (value === 'i') {
          return {
            type,
            value: new Complex(0, 1),
          };
        }
        const num = Number.parseFloat(value.replace('i', ''));
        return {
          type,
          value: new Complex(0, num),
        };
      },
    },
    {
      type: Token.Plus,
      rule: '\\+',
    },
    {
      type: Token.Minus,
      rule: '-',
    },
    {
      type: Token.Mul,
      rule: '\\*',
    },
    {
      type: Token.Div,
      rule: '/',
    },
    {
      type: Token.LRound,
      rule: '\\(',
    },
    {
      type: Token.RRound,
      rule: '\\)',
    },
    {
      type: Token.ABS,
      rule: 'abs',
    },
    {
      type: Token.ARG,
      rule: 'arg',
    },
    {
      type: Token.NORM,
      rule: 'norm',
    },
    {
      type: Token.CONJ,
      rule: 'conj',
    },
  ],
};

const ParserRule = {
  hooks: {},
  tokens: Reflect.ownKeys(Token) as string[],
  types: Reflect.ownKeys(Type) as string[],
  start: Type.Expr,
  productions: [
    {
      left: Type.Expr,
      right: [
        {
          rule: [Type.Expr, Token.Plus, Type.Term],
          reduce(a, Plus, b) {
            return Complex.add(a, b);
          },
        },
        {
          rule: [Type.Expr, Token.Minus, Type.Term],
          reduce(a, Sub, b) {
            return Complex.sub(a, b);
          },
        },
        {
          rule: [Type.Term],
          reduce(value) {
            return value;
          },
        },
      ],
    },
    {
      left: Type.Term,
      right: [
        {
          rule: [Type.Term, Token.Mul, Type.Factor],
          reduce(a, Mul, b) {
            return Complex.mul(a, b);
          },
        },
        {
          rule: [Type.Term, Token.Div, Type.Factor],
          reduce(a, Div, b) {
            return Complex.div(a, b);
          },
        },
        {
          rule: [Type.Factor],
          reduce(value) {
            return value;
          },
        },
      ],
    },
    {
      left: Type.Factor,
      right: [
        {
          rule: [Token.Number],
          reduce(a) {
            return a.value;
          },
        },
        {
          rule: [Token.Imaginary],
          reduce(a) {
            return a.value;
          },
        },
        {
          rule: [Token.LRound, Type.Expr, Token.RRound],
          reduce(L, value) {
            return value;
          },
        },
        {
          rule: [Token.ABS, Token.LRound, Type.Expr, Token.RRound],
          reduce(abs, L, value) {
            return value.abs();
          },
        },
        {
          rule: [Token.ARG, Token.LRound, Type.Expr, Token.RRound],
          reduce(arg, L, value) {
            return value.arg();
          },
        },
        {
          rule: [Token.NORM, Token.LRound, Type.Expr, Token.RRound],
          reduce(norm, L, value) {
            return value.norm();
          },
        },
        {
          rule: [Token.CONJ, Token.LRound, Type.Expr, Token.RRound],
          reduce(conj, L, value) {
            return value.conj();
          },
        },
      ],
    },
  ],
};

const lexer = new Lexer(LexerRule);

const parser = new LRParser(ParserRule);

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.prompt();

rl.on('line', (input: string) => {
  try {
    const tokens = lexer.run(input.trimRight());
    try {
      const result = parser.parse(tokens);
      if (result.ok) {
        console.log(result.value.toString());
      } else {
        console.log('[XParse Error]:', result.token);
      }
    } catch (err) {
      console.log('[XParse Error]:', err.message);
    }
  } catch (err) {
    console.log('[XLex Error]:', err.message);
  } finally {
    rl.prompt();
  }
});
