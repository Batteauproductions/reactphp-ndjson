<?php

namespace App\Models;

use CodeIgniter\Model;

class RaceModel extends Model
{
    protected $db;

    public function __construct()
    {
        $this->db = \Config\Database::connect();
    }

    public function getRaces() 
    {
        $query =  $this
                ->db
                ->table(TBL_RACE)
                ->select('id, name, available')
                ->where('available', 1)
                ->orderBy('id', 'asc')
                ->get();

        return $query->getResultObject();
    }

    public function getRaceDetails($id) 
    {
        $arrData['details'] = $this->getRaceById($id);
        $arrData['modifier'] = $this->getRaceModifer(explode('|', $arrData['details']->modifier));
        
        // Check if the skills attribute is set and not empty
        if (!empty($arrData['details']->skills)) {
            // Parse the skills string
            $parsedSkills = $this->parseSkills($arrData['details']->skills);
            // Collect all selected subids to exclude them from options
            $selectedSubIds = array_column($parsedSkills, 'subid');
            
            // Process each parsed skill to fetch main and sub skill details
            foreach ($parsedSkills as $parsedSkill) {
                $mainSkill = $this->getRaceSkills([$parsedSkill['id']])[0];
                $skillData = [
                    'main_id' => $mainSkill->id,
                    'main_name' => $mainSkill->name
                ];
                if (isset($parsedSkill['subid'])) {
                    $subSkill = $this->getSubSkillById($parsedSkill['subid']);
                    $skillData['sub_id'] = $parsedSkill['subid'];
                    $skillData['sub_name'] = $subSkill->name;
                } else {
                    // Fetch all sub-skills for this main skill, excluding already selected ones
                    $subSkills = $this->getSubSkillsByParentId($parsedSkill['id']);
                    $filteredSubSkills = array_filter($subSkills, function($subSkill) use ($selectedSubIds) {
                        return !in_array($subSkill->id, $selectedSubIds);
                    });
                    $skillData['options'] = $filteredSubSkills;
                }
                $arrData['skills'][] = $skillData;
            }
        }

        return $arrData;
    }
    

    private function getRaceById($id) 
    {        
        $query = $this
                    ->db
                    ->table(TBL_RACE . ' r')
                    ->select('r.id, r.name, r.description, r.bonus, r.rule_page, r.skills, r.modifier')
                    ->where('r.id', $id)
                    ->get();

        return $query->getRow();
    }

    // Function to parse the skills string
    private function parseSkills($skillsString) 
    {
        $skillsArray = explode('|', $skillsString);
        $parsedSkills = [];

        foreach ($skillsArray as $skill) {
            $parts = explode(',', $skill);
            $skillData = ['id' => $parts[0]];
            if (isset($parts[1])) {
                $skillData['subid'] = $parts[1];
            }
            $parsedSkills[] = $skillData;
        }

        return $parsedSkills;
    }

    public function getRaceSkills($ids) 
    {
        $query = $this
            ->db
            ->table(TBL_SKILL)
            ->select('id, name, description')
            ->whereIn('id', $ids)
            ->get();
    
        return $query->getResultObject();
    }

    // Function to fetch sub-skill details by sub-ID
    public function getSubSkillById($id) 
    {
        $query = $this
            ->db
            ->table(TBL_SKILL_SUB)
            ->select('id, name')
            ->where('id', $id)
            ->where('available', 1)
            ->get();

        return $query->getRow();
    }

    // Function to fetch sub-skills by parent ID
    public function getSubSkillsByParentId($parentId) 
    {
        $query = $this
            ->db
            ->table(TBL_SKILL_SUB)
            ->select('id, name')
            ->where('parent_id', $parentId)
            ->where('available', 1)
            ->get();

        return $query->getResultObject();
    }

    private function getRaceModifer($ids) 
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
