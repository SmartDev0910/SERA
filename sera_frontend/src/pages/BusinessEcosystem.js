import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Button,
  Typography,
  Divider,
  Input,
  Table,
  Pagination,
  Modal,
  Tag,
  Select,
  message,
  Spin,
  Rate,
} from "antd";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import provenanceAbi from "../abis/provenanceAbi";
import trackAbi from "../abis/trackingAbi.json";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const BusinessEcosystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buspartner, setBusPartner] = useState("");
  const [orgOp, setOrgOp] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [provider, setProvider] = useState();
  const [data, setData] = useState([]);
  const dispatch = useDispatch();
  const { buspartners } = useSelector((state) => state.busPartnerList);
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let ProvenanceContract = null;

  const calculateRate = (val) => {
    if (val % 10 >= 5) {
      return val / 10 + 0.5;
    } else {
      return val / 10;
    }
  };

  const columns = [
    {
      title: "Trade Name",
      dataIndex: "t_name",
      sorter: {
        compare: (a, b) => a.t_name - b.t_name,
        multiple: 1,
      },
    },
    {
      title: "Legal Name",
      dataIndex: "l_name",
      sorter: {
        compare: (a, b) => a.l_name - b.l_name,
        multiple: 2,
      },
    },
    {
      title: "Country",
      dataIndex: "country",
      sorter: {
        compare: (a, b) => a.country - b.country,
        multiple: 3,
      },
    },
    {
      title: "State/town",
      dataIndex: "state_town",
      sorter: {
        compare: (a, b) => a.state_town - b.state_town,
        multiple: 4,
      },
    },
    {
      title: "Building Number",
      dataIndex: "b_number",
      sorter: {
        compare: (a, b) => a.b_number - b.b_number,
        multiple: 5,
      },
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone Number",
      dataIndex: "phone",
    },
    {
      title: "Wallet Address",
      dataIndex: "w_address",
    },
    {
      title: "Reputation",
      dataIndex: "reputation",
      render: (data) => <Rate allowHalf disabled value={calculateRate(data)} />,
      sorter: {
        compare: (a, b) => a.reputation - b.reputation,
        multiple: 6,
      },
    },
    {
      title: "Status",
      dataIndex: "status",
      sorter: {
        compare: (a, b) => a.status - b.status,
        multiple: 7,
      },
    },
  ];

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
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/addpartner`,
        {
          wallet_address1: account,
          wallet_address2: buspartner,
        }
      );

      if (res.data.status_code === 200) {
        let tmp = [
          ...data,
          {
            w_address: buspartner,
            status: <Tag color="magenta">Active</Tag>,
          },
        ];
        setData(tmp);
      }
      message.success(res.data.msg, 5);
    } catch (e) {
      message.error("Server Error!", 5);
      console.log(e);
    }
    setIsModalOpen(false);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  useEffect(() => {
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);

    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getlist`
        );
        let tmp = [],
          tmp1 = [];

        let TrackContract = new ethers.Contract(
          process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
          trackAbi,
          myProvider.getSigner()
        );
        for (let item of res.data.data) {
          if (item.Wallet_address !== account) {
            let reputation = await TrackContract.calculateReputation(
              item.Wallet_address
            );
            tmp.push({
              label: item.Wallet_address,
              value: item.Wallet_address,
            });
            tmp1.push({
              t_name: item.Trade_name,
              l_name: item.Legal_name,
              country: item.Country,
              state_town: item.State_town,
              b_number: item.Building_number,
              email: item.Email,
              phone: item.Phone_number,
              w_address: item.Wallet_address,
              reputation: reputation,
              status: <Tag color="magenta">Active</Tag>,
            });
          }
        }
        setOrgOp(tmp);
        setData(tmp1);
        // tmp = [];
        // const res1 = await axios.post(
        //   `${process.env.REACT_APP_IP_ADDRESS}/v1/getpartner`,
        //   {
        //     wallet_address1: account,
        //   }
        // );
        // res1.data.data.map((item) => {
        //   if (item.Wallet_address !== account)
        //     tmp.push({
        //       w_address: item.Wallet_address,
        //       status: <Tag color="magenta">Active</Tag>,
        //     });
        // });
        // setData(tmp);
      } catch (e) {
        message.error("Server Error!", 5);
        console.log(e);
      }
    }
    fetchData();
    setLoading(false);
  }, [account]);

  useEffect(() => {
    if (validNetwork && active && window.ethereum) {
      const myProvider = new ethers.providers.Web3Provider(window.ethereum);
      setProvider(myProvider);
      ProvenanceContract = new ethers.Contract(
        process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
        provenanceAbi,
        myProvider.getSigner()
      );
    }
  }, [validNetwork, active]);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Business Ecosystem</span>
        </Row>
        <Divider />
        <Row>
          <Title level={4}>Business Partner</Title>
        </Row>
        <Row justify="space-between">
          <Button className="black-button" onClick={showModal}>
            Add Business Partner
          </Button>
          <Search
            placeholder="Search Business Partner"
            className="search-input"
            onSearch={onSearch}
          />
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: 2000 }}
          dataSource={
            data &&
            (search_text === ""
              ? data
              : data.filter((i) => i.w_address.includes(search_text)))
          }
          onChange={onChange}
          pagination={false}
        />
        {/* <Pagination
        total={85}
        showTotal={(total, range) =>
          `${range[0]}-${range[1]} of ${total} items`
        }
        defaultPageSize={20}
        defaultCurrent={1}
        className="margin-top-20"
      /> */}
        <Modal
          title={<Title level={4}>Add Business Partner</Title>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Select
            className="width-100 margin-top-20"
            value={buspartner}
            placeholder="Organization Wallet Address"
            onChange={(value) => {
              setBusPartner(value);
            }}
            options={orgOp}
          />
        </Modal>
      </Spin>
    </>
  );
};

export default BusinessEcosystem;
