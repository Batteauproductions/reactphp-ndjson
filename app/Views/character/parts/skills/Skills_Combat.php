<div class="info-container">
    <h2>Gevechts vaardigheden</h2>
    <hr>
    <div data-id="skill_combat-list">
        <!-- Dynamic filled -->
        <?php if(isset($arrSkills)): ?>
            <?php foreach($arrSkills as $skill):?>                
                <div class="grid-x choice-row">
                    <div class="cell small-5 medium-4 text-left">
                        <?= $skill->name ?>
                    </div>
                    <div class="cell small-5 medium-4 text-center">
                        <?= $skill->sub_name ?>
                    </div>
                    <div class="cell small-2 medium-1 text-right">
                        <?= $skill->cost ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <?php if(!isset($arrSkills)): ?>
        <a data-action="pick-skill-combat"><i class="fa-solid fa-plus"></i>toevoegen</a>
    <?php endif; ?>
</div>