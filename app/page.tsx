

import { GuideInfoBox } from "@/components/guide/GuideInfoBox";
import { ChatWindowMetaMove } from "@/components/ChatWindowMetaMove";




export default function Home() {


  const InfoCard = (
    <GuideInfoBox>
      <ul>
        <li className="text-l">
          🤝
          <span className="ml-2">
           Welcome to Powerful , we are more powerful version of move agent kit
          </span>
        </li>
        <li className="hidden text-l md:block">
          💻
          <span className="ml-2">
            You can get the real time statics of aptos & interact with aptos just connect wallet
          </span>
        </li>
      </ul>
    </GuideInfoBox>
  );
  return (
    <ChatWindowMetaMove
      endpoint="api/chat/metamove"
      emoji=" 🃏"
      placeholder="I'm Joker, more powerful AI than the original move AI kit."
      emptyStateComponent={InfoCard}
    />
  );
}
