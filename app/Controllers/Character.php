<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\CharacterModel;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;
use App\Models\ItemModel;
use App\Models\StoryModel;

use App\Helpers\auth_helper;

class Character extends Controller
{
    protected $session;
    protected $arrRights;
    protected $characterModel;
    protected $raceModel;
    protected $professionModel;
    protected $skillModel;
    protected $itemModel;
    protected $storyModel;
    protected $request;

    public function __construct() 
    {
        //declare variables to be used throughout the controller
        $this->session = session();
        $this->characterModel = new CharacterModel();
        $this->raceModel = new RaceModel();
        $this->professionModel = new ProfessionModel();
        $this->skillModel = new SkillModel();
        $this->itemModel = new ItemModel();
        $this->storyModel = new StoryModel();
        $this->request = service('request');
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
                case 'fill-dropdown-race':
                    echo json_encode($this->raceModel->getRaces($this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-profession':
                    echo json_encode($this->professionModel->getProfessions($this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_base':
                    echo json_encode($this->skillModel->getSkillsByLink([1,2],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_combat':
                    echo json_encode($this->skillModel->getSkillsByLink([6,8],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-skill_magic':
                    echo json_encode($this->skillModel->getSkillsByLink([3,4,5,10,11],$arrProfessions,$this->arrRights['isGameMaster']));
                    break;
                case 'fill-dropdown-base_kit':
                    echo json_encode($this->itemModel->getBasicKit());
                    break;
                case 'fill-dropdown-item':
                    echo json_encode($this->itemModel->getItems());
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
                    echo json_encode($this->raceModel->getRaceDetails($arrData['id']));
                    break;
                case 'get-details-profession':
                    echo json_encode($this->professionModel->getProfessionDetails($arrData['id'],$arrData['sub_id']));
                    break;
                case 'get-details-skill_base':
                case 'get-details-skill_combat':
                case 'get-details-skill_magic':
                    echo json_encode($this->skillModel->getSkillDetails($arrData['id']));
                    break;
                case 'get-details-base_kit':
                    echo json_encode($this->itemModel->getBasicKitDetails($arrData['id']));
                    break;
                case 'get-details-item':
                    echo json_encode($this->itemModel->getItemDetails($arrData['id']));
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
                case "character-save":
                    echo json_encode($this->characterModel->saveCharacter($arrData));
                    break;
                case "character-submit":
                    echo json_encode($this->characterModel->saveCharacter($arrData));
                    break;
            }
        } else {
            echo 'no action parsed';
        }
    }
}