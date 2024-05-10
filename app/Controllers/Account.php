<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Controllers\EmailController;
use CodeIgniter\Controller;

class Account extends Controller
{

    private $validation;
    protected $session;
    protected $accountModel;
    protected $mailController;  

    public function __construct() 
    {
        //declare variables to be used throughout the controller
        $this->validation = \Config\Services::validation();
        $this->session = session();
        $this->accountModel = new AccountModel();
        $this->mailController = new EmailController(); 
    }

    public function signOutProcess() 
    {
        $this->session->destroy();
        return redirect()->to('/');
    }

    public function signInProcess() 
    {               
        // Set validation rules
        $this->validation->setRules([
            'username'          => 'required|max_length[50]',
            'password'          => 'required',
        ]);

        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());
        } else {
            //collect user
            $request = service('request');
            $arrUser['username'] 	= $request->getPost('username');
            $arrUser['password'] 	= $request->getPost('password');

            //get from the database
            $oUser = $this->accountModel->getUser($arrUser);

            //check if users object is returned
            if (empty((array) $oUser)) {
                return redirect()->back()->withInput()->with('errors', ['Gebruikersnaam/Wachtwoord combinatie onjuist']);
            } else {
                //check user status
                //1 -- pending | this user account is pending and has not been verified yet
                //2 -- active | this user account of this user is active and in good standing with the system
                //3 -- suspended | this user account has done some questionable actions and is under investigation
                //4 -- banned | this user account has been banned from the system
                //5 -- inactive | this user has deactivated their account
                
                switch ($oUser->status) {
                    case 1:
                        return redirect()->back()->withInput()->with('errors', ['Je account is nog niet geactiveerd, controleer je inbox']);
                        break;
                    case 2: 
                        //set the session
                        $sessionData = [
                            'uid'         => $oUser->id,
                            'username'    => $oUser->username,
                            'role'        => $oUser->role,
                            'name'        => $oUser->firstname . ' ' . $oUser->lastname,
                            'avatar'      => $oUser->avatar,
                            'logged_in'   => true
                        ];
                        $this->session->set($sessionData);
                        return redirect()->to('/');
                        break;
                    case 3:
                        return redirect()->back()->withInput()->with('errors', ['Je account is gedeactiveerd. Neem contact op met de webmaster.']);
                        break;
                    case 4:
                        return redirect()->back()->withInput()->with('errors', ['Je account is gebanned. Neem contact op met de webmaster.']);
                        break;
                    case 5:
                        return redirect()->back()->withInput()->with('errors', ['Je account is gedeactiveerd. Neem contact op met de webmaster.']);
                        break;
                    default:
                        return redirect()->back()->withInput()->with('errors', ['Een fout in ons systeem zorgde ervoor dat je niet kon inloggen, probeer het later nog eens.']);
                        break;                        
                }
            }
        }
    }

    public function signUpProcess()
    {
        // Set validation rules
        $this->validation->setRules([
            'username'          => 'required|max_length[50]|is_unique[user.username]',
            'email'             => 'required|valid_email|max_length[250]|is_unique[user.email]',
            'firstname'         => 'required|max_length[50]',
            'lastname'          => 'required|max_length[50]',
            'birthday'          => 'required|valid_date',
            'discord'           => 'max_length[50]',
            'password'          => 'required|min_length[10]',
            'password_repeat'   => 'required|matches[password]',
        ]);

        // Validation failed, redirect back to the form with validation errors
        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());        
        } else {
            // Access form data
            $request = service('request');
            $arrUser = array(
                'username' 	=> $request->getPost('username'),
                'email'		=> $request->getPost('email'),
                'firstname' => $request->getPost('firstname'),
                'lastname' 	=> $request->getPost('lastname'),
                'birthday' 	=> $request->getPost('birthday'),
                'discord' 	=> $request->getPost('discord'),
                'hash'		=> md5($request->getPost('username')),
                'password'  => password_hash($request->getPost('password'), PASSWORD_DEFAULT),
            );

            // Insert user data into the database using the model
            $this->accountModel->insertUser($arrUser);
            $this->mailController->sendSignupConfirmation($arrUser);
            $arrContent['content'] = view('account/signup_done',$arrUser);
            return view('_templates/framework', $arrContent);
        }        
    }

    public function updateProfile() {
        // Set validation rules
        $this->validation->setRules([
            //'email'             => 'required|valid_email|max_length[250]|is_unique[user.email]',
            'firstname'         => 'required|max_length[50]',
            'lastname'          => 'required|max_length[50]',
            'birthday'          => 'required|valid_date',
            'discord'           => 'max_length[50]',
        ]);
        // Validation failed, redirect back to the form with validation errors
        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());        
        } else {
            // Access form data
            $request = service('request');
            $arrUserBase = array(
                //'email' 		=> $request->getPost('email'),
                'firstname' 	=> $request->getPost('firstname'),
                'lastname' 		=> $request->getPost('lastname'),
                'birthday' 		=> $request->getPost('birthday'),
                'discord' 		=> $request->getPost('discord'),
                'password'      => password_hash($request->getPost('password'), PASSWORD_DEFAULT),
                'modified_dt' 	=> date('Y-m-d H:i:s')
            );  
            
            $arrUserDetails = [];
            // Get the uploaded file
            $file = $request->getFile('avatar');
            if(!empty($file->getName())) {
                //setup rules for upload
                $uploadConfig = array(
                    'upload_path'   => './assets/images/avatars/user/',
                    'allowed_types' => 'jpg|jpeg|png',
                    'max_size'      => 1024 * 5, // 5 MB
                    'file_name'     => md5($this->session->get('username')).'.'.$file->getExtension(),
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
            //setup data for the model           
            $arrUser = array(
                'id' 			=> $this->session->get('uid'),
                'arrUserBase' 	=> $arrUserBase,
                'arrUserDetails'=> $arrUserDetails
            );
            //update the profile
            $this->accountModel->updateUser($arrUser);    
            //return to profile page
            return redirect()->to('user/profile'); 
        }
    }

    public function passwordForgotProcess() 
    {
        // Set validation rules
        $this->validation->setRules([
            'email' => 'required|valid_email|max_length[250]',
        ]);

        // Validation failed, redirect back to the form with validation errors
        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());        
        } else {

            $request = service('request');
            $arrUser['email'] = $request->getPost('email');

            $oUser = $this->accountModel->getUserByMail($arrUser['email']);

            if (empty((array) $oUser)) {
                redirect()->back()->withInput()->with('errors', ['Dit email adres is bij ons niet bekend.']);
            } else {
                $this->mailController->sendPasswordReset($oUser);
                $arrContent['content'] = view('account/password_forget_done',$arrUser);
                return view('_templates/framework', $arrContent);         
            }
        }
    }

    public function activateUser($sUser, $sHash) 
    {
        $arrData = array (
            'username' => $sUser,
            'hash' => $sHash,
        );
        $arrContent['content'] = '';
        //check if user and hash match
		if($this->accountModel->activateUser($arrData)) {
			$arrContent['content'] = view('account/activate_done');
		} else {
			$arrContent['content'] = view('account/activate_error');
		}				
        return view('_templates/framework', $arrContent);
	}

    public function passwordReset($sUser, $sHash) 
    {
        $arrData = array (
            'username' => $sUser,
            'hash' => $sHash,
        );
        $arrContent['arrJS'] = ['validation/password_reset_validation.js'];
        $arrContent['content'] = view('account/password_reset',$arrData);
        return view('_templates/framework', $arrContent);
    }

    public function passwordResetProcess() 
    {
        // Set validation rules
        $this->validation->setRules([
            'username'          => 'required',
            'hash'              => 'required',
            'password'          => 'required|min_length[10]',
            'password_repeat'   => 'required|matches[password]',
        ]);

        // Validation failed, redirect back to the form with validation errors
        if (!$this->validation->withRequest($this->request)->run()) {            
            return redirect()->back()->withInput()->with('errors', $this->validation->getErrors());        
        } else {
            $request = service('request');
            $arrUser = array(
                'username' 	=> $request->getPost('username'),
                'hash' 		=> $request->getPost('hash'),
                'password'  => password_hash($request->getPost('password'), PASSWORD_DEFAULT),
            );  
            $arrContent['content'] = '';

            //check if update is done
            if($this->accountModel->resetPassword($arrUser)) {
                $arrContent['content'] = view('account/password_reset_done');
            } else {
                $arrContent['content'] = view('account/password_reset_error');
            }            
            return view('_templates/framework', $arrContent);
        }        
    }

}
