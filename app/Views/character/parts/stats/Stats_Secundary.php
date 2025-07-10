<div class="info-container">
    <h3>Secundaire stats</h3>
    <hr>
    <div class="grid-x align-middle">
        <div class="cell small-6 text-left">
            Kracht
        </div>
        <div class="cell small-6">
            <span id="stat-str"><?= isset($jsonBaseChar) ? $jsonBaseChar['str'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Behendingheid
        </div>
        <div class="cell small-6">
            <span id="stat-dex"><?= isset($jsonBaseChar) ? $jsonBaseChar['dex'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Intelligentie
        </div>
        <div class="cell small-6">
            <span id="stat-intel"><?= isset($jsonBaseChar) ? $jsonBaseChar['intel'] : ''?></span>
        </div>
        <div class="cell small-6 text-left">
            Clues
        </div>
        <div class="cell small-6">
            <span id="stat-clues">0</span>
        </div>
    </div>
</div>