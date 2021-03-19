export default function Parameters ({ real_time, settings }) {
    const vMax = 16.1;
    const vMin = 10;
    const vRange = vMax - vMin;
    const viewHeight = 500;
    const viewWidth = 1000;
    const vScale = viewHeight / vRange;
    const height = 400;
    const width = 800;

    function getY (voltage) {
        return viewHeight - (voltage - vMin) * vScale;
    }

    const pole1 = [
        [ "high_voltage_disconnect", "Over Voltage Disconnect" ],
        [ "charging_limit_voltage", "Charging Limit Voltage" ],
        [ "equalization_voltage", "Equalization Voltage" ],
        [ "boost_voltage", "Boost Voltage" ],
        [ "float_voltage", "Float Voltage" ],
        [ "boost_reconnect_voltage", "Boost Reconnect Voltage" ],
    ];

    const pole2 = [
        [ "high_voltage_disconnect", "Over Voltage Disconnect" ],
        [ "over_voltage_reconnect", "Over Voltage Reconnect" ],
    ];

    const pole3 = [
        [ "low_voltage_disconnect", "Low Voltage Disconnect" ],
        [ "low_voltage_reconnect", "Low Voltage Reconnect" ],
        [ "discharging_limit_voltage", "Discharging Limit Voltage" ],
    ];

    const pole4 = [
        [ "under_voltage_recover", "Under Voltage Reconnect" ],
        [ "under_voltage_warning", "Under Voltage Warning" ],
        [ "discharging_limit_voltage", "Discharging Limit Voltage" ],
    ];

    const pole5 = [
        [ "boost_reconnect_voltage", "Boost Reconnect Voltage" ],
        [ "low_voltage_disconnect", "Low Voltage Disconnect" ],
    ];

    return (
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} style={{ width, height }}>
            <Pole setPoints={pole1} voltage={real_time.battery_voltage} settings={settings} x={100} y={0} getY={getY} />
            <Pole setPoints={pole2} voltage={real_time.battery_voltage} settings={settings} x={400} y={0} getY={getY} />
            <Pole setPoints={pole3} voltage={real_time.battery_voltage} settings={settings} x={400} y={0} getY={getY} />
            <Pole setPoints={pole4} voltage={real_time.battery_voltage} settings={settings} x={100} y={0} getY={getY} />
            <Pole setPoints={pole5} voltage={real_time.battery_voltage} settings={settings} x={700} y={0} getY={getY} />
        </svg>
    );
}

function Pole ({ setPoints, x: baseX, y: baseY, getY, settings, voltage }) {
    const values = setPoints.map(([key]) => settings[key]);
    const maxVoltage = Math.max(...values);
    const minVoltage = Math.min(...values);
    let prevValue = 0;
    let offset = 0;

    return (
        <>
            <path d={`M ${baseX} ${baseY + getY(maxVoltage)} V ${getY(minVoltage)}`} stroke="#000" strokeWidth={2} />
            {
                setPoints.map(([key, label]) => {
                    const y = getY(settings[key]);
                    let labelOnly = false;

                    if (prevValue === y) {
                        offset += 14;
                        labelOnly = true;
                    } else {
                        offset = 0;
                    }

                    prevValue = y;

                    return (
                        <g key={key} transform={`translate(${baseX}, ${baseY + y})`}>
                            { !labelOnly && <text x={-10} y={5} textAnchor="end">{settings[key]} V</text> }
                            { !labelOnly && <circle cx={0} cy={0} r={5} stroke="#000" strokeWidth={2} fill="#fff" /> }
                            <text x={+10} y={offset + 5}>{label}</text>
                        </g>
                    );
                })
            }
            { voltage >= minVoltage && voltage <= maxVoltage &&
                <>
                    <path transform={`translate(${baseX}, ${baseY + getY(voltage)})`} d="M -7 0 L 0 7 L 7 0 L 0 -7 Z" fill="#f00" />
                    <text x={baseX - 10} y={baseY + getY(voltage) + 5} textAnchor="end" fill="#f00">{voltage} V</text>
                </>
            }
        </>
    );
}