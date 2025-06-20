<div class="info-container">
    <h2>Primaire stats</h2>
    <hr>
    <div class="grid-x align-middle">
        <div class="cell small-6 text-left">
            Levenspunten
        </div>
        <div class="cell small-6">
            <span id="stat-hp"><?= isset($jsonBaseChar) ? $jsonBaseChar['hp'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Sanity
        </div>
        <div class="cell small-6">
            <span id="stat-sanity"><?= isset($jsonBaseChar) ? $jsonBaseChar['sanity'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Mana
        </div>
        <div class="cell small-6">
            <span id="stat-mana"><?= isset($jsonBaseChar) ? $jsonBaseChar['mana'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Godpunten
        </div>
        <div class="cell small-6">
            <span id="stat-gp"><?= isset($jsonBaseChar) ? $jsonBaseChar['gp'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Patron gunst
        </div>
        <div class="cell small-6">
            <span id="stat-favour">0</span>
        </div>
    </div>
</div>