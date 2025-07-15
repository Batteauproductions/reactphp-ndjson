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
    if (isset($_COOKIE['character_filters'])) {
        // Decode the JSON string from the cookie
        $filtersArray = json_decode($_COOKIE['character_filters'], true);
        
        // If it's a valid array, extract values
        if (is_array($filtersArray)) {
            $selectedName = $filtersArray['character_name'] ?? '';
            $selectedPlayer = $filtersArray['character_player'] ?? '';
            $selectedType = $filtersArray['character_type'] ?? '';
            $selectedStatus = $filtersArray['character_status'] ?? '';
            $selectedRace = $filtersArray['character_race'] ?? '';
            $selectedProfession = $filtersArray['character_profession'] ?? '';
            $selectedSkill = $filtersArray['character_skill'] ?? '';
        }
    } 
?>

<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">                    
            <form id="form-sort_character" class="sortable cell small-12 medium-4 large-3" action="<?= base_url('gamemaster/character/search') ?>" method="post">
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
                                <?php foreach($arrAllCharacters as $character): ?>
                                    <option value="<?= $character->id ?>" <?= $character->id == $selectedName ? 'selected' : ''; ?>><?= $character->name ?></option>
                                <?php endforeach; ?> 
                            </select>
                        </label>
                        <label for="character_player" class="cell">
                            Speler-naam
                            <select id="character_player" name="character_player" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrUsers as $user): ?>
                                    <option value="<?= $user->id ?>" <?= $user->id == $selectedPlayer ? 'selected' : ''; ?>><?= $user->firstname.' '.$user->lastname ?></option>
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
                            <button class="button solid fullwidth" type="submit">
                                <i class="fa-solid fa-filter"></i>Filter(s) toepassen
                            </button>
                            <button id="clear-form" class="button clear fullwidth">
                                <i class="fa-solid fa-filter-circle-xmark"></i>Filter(s) verwijderen
                            </button>
                        </div>  
                    </div>             
                </div>                
            </form> 
            <div class="cell small-12 medium-8 large-9">
                <div id="sort_character-result" class="grid-x grid-margin-x grid-margin-y small-up-1 large-up-2 wrapper-character" data-equalizer>
                    <?php foreach($arrSelectedCharacters as $character): ?>
                        <?= view('_templates/character_tile', ['character' => $character, 'target' => 'gamemaster', 'isGameMaster' => true]) ?>                                               
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>
    </section>
</div>

<!-- MODAL FOR POPUPS -->
<div id="character_process-modal" class="reveal small" data-reveal>
    
    <form id="form-character-check" class="grid-x grid-margin-y" action="<?= base_url('action/character-transfer'); ?>" method="post">
        <input id="action" name="action" type="hidden" value="review"/>
        <input id="cid" name="cid" type="hidden" value=""/>
        <div class="cell">    
            <h2>De status van het personage is</h2>
            <div class="grid-x align-middle">                
                <div class="cell shrink">
                    <input id="char-denied" type="radio" name="status_id" value="7" style="width:20px; margin-bottom:0px;">
                </div>
                <div class="cell auto">
                    <label for="char-denied" class="text-right middle" style="margin-bottom:0px;">Afgekeurd</label>
                </div>
            </div> 
            <div class="grid-x align-middle">
                <div class="cell shrink">
                    <input id="char-approved" type="radio" name="status_id" value="5" style="width:20px; margin-bottom:0px;">
                </div>
                <div class="cell auto">
                    <label for="char-approved" class="text-right middle" style="margin-bottom:0px;">Goedgekeurd</label>
                </div>
            </div>
            <div class="grid-x"> 
                <label class="cell" for="mail_note">
                    Notitie voor de speler 
                </label>
                <textarea id="mail_note" class="cell" name="mail_note" rows="8"></textarea>
            </div>            
        </div> 
        <div class="cell">
            <button type="submit" class="button solid no-spacing"><i class="fa-solid fa-paper-plane"></i> Verwerken</button>
            <a data-close aria-label="Close modal" class="button clear"><i class="fa-solid fa-xmark"></i> Annuleren</a>
        </div>                         
    </form>

    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
    
</div>