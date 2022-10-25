import { randomUUID as uuid } from "crypto";
import { rollDice, shouldModifyExistingItem } from "./rng";

/**
 * Let TypeScript understand we're dealing with constant types
 */
const materials = ["metal", "polymers", "glass", "composites"] as const;

/**
 * [number] is a special TypeScript syntax that creates an union type between
 * all the materials
 */
type IMaterial = typeof materials[number];

export type IEntry = {
  leadTime: number;
  material: IMaterial;
  id: string;
  quantity: number;
};

type IFactory = {
  produceOrChangeItem: () => IEntry;
  getItems: () => IEntry[];
};

/**
 * Fake factory producing data sources or modifying existing ones
 */
export const startFactory = (): IFactory => {
  let producedItems: IEntry[] = [];

  let start = process.hrtime.bigint();

  return {
    getItems: () => producedItems,
    produceOrChangeItem: () => {
      const end = process.hrtime.bigint();

      const leadTimeInNanoSeconds = end - start;
      const leadTime = Number(leadTimeInNanoSeconds / 1000000n);
      start = process.hrtime.bigint();
      const material = materials[Math.floor(Math.random() * materials.length)];

      const isChangingItem =
        producedItems.length >= 1 && shouldModifyExistingItem();

      /** Either chooses the id of an existing item, or creates a new uuid */
      const id = isChangingItem
        ? producedItems[rollDice(producedItems.length) - 1].id
        : uuid();

      const quantity = rollDice(10);
      const item: IEntry = {
        material,
        leadTime,
        id,
        quantity,
      };

      producedItems = isChangingItem
        ? producedItems.map((existingItem) =>
            existingItem.id === id ? item : existingItem
          )
        : [...producedItems, item];

      return item;
    },
  };
};
