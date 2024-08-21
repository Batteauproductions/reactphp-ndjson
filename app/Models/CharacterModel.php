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
                        ->select('c.id, c.user_id, c.name, c.avatar, c.race_id, c.created_dt, c.modified_dt,
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
                print_r($item['modifier']);
                exit;
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
