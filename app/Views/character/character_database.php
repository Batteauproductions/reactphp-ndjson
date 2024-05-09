<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">               
            <div class="cell">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character):?>
                        <div 
                            data-name="<?php echo $character->id ?>" 
                            data-type="<?php echo $character->type_id ?>"
                            data-status="<?php echo $character->status_id ?>"
                            class="cell small-6 medium-4 large-3 tile tile-status--<?php echo $character->status_name ?>">              
                            <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>" style="opacity:0;"/>                            
                            <div class="tile-content" data-equalizer-watch>
                                <img src="<?php echo empty($character->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/hero/'.$character->avatar) ?>"/>                        
                                <div class="tile-description">
                                    <h1><?php echo substr($character->name, 0, 30) ?></h1>
                                    <p><?php echo $character->status_name ?></p>
                                </div>                                
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