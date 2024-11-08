<?php

namespace App\Models;

use CodeIgniter\Model;

class ProfessionModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    public function getProfessions($admin=false) {
        $query = $this
                ->db
                ->table(TBL_PROF)
                ->select('id, name, description, available')
                ->where('available', 1);
        
        if(!$admin) {
            $query->where('sl_only',null);
        }

        return $query->get()->getResultObject();
    }

    public function getProfessionDetails($id,$sub_id) 
    {
        $arrData['details'] = $this->getProfessionById($id);
        $arrData['subtype'] = $this->getProfessionSubtype($id);
        $arrData['modifier'] = $this->getProfessionModifer(explode('|',$arrData['details']->modifier));        
        return $arrData;
    }

    public function getProfessionById($id) 
    {		
        $query = $this
                    ->db
                    ->table(TBL_PROF.' p')
                    ->select('p.id, p.name, p.description, p.modifier, p.rank_1_cost, p.rank_2_cost, p.rank_3_cost, p.allow_multiple, p.rule_page')
                    ->where('p.id',$id)
                    ->get();

        return $query->getRow();
	}
	
    public function getProfessionSubtype($id) 
    {
		$query = $this
			->db
            ->table(TBL_PROF_SUB)
			->select('id, name, description')
			->where('parent_id', $id)
            ->get();
					
        return $query->getResultObject();
	}

	public function getProfessionModifer($ids) 
    {
		$query = $this
			->db
            ->table(TBL_STATMOD)
			->select('id, name, description')
			->whereIn('id', $ids)
            ->get();
					
        return $query->getResultObject();
	}

}