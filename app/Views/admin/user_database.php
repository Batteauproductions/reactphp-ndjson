<?php 
    // Initialize variables for each filter
    $selectedName = '';
    $selectedRole = '';
    $selectedStatus = '';

    // Check if 'filters' exists in the cookie
    if (isset($_COOKIE['user_filters'])) {
        // Decode the JSON string from the cookie
        $filtersArray = json_decode($_COOKIE['user_filters'], true);

        // Extract each filter value if the array is valid
        if (is_array($filtersArray)) {
            $selectedName   = $filtersArray['user_name']   ?? '';
            $selectedRole   = $filtersArray['user_role']   ?? '';
            $selectedStatus = $filtersArray['user_status'] ?? '';
        }
    }
?>

<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">                    
            <form class="sortable cell small-12 medium-4 large-3" action="<?= base_url('admin/user/search') ?>" method="post">
                <div class="sortable-wrapper">
                    <div class="grid-x sortable-selection">
                        <div class="cell">
                            <h2>Filters</h2>
                            <hr>
                        </div>
                        <label for="user_name" class="cell">
                            Naam
                            <select id="user_name" name="user_name" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrUsers as $user):?>
                                    <option value="<?php echo $user->firstname.' '.$user->lastname ?>" <?php echo $user->id == $selectedName ? 'selected' : ''; ?>><?php echo $user->firstname.' '.$user->lastname ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="user_role" class="cell">
                            Rol
                            <select id="user_role" name="user_role" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrRoles as $role):?>
                                    <option value="<?php echo $role->id ?>" <?php echo $role->id == $selectedRole ? 'selected' : ''; ?>><?php echo $role->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </label>
                        <label for="user_status" class="cell">
                            Status
                            <select id="user_status" name="user_status" class="chosen-select">
                                <option value="">Geen voorkeur</option>
                                <?php foreach($arrStatus as $status):?>
                                    <option value="<?php echo $status->id ?>" <?php echo $status->id == $selectedStatus ? 'selected' : ''; ?>><?php echo $status->name ?></option>
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
                    <?php foreach($arrUsers as $user):?>
                                 
                    <?php endforeach; ?>
                    <?php foreach($arrUsers as $user): ?>
                        <?= view('_templates/user_tile', ['user' => $user, 'target' => 'gamemaster']) ?>                                               
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>
    </section>
</div>