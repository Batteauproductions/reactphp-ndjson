<?php

namespace App\Controllers;

use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Helpers\auth_helper;

class Page extends BaseController
{

    protected $session;
    protected $arrRights;
    protected $characterModel;
    protected $systemModel;
    protected $arrSettings;

    public function __construct() 
    {
        $this->session = session();
        $this->characterModel = new CharacterModel();
        $this->systemModel = new SystemModel();
        //apply settings to the variable
        $this->arrSettings['options_user_roles']        = $this->systemModel->getUserRoleOptions();
        $this->arrSettings['options_user_status']       = $this->systemModel->getUserStatusOptions();
        //-----
        $this->arrSettings['options_character_status']  = $this->systemModel->getCharacterStatusOptions();
        $this->arrSettings['options_character_types']   = $this->systemModel->getCharacterTypeOptions();
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
                    $arrData['arrStatus'] = $this->arrSettings['options_character_status'];
                    $arrData['arrType'] = $this->arrSettings['options_character_types'];                    
                    $arrData['arrCharacters'] = $this->characterModel->getCharacters();
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
