<div class="info-container">
    <h3>Primaire stats</h3>
    <hr>
    <div class="grid-x align-middle">
        <div class="cell small-6 text-left">
            Levenspunten
        </div>
        <div class="cell small-6">
            <span id="stat-hp"><?= isset($oCharacter) ? $oCharacter->build->hp : (isset($jsonBaseChar) ? $jsonBaseChar['hp'] : '')?></span>
        </div>
        <div class="cell small-6 text-left">
            Sanity
        </div>
        <div class="cell small-6">
            <span id="stat-sanity"><?= isset($oCharacter) ? $oCharacter->build->sanity : (isset($jsonBaseChar) ? $jsonBaseChar['sanity'] : '')?></span>
        </div>
        <div class="cell small-6 text-left">
            Mana
        </div>
        <div class="cell small-6">
            <span id="stat-mana"><?= isset($oCharacter) ? $oCharacter->build->sanity : (isset($jsonBaseChar) ? $jsonBaseChar['mana'] : '')?></span>
        </div>
        <div class="cell small-6 text-left">
            Godpunten
        </div>
        <div class="cell small-6">
            <span id="stat-gp"><?= isset($oCharacter) ? $oCharacter->build->sanity : (isset($jsonBaseChar) ? $jsonBaseChar['gp'] : '')?></span>
        </div>
        <div id="patron-favour" class="cell" <?= isset($oCharacter) && $oCharacter->build->favour > 0 ? '' : 'style="display:none;"' ?>>
            <div class="grid-x">
                <div class="cell small-6 text-left">
                    Patron gunst
                </div>        
                <div class="cell small-6">
                    <span id="stat-favour"><?= isset($oCharacter) ? $oCharacter->build->favour : ''?></span>
                </div>
            </div>
        </div>
    </div>
</div>