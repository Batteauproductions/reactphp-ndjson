<?php

namespace App\Controllers;

use CodeIgniter\Controller;
use App\Models\RaceModel;
use App\Models\ProfessionModel;
use App\Models\SkillModel;

class Character extends Controller
{
    protected $session;
    protected $raceModel;
    protected $professionModel;
    protected $skillModel;

    public function __construct() 
    {
        //declare variables to be used throughout the controller
        $this->session = session();
        $this->raceModel = new RaceModel();
        $this->professionModel = new ProfessionModel();
        $this->skillModel = new SkillModel();
    }

    public function getDropdown () 
    {
        //collect user
        $request = service('request');
        $arrData = array(
            'id' => $request->getPost('id'),
            'action' => $request->getPost('action'),
        );

        if (isset($arrData['action'])) {
            switch($arrData['action']) {
                case 'fill-dropdown-race':
                    echo json_encode($this->raceModel->getRaces());
                    break;
                case 'fill-dropdown-profession':
                    echo json_encode($this->professionModel->getProfessions());
                    break;
                case 'fill-dropdown-skill_base':
                    echo json_encode($this->skillModel->getSkillsByLink([1,2]));
                    break;
                case 'fill-dropdown-skill_combat':
                    echo json_encode($this->skillModel->getSkillsByLink([6,8]));
                    break;
                case 'fill-dropdown-skill_magic':
                    echo json_encode($this->skillModel->getSkillsByLink([3,4,5,10,11]));
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
        $request = service('request');
        $arrData = array(
            'id' => $request->getPost('id'),
            'action' => $request->getPost('action'),
        );

        if (isset($arrData['action'])) {
            switch($arrData['action']) {
                case 'get-details-race':
                    echo json_encode($this->raceModel->getRaceDetails($arrData['id']));
                    break;
                case 'get-details-profession':
                    echo json_encode($this->professionModel->getProfessionDetails($arrData['id']));
                    break;
                case 'get-details-skill_base':
                case 'get-details-skill_combat':
                case 'get-details-skill_magic':
                    echo json_encode($this->skillModel->getSkillDetails($arrData['id']));
                    break;
                default:
                    echo 'unknown action called';
                    break;
            } 
            
        } else {
            echo 'no action parsed';
        }
        
    }
}