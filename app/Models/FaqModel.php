<?php

namespace App\Models;

use CodeIgniter\Model;

class FaqModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getAllFaq() 
    {		
        $query = $this
                    ->db
                    ->table(TBL_FAQ)
                    ->select('id, question, answer, created_dt')
                    ->orderBy('question','desc');

		return $query->get()->getResultObject();
	}

}