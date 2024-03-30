'use client'
import { useEffect, useState} from 'react';
import { Card, Button, Col, Row } from 'antd';
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";

function NFTCard(props: { token:any }) {
    const { Meta } = Card;
    const  current_token_data  = props.token
    console.log(current_token_data);

    const { signAndSubmitTransaction } = useWallet();
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
            console.log(ipfsUrl)
            throw new Error('Invalid IPFS URL');
        }

        // Remove the 'ipfs://' prefix and return the full HTTPS URL
        const hash = ipfsUrl.slice(7); // Remove 'ipfs://' (7 characters)
        return `${gateway}${hash}`;
    }
    const ipfsUri = current_token_data?.current_collection?.uri;
    const httpsUri = ipfsUri ? convertIpfsToHttps(ipfsUri) : "404";

    const startCampaign = async () => {
        // setloading(true);
        const id  = current_token_data?.token_name;
        const regex = /#(\d+):/; // Regular expression to match the number after '#' and before ':'
        const match = id.match(regex);
        const idfinal = parseInt(match[1]);
    
        try {
          const mintTransaction = {
            arguments: [current_token_data?.token_data_id],
            function:
              "0xcfcdcdf5798fd485e834f4cdf657685a68746bad02f439880f6707b0ccc57220::cw::start_campaign",
            type: "entry_function_payload",
            type_arguments: [],
          };
    
          const mintResponse = await (window as any).aptos.signAndSubmitTransaction(
            mintTransaction
          );
          console.log("created game:", mintResponse);
        //   setstartbuttonclick(true);
        } catch (error) {
          console.error("Error handling", error);
        } finally {
        //   setloading(false);
        }
      };


      useEffect(() => {

        const getcollection  = async () => {
          let ticketDatabody = {
          "function":"0xcfcdcdf5798fd485e834f4cdf657685a68746bad02f439880f6707b0ccc57220::cw::get_campaign_vals",
          "type_arguments":[],
          "arguments":[current_token_data?.token_data_id]
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
        console.log("view fucntion res", colllection);
        }
        catch(error){
          console.error("Error fetching nft data:", error);
        }
      }
        getcollection();
      }, [])


    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src={httpsUri} />}
        >
            <Meta title={current_token_data?.token_name} description={current_token_data?.current_collection?.description} />
            <div>Start Time : {campaigndetails?campaigndetails[0]:''}</div>
            <div>Min entry price : {campaigndetails?campaigndetails[1]:''}</div>
            <div>Unit price : {campaigndetails?campaigndetails[2]:''}</div>
            <div>Target : {campaigndetails?campaigndetails[3]:''}</div>
            <div>Total supply : {campaigndetails?campaigndetails[4]:''}</div>
            <Button>Join</Button>
            <Button onClick={startCampaign}>Start</Button>
        </Card>
    )
}

export default NFTCard;