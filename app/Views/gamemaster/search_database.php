<div class="grid-container">
    <section class="grid-x">        
        <form class="cell">
            <div class="grid-x grid-margin-x grid-margin-y">
                <div ckass="cell shrink">
                    <label for="name">
                        Karakternaam
                    </label>
                    <input id="name" name="name" type="text">
                </div>
                <div ckass="cell shrink">
                    <label for="type">
                        Type
                    </label>
                    <select id="type" name="type" type="text">
                        <option value="">Geen voorkeur</option>
                        <?php foreach($arrType as $type):?>
                            <option value="<?php echo $type->id ?>"><?php echo $type->name ?></option>
                        <?php endforeach;?> 
                    </select>
                </div>
                <div ckass="cell shrink">
                    <label for="status">
                        Status
                    </label>
                    <select id="status" name="status" type="text">
                        <option value="">Geen voorkeur</option>
                        <?php foreach($arrStatus as $status):?>
                            <option value="<?php echo $status->id ?>"><?php echo $status->name ?></option>
                        <?php endforeach;?> 
                    </select>
                </div>
                <div ckass="cell shrink">
                    <button class="button solid" type="submit">
                        <i class="fa-solid fa-filter"></i>Filter toepassen
                    </button>
                </div>
            </div>
        </form>       
    </section>
    <section class="grid-x"> 
        <div class="cell">
            <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                <?php foreach($arrCharacters as $characters):?>
                    <div 
                        data-name="<?php echo $characters->name ?>" 
                        data-type="<?php echo $characters->type_id ?>"
                        data-status="<?php echo $characters->status_id ?>"
                        class="cell small-6 medium-4 large-3 tile tile-status--<?php echo $characters->status_name ?>" style="background-image: url(<?php echo empty($characters->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('elements/header-img.png') ?>)">              
                        <div class="tile-content" data-equalizer-watch>
                            <h1><?php echo $characters->name ?></h1>
                            <p><?php echo $characters->status_name ?></p>
                        </div>
                        <div class="tile-overlay">
                            <ul>
                                <li><a href="<?php echo base_url();?>"><i class="fa-solid fa-pen-to-square"></i>aanpassen</a></li>
                                <li><a href="<?php echo base_url();?>"><i class="fa-solid fa-print"></i>printen</a></li>
                                <li><a href="<?php echo base_url();?>"><i class="fa-solid fa-eye"></i>bekijken</a></li>
                                <li><a href="<?php echo base_url();?>"><i class="fa-solid fa-trash"></i>verwijderen</a></wli>
                            </ul>
                        </div>
                    </div>
                <?php endforeach;?> 
            </div>
        </div>        
    </section>
</div>