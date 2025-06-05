<?php if (!$character): ?>
    <p>Character data missing.</p>
<?php else: ?>
    <div 
        data-name="<?= esc($character->id) ?>" 
        data-type="<?= esc($character->type_id) ?>"
        data-status="<?= esc($character->status_id) ?>"
        data-race="<?= esc($character->race_id) ?>"
        data-profession="<?= esc($character->profession_info) ?>"
        class="cell small-12 medium-6 tile tile-status--<?= esc($character->status_name) ?>">
        
        <div class="grid-x">
            <div class="cell small-4">
                <div class="tile-avatar-wrapper">
                    <img src="<?= empty($character->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/hero/'.$character->avatar) ?>" />
                </div>
            </div>
            
            <div class="cell small-8">
                <div class="tile-content">
                    <h1><?= esc(substr($character->name, 0, 30)) ?></h1>
                    <p><?= esc($character->status_name) ?></p>
                    <ul>
                        <li><a href="<?= base_url($target.'/character/edit/'.$character->id); ?>"><i class="fa-solid fa-pen-to-square"></i> aanpassen</a></li>
                        <li><a href="<?= base_url($target.'/character/print/'.$character->id); ?>" target="_blank"><i class="fa-solid fa-print"></i> printen</a></li>
                        <li><a href="<?= base_url($target.'/character/view/'.$character->id); ?>"><i class="fa-solid fa-eye"></i> bekijken</a></li>
                        <li><a href="<?= base_url($target.'/character/delete/'.$character->id); ?>"><i class="fa-solid fa-trash"></i> verwijderen</a></li>
                    </ul>
                </div>
            </div>
            
        </div>
    </div>
<?php endif; ?>
