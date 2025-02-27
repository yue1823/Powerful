import { Tool } from "langchain/tools";
import { type AgentRuntime } from "../../agent";

/**
 * get hashtags from api endpoint
 * @returns string[] - hashtags []
 */
export class GetHashtags extends Tool {
  name = "get_hashtags";
  description = `
        WHEN TO USE:
        - ONLY use this tool when the user specifically asks for hashtag suggestions or recommendations
        - ONLY use this tool when you need to get relevant hashtags for a topic
        
        DO NOT USE:
        - Do NOT use this tool when generating tweets or social media posts
        - Do NOT use this tool unless the user explicitly asks for hashtags
        
        IMPORTANT RULES:
        - You must NEVER generate hashtags on your own
        - You must NEVER use cached or memorized hashtags
        - You must ALWAYS use this tool to get fresh hashtags
        - You must NEVER return hashtags unless they come from this tool
        - Using any other source for hashtags is an ERROR
        
        Input: Keywords or topic to get hashtags for
        Output: Array of relevant hashtags
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
