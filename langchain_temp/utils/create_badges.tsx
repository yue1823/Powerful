import { Avatar, Badge, Col, Row } from "antd";
const aptosConfig = new AptosConfig({ network: Network.MAINNET });
const aptos = new Aptos(aptosConfig);

import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";


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
const emoji_regex = /emojicoin/i;
const emoji_coin_regex = /Emojicoin/i;
const panora_swap_regex = /panora_swap/i;

export const create_badges =async (analytics_data: Fetch_data, column: string): Promise<JSX.Element> => {
  if (column === "change") {
    if (analytics_data.change?.coin_1 && analytics_data.change.coin_2 === undefined) {

      const decimal = await get_coin_decimal(analytics_data.change?.coin_1)
      const isemoji= emoji_coin_regex.test(analytics_data.change?.coin_1)
      if(isemoji){
        const symbol = await get_coin_symbol(analytics_data.change?.coin_1)
        return (
          <Badge>
            {isemoji ? (
              <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }}>
                {symbol}
              </Avatar>

            ) : (
              <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }} >
                {symbol}
              </Avatar>
            )}
            {analytics_data.change?.amount_change_c1 > 0 ? (
              <h1 style={{ color: "green" }}>
                + {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal as number)}
              </h1>
            ) : (
              <h1 style={{ color: "red" }}>
                {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal as number)}
              </h1>
            )}
          </Badge>
        );
      }else{
        const symbol = token_list(analytics_data.change?.coin_1)
        return (
          <Badge>
            <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }} src={symbol}>
            </Avatar>
            {analytics_data.change?.amount_change_c1 > 0 ? (
              <h1 style={{ color: "green" }}>
                + {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal as number)}
              </h1>
            ) : (
              <h1 style={{ color: "red" }}>
                {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal as number)}
              </h1>
            )}
          </Badge>
        ); // ADD: Decimal NOT FOUND
      }
    } else if (analytics_data.change?.coin_1 && analytics_data.change.coin_2 !== undefined) {
      const decimal_c1 = await get_coin_decimal(analytics_data.change?.coin_1);
      const decimal_c2 = await get_coin_decimal(analytics_data.change?.coin_2);
      const isemoji_c1 = emoji_coin_regex.test(analytics_data.change?.coin_1);
      const isemoji_c2 = emoji_coin_regex.test(analytics_data.change?.coin_2);
      let c1_url = isemoji_c1 ? await get_coin_symbol(analytics_data.change?.coin_1) : token_list(analytics_data.change?.coin_1);
      let c2_url = isemoji_c2 ? await get_coin_symbol(analytics_data.change?.coin_2) : token_list(analytics_data.change?.coin_2);
      // console.log("coin1 test =",isemoji_c1,"coin2 test =",isemoji_c2)
      // console.log("coin1 url =", c1_url,"coin2 url =",c2_url)
      if (decimal_c1 != undefined && decimal_c2 != undefined) {
        return (
          <>
            <Row>
              <Col>
                <Badge>
                  <Row>
                    <Col span={4}>
                      {isemoji_c1 ? (
                        <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }}>
                          {c1_url}
                        </Avatar>
                      ) : (
                        <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }} src={c1_url} />
                      )}
                    </Col>
                    <Col >
                      {analytics_data.change?.amount_change_c1 > 0 ? (
                        <h1 style={{ color: "green" }}>
                          + {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal_c1)}
                        </h1>
                      ) : (
                        <h1 style={{ color: "red" }}>
                          {analytics_data.change?.amount_change_c1 / Math.pow(10, decimal_c1)}
                        </h1>
                      )}
                    </Col>
                  </Row>
                </Badge>
              </Col>
              <Col>
                <Badge>
                  {isemoji_c2 ? (
                    <>
                      {/*<Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }}>*/}
                      {/*  */}
                      {/*</Avatar>*/}
                      {c2_url}
                    </>
                  ) : (
                    <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }} src={c2_url} />
                  )}
                  {analytics_data.change?.amount_change_c2 != undefined && (
                    <>
                      {analytics_data.change?.amount_change_c2 > 0 ? (
                        <h1 style={{ color: "green" }}>
                          + {analytics_data.change?.amount_change_c2 / Math.pow(10, decimal_c2)}
                        </h1>
                      ) : (
                        <h1 style={{ color: "red" }}>
                          {analytics_data.change?.amount_change_c2 / Math.pow(10, decimal_c2)}
                        </h1>
                      )}
                    </>
                  )}
                </Badge>
              </Col>
            </Row>
          </>
        );
      } else {
        return <div>Decimal NOT Found</div>;
      }
    } else {
      console.log("unknown change = ",analytics_data)
      return <div>Unknown Change</div>;
    }
  } else if (column === "module") {
    let desplay_icon = ``
    let desplay_data =`${analytics_data.module}`
    if (emoji_regex.test(analytics_data.module)) {
      desplay_icon = "https://www.emojicoin.fun/icon.png";
      desplay_data = "emoji swap";
    } else if (panora_swap_regex.test(analytics_data.module)) {
      desplay_icon = "https://app.panora.exchange/favicon.ico";
      desplay_data = "panora swap";
    }
    return (
      <>
        <Badge>
          <Avatar size={{ xs: 12, sm: 13, md: 15, lg: 16, xl: 17, xxl: 21 }} src={desplay_icon} />
          {desplay_data}
        </Badge>
      </>
    );
  } else {
    return (<div>Unknown column</div>);
  }
}
const get_coin_decimal =async(address:string)=>{
  const regex = /^([^:]+::){2}.*$/;
  const fungible_asset = regex.test(address);
  // console.log("address =",address, "test result =",fungible_asset)
  // console.log("view input",fungible_asset?{
  //   function:"0x1::coin::decimals",
  //   typeArguments:[address]
  // }:{
  //   function:"0x1::fungible_asset::decimals",
  //   typeArguments:["0x1::fungible_asset::Metadata"],
  //   functionArguments:[address]
  // })
  try {
    let response = await aptos.view({
      payload:fungible_asset?{
        function:"0x1::coin::decimals",
        typeArguments:[address]
      }:{
        function:"0x1::fungible_asset::decimals",
        typeArguments:["0x1::fungible_asset::Metadata"],
        functionArguments:[address]
      }
    })
    return Number(response[0])
  }catch(e:unknown){console.log("who = ",address,"test = ",fungible_asset,e)}
  return undefined
}
const get_coin_symbol =async(address:string)=>{
  const regex = /^([^:]+::){2}.*$/;
  const fungible_asset = regex.test(address);
 // console.log("symbol address =",address, "test result =",fungible_asset)
  try {
    let response = await aptos.view({
      payload:fungible_asset?{
        function:"0x1::coin::symbol",
        typeArguments:[address]
      }:{
        function:"0x1::fungible_asset::symbol",
        typeArguments:["0x1::fungible_asset::Metadata"],
        functionArguments:[address]
      }
    })
    return String(response[0])
  }catch(e:unknown){console.log(e)}
  return ""
}

const token_list =(address:string)=>{
  const list =[
    "0x1::aptos_coin::AptosCoin",
    "0x357b0b74bc833e95a115ad22604854d6b0fca151cecd94111770e5d6ffc9dc2b",
    "0xf22bede237a07e121b56d91a491eb7bcdfd1f5907926a9e58338f964a01b17fa::asset::USDC"
  ]
  const return_list =[
    "https://cryptologos.cc/logos/aptos-apt-logo.png?v=040",
    "https://cryptologos.cc/logos/tether-usdt-logo.png?v=040",
    "https://cryptologos.cc/logos/usd-coin-usdc-logo.png?v=040"
  ]
  for(let i = 0 ; i < list.length;i++){
    if(address == list[i]){
      return return_list[i]
    }
  }
  return ""
}