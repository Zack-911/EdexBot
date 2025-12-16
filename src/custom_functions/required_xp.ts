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
    $return[$djsEval[  
      const BASE_XP = 100;
      const GROWTH_RATE = 1.25;

      const xpForNextLevel = Math.floor(
        BASE_XP * Math.pow(GROWTH_RATE, $env[level] - 1)
      );
    
      const currentXp = Number($env[current_xp] || 0)
      Math.max(0, xpForNextLevel - currentXp)
  ]]
  `
})