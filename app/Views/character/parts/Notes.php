<section>
    <div class="grid-x grid-margin-y">
        <div class="cell small-12">
            <h1>Notities Speler</h2>
            <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>      
            <div class="grid-x align-middle info-container">
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
            <h1>Notities Spelleiding</h2>
            <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>      
            <div class="grid-x align-middle info-container">
                <div id="container-sl_notes" class="cell text-left" style="display:none;">
                    <?php echo isset($arrNotes['public_note']) ? $arrNotes['public_note'] : '' ?>
                </div>
                <div class="cell small-12">
                    <?php if($viewAsGamemaster): ?>
                        <a data-action="create-note" data-type="sl_notes">
                            <i class="fa-solid fa-plus"></i>toevoegen</span>
                        </a>
                    <?php endif; ?>
                </div>                
            </div>            
        </div>
        <?php if($viewAsAdmin): ?>
            <div class="cell small-12">
                <h1>Notities spelleiding (privé)</h2>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>                         
                <div class="grid-x align-middle info-container">
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
</section>