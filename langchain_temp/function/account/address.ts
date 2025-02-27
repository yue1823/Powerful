import { Tool } from "langchain/tools";
import type { AgentRuntime } from "../../agent";

export class AptosAccountAddressTool extends Tool {
  name = "aptos_get_wallet_address";
  description = `Get the wallet address of user
  If the user asks for **their** account address, you can provide this address ${this.agent.to_address as string} to be user's wallet address. **Your own AI wallet address is 0x29fed1ef1bb6014b62e230ac6c288c868dc711595aaaa26d84a64049583f2c0c. Do not provide this address when asked about the user's address.**
 `;

  constructor(private agent: AgentRuntime) {
    super();
  }

  async _call(_input: string): Promise<string> {
    return this.agent.to_address;
  }
}
