// This file was automatically generated. Edits will be overwritten

export interface Typegen0 {
  "@@xstate/typegen": true;
  internalEvents: {
    "": { type: "" };
    "done.invoke.event-listener.factoryListener:invocation[0]": {
      type: "done.invoke.event-listener.factoryListener:invocation[0]";
      data: unknown;
      __tip: "See the XState TS docs to learn how to strongly type this.";
    };
    "error.platform.event-listener.factoryListener:invocation[0]": {
      type: "error.platform.event-listener.factoryListener:invocation[0]";
      data: unknown;
    };
    "xstate.init": { type: "xstate.init" };
  };
  invokeSrcNameMap: {
    listening: "done.invoke.event-listener.factoryListener:invocation[0]";
  };
  missingImplementations: {
    actions: never;
    services: never;
    guards: never;
    delays: never;
  };
  eventsCausingActions: {
    assignEntries: "POPULATE_EXISTING_ITEMS";
    assignEntry: "NEW_OR_CHANGED_ITEM";
  };
  eventsCausingServices: {
    listening: "" | "xstate.init";
  };
  eventsCausingGuards: {
    hasItems: "POPULATE_EXISTING_ITEMS";
  };
  eventsCausingDelays: {};
  matchesStates: "error" | "factoryListener" | "success";
  tags: never;
}
