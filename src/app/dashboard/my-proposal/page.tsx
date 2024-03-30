'use client'
import { useEffect, useState } from "react";
import { useWallet } from "@aptos-labs/wallet-adapter-react";
import { GetAccountOwnedTokensQueryResponse } from "@aptos-labs/ts-sdk";
import MyNFTCard from "@/components/common/MyNftCard/card";
import useAptos from "@/context/useAptos";


function Page() {
  const { aptos, moduleAddress } = useAptos();
  const { account, signAndSubmitTransaction } = useWallet();
  const [tokenList, setTokenList] = useState<GetAccountOwnedTokensQueryResponse>([])
  const fetchList = async () => {
    if (!account) return [];
    try {
      const tokens = await aptos.getAccountOwnedTokens({ accountAddress: account?.address });
      console.log('tokens:', tokens)
      setTokenList(tokens)
    } catch (e: any) {
    }
  };
  useEffect(() => {
    fetchList();
  }, [account?.address]);
  return (
    <div className="flex justify-center mt-10">
      <div className="w-2/3 flex flex-wrap justify-start gap-4">
        {tokenList.map((item, index) => {
          return (
            <MyNFTCard token={item} key={index} />
          )
        })}

      </div>
    </div>
  )
}
export default Page;