<?php
$mysqli = new mysqli("localhost:3636", "root", "", "deposite_sql");

if ($mysqli->connect_error) {
    die("Connection failed: " . $mysqli->connect_error);
} else {
    echo "Connected successfully";
}
?>
