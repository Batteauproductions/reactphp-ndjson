<section id="professions">
    <div class="info-container">
        <h2>Beroep(en)</h2>
        <hr>
        <div data-id="profession-list">
            <!-- Dynamic filled -->
            <?php if(isset($arrProfessions)): ?>
                <?php foreach($arrProfessions as $profession):?>                
                    <div class="grid-x choice-row">
                        <div class="cell small-5 medium-4 text-left">
                            <?= $profession->name ?>
                        </div>
                        <div class="cell small-5 medium-4 text-center">
                            <?= $profession->sub_name ?>
                        </div>
                        <div class="cell small-2 medium-1 text-right">
                            <?= $profession->cost ?>
                        </div>
                    </div>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <?php if(!isset($arrProfessions)): ?>
            <a data-action="pick-profession"><i class="fa-solid fa-plus"></i>toevoegen</a>
        <?php endif; ?>
    </div>
</section>