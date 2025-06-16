<?php if (!$user): ?>
    <p>User data missing.</p>
<?php else: ?>
    <div 
        data-user_id="<?= esc($user->id) ?>"
        data-user_name="<?= esc($user->firstname.' '.$user->lastname) ?>"
        data-user_role="<?= esc($user->role_id) ?>"
        data-user_status="<?= esc($user->status_id) ?>"
        class="cell small-12 large-6 tile tile-status--<?= esc($user->status_name) ?>">                                
        <div class="grid-x">
            <div class="cell small-12 medium-4">
                <div class="tile-avatar-wrapper">
                    <img src="<?= empty($user->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/user/'.$user->avatar) ?>" />
                </div>
            </div>                                
            <div class="cell small-12 medium-8">
                <div class="tile-content">
                    <h1><?php echo $user->firstname.' '.$user->lastname ?></h1>
                    <p><?php echo $user->username ?></p>
                    <p><?php echo $user->status_name ?></p>
                    <ul>
                        <li><a href="<?= base_url('admin/profile/'.$user->id); ?>"><i class="fa-solid fa-pen-to-square"></i> aanpassen</a></li>
                        <li><a data-action="user-delete" data-id="<?= $user->id ?>"><i class="fa-solid fa-trash"></i> verwijderen</a></li>
                    </ul>
                </div>
            </div>                                
        </div>
    </div>
<?php endif; ?>
