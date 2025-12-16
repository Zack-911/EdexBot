import { BaseCommand } from "@tryforge/forgescript"

export default new BaseCommand({
  name: "eval",
  aliases: ["e"],
  type: "messageCreate",
  code: `
    $onlyIf[$authorID==$botOwnerID]
    $eval[$message]
  `
})