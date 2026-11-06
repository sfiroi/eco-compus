<?php
session_start();
include("db.php");

if (isset($_POST["login"])) {

    // nverify captcha
    if ($_POST["captcha"] != $_POST["captchaCorrect"]) {
        echo "<h3 style='color:red; text-align:center; margin-top:50px;'>Erreur : Le calcul du CAPTCHA est incorrect.</h3>";
        echo "<p style='text-align:center;'><a href='../frontend/login.html'>Réessayer</a></p>";
        exit();
    }

    $email=$_POST["email"];
    $password=$_POST["password"];

    // requette
    $sql="SELECT * FROM users WHERE email = '$email' AND password = '$password'";
    $result = mysqli_query($conn, $sql);

    if (mysqli_num_rows($result) == 1) {
         $user = mysqli_fetch_assoc($result);

    $_SESSION["id"] = $user["id"];
    $_SESSION["fullname"] = $user["fullname"];

    $nom = $user["fullname"];

    header("Location: http://127.0.0.1:5000/dashboard?username=" . urlencode($nom));
    exit();

    } else {
        echo "<h3 style='color:red; text-align:center; margin-top:50px;'>Erreur : Email ou mot de passe incorrect.</h3>";
        echo "<p style='text-align:center;'><a href='../frontend/login.html'>Réessayer</a></p>";
    }

    mysqli_close($conn);
}
?>