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
} from "antd";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import provenanceAbi from "../abis/provenanceAbi";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const BusinessEcosystem = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [buspartner, setBusPartner] = useState("");
  const [orgOp, setOrgOp] = useState([]);
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

  const columns = [
    {
      title: "Business Partner",
      dataIndex: "b_partner",
      sorter: {
        compare: (a, b) => a.b_partner - b.b_partner,
        multiple: 1,
      },
    },
    {
      title: "Contract Status",
      dataIndex: "c_status",
      sorter: {
        compare: (a, b) => a.c_status - b.c_status,
        multiple: 2,
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
            b_partner: buspartner,
            c_status: <Tag color="magenta">Active</Tag>,
          },
        ];
        setData(tmp);
      }
      message.success(res.data.msg, 5);
    } catch (e) {
      message.success("Internal Server Error\n" + e, 5);
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
    async function fetchData() {
      try {
        const res = await axios.get(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getlist`
        );
        let tmp = [];
        res.data.data.map((item) => {
          if (item.Wallet_address !== account)
            tmp.push({
              label: item.Wallet_address,
              value: item.Wallet_address,
            });
        });
        setOrgOp(tmp);
        tmp = [];
        const res1 = await axios.post(
          `${process.env.REACT_APP_IP_ADDRESS}/v1/getpartner`,
          {
            wallet_address1: account,
          }
        );
        res1.data.data.map((item) => {
          if (item.Wallet_address !== account)
            tmp.push({
              b_partner: item.Wallet_address,
              c_status: <Tag color="magenta">Active</Tag>,
            });
        });
        setData(tmp);
      } catch (e) {
        message.error("Server Error\n" + e, 5);
      }
    }
    fetchData();
  }, []);

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
      <Row>
        <Link to="/">
          <Button> {"<"} Sign Out</Button>
        </Link>
      </Row>
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
        scroll={{ x: true }}
        dataSource={
          data &&
          (search_text === ""
            ? data
            : data.filter((i) => i.b_partner.includes(search_text)))
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
    </>
  );
};

export default BusinessEcosystem;
