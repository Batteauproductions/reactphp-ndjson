<?php

namespace App\Models;

use CodeIgniter\Model;

class ItemModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getBasicKit() 
    {
		$query =  $this
                ->db
                ->table(TBL_RACE)
                ->select('id, name, available')
                ->where('available', 1)
                ->orderBy('id','asc')
                ->get();

        return $query->getResultObject();
	}

}