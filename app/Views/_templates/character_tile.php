<?php if (!$character): ?>
    <p>Character data missing.</p>
<?php else: ?>
    <div 
        data-character_id="<?= esc($character->id) ?>"
        data-character_name="<?= esc($character->name) ?>" 
        data-character_type="<?= esc($character->type_id) ?>"
        data-character_status="<?= esc($character->status_id) ?>"
        data-character_race="<?= esc($character->race_id) ?>"
        data-character_profession="<?= esc($character->profession_info) ?>"
        class="cell small-12 large-6 tile tile-status--<?= esc($character->status_name) ?>">        
        <div class="grid-x">
            <div class="cell small-12 medium-4">
                <div class="tile-avatar-wrapper">
                    <img src="<?= empty($character->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/hero/'.$character->avatar) ?>" />
                </div>
            </div>
            <div class="cell small-12 medium-8">
                <div class="tile-content">
                    <h1><?= esc(substr($character->name, 0, 30)) ?></h1>
                    <p><?= esc($character->status_name) ?></p>
                    <ul>
                        <?php $showBtn = $isGameMaster || !in_array($character->status_id, CHARACTER_VIEWABLE) ?>
                        <?php if($showBtn): ?>
                            <li><a href="<?= base_url($target.'/character/edit/'.$character->id); ?>"><i class="fa-solid fa-pen-to-square"></i> aanpassen</a></li>
                        <?php endif; ?>
                        <li><a href="<?= base_url($target.'/character/view/'.$character->id); ?>"><i class="fa-solid fa-eye"></i> bekijken</a></li>
                        <li><a href="<?= base_url($target.'/character/print/'.$character->id); ?>" target="_blank"><i class="fa-solid fa-print"></i> printen</a></li>
                        <?php if($showBtn): ?>
                            <li><a data-action="character-delete" data-id="<?php echo $character->id; ?>"><i class="fa-solid fa-trash"></i> verwijderen</a></li>
                        <?php endif; ?>
                    </ul>
                </div>
            </div>            
        </div>
    </div>
<?php endif; ?>
