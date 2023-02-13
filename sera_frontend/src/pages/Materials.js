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
import { useSelector } from "react-redux";
import provAbi from "../abis/provenanceAbi.json";
import { ethers } from "ethers";
import { useWeb3React } from "@web3-react/core";
import "./page.css";

const { Title } = Typography;
const { Search } = Input;

const Materials = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [loading1, setLoading1] = useState(false);
  const [isWalletIntalled, setIsWalletInstalled] = useState(false);
  const [provider, setProvider] = useState();
  const [search_text, setSearchText] = useState("");
  const [data, setData] = useState([]);
  const [state, setState] = useState({
    material: "",
    pub_number: "",
  });
  const { materials } = useSelector((state) => state.materialList);
  const { chainId, active, account } = useWeb3React();
  const validNetwork =
    chainId === parseInt(process.env.REACT_APP_CHAIN_ID) ? true : false;
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
    let tmp = [];
    try {
      let pro_count = await ProvContract.product_count();
      for (let i = 0; i < pro_count; i++) {
        let pro_pub_number = await ProvContract.product_list(i);
        let material = await ProvContract.products(pro_pub_number);
        tmp.push({
          material: material.name,
          pub_number: pro_pub_number,
          producer: material.producer_address,
        });
      }
      await setData(tmp);
    } catch (e) {
      message.error("Server had some errors.", 5);
      console.log(e);
      setLoading(false);
    }

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
            message.error("Server had some errors.", 5);
            console.log(error);
            setLoading1(false);
          }
        );
      })
      .catch((error) => {
        message.error("Server had some errors.", 5);
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
    if (window.ethereum) {
      setIsWalletInstalled(true);
    }
    updateMaterials();
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
        updateMaterials();
      }
    }
    fetchData();
  }, [validNetwork, active]);

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
            <Input className="margin-top-20" value={account} />
          </Spin>
        </Modal>
      </Spin>
    </>
  );
};

export default Materials;
