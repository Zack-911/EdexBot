import { BaseCommand } from "@tryforge/forgescript"

export default new BaseCommand({
  name: "eval",
  type: "messageCreate",
  code: `
    $onlyIf[$authorID==$botOwnerID]
    $eval[$message]
  `
})