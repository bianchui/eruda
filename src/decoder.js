// String, Number, Boolean
// Date, RegExp
// Array
// ArrayBuffer
// Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array
// Set, Map, WeakSet, WeakMap

export const TypeIds = {
  Undefined: 0,
  Null: 1,
  Boolean: 2,
  Number: 3,
  Funcion: 4,
  String: 5,
  Object: 6,
  Bigint: 7,
  Symbol: 8,
  Unknown: 9,
};

function decodeValue(ctx, v) {
  if (v === null) {
    return null;
  }
  var t = typeof v;
  if (t !== 'object') {
    return v;
  }
  switch (v.t) {
    case TypeIds.Undefined:
      return undefined;
    //case TypeIds.Null:
    //  return null;
    //case TypeIds.Boolean:
    //  return v.v;
    //case TypeIds.Number:
    //  return v.v;
    case TypeIds.Funcion:
      return eval('(function() { return function ' + v.v + '() { "..." } })()');
    //case TypeIds.String:
    //  return v.v;
    case TypeIds.Object:
      if (v.v === -1) {
        return {'...': '...'};
      }
      //console.assert(ctx.o[v.v]);
      return ctx.o[v.v];
    case TypeIds.Bigint:
      return /*BigInt ? BigInt(v.v) : */'BigInt(' + v.v + ')';
    case TypeIds.Symbol:
      return Symbol ? Symbol.for(v.v) : 'Symbol(' + v.v + ')';
    case TypeIds.Unknown:
      return v.v;
  }
}

function decodeObject(ctx, i, obj) {
  var o = {};
  ctx.o[i] = o;
  for (var p in obj) {
    o[p] = decodeValue(ctx, obj[p]);
  }
  return o;
}

export function decode(args) {
  if (Array.isArray(args)) {
    return args;
  }
  const a = args.a;
  const ctx = {};
  if (args.o) {
    var o = args.o;
    ctx.o = [];
    for (let i = o.length - 1; i >= 0; i--) {
      decodeObject(ctx, i, o[i]);
    }
  }
  const ret = [];
  for (let i = a.length - 1; i >= 0; i--) {
    ret[i] = decodeValue(ctx, a[i]);
  }
  return ret;
}
