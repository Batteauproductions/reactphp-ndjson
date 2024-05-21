<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">        
            <form class="cell sortable">
                <div class="grid-x grid-margin-x grid-margin-y align-bottom">
                    <div class="cell small-6 medium-4 input-group">
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
                    <div class="cell small-6 medium-4 input-group">
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
                    <div class="cell small-6 medium-4 input-group">
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
            </form> 
        </section>
        <section class="grid-x grid-padding-x grid-padding-y">               
            <div class="cell">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrUsers as $user):?>
                        <div class="cell small-6 medium-4 large-2 tile tile-status--<?php echo $user->status_name ?>">              
                            <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>" style="opacity:0;"/>                            
                            <div class="tile-content" data-equalizer-watch>
                                <img src="<?php echo empty($user->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/user/'.$user->avatar) ?>"/>                        
                                <div class="tile-description">
                                    <h1><?php echo $user->firstname.' '.$user->lastname ?></h1>
                                    <p><?php echo $user->status_name ?></p>
                                </div>                                
                            </div>
                            <div class="tile-overlay">
                                <ul>
                                    <li><a href="<?php echo base_url('gamemaster/character/edit/'.$user->id);?>"><i class="fa-solid fa-pen-to-square"></i>aanpassen</a></li>
                                    <li><a href="<?php echo base_url('gamemaster/character/delete/'.$user->id);?>"><i class="fa-solid fa-trash"></i>verwijderen</a></wli>
                                </ul>
                            </div>
                        </div>
                    <?php endforeach;?> 
                </div>
            </div>        
        </section>
    </div>
</div>