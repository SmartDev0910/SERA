import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Divider,
  Button,
  Tabs,
  Input,
  Table,
  Spin,
  Pagination,
  message,
} from "antd";
import { FileAddOutlined } from "@ant-design/icons";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import trackAbi from "../abis/trackingAbi.json";
import provAbi from "../abis/provenanceAbi.json";
import "./page.css";

const { Search } = Input;

const Contracts = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [provider, setProvider] = useState();
  const { chainId, active, account } = useWeb3React();
  let TrackContract = null;
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
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
  const columns = [
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
    {
      title: "Actions",
      dataIndex: "actions",
      sorter: {
        compare: (a, b) => a.actions - b.actions,
        multiple: 8,
      },
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
    let ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );
    let tmp = [];
    try {
      let shipment_id = await TrackContract.shipment_id();
      for (let i = 0; i <= shipment_id; i++) {
        let contract = await TrackContract.shipments(i);
        if (
          contract.recipient !== "0x0000000000000000000000000000000000000000"
        ) {
          let buyer = await ProvContract.producers(contract.recipient);
          let supplier = await ProvContract.producers(contract.sender);
          let net_value =
            contract.quantity1 * contract.price1 +
            contract.quantity2 * contract.price2;
          tmp.push({
            key: i,
            contract_id: i,
            buyer: (
              <>
                {" "}
                {buyer.name} <br /> {contract.recipient}
              </>
            ),
            supplier: (
              <>
                {supplier.name} <br /> {contract.sender}
              </>
            ),
            delivery_term: (
              <Row className="width-100">
                <Row gutter={4} className="width-100">
                  <Col span={12}>Material</Col>
                  <Col span={12}>Quantity</Col>
                </Row>
                <Row gutter={4} className="width-100">
                  <Col span={12}>{contract.item1}</Col>
                  <Col span={12}>{Number(contract.quantity1)}</Col>
                </Row>
                <Row gutter={4} className="width-100">
                  <Col span={12}>{contract.item2}</Col>
                  <Col span={12}>{Number(contract.quantity2)}</Col>
                </Row>
              </Row>
            ),
            payment_term: net_value,
            start_date: "2023/1/6",
            end_date: "2023/1/16",
            status: "Ready",
            actions: "1",
          });
        }
      }
      await setData(tmp);
    } catch (e) {
      message.error("Internal Server Error\n" + e, 5);
      setLoading(false);
    }

    setLoading(false);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  useEffect(() => {
    updateContracts();
  }, []);

  const onChange = (key) => {
    console.log(key);
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
        <Row justify="space-between">
          <Search
            placeholder="Search Contracts"
            className="contract-search-input"
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
              : data.filter(
                  (i) =>
                    i.buyer.toString().includes(search_text) ||
                    i.supplier.toString().includes(search_text) ||
                    i.material.toString().includes(search_text) ||
                    i.start_date.includes(search_text) ||
                    i.end_date.includes(search_text)
                ))
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
      </Spin>
    </>
  );
};

export default Contracts;
