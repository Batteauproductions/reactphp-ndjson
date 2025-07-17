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
use App\Controllers\EmailController;

use App\Helpers\AuthHelper; 

class Character extends Controller
{
    protected $session;
    protected $request;
    protected $arrRights = [];
    protected $controllers = [];
    protected $models = [];

    protected $mailController;      

    public function __construct() 
    {

        $this->session = session();
        $this->request = service('request');

        $this->controllers = [
            'mail' => new EmailController(),
        ];

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
        $response = json_encode($this->model['story']->getStoryById(
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
                    echo json_encode($this->models['skill']->getSkillsByLink([6,8,13],$arrProfessions,$this->arrRights['isGameMaster']));
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
                    echo json_encode($this->models['profession']->getProfessionDetails($arrData['id'],$arrData['sub_id'],$this->arrRights['isGameMaster']));
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
                case "delete":
                    echo json_encode($this->models['character']->deleteCharacter(
                                                                    $this->request->getPost('character'),                                            
                                                                    $this->session->get('uid'),                                                                    
                                                                    $this->arrRights['isGameMaster'],
                                                                ));
                    break;
                case "lock":
                    $returnData = $this->models['character']->saveCharacter($arrData,5);                    
                    echo json_encode($returnData);
                    break;
                case "save":
                    $returnData = $this->models['character']->saveCharacter($arrData);                    
                    echo json_encode($returnData);
                    break;
                case "review":
                    $referrer = $_SERVER['HTTP_REFERER'] ?? '';
                    $arrData = array(
                        'cid' => $this->request->getPost('cid'),
                        'status_id' => $this->request->getPost('status_id'),
                        'mail_note' => $this->request->getPost('mail_note')
                    );
                    $mailData = $this->models['character']->reviewCharacter($arrData);
                    if($mailData) {
                        $mailData['cid'] = $arrData['cid'];
                        $mailData['mail_note'] = $arrData['mail_note'];
                        $mailData['status_id'] = $arrData['status_id'];
           
                        if($mailData['status_id'] == 5) {
                            $send = $this->controllers['mail']->sendCharacterApproved($mailData);
                        } else {
                            $send = $this->controllers['mail']->sendCharacterDenied($mailData);
                        }
                        if($send) {
                            // Redirect back to the same URL with query parameters
                            return redirect()->to($referrer);
                        }
                    } 
                    break;
                case "search":
                    //collect user
                    $arrData = array(
                        'cid' => $this->request->getPost('character_name'),
                        'uid' => $this->request->getPost('character_player'),
                        'type_id' => $this->request->getPost('character_type'),
                        'status_id' => $this->request->getPost('character_status'),
                        'race_id' => $this->request->getPost('character_race'),
                        'prof_id' => $this->request->getPost('character_profession'),
                        'skill_id' => $this->request->getPost('character_skill'),
                    );
                    $results = $this->models['character']->getCharacters($arrData);
                    $view = '';
                    foreach ($results as $result) {
                        $view .= view('_templates/character_tile', [
                            'character'    => $result,
                            'target'       => 'gamemaster',
                            'isGameMaster' => true
                        ]);
                    }
                    echo $view;
                    break;                
                case "submit":
                    $returnData = $this->models['character']->saveCharacter($arrData,2);
                    if($returnData['done']) {
                        $send = $this->controllers['mail']->sendCharacterSubmit([
                            'player_name'   =>$this->session->get('name'),
                            'char_name'     =>$returnData['cname'],
                            'cid'           =>$returnData['id'],
                        ]);
                        if($send) {
                            echo json_encode($returnData);
                        }
                    }                    
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