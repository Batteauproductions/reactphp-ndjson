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

    public function getUsers($params = []) 
    {
        $builder = $this->db->table(TBL_USER.' u');
		$builder->select('u.id, 
                        u.username, 
                        u.email, 
                        u.firstname, 
                        u.lastname, 
                        u.birthday, 
                        u.discord,
                        d.role, d.status, d.avatar, d.loggedin_dt as last_login,
                        ro.id as role_id, ro.name as role_name,
                        us.id as status_id, us.name as status_name')					
                ->join(TBL_USER_DETAILS.' d','d.user_id = u.id')
                ->join(TBL_USER_ROLES.' ro','ro.id = d.role')
                ->join(TBL_USER_STATUS.' us','us.id = d.status');

        // If $uid is provided, add a where clause to filter by user_id
        if (!empty($params['uid'])) {
            $builder->where('u.id', $params['uid']);
        }

        if (!empty($params['role_id'])) {
            $builder->where('ro.id', $params['role_id']);
        }

        if (!empty($params['status_id'])) {
            $builder->where('us.id', $params['status_id']);
        }
                
        // Order By clause
        $builder->orderBy('u.firstname','asc');

        // Execute the query and get the result
        $query = $builder->get();

        return $query->getResultObject();

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

    public function activateUser($arrData) {
		$query = $this
				->db
                ->table(TBL_USER)
                ->set('modified_dt', date('Y-m-d H:i:s'))	
				->where('username', $arrData['username'])
				->where('hash', $arrData['hash'])
				->update();
                
        $affectedRows = $this->db->affectedRows();
        $uid = $this->db->insertID();

        if ($affectedRows > 0) {
            $this
				->db
                ->table(TBL_USER_DETAILS)
				->set('status',2)
				->set('modified_dt',date('Y:m:d H:i:s'))
				->where('user_id', $uid)
                ->update();
            return true;
        } 
        return false;
    }

    public function updateUser($arrUser) {
        $this
			->db
            ->table(TBL_USER)
			->set($arrUser['arrUserBase'])
			->where('id',$arrUser['id'])
            ->update();

        if(!empty($arrUser['arrUserDetails'])) {
            $this
			->db
            ->table(TBL_USER_DETAILS)
			->set($arrUser['arrUserDetails'])
			->where('user_id',$arrUser['id'])
            ->update();
        }	
    }   
    
    public function resetPassword($arrUser) {
        $query = $this
                ->db
                ->table(TBL_USER)
                ->set('password',$arrUser['password'])
                ->where('username',$arrUser['username'])
                ->where('hash',$arrUser['hash'])
                ->update();

        if ($this->db->affectedRows() > 0) {
            return true;
        } else {
            return false;
        }
    }

    public function deleteUser($uid, $isAdmin) {
        //-----------------------------------
        // This code ensures that if a non-admin tries to delete the user, they can't proceed
        if ($isAdmin) {
            return $this->db->table(TBL_USER)->where('id', $uid)->delete();
        } 
        return false;
    }
}