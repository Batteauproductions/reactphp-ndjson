<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">               
            <div class="cell">
                <div id="sort_character-result" class="grid-x grid-margin-x grid-margin-y small-up-1 medium-up-2 large-up-3 wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character): ?>
                        <?= view('_templates/character_tile', ['character' => $character, 'target' => 'user', 'viewAsGamemaster' => $isGameMaster]) ?>                         
                    <?php endforeach; ?> 
                </div>
            </div>        
        </section>
    </div>
</div>