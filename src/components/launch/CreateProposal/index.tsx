"use client";

import { Formik, Form, Field, ErrorMessage } from "formik";
import Button from "@/components/common/Button";
import { Input, InputNumber, Radio, DatePicker } from "antd";
import { useProposal } from "@/ContextProviders/ProposalProvider";
import { enqueueSnackbar } from "notistack";

const CreateProposal = () => {
  const { setProposal } = useProposal();

  interface FormMessage {
    description: string;
    title: string;
    priceperNFT: number;
    funding_goal: number;
    proposal_type: string;
    date: any;
  }
  const initialValues: FormMessage = {
    title: "",
    description: "",
    priceperNFT: 1,
    funding_goal: 20,
    proposal_type: "",
    date: ``,
  };
  return (
    <div className="flex justify-center">
      <div className="text-sm mt-8  py-8 px-8 max-w-lg rounded-md border mb-6 ">
        <div className="flex justify-center">
          <Formik
            initialValues={initialValues}
            onSubmit={(values, actions) => {
              setProposal(values);
              enqueueSnackbar(`${values.title} has been created`, {
                variant: "success",
              });
              actions.setSubmitting(false);
            }}
          >
            {({ isSubmitting, setFieldValue, values }) => (
              <Form>
                <div className="text-center text-2xl mb-1  font-semibold">
                  Submit Proposal
                </div>
                <div className="text-center mb-6 italic">
                  Submit your project proposals and ideas for community votes
                  and crowdfunding
                </div>
                <div className="flex flex-col gap-6">
                  {/* ------------------------  */}
                  <div>
                    <label className="font-medium" htmlFor="title">
                      Proposal Title
                    </label>
                    <div className="mt-2">
                      <Input
                        required
                        value={values.title}
                        onChange={(e: { target: { value: string } }) => {
                          setFieldValue("title", e.target.value);
                        }}
                      />
                    </div>
                  </div>
                  {/* -------------  */}

                  {/* ------------------------  */}
                  <div>
                    <label className="font-medium" htmlFor="description">
                      Description
                    </label>
                    <div className=" mt-2">
                      <Input.TextArea
                        required
                        value={values.description}
                        onChange={(e: { target: { value: string } }) => {
                          setFieldValue("description", e.target.value);
                        }}
                      />
                    </div>
                  </div>

                  {/* -------------  */}
                  <div className="flex items-center gap-8">
                    {/* ------------------------  */}
                    <div>
                      <label className="font-medium" htmlFor="priceperNFT">
                        Price per NFT
                      </label>
                      <div className="mt-2">
                        <InputNumber
                          required
                          value={values.priceperNFT}
                          onChange={(e) => {
                            setFieldValue("priceperNFT", e);
                          }}
                        />
                      </div>
                    </div>

                    {/* -------------  */}

                    {/* ------------------------  */}
                    <div>
                      <label className="font-medium" htmlFor="funding_goal">
                        Funding Goal
                      </label>
                      <div className="mt-2">
                        <InputNumber
                          required
                          value={values.funding_goal}
                          onChange={(e) => {
                            setFieldValue("funding_goal", e);
                          }}
                        />
                      </div>
                    </div>

                    {/* -------------  */}
                  </div>
                  {/* ------------ */}
                  <Radio.Group
                    onChange={(e) => {
                      setFieldValue("proposal_type", e.target.value);
                    }}
                    value={values.proposal_type}
                  >
                    <Radio value={"collab"} className="!font-raleway">
                      {" "}
                      TokenFest Collab
                    </Radio>
                    <Radio value={"holder"} className="!font-raleway">
                      {" "}
                      TokenFest Holder
                    </Radio>
                  </Radio.Group>

                  {/* ----------  */}

                  {/* ----------------------  */}
                  <div>
                    <div>
                      <label htmlFor="date" className="block mb-2">
                        Valid till
                      </label>

                      <DatePicker
                        onChange={(e) => {
                          setFieldValue("date", e);
                        }}
                      />
                    </div>
                  </div>

                  {/* ---------------------- */}
                </div>

                <div className="flex justify-center mt-5">
                  <Button
                    className="flex justify-center"
                    variant="primary"
                    size="md"
                    type="submit"
                    _isSubmitting={isSubmitting}
                    disabled={isSubmitting}
                  >
                    Create Proposal
                  </Button>
                </div>
              </Form>
            )}
          </Formik>
        </div>
      </div>
    </div>
  );
};

export default CreateProposal;
