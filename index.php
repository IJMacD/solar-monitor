<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

require "TaskScheduler.php";
require_once "vendor/autoload.php";

date_default_timezone_set("Asia/Hong_Kong");

// define("MODBUS_HOST", "192.168.64.178");
define("MODBUS_HOST", "HF-EW11");

// Instantiating the class is enough to run any scheduled tasks during destruction
// i.e. this line has side-effects
$scheduler = new TaskScheduler();

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

    header("Access-Control-Allow-Origin: *");
    header("Content-Type: application/json");
    echo $tracer->json();

} else if ($method === "control") {
    if (isset($_REQUEST['load'])) {

        $modbus = new ModbusMaster(MODBUS_HOST, "TCP");
        $tracer = new TCPTracer($modbus);

        $tracer->setCoilData(2, $_REQUEST['load'] === "1" || $_REQUEST['load'] === "on");

        header("Access-Control-Allow-Origin: *");
        echo "done";
    }
} else if ($method === "schedule") {
    if (isset($_REQUEST['load']) && isset($_REQUEST['time'])) {

        $scheduler->schedule($_REQUEST['time'], "set_load", [ $_REQUEST['load'] ]);

        header("Access-Control-Allow-Origin: *");
        echo "done";
    } else {
        header("Access-Control-Allow-Origin: *");
        header("Content-Type: application/json");

        echo json_encode($scheduler->list(), JSON_NUMERIC_CHECK);
    }
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
            header("Content-Type: ". $mime);
        }

        readfile($filename);
        exit;
    }

    header("HTTP/1.1 404 Not Found");
}

function getMime ($filename) {
    $mime_array = array (
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

function set_load ($value) {
    if ($value === "off") {
        $value = false;
    }

    $modbus = new ModbusMaster(MODBUS_HOST, "TCP");
    $tracer = new TCPTracer($modbus);

    $tracer->setCoilData(2, $value);
}