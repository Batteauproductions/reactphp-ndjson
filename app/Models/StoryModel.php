<?php

namespace App\Models;

use CodeIgniter\Model;

class StoryModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getStoryById($char_id,$post_id) 
    {		
        $query = $this
                    ->db
                    ->table(TBL_CHAR_STORIES)
                    ->select('id, question_1, question_2, question_3, question_4, question_5, question_6, created_dt, modified_dt')
                    ->where('char_id',$char_id)
                    ->where('event_id',$post_id)
                    ->get();

        return $query->getRow();
	}

    public function updateStoryById($arrData) 
    {		
        $query = $this
                    ->db
                    ->table(TBL_CHAR_STORIES)
                    ->select('id, question_1, question_2, question_3, question_4, question_5, question_6, created_dt, modified_dt')
                    ->where('id',$id)
                    ->get();

        return $query->getRow();
	}

}