<?php echo 'work in progress' ?>

<?php 
    // Initialize variables for each filter
    $selectedName = '';

    // Check if 'filters' exists in the cookie
    if (isset($_COOKIE['filters'])) {
        // Get the filters string
        $filters = $_COOKIE['filters'];
        
        // Parse the filters into an associative array
        parse_str($filters, $filtersArray);
        
        // Extract each filter value
        $selectedName = isset($filtersArray['skill_name']) ? $filtersArray['skill_name'] : '';
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
                        <label for="skill_name" class="cell">
                            Naam
                            <select id="skill_name" class="chosen-select" name="skill_name">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrSkills as $skill): ?>
                                    <option value="<?php echo $skill->id ?>" <?php echo $skill->id == $selectedName ? 'selected' : ''; ?>><?php echo $skill->name ?></option>
                                <?php endforeach; ?> 
                            </select>
                        </label>
                        <div class="cell">
                            <button class="button solid fullwidth" type="submit">
                                <i class="fa-solid fa-filter"></i>Filter toepassen
                            </button>
                        </div>
                    </div>                    
                </div>                
            </form> 
            <div class="cell small-12 medium-8 large-9">
                <div class="grid-x grid-margin-x grid-margin-y small-up-1 large-up-2">
                    <?php foreach($arrSkills as $skill): ?>
                        <?= view('_templates/skill_tile', ['skill' => $skill]) ?>                                               
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>
    </section>
</div>