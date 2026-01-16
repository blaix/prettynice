(function(scope){
'use strict';

/* @__NO_SIDE_EFFECTS__ */
function F2(fun) {
  var wrapper = function(a) { return function(b) { return fun(a,b); }; };
  wrapper.a2 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F3(fun) {
  var wrapper = function(a) {
    return function(b) { return function(c) { return fun(a, b, c); }; };
  };
  wrapper.a3 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F4(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return fun(a, b, c, d); }; }; };
  };
  wrapper.a4 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F5(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return fun(a, b, c, d, e); }; }; }; };
  };
  wrapper.a5 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F6(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return fun(a, b, c, d, e, f); }; }; }; }; };
  };
  wrapper.a6 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F7(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return fun(a, b, c, d, e, f, g); }; }; }; }; }; };
  };
  wrapper.a7 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F8(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) {
    return fun(a, b, c, d, e, f, g, h); }; }; }; }; }; }; };
  };
  wrapper.a8 = fun;
  return wrapper;
}
/* @__NO_SIDE_EFFECTS__ */
function F9(fun) {
  var wrapper = function(a) { return function(b) { return function(c) {
    return function(d) { return function(e) { return function(f) {
    return function(g) { return function(h) { return function(i) {
    return fun(a, b, c, d, e, f, g, h, i); }; }; }; }; }; }; }; };
  };
  wrapper.a9 = fun;
  return wrapper;
}

/* @__NO_SIDE_EFFECTS__ */
function A2(fun, a, b) {
  return fun.a2 ? fun.a2(a, b) : fun(a)(b);
}
/* @__NO_SIDE_EFFECTS__ */
function A3(fun, a, b, c) {
  return fun.a3 ? fun.a3(a, b, c) : fun(a)(b)(c);
}
/* @__NO_SIDE_EFFECTS__ */
function A4(fun, a, b, c, d) {
  return fun.a4 ? fun.a4(a, b, c, d) : fun(a)(b)(c)(d);
}
/* @__NO_SIDE_EFFECTS__ */
function A5(fun, a, b, c, d, e) {
  return fun.a5 ? fun.a5(a, b, c, d, e) : fun(a)(b)(c)(d)(e);
}
/* @__NO_SIDE_EFFECTS__ */
function A6(fun, a, b, c, d, e, f) {
  return fun.a6 ? fun.a6(a, b, c, d, e, f) : fun(a)(b)(c)(d)(e)(f);
}
/* @__NO_SIDE_EFFECTS__ */
function A7(fun, a, b, c, d, e, f, g) {
  return fun.a7 ? fun.a7(a, b, c, d, e, f, g) : fun(a)(b)(c)(d)(e)(f)(g);
}
/* @__NO_SIDE_EFFECTS__ */
function A8(fun, a, b, c, d, e, f, g, h) {
  return fun.a8 ? fun.a8(a, b, c, d, e, f, g, h) : fun(a)(b)(c)(d)(e)(f)(g)(h);
}
/* @__NO_SIDE_EFFECTS__ */
function A9(fun, a, b, c, d, e, f, g, h, i) {
  return fun.a9 ? fun.a9(a, b, c, d, e, f, g, h, i) : fun(a)(b)(c)(d)(e)(f)(g)(h)(i);
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

function _Scheduler_concurrent(tasks) {
  if (tasks.length === 0) return _Scheduler_succeed([]);

  return _Scheduler_binding(function (callback) {
    let count = 0;
    let results = new Array(tasks.length);
    let procs;

    function killAll() {
      procs.forEach(_Scheduler_rawKill);
    }

    function onError(e) {
      killAll();
      callback(_Scheduler_fail(e));
    }

    procs = tasks.map((task, i) => {
      function onSuccess(res) {
        results[i] = res;
        count++;
        if (count === tasks.length) {
          callback(_Scheduler_succeed(results));
        }
      }
      const success = A2(_Scheduler_andThen, onSuccess, task);
      const handled = A2(_Scheduler_onError, onError, success);
      return _Scheduler_rawSpawn(handled);
    });

    return killAll;
  });
}

var _Scheduler_map2 = F3(function (callback, taskA, taskB) {
  function combine([resA, resB]) {
    return _Scheduler_succeed(A2(callback, resA, resB));
  }
  return A2(_Scheduler_andThen, combine, _Scheduler_concurrent([taskA, taskB]));
});

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
    _Scheduler_rawKill(proc);

    callback(_Scheduler_succeed({}));
  });
}

function _Scheduler_rawKill(proc) {
  var task = proc.f;
  if (task && task.$ === 2 && task.c) {
    task.c();
  }

  proc.f = null;
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
  // Make sure tasks created during _step are run
  while (_Scheduler_queue.length > 0) {
    const activeProcs = _Scheduler_queue;
    _Scheduler_queue = [];

    for (const proc of activeProcs) {
      _Scheduler_step(proc);
    }
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


var stream = require("node:stream");
var process = require("node:process");

var _Node_log = F2(function (text, args) {
  // This function is used for simple applications where the main function returns String
  // NOTE: this function needs _Platform_export available to work
  console.log(text);
  return {};
});

var _Node_init = _Scheduler_binding(function (callback) {
  if (process.stdin.unref) {
    // Don't block program shutdown if this is the only
    // stream being listened to
    process.stdin.unref();
  }

  const stdinStream = stream.Readable.toWeb(process.stdin);
  const stdinProxy = !process.stdin.ref
    ? stdinStream
    : _Node_makeProxyOfStdin(stdinStream);

  callback(
    _Scheduler_succeed({
      b4: _FilePath_fromString(
        typeof module !== "undefined" ? module.filename : process.execPath,
      ),
      b5: process.arch,
      aH: process.argv,
      c1: process.platform,
      dh: stream.Writable.toWeb(process.stderr),
      K: stdinProxy,
      di: stream.Writable.toWeb(process.stdout),
    }),
  );
});

function _Node_makeProxyOfStdin(stdinStream) {
  return new Proxy(stdinStream, {
    get(target, prop, receiver) {
      if (prop === "getReader") {
        // Make sure to keep program alive if we're waiting for
        // user input
        process.stdin.ref();

        const reader = Reflect.get(target, prop, receiver);
        return _Node_makeProxyOfReader(reader);
      }

      if (prop === "pipeThrough") {
        process.stdin.ref();
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}

function _Node_makeProxyOfReader(reader) {
  return new Proxy(reader, {
    get(target, prop, receiver) {
      if (prop === "releaseLock") {
        process.stdin.unref();
      }

      return Reflect.get(target, prop, receiver);
    },
  });
}

var _Node_getPlatform = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(process.platform));
});

var _Node_getCpuArchitecture = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(process.arch));
});

var _Node_getEnvironmentVariables = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_Node_objToDict(process.env)));
});

var _Node_exitWithCode = function (code) {
  return A2(
    $gren_lang$core$Task$perform,
    $gren_lang$core$Basics$never,
    _Scheduler_binding(function (callback) {
      process.exit(code);
    }),
  );
};

var _Node_setExitCode = function (code) {
  return _Scheduler_binding(function (callback) {
    process.exitCode = code;
    callback(_Scheduler_succeed({}));
  });
};

// Subs

var _Node_attachEmptyEventLoopListener = function (selfMsg) {
  return _Scheduler_binding(function (_callback) {
    var listener = function () {
      _Scheduler_rawSpawn(selfMsg);
    };

    process.on("beforeExit", listener);

    return function () {
      process.off("beforeExit", listener);
    };
  });
};

var _Node_attachSignalInterruptListener = function (selfMsg) {
  return _Scheduler_binding(function (_callback) {
    var listener = function () {
      _Scheduler_rawSpawn(selfMsg);
    };

    process.on("SIGINT", listener);

    return function () {
      process.off("SIGINT", listener);
    };
  });
};

var _Node_attachSignalTerminateListener = function (selfMsg) {
  return _Scheduler_binding(function (_callback) {
    var listener = function () {
      _Scheduler_rawSpawn(selfMsg);
    };

    process.on("SIGTERM", listener);

    return function () {
      process.off("SIGTERM", listener);
    };
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

  let dirStr = result.dir.startsWith(root)
    ? result.dir.substring(root.length)
    : result.dir;

  if (str.startsWith(`.${path.sep}`)) {
    dirStr = `.${path.sep}` + dirStr;
  }

  const filename =
    result.name === "." && result.ext.length === 0 ? "" : result.name;

  return {
    N:
      dirStr === ""
        ? []
        : dirStr.split(pathMod.sep).filter((dir) => dir.length > 0),
    l: result.ext.length > 0 ? result.ext.substring(1) : "",
    m: filename,
    dd: result.root,
  };
};

var _FilePath_toPosix = function (filePath) {
  if (_FilePath_isEmpty(filePath)) {
    return ".";
  }

  if (filePath.dd !== "" && filePath.dd !== "/") {
    filePath = { ...filePath, dd: "/" };
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
    filePath.dd === "" &&
    filePath.N.length === 0 &&
    filePath.m === "" &&
    filePath.l === ""
  );
};

var _FilePath_format = function (pathMod, filePath) {
  const filename =
    filePath.l.length > 0
      ? filePath.m + "." + filePath.l
      : filePath.m;

  let pathArray = null;
  if (filename === "") {
    pathArray = filePath.N;
  } else {
    pathArray = filePath.N.concat(filename);
  }

  return filePath.dd + pathArray.join(pathMod.sep);
};


// PROGRAMS

var _Platform_worker = F3(function (impl, flagDecoder, args) {
  return _Platform_initialize(
    flagDecoder,
    args,
    impl.cJ,
    impl.dr,
    impl.dl,
    function () {
      return function () {};
    },
  );
});

// INITIALIZE A PROGRAM

function _Platform_initialize(
  flagDecoder,
  args,
  init,
  update,
  subscriptions,
  stepperBuilder,
) {
  var result = A2(
    _Json_run,
    flagDecoder,
    _Json_wrap(args ? args["flags"] : undefined),
  );
  $gren_lang$core$Result$isOk(result) ||
    _Debug_crash(2 /**_UNUSED/, _Json_errorToString(result.a) /**/);

  _Platform_setupTaskPorts(args ? args["taskPorts"] : undefined);

  var managers = {};
  var initPair = init(result.a);
  var model = initPair.aO;
  var stepper = stepperBuilder(sendToApp, model);
  var ports = _Platform_setupEffects(managers, sendToApp, executeCmd);

  function sendToApp(msg, viewMetadata) {
    var pair = A2(update, msg, model);
    stepper((model = pair.aO), viewMetadata);
    _Platform_enqueueEffects(managers, pair.aI, subscriptions(model));
  }

  function executeCmd(cmd) {
    _Platform_enqueueEffects(managers, cmd, subscriptions(model));
  }

  _Platform_enqueueEffects(managers, initPair.aI, subscriptions(model));

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

function _Platform_setupEffects(managers, sendToApp, executeCmd) {
  var ports;

  // setup all necessary effect managers
  for (var key in _Platform_effectManagers) {
    var manager = _Platform_effectManagers[key];

    if (manager.a) {
      ports = ports || {};
      ports[key] = manager.a(key, sendToApp);
    }

    managers[key] = _Platform_instantiateManager(
      manager,
      sendToApp,
      executeCmd,
    );
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

function _Platform_instantiateManager(info, sendToApp, executeCmd) {
  var router = {
    g: sendToApp,
    h: executeCmd,
    i: undefined,
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
          ? A4(onEffects, router, value.j, value.k, state)
          : A3(onEffects, router, cmdMap ? value.j : value.k, state);
      }),
    );
  }

  return (router.i = _Scheduler_rawSpawn(
    A2(_Scheduler_andThen, loop, info.b),
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
  return A2(_Scheduler_send, router.i, {
    $: 0,
    a: msg,
  });
});

var _Platform_executeCmd = F2(function (router, cmd) {
  return _Scheduler_binding(function (callback) {
    router.h(cmd);
    callback(_Scheduler_succeed({}));
  });
});

// BAGS

function _Platform_leaf(home) {
  return function (value) {
    return {
      $: 1,
      l: home,
      m: value,
    };
  };
}

function _Platform_batch(array) {
  return {
    $: 2,
    n: array,
  };
}

var _Platform_map = F2(function (tagger, bag) {
  return {
    $: 3,
    o: tagger,
    p: bag,
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
    q: managers,
    r: cmdBag,
    s: subBag,
  });

  if (_Platform_effectsActive) return;

  _Platform_effectsActive = true;
  while (_Platform_effectsQueue.length > 0) {
    const activeEffects = _Platform_effectsQueue;
    _Platform_effectsQueue = [];

    for (const fx of activeEffects) {
      _Platform_dispatchEffects(fx.q, fx.r, fx.s);
    }
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
      a: effectsDict[home] || { j: [], k: [] },
    });
  }
}

function _Platform_gatherEffects(isCmd, bag, effectsDict, taggers) {
  switch (bag.$) {
    case 1:
      var home = bag.l;
      var effect = _Platform_toEffect(isCmd, home, taggers, bag.m);
      effectsDict[home] = _Platform_insert(isCmd, effect, effectsDict[home]);
      return;

    case 2:
      var bags = bag.n;
      for (var idx = 0; idx < bags.length; idx++) {
        _Platform_gatherEffects(isCmd, bags[idx], effectsDict, taggers);
      }
      return;

    case 3:
      _Platform_gatherEffects(isCmd, bag.p, effectsDict, {
        t: bag.o,
        u: taggers,
      });
      return;
  }
}

function _Platform_toEffect(isCmd, home, taggers, value) {
  function applyTaggers(x) {
    for (var temp = taggers; temp; temp = temp.u) {
      x = temp.t(x);
    }
    return x;
  }

  var map = isCmd
    ? _Platform_effectManagers[home].e
    : _Platform_effectManagers[home].f;

  return A2(map, applyTaggers, value);
}

function _Platform_insert(isCmd, newEffect, effects) {
  effects = effects || { j: [], k: [] };

  isCmd
    ? (effects.j = A2($gren_lang$core$Array$pushLast, newEffect, effects.j))
    : (effects.k = A2($gren_lang$core$Array$pushLast, newEffect, effects.k));

  return effects;
}

// PORTS

function _Platform_checkPortName(name) {
  if (_Platform_effectManagers[name]) {
    _Debug_crash(3, name);
  }

  if (_Platform_taskPorts[name]) {
    _Debug_crash(3, name);
  }
}

// OUTGOING PORTS

function _Platform_outgoingPort(name, converter) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    e: _Platform_outgoingPortMap,
    v: converter,
    a: _Platform_setupOutgoingPort,
  };
  return _Platform_leaf(name);
}

var _Platform_outgoingPortMap = F2(function (tagger, value) {
  return value;
});

function _Platform_setupOutgoingPort(name) {
  var subs = [];
  var converter = _Platform_effectManagers[name].v;

  // CREATE MANAGER

  var init = _Process_sleep(0);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(
    function (router, cmdArray, state) {
      for (var idx = 0; idx < cmdArray.length; idx++) {
        // grab a separate reference to subs in case unsubscribe is called
        var currentSubs = subs;
        var value = _Json_unwrap(converter(cmdArray[idx]));
        for (var subIdx = 0; subIdx < currentSubs.length; subIdx++) {
          currentSubs[subIdx](value);
        }
      }
      return init;
    },
  );

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
    v: converter,
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
  var converter = _Platform_effectManagers[name].v;

  // CREATE MANAGER

  var init = _Scheduler_succeed(null);

  _Platform_effectManagers[name].b = init;
  _Platform_effectManagers[name].c = F3(
    function (router, subArray, state) {
      subs = subArray;
      return init;
    },
  );

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

// TASK PORTS

var _Platform_taskPorts = {};

function _Platform_taskPort(name, inputConverter, converter) {
  _Platform_checkPortName(name);
  _Platform_taskPorts[name] = {};

  return function (input) {
    var encodedInput = inputConverter
      ? _Json_unwrap(inputConverter(input))
      : null;

    return _Scheduler_binding(function (callback) {
      var promise;
      try {
        promise = _Platform_taskPorts[name](encodedInput);
      } catch (e) {
        throw new Error(
          "Registered code for task-based port named '" + name + "'  crashed.",
          { cause: e },
        );
      }

      if (!(promise instanceof Promise)) {
        throw new Error(
          "Handler for task port named '" +
            name +
            "' did not return a Promise.",
        );
      }

      promise.then(
        function (value) {
          var result = A2(_Json_run, converter, _Json_wrap(value));

          $gren_lang$core$Result$isOk(result) || _Debug_crash(4, name, value);

          callback(_Scheduler_succeed(result.a));
        },
        function (err) {
          // If Error, convert to plain object. This is because Error doesn't have enumerable
          // properties.
          if (err instanceof Error) {
            var newErr = {};
            Object.getOwnPropertyNames(err).forEach(function (key) {
              newErr[key] = err[key];
            });

            err = newErr;
          }

          callback(_Scheduler_fail(_Json_wrap(err)));
        },
      );
    });
  };
}

function _Platform_setupTaskPorts(registeredPorts) {
  if (typeof registeredPorts !== "object") {
    registeredPorts = {};
  }

  for (var key in registeredPorts) {
    if (!(key in _Platform_taskPorts)) {
      // TODO: proper way to crash program
      throw new Error(
        key + " isn't defined as a task-based port in Gren code.",
      );
    }
  }

  for (var key in _Platform_taskPorts) {
    var handler = registeredPorts[key];
    if (!handler) {
      throw new Error("No handler defined for task port named '" + key + "'.");
    }

    if (!(handler instanceof Function)) {
      throw new Error(
        "Handler for task port named '" + key + "' is not a function.",
      );
    }

    _Platform_taskPorts[key] = handler;
  }
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
            exports[name],
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
      '"' + _Debug_addSlashes(value, false) + '"',
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
            value,
          ),
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

  if (value instanceof DataView) {
    return _Debug_stringColor(ansi, "<" + value.byteLength + " bytes>");
  }

  if (typeof File !== "undefined" && value instanceof File) {
    return _Debug_internalColor(ansi, "<" + value.name + ">");
  }

  if (
    typeof _Array_Builder !== "undefined" &&
    value instanceof _Array_Builder
  ) {
    return _Debug_toAnsiString(ansi, value.Y.slice(0, value.aD));
  }

  if (typeof value === "object") {
    var output = [];
    for (var key in value) {
      var field = key[0] === "_" ? key.slice(1) : key;
      output.push(
        _Debug_fadeColor(ansi, field) +
          " = " +
          _Debug_toAnsiString(ansi, value[key]),
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
    "https://github.com/gren-lang/core/blob/1.0.0/hints/" + identifier + ".md",
  );
}

function _Debug_crash_UNUSED(identifier, fact1, fact2, fact3, fact4) {
  switch (identifier) {
    case 0:
      throw new Error(
        'What node should I take over? In JavaScript I need something like:\n\n    Gren.Main.init({\n        node: document.getElementById("gren-node")\n    })\n\nYou need to do this with any Browser.sandbox or Browser.element program.',
      );

    case 1:
      throw new Error(
        "Browser.application programs cannot handle URLs like this:\n\n    " +
          document.location.href +
          "\n\nWhat is the root? The root of your file system?",
      );

    case 2:
      var jsonErrorString = fact1;
      throw new Error(
        "Problem with the flags given to your Gren program on initialization.\n\n" +
          jsonErrorString,
      );

    case 3:
      var portName = fact1;
      throw new Error(
        "There can only be one port named `" +
          portName +
          "`, but your program has multiple.",
      );

    case 4:
      var portName = fact1;
      var problem = fact2;
      throw new Error(
        "Trying to send an unexpected type of value through port `" +
          portName +
          "`:\n" +
          problem,
      );

    case 5:
      throw new Error(
        'Trying to use `(==)` on functions.\nThere is no way to know if functions are "the same" in the Gren sense.\nRead more about this at https://package.gren-lang.org/packages/gren-lang/core/latest/Basics#== which describes why it is this way and what the better version will look like.',
      );

    case 6:
      var moduleName = fact1;
      throw new Error(
        "Your page is loading multiple Gren scripts with a module named " +
          moduleName +
          ". Maybe a duplicate script is getting loaded accidentally? If not, rename one of them so I know which is which!",
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
          message,
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
          message.replace("\n", "\n    "),
      );

    case 10:
      throw new Error("Bug in https://github.com/gren-lang/core/issues");

    case 11:
      throw new Error("Cannot perform mod 0. Division by zero error.");
  }
}

function _Debug_regionToString(region) {
  if (region.aV.ad === region.be.ad) {
    return "on line " + region.aV.ad;
  }
  return (
    "on lines " + region.aV.ad + " through " + region.be.ad
  );
}
var $gren_lang$core$Dict$foldl$ = function(func, acc, dict) {
	foldl:
	while (true) {
		if (dict.$ === -2) {
			return acc;
		} else {
			var _v1 = dict.a;
			var key = _v1.Q;
			var value = _v1.D;
			var left = _v1.cT;
			var right = _v1.dc;
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

  if (typeof value === "undefined") {
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

var _Array_splice0 = F3(function (index, toRemove, array) {
  return array.toSpliced(index, toRemove);
});

var _Array_splice1 = F4(function (index, toRemove, toAdd, array) {
  return array.toSpliced(index, toRemove, toAdd);
});

var _Array_spliceN = F4(function (index, toRemove, toAdd, array) {
  return array.toSpliced(index, toRemove, ...toAdd);
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

var _Array_indexedFilter = F2(function (func, array) {
  return array.filter(function (value, index) {
    return A2(func, index, value);
  });
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
      return $gren_lang$core$Maybe$Just({ P: i, D: element });
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_findLast = F2(function (pred, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just({ P: i, D: element });
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

class _Array_Builder {
  constructor(target, finalized, array) {
    this.aD = target;
    this.ab = finalized;
    this.Y = array;
  }
}

var _Array_emptyBuilder = function (capacity) {
  return new _Array_Builder(0, false, new Array(capacity));
};

var _Array_pushToBuilder = F2(function (value, builder) {
  var array = builder.Y;
  var target = builder.aD;

  if (builder.ab) {
    array = array.slice(0, target);
  } else {
    builder.ab = true;
  }

  if (target < array.length) {
    array[target] = value;
  } else {
    array.push(value);
  }

  return new _Array_Builder(target + 1, false, array);
});

var _Array_appendToBuilder = F2(function (array, builder) {
  var newArray = _Array_fromBuilder(builder);

  for (var i = 0; i < array.length; i++) {
    newArray.push(array[i]);
  }

  return new _Array_Builder(newArray.length, false, newArray);
});

var _Array_toBuilder = function (array) {
  return new _Array_Builder(array.length, true, array);
};

var _Array_fromBuilder = function (builder) {
  var result = builder.Y;

  if (builder.ab) {
    result = result.slice(0, builder.aD);
  } else {
    builder.ab = true;
    result.length = builder.aD;
  }

  return result;
};


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
		x = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], x);
		y = A3($gren_lang$core$Dict$foldl, F3(function(key, value, acc) { acc.push({ a: key, b: value }); return acc; }), [], y);
	}
	//*/

  /**/
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

    return true;
  }

  if (x instanceof _Array_Builder) {
    x = _Array_fromBuilder(x);
    y = _Array_fromBuilder(y);
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
var $gren_lang$core$Maybe$Just = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Maybe$Nothing = { $: 1 };
var $gren_lang$core$Array$length = _Array_length;
var $gren_lang$core$Array$pushLast$ = function(value, array) {
	return A4(_Array_splice1, $gren_lang$core$Array$length(array), 0, value, array);
};
var $gren_lang$core$Array$pushLast = F2($gren_lang$core$Array$pushLast$);
var $gren_lang$core$Dict$keys = function(dict) {
	return $gren_lang$core$Dict$foldl$(F3(function(key, value, keyArray) {
				return $gren_lang$core$Array$pushLast$(key, keyArray);
			}), [  ], dict);
};
var $gren_lang$core$Set$toArray = function(_v0) {
	var dict = _v0;
	return $gren_lang$core$Dict$keys(dict);
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
      $gren_lang$core$Json$Decode$Failure({
        cU: "This is not valid JSON! " + e.message,
        D: _Json_wrap(string),
      }),
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
          value,
        );
      }
      var result = _Json_runHelp(decoder.b, value[field]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Field({ bz: field, as: result.a }));

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
          value,
        );
      }
      var result = _Json_runHelp(decoder.b, value[index]);
      return $gren_lang$core$Result$isOk(result)
        ? result
        : $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Index({ P: index, as: result.a }));

    case 7:
      if (typeof value !== "object" || value === null || _Json_isArray(value)) {
        return _Json_expecting("an OBJECT", value);
      }

      var keyValuePairs = [];
      for (var key in value) {
        if (value.hasOwnProperty(key)) {
          var result = _Json_runHelp(decoder.b, value[key]);
          if (!$gren_lang$core$Result$isOk(result)) {
            return $gren_lang$core$Result$Err(
              $gren_lang$core$Json$Decode$Field({ bz: key, as: result.a }),
            );
          }
          keyValuePairs.push({ Q: key, D: result.a });
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
      return $gren_lang$core$Result$Err(
        $gren_lang$core$Json$Decode$Failure({
          cU: decoder.a,
          D: _Json_wrap(value),
        }),
      );

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
      return $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Index({ P: i, as: result.a }));
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
    $gren_lang$core$Json$Decode$Failure({
      cU: "Expecting " + type,
      D: _Json_wrap(value),
    }),
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
var $gren_lang$core$Json$Decode$Failure = function (a) {
	return { $: 3, a: a };
};
var $gren_lang$core$Json$Decode$Field = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Json$Decode$Index = function (a) {
	return { $: 1, a: a };
};
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


var _String_pushFirst = F2(function (char, string) {
  return char + string;
});

var _String_pushLast = F2(function (char, string) {
  return string + char;
});

var _String_popFirst = function (string) {
  if (string.length <= 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  var firstPointNumber = string.codePointAt(0);
  var firstChar = String.fromCodePoint(firstPointNumber);

  return $gren_lang$core$Maybe$Just({
    n: _Utils_chr(firstChar),
    db: string.slice(firstChar.length),
  });
};

var _String_popLast = function (string) {
  if (string.length <= 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  var possibleLastPointIdx = string.length - 2;
  var possibleLastPoint = string.codePointAt(possibleLastPointIdx);

  if (possibleLastPoint === string.charCodeAt(possibleLastPointIdx)) {
    // last char is a unit
    return $gren_lang$core$Maybe$Just({
      aL: _Utils_chr(string[string.length - 1]),
      db: string.slice(string.length - 1),
    });
  }

  // last char is a point
  return $gren_lang$core$Maybe$Just({
    aL: _Utils_chr(String.fromCodePoint(possibleLastPoint)),
    db: string.slice(string.length - 2),
  });
};

var _String_append = F2(function (a, b) {
  return a + b;
});

var _String_repeat = F2(function (num, chunk) {
  try {
    return chunk.repeat(num);
  } catch (error) {
    if (error.name === "RangeError") {
      return "";
    } else {
      throw error;
    }
  }
});

var _String_foldl = F3(function (func, state, string) {
  for (let char of string) {
    state = A2(func, _Utils_chr(char), state);
  }

  return state;
});

var _String_foldr = F3(function (func, state, string) {
  let reversed = [];

  for (let char of string) {
    reversed.unshift(char);
  }

  for (let char of reversed) {
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
  if (start < 0) {
    start = str.length + start;
  }

  if (end < 0) {
    end = str.length + end;
  }

  if (start >= end) {
    return "";
  }

  let index = 0;
  let result = "";

  for (let char of str) {
    if (index < start) {
      index++;
      continue;
    }

    if (index >= end) {
      break;
    }

    result += char;
    index++;
  }

  return result;
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
  for (let char of string) {
    if (isGood(_Utils_chr(char))) {
      return true;
    }
  }

  return false;
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

var _String_indexOf = F2(function (sub, str) {
  var ret = str.indexOf(sub);

  if (ret > -1) {
    return $gren_lang$core$Maybe$Just(ret);
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _String_lastIndexOf = F2(function (sub, str) {
  var ret = str.lastIndexOf(sub);

  if (ret > -1) {
    return $gren_lang$core$Maybe$Just(ret);
  }

  return $gren_lang$core$Maybe$Nothing;
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

// UNITS

var _String_unitLength = function (str) {
  return str.length;
};

var _String_getUnit = F2(function (index, str) {
  var ret = str.at(index);

  if (typeof ret === "undefined") {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just(_Utils_chr(char));
});

var _String_foldlUnits = F3(function (fn, state, str) {
  for (let i = 0; i < str.length; i++) {
    state = A2(fn, str[i], state);
  }

  return state;
});

var _String_foldrUnits = F3(function (fn, state, str) {
  for (let i = str.length - 1; i < 0; i--) {
    state = A2(fn, str[i], state);
  }

  return state;
});
var $gren_lang$core$String$any = _String_any;
var $gren_lang$core$Basics$composeL$ = function(g, f) {
	return function(x) {
		return g(f(x));
	};
};
var $gren_lang$core$Basics$composeL = F2($gren_lang$core$Basics$composeL$);
var $gren_lang$core$Basics$not = _Basics_not;
var $gren_lang$core$String$all$ = function(isGood, str) {
	return !A2($gren_lang$core$String$any, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$not, isGood), str);
};
var $gren_lang$core$String$all = F2($gren_lang$core$String$all$);
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
  return char.codePointAt(0);
}

function _Char_fromCode(code) {
  return _Utils_chr(String.fromCodePoint(code));
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
var $gren_lang$core$String$popFirst = _String_popFirst;
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
			case 0:
				var _v1 = error.a;
				var f = _v1.bz;
				var err = _v1.as;
				var isSimple = function () {
					var _v2 = $gren_lang$core$String$popFirst(f);
					if (_v2.$ === 1) {
						return false;
					} else {
						var _v3 = _v2.a;
						var _char = _v3.n;
						var rest = _v3.db;
						return $gren_lang$core$Char$isAlpha(_char) && $gren_lang$core$String$all$($gren_lang$core$Char$isAlphaNum, rest);
					}
				}();
				var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
				var $temp$error = err,
				$temp$context = _Utils_ap([ fieldName ], context);
				error = $temp$error;
				context = $temp$context;
				continue errorToStringHelp;
			case 1:
				var _v4 = error.a;
				var i = _v4.P;
				var err = _v4.as;
				var indexName = '[' + ($gren_lang$core$String$fromInt(i) + ']');
				var $temp$error = err,
				$temp$context = _Utils_ap([ indexName ], context);
				error = $temp$error;
				context = $temp$context;
				continue errorToStringHelp;
			case 2:
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
				var _v8 = error.a;
				var msg = _v8.cU;
				var json = _v8.D;
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
var $gren_lang$core$Basics$never = function(_v0) {
	never:
	while (true) {
		var nvr = _v0;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $gren_lang$core$Task$Perform = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$core$Task$succeed = _Scheduler_succeed;
var $gren_lang$core$Task$init = $gren_lang$core$Task$succeed({  });
var $gren_lang$core$Array$map = _Array_map;
var $gren_lang$core$Task$map$ = function(func, taskA) {
	return A2($gren_lang$core$Task$andThen, function(a) {
			return $gren_lang$core$Task$succeed(func(a));
		}, taskA);
};
var $gren_lang$core$Task$map = F2($gren_lang$core$Task$map$);
var $gren_lang$core$Array$foldr = _Array_foldr;
var $gren_lang$core$Array$pushFirst$ = function(value, array) {
	return A4(_Array_splice1, 0, 0, value, array);
};
var $gren_lang$core$Array$pushFirst = F2($gren_lang$core$Array$pushFirst$);
var $gren_lang$core$Task$sequence = A2($gren_lang$core$Array$foldr, F2(function(task, combined) {
			return A2($gren_lang$core$Task$andThen, function(x) {
					return $gren_lang$core$Task$map$($gren_lang$core$Array$pushFirst(x), combined);
				}, task);
		}), $gren_lang$core$Task$succeed([  ]));
var $gren_lang$core$Platform$sendToApp = _Platform_sendToApp;
var $gren_lang$core$Task$spawnCmd$ = function(router, cmd) {
	switch (cmd.$) {
		case 0:
			var task = cmd.a;
			return _Scheduler_spawn(A2($gren_lang$core$Task$andThen, $gren_lang$core$Platform$sendToApp(router), task));
		case 1:
			var task = cmd.a;
			return _Scheduler_spawn(A2($gren_lang$core$Task$andThen, _Platform_executeCmd(router), task));
		default:
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
	return { $: 2, a: a };
};
var $gren_lang$core$Task$ExecuteCmd = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Platform$Cmd$map = _Platform_map;
var $gren_lang$core$Task$cmdMap$ = function(tagger, cmd) {
	switch (cmd.$) {
		case 0:
			var task = cmd.a;
			return $gren_lang$core$Task$Perform($gren_lang$core$Task$map$(tagger, task));
		case 1:
			var task = cmd.a;
			return $gren_lang$core$Task$ExecuteCmd($gren_lang$core$Task$map$($gren_lang$core$Platform$Cmd$map(tagger), task));
		default:
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
var $gren_lang$core$Dict$Black = 1;
var $gren_lang$core$Dict$RBNode_gren_builtin = function (a) {
	return { $: -1, a: a };
};
var $gren_lang$core$Dict$node$ = function(color, key, value, left, right) {
	return $gren_lang$core$Dict$RBNode_gren_builtin({ cl: color, Q: key, cT: left, dc: right, D: value });
};
var $gren_lang$core$Dict$node = F5($gren_lang$core$Dict$node$);
var $gren_lang$core$Dict$Red = 0;
var $gren_lang$core$Dict$balance$ = function(color, key, value, left, right) {
	if ((right.$ === -1) && (!right.a.cl)) {
		var _v1 = right.a;
		var _v2 = _v1.cl;
		var rK = _v1.Q;
		var rV = _v1.D;
		var rLeft = _v1.cT;
		var rRight = _v1.dc;
		if ((left.$ === -1) && (!left.a.cl)) {
			var _v4 = left.a;
			var _v5 = _v4.cl;
			var lK = _v4.Q;
			var lV = _v4.D;
			var lLeft = _v4.cT;
			var lRight = _v4.dc;
			return $gren_lang$core$Dict$node$(0, key, value, $gren_lang$core$Dict$node$(1, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$(1, rK, rV, rLeft, rRight));
		} else {
			return $gren_lang$core$Dict$node$(color, rK, rV, $gren_lang$core$Dict$node$(0, key, value, left, rLeft), rRight);
		}
	} else {
		if ((((left.$ === -1) && (!left.a.cl)) && (left.a.cT.$ === -1)) && (!left.a.cT.a.cl)) {
			var _v7 = left.a;
			var _v8 = _v7.cl;
			var lK = _v7.Q;
			var lV = _v7.D;
			var _v9 = _v7.cT.a;
			var _v10 = _v9.cl;
			var llK = _v9.Q;
			var llV = _v9.D;
			var llLeft = _v9.cT;
			var llRight = _v9.dc;
			var lRight = _v7.dc;
			return $gren_lang$core$Dict$node$(0, lK, lV, $gren_lang$core$Dict$node$(1, llK, llV, llLeft, llRight), $gren_lang$core$Dict$node$(1, key, value, lRight, right));
		} else {
			return $gren_lang$core$Dict$node$(color, key, value, left, right);
		}
	}
};
var $gren_lang$core$Dict$balance = F5($gren_lang$core$Dict$balance$);
var $gren_lang$core$Basics$compare = _Utils_compare;
var $gren_lang$core$Dict$setHelp$ = function(key, value, dict) {
	if (dict.$ === -2) {
		return $gren_lang$core$Dict$node$(0, key, value, $gren_lang$core$Dict$RBEmpty_gren_builtin, $gren_lang$core$Dict$RBEmpty_gren_builtin);
	} else {
		var _v1 = dict.a;
		var nColor = _v1.cl;
		var nKey = _v1.Q;
		var nValue = _v1.D;
		var nLeft = _v1.cT;
		var nRight = _v1.dc;
		var _v2 = A2($gren_lang$core$Basics$compare, key, nKey);
		switch (_v2) {
			case 0:
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$setHelp$(key, value, nLeft), nRight);
			case 1:
				return $gren_lang$core$Dict$node$(nColor, nKey, value, nLeft, nRight);
			default:
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, nLeft, $gren_lang$core$Dict$setHelp$(key, value, nRight));
		}
	}
};
var $gren_lang$core$Dict$setHelp = F3($gren_lang$core$Dict$setHelp$);
var $gren_lang$core$Dict$set$ = function(setKey, setValue, dict) {
	var _v0 = $gren_lang$core$Dict$setHelp$(setKey, setValue, dict);
	if ((_v0.$ === -1) && (!_v0.a.cl)) {
		var _v1 = _v0.a;
		var _v2 = _v1.cl;
		var key = _v1.Q;
		var value = _v1.D;
		var left = _v1.cT;
		var right = _v1.dc;
		return $gren_lang$core$Dict$node$(1, key, value, left, right);
	} else {
		var x = _v0;
		return x;
	}
};
var $gren_lang$core$Dict$set = F3($gren_lang$core$Dict$set$);
var $gren_lang$node$Node$Arm = { $: 0 };
var $gren_lang$node$Node$Arm64 = { $: 1 };
var $gren_lang$node$Node$IA32 = { $: 2 };
var $gren_lang$node$Node$Mips = { $: 3 };
var $gren_lang$node$Node$Mipsel = { $: 4 };
var $gren_lang$node$Node$PPC = { $: 5 };
var $gren_lang$node$Node$PPC64 = { $: 6 };
var $gren_lang$node$Node$S390 = { $: 7 };
var $gren_lang$node$Node$S390x = { $: 8 };
var $gren_lang$node$Node$UnknownArchitecture = function (a) {
	return { $: 10, a: a };
};
var $gren_lang$node$Node$X64 = { $: 9 };
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
var $gren_lang$node$Node$Aix = { $: 6 };
var $gren_lang$node$Node$Darwin = { $: 1 };
var $gren_lang$node$Node$FreeBSD = { $: 3 };
var $gren_lang$node$Node$Linux = { $: 2 };
var $gren_lang$node$Node$OpenBSD = { $: 4 };
var $gren_lang$node$Node$SunOS = { $: 5 };
var $gren_lang$node$Node$UnknownPlatform = function (a) {
	return { $: 7, a: a };
};
var $gren_lang$node$Node$Win32 = { $: 0 };
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
		return { b4: raw.b4, aH: raw.aH, bb: $gren_lang$node$Node$archFromString(raw.b5), c1: $gren_lang$node$Node$platformFromString(raw.c1), dh: raw.dh, K: raw.K, di: raw.di };
	}, _Node_init);
var $gren_lang$node$Node$unwrap = function(_v0) {
	var task = _v0;
	return task;
};
var $gren_lang$node$Node$initProgram$ = function(initTask, _v0) {
	return { aI: $gren_lang$core$Task$perform$($gren_lang$node$Node$InitDone, A2($gren_lang$core$Task$andThen, function(env) {
				return $gren_lang$node$Node$unwrap(initTask(env));
			}, $gren_lang$node$Node$initializeEnvironment)), aO: $gren_lang$node$Node$Uninitialized };
};
var $gren_lang$node$Node$initProgram = F2($gren_lang$node$Node$initProgram$);
var $gren_lang$node$Node$MsgReceived = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Platform$Sub$map = _Platform_map;
var $gren_lang$core$Platform$Sub$batch = _Platform_batch;
var $gren_lang$core$Platform$Sub$none = $gren_lang$core$Platform$Sub$batch([  ]);
var $gren_lang$node$Node$subscriptions$ = function(appSubs, model) {
	if (!model.$) {
		return $gren_lang$core$Platform$Sub$none;
	} else {
		var appModel = model.a;
		return A2($gren_lang$core$Platform$Sub$map, $gren_lang$node$Node$MsgReceived, appSubs(appModel));
	}
};
var $gren_lang$node$Node$subscriptions = F2($gren_lang$node$Node$subscriptions$);
var $gren_lang$node$Node$Initialized = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Platform$Cmd$batch = _Platform_batch;
var $gren_lang$core$Platform$Cmd$none = $gren_lang$core$Platform$Cmd$batch([  ]);
var $gren_lang$node$Node$update$ = function(appUpdate, msg, model) {
	if (!model.$) {
		if (!msg.$) {
			var initResult = msg.a;
			return { aI: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, initResult.aI), aO: $gren_lang$node$Node$Initialized(initResult.aO) };
		} else {
			return { aI: $gren_lang$core$Platform$Cmd$none, aO: model };
		}
	} else {
		var appModel = model.a;
		if (!msg.$) {
			return { aI: $gren_lang$core$Platform$Cmd$none, aO: model };
		} else {
			var appMsg = msg.a;
			var updateResult = A2(appUpdate, appMsg, appModel);
			return { aI: A2($gren_lang$core$Platform$Cmd$map, $gren_lang$node$Node$MsgReceived, updateResult.aI), aO: $gren_lang$node$Node$Initialized(updateResult.aO) };
		}
	}
};
var $gren_lang$node$Node$update = F3($gren_lang$node$Node$update$);
var $gren_lang$core$Platform$worker = _Platform_worker;
var $gren_lang$node$Node$defineProgram = function(config) {
	return $gren_lang$core$Platform$worker({ cJ: $gren_lang$node$Node$initProgram(config.cJ), dl: $gren_lang$node$Node$subscriptions(config.dl), dr: $gren_lang$node$Node$update(config.dr) });
};
var $gren_lang$core$Basics$identity = function(x) {
	return x;
};
var $blaix$prettynice$CLI$RanCommand = $gren_lang$core$Basics$identity;
var $gren_lang$core$Task$onError = _Scheduler_onError;
var $gren_lang$core$Task$attempt$ = function(resultToMessage, task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Perform(A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Err), A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Ok), task))));
};
var $gren_lang$core$Task$attempt = F2($gren_lang$core$Task$attempt$);
var $gren_lang$node$Internal$Init$Task = $gren_lang$core$Basics$identity;
var $gren_lang$node$Init$unwrap = function(_v0) {
	var task = _v0;
	return task;
};
var $gren_lang$node$Init$await$ = function(_v0, fn) {
	var task = _v0;
	return A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$node$Init$unwrap, fn), task);
};
var $gren_lang$node$Init$await = F2($gren_lang$node$Init$await$);
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, n, $gren_lang$core$Array$length(array), array);
};
var $gren_lang$core$Array$dropFirst = F2($gren_lang$core$Array$dropFirst$);
var $gren_lang$node$FileSystem$Permission = 0;
var $gren_lang$node$FileSystem$initialize = $gren_lang$core$Task$succeed(0);


var process = require("node:process");

var _Terminal_init = _Scheduler_binding(function (callback) {
  callback(
    _Scheduler_succeed({
      cO: process.stdout.isTTY,
      _: process.stdout.getColorDepth
        ? process.stdout.getColorDepth()
        : 0,
      cn: process.stdout.columns,
      W: process.stdout.rows,
    }),
  );
});

var _Terminal_attachListener = function (sendToApp) {
  return _Scheduler_binding(function (_callback) {
    var listener = function (data) {
      _Scheduler_rawSpawn(
        sendToApp({
          cn: process.stdout.columns,
          W: process.stdout.rows,
        }),
      );
    };

    process.stdout.on("resize", listener);

    return function () {
      process.stdout.off("resize", listener);
      process.stdout.pause();
    };
  });
};

var _Terminal_setStdInRawMode = function (toggle) {
  return _Scheduler_binding(function (callback) {
    process.stdin.setRawMode(toggle);
    callback(_Scheduler_succeed({}));
  });
};

var _Terminal_setProcessTitle = function (title) {
  return _Scheduler_binding(function (callback) {
    process.title = title;
    callback(_Scheduler_succeed({}));
  });
};
var $gren_lang$node$Terminal$Permission = 0;
var $gren_lang$node$Terminal$initialize = $gren_lang$core$Task$map$(function(raw) {
		return raw.cO ? $gren_lang$core$Maybe$Just({ _: raw._, cn: raw.cn, bH: 0, W: raw.W }) : $gren_lang$core$Maybe$Nothing;
	}, _Terminal_init);
var $joeybright$gren_args$Args$ParsingArgs = { $: 0 };
var $joeybright$gren_args$Args$ParsingOptions = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Dict$get$ = function(targetKey, dict) {
	get:
	while (true) {
		if (dict.$ === -2) {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v1 = dict.a;
			var key = _v1.Q;
			var value = _v1.D;
			var left = _v1.cT;
			var right = _v1.dc;
			var _v2 = A2($gren_lang$core$Basics$compare, targetKey, key);
			switch (_v2) {
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
};
var $gren_lang$core$Dict$get = F2($gren_lang$core$Dict$get$);
var $gren_lang$core$Maybe$map$ = function(f, maybe) {
	if (!maybe.$) {
		var value = maybe.a;
		return $gren_lang$core$Maybe$Just(f(value));
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$map = F2($gren_lang$core$Maybe$map$);
var $joeybright$gren_args$Args$LongOption = 1;
var $joeybright$gren_args$Args$Option = function (a) {
	return { $: 0, a: a };
};
var $joeybright$gren_args$Args$ShortOption = 0;
var $joeybright$gren_args$Args$String = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$parser$Parser$Advanced$Bad = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$parser$Parser$Advanced$Good = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$parser$Parser$Advanced$Parser = $gren_lang$core$Basics$identity;
var $gren_lang$parser$Parser$Advanced$andThen$ = function(callback, _v0) {
	var parseA = _v0;
	return function(s0) {
		var _v1 = parseA(s0);
		if (_v1.$ === 1) {
			var _v2 = _v1.a;
			var p = _v2.a;
			var x = _v2.d;
			return $gren_lang$parser$Parser$Advanced$Bad({ d: x, a: p });
		} else {
			var _v3 = _v1.a;
			var p1 = _v3.a;
			var a = _v3.D;
			var s1 = _v3.bU;
			var _v4 = callback(a);
			var parseB = _v4;
			var _v5 = parseB(s1);
			if (_v5.$ === 1) {
				var _v6 = _v5.a;
				var p2 = _v6.a;
				var x = _v6.d;
				return $gren_lang$parser$Parser$Advanced$Bad({ d: x, a: p1 || p2 });
			} else {
				var _v7 = _v5.a;
				var p2 = _v7.a;
				var b = _v7.D;
				var s2 = _v7.bU;
				return $gren_lang$parser$Parser$Advanced$Good({ a: p1 || p2, bU: s2, D: b });
			}
		}
	};
};
var $gren_lang$parser$Parser$Advanced$andThen = F2($gren_lang$parser$Parser$Advanced$andThen$);
var $gren_lang$parser$Parser$andThen = $gren_lang$parser$Parser$Advanced$andThen;
var $gren_lang$parser$Parser$UnexpectedChar = { $: 11 };
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$parser$Parser$Advanced$AddRight = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$parser$Parser$Advanced$Empty = { $: 0 };
var $gren_lang$parser$Parser$Advanced$fromState$ = function(s, x) {
	return $gren_lang$parser$Parser$Advanced$AddRight({ d: $gren_lang$parser$Parser$Advanced$Empty, bd: { ck: s.ck, ba: s.c, aT: x, bP: s.bP } });
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
		bC: isGood ? offset : -1, 
		bD: row, 
		bB: col 
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
		f: offset, 
		b_: total 
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
		f: offset, 
		b_: total 
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
		bC: newOffset, 
		bD: row, 
		bB: col 
	};
});
var $gren_lang$parser$Parser$Advanced$isSubChar = _Parser_isSubChar;
var $gren_lang$core$Basics$negate = function(n) {
	return -n;
};
var $gren_lang$parser$Parser$Advanced$chompIf$ = function(isGood, expecting) {
	return function(s) {
		var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, s.f, s.b);
		return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad({ d: $gren_lang$parser$Parser$Advanced$fromState$(s, expecting), a: false }) : (_Utils_eq(newOffset, -2) ? $gren_lang$parser$Parser$Advanced$Good({ a: true, bU: { ck: 1, c: s.c, e: s.e, f: s.f + 1, bP: s.bP + 1, b: s.b }, D: {  } }) : $gren_lang$parser$Parser$Advanced$Good({ a: true, bU: { ck: s.ck + 1, c: s.c, e: s.e, f: newOffset, bP: s.bP, b: s.b }, D: {  } }));
	};
};
var $gren_lang$parser$Parser$Advanced$chompIf = F2($gren_lang$parser$Parser$Advanced$chompIf$);
var $gren_lang$parser$Parser$chompIf = function(isGood) {
	return $gren_lang$parser$Parser$Advanced$chompIf$(isGood, $gren_lang$parser$Parser$UnexpectedChar);
};
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$core$String$unitLength = _String_unitLength;
var $gren_lang$parser$Parser$Advanced$chompUntilEndOr = function(str) {
	return function(s) {
		var _v0 = A5(_Parser_findSubString, str, s.f, s.bP, s.ck, s.b);
		var newOffset = _v0.bC;
		var newRow = _v0.bD;
		var newCol = _v0.bB;
		var adjustedOffset = (newOffset < 0) ? $gren_lang$core$String$unitLength(s.b) : newOffset;
		return $gren_lang$parser$Parser$Advanced$Good({ a: _Utils_cmp(s.f, adjustedOffset) < 0, bU: { ck: newCol, c: s.c, e: s.e, f: adjustedOffset, bP: newRow, b: s.b }, D: {  } });
	};
};
var $gren_lang$parser$Parser$chompUntilEndOr = $gren_lang$parser$Parser$Advanced$chompUntilEndOr;
var $gren_lang$parser$Parser$Advanced$chompWhileHelp$ = function(isGood, offset, row, col, s0) {
	chompWhileHelp:
	while (true) {
		var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, s0.b);
		if (_Utils_eq(newOffset, -1)) {
			return $gren_lang$parser$Parser$Advanced$Good({ a: _Utils_cmp(s0.f, offset) < 0, bU: { ck: col, c: s0.c, e: s0.e, f: offset, bP: row, b: s0.b }, D: {  } });
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
	return function(s) {
		return $gren_lang$parser$Parser$Advanced$chompWhileHelp$(isGood, s.f, s.bP, s.ck, s);
	};
};
var $gren_lang$parser$Parser$chompWhile = $gren_lang$parser$Parser$Advanced$chompWhile;
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$parser$Parser$Advanced$mapChompedString$ = function(func, _v0) {
	var parse = _v0;
	return function(s0) {
		var _v1 = parse(s0);
		if (_v1.$ === 1) {
			var _v2 = _v1.a;
			var p = _v2.a;
			var x = _v2.d;
			return $gren_lang$parser$Parser$Advanced$Bad({ d: x, a: p });
		} else {
			var _v3 = _v1.a;
			var p = _v3.a;
			var a = _v3.D;
			var s1 = _v3.bU;
			return $gren_lang$parser$Parser$Advanced$Good({ a: p, bU: s1, D: A2(func, A3($gren_lang$core$String$slice, s0.f, s1.f, s0.b), a) });
		}
	};
};
var $gren_lang$parser$Parser$Advanced$mapChompedString = F2($gren_lang$parser$Parser$Advanced$mapChompedString$);
var $gren_lang$parser$Parser$Advanced$getChompedString = function(parser) {
	return $gren_lang$parser$Parser$Advanced$mapChompedString$(F2(function(str, _v0) {
				return str;
			}), parser);
};
var $gren_lang$parser$Parser$getChompedString = $gren_lang$parser$Parser$Advanced$getChompedString;
var $gren_lang$parser$Parser$Advanced$map2$ = function(func, _v0, _v1) {
	var parseA = _v0;
	var parseB = _v1;
	return function(s0) {
		var _v2 = parseA(s0);
		if (_v2.$ === 1) {
			var _v3 = _v2.a;
			var pred = _v3.a;
			var x = _v3.d;
			return $gren_lang$parser$Parser$Advanced$Bad({ d: x, a: pred });
		} else {
			var _v4 = _v2.a;
			var p1 = _v4.a;
			var a = _v4.D;
			var s1 = _v4.bU;
			var _v5 = parseB(s1);
			if (_v5.$ === 1) {
				var _v6 = _v5.a;
				var p2 = _v6.a;
				var x = _v6.d;
				return $gren_lang$parser$Parser$Advanced$Bad({ d: x, a: p1 || p2 });
			} else {
				var _v7 = _v5.a;
				var p2 = _v7.a;
				var b = _v7.D;
				var s2 = _v7.bU;
				return $gren_lang$parser$Parser$Advanced$Good({ a: p1 || p2, bU: s2, D: A2(func, a, b) });
			}
		}
	};
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
var $gren_lang$parser$Parser$Advanced$Append = function (a) {
	return { $: 2, a: a };
};
var $gren_lang$core$Array$get = _Array_get;
var $gren_lang$core$Array$first = function(array) {
	return A2($gren_lang$core$Array$get, 0, array);
};
var $gren_lang$core$Array$popFirst = function(array) {
	var _v0 = $gren_lang$core$Array$first(array);
	if (!_v0.$) {
		var value = _v0.a;
		return $gren_lang$core$Maybe$Just({ n: value, db: $gren_lang$core$Array$dropFirst$(1, array) });
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$parser$Parser$Advanced$oneOfHelp$ = function(s0, bag, parsers) {
	oneOfHelp:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(parsers);
		if (_v0.$ === 1) {
			return $gren_lang$parser$Parser$Advanced$Bad({ d: bag, a: false });
		} else {
			var _v1 = _v0.a;
			var parse = _v1.n;
			var remainingParsers = _v1.db;
			var _v2 = parse(s0);
			if (!_v2.$) {
				var step = _v2;
				return step;
			} else {
				var step = _v2;
				var _v3 = step.a;
				var p = _v3.a;
				var x = _v3.d;
				if (p) {
					return step;
				} else {
					var $temp$s0 = s0,
					$temp$bag = $gren_lang$parser$Parser$Advanced$Append({ cT: bag, dc: x }),
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
	return function(s) {
		return $gren_lang$parser$Parser$Advanced$oneOfHelp$(s, $gren_lang$parser$Parser$Advanced$Empty, parsers);
	};
};
var $gren_lang$parser$Parser$oneOf = $gren_lang$parser$Parser$Advanced$oneOf;
var $gren_lang$parser$Parser$Advanced$succeed = function(a) {
	return function(s) {
		return $gren_lang$parser$Parser$Advanced$Good({ a: false, bU: s, D: a });
	};
};
var $gren_lang$parser$Parser$succeed = $gren_lang$parser$Parser$Advanced$succeed;
var $joeybright$gren_args$Args$parseArg = function () {
	var parseArgHelper = function(func) {
		return A2($gren_lang$parser$Parser$andThen, function(string) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(func(string)), $gren_lang$parser$Parser$chompIf(function(c) {
									return c === '=';
								})), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompWhile(function(_v2) {
									return true;
								}))), $gren_lang$parser$Parser$succeed(A2(func, string, '')) ]);
			}, $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr('=')));
	};
	return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v0) {
				return $gren_lang$parser$Parser$oneOf([ A2($gren_lang$parser$Parser$andThen, function(_v1) {
							return parseArgHelper(F2(function(k, v) {
										return $joeybright$gren_args$Args$Option({ Q: k, b0: 1, D: v });
									}));
						}, $gren_lang$parser$Parser$chompIf(function(c) {
								return c === '-';
							})), parseArgHelper(F2(function(k, v) {
								return $joeybright$gren_args$Args$Option({ Q: k, b0: 0, D: v });
							})) ]);
			}, $gren_lang$parser$Parser$chompIf(function(c) {
					return c === '-';
				})), A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed($joeybright$gren_args$Args$String), $gren_lang$parser$Parser$getChompedString($gren_lang$parser$Parser$chompUntilEndOr(' '))) ]);
}();
var $gren_lang$parser$Parser$problemToDeadEnd = function(p) {
	return { ck: p.ck, aT: p.aT, bP: p.bP };
};
var $gren_lang$parser$Parser$Advanced$bagToArray$ = function(bag, array) {
	bagToArray:
	while (true) {
		switch (bag.$) {
			case 0:
				return array;
			case 1:
				var _v1 = bag.a;
				var bag1 = _v1.d;
				var x = _v1.bd;
				var $temp$bag = bag1,
				$temp$array = $gren_lang$core$Array$pushFirst$(x, array);
				bag = $temp$bag;
				array = $temp$array;
				continue bagToArray;
			default:
				var _v2 = bag.a;
				var bag1 = _v2.cT;
				var bag2 = _v2.dc;
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
	var parse = _v0;
	var _v1 = parse({ ck: 1, c: [  ], e: 1, f: 0, bP: 1, b: src });
	if (!_v1.$) {
		var value = _v1.a.D;
		return $gren_lang$core$Result$Ok(value);
	} else {
		var bag = _v1.a.d;
		return $gren_lang$core$Result$Err($gren_lang$parser$Parser$Advanced$bagToArray$(bag, [  ]));
	}
};
var $gren_lang$parser$Parser$Advanced$run = F2($gren_lang$parser$Parser$Advanced$run$);
var $gren_lang$parser$Parser$run$ = function(parser, source) {
	var _v0 = $gren_lang$parser$Parser$Advanced$run$(parser, source);
	if (!_v0.$) {
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
		if ((dict.$ === -1) && (dict.a.cT.$ === -1)) {
			var left = dict.a.cT;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $gren_lang$core$Dict$moveRedLeft = function(dict) {
	if (((dict.$ === -1) && (dict.a.cT.$ === -1)) && (dict.a.dc.$ === -1)) {
		if ((dict.a.dc.a.cT.$ === -1) && (!dict.a.dc.a.cT.a.cl)) {
			var _v1 = dict.a;
			var clr = _v1.cl;
			var k = _v1.Q;
			var v = _v1.D;
			var _v2 = _v1.cT.a;
			var lClr = _v2.cl;
			var lK = _v2.Q;
			var lV = _v2.D;
			var lLeft = _v2.cT;
			var lRight = _v2.dc;
			var _v3 = _v1.dc.a;
			var rClr = _v3.cl;
			var rK = _v3.Q;
			var rV = _v3.D;
			var rLeft = _v3.cT;
			var _v4 = rLeft.a;
			var _v5 = _v4.cl;
			var rlK = _v4.Q;
			var rlV = _v4.D;
			var rlL = _v4.cT;
			var rlR = _v4.dc;
			var rRight = _v3.dc;
			return $gren_lang$core$Dict$node$(0, rlK, rlV, $gren_lang$core$Dict$node$(1, k, v, $gren_lang$core$Dict$node$(0, lK, lV, lLeft, lRight), rlL), $gren_lang$core$Dict$node$(1, rK, rV, rlR, rRight));
		} else {
			var _v6 = dict.a;
			var clr = _v6.cl;
			var k = _v6.Q;
			var v = _v6.D;
			var _v7 = _v6.cT.a;
			var lClr = _v7.cl;
			var lK = _v7.Q;
			var lV = _v7.D;
			var lLeft = _v7.cT;
			var lRight = _v7.dc;
			var _v8 = _v6.dc.a;
			var rClr = _v8.cl;
			var rK = _v8.Q;
			var rV = _v8.D;
			var rLeft = _v8.cT;
			var rRight = _v8.dc;
			return $gren_lang$core$Dict$node$(1, k, v, $gren_lang$core$Dict$node$(0, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$(0, rK, rV, rLeft, rRight));
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$moveRedRight = function(dict) {
	if (((dict.$ === -1) && (dict.a.cT.$ === -1)) && (dict.a.dc.$ === -1)) {
		if ((dict.a.cT.a.cT.$ === -1) && (!dict.a.cT.a.cT.a.cl)) {
			var _v1 = dict.a;
			var clr = _v1.cl;
			var k = _v1.Q;
			var v = _v1.D;
			var _v2 = _v1.cT.a;
			var lClr = _v2.cl;
			var lK = _v2.Q;
			var lV = _v2.D;
			var _v3 = _v2.cT.a;
			var _v4 = _v3.cl;
			var llK = _v3.Q;
			var llV = _v3.D;
			var llLeft = _v3.cT;
			var llRight = _v3.dc;
			var lRight = _v2.dc;
			var _v5 = _v1.dc.a;
			var rClr = _v5.cl;
			var rK = _v5.Q;
			var rV = _v5.D;
			var rLeft = _v5.cT;
			var rRight = _v5.dc;
			return $gren_lang$core$Dict$node$(0, lK, lV, $gren_lang$core$Dict$node$(1, llK, llV, llLeft, llRight), $gren_lang$core$Dict$node$(1, k, v, lRight, $gren_lang$core$Dict$node$(0, rK, rV, rLeft, rRight)));
		} else {
			var _v6 = dict.a;
			var clr = _v6.cl;
			var k = _v6.Q;
			var v = _v6.D;
			var _v7 = _v6.cT.a;
			var lClr = _v7.cl;
			var lK = _v7.Q;
			var lV = _v7.D;
			var lLeft = _v7.cT;
			var lRight = _v7.dc;
			var _v8 = _v6.dc.a;
			var rClr = _v8.cl;
			var rK = _v8.Q;
			var rV = _v8.D;
			var rLeft = _v8.cT;
			var rRight = _v8.dc;
			return $gren_lang$core$Dict$node$(1, k, v, $gren_lang$core$Dict$node$(0, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$(0, rK, rV, rLeft, rRight));
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT$ = function(targetKey, dict, color, key, value, left, right) {
	if ((left.$ === -1) && (!left.a.cl)) {
		var _v1 = left.a;
		var _v2 = _v1.cl;
		var lK = _v1.Q;
		var lV = _v1.D;
		var lLeft = _v1.cT;
		var lRight = _v1.dc;
		return $gren_lang$core$Dict$node$(color, lK, lV, lLeft, $gren_lang$core$Dict$node$(0, key, value, lRight, right));
	} else {
		_v3$2:
		while (true) {
			if ((right.$ === -1) && (right.a.cl === 1)) {
				if (right.a.cT.$ === -1) {
					if (right.a.cT.a.cl === 1) {
						var _v4 = right.a;
						var _v5 = _v4.cl;
						var _v6 = _v4.cT.a.cl;
						return $gren_lang$core$Dict$moveRedRight(dict);
					} else {
						break _v3$2;
					}
				} else {
					var _v7 = right.a;
					var _v8 = _v7.cl;
					var _v9 = _v7.cT;
					return $gren_lang$core$Dict$moveRedRight(dict);
				}
			} else {
				break _v3$2;
			}
		}
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT = F7($gren_lang$core$Dict$removeHelpPrepEQGT$);
var $gren_lang$core$Dict$removeMin = function(dict) {
	if ((dict.$ === -1) && (dict.a.cT.$ === -1)) {
		var _v1 = dict.a;
		var color = _v1.cl;
		var key = _v1.Q;
		var value = _v1.D;
		var left = _v1.cT;
		var _v2 = left.a;
		var lColor = _v2.cl;
		var lLeft = _v2.cT;
		var right = _v1.dc;
		if (lColor === 1) {
			if ((lLeft.$ === -1) && (!lLeft.a.cl)) {
				var _v5 = lLeft.a.cl;
				return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeMin(left), right);
			} else {
				var _v6 = $gren_lang$core$Dict$moveRedLeft(dict);
				if (_v6.$ === -1) {
					var _v7 = _v6.a;
					var nColor = _v7.cl;
					var nKey = _v7.Q;
					var nValue = _v7.D;
					var nLeft = _v7.cT;
					var nRight = _v7.dc;
					return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$removeMin(nLeft), nRight);
				} else {
					return $gren_lang$core$Dict$RBEmpty_gren_builtin;
				}
			}
		} else {
			return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeMin(left), right);
		}
	} else {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	}
};
var $gren_lang$core$Dict$removeHelp$ = function(targetKey, dict) {
	if (dict.$ === -2) {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	} else {
		var _v5 = dict.a;
		var color = _v5.cl;
		var key = _v5.Q;
		var value = _v5.D;
		var left = _v5.cT;
		var right = _v5.dc;
		if (_Utils_cmp(targetKey, key) < 0) {
			if ((left.$ === -1) && (left.a.cl === 1)) {
				var _v7 = left.a;
				var _v8 = _v7.cl;
				var lLeft = _v7.cT;
				if ((lLeft.$ === -1) && (!lLeft.a.cl)) {
					var _v10 = lLeft.a.cl;
					return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeHelp$(targetKey, left), right);
				} else {
					var _v11 = $gren_lang$core$Dict$moveRedLeft(dict);
					if (_v11.$ === -1) {
						var _v12 = _v11.a;
						var nColor = _v12.cl;
						var nKey = _v12.Q;
						var nValue = _v12.D;
						var nLeft = _v12.cT;
						var nRight = _v12.dc;
						return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$removeHelp$(targetKey, nLeft), nRight);
					} else {
						return $gren_lang$core$Dict$RBEmpty_gren_builtin;
					}
				}
			} else {
				return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeHelp$(targetKey, left), right);
			}
		} else {
			return $gren_lang$core$Dict$removeHelpEQGT$(targetKey, $gren_lang$core$Dict$removeHelpPrepEQGT$(targetKey, dict, color, key, value, left, right));
		}
	}
};
var $gren_lang$core$Dict$removeHelp = F2($gren_lang$core$Dict$removeHelp$);
var $gren_lang$core$Dict$removeHelpEQGT$ = function(targetKey, dict) {
	if (dict.$ === -1) {
		var _v1 = dict.a;
		var color = _v1.cl;
		var key = _v1.Q;
		var value = _v1.D;
		var left = _v1.cT;
		var right = _v1.dc;
		if (_Utils_eq(targetKey, key)) {
			var _v2 = $gren_lang$core$Dict$getMin(right);
			if (_v2.$ === -1) {
				var _v3 = _v2.a;
				var minKey = _v3.Q;
				var minValue = _v3.D;
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
	if ((_v0.$ === -1) && (!_v0.a.cl)) {
		var _v1 = _v0.a;
		var _v2 = _v1.cl;
		var nKey = _v1.Q;
		var value = _v1.D;
		var left = _v1.cT;
		var right = _v1.dc;
		return $gren_lang$core$Dict$node$(1, nKey, value, left, right);
	} else {
		var x = _v0;
		return x;
	}
};
var $gren_lang$core$Dict$remove = F2($gren_lang$core$Dict$remove$);
var $gren_lang$core$Dict$update$ = function(targetKey, alter, dictionary) {
	var _v0 = alter($gren_lang$core$Dict$get$(targetKey, dictionary));
	if (!_v0.$) {
		var value = _v0.a;
		return $gren_lang$core$Dict$set$(targetKey, value, dictionary);
	} else {
		return $gren_lang$core$Dict$remove$(targetKey, dictionary);
	}
};
var $gren_lang$core$Dict$update = F3($gren_lang$core$Dict$update$);
var $gren_lang$core$Maybe$withDefault$ = function(_default, maybe) {
	if (!maybe.$) {
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
				var _v3 = { bU: parseState, D: $gren_lang$parser$Parser$run$($joeybright$gren_args$Args$parseArg, item) };
				_v3$0:
				while (true) {
					if (!_v3.D.$) {
						if (!_v3.D.a.$) {
							if (!_v3.bU.$) {
								if (_v3.D.a.a.D === '') {
									var _v4 = _v3.bU;
									var _v5 = _v3.D.a.a;
									var optionType = _v5.b0;
									var key = _v5.Q;
									return { ah: _Utils_update(parseResult, { bF: $gren_lang$core$Dict$set$(key, { w: optionType, E: [  ] }, parseResult.bF) }), bU: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var _v6 = _v3.bU;
									var _v7 = _v3.D.a.a;
									var optionType = _v7.b0;
									var key = _v7.Q;
									var value = _v7.D;
									return { ah: _Utils_update(parseResult, { bF: $gren_lang$core$Dict$set$(key, { w: optionType, E: [ value ] }, parseResult.bF) }), bU: $joeybright$gren_args$Args$ParsingOptions(key) };
								}
							} else {
								if (_v3.D.a.a.D === '') {
									var _v9 = _v3.D.a.a;
									var optionType = _v9.b0;
									var key = _v9.Q;
									return { ah: _Utils_update(parseResult, { bF: $gren_lang$core$Dict$set$(key, { w: optionType, E: [  ] }, parseResult.bF) }), bU: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var latestOption = _v3.bU.a;
									var _v10 = _v3.D.a.a;
									var optionType = _v10.b0;
									var key = _v10.Q;
									var value = _v10.D;
									return { ah: _Utils_update(parseResult, { bF: $gren_lang$core$Maybe$withDefault$($gren_lang$core$Dict$set$(key, { w: optionType, E: [ value ] }, parseResult.bF), $gren_lang$core$Maybe$map$(function(_v11) {
													return $gren_lang$core$Dict$update$(key, $gren_lang$core$Maybe$map(function(val) {
																return { w: val.w, E: $gren_lang$core$Array$pushLast$(value, val.E) };
															}), parseResult.bF);
												}, $gren_lang$core$Dict$get$(key, parseResult.bF))) }), bU: $joeybright$gren_args$Args$ParsingOptions(key) };
								}
							}
						} else {
							if (!_v3.bU.$) {
								if (_v3.D.a.a === '') {
									break _v3$0;
								} else {
									var _v8 = _v3.bU;
									var arg = _v3.D.a.a;
									return { ah: _Utils_update(parseResult, { aH: $gren_lang$core$Array$pushLast$(arg, parseResult.aH) }), bU: $joeybright$gren_args$Args$ParsingArgs };
								}
							} else {
								if (_v3.D.a.a === '') {
									break _v3$0;
								} else {
									var latestOption = _v3.bU.a;
									var value = _v3.D.a.a;
									return { ah: _Utils_update(parseResult, { bF: $gren_lang$core$Dict$update$(latestOption, $gren_lang$core$Maybe$map(function(val) {
													return { w: val.w, E: $gren_lang$core$Array$pushLast$(value, val.E) };
												}), parseResult.bF) }), bU: $joeybright$gren_args$Args$ParsingOptions(latestOption) };
								}
							}
						}
					} else {
						var state = _v3.bU;
						return { ah: parseResult, bU: state };
					}
				}
				var state = _v3.bU;
				return { ah: parseResult, bU: state };
			});
		var _v0 = $gren_lang$core$Array$popFirst(passedArray);
		if (!_v0.$) {
			var _v1 = _v0.a;
			var first = _v1.n;
			var rest = _v1.db;
			var _v2 = A2(process, acc, first);
			var state = _v2.bU;
			var result = _v2.ah;
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
var $joeybright$gren_args$Args$parse = A2($joeybright$gren_args$Args$parseHelper, $joeybright$gren_args$Args$ParsingArgs, { aH: [  ], bF: $gren_lang$core$Dict$empty });
var $gren_lang$core$Task$fail = _Scheduler_fail;
var $gren_lang$core$Maybe$andThen$ = function(callback, maybeValue) {
	if (!maybeValue.$) {
		var value = maybeValue.a;
		return callback(value);
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$andThen = F2($gren_lang$core$Maybe$andThen$);
var $gren_lang$node$FileSystem$Path$fromPosixString = _FilePath_fromPosix;
var $gren_lang$core$Array$prepend = _Array_append;
var $gren_lang$core$Array$append$ = function(fst, second) {
	return A2($gren_lang$core$Array$prepend, second, fst);
};
var $gren_lang$core$Array$append = F2($gren_lang$core$Array$append$);
var $gren_lang$core$String$isEmpty = function(string) {
	return string === '';
};
var $gren_lang$node$FileSystem$Path$filenameWithExtension = function(path) {
	return $gren_lang$core$String$isEmpty(path.l) ? path.m : (path.m + ('.' + path.l));
};
var $gren_lang$core$Array$keepIf = _Array_filter;
var $gren_lang$core$Basics$neq = _Utils_notEqual;
var $gren_lang$node$FileSystem$Path$prepend$ = function(left, right) {
	return _Utils_update(left, { N: A2($gren_lang$core$Array$keepIf, function(dir) {
				return dir !== '';
			}, $gren_lang$core$Array$append$(right.N, $gren_lang$core$Array$pushLast$($gren_lang$node$FileSystem$Path$filenameWithExtension(left), left.N))), l: right.l, m: right.m });
};
var $gren_lang$node$FileSystem$Path$prepend = F2($gren_lang$node$FileSystem$Path$prepend$);
var $gren_lang$node$FileSystem$Path$appendPosixString$ = function(str, path) {
	return $gren_lang$node$FileSystem$Path$prepend$(path, $gren_lang$node$FileSystem$Path$fromPosixString(str));
};
var $gren_lang$node$FileSystem$Path$appendPosixString = F2($gren_lang$node$FileSystem$Path$appendPosixString$);


var fs = require("node:fs");
var bufferNs = require("node:buffer");
var process = require("node:process");
var path = require("node:path");
var os = require("node:os");
var stream = require("node:stream");

var _FileSystem_coerce = function (fh) {
  return fh;
};

var _FileSystem_open = F2(function (access, path) {
  return _Scheduler_binding(function (callback) {
    fs.open(_FilePath_toString(path), access, function (err, fd) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
      } else {
        callback(_Scheduler_succeed({ aS: path, k: fd }));
      }
    });
  });
});

var _FileSystem_constructError = function (path, err) {
  return $gren_lang$node$FileSystem$Error({
    aS: path,
    cj: err.code || "",
    cU: err.message || "",
  });
};

var _FileSystem_close = function (fh) {
  return _Scheduler_binding(function (callback) {
    fs.close(fh.k, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.aS, err)));
      } else {
        callback(_Scheduler_succeed({}));
      }
    });
  });
};

var _FileSystem_readFromOffset = F2(function (fh, options) {
  var requestedLength =
    options.ac < 0 || options.ac > bufferNs.constants.MAX_LENGTH
      ? bufferNs.constants.MAX_LENGTH
      : options.ac;

  var fileOffset = options.f < 0 ? 0 : options.f;

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
      callback,
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
  callback,
) {
  fs.read(
    fh.k,
    buffer,
    bufferOffset,
    maxReadLength,
    fileOffset,
    function (err, bytesRead, _buff) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.aS, err)));
        return;
      }

      var newBufferOffset = bufferOffset + bytesRead;

      if (bytesRead === 0 || newBufferOffset >= requestedReadLength) {
        callback(
          _Scheduler_succeed(
            new DataView(buffer.buffer, buffer.byteOffset, newBufferOffset),
          ),
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
        callback,
      );
    },
  );
};

var _FileSystem_writeFromOffset = F3(function (fh, options, bytes) {
  return _Scheduler_binding(function (callback) {
    _FileSystem_writeHelper(
      fh,
      bytes,
      0,
      bytes.byteLength,
      options.f,
      callback,
    );
  });
});

var _FileSystem_writeHelper = function (
  fh,
  buffer,
  bufferOffset,
  length,
  fileOffset,
  callback,
) {
  fs.write(
    fh.k,
    buffer,
    bufferOffset,
    length,
    fileOffset,
    function (err, bytesWritten, buffer) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.aS, err)));
        return;
      }

      if (bytesWritten === length) {
        callback(_Scheduler_succeed(fh));
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
        callback,
      );
    },
  );
};

var _FileSystem_remove = F2(function (options, path) {
  var rmOpts = {
    recursive: options.bM,
  };

  return _Scheduler_binding(function (callback) {
    fs.rm(_FilePath_toString(path), rmOpts, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
      { recursive: options.bM },
      function (err) {
        if (err != null) {
          callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      },
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
          callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
        } else {
          callback(
            _Scheduler_succeed(
              content.map((f) => ({
                aS: _FilePath_fromString(f.name),
                cw: _FileSystem_toEntityType(f),
              })),
            ),
          );
        }
      },
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
    fs.fchmod(fd.k, mode, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fchown = F2(function (ids, fd) {
  return _Scheduler_binding(function (callback) {
    fs.fchown(fd.k, ids.aF, ids.au, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fdatasync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fdatasync(fd.k, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fsync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fsync(fd.k, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fstat = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fstat(fd.k, function (err, stats) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_ftruncate = F2(function (len, fd) {
  return _Scheduler_binding(function (callback) {
    fs.ftruncate(fd.k, len, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_futimes = F3(function (atime, mtime, fd) {
  return _Scheduler_binding(function (callback) {
    fs.futimes(fd.k, atime, mtime, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.aS, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
      ids.aF,
      ids.au,
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      },
    );
  });
});

var _FileSystem_lchown = F2(function (ids, path) {
  return _Scheduler_binding(function (callback) {
    fs.lchown(
      _FilePath_toString(path),
      ids.aF,
      ids.au,
      function (err) {
        if (err) {
          callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
        } else {
          callback(_Scheduler_succeed(path));
        }
      },
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
          callback(_Scheduler_fail(_FileSystem_constructError(dest, err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      },
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
          callback(_Scheduler_fail(_FileSystem_constructError(dest, err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      },
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
          callback(_Scheduler_fail(_FileSystem_constructError(dest, err)));
        } else {
          callback(_Scheduler_succeed(dest));
        }
      },
    );
  });
});

var _FileSystem_unlink = function (src) {
  return _Scheduler_binding(function (callback) {
    fs.unlink(_FilePath_toString(src), function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(src, err)));
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
        callback(
          _Scheduler_fail(
            _FileSystem_constructError(_FilePath_fromString(dir), err),
          ),
        );
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
      } else {
        callback(
          _Scheduler_succeed(
            new DataView(data.buffer, data.byteOffset, data.byteLength),
          ),
        );
      }
    });
  });
};

var _FileSystem_readFileStream = F2(function (opts, path) {
  return _Scheduler_binding(function (callback) {
    try {
      var fstream = fs.createReadStream(_FilePath_toString(path), {
        start: opts.aV,
        end: opts.be === -1 ? undefined : opts.be,
      });
      callback(_Scheduler_succeed(stream.Readable.toWeb(fstream)));
    } catch (err) {
      callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
    }
  });
});

var _FileSystem_readLink = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.readlink(_FilePath_toString(path), function (err, linkedPath) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
          callback(_Scheduler_fail(_FileSystem_constructError(newPath, err)));
        } else {
          callback(_Scheduler_succeed(newPath));
        }
      },
    );
  });
});

var _FileSystem_realpath = function (path) {
  return _Scheduler_binding(function (callback) {
    fs.realpath(_FilePath_toString(path), function (err, resolvedPath) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_statToGrenRecord = function (stats) {
  return {
    cw: _FileSystem_toEntityType(stats),
    b7: stats.blksize,
    b8: stats.blocks,
    cd: stats.size,
    cp: $gren_lang$core$Time$millisToPosix(Math.floor(stats.birthtimeMs)),
    ct: stats.dev,
    au: stats.gid,
    cQ: $gren_lang$core$Time$millisToPosix(Math.floor(stats.atimeMs)),
    cR: $gren_lang$core$Time$millisToPosix(Math.floor(stats.ctimeMs)),
    cS: $gren_lang$core$Time$millisToPosix(Math.floor(stats.mtimeMs)),
    aF: stats.uid,
  };
};

var _FileSystem_truncate = F2(function (len, path) {
  return _Scheduler_binding(function (callback) {
    fs.truncate(_FilePath_toString(path), len, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
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
        callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
      } else {
        callback(_Scheduler_succeed(path));
      }
    });
  });
});

var _FileSystem_writeFileStream = F2(function (pos, path) {
  return _Scheduler_binding(function (callback) {
    try {
      var fstream = fs.createWriteStream(_FilePath_toString(path), {
        flags: pos === 0 ? "w" : pos === -1 ? "a" : "r+",
        start: pos === 0 ? undefined : pos,
      });
      callback(_Scheduler_succeed(stream.Writable.toWeb(fstream)));
    } catch (err) {
      callback(_Scheduler_fail(_FileSystem_constructError(path, err)));
    }
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
        },
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

var _FileSystem_currentWorkingDirectory = _Scheduler_binding(
  function (callback) {
    callback(_Scheduler_succeed(_FilePath_fromString(process.cwd())));
  },
);

var _FileSystem_tmpDir = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_FilePath_fromString(os.tmpdir())));
});

var _FileSystem_devNull = _Scheduler_binding(function (callback) {
  callback(_Scheduler_succeed(_FilePath_fromString(os.devNull)));
});
var $gren_lang$node$FileSystem$Changed = function (a) {
	return { $: 0, a: a };
};
var $gren_lang$node$FileSystem$Device = 4;
var $gren_lang$node$FileSystem$Directory = 1;
var $gren_lang$node$FileSystem$Error = $gren_lang$core$Basics$identity;
var $gren_lang$node$FileSystem$Execute = 2;
var $gren_lang$node$FileSystem$File = 0;
var $gren_lang$node$FileSystem$Moved = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$node$FileSystem$Pipe = 5;
var $gren_lang$node$FileSystem$Read = 0;
var $gren_lang$node$FileSystem$Socket = 2;
var $gren_lang$node$FileSystem$Symlink = 3;
var $gren_lang$node$FileSystem$Write = 1;
var $gren_lang$core$Time$Posix = $gren_lang$core$Basics$identity;
var $gren_lang$core$Time$millisToPosix = $gren_lang$core$Basics$identity;
var $gren_lang$node$FileSystem$copyFile$ = function(_v0, dest, src) {
	return A2(_FileSystem_copyFile, src, dest);
};
var $gren_lang$node$FileSystem$copyFile = F3($gren_lang$node$FileSystem$copyFile$);
var $blaix$prettynice$CLI$Command$Init$ignores = [ 'node_modules', 'tests', 'dist', 'build', 'docs.json', '.gren', '.devbox' ];
var $gren_lang$node$FileSystem$Path$append$ = function(left, right) {
	return $gren_lang$node$FileSystem$Path$prepend$(right, left);
};
var $gren_lang$node$FileSystem$Path$append = F2($gren_lang$node$FileSystem$Path$append$);
var $gren_lang$node$FileSystem$Path$empty = { N: [  ], l: '', m: '', dd: '' };
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$node$FileSystem$Path$join = function(paths) {
	var _v0 = $gren_lang$core$Array$popFirst(paths);
	if (!_v0.$) {
		var _v1 = _v0.a;
		var first = _v1.n;
		var rest = _v1.db;
		return A3($gren_lang$core$Array$foldl, $gren_lang$node$FileSystem$Path$append, first, rest);
	} else {
		return $gren_lang$node$FileSystem$Path$empty;
	}
};
var $gren_lang$node$FileSystem$listDirectory$ = function(_v0, path) {
	return _FileSystem_listDirectory(path);
};
var $gren_lang$node$FileSystem$listDirectory = F2($gren_lang$node$FileSystem$listDirectory$);
var $gren_lang$node$FileSystem$makeDirectory$ = function(_v0, options, path) {
	return A2(_FileSystem_makeDirectory, options, path);
};
var $gren_lang$node$FileSystem$makeDirectory = F3($gren_lang$node$FileSystem$makeDirectory$);
var $gren_lang$core$Array$findFirst = _Array_findFirst;
var $gren_lang$core$Array$member$ = function(value, array) {
	var _v0 = A2($gren_lang$core$Array$findFirst, function(v) {
			return _Utils_eq(v, value);
		}, array);
	if (!_v0.$) {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Array$member = F2($gren_lang$core$Array$member$);
var $blaix$prettynice$CLI$Command$Init$copyDirectory$ = function(fsPerm, sourcePath, targetPath) {
	return A2($gren_lang$core$Task$andThen, A3($blaix$prettynice$CLI$Command$Init$copyEntries, fsPerm, sourcePath, targetPath), $gren_lang$node$FileSystem$listDirectory$(fsPerm, sourcePath));
};
var $blaix$prettynice$CLI$Command$Init$copyDirectory = F3($blaix$prettynice$CLI$Command$Init$copyDirectory$);
var $blaix$prettynice$CLI$Command$Init$copyEntries$ = function(fsPerm, sourcePath, targetPath, entries) {
	copyEntries:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(entries);
		if (_v0.$ === 1) {
			return $gren_lang$core$Task$succeed({  });
		} else {
			var _v1 = _v0.a;
			var entry = _v1.n;
			var remainingEntries = _v1.db;
			var targetEntry = $gren_lang$node$FileSystem$Path$join([ targetPath, entry.aS ]);
			var sourceEntry = $gren_lang$node$FileSystem$Path$join([ sourcePath, entry.aS ]);
			var entryName = $gren_lang$node$FileSystem$Path$filenameWithExtension(entry.aS);
			if ($gren_lang$core$Array$member$(entryName, $blaix$prettynice$CLI$Command$Init$ignores)) {
				var $temp$fsPerm = fsPerm,
				$temp$sourcePath = sourcePath,
				$temp$targetPath = targetPath,
				$temp$entries = remainingEntries;
				fsPerm = $temp$fsPerm;
				sourcePath = $temp$sourcePath;
				targetPath = $temp$targetPath;
				entries = $temp$entries;
				continue copyEntries;
			} else {
				var _v2 = entry.cw;
				switch (_v2) {
					case 1:
						return A2($gren_lang$core$Task$andThen, function(_v4) {
								return $blaix$prettynice$CLI$Command$Init$copyEntries$(fsPerm, sourcePath, targetPath, remainingEntries);
							}, A2($gren_lang$core$Task$andThen, function(_v3) {
									return $blaix$prettynice$CLI$Command$Init$copyDirectory$(fsPerm, sourceEntry, targetEntry);
								}, $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { bM: false }, targetEntry)));
					case 0:
						return A2($gren_lang$core$Task$andThen, function(_v5) {
								return $blaix$prettynice$CLI$Command$Init$copyEntries$(fsPerm, sourcePath, targetPath, remainingEntries);
							}, $gren_lang$node$FileSystem$copyFile$(fsPerm, targetEntry, sourceEntry));
					default:
						var $temp$fsPerm = fsPerm,
						$temp$sourcePath = sourcePath,
						$temp$targetPath = targetPath,
						$temp$entries = remainingEntries;
						fsPerm = $temp$fsPerm;
						sourcePath = $temp$sourcePath;
						targetPath = $temp$targetPath;
						entries = $temp$entries;
						continue copyEntries;
				}
			}
		}
	}
};
var $blaix$prettynice$CLI$Command$Init$copyEntries = F4($blaix$prettynice$CLI$Command$Init$copyEntries$);
var $gren_lang$node$FileSystem$Path$fromWin32String = _FilePath_fromWin32;


var _Stream_read = function (stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    const reader = stream.getReader();
    reader
      .read()
      .then(({ done, value }) => {
        reader.releaseLock();

        if (done) {
          return callback(_Scheduler_fail($gren_lang$core$Stream$Closed));
        }

        if (value instanceof Uint8Array) {
          value = new DataView(
            value.buffer,
            value.byteOffset,
            value.byteLength,
          );
        }

        callback(_Scheduler_succeed(value));
      })
      .catch((err) => {
        reader.releaseLock();
        callback(
          _Scheduler_fail(
            $gren_lang$core$Stream$Cancelled(_Stream_cancellationErrorString(err)),
          ),
        );
      });
  });
};

var _Stream_cancellationErrorString = function (err) {
  if (err instanceof Error) {
    return err.toString();
  }

  if (typeof err === "string") {
    return err;
  }

  return "Unknown error";
};

var _Stream_write = F2(function (value, stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    if (value instanceof DataView) {
      value = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }

    const writer = stream.getWriter();
    writer.ready
      .then(() => {
        const writePromise = writer.write(value);
        writer.releaseLock();
        return writePromise;
      })
      .then(() => {
        callback(_Scheduler_succeed(stream));
      })
      .catch((err) => {
        callback(
          _Scheduler_fail(
            $gren_lang$core$Stream$Cancelled(_Stream_cancellationErrorString(err)),
          ),
        );
      });
  });
});

var _Stream_enqueue = F2(function (value, stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    if (value instanceof DataView) {
      value = new Uint8Array(value.buffer, value.byteOffset, value.byteLength);
    }

    const writer = stream.getWriter();
    writer.ready.then(() => {
      writer.write(value);
      writer.releaseLock();

      callback(_Scheduler_succeed(stream));
    });
  });
});

var _Stream_cancelReadable = F2(function (reason, stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    stream.cancel(reason).then(() => {
      callback(_Scheduler_succeed({}));
    });
  });
});

var _Stream_cancelWritable = F2(function (reason, stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    stream.abort(reason).then(() => {
      callback(_Scheduler_succeed({}));
    });
  });
});

var _Stream_closeWritable = function (stream) {
  return _Scheduler_binding(function (callback) {
    if (stream.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    const writer = stream.getWriter();
    writer.close();
    writer.releaseLock();

    callback(_Scheduler_succeed({}));
  });
};

var _Stream_pipeThrough = F2(function (transformer, readable) {
  return _Scheduler_binding(function (callback) {
    if (readable.locked || transformer.writable.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    const transformedReader = readable.pipeThrough(transformer);
    return callback(_Scheduler_succeed(transformedReader));
  });
});

var _Stream_pipeTo = F2(function (writable, readable) {
  return _Scheduler_binding(function (callback) {
    if (readable.locked || writable.locked) {
      return callback(_Scheduler_fail($gren_lang$core$Stream$Locked));
    }

    readable
      .pipeTo(writable)
      .then(() => {
        callback(_Scheduler_succeed({}));
      })
      .catch((err) => {
        callback(
          _Scheduler_fail(
            $gren_lang$core$Stream$Cancelled(_Stream_cancellationErrorString(err)),
          ),
        );
      });
  });
});

var _Stream_identityTransformation = F2(function (readCapacity, writeCapacity) {
  return _Scheduler_binding(function (callback) {
    const transformStream = new TransformStream(
      {},
      new CountQueuingStrategy({ highWaterMark: writeCapacity }),
      new CountQueuingStrategy({ highWaterMark: readCapacity }),
    );

    return callback(_Scheduler_succeed(transformStream));
  });
});

var _Stream_customTransformation = F4(
  function (toAction, initState, readCapacity, writeCapacity) {
    return _Scheduler_binding(function (callback) {
      const transformStream = new TransformStream(
        {
          start() {
            this.state = initState;
          },
          transform(chunk, controller) {
            if (chunk instanceof Uint8Array) {
              chunk = new DataView(
                chunk.buffer,
                chunk.byteOffset,
                chunk.byteLength,
              );
            }

            const action = A2(toAction, this.state, chunk);
            switch (action.cq) {
              case "UpdateState":
                this.state = action.bU;
                break;
              case "Send":
                this.state = action.bU;
                for (let value of action.bQ) {
                  if (value instanceof DataView) {
                    value = new Uint8Array(
                      value.buffer,
                      value.byteOffset,
                      value.byteLength,
                    );
                  }

                  controller.enqueue(value);
                }
                break;
              case "Close":
                for (let value of action.bQ) {
                  if (value instanceof DataView) {
                    value = new Uint8Array(
                      value.buffer,
                      value.byteOffset,
                      value.byteLength,
                    );
                  }

                  controller.enqueue(value);
                }
                controller.terminate();
                break;
              case "Cancel":
                controller.error(action.cf);
                break;
            }
          },
        },
        new CountQueuingStrategy({ highWaterMark: writeCapacity }),
        new CountQueuingStrategy({ highWaterMark: readCapacity }),
      );

      return callback(_Scheduler_succeed(transformStream));
    });
  },
);

var _Stream_readable = function (transformStream) {
  return transformStream.readable;
};

var _Stream_writable = function (transformStream) {
  return transformStream.writable;
};

var _Stream_textEncoder = _Scheduler_binding(function (callback) {
  return callback(_Scheduler_succeed(new TextEncoderStream()));
});

var _Stream_textDecoder = _Scheduler_binding(function (callback) {
  return callback(_Scheduler_succeed(new TextDecoderStream()));
});

var _Stream_compressor = function (algo) {
  return _Scheduler_binding(function (callback) {
    return callback(_Scheduler_succeed(new CompressionStream(algo)));
  });
};

var _Stream_decompressor = function (algo) {
  return _Scheduler_binding(function (callback) {
    return callback(_Scheduler_succeed(new DecompressionStream(algo)));
  });
};
var $gren_lang$core$Stream$Cancelled = function (a) {
	return { $: 1, a: a };
};
var $gren_lang$core$Stream$Closed = { $: 0 };
var $gren_lang$core$Stream$Locked = { $: 2 };
var $gren_lang$core$Stream$write = _Stream_write;
var $gren_lang$core$Stream$Log$bytes$ = function(stream, data) {
	return A2($gren_lang$core$Task$onError, function(_v1) {
			return $gren_lang$core$Task$succeed({  });
		}, A2($gren_lang$core$Task$andThen, function(_v0) {
				return $gren_lang$core$Task$succeed({  });
			}, A2($gren_lang$core$Stream$write, data, stream)));
};
var $gren_lang$core$Stream$Log$bytes = F2($gren_lang$core$Stream$Log$bytes$);


// BYTES

var _Bytes_empty = new DataView(new ArrayBuffer(0));

function _Bytes_length(bytes) {
  return bytes.byteLength;
}

var _Bytes_getHostEndianness = F2(function (le, be) {
  return _Scheduler_binding(function (callback) {
    callback(
      _Scheduler_succeed(
        new Uint8Array(new Uint32Array([1]))[0] === 1 ? le : be,
      ),
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

function _Bytes_flatten(arrayOfBytes) {
  var requiredSize = 0;
  for (var i = 0; i < arrayOfBytes.length; i++) {
    requiredSize += arrayOfBytes[i].byteLength;
  }

  var offset = 0;
  var result = new Uint8Array(requiredSize);

  for (var i = 0; i < arrayOfBytes.length; i++) {
    var currentBytes = new Uint8Array(arrayOfBytes[i].buffer);
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
    return $gren_lang$core$Maybe$Just(A2(decoder, bytes, 0).D);
  } catch (e) {
    if (e instanceof RangeError) {
      return $gren_lang$core$Maybe$Nothing;
    } else {
      throw e;
    }
  }
});

var _Bytes_read_i8 = F2(function (bytes, offset) {
  return { f: offset + 1, D: bytes.getInt8(offset) };
});
var _Bytes_read_i16 = F3(function (isLE, bytes, offset) {
  return { f: offset + 2, D: bytes.getInt16(offset, isLE) };
});
var _Bytes_read_i32 = F3(function (isLE, bytes, offset) {
  return { f: offset + 4, D: bytes.getInt32(offset, isLE) };
});
var _Bytes_read_u8 = F2(function (bytes, offset) {
  return { f: offset + 1, D: bytes.getUint8(offset) };
});
var _Bytes_read_u16 = F3(function (isLE, bytes, offset) {
  return { f: offset + 2, D: bytes.getUint16(offset, isLE) };
});
var _Bytes_read_u32 = F3(function (isLE, bytes, offset) {
  return { f: offset + 4, D: bytes.getUint32(offset, isLE) };
});
var _Bytes_read_f32 = F3(function (isLE, bytes, offset) {
  return { f: offset + 4, D: bytes.getFloat32(offset, isLE) };
});
var _Bytes_read_f64 = F3(function (isLE, bytes, offset) {
  return { f: offset + 8, D: bytes.getFloat64(offset, isLE) };
});

var _Bytes_read_bytes = F3(function (len, bytes, offset) {
  return {
    f: offset + len,
    D: new DataView(bytes.buffer, bytes.byteOffset + offset, len),
  };
});

var _Bytes_decodeFailure = F2(function () {
  throw 0;
});
var $gren_lang$core$Bytes$Encode$getLength = function(builder) {
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
			var w = builder.a.du;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_length(bs);
	}
};
var $gren_lang$core$Bytes$LE = 0;
var $gren_lang$core$Bytes$Encode$write$ = function(builder, mb, offset) {
	switch (builder.$) {
		case 0:
			var n = builder.a;
			return A3(_Bytes_write_i8, mb, offset, n);
		case 1:
			var _v1 = builder.a;
			var e = _v1.O;
			var n = _v1.S;
			return A4(_Bytes_write_i16, mb, offset, n, !e);
		case 2:
			var _v2 = builder.a;
			var e = _v2.O;
			var n = _v2.S;
			return A4(_Bytes_write_i32, mb, offset, n, !e);
		case 3:
			var n = builder.a;
			return A3(_Bytes_write_u8, mb, offset, n);
		case 4:
			var _v3 = builder.a;
			var e = _v3.O;
			var n = _v3.S;
			return A4(_Bytes_write_u16, mb, offset, n, !e);
		case 5:
			var _v4 = builder.a;
			var e = _v4.O;
			var n = _v4.S;
			return A4(_Bytes_write_u32, mb, offset, n, !e);
		case 6:
			var _v5 = builder.a;
			var e = _v5.O;
			var n = _v5.S;
			return A4(_Bytes_write_f32, mb, offset, n, !e);
		case 7:
			var _v6 = builder.a;
			var e = _v6.O;
			var n = _v6.S;
			return A4(_Bytes_write_f64, mb, offset, n, !e);
		case 8:
			var bs = builder.a.cP;
			return $gren_lang$core$Bytes$Encode$writeSequence$(bs, mb, offset);
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
var $gren_lang$core$Stream$Log$string$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$bytes$(stream, $gren_lang$core$Bytes$fromString(data));
};
var $gren_lang$core$Stream$Log$string = F2($gren_lang$core$Stream$Log$string$);
var $gren_lang$core$Stream$Log$line$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$string$(stream, data + '\n');
};
var $gren_lang$core$Stream$Log$line = F2($gren_lang$core$Stream$Log$line$);
var $gren_lang$core$Task$mapError$ = function(convert, task) {
	return A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Task$fail, convert), task);
};
var $gren_lang$core$Task$mapError = F2($gren_lang$core$Task$mapError$);
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
	if (!_v0.$) {
		var value = _v0.a;
		return $gren_lang$core$Maybe$Just({ bm: $gren_lang$core$Array$dropLast$(1, array), aL: value });
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$node$FileSystem$Path$parentPath = function(path) {
	var _v0 = $gren_lang$core$Array$popLast(path.N);
	if (_v0.$ === 1) {
		return ($gren_lang$node$FileSystem$Path$filenameWithExtension(path) === '') ? $gren_lang$core$Maybe$Nothing : $gren_lang$core$Maybe$Just(_Utils_update(path, { l: '', m: '' }));
	} else {
		var _v1 = _v0.a;
		var last = _v1.aL;
		var initial = _v1.bm;
		var _v2 = function () {
			var _v3 = A2($gren_lang$core$String$split, '.', last);
			if (_v3.length === 2) {
				var file = _v3[0];
				var ext = _v3[1];
				return { l: ext, m: file };
			} else {
				return { l: '', m: last };
			}
		}();
		var filename = _v2.m;
		var extension = _v2.l;
		return $gren_lang$core$Maybe$Just(_Utils_update(path, { N: initial, l: extension, m: filename }));
	}
};
var $blaix$gren_ansi$Ansi$Red = 2;
var $blaix$gren_tui$UI$Attribute$Color = function (a) {
	return { $: 0, a: a };
};
var $blaix$gren_tui$UI$Attribute$color = $blaix$gren_tui$UI$Attribute$Color;
var $gren_lang$node$FileSystem$errorToString = function(_v0) {
	var message = _v0.cU;
	return message;
};
var $blaix$gren_tui$UI$Row = function (a) {
	return { $: 0, a: a };
};
var $blaix$gren_tui$UI$row$ = function(attrs, children) {
	return $blaix$gren_tui$UI$Row({ j: attrs, an: children });
};
var $blaix$gren_tui$UI$row = F2($blaix$gren_tui$UI$row$);
var $blaix$gren_tui$UI$Text = function (a) {
	return { $: 2, a: a };
};
var $blaix$gren_tui$UI$Col = function (a) {
	return { $: 1, a: a };
};
var $blaix$gren_tui$UI$column$ = function(attrs, children) {
	return $blaix$gren_tui$UI$Col({ j: attrs, an: children });
};
var $blaix$gren_tui$UI$column = F2($blaix$gren_tui$UI$column$);
var $blaix$gren_tui$SingleLine$SingleLine = $gren_lang$core$Basics$identity;
var $gren_lang$core$String$lines = _String_lines;
var $blaix$gren_tui$SingleLine$fromString = function(string) {
	return A2($gren_lang$core$Array$map, $gren_lang$core$Basics$identity, $gren_lang$core$String$lines(string));
};
var $blaix$gren_tui$UI$text$ = function(attrs, content) {
	return $blaix$gren_tui$UI$column$([  ], A2($gren_lang$core$Array$map, function(l) {
				return $blaix$gren_tui$UI$Text({ j: attrs, i: l });
			}, $blaix$gren_tui$SingleLine$fromString(content)));
};
var $blaix$gren_tui$UI$text = F2($blaix$gren_tui$UI$text$);
var $blaix$prettynice$CLI$Command$Init$viewInitError = function(error) {
	return $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color(2) ], [ $blaix$gren_tui$UI$text$([  ], 'Failed to initialize project: '), $blaix$gren_tui$UI$text$([  ], $gren_lang$node$FileSystem$errorToString(error)) ]);
};
var $blaix$gren_ansi$Ansi$Cyan = 7;
var $blaix$gren_ansi$Ansi$Green = 3;
var $blaix$gren_ansi$Ansi$Yellow = 4;
var $blaix$prettynice$CLI$Command$Init$viewInitSuccess = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(3) ], '✅ Done!'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(7) ], 'Now what?'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 Start the dev server with: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(4) ], 'npm run dev') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 Make changes to your server at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(4) ], 'server/src/Main.gren') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 View your example client-side component at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(4) ], 'client/src/Components/Counter.gren') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 View more examples at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(4) ], 'https://github.com/blaix/prettynice/tree/main/examples') ]) ]);
var $blaix$prettynice$CLI$Command$Init$initializeProject = function(_v0) {
	var fsPerm = _v0.cD;
	var dirName = _v0.cu;
	var env = _v0.ar;
	var templatePath = $gren_lang$node$FileSystem$Path$appendPosixString$('init', $gren_lang$node$FileSystem$Path$appendPosixString$('templates', $gren_lang$core$Maybe$withDefault$($gren_lang$node$FileSystem$Path$empty, $gren_lang$core$Maybe$andThen$($gren_lang$node$FileSystem$Path$parentPath, $gren_lang$node$FileSystem$Path$parentPath(env.b4)))));
	var targetPath = function () {
		var _v4 = env.c1;
		if (!_v4.$) {
			return $gren_lang$node$FileSystem$Path$fromWin32String(dirName);
		} else {
			return $gren_lang$node$FileSystem$Path$fromPosixString(dirName);
		}
	}();
	return $gren_lang$core$Task$mapError$(function(err) {
			return { cy: 2, cU: $blaix$prettynice$CLI$Command$Init$viewInitError(err) };
		}, $gren_lang$core$Task$map$(function(_v3) {
				return $blaix$prettynice$CLI$Command$Init$viewInitSuccess;
			}, A2($gren_lang$core$Task$andThen, function(_v2) {
					return $blaix$prettynice$CLI$Command$Init$copyDirectory$(fsPerm, templatePath, targetPath);
				}, A2($gren_lang$core$Task$andThen, function(_v1) {
						return $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { bM: true }, targetPath);
					}, $gren_lang$core$Stream$Log$line$(env.di, '🤖 Generating project...')))));
};
var $blaix$prettynice$CLI$Command$Init$InitializeProject = function (a) {
	return { $: 0, a: a };
};
var $blaix$prettynice$CLI$Command$Init$ShowHelp = { $: 1 };
var $blaix$prettynice$CLI$Command$Init$UsageError = { $: 2 };
var $blaix$prettynice$CLI$Command$Init$route$ = function(args, options) {
	var _v0 = { aH: args, cG: $gren_lang$core$Dict$get$('help', options) };
	if (!_v0.cG.$) {
		return $blaix$prettynice$CLI$Command$Init$ShowHelp;
	} else {
		if (_v0.aH.length === 1) {
			var dirName = _v0.aH[0];
			return $blaix$prettynice$CLI$Command$Init$InitializeProject(dirName);
		} else {
			return $blaix$prettynice$CLI$Command$Init$UsageError;
		}
	}
};
var $blaix$prettynice$CLI$Command$Init$route = F2($blaix$prettynice$CLI$Command$Init$route$);
var $blaix$prettynice$CLI$Command$Init$indent = '    ';
var $blaix$prettynice$CLI$Command$Init$viewUsage = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Usage:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color(7) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice init <directory>') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Arguments:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color(7) ], '<directory> '), $blaix$gren_tui$UI$text$([  ], ' Path where the new project will be created') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Example:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color(7) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice init my-app') ]) ]);
var $blaix$prettynice$CLI$Command$Init$viewHelp = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Initialize a new Prettynice project'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$prettynice$CLI$Command$Init$viewUsage ]);
var $blaix$prettynice$CLI$Command$Init$run = function(_v0) {
	var fsPerm = _v0.cD;
	var args = _v0.aH;
	var options = _v0.bF;
	var env = _v0.ar;
	var _v1 = $blaix$prettynice$CLI$Command$Init$route$(args, options);
	switch (_v1.$) {
		case 0:
			var dirName = _v1.a;
			return $blaix$prettynice$CLI$Command$Init$initializeProject({ cu: dirName, ar: env, cD: fsPerm });
		case 1:
			return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$Command$Init$viewHelp);
		default:
			return $gren_lang$core$Task$fail({ cy: 1, cU: $blaix$prettynice$CLI$Command$Init$viewUsage });
	}
};
var $gren_lang$node$Node$startProgram = function(initResult) {
	return $gren_lang$core$Task$succeed(initResult);
};
var $blaix$prettynice$CLI$indent = '    ';
var $blaix$prettynice$CLI$viewUsage = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Usage:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color(7) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice <command> [options]') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Commands:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$column$([ $blaix$gren_tui$UI$Attribute$color(7) ], [ $blaix$gren_tui$UI$text$([  ], 'init <directory> '), $blaix$gren_tui$UI$text$([  ], 'build ') ]), $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], ' Initialize a new Prettynice project'), $blaix$gren_tui$UI$text$([  ], ' Build an existing Prettynice project') ]) ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Options:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$text$([  ], '--help '), $blaix$gren_tui$UI$text$([  ], ' Show help information') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'For more information, visit https://github.com/blaix/prettynice') ]);
var $blaix$prettynice$CLI$viewHelp = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'A full-stack web framework for Gren.'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$prettynice$CLI$viewUsage ]);
var $blaix$prettynice$CLI$init = function(env) {
	return $gren_lang$node$Init$await$($gren_lang$node$FileSystem$initialize, function(fsPerm) {
			return $gren_lang$node$Init$await$($gren_lang$node$Terminal$initialize, function(termConfig) {
					var termWidth = function () {
						if (!termConfig.$) {
							var t = termConfig.a;
							return t.cn;
						} else {
							return 80;
						}
					}();
					var parsedArgs = $joeybright$gren_args$Args$parse($gren_lang$core$Array$dropFirst$(2, env.aH));
					var commandTask = function () {
						var _v0 = $gren_lang$core$Array$popFirst(parsedArgs.aH);
						if (!_v0.$) {
							if (_v0.a.n === 'init') {
								var _v1 = _v0.a;
								var args = _v1.db;
								return $blaix$prettynice$CLI$Command$Init$run({ aH: args, ar: env, cD: fsPerm, bF: parsedArgs.bF });
							} else {
								return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$viewUsage);
							}
						} else {
							return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$viewHelp);
						}
					}();
					return $gren_lang$node$Node$startProgram({ aI: $gren_lang$core$Task$attempt$($gren_lang$core$Basics$identity, commandTask), aO: { ar: env, a_: termWidth } });
				});
		});
};
var $blaix$prettynice$CLI$subscriptions = function(model) {
	return $gren_lang$core$Platform$Sub$none;
};
var $gren_lang$core$Json$Decode$succeed = _Json_succeed;
var $gren_lang$core$Task$execute = function(task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Execute($gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, task)));
};
var $gren_lang$core$Task$executeCmd = function(task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$ExecuteCmd(task));
};
var $gren_lang$node$Node$exitWithCode = function(code) {
	return _Node_exitWithCode(code);
};
var $gren_lang$core$Array$flatten = _Array_flat;
var $gren_lang$core$Array$initialize = _Array_initialize;
var $blaix$gren_tui$SingleLine$empty = '';
var $gren_lang$core$Basics$gt = _Utils_gt;
var $gren_lang$core$Array$maximum = function(array) {
	var _v0 = $gren_lang$core$Array$first(array);
	if (_v0.$ === 1) {
		return $gren_lang$core$Maybe$Nothing;
	} else {
		var val = _v0.a;
		return $gren_lang$core$Maybe$Just(A3($gren_lang$core$Array$foldl, F2(function(current, highest) {
						return (_Utils_cmp(current, highest) > 0) ? current : highest;
					}), val, array));
	}
};
var $gren_lang$core$Array$repeat$ = function(n, val) {
	return A3($gren_lang$core$Array$initialize, n, 0, function(_v0) {
			return val;
		});
};
var $gren_lang$core$Array$repeat = F2($gren_lang$core$Array$repeat$);
var $blaix$gren_tui$UI$normalizeHeight$ = function(parentAttrs, allGrids) {
	var maxRows = $gren_lang$core$Maybe$withDefault$(0, $gren_lang$core$Array$maximum(A2($gren_lang$core$Array$map, $gren_lang$core$Array$length, allGrids)));
	return A2($gren_lang$core$Array$map, function(g) {
			var diff = maxRows - $gren_lang$core$Array$length(g);
			var extraRows = $gren_lang$core$Array$repeat$(diff, [ { j: parentAttrs, i: $blaix$gren_tui$SingleLine$empty } ]);
			return _Utils_ap(g, extraRows);
		}, allGrids);
};
var $blaix$gren_tui$UI$normalizeHeight = F2($blaix$gren_tui$UI$normalizeHeight$);
var $blaix$gren_tui$UI$emptyCell = { j: [  ], i: $blaix$gren_tui$SingleLine$empty };
var $blaix$gren_array2d$Array2d$map$ = function(fn, array2d) {
	return A2($gren_lang$core$Array$map, function(row) {
			return A2($gren_lang$core$Array$map, fn, row);
		}, array2d);
};
var $blaix$gren_array2d$Array2d$map = F2($blaix$gren_array2d$Array2d$map$);
var $blaix$gren_tui$SingleLine$toString = function(_v0) {
	var string = _v0;
	return string;
};
var $gren_lang$core$String$foldl = _String_foldl;


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function (options, string) {
  if (string.trim().length === 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  var flags = "g";
  if (options.cW) {
    flags += "m";
  }
  if (options.cg) {
    flags += "i";
  }

  try {
    return $gren_lang$core$Maybe$Just(new RegExp(string, flags));
  } catch (error) {
    return $gren_lang$core$Maybe$Nothing;
  }
});

// USE

var _Regex_contains = F2(function (re, string) {
  return string.match(re) !== null;
});

var _Regex_findAtMost = F3(function (n, re, str) {
  var out = [];
  var number = 0;
  var string = str;
  var lastIndex = re.lastIndex;
  var prevLastIndex = -1;
  var result;
  while (number++ < n && (result = re.exec(string))) {
    if (prevLastIndex == re.lastIndex) break;
    var i = result.length - 1;
    var subs = new Array(i);
    while (i > 0) {
      var submatch = result[i];
      subs[--i] = submatch ? $gren_lang$core$Maybe$Just(submatch) : $gren_lang$core$Maybe$Nothing;
    }
    out.push({
      bt: result[0],
      P: result.index,
      S: number,
      bV: subs,
    });
    prevLastIndex = re.lastIndex;
  }
  re.lastIndex = lastIndex;
  return out;
});

var _Regex_replaceAtMost = F4(function (n, re, replacer, string) {
  var count = 0;
  function jsReplacer(match) {
    if (count++ >= n) {
      return match;
    }
    var i = arguments.length - 3;
    var submatches = new Array(i);
    while (i > 0) {
      var submatch = arguments[i];
      submatches[--i] = submatch ? $gren_lang$core$Maybe$Just(submatch) : $gren_lang$core$Maybe$Nothing;
    }
    return replacer({
      bt: match,
      P: arguments[arguments.length - 2],
      S: count,
      bV: submatches,
    });
  }
  return string.replace(re, jsReplacer);
});

var _Regex_splitAtMost = F3(function (n, re, str) {
  return str.split(re, n);
});

var _Regex_infinity = Number.MAX_SAFE_INTEGER;
var $gren_lang$core$String$Regex$fromStringWith = _Regex_fromStringWith;
var $gren_lang$core$String$Regex$fromString = function(string) {
	return A2($gren_lang$core$String$Regex$fromStringWith, { cg: false, cW: false }, string);
};
var $gren_lang$core$String$Regex$never = _Regex_never;
var $blaix$gren_ansi$Ansi$regex = $gren_lang$core$Maybe$withDefault$($gren_lang$core$String$Regex$never, $gren_lang$core$String$Regex$fromString(A2($gren_lang$core$String$join, '|', [ '[\u001B\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\u0007)', '(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-nq-uy=><~]))' ])));
var $gren_lang$core$String$Regex$replace = _Regex_replaceAtMost(_Regex_infinity);
var $blaix$gren_ansi$Ansi$strip = A2($gren_lang$core$String$Regex$replace, $blaix$gren_ansi$Ansi$regex, function(_v0) {
		return '';
	});
var $gren_lang$core$Basics$ge = _Utils_ge;
var $blaix$gren_ansi$Ansi$isCJK = function(codePoint) {
	return ((codePoint >= 12288) && (codePoint <= 40959)) || (((codePoint >= 63744) && (codePoint <= 64255)) || (((codePoint >= 65281) && (codePoint <= 65376)) || (((codePoint >= 65504) && (codePoint <= 65510)) || (((codePoint >= 131072) && (codePoint <= 196605)) || ((codePoint >= 196608) && (codePoint <= 262141))))));
};
var $blaix$gren_ansi$Ansi$isEmoji = function(codePoint) {
	return ((codePoint >= 127744) && (codePoint <= 128511)) || (((codePoint >= 128512) && (codePoint <= 128591)) || (((codePoint >= 128640) && (codePoint <= 128767)) || (((codePoint >= 128992) && (codePoint <= 129003)) || (((codePoint >= 129280) && (codePoint <= 129535)) || (((codePoint >= 129648) && (codePoint <= 129791)) || (((codePoint >= 9728) && (codePoint <= 9983)) || ((codePoint >= 9984) && (codePoint <= 10175))))))));
};
var $blaix$gren_ansi$Ansi$zeroWidth = function(codePoint) {
	return ((codePoint >= 0) && (codePoint <= 31)) || ((codePoint === 127) || (((codePoint >= 128) && (codePoint <= 159)) || (((codePoint >= 8204) && (codePoint <= 8207)) || (((codePoint >= 8232) && (codePoint <= 8239)) || (((codePoint >= 8288) && (codePoint <= 8303)) || ((codePoint === 65039) || ((codePoint === 173) || ((codePoint === 847) || ((codePoint === 1564) || (((codePoint >= 768) && (codePoint <= 879)) || (((codePoint >= 6832) && (codePoint <= 6911)) || (((codePoint >= 7616) && (codePoint <= 7679)) || (((codePoint >= 8400) && (codePoint <= 8447)) || ((codePoint >= 65056) && (codePoint <= 65071)))))))))))))));
};
var $blaix$gren_ansi$Ansi$widthReducer$ = function(_char, total) {
	var codePoint = $gren_lang$core$Char$toCode(_char);
	return $blaix$gren_ansi$Ansi$zeroWidth(codePoint) ? total : (((codePoint >= 9777) && (codePoint <= 9780)) ? (total + 1) : (((codePoint >= 10038) && (codePoint <= 10042)) ? (total + 1) : (((codePoint >= 9750) && (codePoint <= 9751)) ? (total + 1) : (((codePoint >= 9998) && (codePoint <= 10023)) ? (total + 1) : ($blaix$gren_ansi$Ansi$isCJK(codePoint) ? (total + 2) : ($blaix$gren_ansi$Ansi$isEmoji(codePoint) ? (total + 2) : (total + 1)))))));
};
var $blaix$gren_ansi$Ansi$widthReducer = F2($blaix$gren_ansi$Ansi$widthReducer$);
var $blaix$gren_ansi$Ansi$width = function(str) {
	return A3($gren_lang$core$String$foldl, $blaix$gren_ansi$Ansi$widthReducer, 0, $blaix$gren_ansi$Ansi$strip(str));
};
var $blaix$gren_tui$UI$gridWidth = function(grid) {
	return $gren_lang$core$Maybe$withDefault$(0, $gren_lang$core$Array$maximum(A2($gren_lang$core$Array$map, A2($gren_lang$core$Array$foldl, $gren_lang$core$Basics$add, 0), $blaix$gren_array2d$Array2d$map$($blaix$gren_ansi$Ansi$width, $blaix$gren_array2d$Array2d$map$($blaix$gren_tui$SingleLine$toString, $blaix$gren_array2d$Array2d$map$(function ($) {
								return $.i;
							}, grid))))));
};
var $gren_lang$core$String$repeat = _String_repeat;
var $blaix$gren_tui$SingleLine$padRight$ = function(desiredWidth, _v0) {
	var string = _v0;
	var padCount = desiredWidth - $blaix$gren_ansi$Ansi$width(string);
	var padded = _Utils_ap(string, A2($gren_lang$core$String$repeat, padCount, ' '));
	return padded;
};
var $blaix$gren_tui$SingleLine$padRight = F2($blaix$gren_tui$SingleLine$padRight$);
var $blaix$gren_tui$SingleLine$width = function(_v0) {
	var string = _v0;
	return $blaix$gren_ansi$Ansi$width(string);
};
var $blaix$gren_tui$UI$normalizeWidth = function(grid) {
	var targetWidth = $blaix$gren_tui$UI$gridWidth(grid);
	return A2($gren_lang$core$Array$map, function(thisRow) {
			var thisRowWidth = A3($gren_lang$core$Array$foldl, $gren_lang$core$Basics$add, 0, A2($gren_lang$core$Array$map, $blaix$gren_tui$SingleLine$width, A2($gren_lang$core$Array$map, function ($) {
							return $.i;
						}, thisRow)));
			var popped = $gren_lang$core$Maybe$withDefault$({ bm: [  ], aL: $blaix$gren_tui$UI$emptyCell }, $gren_lang$core$Array$popLast(thisRow));
			var lastCellContent = popped.aL.i;
			var diff = targetWidth - thisRowWidth;
			var lastCellTargetWidth = $blaix$gren_tui$SingleLine$width(lastCellContent) + diff;
			var newLastCellContent = $blaix$gren_tui$SingleLine$padRight$(lastCellTargetWidth, lastCellContent);
			var paddedCell = _Utils_update(popped.aL, { i: newLastCellContent });
			return $gren_lang$core$Array$pushLast$(paddedCell, popped.bm);
		}, grid);
};
var $blaix$gren_tui$UI$joinHorizontal$ = function(parentAttrs, grids) {
	var normalizedGrids = A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$normalizeWidth, $blaix$gren_tui$UI$normalizeHeight$(parentAttrs, grids));
	var numRows = $gren_lang$core$Array$length($gren_lang$core$Maybe$withDefault$([ [  ] ], A2($gren_lang$core$Array$get, 0, normalizedGrids)));
	return A3($gren_lang$core$Array$initialize, numRows, 0, function(rowNum) {
			return $gren_lang$core$Array$flatten(A2($gren_lang$core$Array$map, function(g) {
						return $gren_lang$core$Maybe$withDefault$([  ], A2($gren_lang$core$Array$get, rowNum, g));
					}, normalizedGrids));
		});
};
var $blaix$gren_tui$UI$joinHorizontal = F2($blaix$gren_tui$UI$joinHorizontal$);
var $blaix$gren_tui$UI$joinVertical = $gren_lang$core$Array$flatten;
var $blaix$gren_tui$UI$elementToGrid = function(element) {
	switch (element.$) {
		case 0:
			var _v1 = element.a;
			var attrs = _v1.j;
			var children = _v1.an;
			return $blaix$gren_tui$UI$joinHorizontal$(attrs, A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$elementToGrid, children));
		case 1:
			var children = element.a.an;
			return $blaix$gren_tui$UI$joinVertical(A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$elementToGrid, children));
		default:
			var _v2 = element.a;
			var attrs = _v2.j;
			var content = _v2.i;
			return [ [ { j: attrs, i: content } ] ];
	}
};
var $blaix$gren_ansi$Ansi$NoColor = 0;
var $blaix$gren_ansi$Ansi$bgColorCode = function(color_) {
	switch (color_) {
		case 0:
			return '49';
		case 1:
			return '40';
		case 2:
			return '41';
		case 3:
			return '42';
		case 4:
			return '43';
		case 5:
			return '44';
		case 6:
			return '45';
		case 7:
			return '46';
		default:
			return '47';
	}
};
var $blaix$gren_ansi$Ansi$escape = '\u001B';
var $blaix$gren_ansi$Ansi$prefix = $blaix$gren_ansi$Ansi$escape + '[';
var $blaix$gren_ansi$Ansi$setBgColor = function(color) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$prefix, $blaix$gren_ansi$Ansi$bgColorCode(color), 'm' ]);
};
var $blaix$gren_ansi$Ansi$wrapBgColor$ = function(color, string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setBgColor(color), string, $blaix$gren_ansi$Ansi$setBgColor(0) ]);
};
var $blaix$gren_ansi$Ansi$wrapBgColor = F2($blaix$gren_ansi$Ansi$wrapBgColor$);
var $blaix$gren_ansi$Ansi$colorCode = function(color_) {
	switch (color_) {
		case 0:
			return '39';
		case 1:
			return '30';
		case 2:
			return '31';
		case 3:
			return '32';
		case 4:
			return '33';
		case 5:
			return '34';
		case 6:
			return '35';
		case 7:
			return '36';
		default:
			return '37';
	}
};
var $blaix$gren_ansi$Ansi$setColor = function(color) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$prefix, $blaix$gren_ansi$Ansi$colorCode(color), 'm' ]);
};
var $blaix$gren_ansi$Ansi$wrapColor$ = function(color, string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setColor(color), string, $blaix$gren_ansi$Ansi$setColor(0) ]);
};
var $blaix$gren_ansi$Ansi$wrapColor = F2($blaix$gren_ansi$Ansi$wrapColor$);
var $blaix$gren_ansi$Ansi$NormalWeight = 0;
var $blaix$gren_ansi$Ansi$fontWeightCode = function(weight) {
	switch (weight) {
		case 0:
			return '22';
		case 1:
			return '1';
		default:
			return '2';
	}
};
var $blaix$gren_ansi$Ansi$setFontWeight = function(weight) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$prefix, $blaix$gren_ansi$Ansi$fontWeightCode(weight), 'm' ]);
};
var $blaix$gren_ansi$Ansi$wrapFontWeight$ = function(weight, string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setFontWeight(weight), string, $blaix$gren_ansi$Ansi$setFontWeight(0) ]);
};
var $blaix$gren_ansi$Ansi$wrapFontWeight = F2($blaix$gren_ansi$Ansi$wrapFontWeight$);
var $blaix$gren_ansi$Ansi$setItalic = $blaix$gren_ansi$Ansi$prefix + '3m';
var $blaix$gren_ansi$Ansi$unsetItalic = $blaix$gren_ansi$Ansi$prefix + '23m';
var $blaix$gren_ansi$Ansi$wrapItalic = function(string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setItalic, string, $blaix$gren_ansi$Ansi$unsetItalic ]);
};
var $blaix$gren_tui$UI$Attribute$apply$ = function(attr, string) {
	switch (attr.$) {
		case 0:
			var c = attr.a;
			return $blaix$gren_ansi$Ansi$wrapColor$(c, string);
		case 1:
			var c = attr.a;
			return $blaix$gren_ansi$Ansi$wrapBgColor$(c, string);
		case 2:
			var w = attr.a;
			return $blaix$gren_ansi$Ansi$wrapFontWeight$(w, string);
		default:
			return $blaix$gren_ansi$Ansi$wrapItalic(string);
	}
};
var $blaix$gren_tui$UI$Attribute$apply = F2($blaix$gren_tui$UI$Attribute$apply$);
var $blaix$gren_tui$UI$Attribute$applyAll$ = function(attrs, str) {
	return A3($gren_lang$core$Array$foldr, $blaix$gren_tui$UI$Attribute$apply, str, attrs);
};
var $blaix$gren_tui$UI$Attribute$applyAll = F2($blaix$gren_tui$UI$Attribute$applyAll$);
var $blaix$gren_tui$UI$cellToString = function(cell) {
	return $blaix$gren_tui$UI$Attribute$applyAll$(cell.j, $blaix$gren_tui$SingleLine$toString(cell.i));
};
var $blaix$gren_tui$UI$gridToString = function(grid) {
	return A2($gren_lang$core$String$join, '\n', A2($gren_lang$core$Array$map, $gren_lang$core$String$join(''), A2($gren_lang$core$Array$map, $gren_lang$core$Array$map($blaix$gren_tui$UI$cellToString), grid)));
};
var $blaix$gren_tui$UI$mergeAttributes$ = function(parentAttrs, element) {
	switch (element.$) {
		case 0:
			var _v1 = element.a;
			var attrs = _v1.j;
			var children = _v1.an;
			return $blaix$gren_tui$UI$Row({ j: _Utils_ap(parentAttrs, attrs), an: A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$mergeAttributes(_Utils_ap(parentAttrs, attrs)), children) });
		case 1:
			var _v2 = element.a;
			var attrs = _v2.j;
			var children = _v2.an;
			return $blaix$gren_tui$UI$Col({ j: _Utils_ap(parentAttrs, attrs), an: A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$mergeAttributes(_Utils_ap(parentAttrs, attrs)), children) });
		default:
			var _v3 = element.a;
			var attrs = _v3.j;
			var content = _v3.i;
			return $blaix$gren_tui$UI$Text({ j: _Utils_ap(parentAttrs, attrs), i: content });
	}
};
var $blaix$gren_tui$UI$mergeAttributes = F2($blaix$gren_tui$UI$mergeAttributes$);
var $gren_lang$core$String$dropLast$ = function(n, string) {
	return (n < 1) ? string : A3($gren_lang$core$String$slice, 0, -n, string);
};
var $gren_lang$core$String$dropLast = F2($gren_lang$core$String$dropLast$);
var $blaix$gren_tui$SingleLine$dropRight$ = function(n, _v0) {
	var string = _v0;
	return $gren_lang$core$String$dropLast$(n, string);
};
var $blaix$gren_tui$SingleLine$dropRight = F2($blaix$gren_tui$SingleLine$dropRight$);
var $blaix$gren_tui$UI$trimGridRow$ = function(maxWidth, thisRow) {
	trimGridRow:
	while (true) {
		var width = $blaix$gren_tui$UI$gridWidth([ thisRow ]);
		var popped = $gren_lang$core$Array$popLast(thisRow);
		var diff = width - maxWidth;
		if (popped.$ === 1) {
			return thisRow;
		} else {
			var _v1 = popped.a;
			var initial = _v1.bm;
			var last = _v1.aL;
			if (_Utils_cmp(diff, $blaix$gren_tui$SingleLine$width(last.i)) > -1) {
				var $temp$maxWidth = maxWidth,
				$temp$thisRow = initial;
				maxWidth = $temp$maxWidth;
				thisRow = $temp$thisRow;
				continue trimGridRow;
			} else {
				return $gren_lang$core$Array$pushLast$(_Utils_update(last, { i: $blaix$gren_tui$SingleLine$dropRight$(diff, last.i) }), initial);
			}
		}
	}
};
var $blaix$gren_tui$UI$trimGridRow = F2($blaix$gren_tui$UI$trimGridRow$);
var $blaix$gren_tui$UI$trimGrid$ = function(maxWidth, grid) {
	var width = $blaix$gren_tui$UI$gridWidth(grid);
	return (width <= 0) ? grid : ((_Utils_cmp(width, maxWidth) < 1) ? grid : $blaix$gren_tui$UI$trimGrid$(maxWidth, A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$trimGridRow(maxWidth), grid)));
};
var $blaix$gren_tui$UI$trimGrid = F2($blaix$gren_tui$UI$trimGrid$);
var $blaix$gren_tui$UI$toString$ = function(maxWidth, element) {
	return $blaix$gren_tui$UI$gridToString($blaix$gren_tui$UI$trimGrid$(maxWidth, $blaix$gren_tui$UI$elementToGrid($blaix$gren_tui$UI$mergeAttributes$([  ], element))));
};
var $blaix$gren_tui$UI$toString = F2($blaix$gren_tui$UI$toString$);
var $blaix$prettynice$CLI$update$ = function(msg, model) {
	if (!msg.$) {
		var message = msg.a;
		return { aI: $gren_lang$core$Task$execute($gren_lang$core$Stream$Log$line$(model.ar.di, $blaix$gren_tui$UI$toString$(model.a_, message))), aO: model };
	} else {
		var error = msg.a;
		return { aI: $gren_lang$core$Task$executeCmd($gren_lang$core$Task$map$(function(_v1) {
					return $gren_lang$node$Node$exitWithCode(error.cy);
				}, $gren_lang$core$Stream$Log$line$(model.ar.dh, $blaix$gren_tui$UI$toString$(model.a_, error.cU)))), aO: model };
	}
};
var $blaix$prettynice$CLI$update = F2($blaix$prettynice$CLI$update$);
var $blaix$prettynice$CLI$main = $gren_lang$node$Node$defineProgram({ cJ: $blaix$prettynice$CLI$init, dl: $blaix$prettynice$CLI$subscriptions, dr: $blaix$prettynice$CLI$update });
_Platform_export({'CLI':{'init':$blaix$prettynice$CLI$main($gren_lang$core$Json$Decode$succeed({  }))}});}(this.module ? this.module.exports : this));