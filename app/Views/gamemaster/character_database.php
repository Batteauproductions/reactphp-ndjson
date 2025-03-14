<div class="grid-container">
    <div class="page-wrapper transparent">
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
                            <?php foreach($arrCharacters as $character):?>
                                <option value="<?php echo $character->id ?>"><?php echo $character->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell input-group">
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
                    <div class="cell input-group">
                        <label for="race" class="input-group-label">
                            Ras
                        </label>
                        <select id="race" class="input-group-field" name="race" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrRace as $race):?>
                                <option value="<?php echo $race->id ?>"><?php echo $race->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell input-group">
                        <label for="profession" class="input-group-label">
                            Beroep
                        </label>
                        <select id="profession" class="input-group-field" name="profession" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrProf as $profession):?>
                                <option value="<?php echo $profession->id ?>"><?php echo $profession->name ?></option>
                            <?php endforeach;?> 
                        </select>
                    </div>
                    <div class="cell input-group">
                        <label for="skill" class="input-group-label">
                            Vaardigheid
                        </label>
                        <select id="skill" class="input-group-field" name="skill" type="text">
                            <option value="">Geen voorkeur</option>
                            <?php foreach($arrSkill as $skill):?>
                                <option value="<?php echo $skill->id ?>"><?php echo $skill->name ?></option>
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
            <section class="cell small-12 medium-6 large-9">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character): ?>
                        <?= view('_templates/tile', ['character' => $character]) ?>                         
                    <?php endforeach; ?>
                </div>
            </section> 
        </div>
    </div>
</div>