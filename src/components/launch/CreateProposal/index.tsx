"use client";
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
} from 'antd';
import { useWallet, InputTransactionData, } from "@aptos-labs/wallet-adapter-react";
import useAptos from "@/context/useAptos";

const CreateProposal = () => {
  const { aptos, moduleAddress } = useAptos();
  const { account, signAndSubmitTransaction } = useWallet();
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
    console.log(values);
    createProposal([
      values.campaign_name,
      '202020202',
      values.min_entry_price.toString(),
      values.unit_price.toString(),
      values.collection_name,
      values.collection_uri,
      values.target.toString(),
    ])
  };
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
    } catch (error: any) {
      console.log('error:', error)
    }
  }
  return (
    <div className="flex justify-center">
      <div className="text-sm mt-8  py-8 px-8 rounded-md border mb-6 ">

        <Form {...formItemLayout} variant="filled" style={{ maxWidth: 800 }} onFinish={onFinish}>
          <Form.Item label="campaign_name" name="campaign_name" rules={[{ required: true, message: 'Please input!' }]}>
            <Input />
          </Form.Item>
          <Form.Item
            label="start_time"
            name="start_time"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <DatePicker format="YYYY-MM-DD" />
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
            <Input />
          </Form.Item>
          <Form.Item
            label="target"
            name="target"
            rules={[{ required: true, message: 'Please input!' }]}
          >
            <InputNumber style={{ width: '100%' }} />
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
