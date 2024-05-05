<?php

namespace App\Controllers;

use CodeIgniter\Controller;

class EmailController extends Controller
{

    protected $email;

    public function __construct() 
    {
        $this->email = \Config\Services::email();
    }

    public function sendSignupConfirmation ($arrData) 
    {
        $this->email->setTo($arrData['email']);
        $this->email->setSubject('Stichting Dalaria | Activeer je account');
        // Load PHP view file and capture its output
        $htmlContent = view('email_template',$arrData);

        // Set the HTML message
        $this->email->setMessage($htmlContent);

        // Send email
        if ($this->email->send()) {
            echo 'Email sent successfully.';
        } else {
            $data['error'] = $this->email->printDebugger(['headers']);
            print_r($data['error']);
        }
    }

    public function sendPasswordReset($oData)
    {    
        // Set email parameters
        $this->email->setTo($oData->email);
        $this->email->setSubject('Stichting Dalaria | Wachtwoord vergeten');
        // Load PHP view file and capture its output
        $arrData['sEmailLink']	= base_url('password/reset/'.$oData->username.'/'.$oData->hash);
		$arrData['sFirstname']	= $oData->firstname;
		$arrData['sLastname']	= $oData->lastname;
        $htmlContent = view('email/password_reset',$arrData);
        // Set the HTML message
        $this->email->setMessage($htmlContent);
        
        // Send email
        if ($this->email->send()) {
            echo 'Email sent successfully.';
        } else {
            $data['error'] = $this->email->printDebugger(['headers']);
            print_r($data['error']);
        }
    }
}
