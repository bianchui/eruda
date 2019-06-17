import { TypeIds, ObjIds } from './decoder.js';

const kMaxObj = 100;

function encodeValue(ctx, v) {
  const t = typeof v;
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
        return encodeObject(ctx, v);
      }
    case 'bigint':
      // v = BigInt(v)
      return { t: TypeIds.Bigint, v: v.toString() };
    case 'symbol':
      // Symbol.for(v)
      return { t: TypeIds.Symbol, v: Symbol.keyFor(v) };
    default:
      return { t: TypeIds.Unknown, v: v.toString() };
  }
};

const Object_getOwnPropertyDescriptor = Object.getOwnPropertyDescriptor;

// return true if already fully handled, to skip next process
function encodeObjDetail(obj, o) {
  if (obj instanceof String) {
    o.t = ObjIds.String;
    o.v = String(obj);
    for (var p in obj) {
      var desc = Object_getOwnPropertyDescriptor(obj, p);
      if (desc.writable) {
        o.p[p] = obj[p];
      }
    }
    return true;
  } else if (obj instanceof Number) {
    o.t = ObjIds.Number;
    o.v = Number(obj);
  } else if (obj instanceof Boolean) {
    o.t = ObjIds.Boolean;
    o.v = Boolean(obj);
  } else if (obj instanceof Error) {
    o.t = ObjIds.Error;
    o.n = obj.constructor.name;
    //o.v = obj.toString();
    o.m = obj.message;
    o.s = obj.stack;
  } else if (obj instanceof Date) {
    o.t = ObjIds.Date;
    o.v = obj.getTime();
  } else if (obj instanceof RegExp) {
    o.t = ObjIds.RegExp;
    o.s = obj.source;
    o.f = obj.flags;
  } else if (Array.isArray(obj)) {
    o.t = ObjIds.Array;
    o.l = obj.length;
    return false;
  } else if (obj instanceof ArrayBuffer) {
    o.t = ObjIds.ArrayBuffer;
    o.l = obj.byteLength;
  } else if (ArrayBuffer.isView(obj)) {
    if (obj instanceof Int8Array) {
      o.t = ObjIds.Int8Array;
    } else if (obj instanceof Uint8Array) {
      o.t = ObjIds.Uint8Array;
    } else if (obj instanceof Uint8ClampedArray) {
      o.t = ObjIds.Uint8ClampedArray;
    } else if (obj instanceof Int16Array) {
      o.t = ObjIds.Int16Array;
    } else if (obj instanceof Uint16Array) {
      o.t = ObjIds.Uint16Array;
    } else if (obj instanceof Int32Array) {
      o.t = ObjIds.Int32Array;
    } else if (obj instanceof Uint32Array) {
      o.t = ObjIds.Uint32Array;
    } else if (obj instanceof Float32Array) {
      o.t = ObjIds.Float32Array;
    } else if (obj instanceof Float64Array) {
      o.t = ObjIds.Float64Array;
    } else if (obj instanceof DataView) {
      o.t = ObjIds.DataView;
      return false;
    }
    o.l = obj.length;
    return false;
  } else if (obj instanceof Set) {
    o.t = ObjIds.Set;
    o.s = obj.size;
  } else if (obj instanceof Map) {
    o.t = ObjIds.Map;
    o.s = obj.size;
  } else if (obj instanceof WeakSet) {
    o.t = ObjIds.WeakSet;
  } else if (obj instanceof WeakMap) {
    o.t = ObjIds.WeakMap;
  } else {
    if (obj.constructor && obj.constructor.name !== undefined && obj.constructor.name !== 'Object') {
      o.n = obj.constructor.name;
    }
    return false;
  }
  return false;
}

function encodeObject(ctx, obj) {
  let id;
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
  id = { t: TypeIds.Object, v: ctx.o.length };
  const v = {};
  const o = {p : v};
  ctx.o.push(o);
  ctx._objmap.set(obj, id);

  if (!encodeObjDetail(obj, o)) {
    for (var p in obj) {
      v[p] = encodeValue(ctx, obj[p]);
    }
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
