import { assign, createMachine } from "xstate";
import {
  IEventListenerContext,
  IEventListenerEvent,
} from "./IEventListenerMachine";

export const defaultEventListenerContext: IEventListenerContext = {
  items: [],
  indexOfHighlightedItemThatChanged: undefined,
};

export const eventListenerMachine = createMachine(
  {
    id: "event-listener",
    initial: "factoryListener",
    schema: {
      context: {} as IEventListenerContext,
      events: {} as IEventListenerEvent,
    },
    predictableActionArguments: true,
    context: defaultEventListenerContext,
    tsTypes: {} as import("./EventListenerMachine.typegen").Typegen0,
    states: {
      factoryListener: {
        invoke: {
          src: "listening",
          onDone: {
            target: "success",
            actions: (context, event) =>
              void console.log("Finished listening to events", {
                context,
                event,
              }),
          },
          onError: {
            target: "error",
            actions: (context, event) =>
              void console.error("An unexpected error has occurred.", {
                context,
                event,
              }),
          },
        },
      },
      success: {
        always: {
          target: "factoryListener",
        },
      },
      error: {
        always: {
          target: "factoryListener",
        },
      },
    },
    on: {
      NEW_OR_CHANGED_ITEM: {
        actions: "assignEntry",
      },
      POPULATE_EXISTING_ITEMS: {
        cond: "hasItems",
        actions: "assignEntries",
      },
    },
  },
  {
    actions: {
      assignEntries: assign({
        items: (context, event) => [...context.items, ...event.items],
      }),
      assignEntry: assign((context, event) => {
        const { items } = context;
        const indexOfChangedItem = items.findIndex(
          ({ id }) => id === event.item.id
        );
        const hasItemChanged = indexOfChangedItem !== -1;
        const { item } = event;

        return {
          items: hasItemChanged
            ? context.items.map((existingItem) =>
                existingItem.id === item.id ? item : existingItem
              )
            : [...context.items, item],
          /**
           * If a new item is added, we are no longer highlighting the last
           * changed item
           */
          indexOfHighlightedItemThatChanged: hasItemChanged
            ? indexOfChangedItem
            : undefined,
        };
      }),
    },
    services: {
      listening: (context, event) => (send, onReceive) => {
        const events = new EventSource("http://localhost:3000/listener");

        events.onmessage = (serverSentEvent) => {
          const event = JSON.parse(serverSentEvent.data);

          send(event);
        };

        // Cleanup
        return () => events.close();
      },
    },
    guards: {
      hasItems: (context, event) => event.items.length > 0,
    },
  }
);
