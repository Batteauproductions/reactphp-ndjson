<section>
    <h2>Notities</h2>
    <img class="spacer-image no-print" src="<?= image_path('elements/header-img.png') ?>" alt="-"/>
    <div class="grid-x grid-padding-x grid-padding-y">
        <div class="cell small-12 medium-4">
            <div class="info-container">
                <h4>Speler</h4>
                <hr>
                <div class="grid-x align-middle">
                    <div id="container-player_notes" class="cell text-left" style="display:none;">
                        <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                            <?= $oCharacter->notes[0]->player_notes ?>
                        <?php endif; ?>
                    </div>
                    <?php if(!$print): ?>
                        <div class="cell small-12 hide-for-print">
                            <a data-action="create-note" data-type="player_notes">
                                <i class="fa-solid fa-plus"></i>toevoegen
                            </a>
                        </div>
                    <?php endif; ?>                
                </div>
            </div>
        </div>
        <div class="cell small-12 medium-4">
            <div class="info-container">
                <h4>Spelleiding</h4>
                <hr>
                <div class="grid-x align-middle">
                    <div id="container-sl_notes" class="cell text-left" style="display:none;">
                        <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                            <?= $oCharacter->notes[0]->sl_notes ?>
                        <?php endif; ?>
                    </div>
                    <?php if($viewAsGamemaster && !$print): ?>
                        <div class="cell small-12 hide-for-print">                
                            <a data-action="create-note" data-type="sl_notes">
                                <i class="fa-solid fa-plus"></i>toevoegen
                            </a>                    
                        </div>   
                    <?php endif; ?>             
                </div>            
            </div>
        </div>
        <?php if($viewAsAdmin): ?>
            <div class="cell small-12 medium-4 no-print">
                <div class="info-container">
                    <h4>Spelleiding (privé)</h4>
                    <hr>
                    <div class="grid-x align-middle">
                        <div id="container-sl_private_notes" class="cell text-left" style="display:none;">
                            <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                                <?= $oCharacter->notes[0]->sl_private_notes ?>
                            <?php endif; ?>
                        </div>
                        <?php if(!$print): ?>
                            <div class="cell small-12 hide-for-print">
                                <a data-action="create-note" data-type="sl_private_notes">
                                    <i class="fa-solid fa-plus"></i>toevoegen
                                </a>
                            </div> 
                        <?php endif; ?>                   
                    </div>
                </div>
            </div>
        <?php endif; ?>
    </div>
</section>
