<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Models\EventModel;

use App\Helpers\auth_helper;

class Page extends BaseController
{

    protected $session;
    protected $arrRights;
    protected $characterModel;
    protected $eventModel;
    protected $accountModel;
    protected $systemModel;
    protected $arrSettings;

    public function __construct() 
    {
        $this->session = session();
        $this->characterModel = new CharacterModel();
        $this->eventModel = new EventModel();
        $this->accountModel = new AccountModel();
        $this->systemModel = new SystemModel();
        //apply settings to the variable
        $this->arrSettings['options_user_roles']        = $this->systemModel->getUserRoleOptions();
        $this->arrSettings['options_user_status']       = $this->systemModel->getUserStatusOptions();
        //-----
        $this->arrSettings['options_character_status']  = $this->systemModel->getCharacterStatusOptions();
        $this->arrSettings['options_character_types']   = $this->systemModel->getCharacterTypeOptions();
    }

    public function view($page,$subpage=null,$id=null) 
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
            //----admin pages
            case 'user':
                if($arrRights['isAdmin']) {
                    switch($subpage) {
                        case 'database':
                            $arrData['arrRoles'] = $this->arrSettings['options_user_roles']; 
                            $arrData['arrStatus'] = $this->arrSettings['options_user_status'];                            
                            $arrData['arrUsers'] = $this->accountModel->getUsers();
                            $arrContent['content'] = view('admin/user_database',$arrData);
                            break;
                    }
                } else {
                    $arrContent['content'] = view('_templates/no_access');
                }
                break;
            //----gamemaster pages
            case 'event':
                if($arrRights['isGameMaster']) {
                    switch($subpage) {
                        case 'database':
                            $arrData['arrEvents'] = $this->eventModel->getEvents();
                            $arrContent['content'] = view('gamemaster/events_database',$arrData);
                            break;
                        case 'edit':
                            $arrData['arrEvents'] = $this->eventModel->getEvent($id);
                            $arrContent['content'] = view('gamemaster/events_database',$arrData);
                            break;
                    }                    
                } else {
                    $arrContent['content'] = view('_templates/no_access');
                }
                break;                
            case 'character':                
                if($arrRights['isGameMaster']) {
                    switch($subpage) {
                        case 'database':
                            $arrContent['arrJS'] = ['app/grid_sorting.js'];
                            //---
                            $arrData['arrStatus'] = $this->arrSettings['options_character_status'];
                            $arrData['arrType'] = $this->arrSettings['options_character_types'];                    
                            $arrData['arrCharacters'] = $this->characterModel->getCharacters();
                            $arrContent['content'] = view('gamemaster/character_database',$arrData);
                            break;
                    }                    
                } else {
                    $arrContent['content'] = view('_templates/no_access');
                }
                break;
            case 'database':
                if($arrRights['isGameMaster']) {
                    switch($subpage) {
                        case 'search':
                            $arrContent['content'] = view('gamemaster/search_database',$arrData);
                            break;
                    }                    
                } else {
                    $arrContent['content'] = view('_templates/no_access');
                }
                break;
            //----user pages
            case 'profile':
                if($arrRights['isUser']) {
                    $arrContent['arrJS'] = ['validation/profile_validation.js']; 
                    //---
                    $arrData['oUser'] = $this->accountModel->getUserDetails($this->session->get('uid'));                                       
                    $arrContent['content'] = view('account/profile',$arrData);

                } else {
                    $arrContent['arrJS'] = ['validation/login_validation.js'];
                    $arrContent['content'] = view('account/login');
                }
                break;
            case 'manual':
                if($arrRights['isUser']) {
                    switch($subpage) {
                        case 'help':
                            $arrContent['content'] = view('manual/help');
                            break;
                        case 'rulebooks':
                            $arrContent['content'] = view('manual/rulebooks');
                            break;
                        case 'skills':
                            $arrContent['content'] = view('manual/skills');
                            break;
                        case 'faq':
                            $arrContent['content'] = view('manual/faq');
                            break;                        
                    }
                } else {
                    $arrContent['arrJS'] = ['validation/login_validation.js'];
                    $arrContent['content'] = view('account/login');
                }                
                break;
            //----generic pages
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
