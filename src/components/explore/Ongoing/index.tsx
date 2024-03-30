"use client";
import { useState } from "react";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import Lottie from "lottie-react";
import notFound from "@/components/Empty/notFound.json";
import Link from "next/link";
import Button from "@/components/common/Button";
import { useAddress } from "@thirdweb-dev/react";
import { enqueueSnackbar } from "notistack";
import { Aptos, AptosConfig, Network } from "@aptos-labs/ts-sdk";
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";

const Ongoing = () => {
  const aptosConfig = new AptosConfig({ network: Network.TESTNET });
  const aptos = new Aptos(aptosConfig);
  // replace with your own address
  const moduleAddress = "0xfbd0e6df8ee79607de7f4e421ff1bc6ae040bec42b7a54ba425c787292573b81";
  const { account, signAndSubmitTransaction } = useWallet();

  const fetchList = async () => {
    if (!account) return [];
    try {
      const todoListResource = await aptos.getAccountResource(
        {
          accountAddress: account?.address,
          resourceType: `${moduleAddress}::cw::State`
        }
      );
      const tokens = await aptos.getAccountOwnedTokens({ accountAddress: account?.address });
      console.log('tokens:', tokens)
      // tasks table handle
      // const tableHandle = (todoListResource as any).tasks.handle;
      // // tasks table counter
      // const taskCounter = (todoListResource as any).task_counter;

      // let tasks = [];
      // let counter = 1;
      // while (counter <= taskCounter) {
      //   const tableItem = {
      //     key_type: "u64",
      //     value_type: `${moduleAddress}::todolist::Task`,
      //     key: `${counter}`,
      //   };
      //   const task = await aptos.getTableItem({ handle: tableHandle, data: tableItem });
      //   tasks.push(task);
      //   counter++;
      // }

    } catch (e: any) {
    }
  };






  const [selectedValue, setSelectedValue] = useState<any>(null);
  const { proposal, votes, setVotes, votesPercentage, setVotesPercentage } =
    useProposal();
  const address = useAddress();
  const handleSubmit = (e: any) => {
    e.preventDefault();

    // Update the votes count based on the user's vote
    const newVotes = { ...votes };
    if (selectedValue === "like") {
      newVotes.likes += 1;
    } else {
      newVotes.dislikes += 1;
    }
    setVotes(newVotes);

    // Calculate and update the votes percentage
    const totalVotes = newVotes.likes + newVotes.dislikes;
    const percentage = (newVotes.likes / totalVotes) * 100;
    setVotesPercentage(percentage);

    // Display the vote alert
    enqueueSnackbar(`${selectedValue} `, {
      variant: `${selectedValue == "like" ? "success" : "error"}`,
    });
  };

  if (!proposal)
    return (
      <div className="flex flex-col gap-4 justify-center items-center mt-20">
        <Lottie animationData={notFound} loop={true} />
        <div className="text-lg">No ongoing proposal</div>
      </div>
    );

  return (
    <>
      <div className="flex justify-center mt-8 ">
        <div>
          {/* --------------------------------------- proposal card -------------------  */}
          <div className="w-[500px text-sm  border rounded-sm py-8 px-8 max-w-xl flex flex-col gap-4">
            <div className=" text-2xl mb-1 font-semibold">{proposal.title}</div>
            <div>{proposal.description}</div>
            <div>Price Per NFT: {proposal.priceperNFT} MATIC </div>
            <div>Funding Goal: {proposal.funding_goal} MATIC</div>
            <div>Valid Till: {proposal.date.$d.toDateString()}</div>
            <div className="">Created by: {address}</div>

            {/* --------------------------------------  */}
            <form onSubmit={handleSubmit}>
              <div className="flex gap-6 justify-center">
                <div>
                  <label>
                    <input
                      type="radio"
                      value="dislike"
                      id="response"
                      checked={selectedValue === "dislike"}
                      onChange={() => setSelectedValue("dislike")}
                      required
                      className="hidden"
                    />
                    <div
                      className={`w-12 h-12 flex justify-center items-center text-lg hover:text-2xl hover:border-blue-500 py-2 border  rounded-sm cursor-pointer ${selectedValue === "dislike" && "border-blue-500 "
                        }`}
                    >
                      👎
                    </div>
                  </label>
                </div>
                <div>
                  <label>
                    <input
                      id="response"
                      type="radio"
                      value="like"
                      checked={selectedValue === "like"}
                      onChange={() => setSelectedValue("like")}
                      required
                      className="hidden"
                    />
                    <div
                      className={`w-12 h-12 flex  text-lg justify-center items-center hover:text-2xl  hover:border-blue-500 py-2 border  rounded-sm cursor-pointer ${selectedValue === "like" && "border-blue-500"
                        }`}
                    >
                      👍
                    </div>
                  </label>
                </div>
              </div>

              <div className="flex justify-center mt-4">
                <Button variant="primary" size="md" type="submit">
                  Vote
                </Button>
              </div>
            </form>
            {/* --------------------------------------  */}
          </div>

          {/* --------------------------------------- proposal card -------------------  */}
        </div>
      </div>
    </>
  );
};

export default Ongoing;
