<?php
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set("display_errors", 1);

require_once "vendor/autoload.php";

date_default_timezone_set("Asia/Hong_Kong");

// define("MODBUS_HOST", "192.168.64.178");
// define("MODBUS_HOST", "HF-EW11");
define("MODBUS_HOST", getenv("MODBUS_HOST"));

// Instantiating the class is enough to run any scheduled tasks during destruction
// i.e. this line has side-effects
// $scheduler = new TaskScheduler();

header("Access-Control-Allow-Origin: *");
header("Content-Type: text/plain");

$method = "";

if (isset($_SERVER['REQUEST_URI'])) {
    if (strncmp($_SERVER['REQUEST_URI'], "/solar/", 7) === 0) {
        $method = substr($_SERVER['REQUEST_URI'], 7);

        if (strpos($method, "?") !== false) {
            $method = substr($method, 0, strpos($method, "?"));
        }
    }
}

if ($method === "data") {
    $modbus = new ModbusMaster(MODBUS_HOST, "TCP");
    $tracer = new TCPTracer($modbus);

    try {
        $data = $tracer->json();
        header("Content-Type: application/json");
        echo $data;
    } catch (Exception $e) {
        header("HTTP/1.1 500 Server Error");
        echo $e->getMessage();
    }
} else if ($method === "control") {
    $modbus = new ModbusMaster(MODBUS_HOST, "TCP");
    $tracer = new TCPTracer($modbus);

    header("Access-Control-Allow-Origin: *");

    if (isset($_REQUEST['load'])) {

        $tracer->setCoilData(2, $_REQUEST['load'] === "1" || $_REQUEST['load'] === "on");
        echo "done";
    } else if (isset($_REQUEST['coil']) && isset($_REQUEST['value'])) {

        $tracer->setCoilData((int)$_REQUEST['coil'], $_REQUEST['value'] === "1" || $_REQUEST['value'] === "on");
        echo "done";
    } else if (isset($_REQUEST['register']) && isset($_REQUEST['value'])) {
        $register = hexdec($_REQUEST['register']);

        $tracer->setRegister($register, (int)$_REQUEST['value']);
        echo "done";
    } else if (isset($_REQUEST['register_start']) && isset($_REQUEST['values'])) {
        $register = hexdec($_REQUEST['register_start']);

        $tracer->setMultipleRegisters($register, explode(",", $_REQUEST['values']));
        echo "done";
    } else {

        header("HTTP/1.1 400 Unrecognized Request");
        echo "error";
    }
} else if ($method === "schedule") {
    header("HTTP/1.1 500 Server Error");
    exit;

    // Don't use scheduler right now
    // if (isset($_REQUEST['load']) && isset($_REQUEST['time'])) {

    //     $scheduler->schedule($_REQUEST['time'], "set_load", [ $_REQUEST['load'] ]);

    //     echo "done";
    // } else {
    //     header("Content-Type: application/json");

    //     echo json_encode($scheduler->list(), JSON_NUMERIC_CHECK);
    // }
} else if ($method === "") {
    header("Content-Type: text/html");
    readfile("./app/index.html");
} else {

    $filename = "./app/" . $method;

    if (strpos($filename, "..") !== false) {
        header("HTTP/1.1 400 Bad Request");
        exit;
    }

    if (file_exists($filename)) {
        $mime = getMime($filename);
        if ($mime) {
            header("Content-Type: " . $mime);
        }

        readfile($filename);
        exit;
    }

    header("HTTP/1.1 404 Not Found");
}

function getMime($filename)
{
    $mime_array = array(
        "json"  => "application/json",
        "png"   => "image/png",
        "svg"   => "image/svg+xml",
        "ico"   => "image/x-icon",
        "css"   => "text/css",
        "js"    => "text/javascript",
        "txt"   => "text/plain",
    );

    if (preg_match("/\.([a-z0-9]+)$/", $filename, $matches)) {
        $ext = $matches[1];

        if (isset($mime_array[$ext])) {
            return $mime_array[$ext];
        }

        return false;
    }
}

function set_load($value)
{
    if ($value === "off") {
        $value = false;
    }

    $modbus = new ModbusMaster(MODBUS_HOST, "TCP");
    $tracer = new TCPTracer($modbus);

    $tracer->setCoilData(2, $value);
}
