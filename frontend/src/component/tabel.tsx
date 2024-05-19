import  { useState, useEffect } from "react";
import axios from 'axios';
import { Table ,TableColumnsType,Popover } from "antd";
import { LineChart } from '@mui/x-charts/LineChart';
import "./tabel.css"
import {CloseCircleOutlined} from '@ant-design/icons';
type TableData = {
    key: string;
    year: string;
    jobs: number;
    sumsal: number;
};

type currTableData = {
    key: string;
    job: string;
    value: number;
};



const columns: TableColumnsType<TableData> = [
    {
        title: 'Year',
        dataIndex: 'year',
        key: 'year',
        defaultSortOrder: 'descend',
        sorter: (a, b) => parseInt(a.year) - parseInt(b.year),
    },
    {
        title: 'Jobs',
        dataIndex: 'jobs',
        key: 'jobs',
        sorter: (a, b) => a.jobs - b.jobs,
    },
    {
        title: 'AVG Salary',
        dataIndex: 'sumsal',
        key: 'sumsal',
        sorter: (a, b) => a.sumsal - b.sumsal,
    },
];

const columns2: TableColumnsType<currTableData> = [
    {
        title: 'Job',
        dataIndex: 'job',
        key: 'job',
        
    },
    {
        title: 'Members',
        dataIndex: 'value',
        key: 'value',
       
    },
   
];


function table() {
    const [table, setTable] = useState<TableData[]>([]);
    const [currTable, setCurrTable] = useState<currTableData[]>([]);
    const [open, setOpen] = useState(false);
    const [year, setYear] = useState("");

    useEffect(() =>{
        const fetchData = async () => {
            try {
                const tr = await axios.get(`https://testserver-0mct.onrender.com/get`);
                const data = tr.data;
                const formattedData: TableData[] = Object.keys(data).map((year, index) => ({
                    key: (index + 1).toString(),
                    year: year,
                    jobs: data[year].jobs,
                    sumsal: parseFloat((data[year].sumsal / data[year].jobs).toFixed(2))
                }));
                setTable(formattedData);
            } catch (error) {
                console.error(error);
            }
        }
        fetchData();
    },[])
      
    const handleRowClick = async (record: TableData) => {
        console.log('Row clicked:', record);
        const yr= await axios.get(`https://testserver-0mct.onrender.com/${record.year}`)
        setYear(record.year)
        setCurrTable(yr.data);
        setOpen(true);

    };

    const hide = () => {
        setOpen(false);
      };
    
      const handleOpenChange = (newOpen: boolean) => {
        setOpen(newOpen);
      };

    if(!table)
    {
        return(<div>
            loading...
        </div>)
    }
    return(
        <div >
             <div className="heading-container">
            <h1 className="main-heading">Yearwise Analysis</h1>
            <p className="sub-heading">Explore data year by year</p>
        </div>
            <div className="main">
            <Popover
      content={
        <>
        <Table columns={columns2} dataSource={currTable}/>
        </>

    }
      title={<div className="inside">
        <br />
        {year}
        <CloseCircleOutlined onClick={hide} style={{ fontSize: '24px', color: 'rgb(81, 231, 229)' }}/>
      </div>}
      trigger="click"
      open={open}
      onOpenChange={handleOpenChange}
    >
            <Table className="maintable"
            columns={columns}
            dataSource={table}
            bordered 
            onRow={(record) => ({
                onClick: () => handleRowClick(record),
            })}
        />
        </Popover>

        </div>
            <div className="container">
            
            <LineChart
                    xAxis={[{ 
                        dataKey: 'year',
                        label: 'Year',
                        

                    }]}
                    series={[{ dataKey: 'jobs',label: 'Jobs'}]}
                    width={300}
                    height={500}
                    dataset={table}
                  />
            <LineChart
            xAxis={[{ 
                dataKey: 'year',
                label: 'Year',
                

            }]}
            series={[{ dataKey: 'sumsal',label: 'Avg Salary'}]}
            width={300}
            height={500}
            dataset={table}
        />
            </div>
            
        </div>
    )
}
export default table