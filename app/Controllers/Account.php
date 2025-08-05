<?php

namespace App\Controllers;

use App\Models\AccountModel;
use App\Controllers\EmailController;
use CodeIgniter\Controller;

use App\Helpers\AuthHelper; 

class Account extends Controller
{

    private $validation;
    protected $session;
    protected $request;
    protected $accountModel;
    protected $mailController;  
    protected $arrRights = [];

    public function __construct() 
    {
        //declare variables to be used throughout the controller
        $this->validation = \Config\Services::validation();
        $this->session = session();
        $this->request = service('request');
        $this->accountModel = new AccountModel();
        $this->mailController = new EmailController(); 

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

    public function signOutProcess() 
    {
        $this->session->destroy();
        return redirect()->to('/user/login');
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
            $arrUser['username'] 	= $this->request->getPost('username');
            $arrUser['password'] 	= $this->request->getPost('password');

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
                        $redirect = $_SESSION['redirect_after_login'] ?? '/home';
                        unset($_SESSION['redirect_after_login']);
                        return redirect()->to($redirect);
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
            'username'          => [
                'label' => 'username',
                'rules' => [
                    'required',
                    'max_length[50]',
                    'is_unique[user.username]'
                ],
                'errors' => [
                    'is_unique' => 'Het is niet mogelijk om deze gebruikersnaam te registreren, mogelijk dat deze al in gebruik is.'
                ]
            ],
            'email'             => [
                'label' => 'email',
                'rules' => [
                    'required',
                    'max_length[50]',
                    'is_unique[user.email]'
                ],
                'errors' => [
                    'is_unique' => 'Het is niet mogelijk om op deze email te registreren, mogelijk dat deze al in gebruik is.'
                ]
            ],
            'register_code'     => [
                'label' => 'register_code',
                'rules' => [
                    'required',
                    'max_length[50]',
                    'registerCodeCheck'
                ],
            ],
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
            $arrUser = array(
                'username' 	=> $this->request->getPost('username'),
                'email'		=> $this->request->getPost('email'),
                'firstname' => $this->request->getPost('firstname'),
                'lastname' 	=> $this->request->getPost('lastname'),
                'birthday' 	=> $this->request->getPost('birthday'),
                'discord' 	=> $this->request->getPost('discord'),
                'hash'		=> md5($this->request->getPost('username')),
                'password'  => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT),
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
            $arrUserBase = array(
                'firstname' 	=> $this->request->getPost('firstname'),
                'lastname' 		=> $this->request->getPost('lastname'),
                'birthday' 		=> $this->request->getPost('birthday'),
                'discord' 		=> $this->request->getPost('discord'),
                'modified_dt' 	=> date('Y-m-d H:i:s')
            );  
            
            $arrUserDetails = [];
            // Get the uploaded file
            $file = $this->request->getFile('avatar');
            if (!empty($file->getName())) {
                $allowedTypes = ['jpg', 'jpeg', 'png'];
                $maxSizeBytes = 1024 * 1024 * 5; // 5 MB

                $extension = strtolower($file->getExtension());
                $fileSize  = $file->getSize(); // in bytes

                if (!in_array($extension, $allowedTypes)) {
                    return redirect()->back()->withInput()->with('errors', ['Alleen .jpg, .jpeg of .png bestanden zijn toegestaan.']);
                }

                if ($fileSize > $maxSizeBytes) {
                    return redirect()->back()->withInput()->with('errors', ['Het bestand is te groot. Maximum is 5MB.']);
                }

                $file_name = md5($this->session->get('username')) . '.' . $extension;
                $uploadPath = FCPATH . 'assets/images/avatars/user/';
                $fullPath = $uploadPath . $file_name;

                // Bestaand bestand handmatig verwijderen indien nodig
                if (file_exists($fullPath)) {
                    unlink($fullPath);
                }

                if ($file->isValid() && !$file->hasMoved()) {
                    if ($file->move($uploadPath, $file_name)) {
                        $arrUserDetails = array(
                            'avatar'       => $file_name,
                            'modified_dt'  => date('Y-m-d H:i:s')
                        );
                        // Hier eventueel opslaan naar DB
                    } else {
                        return redirect()->back()->withInput()->with('errors', ['Uploaden is mislukt. Probeer het later opnieuw.']);
                    }
                } else {
                    return redirect()->back()->withInput()->with('errors', ['Uploaden is mislukt. Probeer het later opnieuw.']);
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
            $arrUser['email'] = $this->request->getPost('email');

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
            $arrUser = array(
                'username' 	=> $this->request->getPost('username'),
                'hash' 		=> $this->request->getPost('hash'),
                'password'  => password_hash($this->request->getPost('password'), PASSWORD_DEFAULT),
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

    public function accountDelete() 
    {
        $uid = $this->request->getPost('uid');
        $isAdmin = $this->arrRights['isAdmin']; 
        //only admins may delete accounts
        if($isAdmin) {
            return json_encode($this->accountModel->deleteUser($uid,$isAdmin));
        } 
        return false;
    }

}
