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
        // Decode the JSON string from the 'character' key
        $characterData = json_decode($arrData['character'], true);

        if ($characterData === null) {
            // Handle JSON decode error
            return false;
        }

        // Step 1: Insert data into the hero table
        $heroData = [
            'user_id' => $arrData['uid'],
            'type_id' => $characterData['meta']['type'],
            'status_id' => $characterData['meta']['status'],
            'avatar' => isset($characterData['meta']['avatar']) ? $characterData['meta']['avatar'] : null,
            'name' => $characterData['meta']['name'],
            'background' => $characterData['meta']['background'],
            'created_dt' => $characterData['meta']['created_dt'],
            'modified_dt' => null,
            'firstlocked_dt' => null,
            'lastlocked_dt' => null
        ];

        
        $this->db->table(TBL_CHAR)->insert($heroData);
        
        // Optional: Retrieve and log the last executed query for debugging
        $char_id = $this->db->insertID();

        // Step 2: Insert data into the hero_build table
        $buildData = [
            'char_id' => $char_id,
            'hp' => $characterData['build']['hp'],
            'mana' => $characterData['build']['mana'],
            'sanity' => $characterData['build']['sanity'],
            //'favor' => $characterData['build']['favor'],
            'gp' => $characterData['build']['gp'],
            'str' => $characterData['build']['str'],
            'dex' => $characterData['build']['dex'],
            'intel' => $characterData['build']['intel'],
            'spend_xp' => $characterData['build']['spend_xp'],
            'max_xp' => $characterData['build']['max_xp'],
            'currency' => $characterData['build']['currency'],
            'base_kit' => $characterData['build']['base_kit']            
        ];

        $this->db->table(TBL_CHAR_BUILD)->insert($buildData);

        // Step 3: Insert data into the hero_race table
        $this->insertItems($characterData['race'], TBL_CHAR_RACE, $char_id);

        // Step 4: Insert data into the hero_profession table
        $this->insertItems($characterData['profession'], TBL_CHAR_PROF, $char_id);

        // Step 5: Insert data into the hero_skills table
        $this->insertItems($characterData['skills'], TBL_CHAR_SKILL, $char_id);

        // Step 6: Insert data into the hero_items table
        $this->insertItems($characterData['items'], TBL_CHAR_ITEMS, $char_id);

        return true;

    }

    private function insertItems($items, $table, $char_id) {
        foreach ($items as $item) {
            $itemData = [
                'char_id' => $char_id,
                'main_id' => $item['main_id'],                
                'created_dt' => date('Y-m-d H:i:s'),          
            ];

            //races have chosen modifiers
            if (isset($item['modifier'])) {
                $itemData['modifier'] = $item['modifier'][0]['id'];
            }

            //professions and skills have sub_id's and ranks
            if (isset($item['sub_id'])) {
                $itemData['sub_id'] = $item['sub_id'];
                $itemData['rank'] = isset($item['rank']) ? $item['rank'] : null;
            }

            //skills might be regarded as bonus or racial
            if (isset($item['sub_id'])) {
                $itemData['racial'] = $item['racial'];
                $itemData['bonus'] = $item['bonus'];
            }
             
            //items may have an amount attached to them           
            if (isset($item['amount'])) {
                $itemData['amount'] = $item['amount'];
            }

            $this->db->table($table)->insert($itemData);
            
        }
    }

    public function updateCharacterById($arrData) 
    {

    }

}
