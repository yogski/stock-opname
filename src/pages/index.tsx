import { Input, Table, notification, Space, Button } from 'antd';
import {useEffect, useState} from 'react'
import styles from '../styles/Home.module.css';
import { CSVLink } from "react-csv";

export interface formInput {
  barcodeForm: string;
  productNameForm: string;
}
export interface inventoryData {
  code: string;
  name: string;
  quantity: number;
  key: number;
}

export default function Home() {
  const [formInputs, setFormInputs] = useState<formInput>({
    barcodeForm: '',
    productNameForm: ''
  });
  const [inventoryData,setInventoryData] = useState<Array<inventoryData>>([]);
  const [formVisible, setFormVisible] = useState<boolean>(false);

  useEffect(()=>{
    console.log(inventoryData);
  }, [inventoryData])

  const { Search } = Input;


  const columns = [
    {
      title: 'Barcode',
      dataIndex: 'code',
      key: 'code',
      render: (text : any) => <a>{text}</a>,
    },
    {
      title: 'Product Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Quantity',
      dataIndex: 'quantity',
      key: 'quantity',
    },
    {
      title: 'Action',
      key: 'action',
      render: (text : any, record: any) => (
        <Space size="middle">
          <a>Delete</a>
        </Space>
      ),
    },
  ];

  const infoNotification = (content : string) => {
    notification.info({
      message: 'Info',
      description: content,
      duration: 1.6,
    });
  };

  const errorNotification = (content : string) => {
    notification.error({
      message: 'Error',
      description: content,
      duration: 3,
    });
  };

  const isValidBarcode = (str : string) => {
    var code, i, len : any;
  
    for (i = 0, len = str.length; i < len; i++) {
      code = str.charCodeAt(i);
      if (!(code > 47 && code < 58) && // numeric (0-9)
          !(code > 64 && code < 91) && // upper alpha (A-Z)
          !(code > 96 && code < 123)) { // lower alpha (a-z)
        return false;
      }
    }
    return true;
  };

  const handleInputs = (event : any) => {
    let {name, value} = event.target
    setFormInputs({ ...formInputs, [name]: value });
  }

  const clearForm = () => {
    setFormInputs({
      barcodeForm: '',
      productNameForm: ''
    });
  }

  const generateFilename = () => {
    let d = new Date();
    return `csv_stockopname_${d.toLocaleDateString('id-ID')}_${Number(d).toString(16)}.csv`;
  }

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
    if (barcode === '' || !isValidBarcode(barcode)) {
      errorNotification(`invalid barcode format: '${barcode}'`);
      clearForm();
      return;
    }
    console.log('current input:', barcode);
    let match : number = inventoryData.findIndex((x) => x.code === barcode);
    if (match !== -1) {
      inventoryData[match].quantity++;
      setInventoryData(inventoryData);
      infoNotification(`${inventoryData[match].name} (${inventoryData[match].code}): quantity updated.`);
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
      key: inventoryData.length
    }
    setInventoryData([...inventoryData, newProduct]);
    setFormVisible(false);
    infoNotification(`${newProduct.name} (${newProduct.code}): new product added.`);
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
      { inventoryData.length > 0 ?
        <Button>
        <CSVLink 
          data={getCsvOutput()}
          separator={","}
          filename={generateFilename()}
        >
          Download CSV
        </CSVLink>
        </Button>
        : null
        
      }
      <Table columns={columns} dataSource={inventoryData} />
      
    </div>
    </>
  );
}