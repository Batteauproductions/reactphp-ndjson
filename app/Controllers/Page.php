<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Models\EventModel;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;
use App\Helpers\AuthHelper; 

class Page extends BaseController
{
    protected $session;
    protected $arrRights = [];
    protected $arrSettings = [];
    protected $models = [];

    public function __construct()
    {
        // Initialize session
        $this->session = session();

        // Initialize models using an associative array for easy referencing
        $this->models = [
            'character' => new CharacterModel(),
            'event'     => new EventModel(),
            'account'   => new AccountModel(),
            'system'    => new SystemModel(),
            'race'      => new RaceModel(),
            'profession'=> new ProfessionModel(),
            'skill'     => new SkillModel(),
        ];

        // Collect the rights for the menu
        $role = $this->session->get('role');
        $this->arrRights = [
            'isAdmin'      => AuthHelper::isLoggedIn($role, RIGHTS_ADMIN),
            'isGameMaster' => AuthHelper::isLoggedIn($role, RIGHTS_GAMEMASTER),
            'isEditor'     => AuthHelper::isLoggedIn($role, RIGHTS_EDITOR),
            'isUser'       => AuthHelper::isLoggedIn($role, RIGHTS_ALL),
        ];

        // Apply settings to the variable
        $this->arrSettings = [
            'options_user_roles'       => $this->models['system']->getUserRoleOptions(),
            'options_user_status'      => $this->models['system']->getUserStatusOptions(),
            'options_character_status' => $this->models['system']->getCharacterStatusOptions(),
            'options_character_types'  => $this->models['system']->getCharacterTypeOptions(),
            'options_race_types'       => $this->models['race']->getRaces(),
            'options_profession_types' => $this->models['profession']->getProfessions($this->arrRights['isGameMaster']),
            'options_skill_types'      => $this->models['skill']->getSkills(),
            'jsonBaseChar'             => $this->models['system']->getBaseCharSetting(),
            'arrXP'                    => $this->models['system']->getXPModSetting(),
            'jsonStat'                 => $this->models['system']->getStatModSetting(),
            'arrProfLevel'             => $this->models['system']->getProfModSetting(),
        ];
    }


    /*public function view($access=null,$page=null,$subpage=null,$id=null) 
    {         

        //collect the base view containers
        if ($this->arrRights['isAdmin'] || $this->arrRights['isGameMaster'] || $this->arrRights['isEditor'] || $this->arrRights['isUser']) {
            $arrContent['header'] = view('_templates/site_menu',$this->arrRights);
            $arrContent['footer'] = view('_templates/site_footer');
        } else {
            $arrContent['header'] = '';
            $arrContent['footer'] = ''; 
        }        
        $arrContent['content'] = '';        
        //set the custom js per page
        $arrContent['arrJS'] = [];

        switch($access) {
            case 'admin':
                if($this->arrRights['isAdmin']) {
                    switch($page) {
                        case 'user':
                            switch($subpage) {
                                case 'database':
                                    $arrData = array (
                                        'arrRoles' => $this->arrSettings['options_user_roles'],
                                        'arrStatus' => $this->arrSettings['options_user_status'],
                                        'arrUsers' => $this->accountModel->getUsers(),
                                    );
                                    $arrContent['content'] = view('admin/user_database',$arrData);
                                    break;
                            }
                            break;
                        case 'settings':
                            $arrData = array (
                                'arrRace' => $this->arrSettings['options_race_types'],
                                'arrProf' => $this->arrSettings['options_profession_types'],
                                'arrSkill' => $this->arrSettings['options_skill_types'],
                                'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                                'arrXP' => $this->arrSettings['arrXP'],
                                'jsonStat' => $this->arrSettings['jsonStat'],
                                'arrProfLevel' => $this->arrSettings['arrProfLevel'],
                                'viewAsAdmin' => true,
                            );
                            $arrContent['content'] = view('_templates/settings',$arrData);
                            break;
                    }                    
                } else {
                    return $this->noPageAcces();
                }
                break;
            case 'gamemaster':
                if($this->arrRights['isGameMaster']) {
                    switch($page) {
                        case 'character':
                            switch($subpage) {
                                case 'database':
                                    $arrContent['arrJS'] = ['app/grid_sorting.js'];
                                    //---
                                    $arrData = array (
                                        'arrStatus' => $this->arrSettings['options_character_status'],
                                        'arrType' => $this->arrSettings['options_character_types'],
                                        'arrCharacters' => $this->characterModel->getCharacters(), 
                                        'arrRace' => $this->arrSettings['options_race_types'],
                                        'arrProf' => $this->arrSettings['options_profession_types'],
                                        'arrSkill' => $this->arrSettings['options_skill_types'],
                                    );
                                    $arrContent['content'] = view('gamemaster/character_database',$arrData);
                                    break;
                            } 
                            break;
                        case 'event':
                            switch($subpage) {
                                case 'database':
                                    $arrData['arrEvents'] = $this->models['event']->getEvents();
                                    $arrContent['content'] = view('gamemaster/events_database',$arrData);
                                    break;
                                case 'edit':
                                    $arrData['arrEvents'] = $this->models['event']->getEvent($id);
                                    $arrContent['content'] = view('gamemaster/events_database',$arrData);
                                    break;
                            }
                            break;
                        case 'tools':
                            $arrContent['arrJS'] = ['app/encoder_script.js'];
                            $arrContent['content'] = view('gamemaster/tools');
                            break;
                        case 'settings':
                            $arrData = array (
                                'arrRace' => $this->arrSettings['options_race_types'],
                                'arrProf' => $this->arrSettings['options_profession_types'],
                                'arrSkill' => $this->arrSettings['options_skill_types'],
                                'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                                'arrXP' => $this->arrSettings['arrXP'],
                                'jsonStat' => $this->arrSettings['jsonStat'],
                                'arrProfLevel' => $this->arrSettings['arrProfLevel'],
                                'viewAsAdmin' => false,
                            );
                            $arrContent['content'] = view('_templates/settings',$arrData);
                            break;
                    }
                } else {
                    return $this->noPageAcces();
                }
                break;
            case 'user':
                if($this->arrRights['isUser']) {
                    switch($page) {
                        case 'character':
                            switch($subpage) {
                                case 'view':
                                case 'create':                                    
                                    $arrContent['arrJS'] = ['app/character.js','validation/character_validation.js'];
                                    $arrData = array (
                                        'oSession' => $this->session,
                                        'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                                        'jsonStat' => $this->arrSettings['jsonStat'],
                                        'arrXP' => $this->arrSettings['arrXP'],
                                        'arrType' => $this->arrSettings['options_character_types'],
                                        'arrStatus' => $this->arrSettings['options_character_status'],
                                        'arrEvents' => array_reverse($this->models['event']->getEvents()),
                                        'viewAsAdmin' => false,
                                    );
                                    $arrContent['content'] = view('character/character_sheet',$arrData);
                                    break;
                                case 'database':
                                    $arrData['arrCharacters'] = $this->characterModel->getCharacters($this->session->get('uid'));
                                    $arrContent['content'] = view('character/character_database',$arrData);
                                    break;
                            }
                            break;
                        case 'manual':
                            switch($subpage) {
                                case 'help':
                                    //$arrContent['content'] = view('manual/help');
                                    $arrContent['content'] = view('_templates/work_in_progress');
                                    break;
                                case 'rulebooks':
                                    $arrContent['content'] = view('manual/rulebooks');
                                    break;
                                case 'skills':
                                    //$arrContent['content'] = view('manual/skills');
                                    $arrContent['content'] = view('_templates/work_in_progress');
                                    break;
                                case 'faq':
                                    //$arrContent['content'] = view('manual/faq');
                                    $arrContent['content'] = view('_templates/work_in_progress');
                                    break;
                            }
                            break;
                        case 'profile':
                            $arrContent['arrJS'] = ['validation/profile_validation.js']; 
                            $arrData['oUser'] = $this->accountModel->getUserDetails($this->session->get('uid'));                                       
                            $arrContent['content'] = view('account/profile',$arrData); 
                            break;                        
                    }
                } else {
                    return $this->noPageAcces();
                }
                break;
            case 'page':
            default:
                switch($page) {
                    case 'password_forget':
                        $arrContent['arrJS'] = ['validation/password_forget_validation.js'];
                        $arrContent['content'] = view('account/password_forget');
                        break;
                    case 'signup':
                        $arrContent['arrJS'] = ['validation/signup_validation.js'];
                        $arrContent['content'] = view('account/signup');
                        break;
                    case 'login':
                        $arrContent['arrJS'] = ['validation/login_validation.js'];
                        $arrContent['content'] = view('account/login');
                    default:
                        if(!$this->arrRights['isUser']) {
                            $arrContent['arrJS'] = ['validation/login_validation.js'];
                            $arrContent['content'] = view('account/login');
                        }                        
                        break;
                }
                break;
        }
        return view('_templates/framework', $arrContent);
    }*/
    
    public function viewGeneric ($page) {
        //these page are public and require no login
        
        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'password_forget':
                $content = view('account/password_forget');
                $arrJS = ['validation/password_forget_validation.js'];
                break;
            case 'signup':
                $content = view('account/signup');
                $arrJS = ['validation/signup_validation.js'];
                break;
            case 'login':
                $content = view('account/login');
                $arrJS = ['validation/login_validation.js'];
                break;
            default:
                //if this user is not logged in -> no acces, otherwise just revent to homepage
                if (!$this->arrRights['isUser']) {
                    return $this->noPageAccess();
                }
                return $this->constructView();
                break; 
        }
        return $this->constructView($content,$arrJS);
    }

    
    public function viewCharacters ($page) {
        
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }

        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'view':
            case 'create':                                 
                $arrData = array (
                    'oSession' => $this->session,
                    'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                    'jsonStat' => $this->arrSettings['jsonStat'],
                    'arrXP' => $this->arrSettings['arrXP'],
                    'arrType' => $this->arrSettings['options_character_types'],
                    'arrStatus' => $this->arrSettings['options_character_status'],
                    'arrEvents' => array_reverse($this->models['event']->getEvents()),
                    'viewAsAdmin' => $this->arrRights['isAdmin'],
                );
                $content = view('character/character_sheet',$arrData);
                $arrJS = ['app/character.js','validation/character_validation.js'];
                break;
            case 'database':
                $arrData['arrCharacters'] = $this->models['character']->getCharacters($this->session->get('uid'));
                $content = view('character/character_database',$arrData);
                break;
        }

        return $this->constructView($content,$arrJS);
    }

    public function viewGameMaster ($page,$child_page=null,$id=null) {
        // You need to be logged in, and have gamemaster rights, to view this page
        if (!$this->arrRights['isGameMaster']) {
            return $this->noPageAccess();
        }

        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'event':
                switch($child_page) {
                    case 'database':
                        $arrData['arrEvents'] = $this->models['event']->getEvents();
                        $content = view('gamemaster/events_database',$arrData);
                        break;
                    case 'create':
                        //----TODO
                        break;
                    case 'edit':
                        $arrData['arrEvents'] = $this->models['event']->getEvent($id);
                        $content = view('gamemaster/events_database',$arrData);
                        break;
                }
                break;
            case 'character':
                switch($child_page) {
                    case 'database':
                        $arrJS = ['app/grid_sorting.js'];
                        //---
                        $arrData = array (
                        'arrStatus' => $this->arrSettings['options_character_status'],
                        'arrType' => $this->arrSettings['options_character_types'],
                        'arrCharacters' => $this->models['character']->getCharacters(), 
                        'arrRace' => $this->arrSettings['options_race_types'],
                        'arrProf' => $this->arrSettings['options_profession_types'],
                        'arrSkill' => $this->arrSettings['options_skill_types'],
                        );
                        $content = view('gamemaster/character_database',$arrData);
                        break;
                }                                    
                break;
            case 'tools':
                $arrJS = ['app/encoder_script.js'];
                $content = view('gamemaster/tools');
                break;
            case 'settings':
                $arrData = array (
                    'arrRace' => $this->arrSettings['options_race_types'],
                    'arrProf' => $this->arrSettings['options_profession_types'],
                    'arrSkill' => $this->arrSettings['options_skill_types'],
                    'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                    'arrXP' => $this->arrSettings['arrXP'],
                    'jsonStat' => $this->arrSettings['jsonStat'],
                    'arrProfLevel' => $this->arrSettings['arrProfLevel'],
                    'viewAsAdmin' => false,
                );
                $content = view('_templates/settings',$arrData);
                break;
        }

        return $this->constructView($content,$arrJS);
    }
    
    public function viewAdmin ($page,$child_page=null,$id=null) {
        // You need to be logged in and have at least admin rights to view this page
        if (!$this->arrRights['isAdmin']) {
            return $this->noPageAccess();
        }

        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'user':
                switch($child_page) {
                    case 'database':
                        $arrData = array (
                            'arrRoles' => $this->arrSettings['options_user_roles'],
                            'arrStatus' => $this->arrSettings['options_user_status'],
                            'arrUsers' => $this->models['account']->getUsers(),
                        );
                        $content = view('admin/user_database',$arrData);
                        break;
                }
                break;
            case 'settings':
                $arrData = array (
                    'arrRace' => $this->arrSettings['options_race_types'],
                    'arrProf' => $this->arrSettings['options_profession_types'],
                    'arrSkill' => $this->arrSettings['options_skill_types'],
                    'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                    'arrXP' => $this->arrSettings['arrXP'],
                    'jsonStat' => $this->arrSettings['jsonStat'],
                    'arrProfLevel' => $this->arrSettings['arrProfLevel'],
                    'viewAsAdmin' => true,
                );
                $content = view('_templates/settings',$arrData);
                break;
            
        }

        return $this->constructView($content,$arrJS);
    }

    public function viewManual ($page) 
    {
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }

        switch($page) {
            case 'help':
                //$arrContent['content'] = view('manual/help');
                $arrContent['content'] = view('_templates/work_in_progress');
                break;
            case 'rulebooks':
                $arrContent['content'] = view('manual/rulebooks');
                break;
            case 'skills':
                //$arrContent['content'] = view('manual/skills');
                $arrContent['content'] = view('_templates/work_in_progress');
                break;
            case 'faq':
                //$arrContent['content'] = view('manual/faq');
                $arrContent['content'] = view('_templates/work_in_progress');
                break;
        }
    }

    public function viewProfile()
    {
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }
        $arrJS = ['validation/profile_validation.js']; 
        $arrData['oUser'] = $this->accountModel->getUserDetails($this->session->get('uid'));                                       
        $content = view('account/profile',$arrData); 

        return $this->constructView($content,$arrJS);
    }

    private function constructView($content = '', $arrJS = []) 
    {
        $arrContent['header'] = view('_templates/site_menu',$this->arrRights);
        $arrContent['content'] = $content;
        $arrContent['arrJS'] = $arrJS;
        $arrContent['footer'] = view('_templates/site_footer');

        return view('_templates/framework', $arrContent);
    }

    private function noPageAccess()
    {
        $arrContent['header'] = '';
        $arrContent['content'] = view('_templates/no_access');
        $arrContent['footer'] = '';
        return view('_templates/framework', $arrContent);
    }

}
