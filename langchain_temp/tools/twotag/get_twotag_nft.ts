import type { AgentRuntime } from "../../agent";

/**
 * read public tweet from 2tag
 * @param agent MoveAgentKit instance
 * @param to user address
 * @returns Transaction signature
 *
 */

const operationName = "MyQuery";

interface Tweet {
  deploy_Date:number,
  owner:string,
  text:string,
  tag:string[]
}

interface NFTData {
  token_data_id: string;
  token_uri: string;
  token_name: string;
}
interface CollectionData {
  description: string;
  uri: string;
}
interface FormattedNFTData {
  token_id: string;
  token_uri: string;
  token_name: string;
  collection_description: string;
  collection_uri: string;
}
export async function get_twotag_nft(
  agent: AgentRuntime,
  to: string,
): Promise<FormattedNFTData[]> {
  const operation = `
  query MyQuery {
    current_token_ownerships_v2(
      where: {owner_address: {_eq: "${to}"}, 
      current_token_data: {collection_id: {_eq: "0x8e48ee91ad8e73200bc24e3a5c415a9b470cd3292480031857c42b24b5153bbd"}}}
    ) {
      current_token_data {
        token_data_id
        token_uri
        token_name
      }
    }
  }
`;
  async function fetch_single_tweet(
    nft_token_it:string
  ):Promise<Tweet>{
    try{
      let respone = await agent.aptos.view({
        payload:{
          function:"0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::post::read_public_tweet",
          functionArguments:[nft_token_it]
        }
      })
      return respone[0] as Tweet
      }catch(e:unknown){console.log(e)}

    return {
      deploy_Date:0,
      owner:"",
      text:"",
      tag:[]
    }
  }

  async function fetchGraphQL(
    operationsDoc: string,
    operationName: string,
    variables: Record<string, any>,
  ): Promise<any> {
    try {
      const response = await fetch(`${process.env.NODIT_END_POINT}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json", // 確保設定 Content-Type
        },
        body: JSON.stringify({
          query: operationsDoc,
          variables,
          operationName,
        }),
      });
      const result = await response.json();
      //console.log("GraphQL Result:", result);
      return result;
    } catch (e: unknown) {
      console.log(e);
    }
    return "";
  }
  try {
    const graphqlData = await fetchGraphQL(operation, "MyQuery", {});
    // const graphqlData = JSON.parse(Data)

    // Extract and format data
    const tokenOwnerships: { current_token_data: NFTData }[] =
      graphqlData.data.current_token_ownerships_v2;
    const collectionData: CollectionData[] =
      graphqlData.data.current_collections_v2;

    const formattedData: FormattedNFTData[] = tokenOwnerships.map(
      (ownership) => {
        return {
          token_id: ownership.current_token_data.token_data_id,
          token_uri: ownership.current_token_data.token_uri,
          token_name: ownership.current_token_data.token_name,
          collection_description:  "", // Handle cases where collection data might be missing
          collection_uri:  "",
        };
      },
    );

    return formattedData;
  } catch (error: any) {
    console.error("Error in get_twotag_nft:", error);
    throw new Error(`2tag get nft failed: ${error.message}`);
  }
}
