"use client";
import { useEffect, useState } from "react";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useAddress } from "@thirdweb-dev/react";
import { enqueueSnackbar } from "notistack";
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import useAptos from "@/context/useAptos";
import NFTCard from "@/components/common/NftCard/card";

const Ongoing = () => {
  const { aptos, moduleAddress } = useAptos();
  const { account, signAndSubmitTransaction } = useWallet();
  const [nftList, setNftList] = useState<any>([]);
  const [collection, setCollection] = useState<any>();
  const fetchList = async () => {
    // if (!account) return [];
    const res = await aptos.view({
      payload: {
        function: `${moduleAddress}::cw::get_collection_address`,
        functionArguments: []
      }
    })
    console.log(res, '-----------------------------')
    setCollection(res[0])
    fetchNft(res[0])
  };
  const fetchNft = async (id:any) => {
    const getCollectionTokensQuery = /* GraphQL */ `
      query CollectionTokens($collection_id: String, $limit: Int, $offset: Int) {
        current_token_datas_v2(
          where: { collection_id: { _eq: $collection_id } }
          order_by: { token_name: asc }
          limit: $limit
          offset: $offset
        ) {
          description
          largest_property_version_v1
          last_transaction_timestamp
          token_data_id
          token_name
          token_standard
          token_uri
        }
      }
`;
    const response: {
      current_token_datas_v2: {
        description: string;
        largest_property_version_v1: number | null;
        last_transaction_timestamp: string;
        token_data_id: string;
        token_name: string;
        token_standard: 'v1' | 'v2';
        token_uri: string;
      }[];
    } = await aptos.queryIndexer({
      query: {
        query: getCollectionTokensQuery,
        variables: {
          collection_id: id,
          offset: 0, // TODO: use sort key and reverse
          limit: 100
        }
      }
    });
    console.log(response, '********************')

    setNftList(response.current_token_datas_v2)
  }
  useEffect(() => {
     fetchList()
  }, [])


  if (1)
    return (
      <div className="flex flex-col gap-4 justify-center items-center mt-20">

        {nftList.map((item: any, index: any) => {
          return (
            <NFTCard token={item} key={index} />
          )
        })}
        <button onClick={fetchList}>  test</button>
        <button onClick={fetchNft}>  getNft</button>
      </div>
    );

  return (
    <>
      <div className="flex flex-col gap-4 justify-center items-center mt-20">
        <Lottie animationData={notFound} loop={true} />
        <div className="text-lg">No ongoing proposal</div>
      </div>
    </>
  );
};

export default Ongoing;
