var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __commonJS = (cb, mod) => function __require() {
  try {
    return mod || (0, cb[__getOwnPropNames(cb)[0]])((mod = { exports: {} }).exports, mod), mod.exports;
  } catch (e) {
    throw mod = 0, e;
  }
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));

// node_modules/eventemitter3/index.js
var require_eventemitter3 = __commonJS({
  "node_modules/eventemitter3/index.js"(exports, module) {
    "use strict";
    var has = Object.prototype.hasOwnProperty;
    var prefix = "~";
    function Events() {
    }
    if (Object.create) {
      Events.prototype = /* @__PURE__ */ Object.create(null);
      if (!new Events().__proto__) prefix = false;
    }
    function EE(fn, context, once) {
      this.fn = fn;
      this.context = context;
      this.once = once || false;
    }
    function addListener(emitter, event, fn, context, once) {
      if (typeof fn !== "function") {
        throw new TypeError("The listener must be a function");
      }
      var listener = new EE(fn, context || emitter, once), evt = prefix ? prefix + event : event;
      if (!emitter._events[evt]) emitter._events[evt] = listener, emitter._eventsCount++;
      else if (!emitter._events[evt].fn) emitter._events[evt].push(listener);
      else emitter._events[evt] = [emitter._events[evt], listener];
      return emitter;
    }
    function clearEvent(emitter, evt) {
      if (--emitter._eventsCount === 0) emitter._events = new Events();
      else delete emitter._events[evt];
    }
    function EventEmitter2() {
      this._events = new Events();
      this._eventsCount = 0;
    }
    EventEmitter2.prototype.eventNames = function eventNames() {
      var names = [], events, name;
      if (this._eventsCount === 0) return names;
      for (name in events = this._events) {
        if (has.call(events, name)) names.push(prefix ? name.slice(1) : name);
      }
      if (Object.getOwnPropertySymbols) {
        return names.concat(Object.getOwnPropertySymbols(events));
      }
      return names;
    };
    EventEmitter2.prototype.listeners = function listeners(event) {
      var evt = prefix ? prefix + event : event, handlers = this._events[evt];
      if (!handlers) return [];
      if (handlers.fn) return [handlers.fn];
      for (var i = 0, l = handlers.length, ee = new Array(l); i < l; i++) {
        ee[i] = handlers[i].fn;
      }
      return ee;
    };
    EventEmitter2.prototype.listenerCount = function listenerCount(event) {
      var evt = prefix ? prefix + event : event, listeners = this._events[evt];
      if (!listeners) return 0;
      if (listeners.fn) return 1;
      return listeners.length;
    };
    EventEmitter2.prototype.emit = function emit2(event, a1, a2, a3, a4, a5) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return false;
      var listeners = this._events[evt], len = arguments.length, args, i;
      if (listeners.fn) {
        if (listeners.once) this.removeListener(event, listeners.fn, void 0, true);
        switch (len) {
          case 1:
            return listeners.fn.call(listeners.context), true;
          case 2:
            return listeners.fn.call(listeners.context, a1), true;
          case 3:
            return listeners.fn.call(listeners.context, a1, a2), true;
          case 4:
            return listeners.fn.call(listeners.context, a1, a2, a3), true;
          case 5:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4), true;
          case 6:
            return listeners.fn.call(listeners.context, a1, a2, a3, a4, a5), true;
        }
        for (i = 1, args = new Array(len - 1); i < len; i++) {
          args[i - 1] = arguments[i];
        }
        listeners.fn.apply(listeners.context, args);
      } else {
        var length = listeners.length, j;
        for (i = 0; i < length; i++) {
          if (listeners[i].once) this.removeListener(event, listeners[i].fn, void 0, true);
          switch (len) {
            case 1:
              listeners[i].fn.call(listeners[i].context);
              break;
            case 2:
              listeners[i].fn.call(listeners[i].context, a1);
              break;
            case 3:
              listeners[i].fn.call(listeners[i].context, a1, a2);
              break;
            case 4:
              listeners[i].fn.call(listeners[i].context, a1, a2, a3);
              break;
            default:
              if (!args) for (j = 1, args = new Array(len - 1); j < len; j++) {
                args[j - 1] = arguments[j];
              }
              listeners[i].fn.apply(listeners[i].context, args);
          }
        }
      }
      return true;
    };
    EventEmitter2.prototype.on = function on(event, fn, context) {
      return addListener(this, event, fn, context, false);
    };
    EventEmitter2.prototype.once = function once(event, fn, context) {
      return addListener(this, event, fn, context, true);
    };
    EventEmitter2.prototype.removeListener = function removeListener(event, fn, context, once) {
      var evt = prefix ? prefix + event : event;
      if (!this._events[evt]) return this;
      if (!fn) {
        clearEvent(this, evt);
        return this;
      }
      var listeners = this._events[evt];
      if (listeners.fn) {
        if (listeners.fn === fn && (!once || listeners.once) && (!context || listeners.context === context)) {
          clearEvent(this, evt);
        }
      } else {
        for (var i = 0, events = [], length = listeners.length; i < length; i++) {
          if (listeners[i].fn !== fn || once && !listeners[i].once || context && listeners[i].context !== context) {
            events.push(listeners[i]);
          }
        }
        if (events.length) this._events[evt] = events.length === 1 ? events[0] : events;
        else clearEvent(this, evt);
      }
      return this;
    };
    EventEmitter2.prototype.removeAllListeners = function removeAllListeners(event) {
      var evt;
      if (event) {
        evt = prefix ? prefix + event : event;
        if (this._events[evt]) clearEvent(this, evt);
      } else {
        this._events = new Events();
        this._eventsCount = 0;
      }
      return this;
    };
    EventEmitter2.prototype.off = EventEmitter2.prototype.removeListener;
    EventEmitter2.prototype.addListener = EventEmitter2.prototype.on;
    EventEmitter2.prefixed = prefix;
    EventEmitter2.EventEmitter = EventEmitter2;
    if ("undefined" !== typeof module) {
      module.exports = EventEmitter2;
    }
  }
});

// node_modules/xstate/dist/xstate-dev.esm.js
function getGlobal() {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
}
function getDevTools() {
  const w = getGlobal();
  if (w.__xstate__) {
    return w.__xstate__;
  }
  return void 0;
}
var devToolsAdapter = (service) => {
  if (typeof window === "undefined") {
    return;
  }
  const devTools = getDevTools();
  if (devTools) {
    devTools.register(service);
  }
};

// node_modules/xstate/dist/raise-97446fd4.esm.js
var Mailbox = class {
  constructor(_process) {
    this._process = _process;
    this._active = false;
    this._current = null;
    this._last = null;
  }
  start() {
    this._active = true;
    this.flush();
  }
  clear() {
    if (this._current) {
      this._current.next = null;
      this._last = this._current;
    }
  }
  enqueue(event) {
    const enqueued = {
      value: event,
      next: null
    };
    if (this._current) {
      this._last.next = enqueued;
      this._last = enqueued;
      return;
    }
    this._current = enqueued;
    this._last = enqueued;
    if (this._active) {
      this.flush();
    }
  }
  flush() {
    while (this._current) {
      const consumed = this._current;
      this._process(consumed.value);
      this._current = consumed.next;
    }
    this._last = null;
  }
};
var STATE_DELIMITER = ".";
var TARGETLESS_KEY = "";
var NULL_EVENT = "";
var STATE_IDENTIFIER = "#";
var WILDCARD = "*";
var XSTATE_INIT = "xstate.init";
var XSTATE_ERROR = "xstate.error";
var XSTATE_STOP = "xstate.stop";
function createAfterEvent(delayRef, id) {
  return {
    type: `xstate.after.${delayRef}.${id}`
  };
}
function createDoneStateEvent(id, output) {
  return {
    type: `xstate.done.state.${id}`,
    output
  };
}
function createDoneActorEvent(invokeId, output) {
  return {
    type: `xstate.done.actor.${invokeId}`,
    output,
    actorId: invokeId
  };
}
function createErrorActorEvent(id, error) {
  return {
    type: `xstate.error.actor.${id}`,
    error,
    actorId: id
  };
}
function createInitEvent(input) {
  return {
    type: XSTATE_INIT,
    input
  };
}
function reportUnhandledError(err) {
  setTimeout(() => {
    throw err;
  });
}
var symbolObservable = (() => typeof Symbol === "function" && Symbol.observable || "@@observable")();
function matchesState(parentStateId, childStateId) {
  const parentStateValue = toStateValue(parentStateId);
  const childStateValue = toStateValue(childStateId);
  if (typeof childStateValue === "string") {
    if (typeof parentStateValue === "string") {
      return childStateValue === parentStateValue;
    }
    return false;
  }
  if (typeof parentStateValue === "string") {
    return parentStateValue in childStateValue;
  }
  return Object.keys(parentStateValue).every((key) => {
    if (!(key in childStateValue)) {
      return false;
    }
    return matchesState(parentStateValue[key], childStateValue[key]);
  });
}
function toStatePath(stateId) {
  if (isArray(stateId)) {
    return stateId;
  }
  const result = [];
  let segment = "";
  for (let i = 0; i < stateId.length; i++) {
    const char = stateId.charCodeAt(i);
    switch (char) {
      // \
      case 92:
        segment += stateId[i + 1];
        i++;
        continue;
      // .
      case 46:
        result.push(segment);
        segment = "";
        continue;
    }
    segment += stateId[i];
  }
  result.push(segment);
  return result;
}
function toStateValue(stateValue) {
  if (isMachineSnapshot(stateValue)) {
    return stateValue.value;
  }
  if (typeof stateValue !== "string") {
    return stateValue;
  }
  const statePath = toStatePath(stateValue);
  return pathToStateValue(statePath);
}
function pathToStateValue(statePath) {
  if (statePath.length === 1) {
    return statePath[0];
  }
  const value = {};
  let marker = value;
  for (let i = 0; i < statePath.length - 1; i++) {
    if (i === statePath.length - 2) {
      marker[statePath[i]] = statePath[i + 1];
    } else {
      const previous = marker;
      marker = {};
      previous[statePath[i]] = marker;
    }
  }
  return value;
}
function mapValues(collection, iteratee) {
  const result = {};
  const collectionKeys = Object.keys(collection);
  for (let i = 0; i < collectionKeys.length; i++) {
    const key = collectionKeys[i];
    result[key] = iteratee(collection[key], key, collection, i);
  }
  return result;
}
function toArrayStrict(value) {
  if (isArray(value)) {
    return value;
  }
  return [value];
}
function toArray(value) {
  if (value === void 0) {
    return [];
  }
  return toArrayStrict(value);
}
function resolveOutput(mapper, context, event, self2) {
  if (typeof mapper === "function") {
    return mapper({
      context,
      event,
      self: self2
    });
  }
  return mapper;
}
function isArray(value) {
  return Array.isArray(value);
}
function isErrorActorEvent(event) {
  return event.type.startsWith("xstate.error.actor");
}
function toTransitionConfigArray(configLike) {
  return toArrayStrict(configLike).map((transitionLike) => {
    if (typeof transitionLike === "undefined" || typeof transitionLike === "string") {
      return {
        target: transitionLike
      };
    }
    return transitionLike;
  });
}
function normalizeTarget(target) {
  if (target === void 0 || target === TARGETLESS_KEY) {
    return void 0;
  }
  return toArray(target);
}
function toObserver(nextHandler, errorHandler, completionHandler) {
  const isObserver = typeof nextHandler === "object";
  const self2 = isObserver ? nextHandler : void 0;
  return {
    next: (isObserver ? nextHandler.next : nextHandler)?.bind(self2),
    error: (isObserver ? nextHandler.error : errorHandler)?.bind(self2),
    complete: (isObserver ? nextHandler.complete : completionHandler)?.bind(self2)
  };
}
function createInvokeId(stateNodeId, index) {
  return `${index}.${stateNodeId}`;
}
function resolveReferencedActor(machine, src) {
  const match = src.match(/^xstate\.invoke\.(\d+)\.(.*)/);
  if (!match) {
    return machine.implementations.actors[src];
  }
  const [, indexStr, nodeId] = match;
  const node = machine.getStateNodeById(nodeId);
  const invokeConfig = node.config.invoke;
  return (Array.isArray(invokeConfig) ? invokeConfig[indexStr] : invokeConfig).src;
}
function matchesEventDescriptor(eventType, descriptor) {
  if (descriptor === eventType) {
    return true;
  }
  if (descriptor === WILDCARD) {
    return true;
  }
  if (!descriptor.endsWith(".*")) {
    return false;
  }
  const partialEventTokens = descriptor.split(".");
  const eventTokens = eventType.split(".");
  for (let tokenIndex = 0; tokenIndex < partialEventTokens.length; tokenIndex++) {
    const partialEventToken = partialEventTokens[tokenIndex];
    const eventToken = eventTokens[tokenIndex];
    if (partialEventToken === "*") {
      const isLastToken = tokenIndex === partialEventTokens.length - 1;
      return isLastToken;
    }
    if (partialEventToken !== eventToken) {
      return false;
    }
  }
  return true;
}
function createScheduledEventId(actorRef, id) {
  return `${actorRef.sessionId}.${id}`;
}
var idCounter = 0;
function createSystem(rootActor, options) {
  const children = /* @__PURE__ */ new Map();
  const keyedActors = /* @__PURE__ */ new Map();
  const reverseKeyedActors = /* @__PURE__ */ new WeakMap();
  const inspectionObservers = /* @__PURE__ */ new Set();
  const timerMap = {};
  const {
    clock,
    logger
  } = options;
  const scheduler = {
    schedule: (source, target, event, delay, id = Math.random().toString(36).slice(2)) => {
      const scheduledEvent = {
        source,
        target,
        event,
        delay,
        id,
        startedAt: Date.now()
      };
      const scheduledEventId = createScheduledEventId(source, id);
      system._snapshot._scheduledEvents[scheduledEventId] = scheduledEvent;
      const timeout = clock.setTimeout(() => {
        delete timerMap[scheduledEventId];
        delete system._snapshot._scheduledEvents[scheduledEventId];
        system._relay(source, target, event);
      }, delay);
      timerMap[scheduledEventId] = timeout;
    },
    cancel: (source, id) => {
      const scheduledEventId = createScheduledEventId(source, id);
      const timeout = timerMap[scheduledEventId];
      delete timerMap[scheduledEventId];
      delete system._snapshot._scheduledEvents[scheduledEventId];
      if (timeout !== void 0) {
        clock.clearTimeout(timeout);
      }
    },
    cancelAll: (actorRef) => {
      for (const scheduledEventId in system._snapshot._scheduledEvents) {
        const scheduledEvent = system._snapshot._scheduledEvents[scheduledEventId];
        if (scheduledEvent.source === actorRef) {
          scheduler.cancel(actorRef, scheduledEvent.id);
        }
      }
    }
  };
  const sendInspectionEvent = (event) => {
    if (!inspectionObservers.size) {
      return;
    }
    const resolvedInspectionEvent = {
      ...event,
      rootId: rootActor.sessionId
    };
    inspectionObservers.forEach((observer) => observer.next?.(resolvedInspectionEvent));
  };
  const system = {
    _snapshot: {
      _scheduledEvents: (options?.snapshot && options.snapshot.scheduler) ?? {}
    },
    _bookId: () => `x:${idCounter++}`,
    _register: (sessionId, actorRef) => {
      children.set(sessionId, actorRef);
      return sessionId;
    },
    _unregister: (actorRef) => {
      children.delete(actorRef.sessionId);
      const systemId = reverseKeyedActors.get(actorRef);
      if (systemId !== void 0) {
        keyedActors.delete(systemId);
        reverseKeyedActors.delete(actorRef);
      }
    },
    get: (systemId) => {
      return keyedActors.get(systemId);
    },
    getAll: () => {
      return Object.fromEntries(keyedActors.entries());
    },
    _set: (systemId, actorRef) => {
      const existing = keyedActors.get(systemId);
      if (existing && existing !== actorRef) {
        throw new Error(`Actor with system ID '${systemId}' already exists.`);
      }
      keyedActors.set(systemId, actorRef);
      reverseKeyedActors.set(actorRef, systemId);
    },
    inspect: (observerOrFn) => {
      const observer = toObserver(observerOrFn);
      inspectionObservers.add(observer);
      return {
        unsubscribe() {
          inspectionObservers.delete(observer);
        }
      };
    },
    _sendInspectionEvent: sendInspectionEvent,
    _relay: (source, target, event) => {
      system._sendInspectionEvent({
        type: "@xstate.event",
        sourceRef: source,
        actorRef: target,
        event
      });
      target._send(event);
    },
    scheduler,
    getSnapshot: () => {
      return {
        _scheduledEvents: {
          ...system._snapshot._scheduledEvents
        }
      };
    },
    start: () => {
      const scheduledEvents = system._snapshot._scheduledEvents;
      system._snapshot._scheduledEvents = {};
      for (const scheduledId in scheduledEvents) {
        const {
          source,
          target,
          event,
          delay,
          id
        } = scheduledEvents[scheduledId];
        scheduler.schedule(source, target, event, delay, id);
      }
    },
    _clock: clock,
    _logger: logger
  };
  return system;
}
var executingCustomAction = false;
var $$ACTOR_TYPE = 1;
var ProcessingStatus = /* @__PURE__ */ (function(ProcessingStatus2) {
  ProcessingStatus2[ProcessingStatus2["NotStarted"] = 0] = "NotStarted";
  ProcessingStatus2[ProcessingStatus2["Running"] = 1] = "Running";
  ProcessingStatus2[ProcessingStatus2["Stopped"] = 2] = "Stopped";
  return ProcessingStatus2;
})({});
var defaultOptions = {
  clock: {
    setTimeout: (fn, ms) => {
      return setTimeout(fn, ms);
    },
    clearTimeout: (id) => {
      return clearTimeout(id);
    }
  },
  logger: console.log.bind(console),
  devTools: false
};
var Actor = class {
  /**
   * Creates a new actor instance for the given logic with the provided options,
   * if any.
   *
   * @param logic The logic to create an actor from
   * @param options Actor options
   */
  constructor(logic, options) {
    this.logic = logic;
    this._snapshot = void 0;
    this.clock = void 0;
    this.options = void 0;
    this.id = void 0;
    this.mailbox = new Mailbox(this._process.bind(this));
    this.observers = /* @__PURE__ */ new Set();
    this.eventListeners = /* @__PURE__ */ new Map();
    this.logger = void 0;
    this._processingStatus = ProcessingStatus.NotStarted;
    this._parent = void 0;
    this._syncSnapshot = void 0;
    this.ref = void 0;
    this._actorScope = void 0;
    this.systemId = void 0;
    this.sessionId = void 0;
    this.system = void 0;
    this._doneEvent = void 0;
    this.src = void 0;
    this._deferred = [];
    const resolvedOptions = {
      ...defaultOptions,
      ...options
    };
    const {
      clock,
      logger,
      parent,
      syncSnapshot,
      id,
      systemId,
      inspect
    } = resolvedOptions;
    this.system = parent ? parent.system : createSystem(this, {
      clock,
      logger
    });
    if (inspect && !parent) {
      this.system.inspect(toObserver(inspect));
    }
    this.sessionId = this.system._bookId();
    this.id = id ?? this.sessionId;
    this.logger = options?.logger ?? this.system._logger;
    this.clock = options?.clock ?? this.system._clock;
    this._parent = parent;
    this._syncSnapshot = syncSnapshot;
    this.options = resolvedOptions;
    this.src = resolvedOptions.src ?? logic;
    this.ref = this;
    this._actorScope = {
      self: this,
      id: this.id,
      sessionId: this.sessionId,
      logger: this.logger,
      defer: (fn) => {
        this._deferred.push(fn);
      },
      system: this.system,
      stopChild: (child) => {
        if (child._parent !== this) {
          throw new Error(`Cannot stop child actor ${child.id} of ${this.id} because it is not a child`);
        }
        child._stop();
      },
      emit: (emittedEvent) => {
        const listeners = this.eventListeners.get(emittedEvent.type);
        const wildcardListener = this.eventListeners.get("*");
        if (!listeners && !wildcardListener) {
          return;
        }
        const allListeners = [...listeners ? listeners.values() : [], ...wildcardListener ? wildcardListener.values() : []];
        for (const handler of allListeners) {
          try {
            handler(emittedEvent);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
      },
      actionExecutor: (action) => {
        const exec = () => {
          this._actorScope.system._sendInspectionEvent({
            type: "@xstate.action",
            actorRef: this,
            action: {
              type: action.type,
              params: action.params
            }
          });
          if (!action.exec) {
            return;
          }
          const saveExecutingCustomAction = executingCustomAction;
          try {
            executingCustomAction = true;
            action.exec(action.info, action.params);
          } finally {
            executingCustomAction = saveExecutingCustomAction;
          }
        };
        if (this._processingStatus === ProcessingStatus.Running) {
          exec();
        } else {
          this._deferred.push(exec);
        }
      }
    };
    this.send = this.send.bind(this);
    this.system._sendInspectionEvent({
      type: "@xstate.actor",
      actorRef: this
    });
    if (systemId) {
      this.systemId = systemId;
      this.system._set(systemId, this);
    }
    this._initState(options?.snapshot ?? options?.state);
    if (systemId && this._snapshot.status !== "active") {
      this.system._unregister(this);
    }
  }
  _initState(persistedState) {
    try {
      this._snapshot = persistedState ? this.logic.restoreSnapshot ? this.logic.restoreSnapshot(persistedState, this._actorScope) : persistedState : this.logic.getInitialSnapshot(this._actorScope, this.options?.input);
    } catch (err) {
      this._snapshot = {
        status: "error",
        output: void 0,
        error: err
      };
    }
  }
  update(snapshot, event) {
    this._snapshot = snapshot;
    let deferredFn;
    while (deferredFn = this._deferred.shift()) {
      try {
        deferredFn();
      } catch (err) {
        this._deferred.length = 0;
        this._snapshot = {
          ...snapshot,
          status: "error",
          error: err
        };
      }
    }
    switch (this._snapshot.status) {
      case "active":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        break;
      case "done":
        for (const observer of this.observers) {
          try {
            observer.next?.(snapshot);
          } catch (err) {
            reportUnhandledError(err);
          }
        }
        this._stopProcedure();
        this._complete();
        this._doneEvent = createDoneActorEvent(this.id, this._snapshot.output);
        if (this._parent) {
          this.system._relay(this, this._parent, this._doneEvent);
        }
        break;
      case "error":
        this._error(this._snapshot.error);
        break;
    }
    this.system._sendInspectionEvent({
      type: "@xstate.snapshot",
      actorRef: this,
      event,
      snapshot
    });
  }
  /**
   * Subscribe an observer to an actor’s snapshot values.
   *
   * @remarks
   * The observer will receive the actor’s snapshot value when it is emitted.
   * The observer can be:
   *
   * - A plain function that receives the latest snapshot, or
   * - An observer object whose `.next(snapshot)` method receives the latest
   *   snapshot
   *
   * @example
   *
   * ```ts
   * // Observer as a plain function
   * const subscription = actor.subscribe((snapshot) => {
   *   console.log(snapshot);
   * });
   * ```
   *
   * @example
   *
   * ```ts
   * // Observer as an object
   * const subscription = actor.subscribe({
   *   next(snapshot) {
   *     console.log(snapshot);
   *   },
   *   error(err) {
   *     // ...
   *   },
   *   complete() {
   *     // ...
   *   }
   * });
   * ```
   *
   * The return value of `actor.subscribe(observer)` is a subscription object
   * that has an `.unsubscribe()` method. You can call
   * `subscription.unsubscribe()` to unsubscribe the observer:
   *
   * @example
   *
   * ```ts
   * const subscription = actor.subscribe((snapshot) => {
   *   // ...
   * });
   *
   * // Unsubscribe the observer
   * subscription.unsubscribe();
   * ```
   *
   * When the actor is stopped, all of its observers will automatically be
   * unsubscribed.
   *
   * @param observer - Either a plain function that receives the latest
   *   snapshot, or an observer object whose `.next(snapshot)` method receives
   *   the latest snapshot
   */
  subscribe(nextListenerOrObserver, errorListener, completeListener) {
    const observer = toObserver(nextListenerOrObserver, errorListener, completeListener);
    if (this._processingStatus !== ProcessingStatus.Stopped) {
      this.observers.add(observer);
    } else {
      switch (this._snapshot.status) {
        case "done":
          try {
            observer.complete?.();
          } catch (err) {
            reportUnhandledError(err);
          }
          break;
        case "error": {
          const err = this._snapshot.error;
          if (!observer.error) {
            reportUnhandledError(err);
          } else {
            try {
              observer.error(err);
            } catch (err2) {
              reportUnhandledError(err2);
            }
          }
          break;
        }
      }
    }
    return {
      unsubscribe: () => {
        this.observers.delete(observer);
      }
    };
  }
  on(type, handler) {
    let listeners = this.eventListeners.get(type);
    if (!listeners) {
      listeners = /* @__PURE__ */ new Set();
      this.eventListeners.set(type, listeners);
    }
    const wrappedHandler = handler.bind(void 0);
    listeners.add(wrappedHandler);
    return {
      unsubscribe: () => {
        listeners.delete(wrappedHandler);
      }
    };
  }
  select(selector, equalityFn = Object.is) {
    return {
      subscribe: (observerOrFn) => {
        const observer = toObserver(observerOrFn);
        const snapshot = this.getSnapshot();
        let previousSelected = selector(snapshot);
        return this.subscribe((snapshot2) => {
          const nextSelected = selector(snapshot2);
          if (!equalityFn(previousSelected, nextSelected)) {
            previousSelected = nextSelected;
            observer.next?.(nextSelected);
          }
        });
      },
      get: () => selector(this.getSnapshot())
    };
  }
  /** Starts the Actor from the initial state */
  start() {
    if (this._processingStatus === ProcessingStatus.Running) {
      return this;
    }
    if (this._syncSnapshot) {
      this.subscribe({
        next: (snapshot) => {
          if (snapshot.status === "active") {
            this.system._relay(this, this._parent, {
              type: `xstate.snapshot.${this.id}`,
              snapshot
            });
          }
        },
        error: () => {
        }
      });
    }
    this.system._register(this.sessionId, this);
    if (this.systemId) {
      this.system._set(this.systemId, this);
    }
    this._processingStatus = ProcessingStatus.Running;
    const initEvent = createInitEvent(this.options.input);
    this.system._sendInspectionEvent({
      type: "@xstate.event",
      sourceRef: this._parent,
      actorRef: this,
      event: initEvent
    });
    const status = this._snapshot.status;
    switch (status) {
      case "done":
        this.update(this._snapshot, initEvent);
        return this;
      case "error":
        this._error(this._snapshot.error);
        return this;
    }
    if (!this._parent) {
      this.system.start();
    }
    if (this.logic.start) {
      try {
        this.logic.start(this._snapshot, this._actorScope);
      } catch (err) {
        this._snapshot = {
          ...this._snapshot,
          status: "error",
          error: err
        };
        this._error(err);
        return this;
      }
    }
    this.update(this._snapshot, initEvent);
    if (this.options.devTools) {
      this.attachDevTools();
    }
    this.mailbox.start();
    return this;
  }
  _process(event) {
    let nextState;
    let caughtError;
    try {
      nextState = this.logic.transition(this._snapshot, event, this._actorScope);
    } catch (err) {
      caughtError = {
        err
      };
    }
    if (caughtError) {
      const {
        err
      } = caughtError;
      this._snapshot = {
        ...this._snapshot,
        status: "error",
        error: err
      };
      this._error(err);
      return;
    }
    this.update(nextState, event);
    if (event.type === XSTATE_STOP) {
      this._stopProcedure();
      this._complete();
    }
  }
  _stop() {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return this;
    }
    this.mailbox.clear();
    if (this._processingStatus === ProcessingStatus.NotStarted) {
      this._processingStatus = ProcessingStatus.Stopped;
      return this;
    }
    this.mailbox.enqueue({
      type: XSTATE_STOP
    });
    return this;
  }
  /** Stops the Actor and unsubscribe all listeners. */
  stop() {
    if (this._parent) {
      throw new Error("A non-root actor cannot be stopped directly.");
    }
    return this._stop();
  }
  _complete() {
    for (const observer of this.observers) {
      try {
        observer.complete?.();
      } catch (err) {
        reportUnhandledError(err);
      }
    }
    this.observers.clear();
    this.eventListeners.clear();
  }
  _reportError(err) {
    if (!this.observers.size) {
      if (!this._parent) {
        reportUnhandledError(err);
      }
      this.eventListeners.clear();
      return;
    }
    let reportError = false;
    for (const observer of this.observers) {
      const errorListener = observer.error;
      reportError ||= !errorListener;
      try {
        errorListener?.(err);
      } catch (err2) {
        reportUnhandledError(err2);
      }
    }
    this.observers.clear();
    this.eventListeners.clear();
    if (reportError) {
      reportUnhandledError(err);
    }
  }
  _error(err) {
    this._stopProcedure();
    this._reportError(err);
    if (this._parent) {
      this.system._relay(this, this._parent, createErrorActorEvent(this.id, err));
    }
  }
  // TODO: atm children don't belong entirely to the actor so
  // in a way - it's not even super aware of them
  // so we can't stop them from here but we really should!
  // right now, they are being stopped within the machine's transition
  // but that could throw and leave us with "orphaned" active actors
  _stopProcedure() {
    if (this._processingStatus !== ProcessingStatus.Running) {
      return this;
    }
    this.system.scheduler.cancelAll(this);
    this.mailbox.clear();
    this.mailbox = new Mailbox(this._process.bind(this));
    this._processingStatus = ProcessingStatus.Stopped;
    this.system._unregister(this);
    return this;
  }
  /** @internal */
  _send(event) {
    if (this._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    this.mailbox.enqueue(event);
  }
  /**
   * Sends an event to the running Actor to trigger a transition.
   *
   * @param event The event to send
   */
  send(event) {
    this.system._relay(void 0, this, event);
  }
  attachDevTools() {
    const {
      devTools
    } = this.options;
    if (devTools) {
      const resolvedDevToolsAdapter = typeof devTools === "function" ? devTools : devToolsAdapter;
      resolvedDevToolsAdapter(this);
    }
  }
  toJSON() {
    return {
      xstate$$type: $$ACTOR_TYPE,
      id: this.id
    };
  }
  /**
   * Obtain the internal state of the actor, which can be persisted.
   *
   * @remarks
   * The internal state can be persisted from any actor, not only machines.
   *
   * Note that the persisted state is not the same as the snapshot from
   * {@link Actor.getSnapshot}. Persisted state represents the internal state of
   * the actor, while snapshots represent the actor's last emitted value.
   *
   * Can be restored with {@link ActorOptions.state}
   * @see https://stately.ai/docs/persistence
   */
  getPersistedSnapshot(options) {
    return this.logic.getPersistedSnapshot(this._snapshot, options);
  }
  [symbolObservable]() {
    return this;
  }
  /**
   * Read an actor’s snapshot synchronously.
   *
   * @remarks
   * The snapshot represent an actor's last emitted value.
   *
   * When an actor receives an event, its internal state may change. An actor
   * may emit a snapshot when a state transition occurs.
   *
   * Note that some actors, such as callback actors generated with
   * `fromCallback`, will not emit snapshots.
   * @see {@link Actor.subscribe} to subscribe to an actor’s snapshot values.
   * @see {@link Actor.getPersistedSnapshot} to persist the internal state of an actor (which is more than just a snapshot).
   */
  getSnapshot() {
    return this._snapshot;
  }
};
function createActor(logic, ...[options]) {
  return new Actor(logic, options);
}
function resolveCancel(_, snapshot, actionArgs, actionParams, {
  sendId
}) {
  const resolvedSendId = typeof sendId === "function" ? sendId(actionArgs, actionParams) : sendId;
  return [snapshot, {
    sendId: resolvedSendId
  }, void 0];
}
function executeCancel(actorScope, params) {
  actorScope.defer(() => {
    actorScope.system.scheduler.cancel(actorScope.self, params.sendId);
  });
}
function cancel(sendId) {
  function cancel2(_args, _params) {
  }
  cancel2.type = "xstate.cancel";
  cancel2.sendId = sendId;
  cancel2.resolve = resolveCancel;
  cancel2.execute = executeCancel;
  return cancel2;
}
function resolveSpawn(actorScope, snapshot, actionArgs, _actionParams, {
  id,
  systemId,
  src,
  input,
  syncSnapshot
}) {
  const logic = typeof src === "string" ? resolveReferencedActor(snapshot.machine, src) : src;
  const resolvedId = typeof id === "function" ? id(actionArgs) : id;
  let actorRef;
  let resolvedInput = void 0;
  if (logic) {
    resolvedInput = typeof input === "function" ? input({
      context: snapshot.context,
      event: actionArgs.event,
      self: actorScope.self
    }) : input;
    actorRef = createActor(logic, {
      id: resolvedId,
      src,
      parent: actorScope.self,
      syncSnapshot,
      systemId,
      input: resolvedInput
    });
  }
  return [cloneMachineSnapshot(snapshot, {
    children: {
      ...snapshot.children,
      [resolvedId]: actorRef
    }
  }), {
    id,
    systemId,
    actorRef,
    src,
    input: resolvedInput
  }, void 0];
}
function executeSpawn(actorScope, {
  actorRef
}) {
  if (!actorRef) {
    return;
  }
  actorScope.defer(() => {
    if (actorRef._processingStatus === ProcessingStatus.Stopped) {
      return;
    }
    actorRef.start();
  });
}
function spawnChild(...[src, {
  id,
  systemId,
  input,
  syncSnapshot = false
} = {}]) {
  function spawnChild2(_args, _params) {
  }
  spawnChild2.type = "xstate.spawnChild";
  spawnChild2.id = id;
  spawnChild2.systemId = systemId;
  spawnChild2.src = src;
  spawnChild2.input = input;
  spawnChild2.syncSnapshot = syncSnapshot;
  spawnChild2.resolve = resolveSpawn;
  spawnChild2.execute = executeSpawn;
  return spawnChild2;
}
function resolveStop(_, snapshot, args, actionParams, {
  actorRef
}) {
  const actorRefOrString = typeof actorRef === "function" ? actorRef(args, actionParams) : actorRef;
  const resolvedActorRef = typeof actorRefOrString === "string" ? snapshot.children[actorRefOrString] : actorRefOrString;
  let children = snapshot.children;
  if (resolvedActorRef) {
    children = {
      ...children
    };
    delete children[resolvedActorRef.id];
  }
  return [cloneMachineSnapshot(snapshot, {
    children
  }), resolvedActorRef, void 0];
}
function unregisterRecursively(actorScope, actorRef) {
  const snapshot = actorRef.getSnapshot();
  if (snapshot && "children" in snapshot) {
    for (const child of Object.values(snapshot.children)) {
      unregisterRecursively(actorScope, child);
    }
  }
  actorScope.system._unregister(actorRef);
}
function executeStop(actorScope, actorRef) {
  if (!actorRef) {
    return;
  }
  unregisterRecursively(actorScope, actorRef);
  if (actorRef._processingStatus !== ProcessingStatus.Running) {
    actorScope.stopChild(actorRef);
    return;
  }
  actorScope.defer(() => {
    actorScope.stopChild(actorRef);
  });
}
function stopChild(actorRef) {
  function stop2(_args, _params) {
  }
  stop2.type = "xstate.stopChild";
  stop2.actorRef = actorRef;
  stop2.resolve = resolveStop;
  stop2.execute = executeStop;
  return stop2;
}
function checkAnd(snapshot, {
  context,
  event
}, {
  guards
}) {
  return guards.every((guard) => evaluateGuard(guard, context, event, snapshot));
}
function and(guards) {
  function and2(_args, _params) {
    return false;
  }
  and2.check = checkAnd;
  and2.guards = guards;
  return and2;
}
function evaluateGuard(guard, context, event, snapshot) {
  const {
    machine
  } = snapshot;
  const isInline = typeof guard === "function";
  const resolved = isInline ? guard : machine.implementations.guards[typeof guard === "string" ? guard : guard.type];
  if (!isInline && !resolved) {
    throw new Error(`Guard '${typeof guard === "string" ? guard : guard.type}' is not implemented.'.`);
  }
  if (typeof resolved !== "function") {
    return evaluateGuard(resolved, context, event, snapshot);
  }
  const guardArgs = {
    context,
    event
  };
  const guardParams = isInline || typeof guard === "string" ? void 0 : "params" in guard ? typeof guard.params === "function" ? guard.params({
    context,
    event
  }) : guard.params : void 0;
  if (!("check" in resolved)) {
    return resolved(guardArgs, guardParams);
  }
  const builtinGuard = resolved;
  return builtinGuard.check(
    snapshot,
    guardArgs,
    resolved
    // this holds all params
  );
}
function isAtomicStateNode(stateNode) {
  return stateNode.type === "atomic" || stateNode.type === "final";
}
function getChildren(stateNode) {
  return Object.values(stateNode.states).filter((sn) => sn.type !== "history");
}
function getProperAncestors(stateNode, toStateNode) {
  const ancestors = [];
  if (toStateNode === stateNode) {
    return ancestors;
  }
  let m = stateNode.parent;
  while (m && m !== toStateNode) {
    ancestors.push(m);
    m = m.parent;
  }
  return ancestors;
}
function getAllStateNodes(stateNodes) {
  const nodeSet = new Set(stateNodes);
  const adjList = getAdjList(nodeSet);
  for (const s of nodeSet) {
    if (s.type === "compound" && (!adjList.get(s) || !adjList.get(s).length)) {
      getInitialStateNodesWithTheirAncestors(s).forEach((sn) => nodeSet.add(sn));
    } else {
      if (s.type === "parallel") {
        for (const child of getChildren(s)) {
          if (child.type === "history") {
            continue;
          }
          if (!nodeSet.has(child)) {
            const initialStates = getInitialStateNodesWithTheirAncestors(child);
            for (const initialStateNode of initialStates) {
              nodeSet.add(initialStateNode);
            }
          }
        }
      }
    }
  }
  for (const s of nodeSet) {
    let m = s.parent;
    while (m) {
      nodeSet.add(m);
      m = m.parent;
    }
  }
  return nodeSet;
}
function getValueFromAdj(baseNode, adjList) {
  const childStateNodes = adjList.get(baseNode);
  if (!childStateNodes) {
    return {};
  }
  if (baseNode.type === "compound") {
    const childStateNode = childStateNodes[0];
    if (childStateNode) {
      if (isAtomicStateNode(childStateNode)) {
        return childStateNode.key;
      }
    } else {
      return {};
    }
  }
  const stateValue = {};
  for (const childStateNode of childStateNodes) {
    stateValue[childStateNode.key] = getValueFromAdj(childStateNode, adjList);
  }
  return stateValue;
}
function getAdjList(stateNodes) {
  const adjList = /* @__PURE__ */ new Map();
  for (const s of stateNodes) {
    if (!adjList.has(s)) {
      adjList.set(s, []);
    }
    if (s.parent) {
      if (!adjList.has(s.parent)) {
        adjList.set(s.parent, []);
      }
      adjList.get(s.parent).push(s);
    }
  }
  return adjList;
}
function getStateValue(rootNode, stateNodes) {
  const config = getAllStateNodes(stateNodes);
  return getValueFromAdj(rootNode, getAdjList(config));
}
function isInFinalState(stateNodeSet, stateNode) {
  if (stateNode.type === "compound") {
    return getChildren(stateNode).some((s) => s.type === "final" && stateNodeSet.has(s));
  }
  if (stateNode.type === "parallel") {
    return getChildren(stateNode).every((sn) => isInFinalState(stateNodeSet, sn));
  }
  return stateNode.type === "final";
}
var isStateId = (str) => str[0] === STATE_IDENTIFIER;
function getCandidates(stateNode, receivedEventType) {
  const exactMatch = stateNode.transitions.get(receivedEventType);
  const wildcardCandidates = [...stateNode.transitions.keys()].filter((eventDescriptor) => eventDescriptor !== receivedEventType && matchesEventDescriptor(receivedEventType, eventDescriptor)).sort((a, b) => b.length - a.length).flatMap((key) => stateNode.transitions.get(key));
  return exactMatch ? [...exactMatch, ...wildcardCandidates] : wildcardCandidates;
}
function getDelayedTransitions(stateNode) {
  const afterConfig = stateNode.config.after;
  if (!afterConfig) {
    return [];
  }
  const mutateEntryExit = (delay) => {
    const afterEvent = createAfterEvent(delay, stateNode.id);
    const eventType = afterEvent.type;
    stateNode.entry.push(raise(afterEvent, {
      id: eventType,
      delay
    }));
    stateNode.exit.push(cancel(eventType));
    return eventType;
  };
  const delayedTransitions = Object.keys(afterConfig).flatMap((delay) => {
    const configTransition = afterConfig[delay];
    const resolvedTransition = typeof configTransition === "string" ? {
      target: configTransition
    } : configTransition;
    const resolvedDelay = Number.isNaN(+delay) ? delay : +delay;
    const eventType = mutateEntryExit(resolvedDelay);
    return toArray(resolvedTransition).map((transition) => ({
      ...transition,
      event: eventType,
      delay: resolvedDelay
    }));
  });
  return delayedTransitions.map((delayedTransition) => {
    const {
      delay
    } = delayedTransition;
    return {
      ...formatTransition(stateNode, delayedTransition.event, delayedTransition),
      delay
    };
  });
}
function formatTransition(stateNode, descriptor, transitionConfig) {
  const normalizedTarget = normalizeTarget(transitionConfig.target);
  const reenter = transitionConfig.reenter ?? false;
  const target = resolveTarget(stateNode, normalizedTarget);
  const transition = {
    ...transitionConfig,
    actions: toArray(transitionConfig.actions),
    guard: transitionConfig.guard,
    target,
    source: stateNode,
    reenter,
    eventType: descriptor,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: target ? target.map((t) => `#${t.id}`) : void 0
    })
  };
  return transition;
}
function formatTransitions(stateNode) {
  const transitions = /* @__PURE__ */ new Map();
  if (stateNode.config.on) {
    for (const descriptor of Object.keys(stateNode.config.on)) {
      if (descriptor === NULL_EVENT) {
        throw new Error('Null events ("") cannot be specified as a transition key. Use `always: { ... }` instead.');
      }
      const transitionsConfig = stateNode.config.on[descriptor];
      transitions.set(descriptor, toTransitionConfigArray(transitionsConfig).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  if (stateNode.config.onDone) {
    const descriptor = `xstate.done.state.${stateNode.id}`;
    transitions.set(descriptor, toTransitionConfigArray(stateNode.config.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
  }
  for (const invokeDef of stateNode.invoke) {
    if (invokeDef.onDone) {
      const descriptor = `xstate.done.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onDone).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onError) {
      const descriptor = `xstate.error.actor.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onError).map((t) => formatTransition(stateNode, descriptor, t)));
    }
    if (invokeDef.onSnapshot) {
      const descriptor = `xstate.snapshot.${invokeDef.id}`;
      transitions.set(descriptor, toTransitionConfigArray(invokeDef.onSnapshot).map((t) => formatTransition(stateNode, descriptor, t)));
    }
  }
  for (const delayedTransition of stateNode.after) {
    let existing = transitions.get(delayedTransition.eventType);
    if (!existing) {
      existing = [];
      transitions.set(delayedTransition.eventType, existing);
    }
    existing.push(delayedTransition);
  }
  return transitions;
}
function formatRouteTransitions(rootStateNode) {
  const routeTransitions = [];
  const collectRoutes = (states) => {
    Object.values(states).forEach((sn) => {
      if (sn.config.route && sn.config.id) {
        const routeId = sn.config.id;
        const userGuard = sn.config.route.guard;
        const routeMatches = ({
          event
        }) => event.to === `#${routeId}`;
        const transition = {
          ...sn.config.route,
          guard: userGuard ? and([routeMatches, userGuard]) : routeMatches,
          target: `#${routeId}`
        };
        routeTransitions.push(formatTransition(rootStateNode, "xstate.route", transition));
      }
      if (sn.states) {
        collectRoutes(sn.states);
      }
    });
  };
  collectRoutes(rootStateNode.states);
  if (routeTransitions.length > 0) {
    rootStateNode.transitions.set("xstate.route", routeTransitions);
  }
}
function formatInitialTransition(stateNode, _target) {
  const resolvedTarget = typeof _target === "string" ? stateNode.states[_target] : _target ? stateNode.states[_target.target] : void 0;
  if (!resolvedTarget && _target) {
    throw new Error(
      // oxlint-disable-next-line typescript/restrict-template-expressions, typescript/no-base-to-string
      `Initial state node "${_target}" not found on parent state node #${stateNode.id}`
    );
  }
  const transition = {
    source: stateNode,
    actions: !_target || typeof _target === "string" ? [] : toArray(_target.actions),
    eventType: null,
    reenter: false,
    target: resolvedTarget ? [resolvedTarget] : [],
    meta: typeof _target === "object" ? _target.meta : void 0,
    description: typeof _target === "object" ? _target.description : void 0,
    toJSON: () => ({
      ...transition,
      source: `#${stateNode.id}`,
      target: resolvedTarget ? [`#${resolvedTarget.id}`] : []
    })
  };
  return transition;
}
function resolveTarget(stateNode, targets) {
  if (targets === void 0) {
    return void 0;
  }
  return targets.map((target) => {
    if (typeof target !== "string") {
      return target;
    }
    if (isStateId(target)) {
      return stateNode.machine.getStateNodeById(target);
    }
    const isInternalTarget = target[0] === STATE_DELIMITER;
    if (isInternalTarget && !stateNode.parent) {
      return getStateNodeByPath(stateNode, target.slice(1));
    }
    const resolvedTarget = isInternalTarget ? stateNode.key + target : target;
    if (stateNode.parent) {
      try {
        const targetStateNode = getStateNodeByPath(stateNode.parent, resolvedTarget);
        return targetStateNode;
      } catch (err) {
        throw new Error(`Invalid transition definition for state node '${stateNode.id}':
${err.message}`);
      }
    } else {
      throw new Error(`Invalid target: "${target}" is not a valid target from the root node. Did you mean ".${target}"?`);
    }
  });
}
function resolveHistoryDefaultTransition(stateNode) {
  const normalizedTarget = normalizeTarget(stateNode.config.target);
  if (!normalizedTarget) {
    if (stateNode.parent.type === "parallel") {
      return {
        target: [stateNode.parent]
      };
    }
    return stateNode.parent.initial;
  }
  return {
    target: normalizedTarget.map((t) => typeof t === "string" ? getStateNodeByPath(stateNode.parent, t) : t)
  };
}
function isHistoryNode(stateNode) {
  return stateNode.type === "history";
}
function getInitialStateNodesWithTheirAncestors(stateNode) {
  const states = getInitialStateNodes(stateNode);
  for (const initialState of states) {
    for (const ancestor of getProperAncestors(initialState, stateNode)) {
      states.add(ancestor);
    }
  }
  return states;
}
function getInitialStateNodes(stateNode) {
  const set = /* @__PURE__ */ new Set();
  function iter(descStateNode) {
    if (set.has(descStateNode)) {
      return;
    }
    set.add(descStateNode);
    if (descStateNode.type === "compound") {
      iter(descStateNode.initial.target[0]);
    } else if (descStateNode.type === "parallel") {
      for (const child of getChildren(descStateNode)) {
        iter(child);
      }
    }
  }
  iter(stateNode);
  return set;
}
function getStateNode(stateNode, stateKey) {
  if (isStateId(stateKey)) {
    return stateNode.machine.getStateNodeById(stateKey);
  }
  if (!stateNode.states) {
    throw new Error(`Unable to retrieve child state '${stateKey}' from '${stateNode.id}'; no child states exist.`);
  }
  const result = stateNode.states[stateKey];
  if (!result) {
    throw new Error(`Child state '${stateKey}' does not exist on '${stateNode.id}'`);
  }
  return result;
}
function getStateNodeByPath(stateNode, statePath) {
  if (typeof statePath === "string" && isStateId(statePath)) {
    try {
      return stateNode.machine.getStateNodeById(statePath);
    } catch {
    }
  }
  const arrayStatePath = toStatePath(statePath).slice();
  let currentStateNode = stateNode;
  while (arrayStatePath.length) {
    const key = arrayStatePath.shift();
    if (!key.length) {
      break;
    }
    currentStateNode = getStateNode(currentStateNode, key);
  }
  return currentStateNode;
}
function getStateNodes(stateNode, stateValue) {
  if (typeof stateValue === "string") {
    const childStateNode = stateNode.states[stateValue];
    if (!childStateNode) {
      throw new Error(`State '${stateValue}' does not exist on '${stateNode.id}'`);
    }
    return [stateNode, childStateNode];
  }
  const childStateKeys = Object.keys(stateValue);
  const childStateNodes = childStateKeys.map((subStateKey) => getStateNode(stateNode, subStateKey)).filter(Boolean);
  return [stateNode.machine.root, stateNode].concat(childStateNodes, childStateKeys.reduce((allSubStateNodes, subStateKey) => {
    const subStateNode = getStateNode(stateNode, subStateKey);
    if (!subStateNode) {
      return allSubStateNodes;
    }
    const subStateNodes = getStateNodes(subStateNode, stateValue[subStateKey]);
    return allSubStateNodes.concat(subStateNodes);
  }, []));
}
function transitionAtomicNode(stateNode, stateValue, snapshot, event) {
  const childStateNode = getStateNode(stateNode, stateValue);
  const next = childStateNode.next(snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionCompoundNode(stateNode, stateValue, snapshot, event) {
  const subStateKeys = Object.keys(stateValue);
  const childStateNode = getStateNode(stateNode, subStateKeys[0]);
  const next = transitionNode(childStateNode, stateValue[subStateKeys[0]], snapshot, event);
  if (!next || !next.length) {
    return stateNode.next(snapshot, event);
  }
  return next;
}
function transitionParallelNode(stateNode, stateValue, snapshot, event) {
  const allInnerTransitions = [];
  for (const subStateKey of Object.keys(stateValue)) {
    const subStateValue = stateValue[subStateKey];
    if (!subStateValue) {
      continue;
    }
    const subStateNode = getStateNode(stateNode, subStateKey);
    const innerTransitions = transitionNode(subStateNode, subStateValue, snapshot, event);
    if (innerTransitions) {
      allInnerTransitions.push(...innerTransitions);
    }
  }
  if (!allInnerTransitions.length) {
    return stateNode.next(snapshot, event);
  }
  return allInnerTransitions;
}
function transitionNode(stateNode, stateValue, snapshot, event) {
  if (typeof stateValue === "string") {
    return transitionAtomicNode(stateNode, stateValue, snapshot, event);
  }
  if (Object.keys(stateValue).length === 1) {
    return transitionCompoundNode(stateNode, stateValue, snapshot, event);
  }
  return transitionParallelNode(stateNode, stateValue, snapshot, event);
}
function getHistoryNodes(stateNode) {
  return Object.keys(stateNode.states).map((key) => stateNode.states[key]).filter((sn) => sn.type === "history");
}
function isDescendant(childStateNode, parentStateNode) {
  let marker = childStateNode;
  while (marker.parent && marker.parent !== parentStateNode) {
    marker = marker.parent;
  }
  return marker.parent === parentStateNode;
}
function hasIntersection(s1, s2) {
  const set1 = new Set(s1);
  const set2 = new Set(s2);
  for (const item of set1) {
    if (set2.has(item)) {
      return true;
    }
  }
  for (const item of set2) {
    if (set1.has(item)) {
      return true;
    }
  }
  return false;
}
function removeConflictingTransitions(enabledTransitions, stateNodeSet, historyValue) {
  const filteredTransitions = /* @__PURE__ */ new Set();
  for (const t1 of enabledTransitions) {
    let t1Preempted = false;
    const transitionsToRemove = /* @__PURE__ */ new Set();
    for (const t2 of filteredTransitions) {
      if (hasIntersection(computeExitSet([t1], stateNodeSet, historyValue), computeExitSet([t2], stateNodeSet, historyValue))) {
        if (isDescendant(t1.source, t2.source)) {
          transitionsToRemove.add(t2);
        } else {
          t1Preempted = true;
          break;
        }
      }
    }
    if (!t1Preempted) {
      for (const t3 of transitionsToRemove) {
        filteredTransitions.delete(t3);
      }
      filteredTransitions.add(t1);
    }
  }
  return Array.from(filteredTransitions);
}
function findLeastCommonAncestor(stateNodes) {
  const [head, ...tail] = stateNodes;
  for (const ancestor of getProperAncestors(head, void 0)) {
    if (tail.every((sn) => isDescendant(sn, ancestor))) {
      return ancestor;
    }
  }
}
function getEffectiveTargetStates(transition, historyValue) {
  if (!transition.target) {
    return [];
  }
  const targets = /* @__PURE__ */ new Set();
  for (const targetNode of transition.target) {
    if (isHistoryNode(targetNode)) {
      if (historyValue[targetNode.id]) {
        for (const node of historyValue[targetNode.id]) {
          targets.add(node);
        }
      } else {
        for (const node of getEffectiveTargetStates(resolveHistoryDefaultTransition(targetNode), historyValue)) {
          targets.add(node);
        }
      }
    } else {
      targets.add(targetNode);
    }
  }
  return [...targets];
}
function getTransitionDomain(transition, historyValue) {
  const targetStates = getEffectiveTargetStates(transition, historyValue);
  if (!targetStates) {
    return;
  }
  if (!transition.reenter && targetStates.every((target) => target === transition.source || isDescendant(target, transition.source))) {
    return transition.source;
  }
  const lca = findLeastCommonAncestor(targetStates.concat(transition.source));
  if (lca) {
    return lca;
  }
  if (transition.reenter) {
    return;
  }
  return transition.source.machine.root;
}
function computeExitSet(transitions, stateNodeSet, historyValue) {
  const statesToExit = /* @__PURE__ */ new Set();
  for (const t of transitions) {
    if (t.target?.length) {
      const domain = getTransitionDomain(t, historyValue);
      if (t.reenter && t.source === domain) {
        statesToExit.add(domain);
      }
      for (const stateNode of stateNodeSet) {
        if (isDescendant(stateNode, domain)) {
          statesToExit.add(stateNode);
        }
      }
    }
  }
  return [...statesToExit];
}
function areStateNodeCollectionsEqual(prevStateNodes, nextStateNodeSet) {
  if (prevStateNodes.length !== nextStateNodeSet.size) {
    return false;
  }
  for (const node of prevStateNodes) {
    if (!nextStateNodeSet.has(node)) {
      return false;
    }
  }
  return true;
}
function initialMicrostep(root, preInitialState, actorScope, initEvent, internalQueue) {
  return microstep([{
    target: [...getInitialStateNodes(root)],
    source: root,
    reenter: true,
    actions: [],
    eventType: null,
    toJSON: null
  }], preInitialState, actorScope, initEvent, true, internalQueue);
}
function microstep(transitions, currentSnapshot, actorScope, event, isInitial, internalQueue) {
  const actions = [];
  if (!transitions.length) {
    return [currentSnapshot, actions];
  }
  const originalExecutor = actorScope.actionExecutor;
  actorScope.actionExecutor = (action) => {
    actions.push(action);
    originalExecutor(action);
  };
  try {
    const mutStateNodeSet = new Set(currentSnapshot._nodes);
    let historyValue = currentSnapshot.historyValue;
    const filteredTransitions = removeConflictingTransitions(transitions, mutStateNodeSet, historyValue);
    let nextState = currentSnapshot;
    if (!isInitial) {
      [nextState, historyValue] = exitStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, historyValue, internalQueue, actorScope.actionExecutor);
    }
    nextState = resolveActionsAndContext(nextState, event, actorScope, filteredTransitions.flatMap((t) => t.actions), internalQueue, void 0);
    nextState = enterStates(nextState, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial);
    const nextStateNodes = [...mutStateNodeSet];
    if (nextState.status === "done") {
      nextState = resolveActionsAndContext(nextState, event, actorScope, nextStateNodes.sort((a, b) => b.order - a.order).flatMap((state) => state.exit), internalQueue, void 0);
    }
    try {
      if (historyValue === currentSnapshot.historyValue && areStateNodeCollectionsEqual(currentSnapshot._nodes, mutStateNodeSet)) {
        return [nextState, actions];
      }
      return [cloneMachineSnapshot(nextState, {
        _nodes: nextStateNodes,
        historyValue
      }), actions];
    } catch (e) {
      throw e;
    }
  } finally {
    actorScope.actionExecutor = originalExecutor;
  }
}
function getMachineOutput(snapshot, event, actorScope, rootNode, rootCompletionNode) {
  if (rootNode.output === void 0) {
    return;
  }
  const doneStateEvent = createDoneStateEvent(rootCompletionNode.id, rootCompletionNode.output !== void 0 && rootCompletionNode.parent ? resolveOutput(rootCompletionNode.output, snapshot.context, event, actorScope.self) : void 0);
  return resolveOutput(rootNode.output, snapshot.context, doneStateEvent, actorScope.self);
}
function enterStates(currentSnapshot, event, actorScope, filteredTransitions, mutStateNodeSet, internalQueue, historyValue, isInitial) {
  let nextSnapshot = currentSnapshot;
  const statesToEnter = /* @__PURE__ */ new Set();
  const statesForDefaultEntry = /* @__PURE__ */ new Set();
  computeEntrySet(filteredTransitions, historyValue, statesForDefaultEntry, statesToEnter);
  if (isInitial) {
    statesForDefaultEntry.add(currentSnapshot.machine.root);
  }
  const completedNodes = /* @__PURE__ */ new Set();
  for (const stateNodeToEnter of [...statesToEnter].sort((a, b) => a.order - b.order)) {
    mutStateNodeSet.add(stateNodeToEnter);
    const actions = [];
    actions.push(...stateNodeToEnter.entry);
    for (const invokeDef of stateNodeToEnter.invoke) {
      actions.push(spawnChild(invokeDef.src, {
        ...invokeDef,
        syncSnapshot: !!invokeDef.onSnapshot
      }));
    }
    if (statesForDefaultEntry.has(stateNodeToEnter)) {
      const initialActions = stateNodeToEnter.initial.actions;
      actions.push(...initialActions);
    }
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, actions, internalQueue, stateNodeToEnter.invoke.map((invokeDef) => invokeDef.id));
    if (stateNodeToEnter.type === "final") {
      const parent = stateNodeToEnter.parent;
      let ancestorMarker = parent?.type === "parallel" ? parent : parent?.parent;
      let rootCompletionNode = ancestorMarker || stateNodeToEnter;
      if (parent?.type === "compound") {
        internalQueue.push(createDoneStateEvent(parent.id, stateNodeToEnter.output !== void 0 ? resolveOutput(stateNodeToEnter.output, nextSnapshot.context, event, actorScope.self) : void 0));
      }
      while (ancestorMarker?.type === "parallel" && !completedNodes.has(ancestorMarker) && isInFinalState(mutStateNodeSet, ancestorMarker)) {
        completedNodes.add(ancestorMarker);
        internalQueue.push(createDoneStateEvent(ancestorMarker.id));
        rootCompletionNode = ancestorMarker;
        ancestorMarker = ancestorMarker.parent;
      }
      if (ancestorMarker) {
        continue;
      }
      nextSnapshot = cloneMachineSnapshot(nextSnapshot, {
        status: "done",
        output: getMachineOutput(nextSnapshot, event, actorScope, nextSnapshot.machine.root, rootCompletionNode)
      });
    }
  }
  return nextSnapshot;
}
function computeEntrySet(transitions, historyValue, statesForDefaultEntry, statesToEnter) {
  for (const t of transitions) {
    const domain = getTransitionDomain(t, historyValue);
    for (const s of t.target || []) {
      if (!isHistoryNode(s) && // if the target is different than the source then it will *definitely* be entered
      (t.source !== s || // we know that the domain can't lie within the source
      // if it's different than the source then it's outside of it and it means that the target has to be entered as well
      t.source !== domain || // reentering transitions always enter the target, even if it's the source itself
      t.reenter)) {
        statesToEnter.add(s);
        statesForDefaultEntry.add(s);
      }
      addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
    }
    const targetStates = getEffectiveTargetStates(t, historyValue);
    for (const s of targetStates) {
      const ancestors = getProperAncestors(s, domain);
      if (domain?.type === "parallel") {
        ancestors.push(domain);
      }
      addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, !t.source.parent && t.reenter ? void 0 : domain);
    }
  }
}
function addDescendantStatesToEnter(stateNode, historyValue, statesForDefaultEntry, statesToEnter) {
  if (isHistoryNode(stateNode)) {
    if (historyValue[stateNode.id]) {
      const historyStateNodes = historyValue[stateNode.id];
      for (const s of historyStateNodes) {
        statesToEnter.add(s);
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyStateNodes) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    } else {
      const historyDefaultTransition = resolveHistoryDefaultTransition(stateNode);
      for (const s of historyDefaultTransition.target) {
        statesToEnter.add(s);
        if (historyDefaultTransition === stateNode.parent?.initial) {
          statesForDefaultEntry.add(stateNode.parent);
        }
        addDescendantStatesToEnter(s, historyValue, statesForDefaultEntry, statesToEnter);
      }
      for (const s of historyDefaultTransition.target) {
        addProperAncestorStatesToEnter(s, stateNode.parent, statesToEnter, historyValue, statesForDefaultEntry);
      }
    }
  } else {
    if (stateNode.type === "compound") {
      const [initialState] = stateNode.initial.target;
      if (!isHistoryNode(initialState)) {
        statesToEnter.add(initialState);
        statesForDefaultEntry.add(initialState);
      }
      addDescendantStatesToEnter(initialState, historyValue, statesForDefaultEntry, statesToEnter);
      addProperAncestorStatesToEnter(initialState, stateNode, statesToEnter, historyValue, statesForDefaultEntry);
    } else {
      if (stateNode.type === "parallel") {
        for (const child of getChildren(stateNode).filter((sn) => !isHistoryNode(sn))) {
          if (![...statesToEnter].some((s) => isDescendant(s, child))) {
            if (!isHistoryNode(child)) {
              statesToEnter.add(child);
              statesForDefaultEntry.add(child);
            }
            addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
          }
        }
      }
    }
  }
}
function addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, ancestors, reentrancyDomain) {
  for (const anc of ancestors) {
    if (!reentrancyDomain || isDescendant(anc, reentrancyDomain)) {
      statesToEnter.add(anc);
    }
    if (anc.type === "parallel") {
      for (const child of getChildren(anc).filter((sn) => !isHistoryNode(sn))) {
        if (![...statesToEnter].some((s) => isDescendant(s, child))) {
          statesToEnter.add(child);
          addDescendantStatesToEnter(child, historyValue, statesForDefaultEntry, statesToEnter);
        }
      }
    }
  }
}
function addProperAncestorStatesToEnter(stateNode, toStateNode, statesToEnter, historyValue, statesForDefaultEntry) {
  addAncestorStatesToEnter(statesToEnter, historyValue, statesForDefaultEntry, getProperAncestors(stateNode, toStateNode));
}
function exitStates(currentSnapshot, event, actorScope, transitions, mutStateNodeSet, historyValue, internalQueue, _actionExecutor) {
  let nextSnapshot = currentSnapshot;
  const statesToExit = computeExitSet(transitions, mutStateNodeSet, historyValue);
  statesToExit.sort((a, b) => b.order - a.order);
  let changedHistory;
  for (const exitStateNode of statesToExit) {
    for (const historyNode of getHistoryNodes(exitStateNode)) {
      let predicate;
      if (historyNode.history === "deep") {
        predicate = (sn) => isAtomicStateNode(sn) && isDescendant(sn, exitStateNode);
      } else {
        predicate = (sn) => {
          return sn.parent === exitStateNode;
        };
      }
      changedHistory ??= {
        ...historyValue
      };
      changedHistory[historyNode.id] = Array.from(mutStateNodeSet).filter(predicate);
    }
  }
  for (const s of statesToExit) {
    nextSnapshot = resolveActionsAndContext(nextSnapshot, event, actorScope, [...s.exit, ...s.invoke.map((def) => stopChild(def.id))], internalQueue, void 0);
    mutStateNodeSet.delete(s);
  }
  return [nextSnapshot, changedHistory || historyValue];
}
function getAction(machine, actionType) {
  return machine.implementations.actions[actionType];
}
function resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, extra, retries) {
  const {
    machine
  } = currentSnapshot;
  let intermediateSnapshot = currentSnapshot;
  for (const action of actions) {
    const isInline = typeof action === "function";
    const resolvedAction = isInline ? action : (
      // the existing type of `.actions` assumes non-nullable `TExpressionAction`
      // it's fine to cast this here to get a common type and lack of errors in the rest of the code
      // our logic below makes sure that we call those 2 "variants" correctly
      getAction(machine, typeof action === "string" ? action : action.type)
    );
    const actionArgs = {
      context: intermediateSnapshot.context,
      event,
      self: actorScope.self,
      system: actorScope.system
    };
    const actionParams = isInline || typeof action === "string" ? void 0 : "params" in action ? typeof action.params === "function" ? action.params({
      context: intermediateSnapshot.context,
      event
    }) : action.params : void 0;
    if (!resolvedAction || !("resolve" in resolvedAction)) {
      actorScope.actionExecutor({
        type: typeof action === "string" ? action : typeof action === "object" ? action.type : action.name || "(anonymous)",
        info: actionArgs,
        params: actionParams,
        exec: resolvedAction
      });
      continue;
    }
    const builtinAction = resolvedAction;
    const [nextState, params, actions2] = builtinAction.resolve(
      actorScope,
      intermediateSnapshot,
      actionArgs,
      actionParams,
      resolvedAction,
      // this holds all params
      extra
    );
    intermediateSnapshot = nextState;
    if ("retryResolve" in builtinAction) {
      retries?.push([builtinAction, params]);
    }
    if ("execute" in builtinAction) {
      actorScope.actionExecutor({
        type: builtinAction.type,
        info: actionArgs,
        params,
        exec: builtinAction.execute.bind(null, actorScope, params)
      });
    }
    if (actions2) {
      intermediateSnapshot = resolveAndExecuteActionsWithContext(intermediateSnapshot, event, actorScope, actions2, extra, retries);
    }
  }
  return intermediateSnapshot;
}
function resolveActionsAndContext(currentSnapshot, event, actorScope, actions, internalQueue, deferredActorIds) {
  const retries = deferredActorIds ? [] : void 0;
  const nextState = resolveAndExecuteActionsWithContext(currentSnapshot, event, actorScope, actions, {
    internalQueue,
    deferredActorIds
  }, retries);
  retries?.forEach(([builtinAction, params]) => {
    builtinAction.retryResolve(actorScope, nextState, params);
  });
  return nextState;
}
function macrostep(snapshot, event, actorScope, internalQueue) {
  let nextSnapshot = snapshot;
  const microsteps = [];
  function addMicrostep(step, event2, transitions) {
    actorScope.system._sendInspectionEvent({
      type: "@xstate.microstep",
      actorRef: actorScope.self,
      event: event2,
      snapshot: step[0],
      _transitions: transitions
    });
    microsteps.push(step);
  }
  if (event.type === XSTATE_STOP) {
    nextSnapshot = cloneMachineSnapshot(stopChildren(nextSnapshot, event, actorScope), {
      status: "stopped"
    });
    addMicrostep([nextSnapshot, []], event, []);
    return {
      snapshot: nextSnapshot,
      microsteps
    };
  }
  let nextEvent = event;
  if (nextEvent.type !== XSTATE_INIT) {
    const currentEvent = nextEvent;
    const isErr = isErrorActorEvent(currentEvent);
    const transitions = selectTransitions(currentEvent, nextSnapshot);
    if (isErr && !transitions.length) {
      nextSnapshot = cloneMachineSnapshot(snapshot, {
        status: "error",
        error: currentEvent.error
      });
      addMicrostep([nextSnapshot, []], currentEvent, []);
      return {
        snapshot: nextSnapshot,
        microsteps
      };
    }
    const step = microstep(
      transitions,
      snapshot,
      actorScope,
      nextEvent,
      false,
      // isInitial
      internalQueue
    );
    nextSnapshot = step[0];
    addMicrostep(step, currentEvent, transitions);
  }
  let shouldSelectEventlessTransitions = true;
  const maxIterations = snapshot.machine.options?.maxIterations ?? Infinity;
  let iterationCount = 0;
  while (nextSnapshot.status === "active") {
    iterationCount++;
    if (iterationCount > maxIterations) {
      throw new Error(`Infinite loop detected: the machine has processed more than ${maxIterations} microsteps without reaching a stable state. This usually happens when there's a cycle of transitions (e.g., eventless transitions or raised events causing state A -> B -> C -> A).`);
    }
    let enabledTransitions = shouldSelectEventlessTransitions ? selectEventlessTransitions(nextSnapshot, nextEvent) : [];
    const previousState = enabledTransitions.length ? nextSnapshot : void 0;
    if (!enabledTransitions.length) {
      if (!internalQueue.length) {
        break;
      }
      nextEvent = internalQueue.shift();
      enabledTransitions = selectTransitions(nextEvent, nextSnapshot);
    }
    const step = microstep(enabledTransitions, nextSnapshot, actorScope, nextEvent, false, internalQueue);
    nextSnapshot = step[0];
    shouldSelectEventlessTransitions = nextSnapshot !== previousState;
    addMicrostep(step, nextEvent, enabledTransitions);
  }
  if (nextSnapshot.status !== "active") {
    stopChildren(nextSnapshot, nextEvent, actorScope);
  }
  return {
    snapshot: nextSnapshot,
    microsteps
  };
}
function stopChildren(nextState, event, actorScope) {
  return resolveActionsAndContext(nextState, event, actorScope, Object.values(nextState.children).map((child) => stopChild(child)), [], void 0);
}
function selectTransitions(event, nextState) {
  return nextState.machine.getTransitionData(nextState, event);
}
function selectEventlessTransitions(nextState, event) {
  const enabledTransitionSet = /* @__PURE__ */ new Set();
  const atomicStates = nextState._nodes.filter(isAtomicStateNode);
  for (const stateNode of atomicStates) {
    loop: for (const s of [stateNode].concat(getProperAncestors(stateNode, void 0))) {
      if (!s.always) {
        continue;
      }
      for (const transition of s.always) {
        if (transition.guard === void 0 || evaluateGuard(transition.guard, nextState.context, event, nextState)) {
          enabledTransitionSet.add(transition);
          break loop;
        }
      }
    }
  }
  return removeConflictingTransitions(Array.from(enabledTransitionSet), new Set(nextState._nodes), nextState.historyValue);
}
function resolveStateValue(rootNode, stateValue) {
  const allStateNodes = getAllStateNodes(getStateNodes(rootNode, stateValue));
  return getStateValue(rootNode, [...allStateNodes]);
}
function isMachineSnapshot(value) {
  return !!value && typeof value === "object" && "machine" in value && "value" in value;
}
var machineSnapshotMatches = function matches(testValue) {
  return matchesState(testValue, this.value);
};
var machineSnapshotHasTag = function hasTag(tag) {
  return this.tags.has(tag);
};
var machineSnapshotCan = function can(event) {
  const transitionData = this.machine.getTransitionData(this, event);
  return !!transitionData?.length && // Check that at least one transition is not forbidden
  transitionData.some((t) => t.target !== void 0 || t.actions.length);
};
var machineSnapshotToJSON = function toJSON() {
  const {
    _nodes: nodes,
    tags,
    machine,
    getMeta: getMeta2,
    toJSON: toJSON2,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    ...jsonValues
  } = this;
  return {
    ...jsonValues,
    tags: Array.from(tags)
  };
};
var machineSnapshotGetMeta = function getMeta() {
  return this._nodes.reduce((acc, stateNode) => {
    if (stateNode.meta !== void 0) {
      acc[stateNode.id] = stateNode.meta;
    }
    return acc;
  }, {});
};
function createMachineSnapshot(config, machine) {
  return {
    status: config.status,
    output: config.output,
    error: config.error,
    machine,
    context: config.context,
    _nodes: config._nodes,
    value: getStateValue(machine.root, config._nodes),
    tags: new Set(config._nodes.flatMap((sn) => sn.tags)),
    children: config.children,
    historyValue: config.historyValue || {},
    matches: machineSnapshotMatches,
    hasTag: machineSnapshotHasTag,
    can: machineSnapshotCan,
    getMeta: machineSnapshotGetMeta,
    toJSON: machineSnapshotToJSON
  };
}
function cloneMachineSnapshot(snapshot, config = {}) {
  return createMachineSnapshot({
    ...snapshot,
    ...config
  }, snapshot.machine);
}
function serializeHistoryValue(historyValue) {
  if (typeof historyValue !== "object" || historyValue === null) {
    return {};
  }
  const result = {};
  for (const key in historyValue) {
    const value = historyValue[key];
    if (Array.isArray(value)) {
      result[key] = value.map((item) => ({
        id: item.id
      }));
    }
  }
  return result;
}
function getPersistedSnapshot(snapshot, options) {
  const {
    _nodes: nodes,
    tags,
    machine,
    children,
    context,
    can: can2,
    hasTag: hasTag2,
    matches: matches2,
    getMeta: getMeta2,
    toJSON: toJSON2,
    ...jsonValues
  } = snapshot;
  const childrenJson = {};
  for (const id in children) {
    const child = children[id];
    childrenJson[id] = {
      snapshot: child.getPersistedSnapshot(options),
      src: child.src,
      systemId: child.systemId,
      syncSnapshot: child._syncSnapshot
    };
  }
  const persisted = {
    ...jsonValues,
    context: persistContext(context),
    children: childrenJson,
    historyValue: serializeHistoryValue(jsonValues.historyValue)
  };
  return persisted;
}
function persistContext(contextPart) {
  let copy;
  for (const key in contextPart) {
    const value = contextPart[key];
    if (value && typeof value === "object") {
      if ("sessionId" in value && "send" in value && "ref" in value) {
        copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
          ...contextPart
        };
        copy[key] = {
          xstate$$type: $$ACTOR_TYPE,
          id: value.id
        };
      } else {
        const result = persistContext(value);
        if (result !== value) {
          copy ??= Array.isArray(contextPart) ? contextPart.slice() : {
            ...contextPart
          };
          copy[key] = result;
        }
      }
    }
  }
  return copy ?? contextPart;
}
function resolveRaise(_, snapshot, args, actionParams, {
  event: eventOrExpr,
  id,
  delay
}, {
  internalQueue
}) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === "string") {
    throw new Error(
      // oxlint-disable-next-line typescript/restrict-template-expressions
      `Only event objects may be used with raise; use raise({ type: "${eventOrExpr}" }) instead`
    );
  }
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === "string") {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
  }
  if (typeof resolvedDelay !== "number") {
    internalQueue.push(resolvedEvent);
  }
  return [snapshot, {
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }, void 0];
}
function executeRaise(actorScope, params) {
  const {
    event,
    delay,
    id
  } = params;
  if (typeof delay === "number") {
    actorScope.defer(() => {
      const self2 = actorScope.self;
      actorScope.system.scheduler.schedule(self2, self2, event, delay, id);
    });
    return;
  }
}
function raise(eventOrExpr, options) {
  function raise2(_args, _params) {
  }
  raise2.type = "xstate.raise";
  raise2.event = eventOrExpr;
  raise2.id = options?.id;
  raise2.delay = options?.delay;
  raise2.resolve = resolveRaise;
  raise2.execute = executeRaise;
  return raise2;
}

// node_modules/xstate/dist/xstate-actors.esm.js
function fromTransition(transition, initialContext) {
  return {
    config: transition,
    transition: (snapshot, event, actorScope) => {
      return {
        ...snapshot,
        context: transition(snapshot.context, event, actorScope)
      };
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: "active",
        output: void 0,
        error: void 0,
        context: typeof initialContext === "function" ? initialContext({
          input
        }) : initialContext
      };
    },
    getPersistedSnapshot: (snapshot) => snapshot,
    restoreSnapshot: (snapshot) => snapshot
  };
}
var XSTATE_PROMISE_RESOLVE = "xstate.promise.resolve";
var XSTATE_PROMISE_REJECT = "xstate.promise.reject";
var controllerMap = /* @__PURE__ */ new WeakMap();
function fromPromise(promiseCreator) {
  const logic = {
    config: promiseCreator,
    transition: (state, event, scope) => {
      if (state.status !== "active") {
        return state;
      }
      switch (event.type) {
        case XSTATE_PROMISE_RESOLVE: {
          const resolvedValue = event.data;
          return {
            ...state,
            status: "done",
            output: resolvedValue,
            input: void 0
          };
        }
        case XSTATE_PROMISE_REJECT:
          return {
            ...state,
            status: "error",
            error: event.data,
            input: void 0
          };
        case XSTATE_STOP: {
          controllerMap.get(scope.self)?.abort();
          controllerMap.delete(scope.self);
          return {
            ...state,
            status: "stopped",
            input: void 0
          };
        }
        default:
          return state;
      }
    },
    start: (state, {
      self: self2,
      system,
      emit: emit2
    }) => {
      if (state.status !== "active") {
        return;
      }
      const controller = new AbortController();
      controllerMap.set(self2, controller);
      const resolvedPromise = Promise.resolve(promiseCreator({
        input: state.input,
        system,
        self: self2,
        signal: controller.signal,
        emit: emit2
      }));
      resolvedPromise.then((response) => {
        if (self2.getSnapshot().status !== "active") {
          return;
        }
        controllerMap.delete(self2);
        system._relay(self2, self2, {
          type: XSTATE_PROMISE_RESOLVE,
          data: response
        });
      }, (errorData) => {
        if (self2.getSnapshot().status !== "active") {
          return;
        }
        controllerMap.delete(self2);
        system._relay(self2, self2, {
          type: XSTATE_PROMISE_REJECT,
          data: errorData
        });
      });
    },
    getInitialSnapshot: (_, input) => {
      return {
        status: "active",
        output: void 0,
        error: void 0,
        input
      };
    },
    getPersistedSnapshot: (snapshot) => snapshot,
    restoreSnapshot: (snapshot) => snapshot
  };
  return logic;
}
var emptyLogic = fromTransition((_) => void 0, void 0);

// node_modules/xstate/dist/assign-b4b1f28f.esm.js
function createSpawner(actorScope, {
  machine,
  context
}, event, spawnedChildren) {
  const spawn2 = (src, options) => {
    if (typeof src === "string") {
      const logic = resolveReferencedActor(machine, src);
      if (!logic) {
        throw new Error(`Actor logic '${src}' not implemented in machine '${machine.id}'`);
      }
      const actorRef = createActor(logic, {
        id: options?.id,
        parent: actorScope.self,
        syncSnapshot: options?.syncSnapshot,
        input: typeof options?.input === "function" ? options.input({
          context,
          event,
          self: actorScope.self
        }) : options?.input,
        src,
        systemId: options?.systemId
      });
      spawnedChildren[actorRef.id] = actorRef;
      return actorRef;
    } else {
      const actorRef = createActor(src, {
        id: options?.id,
        parent: actorScope.self,
        syncSnapshot: options?.syncSnapshot,
        input: options?.input,
        src,
        systemId: options?.systemId
      });
      return actorRef;
    }
  };
  return (src, options) => {
    const actorRef = spawn2(src, options);
    spawnedChildren[actorRef.id] = actorRef;
    actorScope.defer(() => {
      if (actorRef._processingStatus === ProcessingStatus.Stopped) {
        return;
      }
      actorRef.start();
    });
    return actorRef;
  };
}
function resolveAssign(actorScope, snapshot, actionArgs, actionParams, {
  assignment
}) {
  if (!snapshot.context) {
    throw new Error("Cannot assign to undefined `context`. Ensure that `context` is defined in the machine config.");
  }
  const spawnedChildren = {};
  const assignArgs = {
    context: snapshot.context,
    event: actionArgs.event,
    spawn: createSpawner(actorScope, snapshot, actionArgs.event, spawnedChildren),
    self: actorScope.self,
    system: actorScope.system
  };
  let partialUpdate = {};
  if (typeof assignment === "function") {
    partialUpdate = assignment(assignArgs, actionParams);
  } else {
    for (const key of Object.keys(assignment)) {
      const propAssignment = assignment[key];
      partialUpdate[key] = typeof propAssignment === "function" ? propAssignment(assignArgs, actionParams) : propAssignment;
    }
  }
  const updatedContext = Object.assign({}, snapshot.context, partialUpdate);
  return [cloneMachineSnapshot(snapshot, {
    context: updatedContext,
    children: Object.keys(spawnedChildren).length ? {
      ...snapshot.children,
      ...spawnedChildren
    } : snapshot.children
  }), void 0, void 0];
}
function assign(assignment) {
  function assign2(_args, _params) {
  }
  assign2.type = "xstate.assign";
  assign2.assignment = assignment;
  assign2.resolve = resolveAssign;
  return assign2;
}

// node_modules/xstate/dist/StateMachine-521e1f66.esm.js
var cache = /* @__PURE__ */ new WeakMap();
function memo(object, key, fn) {
  let memoizedData = cache.get(object);
  if (!memoizedData) {
    memoizedData = {
      [key]: fn()
    };
    cache.set(object, memoizedData);
  } else if (!(key in memoizedData)) {
    memoizedData[key] = fn();
  }
  return memoizedData[key];
}
var EMPTY_OBJECT = {};
var toSerializableAction = (action) => {
  if (typeof action === "string") {
    return {
      type: action
    };
  }
  if (typeof action === "function") {
    if ("resolve" in action) {
      return {
        type: action.type
      };
    }
    return {
      type: action.name
    };
  }
  return action;
};
var StateNode = class _StateNode {
  constructor(config, options) {
    this.config = config;
    this.key = void 0;
    this.id = void 0;
    this.type = void 0;
    this.path = void 0;
    this.states = void 0;
    this.history = void 0;
    this.entry = void 0;
    this.exit = void 0;
    this.parent = void 0;
    this.machine = void 0;
    this.meta = void 0;
    this.output = void 0;
    this.order = -1;
    this.description = void 0;
    this.tags = [];
    this.transitions = void 0;
    this.always = void 0;
    this.parent = options._parent;
    this.key = options._key;
    this.machine = options._machine;
    this.path = this.parent ? this.parent.path.concat(this.key) : [];
    this.id = this.config.id || [this.machine.id, ...this.path].join(STATE_DELIMITER);
    this.type = this.config.type || (this.config.states && Object.keys(this.config.states).length ? "compound" : this.config.history ? "history" : "atomic");
    this.description = this.config.description;
    this.order = this.machine.idMap.size;
    this.machine.idMap.set(this.id, this);
    this.states = this.config.states ? mapValues(this.config.states, (stateConfig, key) => {
      const stateNode = new _StateNode(stateConfig, {
        _parent: this,
        _key: key,
        _machine: this.machine
      });
      return stateNode;
    }) : EMPTY_OBJECT;
    if (this.type === "compound" && !this.config.initial) {
      throw new Error(`No initial state specified for compound state node "#${this.id}". Try adding { initial: "${Object.keys(this.states)[0]}" } to the state config.`);
    }
    this.history = this.config.history === true ? "shallow" : this.config.history || false;
    this.entry = toArray(this.config.entry).slice();
    this.exit = toArray(this.config.exit).slice();
    this.meta = this.config.meta;
    this.output = this.type === "final" || !this.parent ? this.config.output : void 0;
    this.tags = toArray(config.tags).slice();
  }
  /** @internal */
  _initialize() {
    this.transitions = formatTransitions(this);
    if (this.config.always) {
      this.always = toTransitionConfigArray(this.config.always).map((t) => formatTransition(this, NULL_EVENT, t));
    }
    Object.keys(this.states).forEach((key) => {
      this.states[key]._initialize();
    });
  }
  /** The well-structured state node definition. */
  get definition() {
    return {
      id: this.id,
      key: this.key,
      version: this.machine.version,
      type: this.type,
      initial: this.initial ? {
        target: this.initial.target,
        source: this,
        actions: this.initial.actions.map(toSerializableAction),
        eventType: null,
        reenter: false,
        meta: this.initial.meta,
        description: this.initial.description,
        toJSON: () => ({
          target: this.initial.target.map((t) => `#${t.id}`),
          source: `#${this.id}`,
          actions: this.initial.actions.map(toSerializableAction),
          eventType: null,
          meta: this.initial.meta,
          description: this.initial.description
        })
      } : void 0,
      history: this.history,
      states: mapValues(this.states, (state) => state.definition),
      on: this.on,
      transitions: [...this.transitions.values()].flat().map((t) => ({
        ...t,
        actions: t.actions.map(toSerializableAction)
      })),
      entry: this.entry.map(toSerializableAction),
      exit: this.exit.map(toSerializableAction),
      meta: this.meta,
      order: this.order || -1,
      output: this.output,
      invoke: this.invoke,
      description: this.description,
      tags: this.tags
    };
  }
  /** @internal */
  toJSON() {
    return this.definition;
  }
  /** The logic invoked as actors by this state node. */
  get invoke() {
    return memo(this, "invoke", () => toArray(this.config.invoke).map((invokeConfig, i) => {
      const {
        src,
        systemId
      } = invokeConfig;
      const resolvedId = invokeConfig.id ?? createInvokeId(this.id, i);
      const sourceName = typeof src === "string" ? src : `xstate.invoke.${createInvokeId(this.id, i)}`;
      return {
        ...invokeConfig,
        src: sourceName,
        id: resolvedId,
        systemId,
        toJSON() {
          const {
            onDone,
            onError,
            ...invokeDefValues
          } = invokeConfig;
          return {
            ...invokeDefValues,
            type: "xstate.invoke",
            src: sourceName,
            id: resolvedId
          };
        }
      };
    }));
  }
  /** The mapping of events to transitions. */
  get on() {
    return memo(this, "on", () => {
      const transitions = this.transitions;
      return [...transitions].flatMap(([descriptor, t]) => t.map((t2) => [descriptor, t2])).reduce((map, [descriptor, transition]) => {
        map[descriptor] = map[descriptor] || [];
        map[descriptor].push(transition);
        return map;
      }, {});
    });
  }
  get after() {
    return memo(this, "delayedTransitions", () => getDelayedTransitions(this));
  }
  get initial() {
    return memo(this, "initial", () => formatInitialTransition(this, this.config.initial));
  }
  /** @internal */
  next(snapshot, event) {
    const eventType = event.type;
    const actions = [];
    let selectedTransition;
    const candidates = memo(this, `candidates-${eventType}`, () => getCandidates(this, eventType));
    for (const candidate of candidates) {
      const {
        guard
      } = candidate;
      const resolvedContext = snapshot.context;
      let guardPassed = false;
      try {
        guardPassed = !guard || evaluateGuard(guard, resolvedContext, event, snapshot);
      } catch (err) {
        const guardType = typeof guard === "string" ? guard : typeof guard === "object" ? guard.type : void 0;
        throw new Error(`Unable to evaluate guard ${guardType ? `'${guardType}' ` : ""}in transition for event '${eventType}' in state node '${this.id}':
${err.message}`);
      }
      if (guardPassed) {
        actions.push(...candidate.actions);
        selectedTransition = candidate;
        break;
      }
    }
    return selectedTransition ? [selectedTransition] : void 0;
  }
  /** All the event types accepted by this state node and its descendants. */
  get events() {
    return memo(this, "events", () => {
      const {
        states
      } = this;
      const events = new Set(this.ownEvents);
      if (states) {
        for (const stateId of Object.keys(states)) {
          const state = states[stateId];
          if (state.states) {
            for (const event of state.events) {
              events.add(`${event}`);
            }
          }
        }
      }
      return Array.from(events);
    });
  }
  /**
   * All the events that have transitions directly from this state node.
   *
   * Excludes any inert events.
   */
  get ownEvents() {
    const keys = Object.keys(Object.fromEntries(this.transitions));
    const events = new Set(keys.filter((descriptor) => {
      return this.transitions.get(descriptor).some((transition) => !(!transition.target && !transition.actions.length && !transition.reenter));
    }));
    return Array.from(events);
  }
};
var STATE_IDENTIFIER2 = "#";
var StateMachine = class _StateMachine {
  constructor(config, implementations) {
    this.config = config;
    this.version = void 0;
    this.schemas = void 0;
    this.implementations = void 0;
    this.options = void 0;
    this.__xstatenode = true;
    this.idMap = /* @__PURE__ */ new Map();
    this.root = void 0;
    this.id = void 0;
    this.states = void 0;
    this.events = void 0;
    this.id = config.id || "(machine)";
    this.implementations = {
      actors: implementations?.actors ?? {},
      actions: implementations?.actions ?? {},
      delays: implementations?.delays ?? {},
      guards: implementations?.guards ?? {}
    };
    this.version = this.config.version;
    this.schemas = this.config.schemas;
    this.options = {
      maxIterations: Infinity,
      ...this.config.options
    };
    this.transition = this.transition.bind(this);
    this.getInitialSnapshot = this.getInitialSnapshot.bind(this);
    this.getPersistedSnapshot = this.getPersistedSnapshot.bind(this);
    this.restoreSnapshot = this.restoreSnapshot.bind(this);
    this.start = this.start.bind(this);
    this.root = new StateNode(config, {
      _key: this.id,
      _machine: this
    });
    this.root._initialize();
    formatRouteTransitions(this.root);
    this.states = this.root.states;
    this.events = this.root.events;
  }
  /**
   * Clones this state machine with the provided implementations.
   *
   * @param implementations Options (`actions`, `guards`, `actors`, `delays`) to
   *   recursively merge with the existing options.
   * @returns A new `StateMachine` instance with the provided implementations.
   */
  provide(implementations) {
    const {
      actions,
      guards,
      actors,
      delays
    } = this.implementations;
    return new _StateMachine(this.config, {
      actions: {
        ...actions,
        ...implementations.actions
      },
      guards: {
        ...guards,
        ...implementations.guards
      },
      actors: {
        ...actors,
        ...implementations.actors
      },
      delays: {
        ...delays,
        ...implementations.delays
      }
    });
  }
  resolveState(config) {
    const resolvedStateValue = resolveStateValue(this.root, config.value);
    const nodeSet = getAllStateNodes(getStateNodes(this.root, resolvedStateValue));
    return createMachineSnapshot({
      _nodes: [...nodeSet],
      context: config.context || {},
      children: {},
      status: isInFinalState(nodeSet, this.root) ? "done" : config.status || "active",
      output: config.output,
      error: config.error,
      historyValue: config.historyValue
    }, this);
  }
  /**
   * Determines the next snapshot given the current `snapshot` and received
   * `event`. Calculates a full macrostep from all microsteps.
   *
   * @param snapshot The current snapshot
   * @param event The received event
   */
  transition(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope, []).snapshot;
  }
  /**
   * Determines the next state given the current `state` and `event`. Calculates
   * a microstep.
   *
   * @param state The current state
   * @param event The received event
   */
  microstep(snapshot, event, actorScope) {
    return macrostep(snapshot, event, actorScope, []).microsteps.map(([s]) => s);
  }
  getTransitionData(snapshot, event) {
    return transitionNode(this.root, snapshot.value, snapshot, event) || [];
  }
  /**
   * The initial state _before_ evaluating any microsteps. This "pre-initial"
   * state is provided to initial actions executed in the initial state.
   *
   * @internal
   */
  _getPreInitialState(actorScope, initEvent, internalQueue) {
    const {
      context
    } = this.config;
    const preInitial = createMachineSnapshot({
      context: typeof context !== "function" && context ? context : {},
      _nodes: [this.root],
      children: {},
      status: "active"
    }, this);
    if (typeof context === "function") {
      const assignment = ({
        spawn: spawn2,
        event,
        self: self2
      }) => context({
        spawn: spawn2,
        input: event.input,
        self: self2
      });
      return resolveActionsAndContext(preInitial, initEvent, actorScope, [assign(assignment)], internalQueue, void 0);
    }
    return preInitial;
  }
  /**
   * Returns the initial `State` instance, with reference to `self` as an
   * `ActorRef`.
   */
  getInitialSnapshot(actorScope, input) {
    const initEvent = createInitEvent(input);
    const internalQueue = [];
    let snapshot = createMachineSnapshot({
      context: typeof this.config.context !== "function" && this.config.context ? this.config.context : {},
      _nodes: [this.root],
      children: {},
      status: "active"
    }, this);
    try {
      snapshot = this._getPreInitialState(actorScope, initEvent, internalQueue);
      const [nextState] = initialMicrostep(this.root, snapshot, actorScope, initEvent, internalQueue);
      const {
        snapshot: macroState
      } = macrostep(nextState, initEvent, actorScope, internalQueue);
      return macroState;
    } catch (error) {
      return cloneMachineSnapshot(snapshot, {
        status: "error",
        error
      });
    }
  }
  start(snapshot) {
    Object.values(snapshot.children).forEach((child) => {
      if (child.getSnapshot().status === "active") {
        child.start();
      }
    });
  }
  getStateNodeById(stateId) {
    const fullPath = toStatePath(stateId);
    const relativePath = fullPath.slice(1);
    const resolvedStateId = isStateId(fullPath[0]) ? fullPath[0].slice(STATE_IDENTIFIER2.length) : fullPath[0];
    const stateNode = this.idMap.get(resolvedStateId);
    if (!stateNode) {
      throw new Error(`Child state node '#${resolvedStateId}' does not exist on machine '${this.id}'`);
    }
    return getStateNodeByPath(stateNode, relativePath);
  }
  get definition() {
    return this.root.definition;
  }
  toJSON() {
    return this.definition;
  }
  getPersistedSnapshot(snapshot, options) {
    return getPersistedSnapshot(snapshot, options);
  }
  restoreSnapshot(snapshot, _actorScope) {
    const children = {};
    const snapshotChildren = snapshot.children;
    Object.keys(snapshotChildren).forEach((actorId) => {
      const actorData = snapshotChildren[actorId];
      const childState = actorData.snapshot;
      const src = actorData.src;
      const logic = typeof src === "string" ? resolveReferencedActor(this, src) : src;
      if (!logic) {
        return;
      }
      const actorRef = createActor(logic, {
        id: actorId,
        parent: _actorScope.self,
        syncSnapshot: actorData.syncSnapshot,
        snapshot: childState,
        src,
        systemId: actorData.systemId
      });
      children[actorId] = actorRef;
    });
    function resolveHistoryReferencedState(root, referenced) {
      if (referenced instanceof StateNode) {
        return referenced;
      }
      try {
        return root.machine.getStateNodeById(referenced.id);
      } catch {
      }
    }
    function reviveHistoryValue(root, historyValue) {
      if (!historyValue || typeof historyValue !== "object") {
        return {};
      }
      const revived = {};
      for (const key in historyValue) {
        const arr = historyValue[key];
        for (const item of arr) {
          const resolved = resolveHistoryReferencedState(root, item);
          if (!resolved) {
            continue;
          }
          revived[key] ??= [];
          revived[key].push(resolved);
        }
      }
      return revived;
    }
    const revivedHistoryValue = reviveHistoryValue(this.root, snapshot.historyValue);
    const restoredSnapshot = createMachineSnapshot({
      ...snapshot,
      children,
      _nodes: Array.from(getAllStateNodes(getStateNodes(this.root, snapshot.value))),
      historyValue: revivedHistoryValue
    }, this);
    const seen = /* @__PURE__ */ new Set();
    function reviveContext(contextPart, children2) {
      if (seen.has(contextPart)) {
        return;
      }
      seen.add(contextPart);
      for (const key in contextPart) {
        const value = contextPart[key];
        if (value && typeof value === "object") {
          if ("xstate$$type" in value && value.xstate$$type === $$ACTOR_TYPE) {
            contextPart[key] = children2[value.id];
            continue;
          }
          reviveContext(value, children2);
        }
      }
    }
    reviveContext(restoredSnapshot.context, children);
    return restoredSnapshot;
  }
};

// node_modules/xstate/dist/log-ddf17a4a.esm.js
function resolveEmit(_, snapshot, args, actionParams, {
  event: eventOrExpr
}) {
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
  return [snapshot, {
    event: resolvedEvent
  }, void 0];
}
function executeEmit(actorScope, {
  event
}) {
  actorScope.defer(() => actorScope.emit(event));
}
function emit(eventOrExpr) {
  function emit2(_args, _params) {
  }
  emit2.type = "xstate.emit";
  emit2.event = eventOrExpr;
  emit2.resolve = resolveEmit;
  emit2.execute = executeEmit;
  return emit2;
}
var SpecialTargets = /* @__PURE__ */ (function(SpecialTargets2) {
  SpecialTargets2["Parent"] = "#_parent";
  SpecialTargets2["Internal"] = "#_internal";
  return SpecialTargets2;
})({});
function resolveSendTo(actorScope, snapshot, args, actionParams, {
  to,
  event: eventOrExpr,
  id,
  delay
}, extra) {
  const delaysMap = snapshot.machine.implementations.delays;
  if (typeof eventOrExpr === "string") {
    throw new Error(
      // oxlint-disable-next-line typescript/restrict-template-expressions
      `Only event objects may be used with sendTo; use sendTo({ type: "${eventOrExpr}" }) instead`
    );
  }
  const resolvedEvent = typeof eventOrExpr === "function" ? eventOrExpr(args, actionParams) : eventOrExpr;
  let resolvedDelay;
  if (typeof delay === "string") {
    const configDelay = delaysMap && delaysMap[delay];
    resolvedDelay = typeof configDelay === "function" ? configDelay(args, actionParams) : configDelay;
  } else {
    resolvedDelay = typeof delay === "function" ? delay(args, actionParams) : delay;
  }
  const resolvedTarget = typeof to === "function" ? to(args, actionParams) : to;
  let targetActorRef;
  if (typeof resolvedTarget === "string") {
    if (resolvedTarget === SpecialTargets.Parent) {
      targetActorRef = actorScope.self._parent;
    } else if (resolvedTarget === SpecialTargets.Internal) {
      targetActorRef = actorScope.self;
    } else if (resolvedTarget.startsWith("#_")) {
      targetActorRef = snapshot.children[resolvedTarget.slice(2)];
    } else {
      targetActorRef = extra.deferredActorIds?.includes(resolvedTarget) ? resolvedTarget : snapshot.children[resolvedTarget];
    }
    if (!targetActorRef) {
      throw new Error(`Unable to send event to actor '${resolvedTarget}' from machine '${snapshot.machine.id}'.`);
    }
  } else {
    targetActorRef = resolvedTarget || actorScope.self;
  }
  return [snapshot, {
    to: targetActorRef,
    targetId: typeof resolvedTarget === "string" ? resolvedTarget : void 0,
    event: resolvedEvent,
    id,
    delay: resolvedDelay
  }, void 0];
}
function retryResolveSendTo(_, snapshot, params) {
  if (typeof params.to === "string") {
    params.to = snapshot.children[params.to];
  }
}
function executeSendTo(actorScope, params) {
  actorScope.defer(() => {
    const {
      to,
      event,
      delay,
      id
    } = params;
    if (typeof delay === "number") {
      actorScope.system.scheduler.schedule(actorScope.self, to, event, delay, id);
      return;
    }
    actorScope.system._relay(
      actorScope.self,
      // at this point, in a deferred task, it should already be mutated by retryResolveSendTo
      // if it initially started as a string
      to,
      event.type === XSTATE_ERROR ? createErrorActorEvent(actorScope.self.id, event.data) : event
    );
  });
}
function sendTo(to, eventOrExpr, options) {
  function sendTo2(_args, _params) {
  }
  sendTo2.type = "xstate.sendTo";
  sendTo2.to = to;
  sendTo2.event = eventOrExpr;
  sendTo2.id = options?.id;
  sendTo2.delay = options?.delay;
  sendTo2.resolve = resolveSendTo;
  sendTo2.retryResolve = retryResolveSendTo;
  sendTo2.execute = executeSendTo;
  return sendTo2;
}
function sendParent(event, options) {
  return sendTo(SpecialTargets.Parent, event, options);
}
function resolveEnqueueActions(actorScope, snapshot, args, actionParams, {
  collect
}) {
  const actions = [];
  const enqueue = function enqueue2(action) {
    actions.push(action);
  };
  enqueue.assign = (...args2) => {
    actions.push(assign(...args2));
  };
  enqueue.cancel = (...args2) => {
    actions.push(cancel(...args2));
  };
  enqueue.raise = (...args2) => {
    actions.push(raise(...args2));
  };
  enqueue.sendTo = (...args2) => {
    actions.push(sendTo(...args2));
  };
  enqueue.sendParent = (...args2) => {
    actions.push(sendParent(...args2));
  };
  enqueue.spawnChild = (...args2) => {
    actions.push(spawnChild(...args2));
  };
  enqueue.stopChild = (...args2) => {
    actions.push(stopChild(...args2));
  };
  enqueue.emit = (...args2) => {
    actions.push(emit(...args2));
  };
  collect({
    context: args.context,
    event: args.event,
    enqueue,
    check: (guard) => evaluateGuard(guard, snapshot.context, args.event, snapshot),
    self: actorScope.self,
    system: actorScope.system
  }, actionParams);
  return [snapshot, void 0, actions];
}
function enqueueActions(collect) {
  function enqueueActions2(_args, _params) {
  }
  enqueueActions2.type = "xstate.enqueueActions";
  enqueueActions2.collect = collect;
  enqueueActions2.resolve = resolveEnqueueActions;
  return enqueueActions2;
}
function resolveLog(_, snapshot, actionArgs, actionParams, {
  value,
  label
}) {
  return [snapshot, {
    value: typeof value === "function" ? value(actionArgs, actionParams) : value,
    label
  }, void 0];
}
function executeLog({
  logger
}, {
  value,
  label
}) {
  if (label) {
    logger(label, value);
  } else {
    logger(value);
  }
}
function log(value = ({
  context,
  event
}) => ({
  context,
  event
}), label) {
  function log2(_args, _params) {
  }
  log2.type = "xstate.log";
  log2.value = value;
  log2.label = label;
  log2.resolve = resolveLog;
  log2.execute = executeLog;
  return log2;
}

// node_modules/xstate/dist/xstate.esm.js
function createMachine(config, implementations) {
  return new StateMachine(config, implementations);
}
function setup({
  schemas,
  actors,
  actions,
  guards,
  delays
}) {
  return {
    assign,
    sendTo,
    raise,
    log,
    cancel,
    stopChild,
    enqueueActions,
    emit,
    spawnChild,
    createStateConfig: (config) => config,
    createAction: (fn) => fn,
    createMachine: (config) => createMachine({
      ...config,
      schemas
    }, {
      actors,
      actions,
      guards,
      delays
    }),
    extend: (extended) => setup({
      schemas,
      actors,
      actions: {
        ...actions,
        ...extended.actions
      },
      guards: {
        ...guards,
        ...extended.guards
      },
      delays: {
        ...delays,
        ...extended.delays
      }
    })
  };
}
var defaultWaitForOptions = {
  timeout: Infinity
  // much more than 10 seconds
};
function waitFor(actorRef, predicate, options) {
  const resolvedOptions = {
    ...defaultWaitForOptions,
    ...options
  };
  return new Promise((res, rej) => {
    const {
      signal
    } = resolvedOptions;
    if (signal?.aborted) {
      rej(signal.reason);
      return;
    }
    let done = false;
    const handle = resolvedOptions.timeout === Infinity ? void 0 : setTimeout(() => {
      dispose();
      rej(new Error(`Timeout of ${resolvedOptions.timeout} ms exceeded`));
    }, resolvedOptions.timeout);
    const dispose = () => {
      clearTimeout(handle);
      done = true;
      sub?.unsubscribe();
      if (abortListener) {
        signal.removeEventListener("abort", abortListener);
      }
    };
    function checkEmitted(emitted) {
      if (predicate(emitted)) {
        dispose();
        res(emitted);
      }
    }
    let abortListener;
    let sub;
    checkEmitted(actorRef.getSnapshot());
    if (done) {
      return;
    }
    if (signal) {
      abortListener = () => {
        dispose();
        rej(signal.reason);
      };
      signal.addEventListener("abort", abortListener);
    }
    sub = actorRef.subscribe({
      next: checkEmitted,
      error: (err) => {
        dispose();
        rej(err);
      },
      complete: () => {
        dispose();
        rej(new Error(`Actor terminated without satisfying predicate`));
      }
    });
    if (done) {
      sub.unsubscribe();
    }
  });
}

// ../../../.spex-workshop-261011/work/T06/graph-crate/spex-packages/contrib/playbooks/en/contrib/contrib.playbook/contrib.fsm.ts
var IMPLEMENT_PROMPT = [
  "Implement this request as one small, reviewable change.",
  "If it gives an issue number, read the issue with gh issue view first.",
  "Read specs/ and the code the change touches before editing anything.",
  "Create a new branch from the current main branch, named for the issue: its number followed by a short slug of its title; for a request without an issue, a short slug of the request.",
  "Implement the change with tests that cover it, and update specs/ and documentation where behaviour changes.",
  "Keep to the issue's scope: no unrelated refactors, formatting churn, or drive-by fixes.",
  "Run cargo test; it must pass before you commit.",
  "Make exactly one commit on that branch, with a clear message that explains what changed and why and references the issue.",
  "Report the branch name, the commit, a short summary of the change, and the cargo test result.",
  "If the request is ambiguous in a way that changes what you would build, ask the maintainer one question before changing files.",
  "If you cannot make cargo test pass or cannot complete the change within the issue's scope, do not commit; report why.",
  "",
  "> Request: <caller-input>"
].join("\n");
var REVIEW_IMPLEMENTATION_PROMPT = [
  "Review this commit as the maintainer on the reviewer rotation would, against the request and the issue it references.",
  "Check correctness, tests that cover the change, no changes unrelated to the issue, and documentation updated where behaviour changed.",
  "Number your findings, and raise only what should block merging \u2014 not style or equally valid alternatives.",
  "Rely on the Contributor's reported cargo test result unless you have reason to doubt it.",
  "Do not edit files or commit; report findings only.",
  "If you have no findings, say plainly that the commit is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Commit: <latest-commit>",
  "> Contributor output: <contributor-output>"
].join("\n");
var ADDRESS_FINDINGS_PROMPT = [
  "Address each numbered finding: fix it, or reject it with reasoning that cites the code or test output.",
  "Keep every fix within the issue's scope.",
  "Run cargo test; it must pass before you commit.",
  "If you fix any finding, make one new commit on the same branch with a clear message that references the issue and the findings it fixes; never amend or rewrite an existing commit.",
  "If you reject every finding, change nothing and make no commit.",
  "Report your disposition of every finding and the cargo test result.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Maintainer findings: <maintainer-output>"
].join("\n");
var REVIEW_FIX_PROMPT = [
  "This is the second and final review round for this branch.",
  "Read the fix commit and the Contributor's dispositions, and review the branch as it now stands.",
  "For each earlier finding, say whether it is resolved; accept a rejection that is well reasoned.",
  "Keep the earlier numbering, and number any new finding after it; raise a new finding only if it should block merging.",
  "Do not edit files or commit; report findings only.",
  "If no findings remain open, say plainly that the branch is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Fix commit: <latest-commit>",
  "> Contributor output: <contributor-output>"
].join("\n");
var REVIEW_REJECTION_PROMPT = [
  "This is the second and final review round for this branch.",
  "The Contributor rejected every finding and made no new commit; read the reasoning.",
  "For each finding, accept the rejection if it is well reasoned, or keep the finding open and say why.",
  "Keep the earlier numbering.",
  "Do not edit files or commit; report findings only.",
  "If no findings remain open, say plainly that the branch is ready for a pull request.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Contributor output: <contributor-output>"
].join("\n");
var OPEN_PULL_REQUEST_PROMPT = [
  "The review passed with no open findings.",
  "Push the branch to origin and open a pull request against main with gh.",
  "Write a description that summarizes the change and how it was tested, and link the issue so that merging closes it.",
  "Do not change or commit anything.",
  "Report the pull request URL and the branch name.",
  "If the push or gh fails, report the error and do not retry more than once.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>"
].join("\n");
var OPEN_DRAFT_PULL_REQUEST_PROMPT = [
  "The review rounds are used up and findings remain open.",
  "Do not change or commit anything.",
  "Push the branch to origin and open a draft pull request against main with gh.",
  'Write a description that summarizes the change and how it was tested, links the issue, and lists every open finding under an "Open findings" heading.',
  "Report the pull request URL, the branch name, and that the pull request is a draft with open findings.",
  "If the push or gh fails, report the error and do not retry more than once.",
  "",
  "> Request: <caller-input>",
  "> Branch: <branch>",
  "> Open findings: <maintainer-output>"
].join("\n");
var NEEDS_BOSS_REPLY_DESCRIPTION = "The acting agent's prose surfaces a clarifying question for Boss that the agent cannot answer alone. Output shall include `question: <verbatim question text from the acting agent's prose>`.";
var IMPLEMENT_RESULT = {
  committed: "Contributor made one commit on a new branch named for the issue, with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`, `branch: <branch name>`, and `latestCommit: <commit identity>`.",
  blocked: "Contributor made no commit and reported why the change cannot be completed; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var REVIEW_IMPLEMENTATION_RESULT = {
  hasFindings: "Maintainer raised one or more numbered findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings: "Maintainer affirmatively reported that the commit is ready and raised no findings; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var ADDRESS_FINDINGS_RESULT = {
  fixed: "Contributor made one new commit on the same branch with cargo test passing; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>` and `latestCommit: <commit identity>`.",
  rejectedAll: "Contributor rejected every finding with reasoning, changed nothing, and made no commit; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var REVIEW_FIX_RESULT = {
  hasFindings: "Maintainer reported one or more findings still open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings: "Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var REVIEW_REJECTION_RESULT = {
  hasFindings: "Maintainer kept one or more findings open; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply. Output shall include `maintainerOutput: <verbatim final text>`.",
  noFindings: "Maintainer affirmatively reported that no findings remain open and the branch is ready; a progress report, status update, or promise of a later result supports no review outcome, and the outcome does not depend on finding numbering or any fixed presentation format of Maintainer's reply.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var OPEN_PULL_REQUEST_RESULT = {
  opened: "Contributor pushed the branch and opened a ready pull request; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL and the branch name to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.",
  notOpened: "Contributor could not push the branch or open the pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var OPEN_DRAFT_PULL_REQUEST_RESULT = {
  openedDraft: "Contributor pushed the branch and opened a draft pull request listing the open findings; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns the pull request URL, the branch name, and the fact that the pull request is a draft with open findings to the caller. Output shall include `pullRequestUrl: <pull request URL>` and `branch: <branch name>`.",
  notOpened: "Contributor could not push the branch or open the draft pull request and reported the error; the outcome does not depend on finding numbering or any fixed presentation format of Contributor's reply. The workflow ends and returns that report to the caller. Output shall include `contributorOutput: <verbatim final text>`.",
  needsBossReply: NEEDS_BOSS_REPLY_DESCRIPTION
};
var STATE_DESCRIPTIONS = {
  ready: "Waiting for the caller to give an issue number or a request.",
  implement: "Contributor implements the request on a new branch with one commit and cargo test passing.",
  reviewImplementation: "Maintainer reviews the Contributor's implementation commit in review round 1.",
  addressFindings: "Contributor fixes or rejects each of Maintainer's round-1 findings, committing any fixes in one new commit.",
  reviewFix: "Maintainer reviews the Contributor's fix commit and dispositions in review round 2, the final round.",
  reviewRejection: "Maintainer reviews the Contributor's rejection of every finding in review round 2, the final round.",
  openPullRequest: "Contributor pushes the branch and opens a ready pull request after a review with no open findings.",
  openDraftPullRequest: "Contributor pushes the branch and opens a draft pull request listing the findings still open after review round 2.",
  awaitBossReply: "Waiting for Boss to answer the acting agent's question.",
  failed: "CONTRIB parked after a failure and waits for the caller to give the issue number or request again.",
  prOpened: "CONTRIB completed: Contributor pushed the branch and opened a ready pull request; the workflow returns the pull request URL and the branch name.",
  draftPrOpened: "CONTRIB completed: Contributor pushed the branch and opened a draft pull request listing the findings still open after the review rounds; the workflow returns the pull request URL, the branch name, and the fact that the pull request is a draft with open findings.",
  implementationBlocked: "CONTRIB failed: Contributor made no commit and reported why the change cannot be completed; the workflow returns that report to the caller.",
  prNotOpened: "CONTRIB failed: Contributor could not push the branch or open the ready or draft pull request and reported the error; the workflow returns that report to the caller."
};
var RESUME_METADATA = {
  implement: { sourceItem: "CONTRIB-1", role: "contributor" },
  reviewImplementation: { sourceItem: "CONTRIB-2", role: "maintainer" },
  addressFindings: { sourceItem: "CONTRIB-3", role: "contributor" },
  reviewFix: { sourceItem: "CONTRIB-4", role: "maintainer" },
  reviewRejection: { sourceItem: "CONTRIB-5", role: "maintainer" },
  openPullRequest: { sourceItem: "CONTRIB-6", role: "contributor" },
  openDraftPullRequest: { sourceItem: "CONTRIB-7", role: "contributor" }
};
var isRecord = (value) => typeof value === "object" && value !== null && !Array.isArray(value);
var isNonEmptyString = (value) => typeof value === "string" && value.trim().length > 0;
var doneOutputOf = (event) => isRecord(event) ? event.output : void 0;
var actorErrorOf = (event) => isRecord(event) ? event.error : void 0;
function playerOutputOf(event) {
  const output = doneOutputOf(event);
  if (!isRecord(output)) return void 0;
  switch (output.guard) {
    case "committed":
      return isNonEmptyString(output.contributorOutput) && isNonEmptyString(output.branch) && isNonEmptyString(output.latestCommit) ? {
        guard: "committed",
        contributorOutput: output.contributorOutput,
        branch: output.branch,
        latestCommit: output.latestCommit
      } : void 0;
    case "blocked":
      return isNonEmptyString(output.contributorOutput) ? { guard: "blocked", contributorOutput: output.contributorOutput } : void 0;
    case "hasFindings":
      return isNonEmptyString(output.maintainerOutput) ? { guard: "hasFindings", maintainerOutput: output.maintainerOutput } : void 0;
    case "noFindings":
      return { guard: "noFindings" };
    case "fixed":
      return isNonEmptyString(output.contributorOutput) && isNonEmptyString(output.latestCommit) ? {
        guard: "fixed",
        contributorOutput: output.contributorOutput,
        latestCommit: output.latestCommit
      } : void 0;
    case "rejectedAll":
      return isNonEmptyString(output.contributorOutput) ? { guard: "rejectedAll", contributorOutput: output.contributorOutput } : void 0;
    case "opened":
    case "openedDraft":
      return isNonEmptyString(output.pullRequestUrl) && isNonEmptyString(output.branch) ? {
        guard: output.guard,
        pullRequestUrl: output.pullRequestUrl,
        branch: output.branch
      } : void 0;
    case "notOpened":
      return isNonEmptyString(output.contributorOutput) ? { guard: "notOpened", contributorOutput: output.contributorOutput } : void 0;
    case "needsBossReply":
      return isNonEmptyString(output.question) ? { guard: "needsBossReply", question: output.question } : void 0;
    default:
      return void 0;
  }
}
var RUN_FIELDS = [
  "callerInput",
  "branch",
  "latestCommit",
  "contributorOutput",
  "maintainerOutput",
  "contributorOutcome",
  "reviewRound",
  "reviewVerdict",
  "pullRequestUrl",
  "completion",
  "lastError",
  "pendingBossQuestion",
  "bossReply"
];
function cleared(context, keys) {
  const update = {};
  for (const key of keys) {
    if (context[key] !== void 0) update[key] = void 0;
  }
  return update;
}
function errorRecord(value) {
  if (value instanceof Error) {
    return {
      name: value.name || "Error",
      message: value.message,
      ...typeof value.stack === "string" ? { stack: value.stack } : {}
    };
  }
  if (isRecord(value) && typeof value.message === "string") {
    return {
      name: isNonEmptyString(value.name) ? value.name : "Error",
      message: value.message
    };
  }
  return { name: "Error", message: String(value) };
}
var acceptsOutcome = (outcome) => ({ event }) => playerOutputOf(event)?.guard === outcome;
var validStartContrib = ({ event }) => event.type === "START_CONTRIB" && isNonEmptyString(event.callerInput);
var repliesToPendingQuestion = ({ context, event }) => event.type === "BOSS_REPLY" && context.pendingBossQuestion !== void 0 && (event.questionId === void 0 || event.questionId === context.pendingBossQuestion.questionId);
var emptyBossReply = (args) => repliesToPendingQuestion(args) && args.event.type === "BOSS_REPLY" && !isNonEmptyString(args.event.answer);
var INTERRUPT_PRECONDITIONS = {
  implement: (context) => isNonEmptyString(context.callerInput),
  reviewImplementation: (context) => context.contributorOutcome === "committed" && isNonEmptyString(context.branch) && isNonEmptyString(context.latestCommit) && isNonEmptyString(context.contributorOutput),
  addressFindings: (context) => context.reviewRound === 1 && context.reviewVerdict === "hasFindings" && isNonEmptyString(context.branch) && isNonEmptyString(context.maintainerOutput),
  reviewFix: (context) => context.contributorOutcome === "fixed" && isNonEmptyString(context.branch) && isNonEmptyString(context.latestCommit) && isNonEmptyString(context.contributorOutput),
  reviewRejection: (context) => context.contributorOutcome === "rejectedAll" && isNonEmptyString(context.branch) && isNonEmptyString(context.contributorOutput),
  openPullRequest: (context) => context.reviewVerdict === "noFindings" && isNonEmptyString(context.branch),
  openDraftPullRequest: (context) => context.reviewRound === 2 && context.reviewVerdict === "hasFindings" && isNonEmptyString(context.branch) && isNonEmptyString(context.maintainerOutput)
};
function bossInterrupts(ids) {
  return ids.map((id) => ({
    guard: ({ context, event }) => event.type === "BOSS_INTERRUPT" && event.targetId === id && INTERRUPT_PRECONDITIONS[id](context),
    target: `#${id}`,
    reenter: true,
    actions: "resetForInterrupt"
  }));
}
function resumableStates(ids) {
  return ids.map((id) => ({
    guard: (args) => repliesToPendingQuestion(args) && args.event.type === "BOSS_REPLY" && isNonEmptyString(args.event.answer) && args.context.pendingBossQuestion?.resumeStateId === id,
    target: `#${id}`,
    reenter: true,
    actions: "rememberBossReply"
  }));
}
var bossReplyFields = (context) => ({
  ...context.pendingBossQuestion !== void 0 ? { pendingBossQuestion: context.pendingBossQuestion } : {},
  ...context.bossReply !== void 0 ? { bossReply: context.bossReply } : {}
});
var callerInputField = (context) => context.callerInput !== void 0 ? { callerInput: context.callerInput } : {};
var branchField = (context) => context.branch !== void 0 ? { branch: context.branch } : {};
var latestCommitField = (context) => context.latestCommit !== void 0 ? { latestCommit: context.latestCommit } : {};
var contributorOutputField = (context) => context.contributorOutput !== void 0 ? { contributorOutput: context.contributorOutput } : {};
var maintainerOutputField = (context) => context.maintainerOutput !== void 0 ? { maintainerOutput: context.maintainerOutput } : {};
var acceptedOutcome = (source, target, outcome) => ({
  type: "playbook.acceptedOutcome",
  params: { source, target, acceptedOutcome: outcome }
});
var noFindingsArm = (source, round) => ({
  guard: "acceptNoFindings",
  target: "#openPullRequest",
  actions: [
    acceptedOutcome(source, "openPullRequest", "noFindings"),
    { type: "rememberReviewPassed", params: { round } },
    "clearBossReplyContext"
  ]
});
var roundTwoHasFindingsArm = (source) => ({
  guard: "acceptHasFindings",
  target: "#openDraftPullRequest",
  actions: [
    acceptedOutcome(source, "openDraftPullRequest", "hasFindings"),
    { type: "rememberFindings", params: { round: 2 } },
    "clearBossReplyContext"
  ]
});
var notOpenedArm = (source) => ({
  guard: "acceptNotOpened",
  target: "#prNotOpened",
  actions: [
    acceptedOutcome(source, "prNotOpened", "notOpened"),
    "rememberNotOpened",
    "clearBossReplyContext"
  ]
});
var suspendArm = (source) => ({
  guard: "acceptNeedsBossReply",
  target: "#awaitBossReply",
  actions: [
    acceptedOutcome(source, "awaitBossReply", "needsBossReply"),
    { type: "setPendingBossQuestion", params: { resumeStateId: source } }
  ]
});
var malformedPlayerOutputArm = {
  target: "#failed",
  actions: ["rememberMalformedPlayerOutput", "clearBossReplyContext"]
};
var playerOnError = {
  target: "#failed",
  actions: ["rememberActorError", "clearBossReplyContext"]
};
var startContribArm = {
  guard: "validStartContrib",
  target: "#implement",
  actions: "startContrib"
};
var meta = (stateId, role) => ({
  playbook: {
    stateId,
    description: STATE_DESCRIPTIONS[stateId],
    ...role === void 0 ? {} : { role }
  }
});
var finalMeta = (stateId, terminal) => ({
  playbook: {
    stateId,
    description: STATE_DESCRIPTIONS[stateId],
    terminal
  }
});
var contribMachine = setup({
  types: {
    context: {},
    events: {},
    input: {},
    output: {}
  },
  actors: {
    player: fromPromise(async () => {
      throw new Error("player actor must be provided by the runner");
    })
  },
  actions: {
    "playbook.acceptedOutcome": (_args, _params) => void 0,
    startContrib: assign(
      ({ context, event }) => event.type === "START_CONTRIB" ? { ...cleared(context, RUN_FIELDS), callerInput: event.callerInput } : {}
    ),
    resetForInterrupt: assign(
      ({ context }) => cleared(context, ["lastError", "pendingBossQuestion", "bossReply"])
    ),
    rememberImplementation: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === "committed" ? {
        ...cleared(context, [
          "maintainerOutput",
          "reviewRound",
          "reviewVerdict",
          "lastError"
        ]),
        contributorOutput: output.contributorOutput,
        branch: output.branch,
        latestCommit: output.latestCommit,
        contributorOutcome: "committed"
      } : {};
    }),
    rememberBlocked: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === "blocked" ? {
        ...cleared(context, ["lastError"]),
        contributorOutput: output.contributorOutput,
        completion: "blocked"
      } : {};
    }),
    rememberFindings: assign(
      ({ context, event }, params) => {
        const output = playerOutputOf(event);
        return output?.guard === "hasFindings" ? {
          ...cleared(context, ["lastError"]),
          maintainerOutput: output.maintainerOutput,
          reviewRound: params.round,
          reviewVerdict: "hasFindings"
        } : {};
      }
    ),
    rememberReviewPassed: assign(
      ({ context, event }, params) => playerOutputOf(event)?.guard === "noFindings" ? {
        ...cleared(context, ["lastError"]),
        reviewRound: params.round,
        reviewVerdict: "noFindings"
      } : {}
    ),
    rememberContributorDisposition: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      if (output?.guard === "fixed") {
        return {
          ...cleared(context, ["lastError"]),
          contributorOutput: output.contributorOutput,
          latestCommit: output.latestCommit,
          contributorOutcome: "fixed"
        };
      }
      if (output?.guard === "rejectedAll") {
        return {
          ...cleared(context, ["lastError"]),
          contributorOutput: output.contributorOutput,
          contributorOutcome: "rejectedAll"
        };
      }
      return {};
    }),
    rememberPullRequest: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === "opened" || output?.guard === "openedDraft" ? {
        ...cleared(context, ["lastError"]),
        pullRequestUrl: output.pullRequestUrl,
        branch: output.branch,
        completion: output.guard
      } : {};
    }),
    rememberNotOpened: assign(({ context, event }) => {
      const output = playerOutputOf(event);
      return output?.guard === "notOpened" ? {
        ...cleared(context, ["lastError"]),
        contributorOutput: output.contributorOutput,
        completion: "notOpened"
      } : {};
    }),
    setPendingBossQuestion: assign(
      ({ context, event }, params) => {
        const output = playerOutputOf(event);
        if (output?.guard !== "needsBossReply") return {};
        const metadata = RESUME_METADATA[params.resumeStateId];
        const pendingBossQuestion = {
          questionId: params.resumeStateId,
          resumeStateId: params.resumeStateId,
          sourceItem: metadata.sourceItem,
          asker: { kind: "role", roleId: metadata.role },
          question: output.question
        };
        return {
          ...cleared(context, ["bossReply", "lastError"]),
          pendingBossQuestion
        };
      }
    ),
    rememberBossReply: assign(
      ({ event }) => event.type === "BOSS_REPLY" ? { bossReply: event.answer } : {}
    ),
    clearBossReplyContext: assign(
      ({ context }) => cleared(context, ["pendingBossQuestion", "bossReply"])
    ),
    rememberActorError: assign(({ event }) => ({
      lastError: errorRecord(actorErrorOf(event))
    })),
    rememberMalformedPlayerOutput: assign(({ event }) => {
      const output = doneOutputOf(event);
      return {
        lastError: {
          name: "MalformedPlayerOutput",
          message: isRecord(output) && output.guard === "needsBossReply" ? "Player output declared needsBossReply without a question." : "Player output did not match an outcome declared for the working state."
        }
      };
    }),
    rememberMalformedBossReply: assign({
      lastError: {
        name: "MalformedBossReply",
        message: "BOSS_REPLY carried an empty answer."
      }
    })
  },
  guards: {
    acceptCommitted: acceptsOutcome("committed"),
    acceptBlocked: acceptsOutcome("blocked"),
    acceptHasFindings: acceptsOutcome("hasFindings"),
    acceptNoFindings: acceptsOutcome("noFindings"),
    acceptFixed: acceptsOutcome("fixed"),
    acceptRejectedAll: acceptsOutcome("rejectedAll"),
    acceptOpened: acceptsOutcome("opened"),
    acceptOpenedDraft: acceptsOutcome("openedDraft"),
    acceptNotOpened: acceptsOutcome("notOpened"),
    acceptNeedsBossReply: acceptsOutcome("needsBossReply"),
    validStartContrib,
    emptyBossReply
  }
}).createMachine({
  id: "contrib",
  initial: "ready",
  context: {},
  output: ({ context }) => {
    switch (context.completion) {
      case "opened":
      case "openedDraft":
        if (!isNonEmptyString(context.pullRequestUrl) || !isNonEmptyString(context.branch)) {
          throw new Error(
            "CONTRIB opened a pull request without its URL and branch name"
          );
        }
        return context.completion === "opened" ? {
          status: "opened",
          pullRequestUrl: context.pullRequestUrl,
          branch: context.branch
        } : {
          status: "openedDraft",
          pullRequestUrl: context.pullRequestUrl,
          branch: context.branch,
          draftWithOpenFindings: true
        };
      case "blocked":
      case "notOpened":
        if (!isNonEmptyString(context.contributorOutput)) {
          throw new Error("CONTRIB failed without the Contributor's report");
        }
        return {
          status: context.completion,
          contributorOutput: context.contributorOutput
        };
      default:
        throw new Error("CONTRIB reached a final state without a recorded completion");
    }
  },
  on: {
    BOSS_INTERRUPT: bossInterrupts([
      "implement",
      "reviewImplementation",
      "addressFindings",
      "reviewFix",
      "reviewRejection",
      "openPullRequest",
      "openDraftPullRequest"
    ])
  },
  states: {
    ready: {
      id: "ready",
      tags: "playbook.parked",
      description: STATE_DESCRIPTIONS.ready,
      meta: meta("ready"),
      on: {
        START_CONTRIB: startContribArm
      }
    },
    implement: {
      id: "implement",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.implement,
      meta: meta("implement", "contributor"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "implement",
          role: "contributor",
          sourceItem: "CONTRIB-1",
          prompt: IMPLEMENT_PROMPT,
          result: IMPLEMENT_RESULT,
          ...callerInputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          {
            guard: "acceptCommitted",
            target: "#reviewImplementation",
            actions: [
              acceptedOutcome("implement", "reviewImplementation", "committed"),
              "rememberImplementation",
              "clearBossReplyContext"
            ]
          },
          {
            guard: "acceptBlocked",
            target: "#implementationBlocked",
            actions: [
              acceptedOutcome("implement", "implementationBlocked", "blocked"),
              "rememberBlocked",
              "clearBossReplyContext"
            ]
          },
          suspendArm("implement"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    reviewImplementation: {
      id: "reviewImplementation",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.reviewImplementation,
      meta: meta("reviewImplementation", "maintainer"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "reviewImplementation",
          role: "maintainer",
          sourceItem: "CONTRIB-2",
          prompt: REVIEW_IMPLEMENTATION_PROMPT,
          result: REVIEW_IMPLEMENTATION_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...latestCommitField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          {
            guard: "acceptHasFindings",
            target: "#addressFindings",
            actions: [
              acceptedOutcome("reviewImplementation", "addressFindings", "hasFindings"),
              { type: "rememberFindings", params: { round: 1 } },
              "clearBossReplyContext"
            ]
          },
          noFindingsArm("reviewImplementation", 1),
          suspendArm("reviewImplementation"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    addressFindings: {
      id: "addressFindings",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.addressFindings,
      meta: meta("addressFindings", "contributor"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "addressFindings",
          role: "contributor",
          sourceItem: "CONTRIB-3",
          prompt: ADDRESS_FINDINGS_PROMPT,
          result: ADDRESS_FINDINGS_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...maintainerOutputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          {
            guard: "acceptFixed",
            target: "#reviewFix",
            actions: [
              acceptedOutcome("addressFindings", "reviewFix", "fixed"),
              "rememberContributorDisposition",
              "clearBossReplyContext"
            ]
          },
          {
            guard: "acceptRejectedAll",
            target: "#reviewRejection",
            actions: [
              acceptedOutcome("addressFindings", "reviewRejection", "rejectedAll"),
              "rememberContributorDisposition",
              "clearBossReplyContext"
            ]
          },
          suspendArm("addressFindings"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    reviewFix: {
      id: "reviewFix",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.reviewFix,
      meta: meta("reviewFix", "maintainer"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "reviewFix",
          role: "maintainer",
          sourceItem: "CONTRIB-4",
          prompt: REVIEW_FIX_PROMPT,
          result: REVIEW_FIX_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...latestCommitField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          roundTwoHasFindingsArm("reviewFix"),
          noFindingsArm("reviewFix", 2),
          suspendArm("reviewFix"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    reviewRejection: {
      id: "reviewRejection",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.reviewRejection,
      meta: meta("reviewRejection", "maintainer"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "reviewRejection",
          role: "maintainer",
          sourceItem: "CONTRIB-5",
          prompt: REVIEW_REJECTION_PROMPT,
          result: REVIEW_REJECTION_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...contributorOutputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          roundTwoHasFindingsArm("reviewRejection"),
          noFindingsArm("reviewRejection", 2),
          suspendArm("reviewRejection"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    openPullRequest: {
      id: "openPullRequest",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.openPullRequest,
      meta: meta("openPullRequest", "contributor"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "openPullRequest",
          role: "contributor",
          sourceItem: "CONTRIB-6",
          prompt: OPEN_PULL_REQUEST_PROMPT,
          result: OPEN_PULL_REQUEST_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          {
            guard: "acceptOpened",
            target: "#prOpened",
            actions: [
              acceptedOutcome("openPullRequest", "prOpened", "opened"),
              "rememberPullRequest",
              "clearBossReplyContext"
            ]
          },
          notOpenedArm("openPullRequest"),
          suspendArm("openPullRequest"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    openDraftPullRequest: {
      id: "openDraftPullRequest",
      tags: "playbook.busy",
      description: STATE_DESCRIPTIONS.openDraftPullRequest,
      meta: meta("openDraftPullRequest", "contributor"),
      invoke: {
        src: "player",
        input: ({ context }) => ({
          stateId: "openDraftPullRequest",
          role: "contributor",
          sourceItem: "CONTRIB-7",
          prompt: OPEN_DRAFT_PULL_REQUEST_PROMPT,
          result: OPEN_DRAFT_PULL_REQUEST_RESULT,
          ...callerInputField(context),
          ...branchField(context),
          ...maintainerOutputField(context),
          ...bossReplyFields(context)
        }),
        onDone: [
          {
            guard: "acceptOpenedDraft",
            target: "#draftPrOpened",
            actions: [
              acceptedOutcome("openDraftPullRequest", "draftPrOpened", "openedDraft"),
              "rememberPullRequest",
              "clearBossReplyContext"
            ]
          },
          notOpenedArm("openDraftPullRequest"),
          suspendArm("openDraftPullRequest"),
          malformedPlayerOutputArm
        ],
        onError: playerOnError
      }
    },
    awaitBossReply: {
      id: "awaitBossReply",
      tags: "playbook.parked",
      description: STATE_DESCRIPTIONS.awaitBossReply,
      meta: meta("awaitBossReply"),
      on: {
        BOSS_REPLY: [
          {
            guard: "emptyBossReply",
            target: "failed",
            actions: ["rememberMalformedBossReply", "clearBossReplyContext"]
          },
          ...resumableStates([
            "implement",
            "reviewImplementation",
            "addressFindings",
            "reviewFix",
            "reviewRejection",
            "openPullRequest",
            "openDraftPullRequest"
          ])
        ],
        START_CONTRIB: startContribArm
      }
    },
    failed: {
      id: "failed",
      tags: "playbook.parked",
      description: STATE_DESCRIPTIONS.failed,
      meta: meta("failed"),
      on: {
        START_CONTRIB: startContribArm
      }
    },
    prOpened: {
      id: "prOpened",
      type: "final",
      description: STATE_DESCRIPTIONS.prOpened,
      meta: finalMeta("prOpened", "success")
    },
    draftPrOpened: {
      id: "draftPrOpened",
      type: "final",
      description: STATE_DESCRIPTIONS.draftPrOpened,
      meta: finalMeta("draftPrOpened", "success")
    },
    implementationBlocked: {
      id: "implementationBlocked",
      type: "final",
      description: STATE_DESCRIPTIONS.implementationBlocked,
      meta: finalMeta("implementationBlocked", "failure")
    },
    prNotOpened: {
      id: "prNotOpened",
      type: "final",
      description: STATE_DESCRIPTIONS.prNotOpened,
      meta: finalMeta("prNotOpened", "failure")
    }
  }
});

// node_modules/@sublang/playbook/src/xstate-runtime.js
import { createHash } from "node:crypto";
import { isDeepStrictEqual as isDeepStrictEqual2 } from "node:util";

// node_modules/@sublang/playbook/src/runtime.js
var PLAYBOOK_FAILURE_CODES = [
  "commit-missing",
  "commit-residual",
  "pre-existing-lost",
  "commits-more-than-one",
  "history-rewritten",
  "foreign-change",
  "observation-unstable",
  "attribution-ambiguous",
  "receipt-missing",
  "judge-failed",
  "player-failed",
  "aborted",
  "child-failed",
  "runtime-defect"
];
var FAILURE_EVIDENCE_MEMBERS = {
  "commit-missing": {
    required: ["required", "observed", "baselineHead", "afterHead", "paths"],
    optional: [],
    paths: ["uncommitted"]
  },
  "commit-residual": {
    required: ["required", "observed", "baselineHead", "afterHead", "paths"],
    optional: ["commitOid"],
    paths: ["uncommitted", "altered"]
  },
  "pre-existing-lost": {
    required: ["required", "observed", "baselineHead", "paths"],
    optional: ["afterHead"],
    paths: ["lost"]
  },
  "commits-more-than-one": {
    required: ["required", "observed", "baselineHead", "afterHead"],
    optional: [],
    paths: []
  },
  "history-rewritten": {
    required: ["required", "observed", "baselineHead", "afterHead"],
    optional: [],
    paths: []
  },
  "foreign-change": {
    required: ["required", "observed", "baselineHead", "afterHead", "paths"],
    optional: [],
    paths: ["changed"]
  },
  "observation-unstable": {
    required: ["required", "observed", "baselineHead"],
    optional: [],
    paths: []
  },
  "attribution-ambiguous": {
    required: ["required", "observed", "baselineHead"],
    optional: ["afterHead"],
    paths: []
  },
  "receipt-missing": { required: ["baselineHead"], optional: [], paths: [] },
  "judge-failed": { required: ["reason"], optional: ["error"], paths: [] },
  "player-failed": {
    required: ["roleId", "error"],
    optional: ["playerId", "errorCode"],
    paths: []
  },
  aborted: { required: [], optional: [], paths: [] },
  "child-failed": { required: ["playbookId"], optional: ["cause"], paths: [] },
  "runtime-defect": { required: ["reason"], optional: [], paths: [] }
};
var FAILURE_PATH_LIMIT = 32;
var FAILURE_CAUSE_DEPTH_LIMIT = 4;
var REPOSITORY_DISPOSITIONS = [
  "unchanged",
  "one-descendant-commit",
  "deferred"
];
var RECEIPT_CLASSIFICATIONS = [
  "unchanged",
  "one-descendant-commit",
  "multiple-commits",
  "rewritten-or-non-descendant",
  "worktree-only-change",
  "concurrent-or-foreign-change",
  "observation-ambiguous"
];
function failureCauseRecord(value, path) {
  if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    throw new TypeError(`${path} must be a plain object`);
  }
  return value;
}
function failureCauseString(value, path) {
  if (typeof value !== "string" || value.length === 0) {
    throw new TypeError(`${path} must be a nonempty string`);
  }
  return value;
}
function failureCausePathList(value, path) {
  if (!Array.isArray(value))
    throw new TypeError(`${path} must be an array`);
  if (value.length > FAILURE_PATH_LIMIT) {
    throw new TypeError(`${path} must hold at most ${FAILURE_PATH_LIMIT} paths`);
  }
  const paths = value.map((entry2, index) => failureCauseString(entry2, `${path}[${index}]`));
  for (const [index, entry2] of paths.entries()) {
    if (index > 0 && !(paths[index - 1] < entry2)) {
      throw new TypeError(`${path} must be sorted and free of duplicates`);
    }
  }
  return Object.freeze(paths);
}
function failureCausePaths(value, admitted, path) {
  const record = failureCauseRecord(value, path);
  const allowed = /* @__PURE__ */ new Set([...admitted, "truncated"]);
  for (const key of Object.keys(record)) {
    if (!allowed.has(key)) {
      throw new TypeError(`${path} must not carry ${JSON.stringify(key)}`);
    }
  }
  const paths = {};
  for (const member of admitted) {
    if (!Object.hasOwn(record, member)) {
      throw new TypeError(`${path}.${member} is required`);
    }
    paths[member] = failureCausePathList(record[member], `${path}.${member}`);
  }
  if (Object.hasOwn(record, "truncated")) {
    const truncated = record.truncated;
    if (typeof truncated !== "number" || !Number.isSafeInteger(truncated) || truncated <= 0) {
      throw new TypeError(`${path}.truncated must be a positive integer`);
    }
    paths.truncated = truncated;
  }
  return Object.freeze(paths);
}
function failureCauseErrorEvidence(value, path) {
  const record = failureCauseRecord(value, path);
  for (const key of Object.keys(record)) {
    if (key !== "name" && key !== "message") {
      throw new TypeError(`${path} must not carry ${JSON.stringify(key)}`);
    }
  }
  if (typeof record.message !== "string") {
    throw new TypeError(`${path}.message must be a string`);
  }
  return Object.freeze({
    name: failureCauseString(record.name, `${path}.name`),
    message: record.message
  });
}
function validateFailureCause(value, path, depth) {
  if (depth > FAILURE_CAUSE_DEPTH_LIMIT) {
    throw new TypeError(`${path} must nest at most ${FAILURE_CAUSE_DEPTH_LIMIT} causes`);
  }
  const record = failureCauseRecord(value, path);
  for (const key of Object.keys(record)) {
    if (key !== "code" && key !== "evidence") {
      throw new TypeError(`${path} must not carry ${JSON.stringify(key)}`);
    }
  }
  const code = record.code;
  if (typeof code !== "string" || !PLAYBOOK_FAILURE_CODES.includes(code)) {
    throw new TypeError(`${path}.code must be one of the declared codes`);
  }
  const spec = FAILURE_EVIDENCE_MEMBERS[code];
  const evidenceRecord = failureCauseRecord(record.evidence, `${path}.evidence`);
  const allowed = /* @__PURE__ */ new Set([...spec.required, ...spec.optional]);
  for (const key of Object.keys(evidenceRecord)) {
    if (!allowed.has(key)) {
      throw new TypeError(`${path}.evidence must not carry ${JSON.stringify(key)}`);
    }
  }
  const evidence = {};
  for (const member of [...spec.required, ...spec.optional]) {
    const required = spec.required.includes(member);
    if (!Object.hasOwn(evidenceRecord, member)) {
      if (required) {
        throw new TypeError(`${path}.evidence.${member} is required`);
      }
      continue;
    }
    const memberValue = evidenceRecord[member];
    const memberPath = `${path}.evidence.${member}`;
    if (member === "required") {
      if (!REPOSITORY_DISPOSITIONS.includes(memberValue)) {
        throw new TypeError(`${memberPath} must be a repository disposition`);
      }
      evidence[member] = memberValue;
    } else if (member === "observed") {
      if (!RECEIPT_CLASSIFICATIONS.includes(memberValue)) {
        throw new TypeError(`${memberPath} must be a receipt classification`);
      }
      evidence[member] = memberValue;
    } else if (member === "paths") {
      evidence[member] = failureCausePaths(memberValue, spec.paths, memberPath);
    } else if (member === "error") {
      evidence[member] = failureCauseErrorEvidence(memberValue, memberPath);
    } else if (member === "cause") {
      evidence[member] = validateFailureCause(memberValue, memberPath, depth + 1);
    } else {
      evidence[member] = failureCauseString(memberValue, memberPath);
    }
  }
  return Object.freeze({
    code,
    evidence: Object.freeze(evidence)
  });
}
function assertPlaybookFailureCause(value) {
  return validateFailureCause(value, "playbook failure cause", 1);
}

// node_modules/@sublang/playbook/src/xstate-playbook-runtime.js
import { spawn } from "node:child_process";
import { randomUUID } from "node:crypto";
import { isDeepStrictEqual } from "node:util";

// node_modules/eventemitter3/index.mjs
var import_index = __toESM(require_eventemitter3(), 1);

// node_modules/p-timeout/index.js
var TimeoutError = class _TimeoutError extends Error {
  name = "TimeoutError";
  constructor(message, options) {
    super(message, options);
    Error.captureStackTrace?.(this, _TimeoutError);
  }
};
var getAbortedReason = (signal) => signal.reason ?? new DOMException("This operation was aborted.", "AbortError");
function pTimeout(promise, options) {
  const {
    milliseconds,
    fallback,
    message,
    customTimers = { setTimeout, clearTimeout },
    signal
  } = options;
  let timer;
  let abortHandler;
  const wrappedPromise = new Promise((resolve, reject) => {
    if (typeof milliseconds !== "number" || Math.sign(milliseconds) !== 1) {
      throw new TypeError(`Expected \`milliseconds\` to be a positive number, got \`${milliseconds}\``);
    }
    if (signal?.aborted) {
      reject(getAbortedReason(signal));
      promise.then(resolve, reject);
      return;
    }
    if (signal) {
      abortHandler = () => {
        reject(getAbortedReason(signal));
      };
      signal.addEventListener("abort", abortHandler, { once: true });
    }
    promise.then(resolve, reject);
    if (milliseconds === Number.POSITIVE_INFINITY) {
      return;
    }
    const timeoutError = new TimeoutError();
    timer = customTimers.setTimeout.call(void 0, () => {
      if (fallback) {
        try {
          resolve(fallback());
        } catch (error) {
          reject(error);
        }
        return;
      }
      if (typeof promise.cancel === "function") {
        promise.cancel();
      }
      if (message === false) {
        resolve();
      } else if (message instanceof Error) {
        reject(message);
      } else {
        timeoutError.message = message ?? `Promise timed out after ${milliseconds} milliseconds`;
        reject(timeoutError);
      }
    }, milliseconds);
  });
  const cancelablePromise = wrappedPromise.finally(() => {
    cancelablePromise.clear();
    if (abortHandler && signal) {
      signal.removeEventListener("abort", abortHandler);
    }
  });
  cancelablePromise.clear = () => {
    customTimers.clearTimeout.call(void 0, timer);
    timer = void 0;
  };
  return cancelablePromise;
}

// node_modules/p-queue/dist/lower-bound.js
function lowerBound(array, value, comparator) {
  let first = 0;
  let count = array.length;
  while (count > 0) {
    const step = Math.trunc(count / 2);
    let it = first + step;
    if (comparator(array[it], value) <= 0) {
      first = ++it;
      count -= step + 1;
    } else {
      count = step;
    }
  }
  return first;
}

// node_modules/p-queue/dist/priority-queue.js
var compactionThreshold = 100;
var PriorityQueue = class {
  #queue = [];
  // The queue is stored as a sorted array, but dequeued items are left before `#head` until compaction. Only items from `#head` onward are live, which keeps repeated dequeues amortized O(1).
  #head = 0;
  enqueue(run, options) {
    const { priority = 0, id } = options ?? {};
    const { size } = this;
    const element = {
      priority,
      id,
      run
    };
    if (size === 0) {
      this.#queue.length = 0;
      this.#head = 0;
      this.#queue.push(element);
      return;
    }
    if (this.#queue.at(-1).priority >= priority) {
      this.#queue.push(element);
      return;
    }
    this.#compact();
    const index = lowerBound(this.#queue, element, (a, b) => b.priority - a.priority);
    this.#queue.splice(index, 0, element);
  }
  setPriority(id, priority) {
    const index = this.#queue.findIndex((element, index2) => index2 >= this.#head && element.id === id);
    if (index === -1) {
      throw new ReferenceError(`No promise function with the id "${id}" exists in the queue.`);
    }
    const [item] = this.#queue.splice(index, 1);
    this.enqueue(item.run, { priority, id });
  }
  remove(idOrRun) {
    const index = this.#queue.findIndex((element, index2) => {
      if (index2 < this.#head) {
        return false;
      }
      if (typeof idOrRun === "string") {
        return element.id === idOrRun;
      }
      return element.run === idOrRun;
    });
    if (index !== -1) {
      this.#queue.splice(index, 1);
    }
  }
  dequeue() {
    if (this.#head === this.#queue.length) {
      return void 0;
    }
    const item = this.#queue[this.#head];
    this.#head++;
    if (this.#head === this.#queue.length) {
      this.#queue.length = 0;
      this.#head = 0;
    } else if (this.#head > compactionThreshold && this.#head > this.#queue.length / 2) {
      this.#compact();
    }
    return item?.run;
  }
  filter(options) {
    const result = [];
    for (let index = this.#head; index < this.#queue.length; index++) {
      const element = this.#queue[index];
      if (element.priority === options.priority) {
        result.push(element.run);
      }
    }
    return result;
  }
  get size() {
    return this.#queue.length - this.#head;
  }
  #compact() {
    if (this.#head === 0) {
      return;
    }
    this.#queue.splice(0, this.#head);
    this.#head = 0;
  }
};

// node_modules/p-queue/dist/index.js
var PQueue = class extends import_index.default {
  #carryoverIntervalCount;
  #isIntervalIgnored;
  #intervalCount = 0;
  #intervalCap;
  #rateLimitedInInterval = false;
  #rateLimitFlushScheduled = false;
  #interval;
  /*
  Timestamp when the current interval window ends. Kept accurate at every window transition: `#initializeIntervalIfNeeded` sets it when a window starts and `#onInterval` advances it as the recurring timer rolls into each new window. This is the source of truth for whether a task added after the queue goes idle belongs to a fresh window, so it must not go stale.
  */
  #intervalEnd = 0;
  // Recurring timer that drives windows while the queue is actively processing. Absent (`undefined`) once the queue goes idle.
  #intervalId;
  // One-shot timer used while idle to resume at the next window boundary, since `#intervalId` is cleared when idle.
  #timeoutId;
  #strict;
  // Circular buffer implementation for better performance
  #strictTicks = [];
  #strictTicksStartIndex = 0;
  #queue;
  #queueClass;
  #pending = 0;
  // The `!` is needed because of https://github.com/microsoft/TypeScript/issues/32194
  #concurrency;
  #isPaused;
  // Use to assign a unique identifier to a promise function, if not explicitly specified
  #idAssigner = 1n;
  // Track currently running tasks for debugging
  #runningTasks = /* @__PURE__ */ new Map();
  #queueAbortListenerCleanupFunctions = /* @__PURE__ */ new Set();
  /**
      Get or set the default timeout for all tasks. Can be changed at runtime.
  
      Operations will throw a `TimeoutError` if they don't complete within the specified time.
  
      The timeout begins when the operation is dequeued and starts execution, not while it's waiting in the queue.
  
      @example
      ```
      const queue = new PQueue({timeout: 5000});
  
      // Change timeout for all future tasks
      queue.timeout = 10000;
      ```
      */
  timeout;
  constructor(options) {
    super();
    options = {
      carryoverIntervalCount: false,
      intervalCap: Number.POSITIVE_INFINITY,
      interval: 0,
      concurrency: Number.POSITIVE_INFINITY,
      autoStart: true,
      queueClass: PriorityQueue,
      strict: false,
      ...options
    };
    if (!(typeof options.intervalCap === "number" && options.intervalCap >= 1)) {
      throw new TypeError(`Expected \`intervalCap\` to be a number from 1 and up, got \`${options.intervalCap?.toString() ?? ""}\` (${typeof options.intervalCap})`);
    }
    if (options.interval === void 0 || !(Number.isFinite(options.interval) && options.interval >= 0)) {
      throw new TypeError(`Expected \`interval\` to be a finite number >= 0, got \`${options.interval?.toString() ?? ""}\` (${typeof options.interval})`);
    }
    if (options.strict && options.interval === 0) {
      throw new TypeError("The `strict` option requires a non-zero `interval`");
    }
    if (options.strict && options.intervalCap === Number.POSITIVE_INFINITY) {
      throw new TypeError("The `strict` option requires a finite `intervalCap`");
    }
    this.#carryoverIntervalCount = options.carryoverIntervalCount ?? options.carryoverConcurrencyCount ?? false;
    this.#isIntervalIgnored = options.intervalCap === Number.POSITIVE_INFINITY || options.interval === 0;
    this.#intervalCap = options.intervalCap;
    this.#interval = options.interval;
    this.#strict = options.strict;
    this.#queue = new options.queueClass();
    this.#queueClass = options.queueClass;
    this.concurrency = options.concurrency;
    if (options.timeout !== void 0 && !(Number.isFinite(options.timeout) && options.timeout > 0)) {
      throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${options.timeout}\` (${typeof options.timeout})`);
    }
    this.timeout = options.timeout;
    this.#isPaused = options.autoStart === false;
    this.#setupRateLimitTracking();
  }
  #cleanupStrictTicks(now) {
    while (this.#strictTicksStartIndex < this.#strictTicks.length) {
      const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
      if (oldestTick !== void 0 && now - oldestTick >= this.#interval) {
        this.#strictTicksStartIndex++;
      } else {
        break;
      }
    }
    const shouldCompact = this.#strictTicksStartIndex > 100 && this.#strictTicksStartIndex > this.#strictTicks.length / 2 || this.#strictTicksStartIndex === this.#strictTicks.length;
    if (shouldCompact) {
      this.#strictTicks = this.#strictTicks.slice(this.#strictTicksStartIndex);
      this.#strictTicksStartIndex = 0;
    }
  }
  // Helper methods for interval consumption
  #consumeIntervalSlot(now) {
    if (this.#strict) {
      this.#strictTicks.push(now);
    } else {
      this.#intervalCount++;
    }
  }
  #rollbackIntervalSlot() {
    if (this.#strict) {
      if (this.#strictTicks.length > this.#strictTicksStartIndex) {
        this.#strictTicks.pop();
      }
    } else if (this.#intervalCount > 0) {
      this.#intervalCount--;
    }
  }
  #getActiveTicksCount() {
    return this.#strictTicks.length - this.#strictTicksStartIndex;
  }
  get #doesIntervalAllowAnother() {
    if (this.#isIntervalIgnored) {
      return true;
    }
    if (this.#strict) {
      return this.#getActiveTicksCount() < this.#intervalCap;
    }
    return this.#intervalCount < this.#intervalCap;
  }
  get #doesConcurrentAllowAnother() {
    return this.#pending < this.#concurrency;
  }
  #next() {
    this.#pending--;
    if (this.#pending === 0) {
      this.emit("pendingZero");
    }
    this.#tryToStartAnother();
    this.emit("next");
  }
  #onResumeInterval() {
    this.#timeoutId = void 0;
    this.#onInterval();
    this.#initializeIntervalIfNeeded();
  }
  #isIntervalPausedAt(now) {
    if (this.#strict) {
      this.#cleanupStrictTicks(now);
      const activeTicksCount = this.#getActiveTicksCount();
      if (activeTicksCount >= this.#intervalCap) {
        const oldestTick = this.#strictTicks[this.#strictTicksStartIndex];
        const delay = this.#interval - (now - oldestTick);
        this.#createIntervalTimeout(delay);
        return true;
      }
      return false;
    }
    if (this.#intervalId === void 0) {
      const delay = this.#intervalEnd - now;
      if (delay < 0) {
        this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
      } else {
        this.#createIntervalTimeout(delay);
        return true;
      }
    }
    return false;
  }
  #createIntervalTimeout(delay) {
    if (this.#timeoutId !== void 0) {
      return;
    }
    this.#timeoutId = setTimeout(() => {
      this.#onResumeInterval();
    }, delay);
  }
  #clearIntervalTimer() {
    if (this.#intervalId) {
      clearInterval(this.#intervalId);
      this.#intervalId = void 0;
    }
  }
  #clearTimeoutTimer() {
    if (this.#timeoutId) {
      clearTimeout(this.#timeoutId);
      this.#timeoutId = void 0;
    }
  }
  #tryToStartAnother() {
    if (this.#queue.size === 0) {
      this.#clearIntervalTimer();
      this.emit("empty");
      if (this.#pending === 0) {
        this.#clearTimeoutTimer();
        if (this.#strict && this.#strictTicksStartIndex > 0) {
          const now = Date.now();
          this.#cleanupStrictTicks(now);
        }
        this.emit("idle");
      }
      return false;
    }
    let taskStarted = false;
    if (!this.#isPaused) {
      const now = Date.now();
      const canInitializeInterval = !this.#isIntervalPausedAt(now);
      if (this.#doesIntervalAllowAnother && this.#doesConcurrentAllowAnother) {
        const job = this.#queue.dequeue();
        if (!this.#isIntervalIgnored) {
          this.#consumeIntervalSlot(now);
          this.#scheduleRateLimitUpdate();
        }
        if (canInitializeInterval) {
          this.#initializeIntervalIfNeeded();
        }
        this.emit("active");
        job();
        taskStarted = true;
      }
    }
    return taskStarted;
  }
  #initializeIntervalIfNeeded() {
    if (this.#isIntervalIgnored || this.#intervalId !== void 0) {
      return;
    }
    if (this.#strict) {
      return;
    }
    this.#intervalId = setInterval(() => {
      this.#onInterval();
    }, this.#interval);
    this.#intervalEnd = Date.now() + this.#interval;
  }
  #onInterval() {
    if (!this.#strict) {
      if (this.#intervalId !== void 0) {
        if (this.#intervalCount === 0 && this.#pending === 0) {
          this.#clearIntervalTimer();
        } else {
          this.#intervalEnd = Date.now() + this.#interval;
        }
      }
      this.#intervalCount = this.#carryoverIntervalCount ? this.#pending : 0;
    }
    this.#processQueue();
    this.#scheduleRateLimitUpdate();
  }
  /**
  Executes all queued functions until it reaches the limit.
  */
  #processQueue() {
    while (this.#tryToStartAnother()) {
    }
  }
  get concurrency() {
    return this.#concurrency;
  }
  set concurrency(newConcurrency) {
    if (!(typeof newConcurrency === "number" && newConcurrency >= 1)) {
      throw new TypeError(`Expected \`concurrency\` to be a number from 1 and up, got \`${newConcurrency}\` (${typeof newConcurrency})`);
    }
    this.#concurrency = newConcurrency;
    this.#processQueue();
  }
  /**
      Updates the priority of a promise function by its id, affecting its execution order. Requires a defined concurrency limit to take effect.
  
      For example, this can be used to prioritize a promise function to run earlier.
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 0, id: '🦀'});
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦄', {priority: 1});
  
      queue.setPriority('🦀', 2);
      ```
  
      In this case, the promise function with `id: '🦀'` runs second.
  
      You can also deprioritize a promise function to delay its execution:
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 1});
  
      queue.add(async () => '🦄', {priority: 1});
      queue.add(async () => '🦀', {priority: 1, id: '🦀'});
      queue.add(async () => '🦄');
      queue.add(async () => '🦄', {priority: 0});
  
      queue.setPriority('🦀', -1);
      ```
      Here, the promise function with `id: '🦀'` executes last.
      */
  setPriority(id, priority) {
    if (typeof priority !== "number" || !Number.isFinite(priority)) {
      throw new TypeError(`Expected \`priority\` to be a finite number, got \`${priority}\` (${typeof priority})`);
    }
    this.#queue.setPriority(id, priority);
  }
  async add(function_, options = {}) {
    options = {
      timeout: this.timeout,
      ...options,
      // Assign unique ID if not provided
      id: options.id ?? (this.#idAssigner++).toString()
    };
    if (options.timeout !== void 0 && !(Number.isFinite(options.timeout) && options.timeout > 0)) {
      throw new TypeError(`Expected \`timeout\` to be a positive finite number, got \`${options.timeout}\` (${typeof options.timeout})`);
    }
    return new Promise((resolve, reject) => {
      const taskSymbol = /* @__PURE__ */ Symbol(`task-${options.id}`);
      let cleanupQueueAbortHandler = () => void 0;
      const run = async () => {
        cleanupQueueAbortHandler();
        this.#pending++;
        this.#runningTasks.set(taskSymbol, {
          id: options.id,
          priority: options.priority ?? 0,
          // Match priority-queue default
          startTime: Date.now(),
          timeout: options.timeout
        });
        let eventListener;
        try {
          try {
            options.signal?.throwIfAborted();
          } catch (error) {
            this.#rollbackIntervalConsumption();
            this.#runningTasks.delete(taskSymbol);
            throw error;
          }
          let operation = function_({ signal: options.signal });
          if (options.timeout !== void 0) {
            operation = pTimeout(Promise.resolve(operation), {
              milliseconds: options.timeout,
              message: `Task timed out after ${options.timeout}ms (queue has ${this.#pending} running, ${this.#queue.size} waiting)`
            });
          }
          if (options.signal) {
            const { signal } = options;
            operation = Promise.race([operation, new Promise((_resolve, reject2) => {
              eventListener = () => {
                reject2(signal.reason);
              };
              signal.addEventListener("abort", eventListener, { once: true });
            })]);
          }
          const result = await operation;
          resolve(result);
          this.emit("completed", result);
        } catch (error) {
          reject(error);
          this.emit("error", error);
        } finally {
          if (eventListener) {
            options.signal?.removeEventListener("abort", eventListener);
          }
          this.#runningTasks.delete(taskSymbol);
          queueMicrotask(() => {
            this.#next();
          });
        }
      };
      this.#queue.enqueue(run, options);
      const removeQueuedTask = () => {
        if (this.#queue instanceof PriorityQueue) {
          this.#queue.remove(run);
          return;
        }
        this.#queue.remove?.(options.id);
      };
      if (options.signal) {
        const { signal } = options;
        const queueAbortHandler = () => {
          cleanupQueueAbortHandler();
          removeQueuedTask();
          reject(signal.reason);
          this.#tryToStartAnother();
          this.emit("next");
        };
        cleanupQueueAbortHandler = () => {
          signal.removeEventListener("abort", queueAbortHandler);
          this.#queueAbortListenerCleanupFunctions.delete(cleanupQueueAbortHandler);
        };
        if (signal.aborted) {
          queueAbortHandler();
          return;
        }
        signal.addEventListener("abort", queueAbortHandler, { once: true });
        this.#queueAbortListenerCleanupFunctions.add(cleanupQueueAbortHandler);
      }
      this.emit("add");
      this.#tryToStartAnother();
    });
  }
  async addAll(functions, options) {
    return Promise.all(functions.map(async (function_) => this.add(function_, options)));
  }
  /**
  Start (or resume) executing enqueued tasks within concurrency limit. No need to call this if queue is not paused (via `options.autoStart = false` or by `.pause()` method.)
  */
  start() {
    if (!this.#isPaused) {
      return this;
    }
    this.#isPaused = false;
    this.#processQueue();
    return this;
  }
  /**
  Put queue execution on hold.
  */
  pause() {
    this.#isPaused = true;
  }
  /**
  Clear the queue.
  */
  clear() {
    for (const cleanupQueueAbortHandler of this.#queueAbortListenerCleanupFunctions) {
      cleanupQueueAbortHandler();
    }
    this.#queue = new this.#queueClass();
    this.#clearIntervalTimer();
    this.#updateRateLimitState();
    this.emit("empty");
    if (this.#pending === 0) {
      this.#clearTimeoutTimer();
      this.emit("idle");
    }
    this.emit("next");
  }
  /**
      Can be called multiple times. Useful if you for example add additional items at a later time.
  
      @returns A promise that settles when the queue becomes empty.
      */
  async onEmpty() {
    if (this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("empty");
  }
  /**
      @returns A promise that settles when the queue size is less than the given limit: `queue.size < limit`.
  
      If you want to avoid having the queue grow beyond a certain size you can `await queue.onSizeLessThan()` before adding a new item.
  
      Note that this only limits the number of items waiting to start. There could still be up to `concurrency` jobs already running that this call does not include in its calculation.
      */
  async onSizeLessThan(limit) {
    if (this.#queue.size < limit) {
      return;
    }
    await this.#onEvent(["next", "active"], () => this.#queue.size < limit);
  }
  /**
      The difference with `.onEmpty` is that `.onIdle` guarantees that all work from the queue has finished. `.onEmpty` merely signals that the queue is empty, but it could mean that some promises haven't completed yet.
  
      @returns A promise that settles when the queue becomes empty, and all promises have completed; `queue.size === 0 && queue.pending === 0`.
      */
  async onIdle() {
    if (this.#pending === 0 && this.#queue.size === 0) {
      return;
    }
    await this.#onEvent("idle");
  }
  /**
      The difference with `.onIdle` is that `.onPendingZero` only waits for currently running tasks to finish, ignoring queued tasks.
  
      @returns A promise that settles when all currently running tasks have completed; `queue.pending === 0`.
      */
  async onPendingZero() {
    if (this.#pending === 0) {
      return;
    }
    await this.#onEvent("pendingZero");
  }
  /**
  @returns A promise that settles when the queue becomes rate-limited due to intervalCap.
  */
  async onRateLimit() {
    if (this.isRateLimited) {
      return;
    }
    await this.#onEvent("rateLimit");
  }
  /**
  @returns A promise that settles when the queue is no longer rate-limited.
  */
  async onRateLimitCleared() {
    if (!this.isRateLimited) {
      return;
    }
    await this.#onEvent("rateLimitCleared");
  }
  /**
      @returns A promise that rejects when any task in the queue errors.
  
      Use with `Promise.race([queue.onError(), queue.onIdle()])` to fail fast on the first error while still resolving normally when the queue goes idle.
  
      Important: The promise returned by `add()` still rejects. You must handle each `add()` promise (for example, `.catch(() => {})`) to avoid unhandled rejections.
  
      @example
      ```
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 2});
  
      queue.add(() => fetchData(1)).catch(() => {});
      queue.add(() => fetchData(2)).catch(() => {});
      queue.add(() => fetchData(3)).catch(() => {});
  
      // Stop processing on first error
      try {
          await Promise.race([
              queue.onError(),
              queue.onIdle()
          ]);
      } catch (error) {
          queue.pause(); // Stop processing remaining tasks
          console.error('Queue failed:', error);
      }
      ```
      */
  // eslint-disable-next-line @typescript-eslint/promise-function-async
  onError() {
    return new Promise((_resolve, reject) => {
      const handleError = (error) => {
        this.off("error", handleError);
        reject(error);
      };
      this.on("error", handleError);
    });
  }
  async #onEvent(events, filter) {
    const eventList = Array.isArray(events) ? events : [events];
    return new Promise((resolve) => {
      const listener = () => {
        if (filter && !filter()) {
          return;
        }
        for (const event of eventList) {
          this.off(event, listener);
        }
        resolve();
      };
      for (const event of eventList) {
        this.on(event, listener);
      }
    });
  }
  /**
  Size of the queue, the number of queued items waiting to run.
  */
  get size() {
    return this.#queue.size;
  }
  /**
      Size of the queue, filtered by the given options.
  
      For example, this can be used to find the number of items remaining in the queue with a specific priority level.
      */
  sizeBy(options) {
    return this.#queue.filter(options).length;
  }
  /**
  Number of running items (no longer in the queue).
  */
  get pending() {
    return this.#pending;
  }
  /**
  Whether the queue is currently paused.
  */
  get isPaused() {
    return this.#isPaused;
  }
  #setupRateLimitTracking() {
    if (this.#isIntervalIgnored) {
      return;
    }
    this.on("add", () => {
      if (this.#queue.size > 0) {
        this.#scheduleRateLimitUpdate();
      }
    });
    this.on("next", () => {
      this.#scheduleRateLimitUpdate();
    });
  }
  #scheduleRateLimitUpdate() {
    if (this.#isIntervalIgnored || this.#rateLimitFlushScheduled) {
      return;
    }
    this.#rateLimitFlushScheduled = true;
    queueMicrotask(() => {
      this.#rateLimitFlushScheduled = false;
      this.#updateRateLimitState();
    });
  }
  #rollbackIntervalConsumption() {
    if (this.#isIntervalIgnored) {
      return;
    }
    this.#rollbackIntervalSlot();
    this.#scheduleRateLimitUpdate();
  }
  #updateRateLimitState() {
    const previous = this.#rateLimitedInInterval;
    if (this.#isIntervalIgnored || this.#queue.size === 0) {
      if (previous) {
        this.#rateLimitedInInterval = false;
        this.emit("rateLimitCleared");
      }
      return;
    }
    let count;
    if (this.#strict) {
      const now = Date.now();
      this.#cleanupStrictTicks(now);
      count = this.#getActiveTicksCount();
    } else {
      count = this.#intervalCount;
    }
    const shouldBeRateLimited = count >= this.#intervalCap;
    if (shouldBeRateLimited !== previous) {
      this.#rateLimitedInInterval = shouldBeRateLimited;
      this.emit(shouldBeRateLimited ? "rateLimit" : "rateLimitCleared");
    }
  }
  /**
  Whether the queue is currently rate-limited due to intervalCap.
  */
  get isRateLimited() {
    return this.#rateLimitedInInterval;
  }
  /**
      Whether the queue is saturated. Returns `true` when:
      - All concurrency slots are occupied and tasks are waiting, OR
      - The queue is rate-limited and tasks are waiting
  
      Useful for detecting backpressure and potential hanging tasks.
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 2});
  
      // Backpressure handling
      if (queue.isSaturated) {
          console.log('Queue is saturated, waiting for capacity...');
          await queue.onSizeLessThan(queue.concurrency);
      }
  
      // Monitoring for stuck tasks
      setInterval(() => {
          if (queue.isSaturated) {
              console.warn(`Queue saturated: ${queue.pending} running, ${queue.size} waiting`);
          }
      }, 60000);
      ```
      */
  get isSaturated() {
    return this.#pending === this.#concurrency && this.#queue.size > 0 || this.isRateLimited && this.#queue.size > 0;
  }
  /**
      The tasks currently being executed. Each task includes its `id`, `priority`, `startTime`, `timeout` (if set), and `timeoutRemaining` (milliseconds until the task times out, or `undefined` if no timeout is set).
  
      Returns an array of task info objects.
  
      ```js
      import PQueue from 'p-queue';
  
      const queue = new PQueue({concurrency: 2, timeout: 10000});
  
      // Add tasks with IDs for better debugging
      queue.add(() => fetchUser(123), {id: 'user-123'});
      queue.add(() => fetchPosts(456), {id: 'posts-456', priority: 1});
  
      // Check what's running
      console.log(queue.runningTasks);
      // => [{
      //   id: 'user-123',
      //   priority: 0,
      //   startTime: 1759253001716,
      //   timeout: 10000,
      //   timeoutRemaining: 9700
      // }, {
      //   id: 'posts-456',
      //   priority: 1,
      //   startTime: 1759253001916,
      //   timeout: 10000,
      //   timeoutRemaining: 9900
      // }]
      ```
      */
  get runningTasks() {
    return [...this.#runningTasks.values()].map((task) => ({
      ...task,
      timeoutRemaining: task.timeout ? Math.max(0, task.startTime + task.timeout - Date.now()) : void 0
    }));
  }
};

// node_modules/@sublang/playbook/src/accepted-outcome.js
var ACCEPTED_OUTCOME_ACTION_TYPE = "playbook.acceptedOutcome";
function exactMarkerParams(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} params must be a plain object`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(descriptors);
  const expected = ["acceptedOutcome", "source", "target"];
  if (keys.length !== expected.length || keys.some((key) => typeof key !== "string" || !expected.includes(key))) {
    throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} params must contain exactly source, target, and acceptedOutcome`);
  }
  const stringValue = (key) => {
    const descriptor = descriptors[key];
    if (descriptor === void 0 || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true || typeof descriptor.value !== "string" || descriptor.value.trim().length === 0) {
      throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} params.${key} must be a nonempty enumerable string data property`);
    }
    return descriptor.value;
  };
  return Object.freeze({
    source: stringValue("source"),
    target: stringValue("target"),
    acceptedOutcome: stringValue("acceptedOutcome")
  });
}
function createAcceptedOutcomeConsumer(isDeclared) {
  let pending = [];
  let invalidBatch = false;
  return Object.freeze({
    capture(action) {
      if (action.type !== ACCEPTED_OUTCOME_ACTION_TYPE) {
        return;
      }
      if (invalidBatch)
        return;
      try {
        const marker = exactMarkerParams(action.params);
        if (!isDeclared(marker.source, marker.acceptedOutcome)) {
          throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} names undeclared outcome ${marker.source}.${marker.acceptedOutcome}`);
        }
        pending.push(marker);
      } catch (error) {
        pending = [];
        invalidBatch = true;
        throw error;
      }
    },
    confirm(previousState, state) {
      if (invalidBatch) {
        pending = [];
        invalidBatch = false;
        return Object.freeze([]);
      }
      if (pending.length === 0)
        return Object.freeze([]);
      const captured = pending;
      pending = [];
      if (previousState === void 0) {
        throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} marker has no prior public root snapshot`);
      }
      const seen = /* @__PURE__ */ new Set();
      for (const marker of captured) {
        const identity = marker.source;
        if (seen.has(identity)) {
          throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} source ${marker.source} was instrumented more than once in one action batch`);
        }
        seen.add(identity);
        if (!previousState.activeStateIds.includes(marker.source)) {
          throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} source ${marker.source} was not confirmed by the prior public root snapshot`);
        }
        if (!state.activeStateIds.includes(marker.target)) {
          throw new TypeError(`${ACCEPTED_OUTCOME_ACTION_TYPE} target ${marker.target} was not confirmed by the public root snapshot`);
        }
      }
      return Object.freeze(captured);
    },
    reset() {
      pending = [];
      invalidBatch = false;
    }
  });
}

// node_modules/@sublang/playbook/src/xstate-playbook-runtime.js
var BOSS_REPLY_ERRORS = {
  missingQuestion: "needsBossReply outcome missing 'question' field",
  unregisteredState: (stateId) => `state ${stateId} declared needsBossReply but is not registered as resumable`
};
var fsmResultFailures = /* @__PURE__ */ new WeakSet();
function markFsmResultFailure(error) {
  fsmResultFailures.add(error);
  attachPlaybookFailureCause(error, {
    code: "runtime-defect",
    evidence: {
      reason: typeof error.message === "string" && error.message.length > 0 ? error.message : "unknown runtime defect"
    }
  });
  return error;
}
function isFsmResultFailure(error) {
  return typeof error === "object" && error !== null && fsmResultFailures.has(error);
}
var GOVERNED_JUDGE_FAILURE_REASONS = [
  "judge transport failed",
  "corrective judge failed",
  "corrective semantic candidate is invalid",
  "semantic correction budget is unavailable"
];
var ABORTED_FAILURE_CAUSE = assertPlaybookFailureCause({
  code: "aborted",
  evidence: {}
});
function runtimeDefectCause(reason) {
  return assertPlaybookFailureCause({
    code: "runtime-defect",
    evidence: { reason: reason.length === 0 ? "unknown runtime defect" : reason }
  });
}
function failureErrorEvidence(error) {
  if (error === void 0 || error === null)
    return void 0;
  const { name, message } = normalizeError(error);
  return { name, message };
}
function failureErrorCode(error) {
  if (typeof error !== "object" || error === null)
    return void 0;
  try {
    const code = error.code;
    return typeof code === "string" && code.length > 0 ? code : void 0;
  } catch {
    return void 0;
  }
}
function playerFailureCause(input) {
  return assertPlaybookFailureCause({
    code: "player-failed",
    evidence: {
      roleId: input.roleId,
      ...input.playerId === void 0 ? {} : { playerId: input.playerId },
      error: failureErrorEvidence(input.error) ?? {
        name: "Error",
        message: "Unknown error"
      },
      ...failureErrorCode(input.error) === void 0 ? {} : { errorCode: failureErrorCode(input.error) }
    }
  });
}
function governedSettlementCause(reason, error, aborted, supplied) {
  if (supplied !== void 0)
    return supplied;
  if (aborted || reason.includes("aborted"))
    return ABORTED_FAILURE_CAUSE;
  if (GOVERNED_JUDGE_FAILURE_REASONS.includes(reason)) {
    const transport = failureErrorEvidence(error);
    return assertPlaybookFailureCause({
      code: "judge-failed",
      evidence: {
        reason,
        ...transport === void 0 ? {} : { error: transport }
      }
    });
  }
  return runtimeDefectCause(reason);
}
var FAILURE_CAUSE_RETENTION_LIMIT = 8;
function createFailureCauseRetention() {
  const causes = /* @__PURE__ */ new Map();
  return {
    retain(error, cause) {
      if (error === void 0 || error === null)
        return;
      causes.delete(error);
      causes.set(error, cause);
      while (causes.size > FAILURE_CAUSE_RETENTION_LIMIT) {
        causes.delete(causes.keys().next().value);
      }
    },
    causeOf(error) {
      if (error === void 0 || error === null)
        return void 0;
      return normalizeError(error).cause ?? causes.get(error);
    }
  };
}
function actorErrorOf2(event) {
  if (typeof event !== "object" || event === null)
    return void 0;
  try {
    const { type, error } = event;
    return typeof type === "string" && type.startsWith("xstate.error.actor.") ? error : void 0;
  } catch {
    return void 0;
  }
}
function isEmptyFinalText(finalText) {
  return finalText === void 0 || finalText.trim().length === 0;
}
var emptyOkRetryFailures = /* @__PURE__ */ new WeakSet();
var HOST_CAPABILITIES_OPTION_KEY = "hostCapabilities";
var UNRESOLVED_EFFECT_RECONCILIATION_ACTION_ID = "reconcile:unresolved-effect";
var UNRESOLVED_EFFECT_ABANDONMENT_ACTION_ID = "abandon:unresolved-effect";
function deferredValue() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
function assertNoConfiguredHostCapabilities(value, label) {
  if (value !== null && typeof value === "object" && Object.prototype.hasOwnProperty.call(value, HOST_CAPABILITIES_OPTION_KEY)) {
    throw new TypeError(`${label} configured options must not contain hostCapabilities`);
  }
}
function configuredOptionsFromFactoryInput(value, label) {
  if (value === null || typeof value !== "object" || Array.isArray(value) || Object.getPrototypeOf(value) !== Object.prototype && Object.getPrototypeOf(value) !== null) {
    throw new TypeError(`${label} schema-3 factory input must be a plain object`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const keys = Reflect.ownKeys(value);
  if (keys.length !== 2 || !keys.includes("configuredOptions") || !keys.includes(HOST_CAPABILITIES_OPTION_KEY) || keys.some((key) => {
    const descriptor = descriptors[key];
    return descriptor?.get !== void 0 || descriptor?.set !== void 0 || descriptor?.enumerable !== true || !Object.prototype.hasOwnProperty.call(descriptor, "value");
  })) {
    throw new TypeError(`${label} schema-3 factory input must contain exactly configuredOptions and hostCapabilities data properties`);
  }
  const hostCapabilities = descriptors.hostCapabilities.value;
  if (hostCapabilities === null || typeof hostCapabilities !== "object" || Array.isArray(hostCapabilities)) {
    throw new TypeError(`${label} schema-3 factory input hostCapabilities must be a live object`);
  }
  const configuredOptions = descriptors.configuredOptions.value;
  assertNoConfiguredHostCapabilities(configuredOptions, label);
  const ledgerDescriptor = Object.getOwnPropertyDescriptor(hostCapabilities, "effectLedger");
  if (ledgerDescriptor === void 0 || !Object.prototype.hasOwnProperty.call(ledgerDescriptor, "value") || ledgerDescriptor.get !== void 0 || ledgerDescriptor.set !== void 0) {
    throw new TypeError(`${label} schema-3 factory input hostCapabilities.effectLedger must be an own data property`);
  }
  const effectLedger = ledgerDescriptor.value;
  if (effectLedger === null || typeof effectLedger !== "object" || Array.isArray(effectLedger) || typeof effectLedger.snapshot !== "function" || typeof effectLedger.writeAhead !== "function") {
    throw new TypeError(`${label} schema-3 factory input hostCapabilities.effectLedger must expose snapshot and writeAhead functions`);
  }
  return {
    configuredOptions,
    hostCapabilities,
    effectLedger
  };
}
function repositoryCapabilityFromHostCapabilities(hostCapabilities, label, requireCohort = false) {
  const descriptor = hostCapabilities === void 0 ? void 0 : Object.getOwnPropertyDescriptor(hostCapabilities, "repository");
  const repository = descriptor?.value;
  if (descriptor === void 0 || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.get !== void 0 || descriptor.set !== void 0 || repository === null || typeof repository !== "object" || Array.isArray(repository) || typeof repository.runExclusive !== "function" || typeof repository.runDeferred !== "function" || requireCohort && typeof repository.runCohort !== "function") {
    throw new TypeError(requireCohort ? `${label} schema-3 factory input hostCapabilities.repository must be an own data property exposing runExclusive, runCohort, and runDeferred` : `${label} schema-3 factory input hostCapabilities.repository must be an own data property exposing runExclusive and runDeferred`);
  }
  return repository;
}
function markEmptyOkRetryFailure(error) {
  emptyOkRetryFailures.add(error);
  return error;
}
function isEmptyOkRetryFailure(error) {
  return typeof error === "object" && error !== null && emptyOkRetryFailures.has(error);
}
var RUNTIME_ABI = 1;
var SUPPORTED_ARTIFACT_SCHEMAS = Object.freeze([
  3
]);
function assertRuntimeCompat(compat, label) {
  if (compat === void 0) {
    throw new TypeError(`${label} spec.compat is required for local-role artifacts`);
  }
  if (compat === null || typeof compat !== "object") {
    throw new TypeError(`${label} spec.compat must be an object`);
  }
  const { artifactSchema, runtimeAbi } = compat;
  if (!Number.isSafeInteger(artifactSchema)) {
    throw new TypeError(`${label} spec.compat.artifactSchema must be an integer`);
  }
  if (!Number.isSafeInteger(runtimeAbi)) {
    throw new TypeError(`${label} spec.compat.runtimeAbi must be an integer`);
  }
  if (!SUPPORTED_ARTIFACT_SCHEMAS.includes(artifactSchema)) {
    throw new TypeError(`${label} artifact declares schema ${artifactSchema}, but this @sublang/playbook/xstate-runtime engine supports [${SUPPORTED_ARTIFACT_SCHEMAS.join(", ")}]`);
  }
  if (runtimeAbi !== RUNTIME_ABI) {
    throw new TypeError(`${label} artifact declares runtime ABI ${runtimeAbi}, but this @sublang/playbook/xstate-runtime engine implements ${RUNTIME_ABI}`);
  }
  return artifactSchema;
}
function isPlainObject(value) {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}
function stripCodeFence(text) {
  const fence = text.match(/^```(?:json)?\s*\n?([\s\S]*?)\n?```$/);
  return fence ? fence[1].trim() : text;
}
function dropTrailingComma(out) {
  return out.replace(/,(\s*)$/, "$1");
}
function extractJsonValue(text, start, repair) {
  const stack = [];
  let out = "";
  let inString = false;
  let escaped = false;
  for (let i = start; i < text.length; i++) {
    const ch = text[i];
    if (inString) {
      out += ch;
      if (escaped)
        escaped = false;
      else if (ch === "\\")
        escaped = true;
      else if (ch === '"')
        inString = false;
      continue;
    }
    if (ch === '"') {
      inString = true;
      out += ch;
      continue;
    }
    if (ch === "{" || ch === "[") {
      stack.push(ch === "{" ? "}" : "]");
      out += ch;
      continue;
    }
    if (ch === "}" || ch === "]") {
      if (repair)
        out = dropTrailingComma(out);
      out += ch;
      stack.pop();
      if (stack.length === 0)
        return out;
      continue;
    }
    out += ch;
  }
  if (!repair)
    return void 0;
  if (inString)
    out += '"';
  out = dropTrailingComma(out);
  while (stack.length > 0)
    out += stack.pop();
  return out;
}
function parseJudgeJson(raw) {
  const fenced = stripCodeFence(raw.trim());
  try {
    return JSON.parse(fenced);
  } catch {
  }
  const starts = [];
  for (let i = 0; i < fenced.length; i++) {
    const ch = fenced[i];
    if (ch === "{" || ch === "[")
      starts.push(i);
  }
  let firstValue;
  for (const start of starts) {
    let parsedHere;
    for (const repair of [false, true]) {
      const candidate = extractJsonValue(fenced, start, repair);
      if (candidate === void 0)
        continue;
      try {
        parsedHere = { value: JSON.parse(candidate) };
      } catch {
        continue;
      }
      break;
    }
    if (parsedHere === void 0)
      continue;
    if (isPlainObject(parsedHere.value))
      return parsedHere.value;
    if (firstValue === void 0)
      firstValue = parsedHere;
  }
  if (firstValue !== void 0)
    return firstValue.value;
  throw new Error("adjudicate: judge response is not valid JSON");
}
function normalizeErrorCompact(err) {
  if (err === void 0 || err === null)
    return void 0;
  const normalized = normalizeError(err);
  return {
    name: normalized.name,
    message: normalized.message,
    // DR-063 §2: on a failure the cause is why the compact form exists, so it
    // survives where the stack does not.
    ...normalized.cause === void 0 ? {} : { cause: normalized.cause }
  };
}
function normalizeErrorFull(err) {
  if (err === void 0 || err === null)
    return void 0;
  return normalizeError(err);
}
function isAbortFailure(error, signal) {
  return signal.aborted && Object.is(error, signal.reason);
}
function abortReasonClassifier(...sources) {
  const captured = sources.filter((source) => source !== void 0);
  return Object.freeze({
    isAbortReason: (error) => captured.some((source) => source instanceof AbortSignal ? isAbortFailure(error, source) : source.isAbortReason(error))
  });
}
var BOSS_REPLY_WAIT_STATE_ID = "awaitBossReply";
function pendingBossQuestionForState(state, context) {
  if (state.stateId !== BOSS_REPLY_WAIT_STATE_ID)
    return void 0;
  return pendingBossQuestionFromContext(context);
}
function pendingBossQuestionFromContext(context) {
  return pendingBossQuestionRecord(context.pendingBossQuestion);
}
function keyedPendingBossQuestions(context, resumesFromActiveWait) {
  const keyed = context.pendingBossQuestions;
  if (!isPlainObject(keyed))
    return [];
  const pending = [];
  for (const [key, value] of Object.entries(keyed)) {
    const record = pendingBossQuestionRecord(value);
    if (record === void 0 || record.questionId !== key)
      continue;
    if (!resumesFromActiveWait(record.resumeStateId))
      continue;
    pending.push(record);
  }
  return pending.sort((left, right) => left.questionId.localeCompare(right.questionId));
}
function pendingBossQuestionRecord(pending) {
  if (pending === void 0 || pending === null || typeof pending !== "object") {
    return void 0;
  }
  const candidate = pending;
  if (typeof candidate.questionId !== "string" || typeof candidate.resumeStateId !== "string" || typeof candidate.sourceItem !== "string" || !isPlainObject(candidate.asker) || typeof candidate.question !== "string") {
    return void 0;
  }
  let asker;
  if (candidate.asker.kind === "captain") {
    if (Object.keys(candidate.asker).some((key) => key !== "kind")) {
      return void 0;
    }
    asker = { kind: "captain" };
  } else if (candidate.asker.kind === "role" && typeof candidate.asker.roleId === "string" && candidate.asker.roleId.trim().length > 0 && Object.keys(candidate.asker).every((key) => key === "kind" || key === "roleId")) {
    asker = { kind: "role", roleId: candidate.asker.roleId };
  } else {
    return void 0;
  }
  return {
    questionId: candidate.questionId,
    resumeStateId: candidate.resumeStateId,
    sourceItem: candidate.sourceItem,
    asker,
    question: candidate.question
  };
}
var CONTINUATION_PREAMBLE = "Continue the same task using Boss\u2019s reply below.";
function continuationBlocks(input, resuming = false) {
  if (input.pendingBossQuestion === void 0 || input.bossReply === void 0) {
    return [];
  }
  return [
    CONTINUATION_PREAMBLE,
    ...resuming ? [] : [`Your previous question:
${input.pendingBossQuestion.question}`],
    `Boss reply:
${input.bossReply}`
  ];
}
function composePlayerContinuation(input, body, resuming = false) {
  return [...continuationBlocks(input, resuming), body].join("\n\n");
}
var PRE_EXISTING_CHANGE_GROUPS = [
  "staged",
  "modified",
  "deleted",
  "untracked",
  "renamed",
  "unmerged",
  "other"
];
var PRE_EXISTING_CHANGE_PATH_LIMIT = 40;
function preExistingChangeGroup(entry2) {
  if (!isPlainObject(entry2))
    return "other";
  if (entry2.kind === "untracked")
    return "untracked";
  if (entry2.kind === "rename-or-copy")
    return "renamed";
  if (entry2.kind === "unmerged")
    return "unmerged";
  const xy = entry2.xy;
  if (entry2.kind !== "ordinary" || typeof xy !== "string" || xy.length !== 2) {
    return "other";
  }
  if (xy[1] === "D")
    return "deleted";
  if (xy[1] === ".")
    return xy[0] === "." ? "other" : "staged";
  return "modified";
}
function preExistingChangesBlock(baseline) {
  const projection = baseline?.projection;
  if (!isPlainObject(projection))
    return void 0;
  const grouped = /* @__PURE__ */ new Map();
  let total = 0;
  for (const path of Object.keys(projection)) {
    const group = preExistingChangeGroup(projection[path]);
    const paths = grouped.get(group);
    if (paths === void 0)
      grouped.set(group, [path]);
    else
      paths.push(path);
    total += 1;
  }
  if (total === 0)
    return void 0;
  const omitted = Math.max(0, total - PRE_EXISTING_CHANGE_PATH_LIMIT);
  const lines = [];
  let budget = PRE_EXISTING_CHANGE_PATH_LIMIT;
  for (const group of PRE_EXISTING_CHANGE_GROUPS) {
    const paths = grouped.get(group);
    if (paths === void 0 || budget <= 0)
      continue;
    const printed = paths.slice().sort().slice(0, budget);
    budget -= printed.length;
    lines.push(`> - ${group}: ${printed.join(", ")}`);
  }
  if (omitted > 0 && lines.length > 0) {
    lines[lines.length - 1] += `, \u2026 and ${omitted} more`;
  }
  return [
    "> Uncommitted changes present before this call, belonging to the Boss:",
    ...lines,
    "> Leave them exactly as they are unless the task or the Boss's request requires building on them; never revert or delete them; when you commit any of them, name them in your final report."
  ].join("\n");
}
function effectAuthorizedPreExistingBlock(effectBoundary2, baseline) {
  return effectBoundary2.dispositions.includes("one-descendant-commit") ? preExistingChangesBlock(baseline) : void 0;
}
var PLACEHOLDER_PATTERN = /<(#|[A-Za-z_$][A-Za-z0-9_$-]*)>/g;
function placeholderFieldName(token, fields) {
  const explicit = fields[token];
  if (explicit !== void 0)
    return explicit;
  if (token === "#")
    return "irNumber";
  return token.replace(/-([A-Za-z0-9])/g, (_match, next) => next.toUpperCase());
}
function defaultComposePlayerPrompt(input, placeholderFields = {}, resuming = false) {
  const fields = input;
  const body = input.prompt.replace(PLACEHOLDER_PATTERN, (match, token) => {
    const value = fields[placeholderFieldName(token, placeholderFields)];
    return typeof value === "string" ? value : match;
  });
  return composePlayerContinuation(input, body, resuming);
}
function sortJson(value) {
  if (Array.isArray(value))
    return value.map((entry2) => sortJson(entry2));
  if (value !== null && typeof value === "object") {
    const record = value;
    const sorted = {};
    for (const key of Object.keys(record).sort()) {
      sorted[key] = sortJson(record[key]);
    }
    return sorted;
  }
  return value;
}
function stableJson(value, path) {
  return JSON.stringify(sortJson(snapshotJsonValue(value, path)));
}
function retainedAdoptionCheckpointIsSafe(checkpoint, current) {
  if (checkpoint.boundaries.some(({ physicalReceipt }) => physicalReceipt === void 0)) {
    return false;
  }
  if (!isPlaybookEffectLedgerMonotonicExtension(checkpoint, current)) {
    return false;
  }
  if (!isDeepStrictEqual(current.boundaries.slice(0, checkpoint.boundaries.length), checkpoint.boundaries) || !isDeepStrictEqual(current.logicalOperations, checkpoint.logicalOperations)) {
    return false;
  }
  return current.boundaries.slice(checkpoint.boundaries.length).every(({ physicalReceipt }) => physicalReceipt?.classification === "unchanged");
}
var RETAINED_EFFECT_SESSION_ID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
function requireAdoptionIdentity(value, path) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${path} must be a non-empty string`);
  }
  return value;
}
function snapshotAdoptionContext(value, targetSession, sourceSnapshot) {
  const captured = snapshotJsonValue(value, "playbook adoption context");
  if (captured === null || Array.isArray(captured) || typeof captured !== "object") {
    throw new TypeError("playbook adoption context must be an object");
  }
  const fields = captured;
  const hasSuspendedCall = sourceSnapshot.suspendedCall !== void 0;
  const expectedKeys = [
    "sourceGenerationId",
    "sourceSessionId",
    ...hasSuspendedCall ? ["targetChildSessionId"] : []
  ].sort();
  const actualKeys = Object.keys(fields).sort();
  if (actualKeys.length !== expectedKeys.length || actualKeys.some((key, index) => key !== expectedKeys[index])) {
    throw new TypeError(`playbook adoption context must contain exactly ${expectedKeys.join(", ")}`);
  }
  const sourceSessionId = requireAdoptionIdentity(fields.sourceSessionId, "playbook adoption context sourceSessionId");
  const sourceGenerationId = requireAdoptionIdentity(fields.sourceGenerationId, "playbook adoption context sourceGenerationId");
  const sourceIsRoot = sourceSessionId === sourceGenerationId;
  if (targetSession.depth === 0 !== sourceIsRoot) {
    throw new TypeError("playbook adoption context source identities do not match the target frame depth");
  }
  const targetChildSessionId = hasSuspendedCall ? requireAdoptionIdentity(fields.targetChildSessionId, "playbook adoption context targetChildSessionId") : void 0;
  const sourceIds = /* @__PURE__ */ new Set([
    sourceSessionId,
    sourceGenerationId,
    ...sourceSnapshot.suspendedCall === void 0 ? [] : [sourceSnapshot.suspendedCall.childSessionId]
  ]);
  const targetIds = [
    targetSession.sessionId,
    targetSession.rootSessionId,
    ...targetSession.parentSessionId === void 0 ? [] : [targetSession.parentSessionId],
    ...targetChildSessionId === void 0 ? [] : [targetChildSessionId]
  ];
  if (targetIds.some((identity) => sourceIds.has(identity))) {
    throw new TypeError("playbook adoption target identities must be fresh from the source generation");
  }
  if (targetChildSessionId !== void 0 && (targetChildSessionId === targetSession.sessionId || targetChildSessionId === targetSession.rootSessionId || targetChildSessionId === targetSession.parentSessionId)) {
    throw new TypeError("playbook adoption targetChildSessionId must name a fresh child frame");
  }
  return Object.freeze({
    sourceSessionId,
    sourceGenerationId,
    ...targetChildSessionId === void 0 ? {} : { targetChildSessionId }
  });
}
function defaultComposeCaptainPrompt(input, placeholderFields = {}) {
  const blocks = continuationBlocks(input);
  const fields = input;
  const body = input.prompt.replace(PLACEHOLDER_PATTERN, (match, token) => {
    const field = placeholderFieldName(token, placeholderFields);
    const value = fields[field];
    if (typeof value === "string")
      return value;
    if (value !== null && typeof value === "object") {
      return stableJson(value, `CaptainInput.${field}`);
    }
    return match;
  });
  blocks.push(body);
  return blocks.join("\n\n");
}
var OUTPUT_CLAUSE_MARKERS = [
  "Output shall include",
  "\u8F93\u51FA\u5E94\u5305\u542B"
];
var PAYLOAD_FIELD_PATTERN = /`([A-Za-z_$][A-Za-z0-9_$]*)(?::\s*([^`]*))?`/g;
var SEGMENT_SEPARATOR_SUFFIX = /(?:\s|[,;.，、；。]|\band\b)+$/;
function splitOutputClause(description) {
  for (const marker of OUTPUT_CLAUSE_MARKERS) {
    const idx = description.indexOf(marker);
    if (idx !== -1) {
      return {
        meaning: description.slice(0, idx).trim(),
        clause: description.slice(idx + marker.length)
      };
    }
  }
  return { meaning: description.trim() };
}
function defaultExtractRequiredFields(description) {
  const { clause } = splitOutputClause(description);
  if (clause === void 0)
    return [];
  const fields = [];
  for (const m of clause.matchAll(PAYLOAD_FIELD_PATTERN))
    fields.push(m[1]);
  return fields;
}
var CURRENT_CALL_ADJUDICATION_GUIDANCE = "Classify the invoked role's current call by the result it reports at call end, using the full output and declared outcome meanings. An earlier interim question is not outstanding when later prose explicitly resolves or supersedes it for this call; a prerequisite only for a later workflow stage does not block an affirmatively completed current call. A genuinely unanswered question needed to finish the current call remains outstanding. A commit statement alone does not establish semantic completion; do not force contradictory or insufficient evidence into a completed outcome.";
function defaultBuildJudgePrompt(input, finalText) {
  const lines = [];
  lines.push("This is hidden control work. Do not call tools, inspect files, or seek external evidence. Decide only from the supplied player output and outcome descriptions. Reply with exactly one JSON object and no prose.");
  lines.push(CURRENT_CALL_ADJUDICATION_GUIDANCE);
  lines.push("");
  lines.push(`The ${input.role} role just produced this output:`);
  lines.push("");
  lines.push("```");
  lines.push(finalText);
  lines.push("```");
  lines.push("");
  lines.push('Pick exactly one outcome by `guard` and return JSON `{ guard, \u2026payloadFields }`. Required payload fields are named in the outcome description after "Output shall include" / "\u8F93\u51FA\u5E94\u5305\u542B".');
  lines.push("");
  for (const [key, description] of Object.entries(input.result)) {
    lines.push(`- \`${key}\` \u2014 ${description}`);
  }
  return lines.join("\n");
}
function renderGovernedOutcomeContract(guard, description, outcome) {
  const { meaning, clause } = splitOutputClause(description);
  const authored = /* @__PURE__ */ new Map();
  if (clause !== void 0) {
    const matches2 = [...clause.matchAll(PAYLOAD_FIELD_PATTERN)];
    matches2.forEach((m, i) => {
      const field = m[1];
      if (authored.has(field))
        return;
      const start = m.index ?? 0;
      const end = matches2[i + 1]?.index ?? clause.length;
      const segment = clause.slice(start, end).replace(SEGMENT_SEPARATOR_SUFFIX, "");
      const placeholder = m[2]?.trim();
      authored.set(field, {
        segment,
        ...placeholder !== void 0 && placeholder.length > 0 ? { placeholder } : {}
      });
    });
  }
  const replyMembers = [`"guard": ${JSON.stringify(guard)}`];
  const semanticAsAuthored = [];
  const runtimeSupplied = [];
  for (const [field, authority] of Object.entries(outcome?.fields ?? {})) {
    if (authority === "semantic") {
      const entry2 = authored.get(field);
      replyMembers.push(`${JSON.stringify(field)}: ${entry2?.placeholder ?? "<string>"}`);
      semanticAsAuthored.push(entry2?.segment ?? `\`${field}\``);
    } else {
      runtimeSupplied.push(`\`${field}\` (${authority}-owned)`);
    }
  }
  const lines = [
    meaning.length === 0 ? `- \`${guard}\`` : `- \`${guard}\` \u2014 ${meaning}`,
    `  Reply exactly: { ${replyMembers.join(", ")} }`
  ];
  if (semanticAsAuthored.length > 0) {
    lines.push(`  Semantic fields as authored: ${semanticAsAuthored.join("; ")}`);
  }
  if (runtimeSupplied.length > 0) {
    lines.push(`  Runtime-supplied, do not include: ${runtimeSupplied.join(", ")}`);
  }
  return lines;
}
function buildGovernedJudgePrompt(input, finalText, outcomes, correction) {
  const lines = [
    "This is hidden control work. Do not call tools, inspect files, or seek external evidence.",
    "Decide only from the supplied player output and declared outcomes.",
    CURRENT_CALL_ADJUDICATION_GUIDANCE,
    "Reply with exactly one JSON object and no prose.",
    "",
    `The ${input.role} role just produced this output:`,
    "",
    "```",
    finalText,
    "```",
    "",
    "Pick exactly one declared `guard` and reply with exactly that outcome's reply shape below: `guard` plus its semantic-owned fields and nothing else.",
    'If no declared outcome matches the player output, instead reply exactly {"blocked":"explain the missing outcome or contradictory requirements"}. Never force a match or invent a guard. A blocked reply pauses the playbook for Boss; it is not completion.',
    "A field listed as runtime-supplied is owned by presentation, effect, or runtime evidence; the runtime fills it itself, and a reply that includes one is structurally invalid.",
    ""
  ];
  for (const [guard, description] of Object.entries(input.result)) {
    lines.push(...renderGovernedOutcomeContract(guard, description, outcomes[guard]));
  }
  if (correction !== void 0) {
    lines.push("", "Your first reply was structurally invalid:", "", "```", correction.reply, "```", "", `Validation error: ${correction.error}`, "Correct only that structure using the same player output and outcome schema.");
  }
  return lines.join("\n");
}
function parseGovernedSemanticCandidate(raw) {
  try {
    return parseJudgeJson(raw);
  } catch (error) {
    throw new PlaybookSemanticCandidateStructureError(error instanceof Error ? error.message : "reply is not valid JSON");
  }
}
var NO_VERBATIM_FIELDS = /* @__PURE__ */ new Set();
async function adjudicatePlayerOutput(spec, input, finalText, ports, signal, boundary) {
  const buildPrompt = spec.buildJudgePrompt ?? defaultBuildJudgePrompt;
  const extractFields = spec.extractRequiredFields ?? defaultExtractRequiredFields;
  const verbatimFields = spec.verbatimPayloadFields ?? NO_VERBATIM_FIELDS;
  const prompt = buildPrompt(input, finalText);
  const raw = boundary ? await boundary.callJudge("player-output-adjudication", input.stateId, prompt, signal) : await ports.callJudge(prompt, signal);
  const parsed = parseJudgeJson(raw);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("adjudicate: judge response is not a JSON object");
  }
  const obj = parsed;
  const guard = obj.guard;
  if (typeof guard !== "string") {
    throw new Error('adjudicate: judge response missing string "guard" field');
  }
  if (!Object.prototype.hasOwnProperty.call(input.result, guard)) {
    throw new Error(`adjudicate: unknown guard "${guard}" \u2014 declared guards: ${Object.keys(input.result).join(", ")}`);
  }
  const verbatim = finalText.trim();
  for (const field of extractFields(input.result[guard])) {
    if (verbatimFields.has(field)) {
      Object.defineProperty(obj, field, {
        value: verbatim,
        enumerable: true,
        configurable: true,
        writable: true
      });
      continue;
    }
    if (typeof obj[field] !== "string") {
      if (guard === "needsBossReply" && field === "question") {
        throw new Error(BOSS_REPLY_ERRORS.missingQuestion);
      }
      throw new Error(`adjudicate: judge response missing required field "${field}" for guard "${guard}"`);
    }
  }
  return obj;
}
function validateBossReplyOutput(input, output, resumableStateIds) {
  if (output.guard !== "needsBossReply")
    return;
  if (typeof output.question !== "string") {
    throw new Error(BOSS_REPLY_ERRORS.missingQuestion);
  }
  if (!resumableStateIds.has(input.stateId)) {
    throw new Error(BOSS_REPLY_ERRORS.unregisteredState(input.stateId));
  }
}
function createPlayerBridge(spec, ports, getActiveSignal, boundary, onControlPlaneError) {
  const execute = async ({ input, signal }) => {
    const activeSignal = combineAbortSignals(signal, getActiveSignal?.());
    let roleId;
    let prompt;
    try {
      spec.validateInput?.(input);
      roleId = spec.resolveRoleId(input);
      prompt = spec.composePlayerPrompt(input);
    } catch (error) {
      if (!isAbortFailure(error, activeSignal)) {
        onControlPlaneError?.(error);
      }
      throw error;
    }
    const callPlayer = (resume) => boundary ? boundary.callPlayer(input, roleId, prompt, activeSignal) : ports.callPlayer(roleId, prompt, activeSignal, { resume });
    let result = await callPlayer(false);
    if (result.status === "ok" && isEmptyFinalText(result.finalText) && (spec.allowsCorrectiveReplay?.(result) ?? true)) {
      activeSignal.throwIfAborted();
      result = await callPlayer(typeof result.resumeToken === "string" && result.resumeToken.trim().length > 0 ? result.resumeToken : false);
    }
    if (result.status !== "ok") {
      const failure = new Error(result.error ?? `captainBridge: callPlayer status "${result.status}"`);
      throw boundary?.markPlayerResultFailure?.(failure, result) ?? failure;
    }
    const finalText = result.finalText ?? "";
    if (isEmptyFinalText(finalText)) {
      throw new Error("captainBridge: callPlayer returned status=ok with no finalText");
    }
    try {
      const governed = boundary?.takeGovernedPlayerOutput?.(result);
      if (governed?.status === "unresolved") {
        throw governed.error;
      }
      const output = governed?.status === "resolved" ? governed.output : await adjudicatePlayerOutput(spec.adjudication, input, finalText, ports, activeSignal, boundary);
      boundary?.recordGovernedPlayerOutput?.(result, output);
      validateBossReplyOutput(input, output, spec.resumableStateIds);
      return output;
    } catch (error) {
      if (!isAbortFailure(error, activeSignal) && !isFsmResultFailure(error)) {
        onControlPlaneError?.(error);
      }
      throw error;
    }
  };
  return fromPromise((args) => spec.run ? spec.run(args.input, args.signal, () => execute(args)) : execute(args));
}
function defaultBuildCaptainJudgePrompt(input, finalText) {
  const lines = [];
  lines.push("Adjudicate the direct Captain output for this FSM state.");
  lines.push(`State id: ${input.stateId}`);
  lines.push(`Source item: ${input.sourceItem}`);
  lines.push("");
  lines.push("Visible Captain output:");
  lines.push("```");
  lines.push(finalText);
  lines.push("```");
  lines.push("");
  lines.push("Result keys and descriptions:");
  for (const [key, description] of Object.entries(input.result)) {
    lines.push(`- \`${key}\` \u2014 ${description}`);
  }
  lines.push("");
  lines.push("Pick exactly one outcome by `guard` and return JSON `{ guard, \u2026structuralPayloadFields }`. Do not include `question` or `response`; the runtime injects the visible text.");
  return lines.join("\n");
}
function adjudicateCaptainOutput(extractFields, input, finalText, judgeText) {
  const parsed = parseJudgeJson(judgeText);
  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    throw new Error("adjudicate: judge response is not a JSON object");
  }
  const obj = parsed;
  const guard = obj.guard;
  if (typeof guard !== "string") {
    throw new Error('adjudicate: judge response missing string "guard" field');
  }
  if (!Object.prototype.hasOwnProperty.call(input.result, guard)) {
    throw new Error(`adjudicate: unknown guard "${guard}" \u2014 declared guards: ${Object.keys(input.result).join(", ")}`);
  }
  const required = extractFields(input.result[guard]);
  const allowed = /* @__PURE__ */ new Set(["guard"]);
  for (const field of required) {
    if (field !== "question" && field !== "response")
      allowed.add(field);
  }
  for (const key of Object.keys(obj)) {
    if (!allowed.has(key)) {
      throw new Error(`adjudicate: judge response supplied undeclared field "${key}" for guard "${guard}"`);
    }
  }
  for (const field of required) {
    if (field === "question" || field === "response")
      continue;
    if (obj[field] === void 0 || obj[field] === null) {
      throw new Error(`adjudicate: judge response missing required field "${field}" for guard "${guard}"`);
    }
  }
  const output = { ...obj, guard };
  if (required.includes("question"))
    output.question = finalText;
  if (required.includes("response"))
    output.response = finalText;
  return output;
}
function stripIdPrefix(target) {
  return target.startsWith("#") ? target.slice(1) : target;
}
function collectInvokeSources(machine) {
  const sources = /* @__PURE__ */ new Set();
  const visit = (stateDef) => {
    if (!isPlainObject(stateDef))
      return;
    const invoke = stateDef.invoke;
    const invokes = Array.isArray(invoke) ? invoke : invoke ? [invoke] : [];
    for (const entry2 of invokes) {
      if (isPlainObject(entry2) && typeof entry2.src === "string") {
        sources.add(entry2.src);
      }
    }
    if (isPlainObject(stateDef.states)) {
      for (const child of Object.values(stateDef.states))
        visit(child);
    }
  };
  visit(machine.config);
  return sources;
}
function collectPlayerStateRoles(machine) {
  const roles = /* @__PURE__ */ new Map();
  const visit = (stateDef, stateKey) => {
    if (!isPlainObject(stateDef))
      return;
    const invoke = stateDef.invoke;
    const invokes = Array.isArray(invoke) ? invoke : invoke ? [invoke] : [];
    if (invokes.some((entry2) => isPlainObject(entry2) && entry2.src === "player")) {
      const playbookMeta = isPlainObject(stateDef.meta) ? stateDef.meta.playbook : void 0;
      const stateId = isPlainObject(playbookMeta) && typeof playbookMeta.stateId === "string" ? playbookMeta.stateId : typeof stateDef.id === "string" ? stateDef.id : stateKey;
      if (stateId.trim().length === 0) {
        throw new TypeError("player state metadata must use a non-empty state id");
      }
      const role = isPlainObject(playbookMeta) ? playbookMeta.role : void 0;
      if (typeof role !== "string" || role.trim().length === 0) {
        throw new TypeError(`player state ${stateId} meta.playbook.role must be a non-empty string`);
      }
      roles.set(stateId, role);
    }
    if (isPlainObject(stateDef.states)) {
      for (const [childKey, child] of Object.entries(stateDef.states)) {
        visit(child, childKey);
      }
    }
  };
  const config = machine.config;
  if (isPlainObject(config) && isPlainObject(config.states)) {
    for (const [stateKey, stateDef] of Object.entries(config.states)) {
      visit(stateDef, stateKey);
    }
  }
  return roles;
}
function transitionTargets(transition) {
  const arms = Array.isArray(transition) ? transition : [transition];
  const targets = [];
  for (const arm of arms) {
    if (typeof arm === "string") {
      targets.push(stripIdPrefix(arm));
    } else if (isPlainObject(arm) && typeof arm.target === "string") {
      targets.push(stripIdPrefix(arm.target));
    }
  }
  return targets;
}
function transitionArmTargets(transition) {
  const arms = Array.isArray(transition) ? transition : [transition];
  const targets = [];
  for (const arm of arms) {
    if (typeof arm === "string") {
      targets.push(arm);
    } else if (isPlainObject(arm) && typeof arm.target === "string") {
      targets.push(arm.target);
    }
  }
  return targets;
}
function playbookStateIdOf(stateDef) {
  if (!isPlainObject(stateDef) || !isPlainObject(stateDef.meta)) {
    return void 0;
  }
  const playbook = stateDef.meta.playbook;
  return isPlainObject(playbook) && typeof playbook.stateId === "string" ? playbook.stateId : void 0;
}
function stateTagsOf(stateDef) {
  const tags = stateDef.tags;
  if (typeof tags === "string")
    return [tags];
  return Array.isArray(tags) ? tags.filter((tag) => typeof tag === "string") : [];
}
function playbookStateIdsByNodeId(config) {
  const byNodeId = /* @__PURE__ */ new Map();
  const visit = (stateDef) => {
    if (!isPlainObject(stateDef))
      return;
    const stateId = playbookStateIdOf(stateDef);
    if (typeof stateDef.id === "string" && stateId !== void 0) {
      byNodeId.set(stateDef.id, stateId);
    }
    if (isPlainObject(stateDef.states)) {
      for (const child of Object.values(stateDef.states))
        visit(child);
    }
  };
  if (isPlainObject(config) && isPlainObject(config.states)) {
    for (const child of Object.values(config.states))
      visit(child);
  }
  return byNodeId;
}
function resolveRegionTarget(target, regionStates, byNodeId) {
  if (target.startsWith("#")) {
    const nodeId = target.slice(1);
    return byNodeId.get(nodeId) ?? nodeId;
  }
  if (Object.prototype.hasOwnProperty.call(regionStates, target)) {
    return playbookStateIdOf(regionStates[target]) ?? target;
  }
  return target;
}
function resumableStateIdsFromMachine(machine) {
  const config = machine.config;
  if (!isPlainObject(config) || !isPlainObject(config.states)) {
    return /* @__PURE__ */ new Set();
  }
  const resumable = /* @__PURE__ */ new Set();
  const awaitState = config.states[BOSS_REPLY_WAIT_STATE_ID];
  if (isPlainObject(awaitState) && isPlainObject(awaitState.on)) {
    const bossReply = awaitState.on.BOSS_REPLY;
    if (bossReply !== void 0) {
      for (const target of transitionTargets(bossReply))
        resumable.add(target);
    }
  }
  const byNodeId = playbookStateIdsByNodeId(config);
  for (const stateDef of Object.values(config.states)) {
    if (!isPlainObject(stateDef) || stateDef.type !== "parallel" || !isPlainObject(stateDef.states)) {
      continue;
    }
    for (const region of Object.values(stateDef.states)) {
      if (!isPlainObject(region) || !isPlainObject(region.states))
        continue;
      const regionStates = region.states;
      for (const leaf of Object.values(regionStates)) {
        if (!isPlainObject(leaf) || !isPlainObject(leaf.on))
          continue;
        const bossReply = leaf.on.BOSS_REPLY;
        if (bossReply === void 0)
          continue;
        for (const target of transitionArmTargets(bossReply)) {
          resumable.add(resolveRegionTarget(target, regionStates, byNodeId));
        }
      }
    }
  }
  return resumable;
}
function malformedParallelState(label, key, reason) {
  return new Error(`${label} parallel state ${key} is not the compiled parallel shape: ${reason}`);
}
function parallelProfileFromMachine(machine, label) {
  const config = machine.config;
  if (!isPlainObject(config) || !isPlainObject(config.states)) {
    return void 0;
  }
  const rootStates = config.states;
  const parallelKeys = Object.entries(rootStates).filter(([, stateDef]) => isPlainObject(stateDef) && stateDef.type === "parallel").map(([key]) => key);
  for (const stateDef of Object.values(rootStates)) {
    if (isPlainObject(stateDef) && stateDef.type !== "parallel" && isPlainObject(stateDef.states) && Object.keys(stateDef.states).length > 0) {
      throw new Error(`${label} declares a compound state; the shared runtime supports only flat single-region FSMs`);
    }
  }
  if (parallelKeys.length === 0)
    return void 0;
  const byNodeId = playbookStateIdsByNodeId(config);
  const seenStateIds = /* @__PURE__ */ new Set();
  for (const stateDef of Object.values(rootStates)) {
    const stateId = playbookStateIdOf(stateDef);
    if (stateId !== void 0)
      seenStateIds.add(stateId);
  }
  const states = [];
  const parallelStateByWorkingStateId = /* @__PURE__ */ new Map();
  const waitResumeTargets = /* @__PURE__ */ new Map();
  const transitionNodesByStateId = /* @__PURE__ */ new Map();
  for (const key of parallelKeys) {
    const parent = rootStates[key];
    if (parent.onDone === void 0) {
      throw malformedParallelState(label, key, "it declares no onDone join");
    }
    if (!isPlainObject(parent.states) || Object.keys(parent.states).length < 2) {
      throw malformedParallelState(label, key, "it must declare at least two regions");
    }
    const regions = [];
    const roleIds = /* @__PURE__ */ new Set();
    for (const [regionKey, region] of Object.entries(parent.states)) {
      const regionReason = (reason) => malformedParallelState(label, key, `region ${regionKey} ${reason}`);
      if (!isPlainObject(region) || region.type === "parallel" || region.type === "final" || region.type === "history" || !isPlainObject(region.states)) {
        throw regionReason("must be a compound state of leaves");
      }
      const regionStates = region.states;
      let working;
      let wait;
      let final;
      for (const [leafKey, leaf] of Object.entries(regionStates)) {
        if (!isPlainObject(leaf)) {
          throw regionReason(`leaf ${leafKey} must be a state object`);
        }
        if (isPlainObject(leaf.states) && Object.keys(leaf.states).length > 0 || leaf.type === "parallel" || leaf.type === "history") {
          throw regionReason(`leaf ${leafKey} must be an atomic state`);
        }
        const leafStateId = playbookStateIdOf(leaf);
        if (leafStateId === void 0 || leafStateId.trim().length === 0) {
          throw regionReason(`leaf ${leafKey} must carry a string meta.playbook.stateId`);
        }
        if (seenStateIds.has(leafStateId)) {
          throw regionReason(`leaf ${leafKey} reuses playbook state id ${leafStateId}`);
        }
        seenStateIds.add(leafStateId);
        const invoke = leaf.invoke;
        const invokes = Array.isArray(invoke) ? invoke : invoke ? [invoke] : [];
        const tags = stateTagsOf(leaf);
        if (leaf.type === "final") {
          if (final !== void 0)
            throw regionReason("declares two final leaves");
          final = [leafKey, leaf];
        } else if (invokes.length === 1 && isPlainObject(invokes[0]) && invokes[0].src === "player" && tags.includes("playbook.busy")) {
          if (working !== void 0) {
            throw regionReason("declares two working leaves");
          }
          working = [leafKey, leaf];
        } else if (invokes.length === 0 && tags.includes("playbook.parked") && isPlainObject(leaf.on) && leaf.on.BOSS_REPLY !== void 0) {
          if (wait !== void 0)
            throw regionReason("declares two wait leaves");
          wait = [leafKey, leaf];
        } else {
          throw regionReason(`leaf ${leafKey} is neither its player-invoking playbook.busy working leaf, its playbook.parked BOSS_REPLY wait leaf, nor its final leaf`);
        }
      }
      if (working === void 0 || wait === void 0 || final === void 0) {
        throw regionReason("must hold exactly one working leaf, one wait leaf, and one final leaf");
      }
      if (region.initial !== working[0]) {
        throw regionReason("must start in its working leaf");
      }
      const workingStateId = playbookStateIdOf(working[1]);
      const waitStateId = playbookStateIdOf(wait[1]);
      const finalStateId = playbookStateIdOf(final[1]);
      const replyTargets = transitionArmTargets(wait[1].on.BOSS_REPLY).map((target) => resolveRegionTarget(target, regionStates, byNodeId));
      const regionStateIds = /* @__PURE__ */ new Set([waitStateId, finalStateId]);
      if (!replyTargets.includes(workingStateId) || replyTargets.some((target) => regionStateIds.has(target))) {
        throw regionReason("wait leaf BOSS_REPLY arms must resume its working leaf");
      }
      const workingMeta = working[1].meta.playbook;
      const roleId = workingMeta.role;
      if (typeof roleId !== "string" || roleId.trim().length === 0) {
        throw regionReason("working leaf must declare meta.playbook.role");
      }
      if (roleIds.has(roleId)) {
        throw malformedParallelState(label, key, `role ${roleId} works in more than one region`);
      }
      roleIds.add(roleId);
      regions.push({
        key: regionKey,
        roleId,
        workingStateId,
        waitStateId,
        finalStateId
      });
      waitResumeTargets.set(waitStateId, /* @__PURE__ */ new Set([workingStateId]));
      for (const [, leaf] of [working, wait, final]) {
        transitionNodesByStateId.set(playbookStateIdOf(leaf), [region, leaf]);
      }
    }
    const parallelState = {
      stateId: key,
      regions: Object.freeze(regions)
    };
    states.push(parallelState);
    for (const region of regions) {
      parallelStateByWorkingStateId.set(region.workingStateId, parallelState);
    }
    transitionNodesByStateId.set(key, [parent]);
  }
  for (const [key, stateDef] of Object.entries(rootStates)) {
    if (!isPlainObject(stateDef) || parallelKeys.includes(key))
      continue;
    transitionNodesByStateId.set(key, [stateDef]);
  }
  const rootWait = rootStates[BOSS_REPLY_WAIT_STATE_ID];
  if (isPlainObject(rootWait) && isPlainObject(rootWait.on)) {
    const bossReply = rootWait.on.BOSS_REPLY;
    if (bossReply !== void 0) {
      waitResumeTargets.set(BOSS_REPLY_WAIT_STATE_ID, new Set(transitionTargets(bossReply)));
    }
  }
  return Object.freeze({
    states: Object.freeze(states),
    parallelStateByWorkingStateId,
    waitResumeTargets,
    transitionNodesByStateId
  });
}
var JUMP_EVENT_TYPE = "BOSS_INTERRUPT";
function stateDescriptionsFromMachine(machine) {
  const descriptions = /* @__PURE__ */ new Map();
  const record = (key, description) => {
    if (typeof key !== "string" || key.length === 0)
      return;
    if (!descriptions.has(key))
      descriptions.set(key, description);
  };
  const visit = (key, stateDef) => {
    if (!isPlainObject(stateDef))
      return;
    const playbook = isPlainObject(stateDef.meta) ? stateDef.meta.playbook : void 0;
    const description = isPlainObject(playbook) && typeof playbook.description === "string" ? playbook.description : typeof stateDef.description === "string" ? stateDef.description : void 0;
    if (description !== void 0 && description.length > 0) {
      record(key, description);
      record(stateDef.id, description);
      if (isPlainObject(playbook))
        record(playbook.stateId, description);
    }
    if (isPlainObject(stateDef.states)) {
      for (const [childKey, child] of Object.entries(stateDef.states)) {
        visit(childKey, child);
      }
    }
  };
  const config = machine.config;
  if (isPlainObject(config) && isPlainObject(config.states)) {
    for (const [key, stateDef] of Object.entries(config.states)) {
      visit(key, stateDef);
    }
  }
  return descriptions;
}
function terminalOutcomesFromMachine(machine, label = "playbook") {
  const kinds = /* @__PURE__ */ new Map();
  const config = machine.config;
  if (!isPlainObject(config) || !isPlainObject(config.states))
    return kinds;
  for (const [key, stateDef] of Object.entries(config.states)) {
    if (!isPlainObject(stateDef))
      continue;
    const playbook = isPlainObject(stateDef.meta) ? stateDef.meta.playbook : void 0;
    const declared = isPlainObject(playbook) ? playbook.terminal : void 0;
    if (declared === void 0)
      continue;
    if (declared !== "success" && declared !== "failure") {
      throw new TypeError(`${label} state ${key} declares meta.playbook.terminal ${JSON.stringify(declared)}; only 'success' or 'failure' is a terminal kind`);
    }
    if (stateDef.type !== "final") {
      throw new TypeError(`${label} state ${key} declares meta.playbook.terminal but is not a final state`);
    }
    kinds.set(key, declared);
  }
  return kinds;
}
function firstTransitionTarget(machine, stateId, eventType) {
  const config = machine.config;
  if (!isPlainObject(config))
    return void 0;
  const candidates = [];
  if (stateId !== void 0 && isPlainObject(config.states)) {
    const state = config.states[stateId];
    if (isPlainObject(state) && isPlainObject(state.on)) {
      candidates.push(state.on[eventType]);
    }
  }
  if (isPlainObject(config.on))
    candidates.push(config.on[eventType]);
  for (const candidate of candidates) {
    if (candidate === void 0)
      continue;
    const targets = transitionTargets(candidate);
    if (targets.length > 0)
      return targets[0];
  }
  return void 0;
}
function deepFreeze(value) {
  if (value !== null && typeof value === "object" && !Object.isFrozen(value)) {
    Object.freeze(value);
    for (const member of Object.values(value))
      deepFreeze(member);
  }
  return value;
}
var SUPPRESSED_ENTRY_STATES = /* @__PURE__ */ new Set(["ready", "done"]);
var SCRIPT_ABORT_KILL_GRACE_MS = 2e3;
var ScriptProcessGroupTeardownError = class extends Error {
  constructor(pid, message, cause) {
    super(`script process group ${pid} teardown could not be confirmed: ${message}`, cause === void 0 ? void 0 : { cause });
    this.name = "ScriptProcessGroupTeardownError";
  }
};
function isNoSuchProcess(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "ESRCH";
}
function isProcessPermissionDenied(error) {
  return typeof error === "object" && error !== null && "code" in error && error.code === "EPERM";
}
function makeDefaultNormalizeTransitionEvent(transitionEventFields) {
  return (event) => {
    if (event === null || typeof event !== "object") {
      return snapshotJsonValue(event ?? null, "FSM event");
    }
    const e = event;
    const out = {};
    if (typeof e.type === "string")
      out.type = e.type;
    for (const field of transitionEventFields) {
      if (typeof e[field] === "string")
        out[field] = e[field];
    }
    if (e.output !== void 0) {
      out.output = snapshotJsonValue(e.output, "FSM event output");
    }
    if (e.error !== void 0) {
      out.error = snapshotJsonValue(normalizeError(e.error), "FSM event error");
    }
    return snapshotJsonValue(out, "FSM event");
  };
}
function snapshotRoleStateStatuses(value, label, machine, stateDescriptions) {
  if (value === void 0) {
    throw new TypeError(`${label} roleStates must be supplied for schema 3`);
  }
  const captured = snapshotJsonValue(value, `${label} roleStates`);
  if (!isPlainObject(captured)) {
    throw new TypeError(`${label} roleStates must be an object`);
  }
  const declared = collectPlayerStateRoles(machine);
  const statuses = /* @__PURE__ */ new Map();
  for (const [stateId, candidate] of Object.entries(captured)) {
    if (!declared.has(stateId)) {
      throw new TypeError(`${label} roleStates.${stateId} does not name a player state`);
    }
    if (isPlainObject(candidate)) {
      const extra = Object.keys(candidate).find((key) => key !== "role" && key !== "label");
      if (extra !== void 0) {
        throw new TypeError(`${label} roleStates.${stateId}.${extra} is not allowed`);
      }
    }
    if (!isPlainObject(candidate) || typeof candidate.role !== "string" || candidate.role.trim().length === 0 || typeof candidate.label !== "string" || candidate.label.trim().length === 0) {
      throw new TypeError(`${label} roleStates.${stateId} must carry non-empty role and label strings`);
    }
    const expectedLabel = stateDescriptions.get(stateId);
    if (candidate.label !== expectedLabel) {
      throw new TypeError(`${label} roleStates.${stateId}.label must equal its FSM description`);
    }
    if (candidate.role !== declared.get(stateId)) {
      throw new TypeError(`${label} roleStates.${stateId}.role must equal its FSM role`);
    }
    statuses.set(stateId, {
      role: candidate.role,
      label: candidate.label
    });
  }
  for (const stateId of declared.keys()) {
    if (!statuses.has(stateId)) {
      throw new TypeError(`${label} roleStates must declare player state ${stateId}`);
    }
  }
  return statuses;
}
var OUTCOME_FIELD_AUTHORITIES = /* @__PURE__ */ new Set([
  "presentation",
  "semantic",
  "effect",
  "runtime"
]);
var REPOSITORY_DISPOSITIONS2 = /* @__PURE__ */ new Set([
  "unchanged",
  "one-descendant-commit",
  "deferred"
]);
var OUTCOME_FIELD_KEY_PATTERN = /^[A-Za-z_$][A-Za-z0-9_$]*$/;
var SEMANTIC_PAYLOAD_FIELDS = /* @__PURE__ */ new Set([
  "irNumber",
  "irTask"
]);
function requireExactObjectKeys(value, expected, path) {
  const actual = Object.keys(value);
  const missing = expected.filter((key) => !actual.includes(key));
  const extra = actual.filter((key) => !expected.includes(key));
  if (missing.length === 0 && extra.length === 0)
    return;
  throw new TypeError(`${path} must contain exactly ${expected.join(", ")}` + (missing.length === 0 ? "" : `; missing ${missing.join(", ")}`) + (extra.length === 0 ? "" : `; unknown ${extra.join(", ")}`));
}
function requireAuthorityIdentifier(value, path) {
  if (!OUTCOME_FIELD_KEY_PATTERN.test(value)) {
    throw new TypeError(`${path} must be an identifier`);
  }
}
function snapshotOutcomeAuthority(descriptor, label, playerStates, verbatimPayloadFields) {
  const path = `${label} outcomeAuthority`;
  if (descriptor === void 0 || !Object.prototype.hasOwnProperty.call(descriptor, "value") || descriptor.enumerable !== true) {
    throw new TypeError(`${path} must be an own enumerable data property for schema 3`);
  }
  const captured = snapshotJsonValue(descriptor.value, path);
  if (!isPlainObject(captured)) {
    throw new TypeError(`${path} must be an object`);
  }
  requireExactObjectKeys(captured, ["governedPlayerStates"], path);
  const governed = captured.governedPlayerStates;
  if (!isPlainObject(governed)) {
    throw new TypeError(`${path}.governedPlayerStates must be an object`);
  }
  for (const stateId of playerStates.keys()) {
    if (!Object.prototype.hasOwnProperty.call(governed, stateId)) {
      throw new TypeError(`${path}.governedPlayerStates must declare player state ${stateId}`);
    }
  }
  for (const stateId of Object.keys(governed)) {
    if (!playerStates.has(stateId)) {
      throw new TypeError(`${path}.governedPlayerStates.${stateId} does not name a player state`);
    }
  }
  const usedVerbatimFields = /* @__PURE__ */ new Set();
  const normalizedStates = /* @__PURE__ */ Object.create(null);
  for (const [stateId, rawOutcomes] of Object.entries(governed)) {
    const statePath = `${path}.governedPlayerStates.${stateId}`;
    if (!isPlainObject(rawOutcomes) || Object.keys(rawOutcomes).length === 0) {
      throw new TypeError(`${statePath} must declare at least one outcome`);
    }
    const outcomes = /* @__PURE__ */ Object.create(null);
    for (const [outcome, rawSpec] of Object.entries(rawOutcomes)) {
      requireAuthorityIdentifier(outcome, `${statePath} outcome key`);
      const outcomePath = `${statePath}.${outcome}`;
      if (!isPlainObject(rawSpec)) {
        throw new TypeError(`${outcomePath} must be an object`);
      }
      requireExactObjectKeys(rawSpec, ["fields", "repositoryDisposition"], outcomePath);
      if (!isPlainObject(rawSpec.fields)) {
        throw new TypeError(`${outcomePath}.fields must be an object`);
      }
      const fields = /* @__PURE__ */ Object.create(null);
      for (const [field, authority] of Object.entries(rawSpec.fields)) {
        requireAuthorityIdentifier(field, `${outcomePath}.fields key`);
        if (field === "guard") {
          throw new TypeError(`${outcomePath}.fields.guard is not allowed; the outcome key owns the semantic discriminator`);
        }
        if (typeof authority !== "string" || !OUTCOME_FIELD_AUTHORITIES.has(authority)) {
          throw new TypeError(`${outcomePath}.fields.${field} must name presentation, semantic, effect, or runtime authority`);
        }
        const requiredAuthorities = /* @__PURE__ */ new Set();
        if (field === "latestCommit")
          requiredAuthorities.add("effect");
        if (SEMANTIC_PAYLOAD_FIELDS.has(field)) {
          requiredAuthorities.add("semantic");
        }
        if (field === "question" || verbatimPayloadFields.has(field)) {
          requiredAuthorities.add("presentation");
        }
        if (requiredAuthorities.size > 1) {
          throw new TypeError(`${outcomePath}.fields.${field} has conflicting linker authority requirements`);
        }
        const requiredAuthority = [...requiredAuthorities][0];
        if (requiredAuthority !== void 0 && authority !== requiredAuthority) {
          throw new TypeError(`${outcomePath}.fields.${field} must use ${requiredAuthority} authority`);
        }
        if (verbatimPayloadFields.has(field))
          usedVerbatimFields.add(field);
        fields[field] = authority;
      }
      const disposition = rawSpec.repositoryDisposition;
      if (typeof disposition !== "string" || !REPOSITORY_DISPOSITIONS2.has(disposition)) {
        throw new TypeError(`${outcomePath}.repositoryDisposition must be unchanged, one-descendant-commit, or deferred`);
      }
      if (disposition === "deferred" && Object.values(fields).includes("effect")) {
        throw new TypeError(`${outcomePath} may not declare effect-owned fields for deferred`);
      }
      outcomes[outcome] = Object.freeze({
        fields: Object.freeze(fields),
        repositoryDisposition: disposition
      });
    }
    for (const [outcome, outcomeSpec] of Object.entries(outcomes)) {
      if (outcomeSpec.repositoryDisposition !== "deferred")
        continue;
      if (outcome !== "needsBossReply") {
        throw new TypeError(`${statePath}.${outcome} may use deferred only for needsBossReply`);
      }
      if (outcomeSpec.fields.question !== "presentation") {
        throw new TypeError(`${statePath}.needsBossReply deferred outcome must declare presentation-owned question`);
      }
      if (!Object.entries(outcomes).some(([other, candidate]) => other !== outcome && candidate.repositoryDisposition === "one-descendant-commit")) {
        throw new TypeError(`${statePath}.needsBossReply deferred outcome requires another one-descendant-commit outcome`);
      }
    }
    normalizedStates[stateId] = Object.freeze(outcomes);
  }
  for (const field of verbatimPayloadFields) {
    requireAuthorityIdentifier(field, `${path} verbatimPayloadFields entry`);
    if (!usedVerbatimFields.has(field)) {
      throw new TypeError(`${path} verbatimPayloadFields entry ${field} is absent from governed payload fields`);
    }
  }
  return Object.freeze({
    governedPlayerStates: Object.freeze(normalizedStates)
  });
}
function sameStringSet(left, right) {
  if (left.length !== right.length)
    return false;
  const expected = new Set(right);
  return left.every((value) => expected.has(value));
}
function assertGovernedPlayerInput(authority, input, extractFields, label) {
  if (authority === void 0)
    return;
  const state = authority.governedPlayerStates[input.stateId];
  if (state === void 0) {
    throw new TypeError(`${label} outcomeAuthority has no governed player state ${input.stateId}`);
  }
  const actualOutcomes = Object.keys(input.result);
  const governedOutcomes = Object.keys(state);
  if (!sameStringSet(actualOutcomes, governedOutcomes)) {
    throw new TypeError(`${label} outcomeAuthority for ${input.stateId} must exactly match outcomes ` + governedOutcomes.join(", "));
  }
  for (const outcome of governedOutcomes) {
    const description = input.result[outcome];
    if (typeof description !== "string") {
      throw new TypeError(`${label} player outcome ${input.stateId}.${outcome} must have a string description`);
    }
    const describedFields = [...new Set(extractFields(description))];
    const candidateFields = Object.keys(state[outcome].fields);
    if (!sameStringSet(describedFields, candidateFields)) {
      throw new TypeError(`${label} outcomeAuthority fields for ${input.stateId}.${outcome} must exactly match its described output fields`);
    }
  }
}
function askerLabel(asker) {
  return asker.kind === "captain" ? "Captain" : asker.roleId;
}
function makeDefaultStatusesForState(roleStates) {
  return (state, context) => {
    const statuses = [];
    const stateId = state.stateId;
    if (stateId === void 0 || SUPPRESSED_ENTRY_STATES.has(stateId)) {
      return statuses;
    }
    if (stateId === BOSS_REPLY_WAIT_STATE_ID) {
      const pending = pendingBossQuestionFromContext(context);
      if (pending === void 0) {
        return [...statuses, { message: "Awaiting Boss reply." }];
      }
      return [
        ...statuses,
        { message: `${askerLabel(pending.asker)} asks: ${pending.question}`, data: { kind: "boss-question" } },
        {
          message: `\u25C6 awaiting Boss reply \xB7 ${pending.resumeStateId} \xB7 ${askerLabel(pending.asker)} \xB7 ${pending.sourceItem}`,
          data: { kind: "boss-question" }
        }
      ];
    }
    if (stateId === "failed") {
      const lastError = normalizeErrorCompact(context.lastError);
      return [
        ...statuses,
        {
          message: "\u25C6 workflow failed; awaiting Boss recovery.",
          ...lastError === void 0 ? {} : {
            data: snapshotJsonValue({ lastError }, "failed status data")
          }
        }
      ];
    }
    const roleState = roleStates.get(stateId);
    if (roleState !== void 0) {
      statuses.push({
        message: `\u2937 ${roleState.role}: ${roleState.label}`
      });
    }
    return statuses;
  };
}
function classifierState(snapshotOrState) {
  if (snapshotOrState !== null && typeof snapshotOrState === "object" && "value" in snapshotOrState) {
    const candidate = snapshotOrState;
    return {
      value: candidate.value,
      context: candidate.context !== null && typeof candidate.context === "object" && !Array.isArray(candidate.context) ? candidate.context : {}
    };
  }
  return { value: snapshotOrState, context: {} };
}
function configuredEventTypesForState(machine, stateId) {
  const configured = /* @__PURE__ */ new Set();
  const config = machine.config;
  if (!isPlainObject(config))
    return configured;
  if (isPlainObject(config.on)) {
    for (const type of Object.keys(config.on))
      configured.add(type);
  }
  if (stateId !== void 0 && isPlainObject(config.states)) {
    const state = config.states[stateId];
    if (isPlainObject(state) && isPlainObject(state.on)) {
      for (const type of Object.keys(state.on))
        configured.add(type);
    }
  }
  return configured;
}
function mergeDerivedContract(contracts, contract) {
  const existing = contracts.get(contract.type);
  contracts.set(contract.type, {
    type: contract.type,
    fields: { ...existing?.fields ?? {}, ...contract.fields ?? {} }
  });
}
function defaultBossEventSpecs(machine, entryEvent, supplied) {
  const contracts = /* @__PURE__ */ new Map();
  if (entryEvent !== void 0) {
    mergeDerivedContract(contracts, {
      type: entryEvent.type,
      fields: { [entryEvent.textField]: { source: "text", required: true } }
    });
  }
  const config = machine.config;
  const rootInterrupt = isPlainObject(config) && isPlainObject(config.on) ? config.on.BOSS_INTERRUPT : void 0;
  const interruptTargets = rootInterrupt === void 0 ? [] : transitionTargets(rootInterrupt);
  if (interruptTargets.length > 0) {
    mergeDerivedContract(contracts, {
      type: "BOSS_INTERRUPT",
      fields: {
        targetId: {
          source: "judge",
          required: true,
          values: [...new Set(interruptTargets)]
        },
        // slc/link.md §Boss-event mapping: for BOSS_INTENT and
        // BOSS_INTERRUPT the runtime, never the judge, attaches the exact
        // original Boss text as `bossIntent`.
        bossIntent: { source: "text", required: true }
      }
    });
  }
  for (const contract of supplied) {
    if (typeof contract.type !== "string" || contract.type.trim().length === 0) {
      throw new TypeError("Boss event contract type must be a non-empty string");
    }
    if (contract.type === "NO_ACTION" || contract.type === "BOSS_REPLY") {
      throw new TypeError(`Boss event contract ${contract.type} is runtime-owned`);
    }
    const existing = contracts.get(contract.type);
    const fields = {
      ...existing?.fields ?? {}
    };
    for (const [field, fieldSpec] of Object.entries(contract.fields ?? {})) {
      if (field.length === 0 || field === "type") {
        throw new TypeError(`Boss event contract ${contract.type} has invalid field ${JSON.stringify(field)}`);
      }
      if (fieldSpec.source !== "judge" && fieldSpec.source !== "text") {
        throw new TypeError(`Boss event contract ${contract.type}.${field} has invalid source`);
      }
      if (fieldSpec.values !== void 0) {
        if (fieldSpec.source !== "judge" || fieldSpec.values.length === 0 || fieldSpec.values.some((value) => typeof value !== "string" || value.length === 0)) {
          throw new TypeError(`Boss event contract ${contract.type}.${field} has invalid values`);
        }
      }
      const normalized = {
        source: fieldSpec.source,
        ...fieldSpec.required === true ? { required: true } : {},
        ...fieldSpec.values === void 0 ? {} : { values: [...new Set(fieldSpec.values)] }
      };
      const derived = fields[field];
      if (derived !== void 0) {
        const derivedValues = derived.values === void 0 ? void 0 : new Set(derived.values);
        const normalizedValues = normalized.values === void 0 ? void 0 : new Set(normalized.values);
        const sameValues = derivedValues === void 0 || normalizedValues === void 0 ? derivedValues === normalizedValues : derivedValues.size === normalizedValues.size && [...derivedValues].every((value) => normalizedValues.has(value));
        if (derived.source !== normalized.source || derived.required === true !== (normalized.required === true) || !sameValues) {
          throw new TypeError(`Boss event contract ${contract.type}.${field} conflicts with the runtime-derived contract`);
        }
        continue;
      }
      fields[field] = normalized;
    }
    contracts.set(contract.type, { type: contract.type, fields });
  }
  contracts.set("BOSS_REPLY", {
    type: "BOSS_REPLY",
    fields: {
      questionId: { source: "judge" },
      answer: { source: "text", required: true }
    }
  });
  return contracts;
}
function eventContractPrompt(contract) {
  const fields = Object.entries(contract.fields ?? {}).filter(([, field]) => field.source === "judge");
  const members = [
    `"type": ${JSON.stringify(contract.type)}`,
    ...fields.map(([name, field]) => `${JSON.stringify(name)}: ${JSON.stringify(field.values?.[0] ?? "<string>")}`)
  ];
  const notes = fields.flatMap(([name, field]) => [
    ...field.required === true ? [] : [`${name} optional`],
    ...field.values === void 0 ? [] : [
      `${name} one of ${field.values.map((value) => JSON.stringify(value)).join(", ")}`
    ]
  ]);
  return `{ ${members.join(", ")} }${notes.length === 0 ? "" : ` (${notes.join("; ")})`}`;
}
function parallelPendingBossQuestions(profile, activeStateIds, context) {
  return keyedPendingBossQuestions(context, (resumeStateId) => activeStateIds.some((stateId) => profile.waitResumeTargets.get(stateId)?.has(resumeStateId) === true));
}
function parallelConfiguredEventTypes(machine, profile, activeStateIds) {
  const configured = /* @__PURE__ */ new Set();
  const config = machine.config;
  if (!isPlainObject(config))
    return configured;
  if (isPlainObject(config.on)) {
    for (const type of Object.keys(config.on))
      configured.add(type);
  }
  for (const stateId of activeStateIds) {
    for (const node of profile.transitionNodesByStateId.get(stateId) ?? []) {
      if (!isPlainObject(node.on))
        continue;
      for (const type of Object.keys(node.on))
        configured.add(type);
    }
  }
  return configured;
}
function activeStateIdsOf(snapshotOrState) {
  const listed = snapshotOrState?.activeStateIds;
  if (Array.isArray(listed)) {
    return listed.filter((stateId) => typeof stateId === "string");
  }
  try {
    return normalizePlaybookSnapshot(snapshotOrState).activeStateIds;
  } catch {
    return [];
  }
}
function makeDefaultClassifyBossText(machine, entryEvent, bossEvents, parallelProfile) {
  const contracts = defaultBossEventSpecs(machine, entryEvent, bossEvents);
  return async (text, ports, signal, snapshotOrState, boundary) => {
    const trimmed = text.trim();
    if (trimmed === "")
      return void 0;
    const state = classifierState(snapshotOrState);
    const stateId = typeof state.value === "string" ? state.value : void 0;
    const currentState = stateId ?? JSON.stringify(state.value ?? null);
    let pendingQuestions;
    let configuredTypes;
    if (parallelProfile === void 0) {
      const pending = stateId === BOSS_REPLY_WAIT_STATE_ID ? pendingBossQuestionFromContext(state.context) : void 0;
      pendingQuestions = pending === void 0 ? [] : [pending];
      configuredTypes = configuredEventTypesForState(machine, stateId);
    } else {
      const activeStateIds = activeStateIdsOf(snapshotOrState);
      pendingQuestions = parallelPendingBossQuestions(parallelProfile, activeStateIds, state.context);
      configuredTypes = parallelConfiguredEventTypes(machine, parallelProfile, activeStateIds);
    }
    const severalPending = pendingQuestions.length > 1;
    const applicable = [...contracts.values()].filter((contract2) => configuredTypes.has(contract2.type) && (contract2.type !== "BOSS_REPLY" || pendingQuestions.length > 0)).map((contract2) => contract2.type === "BOSS_REPLY" && severalPending ? {
      type: "BOSS_REPLY",
      fields: {
        questionId: {
          source: "judge",
          required: true,
          values: pendingQuestions.map(({ questionId }) => questionId)
        },
        answer: { source: "text", required: true }
      }
    } : contract2);
    const lines = [
      "Classify the following Boss message into exactly one event.",
      "Respond with one exact flat JSON object. Do not add fields that are not shown.",
      "The runtime, not the judge, attaches the exact Boss text to textual event fields.",
      "",
      `Current state: ${currentState}`
    ];
    for (const pending of pendingQuestions) {
      lines.push(`Pending question id: ${pending.questionId}`, `Pending asker: ${askerLabel(pending.asker)}`, `Pending Boss question: ${pending.question}`);
    }
    if (severalPending) {
      lines.push("Several Boss questions are pending: a BOSS_REPLY must name the questionId of the one question it answers.");
    }
    lines.push("", "Allowed JSON objects:", '- { "type": "NO_ACTION" }');
    for (const contract2 of applicable) {
      lines.push(`- ${eventContractPrompt(contract2)}`);
    }
    lines.push("", "Boss message:", "```", text, "```");
    const prompt = lines.join("\n");
    const raw = boundary ? await boundary.callJudge("boss-input-classification", stateId, prompt, signal) : await ports.callJudge(prompt, signal);
    let parsed;
    try {
      parsed = parseJudgeJson(raw);
    } catch {
      await ports.emitStatus("Classifier reply was not recoverable JSON");
      return void 0;
    }
    if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
      await ports.emitStatus("Classifier returned a non-object JSON response");
      return void 0;
    }
    const obj = parsed;
    const eventType = obj.type;
    if (typeof eventType !== "string") {
      await ports.emitStatus("Classifier did not name an event type");
      return void 0;
    }
    if (eventType === "NO_ACTION") {
      if (Object.keys(obj).length !== 1) {
        await ports.emitStatus("Classifier supplied extra fields for NO_ACTION");
        return void 0;
      }
      return void 0;
    }
    const contract = applicable.find((candidate) => candidate.type === eventType);
    if (contract === void 0) {
      await ports.emitStatus(`Classifier returned unknown or inapplicable event type: ${eventType}`);
      return void 0;
    }
    const fields = contract.fields ?? {};
    const judgeFields = new Set(Object.entries(fields).filter(([, field]) => field.source === "judge").map(([field]) => field));
    const extras = Object.keys(obj).filter((field) => field !== "type" && !judgeFields.has(field));
    if (extras.length > 0) {
      await ports.emitStatus(`Classifier supplied undeclared field for ${eventType}: ${extras[0]}`);
      return void 0;
    }
    const event = { type: eventType };
    for (const [field, fieldSpec] of Object.entries(fields)) {
      if (fieldSpec.source === "text") {
        event[field] = text;
        continue;
      }
      const value = obj[field];
      if (value === void 0 && fieldSpec.required !== true)
        continue;
      if (typeof value !== "string" || value.length === 0) {
        await ports.emitStatus(`Classifier omitted or invalidated ${field} for ${eventType}`);
        return void 0;
      }
      if (fieldSpec.values !== void 0 && !fieldSpec.values.includes(value)) {
        await ports.emitStatus(`Classifier supplied unknown ${field} for ${eventType}: ${value}`);
        return void 0;
      }
      event[field] = value;
    }
    if (eventType === "BOSS_REPLY") {
      if (pendingQuestions.length === 0) {
        await ports.emitStatus("Classifier returned BOSS_REPLY without a pending question");
        return void 0;
      }
      if (!severalPending) {
        const pending = pendingQuestions[0];
        const questionId = event.questionId;
        if (questionId !== void 0 && questionId !== pending.questionId) {
          await ports.emitStatus(`Classifier supplied unknown questionId for BOSS_REPLY: ${String(questionId)}`);
          return void 0;
        }
        event.questionId = pending.questionId;
      }
    }
    const can2 = snapshotOrState?.can;
    if (typeof can2 === "function" && !can2.call(snapshotOrState, event)) {
      await ports.emitStatus(`Classifier selected ${eventType}, but its state guards rejected the event`);
      return void 0;
    }
    return event;
  };
}
function assertFlatStateIdentity(machine, label) {
  const config = machine.config;
  const states = isPlainObject(config) && isPlainObject(config.states) ? config.states : void 0;
  if (states === void 0 || Object.keys(states).length === 0) {
    throw new Error(`${label} declares no root states; the shared runtime requires at least one flat playbook state`);
  }
  for (const [key, stateDef] of Object.entries(states)) {
    if (!isPlainObject(stateDef))
      continue;
    const meta2 = isPlainObject(stateDef.meta) ? stateDef.meta : void 0;
    const playbook = meta2 !== void 0 && isPlainObject(meta2.playbook) ? meta2.playbook : void 0;
    const stateId = playbook?.stateId;
    if (typeof stateId !== "string") {
      throw new Error(`${label} state ${key} declares no string meta.playbook.stateId; the shared runtime derives every playbook state identity from it`);
    }
    if (stateId !== key) {
      throw new Error(`${label} state ${key} declares meta.playbook.stateId ${stateId}; the shared runtime requires the playbook state id to equal the state key`);
    }
  }
}
function rootFinalStateIdsFromMachine(machine) {
  const config = machine.config;
  if (!isPlainObject(config) || !isPlainObject(config.states)) {
    return /* @__PURE__ */ new Set();
  }
  const stateIds = /* @__PURE__ */ new Set();
  for (const [stateId, stateDef] of Object.entries(config.states)) {
    if (isPlainObject(stateDef) && stateDef.type === "final") {
      stateIds.add(stateId);
    }
  }
  return stateIds;
}
function assertUnfinishedFinalStateIds(value, machine, label) {
  if (value === void 0)
    return;
  const rootFinalStateIds = rootFinalStateIdsFromMachine(machine);
  for (const stateId of value) {
    if (typeof stateId !== "string" || !rootFinalStateIds.has(stateId)) {
      throw new TypeError(`${label} unfinishedFinalStateIds entry ${JSON.stringify(stateId)} does not name a root final state`);
    }
  }
}
function createXStatePlaybookRuntime(machine, spec) {
  const label = spec.label ?? "playbook";
  const artifactSchema = assertRuntimeCompat(spec.compat, label);
  const specDescriptors = Object.getOwnPropertyDescriptors(spec);
  if (Object.prototype.hasOwnProperty.call(specDescriptors, "playerStates")) {
    throw new TypeError(`${label} artifacts must supply roleStates, not playerStates`);
  }
  if (Object.prototype.hasOwnProperty.call(specDescriptors, "resolvePlayerId")) {
    throw new TypeError(`${label} artifacts must not derive concrete player bindings`);
  }
  const parallelProfile = parallelProfileFromMachine(machine, label);
  assertFlatStateIdentity(machine, label);
  assertUnfinishedFinalStateIds(spec.unfinishedFinalStateIds, machine, label);
  const retainedGenerationMetadata = spec.unfinishedFinalStateIds === void 0 ? void 0 : Object.freeze({
    unfinishedFinalStateIds: Object.freeze([
      ...spec.unfinishedFinalStateIds
    ])
  });
  const declaredActors = collectInvokeSources(machine);
  const resumableStateIds = spec.resumableStateIds ?? resumableStateIdsFromMachine(machine);
  const stateDescriptions = stateDescriptionsFromMachine(machine);
  const terminalKinds = terminalOutcomesFromMachine(machine, label);
  const roleStatesDescriptor = specDescriptors.roleStates;
  if (roleStatesDescriptor !== void 0 && !Object.prototype.hasOwnProperty.call(roleStatesDescriptor, "value")) {
    throw new TypeError(`${label} roleStates must be an own data property`);
  }
  const roleStates = snapshotRoleStateStatuses(roleStatesDescriptor?.value, label, machine, stateDescriptions);
  const declaredRoleIds = Object.freeze([
    ...new Set([...roleStates.values()].map(({ role }) => role))
  ]);
  const bossRelevantStateIds = parallelProfile === void 0 ? void 0 : /* @__PURE__ */ new Set([
    ...roleStates.keys(),
    ...parallelProfile.waitResumeTargets.keys(),
    "failed"
  ]);
  const controlContextFields = spec.controlContextFields ? [...spec.controlContextFields] : [];
  for (const field of controlContextFields) {
    if (field === "pendingBossQuestion" || field === "lastError") {
      throw new Error(`${label} controlContextFields must not name ${field}: the control view surfaces it first-class`);
    }
  }
  const composePlayerPrompt2 = spec.composePlayerPrompt ?? ((input, _identity, resuming = false) => defaultComposePlayerPrompt(input, spec.placeholderFields, resuming));
  const composeCaptainPrompt = spec.composeCaptainPrompt ?? ((input) => defaultComposeCaptainPrompt(input, spec.placeholderFields));
  const extractFields = spec.extractRequiredFields ?? defaultExtractRequiredFields;
  const verbatimPayloadFields = new Set(spec.verbatimPayloadFields ?? NO_VERBATIM_FIELDS);
  const adjudication = {
    ...spec.buildJudgePrompt !== void 0 ? { buildJudgePrompt: spec.buildJudgePrompt } : {},
    extractRequiredFields: extractFields,
    verbatimPayloadFields
  };
  const outcomeAuthority = snapshotOutcomeAuthority(specDescriptors.outcomeAuthority, label, roleStates, verbatimPayloadFields);
  for (const [stateId, outcomes] of Object.entries(outcomeAuthority.governedPlayerStates)) {
    if (Object.values(outcomes).some(({ repositoryDisposition }) => repositoryDisposition === "deferred") && !resumableStateIds.has(stateId)) {
      throw new TypeError(`${label} outcomeAuthority deferred state ${stateId} must be registered in resumableStateIds`);
    }
  }
  const derivedClassifyBossText = makeDefaultClassifyBossText(machine, spec.entryEvent, spec.bossEvents ?? [], parallelProfile);
  const classifyBossText = spec.classifyBossText ?? derivedClassifyBossText;
  const normalizeTransitionEvent = spec.normalizeTransitionEvent ?? makeDefaultNormalizeTransitionEvent(spec.transitionEventFields ?? []);
  const statusesForState = spec.statusesForState ?? makeDefaultStatusesForState(roleStates);
  const usesDefaultStatuses = spec.statusesForState === void 0;
  const classificationStatus = spec.classificationStatus ?? ((event) => event.type);
  const machineInput = spec.machineInput ?? ((options) => options);
  const scriptCwd = spec.scriptCwd ?? ((options) => {
    const cwd = options?.cwd;
    return typeof cwd === "string" ? cwd : void 0;
  });
  const pendingBossQuestionsFor = (state, context) => {
    if (parallelProfile === void 0) {
      const pending = pendingBossQuestionForState(state, context);
      return pending === void 0 ? [] : [pending];
    }
    return parallelPendingBossQuestions(parallelProfile, state.activeStateIds, context);
  };
  const singlePendingBossQuestion = (state, context) => {
    const pending = pendingBossQuestionsFor(state, context);
    return pending.length === 1 ? pending[0] : void 0;
  };
  const statusTraceStateId = (state) => {
    if (bossRelevantStateIds === void 0)
      return state.stateId;
    const relevant = state.activeStateIds.filter((stateId) => bossRelevantStateIds.has(stateId));
    return relevant.length === 1 ? relevant[0] : void 0;
  };
  const parallelStatusesFor = (previousState, state, context) => {
    const prior = new Set(previousState?.activeStateIds ?? []);
    const statuses = [];
    for (const stateId of state.activeStateIds) {
      if (prior.has(stateId) || !bossRelevantStateIds.has(stateId))
        continue;
      const resumeTargets = parallelProfile.waitResumeTargets.get(stateId);
      if (resumeTargets !== void 0) {
        const questions = keyedPendingBossQuestions(context, (resumeStateId) => resumeTargets.has(resumeStateId));
        if (questions.length === 0) {
          statuses.push({ message: "Awaiting Boss reply." });
          continue;
        }
        for (const pending of questions) {
          statuses.push({
            message: `${askerLabel(pending.asker)} asks: ${pending.question}`,
            data: { kind: "boss-question" }
          }, {
            message: `\u25C6 awaiting Boss reply \xB7 ${pending.resumeStateId} \xB7 ${askerLabel(pending.asker)} \xB7 ${pending.sourceItem}`,
            data: { kind: "boss-question" }
          });
        }
        continue;
      }
      if (stateId === "failed") {
        const lastError = normalizeErrorCompact(context.lastError);
        statuses.push({
          message: "\u25C6 workflow failed; awaiting Boss recovery.",
          ...lastError === void 0 ? {} : {
            data: snapshotJsonValue({ lastError }, "failed status data")
          }
        });
        continue;
      }
      const roleState = roleStates.get(stateId);
      if (roleState !== void 0) {
        statuses.push({ message: `\u2937 ${roleState.role}: ${roleState.label}` });
      }
    }
    return statuses;
  };
  const assertDeclaredCohorts = (hostCapabilities) => {
    const authority = Object.getOwnPropertyDescriptor(hostCapabilities, "authority")?.value;
    if (!isPlainObject(authority) || !Array.isArray(authority.concurrentRoleSets)) {
      return;
    }
    const declared = authority.concurrentRoleSets;
    for (const parallelState of parallelProfile.states) {
      const roles = parallelState.regions.map(({ roleId }) => roleId);
      if (!declared.some((candidate) => Array.isArray(candidate) && candidate.length === roles.length && candidate.every((roleId, index) => roleId === roles[index]))) {
        throw new TypeError(`${label} parallel state ${parallelState.stateId} roles [${roles.join(", ")}] are not a declared concurrent role set`);
      }
    }
  };
  const createPlaybookRuntime2 = function createPlaybookRuntime3(factoryOptions) {
    const construction = configuredOptionsFromFactoryInput(factoryOptions, label);
    const configuredOptions = construction.configuredOptions;
    const effectLedgerCapability = construction.effectLedger;
    const hasGovernedPlayerStates = Object.keys(outcomeAuthority.governedPlayerStates).length > 0;
    const acceptedOutcomeConsumer = createAcceptedOutcomeConsumer((source, acceptedOutcome2) => {
      const governedPlayerStates = outcomeAuthority.governedPlayerStates;
      if (!Object.prototype.hasOwnProperty.call(governedPlayerStates, source)) {
        return false;
      }
      const declarations = governedPlayerStates[source];
      return declarations !== void 0 && Object.prototype.hasOwnProperty.call(declarations, acceptedOutcome2);
    });
    const repositoryCapability = hasGovernedPlayerStates ? repositoryCapabilityFromHostCapabilities(construction.hostCapabilities, label, parallelProfile !== void 0) : void 0;
    if (parallelProfile !== void 0) {
      assertDeclaredCohorts(construction.hostCapabilities);
    }
    const currentEffectLedger = () => assertPlaybookEffectLedger(effectLedgerCapability.snapshot(), `${label} current host effect ledger`);
    let effectLedgerMirror = currentEffectLedger();
    let recoveryCheckpoint;
    let retainedEffectSourceSessionId;
    let retainedEffectReconciliation;
    let retainedEffectReconciliationRequired = false;
    const playerBoundaryReceipts = /* @__PURE__ */ new WeakMap();
    const governedPlayerSettlements = /* @__PURE__ */ new WeakMap();
    const governedSettlementsByBoundaryId = /* @__PURE__ */ new Map();
    const governedCompletionEvidenceByBoundaryId = /* @__PURE__ */ new Map();
    const unresolvedSemanticBoundaryIds = /* @__PURE__ */ new Set();
    let reconstructedGovernedDelivery;
    let reconstructedGovernedPrefixSequence;
    const reconstructedGovernedResults = /* @__PURE__ */ new WeakMap();
    let reconstructedAcceptancePending;
    const boundOptions = spec.snapshotOptions(configuredOptions);
    assertNoConfiguredHostCapabilities(boundOptions, label);
    const boundScriptCwd = scriptCwd(boundOptions);
    let actor;
    let session;
    let initialized = false;
    let initInFlight;
    let disposalPromise;
    let disposed = false;
    let savedPorts;
    let runtimePorts;
    let activeSignal;
    let activeAborts;
    const actorSettlementAborts = [];
    let actorSettlementErrorAborts;
    let activeAbortEmission;
    let activeTurnId;
    let activeGovernedBoundarySeen = false;
    let activeGovernedAttemptId;
    let activeEffectLedgerPrefixSequence;
    let failedGovernedAttemptUnknown = false;
    let failedEffectBoundaryPrefix;
    let failedGovernedAttemptId;
    let deferredReconciliationOperationId;
    let deferredSettlementClosure;
    let expectedBoundPendingQuestion;
    let activeDeferredContinuation;
    let deferInspectionEmissions = false;
    let deferredInspectionEmissions = [];
    let controlPlaneError;
    let pendingResultFailureCause;
    const failureCauses = createFailureCauseRetention();
    const resultFailureCauses = /* @__PURE__ */ new WeakMap();
    let publicBoundarySequence = 0;
    const consumedCohortBoundaries = /* @__PURE__ */ new Map();
    const pendingCohorts = /* @__PURE__ */ new Map();
    const cohortCompletionQueue = new PQueue({ concurrency: 1 });
    const activeBoundaryCalls = /* @__PURE__ */ new Set();
    let priorState;
    let suppressInspectionEmissions = false;
    let traceSequence = 0;
    let turnSequence = 0;
    let judgeCallSequence = 0;
    let playerCallSequence = 0;
    let playbookCallSequence = 0;
    let captainCallSequence = 0;
    let applyCallSequence = 0;
    const appliedReceipts = /* @__PURE__ */ new Map();
    const privateResumeTokens = /* @__PURE__ */ new Map();
    const activePlayerKeys = /* @__PURE__ */ new Set();
    const playbookCallTurnIds = /* @__PURE__ */ new Map();
    const playbookCallEffectPrefixes = /* @__PURE__ */ new Map();
    const judgeQueue = new PQueue({ concurrency: 1 });
    const emissionQueue = new PQueue({ concurrency: 1 });
    const activeEmissionCalls = /* @__PURE__ */ new Set();
    let emissionFailure;
    function runtimeLogicalOperations(ledger = effectLedgerMirror) {
      if (session === void 0)
        return [];
      const runtimeSessionIds = /* @__PURE__ */ new Set([
        session.sessionId,
        ...retainedEffectSourceSessionId === void 0 ? [] : [retainedEffectSourceSessionId]
      ]);
      return ledger.logicalOperations.filter((operation) => operation.playbookId === session.playbookId && runtimeSessionIds.has(operation.runtimeSessionId));
    }
    function refreshRetainedEffectReconciliation(current = effectLedgerMirror) {
      const retained = retainedEffectReconciliation;
      if (retained === void 0) {
        retainedEffectReconciliationRequired = false;
        return;
      }
      const safe = retainedAdoptionCheckpointIsSafe(retained.checkpoint, current);
      retainedEffectReconciliationRequired = !safe;
      if (safe) {
        retainedEffectReconciliation = void 0;
        reconstructedGovernedPrefixSequence = void 0;
      }
    }
    function bindRetainedEffectReconciliation(retained, current) {
      retainedEffectReconciliation = retained;
      refreshRetainedEffectReconciliation(current);
      reconstructedGovernedPrefixSequence = retainedEffectReconciliation === void 0 ? void 0 : retainedEffectReconciliation.checkpoint.boundaries.at(-1)?.sequence ?? 0;
    }
    function refreshRetainedEffectFenceFromHost() {
      if (retainedEffectReconciliation === void 0)
        return;
      const retainedBeforeRefresh = retainedEffectReconciliation;
      try {
        effectLedgerMirror = currentEffectLedger();
        refreshRetainedEffectReconciliation(effectLedgerMirror);
        syncDeferredReconciliationOverlay();
        refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      } catch {
        retainedEffectReconciliation ??= retainedBeforeRefresh;
        deferredReconciliationOperationId = void 0;
        retainedEffectReconciliationRequired = true;
      }
    }
    function syncDeferredReconciliationOverlay() {
      const unresolved = runtimeLogicalOperations().filter((operation) => operation.logicalReceipt === void 0 && (operation.checkpointRestorationEligible || operation.pendingQuestion === void 0));
      if (unresolved.length > 1) {
        throw new Error(`${label} effect ledger contains multiple unresolved deferred operations`);
      }
      deferredReconciliationOperationId = unresolved[0]?.operationId;
    }
    function runtimeBoundaryIsOwned(boundary2) {
      if (session === void 0 || boundary2.playbookId !== session.playbookId) {
        return false;
      }
      return boundary2.runtimeSessionId === session.sessionId || boundary2.runtimeSessionId === retainedEffectSourceSessionId;
    }
    function governedOutcomesForBoundary(candidate) {
      const outcomes = outcomeAuthority?.governedPlayerStates[candidate.sourceStateId];
      if (outcomes === void 0)
        return void 0;
      if (!isPlainObject(candidate.sourceOutcomeSchema) || !sameStringSet(Object.keys(candidate.sourceOutcomeSchema), Object.keys(outcomes))) {
        return void 0;
      }
      for (const [guard, description] of Object.entries(candidate.sourceOutcomeSchema)) {
        if (typeof description !== "string")
          return void 0;
        const describedFields = [...new Set(extractFields(description))];
        if (!sameStringSet(describedFields, Object.keys(outcomes[guard].fields))) {
          return void 0;
        }
      }
      const expectedDispositions = [
        ...new Set(Object.values(outcomes).map(({ repositoryDisposition }) => repositoryDisposition))
      ];
      if (!sameStringSet(candidate.dispositions, expectedDispositions)) {
        return void 0;
      }
      return outcomes;
    }
    function persistedBoundaryReconciliation(candidate, ledger) {
      const outcomes = governedOutcomesForBoundary(candidate);
      if (outcomes === void 0 || candidate.semanticCandidate === void 0) {
        return void 0;
      }
      let receipt = candidate.physicalReceipt;
      let historicalDeferred = false;
      let awaitingLogicalReceipt = false;
      if (candidate.logicalOperationId !== void 0) {
        const operation = ledger.logicalOperations.find(({ operationId }) => operationId === candidate.logicalOperationId);
        if (operation === void 0)
          return void 0;
        const latestBoundaryId = operation.boundaryIds.at(-1);
        if (latestBoundaryId !== candidate.boundaryId) {
          historicalDeferred = true;
        } else if (operation.logicalReceipt !== void 0) {
          receipt = operation.logicalReceipt;
        } else if (operation.pendingQuestion === void 0 || operation.checkpoint === void 0 || !Object.prototype.hasOwnProperty.call(operation, "playerContinuation")) {
          return void 0;
        } else {
          awaitingLogicalReceipt = true;
        }
      }
      try {
        const reconciliation = reconcilePlaybookSemanticEvidence({
          outcomes,
          semanticCandidate: candidate.semanticCandidate,
          finalText: candidate.finalText,
          receipt
        });
        if (awaitingLogicalReceipt && reconciliation.status !== "deferred") {
          return void 0;
        }
        return {
          reconciliation,
          historicalDeferred
        };
      } catch {
        return void 0;
      }
    }
    function boundaryExcludesEffect(boundary2) {
      return boundary2.logicalOperationId === void 0 && (boundary2.physicalReceipt?.classification === "unchanged" || boundary2.restored !== void 0);
    }
    function boundaryNeedsSemanticReconciliation(candidate, ledger) {
      if (!runtimeBoundaryIsOwned(candidate))
        return false;
      if (boundaryExcludesEffect(candidate))
        return false;
      if (governedOutcomesForBoundary(candidate) === void 0)
        return true;
      const persisted = persistedBoundaryReconciliation(candidate, ledger);
      if (persisted !== void 0) {
        if (persisted.reconciliation.status === "unresolved")
          return true;
        if (persisted.historicalDeferred) {
          return persisted.reconciliation.status !== "deferred";
        }
        if (persisted.reconciliation.status === "deferred" && candidate.logicalOperationId === void 0) {
          return true;
        }
        return false;
      }
      if (candidate.physicalReceipt === void 0) {
        return retainedEffectReconciliation === void 0;
      }
      if (typeof candidate.finalText === "string" && candidate.finalText.trim().length > 0) {
        return true;
      }
      return candidate.physicalReceipt.classification !== "unchanged";
    }
    function refreshUnresolvedSemanticReconciliation(current = effectLedgerMirror) {
      unresolvedSemanticBoundaryIds.clear();
      if (outcomeAuthority === void 0 || session === void 0)
        return;
      for (const candidate of current.boundaries) {
        if (boundaryNeedsSemanticReconciliation(candidate, current)) {
          unresolvedSemanticBoundaryIds.add(candidate.boundaryId);
        }
      }
    }
    function prepareReconstructedGovernedDelivery(state, ledger = effectLedgerMirror) {
      reconstructedGovernedDelivery = void 0;
      if (state.stateId === void 0 || state.activeStateIds.length !== 1) {
        return;
      }
      const owned = ledger.boundaries.filter(runtimeBoundaryIsOwned);
      const candidate = reconstructedGovernedPrefixSequence === void 0 ? owned.at(-1) : owned.find(({ sequence }) => sequence > reconstructedGovernedPrefixSequence);
      if (candidate === void 0 || candidate.restored !== void 0 || candidate.sourceStateId !== state.stateId) {
        return;
      }
      const persisted = persistedBoundaryReconciliation(candidate, ledger);
      if (persisted === void 0 || persisted.historicalDeferred || persisted.reconciliation.status !== "resolved" || typeof candidate.finalText !== "string") {
        return;
      }
      reconstructedGovernedDelivery = {
        boundary: candidate,
        finalText: candidate.finalText,
        settlement: {
          status: "resolved",
          output: persisted.reconciliation.output
        }
      };
    }
    function takeReconstructedGovernedPlayerResult(input, roleId) {
      const reconstructed = reconstructedGovernedDelivery;
      if (reconstructed === void 0)
        return void 0;
      reconstructedGovernedDelivery = void 0;
      const current = currentEffectLedger();
      effectLedgerMirror = current;
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(current);
      const completed = current.boundaries.find(({ boundaryId }) => boundaryId === reconstructed.boundary.boundaryId);
      const expected = reconstructedGovernedPrefixSequence === void 0 ? current.boundaries.filter(runtimeBoundaryIsOwned).at(-1) : current.boundaries.filter(runtimeBoundaryIsOwned).find(({ sequence }) => sequence > reconstructedGovernedPrefixSequence);
      const persisted = completed === void 0 ? void 0 : persistedBoundaryReconciliation(completed, current);
      if (completed === void 0 || expected?.boundaryId !== completed.boundaryId || !isDeepStrictEqual(completed, reconstructed.boundary) || completed.sourceStateId !== input.stateId || completed.roleId !== roleId || !isDeepStrictEqual(completed.sourceOutcomeSchema, input.result) || persisted === void 0 || persisted.historicalDeferred || persisted.reconciliation.status !== "resolved" || completed.finalText !== reconstructed.finalText || !isDeepStrictEqual(persisted.reconciliation.output, reconstructed.settlement.output)) {
        unresolvedSemanticBoundaryIds.add(reconstructed.boundary.boundaryId);
        throw markFsmResultFailure(new Error(`${label} retained governed semantic envelope is no longer exact`));
      }
      validateBossReplyOutput(input, reconstructed.settlement.output, resumableStateIds);
      const result = validatePlayerResult({
        status: "ok",
        finalText: reconstructed.finalText
      });
      playerBoundaryReceipts.set(result, {
        boundaryId: completed.boundaryId,
        attemptId: completed.attemptId
      });
      governedPlayerSettlements.set(result, reconstructed.settlement);
      reconstructedGovernedResults.set(result, completed);
      return result;
    }
    function acceptReconstructedGovernedDelivery(state) {
      const accepted = reconstructedAcceptancePending;
      if (accepted === void 0 || state.stateId === accepted.sourceStateId) {
        return;
      }
      reconstructedAcceptancePending = void 0;
      let current;
      try {
        current = currentEffectLedger();
        effectLedgerMirror = current;
        syncDeferredReconciliationOverlay();
        refreshUnresolvedSemanticReconciliation(current);
      } catch {
        unresolvedSemanticBoundaryIds.add(accepted.boundaryId);
        return;
      }
      const acknowledged = current.boundaries.find(({ boundaryId }) => boundaryId === accepted.boundaryId);
      if (acknowledged === void 0 || !isDeepStrictEqual(acknowledged, accepted)) {
        unresolvedSemanticBoundaryIds.add(accepted.boundaryId);
        return;
      }
      if (reconstructedGovernedPrefixSequence !== void 0) {
        reconstructedGovernedPrefixSequence = accepted.sequence;
        prepareReconstructedGovernedDelivery(state, current);
        if (current.boundaries.filter(runtimeBoundaryIsOwned).some(({ sequence }) => sequence > reconstructedGovernedPrefixSequence)) {
          return;
        }
      }
      if (unresolvedSemanticBoundaryIds.size > 0 || deferredReconciliationOperationId !== void 0) {
        return;
      }
      retainedEffectReconciliation = void 0;
      retainedEffectReconciliationRequired = false;
      reconstructedGovernedPrefixSequence = void 0;
    }
    function hasUnresolvedReconciliation() {
      return deferredReconciliationOperationId !== void 0 || retainedEffectReconciliationRequired || unresolvedSemanticBoundaryIds.size > 0;
    }
    function unresolvedEffectEnvelopeIdentities() {
      if (session === void 0)
        return [];
      const current = currentEffectLedger();
      effectLedgerMirror = current;
      refreshRetainedEffectReconciliation(current);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(current);
      return projectUnresolvedEffectEnvelopes(current);
    }
    function projectUnresolvedEffectEnvelopes(current) {
      if (!hasUnresolvedReconciliation())
        return [];
      const boundaryIds = new Set(unresolvedSemanticBoundaryIds);
      const operationIds = /* @__PURE__ */ new Set();
      if (deferredReconciliationOperationId !== void 0) {
        operationIds.add(deferredReconciliationOperationId);
      }
      if (retainedEffectReconciliationRequired) {
        const checkpointLength = retainedEffectReconciliation?.checkpoint.boundaries.length ?? 0;
        for (const boundary2 of current.boundaries.slice(checkpointLength)) {
          if (boundary2.physicalReceipt?.classification === "unchanged") {
            continue;
          }
          boundaryIds.add(boundary2.boundaryId);
        }
      }
      for (const boundaryId of [...boundaryIds]) {
        const boundary2 = current.boundaries.find((candidate) => candidate.boundaryId === boundaryId);
        if (boundary2?.logicalOperationId !== void 0 && current.logicalOperations.some(({ operationId }) => operationId === boundary2.logicalOperationId)) {
          operationIds.add(boundary2.logicalOperationId);
          for (const memberId of current.logicalOperations.find(({ operationId }) => operationId === boundary2.logicalOperationId).boundaryIds) {
            boundaryIds.delete(memberId);
          }
        }
      }
      const ordered = [
        ...[...boundaryIds].map((boundaryId) => ({
          order: current.boundaries.find((candidate) => candidate.boundaryId === boundaryId)?.sequence ?? Number.MAX_SAFE_INTEGER,
          value: { kind: "boundary", boundaryId }
        })),
        ...[...operationIds].map((operationId) => {
          const operation = current.logicalOperations.find((candidate) => candidate.operationId === operationId);
          const firstBoundaryId = operation?.boundaryIds[0];
          return {
            order: current.boundaries.find(({ boundaryId }) => boundaryId === firstBoundaryId)?.sequence ?? Number.MAX_SAFE_INTEGER,
            value: { kind: "logical-operation", operationId }
          };
        })
      ].sort((left, right) => left.order - right.order);
      return deepFreeze(snapshotJsonValue(ordered.map(({ value }) => value), `${label} unresolved effect envelope identities`));
    }
    function closeAfterIndeterminateDeferredSettlement(operationId, cause) {
      try {
        effectLedgerMirror = currentEffectLedger();
        refreshRetainedEffectReconciliation(effectLedgerMirror);
        syncDeferredReconciliationOverlay();
        refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      } catch {
      }
      expectedBoundPendingQuestion = void 0;
      deferredSettlementClosure ??= new Error(`${label} deferred settlement is indeterminate; recover the host effect ledger before continuing`, { cause });
      if (operationId !== void 0 && deferredReconciliationOperationId === void 0) {
        deferredReconciliationOperationId = operationId;
      }
    }
    function assertDeferredSettlementOpen(method) {
      if (deferredSettlementClosure !== void 0) {
        throw new Error(`createPlaybookRuntime.${method}: deferred settlement recovery is required`, { cause: deferredSettlementClosure });
      }
    }
    function pendingHasExactUnchangedOrigin(pending) {
      if (runtimeLogicalOperations().some((operation) => operation.logicalReceipt === void 0)) {
        return false;
      }
      const latest = effectLedgerMirror.boundaries.filter(runtimeBoundaryIsOwned).at(-1);
      if (latest === void 0 || latest.sourceStateId !== pending.resumeStateId || pending.asker.kind !== "role" || latest.roleId !== pending.asker.roleId || latest.logicalOperationId !== void 0 || latest.physicalReceipt?.classification !== "unchanged") {
        return false;
      }
      const persisted = persistedBoundaryReconciliation(latest, effectLedgerMirror);
      if (persisted === void 0 || persisted.historicalDeferred || persisted.reconciliation.status !== "resolved") {
        return false;
      }
      const output = persisted.reconciliation.output;
      const declaration = outcomeAuthority.governedPlayerStates[latest.sourceStateId]?.[output.guard];
      return declaration?.repositoryDisposition === "unchanged" && typeof output.question === "string" && output.question === pending.question;
    }
    function currentBoundDeferredOperation(pending) {
      const projected = {
        questionId: pending.questionId,
        asker: pending.asker,
        question: pending.question,
        sourceItem: pending.sourceItem
      };
      const matches2 = runtimeLogicalOperations().filter((operation) => operation.logicalReceipt === void 0 && operation.checkpoint !== void 0 && operation.pendingQuestion !== void 0 && operation.playerContinuation !== void 0 && !operation.checkpointRestorationEligible && isDeepStrictEqual(operation.pendingQuestion, projected));
      if (matches2.length > 1) {
        throw new Error(`${label} effect ledger contains multiple operations for one pending question`);
      }
      return matches2[0];
    }
    function continuationBoundarySeed(operation, turnId) {
      const latestBoundaryId = operation.boundaryIds.at(-1);
      const latestBoundary = effectLedgerMirror.boundaries.find(({ boundaryId }) => boundaryId === latestBoundaryId);
      if (latestBoundary === void 0) {
        throw new Error(`${label} deferred logical operation has no latest physical boundary`);
      }
      return {
        boundaryId: randomUUID(),
        runtimeSessionId: latestBoundary.runtimeSessionId,
        turnId,
        callId: `player-${++playerCallSequence}`,
        roleId: latestBoundary.roleId,
        sourceStateId: latestBoundary.sourceStateId,
        sourceOutcomeSchema: latestBoundary.sourceOutcomeSchema,
        dispositions: latestBoundary.dispositions,
        correctionBudget: { limit: 1, spent: false }
      };
    }
    function bindSession(nextSession) {
      const bound = snapshotPlaybookSession(nextSession);
      if (bound.roleBindings === void 0)
        return bound;
      const actual = Object.keys(bound.roleBindings).sort();
      const expected = [...declaredRoleIds].sort();
      const missing = expected.filter((roleId) => !actual.includes(roleId));
      const extra = actual.filter((roleId) => !expected.includes(roleId));
      if (missing.length > 0 || extra.length > 0) {
        throw new TypeError(`${label} session roleBindings must cover exactly [${expected.join(", ")}]${missing.length === 0 ? "" : `; missing [${missing.join(", ")}]`}${extra.length === 0 ? "" : `; extra [${extra.join(", ")}]`}`);
      }
      return bound;
    }
    function requireRoleId(input) {
      const roleId = input.role;
      if (typeof roleId !== "string" || roleId.trim().length === 0 || !declaredRoleIds.includes(roleId)) {
        throw new TypeError(`${label} player input role must name a declared local role`);
      }
      return roleId;
    }
    function resolvedPlayerId(roleId) {
      return session?.roleBindings?.[roleId]?.playerId;
    }
    function promptIdentity(roleId) {
      if (!declaredRoleIds.includes(roleId)) {
        throw new TypeError(`${label} prompt identity lookup rejected undeclared role ${roleId}`);
      }
      return session?.roleBindings?.[roleId]?.promptIdentity ?? roleId;
    }
    function composeBoundPlayerPrompt(input, resuming = false) {
      let active = true;
      const lookup = (roleId) => {
        if (!active) {
          throw new Error(`${label} prompt identity lookup is no longer active`);
        }
        return promptIdentity(roleId);
      };
      try {
        return composePlayerPrompt2(input, lookup, resuming);
      } finally {
        active = false;
      }
    }
    function continuationKey(roleId, playerId) {
      return playerId ?? roleId;
    }
    function roleTokensByContinuationKey(tokens) {
      const byKey = /* @__PURE__ */ new Map();
      for (const [roleId, token] of Object.entries(tokens)) {
        if (!declaredRoleIds.includes(roleId)) {
          throw new TypeError(`runtime role tokens contain unknown role ${roleId}`);
        }
        const key = continuationKey(roleId, resolvedPlayerId(roleId));
        const existing = byKey.get(key);
        if (existing !== void 0 && existing !== token) {
          throw new TypeError(`runtime snapshot assigns conflicting tokens to roles bound to player ${key}`);
        }
        byKey.set(key, token);
      }
      const rolesByKey = /* @__PURE__ */ new Map();
      for (const roleId of declaredRoleIds) {
        const key = continuationKey(roleId, resolvedPlayerId(roleId));
        rolesByKey.set(key, [...rolesByKey.get(key) ?? [], roleId]);
      }
      for (const [key, roles] of rolesByKey) {
        if (roles.length < 2)
          continue;
        const present = roles.filter((roleId) => tokens[roleId] !== void 0);
        if (present.length !== 0 && present.length !== roles.length) {
          throw new TypeError(`runtime role tokens must project player ${key} through every aliased role [${roles.join(", ")}]`);
        }
      }
      return byKey;
    }
    function selectPlayerResume(roleId, playerId) {
      const key = continuationKey(roleId, playerId);
      const selected = session?.playerSessions ? session.playerSessions.select(roleId) : privateResumeTokens.get(key) ?? false;
      if (selected !== false && (typeof selected !== "string" || selected.trim().length === 0)) {
        throw new TypeError(`player session store returned an invalid resume token for role ${roleId}`);
      }
      return selected;
    }
    function updatePlayerResume(roleId, playerId, result) {
      const resumeToken = result.resumeToken;
      if (resumeToken === void 0 && result.status !== "ok")
        return;
      const key = continuationKey(roleId, playerId);
      if (session?.playerSessions) {
        session.playerSessions.update(roleId, resumeToken);
      } else if (resumeToken !== void 0) {
        privateResumeTokens.set(key, resumeToken);
      } else {
        privateResumeTokens.delete(key);
      }
    }
    function snapshotRoleResumeTokens() {
      const raw = snapshotJsonValue(session?.playerSessions ? session.playerSessions.snapshot() : Object.fromEntries(declaredRoleIds.flatMap((roleId) => {
        const token = privateResumeTokens.get(continuationKey(roleId, resolvedPlayerId(roleId)));
        return token === void 0 ? [] : [[roleId, token]];
      })), "player session store snapshot");
      if (!isPlainObject(raw)) {
        throw new TypeError("player session store snapshot must be an object");
      }
      const detached = {};
      for (const [roleId, token] of Object.entries(raw)) {
        if (!declaredRoleIds.includes(roleId)) {
          throw new TypeError(`player session store snapshot contains unknown role ${roleId}`);
        }
        if (typeof token !== "string" || token.trim().length === 0) {
          throw new TypeError(`player session store snapshot token for ${roleId} must be a non-empty string`);
        }
        detached[roleId] = token;
      }
      roleTokensByContinuationKey(detached);
      return detached;
    }
    function restoreRoleResumeTokens(tokens) {
      const byKey = roleTokensByContinuationKey(tokens);
      if (session?.playerSessions) {
        session.playerSessions.restore(tokens);
        return;
      }
      privateResumeTokens.clear();
      for (const [key, token] of byKey)
        privateResumeTokens.set(key, token);
    }
    function enqueueEmission(fn, aborts = activeAborts) {
      const enqueueAborts = aborts;
      const queued = emissionQueue.add(fn).then(() => void 0);
      activeEmissionCalls.add(queued);
      void queued.then(() => activeEmissionCalls.delete(queued), (error) => {
        activeEmissionCalls.delete(queued);
        if (enqueueAborts?.isAbortReason(error)) {
          if (activeAborts?.isAbortReason(error)) {
            activeAbortEmission ??= error;
          }
          return;
        }
        emissionFailure ??= { error };
      });
      return queued;
    }
    async function drainEmissions(_aborts = activeAborts) {
      while (true) {
        const active = [...activeEmissionCalls];
        if (active.length > 0)
          await Promise.allSettled(active);
        await emissionQueue.onIdle();
        if (activeEmissionCalls.size === 0 && emissionQueue.size === 0 && emissionQueue.pending === 0) {
          break;
        }
      }
      if (emissionFailure !== void 0) {
        const { error } = emissionFailure;
        emissionFailure = void 0;
        if (activeSignal !== void 0)
          controlPlaneError ??= error;
        throw error;
      }
    }
    function requireSession() {
      if (!session) {
        throw new Error("createPlaybookRuntime: init must be called first");
      }
      return session;
    }
    function requireHostPorts() {
      if (!savedPorts) {
        throw new Error("createPlaybookRuntime: init must be called first");
      }
      return savedPorts;
    }
    function createTraceEvent(type, payload, position = {}) {
      const currentSession = requireSession();
      const safePayload = snapshotJsonValue(payload, `trace ${type} payload`);
      return {
        schemaVersion: 4,
        sessionId: currentSession.sessionId,
        playbookId: currentSession.playbookId,
        rootSessionId: currentSession.rootSessionId,
        ...currentSession.parentSessionId !== void 0 ? { parentSessionId: currentSession.parentSessionId } : {},
        ...currentSession.parentCallId !== void 0 ? { parentCallId: currentSession.parentCallId } : {},
        depth: currentSession.depth,
        sequence: ++traceSequence,
        timestamp: Date.now(),
        type,
        ...position.turnId !== void 0 ? { turnId: position.turnId } : {},
        ...position.callId !== void 0 ? { callId: position.callId } : {},
        payload: safePayload
      };
    }
    function emitTrace(type, payload, position = {}, aborts) {
      const currentSession = requireSession();
      const event = createTraceEvent(type, payload, position);
      return enqueueEmission(() => currentSession.ports.emitTelemetry({
        topic: "playbook.trace",
        payload: event
      }), aborts);
    }
    function stateIdentity(stateId) {
      return stateId === void 0 ? {} : { stateId };
    }
    function currentState() {
      if (!actor) {
        throw new Error("createPlaybookRuntime: actor is not initialized");
      }
      return normalizePlaybookSnapshot(actor.getSnapshot(), {
        pendingCall: nestedBridge.getPendingCall()
      });
    }
    function stateTracePayload(state = currentState()) {
      return {
        state,
        ...stateIdentity(state.stateId)
      };
    }
    function createRuntimePorts(hostPorts) {
      return {
        callPlayer: (playerId, prompt, signal, callOptions) => hostPorts.callPlayer(playerId, prompt, signal, callOptions),
        callCaptain: (prompt, signal, callOptions) => hostPorts.callCaptain(prompt, signal, callOptions),
        callJudge: (prompt, signal) => hostPorts.callJudge(prompt, signal),
        callPlaybook: (request, signal) => hostPorts.callPlaybook(request, signal),
        emitStatus: (message, data) => {
          const descriptor = actor ? currentState() : void 0;
          const safeData = data === void 0 ? void 0 : snapshotJsonValue(data, "status data");
          const trace = createTraceEvent("status.emitted", {
            message,
            ...safeData !== void 0 ? { data: safeData } : {},
            ...descriptor !== void 0 ? {
              state: descriptor,
              ...stateIdentity(statusTraceStateId(descriptor))
            } : {}
          }, activeTurnId !== void 0 ? { turnId: activeTurnId } : {});
          return enqueueEmission(async () => {
            await hostPorts.emitTelemetry({
              topic: "playbook.trace",
              payload: trace
            });
            await hostPorts.emitStatus(message, safeData);
          });
        },
        emitTelemetry: (event) => {
          if (typeof event.topic !== "string" || event.topic.length === 0) {
            throw new TypeError("telemetry topic must be a non-empty string");
          }
          const payload = snapshotJsonValue(event.payload, "telemetry payload");
          return enqueueEmission(() => hostPorts.emitTelemetry({ topic: event.topic, payload }));
        }
      };
    }
    async function emitCallStarted(startedType, finishedType, identity, position, signal, finishIdentity = identity, aborts) {
      try {
        await emitTrace(startedType, identity, position, aborts);
      } catch (error) {
        if (!isAbortFailure(error, signal))
          controlPlaneError ??= error;
        try {
          await emitTrace(finishedType, {
            ...finishIdentity,
            status: isAbortFailure(error, signal) ? "aborted" : "error",
            error: normalizeError(error)
          }, position, aborts);
        } catch {
        }
        throw error;
      }
    }
    function governedBoundarySeed(input, roleId, callId, turnId) {
      const governed = outcomeAuthority?.governedPlayerStates[input.stateId];
      if (governed === void 0)
        return void 0;
      if (!Number.isSafeInteger(turnId) || turnId === void 0 || turnId <= 0) {
        throw new Error(`${label} governed player call requires an active positive turn id`);
      }
      const dispositions = [
        ...new Set(Object.values(governed).map(({ repositoryDisposition }) => repositoryDisposition))
      ];
      if (dispositions.length === 0) {
        throw new Error(`${label} governed player call has no repository disposition`);
      }
      return {
        boundaryId: randomUUID(),
        // An adopted runtime keeps one durable effect-owner identity across
        // every later target generation. New boundaries must join that same
        // lineage; otherwise a boundary started by an intermediate target is
        // no longer discoverable after the next adoption.
        runtimeSessionId: retainedEffectSourceSessionId ?? requireSession().sessionId,
        turnId,
        callId,
        roleId,
        sourceStateId: input.stateId,
        sourceOutcomeSchema: snapshotJsonValue(input.result, `${label} governed player source outcome schema`),
        dispositions,
        correctionBudget: { limit: 1, spent: false }
      };
    }
    function boundPendingQuestion(input, roleId, output) {
      if (output.guard !== "needsBossReply" || typeof output.question !== "string") {
        throw new TypeError(`${label} deferred outcome must carry one exact Boss question`);
      }
      return {
        questionId: input.stateId,
        resumeStateId: input.stateId,
        sourceItem: input.sourceItem,
        asker: { kind: "role", roleId },
        question: output.question
      };
    }
    function detachedPlayerContinuation(roleId, playerId) {
      return snapshotJsonValue({ v: 1, playerId: playerId ?? roleId }, `${label} deferred player continuation`);
    }
    function completionEvidenceFor(input, roleId, playerId, signal, operationId) {
      return async (completion) => {
        const { operation } = completion;
        let evidence;
        if (operation.status !== "fulfilled" || operation.value.status !== "ok" || isEmptyFinalText(operation.value.finalText)) {
          evidence = operation.status === "fulfilled" && operation.value.status === "ok" && operation.value.finalText !== void 0 ? { finalText: operation.value.finalText } : {};
        } else {
          const finalText = operation.value.finalText;
          evidence = await reconcileGovernedCompletion(input, roleId, playerId, finalText, signal, operationId, completion);
        }
        rememberGovernedCompletionEvidence(completion.boundary.boundaryId, evidence);
        return evidence;
      };
    }
    function rememberGovernedCompletionEvidence(boundaryId, evidence) {
      const previous = governedCompletionEvidenceByBoundaryId.get(boundaryId);
      governedCompletionEvidenceByBoundaryId.set(boundaryId, {
        ...previous,
        boundaryEvidence: {
          ...Object.prototype.hasOwnProperty.call(evidence, "finalText") ? { finalText: evidence.finalText } : {},
          ...Object.prototype.hasOwnProperty.call(evidence, "semanticCandidate") ? { semanticCandidate: evidence.semanticCandidate } : {}
        }
      });
    }
    function unresolvedGovernedSettlement(reason, error, signal = activeSignal, cause) {
      const aborted = error !== void 0 && signal?.aborted === true ? Object.is(error, signal.reason) : false;
      const decided = governedSettlementCause(reason, error, aborted, cause);
      if (aborted) {
        failureCauses.retain(error, decided);
        return {
          status: "unresolved",
          error: attachPlaybookFailureCause(error, decided)
        };
      }
      const failure = error instanceof Error ? error : new Error(`${label} governed outcome remains unresolved: ${reason}`);
      failureCauses.retain(failure, decided);
      return {
        status: "unresolved",
        error: attachPlaybookFailureCause(markFsmResultFailure(failure), decided)
      };
    }
    async function spendSemanticCorrectionBudget(completedBoundary, receipt, finalText, semanticCandidate) {
      if (effectLedgerCapability === void 0)
        return void 0;
      const currentLedger = currentEffectLedger();
      const current = currentLedger.boundaries.find(({ boundaryId }) => boundaryId === completedBoundary.boundaryId);
      if (current === void 0 || current.correctionBudget.limit !== 1 || current.correctionBudget.spent) {
        return void 0;
      }
      if (current.finalText !== void 0 && current.finalText !== finalText) {
        throw new TypeError(`${label} correction budget boundary conflicts with retained finalText`);
      }
      if (current.physicalReceipt !== void 0 && !isDeepStrictEqual(current.physicalReceipt, receipt)) {
        throw new TypeError(`${label} correction budget boundary conflicts with its repository receipt`);
      }
      if (semanticCandidate !== void 0 && current.semanticCandidate !== void 0 && !isDeepStrictEqual(current.semanticCandidate, semanticCandidate)) {
        throw new TypeError(`${label} correction budget boundary conflicts with its retained semantic candidate`);
      }
      const next = {
        ...current,
        ...receipt.after === void 0 ? {} : { after: receipt.after },
        physicalReceipt: receipt,
        finalText,
        ...semanticCandidate === void 0 ? {} : { semanticCandidate },
        correctionBudget: { limit: 1, spent: true }
      };
      const cohortMembers = current.cohortId === void 0 ? [current] : currentLedger.boundaries.filter(({ cohortId }) => cohortId === current.cohortId);
      const replacements = cohortMembers.map((member) => {
        if (member.boundaryId === current.boundaryId) {
          return { expected: current, next };
        }
        if (member.physicalReceipt !== void 0 && !isDeepStrictEqual(member.physicalReceipt, receipt)) {
          throw new TypeError(`${label} correction budget cohort conflicts with its shared repository receipt`);
        }
        return {
          expected: member,
          next: {
            ...member,
            ...receipt.after === void 0 ? {} : { after: receipt.after },
            physicalReceipt: receipt
          }
        };
      });
      const acknowledged = assertPlaybookEffectLedger(await effectLedgerCapability.writeAhead([
        { kind: "replace-boundaries", replacements }
      ]), `${label} semantic correction budget acknowledgement`);
      effectLedgerMirror = acknowledged;
      refreshRetainedEffectReconciliation(acknowledged);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(acknowledged);
      const spent = acknowledged.boundaries.find(({ boundaryId }) => boundaryId === completedBoundary.boundaryId);
      if (spent === void 0 || !isDeepStrictEqual(spent, next)) {
        throw new TypeError(`${label} semantic correction budget spend was not acknowledged exactly`);
      }
      return spent;
    }
    async function reconcileGovernedCompletion(input, roleId, playerId, finalText, signal, operationId, completion) {
      const outcomes = outcomeAuthority?.governedPlayerStates[input.stateId];
      if (outcomes === void 0) {
        throw new TypeError(`${label} governed semantic reconciliation has no authority for ${input.stateId}`);
      }
      if (completion.boundary.sourceStateId !== input.stateId || !isDeepStrictEqual(completion.boundary.sourceOutcomeSchema, input.result)) {
        throw new TypeError(`${label} governed semantic reconciliation source schema changed`);
      }
      let raw;
      try {
        raw = await boundary.callJudge("player-output-adjudication", input.stateId, buildGovernedJudgePrompt(input, finalText, outcomes), signal);
      } catch (error) {
        governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("judge transport failed", error, signal));
        return { finalText, unresolved: true };
      }
      let candidate;
      let retainedSemanticCandidate;
      const retainSemanticCandidate = (value) => {
        try {
          retainedSemanticCandidate = snapshotJsonValue(value, `${label} recoverable governed semantic candidate`);
        } catch {
        }
      };
      const unresolvedEvidence = () => ({
        finalText,
        ...retainedSemanticCandidate === void 0 ? {} : { semanticCandidate: retainedSemanticCandidate },
        unresolved: true
      });
      let reconciliation;
      let structuralError;
      try {
        candidate = parseGovernedSemanticCandidate(raw);
        retainSemanticCandidate(candidate);
        reconciliation = reconcilePlaybookSemanticEvidence({
          outcomes,
          semanticCandidate: candidate,
          finalText,
          receipt: completion.outcomeReceipt
        });
      } catch (error) {
        if (!(error instanceof PlaybookSemanticCandidateStructureError)) {
          throw error;
        }
        structuralError = error;
      }
      if (structuralError !== void 0) {
        let spent;
        try {
          spent = await spendSemanticCorrectionBudget(completion.boundary, completion.receipt, finalText, retainedSemanticCandidate);
        } catch (error) {
          throw error;
        }
        if (spent === void 0) {
          governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("semantic correction budget is unavailable"));
          return unresolvedEvidence();
        }
        if (signal.aborted) {
          governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("semantic correction was aborted before its judge call", signal.reason, signal));
          return unresolvedEvidence();
        }
        let correctiveRaw;
        try {
          correctiveRaw = await boundary.callJudge("player-output-adjudication", input.stateId, buildGovernedJudgePrompt(input, finalText, outcomes, {
            reply: raw,
            error: structuralError.message
          }), signal);
        } catch (error) {
          governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("corrective judge failed", error, signal));
          return unresolvedEvidence();
        }
        try {
          candidate = parseGovernedSemanticCandidate(correctiveRaw);
          retainSemanticCandidate(candidate);
          reconciliation = reconcilePlaybookSemanticEvidence({
            outcomes,
            semanticCandidate: candidate,
            finalText,
            receipt: completion.outcomeReceipt
          });
        } catch (error) {
          if (!(error instanceof PlaybookSemanticCandidateStructureError)) {
            throw error;
          }
          governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("corrective semantic candidate is invalid"));
          return unresolvedEvidence();
        }
      }
      if (reconciliation === void 0) {
        throw new Error(`${label} semantic reconciliation produced no decision`);
      }
      const semanticCandidate = snapshotJsonValue(reconciliation.evidence.semanticCandidate, `${label} governed semantic candidate`);
      if (reconciliation.status === "unresolved") {
        governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement(reconciliation.reason, void 0, void 0, reconciliation.cause));
        return { finalText, semanticCandidate, unresolved: true };
      }
      const output = reconciliation.output;
      validateBossReplyOutput(input, output, resumableStateIds);
      governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, {
        status: "resolved",
        output
      });
      governedCompletionEvidenceByBoundaryId.set(completion.boundary.boundaryId, {
        boundaryEvidence: {},
        reconciliationStatus: reconciliation.status,
        output
      });
      if (reconciliation.status !== "deferred") {
        return { finalText, semanticCandidate };
      }
      const pending = boundPendingQuestion(input, roleId, output);
      const bindingId = operationId ?? randomUUID();
      expectedBoundPendingQuestion = pending;
      return {
        finalText,
        semanticCandidate,
        deferred: {
          operationId: bindingId,
          pendingQuestion: {
            questionId: pending.questionId,
            asker: pending.asker,
            question: pending.question,
            sourceItem: pending.sourceItem
          },
          playerContinuation: detachedPlayerContinuation(roleId, playerId)
        }
      };
    }
    async function deferredContinuationCompletionEvidence(completion) {
      const remember = (evidence) => {
        rememberGovernedCompletionEvidence(completion.boundary.boundaryId, evidence);
        return evidence;
      };
      const continuation = activeDeferredContinuation;
      if (continuation === void 0) {
        throw new Error(`${label} deferred continuation completed without active runtime context`);
      }
      const result = continuation.result;
      if (completion.operation.status !== "fulfilled" || completion.operation.value !== null || result === void 0 || result.status !== "ok" || isEmptyFinalText(result.finalText)) {
        if (completion.outcomeReceipt.classification === "unchanged" && (continuation.callError !== void 0 || result !== void 0 && result.status !== "ok")) {
          return remember({});
        }
        governedSettlementsByBoundaryId.set(completion.boundary.boundaryId, unresolvedGovernedSettlement("deferred player result has no semantic evidence", continuation.callError));
        return remember({
          ...result?.status !== "ok" || result.finalText === void 0 ? {} : { finalText: result.finalText },
          unresolved: true
        });
      }
      const input = continuation.input;
      const roleId = continuation.roleId;
      const signal = continuation.signal;
      if (input === void 0 || roleId === void 0 || signal === void 0) {
        throw new Error(`${label} deferred continuation lost its bound player identity or signal`);
      }
      return remember(await reconcileGovernedCompletion(input, roleId, continuation.playerId, result.finalText, signal, continuation.operationId, completion));
    }
    function assertAcknowledgedGovernedEvidence(completed, settlement, ledger) {
      const expected = governedCompletionEvidenceByBoundaryId.get(completed.boundaryId);
      if (expected === void 0 || (Object.prototype.hasOwnProperty.call(expected.boundaryEvidence, "finalText") ? completed.finalText !== expected.boundaryEvidence.finalText : completed.finalText !== void 0) || (Object.prototype.hasOwnProperty.call(expected.boundaryEvidence, "semanticCandidate") ? !isDeepStrictEqual(completed.semanticCandidate, expected.boundaryEvidence.semanticCandidate) : completed.semanticCandidate !== void 0)) {
        throw new TypeError(`${label} repository did not acknowledge the exact governed semantic evidence`);
      }
      if (settlement?.status !== "resolved")
        return;
      const persisted = persistedBoundaryReconciliation(completed, ledger);
      if (persisted === void 0 || persisted.historicalDeferred || persisted.reconciliation.status !== expected.reconciliationStatus || !isDeepStrictEqual(persisted.reconciliation.output, expected.output) || !isDeepStrictEqual(expected.output, settlement.output)) {
        throw new TypeError(`${label} repository did not acknowledge the exact governed semantic evidence`);
      }
    }
    function recordActiveGovernedAttempt(boundary2) {
      if (activeGovernedAttemptId !== void 0 && activeGovernedAttemptId !== boundary2.attemptId) {
        throw new Error(`${label} governed calls in one runtime boundary used different host attempt ids`);
      }
      activeGovernedAttemptId = boundary2.attemptId;
    }
    function refreshGovernedBoundaryStart(boundaryId) {
      try {
        const current = currentEffectLedger();
        const boundary2 = current.boundaries.find((candidate) => candidate.boundaryId === boundaryId);
        if (boundary2 === void 0)
          return;
        effectLedgerMirror = current;
        refreshRetainedEffectReconciliation(current);
        recordActiveGovernedAttempt(boundary2);
      } catch {
      }
    }
    function acknowledgeGovernedPlayerResult(value, boundaryId, source = "runExclusive") {
      if (!isPlainObject(value) || !isPlainObject(value.operation)) {
        throw new TypeError(`${label} repository ${source} returned an invalid settlement`);
      }
      const ledger = assertPlaybookEffectLedger(value.effectLedger, `${label} repository ${source} effect ledger`);
      const completed = ledger.boundaries.find((candidate) => candidate.boundaryId === boundaryId);
      if (completed === void 0 || completed.physicalReceipt === void 0 || !isDeepStrictEqual(completed.physicalReceipt, value.receipt)) {
        throw new TypeError(`${label} repository ${source} did not acknowledge its completed boundary`);
      }
      effectLedgerMirror = ledger;
      refreshRetainedEffectReconciliation(ledger);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(ledger);
      recordActiveGovernedAttempt(completed);
      if (value.operation.status === "rejected") {
        if (!Object.prototype.hasOwnProperty.call(value.operation, "reason")) {
          throw new TypeError(`${label} repository ${source} rejection omitted its reason`);
        }
        throw value.operation.reason;
      }
      if (value.operation.status !== "fulfilled" || !Object.prototype.hasOwnProperty.call(value.operation, "value")) {
        throw new TypeError(`${label} repository ${source} returned an invalid operation settlement`);
      }
      const result = validatePlayerResult(value.operation.value);
      playerBoundaryReceipts.set(result, {
        boundaryId: completed.boundaryId,
        attemptId: completed.attemptId
      });
      let governedSettlement = governedSettlementsByBoundaryId.get(boundaryId);
      if (governedSettlement === void 0 && result.status === "ok" && !isEmptyFinalText(result.finalText)) {
        governedSettlement = unresolvedGovernedSettlement("host omitted governed semantic settlement");
      }
      assertAcknowledgedGovernedEvidence(completed, governedSettlement, ledger);
      governedCompletionEvidenceByBoundaryId.delete(boundaryId);
      let governedOutput = governedSettlement?.status === "resolved" ? governedSettlement.output : void 0;
      const governedDisposition = governedOutput === void 0 ? void 0 : governedOutcomesForBoundary(completed)?.[governedOutput.guard]?.repositoryDisposition;
      if (source === "runExclusive" && governedDisposition === "deferred") {
        if (value.deferredStatus !== "bound" && value.deferredStatus !== "unresolved") {
          throw new TypeError(`${label} deferred settlement omitted its durable binding status`);
        }
        const operationId = completed.logicalOperationId;
        if (operationId === void 0) {
          throw new TypeError(`${label} deferred settlement omitted its logical operation`);
        }
        if (value.deferredStatus === "bound") {
          if (expectedBoundPendingQuestion === void 0 || currentBoundDeferredOperation(expectedBoundPendingQuestion)?.operationId !== operationId) {
            throw new TypeError(`${label} deferred settlement did not acknowledge its exact bound question`);
          }
        } else {
          if (deferredReconciliationOperationId !== operationId) {
            throw new TypeError(`${label} unresolved deferred settlement is not structurally unresolved`);
          }
          expectedBoundPendingQuestion = void 0;
          governedSettlement = unresolvedGovernedSettlement("deferred question did not receive an eligible durable binding");
          governedOutput = void 0;
        }
      } else if (source !== "runDeferred" && value.deferredStatus !== void 0) {
        throw new TypeError(`${label} non-deferred settlement returned a deferred binding status`);
      }
      if (governedSettlement !== void 0) {
        governedSettlementsByBoundaryId.delete(boundaryId);
        governedPlayerSettlements.set(result, governedSettlement);
        if (governedSettlement.status === "unresolved" && !boundaryExcludesEffect(completed)) {
          unresolvedSemanticBoundaryIds.add(boundaryId);
        } else {
          unresolvedSemanticBoundaryIds.delete(boundaryId);
        }
      }
      return result;
    }
    function acknowledgedBoundaryIsUnchanged(result) {
      if (outcomeAuthority === void 0)
        return true;
      const identity = playerBoundaryReceipts.get(result);
      if (identity === void 0)
        return false;
      const boundary2 = effectLedgerMirror.boundaries.find((candidate) => candidate.boundaryId === identity.boundaryId);
      return boundary2?.attemptId === identity.attemptId && boundary2.physicalReceipt?.classification === "unchanged";
    }
    function failedAttemptMatchesCurrentLedger(current) {
      const boundaryPrefix = failedEffectBoundaryPrefix;
      if (failedGovernedAttemptUnknown || boundaryPrefix === void 0) {
        return false;
      }
      const causalBoundaries = current.boundaries.filter(({ sequence }) => sequence > boundaryPrefix);
      const matches2 = failedGovernedAttemptId === void 0 ? causalBoundaries.length === 0 : causalBoundaries.length > 0 && causalBoundaries.every(({ attemptId }) => attemptId === failedGovernedAttemptId);
      if (!matches2)
        failedGovernedAttemptUnknown = true;
      return matches2;
    }
    function failedAttemptAllowsReplay() {
      if (!hasGovernedPlayerStates)
        return true;
      if (unresolvedSemanticBoundaryIds.size > 0)
        return false;
      let current;
      try {
        current = currentEffectLedger();
        effectLedgerMirror = current;
        refreshRetainedEffectReconciliation(current);
        refreshUnresolvedSemanticReconciliation(current);
      } catch {
        failedGovernedAttemptUnknown = true;
        return false;
      }
      if (unresolvedSemanticBoundaryIds.size > 0)
        return false;
      if (!failedAttemptMatchesCurrentLedger(current))
        return false;
      if (failedGovernedAttemptId === void 0)
        return true;
      const boundaries = current.boundaries.filter(({ attemptId }) => attemptId === failedGovernedAttemptId);
      return boundaries.length > 0 && boundaries.every(({ physicalReceipt }) => physicalReceipt?.classification === "unchanged");
    }
    let acceptedStepResult;
    let requiredRecoveryBaseline;
    function captureRecoveryCheckpoint(stateId, prompt, boundaryPrefix) {
      if (requiredRecoveryBaseline !== void 0)
        return;
      const id = recoveryCheckpoint?.stateId === stateId ? recoveryCheckpoint.id : void 0;
      recoveryCheckpoint = void 0;
      if (!actor || currentState().stateId !== stateId)
        return;
      try {
        const current = currentEffectLedger();
        recoveryCheckpoint = deepFreeze({
          stateId,
          prompt,
          ...id === void 0 ? {} : { id },
          machine: detachPersistedMachineSnapshot(actor.getPersistedSnapshot()),
          boundaryPrefix: boundaryPrefix ?? current.boundaries.length
        });
      } catch {
      }
    }
    function stepReplayIsSafe() {
      if (!recoveryCheckpoint || hasUnresolvedReconciliation())
        return false;
      const current = currentEffectLedger();
      return current.boundaries.slice(recoveryCheckpoint.boundaryPrefix).every((boundary2) => runtimeBoundaryIsOwned(boundary2) && boundary2.logicalOperationId === void 0 && (boundary2.physicalReceipt?.classification === "unchanged" || boundary2.restored !== void 0));
    }
    function repairableReadOnlyBoundary() {
      if (!recoveryCheckpoint || !repositoryCapability?.observe || !repositoryCapability.acquire || retainedEffectReconciliationRequired || deferredReconciliationOperationId !== void 0)
        return void 0;
      const suffix = currentEffectLedger().boundaries.slice(recoveryCheckpoint.boundaryPrefix);
      if (suffix.length !== 1)
        return void 0;
      const saved = suffix[0];
      if (!runtimeBoundaryIsOwned(saved) || saved.restored !== void 0 || saved.sourceStateId !== recoveryCheckpoint.stateId || saved.cohortId !== void 0 || saved.logicalOperationId !== void 0 || saved.dispositions.some((item) => item !== "unchanged") || saved.physicalReceipt === void 0 || saved.after?.head !== saved.baseline.head || saved.physicalReceipt.classification === "unchanged" || [...unresolvedSemanticBoundaryIds].some((id) => id !== saved.boundaryId))
        return void 0;
      return saved;
    }
    async function confirmReadOnlyRestoration(saved, signal) {
      const claim = await repositoryCapability.acquire({ signal });
      try {
        await claim.assertOwner();
        const restored = snapshotJsonValue(await repositoryCapability.observe());
        if (!isDeepStrictEqual(restored, saved.baseline)) {
          throw new Error(`${label} preparation has not restored the stopped step's repository; it remains paused`);
        }
        signal.throwIfAborted();
        effectLedgerMirror = assertPlaybookEffectLedger(await effectLedgerCapability.writeAhead([
          { kind: "replace-boundaries", replacements: [{ expected: saved, next: { ...saved, restored } }] }
        ]));
        if (!isDeepStrictEqual(effectLedgerMirror.boundaries.find(({ boundaryId }) => boundaryId === saved.boundaryId)?.restored, restored)) {
          throw new Error(`${label} repository restoration was not durably acknowledged`);
        }
        refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      } finally {
        await claim.release();
      }
    }
    function recoverableJudgment() {
      if (!recoveryCheckpoint || recoveryCheckpoint.result !== void 0 || recoveryCheckpoint.delivered || retainedEffectReconciliationRequired || deferredReconciliationOperationId !== void 0)
        return void 0;
      const suffix = currentEffectLedger().boundaries.slice(recoveryCheckpoint.boundaryPrefix);
      if (suffix.length !== 1)
        return void 0;
      const saved = suffix[0];
      if (!runtimeBoundaryIsOwned(saved) || saved.sourceStateId !== recoveryCheckpoint.stateId || saved.logicalOperationId !== void 0 || saved.correctionBudget.spent || saved.physicalReceipt?.classification !== "one-descendant-commit" || !saved.finalText?.trim() || governedOutcomesForBoundary(saved) === void 0 || saved.semanticCandidate !== void 0 && persistedBoundaryReconciliation(saved, currentEffectLedger())?.reconciliation.status !== "resolved" || [...unresolvedSemanticBoundaryIds].some((id) => id !== saved.boundaryId))
        return void 0;
      return saved;
    }
    async function recoverJudgment(saved, signal) {
      const checkpoint = recoveryCheckpoint;
      const persisted = checkpoint.machine;
      const input = Object.values(persisted.children)[0];
      const actorInput = input.snapshot.input;
      const outcomes = governedOutcomesForBoundary(saved);
      const candidate = saved.semanticCandidate ?? parseGovernedSemanticCandidate(await boundary.callJudge("player-output-adjudication", saved.sourceStateId, buildGovernedJudgePrompt(actorInput, saved.finalText, outcomes), signal));
      const result = reconcilePlaybookSemanticEvidence({
        outcomes,
        semanticCandidate: candidate,
        finalText: saved.finalText,
        receipt: saved.physicalReceipt
      });
      signal.throwIfAborted();
      const next = {
        ...saved,
        semanticCandidate: snapshotJsonValue(result.evidence.semanticCandidate)
      };
      const acknowledged = assertPlaybookEffectLedger(await effectLedgerCapability.writeAhead([
        {
          kind: "replace-boundaries",
          replacements: [{ expected: saved, next }]
        }
      ]));
      if (!isDeepStrictEqual(acknowledged.boundaries.find((b) => b.boundaryId === saved.boundaryId), next)) {
        throw new Error(`${label} recovered judgment was not acknowledged exactly`);
      }
      effectLedgerMirror = acknowledged;
      refreshUnresolvedSemanticReconciliation(acknowledged);
      if (result.status !== "resolved") {
        const error = attachPlaybookFailureCause(new Error(result.status === "unresolved" && "reason" in result.cause.evidence && result.cause.evidence.reason ? String(result.cause.evidence.reason) : `${label} saved result could not be reconciled; the playbook remains parked`), result.status === "unresolved" ? result.cause : runtimeDefectCause("Saved result still needs a Boss answer"));
        const paused = detachPersistedMachineSnapshot(actor.getPersistedSnapshot());
        stopActor();
        actor = buildActor(runtimePorts, {
          ...paused,
          context: { ...paused.context, lastError: snapshotJsonValue(normalizeErrorFull(error)) }
        });
        suppressInspectionEmissions = false;
        actor.start();
        throw error;
      }
      await resumeCheckpoint({ ...checkpoint, result: snapshotJsonValue(result.output) });
    }
    async function resumeCheckpoint(checkpoint) {
      acceptedStepResult = checkpoint;
      try {
        stopActor();
        actor = buildActor(runtimePorts, checkpoint.machine);
        suppressInspectionEmissions = false;
        actor.start();
        await waitForPlaybookQuiescence(actor, { pendingCalls: nestedBridge });
      } finally {
        acceptedStepResult = void 0;
      }
    }
    function exportRuntimeSnapshot(checkpoint) {
      if (!actor || !session || disposed || disposalPromise !== void 0) {
        return void 0;
      }
      if (activeSignal !== void 0 && checkpoint === void 0)
        return void 0;
      if (deferredSettlementClosure !== void 0)
        return void 0;
      const pendingCall = checkpoint?.child ?? nestedBridge.getPendingCall();
      const bridgeSuspendedCall = checkpoint?.child ? nestedBridge.checkpointCall(checkpoint.child) : nestedBridge.getSuspendedCall();
      if (pendingCall === void 0 !== (bridgeSuspendedCall === void 0)) {
        return void 0;
      }
      let suspendedCall;
      if (bridgeSuspendedCall !== void 0) {
        if (pendingCall?.callId !== bridgeSuspendedCall.callId || pendingCall?.playbookId !== bridgeSuspendedCall.playbookId || pendingCall?.childSessionId !== bridgeSuspendedCall.childSessionId) {
          return void 0;
        }
        if (!playbookCallTurnIds.has(bridgeSuspendedCall.callId)) {
          return void 0;
        }
        const turnId = playbookCallTurnIds.get(bridgeSuspendedCall.callId);
        if (bridgeSuspendedCall.turnId !== void 0 && bridgeSuspendedCall.turnId !== turnId) {
          return void 0;
        }
        suspendedCall = {
          ...bridgeSuspendedCall,
          ...turnId === void 0 ? {} : { turnId },
          ...hasGovernedPlayerStates ? {
            effectBoundaryPrefixSequence: playbookCallEffectPrefixes.get(bridgeSuspendedCall.callId) ?? null
          } : {}
        };
      }
      const interrupted = checkpoint?.interrupted && recoveryCheckpoint && machine.root.states.failed;
      const state = interrupted ? normalizePlaybookSnapshot(machine.resolveState({ value: "failed", context: {} })) : checkpoint?.child ? normalizePlaybookSnapshot(actor.getSnapshot(), { pendingCall }) : currentState();
      if (state.status !== "active" || !state.quiescent)
        return void 0;
      const context = actor.getSnapshot().context;
      const machineSnapshot = detachPersistedMachineSnapshot(interrupted ? { ...recoveryCheckpoint.machine, value: "failed", children: {} } : actor.getPersistedSnapshot(), state.stateId === "failed" ? { lastError: interrupted ? { name: "InterruptedStep", message: "The process stopped during this step. Review the recorded work before choosing how to continue.", cause: runtimeDefectCause("The process stopped during this step. Review the recorded work before choosing how to continue.") } : failedStateError(context ?? {}) } : {});
      effectLedgerMirror = currentEffectLedger();
      refreshRetainedEffectReconciliation(effectLedgerMirror);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      const pendingQuestions = !hasUnresolvedReconciliation() ? pendingBossQuestionsFor(state, context ?? {}) : [];
      const interruptedPrefix = interrupted ? activeEffectLedgerPrefixSequence : void 0;
      const interruptedAttempts = new Set(effectLedgerMirror.boundaries.filter(({ sequence }) => interruptedPrefix !== void 0 && sequence > interruptedPrefix).map(({ attemptId }) => attemptId));
      const failedEffectAttempt = interrupted && interruptedPrefix !== void 0 && interruptedAttempts.size <= 1 ? { boundaryPrefix: interruptedPrefix, attemptId: interruptedAttempts.values().next().value ?? null } : hasGovernedPlayerStates && !interrupted && state.stateId === "failed" && failedAttemptMatchesCurrentLedger(effectLedgerMirror) ? {
        boundaryPrefix: failedEffectBoundaryPrefix,
        attemptId: failedGovernedAttemptId ?? null
      } : void 0;
      return {
        schemaVersion: 4,
        playbookId: session.playbookId,
        machine: machineSnapshot,
        roleResumeTokens: snapshotRoleResumeTokens(),
        sequences: {
          trace: traceSequence,
          turn: turnSequence,
          judgeCall: judgeCallSequence,
          playerCall: playerCallSequence,
          playbookCall: playbookCallSequence,
          ...declaredActors.has("captain") ? { captainCall: captainCallSequence } : {}
        },
        state,
        pendingBossQuestions: pendingQuestions.map((pending) => ({
          questionId: pending.questionId,
          asker: pending.asker,
          question: pending.question,
          sourceItem: pending.sourceItem
        })),
        effectLedger: effectLedgerMirror,
        ...retainedEffectSourceSessionId === void 0 ? {} : { retainedEffectSourceSessionId },
        ...retainedEffectReconciliation === void 0 ? {} : { retainedEffectReconciliation },
        ...failedEffectAttempt === void 0 ? {} : { failedEffectAttempt },
        ...(state.stateId === "failed" || pendingQuestions.length > 0) && recoveryCheckpoint !== void 0 ? { recoveryCheckpoint } : {},
        ...suspendedCall === void 0 ? {} : { suspendedCall }
      };
    }
    async function runJournalledStep(kind, input, signal, execute) {
      const saved = acceptedStepResult;
      let output;
      if (saved?.stateId === input.stateId && saved.result !== void 0) {
        acceptedStepResult = void 0;
        recoveryCheckpoint = saved;
        output = snapshotJsonValue(saved.result);
      } else {
        const record = savedPorts?.recordStep;
        await drainEmissions();
        signal.throwIfAborted();
        try {
          captureRecoveryCheckpoint(input.stateId, "command" in input ? input.command : "role" in input ? composeBoundPlayerPrompt(input) : composeCaptainPrompt(input));
        } catch (error) {
          if (!isAbortFailure(error, signal))
            controlPlaneError ??= error;
          throw error;
        }
        if (record) {
          const id = randomUUID();
          if (recoveryCheckpoint)
            recoveryCheckpoint = { ...recoveryCheckpoint, id };
          const step = { id, kind, stateId: input.stateId };
          await record(step, exportRuntimeSnapshot({ interrupted: true }));
          signal.throwIfAborted();
          const result = snapshotJsonValue(await execute());
          if (recoveryCheckpoint?.id === id)
            recoveryCheckpoint = { ...recoveryCheckpoint, result };
          await record({ ...step, result });
          output = result;
        } else {
          output = await execute();
        }
      }
      if (recoveryCheckpoint?.stateId === input.stateId) {
        const { result: _result, ...start } = recoveryCheckpoint;
        recoveryCheckpoint = { ...start, delivered: true };
      }
      return output;
    }
    function validateRecoveryCheckpoint(checkpoint) {
      if (!checkpoint)
        return;
      const node = machine.root.states[checkpoint.stateId];
      const persisted = checkpoint.machine;
      const children = persisted.children;
      if (!node || node.invoke.length !== 1 || !["player", "captain", "script"].includes(String(node.invoke[0].src)) || !isPlainObject(children) || Object.keys(children).length !== 1) {
        throw new TypeError(`${label} recovery checkpoint does not name one current invocation`);
      }
      const child = children[node.invoke[0].id];
      if (!child || child.src !== node.invoke[0].src || !isPlainObject(child.snapshot) || child.snapshot.status !== "active" || !isPlainObject(child.snapshot.input) || child.snapshot.input.stateId !== checkpoint.stateId) {
        throw new TypeError(`${label} recovery checkpoint invocation is incompatible`);
      }
      if (checkpoint.result !== void 0) {
        const output = checkpoint.result;
        const input = child.snapshot.input;
        if (!isPlainObject(output) || typeof output.guard !== "string" || !isPlainObject(input.result) || !Object.hasOwn(input.result, output.guard) || node.invoke[0].src === "script" && (!Number.isInteger(output.exitStatus) || Object.keys(output).sort().join(",") !== "exitStatus,guard" || output.guard !== Object.keys(input.result)[output.exitStatus === 0 ? 0 : Math.min(1, Object.keys(input.result).length - 1)])) {
          throw new TypeError(`${label} saved step result is incompatible with its invocation`);
        }
        for (const field of extractFields(String(input.result[output.guard]))) {
          if (output[field] === void 0 || output[field] === null)
            throw new TypeError(`${label} saved step result is missing ${field}`);
        }
      }
    }
    function captureEffectLedgerPrefixSequence() {
      if (!hasGovernedPlayerStates)
        return void 0;
      try {
        const current = currentEffectLedger();
        effectLedgerMirror = current;
        refreshRetainedEffectReconciliation(current);
        return current.boundaries.at(-1)?.sequence ?? 0;
      } catch {
        return void 0;
      }
    }
    function bindAutomaticReplayBoundary(prefixSequence) {
      activeGovernedBoundarySeen = false;
      activeGovernedAttemptId = void 0;
      activeEffectLedgerPrefixSequence = prefixSequence;
    }
    function beginAutomaticReplayBoundary() {
      bindAutomaticReplayBoundary(captureEffectLedgerPrefixSequence());
    }
    function latchFailedGovernedAttempt() {
      if (!hasGovernedPlayerStates) {
        failedGovernedAttemptUnknown = false;
        failedEffectBoundaryPrefix = void 0;
        failedGovernedAttemptId = void 0;
        return;
      }
      if (activeEffectLedgerPrefixSequence === void 0) {
        failedGovernedAttemptUnknown = true;
        failedEffectBoundaryPrefix = void 0;
        failedGovernedAttemptId = void 0;
        return;
      }
      let current;
      try {
        current = currentEffectLedger();
        effectLedgerMirror = current;
        refreshRetainedEffectReconciliation(current);
      } catch {
        failedGovernedAttemptUnknown = true;
        failedEffectBoundaryPrefix = void 0;
        failedGovernedAttemptId = void 0;
        return;
      }
      const attemptIds = new Set(current.boundaries.filter(({ sequence }) => sequence > activeEffectLedgerPrefixSequence).map(({ attemptId }) => attemptId));
      if (activeGovernedAttemptId !== void 0) {
        attemptIds.add(activeGovernedAttemptId);
      }
      if (attemptIds.size > 1) {
        failedGovernedAttemptUnknown = true;
        failedEffectBoundaryPrefix = void 0;
        failedGovernedAttemptId = void 0;
        return;
      }
      failedGovernedAttemptUnknown = attemptIds.size === 0 && activeGovernedBoundarySeen;
      failedEffectBoundaryPrefix = failedGovernedAttemptUnknown ? void 0 : activeEffectLedgerPrefixSequence;
      failedGovernedAttemptId = attemptIds.values().next().value;
    }
    function trackBoundaryCall(call) {
      if (parallelProfile === void 0)
        return call;
      activeBoundaryCalls.add(call);
      const forget = () => {
        activeBoundaryCalls.delete(call);
      };
      void call.then(forget, forget);
      return call;
    }
    async function drainBoundaryCalls() {
      while (activeBoundaryCalls.size > 0) {
        await Promise.allSettled([...activeBoundaryCalls]);
      }
    }
    function cohortParallelStateFor(stateId) {
      const parallelState = parallelProfile?.parallelStateByWorkingStateId.get(stateId);
      if (parallelState === void 0)
        return void 0;
      if (consumedCohortBoundaries.get(parallelState.stateId) === publicBoundarySequence) {
        return void 0;
      }
      const pending = pendingCohorts.get(parallelState.stateId);
      if (pending !== void 0 && pending.boundarySequence === publicBoundarySequence && !pending.started) {
        return parallelState;
      }
      const active = currentState().activeStateIds;
      return parallelState.regions.every(({ workingStateId }) => active.includes(workingStateId)) ? parallelState : void 0;
    }
    function startCohort(parallelState, cohort) {
      cohort.started = true;
      consumedCohortBoundaries.set(parallelState.stateId, cohort.boundarySequence);
      if (pendingCohorts.get(parallelState.stateId) === cohort) {
        pendingCohorts.delete(parallelState.stateId);
      }
    }
    async function joinCohort(parallelState, member) {
      let cohort = pendingCohorts.get(parallelState.stateId);
      if (cohort === void 0 || cohort.boundarySequence !== publicBoundarySequence || cohort.started) {
        cohort = {
          boundarySequence: publicBoundarySequence,
          members: /* @__PURE__ */ new Map(),
          started: false
        };
        pendingCohorts.set(parallelState.stateId, cohort);
      }
      const registered = cohort;
      if (registered.members.has(member.region.key)) {
        throw new Error(`${label} parallel state ${parallelState.stateId} registered region ${member.region.key} twice`);
      }
      registered.members.set(member.region.key, member);
      const withdraw = () => {
        if (registered.started)
          return;
        startCohort(parallelState, registered);
        for (const candidate of registered.members.values()) {
          candidate.settled.reject(candidate.signal.aborted ? candidate.signal.reason : member.signal.reason);
        }
      };
      if (member.signal.aborted) {
        withdraw();
      } else {
        member.signal.addEventListener("abort", withdraw, { once: true });
      }
      if (!registered.started && registered.members.size === parallelState.regions.length) {
        startCohort(parallelState, registered);
        void settleCohort(parallelState, registered);
      }
      return await member.settled.promise;
    }
    async function settleCohort(parallelState, cohort) {
      const members = parallelState.regions.map(({ key }) => cohort.members.get(key));
      const cancellation = new AbortController();
      const completionOrder = [];
      const decided = /* @__PURE__ */ new Map();
      let decisionSequence = 0;
      const decide = (member, error, cause2 = failureCauses.causeOf(error)) => {
        if (decided.has(member))
          return;
        decided.set(member, { error, cause: cause2, sequence: ++decisionSequence });
      };
      const isCancellation = (error) => cancellation.signal.aborted && Object.is(error, cancellation.signal.reason) && !activeAborts?.isAbortReason(error);
      const operationFor = (member) => async (context) => {
        const callSignal = combineAbortSignals(member.signal, cancellation.signal);
        try {
          if (activePlayerKeys.has(member.playerKey)) {
            await member.reportCollision(callSignal);
          }
          activePlayerKeys.add(member.playerKey);
          try {
            const result = await member.run(callSignal, cancellation.signal, effectAuthorizedPreExistingBlock(member.effectBoundary, context?.baseline));
            if (result.status !== "ok" && !cancellation.signal.aborted) {
              const cause2 = resultFailureCauses.get(result) ?? runtimeDefectCause(`callPlayer status ${JSON.stringify(result.status)}`);
              const failure2 = attachPlaybookFailureCause(markFsmResultFailure(new Error(result.error ?? `captainBridge: callPlayer status "${result.status}"`)), cause2);
              failureCauses.retain(failure2, cause2);
              decide(member, failure2, cause2);
              cancellation.abort(failure2);
            }
            return result;
          } finally {
            activePlayerKeys.delete(member.playerKey);
          }
        } catch (error) {
          if (!isCancellation(error))
            decide(member, error);
          if (!cancellation.signal.aborted)
            cancellation.abort(error);
          throw error;
        } finally {
          completionOrder.push(member);
        }
      };
      const completeEffectBoundary = (completion) => cohortCompletionQueue.add(async () => {
        const member = members.find(({ roleId }) => roleId === completion.roleId);
        if (member === void 0 || completion.boundary.boundaryId !== member.effectBoundary.boundaryId) {
          throw new TypeError(`${label} repository cohort completed an undeclared member`);
        }
        const evidence = await completionEvidenceFor(member.input, member.roleId, member.playerId, member.signal, void 0)(completion);
        const settlement = governedSettlementsByBoundaryId.get(member.effectBoundary.boundaryId);
        if (settlement?.status === "unresolved") {
          decide(member, settlement.error);
        }
        return evidence;
      });
      const runSignal = activeSignal ?? members[0].signal;
      const invocationId = randomUUID();
      let settled;
      try {
        for (const member of members)
          member.signal.throwIfAborted();
        settled = await repositoryCapability.runCohort({
          signal: runSignal,
          invocationId,
          roleIds: members.map(({ roleId }) => roleId),
          dispositionsByRole: Object.fromEntries(members.map(({ roleId }) => [roleId, ["unchanged"]])),
          effectBoundaries: Object.fromEntries(members.map(({ roleId, effectBoundary: effectBoundary2 }) => [
            roleId,
            effectBoundary2
          ])),
          operations: Object.fromEntries(members.map((member) => [member.roleId, operationFor(member)])),
          completeEffectBoundary
        });
        if (!isPlainObject(settled) || settled.invocationId !== invocationId) {
          throw new TypeError(`${label} repository cohort changed its invocation identity`);
        }
      } catch (error) {
        for (const member of members) {
          governedSettlementsByBoundaryId.delete(member.effectBoundary.boundaryId);
          governedCompletionEvidenceByBoundaryId.delete(member.effectBoundary.boundaryId);
          refreshGovernedBoundaryStart(member.effectBoundary.boundaryId);
        }
        if (!isAbortFailure(error, runSignal))
          controlPlaneError ??= error;
        for (const member of members)
          member.settled.reject(error);
        return;
      }
      const releaseOrder = [
        ...completionOrder,
        ...members.filter((member) => !completionOrder.includes(member))
      ];
      const acknowledged = /* @__PURE__ */ new Map();
      const failures = /* @__PURE__ */ new Map();
      for (const member of releaseOrder) {
        const operation = isPlainObject(settled.operations) ? settled.operations[member.roleId] : void 0;
        try {
          const result = acknowledgeGovernedPlayerResult({
            operation,
            receipt: isPlainObject(settled.receipts) ? settled.receipts[member.roleId] : void 0,
            effectLedger: settled.effectLedger
          }, member.effectBoundary.boundaryId, "runCohort");
          acknowledged.set(member, result);
          const settlement = governedPlayerSettlements.get(result);
          if (settlement?.status === "unresolved") {
            failures.set(member, settlement.error);
          } else if (result.status !== "ok") {
            failures.set(member, decided.get(member)?.error);
          }
        } catch (error) {
          failures.set(member, error);
          const operationReason = isPlainObject(operation) && operation.status === "rejected" && Object.is(operation.reason, error);
          if (!operationReason) {
            if (!isAbortFailure(error, runSignal))
              controlPlaneError ??= error;
            decide(member, error);
          }
        } finally {
          governedSettlementsByBoundaryId.delete(member.effectBoundary.boundaryId);
          governedCompletionEvidenceByBoundaryId.delete(member.effectBoundary.boundaryId);
        }
      }
      if (failures.size === 0) {
        for (const member of releaseOrder) {
          member.settled.resolve(acknowledged.get(member));
        }
        return;
      }
      for (const result of acknowledged.values()) {
        governedPlayerSettlements.delete(result);
      }
      const first = [...decided.values()].sort((left, right) => left.sequence - right.sequence)[0];
      const failure = first?.error ?? failures.get(releaseOrder.find((member) => failures.has(member))) ?? markFsmResultFailure(new Error(`${label} parallel state ${parallelState.stateId} cohort failed`));
      const cause = first?.cause ?? failureCauses.causeOf(failure);
      if (cause !== void 0) {
        failureCauses.retain(failure, cause);
        attachPlaybookFailureCause(failure, cause);
      }
      for (const member of members)
        member.settled.reject(failure);
    }
    const boundary = {
      async callPlayer(input, roleId, freshPrompt, signal) {
        await drainEmissions();
        signal.throwIfAborted();
        const deferredContinuation = activeDeferredContinuation;
        const reconstructed = takeReconstructedGovernedPlayerResult(input, roleId);
        if (reconstructed !== void 0)
          return reconstructed;
        if (deferredContinuation === void 0 && hasUnresolvedReconciliation()) {
          throw markFsmResultFailure(new Error(`${label} governed semantic reconciliation remains unresolved`));
        }
        const turnId = activeTurnId;
        const stateId = input.stateId;
        const playerId = resolvedPlayerId(roleId);
        let selectedResume;
        try {
          signal.throwIfAborted();
          selectedResume = deferredContinuation?.playerContinuation ?? selectPlayerResume(roleId, playerId);
        } catch (error) {
          if (!isAbortFailure(error, signal))
            controlPlaneError ??= error;
          throw error;
        }
        const prompt = selectedResume === false ? freshPrompt : composeBoundPlayerPrompt(input, true);
        const callId = deferredContinuation?.effectBoundary.callId ?? `player-${++playerCallSequence}`;
        const callIdentity = (resume) => ({
          ...stateIdentity(stateId),
          sourceItem: input.sourceItem,
          roleId,
          ...playerId === void 0 ? {} : { playerId },
          resume
        });
        const position = {
          ...turnId !== void 0 ? { turnId } : {},
          callId
        };
        const playerKey = continuationKey(roleId, playerId);
        const runTracedPlayerCall = async (resume = selectedResume, preExistingBlock, callSignal = signal, cohortCancellation) => {
          const identity = callIdentity(resume);
          const traceAborts = parallelProfile === void 0 ? void 0 : abortReasonClassifier(callSignal, activeAborts);
          const withPreExisting = (text) => preExistingBlock === void 0 ? text : `${text}

${preExistingBlock}`;
          const callPrompt = withPreExisting(resume === false ? freshPrompt : prompt);
          const callFreshPrompt = withPreExisting(freshPrompt);
          await emitCallStarted("player.call.started", "player.call.finished", { ...identity, prompt: callPrompt }, position, callSignal, void 0, traceAborts);
          let rawResult;
          try {
            callSignal.throwIfAborted();
            rawResult = await requireHostPorts().callPlayer(roleId, callPrompt, callSignal, {
              resume,
              ...callPrompt === callFreshPrompt ? {} : { freshPrompt: callFreshPrompt }
            });
            callSignal.throwIfAborted();
          } catch (error) {
            if (!isAbortFailure(error, callSignal))
              controlPlaneError ??= error;
            try {
              await emitTrace("player.call.finished", {
                ...identity,
                status: isAbortFailure(error, callSignal) ? "aborted" : "error",
                error: normalizeError(error)
              }, position, traceAborts);
            } catch {
            }
            throw decidePlayerCallFailure(error, roleId, playerId, callSignal, cohortCancellation);
          }
          let result;
          try {
            result = validatePlayerResult(rawResult);
          } catch (error) {
            if (!isAbortFailure(error, callSignal))
              controlPlaneError ??= error;
            try {
              await emitTrace("player.call.finished", { ...identity, status: "error", error: normalizeError(error) }, position, traceAborts);
            } catch {
            }
            throw decidePlayerCallFailure(error, roleId, playerId, callSignal, cohortCancellation);
          }
          try {
            updatePlayerResume(roleId, playerId, result);
          } catch (error) {
            if (!isAbortFailure(error, callSignal))
              controlPlaneError ??= error;
            try {
              await emitTrace("player.call.finished", { ...identity, status: "error", error: normalizeError(error) }, position, traceAborts);
            } catch {
            }
            throw error;
          }
          await emitTrace("player.call.finished", {
            ...identity,
            status: result.status,
            ...result.finalText !== void 0 ? { finalText: result.finalText } : {},
            ...result.error !== void 0 ? { error: normalizeError(result.error) } : {},
            ...result.resumeToken !== void 0 ? { resumeToken: result.resumeToken } : {}
          }, position, traceAborts);
          if (result.status === "ok") {
            pendingResultFailureCause = void 0;
          } else if (result.status === "aborted") {
            pendingResultFailureCause = ABORTED_FAILURE_CAUSE;
          } else {
            pendingResultFailureCause = playerFailureCause({
              roleId,
              ...playerId === void 0 ? {} : { playerId },
              error: result.error ?? `callPlayer status ${JSON.stringify(result.status)}`
            });
          }
          if (pendingResultFailureCause !== void 0) {
            resultFailureCauses.set(result, pendingResultFailureCause);
          }
          return result;
        };
        const reportPlayerKeyCollision = async (callSignal) => {
          const error = new Error(`simultaneous calls to player key ${playerKey} are not allowed`);
          const traceAborts = parallelProfile === void 0 ? void 0 : abortReasonClassifier(callSignal, activeAborts);
          await emitCallStarted("player.call.started", "player.call.finished", { ...callIdentity(selectedResume), prompt }, position, callSignal, void 0, traceAborts);
          await emitTrace("player.call.finished", {
            ...callIdentity(selectedResume),
            status: "error",
            error: normalizeError(error)
          }, position, traceAborts);
          throw error;
        };
        const cohortState = deferredContinuation === void 0 ? cohortParallelStateFor(input.stateId) : void 0;
        if (cohortState !== void 0) {
          const effectBoundary2 = governedBoundarySeed(input, roleId, callId, turnId);
          if (effectBoundary2 === void 0 || repositoryCapability?.runCohort === void 0) {
            throw new Error(`${label} parallel state ${cohortState.stateId} requires governed player states and repository.runCohort`);
          }
          activeGovernedBoundarySeen = true;
          return await joinCohort(cohortState, {
            region: cohortState.regions.find(({ workingStateId }) => workingStateId === input.stateId),
            input,
            roleId,
            playerId,
            playerKey,
            signal,
            effectBoundary: effectBoundary2,
            run: (callSignal, cohortCancellation, preExistingBlock) => runTracedPlayerCall(selectedResume, preExistingBlock, callSignal, cohortCancellation),
            reportCollision: reportPlayerKeyCollision,
            settled: deferredValue()
          });
        }
        if (activePlayerKeys.has(playerKey)) {
          await reportPlayerKeyCollision(signal);
        }
        activePlayerKeys.add(playerKey);
        try {
          const effectBoundary2 = governedBoundarySeed(input, roleId, callId, turnId);
          if (deferredContinuation !== void 0) {
            if (effectBoundary2 === void 0 || effectBoundary2.runtimeSessionId !== deferredContinuation.effectBoundary.runtimeSessionId || effectBoundary2.turnId !== deferredContinuation.effectBoundary.turnId || effectBoundary2.callId !== deferredContinuation.effectBoundary.callId || effectBoundary2.roleId !== deferredContinuation.effectBoundary.roleId || effectBoundary2.sourceStateId !== deferredContinuation.effectBoundary.sourceStateId || !isDeepStrictEqual(effectBoundary2.sourceOutcomeSchema, deferredContinuation.effectBoundary.sourceOutcomeSchema) || !isDeepStrictEqual(effectBoundary2.dispositions, deferredContinuation.effectBoundary.dispositions)) {
              throw new TypeError(`${label} deferred continuation did not invoke its bound player boundary`);
            }
            activeGovernedBoundarySeen = true;
            deferredContinuation.input = input;
            deferredContinuation.roleId = roleId;
            deferredContinuation.playerId = playerId;
            deferredContinuation.signal = signal;
            try {
              deferredContinuation.result = await runTracedPlayerCall(selectedResume, effectAuthorizedPreExistingBlock(effectBoundary2, deferredContinuation.baseline));
            } catch (error) {
              deferredContinuation.callError = error;
            } finally {
              deferredContinuation.rawPlayerSettled.resolve();
            }
            return await deferredContinuation.delivery.promise;
          }
          if (effectBoundary2 === void 0)
            return await runTracedPlayerCall();
          if (repositoryCapability === void 0) {
            throw new Error(`${label} governed player call requires repository.runExclusive`);
          }
          activeGovernedBoundarySeen = true;
          try {
            const exclusive = await repositoryCapability.runExclusive({
              signal,
              effectBoundary: effectBoundary2,
              // DR-062 §4: the call's own baseline, supplied by the host that
              // captured it under this exclusive claim. A host that supplies
              // none states no pre-existing change, exactly as an empty
              // baseline projection does.
              operation: async (context) => {
                if (requiredRecoveryBaseline !== void 0) {
                  if (!isDeepStrictEqual(snapshotJsonValue(context.baseline), requiredRecoveryBaseline)) {
                    throw new Error(`${label} repository changed after preparation; the stopped step remains paused`);
                  }
                  requiredRecoveryBaseline = void 0;
                  captureRecoveryCheckpoint(input.stateId, freshPrompt, currentEffectLedger().boundaries.findIndex(({ boundaryId }) => boundaryId === effectBoundary2.boundaryId));
                }
                return runTracedPlayerCall(selectedResume, effectAuthorizedPreExistingBlock(effectBoundary2, context?.baseline));
              },
              completeEffectBoundary: completionEvidenceFor(input, roleId, playerId, signal, void 0)
            });
            return acknowledgeGovernedPlayerResult(exclusive, effectBoundary2.boundaryId);
          } catch (error) {
            if (expectedBoundPendingQuestion !== void 0) {
              closeAfterIndeterminateDeferredSettlement(void 0, error);
            }
            expectedBoundPendingQuestion = void 0;
            governedSettlementsByBoundaryId.delete(effectBoundary2.boundaryId);
            governedCompletionEvidenceByBoundaryId.delete(effectBoundary2.boundaryId);
            refreshGovernedBoundaryStart(effectBoundary2.boundaryId);
            if (!isAbortFailure(error, signal))
              controlPlaneError ??= error;
            throw error;
          }
        } finally {
          activePlayerKeys.delete(playerKey);
        }
      },
      markPlayerResultFailure(error, result) {
        const cause = (result === void 0 ? void 0 : resultFailureCauses.get(result)) ?? pendingResultFailureCause;
        if (cause === void 0)
          return error;
        failureCauses.retain(error, cause);
        return attachPlaybookFailureCause(error, cause);
      },
      takeGovernedPlayerOutput(result) {
        const settlement = governedPlayerSettlements.get(result);
        if (settlement !== void 0)
          governedPlayerSettlements.delete(result);
        return settlement;
      },
      recordGovernedPlayerOutput(result, output) {
        const reconstructed = reconstructedGovernedResults.get(result);
        if (reconstructed === void 0)
          return;
        reconstructedGovernedResults.delete(result);
        const persisted = persistedBoundaryReconciliation(reconstructed, effectLedgerMirror);
        if (persisted === void 0 || persisted.reconciliation.status !== "resolved" || !isDeepStrictEqual(persisted.reconciliation.output, output)) {
          unresolvedSemanticBoundaryIds.add(reconstructed.boundaryId);
          throw markFsmResultFailure(new Error(`${label} reconstructed governed output changed before FSM acceptance`));
        }
        reconstructedAcceptancePending = reconstructed;
      },
      async callJudge(purpose, stateId, prompt, signal) {
        return judgeQueue.add(async () => {
          const governedSemanticJudge = purpose === "player-output-adjudication" && stateId !== void 0 && outcomeAuthority.governedPlayerStates[stateId] !== void 0;
          signal.throwIfAborted();
          await drainEmissions();
          signal.throwIfAborted();
          const turnId = activeTurnId;
          const callId = `judge-${++judgeCallSequence}`;
          const identity = { purpose, ...stateIdentity(stateId) };
          const position = {
            ...turnId !== void 0 ? { turnId } : {},
            callId
          };
          await emitCallStarted("judge.call.started", "judge.call.finished", { ...identity, prompt }, position, signal);
          let reply;
          try {
            signal.throwIfAborted();
            reply = await requireHostPorts().callJudge(prompt, signal);
            signal.throwIfAborted();
          } catch (error) {
            if (!isAbortFailure(error, signal) && !governedSemanticJudge) {
              controlPlaneError ??= error;
            }
            await emitTrace("judge.call.finished", {
              ...identity,
              status: isAbortFailure(error, signal) ? "aborted" : "error",
              error: normalizeError(error)
            }, position);
            throw error;
          }
          if (typeof reply !== "string") {
            const error = new TypeError("judge reply must be a string");
            if (!governedSemanticJudge)
              controlPlaneError ??= error;
            await emitTrace("judge.call.finished", { ...identity, status: "error", error: normalizeError(error) }, position);
            throw error;
          }
          await emitTrace("judge.call.finished", { ...identity, status: "ok", reply }, position);
          signal.throwIfAborted();
          return reply;
        });
      },
      async callCaptain(input, prompt, signal, callOptions) {
        return judgeQueue.add(async () => {
          signal.throwIfAborted();
          await drainEmissions();
          signal.throwIfAborted();
          const turnId = activeTurnId;
          const callId = `captain-${++captainCallSequence}`;
          const visibility = callOptions?.visibility ?? "visible";
          const identity = {
            ...stateIdentity(input.stateId),
            sourceItem: input.sourceItem,
            visibility,
            // The visible workflow form owns its `resume: false` selection;
            // a hidden controller call's durable-conversation resume
            // selection is host-owned (DR-029), so its trace pair carries
            // no resume member and no token.
            ...visibility === "visible" ? { resume: false } : {},
            ...input.allowedTools === void 0 ? {} : { allowedTools: [...input.allowedTools] }
          };
          const position = {
            ...turnId !== void 0 ? { turnId } : {},
            callId
          };
          await emitCallStarted("captain.call.started", "captain.call.finished", { ...identity, prompt }, position, signal);
          let rawResult;
          try {
            signal.throwIfAborted();
            rawResult = await requireHostPorts().callCaptain(prompt, signal, {
              visibility,
              resume: false,
              ...input.allowedTools !== void 0 ? { allowedTools: input.allowedTools } : {}
            });
            signal.throwIfAborted();
          } catch (error) {
            if (!isAbortFailure(error, signal))
              controlPlaneError ??= error;
            await emitTrace("captain.call.finished", {
              ...identity,
              status: isAbortFailure(error, signal) ? "aborted" : "error",
              error: normalizeError(error)
            }, position);
            throw error;
          }
          let result;
          try {
            result = validateCaptainResult(rawResult);
          } catch (error) {
            controlPlaneError ??= error;
            await emitTrace("captain.call.finished", { ...identity, status: "error", error: normalizeError(error) }, position);
            throw error;
          }
          let resultFailure;
          let emptyOkRetry = false;
          if (result.status !== "ok") {
            resultFailure = markFsmResultFailure(new Error(result.error ?? `captainActor: callCaptain status "${result.status}"`));
          } else if (isEmptyFinalText(result.finalText)) {
            resultFailure = markFsmResultFailure(new Error("captainActor: callCaptain returned status=ok with no finalText"));
            emptyOkRetry = true;
          }
          try {
            await emitTrace("captain.call.finished", {
              ...identity,
              status: result.status,
              ...result.finalText !== void 0 ? { finalText: result.finalText } : {},
              ...result.error !== void 0 ? { error: normalizeError(result.error) } : resultFailure !== void 0 ? { error: normalizeError(resultFailure) } : {}
            }, position);
          } catch (error) {
            if (resultFailure !== void 0)
              throw resultFailure;
            throw error;
          }
          if (resultFailure !== void 0) {
            throw emptyOkRetry ? markEmptyOkRetryFailure(resultFailure) : resultFailure;
          }
          return result;
        });
      }
    };
    if (parallelProfile !== void 0) {
      const untrackedCallPlayer = boundary.callPlayer;
      const untrackedCallJudge = boundary.callJudge;
      boundary.callPlayer = (input, roleId, freshPrompt, signal) => trackBoundaryCall(untrackedCallPlayer(input, roleId, freshPrompt, signal));
      boundary.callJudge = (purpose, stateId, prompt, signal) => trackBoundaryCall(untrackedCallJudge(purpose, stateId, prompt, signal));
    }
    function playerActor(ports) {
      return createPlayerBridge({
        run: (input, signal, execute) => runJournalledStep("player", input, signal, execute),
        resolveRoleId: requireRoleId,
        validateInput: (input) => assertGovernedPlayerInput(outcomeAuthority, input, extractFields, label),
        composePlayerPrompt: composeBoundPlayerPrompt,
        adjudication,
        resumableStateIds,
        allowsCorrectiveReplay: acknowledgedBoundaryIsUnchanged
      }, ports, () => activeSignal, boundary, (error) => {
        if (activeSignal === void 0 || !isAbortFailure(error, activeSignal)) {
          controlPlaneError ??= error;
        }
      });
    }
    function captainActor() {
      return fromPromise(({ input, signal }) => runJournalledStep("captain", input, signal, async () => {
        const active = combineAbortSignals(signal, activeSignal);
        try {
          await drainEmissions();
          const prompt = composeCaptainPrompt(input);
          if (spec.captainStrategy !== void 0) {
            const output2 = await spec.captainStrategy({
              input,
              prompt,
              signal: active,
              options: boundOptions,
              session: requireSession(),
              callCaptain: (callPrompt, callOptions) => boundary.callCaptain(input, callPrompt, active, callOptions),
              isEmptyOkRetry: isEmptyOkRetryFailure,
              recoverableFailure: (error) => {
                markFsmResultFailure(error);
                return error;
              }
            });
            validateBossReplyOutput(input, output2, resumableStateIds);
            return output2;
          }
          let result;
          try {
            result = await boundary.callCaptain(input, prompt, active);
          } catch (error) {
            if (!isEmptyOkRetryFailure(error))
              throw error;
            result = await boundary.callCaptain(input, prompt, active);
          }
          const finalText = result.finalText ?? "";
          if (result.status !== "ok" || isEmptyFinalText(finalText)) {
            throw new Error("captainActor: boundary returned an unvalidated Captain result");
          }
          const judgePrompt = defaultBuildCaptainJudgePrompt(input, finalText);
          const raw = await boundary.callJudge("captain-output-adjudication", input.stateId, judgePrompt, active);
          const output = adjudicateCaptainOutput(extractFields, input, finalText, raw);
          validateBossReplyOutput(input, output, resumableStateIds);
          return output;
        } catch (error) {
          if (!isAbortFailure(error, active) && !isFsmResultFailure(error)) {
            controlPlaneError ??= error;
          }
          throw error;
        }
      }));
    }
    function scriptActor() {
      return fromPromise(({ input, signal }) => runJournalledStep("script", input, signal, async () => {
        await drainEmissions();
        const active = combineAbortSignals(signal, activeSignal);
        const guards = Object.keys(input.result);
        const okGuard = guards[0];
        const failedGuard = guards[1] ?? guards[0];
        const cwd = boundScriptCwd ?? process.cwd();
        const ports = runtimePorts ?? requireHostPorts();
        active.throwIfAborted();
        let child;
        let killTimer;
        const signalGroup = (sig) => {
          if (child?.pid !== void 0) {
            try {
              process.kill(-child.pid, sig);
            } catch {
            }
          }
        };
        let groupGonePromise;
        const awaitGroupGone = () => {
          const pid = child?.pid;
          if (pid === void 0)
            return Promise.resolve();
          groupGonePromise ??= (async () => {
            const teardownFailure = (message, cause) => {
              const failure = new ScriptProcessGroupTeardownError(pid, message, cause);
              controlPlaneError ??= failure;
              return failure;
            };
            const deadline = Date.now() + SCRIPT_ABORT_KILL_GRACE_MS;
            let lastProbeError;
            for (; ; ) {
              try {
                process.kill(-pid, 0);
              } catch (error) {
                if (isNoSuchProcess(error))
                  return;
                if (!isProcessPermissionDenied(error)) {
                  throw teardownFailure("the liveness probe failed", error);
                }
                lastProbeError = error;
              }
              if (Date.now() >= deadline) {
                throw teardownFailure(`the group remained signalable after ${SCRIPT_ABORT_KILL_GRACE_MS}ms`, lastProbeError);
              }
              await new Promise((tick) => setTimeout(tick, 5));
            }
          })();
          return groupGonePromise;
        };
        const onAbort = () => {
          signalGroup("SIGTERM");
          killTimer = setTimeout(() => signalGroup("SIGKILL"), SCRIPT_ABORT_KILL_GRACE_MS);
        };
        const settleIfAborted = async () => {
          if (!active.aborted)
            return;
          signalGroup("SIGKILL");
          await awaitGroupGone();
          active.throwIfAborted();
        };
        let invocationFailed = false;
        try {
          const exitStatus = await new Promise((resolve, reject) => {
            try {
              child = spawn("sh", ["-c", input.command], {
                cwd,
                stdio: "ignore",
                detached: true
              });
            } catch (error) {
              reject(error);
              return;
            }
            active.addEventListener("abort", onAbort, { once: true });
            child.on("error", (error) => {
              reject(error);
            });
            child.on("close", (code) => {
              if (active.aborted) {
                signalGroup("SIGKILL");
                void awaitGroupGone().then(() => reject(active.reason), reject);
                return;
              }
              resolve(typeof code === "number" ? code : 1);
            });
          });
          await settleIfAborted();
          await ports.emitStatus(`Executed script for ${input.stateId} (exit ${exitStatus}).`);
          await settleIfAborted();
          await ports.emitTelemetry({
            topic: "playbook.script",
            payload: {
              stateId: input.stateId,
              sourceItem: input.sourceItem,
              exitStatus
            }
          });
          await settleIfAborted();
          if (exitStatus === 0) {
            return { guard: okGuard, exitStatus: 0 };
          }
          return { guard: failedGuard, exitStatus };
        } catch (error) {
          invocationFailed = true;
          throw error;
        } finally {
          try {
            if (active.aborted) {
              signalGroup("SIGKILL");
              await awaitGroupGone();
              if (!invocationFailed)
                active.throwIfAborted();
            }
          } finally {
            active.removeEventListener("abort", onAbort);
            if (killTimer !== void 0)
              clearTimeout(killTimer);
          }
        }
      }));
    }
    const nestedBridge = createNestedPlaybookBridge({
      nextCallId: () => `playbook-${++playbookCallSequence}`,
      getBoundarySignal: () => activeSignal,
      callPlaybook: (request, signal) => {
        const call = requireHostPorts().callPlaybook(request, signal);
        return parallelProfile === void 0 ? call : trackBoundaryCall(Promise.resolve(call));
      },
      emitStarted: async (event, aborts) => {
        playbookCallTurnIds.set(event.callId, activeTurnId);
        if (hasGovernedPlayerStates) {
          playbookCallEffectPrefixes.set(event.callId, activeEffectLedgerPrefixSequence);
        }
        await emitTrace("playbook.call.started", {
          stateId: event.stateId,
          playbookId: event.playbookId,
          text: event.text
        }, {
          ...activeTurnId !== void 0 ? { turnId: activeTurnId } : {},
          callId: event.callId
        }, aborts);
      },
      emitFinished: async (event, aborts) => {
        const turnId = playbookCallTurnIds.get(event.callId);
        try {
          await emitTrace("playbook.call.finished", {
            stateId: event.stateId,
            playbookId: event.playbookId,
            text: event.text,
            result: event.result
          }, {
            ...turnId !== void 0 ? { turnId } : {},
            callId: event.callId
          }, aborts);
        } finally {
          playbookCallTurnIds.delete(event.callId);
          playbookCallEffectPrefixes.delete(event.callId);
        }
      },
      drain: drainEmissions,
      bindResumeSignal: (signal, aborts) => {
        activeSignal = signal;
        activeAborts = aborts ?? abortReasonClassifier(signal);
      },
      bindActorSettlement: (aborts) => {
        if (parallelProfile === void 0)
          actorSettlementAborts.length = 0;
        actorSettlementAborts.push(aborts);
      },
      onControlPlaneError: (error, aborts) => {
        if (!aborts?.isAbortReason(error) && !activeAborts?.isAbortReason(error)) {
          controlPlaneError ??= error;
        }
      },
      onBackgroundError: (error, aborts) => {
        if (!aborts?.isAbortReason(error))
          emissionFailure ??= { error };
      }
    });
    function tracePositionForActiveTurn() {
      return activeTurnId === void 0 ? {} : { turnId: activeTurnId };
    }
    function failedStateError(context) {
      const normalized = normalizeErrorFull(context.lastError);
      if (normalized === void 0 || normalized.cause !== void 0) {
        return normalized;
      }
      return {
        ...normalized,
        cause: failureCauses.causeOf(context.lastError) ?? runtimeDefectCause(normalized.message)
      };
    }
    function bindParkedFailureCause(context, event) {
      const kept = context.lastError;
      if (kept === void 0 || kept === null)
        return;
      if (failureCauses.causeOf(kept) !== void 0)
        return;
      const decided = failureCauses.causeOf(actorErrorOf2(event));
      if (decided !== void 0)
        failureCauses.retain(kept, decided);
    }
    function decidePlayerCallFailure(error, roleId, playerId, signal, cohortCancellation) {
      if (cohortCancellation?.aborted === true && Object.is(error, cohortCancellation.reason) && !activeAborts?.isAbortReason(error)) {
        return error;
      }
      const cause = isAbortFailure(error, signal) ? ABORTED_FAILURE_CAUSE : playerFailureCause({
        roleId,
        ...playerId === void 0 ? {} : { playerId },
        error
      });
      failureCauses.retain(error, cause);
      return attachPlaybookFailureCause(error, cause);
    }
    function completeFailedStatuses(statuses, state, context) {
      if (state.stateId !== "failed")
        return statuses;
      const lastError = failedStateError(context);
      if (lastError?.cause === void 0)
        return statuses;
      const cause = lastError.cause;
      return statuses.map((status) => {
        const data = status.data;
        if (data === null || typeof data !== "object" || Array.isArray(data)) {
          return status;
        }
        const recorded = data;
        const recordedError = recorded.lastError;
        if (recordedError === void 0 || recordedError === null || typeof recordedError !== "object" || Array.isArray(recordedError)) {
          return status;
        }
        return {
          ...status,
          data: snapshotJsonValue({ ...recorded, lastError: { ...recordedError, cause } }, "failed status data")
        };
      });
    }
    function structuredStateTelemetryPayload(previousState, state, event, context) {
      const payload = {
        from: previousState?.value ?? null,
        to: state.value,
        event: normalizeTransitionEvent(event) ?? null,
        previousState: previousState ?? null,
        state
      };
      if (parallelProfile === void 0) {
        const pendingBossQuestion = pendingBossQuestionForState(state, context);
        if (pendingBossQuestion !== void 0 && !hasUnresolvedReconciliation()) {
          payload.pendingBossQuestion = pendingBossQuestion;
        }
      } else if (!hasUnresolvedReconciliation()) {
        const pendingBossQuestions = pendingBossQuestionsFor(state, context);
        if (pendingBossQuestions.length > 0) {
          payload.pendingBossQuestions = pendingBossQuestions;
        }
      }
      if (state.stateId === "failed") {
        const lastError = failedStateError(context);
        if (lastError !== void 0)
          payload.lastError = lastError;
      }
      return snapshotJsonValue(payload, "FSM telemetry payload");
    }
    function enqueueTransitionEmission(payload, state, acceptedOutcomes, statuses, position, aborts) {
      const currentSession = requireSession();
      const transitionTrace = createTraceEvent("fsm.transition", payload, position);
      const acceptedOutcomeTraces = acceptedOutcomes.map((acceptedOutcome2) => createTraceEvent("outcome.accepted", acceptedOutcome2, position));
      const statusEmissions = statuses.map(({ message, data }) => ({
        message,
        data,
        trace: createTraceEvent("status.emitted", {
          message,
          ...data === void 0 ? {} : { data },
          state,
          ...stateIdentity(statusTraceStateId(state))
        }, position)
      }));
      void enqueueEmission(async () => {
        await currentSession.ports.emitTelemetry({
          topic: "playbook.trace",
          payload: transitionTrace
        });
        await currentSession.ports.emitTelemetry({
          topic: "playbook.fsm.state",
          payload
        });
        for (const acceptedOutcome2 of acceptedOutcomeTraces) {
          await currentSession.ports.emitTelemetry({
            topic: "playbook.trace",
            payload: acceptedOutcome2
          });
        }
        for (const status of statusEmissions) {
          await currentSession.ports.emitTelemetry({
            topic: "playbook.trace",
            payload: status.trace
          });
          await currentSession.ports.emitStatus(status.message, status.data);
        }
      }, aborts).catch(() => void 0);
    }
    function latchRuntimeError(error, aborts = activeAborts) {
      if (aborts?.isAbortReason(error))
        return;
      if (activeSignal === void 0)
        emissionFailure ??= { error };
      else
        controlPlaneError ??= error;
    }
    function consumeActorSettlementAborts(forSnapshot = false) {
      const aborts = actorSettlementAborts.shift() ?? actorSettlementErrorAborts;
      actorSettlementErrorAborts = void 0;
      if (forSnapshot && aborts !== void 0) {
        actorSettlementErrorAborts = aborts;
        queueMicrotask(() => {
          if (actorSettlementErrorAborts === aborts) {
            actorSettlementErrorAborts = void 0;
          }
        });
      }
      return aborts;
    }
    function stopActor() {
      if (!actor)
        return;
      suppressInspectionEmissions = true;
      acceptedOutcomeConsumer.reset();
      actor.stop();
    }
    function buildActor(ports, machineSnapshot) {
      priorState = void 0;
      acceptedOutcomeConsumer.reset();
      const actors = {};
      if (declaredActors.has("player"))
        actors.player = playerActor(ports);
      if (declaredActors.has("captain"))
        actors.captain = captainActor();
      if (declaredActors.has("script"))
        actors.script = scriptActor();
      if (declaredActors.has("playbook")) {
        actors.playbook = nestedBridge.actorLogic;
      }
      const provided = machine.provide({
        actors
      });
      let builtActor;
      builtActor = createActor(provided, {
        input: machineInput(boundOptions, requireSession()),
        // DR-014 §1: a restore rehydrates the persisted machine snapshot;
        // XState derives context/value from it and ignores `input` then.
        ...machineSnapshot === void 0 ? {} : { snapshot: machineSnapshot },
        inspect: (inspectionEvent) => {
          if (inspectionEvent.actorRef !== builtActor)
            return;
          if (suppressInspectionEmissions)
            return;
          if (inspectionEvent.type === "@xstate.action") {
            try {
              acceptedOutcomeConsumer.capture(inspectionEvent.action);
            } catch (error) {
              latchRuntimeError(error);
            }
            return;
          }
          if (inspectionEvent.type !== "@xstate.snapshot")
            return;
          const settlementAborts = consumeActorSettlementAborts(true);
          try {
            const snap = inspectionEvent.snapshot;
            const state = normalizePlaybookSnapshot(snap);
            if (state.stateId === void 0 && !(parallelProfile?.states.some(({ stateId }) => state.activeStateIds.includes(stateId)) ?? false)) {
              throw new Error(`${label} root snapshot must expose exactly one playbook state id`);
            }
            const previousState = priorState;
            acceptReconstructedGovernedDelivery(state);
            let acceptedOutcomes = [];
            try {
              acceptedOutcomes = acceptedOutcomeConsumer.confirm(previousState, state);
            } catch (error) {
              latchRuntimeError(error);
            }
            if (state.stateId === "failed") {
              if (previousState?.stateId !== "failed" && previousState?.stateId !== recoveryCheckpoint?.stateId) {
                recoveryCheckpoint = void 0;
              }
              if (previousState?.stateId !== "failed" || activeGovernedBoundarySeen) {
                latchFailedGovernedAttempt();
              }
            } else if (previousState?.stateId === "failed") {
              failedEffectBoundaryPrefix = void 0;
              failedGovernedAttemptId = void 0;
              failedGovernedAttemptUnknown = false;
            }
            const context = snap.context ?? {};
            if (state.stateId === "failed") {
              bindParkedFailureCause(context, inspectionEvent.event);
            }
            if (state.stateId === BOSS_REPLY_WAIT_STATE_ID && deferredReconciliationOperationId !== void 0) {
              priorState = state;
              return;
            }
            if (state.stateId === BOSS_REPLY_WAIT_STATE_ID && expectedBoundPendingQuestion !== void 0 && !deferInspectionEmissions) {
              validateBoundQuestionProjection();
            }
            const payload = structuredStateTelemetryPayload(previousState, state, inspectionEvent.event, context);
            const stateStatuses = completeFailedStatuses(bossRelevantStateIds !== void 0 && usesDefaultStatuses ? parallelStatusesFor(previousState, state, context) : statusesForState(state, context, inspectionEvent.event), state, context);
            const outcomeStatuses = usesDefaultStatuses ? acceptedOutcomes.map(({ acceptedOutcome: acceptedOutcome2 }) => ({
              message: `\u2192 ${acceptedOutcome2}`
            })) : [];
            const statuses = [...outcomeStatuses, ...stateStatuses];
            const publish = () => enqueueTransitionEmission(payload, state, acceptedOutcomes, statuses, tracePositionForActiveTurn(), settlementAborts);
            if (deferInspectionEmissions) {
              deferredInspectionEmissions.push(publish);
            } else {
              publish();
            }
            priorState = state;
          } catch (error) {
            acceptedOutcomeConsumer.reset();
            latchRuntimeError(error, settlementAborts);
          }
        }
      });
      builtActor.subscribe({
        error: (error) => latchRuntimeError(error, consumeActorSettlementAborts())
      });
      return builtActor;
    }
    function runResultFor(outcome, error) {
      const state = currentState();
      if (outcome === "quiescent" || outcome === "no-action") {
        return { outcome, state };
      }
      if (outcome === "unresolved-effect") {
        return { outcome, state };
      }
      if (outcome === "suspended") {
        const pendingCall = nestedBridge.getPendingCall();
        if (!pendingCall) {
          throw new Error("suspended runtime has no pending playbook call");
        }
        return { outcome, state, pendingCall };
      }
      if (outcome === "terminal") {
        const output = actor?.getSnapshot()?.output;
        const stateDescription = !hasUnresolvedReconciliation() ? stateDescriptionFor(state) : void 0;
        const terminal = hasUnresolvedReconciliation() || state.stateId === void 0 ? void 0 : terminalOutcomeFor(state.stateId, stateDescription);
        return {
          outcome,
          state,
          ...stateDescription === void 0 ? {} : { stateDescription },
          ...terminal === void 0 ? {} : { terminal },
          ...output === void 0 ? {} : {
            output: snapshotJsonValue(output, "terminal playbook output")
          }
        };
      }
      const failure = error ?? (outcome === "failed" ? actor?.getSnapshot()?.context?.lastError : outcome === "aborted" ? activeSignal?.reason : void 0);
      if (failure === void 0)
        return { outcome, state };
      const normalized = outcome === "failed" ? failedStateError({ lastError: failure }) : normalizeError(failure);
      return {
        outcome,
        state,
        ...normalized === void 0 ? {} : { error: normalized }
      };
    }
    function settledOutcome(signal) {
      if (nestedBridge.getPendingCall())
        return "suspended";
      const state = currentState();
      if (state.status === "error") {
        const actorError = actor?.getSnapshot()?.error;
        if (actorError !== void 0 && isAbortFailure(actorError, signal)) {
          return "aborted";
        }
        throw actorError ?? new Error(`${label} actor entered error status`);
      }
      if (state.status === "done")
        return "terminal";
      if (signal.aborted)
        return "aborted";
      if (state.stateId === "failed")
        return "failed";
      return "quiescent";
    }
    function settlementTracePayload(result) {
      return {
        ...result,
        ...stateIdentity(result.state.stateId)
      };
    }
    async function cleanupFailedStart(cause, options) {
      let finalState;
      if (options.emitDisposal && actor) {
        try {
          finalState = currentState();
        } catch {
        }
      }
      try {
        stopActor();
      } catch {
      }
      try {
        await nestedBridge.abortPending(cause);
      } catch {
      }
      try {
        await judgeQueue.onIdle();
        await drainEmissions();
      } catch {
      }
      if (options.emitDisposal) {
        try {
          await emitTrace("session.disposed", finalState === void 0 ? {} : {
            state: finalState,
            ...stateIdentity(finalState.stateId)
          });
          await drainEmissions();
        } catch {
        }
      }
      privateResumeTokens.clear();
      activePlayerKeys.clear();
      playbookCallTurnIds.clear();
      playbookCallEffectPrefixes.clear();
      activeEmissionCalls.clear();
      emissionQueue.clear();
      judgeQueue.clear();
      appliedReceipts.clear();
      pendingCohorts.clear();
      consumedCohortBoundaries.clear();
      activeBoundaryCalls.clear();
      cohortCompletionQueue.clear();
      actor = void 0;
      session = void 0;
      savedPorts = void 0;
      runtimePorts = void 0;
      activeSignal = void 0;
      activeAborts = void 0;
      actorSettlementAborts.length = 0;
      actorSettlementErrorAborts = void 0;
      activeAbortEmission = void 0;
      activeTurnId = void 0;
      activeGovernedBoundarySeen = false;
      activeGovernedAttemptId = void 0;
      activeEffectLedgerPrefixSequence = void 0;
      failedGovernedAttemptUnknown = false;
      failedEffectBoundaryPrefix = void 0;
      failedGovernedAttemptId = void 0;
      controlPlaneError = void 0;
      emissionFailure = void 0;
      priorState = void 0;
      retainedEffectSourceSessionId = void 0;
      retainedEffectReconciliation = void 0;
      retainedEffectReconciliationRequired = false;
      reconstructedGovernedDelivery = void 0;
      reconstructedGovernedPrefixSequence = void 0;
      reconstructedAcceptancePending = void 0;
      governedSettlementsByBoundaryId.clear();
      governedCompletionEvidenceByBoundaryId.clear();
      unresolvedSemanticBoundaryIds.clear();
      deferredReconciliationOperationId = void 0;
      deferredSettlementClosure = void 0;
      expectedBoundPendingQuestion = void 0;
      activeDeferredContinuation = void 0;
      deferInspectionEmissions = false;
      deferredInspectionEmissions = [];
      recoveryCheckpoint = void 0;
      suppressInspectionEmissions = false;
      initialized = false;
      traceSequence = 0;
      turnSequence = 0;
      judgeCallSequence = 0;
      playerCallSequence = 0;
      playbookCallSequence = 0;
      captainCallSequence = 0;
      applyCallSequence = 0;
    }
    function snapshotCan(snapshot, event) {
      const can2 = snapshot?.can;
      return typeof can2 === "function" && can2.call(snapshot, event) === true;
    }
    function retryActionFor(stateId) {
      if (stateId !== "failed" || !recoveryCheckpoint)
        return void 0;
      const description = stateDescriptions.get(recoveryCheckpoint.stateId);
      const savedResult = recoveryCheckpoint.result !== void 0;
      const safe = savedResult ? !hasUnresolvedReconciliation() && currentEffectLedger().boundaries.slice(recoveryCheckpoint.boundaryPrefix).every((boundary2) => runtimeBoundaryIsOwned(boundary2) && boundary2.sourceStateId === recoveryCheckpoint.stateId) : stepReplayIsSafe();
      if (description === void 0 || !safe)
        return void 0;
      const entry2 = spec.entryEvent;
      const target = entry2 && firstTransitionTarget(machine, stateId, entry2.type);
      return {
        action: {
          id: target === recoveryCheckpoint.stateId ? `retry:${entry2.type}` : "retry:step",
          label: `${savedResult ? "Continue from saved result" : "Retry"}: ${description}`,
          standing: "ready"
        },
        retryStep: true
      };
    }
    function reconciliationStanding(deferredRestoreOperationId) {
      if (deferredRestoreOperationId !== void 0)
        return { standing: "ready" };
      const current = effectLedgerMirror;
      const envelopes = projectUnresolvedEffectEnvelopes(current);
      if (envelopes.length === 0)
        return { standing: "ready" };
      const boundaryIds = envelopes.flatMap((envelope) => envelope.kind === "boundary" ? [envelope.boundaryId] : current.logicalOperations.find(({ operationId }) => operationId === envelope.operationId)?.boundaryIds ?? []);
      if (boundaryIds.length === 0)
        return { standing: "ready" };
      const complete = boundaryIds.every((boundaryId) => current.boundaries.find((candidate) => candidate.boundaryId === boundaryId)?.physicalReceipt !== void 0);
      return complete ? { standing: "no-op", reason: "receipt-complete" } : { standing: "ready" };
    }
    function deriveControlActions(snapshot) {
      let state;
      try {
        state = normalizePlaybookSnapshot(snapshot, {
          pendingCall: nestedBridge.getPendingCall()
        });
      } catch {
        return [];
      }
      if (state.status !== "active" || !state.quiescent || nestedBridge.getPendingCall()) {
        return [];
      }
      const derived = [];
      const repairable = state.stateId === "failed" ? repairableReadOnlyBoundary() : void 0;
      if (repairable !== void 0)
        derived.push({
          action: { id: "retry:restored-step", label: "Restore the repository and retry the read-only step", standing: "ready" },
          retryStep: true,
          restoreReadOnly: repairable
        });
      const judgment = state.stateId === "failed" ? recoverableJudgment() : void 0;
      if (judgment !== void 0)
        derived.push({
          action: { id: "retry:adjudication", label: "Retry assessment of the saved result", standing: "ready" },
          retryJudgment: judgment
        });
      if (judgment !== void 0 && !hasUnresolvedReconciliation())
        return derived;
      if (hasUnresolvedReconciliation()) {
        const operation = deferredReconciliationOperationId === void 0 ? void 0 : effectLedgerMirror.logicalOperations.find(({ operationId }) => operationId === deferredReconciliationOperationId);
        const deferredRestoreOperationId = operation?.checkpointRestorationEligible === true ? operation.operationId : void 0;
        derived.push({
          action: {
            id: UNRESOLVED_EFFECT_RECONCILIATION_ACTION_ID,
            label: "Retry unresolved effect reconciliation",
            ...reconciliationStanding(deferredRestoreOperationId)
          },
          unresolvedEffectAction: "reconcile",
          ...deferredRestoreOperationId === void 0 ? {} : { deferredRestoreOperationId }
        }, {
          action: {
            id: UNRESOLVED_EFFECT_ABANDONMENT_ACTION_ID,
            label: "Abandon unresolved workflow attempt",
            // DR-063 §3: abandonment always changes the session's standing.
            standing: "ready"
          },
          unresolvedEffectAction: "abandon"
        });
        return derived;
      }
      const retry = retryActionFor(state.stateId);
      if (retry !== void 0)
        derived.push(retry);
      if (state.stateId === "failed" && !failedAttemptAllowsReplay()) {
        return derived;
      }
      for (const targetId of [...resumableStateIds].sort()) {
        const event = { type: JUMP_EVENT_TYPE, targetId };
        if (!snapshotCan(snapshot, event))
          continue;
        const description = stateDescriptions.get(targetId);
        if (description === void 0)
          continue;
        derived.push({
          action: {
            id: `jump:${targetId}`,
            label: `Resume from: ${description}`,
            // DR-063 §3: a jump always moves the machine.
            standing: "ready"
          },
          event
        });
      }
      return derived;
    }
    function projectControlContext(context) {
      const projected = {};
      for (const key of controlContextFields) {
        const value = context[key];
        if (value === void 0)
          continue;
        try {
          projected[key] = snapshotJsonValue(value instanceof Error ? normalizeError(value) : value, `control context ${key}`);
        } catch {
        }
      }
      return Object.keys(projected).length === 0 ? void 0 : projected;
    }
    function stateDescriptionFor(state) {
      const keys = [
        ...state.stateId === void 0 ? [] : [state.stateId],
        ...typeof state.value === "string" ? [state.value] : [],
        ...isPlainObject(state.value) ? Object.keys(state.value) : [],
        ...state.activeStateIds
      ];
      for (const key of keys) {
        const description = stateDescriptions.get(key);
        if (description !== void 0)
          return description;
      }
      return void 0;
    }
    function terminalOutcomeFor(stateId, description) {
      const kind = terminalKinds.get(stateId);
      if (kind === void 0)
        return void 0;
      return {
        stateId,
        kind,
        ...description === void 0 ? {} : { description }
      };
    }
    function receiptTracePayload(receipt) {
      return {
        disposition: receipt.disposition,
        ...receipt.disposition === "rejected" ? { reason: receipt.reason } : {},
        ...receipt.disposition === "failed" ? { error: receipt.error } : {},
        ...receipt.disposition === "executed" ? { run: receipt.run } : {}
      };
    }
    async function rehydrateSnapshot(kind, nextSession, snapshot, context) {
      if (initialized || disposed || disposalPromise !== void 0) {
        throw new Error(`createPlaybookRuntime.${kind}: already initialized`);
      }
      const boundSession = bindSession(nextSession);
      const boundSnapshot = assertPlaybookRuntimeSnapshot(snapshot, boundSession.playbookId, { allowSuspendedCall: true });
      validateRecoveryCheckpoint(boundSnapshot.recoveryCheckpoint);
      if (kind === "adopt" && effectLedgerCapability !== void 0 && (boundSnapshot.retainedEffectReconciliation?.checkpoint ?? boundSnapshot.effectLedger).boundaries.some(({ physicalReceipt }) => physicalReceipt === void 0)) {
        throw new TypeError("retained runtime checkpoint contains an incomplete physical boundary");
      }
      const hostEffectLedger = currentEffectLedger();
      if (kind === "restore" && !isDeepStrictEqual(boundSnapshot.effectLedger, hostEffectLedger)) {
        throw new TypeError("runtime snapshot effectLedger does not equal the current host mirror");
      }
      if (kind === "adopt" && !isPlaybookEffectLedgerMonotonicExtension(boundSnapshot.effectLedger, hostEffectLedger)) {
        throw new TypeError("retained runtime snapshot effectLedger is not a monotonic prefix of the current host mirror");
      }
      effectLedgerMirror = hostEffectLedger;
      if (declaredActors.has("captain") && boundSnapshot.sequences.captainCall === void 0) {
        throw new TypeError("runtime snapshot sequences.captainCall is required for a direct-Captain artifact");
      }
      const adoptionContext = kind === "adopt" ? snapshotAdoptionContext(context, boundSession, boundSnapshot) : void 0;
      if (adoptionContext !== void 0 && effectLedgerCapability !== void 0 && !RETAINED_EFFECT_SESSION_ID_PATTERN.test(adoptionContext.sourceSessionId)) {
        throw new TypeError("schema-3 retained adoption sourceSessionId must be a canonical UUID");
      }
      const retainedReconciliation = boundSnapshot.retainedEffectReconciliation ?? (adoptionContext !== void 0 && effectLedgerCapability !== void 0 && !retainedAdoptionCheckpointIsSafe(boundSnapshot.effectLedger, hostEffectLedger) ? Object.freeze({
        sourceSessionId: boundSnapshot.retainedEffectSourceSessionId ?? adoptionContext.sourceSessionId,
        checkpoint: boundSnapshot.effectLedger
      }) : void 0);
      retainedEffectSourceSessionId = boundSnapshot.retainedEffectSourceSessionId ?? boundSnapshot.retainedEffectReconciliation?.sourceSessionId ?? (adoptionContext !== void 0 && effectLedgerCapability !== void 0 ? adoptionContext.sourceSessionId : void 0);
      bindRetainedEffectReconciliation(retainedReconciliation, hostEffectLedger);
      const sourceSuspendedCall = boundSnapshot.suspendedCall;
      const suspendedCall = adoptionContext !== void 0 && sourceSuspendedCall !== void 0 ? Object.freeze({
        callId: "playbook-1",
        stateId: sourceSuspendedCall.stateId,
        playbookId: sourceSuspendedCall.playbookId,
        text: sourceSuspendedCall.text,
        childSessionId: adoptionContext.targetChildSessionId
      }) : sourceSuspendedCall;
      let priorExternalPlayerTokens;
      let externalStoreRestoreAttempted = false;
      let adoptionStartAttempted = false;
      initialized = true;
      let finishInitialization;
      const initialization = new Promise((resolve) => {
        finishInitialization = resolve;
      });
      initInFlight = initialization;
      const initTask = (async () => {
        session = boundSession;
        recoveryCheckpoint = boundSnapshot.recoveryCheckpoint;
        syncDeferredReconciliationOverlay();
        refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
        prepareReconstructedGovernedDelivery(boundSnapshot.state, effectLedgerMirror);
        savedPorts = boundSession.ports;
        runtimePorts = createRuntimePorts(boundSession.ports);
        if (adoptionContext === void 0) {
          traceSequence = boundSnapshot.sequences.trace;
          turnSequence = boundSnapshot.sequences.turn;
          judgeCallSequence = boundSnapshot.sequences.judgeCall;
          playerCallSequence = boundSnapshot.sequences.playerCall;
          playbookCallSequence = boundSnapshot.sequences.playbookCall;
          captainCallSequence = boundSnapshot.sequences.captainCall ?? 0;
          applyCallSequence = boundSnapshot.sequences.trace;
        } else {
          traceSequence = 0;
          turnSequence = 0;
          judgeCallSequence = 0;
          playerCallSequence = 0;
          playbookCallSequence = suspendedCall === void 0 ? 0 : 1;
          captainCallSequence = 0;
          applyCallSequence = 0;
        }
        if (kind === "restore") {
          if (boundSession.playerSessions) {
            priorExternalPlayerTokens = snapshotRoleResumeTokens();
            externalStoreRestoreAttempted = true;
          }
          restoreRoleResumeTokens(boundSnapshot.roleResumeTokens);
        }
        nestedBridge.prepareRestore(suspendedCall);
        if (suspendedCall !== void 0) {
          playbookCallTurnIds.set(suspendedCall.callId, suspendedCall.turnId);
          if (hasGovernedPlayerStates) {
            const savedPrefix = kind === "restore" ? suspendedCall.effectBoundaryPrefixSequence : void 0;
            playbookCallEffectPrefixes.set(suspendedCall.callId, savedPrefix === null ? void 0 : savedPrefix ?? 0);
          }
        }
        suppressInspectionEmissions = true;
        actor = buildActor(runtimePorts, boundSnapshot.machine);
        if (adoptionContext !== void 0) {
          adoptionStartAttempted = true;
          await emitTrace("session.started", {
            state: boundSnapshot.state,
            ...stateIdentity(boundSnapshot.state.stateId),
            adoption: {
              sourceSessionId: adoptionContext.sourceSessionId,
              sourceGenerationId: adoptionContext.sourceGenerationId,
              ...sourceSuspendedCall === void 0 || suspendedCall === void 0 ? {} : {
                sourceCallId: sourceSuspendedCall.callId,
                sourceChildSessionId: sourceSuspendedCall.childSessionId,
                targetCallId: suspendedCall.callId,
                targetChildSessionId: suspendedCall.childSessionId
              }
            }
          }, suspendedCall === void 0 ? {} : { callId: suspendedCall.callId });
        }
        actor.start();
        {
          const startupFailure = emissionFailure;
          if (controlPlaneError !== void 0 || startupFailure !== void 0) {
            const startupError = controlPlaneError !== void 0 ? controlPlaneError : startupFailure.error;
            controlPlaneError = void 0;
            if (emissionFailure === startupFailure) {
              emissionFailure = void 0;
            }
            throw startupError;
          }
        }
        const restoredState = normalizePlaybookSnapshot(actor.getSnapshot(), suspendedCall === void 0 ? {} : {
          pendingCall: {
            callId: suspendedCall.callId,
            playbookId: suspendedCall.playbookId,
            childSessionId: suspendedCall.childSessionId
          }
        });
        if (restoredState.status !== "active") {
          throw new Error(`createPlaybookRuntime.${kind}: restored actor status is ${restoredState.status}, expected active`);
        }
        if (stableJson(restoredState, "restored runtime state") !== stableJson(boundSnapshot.state, "runtime snapshot state")) {
          throw new Error(`createPlaybookRuntime.${kind}: restored actor state does not match snapshot state`);
        }
        const restoredFailedEffectAttempt = restoredState.stateId === "failed" && kind === "restore" ? boundSnapshot.failedEffectAttempt : void 0;
        failedEffectBoundaryPrefix = restoredFailedEffectAttempt?.boundaryPrefix;
        failedGovernedAttemptId = typeof restoredFailedEffectAttempt?.attemptId === "string" ? restoredFailedEffectAttempt.attemptId : void 0;
        activeGovernedBoundarySeen = false;
        activeGovernedAttemptId = void 0;
        activeEffectLedgerPrefixSequence = void 0;
        failedGovernedAttemptUnknown = restoredState.stateId === "failed" && kind === "restore" && hasGovernedPlayerStates && restoredFailedEffectAttempt === void 0;
        priorState = restoredState;
        await drainEmissions();
        suppressInspectionEmissions = false;
        acceptReconstructedGovernedDelivery(currentState());
        nestedBridge.confirmRestore();
      })();
      try {
        await initTask;
      } catch (error) {
        let failure = error;
        if (externalStoreRestoreAttempted && priorExternalPlayerTokens !== void 0) {
          try {
            boundSession.playerSessions.restore(priorExternalPlayerTokens);
          } catch (rollbackError) {
            failure = new AggregateError([error, rollbackError], `createPlaybookRuntime.${kind} and player continuation rollback failed`);
          }
        }
        await cleanupFailedStart(failure, {
          emitDisposal: adoptionStartAttempted
        });
        throw failure;
      } finally {
        finishInitialization();
        if (initInFlight === initialization)
          initInFlight = void 0;
      }
    }
    function validateBoundQuestionProjection() {
      const expected = expectedBoundPendingQuestion;
      if (expected === void 0)
        return;
      const snapshot = actor?.getSnapshot();
      const state = snapshot === void 0 ? void 0 : normalizePlaybookSnapshot(snapshot);
      const context = snapshot?.context ?? {};
      const actual = state?.stateId === BOSS_REPLY_WAIT_STATE_ID ? singlePendingBossQuestion(state, context) : void 0;
      if (!isDeepStrictEqual(actual, expected)) {
        throw new Error(`${label} deferred FSM question does not equal its durable binding`);
      }
      const operation = currentBoundDeferredOperation(expected);
      if (operation === void 0) {
        throw new Error(`${label} deferred FSM question has no exact durable operation`);
      }
      expectedBoundPendingQuestion = void 0;
    }
    function settleDeferredInspectionBuffer(publish) {
      const buffered = deferredInspectionEmissions;
      deferredInspectionEmissions = [];
      deferInspectionEmissions = false;
      if (publish) {
        for (const emission of buffered)
          emission();
      }
    }
    async function continueBoundDeferredOperation(operation, event, signal, turnId, classificationLine, onAccepted) {
      if (repositoryCapability === void 0) {
        throw new Error(`${label} deferred continuation requires repository.runDeferred`);
      }
      const effectBoundary2 = continuationBoundarySeed(operation, turnId);
      const boundPlayerId = resolvedPlayerId(effectBoundary2.roleId);
      const validateBinding = (value) => {
        if (!isPlainObject(value) || Object.keys(value).length !== 2 || value.v !== 1 || value.playerId !== (boundPlayerId ?? effectBoundary2.roleId)) {
          throw new TypeError(`${label} bound deferred player continuation is invalid`);
        }
      };
      validateBinding(operation.playerContinuation);
      const continuation = {
        operationId: operation.operationId,
        effectBoundary: effectBoundary2,
        rawPlayerSettled: deferredValue(),
        delivery: deferredValue()
      };
      activeDeferredContinuation = continuation;
      deferInspectionEmissions = true;
      let continuationStarted = false;
      let deliverySettled = false;
      deferredInspectionEmissions = classificationLine === void 0 ? [] : [() => void runtimePorts.emitStatus(classificationLine)];
      try {
        const result = await repositoryCapability.runDeferred({
          mode: "continue",
          signal,
          operationId: operation.operationId,
          effectBoundary: effectBoundary2,
          operation: async (context) => {
            const { playerContinuation } = context ?? {};
            validateBinding(playerContinuation);
            continuation.baseline = context?.baseline;
            continuation.playerContinuation = selectPlayerResume(effectBoundary2.roleId, boundPlayerId);
            continuationStarted = true;
            onAccepted?.();
            actor.send(event);
            settleDeferredInspectionBuffer(true);
            await continuation.rawPlayerSettled.promise;
            return null;
          },
          completeEffectBoundary: deferredContinuationCompletionEvidence
        });
        effectLedgerMirror = assertPlaybookEffectLedger(result.effectLedger, `${label} deferred continuation effect ledger`);
        refreshRetainedEffectReconciliation(effectLedgerMirror);
        syncDeferredReconciliationOverlay();
        refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
        if (result.status !== "continued") {
          if (continuationStarted) {
            deliverySettled = true;
            continuation.delivery.reject(markFsmResultFailure(new Error(`${label} deferred continuation remains unresolved`)));
            await waitForPlaybookQuiescence(actor, {
              pendingCalls: nestedBridge
            });
            if (controlPlaneError !== void 0)
              throw controlPlaneError;
          }
          expectedBoundPendingQuestion = void 0;
          settleDeferredInspectionBuffer(false);
          return "unresolved";
        }
        const completed = effectLedgerMirror.boundaries.find(({ boundaryId }) => boundaryId === effectBoundary2.boundaryId);
        if (completed?.physicalReceipt === void 0 || !isDeepStrictEqual(completed.physicalReceipt, result.receipt)) {
          throw new TypeError(`${label} deferred continuation did not acknowledge its physical boundary`);
        }
        recordActiveGovernedAttempt(completed);
        let settlement = governedSettlementsByBoundaryId.get(effectBoundary2.boundaryId);
        if (settlement === void 0 && continuation.result?.status === "ok" && !isEmptyFinalText(continuation.result.finalText)) {
          settlement = unresolvedGovernedSettlement("host omitted governed semantic settlement");
        }
        assertAcknowledgedGovernedEvidence(completed, settlement, effectLedgerMirror);
        governedSettlementsByBoundaryId.delete(effectBoundary2.boundaryId);
        governedCompletionEvidenceByBoundaryId.delete(effectBoundary2.boundaryId);
        if (settlement?.status === "resolved" && settlement.output.guard === "needsBossReply" && result.deferredStatus !== "bound") {
          settlement = unresolvedGovernedSettlement("deferred question did not receive an eligible durable binding");
        }
        if (settlement?.status === "unresolved") {
          unresolvedSemanticBoundaryIds.add(effectBoundary2.boundaryId);
        } else if (settlement?.status === "resolved") {
          unresolvedSemanticBoundaryIds.delete(effectBoundary2.boundaryId);
        }
        if (result.logicalReceipt !== void 0) {
          const completedOperation = effectLedgerMirror.logicalOperations.find(({ operationId }) => operationId === operation.operationId);
          if (completedOperation?.logicalReceipt === void 0 || !isDeepStrictEqual(completedOperation.logicalReceipt, result.logicalReceipt)) {
            throw new TypeError(`${label} deferred continuation did not acknowledge its cumulative receipt`);
          }
        }
        if (settlement?.status === "resolved" && settlement.output.guard === "needsBossReply") {
          if (result.deferredStatus !== "bound" && result.deferredStatus !== "unresolved") {
            throw new TypeError(`${label} repeated deferred settlement omitted its durable binding status`);
          }
        } else if (settlement?.status === "resolved" && result.logicalReceipt === void 0) {
          throw new TypeError(`${label} final deferred settlement omitted its cumulative receipt`);
        }
        if (continuation.callError !== void 0) {
          deliverySettled = true;
          continuation.delivery.reject(continuation.callError);
        } else if (continuation.result === void 0) {
          deliverySettled = true;
          continuation.delivery.reject(markFsmResultFailure(new Error(`${label} deferred player returned no result`)));
        } else {
          if (settlement !== void 0) {
            governedPlayerSettlements.set(continuation.result, settlement);
          }
          activeDeferredContinuation = void 0;
          deliverySettled = true;
          continuation.delivery.resolve(continuation.result);
        }
        await waitForPlaybookQuiescence(actor, {
          pendingCalls: nestedBridge
        });
        if (controlPlaneError !== void 0)
          throw controlPlaneError;
        if (!hasUnresolvedReconciliation()) {
          validateBoundQuestionProjection();
          settleDeferredInspectionBuffer(true);
        } else {
          expectedBoundPendingQuestion = void 0;
          settleDeferredInspectionBuffer(false);
        }
        return "continued";
      } catch (error) {
        let failure = error;
        governedSettlementsByBoundaryId.delete(effectBoundary2.boundaryId);
        governedCompletionEvidenceByBoundaryId.delete(effectBoundary2.boundaryId);
        if (continuationStarted && !deliverySettled) {
          deliverySettled = true;
          continuation.delivery.reject(error);
          try {
            await waitForPlaybookQuiescence(actor, {
              pendingCalls: nestedBridge
            });
          } catch (drainError) {
            failure = new AggregateError([error, drainError], `${label} deferred continuation rejection and actor drain both failed`);
          }
        }
        if (continuationStarted) {
          closeAfterIndeterminateDeferredSettlement(operation.operationId, failure);
        }
        settleDeferredInspectionBuffer(false);
        throw failure;
      } finally {
        activeDeferredContinuation = void 0;
      }
    }
    function isExactDeferredBossReply(snapshot, event, pending) {
      const candidate = event;
      return candidate.type === "BOSS_REPLY" && (candidate.questionId === void 0 || candidate.questionId === pending.questionId) && typeof candidate.answer === "string" && candidate.answer.trim().length > 0 && snapshotCan(snapshot, event);
    }
    async function parkBoundDeferredOperation(operationId, signal) {
      if (repositoryCapability === void 0) {
        throw new Error(`${label} deferred parking requires repository.runDeferred`);
      }
      const parked = await repositoryCapability.runDeferred({
        mode: "park",
        signal,
        operationId
      });
      if (parked.status !== "parked") {
        throw new TypeError(`${label} repository refused to park its deferred operation`);
      }
      effectLedgerMirror = assertPlaybookEffectLedger(parked.effectLedger, `${label} parked deferred effect ledger`);
      refreshRetainedEffectReconciliation(effectLedgerMirror);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      if (deferredReconciliationOperationId !== operationId) {
        throw new TypeError(`${label} parked deferred operation is not structurally unresolved`);
      }
    }
    async function restoreBoundDeferredOperation(operationId, signal) {
      if (repositoryCapability === void 0) {
        throw new Error(`${label} deferred restoration requires repository.runDeferred`);
      }
      const restored = await repositoryCapability.runDeferred({
        mode: "restore",
        signal,
        operationId
      });
      if (restored.status === "parked") {
        throw new TypeError(`${label} repository returned a park result for deferred restoration`);
      }
      effectLedgerMirror = assertPlaybookEffectLedger(restored.effectLedger, `${label} restored deferred effect ledger`);
      refreshRetainedEffectReconciliation(effectLedgerMirror);
      syncDeferredReconciliationOverlay();
      refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
      if (restored.status === "restored") {
        if (deferredReconciliationOperationId !== void 0) {
          throw new TypeError(`${label} restored deferred operation remained unresolved`);
        }
        const snapshot = actor.getSnapshot();
        const state = normalizePlaybookSnapshot(snapshot);
        const context = snapshot.context ?? {};
        const pending = singlePendingBossQuestion(state, context);
        if (pending === void 0 || currentBoundDeferredOperation(pending)?.operationId !== operationId) {
          throw new TypeError(`${label} restored deferred wait does not equal its FSM question`);
        }
      } else if (deferredReconciliationOperationId !== operationId) {
        throw new TypeError(`${label} unresolved deferred restoration lost its operation identity`);
      }
      return restored.status;
    }
    const runtime = {
      ...retainedGenerationMetadata === void 0 ? {} : { retainedGenerationMetadata },
      async init(nextSession) {
        if (initialized || disposed || disposalPromise !== void 0) {
          throw new Error("createPlaybookRuntime.init: already initialized");
        }
        const boundSession = bindSession(nextSession);
        initialized = true;
        let finishInitialization;
        const initialization = new Promise((resolve) => {
          finishInitialization = resolve;
        });
        initInFlight = initialization;
        const initTask = (async () => {
          session = boundSession;
          syncDeferredReconciliationOverlay();
          refreshUnresolvedSemanticReconciliation(effectLedgerMirror);
          savedPorts = boundSession.ports;
          runtimePorts = createRuntimePorts(boundSession.ports);
          suppressInspectionEmissions = false;
          actor = buildActor(runtimePorts);
          await emitTrace("session.started", stateTracePayload());
          actor.start();
          await drainEmissions();
        })();
        try {
          await initTask;
        } catch (error) {
          await cleanupFailedStart(error, { emitDisposal: true });
          throw error;
        } finally {
          finishInitialization();
          if (initInFlight === initialization)
            initInFlight = void 0;
        }
      },
      // DR-014 §1 / DR-031 §5 / PBRT-45: JSON-safe capture of a parked
      // session, including one already-started suspended nested call.
      // Defined only at a safe capture point — initialized, not disposing
      // or disposed, no active public boundary, and the actor quiescent with
      // status `active`.
      exportSnapshot: (checkpoint) => exportRuntimeSnapshot(checkpoint?.child ? { child: checkpoint.child } : void 0),
      // DR-014 §1 / PBRT-45: alternative to `init` that rehydrates an
      // exported snapshot under the same immutable session identity.
      // Emits no `session.started`, transition trace, or human status —
      // the session already started; the next public boundary continues
      // the contiguous trace sequence.
      async restore(nextSession, snapshot) {
        await rehydrateSnapshot("restore", nextSession, snapshot);
      },
      // DR-038 §§1,5 / PBRT-61/PBRT-65: adoption is restore under a fresh
      // engagement identity and counter lineage, exposed separately so a
      // capability-less runtime can omit it. Runtime-visible preflight
      // mismatches reject before effects; after preflight the new
      // session.started boundary owns failed-start cleanup just like init.
      // DR-067 §2: retained-snapshot adoption stays in the flat domain, so a
      // machine that declares a parallel state omits the member.
      ...parallelProfile === void 0 ? {
        async adopt(nextSession, snapshot, context) {
          await rehydrateSnapshot("adopt", nextSession, snapshot, context);
        }
      } : {},
      // DR-029 / PBRT-52: side-effect-free control view over the live
      // snapshot, valid at parked quiescence outside an active boundary.
      // The view is detached and frozen; producing it emits nothing and
      // moves nothing.
      describe() {
        if (disposed || disposalPromise !== void 0) {
          throw new Error("createPlaybookRuntime.describe: runtime is disposing or disposed");
        }
        if (!actor || !savedPorts) {
          throw new Error("createPlaybookRuntime.describe: init must be called first");
        }
        if (activeSignal !== void 0) {
          throw new Error("createPlaybookRuntime.describe: another runtime turn is active");
        }
        assertDeferredSettlementOpen("describe");
        refreshRetainedEffectFenceFromHost();
        const snapshot = actor.getSnapshot();
        const state = currentState();
        const context = snapshot.context ?? {};
        const pendingQuestions = !hasUnresolvedReconciliation() ? pendingBossQuestionsFor(state, context) : [];
        const lastError = state.stateId === "failed" ? failedStateError(context) : normalizeErrorFull(context.lastError);
        const projectedContext = projectControlContext(context);
        const stateDescription = !hasUnresolvedReconciliation() ? stateDescriptionFor(state) : void 0;
        const actions = deriveControlActions(snapshot).map(({ action }) => action);
        const retry = actions.find(({ id, standing }) => id.startsWith("retry:") && (standing ?? "ready") === "ready");
        const stoppedBoundary = recoveryCheckpoint === void 0 ? void 0 : currentEffectLedger().boundaries.slice(recoveryCheckpoint.boundaryPrefix).filter((boundary2) => runtimeBoundaryIsOwned(boundary2) && boundary2.sourceStateId === recoveryCheckpoint.stateId).at(-1);
        const recovery = recoveryCheckpoint === void 0 || pendingQuestions.length === 0 && retry === void 0 ? void 0 : {
          prompt: recoveryCheckpoint.prompt,
          ...stoppedBoundary === void 0 ? {} : { evidence: snapshotJsonValue({
            declaredResults: stoppedBoundary.sourceOutcomeSchema,
            ...stoppedBoundary.finalText === void 0 ? {} : { savedPlayerText: stoppedBoundary.finalText },
            ...stoppedBoundary.semanticCandidate === void 0 ? {} : { selectedResult: stoppedBoundary.semanticCandidate },
            ...stoppedBoundary.physicalReceipt === void 0 ? {} : { repositoryReceipt: stoppedBoundary.physicalReceipt }
          }) },
          ...repairableReadOnlyBoundary() === void 0 ? {} : {
            preparation: `This read-only step changed the repository. Restore its exact original HEAD and visible files before retrying; do not accept its saved result. Preserve user work. You may put generated outputs aside and prevent their return using local environment or ignore settings. Original observation: ${JSON.stringify(repairableReadOnlyBoundary().baseline)}. Observed after the failed step: ${JSON.stringify(repairableReadOnlyBoundary().after)}.`
          },
          ...stateDescriptions.get(recoveryCheckpoint.stateId) === void 0 ? {} : { description: stateDescriptions.get(recoveryCheckpoint.stateId) },
          continuation: pendingQuestions.length === 0 ? { kind: "runtime", actionId: retry.id } : { kind: "reply" }
        };
        return deepFreeze({
          state,
          ...stateDescription === void 0 ? {} : { stateDescription },
          ...projectedContext !== void 0 ? { context: projectedContext } : {},
          pendingQuestions: pendingQuestions.map((pending) => ({
            questionId: pending.questionId,
            asker: pending.asker,
            question: pending.question,
            sourceItem: pending.sourceItem
          })),
          ...lastError !== void 0 ? { lastError } : {},
          actions,
          ...recovery === void 0 ? {} : { recovery }
        });
      },
      // DR-029 / PBRT-52: revalidate the named action against the live
      // state and execute it at most once per idempotency key. The receipt
      // discriminates rejected-before-any-effect from executed and from
      // failed-after-effects-may-exist; a repeated key returns the recorded
      // receipt without re-execution. A rejection settles before acceptance,
      // so — like a key whose call threw before reaching acceptance — it
      // records nothing and the key may execute later, once the action is
      // advertised.
      async apply(input) {
        if (input === null || typeof input !== "object") {
          throw new TypeError("createPlaybookRuntime.apply: input must be an object");
        }
        assertDeferredSettlementOpen("apply");
        const { actionId, key, signal } = input;
        if (typeof actionId !== "string" || actionId.length === 0) {
          throw new TypeError("createPlaybookRuntime.apply: actionId must be a non-empty string");
        }
        if (typeof key !== "string" || key.length === 0) {
          throw new TypeError("createPlaybookRuntime.apply: key must be a non-empty string");
        }
        if (!(signal instanceof AbortSignal)) {
          throw new TypeError("createPlaybookRuntime.apply: signal must be an AbortSignal");
        }
        if (disposed || disposalPromise !== void 0) {
          throw new Error("createPlaybookRuntime.apply: runtime is disposing or disposed");
        }
        if (!actor || !savedPorts) {
          throw new Error("createPlaybookRuntime.apply: init must be called first");
        }
        if (activeSignal !== void 0) {
          throw new Error("createPlaybookRuntime.apply: another runtime turn is active");
        }
        const recorded = appliedReceipts.get(key);
        if (recorded !== void 0)
          return recorded;
        signal.throwIfAborted();
        refreshRetainedEffectFenceFromHost();
        const turnId = ++turnSequence;
        const callId = `apply-${++applyCallSequence}`;
        const position = { turnId, callId };
        activeTurnId = turnId;
        publicBoundarySequence += 1;
        beginAutomaticReplayBoundary();
        activeSignal = signal;
        activeAborts = abortReasonClassifier(signal);
        activeAbortEmission = void 0;
        controlPlaneError = void 0;
        const settledReceipt = (value) => deepFreeze(snapshotJsonValue(value, "apply receipt"));
        let receipt;
        let operationError;
        let settlementError;
        let accepted = false;
        let folded = false;
        let published = false;
        const foldSettlementFailure = () => {
          if (published || !accepted || folded)
            return;
          if (settlementError === void 0)
            return;
          folded = true;
          receipt = settledReceipt({
            disposition: "failed",
            error: normalizeError(settlementError)
          });
          appliedReceipts.set(key, receipt);
        };
        const latchDeliveryFailure = (error) => {
          if (isAbortFailure(error, signal))
            return;
          emissionFailure ??= { error };
        };
        try {
          try {
            const identity = {
              actionId,
              key,
              ...stateIdentity(currentState().stateId)
            };
            const preAcceptanceFinish = (reason) => ({
              actionId,
              key,
              ...receiptTracePayload({ disposition: "rejected", reason })
            });
            await emitCallStarted("apply.started", "apply.finished", identity, position, signal, preAcceptanceFinish("apply.started trace sink rejected"));
            if (signal.aborted) {
              try {
                await emitTrace("apply.finished", {
                  ...preAcceptanceFinish("aborted before acceptance"),
                  status: "aborted",
                  error: normalizeError(signal.reason)
                }, position);
              } catch (error) {
                settlementError ??= error;
              }
              signal.throwIfAborted();
            }
            const snapshot = actor.getSnapshot();
            const candidate = deriveControlActions(snapshot).find(({ action }) => action.id === actionId);
            if (candidate === void 0) {
              receipt = settledReceipt({
                disposition: "rejected",
                reason: `action ${JSON.stringify(actionId)} is not currently advertised`
              });
            } else {
              accepted = true;
              try {
                let run;
                if (candidate.retryJudgment !== void 0) {
                  await recoverJudgment(candidate.retryJudgment, signal);
                  run = runResultFor(settledOutcome(signal));
                } else if (candidate.unresolvedEffectAction === "abandon") {
                  signal.throwIfAborted();
                  run = runResultFor("unresolved-effect");
                } else if (candidate.unresolvedEffectAction === "reconcile") {
                  if (candidate.deferredRestoreOperationId !== void 0) {
                    await restoreBoundDeferredOperation(candidate.deferredRestoreOperationId, signal);
                  } else {
                    refreshRetainedEffectFenceFromHost();
                  }
                  signal.throwIfAborted();
                  run = runResultFor(hasUnresolvedReconciliation() ? "no-action" : "quiescent");
                } else if (candidate.retryStep) {
                  if (candidate.restoreReadOnly !== void 0) {
                    await confirmReadOnlyRestoration(candidate.restoreReadOnly, signal);
                  }
                  const checkpoint = recoveryCheckpoint;
                  requiredRecoveryBaseline = currentEffectLedger().boundaries.slice(checkpoint.boundaryPrefix).find(({ restored }) => restored !== void 0)?.restored;
                  try {
                    await resumeCheckpoint(checkpoint);
                  } finally {
                    requiredRecoveryBaseline = void 0;
                  }
                  run = runResultFor(settledOutcome(signal));
                } else {
                  actor.send(candidate.event);
                  await waitForPlaybookQuiescence(actor, {
                    pendingCalls: nestedBridge
                  });
                  run = runResultFor(settledOutcome(signal));
                }
                if (controlPlaneError !== void 0)
                  throw controlPlaneError;
                receipt = settledReceipt(run.outcome === "failed" || run.outcome === "aborted" ? {
                  disposition: "failed",
                  run,
                  error: ("error" in run ? run.error : void 0) ?? normalizeError(new Error(`apply settled with outcome ${run.outcome}`))
                } : { disposition: "executed", run });
              } catch (error) {
                receipt = settledReceipt({
                  disposition: "failed",
                  error: normalizeError(error)
                });
              }
            }
          } catch (error) {
            operationError = error;
          }
          if (receipt !== void 0 && receipt.disposition !== "rejected") {
            appliedReceipts.set(key, receipt);
          }
          if (parallelProfile !== void 0)
            await drainBoundaryCalls();
          try {
            await drainEmissions();
          } catch (error) {
            settlementError = error;
          }
          settlementError ??= activeAbortEmission;
          foldSettlementFailure();
          if (receipt !== void 0) {
            published = true;
            try {
              await emitTrace("apply.finished", { actionId, key, ...receiptTracePayload(receipt) }, position);
            } catch (error) {
              if (accepted)
                latchDeliveryFailure(error);
              else
                settlementError ??= error;
            }
            try {
              await drainEmissions();
            } catch (error) {
              if (accepted)
                latchDeliveryFailure(error);
              else
                settlementError ??= error;
            }
          }
        } finally {
          activeSignal = void 0;
          activeAborts = void 0;
          activeAbortEmission = void 0;
          activeTurnId = void 0;
          activeGovernedBoundarySeen = false;
          activeGovernedAttemptId = void 0;
          activeEffectLedgerPrefixSequence = void 0;
          controlPlaneError = void 0;
        }
        if (accepted && receipt !== void 0)
          return receipt;
        const failure = settlementError ?? operationError;
        if (failure !== void 0)
          throw failure;
        if (receipt === void 0) {
          throw new Error("createPlaybookRuntime.apply: no receipt was produced");
        }
        return receipt;
      },
      unresolvedEffectEnvelopes: unresolvedEffectEnvelopeIdentities,
      async handleBossInput({ text, signal, onAccepted }) {
        if (!actor || !savedPorts) {
          throw new Error("createPlaybookRuntime.handleBossInput: init must be called first");
        }
        if (disposed || disposalPromise !== void 0) {
          throw new Error("createPlaybookRuntime.handleBossInput: runtime is disposing or disposed");
        }
        if (activeSignal !== void 0) {
          throw new Error("createPlaybookRuntime.handleBossInput: another runtime turn is active");
        }
        assertDeferredSettlementOpen("handleBossInput");
        refreshRetainedEffectFenceFromHost();
        const turnId = ++turnSequence;
        activeTurnId = turnId;
        publicBoundarySequence += 1;
        beginAutomaticReplayBoundary();
        activeSignal = signal;
        activeAborts = abortReasonClassifier(signal);
        activeAbortEmission = void 0;
        controlPlaneError = void 0;
        pendingResultFailureCause = void 0;
        let result;
        let operationError;
        try {
          try {
            await emitTrace("boss.input.received", { text }, { turnId });
            signal.throwIfAborted();
            let event;
            let classifiedSnapshot;
            let deferredPending;
            let deferredOperation;
            let pendingRequiresDeferredBinding = false;
            const trimmed = text.trim();
            if (trimmed !== "") {
              const snapshot = actor.getSnapshot();
              classifiedSnapshot = snapshot;
              const terminal = snapshot.status === "done";
              const stateId = normalizePlaybookSnapshot(snapshot).stateId;
              const snapshotContext = snapshot.context ?? {};
              deferredPending = singlePendingBossQuestion(normalizePlaybookSnapshot(snapshot), snapshotContext);
              pendingRequiresDeferredBinding = deferredPending !== void 0 && outcomeAuthority?.governedPlayerStates[deferredPending.resumeStateId]?.needsBossReply?.repositoryDisposition === "deferred" && !pendingHasExactUnchangedOrigin(deferredPending);
              deferredOperation = !pendingRequiresDeferredBinding ? void 0 : currentBoundDeferredOperation(deferredPending);
              if (hasUnresolvedReconciliation()) {
                event = void 0;
              } else if (stateId === "failed" && !failedAttemptAllowsReplay()) {
                event = void 0;
              } else if (spec.entryEvent !== void 0 && (stateId === "ready" || stateId === "failed" || terminal)) {
                event = {
                  type: spec.entryEvent.type,
                  [spec.entryEvent.textField]: text
                };
              } else {
                event = await classifyBossText(text, runtimePorts, signal, snapshot, boundary, boundOptions);
              }
              signal.throwIfAborted();
            }
            if (event !== void 0 && deferredPending !== void 0 && pendingRequiresDeferredBinding && deferredOperation === void 0 && hasGovernedPlayerStates && deferredReconciliationOperationId === void 0) {
              throw new Error(`${label} pending governed Boss question has no durable logical operation`);
            }
            let handledDeferred = false;
            if (event !== void 0 && classifiedSnapshot !== void 0 && deferredPending !== void 0 && deferredOperation !== void 0) {
              if (isExactDeferredBossReply(classifiedSnapshot, event, deferredPending)) {
                const statusLine = classificationStatus(event);
                const continuation = await continueBoundDeferredOperation(deferredOperation, event, signal, turnId, statusLine, onAccepted);
                if (continuation === "continued") {
                  if (controlPlaneError !== void 0) {
                    throw controlPlaneError;
                  }
                  result = runResultFor(!hasUnresolvedReconciliation() ? settledOutcome(signal) : "no-action");
                } else {
                  result = runResultFor("no-action");
                }
                handledDeferred = true;
              } else if (event.type === "BOSS_REPLY") {
                event = void 0;
              } else {
                await parkBoundDeferredOperation(deferredOperation.operationId, signal);
                result = runResultFor("no-action");
                handledDeferred = true;
              }
            }
            if (handledDeferred) {
            } else if (event === void 0) {
              result = runResultFor("no-action");
            } else {
              const statusLine = classificationStatus(event);
              if (statusLine !== void 0) {
                await runtimePorts.emitStatus(statusLine);
              }
              signal.throwIfAborted();
              if (actor.getSnapshot().status === "done") {
                stopActor();
                actor = buildActor(runtimePorts);
                suppressInspectionEmissions = false;
                actor.start();
              }
              onAccepted?.();
              actor.send(event);
              await waitForPlaybookQuiescence(actor, {
                pendingCalls: nestedBridge
              });
              if (controlPlaneError !== void 0)
                throw controlPlaneError;
              result = runResultFor(settledOutcome(signal));
            }
          } catch (error) {
            operationError = error;
          }
          if (parallelProfile !== void 0)
            await drainBoundaryCalls();
          let drainError;
          try {
            await drainEmissions();
          } catch (error) {
            drainError = error;
          }
          const latchedControlError = controlPlaneError;
          const drainAbort = drainError !== void 0 && isAbortFailure(drainError, signal);
          const effectiveDrainError = drainAbort ? void 0 : drainError;
          const primaryError = latchedControlError ?? effectiveDrainError ?? operationError;
          const abortError = latchedControlError === void 0 && effectiveDrainError === void 0 && (operationError !== void 0 && isAbortFailure(operationError, signal) || drainAbort && operationError === void 0);
          const settlementResult = deferredSettlementClosure !== void 0 ? void 0 : primaryError === void 0 ? result ?? runResultFor("no-action") : runResultFor(abortError ? "aborted" : "failed", primaryError);
          let settlementEmissionError;
          if (settlementResult !== void 0) {
            try {
              await emitTrace("boss.input.settled", settlementTracePayload(settlementResult), { turnId });
            } catch (error) {
              settlementEmissionError = error;
            }
          }
          try {
            await drainEmissions();
          } catch (error) {
            settlementEmissionError ??= error;
          }
          if (settlementEmissionError !== void 0 && isAbortFailure(settlementEmissionError, signal)) {
            settlementEmissionError = void 0;
          }
          const failure = controlPlaneError ?? latchedControlError ?? effectiveDrainError ?? (abortError ? settlementEmissionError ?? operationError : operationError ?? settlementEmissionError);
          if (failure !== void 0 && !(abortError && settlementEmissionError === void 0)) {
            throw failure;
          }
          if (settlementResult === void 0) {
            throw deferredSettlementClosure;
          }
          return settlementResult;
        } finally {
          activeSignal = void 0;
          activeAborts = void 0;
          activeAbortEmission = void 0;
          activeTurnId = void 0;
          activeGovernedBoundarySeen = false;
          activeGovernedAttemptId = void 0;
          activeEffectLedgerPrefixSequence = void 0;
          controlPlaneError = void 0;
        }
      },
      async resumePlaybookCall(input) {
        if (!actor || !savedPorts) {
          throw new Error("createPlaybookRuntime.resumePlaybookCall: init must be called first");
        }
        if (disposed || disposalPromise !== void 0) {
          throw new Error("createPlaybookRuntime.resumePlaybookCall: runtime is disposing or disposed");
        }
        if (activeSignal !== void 0) {
          throw new Error("createPlaybookRuntime.resumePlaybookCall: another runtime turn is active");
        }
        refreshRetainedEffectFenceFromHost();
        if (hasUnresolvedReconciliation()) {
          return runResultFor("no-action");
        }
        activeTurnId = playbookCallTurnIds.get(input.callId);
        publicBoundarySequence += 1;
        bindAutomaticReplayBoundary(playbookCallEffectPrefixes.has(input.callId) ? playbookCallEffectPrefixes.get(input.callId) : hasGovernedPlayerStates ? 0 : void 0);
        activeSignal = input.signal;
        activeAborts = abortReasonClassifier(input.signal);
        activeAbortEmission = void 0;
        controlPlaneError = void 0;
        try {
          let result;
          let operationError;
          try {
            await nestedBridge.resume(input);
          } catch (error) {
            operationError = error;
          }
          try {
            await waitForPlaybookQuiescence(actor, {
              pendingCalls: nestedBridge
            });
            result = runResultFor(settledOutcome(input.signal));
          } catch (error) {
            operationError ??= error;
          }
          if (operationError !== void 0 && isAbortFailure(operationError, input.signal) && nestedBridge.getPendingCall()?.callId === input.callId) {
            result = {
              outcome: "aborted",
              state: currentState(),
              error: normalizeError(input.signal.reason)
            };
          }
          if (parallelProfile !== void 0)
            await drainBoundaryCalls();
          let drainError;
          try {
            await drainEmissions();
          } catch (error) {
            drainError = error;
          }
          const aborts = activeAborts ?? abortReasonClassifier(input.signal);
          const controlFailure = controlPlaneError;
          const drainAbort = controlFailure === void 0 && drainError !== void 0 && aborts.isAbortReason(drainError);
          const operationAbort = controlFailure === void 0 && operationError !== void 0 && aborts.isAbortReason(operationError);
          const abortEvidence = activeAbortEmission ?? (drainAbort ? drainError : void 0) ?? (operationAbort ? operationError : void 0);
          const failure = controlFailure ?? (drainAbort ? void 0 : drainError) ?? (operationAbort ? void 0 : operationError);
          if (failure !== void 0)
            throw failure;
          if (abortEvidence !== void 0 && result?.outcome !== "terminal" && result?.outcome !== "suspended") {
            result = runResultFor("aborted", abortEvidence);
          }
          if (result === void 0) {
            throw new Error("playbook resume produced no runtime result");
          }
          return result;
        } finally {
          activeSignal = void 0;
          activeAborts = void 0;
          activeAbortEmission = void 0;
          activeTurnId = void 0;
          activeGovernedBoundarySeen = false;
          activeGovernedAttemptId = void 0;
          activeEffectLedgerPrefixSequence = void 0;
          controlPlaneError = void 0;
        }
      },
      dispose() {
        if (disposalPromise !== void 0)
          return disposalPromise;
        if (disposed)
          return Promise.resolve();
        if (activeSignal !== void 0) {
          return Promise.reject(new Error("createPlaybookRuntime.dispose: cannot dispose during an active runtime boundary"));
        }
        const task = (async () => {
          const failures = [];
          try {
            if (initInFlight !== void 0) {
              try {
                await initInFlight;
              } catch {
              }
            }
            const finalState = actor ? currentState() : void 0;
            stopActor();
            try {
              await nestedBridge.dispose();
            } catch (error) {
              failures.push(error);
            }
            try {
              await drainEmissions();
            } catch (error) {
              failures.push(error);
            }
            if (session !== void 0) {
              try {
                await emitTrace("session.disposed", finalState === void 0 ? {} : {
                  state: finalState,
                  ...stateIdentity(finalState.stateId)
                });
                await drainEmissions();
              } catch (error) {
                failures.push(error);
              }
            }
          } finally {
            if (session?.playerSessions === void 0) {
              privateResumeTokens.clear();
            }
            activePlayerKeys.clear();
            playbookCallTurnIds.clear();
            playbookCallEffectPrefixes.clear();
            activeEmissionCalls.clear();
            emissionQueue.clear();
            judgeQueue.clear();
            appliedReceipts.clear();
            pendingCohorts.clear();
            consumedCohortBoundaries.clear();
            activeBoundaryCalls.clear();
            cohortCompletionQueue.clear();
            actor = void 0;
            activeSignal = void 0;
            activeAborts = void 0;
            actorSettlementAborts.length = 0;
            actorSettlementErrorAborts = void 0;
            activeAbortEmission = void 0;
            activeTurnId = void 0;
            activeGovernedBoundarySeen = false;
            activeGovernedAttemptId = void 0;
            activeEffectLedgerPrefixSequence = void 0;
            failedGovernedAttemptUnknown = false;
            failedEffectBoundaryPrefix = void 0;
            failedGovernedAttemptId = void 0;
            controlPlaneError = void 0;
            emissionFailure = void 0;
            retainedEffectSourceSessionId = void 0;
            retainedEffectReconciliation = void 0;
            retainedEffectReconciliationRequired = false;
            reconstructedGovernedDelivery = void 0;
            reconstructedGovernedPrefixSequence = void 0;
            reconstructedAcceptancePending = void 0;
            governedSettlementsByBoundaryId.clear();
            governedCompletionEvidenceByBoundaryId.clear();
            unresolvedSemanticBoundaryIds.clear();
            deferredReconciliationOperationId = void 0;
            deferredSettlementClosure = void 0;
            expectedBoundPendingQuestion = void 0;
            activeDeferredContinuation = void 0;
            deferInspectionEmissions = false;
            deferredInspectionEmissions = [];
            savedPorts = void 0;
            runtimePorts = void 0;
            session = void 0;
            disposed = true;
          }
          if (failures.length === 1)
            throw failures[0];
          if (failures.length > 1) {
            throw new AggregateError(failures, "playbook runtime disposal failed");
          }
        })();
        disposalPromise = task;
        return task;
      },
      // @internal — test-only escape hatches for inspecting the underlying
      // actor, traced boundary, and nested bridge. Not part of the stable
      // public runtime contract.
      _getActor() {
        return actor;
      },
      _getBoundary() {
        return boundary;
      },
      _getNestedBridge() {
        return nestedBridge;
      }
    };
    return runtime;
  };
  Object.defineProperty(createPlaybookRuntime2, "compat", {
    value: Object.freeze({ artifactSchema, runtimeAbi: RUNTIME_ABI }),
    enumerable: true,
    writable: false,
    configurable: false
  });
  return createPlaybookRuntime2;
}

// node_modules/@sublang/playbook/src/xstate-runtime.js
var BUSY_TAG = "playbook.busy";
var SUSPENDED_TAG = "playbook.suspended";
function deferred() {
  let resolve;
  let reject;
  const promise = new Promise((resolvePromise, rejectPromise) => {
    resolve = resolvePromise;
    reject = rejectPromise;
  });
  return { promise, resolve, reject };
}
function withAbort(promise, signal) {
  if (signal.aborted)
    return Promise.reject(signal.reason);
  return new Promise((resolve, reject) => {
    const onAbort = () => reject(signal.reason);
    signal.addEventListener("abort", onAbort, { once: true });
    void promise.then((value) => {
      signal.removeEventListener("abort", onAbort);
      resolve(value);
    }, (error) => {
      signal.removeEventListener("abort", onAbort);
      reject(error);
    });
  });
}
function isAbortReason(error, signal) {
  return signal.aborted && Object.is(error, signal.reason);
}
function createAbortReasonClassifier(...sources) {
  const captured = Object.freeze(sources.filter((source) => source !== void 0));
  return Object.freeze({
    isAbortReason: (error) => captured.some((source) => source instanceof AbortSignal ? isAbortReason(error, source) : source.isAbortReason(error))
  });
}
var NEVER_ABORTED_SIGNAL = new AbortController().signal;
function combineAbortSignals(...signals) {
  const present = [];
  for (const [index, signal] of signals.entries()) {
    if (signal === void 0)
      continue;
    if (!(signal instanceof AbortSignal)) {
      throw new TypeError(`abort signal ${index} must be an AbortSignal`);
    }
    present.push(signal);
  }
  if (present.length === 0)
    return NEVER_ABORTED_SIGNAL;
  if (present.length === 1)
    return present[0];
  return AbortSignal.any(present);
}
var abortCleanups = /* @__PURE__ */ new WeakMap();
function registerPlaybookAbortCleanup(signal, cleanup) {
  let pending = abortCleanups.get(signal);
  if (!pending) {
    pending = /* @__PURE__ */ new Set();
    abortCleanups.set(signal, pending);
  }
  pending.add(cleanup);
  void cleanup.catch(() => void 0);
}
async function drainPlaybookAbortCleanups(signal, aborts) {
  const failures = [];
  while (true) {
    const pending = abortCleanups.get(signal);
    if (!pending || pending.size === 0)
      break;
    const batch = [...pending];
    pending.clear();
    const outcomes = await Promise.allSettled(batch);
    for (const outcome of outcomes) {
      if (outcome.status === "rejected" && !aborts.isAbortReason(outcome.reason)) {
        failures.push(outcome.reason);
      }
    }
  }
  abortCleanups.delete(signal);
  if (failures.length === 1)
    throw failures[0];
  if (failures.length > 1) {
    throw new AggregateError(failures, "playbook abort cleanup failed");
  }
}
function isRecord2(value) {
  if (value === null || typeof value !== "object" || Array.isArray(value)) {
    return false;
  }
  const prototype = Object.getPrototypeOf(value);
  return prototype === Object.prototype || prototype === null;
}
function own(value, key) {
  return Object.prototype.hasOwnProperty.call(value, key);
}
function snapshotJsonValueFromDescriptors(value, path = "$", ancestors = /* @__PURE__ */ new Set()) {
  if (value === null || typeof value === "string" || typeof value === "boolean") {
    return value;
  }
  if (typeof value === "number") {
    if (!Number.isFinite(value)) {
      throw new TypeError(`${path} must contain a finite JSON number`);
    }
    if (Object.is(value, -0)) {
      throw new TypeError(`${path} must not contain negative zero`);
    }
    return value;
  }
  if (Array.isArray(value)) {
    if (Object.getPrototypeOf(value) !== Array.prototype) {
      throw new TypeError(`${path} must be a plain JSON array`);
    }
    if (ancestors.has(value)) {
      throw new TypeError(`${path} must not contain a JSON cycle`);
    }
    const nextAncestors2 = new Set(ancestors).add(value);
    const descriptors2 = Object.getOwnPropertyDescriptors(value);
    const descriptorMap = descriptors2;
    const descriptorKeys2 = Reflect.ownKeys(descriptors2);
    if (descriptorKeys2.some((key) => typeof key === "symbol")) {
      throw new TypeError(`${path} must not contain symbol-keyed properties`);
    }
    const lengthDescriptor = descriptorMap.length;
    if (!lengthDescriptor || !own(lengthDescriptor, "value") || !Number.isSafeInteger(lengthDescriptor.value) || lengthDescriptor.value < 0) {
      throw new TypeError(`${path} must be a plain JSON array`);
    }
    const length = lengthDescriptor.value;
    const indexed = [];
    for (const key of descriptorKeys2) {
      if (typeof key === "symbol")
        continue;
      if (key === "length")
        continue;
      const descriptor = descriptorMap[key];
      if (!descriptor)
        continue;
      const index = Number(key);
      if (!Number.isSafeInteger(index) || index < 0 || index >= length || String(index) !== key) {
        throw new TypeError(`${path}.${key} is not a JSON array index`);
      }
      indexed.push([index, descriptor]);
    }
    if (indexed.length !== length) {
      throw new TypeError(`${path} must not be a sparse JSON array`);
    }
    indexed.sort(([left], [right]) => left - right);
    const copy2 = [];
    for (const [index, descriptor] of indexed) {
      if (!descriptor.enumerable) {
        throw new TypeError(`${path}[${index}] must be an enumerable JSON property`);
      }
      if (!own(descriptor, "value")) {
        throw new TypeError(`${path}[${index}] must be a JSON data property`);
      }
      copy2.push(snapshotJsonValueFromDescriptors(descriptor.value, `${path}[${index}]`, nextAncestors2));
    }
    return Object.freeze(copy2);
  }
  if (!isRecord2(value)) {
    throw new TypeError(`${path} must be a JSON value`);
  }
  if (ancestors.has(value)) {
    throw new TypeError(`${path} must not contain a JSON cycle`);
  }
  const descriptors = Object.getOwnPropertyDescriptors(value);
  const descriptorKeys = Reflect.ownKeys(descriptors);
  if (descriptorKeys.some((key) => typeof key === "symbol")) {
    throw new TypeError(`${path} must not contain symbol-keyed properties`);
  }
  const nextAncestors = new Set(ancestors).add(value);
  const copy = {};
  for (const key of descriptorKeys) {
    if (typeof key === "symbol")
      continue;
    const descriptor = descriptors[key];
    if (!descriptor)
      continue;
    if (!descriptor.enumerable) {
      throw new TypeError(`${path}.${key} must be an enumerable JSON property`);
    }
    if (!own(descriptor, "value")) {
      throw new TypeError(`${path}.${key} must be a JSON data property`);
    }
    defineEnumerableDataProperty(copy, key, snapshotJsonValueFromDescriptors(descriptor.value, `${path}.${key}`, nextAncestors));
  }
  return Object.freeze(copy);
}
function assertJsonSafe(value, path = "$", ancestors = /* @__PURE__ */ new Set()) {
  snapshotJsonValueFromDescriptors(value, path, ancestors);
}
function defineEnumerableDataProperty(target, key, value) {
  Object.defineProperty(target, key, {
    value,
    enumerable: true,
    configurable: true,
    writable: true
  });
}
function snapshotJsonValue(value, path = "$") {
  return snapshotJsonValueFromDescriptors(value, path);
}
function capturedDataValue(descriptors, key, path, required = true) {
  const descriptor = descriptors[key];
  if (!descriptor) {
    if (required)
      throw new TypeError(`${path} must be an own data property`);
    return void 0;
  }
  if (!own(descriptor, "value")) {
    throw new TypeError(`${path} must be an own data property`);
  }
  return descriptor.value;
}
function capturedPort(descriptors, name) {
  const value = capturedDataValue(descriptors, name, `playbook session ports.${name}`);
  if (typeof value !== "function") {
    throw new TypeError(`playbook session ports.${name} must be a function`);
  }
  return value;
}
function capturedSessionStore(descriptors) {
  const captured = capturedDataValue(descriptors, "playerSessions", "playbook session playerSessions");
  if (!isRecord2(captured)) {
    throw new TypeError("playbook session playerSessions must be an object");
  }
  const storeDescriptors = Object.getOwnPropertyDescriptors(captured);
  const method = (name) => {
    const value = capturedDataValue(storeDescriptors, name, `playbook session playerSessions.${name}`);
    if (typeof value !== "function") {
      throw new TypeError(`playbook session playerSessions.${name} must be a function`);
    }
    return value;
  };
  return Object.freeze({
    select: method("select"),
    update: method("update"),
    snapshot: method("snapshot"),
    restore: method("restore")
  });
}
function capturedRoleBindings(descriptors) {
  const captured = snapshotJsonValue(capturedDataValue(descriptors, "roleBindings", "playbook session roleBindings"), "playbook session roleBindings");
  if (!isRecord2(captured)) {
    throw new TypeError("playbook session roleBindings must be an object");
  }
  const bindings = {};
  for (const [roleId, value] of Object.entries(captured)) {
    requireNonEmptyString(roleId, "playbook session roleBindings role id");
    if (!isRecord2(value)) {
      throw new TypeError(`playbook session roleBindings.${roleId} must be an object`);
    }
    rejectUnknownKeys(value, ["playerId", "promptIdentity"], `playbook session roleBindings.${roleId}`);
    defineEnumerableDataProperty(bindings, roleId, Object.freeze({
      playerId: requireNonEmptyString(value.playerId, `playbook session roleBindings.${roleId}.playerId`),
      promptIdentity: requireNonEmptyString(value.promptIdentity, `playbook session roleBindings.${roleId}.promptIdentity`)
    }));
  }
  return Object.freeze(bindings);
}
function snapshotPlaybookSession(session) {
  if (!isRecord2(session)) {
    throw new TypeError("playbook session must be an object");
  }
  const sessionDescriptors = Object.getOwnPropertyDescriptors(session);
  const sessionId = requireNonEmptyString(capturedDataValue(sessionDescriptors, "sessionId", "playbook session sessionId"), "playbook session sessionId");
  const playbookId = requireNonEmptyString(capturedDataValue(sessionDescriptors, "playbookId", "playbook session playbookId"), "playbook session playbookId");
  const rootSessionId = requireNonEmptyString(capturedDataValue(sessionDescriptors, "rootSessionId", "playbook session rootSessionId"), "playbook session rootSessionId");
  const capturedDepth = capturedDataValue(sessionDescriptors, "depth", "playbook session depth");
  if (!Number.isSafeInteger(capturedDepth) || capturedDepth < 0) {
    throw new TypeError("playbook session depth must be a non-negative integer");
  }
  const depth = capturedDepth;
  const capturedParentSessionId = capturedDataValue(sessionDescriptors, "parentSessionId", "playbook session parentSessionId", false);
  const capturedParentCallId = capturedDataValue(sessionDescriptors, "parentCallId", "playbook session parentCallId", false);
  const hasParentSessionId = Object.prototype.hasOwnProperty.call(sessionDescriptors, "parentSessionId");
  const hasParentCallId = Object.prototype.hasOwnProperty.call(sessionDescriptors, "parentCallId");
  const hasPlayerSessions = Object.prototype.hasOwnProperty.call(sessionDescriptors, "playerSessions");
  const hasRoleBindings = Object.prototype.hasOwnProperty.call(sessionDescriptors, "roleBindings");
  let parentSessionId;
  let parentCallId;
  if (depth === 0) {
    if (rootSessionId !== sessionId) {
      throw new TypeError("root playbook session must be its own rootSessionId");
    }
    if (hasParentSessionId || hasParentCallId) {
      throw new TypeError("root playbook session must not carry parent identity");
    }
  } else {
    parentSessionId = requireNonEmptyString(capturedParentSessionId, "playbook session parentSessionId");
    parentCallId = requireNonEmptyString(capturedParentCallId, "playbook session parentCallId");
    if (sessionId === rootSessionId || sessionId === parentSessionId) {
      throw new TypeError("child playbook sessionId must differ from its root and parent session ids");
    }
  }
  const capturedPorts = capturedDataValue(sessionDescriptors, "ports", "playbook session ports");
  if (!isRecord2(capturedPorts)) {
    throw new TypeError("playbook session ports must be an object");
  }
  const portDescriptors = Object.getOwnPropertyDescriptors(capturedPorts);
  const ports = Object.freeze({
    callPlayer: capturedPort(portDescriptors, "callPlayer"),
    callCaptain: capturedPort(portDescriptors, "callCaptain"),
    callJudge: capturedPort(portDescriptors, "callJudge"),
    callPlaybook: capturedPort(portDescriptors, "callPlaybook"),
    emitStatus: capturedPort(portDescriptors, "emitStatus"),
    emitTelemetry: capturedPort(portDescriptors, "emitTelemetry"),
    ...portDescriptors.recordStep === void 0 ? {} : { recordStep: capturedPort(portDescriptors, "recordStep") }
  });
  const playerSessions = hasPlayerSessions ? capturedSessionStore(sessionDescriptors) : void 0;
  const roleBindings = hasRoleBindings ? capturedRoleBindings(sessionDescriptors) : void 0;
  return Object.freeze({
    sessionId,
    playbookId,
    rootSessionId,
    ...parentSessionId === void 0 ? {} : { parentSessionId },
    ...parentCallId === void 0 ? {} : { parentCallId },
    depth,
    ...roleBindings === void 0 ? {} : { roleBindings },
    ...playerSessions === void 0 ? {} : { playerSessions },
    ports
  });
}
var PLAYBOOK_FAILURE_CAUSE_PROPERTY = "playbookCause";
function attachPlaybookFailureCause(error, cause) {
  if (typeof error !== "object" || error === null)
    return error;
  let validated;
  try {
    validated = assertPlaybookFailureCause(cause);
  } catch {
    return error;
  }
  try {
    Object.defineProperty(error, PLAYBOOK_FAILURE_CAUSE_PROPERTY, {
      value: validated,
      enumerable: false,
      writable: true,
      configurable: true
    });
  } catch {
  }
  return error;
}
function playbookFailureCauseOf(error) {
  if (typeof error !== "object" || error === null)
    return void 0;
  let candidate;
  try {
    if (Object.hasOwn(error, PLAYBOOK_FAILURE_CAUSE_PROPERTY)) {
      candidate = error[PLAYBOOK_FAILURE_CAUSE_PROPERTY];
    } else if (!(error instanceof Error) && Object.hasOwn(error, "cause")) {
      candidate = error.cause;
    }
  } catch {
    return void 0;
  }
  if (candidate === void 0)
    return void 0;
  try {
    return assertPlaybookFailureCause(candidate);
  } catch {
    return void 0;
  }
}
function normalizeError(error) {
  const cause = playbookFailureCauseOf(error);
  const withCause = (normalized) => cause === void 0 ? normalized : { ...normalized, cause };
  if (error instanceof Error) {
    let name = "Error";
    let message = "Unknown error";
    let stack;
    try {
      if (typeof error.name === "string" && error.name.length > 0) {
        name = error.name;
      }
    } catch {
    }
    try {
      if (typeof error.message === "string")
        message = error.message;
    } catch {
    }
    try {
      if (typeof error.stack === "string")
        stack = error.stack;
    } catch {
    }
    return withCause({
      name,
      message,
      ...stack ? { stack } : {}
    });
  }
  if (typeof error === "string") {
    return { name: "Error", message: error };
  }
  try {
    assertJsonSafe(error);
    if (isRecord2(error) && typeof error.message === "string") {
      return withCause({
        name: typeof error.name === "string" && error.name.length > 0 ? error.name : "Error",
        message: error.message,
        ...typeof error.stack === "string" ? { stack: error.stack } : {}
      });
    }
    return withCause({ name: "Error", message: JSON.stringify(error) });
  } catch {
    try {
      return withCause({ name: "Error", message: String(error) });
    } catch {
      return withCause({ name: "Error", message: "Unknown error" });
    }
  }
}
function requireNonEmptyString(value, path) {
  if (typeof value !== "string" || value.trim().length === 0) {
    throw new TypeError(`${path} must be a non-empty string`);
  }
  return value;
}
function normalizeStateValue(value, path = "snapshot.value", ancestors = /* @__PURE__ */ new Set()) {
  if (typeof value === "string")
    return value;
  if (!isRecord2(value)) {
    throw new TypeError(`${path} must be an XState string or object value`);
  }
  if (ancestors.has(value)) {
    throw new TypeError(`${path} must not contain an XState state cycle`);
  }
  const nextAncestors = new Set(ancestors).add(value);
  const normalized = {};
  for (const key of Object.keys(value).sort()) {
    defineEnumerableDataProperty(normalized, key, normalizeStateValue(value[key], `${path}.${key}`, nextAncestors));
  }
  return normalized;
}
function asMachineSnapshot(snapshot) {
  if (!isRecord2(snapshot)) {
    throw new TypeError("snapshot must be an XState machine snapshot");
  }
  const status = snapshot.status;
  if (status !== "active" && status !== "done" && status !== "error" && status !== "stopped") {
    throw new TypeError("snapshot.status is not an XState actor status");
  }
  if (!(snapshot.tags instanceof Set)) {
    throw new TypeError("snapshot.tags must be an XState tag set");
  }
  if (typeof snapshot.getMeta !== "function") {
    throw new TypeError("snapshot.getMeta must be an XState public method");
  }
  return snapshot;
}
function activePlaybookStateMetadata(snapshot) {
  const machineSnapshot = asMachineSnapshot(snapshot);
  const byStateId = /* @__PURE__ */ new Map();
  for (const [nodeId, meta2] of Object.entries(machineSnapshot.getMeta())) {
    if (!isRecord2(meta2) || !own(meta2, "playbook"))
      continue;
    if (!isRecord2(meta2.playbook)) {
      throw new TypeError(`${nodeId}.meta.playbook must be an object`);
    }
    const stateId = requireNonEmptyString(meta2.playbook.stateId, `${nodeId}.meta.playbook.stateId`);
    const description = meta2.playbook.description === void 0 ? void 0 : requireNonEmptyString(meta2.playbook.description, `${nodeId}.meta.playbook.description`);
    const previous = byStateId.get(stateId);
    if (previous?.description !== void 0 && description !== void 0 && previous.description !== description) {
      throw new TypeError(`active state id ${stateId} has conflicting descriptions`);
    }
    const effective = description ?? previous?.description;
    byStateId.set(stateId, {
      stateId,
      ...effective === void 0 ? {} : { description: effective }
    });
  }
  return [...byStateId.values()].sort((left, right) => left.stateId.localeCompare(right.stateId));
}
function normalizePlaybookSnapshot(snapshot, options = {}) {
  const machineSnapshot = asMachineSnapshot(snapshot);
  const active = activePlaybookStateMetadata(machineSnapshot);
  const activeStateIds = active.map(({ stateId }) => stateId);
  const tags = [...machineSnapshot.tags].sort();
  const busy = tags.includes(BUSY_TAG);
  const suspended = tags.includes(SUSPENDED_TAG);
  const quiescent = machineSnapshot.status !== "active" || !busy && (!suspended || options.pendingCall !== void 0);
  return {
    value: normalizeStateValue(machineSnapshot.value),
    activeStateIds,
    tags,
    status: machineSnapshot.status,
    quiescent,
    ...activeStateIds.length === 1 ? { stateId: activeStateIds[0] } : {}
  };
}
function detachPersistedMachineSnapshot(persisted, completion = {}) {
  const detached = withErrorsNormalized(persisted, /* @__PURE__ */ new Set());
  const lastError = completion.lastError;
  return snapshotJsonValue(lastError !== void 0 && isRecord2(detached) && isRecord2(detached.context) ? { ...detached, context: { ...detached.context, lastError } } : detached, "persisted machine snapshot");
}
function withErrorsNormalized(value, ancestors) {
  if (value instanceof Error)
    return normalizeError(value);
  if (Array.isArray(value)) {
    if (ancestors.has(value))
      return value;
    const nextAncestors = new Set(ancestors).add(value);
    return value.map((entry2) => withErrorsNormalized(entry2, nextAncestors));
  }
  if (isRecord2(value)) {
    if (ancestors.has(value))
      return value;
    const nextAncestors = new Set(ancestors).add(value);
    const normalized = {};
    for (const key of Object.keys(value)) {
      if (value[key] === void 0)
        continue;
      defineEnumerableDataProperty(normalized, key, withErrorsNormalized(value[key], nextAncestors));
    }
    return normalized;
  }
  return value;
}
var SNAPSHOT_SEQUENCE_KEYS = [
  "trace",
  "turn",
  "judgeCall",
  "playerCall",
  "playbookCall"
];
var EFFECT_UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/;
var EFFECT_OID_PATTERN = /^[0-9a-f]{40}(?:[0-9a-f]{24})?$/;
var EFFECT_DIGEST_PATTERN = /^sha256:[0-9a-f]{64}$/;
var EFFECT_DISPOSITIONS = /* @__PURE__ */ new Set([
  "unchanged",
  "one-descendant-commit",
  "deferred"
]);
var EFFECT_RECEIPT_CLASSIFICATIONS = /* @__PURE__ */ new Set([
  "unchanged",
  "one-descendant-commit",
  "multiple-commits",
  "rewritten-or-non-descendant",
  "worktree-only-change",
  "concurrent-or-foreign-change",
  "observation-ambiguous"
]);
function effectUuid(value, path) {
  const id = requireNonEmptyString(value, path);
  if (!EFFECT_UUID_PATTERN.test(id)) {
    throw new TypeError(`${path} must be a canonical UUID`);
  }
  return id;
}
function effectInteger(value, path, minimum = 0) {
  if (!Number.isSafeInteger(value) || value < minimum) {
    throw new TypeError(`${path} must be an integer greater than or equal to ${minimum}`);
  }
  return value;
}
function jsonValuesEqual(left, right) {
  if (Object.is(left, right))
    return true;
  if (Array.isArray(left) || Array.isArray(right)) {
    return Array.isArray(left) && Array.isArray(right) && left.length === right.length && left.every((entry2, index) => jsonValuesEqual(entry2, right[index]));
  }
  if (isRecord2(left) && isRecord2(right)) {
    const leftKeys = Object.keys(left).sort();
    const rightKeys = Object.keys(right).sort();
    return leftKeys.length === rightKeys.length && leftKeys.every((key, index) => key === rightKeys[index] && jsonValuesEqual(left[key], right[key]));
  }
  return false;
}
function projectionText(projection) {
  return JSON.stringify(projection);
}
function projectionsEqual(left, right) {
  return left.projectionDigest === right.projectionDigest && projectionText(left.projection) === projectionText(right.projection);
}
function projectionEntriesEqual(left, right, path) {
  return own(right.projection, path) && JSON.stringify(left.projection[path]) === JSON.stringify(right.projection[path]);
}
var EFFECT_PRE_EXISTING_LISTS = ["absorbed", "altered", "lost"];
var EMPTY_PRE_EXISTING = Object.freeze({
  absorbed: Object.freeze([]),
  altered: Object.freeze([]),
  lost: Object.freeze([])
});
function effectPreExisting(value, path, baseline) {
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, EFFECT_PRE_EXISTING_LISTS, path);
  const claimed = /* @__PURE__ */ new Set();
  const lists = EFFECT_PRE_EXISTING_LISTS.map((name) => {
    const entries = value[name];
    if (!Array.isArray(entries)) {
      throw new TypeError(`${path}.${name} must be an array of baseline paths`);
    }
    let previous;
    for (const entry2 of entries) {
      if (typeof entry2 !== "string" || entry2.length === 0) {
        throw new TypeError(`${path}.${name} must hold nonempty baseline paths`);
      }
      const member = entry2;
      if (previous !== void 0 && member <= previous) {
        throw new TypeError(`${path}.${name} must be sorted and unique`);
      }
      previous = member;
      if (!own(baseline.projection, member)) {
        throw new TypeError(`${path}.${name} names a path outside the baseline projection`);
      }
      if (claimed.has(member)) {
        throw new TypeError(`${path} lists ${JSON.stringify(member)} twice`);
      }
      claimed.add(member);
    }
    return [name, entries];
  });
  if (claimed.size === 0) {
    throw new TypeError(`${path} must name at least one baseline path`);
  }
  return Object.fromEntries(lists);
}
function effectObservation(value, path) {
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, ["worktree", "gitDir", "head", "projection", "projectionDigest"], path);
  requireNonEmptyString(value.worktree, `${path}.worktree`);
  requireNonEmptyString(value.gitDir, `${path}.gitDir`);
  const head = requireNonEmptyString(value.head, `${path}.head`);
  if (!EFFECT_OID_PATTERN.test(head)) {
    throw new TypeError(`${path}.head must be a canonical Git commit OID`);
  }
  if (!isRecord2(value.projection)) {
    throw new TypeError(`${path}.projection must be a path-keyed object`);
  }
  for (const key of Object.keys(value.projection)) {
    if (key.length === 0) {
      throw new TypeError(`${path}.projection must not contain an empty path`);
    }
  }
  const projectionDigest = requireNonEmptyString(value.projectionDigest, `${path}.projectionDigest`);
  if (!EFFECT_DIGEST_PATTERN.test(projectionDigest)) {
    throw new TypeError(`${path}.projectionDigest must be a canonical SHA-256 identity`);
  }
  const expectedDigest = `sha256:${createHash("sha256").update(JSON.stringify(value.projection)).digest("hex")}`;
  if (projectionDigest !== expectedDigest) {
    throw new TypeError(`${path}.projectionDigest does not match its projection`);
  }
  return value;
}
function assertObservationIdentity(observation, identity, path) {
  if (observation.worktree !== identity.worktree || observation.gitDir !== identity.gitDir) {
    throw new TypeError(`${path} does not match its canonical worktree identity`);
  }
}
function effectReceipt(value, path, expectedBaseline, expectedAfter, matchExpectedAfter = false, dispositions) {
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, ["classification", "baseline", "after", "commitOid", "preExisting"], path);
  if (typeof value.classification !== "string" || !EFFECT_RECEIPT_CLASSIFICATIONS.has(value.classification)) {
    throw new TypeError(`${path}.classification is not supported`);
  }
  const classification = value.classification;
  const baseline = effectObservation(value.baseline, `${path}.baseline`);
  const after = own(value, "after") ? effectObservation(value.after, `${path}.after`) : void 0;
  assertObservationIdentity(after ?? baseline, baseline, `${path}.after`);
  if (expectedBaseline !== void 0 && !jsonValuesEqual(baseline, expectedBaseline)) {
    throw new TypeError(`${path}.baseline does not match its boundary baseline`);
  }
  if (matchExpectedAfter) {
    if (expectedAfter !== void 0 && (after === void 0 || !jsonValuesEqual(after, expectedAfter))) {
      throw new TypeError(`${path}.after does not match its expected observation`);
    }
    if (expectedAfter === void 0 && after !== void 0) {
      throw new TypeError(`${path}.after has no matching expected observation`);
    }
  }
  if (classification !== "observation-ambiguous" && after === void 0) {
    throw new TypeError(`${path}.after is required for ${classification}`);
  }
  const commitOid = own(value, "commitOid") ? requireNonEmptyString(value.commitOid, `${path}.commitOid`) : void 0;
  if (classification === "one-descendant-commit") {
    if (commitOid === void 0 || !EFFECT_OID_PATTERN.test(commitOid) || after?.head !== commitOid) {
      throw new TypeError(`${path}.commitOid must equal the after HEAD for one-descendant-commit`);
    }
  } else if (commitOid !== void 0) {
    throw new TypeError(`${path}.commitOid is permitted only for one-descendant-commit`);
  }
  if (classification === "unchanged" && after !== void 0 && !jsonValuesEqual(baseline, after)) {
    throw new TypeError(`${path} classified unchanged observations that differ`);
  }
  if (own(value, "preExisting") && classification !== "one-descendant-commit" && classification !== "worktree-only-change" && classification !== "observation-ambiguous") {
    throw new TypeError(`${path}.preExisting is not permitted for ${classification}`);
  }
  const preExisting = own(value, "preExisting") ? effectPreExisting(value.preExisting, `${path}.preExisting`, baseline) : EMPTY_PRE_EXISTING;
  const consumed = /* @__PURE__ */ new Set([...preExisting.absorbed, ...preExisting.altered]);
  if (classification === "one-descendant-commit" && after !== void 0 && (baseline.head === after.head || preExisting.lost.length > 0 || !Object.keys(after.projection).every((member) => own(baseline.projection, member) && projectionEntriesEqual(baseline, after, member)) || !Object.keys(baseline.projection).every((member) => own(after.projection, member) !== consumed.has(member)) || consumed.size === 0 !== projectionsEqual(baseline, after))) {
    throw new TypeError(`${path} one-descendant-commit must change HEAD and account for its complete baseline projection`);
  }
  if (classification === "worktree-only-change" && after !== void 0 && (baseline.head !== after.head || projectionsEqual(baseline, after) || preExisting.absorbed.length > 0 || preExisting.lost.length > 0 || !Object.keys(baseline.projection).every((member) => own(after.projection, member) && projectionEntriesEqual(baseline, after, member) !== consumed.has(member)))) {
    throw new TypeError(`${path} worktree-only-change must preserve HEAD, change the projection, and account for every altered baseline entry`);
  }
  if ((classification === "multiple-commits" || classification === "rewritten-or-non-descendant") && after?.head === baseline.head) {
    throw new TypeError(`${path} ${classification} must change HEAD`);
  }
  if ((classification === "one-descendant-commit" || classification === "multiple-commits" || classification === "rewritten-or-non-descendant" || classification === "worktree-only-change") && !dispositions?.includes("one-descendant-commit")) {
    throw new TypeError(`${path}.classification is incompatible with its boundary dispositions`);
  }
  if (classification === "concurrent-or-foreign-change" && (!dispositions?.every((value2) => value2 === "unchanged") || after !== void 0 && baseline.head === after.head && projectionsEqual(baseline, after))) {
    throw new TypeError(`${path}.classification is incompatible with its boundary dispositions`);
  }
  if (classification === "observation-ambiguous" && after !== void 0 && baseline.head === after.head && projectionsEqual(baseline, after)) {
    throw new TypeError(`${path} observation-ambiguous requires an absent or changed after observation`);
  }
  return value;
}
var PlaybookSemanticCandidateStructureError = class extends TypeError {
  constructor(message) {
    super(`semantic candidate ${message}`);
    this.name = "PlaybookSemanticCandidateStructureError";
  }
};
function semanticCandidateStructureError(message) {
  throw new PlaybookSemanticCandidateStructureError(message);
}
function snapshotSemanticCandidate(value, outcomes) {
  let detached;
  try {
    detached = snapshotJsonValue(value, "semantic candidate");
  } catch (error) {
    const detail = error instanceof Error ? `: ${error.message}` : "";
    semanticCandidateStructureError(`must be detached plain JSON${detail}`);
  }
  if (!isRecord2(detached)) {
    semanticCandidateStructureError("must be an object");
  }
  const guard = detached.guard;
  if (typeof guard !== "string" || guard.length === 0) {
    semanticCandidateStructureError("must contain a nonempty string guard");
  }
  if (!own(outcomes, guard)) {
    semanticCandidateStructureError(`guard ${JSON.stringify(guard)} is not declared`);
  }
  const outcome = outcomes[guard];
  const semanticFields = Object.entries(outcome.fields).filter(([, authority]) => authority === "semantic").map(([field]) => field);
  const expected = /* @__PURE__ */ new Set(["guard", ...semanticFields]);
  const actual = Object.keys(detached);
  const missing = [...expected].filter((field) => !actual.includes(field));
  const extra = actual.filter((field) => !expected.has(field));
  if (missing.length > 0 || extra.length > 0) {
    semanticCandidateStructureError("must contain exactly its guard and semantic-owned fields" + (missing.length === 0 ? "" : `; missing ${missing.join(", ")}`) + (extra.length === 0 ? "" : `; extra or wrongly owned ${extra.join(", ")}`));
  }
  for (const field of semanticFields) {
    if (typeof detached[field] !== "string") {
      semanticCandidateStructureError(`field ${JSON.stringify(field)} must be a string`);
    }
  }
  return {
    candidate: detached,
    outcome
  };
}
function retainedSemanticEvidence(candidate, finalText) {
  return Object.freeze({
    semanticCandidate: candidate,
    ...typeof finalText === "string" ? { finalText } : {}
  });
}
var FAILURE_PATH_BOUND = 32;
function boundedFailurePaths(lists) {
  const bounded = {};
  let omitted = 0;
  for (const [member, paths] of Object.entries(lists)) {
    bounded[member] = paths.slice(0, FAILURE_PATH_BOUND);
    omitted += Math.max(0, paths.length - FAILURE_PATH_BOUND);
  }
  if (omitted > 0)
    bounded.truncated = omitted;
  return bounded;
}
function sortedUniquePaths(paths) {
  return [...new Set(paths)].sort();
}
function newOrChangedProjectionPaths(baseline, after) {
  return sortedUniquePaths(Object.keys(after.projection).filter((path) => !Object.hasOwn(baseline.projection, path) || !isDeepStrictEqual2(baseline.projection[path], after.projection[path])));
}
function divergentProjectionPaths(baseline, after) {
  return sortedUniquePaths([
    ...Object.keys(baseline.projection),
    ...Object.keys(after.projection)
  ].filter((path) => !Object.hasOwn(baseline.projection, path) || !Object.hasOwn(after.projection, path) || !isDeepStrictEqual2(baseline.projection[path], after.projection[path])));
}
function playbookRepositoryFailureCause(required, receipt) {
  const observed = receipt.classification;
  const baselineHead = receipt.baseline.head;
  const after = receipt.after;
  const common = { required, observed, baselineHead };
  const ambiguous = () => assertPlaybookFailureCause({
    code: "attribution-ambiguous",
    evidence: {
      ...common,
      ...after === void 0 ? {} : { afterHead: after.head }
    }
  });
  const lost = receipt.preExisting?.lost ?? [];
  if (lost.length > 0) {
    return assertPlaybookFailureCause({
      code: "pre-existing-lost",
      evidence: {
        ...common,
        ...after === void 0 ? {} : { afterHead: after.head },
        paths: boundedFailurePaths({ lost: sortedUniquePaths(lost) })
      }
    });
  }
  if (observed === "observation-ambiguous" && after === void 0) {
    return assertPlaybookFailureCause({
      code: "observation-unstable",
      evidence: common
    });
  }
  if (after === void 0)
    return ambiguous();
  const afterHead = after.head;
  if (observed === "multiple-commits") {
    return assertPlaybookFailureCause({
      code: "commits-more-than-one",
      evidence: { ...common, afterHead }
    });
  }
  if (observed === "rewritten-or-non-descendant") {
    return assertPlaybookFailureCause({
      code: "history-rewritten",
      evidence: { ...common, afterHead }
    });
  }
  if (observed === "concurrent-or-foreign-change") {
    return assertPlaybookFailureCause({
      code: "foreign-change",
      evidence: {
        ...common,
        afterHead,
        paths: boundedFailurePaths({
          changed: divergentProjectionPaths(receipt.baseline, after)
        })
      }
    });
  }
  const uncommitted = newOrChangedProjectionPaths(receipt.baseline, after);
  const altered = sortedUniquePaths(receipt.preExisting?.altered ?? []);
  if (observed === "observation-ambiguous" && afterHead !== baselineHead && (uncommitted.length > 0 || altered.length > 0)) {
    return assertPlaybookFailureCause({
      code: "commit-residual",
      evidence: {
        ...common,
        afterHead,
        ...receipt.commitOid === void 0 ? {} : { commitOid: receipt.commitOid },
        paths: boundedFailurePaths({ uncommitted, altered })
      }
    });
  }
  if (required === "one-descendant-commit" && (observed === "unchanged" || observed === "worktree-only-change")) {
    return assertPlaybookFailureCause({
      code: "commit-missing",
      evidence: {
        ...common,
        afterHead,
        paths: boundedFailurePaths({ uncommitted })
      }
    });
  }
  return ambiguous();
}
function unresolvedSemanticEvidence(reason, evidence, cause = assertPlaybookFailureCause({
  code: "runtime-defect",
  evidence: { reason }
})) {
  return Object.freeze({ status: "unresolved", reason, cause, evidence });
}
function reconcilePlaybookSemanticEvidence(input) {
  let report;
  try {
    report = snapshotJsonValue(input.semanticCandidate, "semantic candidate");
  } catch (error) {
    semanticCandidateStructureError(`must be detached plain JSON: ${error instanceof Error ? error.message : String(error)}`);
  }
  if (isRecord2(report) && Object.keys(report).length === 1 && typeof report.blocked === "string" && report.blocked.trim().length > 0) {
    return unresolvedSemanticEvidence("no-matching-outcome", retainedSemanticEvidence(report, input.finalText), assertPlaybookFailureCause({
      code: "runtime-defect",
      evidence: { reason: `No declared outcome matches: ${report.blocked}` }
    }));
  }
  const { candidate, outcome } = snapshotSemanticCandidate(input.semanticCandidate, input.outcomes);
  const evidence = retainedSemanticEvidence(candidate, input.finalText);
  const finalText = typeof input.finalText === "string" ? input.finalText.trim() : void 0;
  if (finalText === void 0 || finalText.length === 0) {
    return unresolvedSemanticEvidence("missing-presentation-evidence", evidence);
  }
  if (input.receipt === void 0) {
    return unresolvedSemanticEvidence("missing-repository-receipt", evidence);
  }
  let receipt;
  try {
    const detachedReceipt = snapshotJsonValue(input.receipt, "semantic reconciliation receipt");
    receipt = effectReceipt(detachedReceipt, "semantic reconciliation receipt", void 0, void 0, false, Object.values(input.outcomes).map(({ repositoryDisposition }) => repositoryDisposition));
  } catch {
    return unresolvedSemanticEvidence("invalid-repository-receipt", evidence);
  }
  const disposition = outcome.repositoryDisposition;
  const dispositionMatches = disposition === "unchanged" && receipt.classification === "unchanged" || disposition === "one-descendant-commit" && receipt.classification === "one-descendant-commit" || disposition === "deferred" && candidate.guard === "needsBossReply" && Object.entries(input.outcomes).some(([guard, declared]) => guard !== candidate.guard && declared.repositoryDisposition === "one-descendant-commit") && (receipt.classification === "unchanged" || receipt.classification === "worktree-only-change") && receipt.after !== void 0 && receipt.after.head === receipt.baseline.head;
  if (!dispositionMatches) {
    return unresolvedSemanticEvidence("repository-disposition-mismatch", evidence, playbookRepositoryFailureCause(disposition, receipt));
  }
  let runtimeFields = Object.freeze({});
  if (input.runtimeFields !== void 0) {
    try {
      const detached = snapshotJsonValue(input.runtimeFields, "semantic reconciliation runtime fields");
      if (!isRecord2(detached)) {
        return unresolvedSemanticEvidence("inconsistent-runtime-evidence", evidence);
      }
      runtimeFields = detached;
    } catch {
      return unresolvedSemanticEvidence("inconsistent-runtime-evidence", evidence);
    }
  }
  const declaredRuntimeFields = Object.entries(outcome.fields).filter(([, authority]) => authority === "runtime").map(([field]) => field);
  if (Object.keys(runtimeFields).some((field) => !declaredRuntimeFields.includes(field))) {
    return unresolvedSemanticEvidence("inconsistent-runtime-evidence", evidence);
  }
  const output = {};
  defineEnumerableDataProperty(output, "guard", candidate.guard);
  for (const [field, authority] of Object.entries(outcome.fields)) {
    let value;
    if (authority === "semantic") {
      value = candidate[field];
    } else if (authority === "presentation") {
      value = finalText;
    } else if (authority === "effect") {
      value = disposition === "one-descendant-commit" ? receipt.commitOid : disposition === "unchanged" ? receipt.after?.head : void 0;
      if (value === void 0) {
        return unresolvedSemanticEvidence("missing-effect-evidence", evidence);
      }
    } else {
      const runtimeValue = runtimeFields[field];
      if (runtimeValue === void 0) {
        return unresolvedSemanticEvidence("missing-runtime-evidence", evidence);
      }
      if (typeof runtimeValue !== "string") {
        return unresolvedSemanticEvidence("inconsistent-runtime-evidence", evidence);
      }
      value = runtimeValue;
    }
    defineEnumerableDataProperty(output, field, value);
  }
  const detachedOutput = snapshotJsonValue(output, "reconciled semantic output");
  return Object.freeze({
    status: disposition === "deferred" ? "deferred" : "resolved",
    output: detachedOutput,
    evidence
  });
}
function effectPendingQuestion(value, path) {
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, ["questionId", "asker", "question", "sourceItem"], path);
  const questionId = requireNonEmptyString(value.questionId, `${path}.questionId`);
  const question = requireNonEmptyString(value.question, `${path}.question`);
  if (!isRecord2(value.asker)) {
    throw new TypeError(`${path}.asker must be an object`);
  }
  let asker;
  if (value.asker.kind === "captain") {
    rejectUnknownKeys(value.asker, ["kind"], `${path}.asker`);
    asker = { kind: "captain" };
  } else if (value.asker.kind === "role") {
    rejectUnknownKeys(value.asker, ["kind", "roleId"], `${path}.asker`);
    asker = {
      kind: "role",
      roleId: requireNonEmptyString(value.asker.roleId, `${path}.asker.roleId`)
    };
  } else {
    throw new TypeError(`${path}.asker.kind must be "captain" or "role"`);
  }
  return Object.freeze({
    questionId,
    asker: Object.freeze(asker),
    question,
    ...own(value, "sourceItem") ? {
      sourceItem: requireNonEmptyString(value.sourceItem, `${path}.sourceItem`)
    } : {}
  });
}
function effectBoundary(value, index) {
  const path = `effect ledger boundaries[${index}]`;
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, [
    "sequence",
    "boundaryId",
    "attemptId",
    "attemptNumber",
    "playbookId",
    "runtimeSessionId",
    "turnId",
    "callId",
    "roleId",
    "sourceStateId",
    "sourceOutcomeSchema",
    "dispositions",
    "canonicalWorktree",
    "baseline",
    "after",
    "physicalReceipt",
    "restored",
    "finalText",
    "semanticCandidate",
    "initialSemanticCandidate",
    "correctionBudget",
    "cohortId",
    "logicalOperationId"
  ], path);
  const sequence = effectInteger(value.sequence, `${path}.sequence`, 1);
  if (sequence !== index + 1) {
    throw new TypeError("effect ledger boundary sequence must be contiguous from one");
  }
  effectUuid(value.boundaryId, `${path}.boundaryId`);
  effectUuid(value.attemptId, `${path}.attemptId`);
  effectInteger(value.attemptNumber, `${path}.attemptNumber`, 1);
  requireNonEmptyString(value.playbookId, `${path}.playbookId`);
  effectUuid(value.runtimeSessionId, `${path}.runtimeSessionId`);
  effectInteger(value.turnId, `${path}.turnId`, 1);
  requireNonEmptyString(value.callId, `${path}.callId`);
  requireNonEmptyString(value.roleId, `${path}.roleId`);
  requireNonEmptyString(value.sourceStateId, `${path}.sourceStateId`);
  if (!own(value, "sourceOutcomeSchema")) {
    throw new TypeError(`${path}.sourceOutcomeSchema is required`);
  }
  if (!Array.isArray(value.dispositions) || value.dispositions.length === 0) {
    throw new TypeError(`${path}.dispositions must be a nonempty array`);
  }
  for (const [dispositionIndex, disposition] of value.dispositions.entries()) {
    if (typeof disposition !== "string" || !EFFECT_DISPOSITIONS.has(disposition)) {
      throw new TypeError(`${path}.dispositions[${dispositionIndex}] is not supported`);
    }
  }
  if (new Set(value.dispositions).size !== value.dispositions.length) {
    throw new TypeError(`${path}.dispositions must not contain duplicates`);
  }
  if (!isRecord2(value.canonicalWorktree)) {
    throw new TypeError(`${path}.canonicalWorktree must be an object`);
  }
  rejectUnknownKeys(value.canonicalWorktree, ["worktree", "gitDir"], `${path}.canonicalWorktree`);
  const canonicalWorktree = {
    worktree: requireNonEmptyString(value.canonicalWorktree.worktree, `${path}.canonicalWorktree.worktree`),
    gitDir: requireNonEmptyString(value.canonicalWorktree.gitDir, `${path}.canonicalWorktree.gitDir`)
  };
  const baseline = effectObservation(value.baseline, `${path}.baseline`);
  assertObservationIdentity(baseline, canonicalWorktree, `${path}.baseline`);
  const after = own(value, "after") ? effectObservation(value.after, `${path}.after`) : void 0;
  if (after !== void 0) {
    assertObservationIdentity(after, canonicalWorktree, `${path}.after`);
  }
  if (after !== void 0 && !own(value, "physicalReceipt")) {
    throw new TypeError(`${path}.after requires an atomic physicalReceipt`);
  }
  if (own(value, "physicalReceipt")) {
    effectReceipt(value.physicalReceipt, `${path}.physicalReceipt`, baseline, after, true, value.dispositions);
  }
  if (own(value, "finalText") && typeof value.finalText !== "string") {
    throw new TypeError(`${path}.finalText must be a string`);
  }
  if (own(value, "restored")) {
    const restored = effectObservation(value.restored, `${path}.restored`);
    if (!jsonValuesEqual(restored, baseline) || !isRecord2(value.physicalReceipt) || after?.head !== baseline.head || value.dispositions.some((item) => item !== "unchanged") || value.cohortId !== void 0 || value.logicalOperationId !== void 0) {
      throw new TypeError(`${path}.restored requires a standalone read-only call restored exactly without commit movement`);
    }
  }
  if (own(value, "initialSemanticCandidate")) {
    if (!own(value, "semanticCandidate") || !isRecord2(value.correctionBudget) || value.correctionBudget.spent !== true || jsonValuesEqual(value.initialSemanticCandidate, value.semanticCandidate)) {
      throw new TypeError(`${path}.initialSemanticCandidate requires a spent budget and a distinct current semanticCandidate`);
    }
  }
  if (own(value, "cohortId")) {
    effectUuid(value.cohortId, `${path}.cohortId`);
  }
  if (!isRecord2(value.correctionBudget)) {
    throw new TypeError(`${path}.correctionBudget must be an object`);
  }
  rejectUnknownKeys(value.correctionBudget, ["limit", "spent"], `${path}.correctionBudget`);
  if (value.correctionBudget.limit !== 1 || typeof value.correctionBudget.spent !== "boolean") {
    throw new TypeError(`${path}.correctionBudget must contain exactly limit 1 and a boolean spent`);
  }
  if (own(value, "logicalOperationId")) {
    effectUuid(value.logicalOperationId, `${path}.logicalOperationId`);
  }
  return value;
}
function effectLogicalOperation(value, index, boundaryById) {
  const path = `effect ledger logicalOperations[${index}]`;
  if (!isRecord2(value))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(value, [
    "sequence",
    "operationId",
    "playbookId",
    "runtimeSessionId",
    "boundaryIds",
    "originalBaseline",
    "checkpoint",
    "pendingQuestion",
    "playerContinuation",
    "checkpointRestorationEligible",
    "logicalReceipt"
  ], path);
  const sequence = effectInteger(value.sequence, `${path}.sequence`, 1);
  if (sequence !== index + 1) {
    throw new TypeError("effect ledger logical-operation sequence must be contiguous from one");
  }
  const operationId = effectUuid(value.operationId, `${path}.operationId`);
  const playbookId = requireNonEmptyString(value.playbookId, `${path}.playbookId`);
  const runtimeSessionId = effectUuid(value.runtimeSessionId, `${path}.runtimeSessionId`);
  if (!Array.isArray(value.boundaryIds) || value.boundaryIds.length === 0) {
    throw new TypeError(`${path}.boundaryIds must be a nonempty array`);
  }
  const boundaries = value.boundaryIds.map((boundaryId, boundaryIndex) => {
    const id = effectUuid(boundaryId, `${path}.boundaryIds[${boundaryIndex}]`);
    const boundary = boundaryById.get(id);
    if (boundary === void 0) {
      throw new TypeError(`${path}.boundaryIds[${boundaryIndex}] is dangling`);
    }
    if (boundary.playbookId !== playbookId || boundary.runtimeSessionId !== runtimeSessionId || boundary.logicalOperationId !== operationId) {
      throw new TypeError(`${path}.boundaryIds[${boundaryIndex}] does not belong to this logical operation`);
    }
    return boundary;
  });
  if (new Set(value.boundaryIds).size !== value.boundaryIds.length) {
    throw new TypeError(`${path}.boundaryIds must not contain duplicates`);
  }
  if (boundaries.some((boundary, boundaryIndex) => boundaryIndex > 0 && boundaries[boundaryIndex - 1].sequence >= boundary.sequence)) {
    throw new TypeError(`${path}.boundaryIds must follow physical boundary order`);
  }
  const originalBaseline = effectObservation(value.originalBaseline, `${path}.originalBaseline`);
  if (!jsonValuesEqual(originalBaseline, boundaries[0].baseline)) {
    throw new TypeError(`${path}.originalBaseline must equal its first boundary baseline`);
  }
  for (const [boundaryIndex, boundary] of boundaries.entries()) {
    assertObservationIdentity(boundary.baseline, originalBaseline, `${path}.boundaryIds[${boundaryIndex}] baseline`);
    if (boundaryIndex === 0)
      continue;
    const previous = boundaries[boundaryIndex - 1];
    if (previous.physicalReceipt === void 0 || previous.after === void 0 || !jsonValuesEqual(boundary.baseline, previous.after)) {
      throw new TypeError(`${path}.boundaryIds must form one completed checkpoint chain`);
    }
  }
  const checkpoint = own(value, "checkpoint") ? effectObservation(value.checkpoint, `${path}.checkpoint`) : void 0;
  const latestAfter = boundaries.at(-1).after;
  if (checkpoint !== void 0) {
    assertObservationIdentity(checkpoint, originalBaseline, `${path}.checkpoint`);
    if (latestAfter === void 0 || !jsonValuesEqual(checkpoint, latestAfter)) {
      throw new TypeError(`${path}.checkpoint must equal its latest boundary after`);
    }
  }
  const pendingQuestion = own(value, "pendingQuestion") ? effectPendingQuestion(value.pendingQuestion, `${path}.pendingQuestion`) : void 0;
  const bindingCount = [
    own(value, "checkpoint"),
    own(value, "pendingQuestion"),
    own(value, "playerContinuation")
  ].filter(Boolean).length;
  if (bindingCount !== 0 && bindingCount !== 3) {
    throw new TypeError(`${path} checkpoint, pendingQuestion, and playerContinuation must be all present or all absent`);
  }
  if (typeof value.checkpointRestorationEligible !== "boolean") {
    throw new TypeError(`${path}.checkpointRestorationEligible must be boolean`);
  }
  if (value.checkpointRestorationEligible && (checkpoint === void 0 || pendingQuestion === void 0 || !own(value, "playerContinuation"))) {
    throw new TypeError(`${path}.checkpointRestorationEligible requires checkpoint, pendingQuestion, and playerContinuation`);
  }
  if (own(value, "logicalReceipt")) {
    if (boundaries.some((boundary) => boundary.physicalReceipt === void 0)) {
      throw new TypeError(`${path}.logicalReceipt requires every physical boundary receipt`);
    }
    effectReceipt(value.logicalReceipt, `${path}.logicalReceipt`, originalBaseline, latestAfter, true, boundaries.at(-1).dispositions);
  }
  return value;
}
function assertPlaybookEffectLedger(value, path = "effect ledger") {
  const detached = snapshotJsonValue(value, path);
  if (!isRecord2(detached))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(detached, ["schemaVersion", "revision", "boundaries", "logicalOperations"], path);
  if (detached.schemaVersion !== 1) {
    throw new TypeError(`${path}.schemaVersion must equal 1`);
  }
  const revision = effectInteger(detached.revision, `${path}.revision`);
  if (!Array.isArray(detached.boundaries)) {
    throw new TypeError(`${path}.boundaries must be an array`);
  }
  if (!Array.isArray(detached.logicalOperations)) {
    throw new TypeError(`${path}.logicalOperations must be an array`);
  }
  const isEmpty = detached.boundaries.length === 0 && detached.logicalOperations.length === 0;
  if (revision === 0 !== isEmpty) {
    throw new TypeError(`${path}.revision must be zero if and only if both ordered ledgers are empty`);
  }
  const boundaries = detached.boundaries.map(effectBoundary);
  const boundaryById = new Map(boundaries.map((boundary) => [boundary.boundaryId, boundary]));
  if (boundaryById.size !== boundaries.length) {
    throw new TypeError(`${path}.boundaries must not reuse a boundaryId`);
  }
  const cohorts = /* @__PURE__ */ new Map();
  for (const boundary of boundaries) {
    if (boundary.cohortId === void 0)
      continue;
    const members = cohorts.get(boundary.cohortId) ?? [];
    members.push(boundary);
    cohorts.set(boundary.cohortId, members);
  }
  for (const [cohortId, members] of cohorts) {
    const first = members[0];
    const commonKeys = [
      "attemptId",
      "attemptNumber",
      "playbookId",
      "runtimeSessionId",
      "turnId",
      "canonicalWorktree",
      "baseline"
    ];
    if (members.length < 2 || members.some((boundary, index) => boundary.sequence !== first.sequence + index || !boundary.dispositions.every((disposition) => disposition === "unchanged") || !commonKeys.every((key) => jsonValuesEqual(boundary[key], first[key]))) || new Set(members.map((boundary) => boundary.roleId)).size !== members.length || new Set(members.map((boundary) => boundary.physicalReceipt === void 0 ? "started" : "complete")).size !== 1 || first.physicalReceipt !== void 0 && members.some((boundary) => !jsonValuesEqual(boundary.physicalReceipt, first.physicalReceipt) || !jsonValuesEqual(boundary.after, first.after))) {
      throw new TypeError(`effect ledger cohort ${JSON.stringify(cohortId)} is not one contiguous all-unchanged boundary group`);
    }
  }
  const logicalOperations = detached.logicalOperations.map((operation, index) => effectLogicalOperation(operation, index, boundaryById));
  const operationById = new Map(logicalOperations.map((operation) => [operation.operationId, operation]));
  if (operationById.size !== logicalOperations.length) {
    throw new TypeError(`${path}.logicalOperations must not reuse an operationId`);
  }
  for (const [index, operation] of logicalOperations.entries()) {
    const firstBoundary = boundaryById.get(operation.boundaryIds[0]);
    if (index > 0 && boundaryById.get(logicalOperations[index - 1].boundaryIds[0]).sequence >= firstBoundary.sequence) {
      throw new TypeError(`${path}.logicalOperations must follow their first physical boundary order`);
    }
  }
  for (const boundary of boundaries) {
    if (boundary.logicalOperationId !== void 0 && !operationById.has(boundary.logicalOperationId)) {
      throw new TypeError(`${path}.boundaries[${boundary.sequence - 1}].logicalOperationId is dangling`);
    }
    if (boundary.logicalOperationId !== void 0 && !operationById.get(boundary.logicalOperationId).boundaryIds.includes(boundary.boundaryId)) {
      throw new TypeError(`${path}.boundaries[${boundary.sequence - 1}].logicalOperationId has no reciprocal operation reference`);
    }
  }
  return detached;
}
function optionalEvidenceExtends(baseline, current, keys) {
  return keys.every((key) => !own(baseline, key) || own(current, key) && jsonValuesEqual(baseline[key], current[key]));
}
function isPlaybookEffectLedgerMonotonicExtension(baselineValue, currentValue) {
  let baseline;
  let current;
  try {
    baseline = assertPlaybookEffectLedger(baselineValue, "baseline effect ledger");
    current = assertPlaybookEffectLedger(currentValue, "current effect ledger");
  } catch {
    return false;
  }
  if (current.revision < baseline.revision || current.boundaries.length < baseline.boundaries.length || current.logicalOperations.length < baseline.logicalOperations.length) {
    return false;
  }
  if (current.revision === baseline.revision && !jsonValuesEqual(baseline, current)) {
    return false;
  }
  const boundaryStableKeys = [
    "sequence",
    "boundaryId",
    "attemptId",
    "attemptNumber",
    "playbookId",
    "runtimeSessionId",
    "turnId",
    "callId",
    "roleId",
    "sourceStateId",
    "sourceOutcomeSchema",
    "dispositions",
    "canonicalWorktree",
    "baseline",
    "cohortId"
  ];
  const boundaryEvidenceKeys = [
    "after",
    "physicalReceipt",
    "restored",
    "finalText",
    "initialSemanticCandidate"
  ];
  for (const [index, prior] of baseline.boundaries.entries()) {
    const next = current.boundaries[index];
    if (!boundaryStableKeys.every((key) => jsonValuesEqual(prior[key], next[key])) || !optionalEvidenceExtends(prior, next, boundaryEvidenceKeys) || !semanticCandidateExtends(prior, next) || prior.logicalOperationId !== void 0 && prior.logicalOperationId !== next.logicalOperationId || prior.correctionBudget.spent && !next.correctionBudget.spent) {
      return false;
    }
  }
  const operationStableKeys = [
    "sequence",
    "operationId",
    "playbookId",
    "runtimeSessionId",
    "originalBaseline"
  ];
  const operationEvidenceKeys = ["logicalReceipt"];
  for (const [index, prior] of baseline.logicalOperations.entries()) {
    const next = current.logicalOperations[index];
    if (!operationStableKeys.every((key) => jsonValuesEqual(prior[key], next[key])) || next.boundaryIds.length < prior.boundaryIds.length || !prior.boundaryIds.every((boundaryId, boundaryIndex) => boundaryId === next.boundaryIds[boundaryIndex]) || !optionalEvidenceExtends(prior, next, operationEvidenceKeys)) {
      return false;
    }
  }
  return true;
}
function semanticCandidateExtends(prior, next) {
  if (prior.semanticCandidate === void 0) {
    return !prior.correctionBudget.spent || next.initialSemanticCandidate === void 0;
  }
  if (next.semanticCandidate !== void 0 && jsonValuesEqual(prior.semanticCandidate, next.semanticCandidate)) {
    return prior.initialSemanticCandidate !== void 0 || next.initialSemanticCandidate === void 0;
  }
  return prior.initialSemanticCandidate === void 0 && next.correctionBudget.spent && next.initialSemanticCandidate !== void 0 && jsonValuesEqual(prior.semanticCandidate, next.initialSemanticCandidate);
}
function snapshotSuspendedCall(value, path = "runtime snapshot suspendedCall") {
  const captured = snapshotJsonValue(value, path);
  if (!isRecord2(captured)) {
    throw new TypeError(`${path} must be an object`);
  }
  rejectUnknownKeys(captured, [
    "callId",
    "stateId",
    "playbookId",
    "text",
    "childSessionId",
    "turnId",
    "effectBoundaryPrefixSequence"
  ], path);
  const call = {
    callId: requireNonEmptyString(captured.callId, `${path}.callId`),
    stateId: requireNonEmptyString(captured.stateId, `${path}.stateId`),
    playbookId: requireNonEmptyString(captured.playbookId, `${path}.playbookId`),
    text: requireNonEmptyString(captured.text, `${path}.text`),
    childSessionId: requireNonEmptyString(captured.childSessionId, `${path}.childSessionId`)
  };
  if (own(captured, "turnId")) {
    if (!Number.isSafeInteger(captured.turnId) || captured.turnId <= 0) {
      throw new TypeError(`${path}.turnId must be a positive integer`);
    }
    call.turnId = captured.turnId;
  }
  if (own(captured, "effectBoundaryPrefixSequence")) {
    call.effectBoundaryPrefixSequence = captured.effectBoundaryPrefixSequence === null ? null : effectInteger(captured.effectBoundaryPrefixSequence, `${path}.effectBoundaryPrefixSequence`);
  }
  return Object.freeze(call);
}
function assertPlaybookRuntimeSnapshot(value, expectedPlaybookId, options = {}) {
  const snapshot = snapshotJsonValue(value, "runtime snapshot");
  if (!isRecord2(snapshot)) {
    throw new TypeError("runtime snapshot must be an object");
  }
  const capturedOptions = snapshotJsonValue(options, "runtime snapshot validation options");
  if (!isRecord2(capturedOptions)) {
    throw new TypeError("runtime snapshot validation options must be an object");
  }
  rejectUnknownKeys(capturedOptions, ["allowSuspendedCall"], "runtime snapshot validation options");
  if (capturedOptions.allowSuspendedCall !== void 0 && typeof capturedOptions.allowSuspendedCall !== "boolean") {
    throw new TypeError("runtime snapshot validation options.allowSuspendedCall must be boolean");
  }
  const allowSuspendedCall = capturedOptions.allowSuspendedCall ?? false;
  if (snapshot.schemaVersion !== 4) {
    throw new TypeError(`runtime snapshot schemaVersion ${String(snapshot.schemaVersion)} is not supported (expected 4)`);
  }
  rejectUnknownKeys(snapshot, [
    "schemaVersion",
    "playbookId",
    "machine",
    "roleResumeTokens",
    "sequences",
    "state",
    "pendingBossQuestions",
    "effectLedger",
    "retainedEffectSourceSessionId",
    "retainedEffectReconciliation",
    "failedEffectAttempt",
    "recoveryCheckpoint",
    "suspendedCall"
  ], "runtime snapshot");
  let suspendedCall;
  if (own(snapshot, "suspendedCall")) {
    suspendedCall = snapshotSuspendedCall(snapshot.suspendedCall);
    if (!allowSuspendedCall) {
      throw new TypeError("runtime snapshot suspendedCall requires a restore path that explicitly allows it");
    }
  }
  const playbookId = requireNonEmptyString(snapshot.playbookId, "runtime snapshot playbookId");
  if (playbookId !== expectedPlaybookId) {
    throw new TypeError(`runtime snapshot playbookId ${playbookId} does not match runtime playbook ${expectedPlaybookId}`);
  }
  if (!isRecord2(snapshot.machine)) {
    throw new TypeError("runtime snapshot machine must be an object");
  }
  const machine = snapshot.machine;
  if (!isRecord2(snapshot.roleResumeTokens)) {
    throw new TypeError("runtime snapshot roleResumeTokens must be an object");
  }
  const roleResumeTokens = {};
  for (const [roleId, token] of Object.entries(snapshot.roleResumeTokens)) {
    defineEnumerableDataProperty(roleResumeTokens, requireNonEmptyString(roleId, "runtime snapshot roleResumeTokens role id"), requireNonEmptyString(token, `runtime snapshot roleResumeTokens.${roleId}`));
  }
  if (!isRecord2(snapshot.sequences)) {
    throw new TypeError("runtime snapshot sequences must be an object");
  }
  rejectUnknownKeys(snapshot.sequences, [...SNAPSHOT_SEQUENCE_KEYS, "captainCall"], "runtime snapshot sequences");
  const sequences = {};
  for (const key of SNAPSHOT_SEQUENCE_KEYS) {
    const sequence = snapshot.sequences[key];
    if (!Number.isSafeInteger(sequence) || sequence < 0) {
      throw new TypeError(`runtime snapshot sequences.${key} must be a non-negative integer`);
    }
    sequences[key] = sequence;
  }
  const captainCall = snapshot.sequences.captainCall;
  if (captainCall !== void 0) {
    if (!Number.isSafeInteger(captainCall) || captainCall < 0) {
      throw new TypeError("runtime snapshot sequences.captainCall must be a non-negative integer");
    }
    sequences.captainCall = captainCall;
  }
  validateState(snapshot.state, "runtime snapshot state");
  const state = snapshot.state;
  if (state.tags.includes(SUSPENDED_TAG) && suspendedCall === void 0) {
    throw new TypeError(`runtime snapshot state tagged ${SUSPENDED_TAG} requires suspendedCall`);
  }
  if (suspendedCall) {
    if (sequences.playbookCall === 0) {
      throw new TypeError("runtime snapshot suspendedCall requires sequences.playbookCall greater than zero");
    }
    if (suspendedCall.turnId !== void 0 && suspendedCall.turnId > sequences.turn) {
      throw new TypeError("runtime snapshot suspendedCall.turnId must not exceed sequences.turn");
    }
    if (state.status !== "active" || !state.quiescent) {
      throw new TypeError("runtime snapshot suspendedCall requires an active quiescent state");
    }
    if (!state.tags.includes(SUSPENDED_TAG)) {
      throw new TypeError(`runtime snapshot suspendedCall requires state tag ${SUSPENDED_TAG}`);
    }
    if (!state.activeStateIds.includes(suspendedCall.stateId)) {
      throw new TypeError("runtime snapshot suspendedCall.stateId must be active in snapshot state");
    }
  }
  if (!Array.isArray(snapshot.pendingBossQuestions)) {
    throw new TypeError("runtime snapshot pendingBossQuestions must be an array");
  }
  const pendingBossQuestions = snapshot.pendingBossQuestions.map((entry2, index) => {
    const path = `runtime snapshot pendingBossQuestions[${index}]`;
    if (!isRecord2(entry2))
      throw new TypeError(`${path} must be an object`);
    rejectUnknownKeys(entry2, ["questionId", "asker", "question", "sourceItem"], path);
    if (!isRecord2(entry2.asker)) {
      throw new TypeError(`${path}.asker must be an object`);
    }
    let asker;
    if (entry2.asker.kind === "captain") {
      rejectUnknownKeys(entry2.asker, ["kind"], `${path}.asker`);
      asker = Object.freeze({ kind: "captain" });
    } else if (entry2.asker.kind === "role") {
      rejectUnknownKeys(entry2.asker, ["kind", "roleId"], `${path}.asker`);
      asker = Object.freeze({
        kind: "role",
        roleId: requireNonEmptyString(entry2.asker.roleId, `${path}.asker.roleId`)
      });
    } else {
      throw new TypeError(`${path}.asker.kind must be "captain" or "role"`);
    }
    const question = {
      questionId: requireNonEmptyString(entry2.questionId, `${path}.questionId`),
      asker,
      question: requireNonEmptyString(entry2.question, `${path}.question`),
      ...entry2.sourceItem === void 0 ? {} : {
        sourceItem: requireNonEmptyString(entry2.sourceItem, `${path}.sourceItem`)
      }
    };
    return Object.freeze(question);
  });
  const effectLedger = assertPlaybookEffectLedger(snapshot.effectLedger, "runtime snapshot effectLedger");
  const retainedEffectSourceSessionId = own(snapshot, "retainedEffectSourceSessionId") ? effectUuid(snapshot.retainedEffectSourceSessionId, "runtime snapshot retainedEffectSourceSessionId") : void 0;
  let retainedEffectReconciliation;
  if (own(snapshot, "retainedEffectReconciliation")) {
    if (!isRecord2(snapshot.retainedEffectReconciliation)) {
      throw new TypeError("runtime snapshot retainedEffectReconciliation must be an object");
    }
    rejectUnknownKeys(snapshot.retainedEffectReconciliation, ["sourceSessionId", "checkpoint"], "runtime snapshot retainedEffectReconciliation");
    const sourceSessionId = effectUuid(snapshot.retainedEffectReconciliation.sourceSessionId, "runtime snapshot retainedEffectReconciliation.sourceSessionId");
    const checkpoint = assertPlaybookEffectLedger(snapshot.retainedEffectReconciliation.checkpoint, "runtime snapshot retainedEffectReconciliation.checkpoint");
    if (checkpoint.boundaries.some(({ physicalReceipt }) => physicalReceipt === void 0)) {
      throw new TypeError("runtime snapshot retainedEffectReconciliation.checkpoint contains an incomplete physical boundary");
    }
    if (!isPlaybookEffectLedgerMonotonicExtension(checkpoint, effectLedger)) {
      throw new TypeError("runtime snapshot retainedEffectReconciliation.checkpoint is not a monotonic prefix of effectLedger");
    }
    if (retainedEffectSourceSessionId === void 0 || retainedEffectSourceSessionId !== sourceSessionId) {
      throw new TypeError("runtime snapshot retainedEffectReconciliation.sourceSessionId must equal retainedEffectSourceSessionId");
    }
    retainedEffectReconciliation = Object.freeze({
      sourceSessionId,
      checkpoint
    });
  }
  if (typeof suspendedCall?.effectBoundaryPrefixSequence === "number" && suspendedCall.effectBoundaryPrefixSequence > (effectLedger.boundaries.at(-1)?.sequence ?? 0)) {
    throw new TypeError("runtime snapshot suspendedCall.effectBoundaryPrefixSequence exceeds the effect ledger");
  }
  let failedEffectAttempt;
  if (own(snapshot, "failedEffectAttempt")) {
    if (state.stateId !== "failed") {
      throw new TypeError("runtime snapshot failedEffectAttempt requires the failed state");
    }
    if (!isRecord2(snapshot.failedEffectAttempt)) {
      throw new TypeError("runtime snapshot failedEffectAttempt must be an object");
    }
    rejectUnknownKeys(snapshot.failedEffectAttempt, ["boundaryPrefix", "attemptId"], "runtime snapshot failedEffectAttempt");
    const boundaryPrefix = effectInteger(snapshot.failedEffectAttempt.boundaryPrefix, "runtime snapshot failedEffectAttempt.boundaryPrefix");
    const lastBoundarySequence = effectLedger.boundaries.at(-1)?.sequence ?? 0;
    if (boundaryPrefix > lastBoundarySequence) {
      throw new TypeError("runtime snapshot failedEffectAttempt.boundaryPrefix exceeds the effect ledger");
    }
    const attemptId = snapshot.failedEffectAttempt.attemptId === null ? null : effectUuid(snapshot.failedEffectAttempt.attemptId, "runtime snapshot failedEffectAttempt.attemptId");
    const causalBoundaries = effectLedger.boundaries.filter(({ sequence }) => sequence > boundaryPrefix);
    if (attemptId === null && causalBoundaries.length !== 0) {
      throw new TypeError("runtime snapshot failedEffectAttempt null attemptId requires an empty causal suffix");
    }
    if (attemptId !== null && (causalBoundaries.length === 0 || causalBoundaries.some(({ attemptId: boundaryAttemptId }) => boundaryAttemptId !== attemptId))) {
      throw new TypeError("runtime snapshot failedEffectAttempt does not match its causal ledger suffix");
    }
    failedEffectAttempt = Object.freeze({ boundaryPrefix, attemptId });
  }
  let recoveryCheckpoint;
  if (own(snapshot, "recoveryCheckpoint")) {
    const checkpoint = snapshot.recoveryCheckpoint;
    if (state.stateId !== "failed" && pendingBossQuestions.length === 0 || !isRecord2(checkpoint)) {
      throw new TypeError("runtime recoveryCheckpoint requires an interrupted state and an object");
    }
    rejectUnknownKeys(checkpoint, ["stateId", "prompt", "machine", "boundaryPrefix", "result", "id", "delivered"], "runtime recoveryCheckpoint");
    const stateId = requireNonEmptyString(checkpoint.stateId, "recoveryCheckpoint.stateId");
    const prompt = requireNonEmptyString(checkpoint.prompt, "recoveryCheckpoint.prompt");
    const boundaryPrefix = checkpoint.boundaryPrefix;
    if (!Number.isSafeInteger(boundaryPrefix) || typeof boundaryPrefix !== "number" || boundaryPrefix < 0 || boundaryPrefix > effectLedger.boundaries.length || !isRecord2(checkpoint.machine) || checkpoint.machine.status !== "active" || checkpoint.machine.value !== stateId) {
      throw new TypeError("runtime recoveryCheckpoint has an invalid machine or boundary prefix");
    }
    if (own(checkpoint, "delivered") && checkpoint.delivered !== true) {
      throw new TypeError("recoveryCheckpoint.delivered must be true");
    }
    recoveryCheckpoint = Object.freeze({ stateId, prompt, boundaryPrefix, machine: snapshotJsonValue(checkpoint.machine), ...own(checkpoint, "id") ? { id: effectUuid(checkpoint.id, "recoveryCheckpoint.id") } : {}, ...own(checkpoint, "result") ? { result: snapshotJsonValue(checkpoint.result) } : {}, ...checkpoint.delivered === true ? { delivered: true } : {} });
  }
  const fields = {
    playbookId,
    machine,
    roleResumeTokens: Object.freeze(roleResumeTokens),
    sequences: Object.freeze(sequences),
    state,
    pendingBossQuestions: Object.freeze(pendingBossQuestions),
    effectLedger,
    ...retainedEffectSourceSessionId === void 0 ? {} : { retainedEffectSourceSessionId },
    ...retainedEffectReconciliation === void 0 ? {} : { retainedEffectReconciliation },
    ...failedEffectAttempt === void 0 ? {} : { failedEffectAttempt },
    ...recoveryCheckpoint === void 0 ? {} : { recoveryCheckpoint }
  };
  return Object.freeze({
    schemaVersion: 4,
    ...fields,
    ...suspendedCall === void 0 ? {} : { suspendedCall }
  });
}
var NestedPlaybookCallError = class extends Error {
  result;
  constructor(result) {
    const fallback = result.status === "ok" ? `Child playbook ${result.playbookId} reached failure terminal ${result.terminal?.stateId ?? "unknown"}` : `Child playbook ${result.playbookId} ${result.status}`;
    const normalized = result.status === "ok" ? void 0 : result.error;
    super(normalized?.message ?? fallback);
    this.name = normalized?.name ?? "NestedPlaybookCallError";
    if (normalized?.stack)
      this.stack = normalized.stack;
    this.result = result;
    attachPlaybookFailureCause(this, {
      code: "child-failed",
      evidence: {
        playbookId: result.playbookId,
        ...normalized?.cause === void 0 ? {} : { cause: normalized.cause }
      }
    });
  }
};
function validateState(state, path) {
  if (!isRecord2(state))
    throw new TypeError(`${path} must be an object`);
  rejectUnknownKeys(state, ["value", "activeStateIds", "tags", "status", "quiescent", "stateId"], path);
  normalizeStateValue(state.value, `${path}.value`);
  if (!Array.isArray(state.activeStateIds)) {
    throw new TypeError(`${path}.activeStateIds must be an array`);
  }
  state.activeStateIds.forEach((value, index) => {
    requireNonEmptyString(value, `${path}.activeStateIds[${index}]`);
  });
  if (new Set(state.activeStateIds).size !== state.activeStateIds.length) {
    throw new TypeError(`${path}.activeStateIds must not contain duplicates`);
  }
  if (!Array.isArray(state.tags) || !state.tags.every((tag) => typeof tag === "string" && tag.trim().length > 0)) {
    throw new TypeError(`${path}.tags must be a non-empty string array`);
  }
  if (new Set(state.tags).size !== state.tags.length) {
    throw new TypeError(`${path}.tags must not contain duplicates`);
  }
  if (state.status !== "active" && state.status !== "done" && state.status !== "error" && state.status !== "stopped") {
    throw new TypeError(`${path}.status is invalid`);
  }
  if (typeof state.quiescent !== "boolean") {
    throw new TypeError(`${path}.quiescent must be boolean`);
  }
  if (own(state, "stateId")) {
    const stateId = requireNonEmptyString(state.stateId, `${path}.stateId`);
    if (state.activeStateIds.length !== 1 || state.activeStateIds[0] !== stateId) {
      throw new TypeError(`${path}.stateId must equal the sole active state id`);
    }
  }
}
function rejectUnknownKeys(value, allowed, path) {
  const allowedKeys = new Set(allowed);
  for (const key of Object.keys(value)) {
    if (!allowedKeys.has(key)) {
      throw new TypeError(`${path}.${key} is not a declared property`);
    }
  }
}
function validateRunStatus(status, path) {
  if (status !== "ok" && status !== "aborted" && status !== "error") {
    throw new TypeError(`${path} is invalid`);
  }
}
function validateOptionalString(value, key, path) {
  if (own(value, key) && typeof value[key] !== "string") {
    throw new TypeError(`${path}.${key} must be a string`);
  }
}
function validateCaptainResult(value, path = "Captain result") {
  const result = snapshotJsonValue(value, path);
  if (!isRecord2(result)) {
    throw new TypeError(`${path} must be an object`);
  }
  rejectUnknownKeys(result, ["status", "finalText", "error"], path);
  validateRunStatus(result.status, `${path}.status`);
  validateOptionalString(result, "finalText", path);
  validateOptionalString(result, "error", path);
  return result;
}
function validatePlayerResult(value, path = "player result") {
  const result = snapshotJsonValue(value, path);
  if (!isRecord2(result)) {
    throw new TypeError(`${path} must be an object`);
  }
  rejectUnknownKeys(result, ["status", "resumeToken", "finalText", "error"], path);
  validateRunStatus(result.status, `${path}.status`);
  validateOptionalString(result, "resumeToken", path);
  if (result.resumeToken !== void 0) {
    requireNonEmptyString(result.resumeToken, `${path}.resumeToken`);
  }
  validateOptionalString(result, "finalText", path);
  validateOptionalString(result, "error", path);
  return result;
}
function validateNormalizedError(error, path) {
  if (!isRecord2(error)) {
    throw new TypeError(`${path} must be a normalized error`);
  }
  rejectUnknownKeys(error, ["name", "message", "stack", "cause"], path);
  requireNonEmptyString(error.name, `${path}.name`);
  if (typeof error.message !== "string") {
    throw new TypeError(`${path}.message must be a string`);
  }
  if (error.stack !== void 0 && typeof error.stack !== "string") {
    throw new TypeError(`${path}.stack must be a string`);
  }
  if (error.cause !== void 0)
    assertPlaybookFailureCause(error.cause);
}
function validateTerminalOutcome(value) {
  if (!isRecord2(value)) {
    throw new TypeError("playbook result terminal must be an object");
  }
  rejectUnknownKeys(value, ["stateId", "kind", "description"], "playbook result terminal");
  requireNonEmptyString(value.stateId, "playbook result terminal stateId");
  if (value.kind !== "success" && value.kind !== "failure") {
    throw new TypeError("playbook result terminal kind must be 'success' or 'failure'");
  }
  if (own(value, "description") && typeof value.description !== "string") {
    throw new TypeError("playbook result terminal description must be a string");
  }
}
function isFailureTerminal(result) {
  return result.status === "ok" && result.terminal?.kind === "failure";
}
function validatePlaybookCallResult(result, expectedPlaybookId, expectedChildSessionId) {
  const capturedResult = snapshotJsonValue(result, "playbook result");
  if (!isRecord2(capturedResult)) {
    throw new TypeError("playbook result must be an object");
  }
  if (capturedResult.status !== "ok" && capturedResult.status !== "aborted" && capturedResult.status !== "error") {
    throw new TypeError("playbook result status is invalid");
  }
  if (capturedResult.playbookId !== expectedPlaybookId) {
    throw new PlaybookCallIdentityError(`playbook result target ${String(capturedResult.playbookId)} does not match ${expectedPlaybookId}`);
  }
  if (capturedResult.status === "ok") {
    rejectUnknownKeys(capturedResult, ["status", "playbookId", "childSessionId", "state", "output", "terminal"], "playbook result");
    requireNonEmptyString(capturedResult.childSessionId, "playbook result childSessionId");
    if (own(capturedResult, "terminal")) {
      validateTerminalOutcome(capturedResult.terminal);
    }
  } else {
    rejectUnknownKeys(capturedResult, ["status", "playbookId", "childSessionId", "state", "error"], "playbook result");
  }
  if (capturedResult.status !== "ok" && own(capturedResult, "childSessionId")) {
    requireNonEmptyString(capturedResult.childSessionId, "playbook result childSessionId");
  }
  if (expectedChildSessionId !== void 0 && capturedResult.childSessionId !== expectedChildSessionId) {
    throw new PlaybookCallIdentityError(`playbook result child session ${String(capturedResult.childSessionId)} does not match ${expectedChildSessionId}`);
  }
  if (own(capturedResult, "state"))
    validateState(capturedResult.state, "playbook result state");
  if (capturedResult.status === "error" && !own(capturedResult, "error")) {
    throw new TypeError("playbook error result requires a normalized error");
  }
  if (capturedResult.status !== "ok" && capturedResult.error !== void 0) {
    validateNormalizedError(capturedResult.error, "playbook result error");
  }
  return capturedResult;
}
var PlaybookCallIdentityError = class extends TypeError {
};
function validatePlaybookCallStart(start, expectedPlaybookId) {
  const capturedStart = snapshotJsonValue(start, "playbook call start");
  if (!isRecord2(capturedStart)) {
    throw new TypeError("playbook call start must be an object");
  }
  if (capturedStart.state === "settled") {
    rejectUnknownKeys(capturedStart, ["state", "result"], "playbook call start");
    return Object.freeze({
      state: "settled",
      result: validatePlaybookCallResult(capturedStart.result, expectedPlaybookId)
    });
  }
  if (capturedStart.state === "suspended") {
    rejectUnknownKeys(capturedStart, ["state", "childSessionId"], "playbook call start");
    const childSessionId = requireNonEmptyString(capturedStart.childSessionId, "playbook call start childSessionId");
    return Object.freeze({
      state: "suspended",
      childSessionId
    });
  }
  throw new TypeError("playbook call start state is invalid");
}
function assignedChildSessionId(start) {
  if (!isRecord2(start))
    return void 0;
  try {
    const startDescriptors = Object.getOwnPropertyDescriptors(start);
    const state = capturedDataValue(startDescriptors, "state", "playbook call start state", false);
    if (state === "suspended") {
      const childSessionId2 = capturedDataValue(startDescriptors, "childSessionId", "playbook call start childSessionId", false);
      return typeof childSessionId2 === "string" && childSessionId2.trim().length > 0 ? childSessionId2 : void 0;
    }
    if (state !== "settled")
      return void 0;
    const result = capturedDataValue(startDescriptors, "result", "playbook call start result", false);
    if (!isRecord2(result))
      return void 0;
    const resultDescriptors = Object.getOwnPropertyDescriptors(result);
    const childSessionId = capturedDataValue(resultDescriptors, "childSessionId", "playbook result childSessionId", false);
    return typeof childSessionId === "string" && childSessionId.trim().length > 0 ? childSessionId : void 0;
  } catch {
    return void 0;
  }
}
function resultFromThrown(playbookId, childSessionId, error, aborted) {
  const normalized = normalizeError(error);
  const result = aborted ? {
    status: "aborted",
    playbookId,
    ...childSessionId ? { childSessionId } : {},
    error: normalized
  } : {
    status: "error",
    playbookId,
    ...childSessionId ? { childSessionId } : {},
    error: normalized
  };
  return snapshotJsonValue(result, "playbook result");
}
function outputOrThrow(result) {
  if (result.status === "ok" && !isFailureTerminal(result)) {
    return result.output;
  }
  throw new NestedPlaybookCallError(result);
}
function createNestedPlaybookBridge(options) {
  let current;
  let restoreMode;
  let disposed = false;
  const usedCallIds = /* @__PURE__ */ new Set();
  const pendingListeners = /* @__PURE__ */ new Set();
  const reportBackgroundError = (error, aborts) => {
    if (aborts?.isAbortReason(error))
      return;
    try {
      options.onBackgroundError?.(error, aborts);
    } catch {
    }
  };
  const reportControlPlaneError = (error, aborts) => {
    if (aborts?.isAbortReason(error))
      return;
    try {
      options.onControlPlaneError?.(error, aborts);
    } catch (callbackError) {
      reportBackgroundError(callbackError, aborts);
    }
  };
  const rejectControlPlane = (error) => {
    reportControlPlaneError(error);
    throw error;
  };
  const pendingIdentity = (active) => active?.phase === "suspended" && active.childSessionId ? {
    callId: active.callId,
    playbookId: active.input.playbookId,
    childSessionId: active.childSessionId
  } : void 0;
  const suspendedIdentity = (active) => active?.phase === "suspended" && active.childSessionId ? Object.freeze({
    callId: active.callId,
    stateId: active.input.stateId,
    playbookId: active.input.playbookId,
    text: active.input.text,
    childSessionId: active.childSessionId,
    ...active.turnId === void 0 ? {} : { turnId: active.turnId }
  }) : void 0;
  const failRestoreMode = (mode, error) => {
    mode.state = "failed";
    mode.error = error;
    reportControlPlaneError(error);
  };
  const detachAbortListener = (active) => {
    if (active.abortListener) {
      active.signal.removeEventListener("abort", active.abortListener);
      active.abortListener = void 0;
    }
  };
  const clear = (active) => {
    detachAbortListener(active);
    if (current === active)
      current = void 0;
  };
  const reportNonAbortControlError = (error, aborts) => {
    reportControlPlaneError(error, aborts);
  };
  const emitFinish = async (active, result, aborts) => {
    await options.emitFinished({
      callId: active.callId,
      stateId: active.input.stateId,
      playbookId: active.input.playbookId,
      text: active.input.text,
      result
    }, aborts);
    await options.drain(aborts);
  };
  const finishImmediate = async (active, result, controlError, resultAfterAbortCleanup) => {
    const aborts = active.aborts;
    let effectiveResult = result;
    let cleanupControlError;
    if (result.status === "aborted" || active.signal.aborted) {
      try {
        await drainPlaybookAbortCleanups(active.signal, aborts);
      } catch (error) {
        if (!aborts.isAbortReason(error)) {
          cleanupControlError = error;
          reportControlPlaneError(error, aborts);
          effectiveResult = resultFromThrown(active.input.playbookId, active.childSessionId, error, false);
        }
      }
      if (cleanupControlError === void 0 && resultAfterAbortCleanup) {
        effectiveResult = resultAfterAbortCleanup();
      }
    }
    let finishControlError;
    try {
      await emitFinish(active, effectiveResult, aborts);
    } catch (error) {
      reportNonAbortControlError(error, aborts);
      finishControlError = error;
    } finally {
      clear(active);
      options.bindActorSettlement?.(aborts);
    }
    if (controlError !== void 0)
      throw controlError;
    if (cleanupControlError !== void 0)
      throw cleanupControlError;
    if (finishControlError !== void 0)
      throw finishControlError;
    return outputOrThrow(effectiveResult);
  };
  const settlePending = async (active, result, controlError, aborts = active.aborts) => {
    if (active.phase === "settling" && active.settlement) {
      await active.settlement;
      return;
    }
    if (active.phase !== "suspended") {
      throw new Error(`playbook call ${active.callId} is not suspended`);
    }
    active.phase = "settling";
    const settlement = (async () => {
      let effectiveResult = result;
      let cleanupControlError;
      if (result.status === "aborted" || active.signal.aborted) {
        if (result.status !== "aborted" && active.signal.aborted) {
          effectiveResult = resultFromThrown(active.input.playbookId, active.childSessionId, active.signal.reason, true);
        }
        try {
          await drainPlaybookAbortCleanups(active.signal, aborts);
        } catch (cleanupError) {
          if (!aborts.isAbortReason(cleanupError)) {
            cleanupControlError = cleanupError;
            reportControlPlaneError(cleanupError, aborts);
            effectiveResult = resultFromThrown(active.input.playbookId, active.childSessionId, cleanupError, false);
          }
        }
      }
      try {
        await emitFinish(active, effectiveResult, aborts);
      } catch (error) {
        reportControlPlaneError(error, aborts);
        clear(active);
        options.bindActorSettlement?.(aborts);
        active.deferred.reject(error);
        throw error;
      }
      clear(active);
      options.bindActorSettlement?.(aborts);
      if (controlError !== void 0) {
        active.deferred.reject(controlError);
      } else if (cleanupControlError !== void 0) {
        active.deferred.reject(cleanupControlError);
      } else if (effectiveResult.status === "ok" && !isFailureTerminal(effectiveResult)) {
        active.deferred.resolve(effectiveResult.output);
      } else {
        active.deferred.reject(new NestedPlaybookCallError(effectiveResult));
      }
      if (cleanupControlError !== void 0)
        throw cleanupControlError;
    })();
    active.settlement = settlement;
    try {
      await settlement;
    } catch (error) {
      await active.finished.promise;
      throw error;
    }
  };
  const rollbackRestoredCall = (mode, error) => {
    const active = mode.active;
    mode.state = "failed";
    mode.error = error;
    mode.active = void 0;
    if (!active)
      return void 0;
    active.phase = "settling";
    active.restoreRolledBack = true;
    clear(active);
    usedCallIds.delete(active.callId);
    options.bindActorSettlement?.(active.aborts);
    active.deferred.reject(error);
    return active;
  };
  const publishSuspendedCall = (active) => {
    if (active.phase !== "suspended") {
      throw new Error(`playbook call ${active.callId} is not suspended`);
    }
    const abortListener = () => {
      if (active.phase !== "suspended")
        return;
      const result = resultFromThrown(active.input.playbookId, active.childSessionId, active.signal.reason, true);
      void settlePending(active, result).catch((error) => {
        reportBackgroundError(error, active.aborts);
      });
    };
    active.abortListener = abortListener;
    active.signal.addEventListener("abort", abortListener, { once: true });
    const pendingCall = pendingIdentity(active);
    if (!pendingCall) {
      throw new Error("suspended call identity was not recorded");
    }
    for (const listener of pendingListeners) {
      try {
        listener(pendingCall);
      } catch (error) {
        reportBackgroundError(error, active.aborts);
      }
    }
    if (active.signal.aborted)
      abortListener();
  };
  const waitOnSuspendedCall = async (active) => {
    publishSuspendedCall(active);
    return await active.deferred.promise;
  };
  const actorLogic = fromPromise(async ({ input, signal: invocationSignal }) => {
    if (disposed) {
      rejectControlPlane(new Error("nested playbook bridge is disposed"));
    }
    const normalizedInput = (() => {
      try {
        return {
          stateId: requireNonEmptyString(input.stateId, "playbook input stateId"),
          playbookId: requireNonEmptyString(input.playbookId, "playbook input playbookId"),
          text: requireNonEmptyString(input.text, "playbook input text")
        };
      } catch (error) {
        const mode2 = restoreMode;
        if (mode2) {
          if (mode2.state === "claimed") {
            rollbackRestoredCall(mode2, error);
            reportControlPlaneError(error);
          } else
            failRestoreMode(mode2, error);
          throw error;
        }
        return rejectControlPlane(error);
      }
    })();
    const mode = restoreMode;
    if (mode) {
      if (mode.state !== "armed") {
        const callId2 = mode.call?.callId ?? "without a descriptor";
        const error = new Error(mode.state === "claimed" ? `restored playbook call ${callId2} was claimed more than once` : `restored playbook call ${callId2} is no longer claimable`);
        if (mode.state === "claimed")
          rollbackRestoredCall(mode, error);
        else
          mode.error ??= error;
        reportControlPlaneError(error);
        throw error;
      }
      const seed = mode.call;
      if (!seed) {
        const error = new Error("restored machine invoked a nested playbook without a suspendedCall descriptor");
        failRestoreMode(mode, error);
        throw error;
      }
      for (const field of ["stateId", "playbookId", "text"]) {
        if (normalizedInput[field] !== seed[field]) {
          const error = new Error(`restored playbook call ${seed.callId} ${field} does not match its persisted input`);
          failRestoreMode(mode, error);
          throw error;
        }
      }
      if (usedCallIds.has(seed.callId)) {
        const error = new Error(`restored duplicate playbook call id ${seed.callId}`);
        failRestoreMode(mode, error);
        throw error;
      }
      const controller2 = new AbortController();
      let callSignal2;
      let callAborts2;
      try {
        const boundarySignal = options.getBoundarySignal?.();
        callSignal2 = combineAbortSignals(invocationSignal, boundarySignal, controller2.signal);
        callAborts2 = createAbortReasonClassifier(invocationSignal, boundarySignal, controller2.signal);
      } catch (error) {
        failRestoreMode(mode, error);
        throw error;
      }
      const active2 = {
        callId: seed.callId,
        input: normalizedInput,
        ...seed.turnId === void 0 ? {} : { turnId: seed.turnId },
        deferred: deferred(),
        finished: deferred(),
        controller: controller2,
        signal: callSignal2,
        aborts: callAborts2,
        phase: "restoring",
        childSessionId: seed.childSessionId
      };
      usedCallIds.add(active2.callId);
      current = active2;
      mode.state = "claimed";
      mode.active = active2;
      const restoreAbortListener = () => {
        if (restoreMode !== mode || mode.state !== "claimed" || mode.active !== active2 || active2.phase !== "restoring") {
          return;
        }
        rollbackRestoredCall(mode, active2.signal.reason);
      };
      active2.abortListener = restoreAbortListener;
      active2.signal.addEventListener("abort", restoreAbortListener, {
        once: true
      });
      if (active2.signal.aborted)
        restoreAbortListener();
      try {
        return await active2.deferred.promise;
      } catch (error) {
        if (!active2.restoreRolledBack)
          active2.runError = error;
        throw error;
      } finally {
        active2.finished.resolve(void 0);
      }
    }
    if (current) {
      rejectControlPlane(new Error(`playbook call ${current.callId} is already outstanding`));
    }
    const callId = (() => {
      try {
        return requireNonEmptyString(options.nextCallId(), "allocated playbook call id");
      } catch (error) {
        return rejectControlPlane(error);
      }
    })();
    if (usedCallIds.has(callId)) {
      rejectControlPlane(new Error(`allocated duplicate playbook call id ${callId}`));
    }
    usedCallIds.add(callId);
    const controller = new AbortController();
    let callSignal;
    let callAborts;
    try {
      const boundarySignal = options.getBoundarySignal?.();
      callSignal = combineAbortSignals(invocationSignal, boundarySignal, controller.signal);
      callAborts = createAbortReasonClassifier(invocationSignal, boundarySignal, controller.signal);
    } catch (error) {
      return rejectControlPlane(error);
    }
    const active = {
      callId,
      input: normalizedInput,
      deferred: deferred(),
      finished: deferred(),
      controller,
      signal: callSignal,
      aborts: callAborts,
      phase: "starting"
    };
    current = active;
    try {
      try {
        await options.drain(active.aborts);
      } catch (error) {
        reportNonAbortControlError(error, active.aborts);
        clear(active);
        throw error;
      }
      try {
        await options.emitStarted({ callId, ...normalizedInput }, active.aborts);
      } catch (error) {
        const controlError = active.aborts.isAbortReason(error) ? void 0 : error;
        if (controlError !== void 0) {
          reportControlPlaneError(controlError, active.aborts);
        }
        return await finishImmediate(active, resultFromThrown(normalizedInput.playbookId, void 0, error, controlError === void 0), controlError);
      }
      try {
        await options.drain(active.aborts);
      } catch (error) {
        const controlError = active.aborts.isAbortReason(error) ? void 0 : error;
        if (controlError !== void 0) {
          reportControlPlaneError(controlError, active.aborts);
        }
        return await finishImmediate(active, resultFromThrown(normalizedInput.playbookId, void 0, error, controlError === void 0), controlError);
      }
      const request = {
        callId,
        playbookId: normalizedInput.playbookId,
        text: normalizedInput.text
      };
      let rawStart;
      let observedStart;
      let startSettled = false;
      let removeOpeningAbortListener = () => void 0;
      try {
        if (active.signal.aborted)
          throw active.signal.reason;
        const starting = options.callPlaybook(request, active.signal).then((value) => {
          observedStart = value;
          startSettled = true;
          return value;
        }, (error) => {
          startSettled = true;
          throw error;
        });
        const openingCleanup = starting.then(() => void 0, (error) => {
          if (active.aborts.isAbortReason(error))
            return;
          throw error;
        });
        void openingCleanup.catch(() => void 0);
        const registerOpeningCleanup = () => registerPlaybookAbortCleanup(active.signal, openingCleanup);
        removeOpeningAbortListener = () => active.signal.removeEventListener("abort", registerOpeningCleanup);
        if (active.signal.aborted)
          registerOpeningCleanup();
        else {
          active.signal.addEventListener("abort", registerOpeningCleanup, {
            once: true
          });
        }
        rawStart = await withAbort(starting, active.signal);
      } catch (error) {
        const controlError = active.aborts.isAbortReason(error) ? void 0 : error;
        if (controlError !== void 0) {
          reportControlPlaneError(controlError, active.aborts);
        }
        const result = resultFromThrown(normalizedInput.playbookId, void 0, error, controlError === void 0 && active.signal.aborted);
        return await finishImmediate(active, result, controlError, controlError === void 0 && active.signal.aborted ? () => resultFromThrown(normalizedInput.playbookId, startSettled ? assignedChildSessionId(observedStart) : void 0, error, true) : void 0);
      } finally {
        removeOpeningAbortListener();
      }
      let start;
      try {
        start = validatePlaybookCallStart(rawStart, normalizedInput.playbookId);
      } catch (error) {
        reportControlPlaneError(error);
        const childSessionId = assignedChildSessionId(rawStart);
        active.childSessionId = childSessionId;
        if (isRecord2(rawStart) && rawStart.state === "suspended" && !active.controller.signal.aborted) {
          active.controller.abort(error);
        }
        return await finishImmediate(active, resultFromThrown(normalizedInput.playbookId, childSessionId, error, false), error);
      }
      if (active.signal.aborted) {
        return await finishImmediate(active, resultFromThrown(normalizedInput.playbookId, start.state === "suspended" ? start.childSessionId : void 0, active.signal.reason, true));
      }
      if (start.state === "settled") {
        return await finishImmediate(active, start.result);
      }
      active.phase = "suspended";
      active.childSessionId = start.childSessionId;
      return await waitOnSuspendedCall(active);
    } catch (error) {
      active.runError = error;
      throw error;
    } finally {
      active.finished.resolve(void 0);
    }
  });
  const abortPending = async (error = new Error("Nested playbook call aborted")) => {
    const mode = restoreMode;
    if (mode) {
      restoreMode = void 0;
      const restored = mode.state === "claimed" ? rollbackRestoredCall(mode, error) : void 0;
      if (restored)
        await restored.finished.promise;
      return;
    }
    const active = current;
    if (!active)
      return;
    if (!active.controller.signal.aborted)
      active.controller.abort(error);
    if (active.phase === "starting") {
      await active.finished.promise;
      if (active.runError !== void 0 && !(active.runError instanceof NestedPlaybookCallError)) {
        throw active.runError;
      }
      return;
    }
    if (active.phase === "settling" && active.settlement) {
      await active.settlement;
      await active.finished.promise;
      return;
    }
    const pendingCall = pendingIdentity(active);
    if (!pendingCall)
      return;
    await settlePending(active, resultFromThrown(pendingCall.playbookId, pendingCall.childSessionId, error, true));
    await active.finished.promise;
  };
  return {
    actorLogic,
    getPendingCall: () => pendingIdentity(current),
    getSuspendedCall: () => suspendedIdentity(current),
    checkpointCall: (child) => current && current.callId === child.callId && current.input.playbookId === child.playbookId ? { ...child, stateId: current.input.stateId, text: current.input.text, ...current.turnId === void 0 ? {} : { turnId: current.turnId } } : void 0,
    prepareRestore(call) {
      const captured = call === void 0 ? void 0 : snapshotSuspendedCall(call, "restored playbook call");
      if (disposed) {
        rejectControlPlane(new Error("nested playbook bridge is disposed"));
      }
      if (current) {
        rejectControlPlane(new Error(`playbook call ${current.callId} is already outstanding`));
      }
      if (restoreMode) {
        rejectControlPlane(new Error("nested playbook bridge restore is already prepared"));
      }
      if (captured && usedCallIds.has(captured.callId)) {
        rejectControlPlane(new Error(`restored duplicate playbook call id ${captured.callId}`));
      }
      restoreMode = {
        ...captured === void 0 ? {} : { call: captured },
        state: "armed"
      };
    },
    confirmRestore() {
      const mode = restoreMode;
      if (!mode) {
        throw new Error("nested playbook bridge restore is not prepared");
      }
      if (mode.state === "failed") {
        restoreMode = void 0;
        throw mode.error;
      }
      if (mode.call === void 0) {
        restoreMode = void 0;
        return;
      }
      if (mode.state !== "claimed" || !mode.active) {
        const error = new Error(`restored playbook call ${mode.call.callId} was not claimed by actor startup`);
        restoreMode = void 0;
        reportControlPlaneError(error);
        throw error;
      }
      const active = mode.active;
      if (active.signal.aborted) {
        const error = active.signal.reason;
        rollbackRestoredCall(mode, error);
        restoreMode = void 0;
        throw error;
      }
      try {
        detachAbortListener(active);
        active.phase = "suspended";
        restoreMode = void 0;
        publishSuspendedCall(active);
      } catch (error) {
        rollbackRestoredCall(mode, error);
        restoreMode = void 0;
        reportControlPlaneError(error);
        throw error;
      }
    },
    subscribePendingCall(listener) {
      if (disposed)
        return () => void 0;
      pendingListeners.add(listener);
      const pendingCall = pendingIdentity(current);
      if (pendingCall) {
        try {
          listener(pendingCall);
        } catch (error) {
          reportBackgroundError(error, current?.aborts);
        }
      }
      return () => pendingListeners.delete(listener);
    },
    async resume({ callId, result, signal }) {
      const active = current;
      const pendingCall = pendingIdentity(active);
      if (!active || !pendingCall) {
        throw new Error(`unknown or stale playbook call id ${callId}`);
      }
      if (callId !== pendingCall.callId) {
        const error = new PlaybookCallIdentityError(`playbook call id ${callId} does not match ${pendingCall.callId}`);
        reportControlPlaneError(error);
        throw error;
      }
      let validatedResult;
      try {
        validatedResult = validatePlaybookCallResult(result, pendingCall.playbookId, pendingCall.childSessionId);
      } catch (error) {
        reportControlPlaneError(error);
        if (!(error instanceof PlaybookCallIdentityError)) {
          await settlePending(active, resultFromThrown(pendingCall.playbookId, pendingCall.childSessionId, error, false), error);
          await active.finished.promise;
        }
        throw error;
      }
      if (signal.aborted) {
        throw signal.reason;
      }
      const resumeAborts = createAbortReasonClassifier(active.aborts, signal);
      options.bindResumeSignal?.(signal, resumeAborts);
      await settlePending(active, validatedResult, void 0, resumeAborts);
    },
    abortPending,
    async dispose() {
      if (disposed)
        return;
      disposed = true;
      try {
        const active = current;
        await abortPending(new Error("Nested playbook bridge disposed"));
        if (active?.runError !== void 0 && !(active.runError instanceof NestedPlaybookCallError)) {
          throw active.runError;
        }
      } finally {
        restoreMode = void 0;
        pendingListeners.clear();
      }
    }
  };
}
async function waitForPlaybookQuiescence(actor, options = {}) {
  const current = actor.getSnapshot();
  const normalized = normalizePlaybookSnapshot(current, {
    pendingCall: options.pendingCalls?.getPendingCall()
  });
  if (normalized.quiescent)
    return current;
  const waitOptions = {
    ...options.timeout === void 0 ? {} : { timeout: options.timeout }
  };
  const waitController = options.pendingCalls ? new AbortController() : void 0;
  const forwardAbort = () => waitController?.abort(options.signal?.reason);
  if (waitController && options.signal) {
    if (options.signal.aborted)
      forwardAbort();
    else
      options.signal.addEventListener("abort", forwardAbort, { once: true });
  }
  const snapshotWait = waitFor(actor, (snapshot) => normalizePlaybookSnapshot(snapshot, {
    pendingCall: options.pendingCalls?.getPendingCall()
  }).quiescent, {
    ...waitOptions,
    ...waitController ? { signal: waitController.signal } : options.signal ? { signal: options.signal } : {}
  });
  if (!options.pendingCalls)
    return snapshotWait;
  let unsubscribe = () => void 0;
  const pendingWait = new Promise((resolve) => {
    unsubscribe = options.pendingCalls?.subscribePendingCall(() => {
      const snapshot = actor.getSnapshot();
      if (normalizePlaybookSnapshot(snapshot, {
        pendingCall: options.pendingCalls?.getPendingCall()
      }).quiescent) {
        resolve(snapshot);
      }
    }) ?? unsubscribe;
  });
  try {
    return await Promise.race([snapshotWait, pendingWait]);
  } finally {
    unsubscribe();
    waitController?.abort(new Error("Playbook quiescence already settled"));
    options.signal?.removeEventListener("abort", forwardAbort);
  }
}

// ../../../.spex-workshop-261011/work/T06/graph-crate/spex-packages/contrib/playbooks/en/contrib/contrib.playbook/contrib.playbook.ts
var OPTION_SCHEMA = {};
var INPUT_MAPPING = {};
var RESUMABLE_STATE_IDS = /* @__PURE__ */ new Set([
  "implement",
  "reviewImplementation",
  "addressFindings",
  "reviewFix",
  "reviewRejection",
  "openPullRequest",
  "openDraftPullRequest"
]);
var UNFINISHED_FINAL_STATE_IDS = /* @__PURE__ */ new Set([
  "implementationBlocked",
  "prNotOpened"
]);
var VERBATIM_PAYLOAD_FIELDS = /* @__PURE__ */ new Set([
  "contributorOutput",
  "maintainerOutput"
]);
function validateOptions(value) {
  const captured = snapshotJsonValue(value === void 0 ? {} : value, "CONTRIB runtime options");
  if (captured === null || typeof captured !== "object" || Array.isArray(captured)) {
    throw new TypeError("CONTRIB runtime options must be an object");
  }
  const fields = captured;
  for (const key of Object.keys(captured)) {
    if (!Object.hasOwn(OPTION_SCHEMA, key)) throw new TypeError("CONTRIB runtime options." + key + " is not declared");
  }
  for (const [key, schema] of Object.entries(OPTION_SCHEMA)) {
    if (!Object.hasOwn(captured, key)) {
      if (schema.required) throw new TypeError("CONTRIB runtime options." + key + " is required");
    } else if (typeof fields[key] !== schema.type || schema.type === "number" && !Number.isFinite(fields[key])) {
      throw new TypeError("CONTRIB runtime options." + key + " must be a " + schema.type);
    }
  }
  return captured;
}
function renderPlayerPrompt(input, promptIdentity, resuming = false) {
  const fields = input;
  const mapping = {};
  const identities = {};
  const omitted = /* @__PURE__ */ new Set([]);
  const fieldFor = (token) => Object.hasOwn(mapping, token) ? mapping[token] : token === "#" ? "irNumber" : token.replace(/-([A-Za-z0-9_$])/g, (_match, next) => next.toUpperCase());
  const parts = input.prompt.split(/(\r?\n)/);
  let body = "";
  for (let index = 0; index < parts.length; index += 2) {
    const line = parts[index];
    if (omitted.has(line)) {
      const token = /<(#|[A-Za-z_$][A-Za-z0-9_$-]*)>$/.exec(line)[1];
      if (fields[fieldFor(token)] === "") continue;
    }
    body += line.replace(/<(#|[A-Za-z_$][A-Za-z0-9_$-]*)>/g, (match, token) => {
      const value = Object.hasOwn(identities, token) ? promptIdentity(identities[token]) : fields[fieldFor(token)];
      if (typeof value !== "string") return match;
      return line.startsWith("> ") ? value.replace(/\r?\n/g, (ending) => ending + "> ") : value;
    }) + (parts[index + 1] ?? "");
  }
  return composePlayerContinuation(input, body, resuming);
}
var composePlayerPrompt = (input, promptIdentity, resuming) => renderPlayerPrompt(input, promptIdentity, resuming);
var runtimeSpec = {
  composePlayerPrompt,
  ...{
    "label": "CONTRIB",
    "compat": {
      "artifactSchema": 3,
      "runtimeAbi": 1
    },
    "entryEvent": {
      "type": "START_CONTRIB",
      "textField": "callerInput",
      "contextField": "callerInput"
    },
    "bossEvents": [],
    "roleStates": {
      "implement": {
        "role": "contributor",
        "label": "Contributor implements the request on a new branch with one commit and cargo test passing."
      },
      "reviewImplementation": {
        "role": "maintainer",
        "label": "Maintainer reviews the Contributor's implementation commit in review round 1."
      },
      "addressFindings": {
        "role": "contributor",
        "label": "Contributor fixes or rejects each of Maintainer's round-1 findings, committing any fixes in one new commit."
      },
      "reviewFix": {
        "role": "maintainer",
        "label": "Maintainer reviews the Contributor's fix commit and dispositions in review round 2, the final round."
      },
      "reviewRejection": {
        "role": "maintainer",
        "label": "Maintainer reviews the Contributor's rejection of every finding in review round 2, the final round."
      },
      "openPullRequest": {
        "role": "contributor",
        "label": "Contributor pushes the branch and opens a ready pull request after a review with no open findings."
      },
      "openDraftPullRequest": {
        "role": "contributor",
        "label": "Contributor pushes the branch and opens a draft pull request listing the findings still open after review round 2."
      }
    },
    "outcomeAuthority": {
      "governedPlayerStates": {
        "implement": {
          "committed": {
            "fields": {
              "contributorOutput": "presentation",
              "branch": "semantic",
              "latestCommit": "effect"
            },
            "repositoryDisposition": "one-descendant-commit"
          },
          "blocked": {
            "fields": {
              "contributorOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "deferred"
          }
        },
        "reviewImplementation": {
          "hasFindings": {
            "fields": {
              "maintainerOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "noFindings": {
            "fields": {},
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "unchanged"
          }
        },
        "addressFindings": {
          "fixed": {
            "fields": {
              "contributorOutput": "presentation",
              "latestCommit": "effect"
            },
            "repositoryDisposition": "one-descendant-commit"
          },
          "rejectedAll": {
            "fields": {
              "contributorOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "deferred"
          }
        },
        "reviewFix": {
          "hasFindings": {
            "fields": {
              "maintainerOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "noFindings": {
            "fields": {},
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "unchanged"
          }
        },
        "reviewRejection": {
          "hasFindings": {
            "fields": {
              "maintainerOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "noFindings": {
            "fields": {},
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "unchanged"
          }
        },
        "openPullRequest": {
          "opened": {
            "fields": {
              "pullRequestUrl": "semantic",
              "branch": "semantic"
            },
            "repositoryDisposition": "unchanged"
          },
          "notOpened": {
            "fields": {
              "contributorOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "unchanged"
          }
        },
        "openDraftPullRequest": {
          "openedDraft": {
            "fields": {
              "pullRequestUrl": "semantic",
              "branch": "semantic"
            },
            "repositoryDisposition": "unchanged"
          },
          "notOpened": {
            "fields": {
              "contributorOutput": "presentation"
            },
            "repositoryDisposition": "unchanged"
          },
          "needsBossReply": {
            "fields": {
              "question": "presentation"
            },
            "repositoryDisposition": "unchanged"
          }
        }
      }
    },
    "placeholderFields": {},
    "transitionEventFields": [
      "callerInput",
      "targetId",
      "answer",
      "questionId"
    ],
    "controlContextFields": []
  },
  snapshotOptions: validateOptions,
  machineInput: (options) => Object.fromEntries(
    Object.entries(INPUT_MAPPING).filter(([, key]) => options[key] !== void 0).map(([field, key]) => [field, options[key]])
  ),
  verbatimPayloadFields: VERBATIM_PAYLOAD_FIELDS,
  resumableStateIds: RESUMABLE_STATE_IDS,
  unfinishedFinalStateIds: UNFINISHED_FINAL_STATE_IDS
};
var createPlaybookRuntime = createXStatePlaybookRuntime(contribMachine, runtimeSpec);
var contrib_playbook_default = createPlaybookRuntime;

// ../../../.spex-workshop-261011/work/T06/graph-crate/spex-packages/contrib/playbooks/en/contrib/contrib.ts
var REQUIRED_ROLE_IDS = ["contributor", "maintainer"];
var validateOptions2 = validateOptions;
var entry = {
  id: "contrib",
  command: "contrib",
  intent: "Contrib \u2014 Roles:",
  artifactSchema: 3,
  runtimeProfile: Object.freeze({
    kind: "shared-factory",
    compat: contrib_playbook_default.compat
  }),
  concurrentRoleSets: [],
  requiredRoleIds: [...REQUIRED_ROLE_IDS],
  validateOptions: validateOptions2,
  createRuntime(options, hostCapabilities) {
    const validated = validateOptions2(options.captainOptions);
    return contrib_playbook_default({
      configuredOptions: validated,
      hostCapabilities
    });
  }
};
var contrib_default = entry;

// ../../../.spex-workshop-261011/work/T06/graph-crate/spex-packages/contrib/playbooks/en/contrib/contrib.registry.ts
var spexRegistryContract = 3;
var contrib_registry_default = {
  ...contrib_default,
  command: "contrib",
  intent: "Implement an issue on its own branch, review it in up to two rounds, and open a pull request"
};
export {
  contrib_registry_default as default,
  spexRegistryContract
};
