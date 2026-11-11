<?php
// Connection to the MySQL database (XAMPP default: user "root", no password).
// Other PHP files do include("db.php") and then use the variable $conn.
$conn = mysqli_connect("localhost", "root", "", "ecocampus_db");

// If MySQL is not started, stop here and show the reason
if (!$conn) {
    die("Erreur de connexion : " . mysqli_connect_error());
}
?>
