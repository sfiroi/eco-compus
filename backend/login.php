<?php
/* =========================================================
   login.php  -  checks the e-mail and the password of a user

   How passwords are stored:
   - Passwords are NEVER stored as plain text.
   - The database keeps a "hash" (a one-way scrambled version, made with bcrypt).
     A hash can not be turned back into the real password.
   - To check a login, PHP hashes what the user typed and compares it with the stored hash
     (password_verify does this for us).
   - Old accounts that still have a plain-text password are upgraded to a hash
     automatically the first time their owner logs in.
   ========================================================= */

session_start();           // opens the PHP session (used to remember who is logged in)
include("db.php");         // gives us $conn = the connection to the MySQL database

// Lets login.js (running on another address, like Flask :5000) call this file with fetch()
header("Access-Control-Allow-Origin: *");

// login.js sends an extra field "ajax" -> we answer with JSON instead of redirecting
function is_ajax() {
    return isset($_POST["ajax"]);
}

// Login failed. $code = "captcha" or "credentials".
// - AJAX call: send JSON, the page makes the login box shake
// - Normal form: go back to the login page with ?error=...
function fail($code) {
    if (is_ajax()) {
        header("Content-Type: application/json; charset=utf-8");
        echo json_encode(["ok" => false, "error" => $code]);
    } else {
        header("Location: ../frontend/login.html?error=" . $code);
    }
    exit();
}

if (isset($_POST["login"])) {

    // 1) Captcha: the typed answer must be equal to the correct answer
    if (!isset($_POST["captcha"], $_POST["captchaCorrect"]) ||
        $_POST["captcha"] != $_POST["captchaCorrect"]) {
        fail("captcha");
    }

    $email    = $_POST["email"] ?? "";
    $password = $_POST["password"] ?? "";

    // 2) Find the user by e-mail ONLY.
    //    The "?" is filled safely by bind_param (a "prepared statement"),
    //    so nobody can inject SQL through the form.
    $stmt = mysqli_prepare($conn, "SELECT id, fullname, password FROM users WHERE email = ?");
    mysqli_stmt_bind_param($stmt, "s", $email);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user   = $result ? mysqli_fetch_assoc($result) : null;

    // 3) Check the password
    $ok = false;

    if ($user) {
        $stored = $user["password"];

        // password_get_info()["algo"] is null when the stored value is NOT a hash
        if (password_get_info($stored)["algo"] !== null) {

            // Normal case: the stored value is a hash -> compare safely
            $ok = password_verify($password, $stored);

            // If PHP's recommended algorithm changed since, store a fresh hash
            if ($ok && password_needs_rehash($stored, PASSWORD_DEFAULT)) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $up = mysqli_prepare($conn, "UPDATE users SET password = ? WHERE id = ?");
                mysqli_stmt_bind_param($up, "si", $newHash, $user["id"]);
                mysqli_stmt_execute($up);
            }

        } else {

            // Old account: the password is still plain text.
            // Compare it, and if it is correct, replace it by a hash right now.
            $ok = hash_equals($stored, $password);

            if ($ok) {
                $newHash = password_hash($password, PASSWORD_DEFAULT);
                $up = mysqli_prepare($conn, "UPDATE users SET password = ? WHERE id = ?");
                mysqli_stmt_bind_param($up, "si", $newHash, $user["id"]);
                mysqli_stmt_execute($up);
            }
        }
    }

    // 4) Success: remember the user and send him to the dashboard
    if ($ok) {
        $_SESSION["id"]       = $user["id"];
        $_SESSION["fullname"] = $user["fullname"];

        $redirect = "http://127.0.0.1:5000/dashboard?username=" . urlencode($user["fullname"]);

        if (is_ajax()) {
            header("Content-Type: application/json; charset=utf-8");
            echo json_encode(["ok" => true, "name" => $user["fullname"], "redirect" => $redirect]);
        } else {
            header("Location: " . $redirect);
        }
        exit();
    }

    // 5) Wrong e-mail or wrong password (same message for both, on purpose)
    fail("credentials");
}
?>
