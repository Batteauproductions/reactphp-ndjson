<div class="info-container">
    <h3>Notities</h3>
    <hr>
    <div class="grid-x grid-margin-y">
        <div class="cell small-12">
            <h4>Speler</h4>
            <div class="grid-x align-middle">
                <div id="container-player_notes" class="cell text-left" style="display:none;">
                    <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                        <?php foreach($oCharacter->notes as $note): ?>
                            <?php print_r($note) ?>
                        <?php endforeach; ?>
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
        <div class="cell small-12">
            <h4>Spelleiding</h4>
            <div class="grid-x align-middle">
                <div id="container-sl_notes" class="cell text-left" style="display:none;">
                    <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                        <?php foreach($oCharacter->notes as $note): ?>
                            <?php print_r($note) ?>
                        <?php endforeach; ?>
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
        <?php if($viewAsAdmin): ?>
            <div class="cell small-12 no-print">
                <h4>Spelleiding (privé)</h4>
                <div class="grid-x align-middle">
                    <div id="container-sl_private_notes" class="cell text-left" style="display:none;">
                        <?php if(isset($oCharacter) && is_array($oCharacter->notes)): ?>
                            <?php foreach($oCharacter->notes as $note): ?>
                               <?php print_r($note) ?>
                            <?php endforeach; ?>
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
        <?php endif; ?>
    </div>
</div>
