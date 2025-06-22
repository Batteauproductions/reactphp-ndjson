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

            <?= $this->include('character/character_grid') ?>    
                        
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
                <?php if(isset($oCharacter)): ?>
                    <a class="button clear" href="<?= base_url('user/character/print/'.$oCharacter->meta->id); ?>" target="_blank"><i class="fa-solid fa-print"></i> Printen</a>
                <?php endif; ?>
            </div>
        </form>
    </div>
</div>

