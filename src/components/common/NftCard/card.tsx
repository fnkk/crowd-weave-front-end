'use client'
import { useEffect, useState } from 'react';
import { Card, Button, Col, Row, Modal, Form, Input, Select } from 'antd';
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import useAptos from "@/context/useAptos";
import { removePrefix } from "../../../modules/ipfsUtil";

function NFTCard(props: { token: any }) {
  const { Meta } = Card;
  const { aptos, moduleAddress } = useAptos();
  const current_token_data = props.token
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
        style={{
          border: "1px solid #0162FF",
          boxShadow: "inset -10px -10px 60px 0 rgba(255, 255, 255, 0.4)",
          background: '#DCBFFF',
          width: 400
        }}
        cover={<img alt="example" src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
          ipfsUri
        )}`} />}
      >
        <Meta title={current_token_data?.token_name} description={current_token_data?.current_collection?.description} />
        <div className="flex justify-between">
          <div>
        <div>Start Time : {campaigndetails ? campaigndetails[0] : ''}</div>
        <div>Min entry price : {campaigndetails ? campaigndetails[1] : ''}</div>
        <div>Unit price : {campaigndetails ? campaigndetails[2] : ''}</div>
        </div>
        <div>
        <div>Target : {campaigndetails ? campaigndetails[3] : ''}</div>
        <div>Total supply : {campaigndetails ? campaigndetails[4] : ''}</div>
        </div>
        </div>

        <div className="flex justify-between">
        <Button onClick={joinCampaign}>Join</Button>
        {campaigndetails && campaigndetails[4] >= campaigndetails[3] &&
          (
            <Button onClick={startCampaign}>Start</Button>
          )}
          </div>
        <Button onClick={showModal}>milestone Completion</Button>
        <div className="flex justify-between">
        <Button disabled={!isVotingOpen} onClick={() => Voting('true')}>Voting for Agree</Button>
        <Button disabled={!isVotingOpen} onClick={() => Voting('false')}>Voting for Against</Button>
        </div>
        <div className="flex justify-between">
        <Button disabled={!isMilestonDown} onClick={() => conclude_milestone()}>conclude_milestone</Button>
        <Button disabled={mileStonesNow!=4} onClick={() => conclude_campaign()}>conclude_campaign</Button>
        </div>
        <div className="space-y-2">
          <div>Start Time: <span className="font-semibold">{campaigndetails ? campaigndetails[0] : ''}</span></div>
          <div>Min entry price: <span className="font-semibold">{campaigndetails ? campaigndetails[1] : ''}</span></div>
          <div>Unit price: <span className="font-semibold">{campaigndetails ? campaigndetails[2] : ''}</span></div>
          <div>Target: <span className="font-semibold">{campaigndetails ? campaigndetails[3] : ''}</span></div>
          <div>Total supply: <span className="font-semibold">{campaigndetails ? campaigndetails[4] : ''}</span></div>
        </div>
        <div className='flex flex-col gap-2 mt-4'>
          <Button onClick={joinCampaign}>Join</Button>
          {campaigndetails && campaigndetails[4] >= campaigndetails[3] &&
            (
              <Button onClick={startCampaign}>Start</Button>
            )}
          <Button onClick={showModal}>milestone Completion</Button>
          {isVotingOpen && <Button disabled={!isVotingOpen} onClick={() => Voting('true')}>Voting for Agree</Button>}
          {isVotingOpen && <Button disabled={!isVotingOpen} onClick={() => Voting('false')}>Voting for Against</Button>}
          {isMilestonDown && <Button disabled={!isMilestonDown} onClick={() => conclude_milestone()}>conclude_milestone</Button>}
          {mileStonesNow == 4 && <Button disabled={mileStonesNow != 4} onClick={() => conclude_campaign()}>conclude_campaign</Button>}
        </div>

      </Card>
      <Modal title="Basic Modal" open={isModalOpen} onCancel={handleCancel} footer={null}>

        <Form {...formItemLayout} variant="filled" style={{ maxWidth: 800 }} onFinish={onFinish}>

          <Form.Item label="milestone" name="milestone" rules={[{ required: true, message: 'Please input!' }]}>
            <Select
              defaultValue={mileStonesNow}
              style={{ width: 120 }}
              options={mileStoneList}
            />
          </Form.Item>
          <Form.Item label="expiration_secs" name="expiration_secs" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>


          <Form.Item label=" proof" name="proof" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>



          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </>

  )
}

export default NFTCard;