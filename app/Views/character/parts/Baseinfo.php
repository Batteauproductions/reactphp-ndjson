<section class="grid-x align-middle info-container">
    <div class="cell small-12 text-center">
        <h2>Basis informatie</h2>
        <hr>
        <div class="grid-x align-middle">
            <div class="cell small-6 text-left">
                Spelernaam
            </div>
            <div class="cell small-6">
                <?php print_r($oSession->get('name')) ?>
            </div>
            <div class="cell small-6 text-left">
                Karakternaam
            </div>
            <div class="cell small-6">
                <a data-action="pick-name">
                    <span id="charactername"><i class="fa-solid fa-plus"></i>toevoegen</span>
                </a>
                <!--! hidden field for validation -->
                <input type="hidden" name="char_name" value=""/>
            </div>
            <div class="cell small-6 text-left">
                Raskeuze
            </div>
            <div class="cell small-6">
                <a data-action="pick-race">
                    <span id="race"><i class="fa-solid fa-plus"></i>toevoegen</span>
                </a>
                <!--! hidden field for validation -->
                <input type="hidden" name="char_race" value=""/>
            </div>
            <div class="cell small-6 text-left">
                Vaardigheid
            </div>
            <div class="cell small-6">
                <span id="stat-spend_xp"><?php echo $jsonBaseChar['spend_xp']?></span>/<span id="stat-max_xp"><?php echo $jsonBaseChar['max_xp'] ?></span>pt.
            </div>
            <div class="cell small-6 text-left">
                Geld
            </div>
            <div class="cell small-6">
                <span id="stat-currency"><?php echo $jsonBaseChar['currency'] ?></span>
            </div>   
            <div class="cell small-6 text-left">
                Type
            </div>
            <div class="cell small-6">
                <?php if($viewAsAdmin): ?>
                    <a data-action="pick-type">
                        <span id="charactertype"><i class="fa-solid fa-rotate-right"></i><?php echo isset($oCharacter->type_name) ? $oCharacter->type_name : 'Speler'; ?></span>
                    </a>
                <?php else: ?>
                    <?php echo isset($oCharacter->type_name) ? $oCharacter->type_name : 'Speler'; ?>
                <?php endif; ?>        
            </div>                            
            <div class="cell small-6 text-left">
                Status
            </div>                            
            <div class="cell small-6">
                <?php if($viewAsAdmin): ?>
                    <a data-action="pick-status">
                        <span id="characterstatus"><i class="fa-solid fa-rotate-right"></i><?php echo isset($oCharacter->status_id) ? $oCharacter->status_name : 'Nieuw'; ?></span>
                    </a>
                <?php else: ?>
                    <?php echo isset($oCharacter->status_id) ? $oCharacter->status_name : 'Nieuw'; ?>
                <?php endif; ?>                                
            </div>  
        </div>
    </div> 
</section>