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
  var result = A2(
    _Json_run,
    flagDecoder,
    _Json_wrap(args ? args["flags"] : undefined),
  );
  $gren_lang$core$Result$isOk(result) ||
    _Debug_crash(2 /**/, _Json_errorToString(result.a) /**/);

  _Platform_setupTaskPorts(args ? args["taskPorts"] : undefined);

  var managers = {};
  var initPair = init(result.a);
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
  if (string.length <= 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  var possibleLastPointIdx = string.length - 2;
  var possibleLastPoint = string.codePointAt(possibleLastPointIdx);

  if (possibleLastPoint === string.charCodeAt(possibleLastPointIdx)) {
    // last char is a unit
    return $gren_lang$core$Maybe$Just({
      last: _Utils_chr(string[string.length - 1]),
      rest: string.slice(string.length - 1),
    });
  }

  // last char is a point
  return $gren_lang$core$Maybe$Just({
    last: _Utils_chr(String.fromCodePoint(possibleLastPoint)),
    rest: string.slice(string.length - 2),
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
  var char = str.at(index);

  if (typeof char === "undefined") {
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
var $blaix$prettynice$CLI$RanCommand = function (a) {
	return { $: 'RanCommand', a: a };
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
var $gren_lang$core$Array$slice = _Array_slice;
var $gren_lang$core$Array$dropFirst$ = function(n, array) {
	return A3($gren_lang$core$Array$slice, n, $gren_lang$core$Array$length(array), array);
};
var $gren_lang$core$Array$dropFirst = F2($gren_lang$core$Array$dropFirst$);
var $gren_lang$node$ChildProcess$Permission = { $: 'Permission' };
var $gren_lang$node$ChildProcess$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed($gren_lang$node$ChildProcess$Permission));
var $gren_lang$node$FileSystem$Permission = { $: 'Permission' };
var $gren_lang$node$FileSystem$initialize = $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed($gren_lang$node$FileSystem$Permission));


var process = require("node:process");

var _Terminal_init = _Scheduler_binding(function (callback) {
  callback(
    _Scheduler_succeed({
      isTTY: process.stdout.isTTY,
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
var $joeybright$gren_args$Args$Option = function (a) {
	return { $: 'Option', a: a };
};
var $joeybright$gren_args$Args$ShortOption = { $: 'ShortOption' };
var $joeybright$gren_args$Args$String = function (a) {
	return { $: 'String', a: a };
};
var $gren_lang$parser$Parser$Advanced$Bad = function (a) {
	return { $: 'Bad', a: a };
};
var $gren_lang$parser$Parser$Advanced$Good = function (a) {
	return { $: 'Good', a: a };
};
var $gren_lang$parser$Parser$Advanced$Parser = function (a) {
	return { $: 'Parser', a: a };
};
var $gren_lang$parser$Parser$Advanced$andThen$ = function(callback, _v0) {
	var parseA = _v0.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v1 = parseA(s0);
			if (_v1.$ === 'Bad') {
				var _v2 = _v1.a;
				var p = _v2.pred;
				var x = _v2.bag;
				return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: p });
			} else {
				var _v3 = _v1.a;
				var p1 = _v3.pred;
				var a = _v3.value;
				var s1 = _v3.state;
				var _v4 = callback(a);
				var parseB = _v4.a;
				var _v5 = parseB(s1);
				if (_v5.$ === 'Bad') {
					var _v6 = _v5.a;
					var p2 = _v6.pred;
					var x = _v6.bag;
					return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: p1 || p2 });
				} else {
					var _v7 = _v5.a;
					var p2 = _v7.pred;
					var b = _v7.value;
					var s2 = _v7.state;
					return $gren_lang$parser$Parser$Advanced$Good({ pred: p1 || p2, state: s2, value: b });
				}
			}
		});
};
var $gren_lang$parser$Parser$Advanced$andThen = F2($gren_lang$parser$Parser$Advanced$andThen$);
var $gren_lang$parser$Parser$andThen = $gren_lang$parser$Parser$Advanced$andThen;
var $gren_lang$parser$Parser$UnexpectedChar = { $: 'UnexpectedChar' };
var $gren_lang$core$Basics$eq = _Utils_equal;
var $gren_lang$parser$Parser$Advanced$AddRight = function (a) {
	return { $: 'AddRight', a: a };
};
var $gren_lang$parser$Parser$Advanced$Empty = { $: 'Empty' };
var $gren_lang$parser$Parser$Advanced$fromState$ = function(s, x) {
	return $gren_lang$parser$Parser$Advanced$AddRight({ bag: $gren_lang$parser$Parser$Advanced$Empty, deadEnd: { col: s.col, contextStack: s.context, problem: x, row: s.row } });
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
		newOffset: newOffset < 0 ? -1 : target, 
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
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromState$(s, expecting), pred: false }) : (_Utils_eq(newOffset, -2) ? $gren_lang$parser$Parser$Advanced$Good({ pred: true, state: { col: 1, context: s.context, indent: s.indent, offset: s.offset + 1, row: s.row + 1, src: s.src }, value: {  } }) : $gren_lang$parser$Parser$Advanced$Good({ pred: true, state: { col: s.col + 1, context: s.context, indent: s.indent, offset: newOffset, row: s.row, src: s.src }, value: {  } }));
		});
};
var $gren_lang$parser$Parser$Advanced$chompIf = F2($gren_lang$parser$Parser$Advanced$chompIf$);
var $gren_lang$parser$Parser$chompIf = function(isGood) {
	return $gren_lang$parser$Parser$Advanced$chompIf$(isGood, $gren_lang$parser$Parser$UnexpectedChar);
};
var $gren_lang$parser$Parser$Advanced$findSubString = _Parser_findSubString;
var $gren_lang$core$Basics$lt = _Utils_lt;
var $gren_lang$core$String$unitLength = _String_unitLength;
var $gren_lang$parser$Parser$Advanced$chompUntilEndOr = function(str) {
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v0 = A5($gren_lang$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v0.newOffset;
			var newRow = _v0.newRow;
			var newCol = _v0.newCol;
			var adjustedOffset = (newOffset < 0) ? $gren_lang$core$String$unitLength(s.src) : newOffset;
			return $gren_lang$parser$Parser$Advanced$Good({ pred: _Utils_cmp(s.offset, adjustedOffset) < 0, state: { col: newCol, context: s.context, indent: s.indent, offset: adjustedOffset, row: newRow, src: s.src }, value: {  } });
		});
};
var $gren_lang$parser$Parser$chompUntilEndOr = $gren_lang$parser$Parser$Advanced$chompUntilEndOr;
var $gren_lang$parser$Parser$Advanced$chompWhileHelp$ = function(isGood, offset, row, col, s0) {
	chompWhileHelp:
	while (true) {
		var newOffset = A3($gren_lang$parser$Parser$Advanced$isSubChar, isGood, offset, s0.src);
		if (_Utils_eq(newOffset, -1)) {
			return $gren_lang$parser$Parser$Advanced$Good({ pred: _Utils_cmp(s0.offset, offset) < 0, state: { col: col, context: s0.context, indent: s0.indent, offset: offset, row: row, src: s0.src }, value: {  } });
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
var $gren_lang$core$String$sliceUnits = _String_sliceUnits;
var $gren_lang$parser$Parser$Advanced$mapChompedString$ = function(func, _v0) {
	var parse = _v0.a;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s0) {
			var _v1 = parse(s0);
			if (_v1.$ === 'Bad') {
				var _v2 = _v1.a;
				var p = _v2.pred;
				var x = _v2.bag;
				return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: p });
			} else {
				var _v3 = _v1.a;
				var p = _v3.pred;
				var a = _v3.value;
				var s1 = _v3.state;
				return $gren_lang$parser$Parser$Advanced$Good({ pred: p, state: s1, value: A2(func, A3($gren_lang$core$String$sliceUnits, s0.offset, s1.offset, s0.src), a) });
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
				var _v3 = _v2.a;
				var pred = _v3.pred;
				var x = _v3.bag;
				return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: pred });
			} else {
				var _v4 = _v2.a;
				var p1 = _v4.pred;
				var a = _v4.value;
				var s1 = _v4.state;
				var _v5 = parseB(s1);
				if (_v5.$ === 'Bad') {
					var _v6 = _v5.a;
					var p2 = _v6.pred;
					var x = _v6.bag;
					return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: p1 || p2 });
				} else {
					var _v7 = _v5.a;
					var p2 = _v7.pred;
					var b = _v7.value;
					var s2 = _v7.state;
					return $gren_lang$parser$Parser$Advanced$Good({ pred: p1 || p2, state: s2, value: A2(func, a, b) });
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
var $gren_lang$parser$Parser$Advanced$Append = function (a) {
	return { $: 'Append', a: a };
};
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
			return $gren_lang$parser$Parser$Advanced$Bad({ bag: bag, pred: false });
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
				var _v3 = step.a;
				var p = _v3.pred;
				var x = _v3.bag;
				if (p) {
					return step;
				} else {
					var $temp$s0 = s0,
					$temp$bag = $gren_lang$parser$Parser$Advanced$Append({ left: bag, right: x }),
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
			return $gren_lang$parser$Parser$Advanced$Good({ pred: false, state: s, value: a });
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
										return $joeybright$gren_args$Args$Option({ key: k, type_: $joeybright$gren_args$Args$LongOption, value: v });
									}));
						}, $gren_lang$parser$Parser$chompIf(function(c) {
								return _Utils_eq(c, _Utils_chr('-'));
							})), parseArgHelper(F2(function(k, v) {
								return $joeybright$gren_args$Args$Option({ key: k, type_: $joeybright$gren_args$Args$ShortOption, value: v });
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
				var _v1 = bag.a;
				var bag1 = _v1.bag;
				var x = _v1.deadEnd;
				var $temp$bag = bag1,
				$temp$array = $gren_lang$core$Array$pushFirst$(x, array);
				bag = $temp$bag;
				array = $temp$array;
				continue bagToArray;
			default:
				var _v2 = bag.a;
				var bag1 = _v2.left;
				var bag2 = _v2.right;
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
		var value = _v1.a.value;
		return $gren_lang$core$Result$Ok(value);
	} else {
		var bag = _v1.a.bag;
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
		if ((dict.$ === 'RBNode_gren_builtin') && (dict.a.left.$ === 'RBNode_gren_builtin')) {
			var left = dict.a.left;
			var $temp$dict = left;
			dict = $temp$dict;
			continue getMin;
		} else {
			return dict;
		}
	}
};
var $gren_lang$core$Dict$moveRedLeft = function(dict) {
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.a.left.$ === 'RBNode_gren_builtin')) && (dict.a.right.$ === 'RBNode_gren_builtin')) {
		if ((dict.a.right.a.left.$ === 'RBNode_gren_builtin') && (dict.a.right.a.left.a.color.$ === 'Red')) {
			var _v1 = dict.a;
			var clr = _v1.color;
			var k = _v1.key;
			var v = _v1.value;
			var _v2 = _v1.left.a;
			var lClr = _v2.color;
			var lK = _v2.key;
			var lV = _v2.value;
			var lLeft = _v2.left;
			var lRight = _v2.right;
			var _v3 = _v1.right.a;
			var rClr = _v3.color;
			var rK = _v3.key;
			var rV = _v3.value;
			var rLeft = _v3.left;
			var _v4 = rLeft.a;
			var _v5 = _v4.color;
			var rlK = _v4.key;
			var rlV = _v4.value;
			var rlL = _v4.left;
			var rlR = _v4.right;
			var rRight = _v3.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, rlK, rlV, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), rlL), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, rK, rV, rlR, rRight));
		} else {
			var _v6 = dict.a;
			var clr = _v6.color;
			var k = _v6.key;
			var v = _v6.value;
			var _v7 = _v6.left.a;
			var lClr = _v7.color;
			var lK = _v7.key;
			var lV = _v7.value;
			var lLeft = _v7.left;
			var lRight = _v7.right;
			var _v8 = _v6.right.a;
			var rClr = _v8.color;
			var rK = _v8.key;
			var rV = _v8.value;
			var rLeft = _v8.left;
			var rRight = _v8.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$moveRedRight = function(dict) {
	if (((dict.$ === 'RBNode_gren_builtin') && (dict.a.left.$ === 'RBNode_gren_builtin')) && (dict.a.right.$ === 'RBNode_gren_builtin')) {
		if ((dict.a.left.a.left.$ === 'RBNode_gren_builtin') && (dict.a.left.a.left.a.color.$ === 'Red')) {
			var _v1 = dict.a;
			var clr = _v1.color;
			var k = _v1.key;
			var v = _v1.value;
			var _v2 = _v1.left.a;
			var lClr = _v2.color;
			var lK = _v2.key;
			var lV = _v2.value;
			var _v3 = _v2.left.a;
			var _v4 = _v3.color;
			var llK = _v3.key;
			var llV = _v3.value;
			var llLeft = _v3.left;
			var llRight = _v3.right;
			var lRight = _v2.right;
			var _v5 = _v1.right.a;
			var rClr = _v5.color;
			var rK = _v5.key;
			var rV = _v5.value;
			var rLeft = _v5.left;
			var rRight = _v5.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, lK, lV, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, llK, llV, llLeft, llRight), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, k, v, lRight, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight)));
		} else {
			var _v6 = dict.a;
			var clr = _v6.color;
			var k = _v6.key;
			var v = _v6.value;
			var _v7 = _v6.left.a;
			var lClr = _v7.color;
			var lK = _v7.key;
			var lV = _v7.value;
			var lLeft = _v7.left;
			var lRight = _v7.right;
			var _v8 = _v6.right.a;
			var rClr = _v8.color;
			var rK = _v8.key;
			var rV = _v8.value;
			var rLeft = _v8.left;
			var rRight = _v8.right;
			return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, k, v, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, lK, lV, lLeft, lRight), $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, rK, rV, rLeft, rRight));
		}
	} else {
		return dict;
	}
};
var $gren_lang$core$Dict$removeHelpPrepEQGT$ = function(targetKey, dict, color, key, value, left, right) {
	if ((left.$ === 'RBNode_gren_builtin') && (left.a.color.$ === 'Red')) {
		var _v1 = left.a;
		var _v2 = _v1.color;
		var lK = _v1.key;
		var lV = _v1.value;
		var lLeft = _v1.left;
		var lRight = _v1.right;
		return $gren_lang$core$Dict$node$(color, lK, lV, lLeft, $gren_lang$core$Dict$node$($gren_lang$core$Dict$Red, key, value, lRight, right));
	} else {
		_v3$2:
		while (true) {
			if ((right.$ === 'RBNode_gren_builtin') && (right.a.color.$ === 'Black')) {
				if (right.a.left.$ === 'RBNode_gren_builtin') {
					if (right.a.left.a.color.$ === 'Black') {
						var _v4 = right.a;
						var _v5 = _v4.color;
						var _v6 = _v4.left.a.color;
						return $gren_lang$core$Dict$moveRedRight(dict);
					} else {
						break _v3$2;
					}
				} else {
					var _v7 = right.a;
					var _v8 = _v7.color;
					var _v9 = _v7.left;
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
	if ((dict.$ === 'RBNode_gren_builtin') && (dict.a.left.$ === 'RBNode_gren_builtin')) {
		var _v1 = dict.a;
		var color = _v1.color;
		var key = _v1.key;
		var value = _v1.value;
		var left = _v1.left;
		var _v2 = left.a;
		var lColor = _v2.color;
		var lLeft = _v2.left;
		var right = _v1.right;
		if (lColor.$ === 'Black') {
			if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.color.$ === 'Red')) {
				var _v5 = lLeft.a.color;
				return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeMin(left), right);
			} else {
				var _v6 = $gren_lang$core$Dict$moveRedLeft(dict);
				if (_v6.$ === 'RBNode_gren_builtin') {
					var _v7 = _v6.a;
					var nColor = _v7.color;
					var nKey = _v7.key;
					var nValue = _v7.value;
					var nLeft = _v7.left;
					var nRight = _v7.right;
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
	if (dict.$ === 'RBEmpty_gren_builtin') {
		return $gren_lang$core$Dict$RBEmpty_gren_builtin;
	} else {
		var _v5 = dict.a;
		var color = _v5.color;
		var key = _v5.key;
		var value = _v5.value;
		var left = _v5.left;
		var right = _v5.right;
		if (_Utils_cmp(targetKey, key) < 0) {
			if ((left.$ === 'RBNode_gren_builtin') && (left.a.color.$ === 'Black')) {
				var _v7 = left.a;
				var _v8 = _v7.color;
				var lLeft = _v7.left;
				if ((lLeft.$ === 'RBNode_gren_builtin') && (lLeft.a.color.$ === 'Red')) {
					var _v10 = lLeft.a.color;
					return $gren_lang$core$Dict$node$(color, key, value, $gren_lang$core$Dict$removeHelp$(targetKey, left), right);
				} else {
					var _v11 = $gren_lang$core$Dict$moveRedLeft(dict);
					if (_v11.$ === 'RBNode_gren_builtin') {
						var _v12 = _v11.a;
						var nColor = _v12.color;
						var nKey = _v12.key;
						var nValue = _v12.value;
						var nLeft = _v12.left;
						var nRight = _v12.right;
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
	if (dict.$ === 'RBNode_gren_builtin') {
		var _v1 = dict.a;
		var color = _v1.color;
		var key = _v1.key;
		var value = _v1.value;
		var left = _v1.left;
		var right = _v1.right;
		if (_Utils_eq(targetKey, key)) {
			var _v2 = $gren_lang$core$Dict$getMin(right);
			if (_v2.$ === 'RBNode_gren_builtin') {
				var _v3 = _v2.a;
				var minKey = _v3.key;
				var minValue = _v3.value;
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
	if ((_v0.$ === 'RBNode_gren_builtin') && (_v0.a.color.$ === 'Red')) {
		var _v1 = _v0.a;
		var _v2 = _v1.color;
		var nKey = _v1.key;
		var value = _v1.value;
		var left = _v1.left;
		var right = _v1.right;
		return $gren_lang$core$Dict$node$($gren_lang$core$Dict$Black, nKey, value, left, right);
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
								if (_v3.value.a.a.value === '') {
									var _v4 = _v3.state;
									var _v5 = _v3.value.a.a;
									var optionType = _v5.type_;
									var key = _v5.key;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [  ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var _v6 = _v3.state;
									var _v7 = _v3.value.a.a;
									var optionType = _v7.type_;
									var key = _v7.key;
									var value = _v7.value;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [ value ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								}
							} else {
								if (_v3.value.a.a.value === '') {
									var _v9 = _v3.value.a.a;
									var optionType = _v9.type_;
									var key = _v9.key;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$set$(key, { optionType: optionType, values: [  ] }, parseResult.options) }), state: $joeybright$gren_args$Args$ParsingOptions(key) };
								} else {
									var latestOption = _v3.state.a;
									var _v10 = _v3.value.a.a;
									var optionType = _v10.type_;
									var key = _v10.key;
									var value = _v10.value;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Maybe$withDefault$($gren_lang$core$Dict$set$(key, { optionType: optionType, values: [ value ] }, parseResult.options), $gren_lang$core$Maybe$map$(function(_v11) {
													return $gren_lang$core$Dict$update$(key, $gren_lang$core$Maybe$map(function(val) {
																return { optionType: val.optionType, values: $gren_lang$core$Array$pushLast$(value, val.values) };
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
									return { result: _Utils_update(parseResult, { args: $gren_lang$core$Array$pushLast$(arg, parseResult.args) }), state: $joeybright$gren_args$Args$ParsingArgs };
								}
							} else {
								if (_v3.value.a.a === '') {
									break _v3$0;
								} else {
									var latestOption = _v3.state.a;
									var value = _v3.value.a.a;
									return { result: _Utils_update(parseResult, { options: $gren_lang$core$Dict$update$(latestOption, $gren_lang$core$Maybe$map(function(val) {
													return { optionType: val.optionType, values: $gren_lang$core$Array$pushLast$(value, val.values) };
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
var $blaix$prettynice$CLI$Command$Build$ChildProcessError = function (a) {
	return { $: 'ChildProcessError', a: a };
};
var $gren_lang$node$ChildProcess$SetWorkingDirectory = function (a) {
	return { $: 'SetWorkingDirectory', a: a };
};
var $gren_lang$node$ChildProcess$DefaultShell = { $: 'DefaultShell' };
var $gren_lang$node$ChildProcess$InheritEnvironmentVariables = { $: 'InheritEnvironmentVariables' };
var $gren_lang$node$ChildProcess$InheritWorkingDirectory = { $: 'InheritWorkingDirectory' };
var $gren_lang$node$ChildProcess$NoLimit = { $: 'NoLimit' };
var $gren_lang$core$Basics$mul = _Basics_mul;
var $gren_lang$node$ChildProcess$defaultRunOptions = { environmentVariables: $gren_lang$node$ChildProcess$InheritEnvironmentVariables, maximumBytesWrittenToStreams: 1024 * 1024, runDuration: $gren_lang$node$ChildProcess$NoLimit, shell: $gren_lang$node$ChildProcess$DefaultShell, workingDirectory: $gren_lang$node$ChildProcess$InheritWorkingDirectory };
var $gren_lang$core$String$slice = _String_slice;
var $gren_lang$core$String$dropLast$ = function(n, string) {
	return (n < 1) ? string : A3($gren_lang$core$String$slice, 0, -n, string);
};
var $gren_lang$core$String$dropLast = F2($gren_lang$core$String$dropLast$);
var $gren_lang$core$String$replace$ = function(before, after, string) {
	return A2($gren_lang$core$String$join, after, A2($gren_lang$core$String$split, before, string));
};
var $gren_lang$core$String$replace = F3($gren_lang$core$String$replace$);
var $gren_lang$node$FileSystem$Path$toPosixString = _FilePath_toPosix;
var $blaix$prettynice$CLI$Command$Build$componentModuleName = function(component) {
	var relStr = $gren_lang$node$FileSystem$Path$toPosixString(component.relativePath);
	var withoutExt = $gren_lang$core$String$dropLast$(5, relStr);
	return 'Components.' + $gren_lang$core$String$replace$('/', '.', withoutExt);
};
var $blaix$prettynice$CLI$Command$Build$generatedModuleName = function(component) {
	return 'Gen.' + $blaix$prettynice$CLI$Command$Build$componentModuleName(component);
};
var $gren_lang$core$Array$isEmpty = function(array) {
	return $gren_lang$core$Array$length(array) === 0;
};
var $gren_lang$core$Task$fail = _Scheduler_fail;
var $gren_lang$core$Task$mapError$ = function(convert, task) {
	return A2($gren_lang$core$Task$onError, $gren_lang$core$Basics$composeL$($gren_lang$core$Task$fail, convert), task);
};
var $gren_lang$core$Task$mapError = F2($gren_lang$core$Task$mapError$);


var bufferNs = require("node:buffer");
var process = require("node:process");
var stream = require("node:stream");

var _ChildProcess_module = function () {
  return require("node:child_process");
};

var _ChildProcess_run = function (options) {
  return _Scheduler_binding(function (callback) {
    var childProcess = _ChildProcess_module();

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
                stdout.byteLength,
              ),
              stderr: new DataView(
                stderr.buffer,
                stderr.byteOffset,
                stderr.byteLength,
              ),
            }),
          );
        } else {
          if (typeof err.errno === "undefined") {
            // errno only exists on system errors, the program was run
            callback(
              _Scheduler_fail(
                $gren_lang$node$ChildProcess$ProgramError({
                  exitCode: err.code,
                  stdout: new DataView(
                    stdout.buffer,
                    stdout.byteOffset,
                    stdout.byteLength,
                  ),
                  stderr: new DataView(
                    stderr.buffer,
                    stderr.byteOffset,
                    stderr.byteLength,
                  ),
                }),
              ),
            );
          } else {
            callback(
              _Scheduler_fail(
                $gren_lang$node$ChildProcess$InitError({
                  a: err.path,
                  b: err.spawnargs,
                  c: err.code,
                }),
              ),
            );
          }
        }
      },
    );
  });
};

var _ChildProcess_spawn = F3(function (sendInitToApp, sendExitToApp, options) {
  return _Scheduler_binding(function (callback) {
    var subproc = _ChildProcess_getSubProc(options);

    var proc = _Scheduler_rawSpawn(
      sendInitToApp({
        processId: _Scheduler_rawSpawn(
          _Scheduler_binding(function (callback) {
            return function () {
              subproc.kill();
            };
          }),
        ),
        streams:
          options.connection.kind !== 1
            ? {}
            : {
                input: stream.Writable.toWeb(subproc.stdin),
                output: stream.Readable.toWeb(subproc.stdout),
                error: stream.Readable.toWeb(subproc.stderr),
              },
      }),
    );

    subproc.on("exit", function (code) {
      _Scheduler_rawSpawn(sendExitToApp(code));
    });

    callback(_Scheduler_succeed(proc));
  });
});

function _ChildProcess_getSubProc(options) {
  var childProcess = _ChildProcess_module();

  var workingDir = options.workingDirectory;
  var env = options.environmentVariables;
  var shell = options.shell;

  var subproc = childProcess.spawn(options.program, options._arguments, {
    cwd: _ChildProcess_handleCwd(workingDir),
    env: _ChildProcess_handleEnv(env),
    timeout: options.runDuration,
    shell: _ChildProcess_handleShell(shell),
    stdio:
      options.connection.kind === 0
        ? "inherit"
        : options.connection.kind === 1
          ? "pipe"
          : "ignore",
    detached:
      options.connection.kind === 3 && process.platform === "win32",
  });

  if (options.connection.kind === 3) {
    subproc.unref();
  }

  return subproc;
}

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
    dict,
  );
}
var $gren_lang$node$ChildProcess$InitError = function (a) {
	return { $: 'InitError', a: a };
};
var $gren_lang$node$ChildProcess$ProgramError = function (a) {
	return { $: 'ProgramError', a: a };
};
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
var $blaix$prettynice$CLI$Command$Build$buildClientComponents$ = function(procPerm, components, optimize) {
	if ($gren_lang$core$Array$isEmpty(components)) {
		return $gren_lang$core$Task$succeed({  });
	} else {
		var runOptions = _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { workingDirectory: $gren_lang$node$ChildProcess$SetWorkingDirectory('./client') });
		var optimizeArgs = optimize ? [ '--optimize' ] : [  ];
		var moduleNames = A2($gren_lang$core$Array$map, $blaix$prettynice$CLI$Command$Build$generatedModuleName, components);
		var args = _Utils_ap([ 'gren', 'make' ], _Utils_ap(optimizeArgs, _Utils_ap(moduleNames, [ '--output=../dist/client/main.js' ])));
		return $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$ChildProcessError, $gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, $gren_lang$node$ChildProcess$run$(procPerm, 'npx', args, runOptions)));
	}
};
var $blaix$prettynice$CLI$Command$Build$buildClientComponents = F3($blaix$prettynice$CLI$Command$Build$buildClientComponents$);
var $blaix$prettynice$CLI$Command$Build$buildServer$ = function(procPerm, optimize) {
	var runOptions = _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { workingDirectory: $gren_lang$node$ChildProcess$SetWorkingDirectory('./server') });
	var optimizeArgs = optimize ? [ '--optimize' ] : [  ];
	var args = _Utils_ap([ 'gren', 'make' ], _Utils_ap(optimizeArgs, [ 'Main', '--output=../dist/server/main.js' ]));
	return $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$ChildProcessError, $gren_lang$core$Task$map$(function(_v0) {
				return {  };
			}, $gren_lang$node$ChildProcess$run$(procPerm, 'npx', args, runOptions)));
};
var $blaix$prettynice$CLI$Command$Build$buildServer = F2($blaix$prettynice$CLI$Command$Build$buildServer$);
var $blaix$prettynice$CLI$Command$Build$FileSystemError = function (a) {
	return { $: 'FileSystemError', a: a };
};
var $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory = function(_v0) {
	var code = _v0.a.code;
	return code === 'ENOENT';
};
var $gren_lang$node$FileSystem$Path$fromPosixString = _FilePath_fromPosix;


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
var $gren_lang$node$FileSystem$makeDirectory$ = function(_v0, options, path) {
	return A2(_FileSystem_makeDirectory, options, path);
};
var $gren_lang$node$FileSystem$makeDirectory = F3($gren_lang$node$FileSystem$makeDirectory$);
var $gren_lang$node$FileSystem$remove$ = function(_v0, options, path) {
	return A2(_FileSystem_remove, options, path);
};
var $gren_lang$node$FileSystem$remove = F3($gren_lang$node$FileSystem$remove$);
var $blaix$prettynice$CLI$Command$Build$clean = function(fsPerm) {
	var remove = function(path) {
		return A2($gren_lang$core$Task$onError, function(e) {
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(e) ? $gren_lang$core$Task$succeed({  }) : $gren_lang$core$Task$fail(e);
			}, $gren_lang$core$Task$map$(function(_v2) {
					return {  };
				}, $gren_lang$node$FileSystem$remove$(fsPerm, { recursive: true }, $gren_lang$node$FileSystem$Path$fromPosixString(path))));
	};
	var create = function(path) {
		return $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { recursive: true }, $gren_lang$node$FileSystem$Path$fromPosixString(path));
	};
	var recreate = function(path) {
		return A2($gren_lang$core$Task$andThen, function(_v1) {
				return create(path);
			}, remove(path));
	};
	return $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$core$Task$map$(function(_v0) {
				return {  };
			}, $gren_lang$core$Task$sequence(A2($gren_lang$core$Array$map, recreate, [ './dist', 'client/.prettynice', 'server/.prettynice' ]))));
};
var $gren_lang$node$FileSystem$copyFile$ = function(_v0, dest, src) {
	return A2(_FileSystem_copyFile, src, dest);
};
var $gren_lang$node$FileSystem$copyFile = F3($gren_lang$node$FileSystem$copyFile$);
var $gren_lang$core$Array$prepend = _Array_append;
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
var $gren_lang$core$Array$keepIf = _Array_filter;
var $gren_lang$core$Basics$neq = _Utils_notEqual;
var $gren_lang$node$FileSystem$Path$prepend$ = function(left, right) {
	return _Utils_update(left, { directory: A2($gren_lang$core$Array$keepIf, function(dir) {
				return dir !== '';
			}, $gren_lang$core$Array$append$(right.directory, $gren_lang$core$Array$pushLast$($gren_lang$node$FileSystem$Path$filenameWithExtension(left), left.directory))), extension: right.extension, filename: right.filename });
};
var $gren_lang$node$FileSystem$Path$prepend = F2($gren_lang$node$FileSystem$Path$prepend$);
var $gren_lang$node$FileSystem$Path$append$ = function(left, right) {
	return $gren_lang$node$FileSystem$Path$prepend$(right, left);
};
var $gren_lang$node$FileSystem$Path$append = F2($gren_lang$node$FileSystem$Path$append$);
var $gren_lang$node$FileSystem$Path$empty = { directory: [  ], extension: '', filename: '', root: '' };
var $gren_lang$core$Array$foldl = _Array_foldl;
var $gren_lang$node$FileSystem$Path$join = function(paths) {
	var _v0 = $gren_lang$core$Array$popFirst(paths);
	if (_v0.$ === 'Just') {
		var _v1 = _v0.a;
		var first = _v1.first;
		var rest = _v1.rest;
		return A3($gren_lang$core$Array$foldl, $gren_lang$node$FileSystem$Path$append, first, rest);
	} else {
		return $gren_lang$node$FileSystem$Path$empty;
	}
};
var $gren_lang$node$FileSystem$listDirectory$ = function(_v0, path) {
	return _FileSystem_listDirectory(path);
};
var $gren_lang$node$FileSystem$listDirectory = F2($gren_lang$node$FileSystem$listDirectory$);
var $blaix$prettynice$CLI$Command$Build$copyDirectoryContents$ = function(fsPerm, sourcePath, targetPath) {
	return A2($gren_lang$core$Task$andThen, A3($blaix$prettynice$CLI$Command$Build$copyEntriesRecursive, fsPerm, sourcePath, targetPath), $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, A2($gren_lang$core$Task$andThen, function(_v5) {
					return $gren_lang$node$FileSystem$listDirectory$(fsPerm, sourcePath);
				}, $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { recursive: true }, targetPath))));
};
var $blaix$prettynice$CLI$Command$Build$copyDirectoryContents = F3($blaix$prettynice$CLI$Command$Build$copyDirectoryContents$);
var $blaix$prettynice$CLI$Command$Build$copyEntriesRecursive$ = function(fsPerm, sourcePath, targetPath, entries) {
	copyEntriesRecursive:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(entries);
		if (_v0.$ === 'Nothing') {
			return $gren_lang$core$Task$succeed({  });
		} else {
			var _v1 = _v0.a;
			var entry = _v1.first;
			var remainingEntries = _v1.rest;
			var targetEntry = $gren_lang$node$FileSystem$Path$join([ targetPath, entry.path ]);
			var sourceEntry = $gren_lang$node$FileSystem$Path$join([ sourcePath, entry.path ]);
			var _v2 = entry.entityType;
			switch (_v2.$) {
				case 'Directory':
					return A2($gren_lang$core$Task$andThen, function(_v3) {
							return $blaix$prettynice$CLI$Command$Build$copyEntriesRecursive$(fsPerm, sourcePath, targetPath, remainingEntries);
						}, $blaix$prettynice$CLI$Command$Build$copyDirectoryContents$(fsPerm, sourceEntry, targetEntry));
				case 'File':
					return A2($gren_lang$core$Task$andThen, function(_v4) {
							return $blaix$prettynice$CLI$Command$Build$copyEntriesRecursive$(fsPerm, sourcePath, targetPath, remainingEntries);
						}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$node$FileSystem$copyFile$(fsPerm, targetEntry, sourceEntry)));
				default:
					var $temp$fsPerm = fsPerm,
					$temp$sourcePath = sourcePath,
					$temp$targetPath = targetPath,
					$temp$entries = remainingEntries;
					fsPerm = $temp$fsPerm;
					sourcePath = $temp$sourcePath;
					targetPath = $temp$targetPath;
					entries = $temp$entries;
					continue copyEntriesRecursive;
			}
		}
	}
};
var $blaix$prettynice$CLI$Command$Build$copyEntriesRecursive = F4($blaix$prettynice$CLI$Command$Build$copyEntriesRecursive$);
var $blaix$prettynice$CLI$Command$Build$copyPublicAssets = function(fsPerm) {
	var targetPath = $gren_lang$node$FileSystem$Path$fromPosixString('dist/client');
	var sourcePath = $gren_lang$node$FileSystem$Path$fromPosixString('public');
	return A2($gren_lang$core$Task$onError, function(e) {
			if (e.$ === 'FileSystemError') {
				var fsErr = e.a;
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(fsErr) ? $gren_lang$core$Task$succeed({  }) : $gren_lang$core$Task$fail(e);
			} else {
				return $gren_lang$core$Task$fail(e);
			}
		}, $blaix$prettynice$CLI$Command$Build$copyDirectoryContents$(fsPerm, sourcePath, targetPath));
};
var $gren_lang$core$String$foldl = _String_foldl;
var $gren_lang$core$String$count = function(string) {
	return A3($gren_lang$core$String$foldl, F2(function(_v0, num) {
				return num + 1;
			}), 0, string);
};
var $gren_lang$core$String$dropFirst$ = function(n, string) {
	return (n < 1) ? string : A3($gren_lang$core$String$slice, n, $gren_lang$core$String$unitLength(string), string);
};
var $gren_lang$core$String$dropFirst = F2($gren_lang$core$String$dropFirst$);
var $gren_lang$core$String$startsWith = _String_startsWith;
var $blaix$prettynice$CLI$Command$Build$makeRelativePath$ = function(basePath, fullPath) {
	var fullStr = $gren_lang$node$FileSystem$Path$toPosixString(fullPath);
	var baseStr = $gren_lang$node$FileSystem$Path$toPosixString(basePath);
	var basePrefix = baseStr + '/';
	return A2($gren_lang$core$String$startsWith, basePrefix, fullStr) ? $gren_lang$node$FileSystem$Path$fromPosixString($gren_lang$core$String$dropFirst$($gren_lang$core$String$count(basePrefix), fullStr)) : fullPath;
};
var $blaix$prettynice$CLI$Command$Build$makeRelativePath = F2($blaix$prettynice$CLI$Command$Build$makeRelativePath$);
var $gren_lang$core$String$takeLast$ = function(n, string) {
	return (n < 1) ? '' : A3($gren_lang$core$String$slice, -n, $gren_lang$core$String$unitLength(string), string);
};
var $gren_lang$core$String$takeLast = F2($gren_lang$core$String$takeLast$);
var $blaix$prettynice$CLI$Command$Build$listGrenFiles$ = function(fsPerm, basePath, thisPath) {
	return A2($gren_lang$core$Task$andThen, A3($blaix$prettynice$CLI$Command$Build$processEntries, fsPerm, basePath, thisPath), $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$node$FileSystem$listDirectory$(fsPerm, thisPath)));
};
var $blaix$prettynice$CLI$Command$Build$listGrenFiles = F3($blaix$prettynice$CLI$Command$Build$listGrenFiles$);
var $blaix$prettynice$CLI$Command$Build$processEntries$ = function(fsPerm, basePath, thisPath, entries) {
	processEntries:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(entries);
		if (_v0.$ === 'Nothing') {
			return $gren_lang$core$Task$succeed([  ]);
		} else {
			var _v1 = _v0.a;
			var entry = _v1.first;
			var remainingEntries = _v1.rest;
			var fullPath = $gren_lang$node$FileSystem$Path$join([ thisPath, entry.path ]);
			var _v2 = entry.entityType;
			switch (_v2.$) {
				case 'File':
					var filename = $gren_lang$node$FileSystem$Path$filenameWithExtension(entry.path);
					if ($gren_lang$core$String$takeLast$(5, filename) === '.gren') {
						var relativePath = $blaix$prettynice$CLI$Command$Build$makeRelativePath$(basePath, fullPath);
						return $gren_lang$core$Task$map$(function(rest) {
								return $gren_lang$core$Array$pushFirst$({ fullPath: fullPath, relativePath: relativePath }, rest);
							}, $blaix$prettynice$CLI$Command$Build$processEntries$(fsPerm, basePath, thisPath, remainingEntries));
					} else {
						var $temp$fsPerm = fsPerm,
						$temp$basePath = basePath,
						$temp$thisPath = thisPath,
						$temp$entries = remainingEntries;
						fsPerm = $temp$fsPerm;
						basePath = $temp$basePath;
						thisPath = $temp$thisPath;
						entries = $temp$entries;
						continue processEntries;
					}
				case 'Directory':
					return A2($gren_lang$core$Task$andThen, function(subFiles) {
							return $gren_lang$core$Task$map$(function(rest) {
									return $gren_lang$core$Array$append$(subFiles, rest);
								}, $blaix$prettynice$CLI$Command$Build$processEntries$(fsPerm, basePath, thisPath, remainingEntries));
						}, $blaix$prettynice$CLI$Command$Build$listGrenFiles$(fsPerm, basePath, fullPath));
				default:
					var $temp$fsPerm = fsPerm,
					$temp$basePath = basePath,
					$temp$thisPath = thisPath,
					$temp$entries = remainingEntries;
					fsPerm = $temp$fsPerm;
					basePath = $temp$basePath;
					thisPath = $temp$thisPath;
					entries = $temp$entries;
					continue processEntries;
			}
		}
	}
};
var $blaix$prettynice$CLI$Command$Build$processEntries = F4($blaix$prettynice$CLI$Command$Build$processEntries$);
var $blaix$prettynice$CLI$Command$Build$discoverComponents = function(fsPerm) {
	var basePath = $gren_lang$node$FileSystem$Path$fromPosixString('client/src/Components');
	return A2($gren_lang$core$Task$onError, function(e) {
			if (e.$ === 'FileSystemError') {
				var fsErr = e.a;
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(fsErr) ? $gren_lang$core$Task$succeed([  ]) : $gren_lang$core$Task$fail(e);
			} else {
				return $gren_lang$core$Task$fail(e);
			}
		}, $blaix$prettynice$CLI$Command$Build$listGrenFiles$(fsPerm, basePath, basePath));
};
var $blaix$prettynice$CLI$Command$Build$PropsParseError = function (a) {
	return { $: 'PropsParseError', a: a };
};
var $blaix$prettynice$CLI$Command$Build$componentBaseName = function(component) {
	return $gren_lang$core$String$dropLast$(5, $gren_lang$node$FileSystem$Path$filenameWithExtension(component.relativePath));
};
var $gren_lang$parser$Parser$Forbidden = { $: 'Forbidden' };
var $gren_lang$parser$Parser$Advanced$fromInfo$ = function(row, col, x, context) {
	return $gren_lang$parser$Parser$Advanced$AddRight({ bag: $gren_lang$parser$Parser$Advanced$Empty, deadEnd: { col: col, contextStack: context, problem: x, row: row } });
};
var $gren_lang$parser$Parser$Advanced$fromInfo = F4($gren_lang$parser$Parser$Advanced$fromInfo$);
var $gren_lang$parser$Parser$Advanced$chompUntil = function(_v0) {
	var _v1 = _v0.a;
	var str = _v1.str;
	var expecting = _v1.expecting;
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v2 = A5($gren_lang$parser$Parser$Advanced$findSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v2.newOffset;
			var newRow = _v2.newRow;
			var newCol = _v2.newCol;
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromInfo$(newRow, newCol, expecting, s.context), pred: false }) : $gren_lang$parser$Parser$Advanced$Good({ pred: _Utils_cmp(s.offset, newOffset) < 0, state: { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src }, value: {  } });
		});
};
var $gren_lang$parser$Parser$Expecting = function (a) {
	return { $: 'Expecting', a: a };
};
var $gren_lang$parser$Parser$Advanced$Token = function (a) {
	return { $: 'Token', a: a };
};
var $gren_lang$parser$Parser$toToken = function(str) {
	return $gren_lang$parser$Parser$Advanced$Token({ expecting: $gren_lang$parser$Parser$Expecting(str), str: str });
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
var $blaix$prettynice$Prettynice$Internal$Props$NestedType = function (a) {
	return { $: 'NestedType', a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$SimpleType = function (a) {
	return { $: 'SimpleType', a: a };
};
var $blaix$prettynice$Prettynice$Internal$Props$StringType = { $: 'StringType' };
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypes = [ $blaix$prettynice$Prettynice$Internal$Props$SimpleType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$IntType, keyword: 'Int' }), $blaix$prettynice$Prettynice$Internal$Props$SimpleType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$FloatType, keyword: 'Float' }), $blaix$prettynice$Prettynice$Internal$Props$SimpleType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$StringType, keyword: 'String' }), $blaix$prettynice$Prettynice$Internal$Props$SimpleType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$BoolType, keyword: 'Bool' }), $blaix$prettynice$Prettynice$Internal$Props$NestedType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$ArrayType, keyword: 'Array' }), $blaix$prettynice$Prettynice$Internal$Props$NestedType({ constructor: $blaix$prettynice$Prettynice$Internal$Props$MaybeType, keyword: 'Maybe' }) ];
var $gren_lang$parser$Parser$ExpectingKeyword = function (a) {
	return { $: 'ExpectingKeyword', a: a };
};
var $gren_lang$parser$Parser$Advanced$isSubString = _Parser_isSubString;
var $gren_lang$parser$Parser$Advanced$keyword = function(_v0) {
	var _v1 = _v0.a;
	var kwd = _v1.str;
	var expecting = _v1.expecting;
	var progress = !$gren_lang$core$String$isEmpty(kwd);
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v2 = A5($gren_lang$parser$Parser$Advanced$isSubString, kwd, s.offset, s.row, s.col, s.src);
			var newOffset = _v2.newOffset;
			var newRow = _v2.newRow;
			var newCol = _v2.newCol;
			return (_Utils_eq(newOffset, -1) || (0 <= A3($gren_lang$parser$Parser$Advanced$isSubChar, function(c) {
					return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr('_'));
				}, newOffset, s.src))) ? $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromState$(s, expecting), pred: false }) : $gren_lang$parser$Parser$Advanced$Good({ pred: progress, state: { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src }, value: {  } });
		});
};
var $gren_lang$parser$Parser$keyword = function(kwd) {
	return $gren_lang$parser$Parser$Advanced$keyword($gren_lang$parser$Parser$Advanced$Token({ expecting: $gren_lang$parser$Parser$ExpectingKeyword(kwd), str: kwd }));
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
	var toParser = function(entry) {
		if (entry.$ === 'SimpleType') {
			var _v1 = entry.a;
			var keyword = _v1.keyword;
			var constructor = _v1.constructor;
			return A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(constructor), $gren_lang$parser$Parser$keyword(keyword));
		} else {
			var _v2 = entry.a;
			var keyword = _v2.keyword;
			var constructor = _v2.constructor;
			return A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(constructor), $gren_lang$parser$Parser$keyword(keyword)), $gren_lang$parser$Parser$lazy(function(_v3) {
						return $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
					}));
		}
	};
	return A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed($gren_lang$core$Basics$identity), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, _Utils_chr('('));
					})), $gren_lang$parser$Parser$spaces), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$oneOf(A2($gren_lang$core$Array$map, toParser, $blaix$prettynice$Prettynice$Internal$Props$fieldTypes)), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$chompWhile(function(c) {
						return _Utils_eq(c, _Utils_chr(')'));
					})), $gren_lang$parser$Parser$spaces));
}
try {
	var $blaix$prettynice$Prettynice$Internal$Props$fieldParser = $blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser();
	$blaix$prettynice$Prettynice$Internal$Props$cyclic$fieldParser = function () {
		return $blaix$prettynice$Prettynice$Internal$Props$fieldParser;
	};
} catch ($) {
	throw 'Some top-level definitions from `Prettynice.Internal.Props` are causing infinite recursion:\n\n  ┌─────┐\n  │    fieldParser\n  └─────┘\n\nThese errors are very tricky, so read https://github.com/gren-lang/compiler/blob/0.6.3/hints/bad-recursion.md to learn how to fix it!';}
var $gren_lang$parser$Parser$Advanced$revAlways$ = function(_v0, b) {
	return b;
};
var $gren_lang$parser$Parser$Advanced$revAlways = F2($gren_lang$parser$Parser$Advanced$revAlways$);
var $gren_lang$parser$Parser$Advanced$revSkip$ = function(iParser, kParser) {
	return $gren_lang$parser$Parser$Advanced$map2$($gren_lang$parser$Parser$Advanced$revAlways, iParser, kParser);
};
var $gren_lang$parser$Parser$Advanced$revSkip = F2($gren_lang$parser$Parser$Advanced$revSkip$);
var $gren_lang$parser$Parser$Advanced$loopHelp$ = function(p, state, callback, s0) {
	loopHelp:
	while (true) {
		var _v0 = callback(state);
		var parse = _v0.a;
		var _v1 = parse(s0);
		if (_v1.$ === 'Good') {
			var _v2 = _v1.a;
			var p1 = _v2.pred;
			var step = _v2.value;
			var s1 = _v2.state;
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
				return $gren_lang$parser$Parser$Advanced$Good({ pred: p || p1, state: s1, value: result });
			}
		} else {
			var _v4 = _v1.a;
			var p1 = _v4.pred;
			var x = _v4.bag;
			return $gren_lang$parser$Parser$Advanced$Bad({ bag: x, pred: p || p1 });
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
				var _v2 = _v1.a;
				var p = _v2.pred;
				var a = _v2.value;
				var s1 = _v2.state;
				return $gren_lang$parser$Parser$Advanced$Good({ pred: p, state: s1, value: func(a) });
			} else {
				var _v3 = _v1.a;
				var pred = _v3.pred;
				var bag = _v3.bag;
				return $gren_lang$parser$Parser$Advanced$Bad({ bag: bag, pred: pred });
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
var $gren_lang$parser$Parser$Advanced$sequenceEndForbidden$ = function(ender, ws, parseItem, sep, items) {
	return $gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$revSkip$(sep, $gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$map$(function(item) {
							return $gren_lang$parser$Parser$Advanced$Loop($gren_lang$core$Array$pushLast$(item, items));
						}, parseItem))), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
					return $gren_lang$parser$Parser$Advanced$Done(items);
				}, ender) ]));
};
var $gren_lang$parser$Parser$Advanced$sequenceEndForbidden = F5($gren_lang$parser$Parser$Advanced$sequenceEndForbidden$);
var $gren_lang$parser$Parser$Advanced$sequenceEndMandatory$ = function(ws, parseItem, sep, items) {
	return $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$map$(function(item) {
				return $gren_lang$parser$Parser$Advanced$Loop($gren_lang$core$Array$pushLast$(item, items));
			}, $gren_lang$parser$Parser$Advanced$ignorer$(parseItem, $gren_lang$parser$Parser$Advanced$ignorer$(ws, $gren_lang$parser$Parser$Advanced$ignorer$(sep, ws)))), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
				return $gren_lang$parser$Parser$Advanced$Done(items);
			}, $gren_lang$parser$Parser$Advanced$succeed({  })) ]);
};
var $gren_lang$parser$Parser$Advanced$sequenceEndMandatory = F4($gren_lang$parser$Parser$Advanced$sequenceEndMandatory$);
var $gren_lang$parser$Parser$Advanced$sequenceEndOptional$ = function(ender, ws, parseItem, sep, items) {
	var parseEnd = $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
			return $gren_lang$parser$Parser$Advanced$Done(items);
		}, ender);
	return $gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$revSkip$(sep, $gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$map$(function(item) {
								return $gren_lang$parser$Parser$Advanced$Loop($gren_lang$core$Array$pushLast$(item, items));
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
				return $gren_lang$parser$Parser$Advanced$ignorer$($gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$revSkip$(sep, $gren_lang$parser$Parser$Advanced$revSkip$(ws, $gren_lang$parser$Parser$Advanced$loop$([ item ], A3($gren_lang$parser$Parser$Advanced$sequenceEndMandatory, ws, parseItem, sep))))), ender);
		}
	};
	return $gren_lang$parser$Parser$Advanced$oneOf([ $gren_lang$parser$Parser$Advanced$andThen$(chompRest, parseItem), $gren_lang$parser$Parser$Advanced$map$(function(_v0) {
				return [  ];
			}, ender) ]);
};
var $gren_lang$parser$Parser$Advanced$sequenceEnd = F5($gren_lang$parser$Parser$Advanced$sequenceEnd$);
var $gren_lang$parser$Parser$Advanced$token = function(_v0) {
	var _v1 = _v0.a;
	var str = _v1.str;
	var expecting = _v1.expecting;
	var progress = !$gren_lang$core$String$isEmpty(str);
	return $gren_lang$parser$Parser$Advanced$Parser(function(s) {
			var _v2 = A5($gren_lang$parser$Parser$Advanced$isSubString, str, s.offset, s.row, s.col, s.src);
			var newOffset = _v2.newOffset;
			var newRow = _v2.newRow;
			var newCol = _v2.newCol;
			return _Utils_eq(newOffset, -1) ? $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromState$(s, expecting), pred: false }) : $gren_lang$parser$Parser$Advanced$Good({ pred: progress, state: { col: newCol, context: s.context, indent: s.indent, offset: newOffset, row: newRow, src: s.src }, value: {  } });
		});
};
var $gren_lang$parser$Parser$Advanced$sequence = function(i) {
	return $gren_lang$parser$Parser$Advanced$revSkip$($gren_lang$parser$Parser$Advanced$token(i.start), $gren_lang$parser$Parser$Advanced$revSkip$(i.spaces, $gren_lang$parser$Parser$Advanced$sequenceEnd$($gren_lang$parser$Parser$Advanced$token(i.end), i.spaces, i.item, $gren_lang$parser$Parser$Advanced$token(i.separator), i.trailing)));
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
	return $gren_lang$parser$Parser$Advanced$symbol($gren_lang$parser$Parser$Advanced$Token({ expecting: $gren_lang$parser$Parser$ExpectingSymbol(str), str: str }));
};
var $gren_lang$parser$Parser$ExpectingVariable = { $: 'ExpectingVariable' };
var $gren_lang$core$Dict$member$ = function(key, dict) {
	var _v0 = $gren_lang$core$Dict$get$(key, dict);
	if (_v0.$ === 'Just') {
		return true;
	} else {
		return false;
	}
};
var $gren_lang$core$Dict$member = F2($gren_lang$core$Dict$member$);
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
				return $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromState$(s, i.expecting), pred: false });
			} else {
				var s1 = _Utils_eq(firstOffset, -2) ? $gren_lang$parser$Parser$Advanced$varHelp$(i.inner, s.offset + 1, s.row + 1, 1, s.src, s.indent, s.context) : $gren_lang$parser$Parser$Advanced$varHelp$(i.inner, firstOffset, s.row, s.col + 1, s.src, s.indent, s.context);
				var name = A3($gren_lang$core$String$sliceUnits, s.offset, s1.offset, s.src);
				return $gren_lang$core$Set$member$(name, i.reserved) ? $gren_lang$parser$Parser$Advanced$Bad({ bag: $gren_lang$parser$Parser$Advanced$fromState$(s, i.expecting), pred: false }) : $gren_lang$parser$Parser$Advanced$Good({ pred: true, state: s1, value: name });
			}
		});
};
var $gren_lang$parser$Parser$variable = function(i) {
	return $gren_lang$parser$Parser$Advanced$variable({ expecting: $gren_lang$parser$Parser$ExpectingVariable, inner: i.inner, reserved: i.reserved, start: i.start });
};
var $blaix$prettynice$Prettynice$Internal$Props$parser = A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$succeed(A2($gren_lang$core$Array$foldl, F2(function(r, d) {
									return $gren_lang$core$Dict$set$(r.key, r.value, d);
								}), $gren_lang$core$Dict$empty)), $gren_lang$parser$Parser$chompUntil('type alias Props')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol('=')), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$sequence({ end: '}', item: A2($gren_lang$parser$Parser$keeper, A2($gren_lang$parser$Parser$keeper, $gren_lang$parser$Parser$succeed(F2(function(field, fieldType) {
							return { key: field, value: fieldType };
						})), A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, A2($gren_lang$parser$Parser$ignorer, $gren_lang$parser$Parser$variable({ inner: function(c) {
									return $gren_lang$core$Char$isAlphaNum(c) || _Utils_eq(c, _Utils_chr('_'));
								}, reserved: $gren_lang$core$Set$empty, start: $gren_lang$core$Char$isLower }), $gren_lang$parser$Parser$spaces), $gren_lang$parser$Parser$symbol(':')), $gren_lang$parser$Parser$spaces)), $blaix$prettynice$Prettynice$Internal$Props$fieldParser), separator: ',', spaces: $gren_lang$parser$Parser$spaces, start: '{', trailing: $gren_lang$parser$Parser$Forbidden }));
var $gren_lang$core$String$words = _String_words;
var $blaix$prettynice$Prettynice$Internal$Props$get = function(content) {
	var normalized = A2($gren_lang$core$String$join, ' ', $gren_lang$core$String$words(content));
	return $gren_lang$parser$Parser$run$($blaix$prettynice$Prettynice$Internal$Props$parser, normalized);
};
var $gren_lang$node$FileSystem$readFile$ = function(_v0, path) {
	return _FileSystem_readFile(path);
};
var $gren_lang$node$FileSystem$readFile = F2($gren_lang$node$FileSystem$readFile$);
var $blaix$prettynice$Prettynice$Internal$Props$supportedFieldTypeNames = A2($gren_lang$core$Array$map, function(entry) {
		if (entry.$ === 'SimpleType') {
			var keyword = entry.a.keyword;
			return keyword;
		} else {
			var keyword = entry.a.keyword;
			return keyword;
		}
	}, $blaix$prettynice$Prettynice$Internal$Props$fieldTypes);
var $blaix$prettynice$Prettynice$Internal$Props$fieldTypeToDecoder = function(fieldType) {
	switch (fieldType.$) {
		case 'IntType':
			return 'Decode.int';
		case 'FloatType':
			return 'Decode.float';
		case 'StringType':
			return 'Decode.string';
		case 'BoolType':
			return 'Decode.bool';
		case 'ArrayType':
			var t = fieldType.a;
			return '(Decode.array ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToDecoder(t) + ')');
		default:
			var t = fieldType.a;
			return '(Decode.nullable ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToDecoder(t) + ')');
	}
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldDecoder$ = function(name, fieldType, decoders) {
	var field = '|> Decode.andMap (Decode.field \"' + (name + ('\" ' + ($blaix$prettynice$Prettynice$Internal$Props$fieldTypeToDecoder(fieldType) + ')')));
	return $gren_lang$core$Array$pushLast$(field, decoders);
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldDecoder = F3($blaix$prettynice$Prettynice$Internal$Props$addFieldDecoder$);
var $blaix$prettynice$Prettynice$Internal$Props$decoder = function(props) {
	var fields = A2($gren_lang$core$String$join, '\n    ', $gren_lang$core$Dict$foldl$($blaix$prettynice$Prettynice$Internal$Props$addFieldDecoder, [  ], props));
	var fieldNames = $gren_lang$core$Dict$keys(props);
	var lambda = '\\' + (A2($gren_lang$core$String$join, ' ', fieldNames) + (' -> { ' + (A2($gren_lang$core$String$join, ', ', A2($gren_lang$core$Array$map, function(n) {
				return n + (' = ' + n);
			}, fieldNames)) + ' }')));
	return 'Decode.succeed (' + (lambda + (')\n    ' + fields));
};
var $blaix$prettynice$CLI$Command$Build$toClientComponent$ = function(modName, baseName, props) {
	return $gren_lang$core$String$replace$('{{PROPS_DECODER}}', $blaix$prettynice$Prettynice$Internal$Props$decoder(props), $gren_lang$core$String$replace$('{{MODULE_NAME}}', modName, $gren_lang$core$String$replace$('{{NAME}}', baseName, 'module Gen.{{MODULE_NAME}} exposing (main)\n\nimport Json.Decode as Decode\nimport Transmutable.Html.VirtualDom exposing (toVirtualDom)\nimport {{MODULE_NAME}} as {{NAME}}\nimport Browser\n\nmain : Program Decode.Value {{NAME}}.Model {{NAME}}.Msg\nmain =\n    let\n        e = {{NAME}}.component\n    in\n    Browser.element\n        { init = decodeProps >> e.init\n        , update = e.update\n        , subscriptions = e.subscriptions\n        , view = e.view >> toVirtualDom\n        }\n\npropsDecoder : Decode.Decoder {{NAME}}.Props\npropsDecoder =\n    {{PROPS_DECODER}}\n\ndecodeProps : Decode.Value -> {{NAME}}.Props\ndecodeProps value =\n    when Decode.decodeValue propsDecoder value is\n        Ok props ->\n            props\n\n        Err error ->\n            Debug.todo (Decode.errorToString error)')));
};
var $blaix$prettynice$CLI$Command$Build$toClientComponent = F3($blaix$prettynice$CLI$Command$Build$toClientComponent$);


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
var $gren_lang$core$Bytes$fromString = _Bytes_fromString;
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
var $blaix$prettynice$CLI$Command$Build$writeStringToFile$ = function(fsPerm, content, path) {
	var filePath = $gren_lang$node$FileSystem$Path$fromPosixString(path);
	var parentDir = $gren_lang$core$Maybe$withDefault$($gren_lang$node$FileSystem$Path$empty, $gren_lang$node$FileSystem$Path$parentPath(filePath));
	return $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, A2($gren_lang$core$Task$andThen, function(_v0) {
				return $gren_lang$node$FileSystem$writeFile$(fsPerm, $gren_lang$core$Bytes$fromString(content), filePath);
			}, $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { recursive: true }, parentDir)));
};
var $blaix$prettynice$CLI$Command$Build$writeStringToFile = F3($blaix$prettynice$CLI$Command$Build$writeStringToFile$);
var $blaix$prettynice$CLI$Command$Build$genClientComponent$ = function(fsPerm, component) {
	return A2($gren_lang$core$Task$andThen, function(bytes) {
			var source = $gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Bytes$toString(bytes));
			var propsResult = $blaix$prettynice$Prettynice$Internal$Props$get(source);
			var modName = $blaix$prettynice$CLI$Command$Build$componentModuleName(component);
			var baseName = $blaix$prettynice$CLI$Command$Build$componentBaseName(component);
			if (propsResult.$ === 'Ok') {
				var props = propsResult.a;
				var destPath = 'client/.prettynice/Gen/Components/' + $gren_lang$node$FileSystem$Path$toPosixString(component.relativePath);
				var content = $blaix$prettynice$CLI$Command$Build$toClientComponent$(modName, baseName, props);
				return $gren_lang$core$Task$map$(function(_v1) {
						return {  };
					}, $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, content, destPath));
			} else {
				return $gren_lang$core$Task$fail($blaix$prettynice$CLI$Command$Build$PropsParseError('Failed to parse props for ' + (baseName + ('.\n\n' + ('Could not parse the Props type alias. Supported field types are: ' + (A2($gren_lang$core$String$join, ', ', $blaix$prettynice$Prettynice$Internal$Props$supportedFieldTypeNames) + '.'))))));
			}
		}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$node$FileSystem$readFile$(fsPerm, component.fullPath)));
};
var $blaix$prettynice$CLI$Command$Build$genClientComponent = F2($blaix$prettynice$CLI$Command$Build$genClientComponent$);
var $blaix$prettynice$CLI$Command$Build$genClientComponents$ = function(fsPerm, components) {
	var _v0 = $gren_lang$core$Array$popFirst(components);
	if (_v0.$ === 'Nothing') {
		return $gren_lang$core$Task$succeed({  });
	} else {
		var _v1 = _v0.a;
		var component = _v1.first;
		var remainingComponents = _v1.rest;
		return A2($gren_lang$core$Task$andThen, function(_v2) {
				return $blaix$prettynice$CLI$Command$Build$genClientComponents$(fsPerm, remainingComponents);
			}, $blaix$prettynice$CLI$Command$Build$genClientComponent$(fsPerm, component));
	}
};
var $blaix$prettynice$CLI$Command$Build$genClientComponents = F2($blaix$prettynice$CLI$Command$Build$genClientComponents$);
var $blaix$prettynice$CLI$Command$Build$genClientPort$ = function(fsPerm, component) {
	var relStr = $gren_lang$node$FileSystem$Path$toPosixString(component.relativePath);
	var jsRelStr = $gren_lang$core$String$dropLast$(5, relStr) + '.js';
	var srcPath = $gren_lang$node$FileSystem$Path$fromPosixString('client/src/Components/' + jsRelStr);
	var destPath = $gren_lang$node$FileSystem$Path$fromPosixString('dist/client/Components/' + jsRelStr);
	return A2($gren_lang$core$Task$onError, function(e) {
			if (e.$ === 'FileSystemError') {
				var fsErr = e.a;
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(fsErr) ? $gren_lang$core$Task$map$(function(_v2) {
						return {  };
					}, $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, '', 'dist/client/Components/' + jsRelStr)) : $gren_lang$core$Task$fail(e);
			} else {
				return $gren_lang$core$Task$fail(e);
			}
		}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, $gren_lang$node$FileSystem$copyFile$(fsPerm, destPath, srcPath))));
};
var $blaix$prettynice$CLI$Command$Build$genClientPort = F2($blaix$prettynice$CLI$Command$Build$genClientPort$);
var $blaix$prettynice$CLI$Command$Build$genClientPorts$ = function(fsPerm, components) {
	var _v0 = $gren_lang$core$Array$popFirst(components);
	if (_v0.$ === 'Nothing') {
		return $gren_lang$core$Task$succeed({  });
	} else {
		var _v1 = _v0.a;
		var component = _v1.first;
		var remainingComponents = _v1.rest;
		return A2($gren_lang$core$Task$andThen, function(_v2) {
				return $blaix$prettynice$CLI$Command$Build$genClientPorts$(fsPerm, remainingComponents);
			}, $blaix$prettynice$CLI$Command$Build$genClientPort$(fsPerm, component));
	}
};
var $blaix$prettynice$CLI$Command$Build$genClientPorts = F2($blaix$prettynice$CLI$Command$Build$genClientPorts$);
var $blaix$prettynice$CLI$Command$Build$prettyniceComponentModule = 'module Prettynice.Component exposing (Component)\n\nimport Transmutable.Html exposing (Html)\n\ntype alias Component props model msg =\n    { init : props -> { model : model, command : Cmd msg }\n    , view : model -> Html msg\n    , update : msg -> model -> { model : model, command : Cmd msg }\n    , subscriptions : model -> Sub msg\n    }';
var $blaix$prettynice$CLI$Command$Build$serverWrapper = 'const main = require("./main.js");\nconst app = main.Gren.Main.init({});\n\ntry {\n    const ports = require("./ports.js");\n    if (ports.init) {\n      ports.init(app);\n    }\n} catch (e) {\n    if (e.code !== \'MODULE_NOT_FOUND\') {\n        throw e;\n    }\n}';
var $blaix$prettynice$CLI$Command$Build$genDependencies = function(fsPerm) {
	return $gren_lang$core$Task$map$(function(_v2) {
			return {  };
		}, A2($gren_lang$core$Task$andThen, function(_v1) {
				return $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, $blaix$prettynice$CLI$Command$Build$serverWrapper, 'dist/server/index.js');
			}, A2($gren_lang$core$Task$andThen, function(_v0) {
					return $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, $blaix$prettynice$CLI$Command$Build$prettyniceComponentModule, 'client/.prettynice/Prettynice/Component.gren');
				}, $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, '', 'dist/client/main.js'))));
};
var $gren_lang$core$String$contains = _String_contains;
var $gren_lang$node$FileSystem$errorToString = function(_v0) {
	var message = _v0.a.message;
	return message;
};
var $gren_lang$node$FileSystem$makeTempDirectory$ = function(_v0, prefix) {
	return _FileSystem_mkdtemp(prefix);
};
var $gren_lang$node$FileSystem$makeTempDirectory = F2($gren_lang$node$FileSystem$makeTempDirectory$);
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
	return $gren_lang$core$Array$pushLast$(field, encoders);
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
	return $gren_lang$core$Array$pushLast$(field, sigs);
};
var $blaix$prettynice$Prettynice$Internal$Props$addFieldSig = F3($blaix$prettynice$Prettynice$Internal$Props$addFieldSig$);
var $blaix$prettynice$Prettynice$Internal$Props$typeSig = function(props) {
	var fields = A2($gren_lang$core$String$join, ', ', $gren_lang$core$Dict$foldl$($blaix$prettynice$Prettynice$Internal$Props$addFieldSig, [  ], props));
	return '{ ' + (fields + ' }');
};
var $blaix$prettynice$CLI$Command$Build$toServerComponent$ = function(modName, baseName, props) {
	return $gren_lang$core$String$replace$('{{PROPS_ENCODER}}', $blaix$prettynice$Prettynice$Internal$Props$encoder(props), $gren_lang$core$String$replace$('{{PROPS_TYPE}}', $blaix$prettynice$Prettynice$Internal$Props$typeSig(props), $gren_lang$core$String$replace$('{{MODULE_NAME}}', modName, 'module Gen.{{MODULE_NAME}} exposing (init)\n\nimport Json.Encode as Encode\nimport Prettynice.Internal.Props as Props\nimport Transmutable.Html as H exposing (Html)\nimport Transmutable.Html.Attributes as A\n\ntype alias Props =\n    {{PROPS_TYPE}}\n\nencoder : Props -> Encode.Value\nencoder props =\n    {{PROPS_ENCODER}}\n\ninit : Props -> Html msg\ninit props =\n    let\n        propJson = Encode.encode 0 (encoder props)\n    in\n    H.span []\n        [ H.span [ A.class "prettynice-component-{{MODULE_NAME}}" ] []\n        , H.node "script" []\n            [ H.text <|\n                \"""\n\n                var $__components = $__components || {};\n                $__components["{{MODULE_NAME}}"] = $__components["{{MODULE_NAME}}"] || [];\n                $__components["{{MODULE_NAME}}"].push(\n                    Gren.Gen.{{MODULE_NAME}}.init({\n\n                        flags:\n                            \""" ++ propJson ++ \"""\n                        ,\n                        node: document.currentScript.parentNode.getElementsByClassName(\n                            "prettynice-component-{{MODULE_NAME}}"\n                        )[0],\n                    })\n                );\n\n                \"""\n            ]\n        ]')));
};
var $blaix$prettynice$CLI$Command$Build$toServerComponent = F3($blaix$prettynice$CLI$Command$Build$toServerComponent$);
var $blaix$prettynice$CLI$Command$Build$genServerComponent$ = function(fsPerm, component) {
	return A2($gren_lang$core$Task$andThen, function(bytes) {
			var source = $gren_lang$core$Maybe$withDefault$('', $gren_lang$core$Bytes$toString(bytes));
			var propsResult = $blaix$prettynice$Prettynice$Internal$Props$get(source);
			var modName = $blaix$prettynice$CLI$Command$Build$componentModuleName(component);
			var baseName = $blaix$prettynice$CLI$Command$Build$componentBaseName(component);
			if (propsResult.$ === 'Ok') {
				var props = propsResult.a;
				var destPath = 'server/.prettynice/Gen/Components/' + $gren_lang$node$FileSystem$Path$toPosixString(component.relativePath);
				var content = $blaix$prettynice$CLI$Command$Build$toServerComponent$(modName, baseName, props);
				return $gren_lang$core$Task$map$(function(_v1) {
						return {  };
					}, $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, content, destPath));
			} else {
				var deadEnds = propsResult.a;
				var normalized = A2($gren_lang$core$String$join, ' ', $gren_lang$core$String$words(source));
				var hasPropsAlias = A2($gren_lang$core$String$contains, 'type alias Props', normalized);
				var guidance = hasPropsAlias ? ('Could not parse the Props type alias. Supported field types are: ' + (A2($gren_lang$core$String$join, ', ', $blaix$prettynice$Prettynice$Internal$Props$supportedFieldTypeNames) + '.')) : 'No \'type alias Props\' found. Components in client/src/Components/ must define a Props type alias. Example:\n\n    type alias Props =\n        { name : String\n        }';
				var deadEndStr = A2($gren_lang$core$String$join, '; ', A2($gren_lang$core$Array$map, function(de) {
							return 'row=' + ($gren_lang$core$String$fromInt(de.row) + (' col=' + $gren_lang$core$String$fromInt(de.col)));
						}, deadEnds));
				var debugContent = 'deadEnds: ' + (deadEndStr + ('\n' + ('normalized length: ' + ($gren_lang$core$String$fromInt($gren_lang$core$String$count(normalized)) + ('\n' + ('normalized content:\n' + (normalized + '\n')))))));
				var writeDebugToTemp = A2($gren_lang$core$Task$onError, function(fsErr) {
						return $gren_lang$core$Task$succeed('\n\n(Failed to write debug log: ' + ($gren_lang$node$FileSystem$errorToString(fsErr) + ')'));
					}, A2($gren_lang$core$Task$andThen, function(tempDir) {
							var debugPath = $gren_lang$node$FileSystem$Path$join([ tempDir, $gren_lang$node$FileSystem$Path$fromPosixString('debug.txt') ]);
							return $gren_lang$core$Task$map$(function(_v2) {
									return '\n\nDebug log written to: ' + $gren_lang$node$FileSystem$Path$toPosixString(debugPath);
								}, $gren_lang$node$FileSystem$writeFile$(fsPerm, $gren_lang$core$Bytes$fromString(debugContent), debugPath));
						}, $gren_lang$node$FileSystem$makeTempDirectory$(fsPerm, 'prettynice-debug')));
				return A2($gren_lang$core$Task$andThen, function(debugNote) {
						return $gren_lang$core$Task$fail($blaix$prettynice$CLI$Command$Build$PropsParseError('Failed to parse props for ' + (baseName + ('.\n\n' + (guidance + debugNote)))));
					}, writeDebugToTemp);
			}
		}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$node$FileSystem$readFile$(fsPerm, component.fullPath)));
};
var $blaix$prettynice$CLI$Command$Build$genServerComponent = F2($blaix$prettynice$CLI$Command$Build$genServerComponent$);
var $blaix$prettynice$CLI$Command$Build$genServerComponents$ = function(fsPerm, components) {
	var _v0 = $gren_lang$core$Array$popFirst(components);
	if (_v0.$ === 'Nothing') {
		return $gren_lang$core$Task$succeed({  });
	} else {
		var _v1 = _v0.a;
		var component = _v1.first;
		var remainingComponents = _v1.rest;
		return A2($gren_lang$core$Task$andThen, function(_v2) {
				return $blaix$prettynice$CLI$Command$Build$genServerComponents$(fsPerm, remainingComponents);
			}, $blaix$prettynice$CLI$Command$Build$genServerComponent$(fsPerm, component));
	}
};
var $blaix$prettynice$CLI$Command$Build$genServerComponents = F2($blaix$prettynice$CLI$Command$Build$genServerComponents$);
var $blaix$prettynice$CLI$Command$Build$genServerPorts = function(fsPerm) {
	var srcPath = $gren_lang$node$FileSystem$Path$fromPosixString('server/src/ports.js');
	var destPath = $gren_lang$node$FileSystem$Path$fromPosixString('dist/server/ports.js');
	return A2($gren_lang$core$Task$onError, function(e) {
			if (e.$ === 'FileSystemError') {
				var fsErr = e.a;
				return $gren_lang$node$FileSystem$errorIsNoSuchFileOrDirectory(fsErr) ? $gren_lang$core$Task$map$(function(_v2) {
						return {  };
					}, $blaix$prettynice$CLI$Command$Build$writeStringToFile$(fsPerm, '', 'dist/server/ports.js')) : $gren_lang$core$Task$fail(e);
			} else {
				return $gren_lang$core$Task$fail(e);
			}
		}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Build$FileSystemError, $gren_lang$core$Task$map$(function(_v0) {
					return {  };
				}, $gren_lang$node$FileSystem$copyFile$(fsPerm, destPath, srcPath))));
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
var $gren_lang$core$Stream$Log$string$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$bytes$(stream, $gren_lang$core$Bytes$fromString(data));
};
var $gren_lang$core$Stream$Log$string = F2($gren_lang$core$Stream$Log$string$);
var $gren_lang$core$Stream$Log$line$ = function(stream, data) {
	return $gren_lang$core$Stream$Log$string$(stream, data + '\n');
};
var $gren_lang$core$Stream$Log$line = F2($gren_lang$core$Stream$Log$line$);
var $blaix$gren_ansi$Ansi$Red = { $: 'Red' };
var $blaix$gren_tui$UI$Attribute$Color = function (a) {
	return { $: 'Color', a: a };
};
var $blaix$gren_tui$UI$Attribute$color = $blaix$gren_tui$UI$Attribute$Color;
var $blaix$gren_tui$UI$Row = function (a) {
	return { $: 'Row', a: a };
};
var $blaix$gren_tui$UI$row$ = function(attrs, children) {
	return $blaix$gren_tui$UI$Row({ attrs: attrs, children: children });
};
var $blaix$gren_tui$UI$row = F2($blaix$gren_tui$UI$row$);
var $blaix$gren_tui$UI$Text = function (a) {
	return { $: 'Text', a: a };
};
var $blaix$gren_tui$UI$Col = function (a) {
	return { $: 'Col', a: a };
};
var $blaix$gren_tui$UI$column$ = function(attrs, children) {
	return $blaix$gren_tui$UI$Col({ attrs: attrs, children: children });
};
var $blaix$gren_tui$UI$column = F2($blaix$gren_tui$UI$column$);
var $blaix$gren_tui$SingleLine$SingleLine = function (a) {
	return { $: 'SingleLine', a: a };
};
var $gren_lang$core$String$lines = _String_lines;
var $blaix$gren_tui$SingleLine$fromString = function(string) {
	return A2($gren_lang$core$Array$map, $blaix$gren_tui$SingleLine$SingleLine, $gren_lang$core$String$lines(string));
};
var $blaix$gren_tui$UI$text$ = function(attrs, content) {
	return $blaix$gren_tui$UI$column$([  ], A2($gren_lang$core$Array$map, function(l) {
				return $blaix$gren_tui$UI$Text({ attrs: attrs, content: l });
			}, $blaix$gren_tui$SingleLine$fromString(content)));
};
var $blaix$gren_tui$UI$text = F2($blaix$gren_tui$UI$text$);
var $blaix$prettynice$CLI$Command$Build$viewBuildError = function(error) {
	var errorMsg = function () {
		switch (error.$) {
			case 'FileSystemError':
				var fsError = error.a;
				return $gren_lang$node$FileSystem$errorToString(fsError);
			case 'ChildProcessError':
				if (error.a.$ === 'InitError') {
					var _v1 = error.a.a;
					var program = _v1.program;
					var _arguments = _v1._arguments;
					var errorCode = _v1.errorCode;
					return '`' + (program + (' ' + (A2($gren_lang$core$String$join, ' ', _arguments) + ('`' + (' exited with error code ' + errorCode)))));
				} else {
					var stderr = error.a.a.stderr;
					return $gren_lang$core$Maybe$withDefault$('(failed to decode error message)', $gren_lang$core$Bytes$toString(stderr));
				}
			default:
				var msg = error.a;
				return msg;
		}
	}();
	return $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Red) ], [ $blaix$gren_tui$UI$text$([  ], 'Build failed: '), $blaix$gren_tui$UI$text$([  ], errorMsg) ]);
};
var $blaix$gren_ansi$Ansi$Green = { $: 'Green' };
var $blaix$prettynice$CLI$Command$Build$viewBuildSuccess = $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Green) ], '✅ Done');
var $blaix$prettynice$CLI$Command$Build$buildProject = function(_v0) {
	var fsPerm = _v0.fsPerm;
	var procPerm = _v0.procPerm;
	var env = _v0.env;
	var optimize = _v0.optimize;
	return $gren_lang$core$Task$map$(function(_v19) {
			return $blaix$prettynice$CLI$Command$Build$viewBuildSuccess;
		}, $gren_lang$core$Task$mapError$(function(err) {
				return { exitCode: 1, message: $blaix$prettynice$CLI$Command$Build$viewBuildError(err) };
			}, A2($gren_lang$core$Task$andThen, function(_v17) {
					return A2($gren_lang$core$Task$andThen, function(_v18) {
							return $blaix$prettynice$CLI$Command$Build$buildServer$(procPerm, optimize);
						}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Building server...'));
				}, A2($gren_lang$core$Task$andThen, function(components) {
						return A2($gren_lang$core$Task$andThen, function(_v16) {
								return $blaix$prettynice$CLI$Command$Build$buildClientComponents$(procPerm, components, optimize);
							}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Building client components...'));
					}, A2($gren_lang$core$Task$andThen, function(components) {
							return $gren_lang$core$Task$map$(function(_v15) {
									return components;
								}, A2($gren_lang$core$Task$andThen, function(_v14) {
										return $blaix$prettynice$CLI$Command$Build$copyPublicAssets(fsPerm);
									}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Copying public assets...')));
						}, A2($gren_lang$core$Task$andThen, function(components) {
								return $gren_lang$core$Task$map$(function(_v13) {
										return components;
									}, A2($gren_lang$core$Task$andThen, function(_v12) {
											return $blaix$prettynice$CLI$Command$Build$genClientPorts$(fsPerm, components);
										}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Generating client ports...')));
							}, A2($gren_lang$core$Task$andThen, function(components) {
									return $gren_lang$core$Task$map$(function(_v11) {
											return components;
										}, A2($gren_lang$core$Task$andThen, function(_v10) {
												return $blaix$prettynice$CLI$Command$Build$genServerPorts(fsPerm);
											}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Generating server ports...')));
								}, A2($gren_lang$core$Task$andThen, function(components) {
										return $gren_lang$core$Task$map$(function(_v9) {
												return components;
											}, A2($gren_lang$core$Task$andThen, function(_v8) {
													return $blaix$prettynice$CLI$Command$Build$genClientComponents$(fsPerm, components);
												}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Generating client components...')));
									}, A2($gren_lang$core$Task$andThen, function(components) {
											return $gren_lang$core$Task$map$(function(_v7) {
													return components;
												}, A2($gren_lang$core$Task$andThen, function(_v6) {
														return $blaix$prettynice$CLI$Command$Build$genServerComponents$(fsPerm, components);
													}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Generating server components...')));
										}, A2($gren_lang$core$Task$andThen, function(_v5) {
												return $blaix$prettynice$CLI$Command$Build$discoverComponents(fsPerm);
											}, A2($gren_lang$core$Task$andThen, function(_v4) {
													return $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Discovering components...');
												}, A2($gren_lang$core$Task$andThen, function(_v3) {
														return $blaix$prettynice$CLI$Command$Build$genDependencies(fsPerm);
													}, A2($gren_lang$core$Task$andThen, function(_v2) {
															return $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Generating prettynice dependencies...');
														}, A2($gren_lang$core$Task$andThen, function(_v1) {
																return $blaix$prettynice$CLI$Command$Build$clean(fsPerm);
															}, $gren_lang$core$Stream$Log$line$(env.stdout, '🌸 Cleaning up previous builds...')))))))))))))));
};
var $blaix$prettynice$CLI$Command$Build$RunBuild = { $: 'RunBuild' };
var $blaix$prettynice$CLI$Command$Build$ShowHelp = { $: 'ShowHelp' };
var $blaix$prettynice$CLI$Command$Build$route$ = function(args, options) {
	var _v0 = { args: args, help: $gren_lang$core$Dict$get$('help', options) };
	if (_v0.help.$ === 'Just') {
		return $blaix$prettynice$CLI$Command$Build$ShowHelp;
	} else {
		if (_v0.args.length === 0) {
			return $blaix$prettynice$CLI$Command$Build$RunBuild;
		} else {
			return $blaix$prettynice$CLI$Command$Build$RunBuild;
		}
	}
};
var $blaix$prettynice$CLI$Command$Build$route = F2($blaix$prettynice$CLI$Command$Build$route$);
var $blaix$gren_ansi$Ansi$Cyan = { $: 'Cyan' };
var $blaix$prettynice$CLI$Command$Build$indent = '    ';
var $blaix$prettynice$CLI$Command$Build$viewUsage = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Usage:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Build$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice build [options]') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Options:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Build$indent), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], '--optimize '), $blaix$gren_tui$UI$text$([  ], ' Build with optimizations enabled') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Build$indent), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], '--help '), $blaix$gren_tui$UI$text$([  ], ' Show this help information') ]) ]);
var $blaix$prettynice$CLI$Command$Build$viewHelp = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Build a Prettynice project'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$prettynice$CLI$Command$Build$viewUsage ]);
var $blaix$prettynice$CLI$Command$Build$run = function(_v0) {
	var fsPerm = _v0.fsPerm;
	var procPerm = _v0.procPerm;
	var args = _v0.args;
	var options = _v0.options;
	var env = _v0.env;
	var optimize = $gren_lang$core$Dict$member$('optimize', options);
	var _v1 = $blaix$prettynice$CLI$Command$Build$route$(args, options);
	if (_v1.$ === 'RunBuild') {
		return $blaix$prettynice$CLI$Command$Build$buildProject({ env: env, fsPerm: fsPerm, optimize: optimize, procPerm: procPerm });
	} else {
		return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$Command$Build$viewHelp);
	}
};
var $gren_lang$core$Maybe$andThen$ = function(callback, maybeValue) {
	if (maybeValue.$ === 'Just') {
		var value = maybeValue.a;
		return callback(value);
	} else {
		return $gren_lang$core$Maybe$Nothing;
	}
};
var $gren_lang$core$Maybe$andThen = F2($gren_lang$core$Maybe$andThen$);
var $gren_lang$node$FileSystem$Path$appendPosixString$ = function(str, path) {
	return $gren_lang$node$FileSystem$Path$prepend$(path, $gren_lang$node$FileSystem$Path$fromPosixString(str));
};
var $gren_lang$node$FileSystem$Path$appendPosixString = F2($gren_lang$node$FileSystem$Path$appendPosixString$);
var $blaix$prettynice$CLI$Command$Init$FileSystemError = function (a) {
	return { $: 'FileSystemError', a: a };
};
var $blaix$prettynice$CLI$Command$Init$ignores = [ 'node_modules', 'tests', 'dist', 'build', 'docs.json', '.gren', '.devbox' ];
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
var $blaix$prettynice$CLI$Command$Init$copyDirectory$ = function(fsPerm, sourcePath, targetPath) {
	return A2($gren_lang$core$Task$andThen, A3($blaix$prettynice$CLI$Command$Init$copyEntries, fsPerm, sourcePath, targetPath), $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Init$FileSystemError, A2($gren_lang$core$Task$andThen, function(_v5) {
					return $gren_lang$node$FileSystem$listDirectory$(fsPerm, sourcePath);
				}, $gren_lang$node$FileSystem$makeDirectory$(fsPerm, { recursive: true }, targetPath))));
};
var $blaix$prettynice$CLI$Command$Init$copyDirectory = F3($blaix$prettynice$CLI$Command$Init$copyDirectory$);
var $blaix$prettynice$CLI$Command$Init$copyEntries$ = function(fsPerm, sourcePath, targetPath, entries) {
	copyEntries:
	while (true) {
		var _v0 = $gren_lang$core$Array$popFirst(entries);
		if (_v0.$ === 'Nothing') {
			return $gren_lang$core$Task$succeed({  });
		} else {
			var _v1 = _v0.a;
			var entry = _v1.first;
			var remainingEntries = _v1.rest;
			var targetEntry = $gren_lang$node$FileSystem$Path$join([ targetPath, entry.path ]);
			var sourceEntry = $gren_lang$node$FileSystem$Path$join([ sourcePath, entry.path ]);
			var entryName = $gren_lang$node$FileSystem$Path$filenameWithExtension(entry.path);
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
				var _v2 = entry.entityType;
				switch (_v2.$) {
					case 'Directory':
						return A2($gren_lang$core$Task$andThen, function(_v3) {
								return $blaix$prettynice$CLI$Command$Init$copyEntries$(fsPerm, sourcePath, targetPath, remainingEntries);
							}, $blaix$prettynice$CLI$Command$Init$copyDirectory$(fsPerm, sourceEntry, targetEntry));
					case 'File':
						return A2($gren_lang$core$Task$andThen, function(_v4) {
								return $blaix$prettynice$CLI$Command$Init$copyEntries$(fsPerm, sourcePath, targetPath, remainingEntries);
							}, $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Init$FileSystemError, $gren_lang$node$FileSystem$copyFile$(fsPerm, targetEntry, sourceEntry)));
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
var $blaix$prettynice$CLI$Command$Init$ChildProcessError = function (a) {
	return { $: 'ChildProcessError', a: a };
};
var $blaix$prettynice$CLI$Command$Init$npmInstall$ = function(procPerm, dirName, localPackage) {
	var runOptions = _Utils_update($gren_lang$node$ChildProcess$defaultRunOptions, { workingDirectory: $gren_lang$node$ChildProcess$SetWorkingDirectory(dirName) });
	var args = function () {
		if (localPackage.$ === 'Just') {
			var pkg = localPackage.a;
			return [ 'install', pkg ];
		} else {
			return [ 'install' ];
		}
	}();
	return $gren_lang$core$Task$mapError$($blaix$prettynice$CLI$Command$Init$ChildProcessError, $gren_lang$core$Task$map$(function(_v0) {
				return {  };
			}, $gren_lang$node$ChildProcess$run$(procPerm, 'npm', args, runOptions)));
};
var $blaix$prettynice$CLI$Command$Init$npmInstall = F3($blaix$prettynice$CLI$Command$Init$npmInstall$);
var $blaix$prettynice$CLI$Command$Init$viewInitError = function(error) {
	var errorMsg = function () {
		if (error.$ === 'FileSystemError') {
			var fsError = error.a;
			return $gren_lang$node$FileSystem$errorToString(fsError);
		} else {
			if (error.a.$ === 'InitError') {
				var _v1 = error.a.a;
				var program = _v1.program;
				var _arguments = _v1._arguments;
				var errorCode = _v1.errorCode;
				return program + (A2($gren_lang$core$String$join, ' ', _arguments) + ('`' + ('exited with error code ' + errorCode)));
			} else {
				var stderr = error.a.a.stderr;
				return $gren_lang$core$Maybe$withDefault$('(failed to decode error message)', $gren_lang$core$Bytes$toString(stderr));
			}
		}
	}();
	return $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Red) ], [ $blaix$gren_tui$UI$text$([  ], 'Failed to initialize project: '), $blaix$gren_tui$UI$text$([  ], errorMsg) ]);
};
var $blaix$gren_ansi$Ansi$Yellow = { $: 'Yellow' };
var $blaix$prettynice$CLI$Command$Init$viewInitSuccess = function(dirName) {
	return $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Green) ], '✅ Done!'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], 'Now what?'), $blaix$gren_tui$UI$row$([  ], (dirName === '.') ? [  ] : [ $blaix$gren_tui$UI$text$([  ], '🌸 Navigate to your new project: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Yellow) ], 'cd ' + dirName) ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 Start the dev server with: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Yellow) ], 'npm run dev') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 Make changes to your server at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Yellow) ], 'server/src/Main.gren') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 View your example client-side component at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Yellow) ], 'client/src/Components/Counter.gren') ]), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], '🌸 View more examples at: '), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Yellow) ], 'https://github.com/blaix/prettynice/tree/main/examples') ]) ]);
};
var $blaix$prettynice$CLI$Command$Init$initializeProject = function(_v0) {
	var fsPerm = _v0.fsPerm;
	var dirName = _v0.dirName;
	var procPerm = _v0.procPerm;
	var env = _v0.env;
	var localPackage = _v0.localPackage;
	var templatePath = $gren_lang$node$FileSystem$Path$appendPosixString$('init', $gren_lang$node$FileSystem$Path$appendPosixString$('templates', $gren_lang$core$Maybe$withDefault$($gren_lang$node$FileSystem$Path$empty, $gren_lang$core$Maybe$andThen$($gren_lang$node$FileSystem$Path$parentPath, $gren_lang$node$FileSystem$Path$parentPath(env.applicationPath)))));
	var targetPath = function () {
		var _v5 = env.platform;
		if (_v5.$ === 'Win32') {
			return $gren_lang$node$FileSystem$Path$fromWin32String(dirName);
		} else {
			return $gren_lang$node$FileSystem$Path$fromPosixString(dirName);
		}
	}();
	return $gren_lang$core$Task$map$(function(_v4) {
			return $blaix$prettynice$CLI$Command$Init$viewInitSuccess(dirName);
		}, $gren_lang$core$Task$mapError$(function(err) {
				return { exitCode: 2, message: $blaix$prettynice$CLI$Command$Init$viewInitError(err) };
			}, A2($gren_lang$core$Task$andThen, function(_v3) {
					return $blaix$prettynice$CLI$Command$Init$npmInstall$(procPerm, dirName, localPackage);
				}, A2($gren_lang$core$Task$andThen, function(_v2) {
						return $gren_lang$core$Stream$Log$line$(env.stdout, '🤖 Installing dependencies...');
					}, A2($gren_lang$core$Task$andThen, function(_v1) {
							return $blaix$prettynice$CLI$Command$Init$copyDirectory$(fsPerm, templatePath, targetPath);
						}, $gren_lang$core$Stream$Log$line$(env.stdout, '🤖 Generating project...'))))));
};
var $blaix$prettynice$CLI$Command$Init$InitializeProject = function (a) {
	return { $: 'InitializeProject', a: a };
};
var $blaix$prettynice$CLI$Command$Init$ShowHelp = { $: 'ShowHelp' };
var $blaix$prettynice$CLI$Command$Init$UsageError = { $: 'UsageError' };
var $blaix$prettynice$CLI$Command$Init$route$ = function(args, options) {
	var _v0 = { args: args, help: $gren_lang$core$Dict$get$('help', options) };
	if (_v0.help.$ === 'Just') {
		return $blaix$prettynice$CLI$Command$Init$ShowHelp;
	} else {
		if (_v0.args.length === 1) {
			var dirName = _v0.args[0];
			return $blaix$prettynice$CLI$Command$Init$InitializeProject(dirName);
		} else {
			return $blaix$prettynice$CLI$Command$Init$UsageError;
		}
	}
};
var $blaix$prettynice$CLI$Command$Init$route = F2($blaix$prettynice$CLI$Command$Init$route$);
var $blaix$prettynice$CLI$Command$Init$indent = '    ';
var $blaix$prettynice$CLI$Command$Init$viewUsage = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Usage:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice init <directory>') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Arguments:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], '<directory> '), $blaix$gren_tui$UI$text$([  ], ' Path where the new project will be created') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Example:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$Command$Init$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice init my-app') ]) ]);
var $blaix$prettynice$CLI$Command$Init$viewHelp = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Initialize a new Prettynice project'), $blaix$gren_tui$UI$text$([  ], ''), $blaix$prettynice$CLI$Command$Init$viewUsage ]);
var $blaix$prettynice$CLI$Command$Init$run = function(_v0) {
	var fsPerm = _v0.fsPerm;
	var procPerm = _v0.procPerm;
	var args = _v0.args;
	var options = _v0.options;
	var env = _v0.env;
	var localPackage = _v0.localPackage;
	var _v1 = $blaix$prettynice$CLI$Command$Init$route$(args, options);
	switch (_v1.$) {
		case 'InitializeProject':
			var dirName = _v1.a;
			return $blaix$prettynice$CLI$Command$Init$initializeProject({ dirName: dirName, env: env, fsPerm: fsPerm, localPackage: localPackage, procPerm: procPerm });
		case 'ShowHelp':
			return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$Command$Init$viewHelp);
		default:
			return $gren_lang$core$Task$fail({ exitCode: 1, message: $blaix$prettynice$CLI$Command$Init$viewUsage });
	}
};
var $gren_lang$node$Node$startProgram = function(initResult) {
	return $gren_lang$node$Internal$Init$Task($gren_lang$core$Task$succeed(initResult));
};
var $blaix$prettynice$CLI$indent = '    ';
var $blaix$prettynice$CLI$viewUsage = $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], 'Usage:'), $blaix$gren_tui$UI$row$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$text$([  ], 'prettynice <command> [options]') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Commands:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$column$([ $blaix$gren_tui$UI$Attribute$color($blaix$gren_ansi$Ansi$Cyan) ], [ $blaix$gren_tui$UI$text$([  ], 'init <directory> '), $blaix$gren_tui$UI$text$([  ], 'build ') ]), $blaix$gren_tui$UI$column$([  ], [ $blaix$gren_tui$UI$text$([  ], ' Initialize a new Prettynice project'), $blaix$gren_tui$UI$text$([  ], ' Build an existing Prettynice project') ]) ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'Options:'), $blaix$gren_tui$UI$row$([  ], [ $blaix$gren_tui$UI$text$([  ], $blaix$prettynice$CLI$indent), $blaix$gren_tui$UI$text$([  ], '--help '), $blaix$gren_tui$UI$text$([  ], ' Show help information') ]), $blaix$gren_tui$UI$text$([  ], ''), $blaix$gren_tui$UI$text$([  ], 'For more information, visit https://github.com/blaix/prettynice') ]);
var $blaix$prettynice$CLI$init = function(env) {
	return $gren_lang$node$Init$await$($gren_lang$node$FileSystem$initialize, function(fsPerm) {
			return $gren_lang$node$Init$await$($gren_lang$node$ChildProcess$initialize, function(procPerm) {
					return $gren_lang$node$Init$await$($gren_lang$node$Terminal$initialize, function(termConfig) {
							var termWidth = function () {
								if (termConfig.$ === 'Just') {
									var t = termConfig.a;
									return t.columns;
								} else {
									return 80;
								}
							}();
							var parsedArgs = $joeybright$gren_args$Args$parse($gren_lang$core$Array$dropFirst$(2, env.args));
							var commandTask = function () {
								var _v0 = $gren_lang$core$Array$popFirst(parsedArgs.args);
								_v0$3:
								while (true) {
									if (_v0.$ === 'Just') {
										switch (_v0.a.first) {
											case 'init':
												var _v1 = _v0.a;
												var args = _v1.rest;
												return $blaix$prettynice$CLI$Command$Init$run({ args: args, env: env, fsPerm: fsPerm, localPackage: $gren_lang$core$Maybe$Nothing, options: parsedArgs.options, procPerm: procPerm });
											case 'init-local':
												if (_v0.a.rest.length === 2) {
													var _v2 = _v0.a;
													var _v3 = _v2.rest;
													var localPackage = _v3[0];
													var targetDir = _v3[1];
													return $blaix$prettynice$CLI$Command$Init$run({ args: [ targetDir ], env: env, fsPerm: fsPerm, localPackage: $gren_lang$core$Maybe$Just(localPackage), options: parsedArgs.options, procPerm: procPerm });
												} else {
													break _v0$3;
												}
											case 'build':
												var _v4 = _v0.a;
												var args = _v4.rest;
												return $blaix$prettynice$CLI$Command$Build$run({ args: args, env: env, fsPerm: fsPerm, options: parsedArgs.options, procPerm: procPerm });
											default:
												break _v0$3;
										}
									} else {
										break _v0$3;
									}
								}
								return $gren_lang$core$Task$succeed($blaix$prettynice$CLI$viewUsage);
							}();
							return $gren_lang$node$Node$startProgram({ command: $gren_lang$core$Task$attempt$($blaix$prettynice$CLI$RanCommand, commandTask), model: { env: env, termWidth: termWidth } });
						});
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
var $blaix$gren_tui$SingleLine$empty = $blaix$gren_tui$SingleLine$SingleLine('');
var $gren_lang$core$Array$maximum = function(array) {
	var _v0 = $gren_lang$core$Array$first(array);
	if (_v0.$ === 'Nothing') {
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
			var extraRows = $gren_lang$core$Array$repeat$(diff, [ { attrs: parentAttrs, content: $blaix$gren_tui$SingleLine$empty } ]);
			return _Utils_ap(g, extraRows);
		}, allGrids);
};
var $blaix$gren_tui$UI$normalizeHeight = F2($blaix$gren_tui$UI$normalizeHeight$);
var $blaix$gren_tui$UI$emptyCell = { attrs: [  ], content: $blaix$gren_tui$SingleLine$empty };
var $blaix$gren_array2d$Array2d$map$ = function(fn, array2d) {
	return A2($gren_lang$core$Array$map, function(row) {
			return A2($gren_lang$core$Array$map, fn, row);
		}, array2d);
};
var $blaix$gren_array2d$Array2d$map = F2($blaix$gren_array2d$Array2d$map$);
var $blaix$gren_tui$SingleLine$toString = function(_v0) {
	var string = _v0.a;
	return string;
};


// CREATE

var _Regex_never = /.^/;

var _Regex_fromStringWith = F2(function (options, string) {
  if (string.trim().length === 0) {
    return $gren_lang$core$Maybe$Nothing;
  }

  var flags = "g";
  if (options.multiline) {
    flags += "m";
  }
  if (options.caseInsensitive) {
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
      match: result[0],
      index: result.index,
      number: number,
      submatches: subs,
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
      match: match,
      index: arguments[arguments.length - 2],
      number: count,
      submatches: submatches,
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
	return A2($gren_lang$core$String$Regex$fromStringWith, { caseInsensitive: false, multiline: false }, string);
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
								return $.content;
							}, grid))))));
};
var $gren_lang$core$String$repeat = _String_repeat;
var $blaix$gren_tui$SingleLine$padRight$ = function(desiredWidth, _v0) {
	var string = _v0.a;
	var padCount = desiredWidth - $blaix$gren_ansi$Ansi$width(string);
	var padded = _Utils_ap(string, A2($gren_lang$core$String$repeat, padCount, ' '));
	return $blaix$gren_tui$SingleLine$SingleLine(padded);
};
var $blaix$gren_tui$SingleLine$padRight = F2($blaix$gren_tui$SingleLine$padRight$);
var $blaix$gren_tui$SingleLine$width = function(_v0) {
	var string = _v0.a;
	return $blaix$gren_ansi$Ansi$width(string);
};
var $blaix$gren_tui$UI$normalizeWidth = function(grid) {
	var targetWidth = $blaix$gren_tui$UI$gridWidth(grid);
	return A2($gren_lang$core$Array$map, function(thisRow) {
			var thisRowWidth = A3($gren_lang$core$Array$foldl, $gren_lang$core$Basics$add, 0, A2($gren_lang$core$Array$map, $blaix$gren_tui$SingleLine$width, A2($gren_lang$core$Array$map, function ($) {
							return $.content;
						}, thisRow)));
			var popped = $gren_lang$core$Maybe$withDefault$({ initial: [  ], last: $blaix$gren_tui$UI$emptyCell }, $gren_lang$core$Array$popLast(thisRow));
			var lastCellContent = popped.last.content;
			var diff = targetWidth - thisRowWidth;
			var lastCellTargetWidth = $blaix$gren_tui$SingleLine$width(lastCellContent) + diff;
			var newLastCellContent = $blaix$gren_tui$SingleLine$padRight$(lastCellTargetWidth, lastCellContent);
			var paddedCell = _Utils_update(popped.last, { content: newLastCellContent });
			return $gren_lang$core$Array$pushLast$(paddedCell, popped.initial);
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
		case 'Row':
			var _v1 = element.a;
			var attrs = _v1.attrs;
			var children = _v1.children;
			return $blaix$gren_tui$UI$joinHorizontal$(attrs, A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$elementToGrid, children));
		case 'Col':
			var children = element.a.children;
			return $blaix$gren_tui$UI$joinVertical(A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$elementToGrid, children));
		default:
			var _v2 = element.a;
			var attrs = _v2.attrs;
			var content = _v2.content;
			return [ [ { attrs: attrs, content: content } ] ];
	}
};
var $blaix$gren_ansi$Ansi$NoColor = { $: 'NoColor' };
var $blaix$gren_ansi$Ansi$bgColorCode = function(color_) {
	switch (color_.$) {
		case 'NoColor':
			return '49';
		case 'Black':
			return '40';
		case 'Red':
			return '41';
		case 'Green':
			return '42';
		case 'Yellow':
			return '43';
		case 'Blue':
			return '44';
		case 'Magenta':
			return '45';
		case 'Cyan':
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
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setBgColor(color), string, $blaix$gren_ansi$Ansi$setBgColor($blaix$gren_ansi$Ansi$NoColor) ]);
};
var $blaix$gren_ansi$Ansi$wrapBgColor = F2($blaix$gren_ansi$Ansi$wrapBgColor$);
var $blaix$gren_ansi$Ansi$colorCode = function(color_) {
	switch (color_.$) {
		case 'NoColor':
			return '39';
		case 'Black':
			return '30';
		case 'Red':
			return '31';
		case 'Green':
			return '32';
		case 'Yellow':
			return '33';
		case 'Blue':
			return '34';
		case 'Magenta':
			return '35';
		case 'Cyan':
			return '36';
		default:
			return '37';
	}
};
var $blaix$gren_ansi$Ansi$setColor = function(color) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$prefix, $blaix$gren_ansi$Ansi$colorCode(color), 'm' ]);
};
var $blaix$gren_ansi$Ansi$wrapColor$ = function(color, string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setColor(color), string, $blaix$gren_ansi$Ansi$setColor($blaix$gren_ansi$Ansi$NoColor) ]);
};
var $blaix$gren_ansi$Ansi$wrapColor = F2($blaix$gren_ansi$Ansi$wrapColor$);
var $blaix$gren_ansi$Ansi$NormalWeight = { $: 'NormalWeight' };
var $blaix$gren_ansi$Ansi$fontWeightCode = function(weight) {
	switch (weight.$) {
		case 'NormalWeight':
			return '22';
		case 'Bold':
			return '1';
		default:
			return '2';
	}
};
var $blaix$gren_ansi$Ansi$setFontWeight = function(weight) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$prefix, $blaix$gren_ansi$Ansi$fontWeightCode(weight), 'm' ]);
};
var $blaix$gren_ansi$Ansi$wrapFontWeight$ = function(weight, string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setFontWeight(weight), string, $blaix$gren_ansi$Ansi$setFontWeight($blaix$gren_ansi$Ansi$NormalWeight) ]);
};
var $blaix$gren_ansi$Ansi$wrapFontWeight = F2($blaix$gren_ansi$Ansi$wrapFontWeight$);
var $blaix$gren_ansi$Ansi$setItalic = $blaix$gren_ansi$Ansi$prefix + '3m';
var $blaix$gren_ansi$Ansi$unsetItalic = $blaix$gren_ansi$Ansi$prefix + '23m';
var $blaix$gren_ansi$Ansi$wrapItalic = function(string) {
	return A2($gren_lang$core$String$join, '', [ $blaix$gren_ansi$Ansi$setItalic, string, $blaix$gren_ansi$Ansi$unsetItalic ]);
};
var $blaix$gren_tui$UI$Attribute$apply$ = function(attr, string) {
	switch (attr.$) {
		case 'Color':
			var c = attr.a;
			return $blaix$gren_ansi$Ansi$wrapColor$(c, string);
		case 'BgColor':
			var c = attr.a;
			return $blaix$gren_ansi$Ansi$wrapBgColor$(c, string);
		case 'FontWeight':
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
	return $blaix$gren_tui$UI$Attribute$applyAll$(cell.attrs, $blaix$gren_tui$SingleLine$toString(cell.content));
};
var $blaix$gren_tui$UI$gridToString = function(grid) {
	return A2($gren_lang$core$String$join, '\n', A2($gren_lang$core$Array$map, $gren_lang$core$String$join(''), A2($gren_lang$core$Array$map, $gren_lang$core$Array$map($blaix$gren_tui$UI$cellToString), grid)));
};
var $blaix$gren_tui$UI$mergeAttributes$ = function(parentAttrs, element) {
	switch (element.$) {
		case 'Row':
			var _v1 = element.a;
			var attrs = _v1.attrs;
			var children = _v1.children;
			return $blaix$gren_tui$UI$Row({ attrs: _Utils_ap(parentAttrs, attrs), children: A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$mergeAttributes(_Utils_ap(parentAttrs, attrs)), children) });
		case 'Col':
			var _v2 = element.a;
			var attrs = _v2.attrs;
			var children = _v2.children;
			return $blaix$gren_tui$UI$Col({ attrs: _Utils_ap(parentAttrs, attrs), children: A2($gren_lang$core$Array$map, $blaix$gren_tui$UI$mergeAttributes(_Utils_ap(parentAttrs, attrs)), children) });
		default:
			var _v3 = element.a;
			var attrs = _v3.attrs;
			var content = _v3.content;
			return $blaix$gren_tui$UI$Text({ attrs: _Utils_ap(parentAttrs, attrs), content: content });
	}
};
var $blaix$gren_tui$UI$mergeAttributes = F2($blaix$gren_tui$UI$mergeAttributes$);
var $blaix$gren_tui$SingleLine$dropRight$ = function(n, _v0) {
	var string = _v0.a;
	return $blaix$gren_tui$SingleLine$SingleLine($gren_lang$core$String$dropLast$(n, string));
};
var $blaix$gren_tui$SingleLine$dropRight = F2($blaix$gren_tui$SingleLine$dropRight$);
var $blaix$gren_tui$UI$trimGridRow$ = function(maxWidth, thisRow) {
	trimGridRow:
	while (true) {
		var width = $blaix$gren_tui$UI$gridWidth([ thisRow ]);
		var popped = $gren_lang$core$Array$popLast(thisRow);
		var diff = width - maxWidth;
		if (popped.$ === 'Nothing') {
			return thisRow;
		} else {
			var _v1 = popped.a;
			var initial = _v1.initial;
			var last = _v1.last;
			if (_Utils_cmp(diff, $blaix$gren_tui$SingleLine$width(last.content)) > -1) {
				var $temp$maxWidth = maxWidth,
				$temp$thisRow = initial;
				maxWidth = $temp$maxWidth;
				thisRow = $temp$thisRow;
				continue trimGridRow;
			} else {
				return $gren_lang$core$Array$pushLast$(_Utils_update(last, { content: $blaix$gren_tui$SingleLine$dropRight$(diff, last.content) }), initial);
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
	if (msg.a.$ === 'Ok') {
		var message = msg.a.a;
		return { command: $gren_lang$core$Task$execute($gren_lang$core$Stream$Log$line$(model.env.stdout, $blaix$gren_tui$UI$toString$(model.termWidth, message))), model: model };
	} else {
		var error = msg.a.a;
		return { command: $gren_lang$core$Task$executeCmd($gren_lang$core$Task$map$(function(_v1) {
					return $gren_lang$node$Node$exitWithCode(error.exitCode);
				}, $gren_lang$core$Stream$Log$line$(model.env.stderr, $blaix$gren_tui$UI$toString$(model.termWidth, error.message)))), model: model };
	}
};
var $blaix$prettynice$CLI$update = F2($blaix$prettynice$CLI$update$);
var $blaix$prettynice$CLI$main = $gren_lang$node$Node$defineProgram({ init: $blaix$prettynice$CLI$init, subscriptions: $blaix$prettynice$CLI$subscriptions, update: $blaix$prettynice$CLI$update });
_Platform_export({'CLI':{'init':$blaix$prettynice$CLI$main($gren_lang$core$Json$Decode$succeed({  }))}});}(this.module ? this.module.exports : this));