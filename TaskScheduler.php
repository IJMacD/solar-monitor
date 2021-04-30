<?php

class TaskScheduler {
    private $cron_file;
    private $jobs;

    function __construct ($conf = []) {
        $this->cron_file = realpath(isset($conf['cron_file']) ? $conf['cron_file'] : "cron_file");

        $this->loadJobs();
    }

    function __destruct () {
        $this->runDueJobs();

        $this->clearDueJobs();

        $this->writeJobs();
    }

    private function loadJobs () {
        $contents = file_get_contents($this->cron_file);

        if ($contents === false) {
            return;
        }

        $lines = explode("\n", $contents);

        $this->jobs = [];

        foreach ($lines as $line) {
            if (strlen($line) > 0) {
                list($date, $task_args) = explode(" ", $line, 2);

                if (strstr($task_args, "--") !== false) {
                    list($task, $arg_string) = explode("--", $task_args);
                    $args = explode(" ", trim($arg_string));
                } else {
                    $task = $task_args;
                    $args = [];
                }

                $callable = explode(" ", trim($task));

                $this->jobs[] = [
                    "date" => $date,
                    "task" => count($callable) === 1 ? $callable[0] : $callable,
                    "args" => $args,
                ];
            }
        }
    }

    private function writeJobs () {
        $lines = [];

        // echo "Writing " . count($this->jobs) . " jobs\n";

        foreach ($this->jobs as $job) {
            $callable = is_array($job['task']) ? implode(" ", $job['task']) : $job['task'];

            $line = $job['date'] . " " . $callable;

            if (is_array($job['args']) && count($job['args']) > 0) {
                $line .= " -- " . implode(" ", $job['args']);
            }

            $lines[] = $line;
        }

        file_put_contents($this->cron_file, implode("\n", $lines));
    }

    private function runDueJobs () {
        $now = time();

        foreach ($this->jobs as $job) {
            $t = strtotime($job['date']);

            if ($t <= $now) {
                if (count($job['args']) > 0) {
                    call_user_func_array($job['task'], $job['args']);
                }
                else {
                    call_user_func($job['task']);
                }
            }
        }
    }

    private function clearDueJobs () {
        $now = time();
        $not_due = [];

        foreach ($this->jobs as $job) {
            $t = strtotime($job['date']);

            if ($t > $now) {
                $not_due[] = $job;
            }
        }

        $this->jobs = $not_due;
    }

    function schedule ($time_spec, $callable, $args = []) {
        $time = strtotime($time_spec);

        // Ensure it's in the future (up to 10 retries)
        $now = time();
        $i = 0;
        while ($time < $now && $i++ < 10) {
            $time = strtotime($time_spec, $now + $i * 86400);
        }

        if (!is_array($args)) {
            $args = [ $args ];
        }

        $this->jobs[] = [
            "date" => date("c", $time),
            "task" => $callable,
            "args" => $args,
        ];

        $this->writeJobs();
    }

    function list () {
        return $this->jobs;
    }

    static function test () {
        echo "[TEST JOB] Run at ".date("c");

        $args = func_get_args();

        if (count($args) > 0) {
            echo " args (".count($args)."): " . implode(" ", $args);
        }

        echo "\n";
    }
}