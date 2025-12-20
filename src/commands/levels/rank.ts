import { BaseCommand } from "@tryforge/forgescript";

export default new BaseCommand({
  name: "rank",
  aliases: ["r"],
  type: "messageCreate",
  guildOnly: true,
  allowBots: false,
  code: `
    $let[user;$default[$mentioned[0];$authorID]]
    $let[level;$getMemberVar[level;$get[user];$guildID;1]]
    $let[xp;$getMemberVar[xp;$get[user];$guildID;0]]
    $let[req;$getRequiredXp[$get[level]]]

    $let[card;$djsEval[
      (async () => {
        const { createCanvas, loadImage } = require("@napi-rs/canvas");
      
        const width = 900;
        const height = 300;
        const canvas = createCanvas(width, height);
        const ctx = canvas.getContext("2d");
      
        // ---- Layout math ----
        const padding = width * 0.045;
        const avatarSize = height * 0.42;
        const avatarX = padding;
        const avatarY = (height - avatarSize) / 2;
        const contentX = avatarX + avatarSize + padding;
        const contentWidth = width - contentX - padding;
        const lineGap = height * 0.12;
      
        // ---- Background ----
        const bg = await loadImage("$getServerVar[rank_card_bg;$guildID;https://images.stockcake.com/public/7/c/9/7c9d7486-1d78-4888-b31c-6e660bce0432_large/purple-mountain-twilight-stockcake.jpg]");
        ctx.drawImage(bg, 0, 0, width, height);
      
        // Vignette overlay
        const grad = ctx.createLinearGradient(0, 0, width, height);
        grad.addColorStop(0, "rgba(0,0,0,0.6)");
        grad.addColorStop(1, "rgba(0,0,0,0.35)");
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, width, height);
      
        // ---- Avatar shadow/glow ----
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + height*0.02, 0, Math.PI*2);
        ctx.fillStyle = "rgba(157,47,249,0.25)";
        ctx.fill();
      
        // ---- Avatar ----
        const avatar = await loadImage("$userAvatar[$get[user]]");
        ctx.save();
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2, 0, Math.PI*2);
        ctx.clip();
        ctx.drawImage(avatar, avatarX, avatarY, avatarSize, avatarSize);
        ctx.restore();
      
        // Avatar ring
        ctx.strokeStyle = "rgba(157,47,249,0.9)";
        ctx.lineWidth = height * 0.012;
        ctx.beginPath();
        ctx.arc(avatarX + avatarSize/2, avatarY + avatarSize/2, avatarSize/2 + height*0.005, 0, Math.PI*2);
        ctx.stroke();
      
        // ---- Username ----
        const usernameY = avatarY + avatarSize * 0.35;
        ctx.fillStyle = "#ffffff";
        ctx.font = 'bold ' + height*0.12 + 'px Sans';
        ctx.fillText("$username[$get[user]]", contentX, usernameY);
      
        // Subtle separator
        ctx.strokeStyle = "rgba(255,255,255,0.2)";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(contentX, usernameY + lineGap*0.35);
        ctx.lineTo(contentX + contentWidth*0.35, usernameY + lineGap*0.35);
        ctx.stroke();
      
        // ---- Level ----
        ctx.font = height*0.075 + 'px Sans';
        ctx.fillStyle = "rgba(255,255,255,0.85)";
        ctx.fillText("LEVEL $get[level]", contentX, usernameY + lineGap);
      
        // ---- XP bar ----
        const barHeight = height*0.055;
        const barY = usernameY + lineGap*1.8;
        const xp = Number("$get[xp]");
        const req = Number("$get[req]");
        const progress = Math.min(xp/req,1);
      
        // XP bar background
        ctx.fillStyle = "rgba(255,255,255,0.15)";
        const barRadius = barHeight/2;
        ctx.beginPath();
        ctx.roundRect(contentX, barY, contentWidth, barHeight, barRadius);
        ctx.fill();
      
        // XP bar fill with gradient
        const barGrad = ctx.createLinearGradient(contentX, 0, contentX+contentWidth, 0);
        barGrad.addColorStop(0, "#9D2FF9");
        barGrad.addColorStop(1, "#C084FC");
        ctx.fillStyle = barGrad;
        ctx.beginPath();
        ctx.roundRect(contentX, barY, contentWidth*progress, barHeight, barRadius);
        ctx.fill();
      
        return canvas.toBuffer("image/png").toString("base64");
      })()
    ]]

    $attachment[$get[card];rank.png;true;base64]

    $addContainer[
      $addMediaGallery[
        $addMediaItem[attachment://rank.png]
      ]
      $addSeparator[Small;true]
      $addTextDisplay[-# Level $get[level] | XP: $get[xp]/$get[req]]
    ;#9A2FF3]
`
});
