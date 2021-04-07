export default function States ({ real_time, status, settings }) {
    const vMax = 16.5;
    const vMin = 10;
    const vRange = vMax - vMin;
    const viewHeight = 500;
    const viewWidth = 500;
    const vScale = viewHeight / vRange;
    const height = 400;
    const width = null;

    const { charging_status: { charging_phase }, battery_status: { battery_status_voltage } } = status;

    function getY (voltage) {
        return viewHeight - (voltage - vMin) * vScale;
    }

    const over1 = [
        [ "high_voltage_disconnect", "Over Voltage Disconnect" ],
        [ "over_voltage_reconnect", "Over Voltage Reconnect" ],
    ];

    const under1 = [
        [ "low_voltage_reconnect", "Low Voltage Reconnect" ],
        [ "low_voltage_disconnect", "Low Voltage Disconnect" ],
    ];

    const under2 = [
        [ "boost_voltage", "Boost Voltage" ],
        [ "boost_reconnect_voltage", "Boost Reconnect Voltage" ],
    ];

    const under3 = [
        [ "under_voltage_recover", "Under Voltage Reconnect" ],
        [ "under_voltage_warning", "Under Voltage Warning" ],
    ];

    return (
        <svg viewBox={`0 0 ${viewWidth} ${viewHeight}`} style={{ width, height }}>
            <State type="over"  title="Over Voltage"    altState={battery_status_voltage === "OVER_VOLTAGE"}    setPoints={over1}  voltage={real_time.battery_voltage} settings={settings} x={75} getY={getY} />
            <State type="under" title="Low Voltage"     altState={battery_status_voltage === "LOW_VOLTAGE"}     setPoints={under1} voltage={real_time.battery_voltage} settings={settings} x={75} getY={getY} />
            <State type="under" title="Boost"           altState={charging_phase === "BOOST"}                   setPoints={under2} voltage={real_time.battery_voltage} settings={settings} x={225} getY={getY} />
            <State type="under" title="Under Voltage"   altState={battery_status_voltage === "UNDER_VOLTAGE"}   setPoints={under3} voltage={real_time.battery_voltage} settings={settings} x={375} getY={getY} />
        </svg>
    );
}

function State ({ type, title, altState, setPoints, x: baseX = 0, y: baseY = 0, getY, settings, voltage }) {
    const flip = type === "under";

    const highVoltage = settings[setPoints[0][0]];
    const lowVoltage = settings[setPoints[1][0]];
    const delta = (highVoltage - lowVoltage) / 2;
    const highStepVoltage = highVoltage - delta;
    const lowStepVoltage = lowVoltage + delta;
    const maxVoltage = highVoltage + 0.5;
    const minVoltage = lowVoltage - 0.5;

    const w = 50;

    let x = 0;

    // TODO: There's got to be some logical reduction possible here
    if (flip) {
        if (altState) {
            if (voltage <= lowStepVoltage) {
                x = w;
            } else if (voltage < highVoltage) {
                const t = (voltage - lowStepVoltage) / (highVoltage - lowStepVoltage);
                x = w * t;
            } else {
                x = 0;
            }
        } else {
            if (voltage > highStepVoltage) {
                x = 0;
            }
            else if (voltage > lowVoltage) {
                const t = (voltage - highStepVoltage) / (lowVoltage - highStepVoltage);
                x = w * t;
            } else {
                x = w;
            }
        }
    } else {
        if (altState) {
            if (voltage <= lowVoltage) {
                x = 0;
            } else if (voltage < lowStepVoltage) {
                const t = (voltage - lowVoltage) / (lowStepVoltage - lowVoltage);
                x = w * t;
            } else {
                x = w;
            }
        } else {
            if (voltage > highVoltage) {
                x = w;
            }
            else if (voltage > highStepVoltage) {
                const t = (voltage - highStepVoltage) / (highVoltage - highStepVoltage);
                x = w * t;
            } else {
                x = 0;
            }
        }
    }

    return (
        <>
            {
                flip ?
                    <>
                        <path d={`M ${baseX + w} ${baseY + getY(minVoltage)} V ${getY(highStepVoltage)} L ${baseX} ${getY(highVoltage)}`} stroke={ altState ? "#f00" : "#000" } fill="none" strokeWidth={2} strokeDasharray="4 4" />
                        <path d={`M ${baseX} ${getY(maxVoltage)} V ${getY(lowStepVoltage)} L ${baseX + w} ${getY(lowVoltage)}`} stroke="#000" fill="none" strokeWidth={2} />
                    </>
                    :
                    <>
                        <path d={`M ${baseX} ${baseY + getY(minVoltage)} V ${getY(highStepVoltage)} L ${baseX + w} ${getY(highVoltage)}`} stroke="#000" fill="none" strokeWidth={2} />
                        <path d={`M ${baseX + w} ${getY(maxVoltage)} V ${getY(lowStepVoltage)} L ${baseX} ${getY(lowVoltage)}`} stroke={ altState ? "#f00" : "#000" } fill="none" strokeWidth={2} strokeDasharray="4 4" />
                    </>
            }
            {/* <ellipse cx={baseX} cy={baseY + getY(lowVoltage)} rx={5} ry={5} fill="#0f0" />
            <ellipse cx={baseX + w} cy={baseY + getY(highVoltage)} rx={5} ry={5} fill="#0f0" /> */}
            <text x={baseX + w / 2} y={baseY + getY(minVoltage) + 16} fill={ altState ? "#f00" : "#000" } textAnchor="middle">{title}</text>
            { voltage >= minVoltage && voltage <= maxVoltage &&
                <>
                    <path transform={`translate(${baseX + x}, ${baseY + getY(voltage)})`} d="M -7 0 L 0 7 L 7 0 L 0 -7 Z" fill="#f00" />
                    {
                        (altState === flip) ?
                            <text x={baseX + x + 10} y={baseY + getY(voltage) + 5} textAnchor="start" fill="#f00">{voltage} V</text>
                            :
                            <text x={baseX + x - 10} y={baseY + getY(voltage) + 5} textAnchor="end" fill="#f00">{voltage} V</text>
                    }
                </>
            }
        </>
    );
}