<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\ProfessionModel;
use App\Models\SkillModel;


class CharacterModel extends Model
{

    protected $db;
    protected $professionModel;
    protected $skillModel;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->professionModel = new ProfessionModel();
        $this->skillModel = new SkillModel(); 
    }

    public function getCharacterById($cid, $uid, $gamemaster) {
        //-----------------------------------
        // The following code will start building the character object
        $oCharacter = new \stdClass();

        //-----------------------------------
        // This code ensures that if a non-gamemaster tries to access the page,
        // they can't call up a character that isn't theirs.
        $query = $this->db->table(TBL_CHAR.' c')
            ->select('c.id, 
                    c.type_id as type, 
                    c.status_id as status, 
                    c.chronicle_id as chronicle, 
                    c.avatar, 
                    c.name, 
                    c.background, 
                    c.created_dt, 
                    c.modified_dt, 
                    c.firstlocked_dt, 
                    c.lastlocked_dt,
                    ct.name as type_name,
                    cs.name as status_name,
                    cs.code as status_code,
                    CONCAT(u.firstname, " ", u.lastname) AS user_name')
            ->join(TBL_USER.' u', 'c.user_id = u.id', 'left')
            ->join(TBL_CHAR_TYPES . ' ct', 'ct.id = type_id')
            ->join(TBL_CHAR_STATUS . ' cs', 'cs.id = status_id')
            ->where('c.id', $cid);
    
        // Check if the user is not a gamemaster, add a where clause to filter by user_id
        if (!$gamemaster) {
            $query->where('c.user_id', $uid);
        }
        // Execute the query and retrieve the result
        $oCharacter->meta = $query->get()->getRow();
    
        // Make sure there is a result, otherwise return with nothing
        if (empty($oCharacter->meta)) {
            return null;
        }

        // Query for character build
        $oCharacter->build = $this->db
            ->table(TBL_CHAR_BUILD . ' cb')
            ->select('
                    cb.char_id,        
                    cb.hp, 
                    cb.mana, 
                    cb.sanity, 
                    cb.gp, 
                    cb.str, 
                    cb.dex, 
                    cb.intel, 
                    cb.spend_xp, 
                    cb.max_xp, 
                    cb.currency, 
                    cb.favour,
                    cb.base_kit,
                    e.description as base_kit_description', false)
            ->join(TBL_EQUIPMENT . ' e', 'e.id = cb.base_kit', 'left')
            ->where('cb.char_id', $cid)
            ->get()
            ->getRowObject();

         // Query for character race
        $oCharacter->race = $this->db->table(TBL_CHAR_RACE . ' r')
                        ->select('r.main_id as id, r.modifier, r.created_dt, r.modified_dt,
                            cr.name', false)
                        ->join(TBL_RACE . ' cr', 'r.main_id = cr.id')
                        ->where('r.char_id', $cid)
                        ->get()
                        ->getRow();

        // Query for character profession(s)
        $oCharacter->profession = $this->db
                        ->table(TBL_CHAR_PROF . ' cp')
                        ->select('cp.main_id, 
                                cp.sub_id, 
                                cp.rank, 
                                cp.rank_locked,
                                cp.created_dt, 
                                cp.modified_dt,
                                p.name, 
                                p.modifier, 
                                p.cost, 
                                p.allow_multiple,
                                ps.name as sub_name', false)
                        ->join(TBL_PROF . ' p', 'cp.main_id = p.id')
                        ->join(TBL_PROF_SUB . ' ps', 'cp.sub_id = ps.id','left')
                        ->where('cp.char_id', $cid)
                        ->get()
                        ->getResultObject();
        
        // Query for character skill(s)
        $oCharacter->skill = $this->skillModel->getSkills(true, $cid);
         
        // Query for character items
        $oCharacter->item = $this->db
                        ->table(TBL_CHAR_ITEMS.' ci')
                        ->select('ci.main_id, 
                                ci.sub_id, 
                                ci.bonus, 
                                ci.amount,
                                i.cost,
                                i.name,
                                it.name as sub_name', false)
                        ->join(TBL_ITEM. ' i', 'ci.main_id = i.id','left')
                        ->join(TBL_ITEM_TYPE . ' it', 'ci.sub_id = it.id','left')
                        ->where('ci.char_id', $cid)
                        ->get()
                        ->getResultObject();

        // Query for character items
        $oCharacter->stories = $this->db
            ->table(TBL_CHAR_STORIES . ' cs')
            ->select('cs.event_id, 
                    cs.question_1, 
                    cs.question_2, 
                    cs.question_3, 
                    cs.question_4, 
                    cs.question_5, 
                    cs.question_6, 
                    cs.created_dt, 
                    cs.modified_dt', false)
            ->where('cs.char_id', $cid)
            ->get()
            ->getResultObject();

        // Query for character notes
        $oCharacter->notes = $this->db
            ->table(TBL_CHAR_COMMENTS . ' cc')
            ->select('cc.char_id, 
                    cc.mail_note, 
                    cc.player_notes, 
                    cc.sl_notes, 
                    cc.sl_private_notes', false)
            ->where('cc.char_id', $cid)
            ->get()
            ->getResultObject();

        return $oCharacter;
    }

    public function deleteCharacter($cid, $uid, $gamemaster) {
        //-----------------------------------
        // This code ensures that if a non-gamemaster tries to access the page,
        // they can't delete up a character that isn't theirs.
        $query = $this->db->table(TBL_CHAR)
                 ->where('id', $cid);
                 
        // Check if the user is not a gamemaster, add a where clause to filter by user_id
        if (!$gamemaster) {
            $query->where('user_id', $uid);
        }
        // Execute the query and retrieve the result
        return $query->delete();
    }

    public function getCharacters($params = [])
    {
        // Build the query
        $builder = $this->db->table(TBL_CHAR.' c');
        $builder->select('c.id,
                    c.user_id,
                    c.name,
                    c.avatar,
                    c.created_dt,
                    c.modified_dt,
                    ct.id AS type_id,
                    ct.name AS type_name,
                    ct.description AS type_description,
                    cs.id AS status_id,
                    cs.name AS status_name,
                    cs.code as status_code,
                    cs.description AS status_description,
                    CONCAT(u.firstname, " ", u.lastname) AS user_name', false)
        ->join(TBL_USER.' u', 'c.user_id = u.id', 'left')
        ->join(TBL_CHAR_TYPES.' ct', 'ct.id = c.type_id', 'left')
        ->join(TBL_CHAR_STATUS.' cs', 'c.status_id = cs.id', 'left');

        // If $uid is provided, add a where clause to filter by user_id
        if (!empty($params['cid'])) {
            $builder->where('c.id', $params['cid']);
        }

        if (!empty($params['uid'])) {
            $builder->where('c.user_id', $params['uid']);
        }

        if (!empty($params['type_id'])) {
            $builder->where('ct.id', $params['type_id']);
        }

        if (!empty($params['status_id'])) {
            $builder->where('cs.id', $params['status_id']);
        }

        if (!empty($params['race_id'])) {
            $builder->join(TBL_CHAR_RACE.' cr', 'c.id = cr.char_id', 'left')
                    ->where('cr.main_id', $params['race_id']);
        }

        if (!empty($params['prof_id'])) {
            $builder->join(TBL_CHAR_PROF.' cp', 'c.id = cp.char_id', 'left')
                    ->where('cp.main_id', $params['prof_id']);
        }

        if (!empty($params['skill_id'])) {
            $builder->join(TBL_CHAR_SKILL.' csk', 'c.id = csk.char_id', 'left')
                    ->where('csk.main_id', $params['skill_id']);
        }

        // Order By clause
        $builder->orderBy('c.name', 'ASC');

        // Execute the query and get the result
        $query = $builder->get();

         //echo $this->db->getLastQuery();

        return $query->getResultObject();
    }

    public function reviewCharacter($arrData)
    {
        // Step 1: Update basic character info in the main character table
        $charData = [
            'status_id'      => $arrData['status_id'],
        ];

        // Step 2: Only lock the ranks if status is 5 (locked)
        if($arrData['status_id'] == 5) {
            $charData['firstlocked_dt'] = empty($arrData['firstlocked_dt']) ? date('Y-m-d H:i:s') : $arrData['firstlocked_dt'];
            $charData['lastlocked_dt']  = date('Y-m-d H:i:s');
            // Step A: For all related data profession records, set lock_rank equal to rank
            $sql = "UPDATE " . TBL_CHAR_PROF . " SET rank_locked = rank WHERE char_id = ?";
            $this->db->query($sql, [$arrData['cid']]);
            // Step B: For all related data skill records, set lock_rank equal to rank
            $sql = "UPDATE " . TBL_CHAR_SKILL . " SET rank_locked = rank WHERE char_id = ?";
            $this->db->query($sql, [$arrData['cid']]);
        }
        // Step 3: Set the status for the character
        $this->db->table(TBL_CHAR)
                ->where('id', $arrData['cid'])
                ->update($charData);

        // Step 4: Set the mailnote for the user
        $this->db->table(TBL_CHAR_COMMENTS)
                ->where('id', $arrData['cid'])
                ->update( ['mail_note' => $arrData['status_id'] ]);
        
        $query = $this->db->table(TBL_CHAR.' c')
                    ->select('c.name as char_name,
                            u.email,
                            CONCAT(u.firstname, " ", u.lastname) AS player_name')
                    ->join(TBL_USER.' u', 'c.user_id = u.id', 'left')
                    ->where('c.id', $arrData['cid'])
                    ->get()
                    ->getResultArray();

        return $query[0];
    }

    public function saveCharacter($arrData,$status=null) {
        // Step 1 make sure all the data is correct
        if ($arrData['uid'] === null || $arrData['character'] === null) {
            return false;
        }
        // Step 2 setup "global" variables to be used in the statements below
        $now = date('Y-m-d H:i:s');        
        $user_id = $arrData['uid'];
        // -- turn into object
        $arrCharJSON = json_decode($arrData['character']);
        // -- cache elements for easier access        
        $meta = $arrCharJSON->meta;
        $build = $arrCharJSON->build; 
        $race = $arrCharJSON->race;
        $profession = $arrCharJSON->profession;
        $skill = $arrCharJSON->skill;  
        $item = $arrCharJSON->item; 
        $notes = $arrCharJSON->notes; 
        // -- check if new based on fact if ID is parsed
        $isNew = $meta->id === null;       
        // Step 3a: Fill the Char table
        $charData = [
            'user_id'     => $user_id,
            'type_id'     => $meta->type,
            'status_id'   => $status === null ? $meta->status : $status,
            'chronicle_id'=> CHRONICLE_ID,
            'avatar'      => $meta->avatar ?? null,
            'name'        => $meta->name,
            'background'  => $meta->background ?? null,
            $isNew ? 'created_dt' : 'modified_dt' => $now
        ];
        if ($isNew) {
            $this->db->table(TBL_CHAR)->insert($charData);
            $char_id = $this->db->insertID();
        } else {
            $char_id = $meta->id;
            $this->db->table(TBL_CHAR)
                ->where('id', $char_id)
                ->where('user_id', $user_id)
                ->update($charData);
        }
        // Step 3b: Fill the Char-build table   
        $buildData = [
            'char_id'   => $char_id,
            'hp'        => $build->hp,
            'mana'      => $build->mana,
            'sanity'    => $build->sanity,
            'favour'    => $build->favour,
            'gp'        => $build->gp,
            'str'       => $build->str,
            'dex'       => $build->dex,
            'intel'     => $build->intel,
            'spend_xp'  => $build->spend_xp,
            'max_xp'    => $build->max_xp,
            'currency'  => $build->currency,
            'base_kit'  => $build->base_kit,
            $isNew ? 'created_dt' : 'modified_dt' => $now,
        ];
        if ($isNew) {
            $this->db->table(TBL_CHAR_BUILD)->insert($buildData);
        } else {
            $this->db->table(TBL_CHAR_BUILD)
                ->where('char_id', $char_id)
                ->update($buildData);
        }        
        // Step 3c: Insert data into the hero_race table
        if($race) {
            $charRace = [
                'char_id'   => $char_id,
                'main_id'   => $race->id,
                'modifier'  => $race->modifier,
                $isNew ? 'created_dt' : 'modified_dt' => $now,
            ];
            if ($isNew) {
                $this->db->table(TBL_CHAR_RACE)->insert($charRace);
            } else {
                $this->db->table(TBL_CHAR_RACE)
                    ->where('char_id', $char_id)
                    ->update($charRace);
            }
        }
        // Step 3d: Insert data into the TBL_CHAR_PROF table
        if($profession) { $this->insertItems($profession, TBL_CHAR_PROF, $char_id, ['rank','rank_locked']); }
        // Step 3e: Insert data into the TBL_CHAR_SKILL table
        if($skill) { $this->insertItems($skill, TBL_CHAR_SKILL, $char_id, ['racial','rank','rank_locked','bonus']); }
        // Step 3f: Insert data into the TBL_CHAR_ITEMS table
        if($item) { $this->insertItems($item, TBL_CHAR_ITEMS, $char_id, ['bonus','amount']); }
        // Step 3g: Insert (or Update) the notes in TBL_CHAR_COMMENTS
        $charNote = [
            'char_id' => $char_id,
            'player_notes' => null,
            'sl_notes' => null,
            'sl_private_notes' => null,
        ];
        foreach ($notes as $note) {
            $charNote[$note->type] = $note->text;
        }
        if ($isNew) {
            $this->db->table(TBL_CHAR_COMMENTS)->insert($charNote);
        } else {
            $this->db->table(TBL_CHAR_COMMENTS)
                ->where('char_id', $char_id)
                ->update($charNote);
        }

        $returnData = [
            'id' => $char_id,
            'done' => true,
            'cname' => $meta->name,
        ];

        return $returnData;
    }
    
    private function insertItems($items, $table, $char_id, $fields)
    {
        $arrData = [];

        foreach ($items as $item) {
            $itemData = [
                'char_id'    => $char_id,
                'main_id'    => $item->id,
                // Ensure sub_id is always present (can be null)
                'sub_id'     => property_exists($item, 'sub_id') && $item->sub_id !== '' ? $item->sub_id : null,
            ];

            // Add optional data fields
            foreach ($fields as $field) {
                if (property_exists($item, $field)) {
                    $itemData[$field] = $item->$field !== '' ? $item->$field : null;
                }
            }

            $arrData[] = $itemData;
        }

        // Perform upsert using database's unique index for conflict detection
        $this->db->table($table)->upsertBatch($arrData);
    }


}