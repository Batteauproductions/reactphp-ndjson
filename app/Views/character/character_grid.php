<!-- Notes and base information -->
<div class="cell small-12 medium-6 large-3">
    <div class="grid-x grid-padding-x grid-padding-y">
        <div class="cell small-12 text-left">
            <?= view('character/parts/Profile') ?>   
        </div>
        <div class="cell small-12 text-center">
            <?= view('character/parts/Baseinfo') ?>
        </div>
        <div class="cell small-12 text-center">
            <?= view('character/parts/Notes') ?>
        </div>
    </div>
</div>
<!-- Stats and assets -->
<div class="cell small-12 medium-6 large-9">
    <div class="grid-x grid-padding-x grid-padding-y">
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/stats/Stats_Primary') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/stats/Stats_Secundary') ?>
        </div>
        <div class="cell small-12 medium-12 text-center">
            <?= view('character/parts/Asset', ['title' => 'Beroep(en)','id' => 'profession']); ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Basis vaardigheden', 'id' => 'skill_base']); ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Gevechts vaardigheden','id' => 'skill_combat']); ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Magische vaardigheden','id' => 'skill_magic']); ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Goddelijke vaardigheden','id' => 'skill_divine']); ?>            
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Startuitrusting','id' => 'basekit']); ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= view('character/parts/Asset', ['title' => 'Voorwerpen','id' => 'item']); ?>
        </div>
    </div>                
</div>