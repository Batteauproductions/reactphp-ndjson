<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Models\EventModel;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;
use App\Models\NotesModel;
use App\Models\FaqModel;
use App\Helpers\AuthHelper; 

class Page extends BaseController
{
    protected $session;
    protected $arrRights = [];
    protected $arrSettings = [];
    protected $models = [];
    protected $characterData = [];

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
            'notes'     => new NotesModel(),
            'faq'       => new FaqModel(),
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
            'options_skill_types'      => $this->models['skill']->getSkills($this->arrRights['isGameMaster']),
            'jsonBaseChar'             => $this->models['system']->getBaseCharSetting(),
            'arrXP'                    => $this->models['system']->getXPModSetting(),
            'jsonStat'                 => $this->models['system']->getStatModSetting(),
            'arrProfLevel'             => $this->models['system']->getProfModSetting(),
        ];

        $this->characterData = [
            'oSession'      => $this->session,
            'jsonBaseChar'  => $this->arrSettings['jsonBaseChar'],
            'jsonStat'      => $this->arrSettings['jsonStat'],
            'arrXP'         => $this->arrSettings['arrXP'],            
            'arrType'       => $this->arrSettings['options_character_types'],
            'arrStatus'     => $this->arrSettings['options_character_status'],
            'arrEvents'     => array_reverse($this->models['event']->getEvents()),
            'viewAsAdmin'   => $this->arrRights['isAdmin'],
            'viewAsGamemaster'   => $this->arrRights['isGameMaster'],
        ];
    }
    
    public function viewGeneric ($page=null) 
    {
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

    
    public function viewCharacters ($page, $id=null) 
    {        
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }

        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'view':
            case 'edit':
                $this->characterData['oCharacter'] =  $this->models['character']->getCharacterByID($id,$this->session->get('uid'),$this->arrRights['isGameMaster']);
                $content = view('character/character_sheet',$this->characterData);
                $arrJS = ['generator/generator.js','validation/character_validation.js'];
                break;
            case 'create':  
                $this->characterData['oCharacter'] = null;
                $content = view('character/character_sheet',$this->characterData);
                $arrJS = ['generator/generator.js','validation/character_validation.js'];
                break;
            case 'database':
                $arrData['isGameMaster'] = $this->arrRights['isGameMaster'];
                $arrData['arrCharacters'] = $this->models['character']->getCharacters(['uid'=>$this->session->get('uid')]);                
                $content = view('character/character_database',$arrData);
                break;
        }

        return $this->constructView($content,$arrJS);
    }

    

    public function viewGameMaster ($page,$child_page=null,$id=null) 
    {
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
                        $content = view('gamemaster/event/events_database',$arrData);
                        break;
                    case 'create':
                        $arrJS = ['validation/event_validation.js'];
                        $content = view('gamemaster/event/events_form');
                        break;
                    case 'edit':
                        $arrJS = ['validation/event_validation.js'];
                        $arrData['oEvent'] = $this->models['event']->getEvent($id);
                        $content = view('gamemaster/event/events_form',$arrData);
                        break;
                }
                break;
            case 'character':
                switch($child_page) {
                    case 'view':
                    case 'edit':
                        $this->characterData['oCharacter'] =  $this->models['character']->getCharacterByID($id,$this->session->get('uid'),$this->arrRights['isGameMaster']);
                        $content = view('character/character_sheet',$this->characterData);
                        $arrJS = ['generator/generator.js','validation/character_validation.js'];
                        break;
                    case 'database':
                        $input = $this->request->getGet(); // or ->getPost() if you're using POST
                        // Map URL/form field names to DB field keys
                        $fieldMap = [
                            'character_name'      => 'cid',
                            'character_player'    => 'uid',
                            'character_type'      => 'type_id',
                            'character_status'    => 'status_id',
                            'character_race'      => 'race_id',
                            'character_profession'=> 'prof_id',
                            'character_skill'     => 'skill_id',
                        ];

                        // Translate input to internal keys
                        $filters = [];
                        foreach ($fieldMap as $formField => $dbField) {
                            $value = $input[$formField] ?? null;
                            if (!empty($value)) {
                                $filters[$dbField] = $value;
                            }
                        }
                        $arrJS = ['search/character.js'];
                        $arrData = array (
                            'arrUsers' => $this->models['account']->getUsers(),
                            'arrStatus' => $this->arrSettings['options_character_status'],
                            'arrType' => $this->arrSettings['options_character_types'],
                            'arrAllCharacters' => $this->models['character']->getCharacters(),
                            'arrSelectedCharacters' => $this->models['character']->getCharacters($filters), 
                            'arrRace' => $this->arrSettings['options_race_types'],
                            'arrProf' => $this->arrSettings['options_profession_types'],
                            'arrSkill' => $this->arrSettings['options_skill_types'],
                        );
                        $content = view('gamemaster/character/character_database',$arrData);
                        break;
                }                                    
                break;
            case 'tools':
                $arrJS = ['_lib/encoder_script.js'];
                $content = view('gamemaster/tools/encoder');
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
    
    public function viewAdmin ($page,$child_page=null,$id=null) 
    {
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
                        $input = $this->request->getGet(); // or ->getPost() if you're using POST
                        // Map URL/form field names to DB field keys
                        $fieldMap = [
                            'user_name' => 'uid',
                            'user_role' => 'role_id',
                            'user_status' => 'status_id'
                        ];
                        // Translate input to internal keys
                        $filters = [];
                        foreach ($fieldMap as $formField => $dbField) {
                            $value = $input[$formField] ?? null;
                            if (!empty($value)) {
                                $filters[$dbField] = $value;
                            }
                        }

                        $arrJS = ['search/user.js'];
                        $arrData = array (
                            'arrRoles' => $this->arrSettings['options_user_roles'],
                            'arrStatus' => $this->arrSettings['options_user_status'],
                            'arrAllUsers' => $this->models['account']->getUsers(),
                            'arrSelectedUsers' => $this->models['account']->getUsers($filters),
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

        //define baseline variables
        $content = '';
        $arrJS = [];

        switch($page) {
            case 'help':
                $content = view('manual/help');
                break;
            case 'rulebooks':
                $content = view('manual/rulebooks');
                break;
            case 'skills':
                $arrData['arrSkills'] = $this->models['skill']->getSkills($this->arrRights['isGameMaster']);
                $content = view('manual/skills',$arrData);
                break;
            case 'faq':
                $arrData['arrFaq'] = $this->models['faq']->getAllFaq();
                $content = view('manual/faq',$arrData);
                break;
        }

        return $this->constructView($content,$arrJS);
    }

    public function viewProfile()
    {
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }
        $arrJS = ['validation/profile_validation.js']; 
        $arrData['oUser'] = $this->models['account']->getUserDetails($this->session->get('uid'));                                       
        $content = view('account/profile',$arrData); 

        return $this->constructView($content,$arrJS);
    }

    public function viewPrintable($id)
    {
        // You need to be logged in to view this page
        if (!$this->arrRights['isUser']) {
            return $this->noPageAccess();
        }
        $this->characterData['oCharacter'] =  $this->models['character']->getCharacterByID($id,$this->session->get('uid'),$this->arrRights['isGameMaster']);
        return view('character/character_print', $this->characterData);
    }

    private function constructView($content = '', $arrJS = [])
    {
        // Check if 'isUser' is true and assign the appropriate view
        $arrContent['header'] = $this->arrRights['isUser'] ? view('_templates/site_menu', $this->arrRights) : '';
        $arrContent['content'] = $content;
        $arrContent['arrJS'] = $arrJS;
        $arrContent['footer'] = $this->arrRights['isUser'] ? view('_templates/site_footer') : '';
        
        return view('_templates/framework', $arrContent);
    }

    private function noPageAccess()
    {
        $_SESSION['redirect_after_login'] = $_SERVER['REQUEST_URI'];
        
        $arrContent['header'] = '';
        $arrContent['content'] = view('_templates/no_access');
        $arrContent['footer'] = '';
        return view('_templates/framework', $arrContent);
    }

}
