<?php

namespace App\Controllers;

use App\Models\EventModel;
use CodeIgniter\Controller;

class Event extends Controller
{

    private $validation;
    protected $eventModel;

    public function __construct() 
    {
        //declare variables to be used throughout the controller
        $this->validation = \Config\Services::validation();
        $this->eventModel = new EventModel();
    }

    public function submitForm() 
    {
        // Set validation rules
        $this->validation->setRules([
            'name'          => 'required',
            'description'   => 'max_length[500]',
            'story_date'    => 'required',
            'oc_start_time' => 'required',
            'oc_end_time'   => 'required',            
        ]);

        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());
        } else {
            //collect event
            $request = service('request');
            $arrEvent = array(
                'name' => $request->getPost('name'),
                'description' => $request->getPost('description'),
                'story_date' => $request->getPost('story_date'),
                'oc_start_time' => $request->getPost('oc_start_time'),
                'oc_end_time' => $request->getPost('oc_end_time'),
            );
            // Insert event data into the database using the model
            $this->eventModel->submitEvent($arrEvent);
            //return to profile page
            return redirect()->to('gamemaster/event/database');
        }
    }

    public function updateForm() 
    {
        // Set validation rules
        $this->validation->setRules([
            'form_id'       => 'required',
            'name'          => 'required',
            'description'   => 'max_length[500]',
            'story_date'    => 'required',
            'oc_start_time' => 'required',
            'oc_end_time'   => 'required',            
        ]);

        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());
        } else {
            //collect event
            $request = service('request');
            $arrEvent = array(
                'name' => $request->getPost('name'),
                'description' => $request->getPost('description'),
                'story_date' => $request->getPost('story_date'),
                'oc_start_time' => $request->getPost('oc_start_time'),
                'oc_end_time' => $request->getPost('oc_end_time'),
            );
            // Insert event data into the database using the model
            $this->eventModel->updateEvent($arrEvent,$request->getPost('form_id'));
            //return to profile page
            return redirect()->to('gamemaster/event/database');
        }
    }

}