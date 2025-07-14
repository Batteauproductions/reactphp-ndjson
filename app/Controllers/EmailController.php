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
        $subject = 'Spelleiding Dalaria | Activeer je account';
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
        $subject = 'Spelleiding Dalaria | Wachtwoord vergeten';
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

    public function sendCharacterApproved ($arrInput) 
    {
        $subject = 'Spelleiding Dalaria | Personage is goed gekeurd';
        $this->email->setTo($arrInput['email']);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData = [
            'player_name' => $arrInput['player_name'],
            'char_name'	  => $arrInput['char_name'],
            'sEmailLink'  => base_url('gamemaster/character/print/'.$arrInput['cid'])
        ];
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/character_approved',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

        // Set the HTML message
        $this->email->setMessage($htmlContent);

        // Send email
        if ($this->email->send()) {
            return true;
        } else {
            return $this->email->printDebugger(['headers']);
        }
    }

    public function sendCharacterDenied ($arrData) 
    {
        $subject = 'Spelleiding Dalaria | Personage is afgekeurd door spelleiding';
        $this->email->setTo($arrInput['email']);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData = [
            'player_name' => $arrInput['player_name'],
            'char_name'	  => $arrInput['char_name'],
            'sEmailLink'  => base_url('user/character/edit/'.$arrInput['cid'])
        ];
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/character_denied',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

        // Set the HTML message
        $this->email->setMessage($htmlContent);

        // Send email
        if ($this->email->send()) {
            return true;
        } else {
            return $this->email->printDebugger(['headers']);
        }
    }

    public function sendCharacterSubmit ($arrInput) 
    {
        $subject = 'Stichting Dalaria | Personage ingediend';
        $this->email->setTo(EMAIL_GENERIC);
        $this->email->setSubject($subject);
        // Load PHP view file and capture its output
        $arrData = [
            'player_name' => $arrInput['player_name'],
            'char_name'	  => $arrInput['char_name'],
            'sEmailLink'  => base_url('gamemaster/character/print/'.$arrInput['cid'])
        ];
        //-------
        $mailContent['title'] = $subject;
        $mailContent['content'] = view('email/character_submitted',$arrData);
        $htmlContent = view('_templates/email',$mailContent);

        // Set the HTML message
        $this->email->setMessage($htmlContent);

        // Send email
        if ($this->email->send()) {
            return true;
        } else {
            return $this->email->printDebugger(['headers']);
        }
    }

}
