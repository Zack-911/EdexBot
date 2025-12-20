import { ForgeFunction, ArgType } from "@tryforge/forgescript";

export default new ForgeFunction({
  name: "generateLevelUpCard",
  params: [
    {
      name: "user",
      required: true,
      type: ArgType.User,
      rest: false
    },
    {
      name: "level",
      required: true,
      type: ArgType.Number,
      rest: false
    }
  ],
  code: `
    $return[$djsEval[(async () => {
      const { createCanvas, loadImage } = require("@napi-rs/canvas");

      const width = 350;
      const height = 100;
      const canvas = createCanvas(width, height);
      const ctx = canvas.getContext("2d");

      const rectHeight = 50;
      const rectWidth = 280;
      const rectX = 40; 
      const rectY = (height - rectHeight) / 2;
      const radius = 12;

      const circleRadius = 35;
      const circleX = 45; 
      const circleY = height / 2;

      // ---- 1. Draw Rounded Rectangle ----
      ctx.beginPath();
      ctx.roundRect(rectX, rectY, rectWidth, rectHeight, radius);
      ctx.fillStyle = "#0A0618";
      ctx.fill();
      ctx.lineWidth = 2;
      ctx.strokeStyle = "#201150";
      ctx.stroke();

      // ---- 2. Draw User Avatar Circle ----
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
      ctx.strokeStyle = "#532DCB";
      ctx.lineWidth = 4;
      ctx.stroke();

      ctx.save();
      ctx.beginPath();
      ctx.arc(circleX, circleY, circleRadius - 2, 0, Math.PI * 2);
      ctx.clip();
      const avatar = await loadImage("$userAvatar[$env[user;id]]");
      ctx.drawImage(avatar, circleX - circleRadius, circleY - circleRadius, circleRadius * 2, circleRadius * 2);
      ctx.restore();

      // ---- 3. Draw Level Text ----
      ctx.font = "bold 24px Sans";
      ctx.fillStyle = "#F5F5F5";
      ctx.textAlign = "left";
      ctx.textBaseline = "middle";
      
      ctx.fillText("Level $env[level]", rectX + circleRadius + 15, height / 2);

      return canvas.toBuffer("image/png").toString("base64");
    })()]]
  `
})
