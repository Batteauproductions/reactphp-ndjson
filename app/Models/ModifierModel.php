<?php

namespace App\Models;

use CodeIgniter\Model;

class ModifierModel extends Model
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getModifiers($ids) 
    {
        $query = $this
            ->db
            ->table(TBL_STATMOD)
            ->select('id, name, description, code')
            ->whereIn('id', $ids)
            ->get();
                    
        return $query->getResultObject();
    }
}
