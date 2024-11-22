<?php

ini_set("display_errors", 1);

date_default_timezone_set("Asia/Hong_Kong");

include "TaskScheduler.php";

$scheduler = new TaskScheduler();

if (isset($_GET['set'])) {
    if ($_GET['set'] === 1) {
        $scheduler->schedule("+1 minutes", [TaskScheduler::class, "test"]);
    } else {
        $scheduler->schedule("+1 minutes", [TaskScheduler::class, "test"], ["aabbccdd", rand()]);
    }
}