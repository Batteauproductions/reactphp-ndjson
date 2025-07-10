<section class="grid-x align-middle info-container">
    <div class="cell small-12 text-center">
        <h3>Basis informatie</h3>
        <hr>
        <div class="grid-x align-middle">
            <div class="cell small-6 text-left">
                Spelernaam
            </div>
            <div class="cell small-6">
                <?php if(isset($oCharacter)): ?>
                    <?= $oCharacter->meta->user_name ?>
                <?php else: ?>
                    <?= isset($oSession) && method_exists($oSession, 'get') ? esc($oSession->get('name')) : '' ?>
                <?php endif ?>
            </div>
            <div class="cell small-6 text-left">
                Karakternaam
            </div>
            <div class="cell small-6">
                <?php if(isset($oCharacter) && $print): ?>
                    <?= $oCharacter->meta->name ?>
                <?php else: ?>
                    <a data-action="pick-name">
                        <span id="charactername"><i class="fa-solid fa-plus"></i>toevoegen</span>
                    </a>
                    <!--! hidden field for validation -->
                    <input type="hidden" name="char_name" value=""/>
                <?php endif ?>
            </div>
            <div class="cell small-6 text-left">
                Raskeuze
            </div>
            <div class="cell small-6">
                <?php if(isset($oCharacter) && $print): ?>
                    <?= $oCharacter->race->name ?>
                <?php else: ?>
                    <a data-action="pick-race">
                        <span id="race"><i class="fa-solid fa-plus"></i>toevoegen</span>
                    </a>
                <?php endif ?>
            </div>
            <div class="cell small-6 text-left">
                Vaardigheid
            </div>                
            <div class="cell small-6">
                <span id="stat-spend_xp"><?= isset($oCharacter) ? $oCharacter->build->spend_xp : '0'; ?></span>/<span id="stat-max_xp"><?= isset($oCharacter) ? $oCharacter->build->max_xp : (isset($jsonBaseChar) ? $jsonBaseChar['max_xp'] : '')?></span>pt.
            </div>
            <div class="cell small-6 text-left">
                Geld
            </div>
            <div class="cell small-6">
                <span id="stat-currency"><?= isset($oCharacter) ? $oCharacter->build->currency : ''?></span>
            </div>   
            <div class="cell small-6 text-left">
                Type
            </div>
            <div class="cell small-6">
                <?php if($viewAsAdmin && !$print): ?>
                    <a data-action="pick-type">
                        <span id="charactertype"><i class="fa-solid fa-rotate-right"></i><?php echo isset($oCharacter->meta->type_name) ? $oCharacter->meta->type_name : 'Speler'; ?></span>
                    </a>
                <?php else: ?>
                    <?php echo isset($oCharacter->meta->type_name) ? $oCharacter->meta->type_name : 'Speler'; ?>
                <?php endif; ?>   
                <!--! hidden field for validation -->
                <input type="hidden" name="char_type" value="1"/>     
            </div>                            
            <div class="cell small-6 text-left">
                Status
            </div>                            
            <div class="cell small-6">
                <?php if($viewAsAdmin && !$print): ?>
                    <a data-action="pick-status">
                        <span id="characterstatus"><i class="fa-solid fa-rotate-right"></i><?php echo isset($oCharacter->meta->status_name) ? $oCharacter->meta->status_name : 'Nieuw'; ?></span>
                    </a>
                <?php else: ?>
                    <?php echo isset($oCharacter->meta->status_name) ? $oCharacter->meta->status_name : 'Nieuw'; ?>
                <?php endif; ?> 
                <!--! hidden field for validation -->
                <input type="hidden" name="char_status" value="1"/>                               
            </div>  
        </div>
    </div> 
</section>