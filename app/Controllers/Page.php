<?php

namespace App\Controllers;

use App\Helpers\auth_helper;

class Page extends BaseController
{

    protected $session;
    protected $arrRights;

    public function __construct() 
    {
        $this->session = session();
    }

    public function view($page) 
    {        
        //collect the rights for the menu
        //1 -- admin | has all the rights needed to perform changes in the system
        //2 -- spelleiding | has rights to perform all but system changes
        //3 -- editor | has rights to perform minor changes
        //4 -- user | this user account has been banned from the system
        $arrRights['isAdmin'] = auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_ADMIN);
        $arrRights['isGameMaster'] = auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_GAMEMASTER);
        $arrRights['isEditor'] = auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_EDITOR);
        $arrRights['isUser'] = auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_ALL);
        //collect the base view containers
        if ($arrRights['isAdmin'] || $arrRights['isGameMaster'] || $arrRights['isEditor'] || $arrRights['isUser']) {
            $arrContent['header'] = view('_templates/site_menu',$arrRights);
            $arrContent['footer'] = view('_templates/site_footer');
        } else {
            $arrContent['header'] = '';
            $arrContent['footer'] = ''; 
        }        
        $arrContent['content'] = '';        
        //set the custom js per page
        $arrContent['arrJS'] = [];

        //check user status        
        switch($page) 
        {
            case 'character_database':
                if($arrRights['isGameMaster']) {
                    $arrData['arrType'] = [1,2,3,4,5,6];
                    $arrData['arrStatus'] = [1,2,3,4,5,6];
                    $arrData['arrCharacters'] = [1,2,3,4,5,6,1,2,3,4,5,6];
                    $arrContent['content'] = view('gamemaster/character_database',$arrData);
                } else {
                    $arrContent['content'] = view('_templates/no_access');
                }
                break;
            case 'profile':
                if($arrRights['isUser']) {
                    $arrContent['arrJS'] = ['validation/signup_validation.js'];
                    $arrContent['content'] = view('account/profile');

                } else {
                    $arrContent['arrJS'] = ['validation/login_validation.js'];
                    $arrContent['content'] = view('account/login');
                }
                break;
            case 'password_forget':
                $arrContent['arrJS'] = ['validation/password_forget_validation.js'];
                $arrContent['content'] = view('account/password_forget');
                break;    
            case 'signup':
                $arrContent['arrJS'] = ['validation/signup_validation.js'];
                $arrContent['content'] = view('account/signup');
                break;
            case 'login':
            default:
                if(!$arrRights['isUser']) {
                    $arrContent['arrJS'] = ['validation/login_validation.js'];
                    $arrContent['content'] = view('account/login');
                }
                break;                
        }
        return view('_templates/framework', $arrContent);
    }

}
