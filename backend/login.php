<?php
session_start();
include("db.php");

if (isset($_POST["login"])) {

    // 1. Verify CAPTCHA
    if ($_POST["captcha"] != $_POST["captchaCorrect"]) {
        echo "<h3 style='color:red; text-align:center; margin-top:50px;'>Erreur : Le calcul du CAPTCHA est incorrect.</h3>";
        echo "<p style='text-align:center;'><a href='../frontend/login.html'>Réessayer</a></p>";
        exit();
    }

    $email = $_POST["email"];
    $password = $_POST["password"];

    // 2. Query your phpMyAdmin database table
    $sql = "SELECT * FROM users WHERE email = '$email' AND password = '$password'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 1) {
        $user = mysqli_fetch_array($result);

        // Save session
        $_SESSION["id"] = $user["id"];
        $_SESSION["fullname"] = $user["fullname"];
        
        // This takes the 'fullname' from your database and hands it over to your HTML page!
        echo "<script>localStorage.setItem('username', " . json_encode($user["fullname"]) . ");</script>";

        // Redirect to your HTML dashboard
        echo "<script>window.location.href = '../frontend/dashboard.html';</script>";
        exit();

    } else {
        echo "<h3 style='color:red; text-align:center; margin-top:50px;'>Erreur : Email ou mot de passe incorrect.</h3>";
        echo "<p style='text-align:center;'><a href='../frontend/login.html'>Réessayer</a></p>";
    }

    mysqli_close($conn);
}
?>