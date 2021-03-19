import { useState, useEffect } from 'react';
import './App.css';
import Dashboard from './Dashboard';
import SofaMode from './SofaMode';

const endpoint = process.env.REACT_APP_DATA_ENDPOINT;
const isControllable = typeof process.env.REACT_APP_CONTROL_ENDPOINT === "string";

function App() {
  const [data, setData] = useState(null);
  const [dataLog, setDataLog] = useState([]);
  const [ page, setPage ] = useState("dashboard");

  useEffect(fetchData, []);

  useEffect(() => {
    const interval_id = setInterval(fetchData, 30 * 1000);

    return () => clearInterval(interval_id);
  }, []);

  useEffect(() => {
    if (data) {
      const newPoint = [
        data.status.date_time,
        data.real_time.pv_voltage,
        data.real_time.pv_current,
        data.real_time.pv_power,
        data.real_time.battery_voltage,
        data.statistics.net_battery_current,
        data.statistics.net_battery_current * data.real_time.battery_voltage,
        data.real_time.load_voltage,
        data.real_time.load_current,
        data.real_time.load_power,
        data.real_time.charger_temperature,
        data.real_time.remote_battery_temperature,
      ];

      setDataLog(log => [ ...log, newPoint ]);
    }
  }, [data]);

  if (!data) {
    return <p>Loading</p>;
  }

  if (page === "sofa") {
    return <SofaMode data={data} dataLog={dataLog} onClose={() => setPage("dashboard")} />;
  }

  return (
    <div className="App">
      <Dashboard data={data} dataLog={dataLog} setLoad={isControllable ? setLoad : null} />
      <button onClick={() => setPage("sofa")}>Sofa</button>
      <p>Clone on <a href="https://github.com/IJMacD/epsolar-app">GitHub</a>.</p>
    </div>
  );

  function fetchData() {
    fetch(endpoint).then(r => r.json()).then(setData);
  }

  function setLoad (on) {
    const body = new URLSearchParams({ load: on ? "1" : "0" });

    fetch(process.env.REACT_APP_CONTROL_ENDPOINT, {
      method: "post",
      body
    }).then(fetchData);
  }
}

export default App;
