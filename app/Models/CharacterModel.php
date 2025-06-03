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
        // This code ensures that if a non-gamemaster tries to access the page,
        // they can't call up a character that isn't theirs.
        $query = $this->db->table(TBL_CHAR)
            ->select('id')
            ->where('id', $cid);
    
        // Check if the user is not a gamemaster, add a where clause to filter by user_id
        if (!$gamemaster) {
            $query->where('user_id', $uid);
        }
    
        // Execute the query and retrieve the result
        $result = $query->get()->getRow();
    
        // Make sure there is a result, otherwise return with nothing
        if (empty($result)) {
            return null;
        }
    
        //-----------------------------------
        // The following code will start building the character object
        $oCharacter = new \stdClass();
    
        // Query for character build
        $oCharacter->build = $this->db
            ->table(TBL_CHAR_BUILD . ' cb')
            ->select('cb.hp, cb.mana, cb.sanity, cb.gp, cb.str, cb.dex, cb.intel, cb.spend_xp, cb.max_xp, cb.currency, cb.base_kit', false)
            ->where('cb.char_id', $cid)
            ->get()
            ->getRowObject();
        
        // Query for character profession(s)
        $oCharacter->profession = $this->db
                        ->table(TBL_CHAR_PROF . ' cp')
                        ->select('cp.main_id, cp.sub_id, cp.rank, cp.created_dt, cp.modified_dt,
                            p.name, p.modifier, p.rank_1_cost, p.rank_2_cost, p.rank_3_cost, p.allow_multiple,
                            ps.name as sub_name', false)
                        ->join(TBL_PROF . ' p', 'cp.main_id = p.id')
                        ->join(TBL_PROF_SUB . ' ps', 'cp.sub_id = ps.id')
                        ->where('cp.char_id', $cid)
                        ->get()
                        ->getResultObject();
                        
        // Query for character items
        $oCharacter->item = $this->db
            ->table(TBL_CHAR_ITEMS . ' ci')
            ->select('ci.item_id, ci.name, ci.price, ci.amount', false)
            ->where('ci.char_id', $cid)
            ->get()
            ->getResultObject();
    
        return json_encode($oCharacter);
    }

    public function getCharacters($uid = null)
    {
        // Build the query
        $builder = $this->db->table('hero c');
        $builder->select([
            'c.id',
            'c.user_id',
            'c.name',
            'c.avatar',
            'c.created_dt',
            'c.modified_dt',
            'cr.main_id AS race_id',
            'GROUP_CONCAT(cp.main_id, \',\', cp.sub_id ORDER BY cp.main_id SEPARATOR \'|\') AS profession_info',
            'cs.id AS status_id',
            'cs.name AS status_name',
            'cs.description AS status_description',
            'ct.id AS type_id',
            'ct.name AS type_name',
            'ct.description AS type_description',
            'CONCAT(u.firstname, " ", u.lastname) AS user_name',
        ]);
        $builder->join('hero_status cs', 'c.status_id = cs.id');
        $builder->join('hero_race cr', 'c.id = cr.char_id');
        $builder->join('hero_professions cp', 'c.id = cp.char_id');
        $builder->join('hero_type ct', 'ct.id = c.type_id', 'left');
        $builder->join('user u', 'c.user_id = u.id');

        // Group By clause
        $builder->groupBy(['c.id', 'cr.main_id', 'cs.id', 'ct.id', 'u.id']);
        
        // Order By clause
        $builder->orderBy('c.name', 'ASC');

        // If $uid is provided, add a where clause to filter by user_id
        if ($uid !== null) {
            $query->where('c.user_id', $uid);
        }

        // Execute the query and get the result
        $query = $builder->get();
        
        return $query->getResultObject();
    }


    public function saveCharacter($arrData) {
        // Step 1 make sure all the data is correct
        if ($arrData['uid'] === null || $arrData['uid'] === null || $arrData['character'] === null) {
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
        // -- check if new based on fact if ID is parsed
        $isNew = $meta->id === null;       
        // Step 3a: Fill the Char table
        $charData = [
            'user_id'     => $user_id,
            'type_id'     => $meta->type,
            'status_id'   => $meta->status,
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
        if($profession) { $this->insertItems($profession, TBL_CHAR_PROF, $char_id, ['rank']); }
        // Step 3e: Insert data into the TBL_CHAR_SKILL table
        if($skill) { $this->insertItems($skill, TBL_CHAR_SKILL, $char_id, ['racial','rank','bonus']); }
        // Step 3f: Insert data into the TBL_CHAR_ITEMS table
        if($item) { $this->insertItems($item, TBL_CHAR_ITEMS, $char_id, ['bonus', 'bonus', 'amount']); }
        
        $returnData = [
            'id' => $char_id,
            'done' => true,
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
                'created_dt' => date('Y-m-d H:i:s'),
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