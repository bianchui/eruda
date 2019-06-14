import { TypeIds } from './decoder.js';

const kMaxObj = 100;

function encodeValue(ctx, v) {
  var t = typeof v;
  switch (t) {
    case 'undefined':
      return { t: TypeIds.Undefined };
    case 'boolean':
    case 'number':
    case 'string':
      return v;
    case 'function':
      // eval("(function() { return function 'v'() { '...' } })()");
      return { t: TypeIds.Funcion, v: v.name };
    case 'object':
      if (v === null) {
        return v;
      } else {
        return { t: TypeIds.Object, v: encodeObject(ctx, v) };
      }
    case 'bigint':
      // v = BigInt(v)
      return { t: TypeIds.Bigint, v: v.toString() };
    case 'symbol':
      // Symbol.for(v)
      return { t: TypeIds.Symbol, v: Symbol.keyFor(v) };
    default:
      return { t: TypeIds.Unknown, v: t };
  }
};

function encodeObject(ctx, obj) {
  var id;
  if (!ctx._objmap) {
    ctx._objmap = new Map();
  } else {
    id = ctx._objmap.get(obj);
    if (id !== undefined) {
      return id;
    }
  }
  if (!ctx.o) {
    ctx.o = [];
  }
  if (ctx.o.length >= kMaxObj) {
    return -1;
  }
  var o = {};
  id = ctx.o.length;
  ctx.o.push(o);
  ctx._objmap.set(obj, id);
  for (var p in obj) {
    o[p] = encodeValue(ctx, obj[p]);
  }
  return id;
};

export function encode() {
  var args = [];
  var ctx = {};
  var argc = arguments.length;
  for (var i = 0; i < argc; ++i) {
    args[i] = encodeValue(ctx, arguments[i]);
  }
  var ret = {
    a: args
  };
  if (ctx.o) {
    ret.o = ctx.o;
  }
  return ret;
}
