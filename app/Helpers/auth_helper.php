<?php

namespace App\Helpers;

class auth_helper
{

    public static function isLoggedIn($iType=null,$arrRole=null)
    {
        $session = session();
        //check user status
        //1 -- admin | has all the rights needed to perform changes in the system
        //2 -- spelleiding | has rights to perform all but system changes
        //3 -- editor | has rights to perform minor changes
        //4 -- user | this user account has been banned from the system
        return $session->has('logged_in') && $session->get('logged_in') === true && self::compareRoles($iType, $arrRole) === true;   
    }

    public static function compareRoles($iType, $arrRole) {
        if (in_array($iType, $arrRole)) {
            return true;
        }
        return false;
    }
    
}
