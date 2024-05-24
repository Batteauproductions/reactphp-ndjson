<?php

namespace App\Models;

use CodeIgniter\Model;

class SkillModel extends Model
{

    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }
	
	/*START: LINKED TO THE SKILLS*/
	public function getSkills($admin=false) {		
		$query = $this
                ->db
                ->table(TBL_SKILL.' s')
                ->select('s.id, s.name, s.description, s.available, s.profession_link,s.modifier, s.skill_type, s.profession_link, s.profession_sublink, s.profession_rank, s.sl_only,
                            p.id as prof_id, p.name as prof_name,
                            sm.id as stat_id, sm.name as stat_name,
                            st.id as type_id, st.name as type_name')
                ->where('s.available', 1)
                ->join(TBL_PROF.' p','p.id = s.profession_link','left')
                ->join(TBL_STATMOD.' sm','sm.id = s.modifier','left')
                ->join(TBL_SKILL_TYPE.' st','st.id = s.skill_type','left')
                ->orderBy('s.name','asc')
                ->orderBy('s.profession_link','asc')
                ->orderBy('s.profession_sublink','asc')
                ->orderBy('s.profession_rank','asc');
            
        if ($admin) {
            $query->where('s.sl_only', 1);
        } else {
            $query->where('s.sl_only', null);
        }

		return $query->get()->getResultObject();
	}

    public function getSkillsByLink($skill_type = null, $arrProfessions = null, $admin = false)
    {
        // Start building the base query
        $query = $this
                ->db
                ->table(TBL_SKILL . ' s')
                ->select('s.id, s.name, s.description, s.available, s.modifier, s.skill_type, s.profession_link, s.profession_sublink, s.profession_rank, s.sl_only,
                            p.id as prof_id, p.name as prof_name,
                            sm.id as stat_id, sm.name as stat_name,
                            st.id as type_id, st.name as type_name')
                ->where('s.available', 1)
                ->whereIn('s.skill_type', $skill_type)
                ->join(TBL_PROF . ' p', 'p.id = s.profession_link', 'left')
                ->join(TBL_STATMOD . ' sm', 'sm.id = s.modifier', 'left')
                ->join(TBL_SKILL_TYPE . ' st', 'st.id = s.skill_type', 'left')
                ->orderBy('s.profession_link', 'asc')
                ->orderBy('s.name', 'asc')                
                ->orderBy('s.profession_sublink', 'asc')
                ->orderBy('s.profession_rank', 'asc');
    
        // Apply the initial where condition for profession link
        $query->groupStart()
              ->whereIn('s.profession_link', [null, 1]);
    
        // If arrProfessions is provided, add those conditions
        if ($arrProfessions !== null) {
            foreach ($arrProfessions as $key => $value) {
                $query->orGroupStart()
                      ->where('s.profession_link', $arrProfessions[$key]['main_id'])
                      ->where('s.profession_rank <=', $arrProfessions[$key]['rank'])
                      ->groupEnd();
            }
        }
    
        $query->groupEnd(); // End the initial profession link conditions group
    
        // Execute the query and get the results
        $result = $query->get()->getResultObject();
    
        // Optional: Retrieve and log the last executed query for debugging
        // $lastQuery = $this->db->getLastQuery();
        // log_message('info', 'Last executed query: ' . $lastQuery);
        // echo $lastQuery;
    
        return $result;
    }

	public function getSkillDetails($id) 
    {
        $arrData['details'] = $this->getSkillById($id);
		$arrData['subtype'] = $this->getSkillSubtype($id);
        $arrData['modifier'] = $this->getSkillModifer(explode('|',$arrData['details']->modifier));
        return $arrData;
    }
	
	public function getSkillById($id) 
    {		
		$query = $this
					->db
					->table(TBL_SKILL.' s')
					->select('s.id, s.name, s.description, s.advanced_description, s.disclaimer, s.requirements, s.loresheet, s.max_rank, s.max_purchase, s.rank_description, s.xp_cost,s.modifier,s.profession_link,s.profession_sublink,s.profession_rank,s.sl_only,
							p.id as prof_id, p.name as prof_name,
							sm.id as stat_id, sm.name as stat_name,
							st.id as type_id, st.name as type_name')								
					->join(TBL_PROF.' p','p.id = s.profession_link','left')
					->join(TBL_STATMOD.' sm','sm.id = s.modifier','left')
					->join(TBL_SKILL_TYPE.' st','st.id = s.skill_type','left')
					->where('s.id', $id)
					->orderBy('s.name','asc')		
					->get();

        return $query->getRow();	
	}	

	public function getSkillSubtype($id) 
    {
		$query = $this
			->db
            ->table(TBL_SKILL_SUB)
			->select('id, name, description')
			->where('parent_id', $id)
            ->get();
					
        return $query->getResultObject();
	}

	public function getSkillModifer($ids) 
    {
		$query = $this
			->db
            ->table(TBL_STATMOD)
			->select('id, name, description')
			->whereIn('id', $ids)
            ->get();
					
        return $query->getResultObject();
	}
	
}