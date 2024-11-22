<?php
class TCPTracer {
    /** @var ModbusMaster */
    private $modbus;


    /**
     * @param ModbusMaster $modbus
     */
    function __construct($modbus)
    {
        $this->modbus = $modbus;
    }

    function setCoilData (int $coil, bool $value) {
        $this->modbus->writeMultipleCoils(1, $coil, [$value]);
    }

    function setRegister (int $register, int $value) {
        $this->modbus->writeMultipleRegister(1, $register, [$value], ["INT"]);
    }

    function setMultipleRegisters (int $first_register, array $values) {
        $this->modbus->writeMultipleRegister(1, $first_register, $values);
    }

    function getAllData () {
        $real_time = $this->getRealtimeData();
        $settings = $this->getSettingData();
        $coils = $this->getCoilData();

        return [
            "info"          => $this->getInfoData(),
            "rated" 		=> $this->getRatedData(),
            "real_time" 	=> $real_time,
            "statistics" 	=> $this->getStatData(),
            "settings" 		=> $settings,
            "coils" 		=> $coils,
            "discrete" 		=> $this->getDiscreteData(),
            "status"        => $this->makeStatusData($real_time, $settings, $coils),
        ];
    }

    private function makeStatusData ($real_time, $settings, $coils) {

        $batt_status = $real_time['battery_status'];
        $charge_status = $real_time['equipment_status'];

        $batt_status_volt = array(
            "NORMAL",
            "OVER_VOLT",
            "UNDER_VOLT",
            "LOW_DISCONNECT",
            "FAULT"
        )[$batt_status & 7];

        $batt_status_temp = array(
            "NORMAL",
            "OVER_TEMP",
            "BELOW_TEMP",
        )[($batt_status >> 4) & 15];

        $charge_phase = array(
            "NOT_CHARGING",
            "FLOAT",
            "BOOST",
            "EQUALIZATION"
        )[($charge_status >> 2) & 3];

        $pv_volt_status = array(
            "NORMAL",
            "NOT_CONNECTED",
            "OVER_VOLT",
            "ERROR"
        )[($charge_status >> 14) & 3];

        $load_control_mode = array(
            "MANUAL",
            "LIGHT",
            "LIGHT_TIME",
            "TIME",
        )[$settings['load_controlling_mode']];

        $s = $settings['realtime_clock_sec'];
        $i = $settings['realtime_clock_min'];
        $h = $settings['realtime_clock_hour'];
        $d = $settings['realtime_clock_day'];
        $m = $settings['realtime_clock_month'];
        $y = $settings['realtime_clock_year'];

        return array(
            "date_time" => sprintf("20%02d-%02d-%02dT%02d:%02d:%02d", $y, $m, $d, $h, $i, $s),
            "battery_status" => array(
                "battery_status_voltage" => $batt_status_volt,
                "battery_status_temperature" => $batt_status_temp,
                "battery_internal_resistance_abnormal" => (bool)($batt_status & 256),
                "battery_rated_voltage_error" => (bool)($batt_status & 32768),
            ),
            "charging_status" => array(
                "running" => (bool)($charge_status & 1),
                "fault" => (bool)($charge_status & 2),
                "charging_phase" => $charge_phase,
                "pv_short" => (bool)($charge_status & 16),
                "load_mosfet_short" => (bool)($charge_status & 128),
                "load_short" => (bool)($charge_status & 256),
                "load_over_current" => (bool)($charge_status & 512),
                "pv_over_current" => (bool)($charge_status & 1024),
                "anti_reverse_mosfet_short" => (bool)($charge_status & 2048),
                "charging_or_anti_reverse_mosfet_short" => (bool)($charge_status & 4096),
                "charging_mosfet_short" => (bool)($charge_status & 8192),
                "pv_voltage_status" => $pv_volt_status,
            ),
            "load_control" => array(
                "on" => $real_time['load_voltage'] > 0,
                "mode" => $load_control_mode,
                "manual_on" => $coils['manual_control_load'],
                "dusk_duration" => sprintf("%02d:%02d", $settings['working_time_length1_hour'], $settings['working_time_length1_min']),
                "dawn_duration" => sprintf("%02d:%02d", $settings['working_time_length2_hour'], $settings['working_time_length2_min']),
                "times" => array(
                    array(
                        "on"  => sprintf("%02d:%02d:%02d", $settings['turn_on_timing1_hour'], $settings['turn_on_timing1_min'], $settings['turn_on_timing1_sec']),
                        "off" => sprintf("%02d:%02d:%02d", $settings['turn_off_timing1_hour'], $settings['turn_off_timing1_min'], $settings['turn_off_timing1_sec']),
                    ),
                    array(
                        "on"  => sprintf("%02d:%02d:%02d", $settings['turn_on_timing2_hour'], $settings['turn_on_timing2_min'], $settings['turn_on_timing2_sec']),
                        "off" => sprintf("%02d:%02d:%02d", $settings['turn_off_timing2_hour'], $settings['turn_off_timing2_min'], $settings['turn_off_timing2_sec']),
                    ),
                ),
            ),
        );
    }

    function getInfoData () {
        $data = $this->modbus->readDeviceInformation(1);

		$offset = 0;

		$object_count = ord($data[$offset++]);

        $infoData = [];

		for ($i = 0; $i < $object_count; $i++) {
			$id = ord($data[$offset++]);
			$len = ord($data[$offset++]);
			$infoData[$id] = substr($data, $offset, $len);
			$offset += $len;
		}

        return $infoData;
    }

    function getRatedData () {
        $raw_values = $this->modbus->fc4(1, 0x3000, 9);
        $raw_values_2 = $this->modbus->fc4(1, 0x300E, 1);

        $values = [
            $raw_values[0],
            $raw_values[1],
            $raw_values[3] << 16 | $raw_values[2],
            $raw_values[4],
            $raw_values[5],
            $raw_values[7] << 16 | $raw_values[6],
            $raw_values[8],
            $raw_values_2[0],
        ];

        $keys = array(
            "pv_rated_voltage",
            "pv_rated_current",
            "pv_rated_power",
            "rated_charging_voltage",
            "rated_charging_current",
            "rated_charging_power",
            "charging_mode",
            "rated_load_current",
        );

        $scale = [100,100,100,100,100,100,1,100];

        $scaled_values = array_map(function ($v, $s) { return $v / $s; }, $values, $scale);

        return array_combine($keys, $scaled_values);
    }

    function getRealtimeData () {
        $raw_values_1 = $this->modbus->fc4(1, 0x3100, 8);
        $raw_values_2 = $this->modbus->fc4(1, 0x310C, 7);
        $raw_values_3 = $this->modbus->fc4(1, 0x311A, 2);
        $raw_values_4 = $this->modbus->fc4(1, 0x311D, 1);
        $raw_values_5 = $this->modbus->fc4(1, 0x3200, 2);

        $values = array_merge(
            array_slice($raw_values_1, 0, 2),
            [$raw_values_1[3] << 16 | $raw_values_1[2]],
            array_slice($raw_values_1, 4, 2),
            [$raw_values_1[7] << 16 | $raw_values_1[6]],    // 3106 - 3107
            array_slice($raw_values_2, 0, 2),               // 310C - 310D
            [$raw_values_2[3] << 16 | $raw_values_2[2]],    // 310E - 310F
            array_slice($raw_values_2, 4),
            $raw_values_3,
            $raw_values_4,
            $raw_values_5,
        );

        $keys = array(
            "pv_voltage",
            "pv_current",
            "pv_power",
            "battery_voltage",
            "battery_charging_current",
            "battery_charging_power",
            "load_voltage",
            "load_current",
            "load_power",
            "battery_temperature",
            "charger_temperature",
            "heat_sink_temperature",
            "battery_soc",
            "remote_battery_temperature",
            "system_rated_voltage",
            "battery_status",
            "equipment_status",
        );

        $scale = [
            100,100,100,
            100,100,100,
            100,100,100,
            100,100,100,
            1,
            100,100,
            1,1];

        $scaled_values = self::scale_values($values, $scale);

        return array_combine($keys, $scaled_values);
    }

    function getStatData () {
        $raw_values_1 = $this->modbus->fc4(1, 0x3300, 22);
        $raw_values_2 = $this->modbus->fc4(1, 0x331B, 4);

        $values = array_merge(
            array_slice($raw_values_1, 0, 4),
            self::combine_words(array_slice($raw_values_1, 4)),     // 3304 - 3315
            [self::signed_value(self::combine_words(array_slice($raw_values_2, 0, 2))[0], 2)],  // 331B - 331C
            array_slice($raw_values_2, 2),
        );

        $keys = array(
            "max_pv_voltage_today",
            "min_pv_voltage_today",
            "max_battery_voltage_today",
            "min_battery_voltage_today",
            "consumed_energy_today",
            "consumed_energy_this_month",
            "consumed_energy_this_year",
            "total_consumed_energy",
            "generated_energy_today",
            "generated_energy_this_month",
            "generated_energy_this_year",
            "total_generated_energy",
            "carbon_dioxide_reduction",
            "net_battery_current",
            "battery_temperature",
            "ambient_temperature",
        );

        $scales = array_fill(0, 16, 100);

        $scaled_values = self::scale_values($values, $scales);

        return array_combine($keys, $scaled_values);
    }

    function getSettingData () {
        $raw_values_1 = $this->modbus->readMultipleRegisters(1, 0x9000, 15);
        $raw_values_2 = $this->modbus->readMultipleRegisters(1, 0x9013, 15);
        $raw_values_3 = $this->modbus->readMultipleRegisters(1, 0x903D, 3);
        $raw_values_4 = $this->modbus->readMultipleRegisters(1, 0x9042, 12);
        $raw_values_5 = $this->modbus->readMultipleRegisters(1, 0x9065, 1);
        $raw_values_6 = $this->modbus->readMultipleRegisters(1, 0x9067, 1);
        $raw_values_7 = $this->modbus->readMultipleRegisters(1, 0x9069, 6);
        $raw_values_8 = $this->modbus->readMultipleRegisters(1, 0x9070, 1);

        $values = array_merge(
            $raw_values_1,
            self::split_to_bytes(array_slice($raw_values_2, 0, 3)),     // 9013 - 9015
            array_slice($raw_values_2, 3, 2),
            [self::signed_value($raw_values_2[5])],
            array_slice($raw_values_2, 6),
            [$raw_values_3[0]],                                         // 903D
            self::split_to_bytes(array_slice($raw_values_3, 1, 2)),     // 903E - 903F
            $raw_values_4,
            self::split_to_bytes($raw_values_5),
            $raw_values_6,
            $raw_values_7,
            $raw_values_8,
        );

        $keys = array(
            "battery_type",
            "battery_capacity",
            "temperature_compensation_coeff",
            "high_voltage_disconnect",
            "charging_limit_voltage",
            "over_voltage_reconnect",
            "equalization_voltage",
            "boost_voltage",
            "float_voltage",
            "boost_reconnect_voltage",
            "low_voltage_reconnect",
            "under_voltage_recover",
            "under_voltage_warning",
            "low_voltage_disconnect",
            "discharging_limit_voltage",
            "realtime_clock_sec",
            "realtime_clock_min",
            "realtime_clock_hour",
            "realtime_clock_day",
            "realtime_clock_month",
            "realtime_clock_year",
            "equalization_charging_cycle",
            "battery_temp_warning_hi_limit",
            "battery_temp_warning_low_limit",
            "controller_temp_hi_limit",
            "controller_temp_hi_limit_reconnect",
            "components_temp_hi_limit",
            "components_temp_hi_limit_reconnect",
            "line_impedance",
            "night_time_threshold_voltage",
            "light_signal_on_delay_time",
            "day_time_threshold_voltage",
            "light_signal_off_delay_time",
            "load_controlling_mode",
            "working_time_length1_min",
            "working_time_length1_hour",
            "working_time_length2_min",
            "working_time_length2_hour",
            "turn_on_timing1_sec",
            "turn_on_timing1_min",
            "turn_on_timing1_hour",
            "turn_off_timing1_sec",
            "turn_off_timing1_min",
            "turn_off_timing1_hour",
            "turn_on_timing2_sec",
            "turn_on_timing2_min",
            "turn_on_timing2_hour",
            "turn_off_timing2_sec",
            "turn_off_timing2_min",
            "turn_off_timing2_hour",
            "length_of_night_min",
            "length_of_night_hour",
            "battery_rated_voltage_code",
            "load_timing_control_selection",
            "default_load_on_off",
            "equalize_duration",
            "boost_duration",
            "discharging_percentage",
            "charging_percentage",
            "management_mode",
        );

        $scale = [
            1, 1, 100, 100, 100, 100, 100, 100, 100, 100,
            100, 100, 100, 100, 100, 1, 1, 1, 1, 1,
            1, 1, 100, 100, 100, 100, 100, 100, 100, 100,
            1, 100, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 1, 1, 1,
            1, 1, 1, 1, 1, 1, 1, 100, 100, 1,
        ];

        $scaled_values = self::scale_values($values, $scale);

        return array_combine($keys, $scaled_values);
    }

    function getCoilData () {
        $raw_values_1 = $this->modbus->readCoils(1, 0x02, 1);
        $raw_values_2 = $this->modbus->readCoils(1, 0x05, 2);

        $values = array_merge(
            $raw_values_1,
            $raw_values_2,
        );

        $keys = array(
            "manual_control_load",
            "enable_load_test_mode",
            "force_load_on_off",
        );

        return array_combine($keys, $values);
    }

    function getDiscreteData () {
        $raw_values_1 = $this->modbus->readInputDiscretes(1, 0x2000, 1);
        $raw_values_2 = $this->modbus->readInputDiscretes(1, 0x200C, 1);

        $values = array_merge(
            $raw_values_1,
            $raw_values_2,
        );

        $keys = array(
            "over_temperature_inside_device",
            "day_night",
        );

        return array_combine($keys, $values);
    }

    function json () {
        return json_encode($this->getAllData(), JSON_NUMERIC_CHECK);
    }

    static private function split_to_bytes ($words) {
        $out = [];
        foreach ($words as $word) {
            $out[] = $word & 0xFF;
            $out[] = $word >> 8;
        }
        return $out;
    }

    static private function combine_words ($words) {
        $out = [];
        for ($i = 0; $i < count($words) / 2; $i++) {
            $out[] = ($words[$i*2 + 1] << 16) | $words[$i * 2];
        }
        return $out;
    }

    static private function scale_values ($values, $scales) {
        return array_map(function ($v, $s) { return $v / $s; }, $values, $scales);
    }

    static private function signed_value ($value, $words = 1) {
        if ($words === 1) {
            if ($value > 0x7fff) {
                return $value - 0x10000;
            }
            return $value;
        }
        if ($words === 2) {
            if ($value > 0x7fffffff) {
                return $value - 0x100000000;
            }
            return $value;
        }
    }
}
