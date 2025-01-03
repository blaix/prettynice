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
	return { $: 'InitDone', a: a };
};
var $gren_lang$node$Node$Uninitialized = { $: 'Uninitialized' };


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
var $gren_lang$core$Basics$apL$ = function(f, x) {
	return f(x);
};
var $gren_lang$core$Basics$apL = F2($gren_lang$core$Basics$apL$);
var $gren_lang$core$Basics$apR$ = function(x, f) {
	return f(x);
};
var $gren_lang$core$Basics$apR = F2($gren_lang$core$Basics$apR$);


var process = require("node:process");

var _Node_log = F2(function (text, args) {
  // This function is used for simple applications where the main function returns String
  // NOTE: this function needs _Platform_export available to work
  console.log(text);
  return {};
});

var _Node_init = _Scheduler_binding(function (callback) {
  callback(
    _Scheduler_succeed({
      applicationPath: _FilePath_fromString(module.filename),
      arch: process.arch,
      args: process.argv,
      platform: process.platform,
      stderr: process.stderr,
      stdin: process.stdin,
      stdout: process.stdout,
    })
  );
});

var _Node_getEnvironmentVariables = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_Node_objToDict(process.env)));
});

var _Node_exitWithCode = function (code) {
  return _Scheduler_binding(function (callback) {
    process.exit(code);
  });
};

var _Node_setExitCode = function (code) {
  return _Scheduler_binding(function (callback) {
    process.exitCode = code;
    callback(_Scheduler_succeed({}));
  });
};

// Helpers

function _Node_objToDict(obj) {
  var dict = $gren_lang$core$Dict$empty;

  for (var key in obj) {
    dict = A3($gren_lang$core$Dict$set, key, obj[key], dict);
  }

  return dict;
}


var path = require("node:path");
var process = require("node:process");

var _FilePath_fromPosix = function (str) {
  return _FilePath_parse(path.posix, str);
};

var _FilePath_fromWin32 = function (str) {
  return _FilePath_parse(path.win32, str);
};

var _FilePath_fromString = function (str) {
  return _FilePath_parse(path, str);
};

var _FilePath_parse = function (pathMod, str) {
  const result = pathMod.parse(pathMod.normalize(str));

  const root = result.root;
  const dirStr = result.dir.startsWith(root)
    ? result.dir.substring(root.length)
    : result.dir;

  const filename =
    result.name === "." && result.ext.length === 0 ? "" : result.name;

  return {
    directory: dirStr === "" ? [] : dirStr.split(pathMod.sep),
    extension: result.ext.length > 0 ? result.ext.substring(1) : "",
    filename: filename,
    root: result.root,
  };
};

var _FilePath_toPosix = function (filePath) {
  if (_FilePath_isEmpty(filePath)) {
    return ".";
  }

  if (filePath.root !== "" && filePath.root !== "/") {
    filePath = { ...filePath, root: "/" };
  }

  return _FilePath_format(path.posix, filePath);
};

var _FilePath_toWin32 = function (filePath) {
  if (_FilePath_isEmpty(filePath)) {
    return ".";
  }

  return _FilePath_format(path.win32, filePath);
};

var _FilePath_toString = function (filePath) {
  if (process.platform.toLowerCase() === "win32") {
    return _FilePath_toWin32(filePath);
  }

  return _FilePath_toPosix(filePath);
};

var _FilePath_isEmpty = function (filePath) {
  return (
    filePath.root === "" &&
    filePath.directory.length === 0 &&
    filePath.filename === "" &&
    filePath.extension === ""
  );
};

var _FilePath_format = function (pathMod, filePath) {
  const filename =
    filePath.extension.length > 0
      ? filePath.filename + "." + filePath.extension
      : filePath.filename;

  let pathArray = null;
  if (filename === "") {
    pathArray = filePath.directory;
  } else {
    pathArray = filePath.directory.concat(filename);
  }

  return filePath.root + pathArray.join(pathMod.sep);
};


// PROGRAMS

var _Platform_worker = F4(function (impl, flagDecoder, debugMetadata, args) {
  return _Platform_initialize(
    flagDecoder,
    args,
    impl.init,
    impl.update,
    impl.subscriptions,
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
    _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);
  var managers = {};
  var initPair = init(result.a);
  var model = initPair.model;
  var stepper = stepperBuilder(sendToApp, model);
  var ports = _Platform_setupEffects(managers, sendToApp);

  function sendToApp(msg, viewMetadata) {
    var pair = A2(update, msg, model);
    stepper((model = pair.model), viewMetadata);
    _Platform_enqueueEffects(managers, pair.command, subscriptions(model));
  }

  _Platform_enqueueEffects(managers, initPair.command, subscriptions(model));

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

function _Platform_export_UNUSED(exports) {
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

function _Platform_export(exports) {
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

var _Debug_log_UNUSED = F2(function (tag, value) {
  return value;
});

var _Debug_log = F2(function (tag, value) {
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

function _Debug_toString_UNUSED(value) {
  return "<internals>";
}

function _Debug_toString(value) {
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
        _Debug_toAnsiString(
          ansi,
          A3(
            $gren_lang$core$Dict$foldl,
            F3(function (key, value, acc) {
              acc.push({ key: key, value: value });
              return acc;
            }),
            [],
            value
          )
        )
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

function _Debug_crash_UNUSED(identifier) {
  throw new Error(
    "https://github.com/gren-lang/core/blob/1.0.0/hints/" + identifier + ".md"
  );
}

function _Debug_crash(identifier, fact1, fact2, fact3, fact4) {
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
  if (region.start.line === region.end.line) {
    return "on line " + region.start.line;
  }
  return (
    "on lines " + region.start.line + " through " + region.end.line
  );
}
var $gren_lang$core$Dict$foldl$ = function(func, acc, dict) {
	foldl:
	while (true) {
		if (dict.$ === 'RBEmpty_gren_builtin') {
			return acc;
		} else {
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			var $temp$func = func,
			$temp$acc = A3(func, key, value, $gren_lang$core$Dict$foldl$(func, acc, left)),
			$temp$dict = right;
			func = $temp$func;
			acc = $temp$acc;
			dict = $temp$dict;
			continue foldl;
		}
	}
};
var $gren_lang$core$Dict$foldl = F3($gren_lang$core$Dict$foldl$);


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
  var value = array.at(index);

  if (value === undefined) {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just(value);
});

var _Array_set = F3(function (index, value, array) {
  try {
    return array.with(index, value);
  } catch (e) {
    // assuming RangeError
    return array;
  }
});

var _Array_push = F2(function (value, array) {
  return array.concat(value);
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

var _Array_indexedFoldl = F3(function (func, acc, array) {
  for (var i = 0; i < array.length; i++) {
    acc = A3(func, i, array[i], acc);
  }

  return acc;
});

var _Array_indexedFoldr = F3(function (func, acc, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    acc = A3(func, i, array[i], acc);
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

var _Array_filter = F2(function (func, array) {
  return array.filter(func);
});

var _Array_flat = function (array) {
  return array.flat();
};

var _Array_flatMap = F2(function (func, array) {
  return array.flatMap(func);
});

var _Array_slice = F3(function (from, to, array) {
  return array.slice(from, to);
});

var _Array_append = F2(function (left, right) {
  return left.concat(right);
});

var _Array_reverse = function (array) {
  return array.toReversed();
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
  return array.toSorted(function (a, b) {
    return _Utils_cmp(a, b);
  });
};

var _Array_sortBy = F2(function (fn, array) {
  return array.toSorted(function (a, b) {
    return _Utils_cmp(fn(a), fn(b));
  });
});

var _Array_sortWith = F2(function (fn, array) {
  return array.toSorted(function (a, b) {
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

  /**/
	if (x.$ === 'Set_gren_builtin')
	{
		x = $gren_lang$core$Set$toArray(x);
		y = $gren_lang$core$Set$toArray(y);
	}
	if (x.$ === 'RBNode_gren_builtin' || x.$ === 'RBEmpty_gren_builtin')
	{
		x = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], x);
		y = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], y);
	}
	//*/

  /**_UNUSED/
	if (x.$ < 0)
	{
		x = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], x);
		y = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], y);
	}
	//*/

  if (x instanceof DataView) {
    var length = x.byteLength;

    if (y.byteLength !== length) {
      return false;
    }

    for (var i = 0; i < length; ++i) {
      if (x.getUint8(i) !== y.getUint8(i)) {
        return false;
      }
    }
  }

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

  /**/
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

function _Utils_chr_UNUSED(c) {
  return c;
}
function _Utils_chr(c) {
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
var $gren_lang$core$Basics$EQ = { $: 'EQ' };
var $gren_lang$core$Basics$GT = { $: 'GT' };
var $gren_lang$core$Basics$LT = { $: 'LT' };
var $gren_lang$core$Maybe$Just = function (a) {
	return { $: 'Just', a: a };
};
var $gren_lang$core$Maybe$Nothing = { $: 'Nothing' };
var $gren_lang$core$Array$pushLast = _Array_push;
var $gren_lang$core$Dict$keys = function(dict) {
	return $gren_lang$core$Dict$foldl$(F3(function(key, value, keyArray) {
				return A2($gren_lang$core$Array$pushLast, key, keyArray);
			}), [  ], dict);
};
var $gren_lang$core$Set$toArray = function(_v0) {
	var dict = _v0.a;
	return $gren_lang$core$Dict$keys(dict);
};


/**/
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
          keyValuePairs.push({ key: key, value: result.a });
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

function _Json_wrap(value) {
  return { $: 0, a: value };
}
function _Json_unwrap(value) {
  return value.a;
}

function _Json_wrap_UNUSED(value) {
  return value;
}
function _Json_unwrap_UNUSED(value) {
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
	return { $: 'Err', a: a };
};
var $gren_lang$core$Json$Decode$Failure$ = function (a, b) {
	return { $: 'Failure', a: a, b: b };
};
var $gren_lang$core$Json$Decode$Failure = F2($gren_lang$core$Json$Decode$Failure$);
var $gren_lang$core$Json$Decode$Field$ = function (a, b) {
	return { $: 'Field', a: a, b: b };
};
var $gren_lang$core$Json$Decode$Field = F2($gren_lang$core$Json$Decode$Field$);
var $gren_lang$core$Json$Decode$Index$ = function (a, b) {
	return { $: 'Index', a: a, b: b };
};
var $gren_lang$core$Json$Decode$Index = F2($gren_lang$core$Json$Decode$Index$);
var $gren_lang$core$Result$Ok = function (a) {
	return { $: 'Ok', a: a };
};
var $gren_lang$core$Json$Decode$OneOf = function (a) {
	return { $: 'OneOf', a: a };
};
var $gren_lang$core$Basics$False = { $: 'False' };


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
  if (string.length <= 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just({ first: _Utils_chr(string[0]), rest: string.slice(1) });
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
    i++;

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
    arr[len - i] = str[i];
    i++;
  }
  return arr.join("");
}

var _String_foldl = F3(function (func, state, string) {
  var len = string.length;
  var i = 0;
  while (i < len) {
    var char = string[i];
    state = A2(func, _Utils_chr(char), state);
    i++;
  }
  return state;
});

var _String_foldr = F3(function (func, state, string) {
  var i = string.length;
  while (i--) {
    var char = string[i];
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
	return (97 <= code) && (code <= 122);
};
var $gren_lang$core$Char$isUpper = function(_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (code <= 90) && (65 <= code);
};
var $gren_lang$core$Basics$or = _Basics_or;
var $gren_lang$core$Char$isAlpha = function(_char) {
	return $gren_lang$core$Char$isLower(_char) || $gren_lang$core$Char$isUpper(_char);
};
var $gren_lang$core$Char$isDigit = function(_char) {
	var code = $gren_lang$core$Char$toCode(_char);
	return (code <= 57) && (48 <= code);
};
var $gren_lang$core$Char$isAlphaNum = function(_char) {
	return $gren_lang$core$Char$isLower(_char) || ($gren_lang$core$Char$isUpper(_char) || $gren_lang$core$Char$isDigit(_char));
};
var $gren_lang$core$Array$length = _Array_length;
var $gren_lang$core$String$uncons = _String_uncons;
var $gren_lang$core$Json$Decode$errorOneOf$ = function(i, error) {
	return '\n\n(' + ($gren_lang$core$String$fromInt(i + 1) + (') ' + $gren_lang$core$Json$Decode$indent($gren_lang$core$Json$Decode$errorToString(error))));
};
var $gren_lang$core$Json$Decode$errorOneOf = F2($gren_lang$core$Json$Decode$errorOneOf$);
var $gren_lang$core$Json$Decode$errorToString = function(error) {
	return $gren_lang$core$Json$Decode$errorToStringHelp$(error, [  ]);
};
var $gren_lang$core$Json$Decode$errorToStringHelp$ = function(error, context) {
	errorToStringHelp:
	while (true) {
		switch (error.$) {
			case 'Field':
				var f = error.a;
				var err = error.b;
				var isSimple = function () {
					var _v1 = $gren_lang$core$String$uncons(f);
					if (_v1.$ === 'Nothing') {
						return false;
					} else {
						var _v2 = _v1.a;
						var _char = _v2.first;
						var rest = _v2.rest;
						return $gren_lang$core$Char$isAlpha(_char) && A2($gren_lang$core$String$all, $gren_lang$core$Char$isAlphaNum, rest);
					}
				}();
				var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
				var $temp$error = err,
				$temp$context = _Utils_ap([ fieldName ], context);
				error = $temp$error;
				context = $temp$context;
				continue errorToStringHelp;
			case 'Index':
				var i = error.a;
				var err = error.b;
				var indexName = '[' + ($gren_lang$core$String$fromInt(i) + ']');
				var $temp$error = err,
				$temp$context = _Utils_ap([ indexName ], context);
				error = $temp$error;
				context = $temp$context;
				continue errorToStringHelp;
			case 'OneOf':
				var errors = error.a;
				switch (errors.length) {
					case 0:
						return 'Ran into a Json.Decode.oneOf with no possibilities' + function () {
							if (context.length === 0) {
								return '!';
							} else {
								return ' at json' + A2($gren_lang$core$String$join, '', context);
							}
						}();
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
								return 'The Json.Decode.oneOf at json' + A2($gren_lang$core$String$join, '', context);
							}
						}();
						var introduction = starter + (' failed in the following ' + ($gren_lang$core$String$fromInt($gren_lang$core$Array$length(errors)) + ' ways:'));
						return A2($gren_lang$core$String$join, '\n\n', _Utils_ap([ introduction ], A2($gren_lang$core$Array$indexedMap, $gren_lang$core$Json$Decode$errorOneOf, errors)));
				}
			default:
				var msg = error.a;
				var json = error.b;
				var introduction = function () {
					if (context.length === 0) {
						return 'Problem with the given value:\n\n';
					} else {
						return 'Problem with the value at json' + (A2($gren_lang$core$String$join, '', context) + ':\n\n    ');
					}
				}();
				return introduction + ($gren_lang$core$Json$Decode$indent(A2($gren_lang$core$Json$Encode$encode, 4, json)) + ('\n\n' + msg));
		}
	}
};
var $gren_lang$core$Json$Decode$errorToStringHelp = F2($gren_lang$core$Json$Decode$errorToStringHelp$);
var $gren_lang$core$Basics$True = { $: 'True' };
var $gren_lang$core$Result$isOk = function(result) {
	if (result.$ === 'Ok') {
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
var $gren_lang$core$Dict$RBEmpty_gren_builtin = { $: 'RBEmpty_gren_builtin' };
var $gren_lang$core$Dict$empty = $gren_lang$core$Dict$RBEmpty_gren_builtin;
var $gren_lang$core$Dict$Black = { $: 'Black' };
var $gren_lang$core$Dict$RBNode_gren_builtin$ = function (a, b, c, d, e) {
	return { $: 'RBNode_gren_builtin', a: a, b: b, c: c, d: d, e: e };
};
var $gren_lang$core$Dict$RBNode_gren_builtin = F5($gren_lang$core$Dict$RBNode_gren_builtin$);
var $gren_lang$core$Dict$Red = { $: 'Red' };
var $gren_lang$core$Dict$balance$ = function(color, key, value, left, right) {
	if ((right.$ === 'RBNode_gren_builtin') && (right.a.$ === 'Red')) {
		var _v1 = right.a;
		var rK = right.b;
		var rV = right.c;
		var rLeft = right.d;
		var rRight = right.e;
		if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) {
			var _v3 = left.a;
			var lK = left.b;
			var lV = left.c;
			var lLeft = left.d;
			var lRight = left.e;
			return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, key, value, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, lK, lV, lLeft, lRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, rK, rV, rLeft, rRight));
		} else {
			return $gren_lang$core$Dict$RBNode_gren_builtin$(color, rK, rV, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, key, value, left, rLeft), rRight);
		}
	} else {
		if ((((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) && (left.d.$ === 'RBNode_gren_builtin')) && (left.d.a.$ === 'Red')) {
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
			return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, llK, llV, llLeft, llRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, key, value, lRight, right));
		} else {
			return $gren_lang$core$Dict$RBNode_gren_builtin$(color, key, value, left, right);
		}
	}
};
var $gren_lang$core$Dict$balance = F5($gren_lang$core$Dict$balance$);
var $gren_lang$core$Basics$compare = _Utils_compare;
var $gren_lang$core$Dict$setHelp$ = function(key, value, dict) {
	if (dict.$ === 'RBEmpty_gren_builtin') {
		return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, key, value, $gren_lang$core$Dict$RBEmpty_gren_builtin, $gren_lang$core$Dict$RBEmpty_gren_builtin);
	} else {
		var nColor = dict.a;
		var nKey = dict.b;
		var nValue = dict.c;
		var nLeft = dict.d;
		var nRight = dict.e;
		var _v1 = A2($gren_lang$core$Basics$compare, key, nKey);
		switch (_v1.$) {
			case 'LT':
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$setHelp$(key, value, nLeft), nRight);
			case 'EQ':
				return $gren_lang$core$Dict$RBNode_gren_builtin$(nColor, nKey, value, nLeft, nRight);
			default:
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, nLeft, $gren_lang$core$Dict$setHelp$(key, value, nRight));
		}
	}
};
var $gren_lang$core$Dict$setHelp = F3($gren_lang$core$Dict$setHelp$);
var $gren_lang$core$Dict$set$ = function(key, value, dict) {
	var _v0 = $gren_lang$core$Dict$setHelp$(key, value, dict);
	if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.$ === 'Red')) {
		var _v1 = _v0.a;
		var k = _v0.b;
		var v = _v0.c;
		var l = _v0.d;
		var r = _v0.e;
		return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, l, r);
	} else {
		var x = _v0;
		return x;
	}
};
var $gren_lang$core$Dict$set = F3($gren_lang$core$Dict$set$);
var $gren_lang$node$Internal$Stream$Stream$ = function (a, b) {
	return { $: 'Stream', a: a, b: b };
};
var $gren_lang$node$Internal$Stream$Stream = F2($gren_lang$node$Internal$Stream$Stream$);
var $gren_lang$node$Node$Arm = { $: 'Arm' };
var $gren_lang$node$Node$Arm64 = { $: 'Arm64' };
var $gren_lang$node$Node$IA32 = { $: 'IA32' };
var $gren_lang$node$Node$Mips = { $: 'Mips' };
var $gren_lang$node$Node$Mipsel = { $: 'Mipsel' };
var $gren_lang$node$Node$PPC = { $: 'PPC' };
var $gren_lang$node$Node$PPC64 = { $: 'PPC64' };
var $gren_lang$node$Node$S390 = { $: 'S390' };
var $gren_lang$node$Node$S390x = { $: 'S390x' };
var $gren_lang$node$Node$UnknownArchitecture = function (a) {
	return { $: 'UnknownArchitecture', a: a };
};
var $gren_lang$node$Node$X64 = { $: 'X64' };
var $gren_lang$core$String$toLower = _String_toLower;
var $gren_lang$node$Node$archFromString = function(arch) {
	var _v0 = $gren_lang$core$String$toLower(arch);
	switch (_v0) {
		case 'arm':
			return $gren_lang$node$Node$Arm;
		case 'arm64':
			return $gren_lang$node$Node$Arm64;
		case 'ia32':
			return $gren_lang$node$Node$IA32;
		case 'mips':
			return $gren_lang$node$Node$Mips;
		case 'mipsel':
			return $gren_lang$node$Node$Mipsel;
		case 'ppc':
			return $gren_lang$node$Node$PPC;
		case 'ppc64':
			return $gren_lang$node$Node$PPC64;
		case 's390':
			return $gren_lang$node$Node$S390;
		case 's390x':
			return $gren_lang$node$Node$S390x;
		case 'x64':
			return $gren_lang$node$Node$X64;
		default:
			return $gren_lang$node$Node$UnknownArchitecture(arch);
	}
};
var $gren_lang$core$Task$succeed = _Scheduler_succeed;
var $gren_lang$core$Task$map$ = function(func, taskA) {
	return A2($gren_lang$core$Task$andThen, function(a) {
			return $gren_lang$core$Task$succeed(func(a));
		}, taskA);
};
var $gren_lang$core$Task$map = F2($gren_lang$core$Task$map$);
var $gren_lang$node$Node$Aix = { $: 'Aix' };
var $gren_lang$node$Node$Darwin = { $: 'Darwin' };
var $gren_lang$node$Node$FreeBSD = { $: 'FreeBSD' };
var $gren_lang$node$Node$Linux = { $: 'Linux' };
var $gren_lang$node$Node$OpenBSD = { $: 'OpenBSD' };
var $gren_lang$node$Node$SunOS = { $: 'SunOS' };
var $gren_lang$node$Node$UnknownPlatform = function (a) {
	return { $: 'UnknownPlatform', a: a };
};
var $gren_lang$node$Node$Win32 = { $: 'Win32' };
var $gren_lang$node$Node$platformFromString = function(platform) {
	var _v0 = $gren_lang$core$String$toLower(platform);
	switch (_v0) {
		case 'win32':
			return $gren_lang$node$Node$Win32;
		case 'darwin':
			return $gren_lang$node$Node$Darwin;
		case 'linux':
			return $gren_lang$node$Node$Linux;
		case 'freebsd':
			return $gren_lang$node$Node$FreeBSD;
		case 'openbsd':
			return $gren_lang$node$Node$OpenBSD;
		case 'sunos':
			return $gren_lang$node$Node$SunOS;
		case 'aix':
			return $gren_lang$node$Node$Aix;
		default:
			return $gren_lang$node$Node$UnknownPlatform(platform);
	}
};
var $gren_lang$node$Node$initializeEnvironment = $gren_lang$core$Task$map$(function(raw) {
		return { applicationPath: raw.applicationPath, args: raw.args, cpuArchitecture: $gren_lang$node$Node$archFromString(raw.arch), platform: $gren_lang$node$Node$platformFromString(raw.platform), stderr: $gren_lang$node$Internal$Stream$Stream$(1, raw.stderr), stdin: $gren_lang$node$Internal$Stream$Stream$(2, raw.stdin), stdout: $gren_lang$node$Internal$Stream$Stream$(0, raw.stdout) };
	}, _Node_init);
var $gren_lang$core$Task$Perform = function (a) {
	return { $: 'Perform', a: a };
};
var $gren_lang$core$Task$init = $gren_lang$core$Task$succeed({  });
var $gren_lang$core$Array$map = _Array_map;
var $gren_lang$core$Array$foldr = _Array_foldr;
var $gren_lang$core$Task$map2$ = function(func, taskA, taskB) {
	return A2($gren_lang$core$Task$andThen, function(a) {
			return A2($gren_lang$core$Task$andThen, function(b) {
					return $gren_lang$core$Task$succeed(A2(func, a, b));
				}, taskB);
		}, taskA);
};
var $gren_lang$core$Task$map2 = F3($gren_lang$core$Task$map2$);
var $gren_lang$core$Array$prepend = _Array_append;
var $gren_lang$core$Array$pushFirst$ = function(value, array) {
	return A2($gren_lang$core$Array$prepend, [ value ], array);
};
var $gren_lang$core$Array$pushFirst = F2($gren_lang$core$Array$pushFirst$);
var $gren_lang$core$Task$sequence = function(tasks) {
	return A3($gren_lang$core$Array$foldr, $gren_lang$core$Task$map2($gren_lang$core$Array$pushFirst), $gren_lang$core$Task$succeed([  ]), tasks);
};
var $gren_lang$core$Platform$sendToApp = _Platform_sendToApp;
var $gren_lang$core$Task$spawnCmd$ = function(router, cmd) {
	if (cmd.$ === 'Perform') {
		var task = cmd.a;
		return _Scheduler_spawn(A2($gren_lang$core$Task$andThen, $gren_lang$core$Platform$sendToApp(router), task));
	} else {
		var task = cmd.a;
		return _Scheduler_spawn(task);
	}
};
var $gren_lang$core$Task$spawnCmd = F2($gren_lang$core$Task$spawnCmd$);
var $gren_lang$core$Task$onEffects$ = function(router, commands, state) {
	return $gren_lang$core$Task$map$(function(_v0) {
			return {  };
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, $gren_lang$core$Task$spawnCmd(router), commands)));
};
var $gren_lang$core$Task$onEffects = F3($gren_lang$core$Task$onEffects$);
var $gren_lang$core$Task$onSelfMsg$ = function(_v0, _v1, _v2) {
	return $gren_lang$core$Task$succeed({  });
};
var $gren_lang$core$Task$onSelfMsg = F3($gren_lang$core$Task$onSelfMsg$);
var $gren_lang$core$Task$Execute = function (a) {
	return { $: 'Execute', a: a };
};
var $gren_lang$core$Task$cmdMap$ = function(tagger, cmd) {
	if (cmd.$ === 'Perform') {
		var task = cmd.a;
		return $gren_lang$core$Task$Perform($gren_lang$core$Task$map$(tagger, task));
	} else {
		var task = cmd.a;
		return $gren_lang$core$Task$Execute(task);
	}
};
var $gren_lang$core$Task$cmdMap = F2($gren_lang$core$Task$cmdMap$);
_Platform_effectManagers['Task'] = _Platform_createManager($gren_lang$core$Task$init, $gren_lang$core$Task$onEffects, $gren_lang$core$Task$onSelfMsg, $gren_lang$core$Task$cmdMap);
var $gren_lang$core$Task$command = _Platform_leaf('Task');
var $gren_lang$core$Task$perform$ = function(toMessage, task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Perform($gren_lang$core$Task$map$(toMessage, task)));
};
var $gren_lang$core$Task$perform = F2($gren_lang$core$Task$perform$);
var $gren_lang$node$Node$unwrap = function(_v0) {
	var task = _v0.a;
	return task;
};
var $gren_lang$node$Node$init$ = function(initTask, _v0) {
	return { command: $gren_lang$core$Task$perform$($gren_lang$node$Node$InitDone, A2($gren_lang$core$Task$andThen, function(env) {
				return $gren_lang$node$Node$unwrap(initTask(env));
			}, $gren_lang$node$Node$initializeEnvironment)), model: $gren_lang$node$Node$Uninitialized };
};
var $gren_lang$node$Node$init = F2($gren_lang$node$Node$init$);
var $gren_lang$node$Node$MsgReceived = function (a) {
	return { $: 'MsgReceived', a: a };
};
var $gren_lang$core$Platform$Sub$map = _Platform_map;
var $gren_lang$core$Platform$Sub$batch = _Platform_batch;
var $gren_lang$core$Platform$Sub$none = $gren_lang$core$Platform$Sub$batch([  ]);
var $gren_lang$node$Node$subscriptions$ = function(appSubs, model) {
	if (model.$ === 'Uninitialized') {
		return $gren_lang$core$Platform$Sub$none;
	} else {
		var appModel = model.a;
		return A2($gren_lang$core$Platform$Sub$map, $gren_lang$node$Node$MsgReceived, appSubs(appModel));
	}
};
var $gren_lang$node$Node$subscriptions = F2($gren_lang$node$Node$subscriptions$);
var $gren_lang$node$Node$Initialized = function (a) {
	return { $: 'Initialized', a: a };
};
var $gren_lang$core$Platform$Cmd$map = _Platform_map;
var $gren_lang$core$Platform$Cmd$batch = _Platform_batch;
var $gren_lang$core$Platform$Cmd$none = $gren_lang$core$Platform$Cmd$batch([  ]);
var $gren_lang$node$Node$update$ = function(appUpdate, msg, model) {
	if (model.$ === 'Uninitialized') {
		if (msg.$ === 'InitDone') {
			var initResult = msg.a;
			return { command: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, initResult.command), model: $gren_lang$node$Node$Initialized(initResult.model) };
		} else {
			return { command: $gren_lang$core$Platform$Cmd$none, model: model };
		}
	} else {
		var appModel = model.a;
		if (msg.$ === 'InitDone') {
			return { command: $gren_lang$core$Platform$Cmd$none, model: model };
		} else {
			var appMsg = msg.a;
			var updateResult = A2(appUpdate, appMsg, appModel);
			return { command: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, updateResult.command), model: $gren_lang$node$Node$Initialized(updateResult.model) };
		}
	}
};
var $gren_lang$node$Node$update = F3($gren_lang$node$Node$update$);
var $gren_lang$core$Platform$worker = _Platform_worker;
var $gren_lang$node$Node$defineProgram = function(config) {
	return $gren_lang$core$Platform$worker({ init: $gren_lang$node$Node$init(config.init), subscriptions: $gren_lang$node$Node$subscriptions(config.subscriptions), update: $gren_lang$node$Node$update(config.update) });
};
var $gren_lang$core$Basics$identity = function(x) {
	return x;
};
var $gren_lang$node$Internal$Init$Task = function (a) {
	return { $: 'Task', a: a };
};
var $gren_lang$core$Basics$composeL$ = function(g, f) {
	return function(x) {
		return g(f(x));
	};
};
var $gren_lang$core$Basics$composeL = F2($gren_lang$core$Basics$composeL$);
var $gren_lang$node$Init$unwrap = function(_v0) {
	var task = _v0.a;
	return task;
};
var $gren_lang$node$Init$await$ = function(_v0, fn) {
	var task = _v0.a;
	return $gren_lang$node$Internal$Init$Task(A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$node$Init$unwrap, fn), task));
};
var $gren_lang$node$Init$await = F2($gren_lang$node$Init$await$);
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, n, $gren_lang$core$Array$length(array), array);
};
var $gren_lang$core$Array$dropFirst = F2($gren_lang$core$Array$dropFirst$);
var $gren_lang$node$ChildProcess$Permission = { $: 'Permission' };
var $gren_lang$node$ChildProcess$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed($gren_lang$node$ChildProcess$Permission));
var $gren_lang$node$FileSystem$Permission = { $: 'Permission' };
var $gren_lang$node$FileSystem$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed($gren_lang$node$FileSystem$Permission));
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$core$Array$findFirst = _Array_findFirst;
var $gren_lang$core$Array$member$ = function(value, array) {
	var _v0 = A2($gren_lang$core$Array$findFirst, function(v) {
			return _Utils_eq(v, value);
		}, array);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Array$member = F2($gren_lang$core$Array$member$);
var $joeybright$gren_args$Args$ParsingArgs = { $: 'ParsingArgs' };
var $joeybright$gren_args$Args$ParsingOptions = function (a) {
	return { $: 'ParsingOptions', a: a };
};
var $gren_lang$core$Dict$get$ = function(targetKey, dict) {
	get:
	while (true) {
		if (dict.$ === 'RBEmpty_gren_builtin') {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var key = dict.b;
			var value = dict.c;
			var left = dict.d;
			var right = dict.e;
			var _v1 = A2($gren_lang$core$Basics$compare, targetKey, key);
			switch (_v1.$) {
				case 'LT':
					var $temp$targetKey = targetKey,
					$temp$dict = left;
					targetKey = $temp$targetKey;
					dict = $temp$dict;
					continue get;
				case 'EQ':
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
};
var $gren_lang$core$Dict$get = F2($gren_lang$core$Dict$get$);
var $gren_lang$core$Maybe$map$ = function(f, maybe) {
	if (maybe.$ === 'Just') {
		var value = maybe.a;
		return $gren_lang$core$Maybe$Just(f(value));
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$map = F2($gren_lang$core$Maybe$map$);
var $joeybright$gren_args$Args$LongOption = { $: 'LongOption' };
var $joeybright$gren_args$Args$Option$ = function (a, b, c) {
	return { $: 'Option', a: a, b: b, c: c };
};
var $joeybright$gren_args$Args$Option = F3($joeybright$gren_args$Args$Option$);
var $joeybright$gren_args$Args$ShortOption = { $: 'ShortOption' };
var $joeybright$gren_args$Args$String = function (a) {
	return { $: 'String', a: a };
};
var $gren_lang$parser$Parser$Advanced$Bad$ = function (a, b) {
	return { $: 'Bad', a: a, b: b };
};
var $gren_lang$parser$Parser$Advanced$Bad = F2($gren_lang$parser$Parser$Advanced$Bad$);
var $gren_lang$parser$Parser$Advanced$Good$ = function (a, b, c) {
	return { $: 'Good', a: a, b: b, c: c };
};
var $gren_lang$parser$Parser$Advanced$Good = F3($gren_lang$parser$Parser$Advanced$Good$);
var $gren_lang$parser$Parser$Advanced$Parser = function (a) {
	return { $: 'Parser', a: a };
};
var $gren_lang$parser$Parser$Advanced$andThen$ = function(callback, _v0) {
	var parseA = _v0.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 'Bad') {
				var p = _v1.a;
				var x = _v1.b;
				return $gren_lang$parser$Parser$Advanced$Bad$(p, x);
			} else {
				var p1 = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				var _v2 = callback(a);
				var parseB = _v2.a;
				var _v3 = parseB(s1);
				if (_v3.$ === 'Bad') {
					var p2 = _v3.a;
					var x = _v3.b;
					return $gren_lang$parser$Parser$Advanced$Bad$(p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return $gren_lang$parser$Parser$Advanced$Good$(p1 || p2, b, s2);
				}
			}
		});
};
var $gren_lang$parser$Parser$Advanced$andThen = F2($gren_lang$parser$Parser$Advanced$andThen$);
var $gren_lang$parser$Parser$andThen = $gren_lang$parser$Parser$Advanced$andThen;
var $gren_lang$parser$Parser$UnexpectedChar = { $: 'UnexpectedChar' };
var $gren_lang$parser$Parser$Advanced$AddRight$ = function (a, b) {
	return { $: 'AddRight', a: a, b: b };
};
var $gren_lang$parser$Parser$Advanced$AddRight = F2($gren_lang$parser$Parser$Advanced$AddRight$);
var $gren_lang$parser$Parser$Advanced$Empty = { $: 'Empty' };
var $gren_lang$parser$Parser$Advanced$fromState$ = function(s, x) {
	return $gren_lang$parser$Parser$Advanced$AddRight$($gren_lang$parser$Parser$Advanced$Empty, { col: s.col, contextStack: s.context, problem: x, row: s.row });
};
var $gren_lang$parser$Parser$Advanced$fromState = F2($gren_lang$parser$Parser$Advanced$fromState$);




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
		newOffset: isGood ? offset : -1, 
		newRow: row, 
		newCol: col 
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
		offset: offset, 
		total: total 
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
		offset: offset, 
		total: total 
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
		newOffset: newOffset, 
		newRow: row, 
		newCol: col 
	};
});
var $gren_lang$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $gren_lang$core$Basics$negate = function(n) {
	return -n;
};
var $gren_lang$parser$Parser$Advanced$chompIf$ = function(isGood, expecting) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, s.offset, s.src);
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromState$(s, expecting)) : (_Utils_eq(newOffset, -2) ? $gren_lang$parser$Parser$Advanced$Good$(true, {  }, { col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src }) : $gren_lang$parser$Parser$Advanced$Good$(true, {  }, { col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src }));
		});
};
var $gren_lang$parser$Parser$Advanced$chompIf = F2($gren_lang$parser$Parser$Advanced$chompIf$);
var $gren_lang$parser$Parser$chompIf = function(isGood) {
	return $gren_lang$parser$Parser$Advanced$chompIf$(isGood, $gren_lang$parser$Parser$UnexpectedChar);
};
var $gren_lang$core$String$length = _String_length;
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$parser$Parser$Advanced$chompUntilEndOr = function(str) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v0 = A5(_Parser_findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v0.newOffset;
			var newRow = _v0.newRow;
			var newCol = _v0.newCol;
			var adjustedOffset = (newOffset < 0) ? $gren_lang$core$String$length(s.src) : newOffset;
			return $gren_lang$parser$Parser$Advanced$Good$(_Utils_cmp(s.offset, adjustedOffset) < 0, {  }, { col: newCol, context: s.context, indent: s.indent, offset: adjustedOffset, row: newRow, src: s.src });
		});
};
var $gren_lang$parser$Parser$chompUntilEndOr = $gren_lang$parser$Parser$Advanced$chompUntilEndOr;
var $gren_lang$parser$Parser$Advanced$chompWhileHelp$ = function(isGood, offset, row, col, s0) {
	chompWhileHelp:
	while (true) {
		var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
		if (_Utils_eq(newOffset, -1)) {
			return $gren_lang$parser$Parser$Advanced$Good$(_Utils_cmp(s0.offset, offset) < 0, {  }, { col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src });
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
};
var $gren_lang$parser$Parser$Advanced$chompWhileHelp = F5($gren_lang$parser$Parser$Advanced$chompWhileHelp$);
var $gren_lang$parser$Parser$Advanced$chompWhile = function(isGood) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			return $gren_lang$parser$Parser$Advanced$chompWhileHelp$(isGood, s.offset, s.row, s.col, s);
		});
};
var $gren_lang$parser$Parser$chompWhile = $gren_lang$parser$Parser$Advanced$chompWhile;
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$parser$Parser$Advanced$mapChompedString$ = function(func, _v0) {
	var parse = _v0.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var p = _v1.a;
				var x = _v1.b;
				return $gren_lang$parser$Parser$Advanced$Bad$(p, x);
			} else {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return $gren_lang$parser$Parser$Advanced$Good$(p, A2(func, A3($gren_lang$core$String$slice, s0.offset, s1.offset, s0.src), a), s1);
			}
		});
};
var $gren_lang$parser$Parser$Advanced$mapChompedString = F2($gren_lang$parser$Parser$Advanced$mapChompedString$);
var $gren_lang$parser$Parser$Advanced$getChompedString = function(parser) {
	return $gren_lang$parser$Parser$Advanced$mapChompedString$(F2(function(str, _v0) {
				return str;
			}), parser);
};
var $gren_lang$parser$Parser$getChompedString = $gren_lang$parser$Parser$Advanced$getChompedString;
var $gren_lang$parser$Parser$Advanced$map2$ = function(func, _v0, _v1) {
	var parseA = _v0.a;
	var parseB = _v1.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v2 = parseA(s0);
			if (_v2.$ === 'Bad') {
				var p = _v2.a;
				var x = _v2.b;
				return $gren_lang$parser$Parser$Advanced$Bad$(p, x);
			} else {
				var p1 = _v2.a;
				var a = _v2.b;
				var s1 = _v2.c;
				var _v3 = parseB(s1);
				if (_v3.$ === 'Bad') {
					var p2 = _v3.a;
					var x = _v3.b;
					return $gren_lang$parser$Parser$Advanced$Bad$(p1 || p2, x);
				} else {
					var p2 = _v3.a;
					var b = _v3.b;
					var s2 = _v3.c;
					return $gren_lang$parser$Parser$Advanced$Good$(p1 || p2, A2(func, a, b), s2);
				}
			}
		});
};
var $gren_lang$parser$Parser$Advanced$map2 = F3($gren_lang$parser$Parser$Advanced$map2$);
var $gren_lang$parser$Parser$Advanced$ignorer$ = function(keepParser, ignoreParser) {
	return $gren_lang$parser$Parser$Advanced$map2$(F2(function(val, _v0) {
				return val;
			}), keepParser, ignoreParser);
};
var $gren_lang$parser$Parser$Advanced$ignorer = F2($gren_lang$parser$Parser$Advanced$ignorer$);
var $gren_lang$parser$Parser$ignorer = $gren_lang$parser$Parser$Advanced$ignorer;
var $gren_lang$parser$Parser$Advanced$keeper$ = function(parseFunc, parseArg) {
	return $gren_lang$parser$Parser$Advanced$map2$($gren_lang$core$Basics$apL, parseFunc, parseArg);
};
var $gren_lang$parser$Parser$Advanced$keeper = F2($gren_lang$parser$Parser$Advanced$keeper$);
var $gren_lang$parser$Parser$keeper = $gren_lang$parser$Parser$Advanced$keeper;
var $gren_lang$parser$Parser$Advanced$Append$ = function (a, b) {
	return { $: 'Append', a: a, b: b };
};
var $gren_lang$parser$Parser$Advanced$Append = F2($gren_lang$parser$Parser$Advanced$Append$);
var $gren_lang$core$Array$get = _Array_get;
var $gren_lang$core$Array$first = function(array) {
	return A2($gren_lang$core$Array$get, 0, array);
};
var $gren_lang$core$Array$popFirst = function(array) {
	var _v0 = $gren_lang$core$Array$first(array);
	if (_v0.$ === 'Just') {
		var value = _v0.a;
		return $gren_lang$core$Maybe$Just({ first: value, rest: $gren_lang$core$Array$dropFirst$(1, array) });
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$parser$Parser$Advanced$oneOfHelp$ = function(s0, bag, parsers) {
	oneOfHelp:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(parsers);
		if (_v0.$ === 'Nothing') {
			return $gren_lang$parser$Parser$Advanced$Bad$(false, bag);
		} else {
			var _v1 = _v0.a;
			var parse = _v1.first.a;
			var remainingParsers = _v1.rest;
			var _v2 = parse(s0);
			if (_v2.$ === 'Good') {
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
					$temp$bag = $gren_lang$parser$Parser$Advanced$Append$(bag, x),
					$temp$parsers = remainingParsers;
					s0 = $temp$s0;
					bag = $temp$bag;
					parsers = $temp$parsers;
					continue oneOfHelp;
				}
			}
		}
	}
};
var $gren_lang$parser$Parser$Advanced$oneOfHelp = F3($gren_lang$parser$Parser$Advanced$oneOfHelp$);
var $gren_lang$parser$Parser$Advanced$oneOf = function(parsers) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			return $gren_lang$parser$Parser$Advanced$oneOfHelp$(s, $gren_lang$parser$Parser$Advanced$Empty, parsers);
		});
};
var $gren_lang$parser$Parser$oneOf = $gren_lang$parser$Parser$Advanced$oneOf;
var $gren_lang$parser$Parser$Advanced$succeed = function(a) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			return $gren_lang$parser$Parser$Advanced$Good$(false, a, s);
		});
};
var $gren_lang$parser$Parser$succeed = $gren_lang$parser$Parser$Advanced$succeed;
var $joeybright$gren_args$Args$parseArg = function () {
	var parseArgHelper = function(func) {
		return A2($gren_lang$parser$Parser$andThen, function(string) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(func(string)), $gren_lang$parser$Parser$chompIf(function(c) {
									return _Utils_eq(c, _Utils_chr('='));
								})), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompWhile(function(_v2) {
									return true;
								}))), $gren_lang$parser$Parser$succeed(A2(func, string, '')) ]);
			}, $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr('=')));
	};
	return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v0) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v1) {
							return parseArgHelper(F2(function(k, v) {
										return $joeybright$gren_args$Args$Option$($joeybright$gren_args$Args$LongOption, k, v);
									}));
						}, $gren_lang$parser$Parser$chompIf(function(c) {
								return _Utils_eq(c, _Utils_chr('-'));
							})), parseArgHelper(F2(function(k, v) {
								return $joeybright$gren_args$Args$Option$($joeybright$gren_args$Args$ShortOption, k, v);
							})) ]);
			}, $gren_lang$parser$Parser$chompIf(function(c) {
					return _Utils_eq(c, _Utils_chr('-'));
				})), A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed($joeybright$gren_args$Args$String), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr(' '))) ]);
}();
var $gren_lang$parser$Parser$problemToDeadEnd = function(p) {
	return { col: p.col, problem: p.problem, row: p.row };
};
var $gren_lang$parser$Parser$Advanced$bagToArray$ = function(bag, array) {
	bagToArray:
	while (true) {
		switch (bag.$) {
			case 'Empty':
				return array;
			case 'AddRight':
				var bag1 = bag.a;
				var x = bag.b;
				var $temp$bag = bag1,
				$temp$array = $gren_lang$core$Array$pushFirst$(x, array);
				bag = $temp$bag;
				array = $temp$array;
				continue bagToArray;
			default:
				var bag1 = bag.a;
				var bag2 = bag.b;
				var $temp$bag = bag1,
				$temp$array = $gren_lang$parser$Parser$Advanced$bagToArray$(bag2, array);
				bag = $temp$bag;
				array = $temp$array;
				continue bagToArray;
		}
	}
};
var $gren_lang$parser$Parser$Advanced$bagToArray = F2($gren_lang$parser$Parser$Advanced$bagToArray$);
var $gren_lang$parser$Parser$Advanced$run$ = function(_v0, src) {
	var parse = _v0.a;
	var _v1 = parse({ col: 1, context: [  ], indent: 1, offset: 0, row: 1, src: src });
	if (_v1.$ === 'Good') {
		var value = _v1.b;
		return $gren_lang$core$Result$Ok(value);
	} else {
		var bag = _v1.b;
		return $gren_lang$core$Result$Err($gren_lang$parser$Parser$Advanced$bagToArray$(bag, [  ]));
	}
};
var $gren_lang$parser$Parser$Advanced$run = F2($gren_lang$parser$Parser$Advanced$run$);
var $gren_lang$parser$Parser$run$ = function(parser, source) {
	var _v0 = $gren_lang$parser$Parser$Advanced$run$(parser, source);
	if (_v0.$ === 'Ok') {
		var a = _v0.a;
		return $gren_lang$core$Result$Ok(a);
	} else {
		var problems = _v0.a;
		return $gren_lang$core$Result$Err(A2($gren_lang$core$Array$map, $gren_lang$parser$Parser$problemToDeadEnd, problems));
	}
};
var $gren_lang$parser$Parser$run = F2($gren_lang$parser$Parser$run$);
var $gren_lang$core$Dict$getMin = function(dict) {
	getMin:
	while (true) {
		if ((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) {
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
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) && (dict.e.$ === 'RBNode_gren_builtin')) {
		if ((dict.e.d.$ === 'RBNode_gren_builtin') && (dict.e.d.a.$ === 'Red')) {
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
			return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rlK, rlV, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), rlL), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, rK, rV, rlR, rRight));
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
			if (clr.$ === 'Black') {
				return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$moveRedRight = function(dict) {
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) && (dict.e.$ === 'RBNode_gren_builtin')) {
		if ((dict.d.d.$ === 'RBNode_gren_builtin') && (dict.d.d.a.$ === 'Red')) {
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
			return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, llK, llV, llLeft, llRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, lRight, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight)));
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
			if (clr.$ === 'Black') {
				return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			} else {
				return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
			}
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT$ = function(targetKey, dict, color, key, value, left, right) {
	if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Red')) {
		var _v1 = left.a;
		var lK = left.b;
		var lV = left.c;
		var lLeft = left.d;
		var lRight = left.e;
		return $gren_lang$core$Dict$RBNode_gren_builtin$(color, lK, lV, lLeft, $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Red, key, value, lRight, right));
	} else {
		_v2$2:
		while (true) {
			if ((right.$ === 'RBNode_gren_builtin') && (right.a.$ === 'Black')) {
				if (right.d.$ === 'RBNode_gren_builtin') {
					if (right.d.a.$ === 'Black') {
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
};
var $gren_lang$core$Dict$removeHelpPrepEQGT = F7($gren_lang$core$Dict$removeHelpPrepEQGT$);
var $gren_lang$core$Dict$removeMin = function(dict) {
	if ((dict.$ === 'RBNode_gren_builtin') && (dict.d.$ === 'RBNode_gren_builtin')) {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var lColor = left.a;
		var lLeft = left.d;
		var right = dict.e;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.$ === 'Red')) {
				var _v3 = lLeft.a;
				return $gren_lang$core$Dict$RBNode_gren_builtin$(color, key, value, $gren_lang$core$Dict$removeMin(left), right);
			} else {
				var _v4 = $gren_lang$core$Dict$moveRedLeft(dict);
				if (_v4.$ === 'RBNode_gren_builtin') {
					var nColor = _v4.a;
					var nKey = _v4.b;
					var nValue = _v4.c;
					var nLeft = _v4.d;
					var nRight = _v4.e;
					return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$removeMin(nLeft), nRight);
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			}
		} else {
			return $gren_lang$core$Dict$RBNode_gren_builtin$(color, key, value, $gren_lang$core$Dict$removeMin(left), right);
		}
	} else {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	}
};
var $gren_lang$core$Dict$removeHelp$ = function(targetKey, dict) {
	if (dict.$ === 'RBEmpty_gren_builtin') {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	} else {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var right = dict.e;
		if (_Utils_cmp(targetKey, key) < 0) {
			if ((left.$ === 'RBNode_gren_builtin') && (left.a.$ === 'Black')) {
				var _v4 = left.a;
				var lLeft = left.d;
				if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.$ === 'Red')) {
					var _v6 = lLeft.a;
					return $gren_lang$core$Dict$RBNode_gren_builtin$(color, key, value, $gren_lang$core$Dict$removeHelp$(targetKey, left), right);
				} else {
					var _v7 = $gren_lang$core$Dict$moveRedLeft(dict);
					if (_v7.$ === 'RBNode_gren_builtin') {
						var nColor = _v7.a;
						var nKey = _v7.b;
						var nValue = _v7.c;
						var nLeft = _v7.d;
						var nRight = _v7.e;
						return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$removeHelp$(targetKey, nLeft), nRight);
					} else {
						return $gren_lang$core$Dict$RBEmpty_gren_builtin;
					}
				}
			} else {
				return $gren_lang$core$Dict$RBNode_gren_builtin$(color, key, value, $gren_lang$core$Dict$removeHelp$(targetKey, left), right);
			}
		} else {
			return $gren_lang$core$Dict$removeHelpEQGT$(targetKey, $gren_lang$core$Dict$removeHelpPrepEQGT$(targetKey, dict, color, key, value, left, right));
		}
	}
};
var $gren_lang$core$Dict$removeHelp = F2($gren_lang$core$Dict$removeHelp$);
var $gren_lang$core$Dict$removeHelpEQGT$ = function(targetKey, dict) {
	if (dict.$ === 'RBNode_gren_builtin') {
		var color = dict.a;
		var key = dict.b;
		var value = dict.c;
		var left = dict.d;
		var right = dict.e;
		if (_Utils_eq(targetKey, key)) {
			var _v1 = $gren_lang$core$Dict$getMin(right);
			if (_v1.$ === 'RBNode_gren_builtin') {
				var minKey = _v1.b;
				var minValue = _v1.c;
				return $gren_lang$core$Dict$balance$(color, minKey, minValue, left, $gren_lang$core$Dict$removeMin(right));
			} else {
				return $gren_lang$core$Dict$RBEmpty_gren_builtin;
			}
		} else {
			return $gren_lang$core$Dict$balance$(color, key, value, left, $gren_lang$core$Dict$removeHelp$(targetKey, right));
		}
	} else {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	}
};
var $gren_lang$core$Dict$removeHelpEQGT = F2($gren_lang$core$Dict$removeHelpEQGT$);
var $gren_lang$core$Dict$remove$ = function(key, dict) {
	var _v0 = $gren_lang$core$Dict$removeHelp$(key, dict);
	if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.$ === 'Red')) {
		var _v1 = _v0.a;
		var k = _v0.b;
		var v = _v0.c;
		var l = _v0.d;
		var r = _v0.e;
		return $gren_lang$core$Dict$RBNode_gren_builtin$($gren_lang$core$Dict$Black, k, v, l, r);
	} else {
		var x = _v0;
		return x;
	}
};
var $gren_lang$core$Dict$remove = F2($gren_lang$core$Dict$remove$);
var $gren_lang$core$Dict$update$ = function(targetKey, alter, dictionary) {
	var _v0 = alter($gren_lang$core$Dict$get$(targetKey, dictionary));
	if (_v0.$ === 'Just') {
		var value = _v0.a;
		return $gren_lang$core$Dict$set$(targetKey, value, dictionary);
	} else {
		return $gren_lang$core$Dict$remove$(targetKey, dictionary);
	}
};
var $gren_lang$core$Dict$update = F3($gren_lang$core$Dict$update$);
var $gren_lang$core$Maybe$withDefault$ = function(_default, maybe) {
	if (maybe.$ === 'Just') {
		var value = maybe.a;
		return value;
	} else {
		return _default;
	}
};
var $gren_lang$core$Maybe$withDefault = F2($gren_lang$core$Maybe$withDefault$);
var $joeybright$gren_args$Args$parseHelper$ = function(parseState, acc, passedArray) {
	parseHelper:
	while (true) {
		var process = F2(function(parseResult, item) {
				var _v3 = { state: parseState, value: $gren_lang$parser$Parser$run$($joeybright$gren_args$Args$parseArg, item) };
				_v3$0:
				while (true) {
					if (_v3.value.$ === 'Ok') {
						if (_v3.value.a.$ === 'Option') {
							if (_v3.state.$ === 'ParsingArgs') {
								if (_v3.value.a.c === '') {
									var _v4 = _v3.state;
									var _v5 = _v3.value.a;
									var optionType = _v5.a;
									var key = _v5.b;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [  ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var _v6 = _v3.state;
									var _v7 = _v3.value.a;
									var optionType = _v7.a;
									var key = _v7.b;
									var value = _v7.c;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [ value ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								}
							} else {
								if (_v3.value.a.c === '') {
									var _v9 = _v3.value.a;
									var optionType = _v9.a;
									var key = _v9.b;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [  ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var latestOption = _v3.state.a;
									var _v10 = _v3.value.a;
									var optionType = _v10.a;
									var key = _v10.b;
									var value = _v10.c;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Maybe$withDefault$($gren_lang$core$Dict$set$(key, { optionType: optionType, values: [ value ] }, parseResult.options), $gren_lang$core$Maybe$map$(function(_v11) {
													return $gren_lang$core$Dict$update$(key, $gren_lang$core$Maybe$map(function(val) {
																return { optionType: val.optionType, values: A2($gren_lang$core$Array$pushLast, value, val.values) };
															}), parseResult.options);
												}, $gren_lang$core$Dict$get$(key, parseResult.options))) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								}
							}
						} else {
							if (_v3.state.$ === 'ParsingArgs') {
								if (_v3.value.a.a === '') {
									break _v3$0;
								} else {
									var _v8 = _v3.state;
									var arg = _v3.value.a.a;
									return { result: _Utils_update(parseResult, { args: A2($gren_lang$core$Array$pushLast, arg, parseResult.args) }), state: $joeybright$gren_args$Args$ParsingArgs };
								}
							} else {
								if (_v3.value.a.a === '') {
									break _v3$0;
								} else {
									var latestOption = _v3.state.a;
									var value = _v3.value.a.a;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$update$(latestOption, $gren_lang$core$Maybe$map(function(val) {
													return { optionType: val.optionType, values: A2($gren_lang$core$Array$pushLast, value, val.values) };
												}), parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(latestOption) };
								}
							}
						}
					} else {
						var state = _v3.state;
						return { result: parseResult, state: state };
					}
				}
				var state = _v3.state;
				return { result: parseResult, state: state };
			});
		var _v0 = $gren_lang$core$Array$popFirst(passedArray);
		if (_v0.$ === 'Just') {
			var _v1 = _v0.a;
			var first = _v1.first;
			var rest = _v1.rest;
			var _v2 = A2(process, acc, first);
			var state = _v2.state;
			var result = _v2.result;
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
};
var $joeybright$gren_args$Args$parseHelper = F3($joeybright$gren_args$Args$parseHelper$);
var $joeybright$gren_args$Args$parse = A2($joeybright$gren_args$Args$parseHelper, $joeybright$gren_args$Args$ParsingArgs, { args: [  ], options: $gren_lang$core$Dict$empty });
var $author$project$Main$GenProject_Confirmation = function (a) {
	return { $: 'GenProject_Confirmation', a: a };
};
var $gren_lang$core$Task$execute = function(task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Execute($gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, task)));
};
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$core$Json$Encode$object = function(pairs) {
	return _Json_wrap(A3($gren_lang$core$Array$foldl, F2(function(_v0, obj) {
					var key = _v0.key;
					var value = _v0.value;
					return A3(_Json_addField, key, value, obj);
				}), _Json_emptyObject({  }), pairs));
};
var $author$project$Main$getVersion = _Platform_outgoingPort('getVersion', function($) {
		return $gren_lang$core$Json$Encode$object([  ]);
	});
var $author$project$Main$help = 'Usage:\n    \n    prettynice init\n        Create a new prettynice project in the current directory.\n\n    prettynice build\n        Compile the web app into javascript under dist/\n\n    prettynice build --optimize\n        Compile the web app with optimizations enabled.\n\n    prettynice [version|-v|--version]\n        Print the version number of this prettynice cli.\n\n    prettynice [--help|-h]\n        Show this help text.';
var $gren_lang$core$Dict$member$ = function(key, dict) {
	var _v0 = $gren_lang$core$Dict$get$(key, dict);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Dict$member = F2($gren_lang$core$Dict$member$);
var $author$project$Main$Cleaned = function (a) {
	return { $: 'Cleaned', a: a };
};
var $gren_lang$core$Task$onError = _Scheduler_onError;
var $gren_lang$core$Task$attempt$ = function(resultToMessage, task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Perform(A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Err), A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Ok), task))));
};
var $gren_lang$core$Task$attempt = F2($gren_lang$core$Task$attempt$);
var $gren_lang$node$FileSystem$Path$fromPosixString = _FilePath_fromPosix;


var fs = require("node:fs");
var bufferNs = require("node:buffer");
var process = require("node:process");
var path = require("node:path");
var os = require("node:os");

var _FileSystem_coerce = function (fh) {
  return fh;
};

var _FileSystem_open = F2(function (access, path) {
  return _Scheduler_binding(function (callback) {
    fs.open(_FilePath_toString(path), access, function (err, fd) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_constructError = function (err) {
  return A2($gren_lang$node$FileSystem$Error, err.code || "", err.message || "");
};

var _FileSystem_close = function (fh) {
  return _Scheduler_binding(function (callback) {
    fs.close(fh, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed({}));
      }
    });
  });
};

var _FileSystem_readFromOffset = F2(function (fh, options) {
  var requestedLength =
    options.length < 0 || options.length > bufferNs.constants.MAX_LENGTH
      ? bufferNs.constants.MAX_LENGTH
      : options.length;

  var fileOffset = options.offset < 0 ? 0 : options.offset;

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
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
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
      options.offset,
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
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
        return;
      }

      if (bytesWritten === length) {
        callback(_Scheduler_succeed(fd));
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
    force: options.ignoreErrors,
    recursive: options.recursive,
  };

  return _Scheduler_binding(function (callback) {
    fs.rm(_FilePath_toString(path), rmOpts, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_makeDirectory = F2(function (options, path) {
  return _Scheduler_binding(function (callback) {
    fs.mkdir(
      _FilePath_toString(path),
      { recursive: options.recursive },
      function (err) {
        if (err != null) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      }
    );
  });
});

// List of dir contents as DirEntry values holding filename string
var _FileSystem_listDirectory = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.readdir(
      _FilePath_toString(path),
      { withFileTypes: true },
      function (err, content) {
        if (err != null) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(
            _Scheduler_succeed(
              content.map((f) => ({
                path: _FilePath_fromString(f.name),
                entityType: _FileSystem_toEntityType(f),
              }))
            )
          );
        }
      }
    );
  });
};

var _FileSystem_toEntityType = function (dirEnt) {
  if (dirEnt.isFile()) {
    return $gren_lang$node$FileSystem$File;
  } else if (dirEnt.isDirectory()) {
    return $gren_lang$node$FileSystem$Directory;
  } else if (dirEnt.isFIFO()) {
    return $gren_lang$node$FileSystem$Pipe;
  } else if (dirEnt.isSocket()) {
    return $gren_lang$node$FileSystem$Socket;
  } else if (dirEnt.isSymbolicLink()) {
    return $gren_lang$node$FileSystem$Symlink;
  } else {
    return $gren_lang$node$FileSystem$Device;
  }
};

var _FileSystem_fchmod = F2(function (mode, fd) {
  return _Scheduler_binding(function (callback) {
    fs.fchmod(fd, mode, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fchown = F2(function (ids, fd) {
  return _Scheduler_binding(function (callback) {
    fs.fchown(fd, ids.userID, ids.groupID, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fdatasync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fdatasync(fd, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fsync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fsync(fd, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fstat = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fstat(fd, function (err, stats) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_ftruncate = F2(function (len, fd) {
  return _Scheduler_binding(function (callback) {
    fs.ftruncate(fd, len, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_futimes = F3(function (atime, mtime, fd) {
  return _Scheduler_binding(function (callback) {
    fs.futimes(fd, atime, mtime, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err.message)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_access = F2(function (permissions, path) {
  var mode = fs.constants.F_OK;

  if (permissions.includes($gren_lang$node$FileSystem$Read)) {
    mode = mode | fs.constants.R_OK;
  }

  if (permissions.includes($gren_lang$node$FileSystem$Write)) {
    mode = mode | fs.constants.W_OK;
  }

  if (permissions.includes($gren_lang$node$FileSystem$Execute)) {
    mode = mode | fs.constants.X_OK;
  }

  return _Scheduler_binding(function (callback) {
    fs.access(_FilePath_toString(path), mode, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_appendFile = F2(function (data, path) {
  return _Scheduler_binding(function (callback) {
    fs.appendFile(_FilePath_toString(path), data, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_chmod = F2(function (mode, path) {
  return _Scheduler_binding(function (callback) {
    fs.chmod(_FilePath_toString(path), mode, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_chown = F2(function (ids, path) {
  return _Scheduler_binding(function (callback) {
    fs.chown(
      _FilePath_toString(path),
      ids.userID,
      ids.groupID,
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      }
    );
  });
});

var _FileSystem_lchown = F2(function (ids, path) {
  return _Scheduler_binding(function (callback) {
    fs.lchown(
      _FilePath_toString(path),
      ids.userID,
      ids.groupID,
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      }
    );
  });
});

var _FileSystem_copyFile = F2(function (src, dest) {
  return _Scheduler_binding(function (callback) {
    fs.copyFile(
      _FilePath_toString(src),
      _FilePath_toString(dest),
      0,
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      }
    );
  });
});

var _FileSystem_link = F2(function (src, dest) {
  return _Scheduler_binding(function (callback) {
    fs.link(
      _FilePath_toString(src),
      _FilePath_toString(dest),
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      }
    );
  });
});

var _FileSystem_symlink = F2(function (src, dest) {
  return _Scheduler_binding(function (callback) {
    fs.symlink(
      _FilePath_toString(src),
      _FilePath_toString(dest),
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      }
    );
  });
});

var _FileSystem_unlink = function (src) {
  return _Scheduler_binding(function (callback) {
    fs.unlink(_FilePath_toString(src), function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(src));
      }
    });
  });
};

var _FileSystem_mkdtemp = function (prefix) {
  return _Scheduler_binding(function (callback) {
    fs.mkdtemp(path.join(os.tmpdir(), prefix), function (err, dir) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(_FilePath_fromString(dir)));
      }
    });
  });
};

var _FileSystem_readFile = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.readFile(_FilePath_toString(path), function (err, data) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(
          _Scheduler_succeed(
            new DataView(data.buffer, data.byteOffset, data.byteLength)
          )
        );
      }
    });
  });
};

var _FileSystem_readLink = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.readlink(_FilePath_toString(path), function (err, linkedPath) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(_FilePath_fromString(linkedPath)));
      }
    });
  });
};

var _FileSystem_rename = F2(function (oldPath, newPath) {
  return _Scheduler_binding(function (callback) {
    fs.rename(
      _FilePath_toString(oldPath),
      _FilePath_toString(newPath),
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(err)));
        } else {
          callback(_Scheduler_succeed(newPath));
        }
      }
    );
  });
});

var _FileSystem_realpath = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.realpath(_FilePath_toString(path), function (err, resolvedPath) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(_FilePath_fromString(resolvedPath)));
      }
    });
  });
};

var _FileSystem_stat = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.stat(_FilePath_toString(path), function (err, stats) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_lstat = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.lstat(_FilePath_toString(path), function (err, stats) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_statToGrenRecord = function (stats) {
  return {
    entityType: _FileSystem_toEntityType(stats),
    blockSize: stats.blksize,
    blocks: stats.blocks,
    byteSize: stats.size,
    created: $gren_lang$core$Time$millisToPosix(Math.floor(stats.birthtimeMs)),
    deviceID: stats.dev,
    groupID: stats.gid,
    lastAccessed: $gren_lang$core$Time$millisToPosix(Math.floor(stats.atimeMs)),
    lastChanged: $gren_lang$core$Time$millisToPosix(Math.floor(stats.ctimeMs)),
    lastModified: $gren_lang$core$Time$millisToPosix(Math.floor(stats.mtimeMs)),
    userID: stats.uid,
  };
};

var _FileSystem_truncate = F2(function (len, path) {
  return _Scheduler_binding(function (callback) {
    fs.truncate(_FilePath_toString(path), len, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_utimes = F3(function (atime, mtime, path) {
  return _Scheduler_binding(function (callback) {
    fs.utimes(_FilePath_toString(path), atime, mtime, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_lutimes = F3(function (atime, mtime, path) {
  return _Scheduler_binding(function (callback) {
    fs.lutimes(_FilePath_toString(path), atime, mtime, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_writeFile = F2(function (data, path) {
  return _Scheduler_binding(function (callback) {
    fs.writeFile(_FilePath_toString(path), data, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_watch = F3(function (path, isRecursive, sendToSelf) {
  return _Scheduler_binding(function (_callback) {
    var watcher = null;

    try {
      watcher = fs.watch(
        path,
        { recursive: isRecursive },
        function (eventType, filename) {
          var maybePath = filename
            ? $gren_lang$core$Maybe$Just(_FilePath_fromString(filename))
            : $gren_lang$core$Maybe$Nothing;

          if (eventType === "rename") {
            _Scheduler_rawSpawn(sendToSelf($gren_lang$node$FileSystem$Moved(maybePath)));
          } else if (eventType === "change") {
            _Scheduler_rawSpawn(sendToSelf($gren_lang$node$FileSystem$Changed(maybePath)));
          }

          // other change types are ignored
        }
      );
    } catch (e) {
      // ignore errors
    }

    return function () {
      if (watcher) {
        watcher.close();
      }
    };
  });
});
var _FileSystem_homeDir = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_FilePath_fromString(os.homedir())));
});

var _FileSystem_currentWorkingDirectory = _Scheduler_binding(function (
  callback
) {
  callback(_Scheduler_succeed(_FilePath_fromString(process.cwd())));
});

var _FileSystem_tmpDir = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_FilePath_fromString(os.tmpdir())));
});

var _FileSystem_devNull = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_FilePath_fromString(os.devNull)));
});
var $gren_lang$node$FileSystem$Changed = function (a) {
	return { $: 'Changed', a: a };
};
var $gren_lang$node$FileSystem$Device = { $: 'Device' };
var $gren_lang$node$FileSystem$Directory = { $: 'Directory' };
var $gren_lang$node$FileSystem$Error$ = function (a, b) {
	return { $: 'Error', a: a, b: b };
};
var $gren_lang$node$FileSystem$Error = F2($gren_lang$node$FileSystem$Error$);
var $gren_lang$node$FileSystem$Execute = { $: 'Execute' };
var $gren_lang$node$FileSystem$File = { $: 'File' };
var $gren_lang$node$FileSystem$Moved = function (a) {
	return { $: 'Moved', a: a };
};
var $gren_lang$node$FileSystem$Pipe = { $: 'Pipe' };
var $gren_lang$node$FileSystem$Read = { $: 'Read' };
var $gren_lang$node$FileSystem$Socket = { $: 'Socket' };
var $gren_lang$node$FileSystem$Symlink = { $: 'Symlink' };
var $gren_lang$node$FileSystem$Write = { $: 'Write' };
var $gren_lang$core$Time$Posix = function (a) {
	return { $: 'Posix', a: a };
};
var $gren_lang$core$Time$millisToPosix = $gren_lang$core$Time$Posix;
var $gren_lang$node$FileSystem$makeDirectory$ = function(_v0, options, path) {
	return A2(_FileSystem_makeDirectory, options, path);
};
var $gren_lang$node$FileSystem$makeDirectory = F3($gren_lang$node$FileSystem$makeDirectory$);
var $gren_lang$node$FileSystem$remove$ = function(_v0, options, path) {
	return A2(_FileSystem_remove, options, path);
};
var $gren_lang$node$FileSystem$remove = F3($gren_lang$node$FileSystem$remove$);
var $author$project$Main$clean = function(fsPermission) {
	var remove = function(path) {
		return $gren_lang$node$FileSystem$remove$(fsPermission, { ignoreErrors: true, recursive: true }, $gren_lang$node$FileSystem$Path$fromPosixString(path));
	};
	var create = function(path) {
		return $gren_lang$node$FileSystem$makeDirectory$(fsPermission, { recursive: true }, $gren_lang$node$FileSystem$Path$fromPosixString(path));
	};
	var recreate = function(path) {
		return A2($gren_lang$core$Task$andThen, function(_v1) {
				return create(path);
			}, remove(path));
	};
	return $gren_lang$core$Task$map$(function(_v0) {
			return {  };
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, recreate, [ './dist', 'client/.prettynice', 'server/.prettynice' ])));
};


// BYTES

var _Bytes_empty = new DataView(new ArrayBuffer(0));

function _Bytes_length(bytes) {
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

function _Bytes_fromString(str) {
  var encoder = new TextEncoder();
  var uint8s = encoder.encode(str);
  return new DataView(uint8s.buffer);
}

function _Bytes_toString(bytes) {
  var decoder = new TextDecoder("utf-8", { fatal: true });

  try {
    return $gren_lang$core$Maybe$Just(decoder.decode(bytes));
  } catch (e) {
    return $gren_lang$core$Maybe$Nothing;
  }
}

function _Bytes_join(arrayOfBytes) {
  var requiredSize = 0;
  for (var i = 0; i < arrayOfBytes.length; i++) {
    requiredSize += arrayOfBytes[i].byteLength;
  }

  var offset = 0;
  var result = new Uint8Array(requiredSize);

  for (var i = 0; i < arrayOfBytes.length; i++) {
    var currentBytes = new UInt8Array(arrayOfBytes[i].buffer);
    var currentByteLength = arrayOfBytes[i].byteLength;

    for (var j = 0; j < currentByteLength; j++) {
      result[offset] = currentBytes[j];
      offset++;
    }
  }

  return new DataView(result.buffer);
}

// ENCODERS

function _Bytes_encode(encoder) {
  var mutableBytes = new DataView(new ArrayBuffer($gren_lang$core$Bytes$Encode$getLength(encoder)));
  A3($gren_lang$core$Bytes$Encode$write, encoder, mutableBytes, 0);
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

// DECODER

var _Bytes_decode = F2(function (decoder, bytes) {
  try {
    return $gren_lang$core$Maybe$Just(A2(decoder, bytes, 0).value);
  } catch (e) {
    if (e instanceof RangeError) {
      return $gren_lang$core$Maybe$Nothing;
    } else {
      throw e;
    }
  }
});

var _Bytes_read_i8 = F2(function (bytes, offset) {
  return { offset: offset + 1, value: bytes.getInt8(offset) };
});
var _Bytes_read_i16 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 2, value: bytes.getInt16(offset, isLE) };
});
var _Bytes_read_i32 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 4, value: bytes.getInt32(offset, isLE) };
});
var _Bytes_read_u8 = F2(function (bytes, offset) {
  return { offset: offset + 1, value: bytes.getUint8(offset) };
});
var _Bytes_read_u16 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 2, value: bytes.getUint16(offset, isLE) };
});
var _Bytes_read_u32 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 4, value: bytes.getUint32(offset, isLE) };
});
var _Bytes_read_f32 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 4, value: bytes.getFloat32(offset, isLE) };
});
var _Bytes_read_f64 = F3(function (isLE, bytes, offset) {
  return { offset: offset + 8, value: bytes.getFloat64(offset, isLE) };
});

var _Bytes_read_bytes = F3(function (len, bytes, offset) {
  return {
    offset: offset + len,
    value: new DataView(bytes.buffer, bytes.byteOffset + offset, len),
  };
});

var _Bytes_decodeFailure = F2(function () {
  throw 0;
});
var $gren_lang$core$Bytes$Encode$getLength = function(builder) {
	switch (builder.$) {
		case 'I8':
			return 1;
		case 'I16':
			return 2;
		case 'I32':
			return 4;
		case 'U8':
			return 1;
		case 'U16':
			return 2;
		case 'U32':
			return 4;
		case 'F32':
			return 4;
		case 'F64':
			return 8;
		case 'Seq':
			var w = builder.a;
			return w;
		case 'Utf8':
			var w = builder.a;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_length(bs);
	}
};
var $gren_lang$core$Bytes$LE = { $: 'LE' };
var $gren_lang$core$Bytes$Encode$write$ = function(builder, mb, offset) {
	switch (builder.$) {
		case 'I8':
			var n = builder.a;
			return A3(_Bytes_write_i8, mb, offset, n);
		case 'I16':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_i16, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'I32':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_i32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'U8':
			var n = builder.a;
			return A3(_Bytes_write_u8, mb, offset, n);
		case 'U16':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_u16, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'U32':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_u32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'F32':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_f32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'F64':
			var e = builder.a;
			var n = builder.b;
			return A4(_Bytes_write_f64, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'Seq':
			var bs = builder.b;
			return $gren_lang$core$Bytes$Encode$writeSequence$(bs, mb, offset);
		case 'Utf8':
			var s = builder.b;
			return A3(_Bytes_write_string, mb, offset, s);
		default:
			var bs = builder.a;
			return A3(_Bytes_write_bytes, mb, offset, bs);
	}
};
var $gren_lang$core$Bytes$Encode$write = F3($gren_lang$core$Bytes$Encode$write$);
var $gren_lang$core$Bytes$Encode$writeSequence$ = function(builders, mb, offset) {
	return A3($gren_lang$core$Array$foldl, F2(function(builder, currentOffset) {
				return $gren_lang$core$Bytes$Encode$write$(builder, mb, currentOffset);
			}), offset, builders);
};
var $gren_lang$core$Bytes$Encode$writeSequence = F3($gren_lang$core$Bytes$Encode$writeSequence$);
var $gren_lang$core$Bytes$fromString = _Bytes_fromString;


var _Stream_attachListener = F2(function (stream, sendToApp) {
  return _Scheduler_binding(function (_callback) {
    var listener = function (data) {
      _Scheduler_rawSpawn(
        sendToApp(new DataView(data.buffer, data.byteOffset, data.byteLength))
      );
    };

    stream.on("data", listener);

    return function () {
      stream.off("data", listener);
      stream.pause();
    };
  });
});

var _Stream_send = F2(function (stream, data) {
  return _Scheduler_binding(function (callback) {
    stream.write(new Uint8Array(data.buffer, data.byteOffset, data.byteLength));
    callback(_Scheduler_succeed({}));
  });
});
var $gren_lang$node$Stream$send$ = function(_v0, bytes) {
	var kernelStream = _v0.b;
	return A2(_Stream_send, kernelStream, bytes);
};
var $gren_lang$node$Stream$send = F2($gren_lang$node$Stream$send$);
var $gren_lang$node$Stream$sendString$ = function(stream, string) {
	return $gren_lang$node$Stream$send$(stream, $gren_lang$core$Bytes$fromString(string));
};
var $gren_lang$node$Stream$sendString = F2($gren_lang$node$Stream$sendString$);
var $gren_lang$node$Stream$sendLine$ = function(stream, string) {
	return $gren_lang$node$Stream$sendString$(stream, string + '\n');
};
var $gren_lang$node$Stream$sendLine = F2($gren_lang$node$Stream$sendLine$);
var $author$project$Main$progress$ = function(stream, message) {
	return $gren_lang$core$Task$execute($gren_lang$node$Stream$sendLine$(stream, '🌸 ' + (message + '...')));
};
var $author$project$Main$progress = F2($author$project$Main$progress$);
var $author$project$Main$runBuild = function(model) {
	return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Cleaning up previous builds'), $gren_lang$core$Task$attempt$($author$project$Main$Cleaned, $author$project$Main$clean(model.fsPermission)) ]);
};
var $gren_lang$node$Node$setExitCode = function(code) {
	return _Node_setExitCode(code);
};
var $author$project$Main$run$ = function(model, _v0) {
	var args = _v0.args;
	var options = _v0.options;
	return (_Utils_eq(args, [ 'version' ]) || ($gren_lang$core$Dict$member$('v', options) || $gren_lang$core$Dict$member$('version', options))) ? { command: $author$project$Main$getVersion({  }), model: model } : (_Utils_eq(args, [ 'build' ]) ? { command: $author$project$Main$runBuild(model), model: model } : (_Utils_eq(args, [ 'init' ]) ? { command: $gren_lang$core$Task$execute($gren_lang$node$Stream$sendString$(model.stdout, '󱚤 Can I turn the current directory into a new Prettynice project (y|n)? ')), model: _Utils_update(model, { readInput: $gren_lang$core$Maybe$Just($author$project$Main$GenProject_Confirmation) }) } : (_Utils_eq(args, [  ]) ? { command: $gren_lang$core$Task$execute($gren_lang$node$Stream$sendLine$(model.stdout, $author$project$Main$help)), model: model } : { command: $gren_lang$core$Task$execute(A2($gren_lang$core$Task$andThen, function(_v2) {
				return $gren_lang$node$Node$setExitCode(1);
			}, A2($gren_lang$core$Task$andThen, function(_v1) {
					return $gren_lang$node$Stream$sendLine$(model.stderr, $author$project$Main$help);
				}, $gren_lang$node$Stream$sendLine$(model.stderr, 'I don\'t recognize those arguments.')))), model: model })));
};
var $author$project$Main$run = F2($author$project$Main$run$);
var $gren_lang$node$Node$startProgram = function(initResult) {
	return $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed(initResult));
};
var $author$project$Main$init = function(env) {
	return $gren_lang$node$Init$await$($gren_lang$node$FileSystem$initialize, function(fsPermission) {
			return $gren_lang$node$Init$await$($gren_lang$node$ChildProcess$initialize, function(procPermission) {
					var model = { dirname: $gren_lang$core$Maybe$Nothing, fsPermission: fsPermission, optimize: $gren_lang$core$Array$member$('--optimize', env.args), procPermission: procPermission, readInput: $gren_lang$core$Maybe$Nothing, stderr: env.stderr, stdin: env.stdin, stdout: env.stdout };
					return $gren_lang$node$Node$startProgram($author$project$Main$run$(model, $joeybright$gren_args$Args$parse($gren_lang$core$Array$dropFirst$(2, env.args))));
				});
		});
};
var $author$project$Main$GotDirname = function (a) {
	return { $: 'GotDirname', a: a };
};
var $author$project$Main$GotVersion = function (a) {
	return { $: 'GotVersion', a: a };
};
var $gren_lang$core$Json$Decode$string = _Json_decodeString;
var $author$project$Main$gotDirname = _Platform_incomingPort('gotDirname', $gren_lang$core$Json$Decode$string);
var $author$project$Main$gotVersion = _Platform_incomingPort('gotVersion', $gren_lang$core$Json$Decode$string);
var $gren_lang$node$Stream$Listen$ = function (a, b) {
	return { $: 'Listen', a: a, b: b };
};
var $gren_lang$node$Stream$Listen = F2($gren_lang$node$Stream$Listen$);
var $gren_lang$node$Stream$init = $gren_lang$core$Task$succeed({ processes: $gren_lang$core$Dict$empty, taggers: $gren_lang$core$Dict$empty });
var $gren_lang$core$Dict$diff$ = function(t1, t2) {
	return $gren_lang$core$Dict$foldl$(F3(function(k, v, t) {
				return $gren_lang$core$Dict$remove$(k, t);
			}), t1, t2);
};
var $gren_lang$core$Dict$diff = F2($gren_lang$core$Dict$diff$);
var $gren_lang$core$Dict$filter$ = function(isGood, dict) {
	return $gren_lang$core$Dict$foldl$(F3(function(k, v, d) {
				return A2(isGood, k, v) ? $gren_lang$core$Dict$set$(k, v, d) : d;
			}), $gren_lang$core$Dict$empty, dict);
};
var $gren_lang$core$Dict$filter = F2($gren_lang$core$Dict$filter$);
var $gren_lang$core$Process$kill = _Scheduler_kill;
var $gren_lang$node$Stream$FromStream$ = function (a, b) {
	return { $: 'FromStream', a: a, b: b };
};
var $gren_lang$node$Stream$FromStream = F2($gren_lang$node$Stream$FromStream$);
var $gren_lang$node$Stream$attachListener = _Stream_attachListener;
var $gren_lang$core$Platform$sendToSelf = _Platform_sendToSelf;
var $gren_lang$core$Process$spawn = _Scheduler_spawn;
var $gren_lang$node$Stream$spawnHelp$ = function(router, toSpawn, processes) {
	var _v0 = $gren_lang$core$Array$first(toSpawn);
	if (_v0.$ === 'Nothing') {
		return $gren_lang$core$Task$succeed(processes);
	} else {
		var nextStream = _v0.a;
		var sid = nextStream.a;
		var rawStream = nextStream.b;
		var spawnStream = $gren_lang$core$Process$spawn(A2($gren_lang$node$Stream$attachListener, rawStream, function(data) {
					return A2($gren_lang$core$Platform$sendToSelf, router, $gren_lang$node$Stream$FromStream$(nextStream, data));
				}));
		var rest = $gren_lang$core$Array$dropFirst$(1, toSpawn);
		var spawnRest = function(processId) {
			return $gren_lang$node$Stream$spawnHelp$(router, rest, $gren_lang$core$Dict$set$(sid, processId, processes));
		};
		return A2($gren_lang$core$Task$andThen, spawnRest, spawnStream);
	}
};
var $gren_lang$node$Stream$spawnHelp = F3($gren_lang$node$Stream$spawnHelp$);
var $gren_lang$node$Stream$subToListener$ = function(sub, taggers) {
	var stream = sub.a;
	var sid = stream.a;
	var tagger = sub.b;
	var _v1 = $gren_lang$core$Dict$get$(sid, taggers);
	if (_v1.$ === 'Just') {
		var data = _v1.a;
		return $gren_lang$core$Dict$set$(sid, _Utils_update(data, { taggers: A2($gren_lang$core$Array$pushLast, tagger, data.taggers) }), taggers);
	} else {
		return $gren_lang$core$Dict$set$(sid, { stream: stream, taggers: [ tagger ] }, taggers);
	}
};
var $gren_lang$node$Stream$subToListener = F2($gren_lang$node$Stream$subToListener$);
var $gren_lang$core$Dict$values = function(dict) {
	return $gren_lang$core$Dict$foldl$(F3(function(key, value, valueArray) {
				return A2($gren_lang$core$Array$pushLast, value, valueArray);
			}), [  ], dict);
};
var $gren_lang$node$Stream$onEffects$ = function(router, subs, state) {
	var newTaggers = A3($gren_lang$core$Array$foldl, $gren_lang$node$Stream$subToListener, $gren_lang$core$Dict$empty, subs);
	var toSpawn = A2($gren_lang$core$Array$map, function ($) {
			return $.stream;
		}, $gren_lang$core$Dict$values($gren_lang$core$Dict$diff$(newTaggers, state.taggers)));
	var killTasks = A3($gren_lang$core$Array$foldl, F2(function(id, tasks) {
				return A2($gren_lang$core$Task$andThen, function(_v2) {
						return $gren_lang$core$Process$kill(id);
					}, tasks);
			}), $gren_lang$core$Task$succeed({  }), $gren_lang$core$Dict$values($gren_lang$core$Dict$diff$(state.processes, newTaggers)));
	var existingProcesses = $gren_lang$core$Dict$filter$(F2(function(sid, _v1) {
				return $gren_lang$core$Dict$member$(sid, newTaggers);
			}), state.processes);
	return $gren_lang$core$Task$map$(function(newProcesses) {
			return { processes: newProcesses, taggers: newTaggers };
		}, A2($gren_lang$core$Task$andThen, function(_v0) {
				return $gren_lang$node$Stream$spawnHelp$(router, toSpawn, existingProcesses);
			}, killTasks));
};
var $gren_lang$node$Stream$onEffects = F3($gren_lang$node$Stream$onEffects$);
var $gren_lang$node$Stream$onSelfMsg$ = function(router, event, state) {
	var _v1 = event.a;
	var sid = _v1.a;
	var data = event.b;
	return $gren_lang$core$Task$map$(function(_v3) {
			return state;
		}, A3($gren_lang$core$Array$foldl, F2(function(msg, tasks) {
					return A2($gren_lang$core$Task$andThen, function(_v2) {
							return A2($gren_lang$core$Platform$sendToApp, router, msg);
						}, tasks);
				}), $gren_lang$core$Task$succeed({  }), A2($gren_lang$core$Array$map, function(tagger) {
					return tagger(data);
				}, $gren_lang$core$Maybe$withDefault$([  ], $gren_lang$core$Maybe$map$(function ($) {
							return $.taggers;
						}, $gren_lang$core$Dict$get$(sid, state.taggers))))));
};
var $gren_lang$node$Stream$onSelfMsg = F3($gren_lang$node$Stream$onSelfMsg$);
var $gren_lang$node$Stream$subMap$ = function(mapFn, sub) {
	var stream = sub.a;
	var msgMap = sub.b;
	return $gren_lang$node$Stream$Listen$(stream, $gren_lang$core$Basics$composeL$(mapFn, msgMap));
};
var $gren_lang$node$Stream$subMap = F2($gren_lang$node$Stream$subMap$);
_Platform_effectManagers['Stream'] = _Platform_createManager($gren_lang$node$Stream$init, $gren_lang$node$Stream$onEffects, $gren_lang$node$Stream$onSelfMsg, 0, $gren_lang$node$Stream$subMap);
var $gren_lang$node$Stream$subscription = _Platform_leaf('Stream');
var $gren_lang$node$Stream$listen$ = function(stream, msgMap) {
	return $gren_lang$node$Stream$subscription($gren_lang$node$Stream$Listen$(stream, msgMap));
};
var $gren_lang$node$Stream$listen = F2($gren_lang$node$Stream$listen$);
var $author$project$Main$subscriptions = function(model) {
	return $gren_lang$core$Platform$Sub$batch([ $author$project$Main$gotDirname($author$project$Main$GotDirname), $author$project$Main$gotVersion($author$project$Main$GotVersion), function () {
			var _v0 = model.readInput;
			if (_v0.$ === 'Just') {
				var msg = _v0.a;
				return $gren_lang$node$Stream$listen$(model.stdin, msg);
			} else {
				return $gren_lang$core$Platform$Sub$none;
			}
		}() ]);
};
var $gren_lang$core$Json$Decode$succeed = _Json_succeed;
var $author$project$Main$BuiltClientComponents = function (a) {
	return { $: 'BuiltClientComponents', a: a };
};
var $author$project$Main$BuiltServer = function (a) {
	return { $: 'BuiltServer', a: a };
};
var $author$project$Main$CopiedPublicAssets = function (a) {
	return { $: 'CopiedPublicAssets', a: a };
};
var $author$project$Main$GenProject_Created = function (a) {
	return { $: 'GenProject_Created', a: a };
};
var $author$project$Main$GenProject_NpmInstalled = function (a) {
	return { $: 'GenProject_NpmInstalled', a: a };
};
var $author$project$Main$GeneratedClientComponents = function (a) {
	return { $: 'GeneratedClientComponents', a: a };
};
var $author$project$Main$GeneratedClientPorts = function (a) {
	return { $: 'GeneratedClientPorts', a: a };
};
var $author$project$Main$GeneratedDependencies = function (a) {
	return { $: 'GeneratedDependencies', a: a };
};
var $author$project$Main$GeneratedServerComponents = function (a) {
	return { $: 'GeneratedServerComponents', a: a };
};
var $author$project$Main$GeneratedServerPorts = function (a) {
	return { $: 'GeneratedServerPorts', a: a };
};
var $author$project$Main$ComponentBuildFailed = function (a) {
	return { $: 'ComponentBuildFailed', a: a };
};
var $author$project$Main$ComponentBuildSucceeded = function (a) {
	return { $: 'ComponentBuildSucceeded', a: a };
};
var $author$project$Main$ListComponentsFailed = function (a) {
	return { $: 'ListComponentsFailed', a: a };
};
var $author$project$Main$NoComponents = { $: 'NoComponents' };
var $gren_lang$node$ChildProcess$SetWorkingDirectory = function (a) {
	return { $: 'SetWorkingDirectory', a: a };
};
var $gren_lang$core$Basics$composeR$ = function(f, g) {
	return function(x) {
		return g(f(x));
	};
};
var $gren_lang$core$Basics$composeR = F2($gren_lang$core$Basics$composeR$);
var $gren_lang$node$ChildProcess$DefaultShell = { $: 'DefaultShell' };
var $gren_lang$node$ChildProcess$InheritEnvironmentVariables = { $: 'InheritEnvironmentVariables' };
var $gren_lang$node$ChildProcess$InheritWorkingDirectory = { $: 'InheritWorkingDirectory' };
var $gren_lang$node$ChildProcess$NoLimit = { $: 'NoLimit' };
var $gren_lang$core$Basics$mul = _Basics_mul;
var $gren_lang$node$ChildProcess$defaultRunOptions = { environmentVariables: $gren_lang$node$ChildProcess$InheritEnvironmentVariables, maximumBytesWrittenToStreams: 1024 * 1024, runDuration: $gren_lang$node$ChildProcess$NoLimit, shell: $gren_lang$node$ChildProcess$DefaultShell, workingDirectory: $gren_lang$node$ChildProcess$InheritWorkingDirectory };
var $author$project$CodeGen$errorString = function(error) {
	var str = error.a;
	return str;
};
var $gren_lang$core$Array$append$ = function(fst, second) {
	return A2($gren_lang$core$Array$prepend, second, fst);
};
var $gren_lang$core$Array$append = F2($gren_lang$core$Array$append$);
var $gren_lang$core$String$isEmpty = function(string) {
	return string === '';
};
var $gren_lang$node$FileSystem$Path$filenameWithExtension = function(path) {
	return $gren_lang$core$String$isEmpty(path.extension) ? path.filename : (path.filename + ('.' + path.extension));
};
var $gren_lang$core$Array$filter = _Array_filter;
var $gren_lang$core$Basics$neq = _Utils_notEqual;
var $gren_lang$node$FileSystem$Path$prepend$ = function(left, right) {
	return _Utils_update(left, { directory: A2($gren_lang$core$Array$filter, function(dir) {
				return dir !== '';
			}, $gren_lang$core$Array$append$(right.directory, A2($gren_lang$core$Array$pushLast, $gren_lang$node$FileSystem$Path$filenameWithExtension(left), left.directory))), extension: right.extension, filename: right.filename });
};
var $gren_lang$node$FileSystem$Path$prepend = F2($gren_lang$node$FileSystem$Path$prepend$);
var $gren_lang$node$FileSystem$Path$append$ = function(left, right) {
	return $gren_lang$node$FileSystem$Path$prepend$(right, left);
};
var $gren_lang$node$FileSystem$Path$append = F2($gren_lang$node$FileSystem$Path$append$);
var $author$project$CodeGen$emptyBundle = function(permission) {
	return { compendium: [  ], fsPermission: permission, readingDirectory: $gren_lang$core$Maybe$Nothing };
};
var $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory = function(_v0) {
	var code = _v0.a;
	return code === 'ENOENT';
};
var $gren_lang$core$Task$fail = _Scheduler_fail;
var $gren_lang$node$FileSystem$Path$empty = { directory: [  ], extension: '', filename: '', root: '' };
var $icidasset$shikensu_gren$Shikensu$Error$PlatformError$ = function (a, b) {
	return { $: 'PlatformError', a: a, b: b };
};
var $icidasset$shikensu_gren$Shikensu$Error$PlatformError = F2($icidasset$shikensu_gren$Shikensu$Error$PlatformError$);
var $icidasset$shikensu_gren$Shikensu$Definition$create = function(relPath) {
	return { content: $gren_lang$core$Maybe$Nothing, metadata: $gren_lang$core$Dict$empty, path: _Utils_update(relPath, { root: '' }) };
};
var $gren_lang$core$Array$flatMap = _Array_flatMap;
var $gren_lang$core$Array$filterMap$ = function(mapper, array) {
	return A2($gren_lang$core$Array$flatMap, function(v) {
			var _v0 = mapper(v);
			if (_v0.$ === 'Just') {
				var newValue = _v0.a;
				return [ newValue ];
			} else {
				return [  ];
			}
		}, array);
};
var $gren_lang$core$Array$filterMap = F2($gren_lang$core$Array$filterMap$);
var $gren_lang$core$Array$flatten = _Array_flat;
var $gren_lang$node$FileSystem$listDirectory$ = function(_v0, path) {
	return _FileSystem_listDirectory(path);
};
var $gren_lang$node$FileSystem$listDirectory = F2($gren_lang$node$FileSystem$listDirectory$);
var $gren_lang$core$Task$mapError$ = function(convert, task) {
	return A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Task$fail, convert), task);
};
var $gren_lang$core$Task$mapError = F2($gren_lang$core$Task$mapError$);
var $gren_lang$core$Array$singleton = function(a) {
	return [ a ];
};
var $gren_lang$core$String$startsWith = _String_startsWith;
var $icidasset$shikensu_gren$Shikensu$recursiveList$ = function(permission, readPath, listPath) {
	return A2($gren_lang$core$Task$andThen, function(listing) {
			return $gren_lang$core$Task$map$($gren_lang$core$Array$flatten, $gren_lang$core$Task$sequence($gren_lang$core$Array$filterMap$(function(_v0) {
							var entityType = _v0.entityType;
							var path = _v0.path;
							switch (entityType.$) {
								case 'File':
									return A2($gren_lang$core$String$startsWith, '.', path.filename) ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just($gren_lang$core$Task$succeed($gren_lang$core$Array$singleton($icidasset$shikensu_gren$Shikensu$Definition$create($gren_lang$node$FileSystem$Path$prepend$(listPath, path)))));
								case 'Directory':
									return $gren_lang$core$Maybe$Just($icidasset$shikensu_gren$Shikensu$recursiveList$(permission, readPath, $gren_lang$node$FileSystem$Path$prepend$(listPath, path)));
								default:
									return $gren_lang$core$Maybe$Nothing;
							}
						}, listing)));
		}, $gren_lang$core$Task$mapError$($icidasset$shikensu_gren$Shikensu$Error$PlatformError(listPath), $gren_lang$node$FileSystem$listDirectory$(permission, $gren_lang$node$FileSystem$Path$prepend$(readPath, listPath))));
};
var $icidasset$shikensu_gren$Shikensu$recursiveList = F3($icidasset$shikensu_gren$Shikensu$recursiveList$);
var $icidasset$shikensu_gren$Shikensu$list$ = function(fsPermission, readPath) {
	return $gren_lang$core$Task$map$(function(compendium) {
			return { compendium: compendium, fsPermission: fsPermission, readingDirectory: $gren_lang$core$Maybe$Just(readPath) };
		}, $icidasset$shikensu_gren$Shikensu$recursiveList$(fsPermission, readPath, $gren_lang$node$FileSystem$Path$empty));
};
var $icidasset$shikensu_gren$Shikensu$list = F2($icidasset$shikensu_gren$Shikensu$list$);
var $author$project$CodeGen$tryList$ = function(fsPermission, dirs) {
	return A2($gren_lang$core$Task$onError, function(error) {
			if (error.$ === 'PlatformError') {
				var e = error.b;
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(e) ? $gren_lang$core$Task$succeed($author$project$CodeGen$emptyBundle(fsPermission)) : $gren_lang$core$Task$fail(error);
			} else {
				var e = error;
				return $gren_lang$core$Task$fail(e);
			}
		}, $icidasset$shikensu_gren$Shikensu$list$(fsPermission, $gren_lang$node$FileSystem$Path$fromPosixString(dirs)));
};
var $author$project$CodeGen$tryList = F2($author$project$CodeGen$tryList$);
var $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium$ = function(fn, bundle) {
	return _Utils_update(bundle, { compendium: fn(bundle.compendium) });
};
var $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium = F2($icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium$);
var $icidasset$shikensu_gren$Shikensu$Contrib$withExtension = function(extension) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$filter(function(def) {
				return _Utils_eq(def.path.extension, extension);
			}));
};
var $author$project$CodeGen$listComponents = function(fsPermission) {
	return $gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$withExtension('gren'), $author$project$CodeGen$tryList$(fsPermission, 'client/src/Components'));
};
var $author$project$CodeGen$PipelineError = function (a) {
	return { $: 'PipelineError', a: a };
};
var $gren_lang$node$FileSystem$errorToString = function(_v0) {
	var message = _v0.b;
	return message;
};
var $icidasset$shikensu_gren$Shikensu$Error$toString = function(error) {
	if (error.$ === 'ErrorMessage') {
		var message = error.a;
		return message;
	} else {
		var path = error.a;
		var err = error.b;
		return $gren_lang$node$FileSystem$errorToString(err);
	}
};
var $author$project$CodeGen$mapError = function(error) {
	return $author$project$CodeGen$PipelineError($icidasset$shikensu_gren$Shikensu$Error$toString(error));
};
var $gren_lang$node$FileSystem$Path$toPosixString = _FilePath_toPosix;
var $author$project$CodeGen$generatedComponentPaths = function(fsPermission) {
	return $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, $gren_lang$core$Task$map$($gren_lang$core$Array$map($gren_lang$node$FileSystem$Path$toPosixString), A2($gren_lang$core$Task$andThen, function(bundle) {
					return $gren_lang$core$Task$succeed(A2($gren_lang$core$Array$map, function(d) {
								return $gren_lang$node$FileSystem$Path$append$(d.path, $gren_lang$node$FileSystem$Path$fromPosixString('.prettynice/Gen/Components'));
							}, bundle.compendium));
				}, $author$project$CodeGen$listComponents(fsPermission))));
};


var bufferNs = require("node:buffer");
var process = require("node:process");
var childProcess = require("node:child_process");

var _ChildProcess_run = function (options) {
  return _Scheduler_binding(function (callback) {
    var workingDir = options.workingDirectory;
    var env = options.environmentVariables;
    var shell = options.shell;

    childProcess.execFile(
      options.program,
      options._arguments,
      {
        encoding: "buffer",
        timeout: options.runDuration,
        cwd: _ChildProcess_handleCwd(workingDir),
        env: _ChildProcess_handleEnv(env),
        timeout: options.runDuration,
        maxBuffer: options.maximumBytesWrittenToStreams,
        shell: _ChildProcess_handleShell(shell),
      },
      function (err, stdout, stderr) {
        if (err == null) {
          callback(
            _Scheduler_succeed({
              stdout: new DataView(
                stdout.buffer,
                stdout.byteOffset,
                stdout.byteLength
              ),
              stderr: new DataView(
                stderr.buffer,
                stderr.byteOffset,
                stderr.byteLength
              ),
            })
          );
        } else {
          callback(
            _Scheduler_fail({
              exitCode:
                typeof err.errno === "undefined" ? err.code : err.errno,
              stdout: new DataView(
                stdout.buffer,
                stdout.byteOffset,
                stdout.byteLength
              ),
              stderr: new DataView(
                stderr.buffer,
                stderr.byteOffset,
                stderr.byteLength
              ),
            })
          );
        }
      }
    );
  });
};

var _ChildProcess_spawn = function (options) {
  return _Scheduler_binding(function (callback) {
    var workingDir = options.workingDirectory;
    var env = options.environmentVariables;
    var shell = options.shell;

    var subproc = childProcess.spawn(options.program, options._arguments, {
      cwd: _ChildProcess_handleCwd(workingDir),
      env: _ChildProcess_handleEnv(env),
      timeout: options.runDuration,
      shell: _ChildProcess_handleShell(shell),
      stdio: options.connection === 0 ? "inherit" : "ignore",
      detached: options.connection === 2 && process.platform === "win32",
    });

    if (options.connection === 2) {
      subproc.unref();
    }

    return function () {
      subproc.kill();
    };
  });
};

function _ChildProcess_handleCwd(cwd) {
  return cwd.inherit ? process.cwd() : cwd.override;
}

function _ChildProcess_handleEnv(env) {
  return env.option === 0
    ? process.env
    : env.option === 1
    ? _Utils_update(process.env, _ChildProcess_dictToObj(env.value))
    : _ChildProcess_dictToObj(env.value);
}

function _ChildProcess_handleShell(shell) {
  return shell.choice === 0
    ? false
    : shell.choice === 1
    ? true
    : shell.value;
}

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
var $gren_lang$core$Basics$max$ = function(x, y) {
	return (_Utils_cmp(x, y) > 0) ? x : y;
};
var $gren_lang$core$Basics$max = F2($gren_lang$core$Basics$max$);
var $gren_lang$node$ChildProcess$run$ = function(_v0, program, _arguments, opts) {
	return _ChildProcess_run({ _arguments: _arguments, environmentVariables: function () {
			var _v1 = opts.environmentVariables;
			switch (_v1.$) {
				case 'InheritEnvironmentVariables':
					return { option: 0, value: $gren_lang$core$Dict$empty };
				case 'MergeWithEnvironmentVariables':
					var value = _v1.a;
					return { option: 1, value: value };
				default:
					var value = _v1.a;
					return { option: 2, value: value };
			}
		}(), maximumBytesWrittenToStreams: opts.maximumBytesWrittenToStreams, program: program, runDuration: function () {
			var _v2 = opts.runDuration;
			if (_v2.$ === 'NoLimit') {
				return 0;
			} else {
				var ms = _v2.a;
				return $gren_lang$core$Basics$max$(0, ms);
			}
		}(), shell: function () {
			var _v3 = opts.shell;
			switch (_v3.$) {
				case 'NoShell':
					return { choice: 0, value: '' };
				case 'DefaultShell':
					return { choice: 1, value: '' };
				default:
					var value = _v3.a;
					return { choice: 2, value: value };
			}
		}(), workingDirectory: function () {
			var _v4 = opts.workingDirectory;
			if (_v4.$ === 'InheritWorkingDirectory') {
				return { inherit: true, override: '' };
			} else {
				var value = _v4.a;
				return { inherit: false, override: value };
			}
		}() });
};
var $gren_lang$node$ChildProcess$run = F4($gren_lang$node$ChildProcess$run$);
var $author$project$Main$buildClientComponents$ = function(fsPermission, procPermission, optimize) {
	var workingDirectory = './client';
	var runOptions = _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { workingDirectory: $gren_lang$node$ChildProcess$SetWorkingDirectory(workingDirectory) });
	var outputPath = '../dist/client/main.js';
	var optimizeFlag = optimize ? '--optimize' : '';
	var buildComponents = function(components) {
		return (components === '') ? $gren_lang$core$Task$succeed($author$project$Main$NoComponents) : $gren_lang$core$Task$mapError$($author$project$Main$ComponentBuildFailed, $gren_lang$core$Task$map$($author$project$Main$ComponentBuildSucceeded, $gren_lang$node$ChildProcess$run$(procPermission, 'npx', [ 'gren', 'make', components, optimizeFlag, '--output=' + outputPath ], runOptions)));
	};
	return A2($gren_lang$core$Task$andThen, buildComponents, $gren_lang$core$Task$map$($gren_lang$core$String$join(' '), $gren_lang$core$Task$mapError$($gren_lang$core$Basics$composeR$($author$project$CodeGen$errorString, $author$project$Main$ListComponentsFailed), $author$project$CodeGen$generatedComponentPaths(fsPermission))));
};
var $author$project$Main$buildClientComponents = F3($author$project$Main$buildClientComponents$);
var $author$project$Main$buildServer$ = function(procPermission, optimize) {
	var workingDirectory = './server';
	var outputPath = '../dist/server/main.js';
	var optimizeFlag = optimize ? '--optimize' : '';
	var inputPath = './src/Main.gren';
	return $gren_lang$node$ChildProcess$run$(procPermission, 'npx', [ 'gren', 'make', inputPath, optimizeFlag, '--output=' + outputPath ], _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { workingDirectory: $gren_lang$node$ChildProcess$SetWorkingDirectory(workingDirectory) }));
};
var $author$project$Main$buildServer = F2($author$project$Main$buildServer$);
var $author$project$Main$endWithErrorMessage$ = function(stream, message) {
	return $gren_lang$core$Task$execute(A2($gren_lang$core$Task$andThen, function(_v0) {
				return $gren_lang$node$Node$setExitCode(1);
			}, $gren_lang$node$Stream$sendLine$(stream, '🚨 ' + (message + '\n'))));
};
var $author$project$Main$endWithErrorMessage = F2($author$project$Main$endWithErrorMessage$);
var $author$project$Main$codeGenError$ = function(stream, error) {
	return $author$project$Main$endWithErrorMessage$(stream, $author$project$CodeGen$errorString(error));
};
var $author$project$Main$codeGenError = F2($author$project$Main$codeGenError$);
var $author$project$CodeGen$Result = function (a) {
	return { $: 'Result', a: a };
};
var $gren_lang$node$FileSystem$readFile$ = function(_v0, path) {
	return _FileSystem_readFile(path);
};
var $gren_lang$node$FileSystem$readFile = F2($gren_lang$node$FileSystem$readFile$);
var $icidasset$shikensu_gren$Shikensu$readDefinition$ = function(fsPermission, readingDirectory, def) {
	var path = $gren_lang$node$FileSystem$Path$prepend$(readingDirectory, def.path);
	return $gren_lang$core$Task$map$(function(bytes) {
			return _Utils_update(def, { content: $gren_lang$core$Maybe$Just(bytes) });
		}, $gren_lang$core$Task$mapError$($icidasset$shikensu_gren$Shikensu$Error$PlatformError(path), $gren_lang$node$FileSystem$readFile$(fsPermission, path)));
};
var $icidasset$shikensu_gren$Shikensu$readDefinition = F3($icidasset$shikensu_gren$Shikensu$readDefinition$);
var $icidasset$shikensu_gren$Shikensu$read = function(bun) {
	return $gren_lang$core$Task$map$(function(compendium) {
			return _Utils_update(bun, { compendium: compendium });
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, function(def) {
					var _v0 = bun.readingDirectory;
					if (_v0.$ === 'Just') {
						var readingDirectory = _v0.a;
						return $icidasset$shikensu_gren$Shikensu$readDefinition$(bun.fsPermission, readingDirectory, def);
					} else {
						return $gren_lang$core$Task$succeed(def);
					}
				}, bun.compendium)));
};
var $gren_lang$core$Basics$sub = _Basics_sub;
var $gren_lang$core$Array$dropLast$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, 0, $gren_lang$core$Array$length(array) - n, array);
};
var $gren_lang$core$Array$dropLast = F2($gren_lang$core$Array$dropLast$);
var $gren_lang$core$Array$last = function(array) {
	return A2($gren_lang$core$Array$get, -1, array);
};
var $gren_lang$core$Array$popLast = function(array) {
	var _v0 = $gren_lang$core$Array$last(array);
	if (_v0.$ === 'Just') {
		var value = _v0.a;
		return $gren_lang$core$Maybe$Just({ initial: $gren_lang$core$Array$dropLast$(1, array), last: value });
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$node$FileSystem$Path$parentPath = function(path) {
	var _v0 = $gren_lang$core$Array$popLast(path.directory);
	if (_v0.$ === 'Nothing') {
		return ($gren_lang$node$FileSystem$Path$filenameWithExtension(path) === '') ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just(_Utils_update(path, { extension: '', filename: '' }));
	} else {
		var _v1 = _v0.a;
		var last = _v1.last;
		var initial = _v1.initial;
		var _v2 = function () {
			var _v3 = A2($gren_lang$core$String$split, '.', last);
			if (_v3.length === 2) {
				var file = _v3[0];
				var ext = _v3[1];
				return { extension: ext, filename: file };
			} else {
				return { extension: '', filename: last };
			}
		}();
		var filename = _v2.filename;
		var extension = _v2.extension;
		return $gren_lang$core$Maybe$Just(_Utils_update(path, { directory: initial, extension: extension, filename: filename }));
	}
};
var $gren_lang$node$FileSystem$writeFile$ = function(_v0, bytes, path) {
	return A2(_FileSystem_writeFile, bytes, path);
};
var $gren_lang$node$FileSystem$writeFile = F3($gren_lang$node$FileSystem$writeFile$);
var $icidasset$shikensu_gren$Shikensu$writeDefinition$ = function(permission, destinationDirectory, def) {
	var path = $gren_lang$node$FileSystem$Path$prepend$(destinationDirectory, def.path);
	return $gren_lang$core$Task$map$(function(_v1) {
			return {  };
		}, $gren_lang$core$Task$mapError$($icidasset$shikensu_gren$Shikensu$Error$PlatformError(path), A2($gren_lang$core$Task$andThen, function(_v0) {
					return $gren_lang$node$FileSystem$writeFile$(permission, $gren_lang$core$Maybe$withDefault$($gren_lang$core$Bytes$fromString(''), def.content), path);
				}, $gren_lang$core$Maybe$withDefault$($gren_lang$core$Task$succeed(path), $gren_lang$core$Maybe$map$(A2($gren_lang$node$FileSystem$makeDirectory, permission, { recursive: true }), $gren_lang$node$FileSystem$Path$parentPath(path))))));
};
var $icidasset$shikensu_gren$Shikensu$writeDefinition = F3($icidasset$shikensu_gren$Shikensu$writeDefinition$);
var $icidasset$shikensu_gren$Shikensu$write$ = function(destinationPath, bun) {
	return $gren_lang$core$Task$map$(function(_v0) {
			return bun;
		}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, A2($icidasset$shikensu_gren$Shikensu$writeDefinition, bun.fsPermission, destinationPath), bun.compendium)));
};
var $icidasset$shikensu_gren$Shikensu$write = F2($icidasset$shikensu_gren$Shikensu$write$);
var $author$project$CodeGen$write = function(destinationDir) {
	return $icidasset$shikensu_gren$Shikensu$write($gren_lang$node$FileSystem$Path$fromPosixString(destinationDir));
};
var $author$project$CodeGen$copyPublicAssets = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('dist/client'), A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, $author$project$CodeGen$tryList$(fsPermission, 'public')))));
};
var $author$project$Main$fileSystemError$ = function(stream, error) {
	return $author$project$Main$endWithErrorMessage$(stream, $gren_lang$node$FileSystem$errorToString(error));
};
var $author$project$Main$fileSystemError = F2($author$project$Main$fileSystemError$);
var $gren_lang$core$Maybe$andThen$ = function(callback, maybeValue) {
	if (maybeValue.$ === 'Just') {
		var value = maybeValue.a;
		return callback(value);
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$andThen = F2($gren_lang$core$Maybe$andThen$);
var $gren_lang$core$String$dropRight$ = function(n, string) {
	return (n < 1) ? string : A3($gren_lang$core$String$slice, 0, -n, string);
};
var $gren_lang$core$String$dropRight = F2($gren_lang$core$String$dropRight$);
var $author$project$CodeGen$baseName = function(def) {
	return $gren_lang$core$String$dropRight$(5, $gren_lang$node$FileSystem$Path$filenameWithExtension(def.path));
};
var $gren_lang$core$String$prepend = _String_append;
var $gren_lang$core$String$append$ = function(lhs, rhs) {
	return A2($gren_lang$core$String$prepend, rhs, lhs);
};
var $gren_lang$core$String$append = F2($gren_lang$core$String$append$);
var $author$project$CodeGen$moduleName = function(def) {
	var parentPath = $gren_lang$core$Maybe$withDefault$('.', $gren_lang$core$Maybe$map$($gren_lang$node$FileSystem$Path$toPosixString, $gren_lang$node$FileSystem$Path$parentPath(def.path)));
	var modulePath = function () {
		if (parentPath === '.') {
			return 'Components.';
		} else {
			var dirs = parentPath;
			return $gren_lang$core$String$append$('.', A2($gren_lang$core$String$join, '.', $gren_lang$core$Array$pushFirst$('Components', A2($gren_lang$core$String$split, '/', dirs))));
		}
	}();
	return _Utils_ap(modulePath, $author$project$CodeGen$baseName(def));
};
var $gren_lang$core$String$replace$ = function(before, after, string) {
	return A2($gren_lang$core$String$join, after, A2($gren_lang$core$String$split, before, string));
};
var $gren_lang$core$String$replace = F3($gren_lang$core$String$replace$);
var $author$project$CodeGen$toClientComponent$ = function(def, contents) {
	return $gren_lang$core$String$replace$('{{MODULE_NAME}}', $author$project$CodeGen$moduleName(def), $gren_lang$core$String$replace$('{{NAME}}', $author$project$CodeGen$baseName(def), 'module Gen.{{MODULE_NAME}} exposing (main)\n\nimport Transmutable.Html.VirtualDom exposing (toVirtualDom)\nimport {{MODULE_NAME}} as {{NAME}}\nimport Browser\n\nmain : Program {{NAME}}.Props {{NAME}}.Model {{NAME}}.Msg\nmain =\n    let\n        e = {{NAME}}.component\n    in\n    Browser.element\n        { init = e.init\n        , update = e.update\n        , subscriptions = e.subscriptions\n        , view = e.view >> toVirtualDom\n        }'));
};
var $author$project$CodeGen$toClientComponent = F2($author$project$CodeGen$toClientComponent$);
var $gren_lang$core$Bytes$toString = _Bytes_toString;
var $author$project$CodeGen$clientComponentFromDef = function(def) {
	return $gren_lang$core$Maybe$map$($gren_lang$core$Bytes$fromString, $gren_lang$core$Maybe$map$($author$project$CodeGen$toClientComponent(def), $gren_lang$core$Maybe$andThen$($gren_lang$core$Bytes$toString, def.content)));
};
var $author$project$CodeGen$readComponents = function(fsPermission) {
	return A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, $author$project$CodeGen$listComponents(fsPermission));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent$ = function(renderer, def) {
	return _Utils_update(def, { content: renderer(def) });
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent = F2($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent$);
var $icidasset$shikensu_gren$Shikensu$Contrib$renderContent = function(renderer) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renderContent(renderer)));
};
var $author$project$CodeGen$genClientComponents = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('client/.prettynice/Gen/Components'), $gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$renderContent($author$project$CodeGen$clientComponentFromDef), $author$project$CodeGen$readComponents(fsPermission)))));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension$ = function(oldExtname, newExtname, def) {
	return _Utils_eq(def.path.extension, oldExtname) ? _Utils_update(def, { path: _Utils_update(def.path, { extension: newExtname }) }) : def;
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension = F3($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension$);
var $icidasset$shikensu_gren$Shikensu$Contrib$renameExtension$ = function(old, _new) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map(A2($icidasset$shikensu_gren$Shikensu$Contrib$Definition$renameExtension, old, _new)));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$renameExtension = F2($icidasset$shikensu_gren$Shikensu$Contrib$renameExtension$);
var $author$project$CodeGen$tryRead = $gren_lang$core$Task$andThen(function(bundle) {
		return A2($gren_lang$core$Task$onError, function(_v0) {
				return $gren_lang$core$Task$succeed(bundle);
			}, $icidasset$shikensu_gren$Shikensu$read(bundle));
	});
var $author$project$CodeGen$genClientPorts = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('dist/client/Components'), $author$project$CodeGen$tryRead($gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$renameExtension$('gren', 'js'), $author$project$CodeGen$listComponents(fsPermission))))));
};
var $icidasset$shikensu_gren$Shikensu$bundle$ = function(fsPermission, compendium) {
	return { compendium: compendium, fsPermission: fsPermission, readingDirectory: $gren_lang$core$Maybe$Nothing };
};
var $icidasset$shikensu_gren$Shikensu$bundle = F2($icidasset$shikensu_gren$Shikensu$bundle$);
var $author$project$CodeGen$createDef$ = function(content, path) {
	var def = $icidasset$shikensu_gren$Shikensu$Definition$create($gren_lang$node$FileSystem$Path$fromPosixString(path));
	return _Utils_update(def, { content: $gren_lang$core$Maybe$Just($gren_lang$core$Bytes$fromString(content)) });
};
var $author$project$CodeGen$createDef = F2($author$project$CodeGen$createDef$);
var $author$project$CodeGen$prettyniceComponentModule = 'module Prettynice.Component exposing (Component)\n\nimport Transmutable.Html exposing (Html)\n\ntype alias Component props model msg =\n    { init : props -> { model : model, command : Cmd msg }\n    , view : model -> Html msg\n    , update : msg -> model -> { model : model, command : Cmd msg }\n    , subscriptions : model -> Sub msg\n    }';
var $author$project$CodeGen$serverWrapper = 'const main = require("./main.js");\nconst app = main.Gren.Main.init({});\n\ntry {\n    const ports = require("./ports.js");\n    if (ports.init) {\n      ports.init(app);\n    }\n} catch (e) {\n    if (e.code !== \'MODULE_NOT_FOUND\') {\n        throw e;\n    }\n}';
var $author$project$CodeGen$genDependencies = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($author$project$CodeGen$write, '.', $icidasset$shikensu_gren$Shikensu$bundle$(fsPermission, [ $author$project$CodeGen$createDef$('', 'dist/client/main.js'), $author$project$CodeGen$createDef$($author$project$CodeGen$prettyniceComponentModule, 'client/.prettynice/Prettynice/Component.gren'), $author$project$CodeGen$createDef$($author$project$CodeGen$serverWrapper, 'dist/server/index.js') ]))));
};
var $icidasset$shikensu_gren$Shikensu$Definition$fork$ = function(relPath, def) {
	return { content: def.content, metadata: def.metadata, path: relPath };
};
var $icidasset$shikensu_gren$Shikensu$Definition$fork = F2($icidasset$shikensu_gren$Shikensu$Definition$fork$);
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename$ = function(oldPath, newPath, def) {
	return _Utils_eq(def.path, oldPath) ? $icidasset$shikensu_gren$Shikensu$Definition$fork$(newPath, def) : def;
};
var $icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename = F3($icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename$);
var $icidasset$shikensu_gren$Shikensu$Contrib$rename$ = function(oldPath, newPath) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$map(A2($icidasset$shikensu_gren$Shikensu$Contrib$Definition$rename, oldPath, newPath)));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$rename = F2($icidasset$shikensu_gren$Shikensu$Contrib$rename$);
var $author$project$CodeGen$genProject$ = function(fsPermission, dirname) {
	var templateDir = $gren_lang$node$FileSystem$Path$append$($gren_lang$node$FileSystem$Path$fromPosixString('../templates/init'), $gren_lang$node$FileSystem$Path$fromPosixString(dirname));
	var ignoreFileTo = $gren_lang$node$FileSystem$Path$fromPosixString('./.gitignore');
	var ignoreFileFrom = $gren_lang$node$FileSystem$Path$fromPosixString('./gitignore');
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('.'), $gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$rename$(ignoreFileFrom, ignoreFileTo), A2($gren_lang$core$Task$andThen, $icidasset$shikensu_gren$Shikensu$read, $icidasset$shikensu_gren$Shikensu$list$(fsPermission, templateDir))))));
};
var $author$project$CodeGen$genProject = F2($author$project$CodeGen$genProject$);
var $icidasset$shikensu_gren$Shikensu$Error$ErrorMessage = function (a) {
	return { $: 'ErrorMessage', a: a };
};
var $gren_lang$parser$Parser$Forbidden = { $: 'Forbidden' };
var $gren_lang$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $gren_lang$parser$Parser$Advanced$fromInfo$ = function(row, col, x, context) {
	return $gren_lang$parser$Parser$Advanced$AddRight$($gren_lang$parser$Parser$Advanced$Empty, { col: col, contextStack: context, problem: x, row: row });
};
var $gren_lang$parser$Parser$Advanced$fromInfo = F4($gren_lang$parser$Parser$Advanced$fromInfo$);
var $gren_lang$parser$Parser$Advanced$chompUntil = function(_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v1 = A5($gren_lang$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.newOffset;
			var newRow = _v1.newRow;
			var newCol = _v1.newCol;
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromInfo$(newRow, newCol, expecting, s.context)) : $gren_lang$parser$Parser$Advanced$Good$(_Utils_cmp(s.offset, newOffset) < 0, {  }, { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src });
		});
};
var $gren_lang$parser$Parser$Expecting = function (a) {
	return { $: 'Expecting', a: a };
};
var $gren_lang$parser$Parser$Advanced$Token$ = function (a, b) {
	return { $: 'Token', a: a, b: b };
};
var $gren_lang$parser$Parser$Advanced$Token = F2($gren_lang$parser$Parser$Advanced$Token$);
var $gren_lang$parser$Parser$toToken = function(str) {
	return $gren_lang$parser$Parser$Advanced$Token$(str, $gren_lang$parser$Parser$Expecting(str));
};
var $gren_lang$parser$Parser$chompUntil = function(str) {
	return $gren_lang$parser$Parser$Advanced$chompUntil($gren_lang$parser$Parser$toToken(str));
};
var $gren_lang$core$Set$Set_gren_builtin = function (a) {
	return { $: 'Set_gren_builtin', a: a };
};
var $gren_lang$core$Set$empty = $gren_lang$core$Set$Set_gren_builtin($gren_lang$core$Dict$empty);
var $blaix$prettynice$Prettynice$Internal$Props$ArrayType = function (a) {
	return { $: 'ArrayType', a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$BoolType = { $: 'BoolType' };
var $blaix$prettynice$Prettynice$Internal$Props$FloatType = { $: 'FloatType' };
var $blaix$prettynice$Prettynice$Internal$Props$IntType = { $: 'IntType' };
var $blaix$prettynice$Prettynice$Internal$Props$MaybeType = function (a) {
	return { $: 'MaybeType', a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$StringType = { $: 'StringType' };
var $gren_lang$parser$Parser$ExpectingKeyword = function (a) {
	return { $: 'ExpectingKeyword', a: a };
};
var $gren_lang$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $gren_lang$core$Basics$not = _Basics_not;
var $gren_lang$parser$Parser$Advanced$keyword = function(_v0) {
	var kwd = _v0.a;
	var expecting = _v0.b;
	var progress = !$gren_lang$core$String$isEmpty(kwd);
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v1 = A5($gren_lang$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.newOffset;
			var newRow = _v1.newRow;
			var newCol = _v1.newCol;
			return (_Utils_eq(newOffset, -1) || (0 <= A3($gren_lang$parser$Parser$Advanced$isSubChar, function(c) {
					return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr('_'));
				}, newOffset, s.src))) ? $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromState$(s, expecting)) : $gren_lang$parser$Parser$Advanced$Good$(progress, {  }, { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src });
		});
};
var $gren_lang$parser$Parser$keyword = function(kwd) {
	return $gren_lang$parser$Parser$Advanced$keyword($gren_lang$parser$Parser$Advanced$Token$(kwd, $gren_lang$parser$Parser$ExpectingKeyword(kwd)));
};
var $gren_lang$parser$Parser$Advanced$lazy = function(thunk) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v0 = thunk({  });
			var parse = _v0.a;
			return parse(s);
		});
};
var $gren_lang$parser$Parser$lazy = $gren_lang$parser$Parser$Advanced$lazy;
var $gren_lang$parser$Parser$Advanced$spaces = $gren_lang$parser$Parser$Advanced$chompWhile(function(c) {
		return _Utils_eq(c, _Utils_chr(' ')) || (_Utils_eq(c, _Utils_chr('\n')) || _Utils_eq(c, _Utils_chr('\r')));
	});
var $gren_lang$parser$Parser$spaces = $gren_lang$parser$Parser$Advanced$spaces;
function $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser() {
	return A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($gren_lang$core$Basics$identity), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, _Utils_chr('('));
					})), $gren_lang$parser$Parser$spaces), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$IntType), $gren_lang$parser$Parser$keyword('Int')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$FloatType), $gren_lang$parser$Parser$keyword('Float')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$StringType), $gren_lang$parser$Parser$keyword('String')), A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$BoolType), $gren_lang$parser$Parser$keyword('Bool')), A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$ArrayType), $gren_lang$parser$Parser$keyword('Array')), $gren_lang$parser$Parser$lazy(function(_v0) {
									return $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
								})), A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($blaix$prettynice$Prettynice$Internal$Props$MaybeType), $gren_lang$parser$Parser$keyword('Maybe')), $gren_lang$parser$Parser$lazy(function(_v1) {
									return $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
								})) ]), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, _Utils_chr(')'));
					})), $gren_lang$parser$Parser$spaces));
}
try {
	var $blaix$prettynice$Prettynice$Internal$Props$fieldParser = $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
	$blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser = function () {
		return $blaix$prettynice$Prettynice$Internal$Props$fieldParser;
	};
} catch ($) {
	throw 'Some top-level definitions from `Prettynice.Internal.Props` are causing infinite recursion:\n\n  ┌─────┐\n  │    fieldParser\n  └─────┘\n\nThese errors are very tricky, so read https://github.com/gren-lang/compiler/blob/0.4.5/hints/bad-recursion.md to learn how to fix it!';}
var $gren_lang$parser$Parser$Advanced$loopHelp$ = function(p, state, callback, s0) {
	loopHelp:
	while (true) {
		var _v0 = callback(state);
		var parse = _v0.a;
		var _v1 = parse(s0);
		if (_v1.$ === 'Good') {
			var p1 = _v1.a;
			var step = _v1.b;
			var s1 = _v1.c;
			if (step.$ === 'Loop') {
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
				return $gren_lang$parser$Parser$Advanced$Good$(p || p1, result, s1);
			}
		} else {
			var p1 = _v1.a;
			var x = _v1.b;
			return $gren_lang$parser$Parser$Advanced$Bad$(p || p1, x);
		}
	}
};
var $gren_lang$parser$Parser$Advanced$loopHelp = F4($gren_lang$parser$Parser$Advanced$loopHelp$);
var $gren_lang$parser$Parser$Advanced$loop$ = function(state, callback) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			return $gren_lang$parser$Parser$Advanced$loopHelp$(false, state, callback, s);
		});
};
var $gren_lang$parser$Parser$Advanced$loop = F2($gren_lang$parser$Parser$Advanced$loop$);
var $gren_lang$parser$Parser$Advanced$map$ = function(func, _v0) {
	var parse = _v0.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Good') {
				var p = _v1.a;
				var a = _v1.b;
				var s1 = _v1.c;
				return $gren_lang$parser$Parser$Advanced$Good$(p, func(a), s1);
			} else {
				var p = _v1.a;
				var x = _v1.b;
				return $gren_lang$parser$Parser$Advanced$Bad$(p, x);
			}
		});
};
var $gren_lang$parser$Parser$Advanced$map = F2($gren_lang$parser$Parser$Advanced$map$);
var $gren_lang$parser$Parser$Advanced$Done = function (a) {
	return { $: 'Done', a: a };
};
var $gren_lang$parser$Parser$Advanced$Loop = function (a) {
	return { $: 'Loop', a: a };
};
var $gren_lang$parser$Parser$Advanced$revAlways$ = function(_v0, b) {
	return b;
};
var $gren_lang$parser$Parser$Advanced$revAlways = F2($gren_lang$parser$Parser$Advanced$revAlways$);
var $gren_lang$parser$Parser$Advanced$skip$ = function(iParser, kParser) {
	return $gren_lang$parser$Parser$Advanced$map2$($gren_lang$parser$Parser$Advanced$revAlways, iParser, kParser);
};
var $gren_lang$parser$Parser$Advanced$skip = F2($gren_lang$parser$Parser$Advanced$skip$);
var $gren_lang$parser$Parser$Advanced$sequenceEndForbidden$ = function(ender, ws, parseItem, sep, items) {
	var chompRest = function(item) {
		return $gren_lang$parser$Parser$Advanced$sequenceEndForbidden$(ender, ws, parseItem, sep, A2($gren_lang$core$Array$pushLast, item, items));
	};
	return $gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$skip$(sep, $gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$map$(function(item) {
							return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
						}, parseItem))), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
					return $gren_lang$parser$Parser$Advanced$Done(items);
				}, ender) ]));
};
var $gren_lang$parser$Parser$Advanced$sequenceEndForbidden = F5($gren_lang$parser$Parser$Advanced$sequenceEndForbidden$);
var $gren_lang$parser$Parser$Advanced$sequenceEndMandatory$ = function(ws, parseItem, sep, items) {
	return $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$map$(function(item) {
				return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
			}, $gren_lang$parser$Parser$Advanced$ignorer$(parseItem, $gren_lang$parser$Parser$Advanced$ignorer$(ws, $gren_lang$parser$Parser$Advanced$ignorer$(sep, ws)))), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
				return $gren_lang$parser$Parser$Advanced$Done(items);
			}, $gren_lang$parser$Parser$Advanced$succeed({  })) ]);
};
var $gren_lang$parser$Parser$Advanced$sequenceEndMandatory = F4($gren_lang$parser$Parser$Advanced$sequenceEndMandatory$);
var $gren_lang$parser$Parser$Advanced$sequenceEndOptional$ = function(ender, ws, parseItem, sep, items) {
	var parseEnd = $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
			return $gren_lang$parser$Parser$Advanced$Done(items);
		}, ender);
	return $gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$skip$(sep, $gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$map$(function(item) {
								return $gren_lang$parser$Parser$Advanced$Loop(A2($gren_lang$core$Array$pushLast, item, items));
							}, parseItem), parseEnd ]))), parseEnd ]));
};
var $gren_lang$parser$Parser$Advanced$sequenceEndOptional = F5($gren_lang$parser$Parser$Advanced$sequenceEndOptional$);
var $gren_lang$parser$Parser$Advanced$sequenceEnd$ = function(ender, ws, parseItem, sep, trailing) {
	var chompRest = function(item) {
		switch (trailing.$) {
			case 'Forbidden':
				return $gren_lang$parser$Parser$Advanced$loop$([ item ], A4($gren_lang$parser$Parser$Advanced$sequenceEndForbidden, ender, ws, parseItem, sep));
			case 'Optional':
				return $gren_lang$parser$Parser$Advanced$loop$([ item ], A4($gren_lang$parser$Parser$Advanced$sequenceEndOptional, ender, ws, parseItem, sep));
			default:
				return $gren_lang$parser$Parser$Advanced$ignorer$($gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$skip$(sep, $gren_lang$parser$Parser$Advanced$skip$(ws, $gren_lang$parser$Parser$Advanced$loop$([ item ], A3($gren_lang$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))), ender);
		}
	};
	return $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$andThen$(chompRest, parseItem), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
				return [  ];
			}, ender) ]);
};
var $gren_lang$parser$Parser$Advanced$sequenceEnd = F5($gren_lang$parser$Parser$Advanced$sequenceEnd$);
var $gren_lang$parser$Parser$Advanced$token = function(_v0) {
	var str = _v0.a;
	var expecting = _v0.b;
	var progress = !$gren_lang$core$String$isEmpty(str);
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v1 = A5($gren_lang$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v1.newOffset;
			var newRow = _v1.newRow;
			var newCol = _v1.newCol;
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromState$(s, expecting)) : $gren_lang$parser$Parser$Advanced$Good$(progress, {  }, { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src });
		});
};
var $gren_lang$parser$Parser$Advanced$sequence = function(i) {
	return $gren_lang$parser$Parser$Advanced$skip$($gren_lang$parser$Parser$Advanced$token(i.start), $gren_lang$parser$Parser$Advanced$skip$(i.spaces, $gren_lang$parser$Parser$Advanced$sequenceEnd$($gren_lang$parser$Parser$Advanced$token(i.end), i.spaces, i.item, $gren_lang$parser$Parser$Advanced$token(i.separator), i.trailing)));
};
var $gren_lang$parser$Parser$Advanced$Forbidden = { $: 'Forbidden' };
var $gren_lang$parser$Parser$Advanced$Mandatory = { $: 'Mandatory' };
var $gren_lang$parser$Parser$Advanced$Optional = { $: 'Optional' };
var $gren_lang$parser$Parser$toAdvancedTrailing = function(trailing) {
	switch (trailing.$) {
		case 'Forbidden':
			return $gren_lang$parser$Parser$Advanced$Forbidden;
		case 'Optional':
			return $gren_lang$parser$Parser$Advanced$Optional;
		default:
			return $gren_lang$parser$Parser$Advanced$Mandatory;
	}
};
var $gren_lang$parser$Parser$sequence = function(i) {
	return $gren_lang$parser$Parser$Advanced$sequence({ end: $gren_lang$parser$Parser$toToken(i.end), item: i.item, separator: $gren_lang$parser$Parser$toToken(i.separator), spaces: i.spaces, start: $gren_lang$parser$Parser$toToken(i.start), trailing: $gren_lang$parser$Parser$toAdvancedTrailing(i.trailing) });
};
var $gren_lang$parser$Parser$ExpectingSymbol = function (a) {
	return { $: 'ExpectingSymbol', a: a };
};
var $gren_lang$parser$Parser$Advanced$symbol = $gren_lang$parser$Parser$Advanced$token;
var $gren_lang$parser$Parser$symbol = function(str) {
	return $gren_lang$parser$Parser$Advanced$symbol($gren_lang$parser$Parser$Advanced$Token$(str, $gren_lang$parser$Parser$ExpectingSymbol(str)));
};
var $gren_lang$parser$Parser$token = function(str) {
	return $gren_lang$parser$Parser$Advanced$token($gren_lang$parser$Parser$toToken(str));
};
var $gren_lang$parser$Parser$ExpectingVariable = { $: 'ExpectingVariable' };
var $gren_lang$core$Set$member$ = function(key, _v0) {
	var dict = _v0.a;
	return $gren_lang$core$Dict$member$(key, dict);
};
var $gren_lang$core$Set$member = F2($gren_lang$core$Set$member$);
var $gren_lang$parser$Parser$Advanced$varHelp$ = function(isGood, offset, row, col, src, indent, context) {
	varHelp:
	while (true) {
		var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, src);
		if (_Utils_eq(newOffset, -1)) {
			return { col: col, context: context, indent: indent, offset: offset, row: row, src: src };
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
};
var $gren_lang$parser$Parser$Advanced$varHelp = F7($gren_lang$parser$Parser$Advanced$varHelp$);
var $gren_lang$parser$Parser$Advanced$variable = function(i) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var firstOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, i.start, s.offset, s.src);
			if (_Utils_eq(firstOffset, -1)) {
				return $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromState$(s, i.expecting));
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? $gren_lang$parser$Parser$Advanced$varHelp$(i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : $gren_lang$parser$Parser$Advanced$varHelp$(i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($gren_lang$core$String$slice, s.offset, s1.offset, s.src);
				return $gren_lang$core$Set$member$(name, i.reserved) ? $gren_lang$parser$Parser$Advanced$Bad$(false, $gren_lang$parser$Parser$Advanced$fromState$(s, i.expecting)) : $gren_lang$parser$Parser$Advanced$Good$(true, name, s1);
			}
		});
};
var $gren_lang$parser$Parser$variable = function(i) {
	return $gren_lang$parser$Parser$Advanced$variable({ expecting: $gren_lang$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start });
};
var $blaix$prettynice$Prettynice$Internal$Props$parser = A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(A2($gren_lang$core$Array$foldl, F2(function(r, d) {
										return $gren_lang$core$Dict$set$(r.key, r.value, d);
									}), $gren_lang$core$Dict$empty)), $gren_lang$parser$Parser$chompUntil('type alias Props')), $gren_lang$parser$Parser$token('type alias Props')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol('=')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$sequence({ end: '}', item: A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed(F2(function(field, fieldType) {
							return { key: field, value: fieldType };
						})), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$variable({ inner: function(c) {
									return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr('_'));
								}, reserved: $gren_lang$core$Set$empty, start: $gren_lang$core$Char$isLower }), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol(':')), $gren_lang$parser$Parser$spaces)), $blaix$prettynice$Prettynice$Internal$Props$fieldParser), separator: ',', spaces: $gren_lang$parser$Parser$spaces, start: '{', trailing: $gren_lang$parser$Parser$Forbidden }));
var $gren_lang$core$String$words = _String_words;
var $blaix$prettynice$Prettynice$Internal$Props$get = function(content) {
	var normalized = A2($gren_lang$core$String$join, ' ', $gren_lang$core$String$words(content));
	return $gren_lang$parser$Parser$run$($blaix$prettynice$Prettynice$Internal$Props$parser, normalized);
};
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder = function(fieldType) {
	switch (fieldType.$) {
		case 'IntType':
			return 'Encode.int';
		case 'FloatType':
			return 'Encode.float';
		case 'StringType':
			return 'Encode.string';
		case 'BoolType':
			return 'Encode.bool';
		case 'ArrayType':
			var t = fieldType.a;
			return '(Encode.array ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(t) + ')');
		default:
			var t = fieldType.a;
			return '(Maybe.map (' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(t) + ') >> Maybe.withDefault Encode.null)');
	}
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder$ = function(name, fieldType, encoders) {
	var field = $gren_lang$core$String$replace$('{{ENCODER}}', $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToEncoder(fieldType), $gren_lang$core$String$replace$('{{NAME}}', name, '{ key = "{{NAME}}"\n          , value = {{ENCODER}} props.{{NAME}}\n          }'));
	return A2($gren_lang$core$Array$pushLast, field, encoders);
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder = F3($blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder$);
var $blaix$prettynice$Prettynice$Internal$Props$encoder = function(props) {
	var fields = A2($gren_lang$core$String$join, '\n        , ', $gren_lang$core$Dict$foldl$($blaix$prettynice$Prettynice$Internal$Props$addFieldEncoder, [  ], props));
	return $gren_lang$core$String$replace$('{{FIELDS}}', fields, 'Encode.object \n        [ {{FIELDS}}\n        ]');
};
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString = function(fieldType) {
	switch (fieldType.$) {
		case 'IntType':
			return 'Int';
		case 'FloatType':
			return 'Float';
		case 'StringType':
			return 'String';
		case 'BoolType':
			return 'Bool';
		case 'ArrayType':
			var t = fieldType.a;
			return '(Array ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(t) + ')');
		default:
			var t = fieldType.a;
			return '(Maybe ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(t) + ')');
	}
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldSig$ = function(name, fieldType, sigs) {
	var field = name + (' : ' + $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToString(fieldType));
	return A2($gren_lang$core$Array$pushLast, field, sigs);
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldSig = F3($blaix$prettynice$Prettynice$Internal$Props$addFieldSig$);
var $blaix$prettynice$Prettynice$Internal$Props$typeSig = function(props) {
	var fields = A2($gren_lang$core$String$join, ', ', $gren_lang$core$Dict$foldl$($blaix$prettynice$Prettynice$Internal$Props$addFieldSig, [  ], props));
	return '{ ' + (fields + ' }');
};
var $author$project$CodeGen$toServerComponent$ = function(def, props) {
	return $gren_lang$core$String$replace$('{{PROPS_ENCODER}}', $blaix$prettynice$Prettynice$Internal$Props$encoder(props), $gren_lang$core$String$replace$('{{PROPS_TYPE}}', $blaix$prettynice$Prettynice$Internal$Props$typeSig(props), $gren_lang$core$String$replace$('{{MODULE_NAME}}', $author$project$CodeGen$moduleName(def), 'module Gen.{{MODULE_NAME}} exposing (init)\n\nimport Json.Encode as Encode\nimport Prettynice.Internal.Props as Props\nimport Transmutable.Html as H exposing (Html)\nimport Transmutable.Html.Attributes as A\n\ntype alias Props =\n    {{PROPS_TYPE}}\n\nencoder : Props -> Encode.Value\nencoder props =\n    {{PROPS_ENCODER}}\n\ninit : Props -> Html msg\ninit props =\n    let\n        propJson = Encode.encode 0 (encoder props)\n    in\n    H.span []\n        [ H.span [ A.class "prettynice-component-{{MODULE_NAME}}" ] []\n        , H.node "script" []\n            [ H.text <|\n                \"""\n\n                var $__components = $__components || {};\n                $__components["{{MODULE_NAME}}"] = $__components["{{MODULE_NAME}}"] || [];\n                $__components["{{MODULE_NAME}}"].push(\n                    Gren.Gen.{{MODULE_NAME}}.init({\n\n                        flags: \n                            \""" ++ propJson ++ \"""\n                        ,\n                        node: document.currentScript.parentNode.getElementsByClassName(\n                            "prettynice-component-{{MODULE_NAME}}"\n                        )[0],\n                    })\n                );\n\n                \"""\n            ]\n        ]')));
};
var $author$project$CodeGen$toServerComponent = F2($author$project$CodeGen$toServerComponent$);
var $author$project$CodeGen$serverComponentsFromBundle = function(bundle) {
	var newBundle = $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium$($gren_lang$core$Array$map(function(def) {
				var content = $gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Maybe$andThen$($gren_lang$core$Bytes$toString, def.content));
				var propsResult = $blaix$prettynice$Prettynice$Internal$Props$get(content);
				return _Utils_update(def, { content: function () {
						if (propsResult.$ === 'Ok') {
							var props = propsResult.a;
							return $gren_lang$core$Maybe$Just($gren_lang$core$Bytes$fromString($author$project$CodeGen$toServerComponent$(def, props)));
						} else {
							var e = propsResult;
							return $gren_lang$core$Maybe$Nothing;
						}
					}() });
			}), bundle);
	var badDef = A2($gren_lang$core$Array$findFirst, function(def) {
			return _Utils_eq(def.content, $gren_lang$core$Maybe$Nothing);
		}, newBundle.compendium);
	if (badDef.$ === 'Nothing') {
		return $gren_lang$core$Task$succeed(newBundle);
	} else {
		var def = badDef.a;
		return $gren_lang$core$Task$fail($icidasset$shikensu_gren$Shikensu$Error$ErrorMessage($gren_lang$core$String$replace$('{{COMPONENT}}', $author$project$CodeGen$baseName(def), 'Oops! I can\'t parse props for the {{COMPONENT}} component.\n   I\'m looking for a type alias that looks like this:\n\n        type alias Props =\n            { myField : String\n            , myOtherField : Int\n            }\n\n   It either doesn\'t exist, is formatted in a way I\n   can\'t recognize, or it uses unsupported field types.\n   See Prettynice.Internal.Props.Fieldtype for supported types:\n   https://packages.gren-lang.org/package/blaix/prettynice/version/1/module/Prettynice.Internal.Props#FieldType')));
	}
};
var $author$project$CodeGen$genServerComponents = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('server/.prettynice/Gen/Components'), A2($gren_lang$core$Task$andThen, $author$project$CodeGen$serverComponentsFromBundle, $author$project$CodeGen$readComponents(fsPermission)))));
};
var $icidasset$shikensu_gren$Shikensu$Contrib$withBaseName = function(baseName) {
	return $icidasset$shikensu_gren$Shikensu$Bundle$mapCompendium($gren_lang$core$Array$filter(function(def) {
				return _Utils_eq(def.path.filename, baseName);
			}));
};
var $author$project$CodeGen$genServerPorts = function(fsPermission) {
	return $gren_lang$core$Task$map$($author$project$CodeGen$Result, $gren_lang$core$Task$mapError$($author$project$CodeGen$mapError, A2($gren_lang$core$Task$andThen, $author$project$CodeGen$write('dist/server'), $author$project$CodeGen$tryRead($gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$withBaseName('ports'), $gren_lang$core$Task$map$($icidasset$shikensu_gren$Shikensu$Contrib$withExtension('js'), $author$project$CodeGen$tryList$(fsPermission, 'server/src')))))));
};
var $gren_lang$node$ChildProcess$runWithDefaultOptions$ = function(permission, program, _arguments) {
	return $gren_lang$node$ChildProcess$run$(permission, program, _arguments, $gren_lang$node$ChildProcess$defaultRunOptions);
};
var $gren_lang$node$ChildProcess$runWithDefaultOptions = F3($gren_lang$node$ChildProcess$runWithDefaultOptions$);
var $gren_lang$core$String$trim = _String_trim;
var $author$project$Main$update$ = function(msg, model) {
	switch (msg.$) {
		case 'GotDirname':
			var dirname = msg.a;
			return { command: $gren_lang$core$Platform$Cmd$none, model: _Utils_update(model, { dirname: $gren_lang$core$Maybe$Just(dirname) }) };
		case 'GotVersion':
			var version = msg.a;
			return { command: $gren_lang$core$Task$execute($gren_lang$node$Stream$sendLine$(model.stdout, version)), model: model };
		case 'Cleaned':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating prettynice dependencies'), $gren_lang$core$Task$attempt$($author$project$Main$GeneratedDependencies, $author$project$CodeGen$genDependencies(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$fileSystemError$(model.stderr, e);
				}
			}(), model: model };
		case 'GeneratedDependencies':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating server components'), $gren_lang$core$Task$attempt$($author$project$Main$GeneratedServerComponents, $author$project$CodeGen$genServerComponents(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'GeneratedServerComponents':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating client components'), $gren_lang$core$Task$attempt$($author$project$Main$GeneratedClientComponents, $author$project$CodeGen$genClientComponents(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'GeneratedClientComponents':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating server ports'), $gren_lang$core$Task$attempt$($author$project$Main$GeneratedServerPorts, $author$project$CodeGen$genServerPorts(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'GeneratedServerPorts':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating client ports'), $gren_lang$core$Task$attempt$($author$project$Main$GeneratedClientPorts, $author$project$CodeGen$genClientPorts(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'GeneratedClientPorts':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Copying public assets'), $gren_lang$core$Task$attempt$($author$project$Main$CopiedPublicAssets, $author$project$CodeGen$copyPublicAssets(model.fsPermission)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'CopiedPublicAssets':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Building client components'), $gren_lang$core$Task$attempt$($author$project$Main$BuiltClientComponents, $author$project$Main$buildClientComponents$(model.fsPermission, model.procPermission, model.optimize)) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		case 'BuiltClientComponents':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					var success = result.a;
					return $gren_lang$core$Platform$Cmd$batch([ function () {
							if (success.$ === 'NoComponents') {
								return $gren_lang$core$Task$execute($gren_lang$node$Stream$sendLine$(model.stdout, 'No components to build'));
							} else {
								var s = success.a;
								return $gren_lang$core$Task$execute($gren_lang$node$Stream$send$(model.stdout, s.stdout));
							}
						}(), $author$project$Main$progress$(model.stdout, 'Building server'), $gren_lang$core$Task$attempt$($author$project$Main$BuiltServer, $author$project$Main$buildServer$(model.procPermission, model.optimize)) ]);
				} else {
					if (result.a.$ === 'ComponentBuildFailed') {
						var failure = result.a.a;
						return $author$project$Main$endWithErrorMessage$(model.stderr, $gren_lang$core$Maybe$withDefault$('Unknown error building client components', $gren_lang$core$Bytes$toString(failure.stderr)));
					} else {
						var message = result.a.a;
						return $author$project$Main$endWithErrorMessage$(model.stderr, message);
					}
				}
			}(), model: model };
		case 'BuiltServer':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					var success = result.a;
					return $gren_lang$core$Task$execute(A2($gren_lang$core$Task$andThen, function(_v11) {
								return $gren_lang$node$Stream$sendLine$(model.stdout, '✅ Done');
							}, $gren_lang$node$Stream$send$(model.stdout, success.stdout)));
				} else {
					var error = result.a;
					return $author$project$Main$endWithErrorMessage$(model.stderr, $gren_lang$core$Maybe$withDefault$('Unknown error building server', $gren_lang$core$Bytes$toString(error.stderr)));
				}
			}(), model: model };
		case 'GenProject_Confirmation':
			var bytes = msg.a;
			var answer = $gren_lang$core$String$trim($gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Bytes$toString(bytes)));
			return { command: ((answer === 'y') || (answer === 'yes')) ? $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Generating project'), function () {
					var _v12 = model.dirname;
					if (_v12.$ === 'Just') {
						var dir = _v12.a;
						return $gren_lang$core$Task$attempt$($author$project$Main$GenProject_Created, $author$project$CodeGen$genProject$(model.fsPermission, dir));
					} else {
						return $author$project$Main$endWithErrorMessage$(model.stderr, 'Can\'t find path to current executable.');
					}
				}() ]) : $gren_lang$core$Platform$Cmd$none, model: _Utils_update(model, { readInput: $gren_lang$core$Maybe$Nothing }) };
		case 'GenProject_Created':
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Platform$Cmd$batch([ $author$project$Main$progress$(model.stdout, 'Installing dependencies'), $gren_lang$core$Task$attempt$($author$project$Main$GenProject_NpmInstalled, $gren_lang$node$ChildProcess$runWithDefaultOptions$(model.procPermission, 'npm', [ 'install' ])) ]);
				} else {
					var e = result.a;
					return $author$project$Main$codeGenError$(model.stderr, e);
				}
			}(), model: model };
		default:
			var result = msg.a;
			return { command: function () {
				if (result.$ === 'Ok') {
					return $gren_lang$core$Task$execute($gren_lang$node$Stream$sendLine$(model.stdout, '✅ Done!\n\nNow what?\n* Start the dev server with: npm run dev\n* Make changes to your server at: server/src/Main.gren\n* View examples at: https://github.com/blaix/prettynice/tree/main/examples'));
				} else {
					var error = result.a;
					return $author$project$Main$endWithErrorMessage$(model.stderr, $gren_lang$core$Maybe$withDefault$('Unknown error installing dependencies', $gren_lang$core$Bytes$toString(error.stderr)));
				}
			}(), model: model };
	}
};
var $author$project$Main$update = F2($author$project$Main$update$);
var $author$project$Main$main = $gren_lang$node$Node$defineProgram({ init: $author$project$Main$init, subscriptions: $author$project$Main$subscriptions, update: $author$project$Main$update });
_Platform_export({'Main':{'init':$author$project$Main$main($gren_lang$core$Json$Decode$succeed({  }))(0)}});}(this.module ? this.module.exports : this));