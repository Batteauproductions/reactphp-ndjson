<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class Test extends Controller
{
    public function index()
    {
        $db = \Config\Database::connect();
        if ($db->connectError) {
            die("Database connection error: " . $db->connectError);
        } else {
            echo "Database connected successfully!";
        }
    }
}
