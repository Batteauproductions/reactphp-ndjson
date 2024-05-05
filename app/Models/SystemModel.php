<?php

namespace App\Models;

use CodeIgniter\Model;

class SystemModel extends Model
{

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getUserRoleOptions () {
		return $this
                ->db
                ->table(TBL_USER_ROLES)
                ->select('id, name, description')
                ->get()
                ->getResultObject();
	}
	
	public function getUserStatusOptions () {
		return $this
			    ->db
                ->table(TBL_USER_STATUS)
			    ->select('id, name, description')
                ->get()
                ->getResultObject();
	}

    public function getCharacterStatusOptions () {
		return $this
                ->db
                ->table(TBL_CHAR_STATUS)
                ->select('id, name, description')
                ->get()
                ->getResultObject();
	}
    
    public function getCharacterTypeOptions () {
		return $this
                ->db
                ->table(TBL_CHAR_TYPES)
                ->select('id, name, description')
                ->get()
                ->getResultObject();
	}

    
}