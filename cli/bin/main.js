(function(scope){
'use strict';

function F(arity, fun, wrapper) {
  wrapper.a = arity;
  wrapper.f = fun;
  return wrapper;
}

function F2(fun) {
  return F(2, fun, function(a) { return function(b) { return fun(a,b); }; })
}
function F3(fun) {
  return F(3, fun, function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  });
}
function F4(fun) {
  return F(4, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  });
}
function F5(fun) {
  return F(5, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  });
}
function F6(fun) {
  return F(6, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  });
}
function F7(fun) {
  return F(7, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  });
}
function F8(fun) {
  return F(8, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  });
}
function F9(fun) {
  return F(9, fun, function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  });
}

function A2(fun, a, b) {
  return fun.a === 2 ? fun.f(a, b) : fun(a)(b);
}
function A3(fun, a, b, c) {
  return fun.a === 3 ? fun.f(a, b, c) : fun(a)(b)(c);
}
function A4(fun, a, b, c, d) {
  return fun.a === 4 ? fun.f(a, b, c, d) : fun(a)(b)(c)(d);
}
function A5(fun, a, b, c, d, e) {
  return fun.a === 5 ? fun.f(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
function A6(fun, a, b, c, d, e, f) {
  return fun.a === 6 ? fun.f(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a === 7 ? fun.f(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a === 8 ? fun.f(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a === 9 ? fun.f(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
}

var $gren_lang$node$Node$InitDone = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$node$Node$Uninitialized = { $: 0 };


// TASKS

function _Scheduler_succeed(value) {
  return {
    $: 0,
    a: value,
  };
}

function _Scheduler_fail(error) {
  return {
    $: 1,
    a: error,
  };
}

function _Scheduler_binding(callback) {
  return {
    $: 2,
    b: callback,
    c: null,
  };
}

var _Scheduler_andThen = F2(function (callback, task) {
  return {
    $: 3,
    b: callback,
    d: task,
  };
});

var _Scheduler_onError = F2(function (callback, task) {
  return {
    $: 4,
    b: callback,
    d: task,
  };
});

function _Scheduler_receive(callback) {
  return {
    $: 5,
    b: callback,
  };
}

// PROCESSES

var _Scheduler_guid = 0;

function _Scheduler_rawSpawn(task) {
  var proc = {
    $: 0,
    e: _Scheduler_guid++,
    f: task,
    g: null,
    h: [],
  };

  _Scheduler_enqueue(proc);

  return proc;
}

function _Scheduler_spawn(task) {
  return _Scheduler_binding(function (callback) {
    callback(_Scheduler_succeed(_Scheduler_rawSpawn(task)));
  });
}

function _Scheduler_rawSend(proc, msg) {
  proc.h.push(msg);
  _Scheduler_enqueue(proc);
}

var _Scheduler_send = F2(function (proc, msg) {
  return _Scheduler_binding(function (callback) {
    _Scheduler_rawSend(proc, msg);
    callback(_Scheduler_succeed({}));
  });
});

function _Scheduler_kill(proc) {
  return _Scheduler_binding(function (callback) {
    var task = proc.f;
    if (task && task.$ === 2 && task.c) {
      task.c();
    }

    proc.f = null;

    callback(_Scheduler_succeed({}));
  });
}

/* STEP PROCESSES

type alias Process =
  { $ : tag
  , id : unique_id
  , root : Task
  , stack : null | { $: SUCCEED | FAIL, a: callback, b: stack }
  , mailbox : [msg]
  }

*/

var _Scheduler_working = false;
var _Scheduler_queue = [];

function _Scheduler_enqueue(proc) {
  _Scheduler_queue.push(proc);
  if (_Scheduler_working) {
    return;
  }
  _Scheduler_working = true;
  while ((proc = _Scheduler_queue.shift())) {
    _Scheduler_step(proc);
  }
  _Scheduler_working = false;
}

function _Scheduler_step(proc) {
  while (proc.f) {
    var rootTag = proc.f.$;
    if (rootTag === 0 || rootTag === 1) {
      while (proc.g && proc.g.$ !== rootTag) {
        proc.g = proc.g.i;
      }
      if (!proc.g) {
        return;
      }
      proc.f = proc.g.b(proc.f.a);
      proc.g = proc.g.i;
    } else if (rootTag === 2) {
      proc.f.c = proc.f.b(function (newRoot) {
        proc.f = newRoot;
        _Scheduler_enqueue(proc);
      });
      return;
    } else if (rootTag === 5) {
      if (proc.h.length === 0) {
        return;
      }
      proc.f = proc.f.b(proc.h.shift());
    } // if (rootTag === 3 || rootTag === 4)
    else {
      proc.g = {
        $: rootTag === 3 ? 0 : 1,
        b: proc.f.b,
        i: proc.g,
      };
      proc.f = proc.f.d;
    }
  }
}
var $gren_lang$core$Task$andThen = _Scheduler_andThen;
var $gren_lang$core$Basics$apL = F2(function(f, x) {
		return f(x);
	});
var $gren_lang$core$Basics$apR = F2(function(x, f) {
		return f(x);
	});


var process = require("node:process");

var _Node_log = F2(function (text, args) {
  // NOTE: this function needs _Platform_export available to work
  console.log(text);
  return {};
});

var _Node_init = _Scheduler_binding(function (callback) {
  callback(
    _Scheduler_succeed({
      bC: process.platform,
      a_: process.arch,
      ag: process.argv,
      e: process.stdout,
      f: process.stderr,
      ac: process.stdin,
    })
  );
});

var _Node_getEnvironmentVariables = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_Node_objToDict(process.env)));
});

var _Node_exit = _Scheduler_binding(function (callback) {
  process.exit();
});

var _Node_exitWithCode = function (code) {
  return _Scheduler_binding(function (callback) {
    process.exit(code);
  });
};

var _Node_setExitCode = function (code) {
  return _Scheduler_binding(function (callback) {
    process.exitCode = code;
  });
};

// Helpers

function _Node_objToDict(obj) {
  var dict = $gren_lang$core$Dict$empty;

  for (var key in obj) {
    dict = A3($gren_lang$core$Dict$insert, key, obj[key], dict);
  }

  return dict;
}


// PROGRAMS

var _Platform_worker = F4(function (impl, flagDecoder, debugMetadata, args) {
  return _Platform_initialize(
    flagDecoder,
    args,
    impl.bm,
    impl.bW,
    impl.bR,
    function () {
      return function () {};
    }
  );
});

// INITIALIZE A PROGRAM

function _Platform_initialize(
  flagDecoder,
  args,
  init,
  update,
  subscriptions,
  stepperBuilder
) {
  var result = A2(
    _Json_run,
    flagDecoder,
    _Json_wrap(args ? args["flags"] : undefined)
  );
  $gren_lang$core$Result$isOk(result) ||
    _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);
  var managers = {};
  var initPair = init(result.a);
  var model = initPair.h;
  var stepper = stepperBuilder(sendToApp, model);
  var ports = _Platform_setupEffects(managers, sendToApp);

  function sendToApp(msg, viewMetadata) {
    var pair = A2(update, msg, model);
    stepper((model = pair.h), viewMetadata);
    _Platform_enqueueEffects(managers, pair.g, subscriptions(model));
  }

  _Platform_enqueueEffects(managers, initPair.g, subscriptions(model));

  return ports ? { ports: ports } : {};
}

// TRACK PRELOADS
//
// This is used by code in gren/browser and gren/http
// to register any HTTP requests that are triggered by init.
//

var _Platform_preload;

function _Platform_registerPreload(url) {
  _Platform_preload.add(url);
}

// EFFECT MANAGERS

var _Platform_effectManagers = {};

function _Platform_setupEffects(managers, sendToApp) {
  var ports;

  // setup all necessary effect managers
  for (var key in _Platform_effectManagers) {
    var manager = _Platform_effectManagers[key];

    if (manager.a) {
      ports = ports || {};
      ports[key] = manager.a(key, sendToApp);
    }

    managers[key] = _Platform_instantiateManager(manager, sendToApp);
  }

  return ports;
}

function _Platform_createManager(init, onEffects, onSelfMsg, cmdMap, subMap) {
  return {
    b: init,
    c: onEffects,
    d: onSelfMsg,
    e: cmdMap,
    f: subMap,
  };
}

function _Platform_instantiateManager(info, sendToApp) {
  var router = {
    g: sendToApp,
    h: undefined,
  };

  var onEffects = info.c;
  var onSelfMsg = info.d;
  var cmdMap = info.e;
  var subMap = info.f;

  function loop(state) {
    return A2(
      _Scheduler_andThen,
      loop,
      _Scheduler_receive(function (msg) {
        var value = msg.a;

        if (msg.$ === 0) {
          return A3(onSelfMsg, router, value, state);
        }

        return cmdMap && subMap
          ? A4(onEffects, router, value.i, value.j, state)
          : A3(onEffects, router, cmdMap ? value.i : value.j, state);
      })
    );
  }

  return (router.h = _Scheduler_rawSpawn(
    A2(_Scheduler_andThen, loop, info.b)
  ));
}

// ROUTING

var _Platform_sendToApp = F2(function (router, msg) {
  return _Scheduler_binding(function (callback) {
    router.g(msg);
    callback(_Scheduler_succeed({}));
  });
});

var _Platform_sendToSelf = F2(function (router, msg) {
  return A2(_Scheduler_send, router.h, {
    $: 0,
    a: msg,
  });
});

// BAGS

function _Platform_leaf(home) {
  return function (value) {
    return {
      $: 1,
      k: home,
      l: value,
    };
  };
}

function _Platform_batch(list) {
  return {
    $: 2,
    m: list,
  };
}

var _Platform_map = F2(function (tagger, bag) {
  return {
    $: 3,
    n: tagger,
    o: bag,
  };
});

// PIPE BAGS INTO EFFECT MANAGERS
//
// Effects must be queued!
//
// Say your init contains a synchronous command, like Time.now or Time.here
//
//   - This will produce a batch of effects (FX_1)
//   - The synchronous task triggers the subsequent `update` call
//   - This will produce a batch of effects (FX_2)
//
// If we just start dispatching FX_2, subscriptions from FX_2 can be processed
// before subscriptions from FX_1. No good! Earlier versions of this code had
// this problem, leading to these reports:
//
//   https://github.com/gren/core/issues/980
//   https://github.com/gren/core/pull/981
//   https://github.com/gren/compiler/issues/1776
//
// The queue is necessary to avoid ordering issues for synchronous commands.

// Why use true/false here? Why not just check the length of the queue?
// The goal is to detect "are we currently dispatching effects?" If we
// are, we need to bail and let the ongoing while loop handle things.
//
// Now say the queue has 1 element. When we dequeue the final element,
// the queue will be empty, but we are still actively dispatching effects.
// So you could get queue jumping in a really tricky category of cases.
//
var _Platform_effectsQueue = [];
var _Platform_effectsActive = false;

function _Platform_enqueueEffects(managers, cmdBag, subBag) {
  _Platform_effectsQueue.push({
    p: managers,
    q: cmdBag,
    r: subBag,
  });

  if (_Platform_effectsActive) return;

  _Platform_effectsActive = true;
  for (var fx; (fx = _Platform_effectsQueue.shift()); ) {
    _Platform_dispatchEffects(fx.p, fx.q, fx.r);
  }
  _Platform_effectsActive = false;
}

function _Platform_dispatchEffects(managers, cmdBag, subBag) {
  var effectsDict = {};
  _Platform_gatherEffects(true, cmdBag, effectsDict, null);
  _Platform_gatherEffects(false, subBag, effectsDict, null);

  for (var home in managers) {
    _Scheduler_rawSend(managers[home], {
      $: "fx",
      a: effectsDict[home] || { i: [], j: [] },
    });
  }
}

function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers) {
  switch (bag.$) {
    case 1:
      var home = bag.k;
      var effect = _Platform_toEffect(isCmd, home, taggers, bag.l);
      effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
      return;

    case 2:
      var bags = bag.m;
      for (var idx = 0; idx < bags.length; idx++) {
        _Platform_gatherEffects(isCmd, bags[idx], effectsDict, taggers);
      }
      return;

    case 3:
      _Platform_gatherEffects(isCmd, bag.o, effectsDict, {
        s: bag.n,
        t: taggers,
      });
      return;
  }
}

function _Platform_toEffect(isCmd, home, taggers, value) {
  function applyTaggers(x) {
    for (var temp = taggers; temp; temp = temp.t) {
      x = temp.s(x);
    }
    return x;
  }

  var map = isCmd
    ? _Platform_effectManagers[home].e
    : _Platform_effectManagers[home].f;

  return A2(map, applyTaggers, value);
}

function _Platform_insert(isCmd, newEffect, effects) {
  effects = effects || { i: [], j: [] };

  isCmd
    ? (effects.i = A2($gren_lang$core$Array$pushLast, newEffect, effects.i))
    : (effects.j = A2($gren_lang$core$Array$pushLast, newEffect, effects.j));

  return effects;
}

// PORTS

function _Platform_checkPortName(name) {
  if (_Platform_effectManagers[name]) {
    _Debug_crash(3, name);
  }
}

// OUTGOING PORTS

function _Platform_outgoingPort(name, converter) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    e: _Platform_outgoingPortMap,
    u: converter,
    a: _Platform_setupOutgoingPort,
  };
  return _Platform_leaf(name);
}

var _Platform_outgoingPortMap = F2(function (tagger, value) {
  return value;
});

function _Platform_setupOutgoingPort(name) {
  var subs = [];
  var converter = _Platform_effectManagers[name].u;

  // CREATE MANAGER

  var init = _Process_sleep(0);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(function (
    router,
    cmdArray,
    state
  ) {
    for (var idx = 0; idx < cmdArray.length; idx++) {
      // grab a separate reference to subs in case unsubscribe is called
      var currentSubs = subs;
      var value = _Json_unwrap(converter(cmdArray[idx]));
      for (var subIdx = 0; subIdx < currentSubs.length; subIdx++) {
        currentSubs[subIdx](value);
      }
    }
    return init;
  });

  // PUBLIC API

  function subscribe(callback) {
    subs.push(callback);
  }

  function unsubscribe(callback) {
    // copy subs into a new array in case unsubscribe is called within a
    // subscribed callback
    subs = subs.slice();
    var index = subs.indexOf(callback);
    if (index >= 0) {
      subs.splice(index, 1);
    }
  }

  return {
    subscribe: subscribe,
    unsubscribe: unsubscribe,
  };
}

// INCOMING PORTS

function _Platform_incomingPort(name, converter) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    f: _Platform_incomingPortMap,
    u: converter,
    a: _Platform_setupIncomingPort,
  };
  return _Platform_leaf(name);
}

var _Platform_incomingPortMap = F2(function (tagger, finalTagger) {
  return function (value) {
    return tagger(finalTagger(value));
  };
});

function _Platform_setupIncomingPort(name, sendToApp) {
  var subs = [];
  var converter = _Platform_effectManagers[name].u;

  // CREATE MANAGER

  var init = _Scheduler_succeed(null);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(function (
    router,
    subArray,
    state
  ) {
    subs = subArray;
    return init;
  });

  // PUBLIC API

  function send(incomingValue) {
    var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

    $gren_lang$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

    var value = result.a;
    for (var idx = 0; idx < subs.length; idx++) {
      sendToApp(subs[idx](value));
    }
  }

  return { send: send };
}

// EXPORT GREN MODULES
//
// Have DEBUG and PROD versions so that we can (1) give nicer errors in
// debug mode and (2) not pay for the bits needed for that in prod mode.
//

function _Platform_export(exports) {
  scope["Gren"]
    ? _Platform_mergeExportsProd(scope["Gren"], exports)
    : (scope["Gren"] = exports);
}

function _Platform_mergeExportsProd(obj, exports) {
  for (var name in exports) {
    name in obj
      ? name == "init"
        ? _Debug_crash(6)
        : _Platform_mergeExportsProd(obj[name], exports[name])
      : (obj[name] = exports[name]);
  }
}

function _Platform_export_UNUSED(exports) {
  scope["Gren"]
    ? _Platform_mergeExportsDebug("Gren", scope["Gren"], exports)
    : (scope["Gren"] = exports);
}

function _Platform_mergeExportsDebug(moduleName, obj, exports) {
  for (var name in exports) {
    name in obj
      ? name == "init"
        ? _Debug_crash(6, moduleName)
        : _Platform_mergeExportsDebug(
            moduleName + "." + name,
            obj[name],
            exports[name]
          )
      : (obj[name] = exports[name]);
  }
}


// LOG

var _Debug_log = F2(function (tag, value) {
  return value;
});

var _Debug_log_UNUSED = F2(function (tag, value) {
  console.log(tag + ": " + _Debug_toString(value));
  return value;
});

// TODOS

function _Debug_todo(moduleName, region) {
  return function (message) {
    _Debug_crash(8, moduleName, region, message);
  };
}

function _Debug_todoCase(moduleName, region, value) {
  return function (message) {
    _Debug_crash(9, moduleName, region, value, message);
  };
}

// TO STRING

function _Debug_toString(value) {
  return "<internals>";
}

function _Debug_toString_UNUSED(value) {
  return _Debug_toAnsiString(false, value);
}

function _Debug_toAnsiString(ansi, value) {
  if (value == null) {
    return _Debug_internalColor(ansi, "<null>");
  }

  if (typeof value === "function") {
    return _Debug_internalColor(ansi, "<function>");
  }

  if (typeof value === "boolean") {
    return _Debug_ctorColor(ansi, value ? "True" : "False");
  }

  if (typeof value === "number") {
    return _Debug_numberColor(ansi, value + "");
  }

  if (value instanceof String) {
    return _Debug_charColor(ansi, "'" + _Debug_addSlashes(value, true) + "'");
  }

  if (typeof value === "string") {
    return _Debug_stringColor(
      ansi,
      '"' + _Debug_addSlashes(value, false) + '"'
    );
  }

  if (Array.isArray(value)) {
    var output = "[";

    value.length > 0 && (output += _Debug_toAnsiString(ansi, value[0]));

    for (var idx = 1; idx < value.length; idx++) {
      output += ", " + _Debug_toAnsiString(ansi, value[idx]);
    }

    return output + "]";
  }

  if (typeof value === "object" && "$" in value) {
    var tag = value.$;

    if (typeof tag === "number") {
      return _Debug_internalColor(ansi, "<internals>");
    }

    if (tag === "Set_gren_builtin") {
      return (
        _Debug_ctorColor(ansi, "Set") +
        _Debug_fadeColor(ansi, ".fromArray") +
        " " +
        _Debug_toAnsiString(ansi, $gren_lang$core$Set$toArray(value))
      );
    }

    if (tag === "RBNode_gren_builtin" || tag === "RBEmpty_gren_builtin") {
      return (
        _Debug_ctorColor(ansi, "Dict") +
        _Debug_fadeColor(ansi, ".fromArray") +
        " " +
        _Debug_toAnsiString(ansi, $gren_lang$core$Dict$toArray(value))
      );
    }

    var output = "";
    for (var i in value) {
      if (i === "$") continue;
      var str = _Debug_toAnsiString(ansi, value[i]);
      var c0 = str[0];
      var parenless =
        c0 === "{" ||
        c0 === "(" ||
        c0 === "[" ||
        c0 === "<" ||
        c0 === '"' ||
        str.indexOf(" ") < 0;
      output += " " + (parenless ? str : "(" + str + ")");
    }
    return _Debug_ctorColor(ansi, tag) + output;
  }

  if (typeof DataView === "function" && value instanceof DataView) {
    return _Debug_stringColor(ansi, "<" + value.byteLength + " bytes>");
  }

  if (typeof File !== "undefined" && value instanceof File) {
    return _Debug_internalColor(ansi, "<" + value.name + ">");
  }

  if (typeof value === "object") {
    var output = [];
    for (var key in value) {
      var field = key[0] === "_" ? key.slice(1) : key;
      output.push(
        _Debug_fadeColor(ansi, field) +
          " = " +
          _Debug_toAnsiString(ansi, value[key])
      );
    }
    if (output.length === 0) {
      return "{}";
    }
    return "{ " + output.join(", ") + " }";
  }

  return _Debug_internalColor(ansi, "<internals>");
}

function _Debug_addSlashes(str, isChar) {
  var s = str
    .replace(/\\/g, "\\\\")
    .replace(/\n/g, "\\n")
    .replace(/\t/g, "\\t")
    .replace(/\r/g, "\\r")
    .replace(/\v/g, "\\v")
    .replace(/\0/g, "\\0");

  if (isChar) {
    return s.replace(/\'/g, "\\'");
  } else {
    return s.replace(/\"/g, '\\"');
  }
}

function _Debug_ctorColor(ansi, string) {
  return ansi ? "\x1b[96m" + string + "\x1b[0m" : string;
}

function _Debug_numberColor(ansi, string) {
  return ansi ? "\x1b[95m" + string + "\x1b[0m" : string;
}

function _Debug_stringColor(ansi, string) {
  return ansi ? "\x1b[93m" + string + "\x1b[0m" : string;
}

function _Debug_charColor(ansi, string) {
  return ansi ? "\x1b[92m" + string + "\x1b[0m" : string;
}

function _Debug_fadeColor(ansi, string) {
  return ansi ? "\x1b[37m" + string + "\x1b[0m" : string;
}

function _Debug_internalColor(ansi, string) {
  return ansi ? "\x1b[36m" + string + "\x1b[0m" : string;
}

function _Debug_toHexDigit(n) {
  return String.fromCharCode(n < 10 ? 48 + n : 55 + n);
}

// CRASH

function _Debug_crash(identifier) {
  throw new Error(
    "https://github.com/gren-lang/core/blob/1.0.0/hints/" + identifier + ".md"
  );
}

function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4) {
  switch (identifier) {
    case 0:
      throw new Error(
        'What node should I take over? In JavaScript I need something like:\n\n    Gren.Main.init({\n        node: document.getElementById("gren-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.'
      );

    case 1:
      throw new Error(
        "Browser.application programs cannot handle URLs like this:\n\n    " +
          document.location.href +
          "\n\nWhat is the root? The root of your file system?"
      );

    case 2:
      var jsonErrorString = fact1;
      throw new Error(
        "Problem with the flags given to your Gren program on initialization.\n\n" +
          jsonErrorString
      );

    case 3:
      var portName = fact1;
      throw new Error(
        "There can only be one port named `" +
          portName +
          "`, but your program has multiple."
      );

    case 4:
      var portName = fact1;
      var problem = fact2;
      throw new Error(
        "Trying to send an unexpected type of value through port `" +
          portName +
          "`:\n" +
          problem
      );

    case 5:
      throw new Error(
        'Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Gren sense.\nRead more about this at https://package.gren-lang.org/packages/gren-lang/core/latest/Basics#== which describes why it is this way and what the better version will look like.'
      );

    case 6:
      var moduleName = fact1;
      throw new Error(
        "Your page is loading multiple Gren scripts with a module named " +
          moduleName +
          ". Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!"
      );

    case 8:
      var moduleName = fact1;
      var region = fact2;
      var message = fact3;
      throw new Error(
        "TODO in module `" +
          moduleName +
          "` " +
          _Debug_regionToString(region) +
          "\n\n" +
          message
      );

    case 9:
      var moduleName = fact1;
      var region = fact2;
      var value = fact3;
      var message = fact4;
      throw new Error(
        "TODO in module `" +
          moduleName +
          "` from the `case` expression " +
          _Debug_regionToString(region) +
          "\n\nIt received the following value:\n\n    " +
          _Debug_toString(value).replace("\n", "\n    ") +
          "\n\nBut the branch that handles it says:\n\n    " +
          message.replace("\n", "\n    ")
      );

    case 10:
      throw new Error("Bug in https://github.com/gren-lang/core/issues");

    case 11:
      throw new Error("Cannot perform mod 0. Division by zero error.");
  }
}

function _Debug_regionToString(region) {
  if (region.aT.z === region.a9.z) {
    return "on line " + region.aT.z;
  }
  return (
    "on lines " + region.aT.z + " through " + region.a9.z
  );
}


var _Array_length = function (array) {
  return array.length;
};

var _Array_initialize = F3(function (size, offset, func) {
  var result = new Array(size);

  for (var i = 0; i < size; i++) {
    result[i] = func(offset + i);
  }

  return result;
});

var _Array_get = F2(function (index, array) {
  if (index < 0 || index >= array.length) {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just(array[index]);
});

var _Array_set = F3(function (index, value, array) {
  if (index < 0 || index >= array.length) {
    return array;
  }

  var result = array.slice();
  result[index] = value;

  return result;
});

var _Array_push = F2(function (value, array) {
  return array.concat([value]);
});

var _Array_foldl = F3(function (func, acc, array) {
  for (var i = 0; i < array.length; i++) {
    acc = A2(func, array[i], acc);
  }

  return acc;
});

var _Array_foldr = F3(function (func, acc, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    acc = A2(func, array[i], acc);
  }

  return acc;
});

var _Array_map = F2(function (func, array) {
  return array.map(func);
});

var _Array_indexedMap = F2(function (func, array) {
  return array.map(function (value, index) {
    return A2(func, index, value);
  });
});

var _Array_slice = F3(function (from, to, array) {
  return array.slice(from, to);
});

var _Array_append = F2(function (left, right) {
  return left.concat(right);
});

var _Array_reverse = function (array) {
  return array.slice().reverse();
};

var _Array_findFirst = F2(function (pred, array) {
  for (var i = 0; i < array.length; i++) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just(element);
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_findLast = F2(function (pred, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just(element);
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_map2 = F3(function (fn, as, bs) {
  var result = [];
  var lowestLength = as.length < bs.length ? as.length : bs.length;

  for (var i = 0; i < lowestLength; i++) {
    result.push(A2(fn, as[i], bs[i]));
  }

  return result;
});

var _Array_map3 = F4(function (fn, as, bs, cs) {
  var result = [];
  var lowestLength = [as.length, bs.length, cs.length].sort()[0];

  for (var i = 0; i < lowestLength; i++) {
    result.push(A3(fn, as[i], bs[i], cs[i]));
  }

  return result;
});

var _Array_sort = function (array) {
  return array.slice().sort(function (a, b) {
    return _Utils_cmp(a, b);
  });
};

var _Array_sortBy = F2(function (fn, array) {
  return array.slice().sort(function (a, b) {
    return _Utils_cmp(fn(a), fn(b));
  });
});

var _Array_sortWith = F2(function (fn, array) {
  return array.slice().sort(function (a, b) {
    var ord = A2(fn, a, b);
    return ord === $gren_lang$core$Basics$EQ ? 0 : ord === $gren_lang$core$Basics$LT ? -1 : 1;
  });
});


// EQUALITY

function _Utils_eq(x, y) {
  for (
    var pair, stack = [], isEqual = _Utils_eqHelp(x, y, 0, stack);
    isEqual && (pair = stack.pop());
    isEqual = _Utils_eqHelp(pair.a, pair.b, 0, stack)
  ) {}

  return isEqual;
}

function _Utils_eqHelp(x, y, depth, stack) {
  if (x === y) {
    return true;
  }

  if (typeof x !== "object" || x === null || y === null) {
    typeof x === "function" && _Debug_crash(5);
    return false;
  }

  if (depth > 100) {
    stack.push({ a: x, b: y });
    return true;
  }

  /**_UNUSED/
	if (x.$ === 'Set_gren_builtin')
	{
		x = $gren_lang$core$Set$toArray(x);
		y = $gren_lang$core$Set$toArray(y);
	}
	if (x.$ === 'RBNode_gren_builtin' || x.$ === 'RBEmpty_gren_builtin')
	{
		x = $gren_lang$core$Dict$toArray(x);
		y = $gren_lang$core$Dict$toArray(y);
	}
	//*/

  /**/
	if (x.$ < 0)
	{
		x = $gren_lang$core$Dict$toArray(x);
		y = $gren_lang$core$Dict$toArray(y);
	}
	//*/

  if (Array.isArray(x) && x.length !== y.length) {
    return false;
  }

  var nextDepth = depth + 1;

  for (var key in x) {
    if (!_Utils_eqHelp(x[key], y[key], nextDepth, stack)) {
      return false;
    }
  }

  return true;
}

var _Utils_equal = F2(_Utils_eq);
var _Utils_notEqual = F2(function (a, b) {
  return !_Utils_eq(a, b);
});

// COMPARISONS

// Code in Generate/JavaScript.hs, Basics.js, and depends on
// the particular integer values assigned to LT, EQ, and GT.

function _Utils_cmp(x, y) {
  if (typeof x !== "object") {
    return x === y ? /*EQ*/ 0 : x < y ? /*LT*/ -1 : /*GT*/ 1;
  }

  /**_UNUSED/
	if (x instanceof String)
	{
		var a = x.valueOf();
		var b = y.valueOf();
		return a === b ? 0 : a < b ? -1 : 1;
	}
	//*/

  // At this point, we can only be comparing arrays
  for (var idx = 0; idx < x.length; idx++) {
    var ord = _Utils_cmp(x[idx], y[idx]);
    if (ord !== 0) return ord;
  }

  return x.length - y.length;
}

var _Utils_lt = F2(function (a, b) {
  return _Utils_cmp(a, b) < 0;
});
var _Utils_le = F2(function (a, b) {
  return _Utils_cmp(a, b) < 1;
});
var _Utils_gt = F2(function (a, b) {
  return _Utils_cmp(a, b) > 0;
});
var _Utils_ge = F2(function (a, b) {
  return _Utils_cmp(a, b) >= 0;
});

var _Utils_compare = F2(function (x, y) {
  var n = _Utils_cmp(x, y);
  return n < 0 ? $gren_lang$core$Basics$LT : n ? $gren_lang$core$Basics$GT : $gren_lang$core$Basics$EQ;
});

// COMMON VALUES

function _Utils_chr(c) {
  return c;
}
function _Utils_chr_UNUSED(c) {
  return new String(c);
}

// RECORDS

function _Utils_update(oldRecord, updatedFields) {
  var newRecord = {};

  for (var key in oldRecord) {
    newRecord[key] = oldRecord[key];
  }

  for (var key in updatedFields) {
    newRecord[key] = updatedFields[key];
  }

  return newRecord;
}

// APPEND

var _Utils_append = F2(_Utils_ap);

function _Utils_ap(xs, ys) {
  // append Strings
  if (typeof xs === "string") {
    return xs + ys;
  }

  return xs.concat(ys);
}
var $gren_lang$core$Basics$EQ = 1;
var $gren_lang$core$Basics$GT = 2;
var $gren_lang$core$Basics$LT = 0;
var $gren_lang$core$Dict$foldl = F3(function(func, acc, dict) {
		foldl:
		while (true) {
			if (dict.$ === -2) {
				return acc;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var $temp$func = func,
				$temp$acc = A3(func, key, value, A3($gren_lang$core$Dict$foldl, func, acc, left)),
				$temp$dict = right;
				func = $temp$func;
				acc = $temp$acc;
				dict = $temp$dict;
				continue foldl;
			}
		}
	});
var $gren_lang$core$Array$pushLast = _Array_push;
var $gren_lang$core$Dict$keys = function(dict) {
	return A3($gren_lang$core$Dict$foldl, F3(function(key, value, keyArray) {
				return A2($gren_lang$core$Array$pushLast, key, keyArray);
			}), [  ], dict);
};
var $gren_lang$core$Set$toArray = function(_v0) {
	var dict = _v0;
	return $gren_lang$core$Dict$keys(dict);
};
var $gren_lang$core$Maybe$Just = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Maybe$Nothing = { $: 1 };
var $gren_lang$core$Dict$toArray = function(dict) {
	return A3($gren_lang$core$Dict$foldl, F3(function(key, value, array) {
				return A2($gren_lang$core$Array$pushLast, { bt: key, aX: value }, array);
			}), [  ], dict);
};


/**_UNUSED/
function _Json_errorToString(error)
{
	return $gren_lang$core$Json$Decode$errorToString(error);
}
//*/

// CORE DECODERS

function _Json_succeed(msg) {
  return {
    $: 0,
    a: msg,
  };
}

function _Json_fail(msg) {
  return {
    $: 1,
    a: msg,
  };
}

function _Json_decodePrim(decoder) {
  return { $: 2, b: decoder };
}

var _Json_decodeInt = _Json_decodePrim(function (value) {
  return typeof value !== "number"
    ? _Json_expecting("an INT", value)
    : Math.trunc(value) === value
    ? $gren_lang$core$Result$Ok(value)
    : isFinite(value) && !(value % 1)
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("an INT", value);
});

var _Json_decodeBool = _Json_decodePrim(function (value) {
  return typeof value === "boolean"
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("a BOOL", value);
});

var _Json_decodeFloat = _Json_decodePrim(function (value) {
  return typeof value === "number"
    ? $gren_lang$core$Result$Ok(value)
    : _Json_expecting("a FLOAT", value);
});

var _Json_decodeValue = _Json_decodePrim(function (value) {
  return $gren_lang$core$Result$Ok(_Json_wrap(value));
});

var _Json_decodeString = _Json_decodePrim(function (value) {
  return typeof value === "string"
    ? $gren_lang$core$Result$Ok(value)
    : value instanceof String
    ? $gren_lang$core$Result$Ok(value + "")
    : _Json_expecting("a STRING", value);
});

function _Json_decodeArray(decoder) {
  return { $: 3, b: decoder };
}

function _Json_decodeNull(value) {
  return { $: 4, c: value };
}

var _Json_decodeField = F2(function (field, decoder) {
  return {
    $: 5,
    d: field,
    b: decoder,
  };
});

var _Json_decodeIndex = F2(function (index, decoder) {
  return {
    $: 6,
    e: index,
    b: decoder,
  };
});

function _Json_decodeKeyValuePairs(decoder) {
  return {
    $: 7,
    b: decoder,
  };
}

function _Json_mapMany(f, decoders) {
  return {
    $: 8,
    f: f,
    g: decoders,
  };
}

var _Json_andThen = F2(function (callback, decoder) {
  return {
    $: 9,
    b: decoder,
    h: callback,
  };
});

function _Json_oneOf(decoders) {
  return {
    $: 10,
    g: decoders,
  };
}

// DECODING OBJECTS

var _Json_map1 = F2(function (f, d1) {
  return _Json_mapMany(f, [d1]);
});

var _Json_map2 = F3(function (f, d1, d2) {
  return _Json_mapMany(f, [d1, d2]);
});

var _Json_map3 = F4(function (f, d1, d2, d3) {
  return _Json_mapMany(f, [d1, d2, d3]);
});

var _Json_map4 = F5(function (f, d1, d2, d3, d4) {
  return _Json_mapMany(f, [d1, d2, d3, d4]);
});

var _Json_map5 = F6(function (f, d1, d2, d3, d4, d5) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5]);
});

var _Json_map6 = F7(function (f, d1, d2, d3, d4, d5, d6) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6]);
});

var _Json_map7 = F8(function (f, d1, d2, d3, d4, d5, d6, d7) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7]);
});

var _Json_map8 = F9(function (f, d1, d2, d3, d4, d5, d6, d7, d8) {
  return _Json_mapMany(f, [d1, d2, d3, d4, d5, d6, d7, d8]);
});

// DECODE

var _Json_runOnString = F2(function (decoder, string) {
  try {
    var value = JSON.parse(string);
    return _Json_runHelp(decoder, value);
  } catch (e) {
    return $gren_lang$core$Result$Err(
      A2(
        $gren_lang$core$Json$Decode$Failure,
        "This is not valid JSON! " + e.message,
        _Json_wrap(string)
      )
    );
  }
});

var _Json_run = F2(function (decoder, value) {
  return _Json_runHelp(decoder, _Json_unwrap(value));
});

function _Json_runHelp(decoder, value) {
  switch (decoder.$) {
    case 2:
      return decoder.b(value);

    case 4:
      return value === null
        ? $gren_lang$core$Result$Ok(decoder.c)
        : _Json_expecting("null", value);

    case 3:
      if (!_Json_isArray(value)) {
        return _Json_expecting("an ARRAY", value);
      }
      return _Json_runArrayDecoder(decoder.b, value);

    case 5:
      var field = decoder.d;
      if (typeof value !== "object" || value === null || !(field in value)) {
        return _Json_expecting(
          "an OBJECT with a field named `" + field + "`",
          value
        );
      }
      var result = _Json_runHelp(decoder.b, value[field]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Field, field, result.a));

    case 6:
      var index = decoder.e;
      if (!_Json_isArray(value)) {
        return _Json_expecting("an ARRAY", value);
      }
      if (index >= value.length) {
        return _Json_expecting(
          "a LONGER array. Need index " +
            index +
            " but only see " +
            value.length +
            " entries",
          value
        );
      }
      var result = _Json_runHelp(decoder.b, value[index]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Index, index, result.a));

    case 7:
      if (typeof value !== "object" || value === null || _Json_isArray(value)) {
        return _Json_expecting("an OBJECT", value);
      }

      var keyValuePairs = [];
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          var result = _Json_runHelp(decoder.b, value[key]);
          if (!$gren_lang$core$Result$isOk(result)) {
            return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Field, key, result.a));
          }
          keyValuePairs.push({ bt: key, aX: result.a });
        }
      }
      return $gren_lang$core$Result$Ok(keyValuePairs);

    case 8:
      var answer = decoder.f;
      var decoders = decoder.g;
      for (var i = 0; i < decoders.length; i++) {
        var result = _Json_runHelp(decoders[i], value);
        if (!$gren_lang$core$Result$isOk(result)) {
          return result;
        }
        answer = answer(result.a);
      }
      return $gren_lang$core$Result$Ok(answer);

    case 9:
      var result = _Json_runHelp(decoder.b, value);
      return !$gren_lang$core$Result$isOk(result)
        ? result
        : _Json_runHelp(decoder.h(result.a), value);

    case 10:
      var errors = [];

      var decoders = decoder.g;
      for (var idx = 0; idx < decoders.length; idx++) {
        var result = _Json_runHelp(decoders[idx], value);
        if ($gren_lang$core$Result$isOk(result)) {
          return result;
        }
        errors.push(result.a);
      }

      return $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$OneOf(errors));

    case 1:
      return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Failure, decoder.a, _Json_wrap(value)));

    case 0:
      return $gren_lang$core$Result$Ok(decoder.a);
  }
}

function _Json_runArrayDecoder(decoder, value) {
  var len = value.length;
  var array = new Array(len);
  for (var i = 0; i < len; i++) {
    var result = _Json_runHelp(decoder, value[i]);
    if (!$gren_lang$core$Result$isOk(result)) {
      return $gren_lang$core$Result$Err(A2($gren_lang$core$Json$Decode$Index, i, result.a));
    }
    array[i] = result.a;
  }
  return $gren_lang$core$Result$Ok(array);
}

function _Json_isArray(value) {
  return (
    Array.isArray(value) ||
    (typeof FileList !== "undefined" && value instanceof FileList)
  );
}

function _Json_expecting(type, value) {
  return $gren_lang$core$Result$Err(
    A2($gren_lang$core$Json$Decode$Failure, "Expecting " + type, _Json_wrap(value))
  );
}

// EQUALITY

function _Json_equality(x, y) {
  if (x === y) {
    return true;
  }

  if (x.$ !== y.$) {
    return false;
  }

  switch (x.$) {
    case 0:
    case 1:
      return x.a === y.a;

    case 2:
      return x.b === y.b;

    case 4:
      return x.c === y.c;

    case 3:
    case 7:
      return _Json_equality(x.b, y.b);

    case 5:
      return (
        x.d === y.d && _Json_equality(x.b, y.b)
      );

    case 6:
      return (
        x.e === y.e && _Json_equality(x.b, y.b)
      );

    case 8:
      return (
        x.f === y.f && _Json_arrayEquality(x.g, y.g)
      );

    case 9:
      return (
        x.h === y.h &&
        _Json_equality(x.b, y.b)
      );

    case 10:
      return _Json_arrayEquality(x.g, y.g);
  }
}

function _Json_arrayEquality(aDecoders, bDecoders) {
  var len = aDecoders.length;
  if (len !== bDecoders.length) {
    return false;
  }
  for (var i = 0; i < len; i++) {
    if (!_Json_equality(aDecoders[i], bDecoders[i])) {
      return false;
    }
  }
  return true;
}

// ENCODE

var _Json_encode = F2(function (indentLevel, value) {
  return JSON.stringify(_Json_unwrap(value), null, indentLevel) + "";
});

function _Json_wrap_UNUSED(value) {
  return { $: 0, a: value };
}
function _Json_unwrap_UNUSED(value) {
  return value.a;
}

function _Json_wrap(value) {
  return value;
}
function _Json_unwrap(value) {
  return value;
}

function _Json_emptyArray() {
  return [];
}
function _Json_emptyObject() {
  return {};
}

var _Json_addField = F3(function (key, value, object) {
  object[key] = _Json_unwrap(value);
  return object;
});

function _Json_addEntry(func) {
  return F2(function (entry, array) {
    array.push(_Json_unwrap(func(entry)));
    return array;
  });
}

var _Json_encodeNull = _Json_wrap(null);
var $gren_lang$core$Result$Err = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Json$Decode$Failure = F2(function (a, b) {
		return { $: 3, a: a, b: b };
	});
var $gren_lang$core$Json$Decode$Field = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $gren_lang$core$Json$Decode$Index = F2(function (a, b) {
		return { $: 1, a: a, b: b };
	});
var $gren_lang$core$Result$Ok = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Json$Decode$OneOf = function (a) {
	return { $: 2, a: a };
};
var $gren_lang$core$Basics$False = 1;


// MATH

var _Basics_add = F2(function (a, b) {
  return a + b;
});
var _Basics_sub = F2(function (a, b) {
  return a - b;
});
var _Basics_mul = F2(function (a, b) {
  return a * b;
});
var _Basics_fdiv = F2(function (a, b) {
  return a / b;
});
var _Basics_idiv = F2(function (a, b) {
  return Math.trunc(a / b);
});
var _Basics_pow = F2(Math.pow);

// MORE MATH

function _Basics_toFloat(x) {
  return x;
}
function _Basics_isInfinite(n) {
  return n === Infinity || n === -Infinity;
}

var _Basics_isNaN = isNaN;

// BOOLEANS

function _Basics_not(bool) {
  return !bool;
}
var _Basics_and = F2(function (a, b) {
  return a && b;
});
var _Basics_or = F2(function (a, b) {
  return a || b;
});
var _Basics_xor = F2(function (a, b) {
  return a !== b;
});
var $gren_lang$core$Basics$add = _Basics_add;


var _String_cons = F2(function (chr, str) {
  return chr + str;
});

function _String_uncons(string) {
  var word = string.charCodeAt(0);
  return !isNaN(word)
    ? $gren_lang$core$Maybe$Just(
        0xd800 <= word && word <= 0xdbff
          ? { first: _Utils_chr(string[0] + string[1]), rest: string.slice(2) }
          : { first: _Utils_chr(string[0]), rest: string.slice(1) }
      )
    : $gren_lang$core$Maybe$Nothing;
}

var _String_append = F2(function (a, b) {
  return a + b;
});

function _String_length(str) {
  return str.length;
}

var _String_map = F2(function (func, string) {
  var len = string.length;
  var array = new Array(len);
  var i = 0;
  while (i < len) {
    var word = string.charCodeAt(i);
    if (0xd800 <= word && word <= 0xdbff) {
      array[i] = func(_Utils_chr(string[i] + string[i + 1]));
      i += 2;
      continue;
    }
    array[i] = func(_Utils_chr(string[i]));
    i++;
  }
  return array.join("");
});

var _String_filter = F2(function (isGood, str) {
  var arr = [];
  var len = str.length;
  var i = 0;
  while (i < len) {
    var char = str[i];
    var word = str.charCodeAt(i);
    i++;
    if (0xd800 <= word && word <= 0xdbff) {
      char += str[i];
      i++;
    }

    if (isGood(_Utils_chr(char))) {
      arr.push(char);
    }
  }
  return arr.join("");
});

function _String_reverse(str) {
  var len = str.length;
  var arr = new Array(len);
  var i = 0;
  while (i < len) {
    var word = str.charCodeAt(i);
    if (0xd800 <= word && word <= 0xdbff) {
      arr[len - i] = str[i + 1];
      i++;
      arr[len - i] = str[i - 1];
      i++;
    } else {
      arr[len - i] = str[i];
      i++;
    }
  }
  return arr.join("");
}

var _String_foldl = F3(function (func, state, string) {
  var len = string.length;
  var i = 0;
  while (i < len) {
    var char = string[i];
    var word = string.charCodeAt(i);
    i++;
    if (0xd800 <= word && word <= 0xdbff) {
      char += string[i];
      i++;
    }
    state = A2(func, _Utils_chr(char), state);
  }
  return state;
});

var _String_foldr = F3(function (func, state, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    state = A2(func, _Utils_chr(char), state);
  }
  return state;
});

var _String_split = F2(function (sep, str) {
  return str.split(sep);
});

var _String_join = F2(function (sep, strs) {
  return strs.join(sep);
});

var _String_slice = F3(function (start, end, str) {
  return str.slice(start, end);
});

function _String_trim(str) {
  return str.trim();
}

function _String_trimLeft(str) {
  return str.replace(/^\s+/, "");
}

function _String_trimRight(str) {
  return str.replace(/\s+$/, "");
}

function _String_words(str) {
  return str.trim().split(/\s+/g);
}

function _String_lines(str) {
  return str.split(/\r\n|\r|\n/g);
}

function _String_toUpper(str) {
  return str.toUpperCase();
}

function _String_toLower(str) {
  return str.toLowerCase();
}

var _String_any = F2(function (isGood, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    if (isGood(_Utils_chr(char))) {
      return true;
    }
  }
  return false;
});

var _String_all = F2(function (isGood, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
    var word = string.charCodeAt(i);
    if (0xdc00 <= word && word <= 0xdfff) {
      i--;
      char = string[i] + char;
    }
    if (!isGood(_Utils_chr(char))) {
      return false;
    }
  }
  return true;
});

var _String_contains = F2(function (sub, str) {
  return str.indexOf(sub) > -1;
});

var _String_startsWith = F2(function (sub, str) {
  return str.indexOf(sub) === 0;
});

var _String_endsWith = F2(function (sub, str) {
  return (
    str.length >= sub.length && str.lastIndexOf(sub) === str.length - sub.length
  );
});

var _String_indexes = F2(function (sub, str) {
  var subLen = sub.length;

  if (subLen < 1) {
    return [];
  }

  var i = 0;
  var is = [];

  while ((i = str.indexOf(sub, i)) > -1) {
    is.push(i);
    i = i + subLen;
  }

  return is;
});

// TO STRING

function _String_fromNumber(number) {
  return number + "";
}

// INT CONVERSIONS

function _String_toInt(str) {
  var total = 0;
  var code0 = str.charCodeAt(0);
  var start = code0 == 0x2b /* + */ || code0 == 0x2d /* - */ ? 1 : 0;

  for (var i = start; i < str.length; ++i) {
    var code = str.charCodeAt(i);
    if (code < 0x30 || 0x39 < code) {
      return $gren_lang$core$Maybe$Nothing;
    }
    total = 10 * total + code - 0x30;
  }

  return i == start
    ? $gren_lang$core$Maybe$Nothing
    : $gren_lang$core$Maybe$Just(code0 == 0x2d ? -total : total);
}

// FLOAT CONVERSIONS

function _String_toFloat(s) {
  // check if it is a hex, octal, or binary number
  if (s.length === 0 || /[\sxbo]/.test(s)) {
    return $gren_lang$core$Maybe$Nothing;
  }
  var n = +s;
  // faster isNaN check
  return n === n ? $gren_lang$core$Maybe$Just(n) : $gren_lang$core$Maybe$Nothing;
}

function _String_fromArray(chars) {
  return chars.join("");
}
var $gren_lang$core$String$all = _String_all;
var $gren_lang$core$Basics$and = _Basics_and;
var $gren_lang$core$Basics$append = _Utils_append;
var $gren_lang$core$Json$Encode$encode = _Json_encode;
var $gren_lang$core$String$fromInt = _String_fromNumber;
var $gren_lang$core$String$join = _String_join;
var $gren_lang$core$String$split = _String_split;
var $gren_lang$core$Json$Decode$indent = function(str) {
	return A2($gren_lang$core$String$join, '\n    ', A2($gren_lang$core$String$split, '\n', str));
};
var $gren_lang$core$Array$indexedMap = _Array_indexedMap;
var $gren_lang$core$Basics$le = _Utils_le;


function _Char_toCode(char) {
  var code = char.charCodeAt(0);
  if (0xd800 <= code && code <= 0xdbff) {
    return (code - 0xd800) * 0x400 + char.charCodeAt(1) - 0xdc00 + 0x10000;
  }
  return code;
}

function _Char_fromCode(code) {
  return _Utils_chr(
    code < 0 || 0x10ffff < code
      ? "\uFFFD"
      : code <= 0xffff
      ? String.fromCharCode(code)
      : ((code -= 0x10000),
        String.fromCharCode(
          Math.floor(code / 0x400) + 0xd800,
          (code % 0x400) + 0xdc00
        ))
  );
}

function _Char_toUpper(char) {
  return _Utils_chr(char.toUpperCase());
}

function _Char_toLower(char) {
  return _Utils_chr(char.toLowerCase());
}

function _Char_toLocaleUpper(char) {
  return _Utils_chr(char.toLocaleUpperCase());
}

function _Char_toLocaleLower(char) {
  return _Utils_chr(char.toLocaleLowerCase());
}
var $gren_lang$core$Char$toCode = _Char_toCode;
var $gren_lang$core$Char$isLower = function(_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (_Utils_cmp(97, code) < 1) && (_Utils_cmp(code, 122) < 1);
};
var $gren_lang$core$Char$isUpper = function(_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (_Utils_cmp(code, 90) < 1) && (_Utils_cmp(65, code) < 1);
};
var $gren_lang$core$Basics$or = _Basics_or;
var $gren_lang$core$Char$isAlpha = function(_char) {
	return $gren_lang$core$Char$isLower(_char) || $gren_lang$core$Char$isUpper(_char);
};
var $gren_lang$core$Char$isDigit = function(_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (_Utils_cmp(code, 57) < 1) && (_Utils_cmp(48, code) < 1);
};
var $gren_lang$core$Char$isAlphaNum = function(_char) {
	return $gren_lang$core$Char$isLower(_char) || ($gren_lang$core$Char$isUpper(_char) || $gren_lang$core$Char$isDigit(_char));
};
var $gren_lang$core$Array$length = _Array_length;
var $gren_lang$core$String$uncons = _String_uncons;
var $gren_lang$core$Json$Decode$errorOneOf = F2(function(i, error) {
		return _Utils_ap('\n\n(', _Utils_ap($gren_lang$core$String$fromInt(i + 1), _Utils_ap(') ', $gren_lang$core$Json$Decode$indent($gren_lang$core$Json$Decode$errorToString(error)))));
	});
var $gren_lang$core$Json$Decode$errorToString = function(error) {
	return A2($gren_lang$core$Json$Decode$errorToStringHelp, error, [  ]);
};
var $gren_lang$core$Json$Decode$errorToStringHelp = F2(function(error, context) {
		errorToStringHelp:
		while (true) {
			switch (error.$) {
				case 0:
					var f = error.a;
					var err = error.b;
					var isSimple = function () {
						var _v1 = $gren_lang$core$String$uncons(f);
						if (_v1.$ === 1) {
							return false;
						} else {
							var _v2 = _v1.a;
							var _char = _v2.bd;
							var rest = _v2.bK;
							return $gren_lang$core$Char$isAlpha(_char) && A2($gren_lang$core$String$all, $gren_lang$core$Char$isAlphaNum, rest);
						}
					}();
					var fieldName = isSimple ? _Utils_ap('.', f) : _Utils_ap('[\'', _Utils_ap(f, '\']'));
					var $temp$error = err,
					$temp$context = _Utils_ap([ fieldName ], context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 1:
					var i = error.a;
					var err = error.b;
					var indexName = _Utils_ap('[', _Utils_ap($gren_lang$core$String$fromInt(i), ']'));
					var $temp$error = err,
					$temp$context = _Utils_ap([ indexName ], context);
					error = $temp$error;
					context = $temp$context;
					continue errorToStringHelp;
				case 2:
					var errors = error.a;
					switch (errors.length) {
						case 0:
							return _Utils_ap('Ran into a Json.Decode.oneOf with no possibilities', function () {
									if (context.length === 0) {
										return '!';
									} else {
										return _Utils_ap(' at json', A2($gren_lang$core$String$join, '', context));
									}
								}());
						case 1:
							var err = errors[0];
							var $temp$error = err,
							$temp$context = context;
							error = $temp$error;
							context = $temp$context;
							continue errorToStringHelp;
						default:
							var starter = function () {
								if (context.length === 0) {
									return 'Json.Decode.oneOf';
								} else {
									return _Utils_ap('The Json.Decode.oneOf at json', A2($gren_lang$core$String$join, '', context));
								}
							}();
							var introduction = _Utils_ap(starter, _Utils_ap(' failed in the following ', _Utils_ap($gren_lang$core$String$fromInt($gren_lang$core$Array$length(errors)), ' ways:')));
							return A2($gren_lang$core$String$join, '\n\n', _Utils_ap([ introduction ], A2($gren_lang$core$Array$indexedMap, $gren_lang$core$Json$Decode$errorOneOf, errors)));
					}
				default:
					var msg = error.a;
					var json = error.b;
					var introduction = function () {
						if (context.length === 0) {
							return 'Problem with the given value:\n\n';
						} else {
							return _Utils_ap('Problem with the value at json', _Utils_ap(A2($gren_lang$core$String$join, '', context), ':\n\n    '));
						}
					}();
					return _Utils_ap(introduction, _Utils_ap($gren_lang$core$Json$Decode$indent(A2($gren_lang$core$Json$Encode$encode, 4, json)), _Utils_ap('\n\n', msg)));
			}
		}
	});
var $gren_lang$core$Basics$True = 0;
var $gren_lang$core$Result$isOk = function(result) {
	if (!result.$) {
		return true;
	} else {
		return false;
	}
};


function _Process_sleep(time) {
  return _Scheduler_binding(function (callback) {
    var id = setTimeout(function () {
      callback(_Scheduler_succeed({}));
    }, time);

    return function () {
      clearTimeout(id);
    };
  });
}
var $gren_lang$core$Dict$RBEmpty_gren_builtin = { $: -2 };
var $gren_lang$core$Dict$empty = $gren_lang$core$Dict$RBEmpty_gren_builtin;
var $gren_lang$core$Dict$Black = 1;
var $gren_lang$core$Dict$RBNode_gren_builtin = F5(function (a, b, c, d, e) {
		return { $: -1, a: a, b: b, c: c, d: d, e: e };
	});
var $gren_lang$core$Dict$Red = 0;
var $gren_lang$core$Dict$balance = F5(function(color, key, value, left, right) {
		if ((right.$ === -1) && (!right.a)) {
			var _v1 = right.a;
			var rK = right.b;
			var rV = right.c;
			var rLeft = right.d;
			var rRight = right.e;
			if ((left.$ === -1) && (!left.a)) {
				var _v3 = left.a;
				var lK = left.b;
				var lV = left.c;
				var lLeft = left.d;
				var lRight = left.e;
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, key, value, A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, lK, lV, lLeft, lRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, rK, rV, rLeft, rRight));
			} else {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, rK, rV, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, key, value, left, rLeft), rRight);
			}
		} else {
			if ((((left.$ === -1) && (!left.a)) && (left.d.$ === -1)) && (!left.d.a)) {
				var _v5 = left.a;
				var lK = left.b;
				var lV = left.c;
				var _v6 = left.d;
				var _v7 = _v6.a;
				var llK = _v6.b;
				var llV = _v6.c;
				var llLeft = _v6.d;
				var llRight = _v6.e;
				var lRight = left.e;
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, llK, llV, llLeft, llRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, key, value, lRight, right));
			} else {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, left, right);
			}
		}
	});
var $gren_lang$core$Basics$compare = _Utils_compare;
var $gren_lang$core$Dict$insertHelp = F3(function(key, value, dict) {
		if (dict.$ === -2) {
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, key, value, $gren_lang$core$Dict$RBEmpty_gren_builtin, $gren_lang$core$Dict$RBEmpty_gren_builtin);
		} else {
			var nColor = dict.a;
			var nKey = dict.b;
			var nValue = dict.c;
			var nLeft = dict.d;
			var nRight = dict.e;
			var _v1 = A2($gren_lang$core$Basics$compare, key, nKey);
			switch (_v1) {
				case 0:
					return A5($gren_lang$core$Dict$balance, nColor, nKey, nValue, A3($gren_lang$core$Dict$insertHelp, key, value, nLeft), nRight);
				case 1:
					return A5($gren_lang$core$Dict$RBNode_gren_builtin, nColor, nKey, value, nLeft, nRight);
				default:
					return A5($gren_lang$core$Dict$balance, nColor, nKey, nValue, nLeft, A3($gren_lang$core$Dict$insertHelp, key, value, nRight));
			}
		}
	});
var $gren_lang$core$Dict$insert = F3(function(key, value, dict) {
		var _v0 = A3($gren_lang$core$Dict$insertHelp, key, value, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $gren_lang$node$Internal$Stream$Stream = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $gren_lang$node$Node$Arm = 0;
var $gren_lang$node$Node$Arm64 = 1;
var $gren_lang$node$Node$IA32 = 2;
var $gren_lang$node$Node$Mips = 3;
var $gren_lang$node$Node$Mipsel = 4;
var $gren_lang$node$Node$PPC = 5;
var $gren_lang$node$Node$PPC64 = 6;
var $gren_lang$node$Node$S390 = 7;
var $gren_lang$node$Node$S390x = 8;
var $gren_lang$node$Node$UnknownArchitecture = 10;
var $gren_lang$node$Node$X64 = 9;
var $gren_lang$core$String$toLower = _String_toLower;
var $gren_lang$node$Node$archFromString = function(arch) {
	var _v0 = $gren_lang$core$String$toLower(arch);
	switch (_v0) {
		case 'arm':
			return 0;
		case 'arm64':
			return 1;
		case 'ia32':
			return 2;
		case 'mips':
			return 3;
		case 'mipsel':
			return 4;
		case 'ppc':
			return 5;
		case 'ppc64':
			return 6;
		case 's390':
			return 7;
		case 's390x':
			return 8;
		case 'x64':
			return 9;
		default:
			return 10;
	}
};
var $gren_lang$core$Task$succeed = _Scheduler_succeed;
var $gren_lang$core$Task$map = F2(function(func, taskA) {
		return A2($gren_lang$core$Task$andThen, function(a) {
				return $gren_lang$core$Task$succeed(func(a));
			}, taskA);
	});
var $gren_lang$node$Node$Aix = 6;
var $gren_lang$node$Node$Darwin = 1;
var $gren_lang$node$Node$FreeBSD = 3;
var $gren_lang$node$Node$Linux = 2;
var $gren_lang$node$Node$OpenBSD = 4;
var $gren_lang$node$Node$SunOS = 5;
var $gren_lang$node$Node$UnknownPlatform = 7;
var $gren_lang$node$Node$Win32 = 0;
var $gren_lang$node$Node$platformFromString = function(platform) {
	var _v0 = $gren_lang$core$String$toLower(platform);
	switch (_v0) {
		case 'win32':
			return 0;
		case 'darwin':
			return 1;
		case 'linux':
			return 2;
		case 'freebsd':
			return 3;
		case 'openbsd':
			return 4;
		case 'sunos':
			return 5;
		case 'aix':
			return 6;
		default:
			return 7;
	}
};
var $gren_lang$node$Node$initializeEnvironment = A2($gren_lang$core$Task$map, function(raw) {
		return { ag: raw.ag, a5: $gren_lang$node$Node$archFromString(raw.a_), bC: $gren_lang$node$Node$platformFromString(raw.bC), f: A2($gren_lang$node$Internal$Stream$Stream, 1, raw.f), ac: A2($gren_lang$node$Internal$Stream$Stream, 2, raw.ac), e: A2($gren_lang$node$Internal$Stream$Stream, 0, raw.e) };
	}, _Node_init);
var $gren_lang$core$Basics$identity = function(x) {
	return x;
};
var $gren_lang$core$Task$Perform = $gren_lang$core$Basics$identity;
var $gren_lang$core$Task$init = $gren_lang$core$Task$succeed({  });
var $gren_lang$core$Array$map = _Array_map;
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$core$Task$map2 = F3(function(func, taskA, taskB) {
		return A2($gren_lang$core$Task$andThen, function(a) {
				return A2($gren_lang$core$Task$andThen, function(b) {
						return $gren_lang$core$Task$succeed(A2(func, a, b));
					}, taskB);
			}, taskA);
	});
var $gren_lang$core$Task$sequence = function(tasks) {
	return A3($gren_lang$core$Array$foldl, $gren_lang$core$Task$map2($gren_lang$core$Array$pushLast), $gren_lang$core$Task$succeed([  ]), tasks);
};
var $gren_lang$core$Platform$sendToApp = _Platform_sendToApp;
var $gren_lang$core$Task$spawnCmd = F2(function(router, _v0) {
		var task = _v0;
		return _Scheduler_spawn(A2($gren_lang$core$Task$andThen, $gren_lang$core$Platform$sendToApp(router), task));
	});
var $gren_lang$core$Task$onEffects = F3(function(router, commands, state) {
		return A2($gren_lang$core$Task$map, function(_v0) {
				return {  };
			}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, $gren_lang$core$Task$spawnCmd(router), commands)));
	});
var $gren_lang$core$Task$onSelfMsg = F3(function(_v0, _v1, _v2) {
		return $gren_lang$core$Task$succeed({  });
	});
var $gren_lang$core$Task$cmdMap = F2(function(tagger, _v0) {
		var task = _v0;
		return A2($gren_lang$core$Task$map, tagger, task);
	});
_Platform_effectManagers['Task'] = _Platform_createManager($gren_lang$core$Task$init, $gren_lang$core$Task$onEffects, $gren_lang$core$Task$onSelfMsg, $gren_lang$core$Task$cmdMap);
var $gren_lang$core$Task$command = _Platform_leaf('Task');
var $gren_lang$core$Task$perform = F2(function(toMessage, task) {
		return $gren_lang$core$Task$command(A2($gren_lang$core$Task$map, toMessage, task));
	});
var $gren_lang$node$Node$unwrap = function(_v0) {
	var task = _v0;
	return task;
};
var $gren_lang$node$Node$init = F2(function(initTask, _v0) {
		return { g: A2($gren_lang$core$Task$perform, $gren_lang$node$Node$InitDone, A2($gren_lang$core$Task$andThen, function(env) {
					return $gren_lang$node$Node$unwrap(initTask(env));
				}, $gren_lang$node$Node$initializeEnvironment)), h: $gren_lang$node$Node$Uninitialized };
	});
var $gren_lang$node$Node$MsgReceived = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Platform$Sub$map = _Platform_map;
var $gren_lang$core$Platform$Sub$batch = _Platform_batch;
var $gren_lang$core$Platform$Sub$none = $gren_lang$core$Platform$Sub$batch([  ]);
var $gren_lang$node$Node$subscriptions = F2(function(appSubs, model) {
		if (!model.$) {
			return $gren_lang$core$Platform$Sub$none;
		} else {
			var appModel = model.a;
			return A2($gren_lang$core$Platform$Sub$map, $gren_lang$node$Node$MsgReceived, appSubs(appModel));
		}
	});
var $gren_lang$node$Node$Initialized = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Platform$Cmd$map = _Platform_map;
var $gren_lang$core$Platform$Cmd$batch = _Platform_batch;
var $gren_lang$core$Platform$Cmd$none = $gren_lang$core$Platform$Cmd$batch([  ]);
var $gren_lang$node$Node$update = F3(function(appUpdate, msg, model) {
		if (!model.$) {
			if (!msg.$) {
				var initResult = msg.a;
				return { g: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, initResult.g), h: $gren_lang$node$Node$Initialized(initResult.h) };
			} else {
				return { g: $gren_lang$core$Platform$Cmd$none, h: model };
			}
		} else {
			var appModel = model.a;
			if (!msg.$) {
				return { g: $gren_lang$core$Platform$Cmd$none, h: model };
			} else {
				var appMsg = msg.a;
				var updateResult = A2(appUpdate, appMsg, appModel);
				return { g: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, updateResult.g), h: $gren_lang$node$Node$Initialized(updateResult.h) };
			}
		}
	});
var $gren_lang$core$Platform$worker = _Platform_worker;
var $gren_lang$node$Node$defineProgram = function(config) {
	return $gren_lang$core$Platform$worker({ bm: $gren_lang$node$Node$init(config.bm), bR: $gren_lang$node$Node$subscriptions(config.bR), bW: $gren_lang$node$Node$update(config.bW) });
};
var $gren_lang$node$Internal$Init$Task = $gren_lang$core$Basics$identity;
var $gren_lang$core$Basics$composeL = F3(function(g, f, x) {
		return g(f(x));
	});
var $gren_lang$node$Init$unwrap = function(_v0) {
	var task = _v0;
	return task;
};
var $gren_lang$node$Init$await = F2(function(_v0, fn) {
		var task = _v0;
		return A2($gren_lang$core$Task$andThen, A2($gren_lang$core$Basics$composeL, $gren_lang$node$Init$unwrap, fn), task);
	});
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst = F2(function(n, array) {
		return A3($gren_lang$core$Array$slice, n, $gren_lang$core$Array$length(array), array);
	});
var $gren_lang$node$ChildProcess$Permission = 0;
var $gren_lang$node$ChildProcess$initialize = $gren_lang$core$Task$succeed(0);
var $gren_lang$node$FileSystem$Permission = 0;
var $gren_lang$node$FileSystem$initialize = $gren_lang$core$Task$succeed(0);
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$core$Array$findFirst = _Array_findFirst;
var $gren_lang$core$Array$member = F2(function(value, array) {
		var _v0 = A2($gren_lang$core$Array$findFirst, function(v) {
				return _Utils_eq(v, value);
			}, array);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $joeybright$gren_args$Args$ParsingArgs = { $: 0 };
var $joeybright$gren_args$Args$ParsingOptions = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Dict$get = F2(function(targetKey, dict) {
		get:
		while (true) {
			if (dict.$ === -2) {
				return $gren_lang$core$Maybe$Nothing;
			} else {
				var key = dict.b;
				var value = dict.c;
				var left = dict.d;
				var right = dict.e;
				var _v1 = A2($gren_lang$core$Basics$compare, targetKey, key);
				switch (_v1) {
					case 0:
						var $temp$targetKey = targetKey,
						$temp$dict = left;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
					case 1:
						return $gren_lang$core$Maybe$Just(value);
					default:
						var $temp$targetKey = targetKey,
						$temp$dict = right;
						targetKey = $temp$targetKey;
						dict = $temp$dict;
						continue get;
				}
			}
		}
	});
var $gren_lang$core$Maybe$map = F2(function(f, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return $gren_lang$core$Maybe$Just(f(value));
		} else {
			return $gren_lang$core$Maybe$Nothing;
		}
	});
var $joeybright$gren_args$Args$LongOption = 1;
var $joeybright$gren_args$Args$Option = F3(function (a, b, c) {
		return { $: 0, a: a, b: b, c: c };
	});
var $joeybright$gren_args$Args$ShortOption = 0;
var $joeybright$gren_args$Args$String = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$parser$Parser$Advanced$Bad = F2(function (a, b) {
		return { $: 1, a: a, b: b };
	});
var $gren_lang$parser$Parser$Advanced$Good = F3(function (a, b, c) {
		return { $: 0, a: a, b: b, c: c };
	});
var $gren_lang$parser$Parser$Advanced$Parser = $gren_lang$core$Basics$identity;
var $gren_lang$parser$Parser$Advanced$andThen = F2(function(callback, _v0) {
		var parseA = _v0;
		return function(s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($gren_lang$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($gren_lang$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($gren_lang$parser$Parser$Advanced$Good, p1 || p2, b, s2);
				}
			}
		};
	});
var $gren_lang$parser$Parser$andThen = $gren_lang$parser$Parser$Advanced$andThen;
var $gren_lang$parser$Parser$UnexpectedChar = { $: 11 };
var $gren_lang$parser$Parser$Advanced$AddRight = F2(function (a, b) {
		return { $: 1, a: a, b: b };
	});
var $gren_lang$parser$Parser$Advanced$Empty = { $: 0 };
var $gren_lang$parser$Parser$Advanced$fromState = F2(function(s, x) {
		return A2($gren_lang$parser$Parser$Advanced$AddRight, $gren_lang$parser$Parser$Advanced$Empty, { K: s.K, am: s.b, W: x, Y: s.Y });
	});




// STRINGS


var _Parser_isSubString = F5(function(smallString, offset, row, col, bigString)
{
	var smallLength = smallString.length;
	var isGood = offset + smallLength <= bigString.length;

	for (var i = 0; isGood && i < smallLength; )
	{
		var code = bigString.charCodeAt(offset);
		isGood =
			smallString[i++] === bigString[offset++]
			&& (
				code === 0x000A /* \n */
					? ( row++, col=1 )
					: ( col++, (code & 0xF800) === 0xD800 ? smallString[i++] === bigString[offset++] : 1 )
			)
	}

	return { 
		aH: isGood ? offset : -1, 
		aI: row, 
		aG: col 
	};
});



// CHARS


var _Parser_isSubChar = F3(function(predicate, offset, string)
{
	return (
		string.length <= offset
			? -1
			:
		(string.charCodeAt(offset) & 0xF800) === 0xD800
			? (predicate(_Utils_chr(string.substr(offset, 2))) ? offset + 2 : -1)
			:
		(predicate(_Utils_chr(string[offset]))
			? ((string[offset] === '\n') ? -2 : (offset + 1))
			: -1
		)
	);
});


var _Parser_isAsciiCode = F3(function(code, offset, string)
{
	return string.charCodeAt(offset) === code;
});



// NUMBERS


var _Parser_chompBase10 = F2(function(offset, string)
{
	for (; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (code < 0x30 || 0x39 < code)
		{
			return offset;
		}
	}
	return offset;
});


var _Parser_consumeBase = F3(function(base, offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var digit = string.charCodeAt(offset) - 0x30;
		if (digit < 0 || base <= digit) break;
		total = base * total + digit;
	}
	return { 
		d: offset, 
		aW: total 
	};
});


var _Parser_consumeBase16 = F2(function(offset, string)
{
	for (var total = 0; offset < string.length; offset++)
	{
		var code = string.charCodeAt(offset);
		if (0x30 <= code && code <= 0x39)
		{
			total = 16 * total + code - 0x30;
		}
		else if (0x41 <= code && code <= 0x46)
		{
			total = 16 * total + code - 55;
		}
		else if (0x61 <= code && code <= 0x66)
		{
			total = 16 * total + code - 87;
		}
		else
		{
			break;
		}
	}
	return { 
		d: offset, 
		aW: total 
	};
});



// FIND STRING


var _Parser_findSubString = F5(function(smallString, offset, row, col, bigString)
{
	var newOffset = bigString.indexOf(smallString, offset);
	var target = newOffset < 0 ? bigString.length : newOffset + smallString.length;

	while (offset < target)
	{
		var code = bigString.charCodeAt(offset++);
		code === 0x000A /* \n */
			? ( col=1, row++ )
			: ( col++, (code & 0xF800) === 0xD800 && offset++ )
	}

	return { 
		aH: newOffset, 
		aI: row, 
		aG: col 
	};
});
var $gren_lang$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $gren_lang$core$Basics$negate = function(n) {
	return -n;
};
var $gren_lang$parser$Parser$Advanced$chompIf = F2(function(isGood, expecting) {
		return function(s) {
			var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, s.d, s.a);
			return _Utils_eq(newOffset, -1) ? A2($gren_lang$parser$Parser$Advanced$Bad, false, A2($gren_lang$parser$Parser$Advanced$fromState, s, expecting)) : (_Utils_eq(newOffset, -2) ? A3($gren_lang$parser$Parser$Advanced$Good, true, {  }, { K: 1, b: s.b, c: s.c, d: s.d + 1, Y: s.Y + 1, a: s.a }) : A3($gren_lang$parser$Parser$Advanced$Good, true, {  }, { K: s.K + 1, b: s.b, c: s.c, d: newOffset, Y: s.Y, a: s.a }));
		};
	});
var $gren_lang$parser$Parser$chompIf = function(isGood) {
	return A2($gren_lang$parser$Parser$Advanced$chompIf, isGood, $gren_lang$parser$Parser$UnexpectedChar);
};
var $gren_lang$core$String$length = _String_length;
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$parser$Parser$Advanced$chompUntilEndOr = function(str) {
	return function(s) {
		var _v0 = A5(_Parser_findSubString, str, s.d, s.Y, s.K, s.a);
		var newOffset = _v0.aH;
		var newRow = _v0.aI;
		var newCol = _v0.aG;
		var adjustedOffset = (_Utils_cmp(newOffset, 0) < 0) ? $gren_lang$core$String$length(s.a) : newOffset;
		return A3($gren_lang$parser$Parser$Advanced$Good, _Utils_cmp(s.d, adjustedOffset) < 0, {  }, { K: newCol, b: s.b, c: s.c, d: adjustedOffset, Y: newRow, a: s.a });
	};
};
var $gren_lang$parser$Parser$chompUntilEndOr = $gren_lang$parser$Parser$Advanced$chompUntilEndOr;
var $gren_lang$parser$Parser$Advanced$chompWhileHelp = F5(function(isGood, offset, row, col, s0) {
		chompWhileHelp:
		while (true) {
			var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, s0.a);
			if (_Utils_eq(newOffset, -1)) {
				return A3($gren_lang$parser$Parser$Advanced$Good, _Utils_cmp(s0.d, offset) < 0, {  }, { K: col, b: s0.b, c: s0.c, d: offset, Y: row, a: s0.a });
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
					$temp$offset = offset + 1,
					$temp$row = row + 1,
					$temp$col = 1,
					$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				} else {
					var $temp$isGood = isGood,
					$temp$offset = newOffset,
					$temp$row = row,
					$temp$col = col + 1,
					$temp$s0 = s0;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					s0 = $temp$s0;
					continue chompWhileHelp;
				}
			}
		}
	});
var $gren_lang$parser$Parser$Advanced$chompWhile = function(isGood) {
	return function(s) {
		return A5($gren_lang$parser$Parser$Advanced$chompWhileHelp, isGood, s.d, s.Y, s.K, s);
	};
};
var $gren_lang$parser$Parser$chompWhile = $gren_lang$parser$Parser$Advanced$chompWhile;
var $gren_lang$core$Basics$always = F2(function(a, _v0) {
		return a;
	});
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$parser$Parser$Advanced$mapChompedString = F2(function(func, _v0) {
		var parse = _v0;
		return function(s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 1) {
				var p = _v1.a;
				var x = _v1.b;
				return A2($gren_lang$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($gren_lang$parser$Parser$Advanced$Good, p, A2(func, A3($gren_lang$core$String$slice, s0.d, s1.d, s0.a), a), s1);
			}
		};
	});
var $gren_lang$parser$Parser$Advanced$getChompedString = function(parser) {
	return A2($gren_lang$parser$Parser$Advanced$mapChompedString, $gren_lang$core$Basics$always, parser);
};
var $gren_lang$parser$Parser$getChompedString = $gren_lang$parser$Parser$Advanced$getChompedString;
var $gren_lang$parser$Parser$Advanced$map2 = F3(function(func, _v0, _v1) {
		var parseA = _v0;
		var parseB = _v1;
		return function(s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 1) {
				var p = _v2.a;
				var x = _v2.b;
				return A2($gren_lang$parser$Parser$Advanced$Bad, p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 1) {
					var p2 = _v3.a;
					var x = _v3.b;
					return A2($gren_lang$parser$Parser$Advanced$Bad, p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return A3($gren_lang$parser$Parser$Advanced$Good, p1 || p2, A2(func, a, b), s2);
				}
			}
		};
	});
var $gren_lang$parser$Parser$Advanced$ignorer = F2(function(keepParser, ignoreParser) {
		return A3($gren_lang$parser$Parser$Advanced$map2, $gren_lang$core$Basics$always, keepParser, ignoreParser);
	});
var $gren_lang$parser$Parser$ignorer = $gren_lang$parser$Parser$Advanced$ignorer;
var $gren_lang$parser$Parser$Advanced$keeper = F2(function(parseFunc, parseArg) {
		return A3($gren_lang$parser$Parser$Advanced$map2, $gren_lang$core$Basics$apL, parseFunc, parseArg);
	});
var $gren_lang$parser$Parser$keeper = $gren_lang$parser$Parser$Advanced$keeper;
var $gren_lang$parser$Parser$Advanced$Append = F2(function (a, b) {
		return { $: 2, a: a, b: b };
	});
var $gren_lang$core$Array$get = _Array_get;
var $gren_lang$core$Array$first = function(array) {
	return A2($gren_lang$core$Array$get, 0, array);
};
var $gren_lang$core$Array$popFirst = function(array) {
	var _v0 = $gren_lang$core$Array$first(array);
	if (!_v0.$) {
		var value = _v0.a;
		return $gren_lang$core$Maybe$Just({ bd: value, bK: A2($gren_lang$core$Array$dropFirst, 1, array) });
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$parser$Parser$Advanced$oneOfHelp = F3(function(s0, bag, parsers) {
		oneOfHelp:
		while (true) {
			var _v0 = $gren_lang$core$Array$popFirst(parsers);
			if (_v0.$ === 1) {
				return A2($gren_lang$parser$Parser$Advanced$Bad, false, bag);
			} else {
				var _v1 = _v0.a;
				var parse = _v1.bd;
				var remainingParsers = _v1.bK;
				var _v2 = parse(s0);
				if (!_v2.$) {
					var step = _v2;
					return step;
				} else {
					var step = _v2;
					var p = step.a;
					var x = step.b;
					if (p) {
						return step;
					} else {
						var $temp$s0 = s0,
						$temp$bag = A2($gren_lang$parser$Parser$Advanced$Append, bag, x),
						$temp$parsers = remainingParsers;
						s0 = $temp$s0;
						bag = $temp$bag;
						parsers = $temp$parsers;
						continue oneOfHelp;
					}
				}
			}
		}
	});
var $gren_lang$parser$Parser$Advanced$oneOf = function(parsers) {
	return function(s) {
		return A3($gren_lang$parser$Parser$Advanced$oneOfHelp, s, $gren_lang$parser$Parser$Advanced$Empty, parsers);
	};
};
var $gren_lang$parser$Parser$oneOf = $gren_lang$parser$Parser$Advanced$oneOf;
var $gren_lang$parser$Parser$Advanced$succeed = function(a) {
	return function(s) {
		return A3($gren_lang$parser$Parser$Advanced$Good, false, a, s);
	};
};
var $gren_lang$parser$Parser$succeed = $gren_lang$parser$Parser$Advanced$succeed;
var $joeybright$gren_args$Args$parseArg = function () {
	var parseArgHelper = function(func) {
		return A2($gren_lang$parser$Parser$andThen, function(string) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(func(string)), $gren_lang$parser$Parser$chompIf(function(c) {
									return _Utils_eq(c, '=');
								})), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompWhile(function(_v2) {
									return true;
								}))), $gren_lang$parser$Parser$succeed(A2(func, string, '')) ]);
			}, $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr('=')));
	};
	return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v0) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v1) {
							return parseArgHelper(F2(function(k, v) {
										return A3($joeybright$gren_args$Args$Option, 1, k, v);
									}));
						}, $gren_lang$parser$Parser$chompIf(function(c) {
								return _Utils_eq(c, '-');
							})), parseArgHelper(F2(function(k, v) {
								return A3($joeybright$gren_args$Args$Option, 0, k, v);
							})) ]);
			}, $gren_lang$parser$Parser$chompIf(function(c) {
					return _Utils_eq(c, '-');
				})), A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed($joeybright$gren_args$Args$String), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr(' '))) ]);
}();
var $gren_lang$parser$Parser$problemToDeadEnd = function(p) {
	return { K: p.K, W: p.W, Y: p.Y };
};
var $gren_lang$core$Array$prefix = _Array_append;
var $gren_lang$core$Array$pushFirst = F2(function(value, array) {
		return A2($gren_lang$core$Array$prefix, [ value ], array);
	});
var $gren_lang$parser$Parser$Advanced$bagToArray = F2(function(bag, array) {
		bagToArray:
		while (true) {
			switch (bag.$) {
				case 0:
					return array;
				case 1:
					var bag1 = bag.a;
					var x = bag.b;
					var $temp$bag = bag1,
					$temp$array = A2($gren_lang$core$Array$pushFirst, x, array);
					bag = $temp$bag;
					array = $temp$array;
					continue bagToArray;
				default:
					var bag1 = bag.a;
					var bag2 = bag.b;
					var $temp$bag = bag1,
					$temp$array = A2($gren_lang$parser$Parser$Advanced$bagToArray, bag2, array);
					bag = $temp$bag;
					array = $temp$array;
					continue bagToArray;
			}
		}
	});
var $gren_lang$parser$Parser$Advanced$run = F2(function(_v0, src) {
		var parse = _v0;
		var _v1 = parse({ K: 1, b: [  ], c: 1, d: 0, Y: 1, a: src });
		if (!_v1.$) {
			var value = _v1.b;
			return $gren_lang$core$Result$Ok(value);
		} else {
			var bag = _v1.b;
			return $gren_lang$core$Result$Err(A2($gren_lang$parser$Parser$Advanced$bagToArray, bag, [  ]));
		}
	});
var $gren_lang$parser$Parser$run = F2(function(parser, source) {
		var _v0 = A2($gren_lang$parser$Parser$Advanced$run, parser, source);
		if (!_v0.$) {
			var a = _v0.a;
			return $gren_lang$core$Result$Ok(a);
		} else {
			var problems = _v0.a;
			return $gren_lang$core$Result$Err(A2($gren_lang$core$Array$map, $gren_lang$parser$Parser$problemToDeadEnd, problems));
		}
	});
var $gren_lang$core$Dict$getMin = function(dict) {
	getMin:
	while (true) {
		if ((dict.$ === -1) && (dict.d.$ === -1)) {
			var left = dict.d;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $gren_lang$core$Dict$moveRedLeft = function(dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.e.d.$ === -1) && (!dict.e.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var lLeft = _v1.d;
			var lRight = _v1.e;
			var _v2 = dict.e;
			var rClr = _v2.a;
			var rK = _v2.b;
			var rV = _v2.c;
			var rLeft = _v2.d;
			var _v3 = rLeft.a;
			var rlK = rLeft.b;
			var rlV = rLeft.c;
			var rlL = rLeft.d;
			var rlR = rLeft.e;
			var rRight = _v2.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rlK, rlV, A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, lLeft, lRight), rlL), A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, rK, rV, rlR, rRight));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v4 = dict.d;
			var lClr = _v4.a;
			var lK = _v4.b;
			var lV = _v4.c;
			var lLeft = _v4.d;
			var lRight = _v4.e;
			var _v5 = dict.e;
			var rClr = _v5.a;
			var rK = _v5.b;
			var rV = _v5.c;
			var rLeft = _v5.d;
			var rRight = _v5.e;
			if (clr === 1) {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, lLeft, lRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, lLeft, lRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$moveRedRight = function(dict) {
	if (((dict.$ === -1) && (dict.d.$ === -1)) && (dict.e.$ === -1)) {
		if ((dict.d.d.$ === -1) && (!dict.d.d.a)) {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v1 = dict.d;
			var lClr = _v1.a;
			var lK = _v1.b;
			var lV = _v1.c;
			var _v2 = _v1.d;
			var _v3 = _v2.a;
			var llK = _v2.b;
			var llV = _v2.c;
			var llLeft = _v2.d;
			var llRight = _v2.e;
			var lRight = _v1.e;
			var _v4 = dict.e;
			var rClr = _v4.a;
			var rK = _v4.b;
			var rV = _v4.c;
			var rLeft = _v4.d;
			var rRight = _v4.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, llK, llV, llLeft, llRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, lRight, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rK, rV, rLeft, rRight)));
		} else {
			var clr = dict.a;
			var k = dict.b;
			var v = dict.c;
			var _v5 = dict.d;
			var lClr = _v5.a;
			var lK = _v5.b;
			var lV = _v5.c;
			var lLeft = _v5.d;
			var lRight = _v5.e;
			var _v6 = dict.e;
			var rClr = _v6.a;
			var rK = _v6.b;
			var rV = _v6.c;
			var rLeft = _v6.d;
			var rRight = _v6.e;
			if (clr === 1) {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, lLeft, lRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rK, rV, rLeft, rRight));
			} else {
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, lK, lV, lLeft, lRight), A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT = F7(function(targetKey, dict, color, key, value, left, right) {
		if ((left.$ === -1) && (!left.a)) {
			var _v1 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, lK, lV, lLeft, A5($gren_lang$core$Dict$RBNode_gren_builtin, 0, key, value, lRight, right));
		} else {
			_v2$2:
			while (true) {
				if ((right.$ === -1) && (right.a === 1)) {
					if (right.d.$ === -1) {
						if (right.d.a === 1) {
							var _v3 = right.a;
							var _v4 = right.d;
							var _v5 = _v4.a;
							return $gren_lang$core$Dict$moveRedRight(dict);
						} else {
							break _v2$2;
						}
					} else {
						var _v6 = right.a;
						var _v7 = right.d;
						return $gren_lang$core$Dict$moveRedRight(dict);
					}
				} else {
					break _v2$2;
				}
			}
			return dict;
		}
	});
var $gren_lang$core$Dict$removeMin = function(dict) {
	if ((dict.$ === -1) && (dict.d.$ === -1)) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a)) {
				var _v3 = lLeft.a;
				return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, $gren_lang$core$Dict$removeMin(left), right);
			} else {
				var _v4 = $gren_lang$core$Dict$moveRedLeft(dict);
				if (_v4.$ === -1) {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return A5($gren_lang$core$Dict$balance, nColor, nKey, nValue, $gren_lang$core$Dict$removeMin(nLeft), nRight);
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			}
		} else {
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, $gren_lang$core$Dict$removeMin(left), right);
		}
	} else {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	}
};
var $gren_lang$core$Dict$removeHelp = F2(function(targetKey, dict) {
		if (dict.$ === -2) {
			return $gren_lang$core$Dict$RBEmpty_gren_builtin;
		} else {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_cmp(targetKey, key) < 0) {
				if ((left.$ === -1) && (left.a === 1)) {
					var _v4 = left.a;
					var lLeft = left.d;
					if ((lLeft.$ === -1) && (!lLeft.a)) {
						var _v6 = lLeft.a;
						return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, A2($gren_lang$core$Dict$removeHelp, targetKey, left), right);
					} else {
						var _v7 = $gren_lang$core$Dict$moveRedLeft(dict);
						if (_v7.$ === -1) {
							var nColor = _v7.a;
							var nKey = _v7.b;
							var nValue = _v7.c;
							var nLeft = _v7.d;
							var nRight = _v7.e;
							return A5($gren_lang$core$Dict$balance, nColor, nKey, nValue, A2($gren_lang$core$Dict$removeHelp, targetKey, nLeft), nRight);
						} else {
							return $gren_lang$core$Dict$RBEmpty_gren_builtin;
						}
					}
				} else {
					return A5($gren_lang$core$Dict$RBNode_gren_builtin, color, key, value, A2($gren_lang$core$Dict$removeHelp, targetKey, left), right);
				}
			} else {
				return A2($gren_lang$core$Dict$removeHelpEQGT, targetKey, A7($gren_lang$core$Dict$removeHelpPrepEQGT, targetKey, dict, color, key, value, left, right));
			}
		}
	});
var $gren_lang$core$Dict$removeHelpEQGT = F2(function(targetKey, dict) {
		if (dict.$ === -1) {
			var color = dict.a;
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			if (_Utils_eq(targetKey, key)) {
				var _v1 = $gren_lang$core$Dict$getMin(right);
				if (_v1.$ === -1) {
					var minKey = _v1.b;
					var minValue = _v1.c;
					return A5($gren_lang$core$Dict$balance, color, minKey, minValue, left, $gren_lang$core$Dict$removeMin(right));
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			} else {
				return A5($gren_lang$core$Dict$balance, color, key, value, left, A2($gren_lang$core$Dict$removeHelp, targetKey, right));
			}
		} else {
			return $gren_lang$core$Dict$RBEmpty_gren_builtin;
		}
	});
var $gren_lang$core$Dict$remove = F2(function(key, dict) {
		var _v0 = A2($gren_lang$core$Dict$removeHelp, key, dict);
		if ((_v0.$ === -1) && (!_v0.a)) {
			var _v1 = _v0.a;
			var k = _v0.b;
			var v = _v0.c;
			var l = _v0.d;
			var r = _v0.e;
			return A5($gren_lang$core$Dict$RBNode_gren_builtin, 1, k, v, l, r);
		} else {
			var x = _v0;
			return x;
		}
	});
var $gren_lang$core$Dict$update = F3(function(targetKey, alter, dictionary) {
		var _v0 = alter(A2($gren_lang$core$Dict$get, targetKey, dictionary));
		if (!_v0.$) {
			var value = _v0.a;
			return A3($gren_lang$core$Dict$insert, targetKey, value, dictionary);
		} else {
			return A2($gren_lang$core$Dict$remove, targetKey, dictionary);
		}
	});
var $gren_lang$core$Maybe$withDefault = F2(function(_default, maybe) {
		if (!maybe.$) {
			var value = maybe.a;
			return value;
		} else {
			return _default;
		}
	});
var $joeybright$gren_args$Args$parseHelper = F3(function(parseState, acc, passedArray) {
		parseHelper:
		while (true) {
			var process = F2(function(parseResult, item) {
					var _v3 = { m: parseState, aX: A2($gren_lang$parser$Parser$run, $joeybright$gren_args$Args$parseArg, item) };
					_v3$0:
					while (true) {
						if (!_v3.aX.$) {
							if (!_v3.aX.a.$) {
								if (!_v3.m.$) {
									if (_v3.aX.a.c === '') {
										var _v4 = _v3.m;
										var _v5 = _v3.aX.a;
										var optionType = _v5.a;
										var key = _v5.b;
										return { C: _Utils_update(parseResult, { k: A3($gren_lang$core$Dict$insert, key, { p: optionType, r: [  ] }, parseResult.k) }), m: $joeybright$gren_args$Args$ParsingOptions(key) };
									} else {
										var _v6 = _v3.m;
										var _v7 = _v3.aX.a;
										var optionType = _v7.a;
										var key = _v7.b;
										var value = _v7.c;
										return { C: _Utils_update(parseResult, { k: A3($gren_lang$core$Dict$insert, key, { p: optionType, r: [ value ] }, parseResult.k) }), m: $joeybright$gren_args$Args$ParsingOptions(key) };
									}
								} else {
									if (_v3.aX.a.c === '') {
										var _v9 = _v3.aX.a;
										var optionType = _v9.a;
										var key = _v9.b;
										return { C: _Utils_update(parseResult, { k: A3($gren_lang$core$Dict$insert, key, { p: optionType, r: [  ] }, parseResult.k) }), m: $joeybright$gren_args$Args$ParsingOptions(key) };
									} else {
										var latestOption = _v3.m.a;
										var _v10 = _v3.aX.a;
										var optionType = _v10.a;
										var key = _v10.b;
										var value = _v10.c;
										return { C: _Utils_update(parseResult, { k: A2($gren_lang$core$Maybe$withDefault, A3($gren_lang$core$Dict$insert, key, { p: optionType, r: [ value ] }, parseResult.k), A2($gren_lang$core$Maybe$map, function(_v11) {
														return A3($gren_lang$core$Dict$update, key, $gren_lang$core$Maybe$map(function(val) {
																	return { p: val.p, r: A2($gren_lang$core$Array$pushLast, value, val.r) };
																}), parseResult.k);
													}, A2($gren_lang$core$Dict$get, key, parseResult.k))) }), m: $joeybright$gren_args$Args$ParsingOptions(key) };
									}
								}
							} else {
								if (!_v3.m.$) {
									if (_v3.aX.a.a === '') {
										break _v3$0;
									} else {
										var _v8 = _v3.m;
										var arg = _v3.aX.a.a;
										return { C: _Utils_update(parseResult, { ag: A2($gren_lang$core$Array$pushLast, arg, parseResult.ag) }), m: $joeybright$gren_args$Args$ParsingArgs };
									}
								} else {
									if (_v3.aX.a.a === '') {
										break _v3$0;
									} else {
										var latestOption = _v3.m.a;
										var value = _v3.aX.a.a;
										return { C: _Utils_update(parseResult, { k: A3($gren_lang$core$Dict$update, latestOption, $gren_lang$core$Maybe$map(function(val) {
														return { p: val.p, r: A2($gren_lang$core$Array$pushLast, value, val.r) };
													}), parseResult.k) }), m: $joeybright$gren_args$Args$ParsingOptions(latestOption) };
									}
								}
							}
						} else {
							var state = _v3.m;
							return { C: parseResult, m: state };
						}
					}
					var state = _v3.m;
					return { C: parseResult, m: state };
				});
			var _v0 = $gren_lang$core$Array$popFirst(passedArray);
			if (!_v0.$) {
				var _v1 = _v0.a;
				var first = _v1.bd;
				var rest = _v1.bK;
				var _v2 = A2(process, acc, first);
				var state = _v2.m;
				var result = _v2.C;
				var $temp$parseState = state,
				$temp$acc = result,
				$temp$passedArray = rest;
				parseState = $temp$parseState;
				acc = $temp$acc;
				passedArray = $temp$passedArray;
				continue parseHelper;
			} else {
				return acc;
			}
		}
	});
var $joeybright$gren_args$Args$parse = A2($joeybright$gren_args$Args$parseHelper, $joeybright$gren_args$Args$ParsingArgs, { ag: [  ], k: $gren_lang$core$Dict$empty });
var $author$project$Main$GenProject_Confirmation = function (a) {
	return { $: 9, a: a };
};
var $gren_lang$core$Json$Encode$object = function(pairs) {
	return _Json_wrap(A3($gren_lang$core$Array$foldl, F2(function(_v0, obj) {
					var key = _v0.bt;
					var value = _v0.aX;
					return A3(_Json_addField, key, value, obj);
				}), _Json_emptyObject({  }), pairs));
};
var $author$project$Main$getVersion = _Platform_outgoingPort('getVersion', function($) {
		return $gren_lang$core$Json$Encode$object([  ]);
	});
var $author$project$Main$help = 'Usage:\n    \n    prettynice init\n        Create a new prettynice project in the current directory.\n\n    prettynice build\n        Compile the web app into javascript under dist/\n\n    prettynice build --optimize\n        Compile the web app with optimizations enabled.\n\n    prettynice [version|-v|--version]\n        Print the version number of this prettynice cli.\n\n    prettynice [--help|-h]\n        Show this help text.';
var $gren_lang$core$Dict$member = F2(function(key, dict) {
		var _v0 = A2($gren_lang$core$Dict$get, key, dict);
		if (!_v0.$) {
			return true;
		} else {
			return false;
		}
	});
var $author$project$Main$Cleaned = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Task$onError = _Scheduler_onError;
var $gren_lang$core$Task$attempt = F2(function(resultToMessage, task) {
		return $gren_lang$core$Task$command(A2($gren_lang$core$Task$onError, A2($gren_lang$core$Basics$composeL, A2($gren_lang$core$Basics$composeL, $gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Err), A2($gren_lang$core$Task$andThen, A2($gren_lang$core$Basics$composeL, A2($gren_lang$core$Basics$composeL, $gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Ok), task)));
	});


var fs = require("node:fs");
var bufferNs = require("node:buffer");
var path = require("node:path");
var process = require("node:process");

var _FileSystem_coerce = function (fh) {
  return fh;
};

var _FileSystem_open = F2(function (access, path) {
  return _Scheduler_binding(function (callback) {
    fs.open(path, access, function (err, fd) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructAccessError(err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_constructAccessError = function (err) {
  var errMsg = err.message;
  if (errMsg.indexOf("ENOENT") >= 0) {
    return $gren_lang$node$FileSystem$AccessErrorNotFound;
  } else if (errMsg.indexOf("EACCES") >= 0) {
    return $gren_lang$node$FileSystem$AccessErrorNoAccess;
  } else if (errMsg.indexOf("ENOTDIR") >= 0) {
    return $gren_lang$node$FileSystem$AccessErrorNotADirectory;
  } else {
    return $gren_lang$node$FileSystem$AccessErrorUnknown(errMsg);
  }
};

var _FileSystem_close = function (fh) {
  return _Scheduler_binding(function (callback) {
    fs.close(fh, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructAccessError(err)));
      } else {
        callback(_Scheduler_succeed({}));
      }
    });
  });
};

var _FileSystem_readFromOffset = F2(function (fh, options) {
  var requestedLength =
    options.bv < 0 || options.bv > bufferNs.constants.MAX_LENGTH
      ? bufferNs.constants.MAX_LENGTH
      : options.bv;

  var fileOffset = options.d < 0 ? 0 : options.d;

  return _Scheduler_binding(function (callback) {
    var initialBufferSize =
      requestedLength === bufferNs.constants.MAX_LENGTH
        ? 16 * 1024
        : requestedLength;
    var buffer = Buffer.allocUnsafe(initialBufferSize);

    _FileSystem_readHelper(
      fh,
      buffer,
      0,
      fileOffset,
      buffer.byteLength,
      requestedLength,
      callback
    );
  });
});

var _FileSystem_readHelper = function (
  fh,
  buffer,
  bufferOffset,
  fileOffset,
  maxReadLength,
  requestedReadLength,
  callback
) {
  fs.read(
    fh,
    buffer,
    bufferOffset,
    maxReadLength,
    fileOffset,
    function (err, bytesRead, _buff) {
      if (err != null) {
        callback(_Scheduler_fail($gren_lang$node$FileSystem$UnknownFileSystemError(err.message)));
        return;
      }

      var newBufferOffset = bufferOffset + bytesRead;

      if (bytesRead === 0 || newBufferOffset >= requestedReadLength) {
        callback(
          _Scheduler_succeed(
            new DataView(buffer.buffer, buffer.byteOffset, newBufferOffset)
          )
        );
        return;
      }

      var newMaxReadLength = maxReadLength - bytesRead;
      if (newMaxReadLength <= 0) {
        var oldBuffer = buffer;
        buffer = Buffer.allocUnsafe(oldBuffer.byteLength * 1.5);
        oldBuffer.copy(buffer);

        newMaxReadLength = buffer.byteLength - oldBuffer.byteLength;
      }

      _FileSystem_readHelper(
        fh,
        buffer,
        newBufferOffset,
        fileOffset + bytesRead,
        newMaxReadLength,
        requestedReadLength,
        callback
      );
    }
  );
};

var _FileSystem_writeFromOffset = F3(function (fh, options, bytes) {
  return _Scheduler_binding(function (callback) {
    _FileSystem_writeHelper(
      fh,
      bytes,
      0,
      bytes.byteLength,
      options.d,
      callback
    );
  });
});

var _FileSystem_writeHelper = function (
  fh,
  buffer,
  bufferOffset,
  length,
  fileOffset,
  callback
) {
  fs.write(
    fh,
    buffer,
    bufferOffset,
    length,
    fileOffset,
    function (err, bytesWritten, buffer) {
      if (err != null) {
        callback(_Scheduler_fail($gren_lang$node$FileSystem$UnknownFileSystemError(err.message)));
        return;
      }

      if (bytesWritten === length) {
        callback(_Scheduler_succeed({}));
        return;
      }

      var newBufferOffset = bufferOffset + bytesWritten;
      var newFileOffset = fileOffset + bytesWritten;

      _FileSystem_writeHelper(
        fh,
        buffer,
        newBufferOffset,
        length - bytesWritten,
        newFileOffset,
        callback
      );
    }
  );
};

var _FileSystem_remove = F2(function (options, path) {
  var rmOpts = {
    force: options.bl,
    recursive: options.aR,
  };

  return _Scheduler_binding(function (callback) {
    fs.rm(path, rmOpts, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructAccessError(err)));
      } else {
        callback(_Scheduler_succeed({}));
      }
    });
  });
});

var _FileSystem_makeDirectory = F2(function (options, path) {
  return _Scheduler_binding(function (callback) {
    fs.mkdir(path, { recursive: options.aR }, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructAccessError(err)));
      } else {
        callback(_Scheduler_succeed({}));
      }
    });
  });
});

// List of dir contents as DirEntry values holding filename string
var _FileSystem_listDirectory = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.readdir(path, { withFileTypes: true }, function (err, content) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructAccessError(err)));
      } else {
        callback(_Scheduler_succeed(content.map(_FileSystem_toGrenDirEntry)));
      }
    });
  });
};

var _FileSystem_toGrenDirEntry = function (dirEnt) {
  if (dirEnt.isFile()) {
    return $gren_lang$node$FileSystem$File(dirEnt.name);
  } else if (dirEnt.isDirectory()) {
    return $gren_lang$node$FileSystem$Directory(dirEnt.name);
  } else if (dirEnt.isFIFO()) {
    return $gren_lang$node$FileSystem$Pipe(dirEnt.name);
  } else if (dirEnt.isSocket()) {
    return $gren_lang$node$FileSystem$Socket(dirEnt.name);
  } else if (dirEnt.isSymbolicLink()) {
    return $gren_lang$node$FileSystem$Symlink(dirEnt.name);
  } else {
    return $gren_lang$node$FileSystem$Device(dirEnt.name);
  }
};

var _FileSystem_currentWorkingDirectory = _Scheduler_binding(function (
  callback
) {
  callback(_Scheduler_succeed(process.cwd()));
});

var _FileSystem_normalizePath = function (input) {
  return path.normalize(input);
};

var _FileSystem_buildPath = function (paths) {
  return path.join.apply(null, paths);
};
var $gren_lang$node$FileSystem$AccessErrorNoAccess = { $: 1 };
var $gren_lang$node$FileSystem$AccessErrorNotADirectory = { $: 2 };
var $gren_lang$node$FileSystem$AccessErrorNotFound = { $: 0 };
var $gren_lang$node$FileSystem$AccessErrorUnknown = function (a) {
	return { $: 3, a: a };
};
var $gren_lang$node$FileSystem$Device = function (a) {
	return { $: 4, a: a };
};
var $gren_lang$node$FileSystem$Directory = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$node$FileSystem$File = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$node$FileSystem$Pipe = function (a) {
	return { $: 5, a: a };
};
var $gren_lang$node$FileSystem$Socket = function (a) {
	return { $: 2, a: a };
};
var $gren_lang$node$FileSystem$Symlink = function (a) {
	return { $: 3, a: a };
};
var $gren_lang$node$FileSystem$UnknownFileSystemError = $gren_lang$core$Basics$identity;
var $gren_lang$node$FileSystem$buildPath = _FileSystem_buildPath;
var $gren_lang$node$FileSystem$makeDirectory = F3(function(_v0, path, options) {
		return A2(_FileSystem_makeDirectory, options, path);
	});
var $gren_lang$node$FileSystem$remove = F3(function(_v0, path, options) {
		return A2(_FileSystem_remove, options, path);
	});
var $author$project$Main$clean = function(fsPermission) {
	var remove = function(path) {
		return A3($gren_lang$node$FileSystem$remove, fsPermission, $gren_lang$node$FileSystem$buildPath(path), { bl: true, aR: true });
	};
	var create = function(path) {
		return A3($gren_lang$node$FileSystem$makeDirectory, fsPermission, $gren_lang$node$FileSystem$buildPath(path), { aR: true });
	};
	var recreate = function(path) {
		return A2($gren_lang$core$Task$andThen, function(_v1) {
				return create(path);
			}, remove(path));
	};
	return A2($gren_lang$core$Task$map, function(_v0) {
			return {  };
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, recreate, [ [ 'dist' ], [ 'client', '.prettynice' ], [ 'server', '.prettynice' ] ])));
};


// BYTES

function _Bytes_width(bytes) {
  return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function (le, be) {
  return _Scheduler_binding(function (callback) {
    callback(
      _Scheduler_succeed(
        new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be
      )
    );
  });
});

// ENCODERS

function _Bytes_encode(encoder) {
  var mutableBytes = new DataView(new ArrayBuffer($gren_lang$core$Bytes$Encode$getWidth(encoder)));
  $gren_lang$core$Bytes$Encode$write(encoder)(mutableBytes)(0);
  return mutableBytes;
}

// SIGNED INTEGERS

var _Bytes_write_i8 = F3(function (mb, i, n) {
  mb.setInt8(i, n);
  return i + 1;
});
var _Bytes_write_i16 = F4(function (mb, i, n, isLE) {
  mb.setInt16(i, n, isLE);
  return i + 2;
});
var _Bytes_write_i32 = F4(function (mb, i, n, isLE) {
  mb.setInt32(i, n, isLE);
  return i + 4;
});

// UNSIGNED INTEGERS

var _Bytes_write_u8 = F3(function (mb, i, n) {
  mb.setUint8(i, n);
  return i + 1;
});
var _Bytes_write_u16 = F4(function (mb, i, n, isLE) {
  mb.setUint16(i, n, isLE);
  return i + 2;
});
var _Bytes_write_u32 = F4(function (mb, i, n, isLE) {
  mb.setUint32(i, n, isLE);
  return i + 4;
});

// FLOATS

var _Bytes_write_f32 = F4(function (mb, i, n, isLE) {
  mb.setFloat32(i, n, isLE);
  return i + 4;
});
var _Bytes_write_f64 = F4(function (mb, i, n, isLE) {
  mb.setFloat64(i, n, isLE);
  return i + 8;
});

// BYTES

var _Bytes_write_bytes = F3(function (mb, offset, bytes) {
  for (var i = 0, len = bytes.byteLength, limit = len - 4; i <= limit; i += 4) {
    mb.setUint32(offset + i, bytes.getUint32(i));
  }
  for (; i < len; i++) {
    mb.setUint8(offset + i, bytes.getUint8(i));
  }
  return offset + len;
});

// STRINGS

function _Bytes_getStringWidth(string) {
  for (var width = 0, i = 0; i < string.length; i++) {
    var code = string.charCodeAt(i);
    width +=
      code < 0x80
        ? 1
        : code < 0x800
        ? 2
        : code < 0xd800 || 0xdbff < code
        ? 3
        : (i++, 4);
  }
  return width;
}

var _Bytes_write_string = F3(function (mb, offset, string) {
  for (var i = 0; i < string.length; i++) {
    var code = string.charCodeAt(i);
    offset +=
      code < 0x80
        ? (mb.setUint8(offset, code), 1)
        : code < 0x800
        ? (mb.setUint16(
            offset,
            0xc080 /* 0b1100000010000000 */ |
              (((code >>> 6) & 0x1f) /* 0b00011111 */ << 8) |
              (code & 0x3f) /* 0b00111111 */
          ),
          2)
        : code < 0xd800 || 0xdbff < code
        ? (mb.setUint16(
            offset,
            0xe080 /* 0b1110000010000000 */ |
              (((code >>> 12) & 0xf) /* 0b00001111 */ << 8) |
              ((code >>> 6) & 0x3f) /* 0b00111111 */
          ),
          mb.setUint8(
            offset + 2,
            0x80 /* 0b10000000 */ | (code & 0x3f) /* 0b00111111 */
          ),
          3)
        : ((code =
            (code - 0xd800) * 0x400 +
            string.charCodeAt(++i) -
            0xdc00 +
            0x10000),
          mb.setUint32(
            offset,
            0xf0808080 /* 0b11110000100000001000000010000000 */ |
              (((code >>> 18) & 0x7) /* 0b00000111 */ << 24) |
              (((code >>> 12) & 0x3f) /* 0b00111111 */ << 16) |
              (((code >>> 6) & 0x3f) /* 0b00111111 */ << 8) |
              (code & 0x3f) /* 0b00111111 */
          ),
          4);
  }
  return offset;
});

// DECODER

var _Bytes_decode = F2(function (decoder, bytes) {
  try {
    return $gren_lang$core$Maybe$Just(A2(decoder, bytes, 0).aX);
  } catch (e) {
    return $gren_lang$core$Maybe$Nothing;
  }
});

var _Bytes_read_i8 = F2(function (bytes, offset) {
  return { d: offset + 1, aX: bytes.getInt8(offset) };
});
var _Bytes_read_i16 = F3(function (isLE, bytes, offset) {
  return { d: offset + 2, aX: bytes.getInt16(offset, isLE) };
});
var _Bytes_read_i32 = F3(function (isLE, bytes, offset) {
  return { d: offset + 4, aX: bytes.getInt32(offset, isLE) };
});
var _Bytes_read_u8 = F2(function (bytes, offset) {
  return { d: offset + 1, aX: bytes.getUint8(offset) };
});
var _Bytes_read_u16 = F3(function (isLE, bytes, offset) {
  return { d: offset + 2, aX: bytes.getUint16(offset, isLE) };
});
var _Bytes_read_u32 = F3(function (isLE, bytes, offset) {
  return { d: offset + 4, aX: bytes.getUint32(offset, isLE) };
});
var _Bytes_read_f32 = F3(function (isLE, bytes, offset) {
  return { d: offset + 4, aX: bytes.getFloat32(offset, isLE) };
});
var _Bytes_read_f64 = F3(function (isLE, bytes, offset) {
  return { d: offset + 8, aX: bytes.getFloat64(offset, isLE) };
});

var _Bytes_read_bytes = F3(function (len, bytes, offset) {
  return {
    d: offset + len,
    aX: new DataView(bytes.buffer, bytes.byteOffset + offset, len),
  };
});

var _Bytes_read_string = F3(function (len, bytes, offset) {
  var string = "";
  var end = offset + len;
  for (; offset < end; ) {
    var byte = bytes.getUint8(offset++);
    string +=
      byte < 128
        ? String.fromCharCode(byte)
        : (byte & 0xe0) /* 0b11100000 */ === 0xc0 /* 0b11000000 */
        ? String.fromCharCode(
            ((byte & 0x1f) /* 0b00011111 */ << 6) |
              (bytes.getUint8(offset++) & 0x3f) /* 0b00111111 */
          )
        : (byte & 0xf0) /* 0b11110000 */ === 0xe0 /* 0b11100000 */
        ? String.fromCharCode(
            ((byte & 0xf) /* 0b00001111 */ << 12) |
              ((bytes.getUint8(offset++) & 0x3f) /* 0b00111111 */ << 6) |
              (bytes.getUint8(offset++) & 0x3f) /* 0b00111111 */
          )
        : ((byte =
            (((byte & 0x7) /* 0b00000111 */ << 18) |
              ((bytes.getUint8(offset++) & 0x3f) /* 0b00111111 */ << 12) |
              ((bytes.getUint8(offset++) & 0x3f) /* 0b00111111 */ << 6) |
              (bytes.getUint8(offset++) & 0x3f)) /* 0b00111111 */ -
            0x10000),
          String.fromCharCode(
            Math.floor(byte / 0x400) + 0xd800,
            (byte % 0x400) + 0xdc00
          ));
  }
  return { d: offset, aX: string };
});

var _Bytes_decodeFailure = F2(function () {
  throw 0;
});
var $gren_lang$core$Bytes$Encode$getWidth = function(builder) {
	switch (builder.$) {
		case 0:
			return 1;
		case 1:
			return 2;
		case 2:
			return 4;
		case 3:
			return 1;
		case 4:
			return 2;
		case 5:
			return 4;
		case 6:
			return 4;
		case 7:
			return 8;
		case 8:
			var w = builder.a;
			return w;
		case 9:
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_width(bs);
	}
};
var $gren_lang$core$Bytes$LE = 0;
var $gren_lang$core$Bytes$Encode$write = F3(function(builder, mb, offset) {
		switch (builder.$) {
			case 0:
				var n = builder.a;
				return A3(_Bytes_write_i8, mb, offset, n);
			case 1:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i16, mb, offset, n, !e);
			case 2:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_i32, mb, offset, n, !e);
			case 3:
				var n = builder.a;
				return A3(_Bytes_write_u8, mb, offset, n);
			case 4:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u16, mb, offset, n, !e);
			case 5:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_u32, mb, offset, n, !e);
			case 6:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f32, mb, offset, n, !e);
			case 7:
				var e = builder.a;
				var n = builder.b;
				return A4(_Bytes_write_f64, mb, offset, n, !e);
			case 8:
				var bs = builder.b;
				return A3($gren_lang$core$Bytes$Encode$writeSequence, bs, mb, offset);
			case 9:
				var s = builder.b;
				return A3(_Bytes_write_string, mb, offset, s);
			default:
				var bs = builder.a;
				return A3(_Bytes_write_bytes, mb, offset, bs);
		}
	});
var $gren_lang$core$Bytes$Encode$writeSequence = F3(function(builders, mb, offset) {
		writeSequence:
		while (true) {
			var _v0 = $gren_lang$core$Array$first(builders);
			if (_v0.$ === 1) {
				return offset;
			} else {
				var b = _v0.a;
				var $temp$builders = A2($gren_lang$core$Array$dropFirst, 1, builders),
				$temp$mb = mb,
				$temp$offset = A3($gren_lang$core$Bytes$Encode$write, b, mb, offset);
				builders = $temp$builders;
				mb = $temp$mb;
				offset = $temp$offset;
				continue writeSequence;
			}
		}
	});
var $gren_lang$core$Bytes$Encode$encode = _Bytes_encode;
var $gren_lang$node$Stream$SendToStream = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $gren_lang$node$Stream$init = $gren_lang$core$Task$succeed({ aQ: $gren_lang$core$Dict$empty, ae: $gren_lang$core$Dict$empty });
var $gren_lang$node$Stream$ToStream = F2(function (a, b) {
		return { $: 1, a: a, b: b };
	});
var $gren_lang$core$Dict$diff = F2(function(t1, t2) {
		return A3($gren_lang$core$Dict$foldl, F3(function(k, v, t) {
					return A2($gren_lang$core$Dict$remove, k, t);
				}), t1, t2);
	});
var $gren_lang$core$Dict$filter = F2(function(isGood, dict) {
		return A3($gren_lang$core$Dict$foldl, F3(function(k, v, d) {
					return A2(isGood, k, v) ? A3($gren_lang$core$Dict$insert, k, v, d) : d;
				}), $gren_lang$core$Dict$empty, dict);
	});
var $gren_lang$core$Process$kill = _Scheduler_kill;
var $gren_lang$core$Platform$sendToSelf = _Platform_sendToSelf;
var $gren_lang$node$Stream$FromStream = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});


var _Stream_attachListener = F2(function (stream, sendToApp) {
  return _Scheduler_binding(function (_callback) {
    var listener = function (data) {
      _Scheduler_rawSpawn(sendToApp(new DataView(data.buffer)));
    };

    stream.on("data", listener);

    return function () {
      stream.off("data", listener);
      stream.pause();
    };
  });
});

var _Stream_send = F2(function (stream, data) {
  stream.write(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
  return {};
});
var $gren_lang$node$Stream$attachListener = _Stream_attachListener;
var $gren_lang$core$Process$spawn = _Scheduler_spawn;
var $gren_lang$node$Stream$spawnHelp = F3(function(router, toSpawn, processes) {
		var _v0 = $gren_lang$core$Array$first(toSpawn);
		if (_v0.$ === 1) {
			return $gren_lang$core$Task$succeed(processes);
		} else {
			var nextStream = _v0.a;
			var sid = nextStream.a;
			var rawStream = nextStream.b;
			var spawnStream = $gren_lang$core$Process$spawn(A2($gren_lang$node$Stream$attachListener, rawStream, function(data) {
						return A2($gren_lang$core$Platform$sendToSelf, router, A2($gren_lang$node$Stream$FromStream, nextStream, data));
					}));
			var rest = A2($gren_lang$core$Array$dropFirst, 1, toSpawn);
			var spawnRest = function(processId) {
				return A3($gren_lang$node$Stream$spawnHelp, router, rest, A3($gren_lang$core$Dict$insert, sid, processId, processes));
			};
			return A2($gren_lang$core$Task$andThen, spawnRest, spawnStream);
		}
	});
var $gren_lang$node$Stream$subToListener = F2(function(sub, taggers) {
		var stream = sub.a;
		var sid = stream.a;
		var tagger = sub.b;
		var _v1 = A2($gren_lang$core$Dict$get, sid, taggers);
		if (!_v1.$) {
			var data = _v1.a;
			return A3($gren_lang$core$Dict$insert, sid, _Utils_update(data, { ae: A2($gren_lang$core$Array$pushLast, tagger, data.ae) }), taggers);
		} else {
			return A3($gren_lang$core$Dict$insert, sid, { aU: stream, ae: [ tagger ] }, taggers);
		}
	});
var $gren_lang$core$Dict$values = function(dict) {
	return A3($gren_lang$core$Dict$foldl, F3(function(key, value, valueArray) {
				return A2($gren_lang$core$Array$pushLast, value, valueArray);
			}), [  ], dict);
};
var $gren_lang$node$Stream$onEffects = F4(function(router, commands, subs, state) {
		var newTaggers = A3($gren_lang$core$Array$foldl, $gren_lang$node$Stream$subToListener, $gren_lang$core$Dict$empty, subs);
		var toSpawn = A2($gren_lang$core$Array$map, function ($) {
				return $.aU;
			}, $gren_lang$core$Dict$values(A2($gren_lang$core$Dict$diff, newTaggers, state.ae)));
		var killTasks = A3($gren_lang$core$Array$foldl, F2(function(id, tasks) {
					return A2($gren_lang$core$Task$andThen, function(_v5) {
							return $gren_lang$core$Process$kill(id);
						}, tasks);
				}), $gren_lang$core$Task$succeed({  }), $gren_lang$core$Dict$values(A2($gren_lang$core$Dict$diff, state.aQ, newTaggers)));
		var existingProcesses = A2($gren_lang$core$Dict$filter, F2(function(sid, _v4) {
					return A2($gren_lang$core$Dict$member, sid, newTaggers);
				}), state.aQ);
		var commandTasks = A3($gren_lang$core$Array$foldl, F2(function(_v2, tasks) {
					var stream = _v2.a;
					var bytes = _v2.b;
					return A2($gren_lang$core$Task$andThen, function(_v3) {
							return A2($gren_lang$core$Platform$sendToSelf, router, A2($gren_lang$node$Stream$ToStream, stream, bytes));
						}, tasks);
				}), $gren_lang$core$Task$succeed({  }), commands);
		return A2($gren_lang$core$Task$andThen, function(newProcesses) {
				return $gren_lang$core$Task$succeed({ aQ: newProcesses, ae: newTaggers });
			}, A2($gren_lang$core$Task$andThen, function(_v1) {
					return A3($gren_lang$node$Stream$spawnHelp, router, toSpawn, existingProcesses);
				}, A2($gren_lang$core$Task$andThen, function(_v0) {
						return killTasks;
					}, commandTasks)));
	});
var $gren_lang$node$Stream$onSelfMsg = F3(function(router, event, state) {
		if (!event.$) {
			var _v1 = event.a;
			var sid = _v1.a;
			var data = event.b;
			return A2($gren_lang$core$Task$andThen, function(_v3) {
					return $gren_lang$core$Task$succeed(state);
				}, A3($gren_lang$core$Array$foldl, F2(function(msg, tasks) {
							return A2($gren_lang$core$Task$andThen, function(_v2) {
									return A2($gren_lang$core$Platform$sendToApp, router, msg);
								}, tasks);
						}), $gren_lang$core$Task$succeed({  }), A2($gren_lang$core$Array$map, function(tagger) {
							return tagger(data);
						}, A2($gren_lang$core$Maybe$withDefault, [  ], A2($gren_lang$core$Maybe$map, function ($) {
									return $.ae;
								}, A2($gren_lang$core$Dict$get, sid, state.ae))))));
		} else {
			var _v4 = event.a;
			var rawStream = _v4.b;
			var bytes = event.b;
			var _v5 = A2(_Stream_send, rawStream, bytes);
			return $gren_lang$core$Task$succeed(state);
		}
	});
var $gren_lang$node$Stream$cmdMap = F2(function(_v0, cmd) {
		var stream = cmd.a;
		var payload = cmd.b;
		return A2($gren_lang$node$Stream$SendToStream, stream, payload);
	});
var $gren_lang$node$Stream$Listen = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $gren_lang$node$Stream$subMap = F2(function(mapFn, sub) {
		var stream = sub.a;
		var msgMap = sub.b;
		return A2($gren_lang$node$Stream$Listen, stream, A2($gren_lang$core$Basics$composeL, mapFn, msgMap));
	});
_Platform_effectManagers['Stream'] = _Platform_createManager($gren_lang$node$Stream$init, $gren_lang$node$Stream$onEffects, $gren_lang$node$Stream$onSelfMsg, $gren_lang$node$Stream$cmdMap, $gren_lang$node$Stream$subMap);
var $gren_lang$node$Stream$command = _Platform_leaf('Stream');
var $gren_lang$node$Stream$subscription = _Platform_leaf('Stream');
var $gren_lang$node$Stream$send = F2(function(stream, bytes) {
		return $gren_lang$node$Stream$command(A2($gren_lang$node$Stream$SendToStream, stream, bytes));
	});
var $gren_lang$core$Bytes$Encode$Utf8 = F2(function (a, b) {
		return { $: 9, a: a, b: b };
	});
var $gren_lang$core$Bytes$Encode$string = function(str) {
	return A2($gren_lang$core$Bytes$Encode$Utf8, _Bytes_getStringWidth(str), str);
};
var $gren_lang$node$Stream$sendString = F2(function(stream, string) {
		return A2($gren_lang$node$Stream$send, stream, $gren_lang$core$Bytes$Encode$encode($gren_lang$core$Bytes$Encode$string(string)));
	});
var $gren_lang$node$Stream$sendLine = F2(function(stream, string) {
		return A2($gren_lang$node$Stream$sendString, stream, _Utils_ap(string, '\n'));
	});
var $author$project$Main$progress = F2(function(stream, message) {
		return A2($gren_lang$node$Stream$sendLine, stream, _Utils_ap('🌸 ', _Utils_ap(message, '...')));
	});
var $author$project$Main$runBuild = function(model) {
	return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Cleaning up previous builds'), A2($gren_lang$core$Task$attempt, $author$project$Main$Cleaned, $author$project$Main$clean(model.bh)) ]);
};
var $gren_lang$core$Basics$never = function(_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $gren_lang$node$Node$setExitCode = function(code) {
	return A2($gren_lang$core$Task$perform, $gren_lang$core$Basics$never, _Node_setExitCode(code));
};
var $author$project$Main$run = F2(function(model, _v0) {
		var args = _v0.ag;
		var options = _v0.k;
		return (_Utils_eq(args, [ 'version' ]) || (A2($gren_lang$core$Dict$member, 'v', options) || A2($gren_lang$core$Dict$member, 'version', options))) ? { g: $author$project$Main$getVersion({  }), h: model } : (_Utils_eq(args, [ 'build' ]) ? { g: $author$project$Main$runBuild(model), h: model } : (_Utils_eq(args, [ 'init' ]) ? { g: A2($gren_lang$node$Stream$sendString, model.e, '󱚤 Can I turn the current directory into a new Prettynice project (y|n)? '), h: _Utils_update(model, { H: $gren_lang$core$Maybe$Just($author$project$Main$GenProject_Confirmation) }) } : (_Utils_eq(args, [  ]) ? { g: A2($gren_lang$node$Stream$sendLine, model.e, $author$project$Main$help), h: model } : { g: $gren_lang$core$Platform$Cmd$batch([ A2($gren_lang$node$Stream$sendLine, model.f, 'I don\'t recognize those arguments.'), A2($gren_lang$node$Stream$sendLine, model.f, $author$project$Main$help), $gren_lang$node$Node$setExitCode(1) ]), h: model })));
	});
var $gren_lang$node$Node$startProgram = function(initResult) {
	return $gren_lang$core$Task$succeed(initResult);
};
var $author$project$Main$init = function(env) {
	return A2($gren_lang$node$Init$await, $gren_lang$node$FileSystem$initialize, function(fsPermission) {
			return A2($gren_lang$node$Init$await, $gren_lang$node$ChildProcess$initialize, function(procPermission) {
					var model = { N: $gren_lang$core$Maybe$Nothing, bh: fsPermission, T: A2($gren_lang$core$Array$member, '--optimize', env.ag), G: procPermission, H: $gren_lang$core$Maybe$Nothing, f: env.f, ac: env.ac, e: env.e };
					return $gren_lang$node$Node$startProgram(A2($author$project$Main$run, model, $joeybright$gren_args$Args$parse(A2($gren_lang$core$Array$dropFirst, 2, env.ag))));
				});
		});
};
var $author$project$Main$GotDirname = function (a) {
	return { $: 12, a: a };
};
var $author$project$Main$GotVersion = function (a) {
	return { $: 13, a: a };
};
var $gren_lang$core$Json$Decode$string = _Json_decodeString;
var $author$project$Main$gotDirname = _Platform_incomingPort('gotDirname', $gren_lang$core$Json$Decode$string);
var $author$project$Main$gotVersion = _Platform_incomingPort('gotVersion', $gren_lang$core$Json$Decode$string);
var $gren_lang$node$Stream$listen = F2(function(stream, msgMap) {
		return $gren_lang$node$Stream$subscription(A2($gren_lang$node$Stream$Listen, stream, msgMap));
	});
var $author$project$Main$subscriptions = function(model) {
	return $gren_lang$core$Platform$Sub$batch([ $author$project$Main$gotDirname($author$project$Main$GotDirname), $author$project$Main$gotVersion($author$project$Main$GotVersion), function () {
			var _v0 = model.H;
			if (!_v0.$) {
				var msg = _v0.a;
				return A2($gren_lang$node$Stream$listen, model.ac, msg);
			} else {
				return $gren_lang$core$Platform$Sub$none;
			}
		}() ]);
};
var $gren_lang$core$Json$Decode$succeed = _Json_succeed;
var $author$project$Main$BuiltClientComponents = function (a) {
	return { $: 7, a: a };
};
var $author$project$Main$BuiltServer = function (a) {
	return { $: 8, a: a };
};
var $author$project$Main$CopiedPublicAssets = function (a) {
	return { $: 6, a: a };
};
var $author$project$Main$GenProject_Created = function (a) {
	return { $: 10, a: a };
};
var $author$project$Main$GenProject_NpmInstalled = function (a) {
	return { $: 11, a: a };
};
var $author$project$Main$GeneratedClientComponents = function (a) {
	return { $: 3, a: a };
};
var $author$project$Main$GeneratedClientPorts = function (a) {
	return { $: 5, a: a };
};
var $author$project$Main$GeneratedDependencies = function (a) {
	return { $: 1, a: a };
};
var $author$project$Main$GeneratedServerComponents = function (a) {
	return { $: 2, a: a };
};
var $author$project$Main$GeneratedServerPorts = function (a) {
	return { $: 4, a: a };
};
var $author$project$Main$ComponentBuildFailed = function (a) {
	return { $: 0, a: a };
};
var $author$project$Main$ComponentBuildSucceeded = function (a) {
	return { $: 0, a: a };
};
var $author$project$Main$ListComponentsFailed = function (a) {
	return { $: 1, a: a };
};
var $author$project$Main$NoComponents = { $: 1 };
var $gren_lang$node$ChildProcess$SetWorkingDirectory = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Basics$composeR = F3(function(f, g, x) {
		return g(f(x));
	});
var $gren_lang$node$ChildProcess$DefaultShell = { $: 1 };
var $gren_lang$node$ChildProcess$InheritEnvironmentVariables = { $: 0 };
var $gren_lang$node$ChildProcess$InheritWorkingDirectory = { $: 0 };
var $gren_lang$node$ChildProcess$NoLimit = { $: 0 };
var $gren_lang$core$Basics$mul = _Basics_mul;
var $gren_lang$node$ChildProcess$defaultRunOptions = { O: $gren_lang$node$ChildProcess$InheritEnvironmentVariables, R: 1024 * 1024, Z: $gren_lang$node$ChildProcess$NoLimit, aa: $gren_lang$node$ChildProcess$DefaultShell, b3: $gren_lang$node$ChildProcess$InheritWorkingDirectory };
var $author$project$CodeGen$errorString = function(error) {
	if (!error.$) {
		var str = error.a;
		return str;
	} else {
		var str = error.a;
		return str;
	}
};
var $icidasset$shikensu_gren$Shikensu$Focus$Relative = function (a) {
	return { $: 1, a: a };
};
var $icidasset$shikensu_gren$Shikensu$Path$Directory = 0;
var $icidasset$shikensu_gren$Shikensu$Path$Path = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $icidasset$shikensu_gren$Shikensu$Path$directory = $icidasset$shikensu_gren$Shikensu$Path$Path(0);
var $author$project$CodeGen$emptyBundle = function(permission) {
	return { L: [  ], bh: permission, bI: $gren_lang$core$Maybe$Nothing, b3: $icidasset$shikensu_gren$Shikensu$Path$directory([ '.' ]) };
};
var $gren_lang$core$Task$fail = _Scheduler_fail;
var $icidasset$shikensu_gren$Shikensu$Error$ErrorMessage = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$node$FileSystem$currentWorkingDirectory = function(_v0) {
	return _FileSystem_currentWorkingDirectory;
};
var $gren_lang$core$String$endsWith = _String_endsWith;
var $icidasset$shikensu_gren$Shikensu$Path$File = 1;
var $gren_lang$core$String$dropLeft = F2(function(n, string) {
		return (_Utils_cmp(n, 1) < 0) ? string : A3($gren_lang$core$String$slice, n, $gren_lang$core$String$length(string), string);
	});
var $gren_lang$core$String$dropRight = F2(function(n, string) {
		return (_Utils_cmp(n, 1) < 0) ? string : A3($gren_lang$core$String$slice, 0, -n, string);
	});
var $gren_lang$core$String$startsWith = _String_startsWith;
var $icidasset$shikensu_gren$Shikensu$Path$fromPosix = function(string) {
	return function(s) {
		return A2($gren_lang$core$String$endsWith, '/', s) ? A2($icidasset$shikensu_gren$Shikensu$Path$Path, 0, A2($gren_lang$core$String$split, '/', A2($gren_lang$core$String$dropRight, 1, s))) : A2($icidasset$shikensu_gren$Shikensu$Path$Path, 1, A2($gren_lang$core$String$split, '/', s));
	}(function(s) {
			return A2($gren_lang$core$String$startsWith, '/', s) ? A2($gren_lang$core$String$dropLeft, 1, s) : (A2($gren_lang$core$String$startsWith, './', s) ? A2($gren_lang$core$String$dropLeft, 2, s) : s);
		}(string));
};
var $gren_lang$core$Task$mapError = F2(function(convert, task) {
		return A2($gren_lang$core$Task$onError, A2($gren_lang$core$Basics$composeL, $gren_lang$core$Task$fail, convert), task);
	});
var $icidasset$shikensu_gren$Shikensu$Path$unwrap = function(_v0) {
	var parts = _v0.b;
	return parts;
};
var $icidasset$shikensu_gren$Shikensu$currentWorkingDirectory = function(permission) {
	return A2($gren_lang$core$Task$mapError, function(_v0) {
			return $icidasset$shikensu_gren$Shikensu$Error$ErrorMessage('Never ever have I 🤫');
		}, A2($gren_lang$core$Task$map, A2($gren_lang$core$Basics$composeR, $icidasset$shikensu_gren$Shikensu$Path$fromPosix, A2($gren_lang$core$Basics$composeR, $icidasset$shikensu_gren$Shikensu$Path$unwrap, $icidasset$shikensu_gren$Shikensu$Path$directory)), A2($gren_lang$core$Task$map, function(a) {
					return A2($gren_lang$core$String$endsWith, '/', a) ? a : _Utils_ap(a, '/');
				}, $gren_lang$node$FileSystem$currentWorkingDirectory(permission))));
};
var $icidasset$shikensu_gren$Shikensu$Error$PlatformAccessError = F2(function (a, b) {
		return { $: 1, a: a, b: b };
	});
var $icidasset$shikensu_gren$Shikensu$Path$combine = F2(function(_v0, _v1) {
		var a = _v0.b;
		var k = _v1.a;
		var b = _v1.b;
		return A2($icidasset$shikensu_gren$Shikensu$Path$Path, k, _Utils_ap(a, b));
	});
var $gren_lang$core$String$contains = _String_contains;
var $gren_lang$core$Basics$sub = _Basics_sub;
var $gren_lang$core$Array$dropLast = F2(function(n, array) {
		return A3($gren_lang$core$Array$slice, 0, $gren_lang$core$Array$length(array) - n, array);
	});
var $icidasset$shikensu_gren$Shikensu$Definition$baseName = function(name) {
	return A2($gren_lang$core$String$contains, '.', name) ? A2($gren_lang$core$String$join, '.', A2($gren_lang$core$Array$dropLast, 1, A2($gren_lang$core$String$split, '.', name))) : name;
};
var $icidasset$shikensu_gren$Shikensu$Definition$directoryPath = function(relPath) {
	return $icidasset$shikensu_gren$Shikensu$Path$directory(A2($gren_lang$core$Array$dropLast, 1, $icidasset$shikensu_gren$Shikensu$Path$unwrap(relPath)));
};
var $gren_lang$core$Array$last = function(array) {
	return A2($gren_lang$core$Array$get, $gren_lang$core$Array$length(array) - 1, array);
};
var $icidasset$shikensu_gren$Shikensu$Definition$extensionName = function(name) {
	return A2($gren_lang$core$String$contains, '.', name) ? $gren_lang$core$Array$last(A2($gren_lang$core$String$split, '.', name)) : $gren_lang$core$Maybe$Nothing;
};
var $icidasset$shikensu_gren$Shikensu$Definition$create = function(relPath) {
	var name = A2($gren_lang$core$Maybe$withDefault, '', $gren_lang$core$Array$last($icidasset$shikensu_gren$Shikensu$Path$unwrap(relPath)));
	return { D: $icidasset$shikensu_gren$Shikensu$Definition$baseName(name), x: $gren_lang$core$Maybe$Nothing, ap: $icidasset$shikensu_gren$Shikensu$Definition$directoryPath(relPath), bb: $icidasset$shikensu_gren$Shikensu$Definition$extensionName(name), aC: $gren_lang$core$Dict$empty };
};
var $icidasset$shikensu_gren$Shikensu$Path$encapsulate = function(_v0) {
	var k = _v0.a;
	var p = _v0.b;
	return A2($icidasset$shikensu_gren$Shikensu$Path$Path, k, p);
};
var $icidasset$shikensu_gren$Shikensu$Path$file = $icidasset$shikensu_gren$Shikensu$Path$Path(1);
var $gren_lang$core$Array$filterMap = F2(function(mapper, array) {
		return A3($gren_lang$core$Array$foldl, F2(function(v, acc) {
					var _v0 = mapper(v);
					if (!_v0.$) {
						var newValue = _v0.a;
						return A2($gren_lang$core$Array$pushLast, newValue, acc);
					} else {
						return acc;
					}
				}), [  ], array);
	});
var $gren_lang$core$Array$postfix = F2(function(fst, second) {
		return A2($gren_lang$core$Array$prefix, second, fst);
	});
var $gren_lang$core$Array$flatten = function(array) {
	return A3($gren_lang$core$Array$foldl, $gren_lang$core$Array$postfix, [  ], array);
};
var $gren_lang$node$FileSystem$listDirectory = F2(function(_v0, path) {
		return _FileSystem_listDirectory(path);
	});
var $gren_lang$core$Array$singleton = function(a) {
	return [ a ];
};
var $gren_lang$core$Array$isEmpty = function(array) {
	return _Utils_eq($gren_lang$core$Array$length(array), 0);
};
var $icidasset$shikensu_gren$Shikensu$Path$toPosix = F2(function(_v0, _v1) {
		var absolute = _v0.aZ;
		var k = _v1.a;
		var parts = _v1.b;
		var prefix = absolute ? '/' : '';
		var joined = A2($gren_lang$core$String$join, '/', parts);
		if (!k) {
			return $gren_lang$core$Array$isEmpty(parts) ? (absolute ? '/' : './') : _Utils_ap(prefix, _Utils_ap(joined, '/'));
		} else {
			return _Utils_ap(prefix, joined);
		}
	});
var $icidasset$shikensu_gren$Shikensu$recursiveList = F3(function(permission, focusDirectory, relativePath) {
		return A2($gren_lang$core$Task$andThen, function(listing) {
				return A2($gren_lang$core$Task$map, $gren_lang$core$Array$flatten, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$filterMap, function(entry) {
								switch (entry.$) {
									case 0:
										var name = entry.a;
										return A2($gren_lang$core$String$startsWith, '.', name) ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just($gren_lang$core$Task$succeed($gren_lang$core$Array$singleton($icidasset$shikensu_gren$Shikensu$Definition$create(A2($icidasset$shikensu_gren$Shikensu$Path$combine, relativePath, $icidasset$shikensu_gren$Shikensu$Path$file($gren_lang$core$Array$singleton(name)))))));
									case 1:
										var name = entry.a;
										return $gren_lang$core$Maybe$Just(A3($icidasset$shikensu_gren$Shikensu$recursiveList, permission, focusDirectory, A2($icidasset$shikensu_gren$Shikensu$Path$combine, relativePath, $icidasset$shikensu_gren$Shikensu$Path$directory($gren_lang$core$Array$singleton(name)))));
									default:
										return $gren_lang$core$Maybe$Nothing;
								}
							}, listing)));
			}, function(path) {
				return A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformAccessError($icidasset$shikensu_gren$Shikensu$Path$encapsulate(path)), A2($gren_lang$node$FileSystem$listDirectory, permission, A2($icidasset$shikensu_gren$Shikensu$Path$toPosix, { aZ: true }, path)));
			}(A2($icidasset$shikensu_gren$Shikensu$Path$combine, focusDirectory, relativePath)));
	});
var $icidasset$shikensu_gren$Shikensu$Focus$toAbsolutePath = F2(function(_v0, focus) {
		var cwd = _v0.an;
		switch (focus.$) {
			case 0:
				return cwd;
			case 1:
				var path = focus.a;
				return A2($icidasset$shikensu_gren$Shikensu$Path$combine, cwd, path);
			default:
				var path = focus.a;
				return path;
		}
	});
var $icidasset$shikensu_gren$Shikensu$list = F2(function(fsPermission, focus) {
		return A2($gren_lang$core$Task$andThen, function(cwd) {
				var listFocusDirectory = A2($icidasset$shikensu_gren$Shikensu$Focus$toAbsolutePath, { an: cwd }, focus);
				return A2($gren_lang$core$Task$map, function(compendium) {
						return { L: compendium, bh: fsPermission, bI: $gren_lang$core$Maybe$Just(listFocusDirectory), b3: cwd };
					}, A3($icidasset$shikensu_gren$Shikensu$recursiveList, fsPermission, listFocusDirectory, $icidasset$shikensu_gren$Shikensu$Path$directory([  ])));
			}, $icidasset$shikensu_gren$Shikensu$currentWorkingDirectory(fsPermission));
	});
var $author$project$CodeGen$tryList = F2(function(fsPermission, focus) {
		return A2($gren_lang$core$Task$onError, function(error) {
				if ((error.$ === 1) && (!error.b.$)) {
					var _v1 = error.b;
					return $gren_lang$core$Task$succeed($author$project$CodeGen$emptyBundle(fsPermission));
				} else {
					var e = error;
					return $gren_lang$core$Task$fail(e);
				}
			}, A2($icidasset$shikensu_gren$Shikensu$list, fsPermission, focus));
	});
var $gren_lang$core$Array$filter = F2(function(pred, array) {
		return A3($gren_lang$core$Array$foldl, F2(function(v, acc) {
					return pred(v) ? A2($gren_lang$core$Array$pushLast, v, acc) : acc;
				}), [  ], array);
	});
var $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium = F2(function(fn, bundle) {
		return _Utils_update(bundle, { L: fn(bundle.L) });
	});
var $icidasset$shikensu_gren$Shikensu$Contrib$withExtension = function(extension) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$filter(function(def) {
				return _Utils_eq(def.bb, $gren_lang$core$Maybe$Just(extension));
			}));
};
var $author$project$CodeGen$listComponents = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $icidasset$shikensu_gren$Shikensu$Contrib$withExtension('gren'), A2($author$project$CodeGen$tryList, fsPermission, $icidasset$shikensu_gren$Shikensu$Focus$Relative($icidasset$shikensu_gren$Shikensu$Path$directory([ 'client', 'src', 'Components' ]))));
};
var $author$project$CodeGen$FileSystemError = function (a) {
	return { $: 1, a: a };
};
var $author$project$CodeGen$PipelineError = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$String$append = _String_append;
var $author$project$CodeGen$mapError = function(error) {
	switch (error.$) {
		case 0:
			var str = error.a;
			return $author$project$CodeGen$PipelineError(str);
		case 1:
			var path = error.a;
			return $author$project$CodeGen$FileSystemError(A2($gren_lang$core$String$append, 'Error accessing ', A2($icidasset$shikensu_gren$Shikensu$Path$toPosix, { aZ: false }, path)));
		default:
			return $author$project$CodeGen$FileSystemError('Unknown FileSystem error');
	}
};
var $author$project$CodeGen$generatedComponentPaths = function(fsPermission) {
	return A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, function(bundle) {
				return $gren_lang$core$Task$succeed(A2($gren_lang$core$Array$map, function(d) {
							var filename = _Utils_ap(d.D, '.gren');
							var dir = $icidasset$shikensu_gren$Shikensu$Path$unwrap(d.ap);
							var parent = _Utils_ap([ '.prettynice', 'Gen', 'Components' ], dir);
							return $gren_lang$node$FileSystem$buildPath(_Utils_ap(parent, [ filename ]));
						}, bundle.L));
			}, $author$project$CodeGen$listComponents(fsPermission)));
};


var bufferNs = require("node:buffer");
var process = require("node:process");
var childProcess = require("node:child_process");

var _ChildProcess_run = function (options) {
  return _Scheduler_binding(function (callback) {
    var workingDir = options.b3;
    var env = options.O;
    var shell = options.aa;

    childProcess.execFile(
      options.bF,
      options.a$,
      {
        encoding: "buffer",
        cwd: workingDir.aw ? process.cwd() : workingDir.aN,
        env:
          env.U === 0
            ? process.env
            : env.U === 1
            ? _Utils_update(process.env, _ChildProcess_dictToObj(env.aX))
            : _ChildProcess_dictToObj(env.aX),
        timeout: options.Z,
        maxBuffer: options.R,
        shell:
          shell.J === 0
            ? false
            : shell.J === 1
            ? true
            : shell.aX,
      },
      function (err, stdout, stderr) {
        if (err == null) {
          callback(
            _Scheduler_succeed({
              e: new DataView(stdout.buffer, stdout.byteOffset),
              f: new DataView(stderr.buffer, stderr.byteOffset),
            })
          );
        } else {
          callback(
            _Scheduler_fail({
              ba:
                typeof err.errno === "undefined" ? err.code : err.errno,
              e: new DataView(stdout.buffer, stdout.byteOffset),
              f: new DataView(stderr.buffer, stderr.byteOffset),
            })
          );
        }
      }
    );
  });
};

function _ChildProcess_dictToObj(dict) {
  return A3(
    $gren_lang$core$Dict$foldl,
    F3(function (key, value, acc) {
      acc[key] = value;
      return acc;
    }),
    {},
    dict
  );
}
var $gren_lang$core$Basics$gt = _Utils_gt;
var $gren_lang$core$Basics$max = F2(function(x, y) {
		return (_Utils_cmp(x, y) > 0) ? x : y;
	});
var $gren_lang$node$ChildProcess$run = F4(function(_v0, program, _arguments, opts) {
		return _ChildProcess_run({ a$: _arguments, O: function () {
				var _v1 = opts.O;
				switch (_v1.$) {
					case 0:
						return { U: 0, aX: $gren_lang$core$Dict$empty };
					case 1:
						var value = _v1.a;
						return { U: 1, aX: value };
					default:
						var value = _v1.a;
						return { U: 2, aX: value };
				}
			}(), R: opts.R, bF: program, Z: function () {
				var _v2 = opts.Z;
				if (!_v2.$) {
					return 0;
				} else {
					var ms = _v2.a;
					return A2($gren_lang$core$Basics$max, 0, ms);
				}
			}(), aa: function () {
				var _v3 = opts.aa;
				switch (_v3.$) {
					case 0:
						return { J: 0, aX: '' };
					case 1:
						return { J: 1, aX: '' };
					default:
						var value = _v3.a;
						return { J: 2, aX: value };
				}
			}(), b3: function () {
				var _v4 = opts.b3;
				if (!_v4.$) {
					return { aw: true, aN: '' };
				} else {
					var value = _v4.a;
					return { aw: false, aN: value };
				}
			}() });
	});
var $author$project$Main$buildClientComponents = F3(function(fsPermission, procPermission, optimize) {
		var workingDirectory = $gren_lang$node$FileSystem$buildPath([ 'client' ]);
		var runOptions = _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { b3: $gren_lang$node$ChildProcess$SetWorkingDirectory(workingDirectory) });
		var outputPath = $gren_lang$node$FileSystem$buildPath([ '..', 'dist', 'client', 'main.js' ]);
		var optimizeFlag = optimize ? '--optimize' : '';
		var buildComponents = function(components) {
			return _Utils_eq(components, '') ? $gren_lang$core$Task$succeed($author$project$Main$NoComponents) : A2($gren_lang$core$Task$mapError, $author$project$Main$ComponentBuildFailed, A2($gren_lang$core$Task$map, $author$project$Main$ComponentBuildSucceeded, A4($gren_lang$node$ChildProcess$run, procPermission, 'npx', [ 'gren', 'make', components, optimizeFlag, _Utils_ap('--output=', outputPath) ], runOptions)));
		};
		return A2($gren_lang$core$Task$andThen, buildComponents, A2($gren_lang$core$Task$map, $gren_lang$core$String$join(' '), A2($gren_lang$core$Task$mapError, A2($gren_lang$core$Basics$composeR, $author$project$CodeGen$errorString, $author$project$Main$ListComponentsFailed), $author$project$CodeGen$generatedComponentPaths(fsPermission))));
	});
var $author$project$Main$buildServer = F2(function(procPermission, optimize) {
		var workingDirectory = $gren_lang$node$FileSystem$buildPath([ 'server' ]);
		var outputPath = $gren_lang$node$FileSystem$buildPath([ '..', 'dist', 'server', 'main.js' ]);
		var optimizeFlag = optimize ? '--optimize' : '';
		var inputPath = $gren_lang$node$FileSystem$buildPath([ 'src', 'Main.gren' ]);
		return A4($gren_lang$node$ChildProcess$run, procPermission, 'npx', [ 'gren', 'make', inputPath, optimizeFlag, _Utils_ap('--output=', outputPath) ], _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { b3: $gren_lang$node$ChildProcess$SetWorkingDirectory(workingDirectory) }));
	});
var $gren_lang$core$Bytes$Decode$decode = F2(function(_v0, bs) {
		var decoder = _v0;
		return A2(_Bytes_decode, decoder, bs);
	});
var $gren_lang$core$Bytes$Decode$Decoder = $gren_lang$core$Basics$identity;
var $gren_lang$core$Bytes$Decode$string = function(n) {
	return _Bytes_read_string(n);
};
var $gren_lang$core$Bytes$width = _Bytes_width;
var $author$project$Main$bytesToString = function(bytes) {
	return function(decoder) {
		return A2($gren_lang$core$Bytes$Decode$decode, decoder, bytes);
	}($gren_lang$core$Bytes$Decode$string($gren_lang$core$Bytes$width(bytes)));
};
var $author$project$Main$endWithErrorMessage = F2(function(stream, message) {
		return $gren_lang$core$Platform$Cmd$batch([ A2($gren_lang$node$Stream$sendLine, stream, _Utils_ap('🚨 ', _Utils_ap(message, '\n'))), $gren_lang$node$Node$setExitCode(1) ]);
	});
var $author$project$Main$codeGenError = F2(function(stream, error) {
		return A2($author$project$Main$endWithErrorMessage, stream, $author$project$CodeGen$errorString(error));
	});
var $author$project$CodeGen$Result = $gren_lang$core$Basics$identity;
var $icidasset$shikensu_gren$Shikensu$Error$PlatformUnknownError = function (a) {
	return { $: 2, a: a };
};
var $gren_lang$node$FileSystem$close = _FileSystem_close;
var $gren_lang$node$FileSystem$openImpl = _FileSystem_open;
var $gren_lang$node$FileSystem$openForRead = F2(function(_v0, path) {
		return A2($gren_lang$node$FileSystem$openImpl, 'r', path);
	});
var $gren_lang$node$FileSystem$readFromOffset = _FileSystem_readFromOffset;
var $gren_lang$node$FileSystem$read = function(fh) {
	return A2($gren_lang$node$FileSystem$readFromOffset, fh, { bv: -1, d: 0 });
};
var $icidasset$shikensu_gren$Shikensu$Definition$relativePath = function(def) {
	return A2($icidasset$shikensu_gren$Shikensu$Path$combine, def.ap, $icidasset$shikensu_gren$Shikensu$Path$file([ _Utils_ap(def.D, A2($gren_lang$core$Maybe$withDefault, '', A2($gren_lang$core$Maybe$map, function(e) {
							return _Utils_ap('.', e);
						}, def.bb))) ]));
};
var $icidasset$shikensu_gren$Shikensu$readDefinition = F3(function(fsPermission, readingDirectory, def) {
		return A2($gren_lang$core$Task$andThen, function(handle) {
				return A2($gren_lang$core$Task$andThen, function(updatedDef) {
						return A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformUnknownError, A2($gren_lang$core$Task$map, function(_v0) {
									return updatedDef;
								}, $gren_lang$node$FileSystem$close(handle)));
					}, A2($gren_lang$core$Task$map, function(bytes) {
							return _Utils_update(def, { x: $gren_lang$core$Maybe$Just(bytes) });
						}, A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformUnknownError, $gren_lang$node$FileSystem$read(handle))));
			}, function(path) {
				return A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformAccessError($icidasset$shikensu_gren$Shikensu$Path$encapsulate(path)), A2($gren_lang$node$FileSystem$openForRead, fsPermission, A2($icidasset$shikensu_gren$Shikensu$Path$toPosix, { aZ: true }, path)));
			}(A2($icidasset$shikensu_gren$Shikensu$Path$combine, readingDirectory, $icidasset$shikensu_gren$Shikensu$Definition$relativePath(def))));
	});
var $icidasset$shikensu_gren$Shikensu$read = function(bun) {
	return A2($gren_lang$core$Task$map, function(compendium) {
			return _Utils_update(bun, { L: compendium });
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, function(def) {
					var _v0 = bun.bI;
					if (!_v0.$) {
						var readingDirectory = _v0.a;
						return A3($icidasset$shikensu_gren$Shikensu$readDefinition, bun.bh, readingDirectory, def);
					} else {
						return $gren_lang$core$Task$succeed(def);
					}
				}, bun.L)));
};
var $gren_lang$node$FileSystem$EnsureEmpty = 0;
var $gren_lang$node$FileSystem$openForWrite = F3(function(_v0, behaviour, path) {
		var access = function () {
			switch (behaviour) {
				case 0:
					return 'w';
				case 1:
					return 'r+';
				default:
					return 'wx';
			}
		}();
		return A2($gren_lang$node$FileSystem$openImpl, access, path);
	});
var $gren_lang$node$FileSystem$writeFromOffset = _FileSystem_writeFromOffset;
var $gren_lang$node$FileSystem$write = F2(function(fh, bytes) {
		return A3($gren_lang$node$FileSystem$writeFromOffset, fh, 0, bytes);
	});
var $icidasset$shikensu_gren$Shikensu$writeDefinition = F3(function(permission, destinationDirectory, def) {
		return A2($gren_lang$core$Task$onError, function(err) {
				if ((err.$ === 1) && (!err.b.$)) {
					var path = err.a;
					var _v2 = err.b;
					var directoryPath = $icidasset$shikensu_gren$Shikensu$Path$directory(A2($gren_lang$core$Array$dropLast, 1, $icidasset$shikensu_gren$Shikensu$Path$unwrap(path)));
					var directoryPathString = A2($icidasset$shikensu_gren$Shikensu$Path$toPosix, { aZ: true }, directoryPath);
					return A2($gren_lang$core$Task$andThen, function(_v3) {
							return A3($icidasset$shikensu_gren$Shikensu$writeDefinition, permission, destinationDirectory, def);
						}, A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformAccessError($icidasset$shikensu_gren$Shikensu$Path$encapsulate(directoryPath)), A3($gren_lang$node$FileSystem$makeDirectory, permission, directoryPathString, { aR: true })));
				} else {
					return $gren_lang$core$Task$fail(err);
				}
			}, A2($gren_lang$core$Task$map, function(_v0) {
					return {  };
				}, A2($gren_lang$core$Task$andThen, function(handle) {
						return A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformUnknownError, A2($gren_lang$node$FileSystem$write, handle, A2($gren_lang$core$Maybe$withDefault, $gren_lang$core$Bytes$Encode$encode($gren_lang$core$Bytes$Encode$string('')), def.x)));
					}, function(path) {
						return A2($gren_lang$core$Task$mapError, $icidasset$shikensu_gren$Shikensu$Error$PlatformAccessError($icidasset$shikensu_gren$Shikensu$Path$encapsulate(path)), A3($gren_lang$node$FileSystem$openForWrite, permission, 0, A2($icidasset$shikensu_gren$Shikensu$Path$toPosix, { aZ: true }, path)));
					}(A2($icidasset$shikensu_gren$Shikensu$Path$combine, destinationDirectory, $icidasset$shikensu_gren$Shikensu$Definition$relativePath(def))))));
	});
var $icidasset$shikensu_gren$Shikensu$write = F2(function(destinationFocus, bun) {
		return function(destinationDirectory) {
			return A2($gren_lang$core$Task$map, function(_v0) {
					return bun;
				}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, A2($icidasset$shikensu_gren$Shikensu$writeDefinition, bun.bh, destinationDirectory), bun.L)));
		}(A2($icidasset$shikensu_gren$Shikensu$Focus$toAbsolutePath, { an: bun.b3 }, destinationFocus));
	});
var $author$project$CodeGen$write = function(destinationDir) {
	return $icidasset$shikensu_gren$Shikensu$write($icidasset$shikensu_gren$Shikensu$Focus$Relative($icidasset$shikensu_gren$Shikensu$Path$directory(destinationDir)));
};
var $author$project$CodeGen$copyPublicAssets = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ 'dist', 'client' ]), A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, A2($author$project$CodeGen$tryList, fsPermission, $icidasset$shikensu_gren$Shikensu$Focus$Relative($icidasset$shikensu_gren$Shikensu$Path$directory([ 'public' ])))))));
};
var $author$project$Main$fileSystemError = F2(function(stream, error) {
		return A2($author$project$Main$endWithErrorMessage, stream, function () {
				switch (error.$) {
					case 0:
						return 'File not found';
					case 1:
						return 'Cannot access file';
					case 2:
						return 'Path is not a directory';
					default:
						var str = error.a;
						return _Utils_ap('File system error: ', str);
				}
			}());
	});
var $gren_lang$core$Maybe$andThen = F2(function(callback, maybeValue) {
		if (!maybeValue.$) {
			var value = maybeValue.a;
			return callback(value);
		} else {
			return $gren_lang$core$Maybe$Nothing;
		}
	});
var $author$project$CodeGen$toBytes = function(string) {
	return $gren_lang$core$Bytes$Encode$encode($gren_lang$core$Bytes$Encode$string(string));
};
var $author$project$CodeGen$moduleName = function(def) {
	var path = $icidasset$shikensu_gren$Shikensu$Path$unwrap(def.ap);
	var modulePath = function () {
		if (path.length === 0) {
			return 'Components.';
		} else {
			var dirs = path;
			return _Utils_ap('Components.', _Utils_ap(A2($gren_lang$core$String$join, '.', dirs), '.'));
		}
	}();
	return _Utils_ap(modulePath, def.D);
};
var $gren_lang$core$String$replace = F3(function(before, after, string) {
		return A2($gren_lang$core$String$join, after, A2($gren_lang$core$String$split, before, string));
	});
var $author$project$CodeGen$toClientComponent = F2(function(def, contents) {
		return A3($gren_lang$core$String$replace, '{{MODULE_NAME}}', $author$project$CodeGen$moduleName(def), A3($gren_lang$core$String$replace, '{{NAME}}', def.D, 'module Gen.{{MODULE_NAME}} exposing (main)\n\nimport Transmutable.Html.VirtualDom exposing (toVirtualDom)\nimport {{MODULE_NAME}} as {{NAME}}\nimport Browser\n\nmain : Program {{NAME}}.Props {{NAME}}.Model {{NAME}}.Msg\nmain =\n    let\n        e = {{NAME}}.component\n    in\n    Browser.element\n        { init = e.init\n        , update = e.update\n        , subscriptions = e.subscriptions\n        , view = e.view >> toVirtualDom\n        }'));
	});
var $author$project$CodeGen$toString = function(bytes) {
	return function(decoder) {
		return A2($gren_lang$core$Bytes$Decode$decode, decoder, bytes);
	}($gren_lang$core$Bytes$Decode$string($gren_lang$core$Bytes$width(bytes)));
};
var $author$project$CodeGen$clientComponentFromDef = function(def) {
	return A2($gren_lang$core$Maybe$map, $author$project$CodeGen$toBytes, A2($gren_lang$core$Maybe$map, $author$project$CodeGen$toClientComponent(def), A2($gren_lang$core$Maybe$andThen, $author$project$CodeGen$toString, def.x)));
};
var $author$project$CodeGen$readComponents = function(fsPermission) {
	return A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, $author$project$CodeGen$listComponents(fsPermission));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent = F2(function(renderer, def) {
		return _Utils_update(def, { x: renderer(def) });
	});
var $icidasset$shikensu_gren$Shikensu$Contrib$renderContent = function(renderer) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent(renderer)));
};
var $author$project$CodeGen$genClientComponents = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ 'client', '.prettynice', 'Gen', 'Components' ]), A2($gren_lang$core$Task$map, $icidasset$shikensu_gren$Shikensu$Contrib$renderContent($author$project$CodeGen$clientComponentFromDef), $author$project$CodeGen$readComponents(fsPermission)))));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension = F3(function(oldExtname, newExtname, def) {
		return _Utils_eq(def.bb, $gren_lang$core$Maybe$Just(oldExtname)) ? _Utils_update(def, { bb: $gren_lang$core$Maybe$Just(newExtname) }) : def;
	});
var $icidasset$shikensu_gren$Shikensu$Contrib$renameExtension = F2(function(old, _new) {
		return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map(A2($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension, old, _new)));
	});
var $author$project$CodeGen$tryRead = $gren_lang$core$Task$andThen(function(bundle) {
		return A2($gren_lang$core$Task$onError, function(_v0) {
				return $gren_lang$core$Task$succeed(bundle);
			}, $icidasset$shikensu_gren$Shikensu$read(bundle));
	});
var $author$project$CodeGen$genClientPorts = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ 'dist', 'client', 'Components' ]), $author$project$CodeGen$tryRead(A2($gren_lang$core$Task$map, A2($icidasset$shikensu_gren$Shikensu$Contrib$renameExtension, 'gren', 'js'), $author$project$CodeGen$listComponents(fsPermission))))));
};
var $icidasset$shikensu_gren$Shikensu$bundle = F2(function(fsPermission, compendium) {
		return A2($gren_lang$core$Task$map, function(cwd) {
				return { L: compendium, bh: fsPermission, bI: $gren_lang$core$Maybe$Nothing, b3: cwd };
			}, $icidasset$shikensu_gren$Shikensu$currentWorkingDirectory(fsPermission));
	});
var $author$project$CodeGen$createDef = F2(function(content, path) {
		var def = $icidasset$shikensu_gren$Shikensu$Definition$create($icidasset$shikensu_gren$Shikensu$Path$file(path));
		return _Utils_update(def, { x: $gren_lang$core$Maybe$Just($author$project$CodeGen$toBytes(content)) });
	});
var $author$project$CodeGen$prettyniceComponentModule = 'module Prettynice.Component exposing (Component)\n\nimport Transmutable.Html exposing (Html)\n\ntype alias Component props model msg =\n    { init : props -> { model : model, command : Cmd msg }\n    , view : model -> Html msg\n    , update : msg -> model -> { model : model, command : Cmd msg }\n    , subscriptions : model -> Sub msg\n    }';
var $author$project$CodeGen$serverWrapper = 'const main = require("./main.js");\nconst app = main.Gren.Main.init({});\n\ntry {\n    const ports = require("./ports.js");\n    if (ports.init) {\n      ports.init(app);\n    }\n} catch (e) {\n    if (e.code !== \'MODULE_NOT_FOUND\') {\n        throw e;\n    }\n}';
var $author$project$CodeGen$genDependencies = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([  ]), A2($icidasset$shikensu_gren$Shikensu$bundle, fsPermission, [ A2($author$project$CodeGen$createDef, '', [ 'dist', 'client', 'main.js' ]), A2($author$project$CodeGen$createDef, $author$project$CodeGen$prettyniceComponentModule, [ 'client', '.prettynice', 'Prettynice', 'Component.gren' ]), A2($author$project$CodeGen$createDef, $author$project$CodeGen$serverWrapper, [ 'dist', 'server', 'index.js' ]) ]))));
};
var $icidasset$shikensu_gren$Shikensu$Focus$Absolute = function (a) {
	return { $: 2, a: a };
};
var $icidasset$shikensu_gren$Shikensu$Definition$fork = F2(function(relPath, def) {
		var name = A2($gren_lang$core$Maybe$withDefault, '', $gren_lang$core$Array$last($icidasset$shikensu_gren$Shikensu$Path$unwrap(relPath)));
		return { D: $icidasset$shikensu_gren$Shikensu$Definition$baseName(name), x: def.x, ap: $icidasset$shikensu_gren$Shikensu$Definition$directoryPath(relPath), bb: $icidasset$shikensu_gren$Shikensu$Definition$extensionName(name), aC: def.aC };
	});
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename = F3(function(oldPath, newPath, def) {
		return _Utils_eq($icidasset$shikensu_gren$Shikensu$Definition$relativePath(def), oldPath) ? A2($icidasset$shikensu_gren$Shikensu$Definition$fork, newPath, def) : def;
	});
var $icidasset$shikensu_gren$Shikensu$Contrib$rename = F2(function(oldPath, newPath) {
		return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map(A2($icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename, oldPath, newPath)));
	});
var $icidasset$shikensu_gren$Shikensu$Path$kind = function(_v0) {
	var k = _v0.a;
	return k;
};
var $icidasset$shikensu_gren$Shikensu$Path$Encapsulated$toDirectory = function(path) {
	var _v0 = $icidasset$shikensu_gren$Shikensu$Path$kind(path);
	if (!_v0) {
		return $gren_lang$core$Maybe$Just($icidasset$shikensu_gren$Shikensu$Path$directory($icidasset$shikensu_gren$Shikensu$Path$unwrap(path)));
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $author$project$CodeGen$genProject = F2(function(fsPermission, dirname) {
		var baseDir = $icidasset$shikensu_gren$Shikensu$Path$Encapsulated$toDirectory($icidasset$shikensu_gren$Shikensu$Path$fromPosix(_Utils_ap(dirname, '/')));
		if (!baseDir.$) {
			var dir = baseDir.a;
			return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ '.' ]), A2($gren_lang$core$Task$map, A2($icidasset$shikensu_gren$Shikensu$Contrib$rename, $icidasset$shikensu_gren$Shikensu$Path$file([ 'gitignore' ]), $icidasset$shikensu_gren$Shikensu$Path$file([ '.gitignore' ])), A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, A2($icidasset$shikensu_gren$Shikensu$list, fsPermission, $icidasset$shikensu_gren$Shikensu$Focus$Absolute(A2($icidasset$shikensu_gren$Shikensu$Path$combine, dir, $icidasset$shikensu_gren$Shikensu$Path$directory([ '..', 'templates', 'init' ])))))))));
		} else {
			return $gren_lang$core$Task$fail($author$project$CodeGen$PipelineError(_Utils_ap('Unknown error building path from: ', dirname)));
		}
	});
var $gren_lang$parser$Parser$Forbidden = 0;
var $gren_lang$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $gren_lang$parser$Parser$Advanced$fromInfo = F4(function(row, col, x, context) {
		return A2($gren_lang$parser$Parser$Advanced$AddRight, $gren_lang$parser$Parser$Advanced$Empty, { K: col, am: context, W: x, Y: row });
	});
var $gren_lang$parser$Parser$Advanced$chompUntil = function(_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return function(s) {
		var _v1 = A5($gren_lang$parser$Parser$Advanced$findSubString, str, s.d, s.Y, s.K, s.a);
		var newOffset = _v1.aH;
		var newRow = _v1.aI;
		var newCol = _v1.aG;
		return _Utils_eq(newOffset, -1) ? A2($gren_lang$parser$Parser$Advanced$Bad, false, A4($gren_lang$parser$Parser$Advanced$fromInfo, newRow, newCol, expecting, s.b)) : A3($gren_lang$parser$Parser$Advanced$Good, _Utils_cmp(s.d, newOffset) < 0, {  }, { K: newCol, b: s.b, c: s.c, d: newOffset, Y: newRow, a: s.a });
	};
};
var $gren_lang$parser$Parser$Expecting = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$parser$Parser$Advanced$Token = F2(function (a, b) {
		return { $: 0, a: a, b: b };
	});
var $gren_lang$parser$Parser$toToken = function(str) {
	return A2($gren_lang$parser$Parser$Advanced$Token, str, $gren_lang$parser$Parser$Expecting(str));
};
var $gren_lang$parser$Parser$chompUntil = function(str) {
	return $gren_lang$parser$Parser$Advanced$chompUntil($gren_lang$parser$Parser$toToken(str));
};
var $gren_lang$core$Set$Set_gren_builtin = $gren_lang$core$Basics$identity;
var $gren_lang$core$Set$empty = $gren_lang$core$Dict$empty;
var $blaix$prettynice$Prettynice$Internal$Props$ArrayType = function (a) {
	return { $: 4, a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$BoolType = { $: 3 };
var $blaix$prettynice$Prettynice$Internal$Props$FloatType = { $: 1 };
var $blaix$prettynice$Prettynice$Internal$Props$IntType = { $: 0 };
var $blaix$prettynice$Prettynice$Internal$Props$MaybeType = function (a) {
	return { $: 5, a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$StringType = { $: 2 };
var $gren_lang$parser$Parser$ExpectingKeyword = function (a) {
	return { $: 9, a: a };
};
var $gren_lang$core$String$isEmpty = function(string) {
	return _Utils_eq(string, '');
};
var $gren_lang$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $gren_lang$core$Basics$not = _Basics_not;
var $gren_lang$parser$Parser$Advanced$keyword = function(_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$gren_lang$core$String$isEmpty(kwd);
	return function(s) {
		var _v1 = A5($gren_lang$parser$Parser$Advanced$isSubString, kwd, s.d, s.Y, s.K, s.a);
		var newOffset = _v1.aH;
		var newRow = _v1.aI;
		var newCol = _v1.aG;
		return (_Utils_eq(newOffset, -1) || (_Utils_cmp(0, A3($gren_lang$parser$Parser$Advanced$isSubChar, function(c) {
					return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, '_');
				}, newOffset, s.a)) < 1)) ? A2($gren_lang$parser$Parser$Advanced$Bad, false, A2($gren_lang$parser$Parser$Advanced$fromState, s, expecting)) : A3($gren_lang$parser$Parser$Advanced$Good, progress, {  }, { K: newCol, b: s.b, c: s.c, d: newOffset, Y: newRow, a: s.a });
	};
};
var $gren_lang$parser$Parser$keyword = function(kwd) {
	return $gren_lang$parser$Parser$Advanced$keyword(A2($gren_lang$parser$Parser$Advanced$Token, kwd, $gren_lang$parser$Parser$ExpectingKeyword(kwd)));
};
var $gren_lang$parser$Parser$Advanced$lazy = function(thunk) {
	return function(s) {
		var _v0 = thunk({  });
		var parse = _v0;
		return parse(s);
	};
};
var $gren_lang$parser$Parser$lazy = $gren_lang$parser$Parser$Advanced$lazy;
var $gren_lang$parser$Parser$Advanced$spaces = $gren_lang$parser$Parser$Advanced$chompWhile(function(c) {
		return _Utils_eq(c, ' ') || (_Utils_eq(c, '\n') || _Utils_eq(c, '\r'));
	});
var $gren_lang$parser$Parser$spaces = $gren_lang$parser$Parser$Advanced$spaces;
function $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser() {
	return A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($gren_lang$core$Basics$identity), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, '(');
					})), $gren_lang$parser$Parser$spaces), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$IntType), $gren_lang$parser$Parser$keyword('Int')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$FloatType), $gren_lang$parser$Parser$keyword('Float')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$StringType), $gren_lang$parser$Parser$keyword('String')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$BoolType), $gren_lang$parser$Parser$keyword('Bool')), A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$ArrayType), $gren_lang$parser$Parser$keyword('Array')), $gren_lang$parser$Parser$lazy(function(_v0) {
									return $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
								})), A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$MaybeType), $gren_lang$parser$Parser$keyword('Maybe')), $gren_lang$parser$Parser$lazy(function(_v1) {
									return $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
								})) ]), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, ')');
					})), $gren_lang$parser$Parser$spaces));
}
var $blaix$prettynice$Prettynice$Internal$Props$fieldParser = $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
$blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser = function () {
	return $blaix$prettynice$Prettynice$Internal$Props$fieldParser;
};
var $gren_lang$core$Dict$fromArray = function(assocs) {
	return A3($gren_lang$core$Array$foldl, F2(function(_v0, dict) {
				var key = _v0.bt;
				var value = _v0.aX;
				return A3($gren_lang$core$Dict$insert, key, value, dict);
			}), $gren_lang$core$Dict$empty, assocs);
};
var $gren_lang$parser$Parser$Advanced$loopHelp = F4(function(p, state, callback, s0) {
		loopHelp:
		while (true) {
			var _v0 = callback(state);
			var parse = _v0;
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p1 = _v1.a;
				var step = _v1.b;
				var s1 = _v1.c;
				if (!step.$) {
					var newState = step.a;
					var $temp$p = p || p1,
					$temp$state = newState,
					$temp$callback = callback,
					$temp$s0 = s1;
					p = $temp$p;
					state = $temp$state;
					callback = $temp$callback;
					s0 = $temp$s0;
					continue loopHelp;
				} else {
					var result = step.a;
					return A3($gren_lang$parser$Parser$Advanced$Good, p || p1, result, s1);
				}
			} else {
				var p1 = _v1.a;
				var x = _v1.b;
				return A2($gren_lang$parser$Parser$Advanced$Bad, p || p1, x);
			}
		}
	});
var $gren_lang$parser$Parser$Advanced$loop = F2(function(state, callback) {
		return function(s) {
			return A4($gren_lang$parser$Parser$Advanced$loopHelp, false, state, callback, s);
		};
	});
var $gren_lang$parser$Parser$Advanced$map = F2(function(func, _v0) {
		var parse = _v0;
		return function(s0) {
			var _v1 = parse(s0);
			if (!_v1.$) {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return A3($gren_lang$parser$Parser$Advanced$Good, p, func(a), s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return A2($gren_lang$parser$Parser$Advanced$Bad, p, x);
			}
		};
	});
var $gren_lang$parser$Parser$Advanced$Done = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$parser$Parser$Advanced$Loop = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$parser$Parser$Advanced$revAlways = F2(function(_v0, b) {
		return b;
	});
var $gren_lang$parser$Parser$Advanced$skip = F2(function(iParser, kParser) {
		return A3($gren_lang$parser$Parser$Advanced$map2, $gren_lang$parser$Parser$Advanced$revAlways, iParser, kParser);
	});
var $gren_lang$parser$Parser$Advanced$sequenceEndForbidden = F5(function(ender, ws, parseItem, sep, items) {
		var chompRest = function(item) {
			return A5($gren_lang$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep, A2($gren_lang$core$Array$pushLast, item, items));
		};
		return A2($gren_lang$parser$Parser$Advanced$skip, ws, $gren_lang$parser$Parser$Advanced$oneOf([ A2($gren_lang$parser$Parser$Advanced$skip, sep, A2($gren_lang$parser$Parser$Advanced$skip, ws, A2($gren_lang$parser$Parser$Advanced$map, function(item) {
								return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
							}, parseItem))), A2($gren_lang$parser$Parser$Advanced$map, function(_v0) {
						return $gren_lang$parser$Parser$Advanced$Done(items);
					}, ender) ]));
	});
var $gren_lang$parser$Parser$Advanced$sequenceEndMandatory = F4(function(ws, parseItem, sep, items) {
		return $gren_lang$parser$Parser$Advanced$oneOf([ A2($gren_lang$parser$Parser$Advanced$map, function(item) {
					return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
				}, A2($gren_lang$parser$Parser$Advanced$ignorer, parseItem, A2($gren_lang$parser$Parser$Advanced$ignorer, ws, A2($gren_lang$parser$Parser$Advanced$ignorer, sep, ws)))), A2($gren_lang$parser$Parser$Advanced$map, function(_v0) {
					return $gren_lang$parser$Parser$Advanced$Done(items);
				}, $gren_lang$parser$Parser$Advanced$succeed({  })) ]);
	});
var $gren_lang$parser$Parser$Advanced$sequenceEndOptional = F5(function(ender, ws, parseItem, sep, items) {
		var parseEnd = A2($gren_lang$parser$Parser$Advanced$map, function(_v0) {
				return $gren_lang$parser$Parser$Advanced$Done(items);
			}, ender);
		return A2($gren_lang$parser$Parser$Advanced$skip, ws, $gren_lang$parser$Parser$Advanced$oneOf([ A2($gren_lang$parser$Parser$Advanced$skip, sep, A2($gren_lang$parser$Parser$Advanced$skip, ws, $gren_lang$parser$Parser$Advanced$oneOf([ A2($gren_lang$parser$Parser$Advanced$map, function(item) {
									return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
								}, parseItem), parseEnd ]))), parseEnd ]));
	});
var $gren_lang$parser$Parser$Advanced$sequenceEnd = F5(function(ender, ws, parseItem, sep, trailing) {
		var chompRest = function(item) {
			switch (trailing) {
				case 0:
					return A2($gren_lang$parser$Parser$Advanced$loop, [ item ], A4($gren_lang$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
				case 1:
					return A2($gren_lang$parser$Parser$Advanced$loop, [ item ], A4($gren_lang$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
				default:
					return A2($gren_lang$parser$Parser$Advanced$ignorer, A2($gren_lang$parser$Parser$Advanced$skip, ws, A2($gren_lang$parser$Parser$Advanced$skip, sep, A2($gren_lang$parser$Parser$Advanced$skip, ws, A2($gren_lang$parser$Parser$Advanced$loop, [ item ], A3($gren_lang$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))), ender);
			}
		};
		return $gren_lang$parser$Parser$Advanced$oneOf([ A2($gren_lang$parser$Parser$Advanced$andThen, chompRest, parseItem), A2($gren_lang$parser$Parser$Advanced$map, function(_v0) {
					return [  ];
				}, ender) ]);
	});
var $gren_lang$parser$Parser$Advanced$token = function(_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$gren_lang$core$String$isEmpty(str);
	return function(s) {
		var _v1 = A5($gren_lang$parser$Parser$Advanced$isSubString, str, s.d, s.Y, s.K, s.a);
		var newOffset = _v1.aH;
		var newRow = _v1.aI;
		var newCol = _v1.aG;
		return _Utils_eq(newOffset, -1) ? A2($gren_lang$parser$Parser$Advanced$Bad, false, A2($gren_lang$parser$Parser$Advanced$fromState, s, expecting)) : A3($gren_lang$parser$Parser$Advanced$Good, progress, {  }, { K: newCol, b: s.b, c: s.c, d: newOffset, Y: newRow, a: s.a });
	};
};
var $gren_lang$parser$Parser$Advanced$sequence = function(i) {
	return A2($gren_lang$parser$Parser$Advanced$skip, $gren_lang$parser$Parser$Advanced$token(i.aT), A2($gren_lang$parser$Parser$Advanced$skip, i.bP, A5($gren_lang$parser$Parser$Advanced$sequenceEnd, $gren_lang$parser$Parser$Advanced$token(i.a9), i.bP, i.bs, $gren_lang$parser$Parser$Advanced$token(i.bN), i.bV)));
};
var $gren_lang$parser$Parser$Advanced$Forbidden = 0;
var $gren_lang$parser$Parser$Advanced$Mandatory = 2;
var $gren_lang$parser$Parser$Advanced$Optional = 1;
var $gren_lang$parser$Parser$toAdvancedTrailing = function(trailing) {
	switch (trailing) {
		case 0:
			return 0;
		case 1:
			return 1;
		default:
			return 2;
	}
};
var $gren_lang$parser$Parser$sequence = function(i) {
	return $gren_lang$parser$Parser$Advanced$sequence({ a9: $gren_lang$parser$Parser$toToken(i.a9), bs: i.bs, bN: $gren_lang$parser$Parser$toToken(i.bN), bP: i.bP, aT: $gren_lang$parser$Parser$toToken(i.aT), bV: $gren_lang$parser$Parser$toAdvancedTrailing(i.bV) });
};
var $gren_lang$parser$Parser$ExpectingSymbol = function (a) {
	return { $: 8, a: a };
};
var $gren_lang$parser$Parser$Advanced$symbol = $gren_lang$parser$Parser$Advanced$token;
var $gren_lang$parser$Parser$symbol = function(str) {
	return $gren_lang$parser$Parser$Advanced$symbol(A2($gren_lang$parser$Parser$Advanced$Token, str, $gren_lang$parser$Parser$ExpectingSymbol(str)));
};
var $gren_lang$parser$Parser$token = function(str) {
	return $gren_lang$parser$Parser$Advanced$token($gren_lang$parser$Parser$toToken(str));
};
var $gren_lang$parser$Parser$ExpectingVariable = { $: 7 };
var $gren_lang$core$Set$member = F2(function(key, _v0) {
		var dict = _v0;
		return A2($gren_lang$core$Dict$member, key, dict);
	});
var $gren_lang$parser$Parser$Advanced$varHelp = F7(function(isGood, offset, row, col, src, indent, context) {
		varHelp:
		while (true) {
			var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, src);
			if (_Utils_eq(newOffset, -1)) {
				return { K: col, b: context, c: indent, d: offset, Y: row, a: src };
			} else {
				if (_Utils_eq(newOffset, -2)) {
					var $temp$isGood = isGood,
					$temp$offset = offset + 1,
					$temp$row = row + 1,
					$temp$col = 1,
					$temp$src = src,
					$temp$indent = indent,
					$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				} else {
					var $temp$isGood = isGood,
					$temp$offset = newOffset,
					$temp$row = row,
					$temp$col = col + 1,
					$temp$src = src,
					$temp$indent = indent,
					$temp$context = context;
					isGood = $temp$isGood;
					offset = $temp$offset;
					row = $temp$row;
					col = $temp$col;
					src = $temp$src;
					indent = $temp$indent;
					context = $temp$context;
					continue varHelp;
				}
			}
		}
	});
var $gren_lang$parser$Parser$Advanced$variable = function(i) {
	return function(s) {
		var firstOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, i.aT, s.d, s.a);
		if (_Utils_eq(firstOffset, -1)) {
			return A2($gren_lang$parser$Parser$Advanced$Bad, false, A2($gren_lang$parser$Parser$Advanced$fromState, s, i.aq));
		} else {
			var s1 = _Utils_eq(firstOffset, -2) ? A7($gren_lang$parser$Parser$Advanced$varHelp, i.bp, s.d + 1, s.Y + 1, 1, s.a, s.c, s.b) : A7($gren_lang$parser$Parser$Advanced$varHelp, i.bp, firstOffset, s.Y, s.K + 1, s.a, s.c, s.b);
			var name = A3($gren_lang$core$String$slice, s.d, s1.d, s.a);
			return A2($gren_lang$core$Set$member, name, i.bJ) ? A2($gren_lang$parser$Parser$Advanced$Bad, false, A2($gren_lang$parser$Parser$Advanced$fromState, s, i.aq)) : A3($gren_lang$parser$Parser$Advanced$Good, true, name, s1);
		}
	};
};
var $gren_lang$parser$Parser$variable = function(i) {
	return $gren_lang$parser$Parser$Advanced$variable({ aq: $gren_lang$parser$Parser$ExpectingVariable, bp: i.bp, bJ: i.bJ, aT: i.aT });
};
var $blaix$prettynice$Prettynice$Internal$Props$parser = A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($gren_lang$core$Dict$fromArray), $gren_lang$parser$Parser$chompUntil('type alias Props')), $gren_lang$parser$Parser$token('type alias Props')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol('=')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$sequence({ a9: '}', bs: A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed(F2(function(field, fieldType) {
							return { bt: field, aX: fieldType };
						})), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$variable({ bp: function(c) {
									return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, '_');
								}, bJ: $gren_lang$core$Set$empty, aT: $gren_lang$core$Char$isLower }), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol(':')), $gren_lang$parser$Parser$spaces)), $blaix$prettynice$Prettynice$Internal$Props$fieldParser), bN: ',', bP: $gren_lang$parser$Parser$spaces, aT: '{', bV: 0 }));
var $gren_lang$core$String$words = _String_words;
var $blaix$prettynice$Prettynice$Internal$Props$get = function(content) {
	var normalized = A2($gren_lang$core$String$join, ' ', $gren_lang$core$String$words(content));
	return A2($gren_lang$parser$Parser$run, $blaix$prettynice$Prettynice$Internal$Props$parser, normalized);
};
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder = function(fieldType) {
	switch (fieldType.$) {
		case 0:
			return 'Encode.int';
		case 1:
			return 'Encode.float';
		case 2:
			return 'Encode.string';
		case 3:
			return 'Encode.bool';
		case 4:
			var t = fieldType.a;
			return _Utils_ap('(Encode.array ', _Utils_ap($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(t), ')'));
		default:
			var t = fieldType.a;
			return _Utils_ap('(Maybe.map (', _Utils_ap($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(t), ') >> Maybe.withDefault Encode.null)'));
	}
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder = F3(function(name, fieldType, encoders) {
		var field = A3($gren_lang$core$String$replace, '{{ENCODER}}', $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(fieldType), A3($gren_lang$core$String$replace, '{{NAME}}', name, '{ key = "{{NAME}}"\n          , value = {{ENCODER}} props.{{NAME}}\n          }'));
		return A2($gren_lang$core$Array$pushLast, field, encoders);
	});
var $blaix$prettynice$Prettynice$Internal$Props$encoder = function(props) {
	var fields = A2($gren_lang$core$String$join, '\n        , ', A3($gren_lang$core$Dict$foldl, $blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder, [  ], props));
	return A3($gren_lang$core$String$replace, '{{FIELDS}}', fields, 'Encode.object \n        [ {{FIELDS}}\n        ]');
};
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString = function(fieldType) {
	switch (fieldType.$) {
		case 0:
			return 'Int';
		case 1:
			return 'Float';
		case 2:
			return 'String';
		case 3:
			return 'Bool';
		case 4:
			var t = fieldType.a;
			return _Utils_ap('(Array ', _Utils_ap($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(t), ')'));
		default:
			var t = fieldType.a;
			return _Utils_ap('(Maybe ', _Utils_ap($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(t), ')'));
	}
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldSig = F3(function(name, fieldType, sigs) {
		var field = _Utils_ap(name, _Utils_ap(' : ', $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(fieldType)));
		return A2($gren_lang$core$Array$pushLast, field, sigs);
	});
var $blaix$prettynice$Prettynice$Internal$Props$typeSig = function(props) {
	var fields = A2($gren_lang$core$String$join, ', ', A3($gren_lang$core$Dict$foldl, $blaix$prettynice$Prettynice$Internal$Props$addFieldSig, [  ], props));
	return _Utils_ap('{ ', _Utils_ap(fields, ' }'));
};
var $author$project$CodeGen$toServerComponent = F2(function(def, props) {
		return A3($gren_lang$core$String$replace, '{{PROPS_ENCODER}}', $blaix$prettynice$Prettynice$Internal$Props$encoder(props), A3($gren_lang$core$String$replace, '{{PROPS_TYPE}}', $blaix$prettynice$Prettynice$Internal$Props$typeSig(props), A3($gren_lang$core$String$replace, '{{MODULE_NAME}}', $author$project$CodeGen$moduleName(def), 'module Gen.{{MODULE_NAME}} exposing (init)\n\nimport Json.Encode as Encode\nimport Prettynice.Internal.Props as Props\nimport Transmutable.Html as H exposing (Html)\nimport Transmutable.Html.Attributes as A\n\ntype alias Props =\n    {{PROPS_TYPE}}\n\nencoder : Props -> Encode.Value\nencoder props =\n    {{PROPS_ENCODER}}\n\ninit : Props -> Html msg\ninit props =\n    let\n        propJson = Encode.encode 0 (encoder props)\n    in\n    H.span []\n        [ H.span [ A.class "prettynice-component-{{MODULE_NAME}}" ] []\n        , H.node "script" []\n            [ H.text <|\n                \"""\n\n                var $__components = $__components || {};\n                $__components["{{MODULE_NAME}}"] = $__components["{{MODULE_NAME}}"] || [];\n                $__components["{{MODULE_NAME}}"].push(\n                    Gren.Gen.{{MODULE_NAME}}.init({\n\n                        flags: \""" ++ propJson ++ \""",\n                        node: document.currentScript.parentNode.getElementsByClassName(\n                            "prettynice-component-{{MODULE_NAME}}"\n                        )[0],\n                    })\n                );\n\n                \"""\n            ]\n        ]')));
	});
var $author$project$CodeGen$serverComponentsFromBundle = function(bundle) {
	var newBundle = A2($icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium, $gren_lang$core$Array$map(function(def) {
				var content = A2($gren_lang$core$Maybe$withDefault, '', A2($gren_lang$core$Maybe$andThen, $author$project$CodeGen$toString, def.x));
				var propsResult = $blaix$prettynice$Prettynice$Internal$Props$get(content);
				return _Utils_update(def, { x: function () {
						if (!propsResult.$) {
							var props = propsResult.a;
							return $gren_lang$core$Maybe$Just($author$project$CodeGen$toBytes(A2($author$project$CodeGen$toServerComponent, def, props)));
						} else {
							var e = propsResult;
							return $gren_lang$core$Maybe$Nothing;
						}
					}() });
			}), bundle);
	var badDef = A2($gren_lang$core$Array$findFirst, function(def) {
			return _Utils_eq(def.x, $gren_lang$core$Maybe$Nothing);
		}, newBundle.L);
	if (badDef.$ === 1) {
		return $gren_lang$core$Task$succeed(newBundle);
	} else {
		var def = badDef.a;
		return $gren_lang$core$Task$fail($icidasset$shikensu_gren$Shikensu$Error$ErrorMessage(A3($gren_lang$core$String$replace, '{{COMPONENT}}', def.D, 'Oops! I can\'t parse props for the {{COMPONENT}} component.\n   I\'m looking for a type alias that looks like this:\n\n        type alias Props =\n            { myField : String\n            , myOtherField : Int\n            }\n\n   It either doesn\'t exist, is formatted in a way I\n   can\'t recognize, or it uses unsupported field types.\n   See Prettynice.Internal.Props.Fieldtype for supported types:\n   https://packages.gren-lang.org/package/blaix/prettynice/version/1/module/Prettynice.Internal.Props#FieldType')));
	}
};
var $author$project$CodeGen$genServerComponents = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ 'server', '.prettynice', 'Gen', 'Components' ]), A2($gren_lang$core$Task$andThen, $author$project$CodeGen$serverComponentsFromBundle, $author$project$CodeGen$readComponents(fsPermission)))));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$withBaseName = function(baseName) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$filter(function(def) {
				return _Utils_eq(def.D, baseName);
			}));
};
var $author$project$CodeGen$genServerPorts = function(fsPermission) {
	return A2($gren_lang$core$Task$map, $gren_lang$core$Basics$identity, A2($gren_lang$core$Task$mapError, $author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write([ 'dist', 'server' ]), $author$project$CodeGen$tryRead(A2($gren_lang$core$Task$map, $icidasset$shikensu_gren$Shikensu$Contrib$withBaseName('ports'), A2($gren_lang$core$Task$map, $icidasset$shikensu_gren$Shikensu$Contrib$withExtension('js'), A2($author$project$CodeGen$tryList, fsPermission, $icidasset$shikensu_gren$Shikensu$Focus$Relative($icidasset$shikensu_gren$Shikensu$Path$directory([ 'server', 'src' ])))))))));
};
var $gren_lang$node$ChildProcess$runWithDefaultOptions = F3(function(permission, program, _arguments) {
		return A4($gren_lang$node$ChildProcess$run, permission, program, _arguments, $gren_lang$node$ChildProcess$defaultRunOptions);
	});
var $gren_lang$core$String$trim = _String_trim;
var $author$project$Main$update = F2(function(msg, model) {
		switch (msg.$) {
			case 12:
				var dirname = msg.a;
				return { g: $gren_lang$core$Platform$Cmd$none, h: _Utils_update(model, { N: $gren_lang$core$Maybe$Just(dirname) }) };
			case 13:
				var version = msg.a;
				return { g: A2($gren_lang$node$Stream$sendLine, model.e, version), h: model };
			case 0:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating prettynice dependencies'), A2($gren_lang$core$Task$attempt, $author$project$Main$GeneratedDependencies, $author$project$CodeGen$genDependencies(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$fileSystemError, model.f, e);
					}
				}(), h: model };
			case 1:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating server components'), A2($gren_lang$core$Task$attempt, $author$project$Main$GeneratedServerComponents, $author$project$CodeGen$genServerComponents(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 2:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating client components'), A2($gren_lang$core$Task$attempt, $author$project$Main$GeneratedClientComponents, $author$project$CodeGen$genClientComponents(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 3:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating server ports'), A2($gren_lang$core$Task$attempt, $author$project$Main$GeneratedServerPorts, $author$project$CodeGen$genServerPorts(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 4:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating client ports'), A2($gren_lang$core$Task$attempt, $author$project$Main$GeneratedClientPorts, $author$project$CodeGen$genClientPorts(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 5:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Copying public assets'), A2($gren_lang$core$Task$attempt, $author$project$Main$CopiedPublicAssets, $author$project$CodeGen$copyPublicAssets(model.bh)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 6:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Building client components'), A2($gren_lang$core$Task$attempt, $author$project$Main$BuiltClientComponents, A3($author$project$Main$buildClientComponents, model.bh, model.G, model.T)) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			case 7:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						var success = result.a;
						return $gren_lang$core$Platform$Cmd$batch([ function () {
								if (success.$ === 1) {
									return A2($gren_lang$node$Stream$sendLine, model.e, 'No components to build');
								} else {
									var s = success.a;
									return A2($gren_lang$node$Stream$send, model.e, s.e);
								}
							}(), A2($author$project$Main$progress, model.e, 'Building server'), A2($gren_lang$core$Task$attempt, $author$project$Main$BuiltServer, A2($author$project$Main$buildServer, model.G, model.T)) ]);
					} else {
						if (!result.a.$) {
							var failure = result.a.a;
							return A2($author$project$Main$endWithErrorMessage, model.f, A2($gren_lang$core$Maybe$withDefault, 'Unknown error building client components', $author$project$Main$bytesToString(failure.f)));
						} else {
							var message = result.a.a;
							return A2($author$project$Main$endWithErrorMessage, model.f, message);
						}
					}
				}(), h: model };
			case 8:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						var success = result.a;
						return $gren_lang$core$Platform$Cmd$batch([ A2($gren_lang$node$Stream$send, model.e, success.e), A2($gren_lang$node$Stream$sendLine, model.e, '✅ Done') ]);
					} else {
						var error = result.a;
						return A2($author$project$Main$endWithErrorMessage, model.f, A2($gren_lang$core$Maybe$withDefault, 'Unknown error building server', $author$project$Main$bytesToString(error.f)));
					}
				}(), h: model };
			case 9:
				var bytes = msg.a;
				var answer = $gren_lang$core$String$trim(A2($gren_lang$core$Maybe$withDefault, '', $author$project$Main$bytesToString(bytes)));
				return { g: (_Utils_eq(answer, 'y') || _Utils_eq(answer, 'yes')) ? $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Generating project'), function () {
						var _v11 = model.N;
						if (!_v11.$) {
							var dir = _v11.a;
							return A2($gren_lang$core$Task$attempt, $author$project$Main$GenProject_Created, A2($author$project$CodeGen$genProject, model.bh, dir));
						} else {
							return A2($author$project$Main$endWithErrorMessage, model.f, 'Can\'t find path to current executable.');
						}
					}() ]) : $gren_lang$core$Platform$Cmd$none, h: _Utils_update(model, { H: $gren_lang$core$Maybe$Nothing }) };
			case 10:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return $gren_lang$core$Platform$Cmd$batch([ A2($author$project$Main$progress, model.e, 'Installing dependencies'), A2($gren_lang$core$Task$attempt, $author$project$Main$GenProject_NpmInstalled, A3($gren_lang$node$ChildProcess$runWithDefaultOptions, model.G, 'npm', [ 'install' ])) ]);
					} else {
						var e = result.a;
						return A2($author$project$Main$codeGenError, model.f, e);
					}
				}(), h: model };
			default:
				var result = msg.a;
				return { g: function () {
					if (!result.$) {
						return A2($gren_lang$node$Stream$sendLine, model.e, '✅ Done!\n\nNow what?\n* Start the dev server with: npm run dev\n* Make changes to your server at: server/src/Main.gren\n* View examples at: https://github.com/blaix/prettynice/tree/main/examples');
					} else {
						var error = result.a;
						return A2($author$project$Main$endWithErrorMessage, model.f, A2($gren_lang$core$Maybe$withDefault, 'Unknown error installing dependencies', $author$project$Main$bytesToString(error.f)));
					}
				}(), h: model };
		}
	});
var $author$project$Main$main = $gren_lang$node$Node$defineProgram({ bm: $author$project$Main$init, bR: $author$project$Main$subscriptions, bW: $author$project$Main$update });
_Platform_export({'Main':{'init':$author$project$Main$main($gren_lang$core$Json$Decode$succeed({  }))(0)}});}(this.module ? this.module.exports : this));