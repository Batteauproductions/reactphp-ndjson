<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\CharacterModel;
use App\Models\SystemModel;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;
use App\Models\ItemModel;
use App\Models\StoryModel;

use App\Helpers\AuthHelper; 

class Character extends Controller
{
    protected $session;
    protected $request;
    protected $arrRights = [];
    protected $models = [];

    protected $characterModel;
    protected $raceModel;
    protected $professionModel;
    protected $skillModel;
    protected $itemModel;
    protected $storyModel;
    

    public function __construct() 
    {

        $this->session = session();
        $this->request = service('request');

        //declare variables to be used throughout the controller
        // Initialize models using an associative array for easy referencing
        $this->models = [
            'character' => new CharacterModel(),
            'system'    => new SystemModel(),
            'race'      => new RaceModel(),
            'profession'=> new ProfessionModel(),
            'skill'     => new SkillModel(),
            'item'      => new ItemModel(),
            'story'     => new StoryModel(),
        ];

        //collect the rights for the menu
        //1 -- admin | has all the rights needed to perform changes in the system
        //2 -- spelleiding | has rights to perform all but system changes
        //3 -- editor | has rights to perform minor changes
        //4 -- user | this user account has been banned from the system
        // Collect the rights for the menu
        $role = $this->session->get('role');
        $this->arrRights = [
            'isAdmin'      => AuthHelper::isLoggedIn($role, RIGHTS_ADMIN),
            'isGameMaster' => AuthHelper::isLoggedIn($role, RIGHTS_GAMEMASTER),
            'isEditor'     => AuthHelper::isLoggedIn($role, RIGHTS_EDITOR),
            'isUser'       => AuthHelper::isLoggedIn($role, RIGHTS_ALL),
        ];
    }

    public function getAdventure () 
    {
        $response = json_encode($this->storyModel->getStoryById(
            $this->request->getPost('char_id'),
            $this->request->getPost('post_id'))
        );

        echo $response;
    }

    public function getDropdown () 
    {
        //collect user
        $arrData = array(
            'id' => $this->request->getPost('id'),
            'action' => $this->request->getPost('action'),
            'character' => $this->request->getPost('character'),
        );
        
        $arrProfessions = null;
        if(isset($arrData['character']['profession']) > 0) {
            $arrProfessions = $arrData['character']['profession'];
        }

        if (isset($arrData['action'])) {
            switch($arrData['action']) {
                case 'fill-dropdown-type':
                    echo json_encode($this->models['system']->getCharacterTypeOptions());
                    break;
                case 'fill-dropdown-status':
                    echo json_encode($this->models['system']->getCharacterStatusOptions());
                    break;
                case 'fill-dropdown-race':
                    echo json_encode($this->models['race']->getRaces($this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-profession':
                    echo json_encode($this->models['profession']->getProfessions($this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_base':
                    echo json_encode($this->models['skill']->getSkillsByLink([1,2],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_combat':
                    echo json_encode($this->models['skill']->getSkillsByLink([6,8],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_magic':
                    echo json_encode($this->models['skill']->getSkillsByLink([4,5,11],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_divine':
                    echo json_encode($this->models['skill']->getSkillsByLink([3,10],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-basekit':
                    echo json_encode($this->models['item']->getBasicKit());
                    break;
                case 'fill-dropdown-item':
                    echo json_encode($this->models['item']->getItems());
                    break;
                default:
                    echo 'unknown action called';
                    break;
            }             
        } else {
            echo 'no action parsed';
        }
    }

    public function getDetails () 
    {
        //collect user
        $arrData = array(
            'id' => $this->request->getPost('id'),
            'sub_id' => $this->request->getPost('sub_id'),
            'action' => $this->request->getPost('action'),
        );

        if (isset($arrData['action'])) {
            switch($arrData['action']) {
                case 'get-details-race':
                    echo json_encode($this->models['race']->getRaceDetails($arrData['id']));
                    break;
                case 'get-details-profession':
                    echo json_encode($this->models['profession']->getProfessionDetails($arrData['id'],$arrData['sub_id']));
                    break;
                case 'get-details-skill_base':
                case 'get-details-skill_combat':
                case 'get-details-skill_magic':
                case 'get-details-skill_divine':                    
                    echo json_encode($this->models['skill']->getSkillDetails($arrData['id']));
                    break;
                case 'get-details-basekit':
                    echo json_encode($this->models['item']->getBasicKitDetails($arrData['id']));
                    break;
                case 'get-details-item':
                    echo json_encode($this->models['item']->getItemDetails($arrData['id']));
                    break;
                default:
                    echo 'unknown action called';
                    break;
            }            
        } else {
            echo 'no action parsed';
        }
        
    }

    public function Process () 
    {
        //collect user
        $arrData = array(
            'uid' => $this->session->get('uid'),
            'action' => $this->request->getPost('action'),
            'character' => $this->request->getPost('character'),
        );

        if (isset($arrData['action'])) {
            switch($arrData['action']) {
                case "save":
                case "submit":
                    echo json_encode($this->models['character']->saveCharacter($arrData));
                    break;
                case "print":
                    echo  'character-print';
                    break;
                case "delete":
                    break;
                default: 
                    echo 'unknown action has been parsed';
                    break;
            }
        } else {
            echo 'no action parsed';
        }
    }
}