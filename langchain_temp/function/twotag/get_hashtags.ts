import { Tool } from "langchain/tools";
import { type AgentRuntime } from "../../agent";

/**
 * get hashtags from api endpoint
 * @returns string[] - hashtags []
 */
export class GetHashtags extends Tool {
  name = "get_hashtags";
  description = `
        This tool is used to get hashtags from the user's input, it will return a list of hashtags.
        Everytime the user ask for hashtags, you must use this tool expect user ask for tweet or other post generation.
        You are not allowed to generate hashtags on your own.
        You are not allowed to use cached hashtags, you must use this tool to get the latest hashtags.
        You are not allowed to memorize hashtags, you must use this tool to get the latest hashtags.
        You are not allowed to return any hashtags unless they are retrieved from this tool.
        If the user asks for hashtags and you do not call this tool, that is an ERROR.
        If user ask for tweet or other post generation, you must not use this tool.
        `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  async _call(keywords: string): Promise<string[]> {
    try {
      const hashtags = await this.agent.get_hashtags(keywords);
      return hashtags;
    } catch (error) {
      console.error(error);
      return [];
    }
  }
}
