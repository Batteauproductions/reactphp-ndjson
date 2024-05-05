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
                    <?php foreach($arrType as $iKey => $sValue):?>
                        <option value="<?php echo $iKey ?>"><?php echo $sValue ?></option>
                    <?php endforeach;?> 
                </select>
            </div>
            <div class="inline">
                <label for="status">
                    Status
                </label>
                <select id="status" name="status" type="text">
                    <option value="">Geen voorkeur</option>
                    <?php foreach($arrStatus as $iKey => $sValue):?>
                        <option value="<?php echo $iKey ?>"><?php echo $sValue ?></option>
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
        <?php foreach($arrCharacters as $iKey => $sValue):?>
            <div class="tile">
                <?php echo $sValue ?>
            </div>
        <?php endforeach;?> 
    </section>
</div>