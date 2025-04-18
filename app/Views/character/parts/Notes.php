<section class="grid-x align-middle info-container">
    <div class="cell small-12 text-center">      
        <h2>Notities</h2>                                
    </div>
    <div class="cell small-6 text-left">
        Speler
    </div>
    <div class="cell small-6">
        <a data-action="create-note" data-type="player_notes">
            <i class="fa-solid fa-plus"></i>toevoegen</span>
        </a>
    </div>
    <div id="container-player_notes" class="cell text-left" style="display:none;">
        <!-- dynamic -->
    </div>
    <div class="cell small-6 text-left">
        Spelleiding
    </div>
    <div class="cell small-6">
        <a data-action="create-note" data-type="sl_notes">
            <i class="fa-solid fa-plus"></i>toevoegen</span>
        </a>
    </div>
    <div id="container-sl_notes" class="cell text-left" style="display:none;">
        <!-- dynamic -->
    </div>
    <?php if($viewAsAdmin): ?>
        <div class="cell small-6 text-left">
            Privé spelleiding
        </div>
        <div class="cell small-6">
            <a data-action="create-note" data-type="sl_private_notes">
                <i class="fa-solid fa-plus"></i>toevoegen</span>
            </a>
        </div>
        <div id="container-sl_private_notes" class="cell text-left" style="display:none;">
            <!-- dynamic -->
        </div>
    <?php endif; ?> 
</section>