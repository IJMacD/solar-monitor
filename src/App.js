import { useState, useEffect } from 'react';
import './App.css';
import Diagram from './Diagram';
import Graph from './Graph';
import Icon from './Icon';
import Parameters from './Parameters';

const endpoint = process.env.REACT_APP_DATA_ENDPOINT;
const isControllable = typeof process.env.REACT_APP_CONTROL_ENDPOINT === "string";

function App() {
  const [data, setData] = useState(null);
  const [dataLog, setDataLog] = useState([]);

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

  return (
    <div className="App">
      <div className="real_time">
        <fieldset>
          <legend>Solar Information</legend>
          <div className="data-box">
            <label htmlFor="pv_power">Solar Power (W)</label>
            <Icon name="power" />
            <input readOnly id="pv_power" value={data.real_time.pv_power} />
          </div>
          <div className="data-box">
            <label htmlFor="pv_voltage">Solar Voltage (V)</label>
            <Icon name="voltage" />
            <input readOnly id="pv_voltage" value={data.real_time.pv_voltage} />
          </div>
          <div className="data-box">
            <label htmlFor="pv_current">Solar Current (A)</label>
            <Icon name="current" />
            <input readOnly id="pv_current" value={data.real_time.pv_current} />
          </div>
          <div className="data-box">
            <label htmlFor="pv_voltage_status">Solar Status</label>
            <Icon name="solar" />
            <input readOnly id="pv_voltage_status" value={data.status.charging_status.pv_voltage_status} />
          </div>
          <div className="data-box">
            <label htmlFor="max_pv_voltage_today">Max Voltage (V)</label>
            <Icon name="voltage_max" />
            <input readOnly id="max_pv_voltage_today" value={data.statistics.max_pv_voltage_today} />
          </div>
          <div className="data-box">
            <label htmlFor="min_pv_voltage_today">Min Voltage (V)</label>
            <Icon name="voltage_min" />
            <input readOnly id="min_pv_voltage_today" value={data.statistics.min_pv_voltage_today} />
          </div>
        </fieldset>
        <fieldset style={{flex:2}}>
          <legend>Battery Information</legend>
          <div className="data-box">
            <label htmlFor="battery_voltage">Battery Voltage (V)</label>
            <Icon name="voltage" />
            <input readOnly id="battery_voltage" value={data.real_time.battery_voltage} />
          </div>
          <div className="data-box">
            <label htmlFor="battery_charging_current">Battery Current (A)</label>
            <Icon name="current" />
            <input readOnly id="battery_charging_current" value={data.real_time.battery_charging_current} />
          </div>
          <div className="data-box">
            <label htmlFor="battery_charging_power">Battery Power (W)</label>
            <Icon name="power" />
            <input readOnly id="battery_charging_power" value={data.real_time.battery_charging_power} />
          </div>
          <div className="data-box">
            <label htmlFor="max_battery_voltage_today">Max Voltage (V)</label>
            <Icon name="voltage_max" />
            <input readOnly id="max_battery_voltage_today" value={data.statistics.max_battery_voltage_today} />
          </div>
          <div className="data-box">
            <label htmlFor="min_battery_voltage_today">Min Voltage (V)</label>
            <Icon name="voltage_min" />
            <input readOnly id="min_battery_voltage_today" value={data.statistics.min_battery_voltage_today} />
          </div>
          <div className="data-box">
            <label htmlFor="battery_temperature">Battery Temp (°C)</label>
            <Icon name="temperature" />
            <input readOnly id="battery_temperature" value={data.real_time.battery_temperature} />
          </div>
          <div className="data-box">
            <label htmlFor="battery_soc">Battery SOC (%)</label>
            <Icon name="battery" />
            <input readOnly id="battery_soc" value={data.real_time.battery_soc} />
          </div>
          <div className="data-box">
            <label htmlFor="charging_phase">Charging Status</label>
            <Icon name="battery" />
            <input readOnly id="charging_phase" value={data.status.charging_status.charging_phase} />
          </div>
          <div className="data-box">
            <label htmlFor="battery_status_voltage">Battery Status</label>
            <Icon name="battery" />
            <input readOnly id="battery_status_voltage" value={data.status.battery_status.battery_status_voltage} />
          </div>
        </fieldset>
        <fieldset>
          <legend>DC Load Information</legend>
          <div className="data-box">
            <label htmlFor="load_current">Load Current (A)</label>
            <Icon name="current" />
            <input readOnly id="load_current" value={data.real_time.load_current} />
          </div>
          <div className="data-box">
            <label htmlFor="load_voltage">Load Voltage (V)</label>
            <Icon name="voltage" />
            <input readOnly id="load_voltage" value={data.real_time.load_voltage} />
          </div>
          <div className="data-box">
            <label htmlFor="load_power">Load Power (W)</label>
            <Icon name="power" />
            <input readOnly id="load_power" value={data.real_time.load_power} />
          </div>
          <div className="data-box">
            <label htmlFor="manual_control_load">Load Status</label>
            <Icon name="load" />
            <input readOnly id="manual_control_load" value={data.coils.manual_control_load?"ON":"OFF"} />
          </div>
          { isControllable &&
            <div style={{ width: "100%", textAlign: "center" }}>
              <button onClick={() => setLoad(true)}>ON</button>
              <button onClick={() => setLoad(false)}>OFF</button>
            </div>
          }
        </fieldset>
        <fieldset>
          <legend>Controller Information</legend>
          <div className="data-box">
            <label htmlFor="charger_temperature">Device Temperature (°C)</label>
            <Icon name="temperature" />
            <input readOnly id="charger_temperature" value={data.real_time.charger_temperature} />
          </div>
          <div className="data-box">
            <label htmlFor="running">Device Status</label>
            <Icon name="device" />
            <input readOnly id="running" value={data.status.charging_status.fault?"FAULT":(data.status.charging_status.running?"RUNNING":"STANDBY")} />
          </div>
          <div className="data-box">
            <label htmlFor="date_time">Date/Time</label>
            <Icon name="clock" />
            <input readOnly id="date_time" value={data.status.date_time} />
          </div>
        </fieldset>
      </div>
      <div className="lower-panel">
        <div className="energy" style={{flex: 0}}>
          <fieldset>
            <legend>Energy Generated (kWh)</legend>
            <div className="data-box">
              <label htmlFor="generated_energy_today">Daily</label>
              <input readOnly id="generated_energy_today" value={data.statistics.generated_energy_today} />
            </div>
            <div className="data-box">
              <label htmlFor="generated_energy_this_month">Monthly</label>
              <input readOnly id="generated_energy_this_month" value={data.statistics.generated_energy_this_month} />
            </div>
            <div className="data-box">
              <label htmlFor="generated_energy_this_year">Annual</label>
              <input readOnly id="generated_energy_this_year" value={data.statistics.generated_energy_this_year} />
            </div>
            <div className="data-box">
              <label htmlFor="total_generated_energy">Total</label>
              <input readOnly id="total_generated_energy" value={data.statistics.total_generated_energy} />
            </div>
          </fieldset>
          <fieldset>
            <legend>Energy Consumed (kWh)</legend>
            <div className="data-box">
              <label htmlFor="consumed_energy_today">Daily</label>
              <input readOnly id="consumed_energy_today" value={data.statistics.consumed_energy_today} />
            </div>
            <div className="data-box">
              <label htmlFor="consumed_energy_this_month">Monthly</label>
              <input readOnly id="consumed_energy_this_month" value={data.statistics.consumed_energy_this_month} />
            </div>
            <div className="data-box">
              <label htmlFor="consumed_energy_this_year">Annual</label>
              <input readOnly id="consumed_energy_this_year" value={data.statistics.consumed_energy_this_year} />
            </div>
            <div className="data-box">
              <label htmlFor="total_consumed_energy">Total</label>
              <input readOnly id="total_consumed_energy" value={data.statistics.total_consumed_energy} />
            </div>
          </fieldset>
        </div>
        <div className="diagram" style={{flex: "0 1 100%"}}>
          <Diagram { ...data } />
        </div>
        <div className="graph">
          <Graph log={dataLog} />
        </div>
      </div>
      <h2 style={{marginLeft: "1.5em"}}>Limits</h2>
      <Parameters { ...data } />
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
