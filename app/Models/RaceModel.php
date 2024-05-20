<?php

namespace App\Models;

use CodeIgniter\Model;

class RaceModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getRaces() 
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

    public function getRaceDetails($id) 
    {
        $arrData['details'] = $this->getRaceById($id);
            //$arrData['skills'] = $this->getRaceSkills(explode('|',$arrData['details']->skills));
        $arrData['modifier'] = $this->getRaceModifer(explode('|',$arrData['details']->modifier));
        return $arrData;
    }

    public function getRaceById($id) 
    {		
        $query = $this
                    ->db
                    ->table(TBL_RACE.' r')
                    ->select('r.id, r.name, r.description, r.bonus, r.rule_page, r.skills, r.modifier')
                    ->where('r.id',$id)
                    ->get();

        return $query->getRow();
	}
	
	public function getRaceSkills($ids) 
    {
        $query = $this
            ->db
            ->table(TBL_SKILL)
            ->select('id, name, description')
            ->whereIn('id', $ids)
            ->get();
    
        return $query->getResultObject();
    }
	
	public function getRaceModifer($ids) 
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