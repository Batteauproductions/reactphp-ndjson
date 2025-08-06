<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\ModifierModel;

class ProfessionModel extends Model
{
    
    protected $db;
    protected $modifierModel; 
    protected $profession_columns = 'p.id, p.name, p.description, p.avatar, p.modifier, p.skill_bonus, p.cost, p.asset_value_max, p.allow_multiple, p.rule_page, p.available, p.sl_only';

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->modifierModel = new ModifierModel(); 
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
                            cp.asset_value, 
                            cp.asset_value_locked,
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

    public function getProfessionDetails($id,$gamemaster=false) 
    {
        $arrData['details'] = $this->getProfessionById($id,$gamemaster);
        $arrData['subtype'] = $this->getProfessionSubtype($id,$gamemaster);
        $arrData['modifier'] = $this->modifierModel->getModifiers(explode('|',$arrData['details']->modifier));        
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

    public function removeProfession($arrData)
    {
        $builder = $this->db->table(TBL_CHAR_PROF);

        // Add mandatory WHERE conditions
        $builder->where('char_id', $arrData->cid);
        $builder->where('main_id', $arrData->sm_id);

        // Handle sub_id explicitly: if null, use IS NULL, otherwise use normal equality
        if ($arrData->su_id == '') {
            // Raw where for IS NULL condition, third param false to avoid escaping
            $builder->where('sub_id IS NULL', null, false);
        } else {
            $builder->where('sub_id', $arrData->su_id);
        }

        // Execute the delete query
        return $builder->delete();
    }

}