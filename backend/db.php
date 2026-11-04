<?php
$conn = mysqli_connect("localhost", "root", "", "ecocampus_db");

if (!$conn) {
    die("Erreur de connexion : " . mysqli_connect_error());
}
?>