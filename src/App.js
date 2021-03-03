import { useState, useEffect } from 'react';
import './App.css';
import Diagram from './Diagram';

// const endpoint = `http://nas.lan/PhpEpsolarTracer/example_json.php`;
// const endpoint = `http://nas.home.ijmacd.com/PhpEpsolarTracer/example_json.php`;
const endpoint = `http://dragonsgo.mooo.com:8080/PhpEpsolarTracer/example_json.php`;

function App() {
  const [data, setData]  = useState(null);

  useEffect(fetchData, []);

  useEffect(() => {
    const interval_id = setInterval(fetchData, 30 * 1000);

    return () => clearInterval(interval_id);
  }, []);

  if (!data) {
    return <p>Loading</p>;
  }

  return (
    <div className="App">
      <div className="real_time">
        <fieldset>
          <legend>Solar Information</legend>
          <label htmlFor="pv_power">Solar Power (W)</label>
          <input readOnly id="pv_power" value={data.real_time.pv_power} />
          <label htmlFor="pv_voltage">Solar Voltage (V)</label>
          <input readOnly id="pv_voltage" value={data.real_time.pv_voltage} />
          <label htmlFor="pv_current">Solar Current (A)</label>
          <input readOnly id="pv_current" value={data.real_time.pv_current} />
          <label htmlFor="pv_voltage_status">Solar Status</label>
          <input readOnly id="pv_voltage_status" value={data.status.charging_status.pv_voltage_status} />
          <label htmlFor="max_pv_voltage_today">Max Voltage (V)</label>
          <input readOnly id="max_pv_voltage_today" value={data.statistics.max_pv_voltage_today} />
          <label htmlFor="min_pv_voltage_today">Min Voltage (V)</label>
          <input readOnly id="min_pv_voltage_today" value={data.statistics.min_pv_voltage_today} />
        </fieldset>
        <fieldset style={{flex:2}}>
          <legend>Battery Information</legend>
          <label htmlFor="battery_voltage">Battery Voltage (V)</label>
          <input readOnly id="battery_voltage" value={data.real_time.battery_voltage} />
          <label htmlFor="battery_charging_current">Battery Current (A)</label>
          <input readOnly id="battery_charging_current" value={data.real_time.battery_charging_current} />
          <label htmlFor="battery_charging_power">Battery Power (W)</label>
          <input readOnly id="battery_charging_power" value={data.real_time.battery_charging_power} />
          <label htmlFor="max_battery_voltage_today">Max Voltage (V)</label>
          <input readOnly id="max_battery_voltage_today" value={data.statistics.max_battery_voltage_today} />
          <label htmlFor="min_battery_voltage_today">Min Voltage (V)</label>
          <input readOnly id="min_battery_voltage_today" value={data.statistics.min_battery_voltage_today} />
          <label htmlFor="battery_temperature">Battery Temp (°C)</label>
          <input readOnly id="battery_temperature" value={data.real_time.battery_temperature} />
          <label htmlFor="battery_soc">Battery SOC (%)</label>
          <input readOnly id="battery_soc" value={data.real_time.battery_soc} />
          <label htmlFor="charging_phase">Charging Status</label>
          <input readOnly id="charging_phase" value={data.status.charging_status.charging_phase} />
          <label htmlFor="battery_status_voltage">Battery Status</label>
          <input readOnly id="battery_status_voltage" value={data.status.battery_status.battery_status_voltage} />
        </fieldset>
        <fieldset>
          <legend>DC Load Information</legend>
          <label htmlFor="load_current">Load Current (A)</label>
          <input readOnly id="load_current" value={data.real_time.load_current} />
          <label htmlFor="load_voltage">Load Voltage (V)</label>
          <input readOnly id="load_voltage" value={data.real_time.load_voltage} />
          <label htmlFor="load_power">Load Power (W)</label>
          <input readOnly id="load_power" value={data.real_time.load_power} />
          <label htmlFor="load_power">Load Status</label>
          <input readOnly id="load_power" value={data.coils.manual_control_load?"ON":"OFF"} />
        </fieldset>
        <fieldset>
          <legend>Controller Information</legend>
          <label htmlFor="charger_temperature">Device Temperature (°C)</label>
          <input readOnly id="charger_temperature" value={data.real_time.charger_temperature} />
          <label htmlFor="running">Device Status</label>
          <input readOnly id="running" value={data.status.charging_status.fault?"FAULT":(data.status.charging_status.running?"RUNNING":"STANDBY")} />
        </fieldset>
      </div>
      <div style={{display:"flex"}}>
        <div className="energy">
          <fieldset>
            <legend>Energy Generated (kWh)</legend>
            <label htmlFor="generated_energy_today">Daily</label>
            <input readOnly id="generated_energy_today" value={data.statistics.generated_energy_today} />
            <label htmlFor="generated_energy_this_month">Monthly</label>
            <input readOnly id="generated_energy_this_month" value={data.statistics.generated_energy_this_month} />
            <label htmlFor="generated_energy_this_year">Annual</label>
            <input readOnly id="generated_energy_this_year" value={data.statistics.generated_energy_this_year} />
            <label htmlFor="total_generated_energy">Total</label>
            <input readOnly id="total_generated_energy" value={data.statistics.total_generated_energy} />
          </fieldset>
          <fieldset>
            <legend>Energy Consumed (kWh)</legend>
            <label htmlFor="consumed_energy_today">Daily</label>
            <input readOnly id="consumed_energy_today" value={data.statistics.consumed_energy_today} />
            <label htmlFor="consumed_energy_this_month">Monthly</label>
            <input readOnly id="consumed_energy_this_month" value={data.statistics.consumed_energy_this_month} />
            <label htmlFor="consumed_energy_this_year">Annual</label>
            <input readOnly id="consumed_energy_this_year" value={data.statistics.consumed_energy_this_year} />
            <label htmlFor="total_consumed_energy">Total</label>
            <input readOnly id="total_consumed_energy" value={data.statistics.total_consumed_energy} />
          </fieldset>
        </div>
        <div className="diagram">
          <Diagram { ...data } />
        </div>
      </div>
    </div>
  );

  function fetchData() {
    fetch(endpoint).then(r => r.json()).then(setData);
  }
}

export default App;
