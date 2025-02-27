export async function generate_image(
  prompt: string,
  account: string,
): Promise<string> {
  try {

    const mediaService = `${process.env.IMAGE_GENERATION_END_POINT}/api/metamove/image/prompt`;

    const aspect_ratio = `4:3`;
    const negative_prompt = "no text, no watermark, no logo";

    const response = await fetch(mediaService, {
      method: "POST",
      body: JSON.stringify({
        prompt,
        user_id: account,
        aspect_ratio,
        negative_prompt,
      }),
    });

    const image = await response.json();

    const result: string = image.image_url;

    return result;
  } catch (error: any) {
    throw new Error(`generate image failed: ${error.message}`);
  }
}
