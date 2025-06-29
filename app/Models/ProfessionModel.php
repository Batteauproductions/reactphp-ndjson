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
    
    public function getProfessions($gamemaster=false) {
        $builder = $this
                ->db
                ->table(TBL_PROF)
                ->select('id, 
                        name, 
                        description, 
                        available')
                ->where('available', 1);

        if (!$gamemaster) {
            $builder->where('sl_only', '0');
        }

        $query = $builder->get();

        return $query->getResultObject();
    }

    public function getProfessionDetails($id,$sub_id,$gamemaster=false) 
    {
        $arrData['details'] = $this->getProfessionById($id,$gamemaster);
        $arrData['subtype'] = $this->getProfessionSubtype($id,$gamemaster);
        $arrData['modifier'] = $this->getProfessionModifer(explode('|',$arrData['details']->modifier));        
        return $arrData;
    }

    public function getProfessionById($id,$gamemaster=false) 
    {		
        $builder = $this
                    ->db
                    ->table(TBL_PROF.' p')
                    ->select('p.id, 
                            p.name, 
                            p.description,
                            p.modifier, 
                            p.skill_bonus,
                            p.cost,
                            p.max_purchase,
                            p.rule_page,
                            p.available,
                            p.sl_only')
                    ->where('p.id',$id);
        if (!$gamemaster) {
            $builder->where('sl_only', '0');
        }
        $query = $builder->get();

        return $query->getRow();
	}
	
    public function getProfessionSubtype($id,$gamemaster=false) 
    {
        $builder = $this
            ->db
            ->table(TBL_PROF_SUB)
            ->select('id, name, description')
            ->where('parent_id', $id);

        if (!$gamemaster) {
            $builder->where('sl_only', '0');
        }

        $query = $builder->get();
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