import { ApplicationCommand } from "@tryforge/forgescript"
import { ApplicationCommandType, ApplicationIntegrationType, InteractionContextType } from "discord.js"

export default new ApplicationCommand({
  data: {
    type: ApplicationCommandType.ChatInput,
    name: "update",
    description: "[Developer] Update the bot",
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
    $onlyIf[$authorID==$botOwnerID==true;$ephemeral You cannot use this command]
    $let[AppCount;$applicationCommandCount]
    $let[PrefixCount;$commandCount]
    $updateApplicationCommands
    $updateCommands
    $let[NewAppCount;$math[$applicationCommandCount-$get[AppCount]]]
    $let[NewPrefixCount;$math[$commandCount-$get[PrefixCount]]]
    $let[AppAction;$if[$get[NewAppCount]>=0;Added;Removed]]
    $let[PrefixAction;$if[$get[NewPrefixCount]>=0;Added;Removed]]
    $let[AppCountText;$if[$get[NewAppCount]>=0;$get[NewAppCount];$math[$get[NewAppCount]*-1]]]
    $let[PrefixCountText;$if[$get[NewPrefixCount]>=0;$get[NewPrefixCount];$math[$get[NewPrefixCount]*-1]]]
    $addContainer[
      $addTextDisplay[**🔧 Command Update Summary**]
      $addSeparator[Small;true]
      $addTextDisplay[**$get[AppAction] $get[AppCountText] Application Command$if[$get[AppCountText]!=1;s;]\n$get[PrefixAction] $get[PrefixCountText] Prefix Command$if[$get[PrefixCountText]!=1;s;]**]
      $addSeparator[Small;true]
      $addTextDisplay[**📊 Total Commands**\n• Application: $applicationCommandCount\n• Prefix: $commandCount\n• **Combined:** $math[$applicationCommandCount+$commandCount]]
    ]
    $logger[Info;Updated Commands]
  `
})