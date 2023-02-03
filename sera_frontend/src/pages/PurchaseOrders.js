import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  Row,
  Col,
  Typography,
  Divider,
  Button,
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

const { Title } = Typography;
const { Search } = Input;

const PurchaseOrders = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [search_text, setSearchText] = useState("");
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
  let TrackContract = null;

  const updatePurOrders = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    TrackContract = new ethers.Contract(
      process.env.REACT_APP_TRACKING_CONTRACT_ADDRESS,
      trackAbi,
      myProvider.getSigner()
    );

    let tmp = [];
    try {
      let purchase_id = await TrackContract.purchase_id();
      for (let i = 0; i <= purchase_id; i++) {
        let contract_id = await TrackContract.purchase_list(i);
        let contract = await TrackContract.shipments(contract_id);
        let net_value =
          contract.quantity1 * contract.price1 +
          contract.quantity2 * contract.price2;
        let ProvContract = new ethers.Contract(
          process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
          provAbi,
          myProvider.getSigner()
        );
        if (contract.recipient === account) {
          let buyer = await ProvContract.producers(contract.recipient);
          let supplier = await ProvContract.producers(contract.sender);
          tmp.push({
            pur_order_id: i,
            contract_id: Number(contract_id),
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
            status: "Ready",
            actions: "1",
          });
        }
      }
      await setData(tmp);
    } catch (e) {
      setLoading(false);
      message.error("Internal Server Error.\n" + e, 5);
    }
    setLoading(false);
  };

  useEffect(() => {
    updatePurOrders();
  }, []);

  useEffect(() => {
    updatePurOrders();
  }, [account]);

  const onChange = (key) => {
    console.log(key);
  };

  const onSearch = (value) => {
    setSearchText(value);
  };

  const columns = [
    {
      title: "Purchase Order ID",
      dataIndex: "pur_order_id",
      sorter: {
        compare: (a, b) => a.pur_order_id - b.pur_order_id,
        multiple: 1,
      },
    },
    {
      title: "Contract ID",
      dataIndex: "contract_id",
      sorter: {
        compare: (a, b) => a.contract_id - b.contract_id,
        multiple: 2,
      },
    },
    {
      title: "Buyer",
      dataIndex: "buyer",
      sorter: {
        compare: (a, b) => a.buyer - b.buyer,
        multiple: 3,
      },
    },
    {
      title: "Supplier",
      dataIndex: "supplier",
      sorter: {
        compare: (a, b) => a.supplier - b.supplier,
        multiple: 4,
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
  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="contract-header">
          <span className="title-style float-left">Purchase Orders</span>
          <Link to="/create-pur-order">
            <Button className="contract-btn" icon={<FileAddOutlined />}>
              Create Purchase Order
            </Button>
          </Link>
        </Row>
        <Divider />
        <Row justify="left">
          <Search
            placeholder="Search Purchase Orders"
            className="contract-search-input"
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
              : data.filter(
                  (i) =>
                    i.buyer.includes(search_text) ||
                    i.supplier.includes(search_text) ||
                    i.material.includes(search_text)
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

export default PurchaseOrders;
