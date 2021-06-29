// External dependencies
import { Input, Table, Space, Button, Popover, Modal, Row, Col } from 'antd';
import { DeleteFilled, EditFilled } from '@ant-design/icons';
import {useEffect, useState} from 'react'
import { CSVLink } from "react-csv";

// Internal dependencies
import * as note from '../components/notification';
import * as store from '../utilities/localStorage';
import * as barcodeUtils from '../utilities/barcode';
import styles from '../styles/Home.module.css';

export interface formInput {
  barcodeForm: string;
  productNameForm: string;
  editFormCode: string;
  editFormName: string;
  editFormQuantity: number;
}
export interface inventoryData {
  code: string;
  name: string;
  quantity: number;
  key: number;
}

export default function Home() {
  const emptyForm = {
    barcodeForm: '',
    productNameForm: '',
    editFormCode: '',
    editFormName: '',
    editFormQuantity: 0
  };

  const [formInputs, setFormInputs] = useState<formInput>(emptyForm);
  const [inventoryData,setInventoryData] = useState<Array<inventoryData>>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);
  const [editModalVisible, seteditModalVisible] = useState<boolean>(false);

  useEffect(()=>{}, [inventoryData])

  const { Search } = Input;

  const columns = [
    {
      title: 'Barcode',
      dataIndex: 'code',
      key: 'code',
      sorter: {
        compare: (a: any, b: any) => a.code - b.code,
        multiple: 1,
      },
      render: (text : any) => <a>{text}</a>
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
      sorter: {
        compare: (a: any, b: any) => a.name.localeCompare(b.name),
        multiple: 2,
      },
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
      sorter: {
        compare: (a: any, b: any) => a.quantity - b.quantity,
        multiple: 3,
      }
    },
    {
      title: 'Action',
      key: 'action',
      dataIndex: 'key',
      render: (e : any) => (
        <Space size="middle">
          <Popover content={`Edit Record`}>
          <Button
            type="primary"
            icon={<EditFilled />}
            size="middle"
            onClick={() => toggleEditModal(true, e)}
          />
          </Popover>
          <Popover content={`Delete Record`}>
          <Button
            type="primary"
            icon={<DeleteFilled />}
            size="middle"
            danger
            onClick={() => deleteRecord(e)}
          />
          </Popover>
        </Space>
      ),
    },
  ];

  const handleInputs = (event : any) => {
    let {name, value} = event.target
    setFormInputs({ ...formInputs, [name]: value });
  }

  const clearForm = () => {
    setFormInputs(emptyForm);
  }

  const saveEdit = (record : inventoryData) => {
    if (record.code === '' || !barcodeUtils.isValid(record.code)) {
      note.err(`invalid barcode format: '${record.code}'`);
      clearForm();
      document.getElementById("barcodeForm")?.focus();
      return;
    }
    setInventoryData([...inventoryData.filter((x) => x.key !== record.key), record]);
    toggleEditModal(false);
    document.getElementById("barcodeForm")?.focus();
    return;
  }

  const deleteRecord = (key : number) => {
    setInventoryData(inventoryData.filter((x) => x.key !== key));
    note.info(`Record with identifier ${key} has been deleted.`);
  }

  const toggleEditModal = (bool : boolean, key? : any) => {
    if (key) {
      const record = inventoryData.filter((x) => x.key === key)[0];
      setFormInputs({
        ...formInputs,
        editFormCode: record.code,
        editFormName: record.name,
        editFormQuantity: record.quantity
      })
    }
    seteditModalVisible(bool);
  }

  const editModal = () => {
    const saveData : inventoryData = {
      code : formInputs.editFormCode.replaceAll(/\s/g,''),
      name : formInputs.editFormName,
      quantity : formInputs.editFormQuantity,
      key: barcodeUtils.hashBarcode(formInputs.editFormCode)
    }
    
    return (
      <Modal
        visible={editModalVisible}
        title="Edit Record"
        footer={[
          <Button key="cancel" type="primary" danger onClick={() => toggleEditModal(false)}>
            Cancel
          </Button>,
          <Button key="save" type="primary" onClick={() => saveEdit(saveData)}>
            Save
          </Button>,
        ]}
      >
        <Space direction="vertical" style={{ width: "100%" }}>
          <Row>
          <label>Name</label>
          <Input 
            id="editFormName" 
            name="editFormName" 
            value={formInputs.editFormName}
            allowClear
            onChange={handleInputs}
          />
          </Row>
          <Row>
          <label>Quantity</label>
          <Input 
            id="editFormQuantity" 
            name="editFormQuantity" 
            value={formInputs.editFormQuantity}
            allowClear
            onChange={handleInputs}
          />
          </Row>
        </Space>
      </Modal>
    )
  }

  const generateFilename = () => {
    let d = new Date();
    return `csv_stockopname_${d.toLocaleDateString('id-ID')}_${Number(d).toString(16)}.csv`;
  }

  // definitely can be improved, maybe using map()
  const getCsvOutput = () => {
    let output : Array<any> = [];
    inventoryData.forEach((item) => {
      output.push({
        code : item.code,
        name : item.name,
        quantity : item.quantity
      })
    });
    return output;
  }

  const inputBarcode = async (event : any) => {
    let barcode = formInputs.barcodeForm.replaceAll(/\s/g,'');
    if (barcode === '' || !barcodeUtils.isValid(barcode)) {
      note.err(`invalid barcode format: '${barcode}'`);
      clearForm();
      return;
    }
    let match : number = inventoryData.findIndex((x) => x.code === barcode);
    if (match !== -1) {
      inventoryData[match].quantity++;
      setInventoryData(inventoryData);
      note.info(`${inventoryData[match].name} (${inventoryData[match].code}): quantity updated.`);
      clearForm();
    } else {
      document.getElementById("productNameForm")?.focus();
      setFormVisible(true);
    }
    return;
  }

  const addNewProduct = () => {
    const newProduct : inventoryData = {
      code : formInputs.barcodeForm.replaceAll(/\s/g,''),
      name : formInputs.productNameForm,
      quantity : 1,
      key: barcodeUtils.hashBarcode(formInputs.barcodeForm)
    }
    setInventoryData([...inventoryData, newProduct]);
    setFormVisible(false);
    note.info(`${newProduct.name} (${newProduct.code}): new product added.`);
    clearForm();
    document.getElementById("barcodeForm")?.focus();
  }

  return (
    <>
    <div className={styles.container}>
      <h1 className={styles.title}>Stock Opname</h1>

      <Search
        className = {styles.searchbar}
        id = "barcodeForm"
        name = "barcodeForm"
        value = {formInputs.barcodeForm}
        placeholder="input barcode here ..."
        allowClear
        enterButton="Add"
        size="large"
        onChange={handleInputs}
        onSearch={inputBarcode}
      />

      {formVisible ? 
        <Input
          className = {styles.searchbar}
          id="productNameForm"
          name="productNameForm"
          value={formInputs.productNameForm}
          placeholder="Input product name, then press Enter"
          allowClear
          autoFocus
          size="large"
          onChange={handleInputs}
          onPressEnter={addNewProduct}
        />
        : null
      }
      {editModalVisible ? editModal() : null}
      { inventoryData.length > 0 ?
        <Space>
          <Button>
          <CSVLink 
            data={getCsvOutput()}
            separator={","}
            filename={generateFilename()}
          >
            Download CSV
          </CSVLink>
          </Button>
          <Button onClick={() => store.saveInventory(inventoryData)}>
            Save Inventory
          </Button>
          <Button onClick={() => setInventoryData(store.getInventory())}>
            Load Inventory
          </Button>
        </Space>
        : <Space>
          <Button onClick={() => setInventoryData(store.getInventory())}>
            Load Inventory
          </Button>
        </Space>
        
      }
      <Table className={styles.tableDisplay} columns={columns} dataSource={inventoryData} />
      
    </div>
    </>
  );
}