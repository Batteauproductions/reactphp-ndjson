<?php 
    // Initialize variables for each filter
    $selectedName = '';
    $selectedType = '';
    $selectedStatus = '';
    $selectedRace = '';
    $selectedProfession = '';

    // Check if 'filters' exists in the cookie
    if (isset($_COOKIE['filters'])) {
        // Get the filters string
        $filters = $_COOKIE['filters'];
        
        // Parse the filters into an associative array
        parse_str($filters, $filtersArray);
        
        // Extract each filter value
        $selectedName = isset($filtersArray['character_name']) ? $filtersArray['character_name'] : '';
        $selectedType = isset($filtersArray['character_type']) ? $filtersArray['character_type'] : '';
        $selectedStatus = isset($filtersArray['character_status']) ? $filtersArray['character_status'] : '';
        $selectedRace = isset($filtersArray['character_race']) ? $filtersArray['character_race'] : '';
        $selectedProfession = isset($filtersArray['character_profession']) ? $filtersArray['character_profession'] : '';
    } 
?>

<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">                    
            <form class="sortable cell small-12 medium-4 large-3" action="<?php current_url() ?>" method="post">
                <div class="sortable-wrapper">
                    <div class="grid-x">
                        <div class="cell text-center">
                            <h2>Filters</h2>
                            <hr>
                        </div>
                        <label for="character_name" class="cell">
                            Naam
                            <select id="character_name" name="character_name">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrCharacters as $character): ?>
                                    <option value="<?php echo $character->name ?>" <?php echo $character->name == $selectedName ? 'selected' : ''; ?>><?php echo $character->name ?></option>
                                <?php endforeach; ?> 
                            </select>
                        </label>
                        <label for="character_type" class="cell">
                            Type
                            <select id="character_type" name="character_type">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrType as $type):?>
                                    <option value="<?php echo $type->id ?>" <?php echo $type->id == $selectedType ? 'selected' : ''; ?>><?php echo $type->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_status" class="cell">
                            Status
                            <select id="character_status" name="character_status">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrStatus as $status):?>
                                    <option value="<?php echo $status->id ?>" <?php echo $status->id == $selectedStatus ? 'selected' : ''; ?>><?php echo $status->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_race" class="cell">
                            Ras
                            <select id="character_race" name="character_race">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrRace as $race):?>
                                    <option value="<?php echo $race->id ?>" <?php echo $race->id == $selectedRace ? 'selected' : ''; ?>><?php echo $race->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="character_profession" class="cell">
                            Beroep
                            <select id="character_profession" name="character_profession">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrProf as $profession):?>
                                    <option value="<?php echo $profession->id ?>" <?php echo $profession->id == $selectedProfession ? 'selected' : ''; ?>><?php echo $profession->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
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