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
        $subject = 'Stichting Dalaria | Activeer je account';
        $this->email->setTo($arrData['email']);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData['sEmailLink']	= base_url('account/activate/'.$arrData['username'].'/'.$arrData['hash']);
		$arrData['sFirstname']	= $arrData['firstname'];
		$arrData['sLastname']	= $arrData['lastname'];
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/new_user',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

        // Set the HTML message
        $this->email->setMessage($htmlContent);

        // Send email
        if ($this->email->send()) {
            //echo 'Email sent successfully.';
        } else {
            $data['error'] = $this->email->printDebugger(['headers']);
            print_r($data['error']);
        }
    }

    public function sendPasswordReset($oData)
    {    
        $subject = 'Stichting Dalaria | Wachtwoord vergeten';
        // Set email parameters
        $this->email->setTo($oData->email);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData['sEmailLink']	= base_url('account/password_reset/'.$oData->username.'/'.$oData->hash);
		$arrData['sFirstname']	= $oData->firstname;
		$arrData['sLastname']	= $oData->lastname;
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/password_forget',$arrData);        
        $htmlContent = view('_templates/email',$mailContent);
        // Set the HTML message
        $this->email->setMessage($htmlContent);
        
        // Send email
        if ($this->email->send()) {
            //echo 'Email sent successfully.';
        } else {
            $data['error'] = $this->email->printDebugger(['headers']);
            print_r($data['error']);
        }
    }

    public function sendCharacterApproved ($arrData) 
    {
        $subject = 'Stichting Dalaria | Personage goedgekeurd';
        $this->email->setTo($arrData['email']);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData['sEmailLink']	= base_url('password/reset/'.$oData->username.'/'.$oData->hash);
		$arrData['sFirstname']	= $oData->firstname;
		$arrData['sLastname']	= $oData->lastname;
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/new_user',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

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

    public function sendCharacterDenied ($arrData) 
    {
        $subject = 'Stichting Dalaria | Personage afgekeurd';
        $this->email->setTo($arrData['email']);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData['sEmailLink']	= base_url('password/reset/'.$oData->username.'/'.$oData->hash);
		$arrData['sFirstname']	= $oData->firstname;
		$arrData['sLastname']	= $oData->lastname;
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/new_user',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

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
