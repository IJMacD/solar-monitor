import { SingleGraph } from './Graph';
import './SofaMode.css';

function SofaMode ({ data, dataLog, onClose = null }) {

  return (
    <div className="SofaMode" onClick={onClose}>
      <div className="data-box">
        <label htmlFor="pv_power">Solar Power</label>
        {data.real_time.pv_power} W
      </div>
      <div className="data-box">
        <label htmlFor="battery_voltage">Battery Voltage</label>
        {data.real_time.battery_voltage} V
      </div>
      <div className="data-box">
        <label htmlFor="generated_energy_today">Generated</label>
        {data.statistics.generated_energy_today} kWh
      </div>
      <SingleGraph log={dataLog} page="voltage" style={{ width: "unset", height: 550, margin: "auto" }} />
    </div>
  );
}

export default SofaMode;
