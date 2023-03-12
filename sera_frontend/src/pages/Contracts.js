import React, { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Divider,
  Button,
  Tabs,
  Tag,
  Input,
  Table,
  Spin,
  Pagination,
  Descriptions,
  message,
  Radio,
} from "antd";
import axios from "axios";
import { FileAddOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";
import "./page.css";
import { TRANSACTION_ERROR, SERVER_ERROR } from "../utils/messages";

const { Search } = Input;

const Contracts = () => {
  const [data, setData] = useState([]);
  const [rfqdata, setRfqData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState("RFQ");
  const [search_text, setSearchText] = useState("");
  const { account } = useWeb3React();
  const [tabKey, setTabKey] = useState("all");

  const columnsRFQ = [
    {
      title: "RFQ ID",
      dataIndex: "rfq_id",
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
    },
    {
      title: "Material",
      dataIndex: "material",
    },
    {
      title: "Wallet Address",
      dataIndex: "wallet_address",
    },
  ];

  const columnsProposal = [
    {
      title: "Contract ID",
      dataIndex: "contract_id",
      sorter: {
        compare: (a, b) => a.contract_id - b.contract_id,
        multiple: 1,
      },
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      sorter: {
        compare: (a, b) => a.buyer - b.buyer,
        multiple: 2,
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      sorter: {
        compare: (a, b) => a.supplier - b.supplier,
        multiple: 3,
      },
    },
    {
      title: "Delivery term",
      dataIndex: "delivery_term",
    },
    {
      title: "Payment term",
      dataIndex: "payment_term",
    },
    {
      title: "Start Date",
      dataIndex: "start_date",
      sorter: {
        compare: (a, b) => a.start_date - b.start_date,
        multiple: 5,
      },
    },
    {
      title: "End Date",
      dataIndex: "end_date",
      sorter: {
        compare: (a, b) => a.end_date - b.end_date,
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

  const dataSource = useMemo(() => {
    switch (tabKey) {
      case "all":
        if (mode === "RFQ") return rfqdata;
        else return data;
      case "issued":
        return data.filter((i) => JSON.stringify(i.buyer).includes(account));
      case "received":
        return rfqdata.filter((i) => i.wallet_address !== account);
      default:
        break;
    }
  }, [rfqdata, data, mode, tabKey, account]);

  const columns = useMemo(() => {
    switch (tabKey) {
      case "all":
        if (mode === "RFQ") return columnsRFQ;
        else return columnsProposal;
      case "issued":
        return columnsProposal;
      case "received":
        return columnsRFQ;
      default:
        break;
    }
  }, [mode, tabKey, account]);

  let TrackContract = null;

  const items = [
    {
      key: "all",
      label: `All`,
    },
    {
      key: "issued",
      label: `Issued`,
    },
    {
      key: "received",
      label: `Received`,
    },
  ];

  const updateContracts = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );

    let tmp = [];
    try {
      let shipment_id = await TrackContract.shipment_id();
      for (let i = 0; i <= shipment_id; i++) {
        let contract = await TrackContract.shipments(i);
        if (contract.recipient === account || contract.sender === account) {
          const buyer = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: contract.recipient,
            }
          );
          const supplier = await axios.post(
            `${process.env.REACT_APP_IP_ADDRESS}/v1/getuser`,
            {
              Wallet_address: contract.sender,
            }
          );
          let net_value =
            contract.quantity1 * contract.price1 +
            contract.quantity2 * contract.price2;
          tmp.push({
            key: i,
            contract_id: i,
            buyer: (
              <>
                {buyer.data.data.Trade_name} <br /> {contract.recipient}
              </>
            ),
            supplier: (
              <>
                {supplier.data.data.Trade_name} <br /> {contract.sender}
              </>
            ),
            delivery_term: (
              <Descriptions column={1} size="small" bordered>
                <Descriptions.Item label="Material">Quantity</Descriptions.Item>
                <Descriptions.Item label={contract.item1}>
                  {Number(contract.quantity1)}
                </Descriptions.Item>
                <Descriptions.Item label={contract.item2}>
                  {Number(contract.quantity2)}
                </Descriptions.Item>
              </Descriptions>
            ),
            payment_term: net_value,
            start_date: "2023/1/6",
            end_date: "2023/1/16",
            status: <Tag color="magenta">Active</Tag>,
          });
        }
      }
      await setData(tmp);
    } catch (e) {
      message.error(TRANSACTION_ERROR, 5);
      console.log(e);
      setLoading(false);
    }

    setLoading(false);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const getListRfq = async () => {
    try {
      const res = await axios.get(
        `${process.env.REACT_APP_IP_ADDRESS}/v1/getlistrfq`
      );
      if (res.data.status_code === 200) {
        let tmp = [];
        for (let item of res.data.data) {
          tmp.push({
            rfq_id: item.MaterialId,
            buyer: item.Buspartner,
            wallet_address: item.Wallet_address,
            material: JSON.parse(item.MaterialItems).map((it) => (
              <Tag>{it.material}</Tag>
            )),
          });
        }
        setRfqData(tmp);
      }
    } catch (e) {
      message.error(SERVER_ERROR, 5);
      console.log(e);
    }
  };

  useEffect(() => {
    getListRfq();
  }, []);

  const onChange = (key) => {
    if (key === "issued") updateContracts();
    if (key === "received") getListRfq();
    setTabKey(key);
  };

  const handleModeChange = (e) => {
    if (e.target.value === "RFQ") getListRfq();
    if (e.target.value === "proposal") updateContracts();
    setMode(e.target.value);
  };

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="contract-header">
          <span className="title-style float-left">Contracts</span>
          <Link to="/create-contract">
            <Button className="contract-btn" icon={<FileAddOutlined />}>
              Create Contract
            </Button>
          </Link>
        </Row>
        <Divider />
        <Tabs defaultActiveKey="all" items={items} onChange={onChange} />
        <Row justify="left">
          <Search
            placeholder="Search Contracts"
            className="contract-search-input"
            onSearch={onSearch}
          />
          {tabKey === "all" ? (
            <Radio.Group
              onChange={handleModeChange}
              value={mode}
              buttonStyle="solid"
              style={{ marginLeft: 10 }}
            >
              <Radio.Button value="RFQ">RFQ</Radio.Button>
              <Radio.Button value="proposal">Proposal</Radio.Button>
            </Radio.Group>
          ) : (
            ""
          )}
        </Row>
        <Table
          className="margin-top-20"
          columns={columns}
          scroll={{ x: 2000 }}
          dataSource={dataSource}
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
      </Spin>
    </>
  );
};

export default Contracts;
