<div class="grid-container">
    <?php if($viewAsAdmin):?>
        <form class="page-wrapper transparent" method="POST" action="<?php echo base_url('admin/settings-process')?>">
    <?php else: ?>
        <div class="page-wrapper transparent">
    <?php endif; ?>
        <section class="grid-x grid-padding-x grid-padding-y"> 
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>Basis instellingen personage</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach($jsonBaseChar as $base => $value):?>
                    <div class="input-group">
                        <label for="base=<?php echo $base ?>" class="input-group-label"><?php echo $base ?></label>
                        <input id="base=<?php echo $base ?>" class="input-group-field" type="number" value="<?php echo $value ?>" <?php echo (!$viewAsAdmin) ? 'disabled' : ''?> />
                    </div>
                <?php endforeach;?> 
            </div>            
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>Modifier per stat / per level</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach($jsonStat as $base => $value):?>
                    <div class="input-group">
                        <label for="base=<?php echo $base ?>" class="input-group-label"><?php echo $base ?></label>
                        <input id="base=<?php echo $base ?>" class="input-group-field" type="number" value="<?php echo $value ?>" <?php echo (!$viewAsAdmin) ? 'disabled' : ''?>/>
                    </div>
                <?php endforeach;?>
            </div>
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>XP groei per evenement</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach(explode(',',$arrXP) as $event => $modifier):?>
                    <div class="input-group">
                        <label for="base=<?php echo $event ?>" class="input-group-label"><?php echo $event+1 ?></label>
                        <input id="base=<?php echo $event ?>" class="input-group-field" type="number" value="<?php echo $modifier ?>" <?php echo (!$viewAsAdmin) ? 'disabled' : ''?>/>
                    </div>
                <?php endforeach;?>
            </div>
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>XP kosten per niveau</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach(explode(',',$arrProfLevel) as $level => $cost):?>
                    <div class="input-group">
                        <label for="base=<?php echo $level ?>" class="input-group-label"><?php echo $level+1 ?></label>
                        <input id="base=<?php echo $level ?>" class="input-group-field" type="number" value="<?php echo $cost ?>" <?php echo (!$viewAsAdmin) ? 'disabled' : ''?>/>
                    </div>
                <?php endforeach;?>
            </div>
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>Speelbare rassen</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach($arrRace as $race):?>
                    <div class="input-group">
                        <label for="race=<?php echo $race->id ?>" class="input-group-label"><?php echo $race->name ?></label>
                        <input id="race=<?php echo $race->id ?>" class="input-group-field" type="checkbox" value="1" <?php echo ($race->available) ? 'checked' : '' ?> <?php echo (!$viewAsAdmin) ? 'disabled' : ''?>/>
                    </div>
                <?php endforeach;?> 
            </div> 
            <div class="cell small-6 medium-3">
                <div class="text-center">
                    <h1>Speelbare beroepen</h1>
                    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                </div>
                <?php foreach($arrProf as $profession):?>
                    <div class="input-group">
                        <label for="prof=<?php echo $profession->id ?>" class="input-group-label"><?php echo $profession->name ?></label>
                        <input id="prof=<?php echo $profession->id ?>" class="input-group-field" type="checkbox" value="1" <?php echo ($profession->available) ? 'checked' : '' ?> <?php echo (!$viewAsAdmin) ? 'disabled' : ''?>/>
                    </div>
                <?php endforeach;?> 
            </div>  
            <?php if($viewAsAdmin):?>
                <div class="cell small-12">
                    <button class="button solid" type="submit">
                        <i class="fa-regular fa-floppy-disk"></i>Wijzigigen opslaan
                    </button>
                </div>
            <?php endif; ?>
        <section>
    <?php if($viewAsAdmin):?>
        </form>
    <?php else: ?>
        </div>
    <?php endif; ?>
</div>