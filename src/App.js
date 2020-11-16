import './App.css';
import React, { useState, useEffect } from 'react';
import 'antd/dist/antd.css';
import { Select, Radio } from 'antd';
import areaList from './city.list.json';
import { PlusOutlined } from '@ant-design/icons';

let timeout;

function App() {
  const [value, setValue] = useState('');
  const [data, setData] = useState([]);
  const { Option } = Select;
  const [showSearch, setShowSearch] = useState(false);
  const [degree, setDegree] = useState('metric');
  const [idList, setidList] = useState([]);
  const [listing, setListing] = useState([]); 

  useEffect(() => {
    if(idList.length > 0) {
      getWeather()
    }
  }, [idList, degree])
  
  // debouncing
  const handleSearch = (value) => {
    clearTimeout(timeout)
    
    const fetch = () => {
      if (value.length > 1) {
        const cities = areaList.filter((city) =>
          city.name.toLowerCase().includes(value.toLowerCase())
        );
        setData(cities);
      } else {
        setData([]);
      } 
    }

    timeout = setTimeout(fetch, 500);
    
  }

  const handleChange = (value) => {
    setValue(value);
    setShowSearch(false)
    setValue(undefined);
  }

  const handleSelect = (value) => {
    setidList([...idList, value]);
    setShowSearch(false)
    setValue('');
  }

  const handleAddNew = () => {
    setShowSearch(true);
  }

  const handleDegree = (value) => {
    setDegree(value);
  }
  
  // async function getWeather(value) {
  const getWeather = async () => {
    try {
      // const weather = await (await fetch(`https://api.openweathermap.org/data/2.5/weather?id=${value}&units=metric&appid=0abf4bf351cec72355774d7f99ba0cc8`)).json()
      const weather = await fetch(`https://api.openweathermap.org/data/2.5/group?id=${idList.join(',')}&units=${typeof degree === "string" ? degree : degree.target.value}&appid=0abf4bf351cec72355774d7f99ba0cc8`)
      let response = await weather.json();
      setListing([...response.list])
    } catch(e){
      console.log(e)
    }
  }

  return (
    <div className="App-header">
      <div className="degree">
        <Radio.Group defaultValue="metric" size="large" buttonStyle="solid" onChange={handleDegree}>
          <Radio.Button value="metric">&#xb0;C</Radio.Button>
          <Radio.Button value="imperial">&#xb0;F</Radio.Button>
        </Radio.Group>
      </div>
      <div>
        <h1>Simple Weather</h1>
      </div>
      <div className="weather-container">
        {
          listing.length > 0 && listing.map(item => (
            <div className="box weather" key={item.id}>
              <div className="weather-top">
                <div className="weather-top-main">
                  <h2>{`${item.name}-${item.sys.country}`}</h2>
                  <h3>{item.weather[0].description}</h3>
                  <p className="main-temp">{Math.ceil(item.main.temp)}&#xb0;{degree === 'metric' ? 'C' : 'F'}</p>
                </div>
              </div>
              <div className="weather-bottom">
                <div className="weather-bottom-main">
                  <p>feels like: {Math.ceil(item.main.feels_like)}&#xb0;{degree === 'metric' ? 'C' : 'F'}</p>
                  <p>max temp: {Math.ceil(item.main.temp_max)}&#xb0;{degree === 'metric' ? 'C': 'F'}</p>
                  <p>min temp: {Math.ceil(item.main.temp_min)}&#xb0;{degree === 'metric' ? 'C' : 'F'}</p>
                </div>
                <img src={`http://openweathermap.org/img/wn/${item.weather[0].icon}@2x.png`} alt={item.weather[0].description} />
              </div>
            </div>
          ))
        }
        <div className="add-new-container">
          <div className="box add-new">
            {
              showSearch ? 
                <Select
                  showSearch
                  value={value}
                  placeholder={'City-please enter more than 1 letter'}
                  defaultActiveFirstOption={false}
                  showArrow={false}
                  filterOption={false}
                  notFoundContent={null}
                  onSearch={handleSearch}
                  onChange={handleChange}
                  style={{ width: '90%' }}
                  onSelect={(...params) => { handleSelect(...params) }}
                >
                  {data.map(d => <Option key={d.id}>{`${d.name}, ${d.country}`}</Option>)}
                </Select> :
                <button onClick={handleAddNew}>
                  <PlusOutlined />
                </button>
            }
          </div>
        </div>
      </div>        
    </div>
  );
};

export default App;
