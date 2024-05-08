<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">        
            <form class="cell sortable">
                <div class="grid-x grid-margin-x grid-margin-y align-bottom">
                    <div class="cell shrink input-group">
                        <label for="name" class="input-group-label">
                            Karakternaam
                        </label>
                        <select id="name" class="input-group-field" name="name" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrCharacters as $character):?>
                                <option value="<?php echo $character->id ?>"><?php echo $character->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell shrink input-group">
                        <label for="type" class="input-group-label">
                            Type
                        </label>
                        <select id="type" class="input-group-field" name="type" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrType as $type):?>
                                <option value="<?php echo $type->id ?>"><?php echo $type->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell shrink input-group">
                        <label for="status" class="input-group-label">
                            Status
                        </label>
                        <select id="status" class="input-group-field" name="status" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrStatus as $status):?>
                                <option value="<?php echo $status->id ?>"><?php echo $status->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell shrink">
                        <button class="button solid" type="submit">
                            <i class="fa-solid fa-filter"></i>Filter toepassen
                        </button>
                    </div>
                </div>
            </form> 
        </section>   
        <section class="grid-x grid-padding-x grid-padding-y">               
            <div class="cell">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character):?>
                        <div 
                            data-name="<?php echo $character->id ?>" 
                            data-type="<?php echo $character->type_id ?>"
                            data-status="<?php echo $character->status_id ?>"
                            class="cell small-6 medium-4 large-2 tile tile-status--<?php echo $character->status_name ?>">              
                            <img src="<?php echo empty($characters->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('elements/header-img.png') ?>"/>
                            <div class="tile-content" data-equalizer-watch>                            
                                <h1><?php echo substr($character->name, 0, 20) ?></h1>
                                <p><?php echo $character->status_name ?></p>
                            </div>
                            <div class="tile-overlay">
                                <ul>
                                    <li><a href="<?php echo base_url('gamemaster/character/edit/'.$character->id);?>"><i class="fa-solid fa-pen-to-square"></i>aanpassen</a></li>
                                    <li><a href="<?php echo base_url('gamemaster/character/print/'.$character->id);?>"><i class="fa-solid fa-print"></i>printen</a></li>
                                    <li><a href="<?php echo base_url('gamemaster/character/view/'.$character->id);?>"><i class="fa-solid fa-eye"></i>bekijken</a></li>
                                    <li><a href="<?php echo base_url('gamemaster/character/delete/'.$character->id);?>"><i class="fa-solid fa-trash"></i>verwijderen</a></wli>
                                </ul>
                            </div>
                        </div>
                    <?php endforeach;?> 
                </div>
            </div>        
        </section>
    </div>
</div>