<?php
error_reporting(E_ALL);
ini_set("display_errors", 1);

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
    require "vendor/ijmacd/phpepsolartracer/example_json.php";
    exit;
} else if ($method === "control") {
    if (isset($_REQUEST['load'])) {
        require_once "vendor/autoload.php";

        $tracer = new PhpEpsolarTracer();

        $tracer->setCoilData(2, $_REQUEST['load']);

        header("Access-Control-Allow-Origin: *");
        echo "done";
    }
} else if ($method === "") {
    header("Content-Type: text/html");
    echo file_get_contents("./app/index.html");
} else {

    $filename = "./app/" . $method;

    if (strpos($filename, "..") !== false) {
        header("HTTP/1.1 400 Bad Request");
        exit;
    }

    if (file_exists($filename)) {
        if (preg_match("/\.png$/", $filename)) {
            header("Content-Type: image/png");
        } else if (preg_match("/\.ico$/", $filename)) {
            header("Content-Type: image/x-icon");
        } else if (preg_match("/\.css$/", $filename)) {
            header("Content-Type: text/css");
        } else if (preg_match("/\.js$/", $filename)) {
            header("Content-Type: text/javascript");
        }  else if (preg_match("/\.json$/", $filename)) {
            header("Content-Type: application/json");
        } else if (preg_match("/\.txt$/", $filename)) {
            header("Content-Type: text/plain");
        }

        echo file_get_contents($filename);
        exit;
    }

    header("HTTP/1.1 404 Not Found");
}