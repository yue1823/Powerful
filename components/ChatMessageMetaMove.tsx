import { cn } from "@/utils/cn";
import type { Message } from "ai/react";

import { parseContentToJson } from "@/utils/parseContentToJson";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import React, { useEffect, useMemo, useRef, useState } from "react";

import { Account, Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import CodeBox from "@/components/codebox";

import { QRCode } from "antd";
import type { ColumnsType } from 'antd/es/table';
import { Space, Table, Tag } from 'antd';
import type { TableProps } from 'antd';
import styled from "styled-components";
import { create_badges } from "@/langchain_temp/utils/create_badges";

interface Fetch_data {
  module: string;
  function: string;
  timestamp:number;
  to_address?: string;
  change?: {
    coin_1: string;
    amount_change_c1: number; // 正數表示增加，負數表示減少
    coin_2?: string;
    amount_change_c2?: number; // 正數表示增加，負數表示減少
  };
}

// 定義表格資料的介面
interface AnalyticsTableData {
  key: string;
  timestamp: string;
  module: JSX.Element;
  function: string;
  change: JSX.Element ;
}
interface AppProps{
  analytics_data: Fetch_data[]
}
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);



export function ChatMessageMetaMove(props: {
  message: Message;
  aiEmoji?: string;
  sources: any[];

}) {

  const {account,signAndSubmitTransaction}=useWallet();
  const isSubmittingRef = useRef(false);
  const [deplay_message,setdeplaymessage]=useState<string | undefined | JSX.Element>();
  const finalContent = useMemo(() => {
    if (props.message.role === "assistant") {
      try {
        const parsedContent = typeof props.message.content === 'string' ? JSON.parse(props.message.content): props.message.content;

        if (parsedContent && typeof parsedContent === 'object' && parsedContent.messages && typeof parsedContent.messages === 'object' && parsedContent.messages.content) {
          try {
            return typeof parsedContent.messages.content === 'string' ? JSON.parse(parsedContent.messages.content) : parsedContent.messages.content;
          } catch (e) {
            console.warn("Failed to parse messages.content:", e);
            console.log("messages.content:", parsedContent.messages.content);
          }
        } else {
          console.log("Parsed content:", parsedContent);
        }
      } catch (e) {
        console.warn("Failed to parse props.message.content:", e);
        console.log("props.message.content:", props.message.content);
      }
    }
    return null;
  }, [props.message]);

  const StyledTable = styled(Table<AnalyticsTableData>)`
    width: 100%;
    overflow-x: auto; /* 確保在小螢幕上可以水平滾動 */
    white-space: nowrap; /* 防止文字換行，讓表格可以水平滾動 */

    .ant-table-container {
        overflow-x: auto;
    }

    .ant-table-thead > tr > th,
    .ant-table-tbody > tr > td {
        word-break: keep-all; /* 防止單詞斷開換行 */
    }
`;

  useEffect(()=> {
    async function executeEffect() {
      try {
        if (props.message.role === "assistant") {
          const content = JSON.parse(props.message.content);
          const tool = content.messages?.tool;
          if (finalContent?.inputdata) {
            sumbit_to_chain(finalContent.inputdata);
          } else if (tool === "swap_emojicoin") {
            setdeplaymessage("Now start transaction");
            const emoji_data = JSON.parse(content.messages.content);
            // console.log("emoji_data", emoji_data);
            // console.log("emoji_data_emoji", emoji_data.emoji);
            //const typeTags = toCoinTypesForEntry(emoji_data.emoji.market_address);
            if (isSubmittingRef.current) {
              console.log("Already submitting, skipping duplicate submission");
              return; // 如果正在提交，则跳过
            }
            isSubmittingRef.current = true;
            try {
              if (account != null) {
                const type_input1 = `${emoji_data.emoji.market_address}::coin_factory::Emojicoin`;
                const type_input2 = `${emoji_data.emoji.market_address}::coin_factory::EmojicoinLP`;
                const transaction_input :InputTransactionData={
                  data:{
                    function:"0xbabe32dbe1cb44c30363894da9f49957d6e2b94a06f2fc5c20a9d1b9e54cface::emojicoin_dot_fun_rewards::swap_with_rewards",
                    typeArguments:[type_input1,type_input2],
                    functionArguments:[emoji_data.emoji.market_address,emoji_data.emoji.input_amount,emoji_data.emoji.is_sell,emoji_data.emoji.min_output]
                  }
                }
                const response = await signAndSubmitTransaction(transaction_input);
                const hash_r = await aptos.waitForTransaction({ transactionHash: response.hash });


                setdeplaymessage(`You successfully swap ${parseFloat(emoji_data.emoji.min_output)/100000000 } ${emoji_data.emoji.symbol} , `+`Your transaction is ${hash_r.hash.toString()}`);
              }
            } catch (e: any) { // Specify the type of e
              console.error(e); // Use console.error for errors
            }
          }else if(tool == "analytics_address"){
            const AnalyticsTable: React.FC<AppProps> = ({ analytics_data }) => {
              const [tableData, setTableData] = useState<AnalyticsTableData[]>([]);


              useEffect(() => {
                const prepareTableData = async () => {
                  const resolvedTableData: AnalyticsTableData[] = await Promise.all(
                    analytics_data.map(async (item, index) => {
                      const timestamp = new Date(item.timestamp / 1000).toLocaleString();
                      const change_badges = await create_badges(item, "change");
                      const badges_module = await create_badges(item, "module");

                      return {
                        key: String(index),
                        timestamp: timestamp,
                        module: badges_module , // 提取 module 名稱，沒有就顯示原module
                        function: item.function,
                        change: change_badges,
                      };
                    })
                  );
                  setTableData(resolvedTableData);
                };

                prepareTableData();
              }, [analytics_data]); // analytics_data 變化時重新執行

              // 準備 Ant Design Table 的欄位定義
              const columns: ColumnsType<AnalyticsTableData> = [
                {
                  title: 'Timestamp',
                  dataIndex: 'timestamp',
                  key: 'timestamp',
                },
                {
                  title: 'Module',
                  dataIndex: 'module',
                  key: 'module',
                },
                {
                  title: 'Function',
                  dataIndex: 'function',
                  key: 'function',
                },
                {
                  title: 'Change',
                  dataIndex: 'change',
                  key: 'change',
                },
              ];


              return <StyledTable
                columns={columns}
                dataSource={tableData} // 使用已經解析的 tableData
                pagination={false}
              />;
            };


            const analytics_data = JSON.parse(content.messages.content).analytics_data
            console.log("front desplay =",analytics_data);
            const desplay = (<>
              <AnalyticsTable analytics_data={analytics_data} />
            </>)
            setdeplaymessage(desplay)
          }
        }
      } catch (error) {
        console.error("Error in useEffect:", error); // Log errors from JSON.parse or other operations
      }finally {
        isSubmittingRef.current = false; // 提交完成后重置为 false
      }
    }
    executeEffect()
  }, [finalContent?.inputdata]);

  const sumbit_to_chain = async (transaction: InputTransactionData) => {
    const parsedContent = JSON.parse(props.message.content);
    const tool = parsedContent.messages?.tool;
    // console.log("tool is = ",tool)
    if (isSubmittingRef.current) {
      console.log("Already submitting, skipping duplicate submission");
      return; // 如果正在提交，则跳过
    }
    isSubmittingRef.current = true;
    //console.log("i am here , ", transaction);
    try {
      const response = await signAndSubmitTransaction(transaction);
      const hash_r = await aptos.waitForTransaction({ transactionHash: response.hash });
      console.log("Transaction submitted successfully:", hash_r.hash); // 输出整个 response 对象
      switch (tool) {
        case "panora_aggregator_swap":{
          const token = JSON.parse((JSON.parse(props.message.content).messages.content)).token
          try {
            setdeplaymessage(`Transaction submitted successfully: ${hash_r.hash},
            you are successful swap ${token.mintX} to ${token.mintY}`)
          } catch (error) {
            console.log(error)
          }
          break;
        }
        case "create_red_pocket":{
          const red_pocket_data = JSON.parse((JSON.parse(props.message.content).messages.content)).key;
          const desplay =`https://pwerful.vercel.app/?claim_key=${red_pocket_data}`;
          console.log(desplay)
          let return_element = (
            <>
              <h1>Red Pocket key</h1>
              <CodeBox code={desplay} language="typescript" />
              <h3>Copy this and send to your friend</h3>
              <QRCode value={desplay} color={"rgb(243,240,245)"}/>
            </>
          )
          setdeplaymessage( return_element)
          break;
        }

        default:{
          try {
            setdeplaymessage(`Transaction submitted successfully: ${hash_r.hash}`)
          } catch (error) {
            console.log(error)
          }
          break;
        }

      }

    } catch (e: any) {
      console.error("Transaction failed:", e); // 输出更详细的错误信息
    }finally {
      isSubmittingRef.current = false; // 提交完成后重置为 false
    }
  };
  useEffect(() => {

  }, [deplay_message]);
  // @ts-ignore
  return (
    <div
      className={cn(
        `rounded-[24px] max-w-[80%] mb-8 flex`,
        props.message.role === "user"
          ? "bg-secondary text-secondary-foreground px-4 py-2"
          : null,
        props.message.role === "user" ? "ml-auto" : "mr-auto",
      )}
    >
      {props.message.role !== "user" && (
        <div className="mr-4 border bg-secondary -mt-2 rounded-full w-10 h-10 flex-shrink-0 flex items-center justify-center">
          {props.aiEmoji}
        </div>
      )}

      <div className="whitespace-pre-wrap flex flex-col w-full">
        {deplay_message != undefined ?
          deplay_message
           : parseContentToJson(props.message)}


        {props.sources && props.sources.length ? (
          <>
            <code className="mt-4 mr-auto bg-primary px-2 py-1 rounded">
              <h2>🔍 Sources:</h2>
            </code>
            <code className="mt-1 mr-2 bg-primary px-2 py-1 rounded text-xs">
              {props.sources?.map((source, i) => (
                <div className="mt-2" key={"source:" + i}>
                  {i + 1}. &quot;{source.pageContent}&quot;
                  {source.metadata?.loc?.lines !== undefined ? (
                    <div>
                      <br />
                      Lines {source.metadata?.loc?.lines?.from} to{" "}
                      {source.metadata?.loc?.lines?.to}
                    </div>
                  ) : (
                    ""
                  )}
                </div>
              ))}
            </code>
          </>
        ) : null}
      </div>
    </div>
  );
}
