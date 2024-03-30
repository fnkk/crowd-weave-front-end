"use client";
import {useState} from 'react';
import {
  Button,
  Cascader,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Mentions,
  Select,
  TreeSelect,
  message
} from 'antd';
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import useAptos from "@/context/useAptos";
import { NFTStorage } from "nft.storage";
const client = new NFTStorage({ token: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDFFODE2RTA3RjBFYTg4MkI3Q0I0MDQ2QTg4NENDQ0Q0MjA4NEU3QTgiLCJpc3MiOiJuZnQtc3RvcmFnZSIsImlhdCI6MTY3MzI0NTEzNDc3MywibmFtZSI6Im5mdCJ9.vP9_nN3dQHIkN9cVQH5KvCLNHRk3M2ZO4x2G99smofw" });
import { removePrefix } from "../../../modules/ipfsUtil";

const CreateProposal = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const { aptos, moduleAddress } = useAptos();
  const { account, signAndSubmitTransaction } = useWallet();
  const [picture, setpicture] = useState('');
  const formItemLayout = {
    labelCol: {
      xs: { span: 24 },
      sm: { span: 10 },
    },
    wrapperCol: {
      xs: { span: 24 },
      sm: { span: 14 },
    },
  };
  const { RangePicker } = DatePicker;
  const onFinish = (values: any) => {
    console.log(6666)
    console.log(values.start_time.valueOf())
    createProposal([
      values.campaign_name,
      // values.start_time.valueOf(),
      '1',
      values.min_entry_price.toString(),
      values.unit_price.toString(),
      values.collection_name,
      picture,
      values.target.toString(),
      values.the_first_stage_goal,
      values.the_second_stage_goal,
      values.the_third_stage_goal,
      values.the_fourth_stage_goal,
    ])
  };

  async function uploadImage(e:any) {
    e.preventDefault();
    try {
      // setLoading(true);
      const blobDataImage = new Blob([e.target.files[0]]);
      const metaHash = await client.storeBlob(blobDataImage);
      setpicture(`ipfs://${metaHash}`);
      console.log("profilePictureUrl",metaHash)
    } catch (error) {
      console.log("Error uploading file: ", error);
    } finally {
      // setLoading(false);
    }
  }


  const createProposal = async (data: Array<any>) => {
    if (!account) return [];
    const transaction: InputTransactionData = {
      data: {
        function: `${moduleAddress}::cw::create_campaign`,
        functionArguments: [...data]
      }
    }
    try {
      // sign and submit transaction to chain
      const response = await signAndSubmitTransaction(transaction);
      // wait for transaction
      await aptos.waitForTransaction({ transactionHash: response.hash });
      messageApi.success('You are succeed!');

    } catch (error: any) {
      console.log('error:', error)
    }
  }
  return (
    <div className="flex justify-center ">
      {contextHolder}
      <div className="text-sm mt-8 py-8 px-8 rounded-md border mb-6 w-[660px]">
        <Form {...formItemLayout} variant="filled" style={{ maxWidth: 800 }} onFinish={onFinish}>
          <Form.Item label="campaign_name" name="campaign_name" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="start_time"
            name="start_time"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <DatePicker />
          </Form.Item>
          <Form.Item
            label="min_entry_price"
            name="min_entry_price"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            label="unit_price"
            name="unit_price"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item label="collection_name" name="collection_name" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label=" collection_uri" name="collection_uri" rules={[{ required: true, message: 'Please input!' }]}>
            <div className="w-full h-48 ring-1 ring-gray-200 mb-10">
                {picture ? (
                  <>
                    <img
                      alt="alt"
                      src={`${'https://nftstorage.link/ipfs'}/${removePrefix(
                        picture
                      )}`}
                      className=""
                      // width="200"
                      // height="200"
                    />
                  </>
                ) : (
                  <>
                    <label
                      htmlFor="upload"
                      className="flex flex-col items-center gap-2 cursor-pointer -mt-4 ml-2"
                    >
                      <input
                        id="upload"
                        type="file"
                        className="hidden invisible"
                        onChange={uploadImage}
                        accept="image/*"
                      />
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-10 w-10 fill-white stroke-indigo-500"
                        viewBox="0 0 32 32"
                        stroke="currentColor"
                        stroke-width="2"
                      >
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                        />
                      </svg>
                    </label>
                  </>
                )}
              </div>
          </Form.Item>
          <Form.Item
            label="target"
            name="target"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>

          <Form.Item label="first stage goal" name="the_first_stage_goal" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="second stage goal" name="the_second_stage_goal" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="third stage goal" name="the_third_stage_goal" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item label="fourth stage goal" name="the_fourth_stage_goal" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>

          <Form.Item wrapperCol={{ offset: 6, span: 16 }}>
            <Button type="primary" htmlType="submit">
              Submit
            </Button>
          </Form.Item>
        </Form>
      </div>

    </div>
  );
};

export default CreateProposal;
