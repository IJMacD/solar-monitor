import { useEffect, useRef } from 'react';
import { SingleGraph } from './Graph';
import './SofaMode.css';

function SofaMode ({ data, dataLog, onClose = null }) {
  /** @type {import('react').MutableRefObject<HTMLDivElement>} */
  const ref = useRef();

  useEffect(() => {
    if (ref.current) {
      ref.current.requestFullscreen();
    }
  }, []);

  return (
    <div className="SofaMode" onClick={onClose} ref={ref}>
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
      <div className="data-box">
        <label htmlFor="battery_soc">Battery SOC</label>
        {data.real_time.battery_soc} %
      </div>
      <div className="data-box">
        <label htmlFor="charger_temperature">Temperature</label>
        {data.real_time.charger_temperature}°C
      </div>
      <SingleGraph log={dataLog} page="power" style={{ width: "unset", height: 300, margin: "auto", flex: 1 }} />
    </div>
  );
}

export default SofaMode;
