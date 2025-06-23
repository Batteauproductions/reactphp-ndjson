<?php 
    // Initialize variables for each filter
    $selectedName = '';
    $selectedPlayer = '';
    $selectedType = '';
    $selectedStatus = '';
    $selectedRace = '';
    $selectedProfession = '';
    $selectedSkill = '';

    // Check if 'filters' exists in the cookie
    if (isset($_COOKIE['filters'])) {
        // Get the filters string
        $filters = $_COOKIE['filters'];
        
        // Parse the filters into an associative array
        parse_str($filters, $filtersArray);
        
        // Extract each filter value
        $selectedName = isset($filtersArray['character_name']) ? $filtersArray['character_name'] : '';
        $selectedPlayer = isset($filtersArray['character_player']) ? $filtersArray['character_player'] : '';
        $selectedType = isset($filtersArray['character_type']) ? $filtersArray['character_type'] : '';
        $selectedStatus = isset($filtersArray['character_status']) ? $filtersArray['character_status'] : '';
        $selectedRace = isset($filtersArray['character_race']) ? $filtersArray['character_race'] : '';
        $selectedProfession = isset($filtersArray['character_profession']) ? $filtersArray['character_profession'] : '';
        $selectedSkill = isset($filtersArray['character_skill']) ? $filtersArray['character_skill'] : '';
    } 
?>

<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">                    
            <form class="sortable cell small-12 medium-4 large-3" action="<?= base_url('gamemaster/character/search') ?>" method="post">
                <div class="sortable-wrapper">
                    <div class="grid-x sortable-selection">
                        <div class="cell text-center">
                            <h2>Filters</h2>
                            <hr>
                        </div>
                        <label for="character_name" class="cell">
                            Karakter-naam
                            <select id="character_name" name="character_name" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrCharacters as $character): ?>
                                    <option value="<?= $character->name ?>" <?= $character->name == $selectedName ? 'selected' : ''; ?>><?= $character->name ?></option>
                                <?php endforeach; ?> 
                            </select>
                        </label>
                        <label for="character_player" class="cell">
                            Speler-naam
                            <select id="character_player" name="character_player" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrUsers as $user): ?>
                                    <option value="<?= $user->firstname.' '.$user->lastname ?>" <?= $user->firstname.' '.$user->lastname == $selectedPlayer ? 'selected' : ''; ?>><?= $user->firstname.' '.$user->lastname ?></option>
                                <?php endforeach; ?> 
                            </select>
                        </label>
                        <label for="character_type" class="cell">
                            Type
                            <select id="character_type" name="character_type" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrType as $type):?>
                                    <option value="<?= $type->id ?>" <?= $type->id == $selectedType ? 'selected' : ''; ?>><?= $type->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_status" class="cell">
                            Status
                            <select id="character_status" name="character_status" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrStatus as $status):?>
                                    <option value="<?= $status->id ?>" <?= $status->id == $selectedStatus ? 'selected' : ''; ?>><?= $status->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_race" class="cell">
                            Ras
                            <select id="character_race" name="character_race" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrRace as $race):?>
                                    <option value="<?= $race->id ?>" <?= $race->id == $selectedRace ? 'selected' : ''; ?>><?= $race->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_profession" class="cell">
                            Beroep
                            <select id="character_profession" name="character_profession" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrProf as $profession):?>
                                    <option value="<?= $profession->id ?>" <?= $profession->id == $selectedProfession ? 'selected' : ''; ?>><?= $profession->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_skill" class="cell">
                            Vaardigheid
                            <select id="character_skill" name="character_skill" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrSkill as $skill):?>
                                    <option value="<?= $skill->id ?>" <?= $skill->id == $selectedSkill ? 'selected' : ''; ?>><?= $skill->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>                        
                    </div>   
                    <div class="grid-x"> 
                        <div class="cell">
                            <button class="button solid" type="submit">
                                <i class="fa-solid fa-filter"></i>Filter toepassen
                            </button>
                        </div>   
                    </div>             
                </div>                
            </form> 
            <div class="cell small-12 medium-8 large-9">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character): ?>
                        <?= view('_templates/character_tile', ['character' => $character, 'target' => 'gamemaster', 'isGameMaster' => true]) ?>                                               
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>
    </section>
</div>