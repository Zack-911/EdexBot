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
      const BASE_XP = 100;
      const GROWTH_RATE = 1.10;

      let level = Number($env[level]);
      const currentXpInput = $env[current_xp];
      
      if (currentXpInput === undefined || currentXpInput === null || currentXpInput === "") {
        return Math.floor(
          BASE_XP * Math.pow(GROWTH_RATE, level - 1)
        );
      }

      let currentXp = Number(currentXpInput);
      if (isNaN(currentXp)) {
        return Math.floor(
          BASE_XP * Math.pow(GROWTH_RATE, level - 1)
        );
      }

      let levelsGained = 0;
      
      while (true) {
        const xpForNextLevel = Math.floor(
          BASE_XP * Math.pow(GROWTH_RATE, level - 1)
        );
        
        if (currentXp >= xpForNextLevel) {
          currentXp -= xpForNextLevel;
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