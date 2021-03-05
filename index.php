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
        $mime = getMime($filename);
        if ($mime) {
            header("Content-Type: ". $mime);
        }

        echo file_get_contents($filename);
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