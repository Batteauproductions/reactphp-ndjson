<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">                    
            <form class="sortable cell small-12 medium-6 large-3" action="<?php current_url() ?>" method="post">
                <div class="grid-x">
                    <div class="cell">
                        <h1>Filters</h1>
                    </div>
                    <div class="cell input-group">
                        <label for="name" class="input-group-label">
                            Naam
                        </label>
                        <select id="name" class="input-group-field" name="name" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrUsers as $user):?>
                                <option value="<?php echo $user->id ?>"><?php echo $user->firstname.' '.$user->lastname ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell input-group">
                        <label for="type" class="input-group-label">
                            Type
                        </label>
                        <select id="type" class="input-group-field" name="type" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrRoles as $type):?>
                                <option value="<?php echo $type->id ?>"><?php echo $type->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell input-group">
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
                    <div class="cell">
                        <button class="button solid" type="submit">
                            <i class="fa-solid fa-filter"></i>Filter toepassen
                        </button>
                    </div>
                </div>
                <hr>
            </form> 
            <div class="cell small-12 medium-6 large-9">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrUsers as $user):?>
                        <div class="cell small-12 medium-6 tile tile-status--<?= esc($user->status_name) ?>">                                
                            <div class="grid-x">
                                <div class="cell small-4">
                                    <div class="tile-avatar-wrapper">
                                        <img src="<?= empty($user->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/user/'.$user->avatar) ?>" />
                                    </div>
                                </div>                                
                                <div class="cell small-8">
                                    <div class="tile-content">
                                        <h1><?php echo $user->firstname.' '.$user->lastname ?></h1>
                                        <p><?php echo $user->username ?></p>
                                        <p><?php echo $user->status_name ?></p>
                                        <ul>
                                            <li><a href="<?= base_url('gamemaster/character/edit/'.$user->id); ?>"><i class="fa-solid fa-pen-to-square"></i> aanpassen</a></li>
                                            <li><a href="<?= base_url('gamemaster/character/delete/'.$user->id); ?>"><i class="fa-solid fa-trash"></i> verwijderen</a></li>
                                        </ul>
                                    </div>
                                </div>                                
                            </div>
                        </div>         
                    <?php endforeach; ?>
                </div>
            </div> 
        </div>
    </section>
</div>