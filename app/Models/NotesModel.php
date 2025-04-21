<?php

namespace App\Models;

use CodeIgniter\Model;

class NotesModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getNotes($char_id) 
    {
		$query = $this
                    ->db
                    ->table(TBL_CHAR_COMMENTS.' n')
                    ->select('n.id, n.personal_note, n.public_note, n.private_note')
                    ->where('n.char_id',$char_id);
                
        return $query->get()->getResultObject();
    }

    public function UpdateNote() 
    {

    }

    
}