'use client'

import { Card, Button, Col, Row } from 'antd';
function NFTCard(props: { token:any }) {
    const { Meta } = Card;
    const  current_token_data  = props.token
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
    return (
        <Card
            hoverable
            style={{ width: 240 }}
            cover={<img alt="example" src={httpsUri} />}
        >
            <Meta title={current_token_data?.token_name} description={current_token_data?.current_collection?.description} />
            <Button>Join</Button>
            <Button>Start</Button>
        </Card>
    )
}

export default NFTCard;