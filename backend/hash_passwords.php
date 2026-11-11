<?php
/* =========================================================
   hash_passwords.php  -  ONE-TIME script

   Turns every plain-text password of the table `users` into a secure bcrypt hash.

   How to use:
     1. Start Apache + MySQL in XAMPP.
     2. Open  http://localhost/projet/EcoCampus/backend/hash_passwords.php  in the browser (once).
     3. Read the result, then DELETE this file.

   (You do not HAVE to run it: login.php also upgrades each old password the first time
    its owner logs in. This script just does all the accounts at once.)
   ========================================================= */

// Safety: this script may only be opened from the computer itself
if (!in_array($_SERVER["REMOTE_ADDR"] ?? "", ["127.0.0.1", "::1"])) {
    http_response_code(403);
    exit("Forbidden: local use only.");
}

include("db.php");                                   // $conn = database connection
header("Content-Type: text/plain; charset=utf-8");   // show the result as simple text

// The column must be long enough for a hash (60 characters). 255 is plenty.
mysqli_query($conn, "ALTER TABLE users MODIFY password VARCHAR(255) NOT NULL");

$hashed  = 0;   // accounts converted now
$already = 0;   // accounts that were already hashed

$result = mysqli_query($conn, "SELECT id, password FROM users");

while ($user = mysqli_fetch_assoc($result)) {

    // Already a hash? Then nothing to do.
    if (password_get_info($user["password"])["algo"] !== null) {
        $already++;
        continue;
    }

    // Hash the plain-text password and save it
    $hash = password_hash($user["password"], PASSWORD_DEFAULT);
    $stmt = mysqli_prepare($conn, "UPDATE users SET password = ? WHERE id = ?");
    mysqli_stmt_bind_param($stmt, "si", $hash, $user["id"]);
    mysqli_stmt_execute($stmt);
    $hashed++;
}

echo "Done.\n";
echo "- Passwords hashed now : $hashed\n";
echo "- Already hashed       : $already\n\n";
echo "You can now DELETE the file backend/hash_passwords.php\n";
?>
