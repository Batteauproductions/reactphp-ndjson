<?php

namespace App\Models;

use CodeIgniter\Model;

class ProfessionModel extends Model
{
    
    protected $db;
    protected $profession_columns = 'p.id, p.name, p.description, p.avatar, p.modifier, p.skill_bonus, p.cost, p.max_rank, p.allow_multiple, p.rule_page, p.available, p.sl_only';

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
    
    public function getProfessions($gamemaster = false, $cid = null) {
        $builder = $this
                ->db
                ->table(TBL_PROF.' p')
                ->select($this->profession_columns)
                ->where('p.available', 1)
                ->orderBy('p.name','asc');

        if (!$gamemaster && $cid === null ) {
            $builder->where('p.sl_only', '0');
        }

        if ($cid !== null) {
            $builder->select('cp.main_id, 
                            cp.sub_id, 
                            cp.rank, 
                            cp.rank_locked,
                            cp.created_dt, 
                            cp.modified_dt,
                            ps.name as sub_name')
                ->join(TBL_CHAR_PROF. ' cp', 'cp.main_id = p.id', 'left')
                ->join(TBL_PROF_SUB. ' ps', 'cp.sub_id = ps.id','left')
                ->where('cp.char_id', $cid);
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
                    ->select($this->profession_columns)
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
            ->select('id, 
                    name, 
                    description,
                    avatar')
            ->where('parent_id', $id)
            ->orderBy('name','asc');

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