'use client'
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { GetAccountOwnedTokensQueryResponse } from "@aptos-labs/ts-sdk";
import MyNFTCard from "@/components/common/MyNftCard/card";
import useAptos from "@/context/useAptos";
import axios from "axios";
const envcollectionid = "0xcdc829e9a7994cd0607e65c2e3e8dde3d2dd4227547397f179fc970d0eda623f";
const graphqlaptos = "https://api.devnet.aptoslabs.com/v1/graphql";

function Page() {
  const { aptos, moduleAddress } = useAptos();
  const { account, signAndSubmitTransaction } = useWallet();
  const [tokenList, setTokenList] = useState<GetAccountOwnedTokensQueryResponse>([])
  const fetchList = async () => {
    if (!account) return [];
    try {
      const graphqlbody = {
        query: `
          query MyQuery { current_token_datas_v2(where: 
            {collection_id: {_eq: \"${envcollectionid}\"}, 
            current_token_ownerships: 
            {owner_address: {_eq: \"${account?.address}\"}}}) 
            { token_name 
              token_uri
              description
              last_transaction_version
             } }
          `,
        operationName: "MyQuery",
      };

      const response = await axios.post(`${graphqlaptos}`, graphqlbody, {
        headers: {
          Accept: "application/json, text/plain, */*",
          "Content-Type": "application/json",
          // Authorization: `Bearer ${auth}`,
        },
      });

      console.log("my nfts", response);
      console.log("my nft", response.data.data.current_token_datas_v2)
      setTokenList(response.data.data.current_token_datas_v2);
      // const tokens = await aptos.getAccountOwnedTokens({ accountAddress: account?.address });
      // console.log('tokens:', tokens)
      // setTokenList(tokens)
    } catch (e: any) {
      console.log(e);
    }
  };
  useEffect(() => {
    fetchList();
  }, [account?.address]);
  return (
    <div className="flex justify-center mt-10">
      <div className="w-2/3 flex flex-wrap justify-start gap-4">
        {tokenList?.map((item, index) => {
          return (
            <MyNFTCard token={item} key={index} />
          )
        })}

      </div>
    </div>
  )
}
export default Page;