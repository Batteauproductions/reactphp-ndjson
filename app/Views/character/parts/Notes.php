<section class="grid-x align-middle info-container">
    <div class="cell small-12 text-center">      
        <h2>Notities</h2>                                
    </div>
    <div class="cell small-12">
        <div class="grid-x align-middle">
            <div class="cell small-6 text-left">
                Speler
            </div>
            <div class="cell small-6">
                <a data-action="create-note" data-type="player_notes">
                    <i class="fa-solid fa-plus"></i>toevoegen</span>
                </a>
            </div>
            <div id="container-player_notes" class="cell text-left" style="display:none;">
                <?php echo isset($arrNotes['personal_note']) ? $arrNotes['personal_note'] : '' ?>
            </div>
        </div>
        <div class="grid-x align-middle">
            <div class="cell small-6 text-left">
                Spelleiding
            </div>
            <?php if($viewAsGamemaster): ?>
                <div class="cell small-6">
                    <a data-action="create-note" data-type="sl_notes">
                        <i class="fa-solid fa-plus"></i>toevoegen</span>
                    </a>
                </div>
            <?php endif; ?> 
            <div id="container-sl_notes" class="cell text-left" style="display:none;">
                <?php echo isset($arrNotes['public_note']) ? $arrNotes['public_note'] : '' ?>
            </div>
        </div>
        <?php if($viewAsAdmin): ?>
            <div class="grid-x align-middle">
                <div class="cell small-6 text-left">
                    Privé spelleiding
                </div>
                <div class="cell small-6">
                    <a data-action="create-note" data-type="sl_private_notes">
                        <i class="fa-solid fa-plus"></i>toevoegen</span>
                    </a>
                </div>
                <div id="container-sl_private_notes" class="cell text-left" style="display:none;">
                    <?php echo isset($arrNotes['private_note']) ? $arrNotes['private_note'] : '' ?>
                </div>
            </div>
        <?php endif; ?> 
    </div>
    
    
    
    
    
        
    
</section>