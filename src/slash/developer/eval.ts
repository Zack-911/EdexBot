import { ApplicationCommand } from "@tryforge/forgescript"
import { ApplicationCommandOptionType, ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from "discord.js"

export default new ApplicationCommand({
  data: {
    type: ApplicationCommandType.ChatInput,
    name: "eval",
    description: "[Developer] Evaluate your code",
    options: [
      {
        name: "code",
        description: "The code to evaluate",
        type: ApplicationCommandOptionType.String,
        required: true
      }
    ],
    contexts: [
      InteractionContextType.Guild,
      InteractionContextType.BotDM,
      InteractionContextType.PrivateChannel
    ],
    integration_types: [
      ApplicationIntegrationType.UserInstall
    ]
  },
  code: `
    $onlyIf[$authorID==$botOwnerID;$ephemeral You cannot use this command]
    $eval[$option[code]]
  `
})
