<!-- Include modals -->
<?= $this->include('character/parts/modal/Adventure') ?>
<?= $this->include('character/parts/modal/Background') ?>
<?= $this->include('character/parts/modal/Choice') ?>
<?= $this->include('character/parts/modal/Notes') ?>
<?= $this->include('character/parts/modal/Text') ?>

<script>
    //setting window data
    window.character_input = <?php echo isset($oCharacter) ? json_encode($oCharacter) : 'null' ?>;
    window.character = window.character || {};
    window.arrXP = Object.freeze(<?php echo json_encode(explode(',', $arrXP)); ?>);
    window.jsonBaseChar = Object.freeze(<?php echo json_encode($jsonBaseChar); ?>);
    window.jsonStat = Object.freeze(<?php echo json_encode($jsonStat); ?>);
</script>

<div class="grid-container">
    <div class="page-wrapper transparent">
        <form id="form-character" class="grid-x grid-padding-x grid-padding-y form-character" method="POST">
            <!-- /Tool information -->
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
            <div class="cell small-12 text-center">
                <?= $this->include('character/parts/Adventures') ?>
            </div> 
                  
            <div class="cell small-12 text-right">
                <hr>
                <?php 
                    if (!isset($oCharacter) || $viewAsGamemaster || (isset($oCharacter) && in_array($oCharacter->meta->status, CHARACTER_WRITABLE) || in_array($oCharacter->meta->status, CHARACTER_EDITABLE))) : 
                ?>  
                    <a class="button solid" data-action="character-save"><i class="fa-regular fa-floppy-disk"></i> Opslaan</a>
                    <a class="button clear" data-action="character-submit"><i class="fa-regular fa-share-from-square"></i> Indienen</a>
                <?php endif; ?>
                <a class="button clear" data-action="character-print"><i class="fa-solid fa-print"></i> Printen</a>
            </div>
        </form>
    </div>
</div>

