import { BaseCommand } from "@tryforge/forgescript"
import type { Command } from "src/types";

export default new BaseCommand({
  name: "eval",
  aliases: ["e"],
  type: "messageCreate",
  description: "Evaluate code",
  module: "dev",
  usage: "eval <code>",
  version: "1.0.0",
  params: [
    {
      name: "code",
      description: "The code to eval",
      required: true,
    }
  ],
  code: `
    $onlyIf[$authorID==$botOwnerID]
    $eval[$message]
  `
} satisfies Command)