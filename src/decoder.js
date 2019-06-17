// String, Number, Boolean
// Date, RegExp, Error
// Array
// ArrayBuffer
// Int8Array, Uint8Array, Uint8ClampedArray, Int16Array, Uint16Array, Int32Array, Uint32Array, Float32Array, Float64Array, DataView
// Set, Map, WeakSet, WeakMap

//const global = window ? window : (global ? global : (GameGlobal ? GameGlobal : {}));
const global = window;

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

function objWithClass(n) {
  var con = eval('(function() { return function ' + n + '() {} })()');
  return new con();
}

function decodeObject(ctx, i, obj) {
  var o;
  switch (obj.t) {
    case ObjIds.Boolean:
      o = new Boolean(obj.v);
      break;
    case ObjIds.Number:
      o = new Number(obj.v);
      break;
    case ObjIds.String:
      o = new String(obj.v);
      break;
    case ObjIds.Date:
      o = new Date(obj.v);
      break;
    case ObjIds.RegExp:
      o = new RegExp(obj.s, obj.f);
      break;

    case ObjIds.Array:
      o = new Array(obj.l);
      break;

    case ObjIds.Set:
      o = Set ? new Set() : 'Set()';
      break;
    case ObjIds.Map:
      o = Map ? new Map() : 'Map()';
      break;
    case ObjIds.WeakSet:
      o = WeakSet ? new WeakSet() : 'WeakSet()';
      break;
    case ObjIds.WeakMap:
      o = WeakMap ? new WeakMap() : 'WeakMap()';
      break;

    case ObjIds.Error:
      if (obj.n && global[obj.n]) {
        o = new global[obj.n](obj.m);
        o.stack = obj.s;
      } else {
        o = obj.s;
      }
      break;

    case ObjIds.ArrayBuffer:
      o = new ArrayBuffer(obj.l);
      break;
    case ObjIds.Int8Array:
      o = new Int8Array(obj.l);
      break;
    case ObjIds.Uint8Array:
      o = new Uint8Array(obj.l);
      break;
    case ObjIds.Uint8ClampedArray:
      o = new Uint8ClampedArray(obj.l);
      break;
    case ObjIds.Int16Array:
      o = new Int16Array(obj.l);
      break;
    case ObjIds.Uint16Array:
      o = new Uint16Array(obj.l);
      break;
    case ObjIds.Int32Array:
       o = new Int32Array(obj.l);
      break;
    case ObjIds.Uint32Array:
      o = new Uint32Array(obj.l);
      break;
    case ObjIds.Float32Array:
      o = new Float32Array(obj.l);
      break;
    case ObjIds.Float64Array:
      o = new Float64Array(obj.l);
      break;
    case ObjIds.DataView:
      o = DataView ? new DataView(new ArrayBuffer(4)) : 'DataView()';
      break;

    default:
      if (obj.n !== undefined) {
        o = objWithClass(obj.n);
      } else {
        o = {};
      }
      break;
  }
  ctx.o[i] = o;
  if (typeof o !== 'object') {
    return o;
  }
  var v = obj.p;
  if (v) {
    for (var p in v) {
      o[p] = decodeValue(ctx, v[p]);
    }
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
