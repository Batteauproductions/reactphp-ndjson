<!-- Include modals -->
<?= $this->include('character/parts/modal/Adventure') ?>
<?= $this->include('character/parts/modal/Background') ?>
<?= $this->include('character/parts/modal/Choice') ?>
<?= $this->include('character/parts/modal/Notes') ?>
<?= $this->include('character/parts/modal/Text') ?>

<div class="grid-container">
    <div class="page-wrapper transparent">
        <form id="form-character" class="grid-x grid-padding-x grid-padding-y form-character" method="POST">
            <!-- Tool information -->
            <input type="hidden" name="jsonBaseChar" value='<?php echo json_encode($jsonBaseChar) ?>'/>
            <input type="hidden" name="jsonStat" value='<?php echo json_encode($jsonStat) ?>'/>
            <input type="hidden" name="arrXP" value='<?php echo $arrXP ?>'/>
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
                <a class="button solid" data-action="character-save"><i class="fa-regular fa-floppy-disk"></i> Opslaan</a>
                <a class="button clear" data-action="character-submit"><i class="fa-regular fa-share-from-square"></i> Indienen</a>
                <a class="button clear" data-action="character-print"><i class="fa-solid fa-print"></i> Printen</a>
            </div>
        </form>
    </div>
</div>

<script>
    window.character = <?php echo isset($oCharacter) ? $oCharacter : 'null' ?>;
</script>