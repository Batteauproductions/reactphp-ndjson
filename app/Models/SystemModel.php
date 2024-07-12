<?php

namespace App\Models;

use CodeIgniter\Model;

class SystemModel extends Model
{

  protected $db;

  public function __construct()
  {
    $this->db = \Config\Database::connect();
  }

  public function getUserRoleOptions () {
    return $this
          ->db
          ->table(TBL_USER_ROLES)
          ->select('id, name, description')
          ->get()
          ->getResultObject();
  }

  public function getUserStatusOptions () {
    return $this
          ->db
          ->table(TBL_USER_STATUS)
          ->select('id, name, description')
          ->get()
          ->getResultObject();
  }

  public function getCharacterStatusOptions () {
    return $this
          ->db
          ->table(TBL_CHAR_STATUS)
          ->select('id, name, description')
          ->orderBy('name')
          ->get()
          ->getResultObject();
  }

  public function getCharacterTypeOptions () {
    return $this
          ->db
          ->table(TBL_CHAR_TYPES)
          ->select('id, name, description')
          ->orderBy('name')
          ->get()
          ->getResultObject();
  }

  public function getBaseCharSetting () {
    $result = $this
              ->db
              ->table(TBL_TOOL_SETTINGS)
              ->select('value')
              ->where('name','base_char')
              ->get()
              ->getRow();
    return json_decode($result->value, true);
  }

  public function getXPModSetting () {
    $result =  $this
              ->db
              ->table(TBL_TOOL_SETTINGS)
              ->select('value')
              ->where('name','xp_progression')
              ->get()
              ->getRow();
    return $result->value;
  }

  public function getStatModSetting () {
    $result =  $this
              ->db
              ->table(TBL_TOOL_SETTINGS)
              ->select('value')
              ->where('name','stat_mod')
              ->get()
              ->getRow();
    return json_decode($result->value, true);
  }

  public function getProfModSetting () {
    $result =  $this
              ->db
              ->table(TBL_TOOL_SETTINGS)
              ->select('value')
              ->where('name','prof_cost')
              ->get()
              ->getRow();
    return $result->value;
  }

}
