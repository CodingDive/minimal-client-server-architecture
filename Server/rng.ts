export const rollDice = (edges = 6) => Math.floor(Math.random() * edges) + 1;

/**
 * Rolls a dice and checks if a value should be modified (1/6 probability).
 */
export const shouldModifyExistingItem = () => rollDice() === 1;
