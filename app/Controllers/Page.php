<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Models\EventModel;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;

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
    protected $raceModel;
    protected $professionModel;
    protected $skillModel;
    

    public function __construct() 
    {
        $this->session = session();
        //setup model connections for the page
        $this->characterModel = new CharacterModel();
        $this->eventModel = new EventModel();
        $this->accountModel = new AccountModel();
        $this->systemModel = new SystemModel();
        $this->raceModel = new RaceModel();
        $this->professionModel = new ProfessionModel();
        $this->skillModel = new SkillModel();
        //collect the rights for the menu
        //1 -- admin | has all the rights needed to perform changes in the system
        //2 -- spelleiding | has rights to perform all but system changes
        //3 -- editor | has rights to perform minor changes
        //4 -- user | this user account has been banned from the system
        $this->arrRights = array(
            'isAdmin'       => auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_ADMIN),
            'isGameMaster'  => auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_GAMEMASTER),
            'isEditor'      => auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_EDITOR),
            'isUser'        => auth_helper::isLoggedIn($this->session->get('role'),RIGHTS_ALL),
        );
        //apply settings to the variable
        $this->arrSettings = array (
            'options_user_roles'        => $this->systemModel->getUserRoleOptions(),
            'options_user_status'       => $this->systemModel->getUserStatusOptions(),
            //-----
            'options_character_status'  => $this->systemModel->getCharacterStatusOptions(),
            'options_character_types'   => $this->systemModel->getCharacterTypeOptions(),
            //-----
            'options_race_types'        => $this->raceModel->getRaces(),
            'options_profession_types'  => $this->professionModel->getProfessions($this->arrRights['isGameMaster']),
            'options_skill_types'       => $this->skillModel->getSkills(),
            //-----
            'jsonBaseChar'              => $this->systemModel->getBaseCharSetting(),
            'arrXP'                     => $this->systemModel->getXPModSetting(),
            'jsonStat'                  => $this->systemModel->getStatModSetting(),
            'arrProfLevel'              => $this->systemModel->getProfModSetting(),
        );
    }

    public function view($access=null,$page=null,$subpage=null,$id=null) 
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
                                    $arrData['arrEvents'] = $this->eventModel->getEvents();
                                    $arrContent['content'] = view('gamemaster/events_database',$arrData);
                                    break;
                                case 'edit':
                                    $arrData['arrEvents'] = $this->eventModel->getEvent($id);
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
                                    $arrContent['arrJS'] = ['app/tool/app.js','validation/character_validation.js'];
                                    $arrData = array (
                                        'oSession' => $this->session,
                                        'jsonBaseChar' => $this->arrSettings['jsonBaseChar'],
                                        'jsonStat' => $this->arrSettings['jsonStat'],
                                        'arrXP' => $this->arrSettings['arrXP'],
                                        'arrType' => $this->arrSettings['options_character_types'],
                                        'arrStatus' => $this->arrSettings['options_character_status'],
                                        'arrEvents' => array_reverse($this->eventModel->getEvents()),
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
    }

    public function noPageAcces() {
        $arrContent['header'] = '';
        $arrContent['content'] = view('_templates/no_access');
        $arrContent['footer'] = '';         
        return view('_templates/framework', $arrContent);
    }

}
