"use client";

import { type Message } from "ai";
import { useChat } from "ai/react";
import React, { useCallback, useEffect, useState } from "react";
import type { FormEvent, ReactNode } from "react";
import { toast } from "sonner";
import { StickToBottom, useStickToBottomContext } from "use-stick-to-bottom";
import { Col, ConfigProvider, Modal, Row, Avatar, Result } from "antd";

import { IntermediateStep } from "./IntermediateStep";
import { Button } from "./ui/button";
import { ArrowDown, LoaderCircle, Paperclip } from "lucide-react";
import { Checkbox } from "./ui/checkbox";
import { UploadDocumentsForm } from "./UploadDocumentsForm";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { cn } from "@/utils/cn";
import { InputTransactionData, useWallet } from "@aptos-labs/wallet-adapter-react";
import { ChatMessageMetaMove } from "./ChatMessageMetaMove";
import { parseContentToJson } from "@/utils/parseContentToJson";
import { useRouter } from "next/router";
import { useDisclosure } from "@mantine/hooks";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { Group, Text, Grid, Flex, Card, Image } from "@mantine/core";
import Wallet from "@/components/wallet/client_wallet";
import { IconX } from "@tabler/icons-react";



function ChatMessages(props: {
  messages: Message[];
  emptyStateComponent: ReactNode;
  sourcesForMessages: Record<string, any>;
  aiEmoji?: string;
  className?: string;
  tool?: string;

}) {
  // useEffect(() => {
  //   //const per= typeof props.message.content === 'string' ? JSON.parse(props.message.content):props.message.content;
  //   console.dir(props,{depth:null})
  //   //console.log("data",per.inputdata)
  //
  // }, [props]);
  //console.log("props.messages", props.messages);
  return (
    <div className="flex flex-col max-w-[768px] mx-auto pb-12 w-full">
      {props.messages.map((m, i) => {
        if (m.role === "system") {
          return <IntermediateStep key={m.id} message={m} />;
        }

        const sourceKey = (props.messages.length - 1 - i).toString();
        return (
          <ChatMessageMetaMove
            key={m.id}
            message={m}
            aiEmoji={props.aiEmoji}
            sources={props.sourcesForMessages[sourceKey]}

          />
        );
      })}
    </div>
  );
}
function formatUnixTimestampToDDMMYYYY(timestamp: number): string {
  const date = new Date(timestamp * 1000); // 將秒轉換為毫秒
  const day = String(date.getDate()).padStart(2, '0'); // 取得日期，並補零
  const month = String(date.getMonth() + 1).padStart(2, '0'); // 取得月份（0-11），加 1 並補零
  const year = date.getFullYear(); // 取得年份

  return `${day}/${month}/${year}`;
}
export function ChatInput(props: {
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  onStop?: () => void;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  loading?: boolean;
  placeholder?: string;
  children?: ReactNode;
  className?: string;
  actions?: ReactNode;
}) {
  const disabled = props.loading && props.onStop == null;
  return (
    <form
      onSubmit={(e) => {
        e.stopPropagation();
        e.preventDefault();

        if (props.loading) {
          props.onStop?.();
        } else {
          props.onSubmit(e);
        }
      }}
      className={cn("flex w-full flex-col", props.className)}
    >
      <div className="border border-input bg-secondary rounded-lg flex flex-col gap-2 max-w-[768px] w-full mx-auto">
        <input
          value={props.value}
          placeholder={props.placeholder}
          onChange={props.onChange}
          className="border-none outline-none bg-transparent p-4"
        />

        <div className="flex justify-between ml-4 mr-2 mb-2">
          <div className="flex gap-3">{props.children}</div>

          <div className="flex gap-2 self-end">
            {props.actions}
            <Button type="submit" className="self-end" disabled={disabled}>
              {props.loading ? (
                <span role="status" className="flex justify-center">
                  <LoaderCircle className="animate-spin" />
                  <span className="sr-only">Loading...</span>
                </span>
              ) : (
                <span>Send</span>
              )}
            </Button>
          </div>
        </div>
      </div>
    </form>
  );
}

function ScrollToBottom(props: { className?: string }) {
  const { isAtBottom, scrollToBottom } = useStickToBottomContext();

  if (isAtBottom) return null;
  return (
    <Button
      variant="outline"
      className={props.className}
      onClick={() => scrollToBottom()}
    >
      <ArrowDown className="w-4 h-4" />
      <span>Scroll to bottom</span>
    </Button>
  );
}

function StickyToBottomContent(props: {
  content: ReactNode;
  footer?: ReactNode;
  className?: string;
  contentClassName?: string;
}) {


  const context = useStickToBottomContext();

  // scrollRef will also switch between overflow: unset to overflow: auto
  return (
    <div
      ref={context.scrollRef}
      style={{ width: "100%", height: "100%" }}
      className={cn("grid grid-rows-[1fr,auto]", props.className)}
    >
      <div ref={context.contentRef} className={props.contentClassName}>
        {props.content}
      </div>

      {props.footer}
    </div>
  );
}

export function ChatLayout(props: { content: ReactNode; footer: ReactNode }) {

  return (
    <>
          <StickToBottom>
            <StickyToBottomContent
              className="absolute inset-0"
              contentClassName="py-8 px-2"
              content={props.content}
              footer={
                <>

                  <div className="sticky bottom-8 px-2">
                    <ScrollToBottom className="absolute bottom-full left-1/2 -translate-x-1/2 mb-4" />
                    {props.footer}
                  </div>
                </>

              }
            />
          </StickToBottom>

    </>

  );
}

export function ChatWindowMetaMove(props: {
  endpoint: string;
  emptyStateComponent: ReactNode;
  placeholder?: string;
  emoji?: string;
  showIngestForm?: boolean;
  showIntermediateStepsToggle?: boolean;
}) {
  const [claimKey, setClaimKey] = useState<string | undefined>(undefined);
  const [opened, { open, close }] = useDisclosure(false);
  const [red_pocket_data ,set_red_pocket_data ]=useState({
    message:"you friend share a red pocket to you",
    expired_time:1741487508,
    number:1
  })
  const [red_pocket_coin,set_red_pocket_coin]=useState({
    url:"https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSTKX0VVgxldJmuDo_7lTxhnhqsTXlyTZcARQ&s",
    balance:0,
    decemb:8
  })
  const[finish_claim , set_finish_claim]=useState(false);
  const [transaction,set_transaction]=useState("");
  const [claim_one_time ,set_claim_one_time]=useState(false);
  const aptosConfig = new AptosConfig({ network: Network.MAINNET });
  const aptos = new Aptos(aptosConfig);

  // 使用 useCallback 確保 open 函數的引用保持穩定
  // eslint-disable-next-line react-hooks/exhaustive-deps
  useEffect(() => {
    // 嘗試使用 window.location.search 作為 fallback
    set_claim_one_time(false)
    const searchParams = new URLSearchParams(window.location.search);
    const claimKeyFromURL = searchParams.get("claim_key");
    setClaimKey(claimKeyFromURL || undefined);
  }, []);
  const fetch_message = async(claim_key:string) =>{
    try{
      let respone = await  aptos.view({
        payload:{
          function:"0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::red_pocket::get_red_pocket_message" ,
          functionArguments:[claim_key]
        }
      })
      if(respone){
        set_red_pocket_data({
          message:String(respone[0]),
          expired_time: Number(respone[1]),
          number: Number(respone[2])
        })
        try{
          await  aptos.view({
            payload:{
              function:"0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::red_pocket::get_red_pocket_coin_data" ,
              functionArguments:[claim_key]
            }
          }).then(result =>{
            set_red_pocket_coin({
              url:String(result[0]) !== "" ? String(result[0]):red_pocket_coin.url,
              balance: Number(result[1]),
              decemb: Number(result[2])
            })
            }
          )
        }catch (e:unknown){console.log(e)}
      }
      open()
    }catch(e:unknown){
      console.log(e)
    }
  }
  useEffect(() => {
    console.log("claimkey = ",claimKey)
    console.log("open = ",opened)
    if (claimKey !== undefined && !claim_one_time) { // 使用 !== 進行比較
       // 呼叫 handleOpen 函數
      fetch_message(claimKey)
    }
  }, [claimKey,  opened]);

  const {account ,signAndSubmitTransaction }=useWallet();
  const [showIntermediateSteps, setShowIntermediateSteps] = useState(
    !!props.showIntermediateStepsToggle,
  );
  const [intermediateStepsLoading, setIntermediateStepsLoading] =
    useState(false);

  const presetInputs = [
    {
      label: "🧧 Create a Red Pocket",
      value: "Create Red Pocket",
    },
    {
      label: "🌐 Swap emoji",
      value: "Swap emoji 🌐",
    },
    {
      label: "💡Analytics address",
      value: "Help me to Analytics someone address",
    },
    {
      label: "🤔 Get Aptos monthly active account",
      value: "Get Aptos monthly active account",
    },
  ];

  const [sourcesForMessages, setSourcesForMessages] = useState<
    Record<string, any>
  >({});

  const claim_button = async() =>{
    if(!account)return[]
    try{
      const input :InputTransactionData= {
        data:{
          function:"0xac314e37a527f927ee7600ac704b1ee76ff95ed4d21b0b7df1c58be8872da8f0::red_pocket::claim_red_pocket",
          functionArguments:[claimKey]
        }
      }
      const response = await signAndSubmitTransaction( input);
      let r_h=await aptos.waitForTransaction({transactionHash:response.hash});
      console.dir(response,{depth:null})
      console.log("r_h :",r_h.hash.toString());
      set_transaction(r_h.hash.toString())
      set_finish_claim(true)
      set_claim_one_time(true)
    }catch(e:unknown){console.log(e)}
  }

  const chat = useChat({
    api: props.endpoint,
    body: {
      account: account !== null ? account : undefined,
    },
    onResponse(response) {
      const sourcesHeader = response.headers.get("x-sources");
      const sources = sourcesHeader
        ? JSON.parse(Buffer.from(sourcesHeader, "base64").toString("utf8"))
        : [];

      const messageIndexHeader = response.headers.get("x-message-index");
      if (sources.length && messageIndexHeader !== null) {
        setSourcesForMessages({
          ...sourcesForMessages,
          [messageIndexHeader]: sources,
        });
      }
    },
    streamMode: "text",
    onError: (e) =>
      toast.error(`Error while processing your request`, {
        description: e.message,
      }),
  });

  async function sendMessage(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    if (chat.isLoading || intermediateStepsLoading) return;

    if (!showIntermediateSteps) {
      console.log("not show intermediate steps");
      chat.handleSubmit(e);
      return;
    }

    // Some extra work to show intermediate steps properly
    setIntermediateStepsLoading(true);
    console.log("setIntermediateStepsLoading(true) called");

    chat.setInput("");

    const messagesWithUserReply = chat.messages.concat({
      id: chat.messages.length.toString(),
      content: chat.input,
      role: "user",
    });
    chat.setMessages(messagesWithUserReply);

    const response = await fetch(props.endpoint, {
      method: "POST",
      body: JSON.stringify({
        messages: messagesWithUserReply,
        show_intermediate_steps: true,

      }),
    });

    const json = await response.json();
    console.log("json=",json)
    setIntermediateStepsLoading(false);


    if (!response.ok) {
      toast.error(`Error while processing your request`, {
        description: json.error,
      });
      return;
    }




    const responseMessages: Message[] = json.messages;


    // Represent intermediate steps as system messages for display purposes
    // TODO: Add proper support for tool messages
    const toolCallMessages = responseMessages.filter(
      (responseMessage: Message) => {
        return (
          (responseMessage.role === "assistant" &&
            !!responseMessage.tool_calls?.length) ||
          responseMessage.role === "tool"
        );
      },
    );
    //console.log(" responseMessages", responseMessages)
    const intermediateStepMessages = [];
    for (let i = 0; i < toolCallMessages.length; i += 2) {
      const aiMessage = toolCallMessages[i];
      const toolMessage = toolCallMessages[i + 1];
      console.log("tool",toolMessage)
      intermediateStepMessages.push({
        id: (messagesWithUserReply.length + i / 2).toString(),
        role: "system" as const,
        content: JSON.stringify({
          action: aiMessage.tool_calls?.[0],
          observation: toolMessage.content,
        }),
      });

    }
    const newMessages = messagesWithUserReply;
    for (const message of intermediateStepMessages) {
      newMessages.push(message);
      chat.setMessages([...newMessages]);
      await new Promise((resolve) =>
        setTimeout(resolve, 1000 + Math.random() * 1000),
      );
    }
    const input  = json.messages.content.inputdata;
    chat.setMessages([
      ...newMessages,
      {
        id: newMessages.length.toString(),
        content: responseMessages[responseMessages.length - 1].content,
        data:input,
        role: "assistant",
      },
    ]);

  }

  return (
    <>
      {/* eslint-disable-next-line react/jsx-no-undef */}
      <ConfigProvider
        theme={{
          components: {
            Modal: {
              contentBg:"rgb(31, 31, 33)",
              headerBg:"rgb(31, 31, 33)",
              titleColor:"rgb(243,240,245)"
              /* 这里是你的组件 token */
            },
          },
        }}
      >
        <Modal zIndex={10}  open={opened} onClose={(close)} footer={null}  closeIcon={<IconX color="rgb(243,240,245)" onClick={()=>{set_claim_one_time(true)
          close()}}/>} >
          {!account && (
            <Wallet />
          )}
          <Card
            shadow="sm"
            target="_blank"
            component={"a"}
            radius={"md"}
          >
            {!finish_claim ?<>
              <Row >
                <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                </Col>
                <Col xs={20} sm={16} md={12} lg={8} xl={4}>
                  <Image
                    src="https://aptosconnect.app/images/hongbao/envelope-dark.png"
                    alt="red pocket"
                    className={"h-60 w-80"}
                  />
                </Col>
                <Col xs={2} sm={4} md={6} lg={8} xl={10}>
                </Col>
              </Row>
              <Row>
                <Col xs={2} sm={4} md={7} lg={9} xl={12}>
                </Col>
                <Col xs={20} sm={16} md={12} lg={8} xl={4}>
                  <Text fw={700} size="lg" className={"text-sky-50"}>
                    {red_pocket_data.message}
                  </Text>
                </Col>
                <Col xs={2} sm={4} md={5} lg={7} xl={8}>
                </Col>
              </Row>
              <Row gutter={30}  style={{ border: "1px solid", borderColor: "rgb(87,92,91)", padding: 5 }}>
                <Col span={12}>
                  <Avatar size="large" src={`${red_pocket_coin.url}`} />
                </Col>
                <Col span={12}>
                  <Text mt="xs" c="dimmed" size="sm">
                    Remain : {red_pocket_coin.balance/Math.pow(10,red_pocket_coin.decemb)}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text mt="xs" c="dimmed" size="sm">
                    Expired date : {formatUnixTimestampToDDMMYYYY(red_pocket_data.expired_time)}
                  </Text>
                </Col>
                <Col span={12}>
                  <Text mt="xs" c="dimmed" size="sm">
                    Frequency : {red_pocket_data.number}
                  </Text>
                </Col>
              </Row>
              <Row style={{paddingTop:10}}>
                <Col span={24}>
                  <Button onClick={()=>{
                    claim_button()
                  }} className={"w-full text-gray-600"} color={!account?"gray":"cyan"} disabled={!account}>
                    Claim
                  </Button>
                </Col>
              </Row>
            </> :
            <>
              <Result
                status="success"
                title="Successfully Claim"
                subTitle={
                  <>
                    Hash: <a href={`https://explorer.aptoslabs.com/txn/${transaction}?network=mainnet`} target="_blank" rel="noopener noreferrer">{transaction}</a>.
                  </>
                }
                extra={[
                  <Button key="Close" onClick={close}>Close</Button>,
                ]}
               className={"bg-sky-200"}
              />
            </>}
          </Card>
        </Modal>
      </ConfigProvider>
      <ChatLayout
        content={

          chat.messages.length === 0 ? (
            <div className="flex flex-col items-center gap-4 w-full">
              {props.emptyStateComponent}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 w-full max-w-2xl px-4">
                {presetInputs.map((preset, index) => (
                  <Button
                    key={index}
                    variant="outline"
                    className="w-full min-h-[120px] p-4 h-auto text-left flex flex-col items-start gap-2 hover:bg-secondary/80 transition-colors overflow-hidden"
                    onClick={() => {
                      chat.setInput(preset.value);
                    }}
                  >
                  <span className="font-semibold text-base w-full break-words">
                    {preset.label}
                  </span>
                    <span className="text-sm text-muted-foreground w-full flex-wrap line-clamp-2 whitespace-pre-wrap">
                    {preset.value}
                  </span>
                  </Button>
                ))}
              </div>
            </div>
          ) : (
            <ChatMessages
              aiEmoji={props.emoji}
              messages={chat.messages}
              emptyStateComponent={props.emptyStateComponent}
              sourcesForMessages={sourcesForMessages}
            />
          )
        }
        footer={
          <ChatInput
            value={chat.input}
            onChange={chat.handleInputChange}
            onSubmit={sendMessage}
            loading={chat.isLoading || intermediateStepsLoading}
            placeholder={props.placeholder ?? "What's it like to be a pirate?"}
          >
            {props.showIngestForm && (
              <Dialog>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    className="pl-2 pr-3 -ml-2"
                    disabled={chat.messages.length !== 0}
                  >
                    <Paperclip className="size-4" />
                    <span>Upload document</span>
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Upload document</DialogTitle>
                    <DialogDescription>
                      Upload a document to use for the chat.
                    </DialogDescription>
                  </DialogHeader>
                  <UploadDocumentsForm />
                </DialogContent>
              </Dialog>
            )}

            {props.showIntermediateStepsToggle && (
              <div className="flex items-center gap-2">
                <Checkbox
                  id="show_intermediate_steps"
                  name="show_intermediate_steps"
                  checked={showIntermediateSteps}
                  disabled={chat.isLoading || intermediateStepsLoading}
                  onCheckedChange={(e) => setShowIntermediateSteps(!!e)}
                />
                <label htmlFor="show_intermediate_steps" className="text-sm">
                  Show intermediate steps
                </label>
              </div>
            )}
          </ChatInput>
        }
      />
    </>
  );
}
