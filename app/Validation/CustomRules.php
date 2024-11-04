<?php

namespace App\Validation;

class CustomRules
{
    public function registerCodeCheck(string $str, string &$error = null): bool
    {
        if ($str !== 'Chronicle') {
            $error = 'Registratie code is niet correct';
            return false;
        }
        return true;
    }
}