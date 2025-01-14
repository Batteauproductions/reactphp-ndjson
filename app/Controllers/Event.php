<?php

namespace App\Controllers;

use App\Models\EventModel;
use CodeIgniter\Controller;

class Event extends Controller
{
    protected $validation;
    protected $eventModel;

    public function __construct()
    {
        $this->validation = \Config\Services::validation();
        $this->eventModel = new EventModel();
    }

    private function getValidationRules($isUpdate = false)
    {
        $rules = [
            'title'         => 'required',
            'name'          => 'required',
            'description'   => 'max_length[2000]',
            'story_date'    => 'required',
            'oc_start_time' => 'required',
            'oc_end_time'   => 'required',   
        ];

        if ($isUpdate) {
            $rules['form_id'] = 'required';
        }

        return $rules;
    }

    private function collectEventData()
    {
        return [
            'title'         => $this->request->getPost('title'),
            'name'          => $this->request->getPost('name'),
            'description'   => $this->request->getPost('description'),
            'story_date'    => $this->request->getPost('story_date'),
            'oc_start_time' => $this->request->getPost('oc_start_time'),
            'oc_end_time'   => $this->request->getPost('oc_end_time'),
        ];
    }

    private function validateAndRedirect($rules)
    {
        if (!$this->validation->setRules($rules)->withRequest($this->request)->run()) {
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());
        }
        return null;
    }

    public function submitForm()
    {
        $validationResult = $this->validateAndRedirect($this->getValidationRules());

        if ($validationResult) {
            return $validationResult;
        }

        $eventData = $this->collectEventData();
        $this->eventModel->submitEvent($eventData);

        return redirect()->to('gamemaster/event/database');
    }

    public function updateForm()
    {
        $validationResult = $this->validateAndRedirect($this->getValidationRules(true));

        if ($validationResult) {
            return $validationResult;
        }

        $eventData = $this->collectEventData();
        $this->eventModel->updateEvent($eventData, $this->request->getPost('form_id'));

        return redirect()->to('gamemaster/event/database');
    }
}