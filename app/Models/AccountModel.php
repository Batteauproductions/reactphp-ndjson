<?php

namespace App\Models;

use CodeIgniter\Model;

class AccountModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function insertUser($arrData)
    {
        //insert into user table
		$this->db->table(TBL_USER)->insert($arrData);
	
		
		$user_id = $this->db->insertID();
		
		//insert into details table
		$arrDetails = array ( 
			'user_id' 	=> $user_id,
			'role' 		=> 4,
			'status' 	=> 1,
            'created_dt'=> date('Y-m-d H:i:s'),
		);
		$this->db->table(TBL_USER_DETAILS)->insert($arrDetails);
    }

    public function getUser($arrData)
    {        
        // Fetch user data including password hash
        $query = $this->db->table(TBL_USER)
                        ->select('id, password')
                        ->where('username', $arrData['username'])
                        ->get()
                        ->getRow();

        //check if the users even exists
        if (!empty($query)) {
            // Verify password
            if (password_verify($arrData['password'], $query->password)) {
                // Update last login info
                $this->logLogin($query->id);               
                // Fetch user details
                $userDetails = $this->getUserDetails($query->id);
                return $userDetails;
            }
            return null;
        }
        return null;
    }

    public function getUserByMail($sMail)
    {   
        return $this->db
                    ->table(TBL_USER)
                    ->select('id, firstname, lastname, username, email, hash')
                    ->where('email', $sMail)
                    ->get()
                    ->getRow();
    }

    public function getUserDetails($uID)
    {
        return $this->db
                    ->table(TBL_USER . ' u')
                    ->select('u.id, u.username, u.email, u.firstname, u.lastname, u.birthday, u.discord, u.created_dt,
                            d.role, d.status, d.avatar, d.loggedin_dt as last_login,
                            ro.id as role_id, ro.name as role_name')
                    ->join(TBL_USER_DETAILS . ' d', 'd.user_id = u.id')
                    ->join(TBL_USER_ROLES . ' ro', 'ro.id = d.role')
                    ->where('u.id', $uID)
                    ->get()
                    ->getRow();
    }

    public function logLogin($uID) 
    {
        $this->db->table(TBL_USER_DETAILS)
            ->set('loggedin_dt', date('Y-m-d H:i:s'))
            ->where('user_id', $uID)
            ->update();
    }

    
}
