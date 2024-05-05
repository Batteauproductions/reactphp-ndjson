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
            <div class="grid-x grid-margin-x grid-margin-y">
                <?php foreach($arrCharacters as $characters):?>
                    <div class="cell small-4 medium-3 large-2 tile tile-status--<?php echo $characters->status_name ?>" style="background-image: url(<?php echo empty($characters->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('elements/header-img.png') ?>)">              
                        <div class="tile-content">
                            <h1><?php echo $characters->name ?></h1>
                            <p><?php echo $characters->status_name ?></p>
                        </div>
                        <div class="tile-overlay">
                            <a href="<?php echo base_url();?>"><i class="fa-solid fa-pen-to-square"></i>aanpassen</a>
                            <a href="<?php echo base_url();?>"><i class="fa-solid fa-print"></i>printen</a>
                            <a href="<?php echo base_url();?>"><i class="fa-solid fa-eye"></i>bekijken</a>
                            <a href="<?php echo base_url();?>"><i class="fa-solid fa-trash"></i>verwijderen</a>
                        </div>
                    </div>
                <?php endforeach;?> 
            </div>
        </div>        
    </section>
</div>