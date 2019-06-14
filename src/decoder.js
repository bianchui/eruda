// String, Number, Boolean
// Date, RegExp, Error
// Array
// ArrayBuffer
// Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, DataView
// Set, Map, WeakSet, WeakMap

export const TypeIds = {
  Unknown: -1,
  Undefined: 0,
  Null: 1,
  //Boolean: 2,
  //Number: 3,
  Funcion: 4,
  //String: 5,
  Object: 6,
  Bigint: 7,
  Symbol: 8,
};

export const ObjIds = {
  Boolean: 1,
  Number: 2,
  String: 3,
  Date: 4,
  RegExp: 5,

  Array: 10,
  Set: 11,
  Map: 12,
  WeakSet: 13,
  WeakMap: 14,

  Error: 20,

  ArrayBuffer: 30,

  Int8Array: 31,
  Uint8Array: 32,
  Uint8ClampedArray: 33,
  Int16Array: 34,
  Uint16Array: 35,
  Int32Array: 36,
  Uint32Array: 37,
  Float32Array: 38,
  Float64Array: 39,

  DataView: 40,
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
  var o;
  switch (obj.t) {
    case ObjIds.Boolean:
      o = new Boolean(obj.k);
      break;
    case ObjIds.Number:
      o = new Number(obj.k);
      break;
    case ObjIds.String:
      o = new String(obj.k);
      break;
    case ObjIds.Date:
      o = new Date(obj.k);
      break;
    case ObjIds.RegExp:
      o = RegExp ? new RegExp(obj.k) : 'RegExp(' + obj.k + ')';

    case ObjIds.Array:
      o = [];
      break;

    case ObjIds.Set:
      o = new Set();
      break;
    case ObjIds.Map:
      o = new Map();
      break;
    case ObjIds.WeakSet:
      o = new WeakSet();
      break;
    case ObjIds.WeakMap:
      o = new WeakMap();
      break;

    case ObjIds.Error:
      o = obj.s;
      break;

    case ObjIds.ArrayBuffer:
      o = new ArrayBuffer(1);
      break;
    case ObjIds.Int8Array:
      break;
    case ObjIds.Uint8Array:
      break;
    case ObjIds.Uint8ClampedArray:
      break;
    case ObjIds.Int16Array:
      break;
    case ObjIds.Uint16Array:
      break;
    case ObjIds.Int32Array:
      break;
    case ObjIds.Uint32Array:
      break;
    case ObjIds.Float32Array:
      break;
    case ObjIds.Float64Array:
      break;
    case ObjIds.DataView:
      break;

    default:
      o = {};
      break;
  }
  ctx.o[i] = o;
  if (typeof o !== 'object') {
    return o;
  }
  var v = obj.v;
  for (var p in v) {
    o[p] = decodeValue(ctx, v[p]);
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
