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

    public function getDetails()
    {
        // Retrieve the 'action' from the POST data
        $action = $this->request->getPost('action');

        if (!$action) {
            echo 'no action parsed';
            return;
        }

        // Switch based on the action type
        switch ($action) {

            // Fetch detailed info about a race
            case 'get-details-race':
                $id = $this->request->getPost('id');
                echo json_encode($this->models['race']->getRaceDetails($id));
                break;

            // Fetch detailed info about a profession
            case 'get-details-profession':
                $id     = $this->request->getPost('id');
                echo json_encode($this->models['profession']->getProfessionDetails(
                    $id,
                    $this->arrRights['isGameMaster'] // Only include private info if GM
                ));
                break;

            // Fetch details about various skill types (same handler)
            case 'get-details-skill_base':
            case 'get-details-skill_combat':
            case 'get-details-skill_magic':
            case 'get-details-skill_divine':
                $id = $this->request->getPost('id');
                echo json_encode($this->models['skill']->getSkillDetails(
                    $id,
                    $this->arrRights['isGameMaster'] // Only include private info if GM
                ));
                break;

            // Fetch starter kit details
            case 'get-details-basekit':
                $id = $this->request->getPost('id');
                echo json_encode($this->models['item']->getBasicKitDetails($id));
                break;

            // Fetch general item details
            case 'get-details-item':
                $id = $this->request->getPost('id');
                echo json_encode($this->models['item']->getItemDetails($id));
                break;

            // Fallback if action is unrecognized
            default:
                echo 'unknown action called';
                break;
        }
    }


    public function Process()
    {
        // Get the action from the POST request to determine what to do
        $action = $this->request->getPost('action');

        if (!$action) {
            echo 'no action parsed';
            return;
        }

        switch ($action) {

            // Handle character deletion
            case "delete":
                echo json_encode(
                    $this->models['character']->deleteCharacter(
                        $this->request->getPost('character'),               // Character ID
                        $this->session->get('uid'),                         // User ID from session
                        $this->arrRights['isGameMaster']                   // Permission check
                    )
                );
                break;

            // Lock a character (status = 5)
            case "lock":
                $arrData = [
                    'uid'       => $this->session->get('uid'),
                    'action'    => 'lock',
                    'character' => $this->request->getPost('character'),
                ];
                echo json_encode($this->models['character']->saveCharacter($arrData, 5));
                break;

            // Review a character and send mail based on status
            case "review":
                $arrData = [
                    'cid'       => $this->request->getPost('cid'),        // Character ID
                    'status_id' => $this->request->getPost('status_id'),  // New status
                    'mail_note' => $this->request->getPost('mail_note')   // Optional message
                ];
                $mailData = $this->models['character']->reviewCharacter($arrData);
                if ($mailData) {
                    // Merge extra mail-related data
                    $mailData = array_merge($mailData, $arrData);

                    // Determine which mail to send based on status
                    $send = ($mailData['status_id'] == 5)
                        ? $this->controllers['mail']->sendCharacterApproved($mailData)
                        : $this->controllers['mail']->sendCharacterDenied($mailData);

                    // If mail is successfully sent, redirect back
                    if ($send) {
                        return redirect()->to($_SERVER['HTTP_REFERER'] ?? '/');
                    }
                }
                break;

            // Save character changes (normal save) / Submit character for review (status = 2) and send email
            case "save":
            case "submit":
                $arrData = [
                    'uid'       => $this->session->get('uid'),
                    'character' => $this->request->getPost('character'),
                    'action'    => $action,
                ];

                // Make sure old assets are removed
                $removeArray = json_decode($this->request->getPost('remove_assets')) ?? null;
                if($removeArray !== null) {
                    $this->removeFromCharacter($removeArray);
                }
                
                // Add an avatar if supplied
                $file = $this->request->getFile('avatar');
                if ($file && $file->isValid() && !$file->hasMoved()) {
                    $file_name = md5($this->request->getPost('char_name')).'.'.$file->getExtension();
                    $arrData['avatar'] = $file_name;
                    // Setup rules for upload
                    $uploadConfig = array(
                        'upload_path'   => './assets/images/avatars/hero/',
                        'allowed_types' => 'jpg|jpeg|png',
                        'max_size'      => 1024 * 5, // 5 MB
                        'file_name'     => $file_name,
                        'overwrite'     => true,
                    );            
                    // Check if the file was uploaded successfully
                    if ($file->isValid() && !$file->hasMoved()) {
                        // Perform the upload using the specified upload settings
                        if ($file->move($uploadConfig['upload_path'], $uploadConfig['file_name'])) {
                            $arrUserDetails = array(
                                'avatar' 		=> $file->getName(),
                                'modified_dt' 	=> date('Y-m-d H:i:s')
                            );                
                        } else {
                            return redirect()->back()->withInput()->with('errors', ['Een fout zorgde dat je je plaatje niet kon uploaden, probeer het later nog eens.']);
                        }
                    } else {
                        return redirect()->back()->withInput()->with('errors', ['Een fout zorgde dat je je plaatje niet kon uploaden, probeer het later nog eens.']);
                    }
                } 

                //do something slightly different per action
                if($action === 'submit') {
                    $returnData = $this->models['character']->saveCharacter($arrData, 2);
                    if (!empty($returnData['done'])) {
                        $send = $this->controllers['mail']->sendCharacterSubmit([
                            'player_name' => $this->session->get('name'),
                            'char_name'   => $returnData['cname'],
                            'cid'         => $returnData['id'],
                        ]);

                        if ($send) {
                            echo json_encode($returnData);
                        }
                    }
                } else {
                    echo json_encode($this->models['character']->saveCharacter($arrData));
                }                
                break;

            // Catch-all: unknown action
            default:
                echo 'unknown action has been parsed';
                break;
        }
    }

    //Remove a profession, skill, or item from a character
    private function removeFromCharacter($arrData) { 
        foreach($arrData as $item) {
            switch ($item->table) {
                case "profession":
                    $this->models['profession']->removeProfession($item);
                    break;
                case "skill":
                    $this->models['skill']->removeSkill($item);
                    break;
                case "item":
                    $this->models['item']->removeItem($item);
                    break;
            }
        }        
    }

}