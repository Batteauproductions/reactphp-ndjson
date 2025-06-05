<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">               
            <div class="cell">
                <div class="grid-x grid-margin-x grid-margin-y wrapper-character" data-equalizer>
                    <?php foreach($arrCharacters as $character): ?>
                        <?= view('_templates/character_tile', ['character' => $character, 'target' => 'user']) ?>                         
                    <?php endforeach; ?> 
                </div>
            </div>        
        </section>
    </div>
</div>