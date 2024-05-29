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
                ->table(TBL_ITEMS.' i')
                ->select('i.id, i.type_id, it.name as type_name, i.level, i.name, i.description, i.gatherable, i.price')
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
                    ->table(TBL_ITEMS)
                    ->select('id, type_id, level, name, description, gatherable, price_low, price, price_high')
                    ->where('id',$id)
                    ->where('available', 1)
                    ->get();

        return $query->getRow();
	}

}