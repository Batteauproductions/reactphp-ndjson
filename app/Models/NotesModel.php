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

    public function getNotes($char_id,$isGamemaster=false) 
    {
		$query = $this
                    ->db
                    ->table(TBL_CHAR_COMMENTS.' n');
        if($isGamemaster) {
            $query->select('n.id, n.mail_note, n.player_notes, n.sl_notes, n.sl_private_notes');
        } else {
            $query->select('n.id, n.player_notes, n.sl_notes, n.sl_private_notes');
        }
                       
        $query->where('n.char_id',$char_id);
                
        return $query->get()->getResultObject();
    }
   
}