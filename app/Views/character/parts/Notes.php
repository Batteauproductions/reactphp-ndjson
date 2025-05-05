<div class="info-container">
    <h2>Notities</h2>
    <hr>
    <div class="grid-x grid-margin-y">
        <div class="cell small-12">
            <h3>Speler</h2>
            <div class="grid-x align-middle">
                <div id="container-player_notes" class="cell text-left" style="display:none;">
                    <?php echo isset($arrNotes['personal_note']) ? $arrNotes['personal_note'] : '' ?>
                </div>
                <div class="cell small-12">
                    <a data-action="create-note" data-type="player_notes">
                        <i class="fa-solid fa-plus"></i>toevoegen</span>
                    </a>
                </div>                
            </div>            
        </div>
        <div class="cell small-12">
            <h3>Spelleiding</h3>
            <div class="grid-x align-middle">
                <div id="container-sl_notes" class="cell text-left" style="display:none;">
                    <?php echo isset($arrNotes['public_note']) ? $arrNotes['public_note'] : '' ?>
                </div>
                <?php if($viewAsGamemaster): ?>
                    <div class="cell small-12">                
                        <a data-action="create-note" data-type="sl_notes">
                            <i class="fa-solid fa-plus"></i>toevoegen</span>
                        </a>                    
                    </div>   
                <?php endif; ?>             
            </div>            
        </div>
        <?php if($viewAsAdmin): ?>
            <div class="cell small-12">
                <h3>Spelleiding (privé)</h3>
                <div class="grid-x align-middle">
                    <div id="container-sl_private_notes" class="cell text-left" style="display:none;">
                        <?php echo isset($arrNotes['private_note']) ? $arrNotes['private_note'] : '' ?>
                    </div>
                    <div class="cell small-12">
                        <a data-action="create-note" data-type="sl_private_notes">
                            <i class="fa-solid fa-plus"></i>toevoegen</span>
                        </a>
                    </div>                    
                </div>            
            </div>
        <?php endif; ?>
    </div>
</div>