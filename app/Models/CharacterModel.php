<?php

namespace App\Models;

use CodeIgniter\Model;

class CharacterModel extends Model
{
    
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getCharacterById($iID) {

    }

    public function getCharacters($uid = null)
    {
        $query = $this->db->table(TBL_CHAR . ' c')
                        ->select('c.id, c.user_id, c.name, c.avatar, c.created_dt, c.modified_dt,
                                cs.id as status_id, cs.name as status_name, cs.description as status_description,
                                ct.id as type_id, ct.name as type_name, ct.description as type_description,
                                CONCAT(u.firstname, " ", u.lastname) as user_name', false)
                        ->join(TBL_CHAR_STATUS . ' cs', 'c.status_id = cs.id')
                        ->join(TBL_CHAR_TYPES . ' ct', 'ct.id = c.type_id', 'left')
                        ->join(TBL_USER . ' u', 'c.user_id = u.id')
                        ->orderBy('c.name', 'asc');

        // If $uid is provided, add a where clause to filter by user_id
        if ($uid !== null) {
            $query->where('c.user_id', $uid);
        }

        return $query->get()->getResultObject();
    }

    public function updateCharacterById($arrData) 
    {

    }

}
