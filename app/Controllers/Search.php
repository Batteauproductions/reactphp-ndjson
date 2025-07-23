<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Models\CharacterModel;
use App\Models\SkillModel;
use App\Helpers\AuthHelper; 

class Search extends BaseController
{

    protected $session;
    protected $arrRights = [];
    protected $models = [];

    public function __construct()
    {
        // Initialize session
        $this->session = session();

        // Initialize models using an associative array for easy referencing
        $this->models = [
            'character' => new CharacterModel(),
            'account'   => new AccountModel(),
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
    }

    public function searchCharacter() {
        //collect user
        $arrData = [
            'cid'       => $this->request->getPost('character_name'),
            'uid'       => $this->request->getPost('character_player'),
            'type_id'   => $this->request->getPost('character_type'),
            'status_id' => $this->request->getPost('character_status'),
            'race_id'   => $this->request->getPost('character_race'),
            'prof_id'   => $this->request->getPost('character_profession'),
            'skill_id'  => $this->request->getPost('character_skill'),
        ];
        // Perform character search
        $results = $this->models['character']->getCharacters($arrData);
        $view = '';
        // Render a tile view for each result
        foreach ($results as $result) {
            $view .= view('_templates/character_tile', [
                'character'    => $result,
                'target'       => 'gamemaster',
                'isGameMaster' => true
            ]);
        }

        echo $view;
    }

    public function searchSkill() { 
        //collect user
        $arrData = array(
            'sid' => $this->request->getPost('skill_name'),
        );
        // Perform skill search
        $results = $this->models['skill']->getSkills($this->arrRights['isGameMaster'], null, $arrData);
        $view = '';
        // Render a tile view for each result
        foreach ($results as $result) {
            $view .= view('_templates/skill_tile', [
                'skill'    => $result,
            ]);
        }
        
        echo $view;
    }

    public function searchProfile() {        
        //collect user
        $arrData = array(
            'uid' => $this->request->getPost('user_name'),
            'role_id' => $this->request->getPost('user_role'),
            'status_id' => $this->request->getPost('user_status'),
        );
        // Perform user search
        $results = $this->models['account']->getUsers($arrData);
        $view = '';
        // Render a tile view for each result
        foreach ($results as $result) {
            $view .= view('_templates/user_tile', [
                'user'    => $result,
                'target'  => 'admin',
            ]);
        }

        echo $view;
    }
}