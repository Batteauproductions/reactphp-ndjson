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
                ->table(TBL_EQUIPMENT)
                ->select('id, name')
                ->where('available', 1)
                ->orderBy('id','asc')
                ->get();

        return $query->getResultObject();
	}

    public function getBasicKitDetails($id) 
    {
        $arrData['details'] = $this->getBasicKitById($id);
		//$arrData['subtype'] = $this->getSkillSubtype($id);
        //$arrData['modifier'] = $this->getSkillModifer(explode('|',$arrData['details']->modifier));
        return $arrData;
    }
	
	public function getBasicKitById($id) 
    {	
        $query =  $this
                ->db
                ->table(TBL_EQUIPMENT)
                ->select('id, name, description')
                ->where('id', $id)
                ->get();

        return $query->getRow();	
	}


    public function getItems() 
    {
		$query =  $this
                ->db
                ->table(TBL_ITEM.' i')
                ->select('i.id, 
                        i.type_id,                         
                        i.level, 
                        i.name, 
                        i.description, 
                        i.gatherable, 
                        i.cost,
                        it.name as type_name')
                ->join(TBL_ITEM_TYPE.' it','it.id = i.type_id','left')
                ->where('i.available', 1)
                ->orderBy('i.type_id','asc')
                ->orderBy('i.name','asc')			
                ->orderBy('i.level','asc')
                ->get();

        return $query->getResultObject();
	}

    public function getItemDetails($id) 
    {
        $arrData['details'] = $this->getItemById($id);
        $arrData['subtype'] = array();
        $arrData['modifier'] = array();
        return $arrData;
    }

    public function getItemById($id) 
    {		
        $query = $this
                    ->db
                    ->table(TBL_ITEM.' i')
                    ->select('i.id, 
                            i.type_id, 
                            i.level, 
                            i.name, 
                            i.description, 
                            i.gatherable, 
                            i.cost_low, 
                            i.cost, 
                            i.cost_high,
                            it.name as type_name')
                    ->join(TBL_ITEM_TYPE.' it','it.id = i.type_id','left')
                    ->where('i.id',$id)
                    ->get();

        return $query->getRow();
	}

    public function removeItem($arrData)
    {
        $builder = $this->db->table(TBL_CHAR_ITEM);

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