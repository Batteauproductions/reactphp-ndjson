<h1>Primaire stats</h1>
<img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
<div class="grid-x align-middle info-container">
    <div class="cell small-6 text-left">
        Levenspunten
    </div>
    <div class="cell small-6">
        <span id="stat-hp"><?php echo $jsonBaseChar['hp'] ?></span>
    </div>
    <div class="cell small-6 text-left">
        Sanity
    </div>
    <div class="cell small-6">
        <span id="stat-sanity"><?php echo $jsonBaseChar['sanity'] ?></span>
    </div>
    <div class="cell small-6 text-left">
        Mana
    </div>
    <div class="cell small-6">
        <span id="stat-mana"><?php echo $jsonBaseChar['mana'] ?></span>
    </div>
    <div class="cell small-6 text-left">
        Godpunten
    </div>
    <div class="cell small-6">
        <span id="stat-gp"><?php echo $jsonBaseChar['gp'] ?></span>
    </div>
    <div class="cell small-6 text-left">
        Patron gunst
    </div>
    <div class="cell small-6">
        <span id="stat-favour">0</span>
    </div>
</div>