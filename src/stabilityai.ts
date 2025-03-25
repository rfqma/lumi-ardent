import "dotenv/config";
import axios from "axios";
import CONSTANTS from "./constants";
import UTILS from "./utils";

const generateImage = async ({
  prompt,
}: {
  prompt: string;
}): Promise<string> => {
  const payload = {
    prompt: UTILS.truncatePrompt({
      prompt,
      maxLength: CONSTANTS.MAX_PROMPT_LENGTH,
    }),
    output_format: "png",
    mode: "text-to-image",
    aspect_ratio: "4:5",
    model: "sd3.5-large",
    seed: 0,
    style_preset: "3d-model",
    // negative_prompt: "",
    cfg_scale: 7,
  };

  try {
    const response = await axios.postForm(
      `https://api.stability.ai/v2beta/stable-image/generate/sd3`,
      axios.toFormData(payload, new FormData()),
      {
        validateStatus: undefined,
        responseType: "arraybuffer",
        headers: {
          Authorization: `Bearer ${process.env.STABILITY_API_KEY}`,
          Accept: "image/*",
        },
      }
    );

    if (response.status === 200) {
      return response.data;
    } else {
      throw new Error(`${response.status}: ${response.data.toString()}`);
    }
  } catch (error) {
    console.error("error generating image:", error);
    return "an error occurred while generating the image.";
  }
};

const STABILITYAI = {
  generateImage,
};

export default STABILITYAI;
