import { IgApiClient } from "instagram-private-api";
import { readFile } from "fs";
import { promisify } from "util";
import "dotenv/config";
const readFileAsync = promisify(readFile);

const createPost = async ({
  path,
  caption,
  next,
}: {
  path: string;
  caption: string;
  next: string;
}) => {
  try {
    const ig = new IgApiClient();
    const creds = {
      username: process.env.IG_USN,
      password: process.env.IG_PWD,
    };

    if (!creds.username || !creds.password) {
      throw new Error("username or password not set");
    }

    ig.state.generateDevice(creds.username + "444");

    await ig.account.login(creds.username, creds.password);

    const results = await ig.publish.photo({
      file: await readFileAsync(path),
      caption: caption,
    });

    //  await ig.account.setBiography(`artificial\n${next}`);

    return results;
  } catch (error: any) {
    return error.message;
  }
};

const Instagram = {
  createPost,
};

export default Instagram;
