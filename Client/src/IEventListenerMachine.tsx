type IMaterial = "metal" | "polymers" | "glass" | "composites";

type Item = {
  /**
   * time it took for an item to be produced in milliseconds
   */
  leadTime: number;
  quantity: number;
  material: IMaterial;
  id: string;
};

export type IPopulateExistingItemsEvent = {
  type: "POPULATE_EXISTING_ITEMS";
  items: Item[];
};

export type INewOrChangedItemEvent = {
  type: "NEW_OR_CHANGED_ITEM";
  item: Item;
};

export type IEventListenerEvent =
  | IPopulateExistingItemsEvent
  | INewOrChangedItemEvent;

export interface IEventListenerContext {
  items: Item[];

  indexOfHighlightedItemThatChanged: number | undefined;
}
