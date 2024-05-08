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
                            <?php foreach($arrType as $type):?>
                                <option value="<?php echo $type->id ?>"><?php echo $type->name ?></option>
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
                     
                </div>
            </div>        
        </section>
    </div>
</div>