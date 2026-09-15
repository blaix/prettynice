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
      applicationPath: _FilePath_fromString(
        typeof module !== "undefined" ? module.filename : process.execPath,
      ),
      arch: process.arch,
      args: process.argv,
      platform: process.platform,
      stderr: stream.Writable.toWeb(process.stderr),
      stdin: stdinProxy,
      stdout: stream.Writable.toWeb(process.stdout),
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
    directory:
      dirStr === ""
        ? []
        : dirStr.split(pathMod.sep).filter((dir) => dir.length > 0),
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

var _Platform_worker = F3(function (impl, flagDecoder, args) {
  return _Platform_initialize(
    flagDecoder,
    args,
    impl.init,
    impl.update,
    impl.subscriptions,
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
  var flags;
  var rawFlags = args ? args["flags"] : undefined;

  if (flagDecoder === null) {
    if (!(rawFlags instanceof DataView)) {
      _Debug_crash(2 /**/, "Expected DataView as flags" /**/);
    }

    flags = new DataView(rawFlags.buffer.slice());
  } else {
    var result = A2(
      _Json_run,
      flagDecoder,
      _Json_wrap(args ? args["flags"] : undefined),
    );

    $gren_lang$core$Result$isOk(result) ||
      _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);

    flags = result.a;
  }

  _Platform_setupTaskPorts(args ? args["taskPorts"] : undefined);

  var managers = {};
  var initPair = init(flags);
  var model = initPair.model;
  var stepper = stepperBuilder(sendToApp, model);
  var ports = _Platform_setupEffects(managers, sendToApp, executeCmd);

  function sendToApp(msg, viewMetadata) {
    var pair = A2(update, msg, model);
    stepper((model = pair.model), viewMetadata);
    _Platform_enqueueEffects(managers, pair.command, subscriptions(model));
  }

  function executeCmd(cmd) {
    _Platform_enqueueEffects(managers, cmd, subscriptions(model));
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

function _Platform_outgoingPort(name, converter, isBytes) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    e: _Platform_outgoingPortMap,
    v: converter,
    a: (n) => _Platform_setupOutgoingPort(n, isBytes),
  };
  return _Platform_leaf(name);
}

var _Platform_outgoingPortMap = F2(function (tagger, value) {
  return value;
});

function _Platform_setupOutgoingPort(name, isBytes) {
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
        var rawValue = converter(cmdArray[idx]);
        var value = isBytes
          ? new DataView(rawValue.buffer.slice())
          : _Json_unwrap(rawValue);
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

function _Platform_incomingPort(name, converter, isBytes) {
  _Platform_checkPortName(name);
  _Platform_effectManagers[name] = {
    f: _Platform_incomingPortMap,
    v: converter,
    a: (n, s) => _Platform_setupIncomingPort(n, s, isBytes),
  };
  return _Platform_leaf(name);
}

var _Platform_incomingPortMap = F2(function (tagger, finalTagger) {
  return function (value) {
    return tagger(finalTagger(value));
  };
});

function _Platform_setupIncomingPort(name, sendToApp, isBytes) {
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
    var value;

    if (isBytes) {
      if (!(incomingValue instanceof DataView)) {
        _Debug_crash(4, name, "Expected DataView");
      }

      value = new DataView(incomingValue.buffer.slice());
    } else {
      var result = A2(_Json_run, converter, _Json_wrap(incomingValue));

      $gren_lang$core$Result$isOk(result) || _Debug_crash(4, name, result.a);

      value = result.a;
    }

    for (var idx = 0; idx < subs.length; idx++) {
      sendToApp(subs[idx](value));
    }
  }

  return { send: send };
}

// TASK PORTS

var _Platform_taskPorts = {};

function _Platform_taskPort(
  name,
  inputConverter,
  converter,
  inputIsBytes,
  outputIsBytes,
) {
  _Platform_checkPortName(name);
  _Platform_taskPorts[name] = {};

  return function (input) {
    var encodedInput = inputConverter
      ? inputIsBytes
        ? new DataView(input.buffer.slice())
        : _Json_unwrap(inputConverter(input))
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
          var checkedValue;

          if (outputIsBytes) {
            if (!(value instanceof DataView)) {
              _Debug_crash(4, name, "Expected DataView");
            }

            checkedValue = new DataView(value.buffer.slice());
          } else {
            var result = A2(_Json_run, converter, _Json_wrap(value));

            $gren_lang$core$Result$isOk(result) || _Debug_crash(4, name, value);

            checkedValue = result.a;
          }

          callback(_Scheduler_succeed(checkedValue));
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
            exports[name],
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
    return _Debug_toAnsiString(ansi, value.array.slice(0, value.target));
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

function _Debug_crash_UNUSED(identifier) {
  throw new Error(
    "https://github.com/gren-lang/core/blob/1.0.0/hints/" + identifier + ".md",
  );
}

function _Debug_crash(identifier, fact1, fact2, fact3, fact4) {
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
			var _v1 = dict.a;
			var key = _v1.key;
			var value = _v1.value;
			var left = _v1.left;
			var right = _v1.right;
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
      return $gren_lang$core$Maybe$Just({ index: i, value: element });
    }
  }

  return $gren_lang$core$Maybe$Nothing;
});

var _Array_findLast = F2(function (pred, array) {
  for (var i = array.length - 1; i >= 0; i--) {
    var element = array[i];

    if (pred(element)) {
      return $gren_lang$core$Maybe$Just({ index: i, value: element });
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
    this.target = target;
    this.finalized = finalized;
    this.array = array;
  }
}

var _Array_emptyBuilder = function (capacity) {
  return new _Array_Builder(0, false, new Array(capacity));
};

var _Array_pushToBuilder = F2(function (value, builder) {
  var array = builder.array;
  var target = builder.target;

  if (builder.finalized) {
    array = array.slice(0, target);
  } else {
    builder.finalized = true;
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
  var result = builder.array;

  if (builder.finalized) {
    result = result.slice(0, builder.target);
  } else {
    builder.finalized = true;
    result.length = builder.target;
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
      $gren_lang$core$Json$Decode$Failure({
        message: "This is not valid JSON! " + e.message,
        value: _Json_wrap(string),
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
        : $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Field({ name: field, error: result.a }));

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
        : $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Index({ index: index, error: result.a }));

    case 7:
      if (typeof value !== "object" || value === null || _Json_isArray(value)) {
        return _Json_expecting("an OBJECT", value);
      }

      var keyValuePairs = [];
      for (var key in value) {
        if (Object.hasOwn(value, key)) {
          var result = _Json_runHelp(decoder.b, value[key]);
          if (!$gren_lang$core$Result$isOk(result)) {
            return $gren_lang$core$Result$Err(
              $gren_lang$core$Json$Decode$Field({ name: key, error: result.a }),
            );
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
      return $gren_lang$core$Result$Err(
        $gren_lang$core$Json$Decode$Failure({
          message: decoder.a,
          value: _Json_wrap(value),
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
      return $gren_lang$core$Result$Err($gren_lang$core$Json$Decode$Index({ index: i, error: result.a }));
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
      message: "Expecting " + type,
      value: _Json_wrap(value),
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
  return (
    (indentLevel === 0
      ? JSON.stringify(_Json_unwrap(value))
      : JSON.stringify(_Json_unwrap(value), null, indentLevel)) + ""
  );
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
  var unwrapped = _Json_unwrap(value);
  if (!(key === "toJSON" && typeof unwrapped === "function")) {
    object[key] = unwrapped;
  }
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
var $gren_lang$core$Json$Decode$Failure = function (a) {
	return { $: 'Failure', a: a };
};
var $gren_lang$core$Json$Decode$Field = function (a) {
	return { $: 'Field', a: a };
};
var $gren_lang$core$Json$Decode$Index = function (a) {
	return { $: 'Index', a: a };
};
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
    first: _Utils_chr(firstChar),
    rest: string.slice(firstChar.length),
  });
};

var _String_popLast = function (string) {
  var strLen = string.length;

  if (strLen === 0) {
    return $gren_lang$core$Maybe$Nothing;
  } else if (strLen === 1) {
    return $gren_lang$core$Maybe$Just({
      last: _Utils_chr(string),
      rest: "",
    });
  }

  var secondLastIdx = strLen - 2;
  var possiblyLastPoint = string.codePointAt(secondLastIdx);

  if (possiblyLastPoint > 0xffff) {
    // last character is two units
    return $gren_lang$core$Maybe$Just({
      last: _Utils_chr(String.fromCodePoint(possiblyLastPoint)),
      rest: string.slice(0, strLen - 2),
    });
  }

  return $gren_lang$core$Maybe$Just({
    last: _Utils_chr(string[strLen - 1]),
    rest: string.slice(0, strLen - 1),
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
  return Array.from(str).slice(start, end).join("");
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
  var char = str.at(index);

  if (typeof char === "undefined") {
    return $gren_lang$core$Maybe$Nothing;
  }

  return $gren_lang$core$Maybe$Just(_Utils_chr(char));
});

var _String_foldlUnits = F3(function (fn, state, str) {
  for (let i = 0; i < str.length; i++) {
    state = A2(fn, _Utils_chr(str[i]), state);
  }

  return state;
});

var _String_foldrUnits = F3(function (fn, state, str) {
  for (let i = str.length - 1; i >= 0; i--) {
    state = A2(fn, _Utils_chr(str[i]), state);
  }

  return state;
});

var _String_sliceUnits = F3(function (start, end, str) {
  return str.slice(start, end);
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
			case 'Field':
				var _v1 = error.a;
				var f = _v1.name;
				var err = _v1.error;
				var isSimple = function () {
					var _v2 = $gren_lang$core$String$popFirst(f);
					if (_v2.$ === 'Nothing') {
						return false;
					} else {
						var _v3 = _v2.a;
						var _char = _v3.first;
						var rest = _v3.rest;
						return $gren_lang$core$Char$isAlpha(_char) && $gren_lang$core$String$all$($gren_lang$core$Char$isAlphaNum, rest);
					}
				}();
				var fieldName = isSimple ? ('.' + f) : ('[\'' + (f + '\']'));
				var $temp$error = err,
				$temp$context = _Utils_ap([ fieldName ], context);
				error = $temp$error;
				context = $temp$context;
				continue errorToStringHelp;
			case 'Index':
				var _v4 = error.a;
				var i = _v4.index;
				var err = _v4.error;
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
				var _v8 = error.a;
				var msg = _v8.message;
				var json = _v8.value;
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
var $gren_lang$core$Basics$never = function(_v0) {
	never:
	while (true) {
		var nvr = _v0.a;
		var $temp$_v0 = nvr;
		_v0 = $temp$_v0;
		continue never;
	}
};
var $gren_lang$core$Task$Perform = function (a) {
	return { $: 'Perform', a: a };
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
		case 'Perform':
			var task = cmd.a;
			return _Scheduler_spawn(A2($gren_lang$core$Task$andThen, $gren_lang$core$Platform$sendToApp(router), task));
		case 'ExecuteCmd':
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
	return { $: 'Execute', a: a };
};
var $gren_lang$core$Task$ExecuteCmd = function (a) {
	return { $: 'ExecuteCmd', a: a };
};
var $gren_lang$core$Platform$Cmd$map = _Platform_map;
var $gren_lang$core$Task$cmdMap$ = function(tagger, cmd) {
	switch (cmd.$) {
		case 'Perform':
			var task = cmd.a;
			return $gren_lang$core$Task$Perform($gren_lang$core$Task$map$(tagger, task));
		case 'ExecuteCmd':
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
var $gren_lang$core$Dict$Black = { $: 'Black' };
var $gren_lang$core$Dict$RBNode_gren_builtin = function (a) {
	return { $: 'RBNode_gren_builtin', a: a };
};
var $gren_lang$core$Dict$node$ = function(color, key, value, left, right) {
	return $gren_lang$core$Dict$RBNode_gren_builtin({ color: color, key: key, left: left, right: right, value: value });
};
var $gren_lang$core$Dict$node = F5($gren_lang$core$Dict$node$);
var $gren_lang$core$Dict$Red = { $: 'Red' };
var $gren_lang$core$Dict$balance$ = function(color, key, value, left, right) {
	if ((right.$ === 'RBNode_gren_builtin') && (right.a.color.$ === 'Red')) {
		var _v1 = right.a;
		var _v2 = _v1.color;
		var rK = _v1.key;
		var rV = _v1.value;
		var rLeft = _v1.left;
		var rRight = _v1.right;
		if ((left.$ === 'RBNode_gren_builtin') && (left.a.color.$ === 'Red')) {
			var _v4 = left.a;
			var _v5 = _v4.color;
			var lK = _v4.key;
			var lV = _v4.value;
			var lLeft = _v4.left;
			var lRight = _v4.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, key, value, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, rK, rV, rLeft, rRight));
		} else {
			return $gren_lang$core$Dict$node$(color, rK, rV, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, key, value, left, rLeft), rRight);
		}
	} else {
		if ((((left.$ === 'RBNode_gren_builtin') && (left.a.color.$ === 'Red')) && (left.a.left.$ === 'RBNode_gren_builtin')) && (left.a.left.a.color.$ === 'Red')) {
			var _v7 = left.a;
			var _v8 = _v7.color;
			var lK = _v7.key;
			var lV = _v7.value;
			var _v9 = _v7.left.a;
			var _v10 = _v9.color;
			var llK = _v9.key;
			var llV = _v9.value;
			var llLeft = _v9.left;
			var llRight = _v9.right;
			var lRight = _v7.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, lK, lV, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, llK, llV, llLeft, llRight), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, key, value, lRight, right));
		} else {
			return $gren_lang$core$Dict$node$(color, key, value, left, right);
		}
	}
};
var $gren_lang$core$Dict$balance = F5($gren_lang$core$Dict$balance$);
var $gren_lang$core$Basics$compare = _Utils_compare;
var $gren_lang$core$Dict$setHelp$ = function(key, value, dict) {
	if (dict.$ === 'RBEmpty_gren_builtin') {
		return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, key, value, $gren_lang$core$Dict$RBEmpty_gren_builtin, $gren_lang$core$Dict$RBEmpty_gren_builtin);
	} else {
		var _v1 = dict.a;
		var nColor = _v1.color;
		var nKey = _v1.key;
		var nValue = _v1.value;
		var nLeft = _v1.left;
		var nRight = _v1.right;
		var _v2 = A2($gren_lang$core$Basics$compare, key, nKey);
		switch (_v2.$) {
			case 'LT':
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, $gren_lang$core$Dict$setHelp$(key, value, nLeft), nRight);
			case 'EQ':
				return $gren_lang$core$Dict$node$(nColor, nKey, value, nLeft, nRight);
			default:
				return $gren_lang$core$Dict$balance$(nColor, nKey, nValue, nLeft, $gren_lang$core$Dict$setHelp$(key, value, nRight));
		}
	}
};
var $gren_lang$core$Dict$setHelp = F3($gren_lang$core$Dict$setHelp$);
var $gren_lang$core$Dict$set$ = function(setKey, setValue, dict) {
	var _v0 = $gren_lang$core$Dict$setHelp$(setKey, setValue, dict);
	if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.color.$ === 'Red')) {
		var _v1 = _v0.a;
		var _v2 = _v1.color;
		var key = _v1.key;
		var value = _v1.value;
		var left = _v1.left;
		var right = _v1.right;
		return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, key, value, left, right);
	} else {
		var x = _v0;
		return x;
	}
};
var $gren_lang$core$Dict$set = F3($gren_lang$core$Dict$set$);
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
		return { applicationPath: raw.applicationPath, args: raw.args, cpuArchitecture: $gren_lang$node$Node$archFromString(raw.arch), platform: $gren_lang$node$Node$platformFromString(raw.platform), stderr: raw.stderr, stdin: raw.stdin, stdout: raw.stdout };
	}, _Node_init);
var $gren_lang$node$Node$unwrap = function(_v0) {
	var task = _v0.a;
	return task;
};
var $gren_lang$node$Node$initProgram$ = function(initTask, _v0) {
	return { command: $gren_lang$core$Task$perform$($gren_lang$node$Node$InitDone, A2($gren_lang$core$Task$andThen, function(env) {
				return $gren_lang$node$Node$unwrap(initTask(env));
			}, $gren_lang$node$Node$initializeEnvironment)), model: $gren_lang$node$Node$Uninitialized };
};
var $gren_lang$node$Node$initProgram = F2($gren_lang$node$Node$initProgram$);
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
	return $gren_lang$core$Platform$worker({ init: $gren_lang$node$Node$initProgram(config.init), subscriptions: $gren_lang$node$Node$subscriptions(config.subscriptions), update: $gren_lang$node$Node$update(config.update) });
};
var $gren_lang$core$Basics$identity = function(x) {
	return x;
};
var $author$project$Main$GotVersion = function (a) {
	return { $: 'GotVersion', a: a };
};
var $gren_lang$core$Task$onError = _Scheduler_onError;
var $gren_lang$core$Task$attempt$ = function(resultToMessage, task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Perform(A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Err), A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$core$Basics$composeL$($gren_lang$core$Task$succeed, resultToMessage), $gren_lang$core$Result$Ok), task))));
};
var $gren_lang$core$Task$attempt = F2($gren_lang$core$Task$attempt$);
var $gren_lang$node$Internal$Init$Task = function (a) {
	return { $: 'Task', a: a };
};
var $gren_lang$node$Init$unwrap = function(_v0) {
	var task = _v0.a;
	return task;
};
var $gren_lang$node$Init$await$ = function(_v0, fn) {
	var task = _v0.a;
	return $gren_lang$node$Internal$Init$Task(A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$node$Init$unwrap, fn), task));
};
var $gren_lang$node$Init$await = F2($gren_lang$node$Init$await$);
var $gren_lang$node$Init$awaitTask$ = function(task, fn) {
	return $gren_lang$node$Internal$Init$Task(A2($gren_lang$core$Task$andThen, $gren_lang$core$Basics$composeL$($gren_lang$node$Init$unwrap, fn), task));
};
var $gren_lang$node$Init$awaitTask = F2($gren_lang$node$Init$awaitTask$);
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, n, $gren_lang$core$Array$length(array), array);
};
var $gren_lang$core$Array$dropFirst = F2($gren_lang$core$Array$dropFirst$);
var $gren_lang$node$Node$getEnvironmentVariables = _Node_getEnvironmentVariables;
var $gren_lang$node$FileSystem$Permission = { $: 'Permission' };
var $gren_lang$node$FileSystem$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed($gren_lang$node$FileSystem$Permission));


var process = require("node:process");

var _Terminal_init = _Scheduler_binding(function (callback) {
  callback(
    _Scheduler_succeed({
      isTTY: process.stdout.isTTY && process.stdin.isTTY,
      colorDepth: process.stdout.getColorDepth
        ? process.stdout.getColorDepth()
        : 0,
      columns: process.stdout.columns,
      rows: process.stdout.rows,
    }),
  );
});

var _Terminal_attachListener = function (sendToApp) {
  return _Scheduler_binding(function (_callback) {
    var listener = function (data) {
      _Scheduler_rawSpawn(
        sendToApp({
          columns: process.stdout.columns,
          rows: process.stdout.rows,
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
var $gren_lang$node$Terminal$Permission = { $: 'Permission' };
var $gren_lang$node$Terminal$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$map$(function(raw) {
			return raw.isTTY ? $gren_lang$core$Maybe$Just({ colorDepth: raw.colorDepth, columns: raw.columns, permission: $gren_lang$node$Terminal$Permission, rows: raw.rows }) : $gren_lang$core$Maybe$Nothing;
		}, _Terminal_init));
var $gren_lang$core$Dict$get$ = function(targetKey, dict) {
	get:
	while (true) {
		if (dict.$ === 'RBEmpty_gren_builtin') {
			return $gren_lang$core$Maybe$Nothing;
		} else {
			var _v1 = dict.a;
			var key = _v1.key;
			var value = _v1.value;
			var left = _v1.left;
			var right = _v1.right;
			var _v2 = A2($gren_lang$core$Basics$compare, targetKey, key);
			switch (_v2.$) {
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
var $gren_lang$core$Dict$member$ = function(key, dict) {
	var _v0 = $gren_lang$core$Dict$get$(key, dict);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Dict$member = F2($gren_lang$core$Dict$member$);
var $gren_lang$core$Maybe$andThen$ = function(callback, maybeValue) {
	if (maybeValue.$ === 'Just') {
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
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$core$String$isEmpty = function(string) {
	return string === '';
};
var $gren_lang$node$FileSystem$Path$filenameWithExtension = function(path) {
	return $gren_lang$core$String$isEmpty(path.extension) ? path.filename : (path.filename + ('.' + path.extension));
};
var $gren_lang$core$Array$keepIf = _Array_filter;
var $gren_lang$core$Basics$neq = _Utils_notEqual;
var $gren_lang$node$FileSystem$Path$prepend$ = function(left, right) {
	return _Utils_update(left, { directory: A2($gren_lang$core$Array$keepIf, function(dir) {
				return dir !== '';
			}, $gren_lang$core$Array$append$(right.directory, $gren_lang$core$Array$pushLast$($gren_lang$node$FileSystem$Path$filenameWithExtension(left), left.directory))), extension: right.extension, filename: right.filename });
};
var $gren_lang$node$FileSystem$Path$prepend = F2($gren_lang$node$FileSystem$Path$prepend$);
var $gren_lang$node$FileSystem$Path$appendPosixString$ = function(str, path) {
	return $gren_lang$node$FileSystem$Path$prepend$(path, $gren_lang$node$FileSystem$Path$fromPosixString(str));
};
var $gren_lang$node$FileSystem$Path$appendPosixString = F2($gren_lang$node$FileSystem$Path$appendPosixString$);
var $gren_lang$core$Json$Decode$decodeString = _Json_runOnString;
var $gren_lang$node$FileSystem$Path$empty = { directory: [  ], extension: '', filename: '', root: '' };
var $gren_lang$node$FileSystem$errorToString = function(_v0) {
	var message = _v0.a.message;
	return message;
};
var $gren_lang$core$Task$fail = _Scheduler_fail;
var $gren_lang$core$Json$Decode$field = _Json_decodeField;
var $gren_lang$core$Task$mapError$ = function(convert, task) {
	return A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Task$fail, convert), task);
};
var $gren_lang$core$Task$mapError = F2($gren_lang$core$Task$mapError$);
var $gren_lang$core$Basics$sub = _Basics_sub;
var $gren_lang$core$Array$dropLast$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, 0, $gren_lang$core$Array$length(array) - n, array);
};
var $gren_lang$core$Array$dropLast = F2($gren_lang$core$Array$dropLast$);
var $gren_lang$core$Array$get = _Array_get;
var $gren_lang$core$Basics$negate = function(n) {
	return -n;
};
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
        callback(_Scheduler_succeed({ path: path, fd: fd }));
      }
    });
  });
});

var _FileSystem_constructError = function (path, err) {
  return $gren_lang$node$FileSystem$Error({
    path: path,
    code: err.code || "",
    message: err.message || "",
  });
};

var _FileSystem_close = function (fh) {
  return _Scheduler_binding(function (callback) {
    fs.close(fh.fd, function (err) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.path, err)));
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
    fh.fd,
    buffer,
    bufferOffset,
    maxReadLength,
    fileOffset,
    function (err, bytesRead, _buff) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.path, err)));
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
      options.offset,
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
    fh.fd,
    buffer,
    bufferOffset,
    length,
    fileOffset,
    function (err, bytesWritten, buffer) {
      if (err != null) {
        callback(_Scheduler_fail(_FileSystem_constructError(fh.path, err)));
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
    recursive: options.recursive,
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
      { recursive: options.recursive },
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
                path: _FilePath_fromString(f.name),
                entityType: _FileSystem_toEntityType(f),
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
    fs.fchmod(fd.fd, mode, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fchown = F2(function (ids, fd) {
  return _Scheduler_binding(function (callback) {
    fs.fchown(fd.fd, ids.userID, ids.groupID, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_fdatasync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fdatasync(fd.fd, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fsync = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fsync(fd.fd, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
};

var _FileSystem_fstat = function (fd) {
  return _Scheduler_binding(function (callback) {
    fs.fstat(fd.fd, function (err, stats) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(_FileSystem_statToGrenRecord(stats)));
      }
    });
  });
};

var _FileSystem_ftruncate = F2(function (len, fd) {
  return _Scheduler_binding(function (callback) {
    fs.ftruncate(fd.fd, len, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
      } else {
        callback(_Scheduler_succeed(fd));
      }
    });
  });
});

var _FileSystem_futimes = F3(function (atime, mtime, fd) {
  return _Scheduler_binding(function (callback) {
    fs.futimes(fd.fd, atime, mtime, function (err) {
      if (err) {
        callback(_Scheduler_fail(_FileSystem_constructError(fd.path, err)));
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
      ids.userID,
      ids.groupID,
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
      ids.userID,
      ids.groupID,
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
        start: opts.start,
        end: opts.end === -1 ? undefined : opts.end,
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
	return { $: 'Changed', a: a };
};
var $gren_lang$node$FileSystem$Device = { $: 'Device' };
var $gren_lang$node$FileSystem$Directory = { $: 'Directory' };
var $gren_lang$node$FileSystem$Error = function (a) {
	return { $: 'Error', a: a };
};
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
var $gren_lang$node$FileSystem$readFile$ = function(_v0, path) {
	return _FileSystem_readFile(path);
};
var $gren_lang$node$FileSystem$readFile = F2($gren_lang$node$FileSystem$readFile$);
var $gren_lang$core$Json$Decode$string = _Json_decodeString;


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
			var w = builder.a.width;
			return w;
		default:
			var bs = builder.a;
			return _Bytes_length(bs);
	}
};
var $gren_lang$core$Bytes$LE = { $: 'LE' };
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$core$Bytes$Encode$write$ = function(builder, mb, offset) {
	switch (builder.$) {
		case 'I8':
			var n = builder.a;
			return A3(_Bytes_write_i8, mb, offset, n);
		case 'I16':
			var _v1 = builder.a;
			var e = _v1.endian;
			var n = _v1.number;
			return A4(_Bytes_write_i16, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'I32':
			var _v2 = builder.a;
			var e = _v2.endian;
			var n = _v2.number;
			return A4(_Bytes_write_i32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'U8':
			var n = builder.a;
			return A3(_Bytes_write_u8, mb, offset, n);
		case 'U16':
			var _v3 = builder.a;
			var e = _v3.endian;
			var n = _v3.number;
			return A4(_Bytes_write_u16, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'U32':
			var _v4 = builder.a;
			var e = _v4.endian;
			var n = _v4.number;
			return A4(_Bytes_write_u32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'F32':
			var _v5 = builder.a;
			var e = _v5.endian;
			var n = _v5.number;
			return A4(_Bytes_write_f32, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'F64':
			var _v6 = builder.a;
			var e = _v6.endian;
			var n = _v6.number;
			return A4(_Bytes_write_f64, mb, offset, n, _Utils_eq(e, $gren_lang$core$Bytes$LE));
		case 'Seq':
			var bs = builder.a.items;
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
var $gren_lang$core$Bytes$toString = _Bytes_toString;
var $gren_lang$core$Maybe$withDefault$ = function(_default, maybe) {
	if (maybe.$ === 'Just') {
		var value = maybe.a;
		return value;
	} else {
		return _default;
	}
};
var $gren_lang$core$Maybe$withDefault = F2($gren_lang$core$Maybe$withDefault$);
var $author$project$Main$readPackageVersion$ = function(fsPerm, applicationPath) {
	var packageJsonPath = $gren_lang$node$FileSystem$Path$appendPosixString$('package.json', $gren_lang$core$Maybe$withDefault$($gren_lang$node$FileSystem$Path$empty, $gren_lang$core$Maybe$andThen$($gren_lang$node$FileSystem$Path$parentPath, $gren_lang$node$FileSystem$Path$parentPath(applicationPath))));
	return A2($gren_lang$core$Task$andThen, function(bytes) {
			var version = A2($gren_lang$core$Json$Decode$decodeString, A2($gren_lang$core$Json$Decode$field, 'version', $gren_lang$core$Json$Decode$string), $gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Bytes$toString(bytes)));
			if (version.$ === 'Ok') {
				var v = version.a;
				return $gren_lang$core$Task$succeed(v);
			} else {
				return $gren_lang$core$Task$fail('I could not parse a version from the prettynice package.json.');
			}
		}, $gren_lang$core$Task$mapError$($gren_lang$node$FileSystem$errorToString, $gren_lang$node$FileSystem$readFile$(fsPerm, packageJsonPath)));
};
var $author$project$Main$readPackageVersion = F2($author$project$Main$readPackageVersion$);
var $gren_lang$node$Node$startProgram = function(initResult) {
	return $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed(initResult));
};
var $gren_lang$node$FileSystem$Path$toPosixString = _FilePath_toPosix;
var $gren_lang$node$FileSystem$Path$toWin32String = _FilePath_toWin32;
var $author$project$Main$init = function(env) {
	return $gren_lang$node$Init$await$($gren_lang$node$FileSystem$initialize, function(fsPerm) {
			return $gren_lang$node$Init$await$($gren_lang$node$Terminal$initialize, function(termConfig) {
					return $gren_lang$node$Init$awaitTask$($gren_lang$node$Node$getEnvironmentVariables, function(envVars) {
							return $gren_lang$node$Node$startProgram({ command: $gren_lang$core$Task$attempt$($author$project$Main$GotVersion, $author$project$Main$readPackageVersion$(fsPerm, env.applicationPath)), model: { args: $gren_lang$core$Array$dropFirst$(2, env.args), pathToString: function () {
									var _v0 = env.platform;
									if (_v0.$ === 'Win32') {
										return $gren_lang$node$FileSystem$Path$toWin32String;
									} else {
										return $gren_lang$node$FileSystem$Path$toPosixString;
									}
								}(), stderr: env.stderr, stdout: env.stdout, useColor: function () {
									if (termConfig.$ === 'Just') {
										return !$gren_lang$core$Dict$member$('NO_COLOR', envVars);
									} else {
										return false;
									}
								}() } });
						});
				});
		});
};
var $gren_lang$core$Json$Decode$succeed = _Json_succeed;
var $gren_lang$compiler_node$Cli$Report$Report = function (a) {
	return { $: 'Report', a: a };
};
var $gren_lang$compiler_node$Cli$Report$create$ = function(title, maybePath, message) {
	return $gren_lang$compiler_node$Cli$Report$Report({ maybePath: maybePath, message: message, title: title });
};
var $gren_lang$compiler_node$Cli$Report$create = F3($gren_lang$compiler_node$Cli$Report$create$);
var $gren_lang$compiler_node$Cli$Report$Terminal = function (a) {
	return { $: 'Terminal', a: a };
};
var $gren_lang$core$Task$executeCmd = function(task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$ExecuteCmd(task));
};
var $gren_lang$node$Node$exitWithCode = function(code) {
	return _Node_exitWithCode(code);
};


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
            switch (action.ctor) {
              case "UpdateState":
                this.state = action.state;
                break;
              case "Send":
                this.state = action.state;
                for (let value of action.send) {
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
                for (let value of action.send) {
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
                controller.error(action.cancelReason);
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
	return { $: 'Cancelled', a: a };
};
var $gren_lang$core$Stream$Closed = { $: 'Closed' };
var $gren_lang$core$Stream$Locked = { $: 'Locked' };
var $gren_lang$core$Stream$write = _Stream_write;
var $gren_lang$core$Stream$Log$bytes$ = function(stream, data) {
	return A2($gren_lang$core$Task$onError, function(_v1) {
			return $gren_lang$core$Task$succeed({  });
		}, A2($gren_lang$core$Task$andThen, function(_v0) {
				return $gren_lang$core$Task$succeed({  });
			}, A2($gren_lang$core$Stream$write, data, stream)));
};
var $gren_lang$core$Stream$Log$bytes = F2($gren_lang$core$Stream$Log$bytes$);
var $gren_lang$core$Bytes$fromString = _Bytes_fromString;
var $gren_lang$core$Stream$Log$string$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$bytes$(stream, $gren_lang$core$Bytes$fromString(data));
};
var $gren_lang$core$Stream$Log$string = F2($gren_lang$core$Stream$Log$string$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$Cyan = { $: 'Cyan' };
var $gren_lang$compiler_node$Cli$PrettyPrinter$Block = function (a) {
	return { $: 'Block', a: a };
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$block = function(docs) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Block(docs);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$Colorized = function (a) {
	return { $: 'Colorized', a: a };
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$color$ = function(clr, doc) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Colorized({ color: clr, document: doc, intense: false });
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$color = F2($gren_lang$compiler_node$Cli$PrettyPrinter$color$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$Empty = { $: 'Empty' };
var $gren_lang$compiler_node$Cli$PrettyPrinter$empty = $gren_lang$compiler_node$Cli$PrettyPrinter$Empty;
var $gren_lang$core$Maybe$map$ = function(f, maybe) {
	if (maybe.$ === 'Just') {
		var value = maybe.a;
		return $gren_lang$core$Maybe$Just(f(value));
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$map = F2($gren_lang$core$Maybe$map$);
var $gren_lang$core$Basics$gt = _Utils_gt;
var $gren_lang$core$Basics$max$ = function(x, y) {
	return (_Utils_cmp(x, y) > 0) ? x : y;
};
var $gren_lang$core$Basics$max = F2($gren_lang$core$Basics$max$);
var $gren_lang$core$Json$Encode$object = function(pairs) {
	return _Json_wrap(A3($gren_lang$core$Array$foldl, F2(function(_v0, obj) {
					var key = _v0.key;
					var value = _v0.value;
					return A3(_Json_addField, key, value, obj);
				}), _Json_emptyObject({  }), pairs));
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$Indented = function (a) {
	return { $: 'Indented', a: a };
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$VerticalBlock = function (a) {
	return { $: 'VerticalBlock', a: a };
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$stripColor = function(doc) {
	switch (doc.$) {
		case 'Empty':
			return doc;
		case 'Text':
			return doc;
		case 'Words':
			return doc;
		case 'Colorized':
			var colorizedDocument = doc.a.document;
			return colorizedDocument;
		case 'Indented':
			var document = doc.a;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$Indented($gren_lang$compiler_node$Cli$PrettyPrinter$stripColor(document));
		case 'Block':
			var docs = doc.a;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$Block(A2($gren_lang$core$Array$map, $gren_lang$compiler_node$Cli$PrettyPrinter$stripColor, docs));
		default:
			var docs = doc.a;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$VerticalBlock(A2($gren_lang$core$Array$map, $gren_lang$compiler_node$Cli$PrettyPrinter$stripColor, docs));
	}
};
var $gren_lang$core$String$repeat = _String_repeat;
var $gren_lang$core$String$foldl = _String_foldl;
var $gren_lang$core$String$count = function(string) {
	return A3($gren_lang$core$String$foldl, F2(function(_v0, num) {
				return num + 1;
			}), 0, string);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$addToWordSplitter$ = function(maxWidth, str, _v0) {
	addToWordSplitter:
	while (true) {
		var currentLine = _v0.currentLine;
		var lines = _v0.lines;
		if (_Utils_eq(currentLine, [  ])) {
			return { currentLine: [ str ], lines: lines };
		} else {
			var currentWidth = $gren_lang$core$String$count(A2($gren_lang$core$String$join, ' ', currentLine));
			if (_Utils_cmp($gren_lang$core$String$count(str) + currentWidth, maxWidth) > 0) {
				var $temp$maxWidth = maxWidth,
				$temp$str = str,
				$temp$_v0 = { currentLine: [  ], lines: $gren_lang$core$Array$pushLast$(currentLine, lines) };
				maxWidth = $temp$maxWidth;
				str = $temp$str;
				_v0 = $temp$_v0;
				continue addToWordSplitter;
			} else {
				return { currentLine: $gren_lang$core$Array$pushLast$(str, currentLine), lines: lines };
			}
		}
	}
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$addToWordSplitter = F3($gren_lang$compiler_node$Cli$PrettyPrinter$addToWordSplitter$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorCode$ = function(clr, intense) {
	var baseValue = function () {
		switch (clr.$) {
			case 'Black':
				return 30;
			case 'Red':
				return 31;
			case 'Green':
				return 32;
			case 'Yellow':
				return 33;
			case 'Blue':
				return 34;
			case 'Magenta':
				return 35;
			case 'Cyan':
				return 36;
			default:
				return 37;
		}
	}();
	var appliedIntensity = intense ? (baseValue + 60) : baseValue;
	return $gren_lang$core$String$fromInt(appliedIntensity);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorCode = F2($gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorCode$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorEscapePrefix = '\u001B[';
var $gren_lang$compiler_node$Cli$PrettyPrinter$emptyWordSplitter = { currentLine: [  ], lines: [  ] };
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
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$core$String$unitLength = _String_unitLength;
var $gren_lang$core$String$dropFirst$ = function(n, string) {
	return (n < 1) ? string : A3($gren_lang$core$String$slice, n, $gren_lang$core$String$unitLength(string), string);
};
var $gren_lang$core$String$dropFirst = F2($gren_lang$core$String$dropFirst$);
var $gren_lang$core$String$takeFirst$ = function(n, string) {
	return (n < 1) ? '' : A3($gren_lang$core$String$slice, 0, n, string);
};
var $gren_lang$core$String$takeFirst = F2($gren_lang$core$String$takeFirst$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLengthHelper$ = function(size, str, acc) {
	splitByLengthHelper:
	while (true) {
		if (str === '') {
			return acc;
		} else {
			var rest = $gren_lang$core$String$dropFirst$(size, str);
			var first = $gren_lang$core$String$takeFirst$(size, str);
			var $temp$size = size,
			$temp$str = rest,
			$temp$acc = $gren_lang$core$Array$pushLast$(first, acc);
			size = $temp$size;
			str = $temp$str;
			acc = $temp$acc;
			continue splitByLengthHelper;
		}
	}
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLengthHelper = F3($gren_lang$compiler_node$Cli$PrettyPrinter$splitByLengthHelper$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLength$ = function(size, str) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLengthHelper$(size, str, [  ]);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLength = F2($gren_lang$compiler_node$Cli$PrettyPrinter$splitByLength$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper$ = function(indentPrefix, nextIndent, maxColumns, newlineSeparator, doc) {
	toStringHelper:
	while (true) {
		switch (doc.$) {
			case 'Empty':
				return '';
			case 'Text':
				var str = doc.a;
				var indentedText = _Utils_ap(indentPrefix, str);
				return (_Utils_cmp($gren_lang$core$String$count(indentedText), maxColumns) > 0) ? A2($gren_lang$core$String$join, newlineSeparator, $gren_lang$compiler_node$Cli$PrettyPrinter$splitByLength$(maxColumns, indentedText)) : indentedText;
			case 'Words':
				var parts = doc.a;
				var maxColumnsAfterIndent = maxColumns - $gren_lang$core$String$count(indentPrefix);
				var wordSplitter = A3($gren_lang$core$Array$foldl, $gren_lang$compiler_node$Cli$PrettyPrinter$addToWordSplitter(maxColumnsAfterIndent), $gren_lang$compiler_node$Cli$PrettyPrinter$emptyWordSplitter, parts);
				return A2($gren_lang$core$String$join, newlineSeparator, A2($gren_lang$core$Array$map, function(line) {
							return _Utils_ap(indentPrefix, A2($gren_lang$core$String$join, ' ', line));
						}, $gren_lang$core$Array$pushLast$(wordSplitter.currentLine, wordSplitter.lines)));
			case 'Colorized':
				var _v1 = doc.a;
				var clr = _v1.color;
				var intense = _v1.intense;
				var document = _v1.document;
				return A2($gren_lang$core$String$join, '', [ $gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorEscapePrefix + ($gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorCode$(clr, intense) + 'm'), $gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper$(indentPrefix, nextIndent, maxColumns, newlineSeparator, document), $gren_lang$compiler_node$Cli$PrettyPrinter$ansiColorEscapePrefix + '39m' ]);
			case 'Indented':
				var document = doc.a;
				var $temp$indentPrefix = nextIndent(indentPrefix),
				$temp$nextIndent = nextIndent,
				$temp$maxColumns = maxColumns,
				$temp$newlineSeparator = newlineSeparator,
				$temp$doc = document;
				indentPrefix = $temp$indentPrefix;
				nextIndent = $temp$nextIndent;
				maxColumns = $temp$maxColumns;
				newlineSeparator = $temp$newlineSeparator;
				doc = $temp$doc;
				continue toStringHelper;
			case 'Block':
				var docs = doc.a;
				var _v2 = $gren_lang$core$Array$popFirst(docs);
				if (_v2.$ === 'Nothing') {
					return '';
				} else {
					var _v3 = _v2.a;
					var first = _v3.first;
					var rest = _v3.rest;
					return A2($gren_lang$core$String$join, '', $gren_lang$core$Array$pushFirst$($gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper$(indentPrefix, nextIndent, maxColumns, newlineSeparator, first), A2($gren_lang$core$Array$map, A4($gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper, '', $gren_lang$core$Basics$identity, maxColumns, newlineSeparator), rest)));
				}
			default:
				var docs = doc.a;
				return A2($gren_lang$core$String$join, newlineSeparator, A2($gren_lang$core$Array$map, A4($gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper, indentPrefix, nextIndent, maxColumns, newlineSeparator), docs));
		}
	}
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper = F5($gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$toStringWithOptions$ = function(_v0, doc) {
	var maxColumns = _v0.maxColumns;
	var indentationSize = _v0.indentationSize;
	var newlineSeparator = _v0.newlineSeparator;
	return $gren_lang$compiler_node$Cli$PrettyPrinter$toStringHelper$('', function(currentIndent) {
			return _Utils_ap(A2($gren_lang$core$String$repeat, indentationSize, ' '), currentIndent);
		}, maxColumns, newlineSeparator, doc);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$toStringWithOptions = F2($gren_lang$compiler_node$Cli$PrettyPrinter$toStringWithOptions$);
var $gren_lang$compiler_node$Cli$Report$prettyPrint$ = function(_v0, doc) {
	var useColor = _v0.useColor;
	return $gren_lang$compiler_node$Cli$PrettyPrinter$toStringWithOptions$({ indentationSize: 4, maxColumns: 80, newlineSeparator: '\n' }, useColor ? doc : $gren_lang$compiler_node$Cli$PrettyPrinter$stripColor(doc));
};
var $gren_lang$compiler_node$Cli$Report$prettyPrint = F2($gren_lang$compiler_node$Cli$Report$prettyPrint$);
var $gren_lang$core$Json$Encode$string = _Json_wrap;
var $gren_lang$compiler_node$Cli$PrettyPrinter$Text = function (a) {
	return { $: 'Text', a: a };
};
var $gren_lang$core$String$replace$ = function(before, after, string) {
	return A2($gren_lang$core$String$join, after, A2($gren_lang$core$String$split, before, string));
};
var $gren_lang$core$String$replace = F3($gren_lang$core$String$replace$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$text = function(str) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Text($gren_lang$core$String$replace$('\n', ' ', $gren_lang$core$String$replace$('\r', '', str)));
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock = function(docs) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$VerticalBlock(docs);
};
var $gren_lang$compiler_node$Cli$Report$toString$ = function(outputType, pathToString, report) {
	if (outputType.$ === 'Json') {
		if (report.$ === 'Empty') {
			return A2($gren_lang$core$Json$Encode$encode, 0, $gren_lang$core$Json$Encode$object([  ]));
		} else {
			var _v2 = report.a;
			var title = _v2.title;
			var maybePath = _v2.maybePath;
			var message = _v2.message;
			return A2($gren_lang$core$Json$Encode$encode, 4, $gren_lang$core$Json$Encode$object([ { key: 'type', value: $gren_lang$core$Json$Encode$string('error') }, { key: 'title', value: $gren_lang$core$Json$Encode$string(title) }, { key: 'path', value: $gren_lang$core$Json$Encode$string($gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Maybe$map$(pathToString, maybePath))) }, { key: 'message', value: $gren_lang$core$Json$Encode$string($gren_lang$compiler_node$Cli$Report$prettyPrint$({ useColor: false }, message)) } ]));
		}
	} else {
		var printOpts = outputType.a;
		return $gren_lang$compiler_node$Cli$Report$prettyPrint$(printOpts, function () {
				if (report.$ === 'Empty') {
					return $gren_lang$compiler_node$Cli$PrettyPrinter$empty;
				} else {
					var _v4 = report.a;
					var title = _v4.title;
					var maybePath = _v4.maybePath;
					var message = _v4.message;
					var makeDashes = function(n) {
						return A2($gren_lang$core$String$repeat, $gren_lang$core$Basics$max$(1, 80 - n), '-');
					};
					var errorBarEnd = function () {
						if (maybePath.$ === 'Nothing') {
							return makeDashes(4 + $gren_lang$core$String$unitLength(title));
						} else {
							var path = maybePath.a;
							var pathStr = pathToString(path);
							return ' ' + (makeDashes((5 + $gren_lang$core$String$unitLength(title)) + $gren_lang$core$String$unitLength(pathStr)) + (' ' + pathStr));
						}
					}();
					var errorBar = $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Cyan, $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$text('-- '), $gren_lang$compiler_node$Cli$PrettyPrinter$text(title), $gren_lang$compiler_node$Cli$PrettyPrinter$text(errorBarEnd) ]));
					return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ errorBar, $gren_lang$compiler_node$Cli$PrettyPrinter$empty, message, $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
				}
			}());
	}
};
var $gren_lang$compiler_node$Cli$Report$toString = F3($gren_lang$compiler_node$Cli$Report$toString$);
var $author$project$Main$fail$ = function(model, report) {
	return $gren_lang$core$Task$executeCmd($gren_lang$core$Task$map$(function(_v0) {
				return $gren_lang$node$Node$exitWithCode(1);
			}, $gren_lang$core$Stream$Log$string$(model.stderr, $gren_lang$compiler_node$Cli$Report$toString$($gren_lang$compiler_node$Cli$Report$Terminal({ useColor: model.useColor }), model.pathToString, report))));
};
var $author$project$Main$fail = F2($author$project$Main$fail$);
var $gren_lang$compiler_node$Cli$PrettyPrinter$Red = { $: 'Red' };
var $gren_lang$compiler_node$Cli$PrettyPrinter$Green = { $: 'Green' };
var $gren_lang$compiler_node$Cli$PrettyPrinter$Yellow = { $: 'Yellow' };
var $gren_lang$compiler_node$Cli$PrettyPrinter$indent = function(doc) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Indented(doc);
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$Words = function (a) {
	return { $: 'Words', a: a };
};
var $gren_lang$core$String$words = _String_words;
var $gren_lang$compiler_node$Cli$PrettyPrinter$words = function(str) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Words($gren_lang$core$String$words(str));
};
var $gren_lang$compiler_node$Cli$Parser$argumentErrorPrettified = function(err) {
	if (err.$ === 'ArgumentParserWrongArity') {
		var info = err.a;
		return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('I was expecting ' + ($gren_lang$core$String$fromInt(info.expected) + (' arguments, but seem to have received ' + ($gren_lang$core$String$fromInt(info.actual) + '.')))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
	} else {
		var info = err.a;
		return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('I\'m having trouble with this argument:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text(info.argument))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('It\'s supposed to be a'), $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Yellow, $gren_lang$compiler_node$Cli$PrettyPrinter$text(' <' + (info.title + '> '))), $gren_lang$compiler_node$Cli$PrettyPrinter$words('value, like one of these:') ]), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Green, $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock(A2($gren_lang$core$Array$map, $gren_lang$compiler_node$Cli$PrettyPrinter$text, info.examples)))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
	}
};
var $gren_lang$compiler_node$Cli$Parser$GroupParser = function (a) {
	return { $: 'GroupParser', a: a };
};
var $gren_lang$compiler_node$Cli$Parser$UnknownCommand = function (a) {
	return { $: 'UnknownCommand', a: a };
};
var $gren_lang$compiler_node$Cli$Parser$defineGroup = $gren_lang$compiler_node$Cli$Parser$GroupParser({ knownCommands: $gren_lang$core$Dict$empty, parseFn: F3(function(_v0, name, _v1) {
			return $gren_lang$compiler_node$Cli$Parser$UnknownCommand(name);
		}) });
var $gren_lang$compiler_node$Cli$PrettyPrinter$intenseColor$ = function(clr, doc) {
	return $gren_lang$compiler_node$Cli$PrettyPrinter$Colorized({ color: clr, document: doc, intense: true });
};
var $gren_lang$compiler_node$Cli$PrettyPrinter$intenseColor = F2($gren_lang$compiler_node$Cli$PrettyPrinter$intenseColor$);
var $author$project$Main$cli = function(version) {
	return { commands: $gren_lang$compiler_node$Cli$Parser$defineGroup, intro: $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$text('Prettynice '), $gren_lang$compiler_node$Cli$PrettyPrinter$intenseColor$($gren_lang$compiler_node$Cli$PrettyPrinter$Green, $gren_lang$compiler_node$Cli$PrettyPrinter$text(version)), $gren_lang$compiler_node$Cli$PrettyPrinter$text(': a fullstack web framework for Gren.') ]), name: 'prettynice', outro: $gren_lang$compiler_node$Cli$PrettyPrinter$words('Documentation can be found at https://prettynice.dev'), version: version };
};
var $gren_lang$compiler_node$Cli$Parser$describeFlagUse$ = function(knownFlags, flagName) {
	var _v0 = $gren_lang$core$Dict$get$(flagName, knownFlags);
	if (_v0.$ === 'Just') {
		var flagDescription = _v0.a;
		var examples = A2($gren_lang$core$Array$map, function(exampleStr) {
				return $gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + (flagName + ('=' + exampleStr)));
			}, flagDescription.examples);
		return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('It neeeds a'), $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Yellow, $gren_lang$compiler_node$Cli$PrettyPrinter$text(' <' + (flagDescription.title + '> '))), $gren_lang$compiler_node$Cli$PrettyPrinter$words(' like this:') ]), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Green, $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock(examples))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
	} else {
		return $gren_lang$compiler_node$Cli$PrettyPrinter$empty;
	}
};
var $gren_lang$compiler_node$Cli$Parser$describeFlagUse = F2($gren_lang$compiler_node$Cli$Parser$describeFlagUse$);
var $gren_lang$compiler_node$Cli$Parser$flagErrorPrettified = function(err) {
	switch (err.$) {
		case 'FlagParserFoundValueOnToggle':
			var _v1 = err.a;
			var knownFlags = _v1.knownFlags;
			var flagName = _v1.flagName;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('This flag doesn\'t take a value:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + flagName))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$words('Try removing the value.'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
		case 'FlagParserMissingValue':
			var _v2 = err.a;
			var knownFlags = _v2.knownFlags;
			var flagName = _v2.flagName;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('This flag needs more information:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + flagName))), $gren_lang$compiler_node$Cli$Parser$describeFlagUse$(knownFlags, flagName) ]);
		case 'FlagParserInvalidValue':
			var _v3 = err.a;
			var knownFlags = _v3.knownFlags;
			var flagName = _v3.flagName;
			return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('This flag was passed an invalid value:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + flagName))), $gren_lang$compiler_node$Cli$Parser$describeFlagUse$(knownFlags, flagName) ]);
		default:
			var _v4 = err.a;
			var knownFlags = _v4.knownFlags;
			var flagName = _v4.flagName;
			var otherFlags = $gren_lang$core$Dict$foldl$(F3(function(name, desc, doc) {
						return (desc.title === '') ? $gren_lang$core$Array$pushLast$($gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + name), doc) : $gren_lang$core$Array$pushLast$($gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + (name + ('=<' + (desc.title + '>')))), doc);
					}), [  ], knownFlags);
			var suffix = ($gren_lang$core$Array$length(otherFlags) === 0) ? $gren_lang$compiler_node$Cli$PrettyPrinter$empty : $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$words('Maybe you meant one of these?'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Green, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock(otherFlags))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
			return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('I don\'t recognize this flag:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text('--' + flagName))), suffix ]);
	}
};
var $gren_lang$core$Task$execute = function(task) {
	return $gren_lang$core$Task$command($gren_lang$core$Task$Execute($gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, task)));
};
var $gren_lang$core$Stream$Log$line$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$string$(stream, data + '\n');
};
var $gren_lang$core$Stream$Log$line = F2($gren_lang$core$Stream$Log$line$);
var $author$project$Main$print$ = function(model, doc) {
	return $gren_lang$core$Task$execute($gren_lang$core$Stream$Log$line$(model.stdout, $gren_lang$compiler_node$Cli$Report$prettyPrint$({ useColor: model.useColor }, doc)));
};
var $author$project$Main$print = F2($author$project$Main$print$);
var $gren_lang$compiler_node$Cli$Parser$HelpText = function (a) {
	return { $: 'HelpText', a: a };
};
var $gren_lang$core$Dict$isEmpty = function(dict) {
	if (dict.$ === 'RBEmpty_gren_builtin') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Dict$mapAndKeepJust$ = function(toMaybe, dict) {
	return $gren_lang$core$Dict$foldl$(F3(function(k, v, d) {
				var _v0 = A2(toMaybe, k, v);
				if (_v0.$ === 'Just') {
					var newValue = _v0.a;
					return $gren_lang$core$Dict$set$(k, newValue, d);
				} else {
					return d;
				}
			}), $gren_lang$core$Dict$empty, dict);
};
var $gren_lang$core$Dict$mapAndKeepJust = F2($gren_lang$core$Dict$mapAndKeepJust$);
var $gren_lang$compiler_node$Cli$Parser$appHelpText = function(appDef) {
	var _v0 = appDef.commands;
	var knownCommands = _v0.a.knownCommands;
	var commonCommands = $gren_lang$core$Dict$mapAndKeepJust$(F2(function(_v1, commonDescription) {
				return commonDescription;
			}), knownCommands);
	var knownCommandsDocument = $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Cyan, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock(A2($gren_lang$core$Array$map, function(command) {
							return $gren_lang$compiler_node$Cli$PrettyPrinter$text(appDef.name + (' ' + command));
						}, $gren_lang$core$Dict$keys(knownCommands))))), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$text('Adding the '), $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Cyan, $gren_lang$compiler_node$Cli$PrettyPrinter$text('--help')), $gren_lang$compiler_node$Cli$PrettyPrinter$text(' flag gives you more details about a specific command.') ]) ]);
	var commandBlock = $gren_lang$core$Dict$isEmpty(commonCommands) ? $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('In order to do something useful, you need to give me a command. Here\'s a full list:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, knownCommandsDocument ]) : $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$words('The most common commands are:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock($gren_lang$core$Dict$foldl$(F3(function(name, description, acc) {
							return $gren_lang$core$Array$pushLast$($gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$intenseColor$($gren_lang$compiler_node$Cli$PrettyPrinter$Cyan, $gren_lang$compiler_node$Cli$PrettyPrinter$text(appDef.name + (' ' + name))), $gren_lang$compiler_node$Cli$PrettyPrinter$indent($gren_lang$compiler_node$Cli$PrettyPrinter$words(description)), $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]), acc);
						}), [  ], commonCommands))), $gren_lang$compiler_node$Cli$PrettyPrinter$words('There are a bunch of other commands as well though. Here is a full list:'), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, knownCommandsDocument ]);
	return $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ appDef.intro, $gren_lang$compiler_node$Cli$PrettyPrinter$empty, commandBlock, $gren_lang$compiler_node$Cli$PrettyPrinter$empty, appDef.outro, $gren_lang$compiler_node$Cli$PrettyPrinter$empty ]);
};
var $gren_lang$compiler_node$Cli$Parser$run$ = function(tokens, appDef) {
	var _v0 = appDef.commands;
	var parse = _v0.a.parseFn;
	var _v1 = $gren_lang$core$Array$popFirst(tokens);
	if (_v1.$ === 'Just') {
		var _v2 = _v1.a;
		var command = _v2.first;
		var rawTokensAfterCommand = _v2.rest;
		switch (command) {
			case '--version':
				return $gren_lang$compiler_node$Cli$Parser$HelpText($gren_lang$compiler_node$Cli$PrettyPrinter$text(appDef.version));
			case '--help':
				return $gren_lang$compiler_node$Cli$Parser$HelpText($gren_lang$compiler_node$Cli$Parser$appHelpText(appDef));
			default:
				return A3(parse, appDef.name, command, rawTokensAfterCommand);
		}
	} else {
		return $gren_lang$compiler_node$Cli$Parser$HelpText($gren_lang$compiler_node$Cli$Parser$appHelpText(appDef));
	}
};
var $gren_lang$compiler_node$Cli$Parser$run = F2($gren_lang$compiler_node$Cli$Parser$run$);
var $author$project$Main$runCommand$ = function(model, version) {
	var _v0 = $gren_lang$compiler_node$Cli$Parser$run$(model.args, $author$project$Main$cli(version));
	switch (_v0.$) {
		case 'HelpText':
			var helpText = _v0.a;
			return $author$project$Main$print$(model, helpText);
		case 'Success':
			return $gren_lang$core$Platform$Cmd$none;
		case 'UnknownCommand':
			var command = _v0.a;
			return $author$project$Main$fail$(model, $gren_lang$compiler_node$Cli$Report$create$('UNKNOWN COMMAND', $gren_lang$core$Maybe$Nothing, $gren_lang$compiler_node$Cli$PrettyPrinter$verticalBlock([ $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$text('I don\'t recognize this command: '), $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Red, $gren_lang$compiler_node$Cli$PrettyPrinter$text(command)) ]), $gren_lang$compiler_node$Cli$PrettyPrinter$empty, $gren_lang$compiler_node$Cli$PrettyPrinter$block([ $gren_lang$compiler_node$Cli$PrettyPrinter$text('Run '), $gren_lang$compiler_node$Cli$PrettyPrinter$color$($gren_lang$compiler_node$Cli$PrettyPrinter$Cyan, $gren_lang$compiler_node$Cli$PrettyPrinter$text('prettynice --help')), $gren_lang$compiler_node$Cli$PrettyPrinter$text(' to see the commands I do recognize.') ]) ])));
		case 'BadFlags':
			var error = _v0.a;
			return $author$project$Main$fail$(model, $gren_lang$compiler_node$Cli$Report$create$('BAD FLAGS', $gren_lang$core$Maybe$Nothing, $gren_lang$compiler_node$Cli$Parser$flagErrorPrettified(error)));
		default:
			var error = _v0.a;
			return $author$project$Main$fail$(model, $gren_lang$compiler_node$Cli$Report$create$('BAD ARGUMENTS', $gren_lang$core$Maybe$Nothing, $gren_lang$compiler_node$Cli$Parser$argumentErrorPrettified(error)));
	}
};
var $author$project$Main$runCommand = F2($author$project$Main$runCommand$);
var $author$project$Main$update$ = function(msg, model) {
	if (msg.a.$ === 'Ok') {
		var version = msg.a.a;
		return { command: $author$project$Main$runCommand$(model, version), model: model };
	} else {
		var error = msg.a.a;
		return { command: $author$project$Main$fail$(model, $gren_lang$compiler_node$Cli$Report$create$('ERROR GETTING VERSION', $gren_lang$core$Maybe$Nothing, $gren_lang$compiler_node$Cli$PrettyPrinter$words(error))), model: model };
	}
};
var $author$project$Main$update = F2($author$project$Main$update$);
var $author$project$Main$main = $gren_lang$node$Node$defineProgram({ init: $author$project$Main$init, subscriptions: function(_v0) {
		return $gren_lang$core$Platform$Sub$none;
	}, update: $author$project$Main$update });
_Platform_export({'Main':{'init':$author$project$Main$main($gren_lang$core$Json$Decode$succeed({  }))}});}(this.module ? this.module.exports : this));