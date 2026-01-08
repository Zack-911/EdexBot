import { ForgeFunction, ArgType } from "@tryforge/forgescript";

export default new ForgeFunction({
  name: "getRequiredXp",
  params: [
    {
      name: "level",
      required: true,
      type: ArgType.Number,
      rest: false
    },
    {
      name: "current_xp",
      required: false,
      type: ArgType.Number,
      rest: false
    }
  ],
  code: `
    $return[$djsEval[(() => {
      let level = Number($env[level]);
      const currentXpInput = $env[current_xp];
      
      // The Formula: 10 * (L^2) + 50 * L
      const getXpForLevel = (lvl) => Math.floor(10 * Math.pow(lvl, 2) + 50 * lvl);

      if (currentXpInput === undefined || currentXpInput === null || currentXpInput === "") {
        return getXpForLevel(level);
      }

      let currentXp = Number(currentXpInput);
      let levelsGained = 0;
      
      while (true) {
        const xpNeeded = getXpForLevel(level);
        if (currentXp >= xpNeeded) {
          currentXp -= xpNeeded;
          level++;
          levelsGained++;
        } else {
          break;
        }
      }

      return level + "," + currentXp + "," + (levelsGained > 0);
    })()]]
  `
})