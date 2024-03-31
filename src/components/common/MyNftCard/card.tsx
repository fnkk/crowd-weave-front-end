'use client'
import { useEffect, useState } from 'react';
import { Card, Button, Col, Row, Modal, Form, Input, Select } from 'antd';
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import useAptos from "@/context/useAptos";
import { removePrefix } from "../../../modules/ipfsUtil";

function NFTCard(props: { token: any, key:any }) {
  const { Meta } = Card;
  const { aptos, moduleAddress } = useAptos();
  const current_token_data = props.token;
  const key = props.key;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [mileStoneList, setMileStoneList] = useState<any>([])
  const [mileStonesNow, setMilestonesNow] = useState<any>(0)
  const [isVotingOpen, setIsVotingOpen] = useState<any>()
  const [isMilestonDown, setIsMilestonDown] = useState<any>(1)
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 6 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const fetchDetail = async () => {
    try {
      const res = await aptos.view({
        payload: {
          function: `${moduleAddress}::cw::get_milestones_details`,
          functionArguments: [
            props.token.token_data_id
          ],
        }
      })
      if (res[0] && Array.isArray(res[0])) {
        setMileStoneList(res[0].map((i: any, index: number) => {
          return {
            value: (index + 1).toString(),
            label: i
          }
        }))
      }
    } catch (err) {
      console.error(err)
    }


  }
  const getMilestonesNow = async () => {
    try {
      const res = await aptos.view({
        payload: {
          function: `${moduleAddress}::cw::get_no_completed_milestones`,
          functionArguments: [
            props.token.token_data_id
          ],
        }
      })
      setMilestonesNow(res[0])
    } catch (err) {
      console.error(err)
    }


  }
  const getIsVotingOpen = async () => {
    try {
      const res = await aptos.view({
        payload: {
          function: `${moduleAddress}::cw::is_voting_open`,
          functionArguments: [
            props.token.token_data_id
          ],
        }
      })
      setIsVotingOpen(res[0])
    } catch (err) {
      console.error(err)
    }


  }
  const getIsMilestonDown = async () => {
    try {
      const res = await aptos.view({
        payload: {
          function: `${moduleAddress}::dao::how_many_more_votes_required`,
          functionArguments: [
            props.token.token_data_id
          ],
        }
      })
      setIsMilestonDown(res[0])
    } catch (err) {
      console.error(err)
    }


  }

  const conclude_milestone = async () => {
    if (!account) return [];
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::cw::conclude_milestone`,
        functionArguments: [props.token.token_data_id, (parseInt(mileStonesNow, 10) + 1).toString()]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });

    } catch (error: any) {
      console.log('error:', error)
    }
  }
  const conclude_campaign = async () => {
    if (!account) return [];
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::cw::conclude_campaign`,
        functionArguments: [props.token.token_data_id]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });

    } catch (error: any) {
      console.log('error:', error)
    }
  }
  const Voting = async (type: string) => {
    if (!account) return [];
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::cw::vote_proposal`,
        functionArguments: [props.token.token_data_id, (parseInt(mileStonesNow, 10) + 1).toString(), type]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });

    } catch (error: any) {
      console.log('error:', error)
    }
  }


  const showModal = () => {
    fetchDetail()
    setIsModalOpen(true);
  };

  const handleOk = () => {
    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const { account, signAndSubmitTransaction } = useWallet();
  const [campaigndetails, setcampaigndetails] = useState(null);

  /**
* Converts an IPFS link to an HTTPS URL using a specified gateway.
* 
* @param ipfsUrl The IPFS URL to convert, starting with 'ipfs://'.
* @param gateway The IPFS gateway to use for the conversion, defaults to 'https://ipfs.io/ipfs/'.
* @returns The HTTPS URL corresponding to the given IPFS link.
*/
  function convertIpfsToHttps(ipfsUrl: string, gateway: string = 'https://ipfs.io/ipfs/'): string {
    // Check if the URL starts with 'ipfs://'
    if (!ipfsUrl.startsWith('ipfs://')) {
      throw new Error('Invalid IPFS URL');
    }

    // Remove the 'ipfs://' prefix and return the full HTTPS URL
    const hash = ipfsUrl.slice(7); // Remove 'ipfs://' (7 characters)
    return `${gateway}${hash}`;
  }
  const ipfsUri = current_token_data?.token_uri;

  const startCampaign = async () => {
    // setloading(true);
    const id = current_token_data?.token_name;
    const regex = /#(\d+):/; // Regular expression to match the number after '#' and before ':'
    const match = id.match(regex);
    const idfinal = parseInt(match[1]);

    try {
      const mintTransaction = {
        arguments: [current_token_data?.token_data_id],
        function:
          `${moduleAddress}::cw::start_campaign`,
        type: "entry_function_payload",
        type_arguments: [],
      };

      const mintResponse = await (window as any).aptos.signAndSubmitTransaction(
        mintTransaction
      );
      //   setstartbuttonclick(true);
    } catch (error) {
      console.error("Error handling", error);
    } finally {
      //   setloading(false);
    }
  };


  const joinCampaign = async () => {
    // setloading(true);
    const id = current_token_data?.token_name;
    const regex = /#(\d+):/; // Regular expression to match the number after '#' and before ':'
    const match = id.match(regex);
    const idfinal = parseInt(match[1]);

    try {
      const mintTransaction = {
        arguments: [idfinal, current_token_data?.token_data_id],
        function:
          `${moduleAddress}::cw::join_campaign`,
        type: "entry_function_payload",
        type_arguments: [],
      };

      const mintResponse = await (window as any).aptos.signAndSubmitTransaction(
        mintTransaction
      );
      //   setstartbuttonclick(true);
    } catch (error) {
      console.error("Error handling", error);
    } finally {
      //   setloading(false);
    }
  };


  const milestoneCompletion = async (data: Array<any>) => {
    if (!account) return [];
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::cw::milestone_completion_proposal`,
        functionArguments: [...data]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });

    } catch (error: any) {
      console.log('error:', error)
    }
  }



  const onFinish = (values: any) => {
    milestoneCompletion([
      props.token.token_data_id,
      values.milestone,
      values.proof,
    ])
  }

  const getcollection = async () => {
    let ticketDatabody = {
      "function": `${moduleAddress}::cw::get_campaign_vals`,
      "type_arguments": [],
      "arguments": [current_token_data?.token_data_id]
    }

    try {
      const res = await fetch(
        `https://fullnode.devnet.aptoslabs.com/v1/view`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            // 'Authorization': `Bearer ${auth}`
          },
          body: JSON.stringify(ticketDatabody),
        }
      );

      const colllection = await res.json();
      setcampaigndetails(colllection[0]);
    }
    catch (error) {
      console.error("Error fetching nft data:", error);
    }
  }
  useEffect(() => {
    getMilestonesNow();
    getIsMilestonDown();
    getIsVotingOpen();
    getcollection();
  }, [])


  return (
    <>
      <Card
        hoverable
        style={{ width: 240 }}
        cover={<img alt="example" src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
          current_token_data?.token_uri)}`} />}
      >
        <Meta title={current_token_data?.token_name} description={current_token_data?.current_collection?.description} />
        <div>Name: {current_token_data[key]?.token_description}</div>
    
      </Card>
      </>
  )
}

export default NFTCard;