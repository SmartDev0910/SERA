import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Typography,
  Divider,
  Table,
  Pagination,
  Modal,
  Select,
  Spin,
  Input,
  Rate,
  message,
} from "antd";
import provAbi from "../abis/provenanceAbi.json";
import trackAbi from "../abis/trackingAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import axios from "axios";

import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const AuthParties = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [busPartnerOp, setBusPartnerOp] = useState([]);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [provider, setProvider] = useState();
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    organization: "",
    org_type: "",
    org_wallet_address: "",
  });
  const { chainId, active, account } = useWeb3React();
  let ProvContract = null;
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;

  const calculateRate = (val) => {
    if (val % 10 >= 5) {
      return val / 10 + 0.5;
    } else {
      return val / 10;
    }
  };

  const columns = [
    {
      title: "Organization",
      dataIndex: "organization",
      sorter: {
        compare: (a, b) => a.organization - b.organization,
        multiple: 1,
      },
    },
    {
      title: "Organization Type",
      dataIndex: "org_type",
      sorter: {
        compare: (a, b) => a.org_type - b.org_type,
        multiple: 2,
      },
    },
    {
      title: "Organization Wallet Address",
      dataIndex: "org_wallet_address",
      sorter: {
        compare: (a, b) => a.org_wallet_address - b.org_wallet_address,
        multiple: 3,
      },
    },
    {
      title: "Reputation",
      dataIndex: "reputation",
      render: (data) => <Rate allowHalf disabled value={calculateRate(data)} />,
      sorter: {
        compare: (a, b) => a.reputation - b.reputation,
        multiple: 4,
      },
    },
  ];

  const updateOrganizations = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );
    let TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );
    let tmp = [];
    let pro_count = await ProvContract.producer_count();

    for (let i = 0; i < pro_count; i++) {
      let pro_address = await ProvContract.producer_list(i);
      let org = await ProvContract.producers(pro_address);
      let reputation = await TrackContract.calculateReputation(pro_address);
      tmp.push({
        organization: org.name,
        org_type: org.producer_type,
        org_wallet_address: pro_address,
        reputation: reputation,
      });
    }

    await setData(tmp);
    setLoading(false);
  };

  const onChange = (pagination, filters, sorter, extra) => {
    console.log("params", pagination, filters, sorter, extra);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const onSearch = (value) => {
    setSearchText(value);
  };
  const handleOk = async () => {
    setLoading1(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );
    let { organization, org_type, org_wallet_address } = state;
    await ProvContract.addProducer(org_wallet_address, organization, org_type)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            message.success("Added new producer successfully.", 5);
            setLoading1(false);
            updateOrganizations();
            return true;
          },
          (error) => {
            message.error("Had some errors." + error, 5);
            setLoading1(false);
          }
        );
      })
      .catch((error) => {
        setLoading1(false);
        message.error("Had some errors." + error, 5);
      });

    setIsModalOpen(false);
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setState((prevProps) => ({
      ...prevProps,
      [name]: value,
    }));
  };

  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
    async function fetchData() {
      try {
        let tmp = [];
        const res = await axios.post(
          "http://localhost:8000/api/v1/getpartner",
          {
            wallet_address1: account,
          }
        );
        res.data.data.map((item) => {
          if (item.Wallet_address !== account)
            tmp.push({
              label: item.Wallet_address,
              value: item.Wallet_address,
            });
        });
        setBusPartnerOp(tmp);
      } catch (e) {
        message.error("Server Error\n" + e, 5);
      }
    }
    fetchData();

    updateOrganizations();
  }, []);

  useEffect(() => {
    async function fetchData() {
      if (validNetwork && active && window.ethereum) {
        const myProvider = new ethers.providers.Web3Provider(window.ethereum);
        setProvider(myProvider);
        const balanceETH = myProvider.getBalance(account);
        function getProvContract() {
          ProvContract = new ethers.Contract(
            process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
            provAbi,
            myProvider.getSigner()
          );
        }
        await getProvContract();
        updateOrganizations();
      }
    }
    fetchData();
  }, [validNetwork, active]);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Authorized Parties</span>
        </Row>
        <Divider />
        <Row justify="left">
          <Button className="black-button" onClick={showModal}>
            Add Organization
          </Button>
          <Search
            placeholder="Search Organization"
            className="search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          dataSource={
            data &&
            (search_text === ""
              ? data
              : data.filter((i) => i.organization.includes(search_text)))
          }
          onChange={onChange}
          pagination={false}
        />
        {/* <Pagination
          total={30}
          showTotal={(total, range) =>
            `${range[0]}-${range[1]} of ${total} items`
          }
          defaultPageSize={20}
          defaultCurrent={1}
          className="margin-top-20"
        /> */}
        <Modal
          title={<Title level={4}>Add Organization</Title>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Spin spinning={loading1} tip="Loading...">
            <Input
              className="margin-top-20"
              placeholder="Organization"
              name="organization"
              value={state.organization}
              onChange={handleInputChange}
              maxLength={42}
            />
            <Select
              className="org-select"
              name="org_type"
              value={state.org_type}
              onChange={(value) => {
                setState((prevProps) => ({
                  ...prevProps,
                  org_type: value,
                }));
              }}
              placeholder="Organization Type"
              options={[
                {
                  value: "subsidiary",
                  label: "Subsidiary",
                },
                {
                  value: "Authorized Organization",
                  label: "Authorized Organization",
                },
              ]}
            />
            <Row className="margin-top-20">
              <Title level={4}>Organization Wallet Address</Title>
            </Row>
            <Select
              className="org-select"
              name="org_wallet_address"
              value={state.org_wallet_address}
              onChange={(value) => {
                setState((prevProps) => ({
                  ...prevProps,
                  org_wallet_address: value,
                }));
              }}
              placeholder="Organization Wallet Address"
              options={busPartnerOp}
            />
          </Spin>
        </Modal>
      </Spin>
    </>
  );
};

export default AuthParties;
