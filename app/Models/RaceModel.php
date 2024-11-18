<?php

namespace App\Models;

use CodeIgniter\Model;
use App\Models\SkillModel; // Import the SkillModel

class RaceModel extends Model
{
    protected $db;
    protected $skillModel; // Declare a variable to hold the SkillModel instance

    public function __construct()
    {
        $this->db = \Config\Database::connect();
        $this->skillModel = new SkillModel(); 
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
        $arrData['skills'] = [];
        // Check if the skills attribute is set and not empty
        if (!empty($arrData['details']->skills)) {
            // Parse the skills string
            $parsedSkills = $this->parseSkills($arrData['details']->skills);
            // Collect all selected subids to exclude them from options
            $selectedSubIds = array_column($parsedSkills, 'subid');
            // Process each parsed skill to fetch main and sub skill details
            $skillID;
            foreach ($parsedSkills as $parsedSkill) {
                $skillData = $this->skillModel->getSkillDetails($parsedSkill['id']);
                //check if a subid is already present
                if (isset($parsedSkill['subid'])) {
                    $subSkill = $this->skillModel->getSkillSubtypeByID($parsedSkill['subid']);
                    $skillData['current'] = new \stdClass();
                    $skillData['current']->sub_id = $subSkill->id;
                    $skillData['current']->sub_name = $subSkill->name;
                    $skillID = $subSkill->id;
                //otherwise keep the options  but remove the already existent
                } else {
                    // Fetch all sub-skills for this main skill, excluding already selected ones
                    foreach ($skillData['subtype'] as $key => $item) {
                        // Ensure you're unsetting from the correct array
                        if ($item->id == $skillID) {
                            unset($skillData['subtype'][$key]);
                        }
                    }
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
