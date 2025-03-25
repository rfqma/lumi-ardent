import cron from "node-cron";
import "dotenv/config";
import Instagram from "./instagram";
import OPENAI from "./openai";
import STABILITYAI from "./stabilityai";
import terminalImage from "terminal-image";
import fs from "fs";
import sharp from "sharp";
import moment from "moment-timezone";

const post = async ({ next }: { next: string }) => {
  try {
    const prompt = await OPENAI.generatePrompt();
    console.log(prompt);
    const image = await STABILITYAI.generateImage({ prompt: prompt });

    if (typeof image === "object") {
      const caption = await OPENAI.generateCaption({ prompt: prompt });
      const finalCaption = caption?.replace(/"/g, "");

      // const ImageBuffer = Buffer.from(await (await fetch(image)).arrayBuffer());

      console.log(
        await terminalImage.buffer(image),
        finalCaption?.toLowerCase()
      );

      const filename = Date.now();
      // await fs.promises.writeFile(`src/images/${filename}.png`, ImageBuffer);
      fs.writeFileSync(`src/images/${filename}.png`, Buffer.from(image));

      await sharp(`src/images/${filename}.png`)
        .grayscale()
        .jpeg({
          quality: 100,
        })
        .toFile(`src/images/${filename}.jpg`);

      const response = await Instagram.createPost({
        path: `./src/images/${filename}.jpg`,
        caption: finalCaption!.toLowerCase(),
        next: next,
      });

      // console.log("instagram post created: ", response);
      console.log("instagram post created");

      await fs.promises.unlink(`src/images/${filename}.png`);
      await fs.promises.unlink(`src/images/${filename}.jpg`);
    } else {
      console.error("error generating image url.");
    }
  } catch (error) {
    console.error("error upload to instagram: ", error);
  }
};

cron.schedule(
  "0 */12 * * *",
  () => {
    const jktTime = moment.tz("Asia/Jakarta").format("YYYY-MM-DD HH:mm:ss");
    const nextPost = moment
      .tz("Asia/Jakarta")
      .add(12, "hours")
      .format("YYYYMMDD HH:mm:ss");
    console.log("running cron job to upload on instagram...");
    post({ next: `next generate on ${nextPost} utc+07:00` });
    console.log(`task executed at ${jktTime} (Jakarta Time)`);
  },
  {
    scheduled: true,
    timezone: "Asia/Jakarta",
  }
);
