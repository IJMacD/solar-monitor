import { useState, useEffect, useRef } from 'react';
import { API } from './api';
import './App.css';
import Dashboard from './Dashboard';
import SofaMode from './SofaMode';

const endpoint = process.env.REACT_APP_API_ENDPOINT;
const isControllable = typeof process.env.REACT_APP_API_ENDPOINT === "string";
const isVeryControllable = isControllable;

function App() {
  const apiRef = useRef(new API(endpoint));
  const [ data, setData ] = useState(null);
  const [ dataLog, setDataLog ] = useState([]);
  const [ schedule, setSchedule ] = useState([]);
  const [ page, setPage ] = useState("dashboard");

  const fetchData = () => apiRef.current.fetchData().then(setData);

  // Fetch Live Data
  useEffect(() => {
    fetchData();

    const interval_id = setInterval(fetchData, 30 * 1000);

    return () => clearInterval(interval_id);
  }, []);

  // Fetch Schedule Data
  useEffect(() => {
    const cb = () => apiRef.current.fetchScheduleData().then(setSchedule);
    cb();

    const interval_id = setInterval(cb, 6 * 60 * 1000);

    return () => clearInterval(interval_id);
  }, []);

  // Log Live Data
  useEffect(() => {
    if (data) {
      const newPoint = [
        data.status.date_time,
        // PV: positive values are *in* to device
        data.real_time.pv_voltage,
        data.real_time.pv_current,
        data.real_time.pv_power,
        // Battery: positive values are *out* of device
        data.real_time.battery_voltage,
        data.statistics.net_battery_current,
        data.statistics.net_battery_current * data.real_time.battery_voltage,
        data.real_time.load_voltage,
        // Load: positive values are *out* of device
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
      <Dashboard
        data={data}
        dataLog={dataLog}
        setLoad={isControllable ? on => apiRef.current.setLoad(on).then(fetchData) : null}
        api={isVeryControllable ? apiRef.current : null}
        schedule={schedule}
        onScheduleSet={apiRef.current.scheduleLoad}
      />
      <button onClick={() => setPage("sofa")}>Sofa</button>
      <p>Clone on <a href="https://github.com/IJMacD/epsolar-app">GitHub</a>.</p>
    </div>
  );

}

export default App;
