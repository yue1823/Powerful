import { Tool } from "langchain/tools";
import { type AgentRuntime } from "../../agent";

/**
 * get hashtags from api endpoint
 * @returns string - image url
 */
export class GenerateImage extends Tool {
  name = "generate_image";
  description = "Generate image by the keyword or by hashtags";

  constructor(private agent: AgentRuntime) {
    super();
  }

  async _call(prompt: string): Promise<string> {
    try {
      const image = await this.agent.generate_image(prompt);
      return image;
    } catch (error) {
      console.error(error);
      return "";
    }
  }
}
