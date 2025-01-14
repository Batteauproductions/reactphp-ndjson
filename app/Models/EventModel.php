<?php

namespace App\Models;

use CodeIgniter\Model;

class EventModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getEvents() 
    {		
        $query = $this
                    ->db
                    ->table(TBL_EVENT)
                    ->select('id, title, name, description, story_date, oc_start_time, oc_end_time')
                    ->orderBy('oc_start_time','desc');

		return $query->get()->getResultObject();
	}
	
	public function getEvent($id) 
    {		
		return $this
                    ->db
                    ->table(TBL_EVENT)
                    ->select('id, title, name, description, story_date, oc_start_time, oc_end_time')	
                    ->orderBy('oc_start_time','desc')
                    ->where('id',$id) 
                    ->get()  
                    ->getRow();               
	}
	
	public function deleteEvent($id) 
    {
	    $this->db->table(TBL_EVENT)->where('id', $id)->delete();
	}
	
	public function submitEvent($arrData) 
    {
        $this->db->table(TBL_EVENT)->insert($arrData);
	}
	
	public function updateEvent($arrData,$id) 
    {	
		$this->db->table(TBL_EVENT)->where('id', $id)->update($arrData);
	}

}