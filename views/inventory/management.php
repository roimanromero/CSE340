<?php
// views/inventory/management.php
?>
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Inventory Management</title>
</head>
<body>
    <h1>Inventory Management</h1>

    <?php
    // Display flash message if set
    if (isset($_SESSION['message'])) {
        echo "<p class='flash-message'>{$_SESSION['message']}</p>";
        unset($_SESSION['message']);
    }
    ?>

    <ul>
        <li><a href="/inv/add-classification">Add New Classification</a></li>
        <li><a href="/inv/add-inventory">Add New Inventory</a></li>
    </ul>
</body>
</html>
