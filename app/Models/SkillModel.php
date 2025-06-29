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
	public function getSkills($gamemaster=false) {		
		$query = $this
                ->db
                ->table(TBL_SKILL.' s')
                ->select('s.id, 
                        s.name,
                        s.description,
                        s.requirements,
                        s.disclaimer,
                        s.cost,
                        s.max_rank,
                        s.max_purchase,
                        s.skill_type,
                        s.profession_link,
                        s.profession_sublink,
                        s.profession_rank,
                        s.sl_only,
                        s.multiplier,
                        s.modifier,
                        s.loresheet,
                        s.ingame_call,
                        s.power,
                        s.time,
                        s.atk_range,
                        p.id as prof_id, p.name as prof_name,
                        sm.id as stat_id, sm.name as stat_name,
                        st.id as type_id, st.name as type_name')
                ->join(TBL_PROF.' p','p.id = s.profession_link','left')
                ->join(TBL_STATMOD.' sm','sm.id = s.modifier','left')
                ->join(TBL_SKILL_TYPE.' st','st.id = s.skill_type','left')
                ->orderBy('s.name','asc')
                ->orderBy('s.profession_link','asc')
                ->orderBy('s.profession_sublink','asc')
                ->orderBy('s.profession_rank','asc');
            
        if (!$gamemaster) {
            $query->where('s.sl_only', null)
                ->where('s.available', 1);
        } 

		return $query->get()->getResultObject();
	}

    public function getSkillsByLink($skill_type = null, $arrProfessions = null, $admin = false)
    {
        // Start building the base query
        $query = $this
                ->db
                ->table(TBL_SKILL . ' s')
                ->select('s.id, 
                        s.name,
                        s.description,
                        s.requirements,
                        s.disclaimer,
                        s.cost,
                        s.max_rank,
                        s.max_purchase,
                        s.skill_type,
                        s.profession_link,
                        s.profession_sublink,
                        s.profession_rank,
                        s.sl_only,
                        s.multiplier,
                        s.modifier,
                        s.loresheet,
                        s.ingame_call,
                        s.power,
                        s.time,
                        s.atk_range,
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
                    ->where('s.profession_link', intval($arrProfessions[$key]['id']))
                    ->where('s.profession_sublink', intval($arrProfessions[$key]['sub_id']))
                    ->where('s.profession_rank <=', intval($arrProfessions[$key]['rank']))          
                    ->groupEnd();
                //for skills with a rank in the profession, but no sublink
                $query->orGroupStart()                    
                    ->where('s.profession_link', intval($arrProfessions[$key]['id']))
                    ->where('s.profession_sublink', null)
                    ->where('s.profession_rank <=', intval($arrProfessions[$key]['rank']))
                    ->groupEnd();
                //for skills with no rank in the profession
                $query->orGroupStart()                    
                    ->where('s.profession_link', intval($arrProfessions[$key]['id']))
                    ->where('s.profession_rank', null)
                    ->groupEnd();
            }
        }
    
        $query->groupEnd(); // End the initial profession link conditions group
    
        // Execute the query and get the results
        $result = $query->get()->getResultObject();
    
        // Optional: Retrieve and log the last executed query for debugging
         $lastQuery = $this->db->getLastQuery();
        // log_message('info', 'Last executed query: ' . $lastQuery);
        //echo $lastQuery;
        //exit;
        return $result;
    }

	public function getSkillDetails($id) 
    {
        $arrData['details'] = $this->getSkillById($id);
		$arrData['subtype'] = $this->getSkillSubtypeByParent($id);
        $arrData['modifier'] = $this->getSkillModifer(explode('|',$arrData['details']->modifier));
        return $arrData;
    }
	
	public function getSkillById($id) 
    {
        $query = $this
                    ->db
                    ->table(TBL_SKILL . ' s')
                    ->select('s.id, 
                            s.name,
                            s.description,
                            s.requirements,
                            s.disclaimer,
                            s.cost,
                            s.max_rank,
                            s.max_purchase,
                            s.skill_type,
                            s.profession_link,
                            s.profession_sublink,
                            s.profession_rank,
                            s.sl_only,
                            s.multiplier,
                            s.modifier,
                            s.loresheet,
                            s.ingame_call,
                            s.power,
                            s.time,
                            s.atk_range,
                            p.id as prof_id, p.name as prof_name,
                            sm.id as stat_id, sm.name as stat_name,
                            st.id as type_id, st.name as type_name')
                    ->join(TBL_PROF . ' p', 'p.id = s.profession_link', 'left')
                    ->join(TBL_STATMOD . ' sm', 'sm.id = s.modifier', 'left')
                    ->join(TBL_SKILL_TYPE . ' st', 'st.id = s.skill_type', 'left')
                    ->where('s.id', $id)
                    ->orderBy('s.name', 'asc')
                    ->get();

        $result = $query->getRow();
        
        if ($result) {
            $result->requirement_name = $this->getRequirementNames($result->requirements);
        } else {
            // Debugging statement to check if result is empty
            log_message('debug', 'No skill found with ID: ' . $id);
        }
        
        return $result;
    }

    private function getRequirementNames($requirements)
    {
        if (!$requirements) {
            return '';
        }

        $requirementParts = explode('|', $requirements);
        $requirementNames = [];
        
        foreach ($requirementParts as $part) {
            $partDetails = explode(',', $part);

            // Extract skill ID and rank (if available)
            $skillId = $partDetails[0];
            $rank = isset($partDetails[1]) ? ' Rank ' . $partDetails[1] : '';

            // Query skill name
            $skillQuery = $this
                        ->db
                        ->table(TBL_SKILL)
                        ->select('name')
                        ->where('id', $skillId)
                        ->get();
            
            $skill = $skillQuery->getRow();
            
            if ($skill) {
                $requirementNames[] = $skill->name . $rank;
            } else {
                // Debugging statement to check if skill is found
                log_message('debug', 'No skill found with ID: ' . $skillId);
            }
        }
        
        return implode(' | ', $requirementNames);
    }

	public function getSkillSubtypeByParent($id) 
    {
		$query = $this
			->db
            ->table(TBL_SKILL_SUB)
			->select('id, name, description')
			->where('parent_id', $id)
            ->get();
					
        return $query->getResultObject();
	}

    public function getSkillSubtypeByID($id) 
    {
		$query = $this
			->db
            ->table(TBL_SKILL_SUB)
			->select('id, name, description')
			->where('id', $id)
            ->get();
					
        return $query->getRow();
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