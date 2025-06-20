<!-- Notes and base information -->
<div class="cell small-12 medium-6 large-3">
    <div class="grid-x grid-padding-x grid-padding-y">
        <div class="cell small-12 text-left">
            <?= $this->include('character/parts/Profile') ?>   
        </div>
        <div class="cell small-12 text-center">
            <?= $this->include('character/parts/Baseinfo') ?>
        </div>
        <div class="cell small-12 text-center">
            <?= $this->include('character/parts/Notes') ?>
        </div>
    </div>
</div>
<!-- Stats and assets -->
<div class="cell small-12 medium-6 large-9">
    <div class="grid-x grid-padding-x grid-padding-y">
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/stats/Stats_Primary') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/stats/Stats_Secundary') ?>
        </div>
        <div class="cell small-12 medium-12 text-center">
            <?= $this->include('character/parts/Professions') ?>                      
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/skills/Skills_Profession') ?> 
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/skills/Skills_Combat') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/skills/Skills_Magic') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/skills/Skills_Divine') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/StarterKit') ?>
        </div>
        <div class="cell small-12 medium-12 large-6 text-center">
            <?= $this->include('character/parts/Equipment') ?>
        </div>
    </div>                
</div>