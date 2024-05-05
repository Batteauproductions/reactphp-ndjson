<div class="">
    <section>        
        <form>
            <div class="inline">
                <label for="name">
                    Karakternaam
                </label>
                <input id="name" name="name" type="text">
            </div>
            <div class="inline">
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
            <div class="inline">
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
            <div class="inline">
                <button class="button solid" type="submit">
                    <i class="fa-solid fa-filter"></i>Filter toepassen
                </button>
            </div>
        </form>       
    </section>

    <section class="wrapper-character"> 
        <?php foreach($arrCharacters as $characters):?>
            <div class="tile tile-status--<?php echo $characters->status_name ?>">              
                <?php echo $characters->name ?>
                <?php echo $characters->status_name ?>
                <img class="tile-avatar" src="<?php echo empty($characters->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('elements/header-img.png') ?>"/>
            </div>
        <?php endforeach;?> 
    </section>
</div>