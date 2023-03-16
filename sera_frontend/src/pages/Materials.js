import React, { useState, useEffect } from "react";
import {
  Row,
  Button,
  Typography,
  Divider,
  Input,
  Table,
  Pagination,
  Modal,
  Spin,
  message,
} from "antd";
import provAbi from "../abis/provenanceAbi.json";
import { ethers } from "ethers";
import { Multicall } from "ethereum-multicall";
import { useWeb3React } from "@web3-react/core";
import { TRANSACTION_ERROR } from "../utils/messages";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const Materials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [search_text, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    material: "",
    pub_number: "",
    description: "",
  });
  const { account } = useWeb3React();
  let ProvContract = null;
  const columns = [
    {
      title: "Material",
      dataIndex: "material",
      sorter: {
        compare: (a, b) => a.material - b.material,
        multiple: 1,
      },
    },
    {
      title: "Material Publish Number",
      dataIndex: "pub_number",
      sorter: {
        compare: (a, b) => a.pub_number - b.pub_number,
        multiple: 2,
      },
    },
    {
      title: "Producer",
      dataIndex: "producer",
      sorter: {
        compare: (a, b) => a.producer - b.producer,
        multiple: 3,
      },
    },
  ];

  const updateMaterials = async () => {
    setLoading(true);
    const myProvider = new ethers.providers.Web3Provider(window.ethereum);
    ProvContract = new ethers.Contract(
      process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
      provAbi,
      myProvider.getSigner()
    );
    const multicall = new Multicall({
      ethersProvider: myProvider,
      tryAggregate: true,
    });

    let tmp = [];
    let pro_count = await ProvContract.product_count();

    if (pro_count > 0)
      for (let i = 1; i <= pro_count; i++) {
        tmp.push({
          reference: "product_list",
          methodName: "product_list",
          methodParameters: [i],
        });
      }

    const contractCallContext = [
      {
        reference: "Provenance",
        contractAddress: process.env.REACT_APP_PROVENANCE_CONTRACT_ADDRESS,
        abi: provAbi,
        calls: tmp,
      },
    ];

    const results = await multicall.call(contractCallContext);
    const len = results.results.Provenance.callsReturnContext.length;
    tmp = [];
    for (let i = 0; i < len; i++) {
      let pro_pub_number =
        results.results.Provenance.callsReturnContext[i].returnValues[0];
      let material = await ProvContract.products(pro_pub_number);
      if (material.producer_address === account)
        tmp.push({
          material: material.name,
          pub_number: pro_pub_number,
          producer: material.producer_address,
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
    let { material, pub_number } = state;
    await ProvContract.addProduct(pub_number, material)
      .then((tx) => {
        return tx.wait().then(
          async (receipt) => {
            // This is entered if the transaction receipt indicates success
            await setLoading1(false);
            message.success("Created a new product successfully.", 5);
            await updateMaterials();
            return true;
          },
          (error) => {
            message.error(TRANSACTION_ERROR, 5);
            console.log(error);
            setLoading1(false);
          }
        );
      })
      .catch((error) => {
        message.error(TRANSACTION_ERROR, 5);
        console.log(error);
        setLoading1(false);
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
    async function fetchData() {
      await updateMaterials();
    }
    fetchData();
  }, []);

  return (
    <>
      <Spin spinning={loading} tip="Loading...">
        <Row className="margin-top-20">
          <span className="title-style">Materials</span>
        </Row>
        <Divider />
        <Row justify="space-between">
          <Button className="black-button" onClick={showModal}>
            Add Material
          </Button>
          <Search
            placeholder="Search Material"
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
              : data.filter((i) => i.material.includes(search_text)))
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
          title={<Title level={4}>Add Material</Title>}
          open={isModalOpen}
          onOk={handleOk}
          onCancel={handleCancel}
        >
          <Spin spinning={loading1} tip="Loading...">
            <Input
              className="margin-top-20"
              placeholder="Material"
              name="material"
              value={state.material}
              onChange={handleInputChange}
            />
            <Input
              className="margin-top-20"
              placeholder="Publish Number"
              name="pub_number"
              value={state.pub_number}
              onChange={handleInputChange}
            />
            <Input.TextArea
              className="margin-top-20"
              placeholder="Description"
              name="description"
              rows={4}
              value={state.description}
              onChange={handleInputChange}
            />
            <Input className="margin-top-20" value={account} />
          </Spin>
        </Modal>
      </Spin>
    </>
  );
};

export default Materials;
