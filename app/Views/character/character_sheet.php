<!-- Include modals -->
<?= view('character/parts/modal/Adventure') ?>
<?= view('character/parts/modal/Background') ?>
<?= view('character/parts/modal/Choice') ?>
<?= view('character/parts/modal/Notes') ?>
<?= view('character/parts/modal/Text') ?>

<script>
    //setting window data
    window.character_input = <?= isset($oCharacter) ? json_encode($oCharacter) : 'null' ?>;
    window.character = window.character || {};
    window.arrXP = Object.freeze(<?= json_encode(explode(',', $arrXP)); ?>);
    window.jsonBaseChar = Object.freeze(<?= json_encode($jsonBaseChar); ?>);
    window.jsonStat = Object.freeze(<?= json_encode($jsonStat); ?>);
    window.gamemaster = <?= $viewAsGamemaster ? $viewAsGamemaster : 'false' ?>;
</script>

<div class="grid-container">
    <div class="page-wrapper transparent">
        <form id="form-character" class="grid-x grid-padding-x grid-padding-y form-character" method="POST">

            <!-- Notes and base information -->
            <div class="cell small-12 medium-12 large-3">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 medium-4 large-12 text-left">
                        <?= view('character/parts/Profile', ['print'=>false]) ?>   
                    </div>
                    <div class="cell small-12 medium-8 large-12 text-center">
                        <?= view('character/parts/Baseinfo', ['print'=>false]) ?>
                    </div>
                    <div class="cell small-12 medium-12 large-12 text-center">
                        <?= view('character/parts/Notes', ['print'=>false]) ?>
                    </div>
                </div>
            </div>
            <!-- Stats and assets -->
            <div class="cell small-12 medium-12 large-9">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 medium-6 large-6 text-center">
                        <?= view('character/parts/stats/Stats_Primary', ['print'=>false]) ?>
                    </div>
                    <div class="cell small-12 medium-6 large-6 text-center">
                        <?= view('character/parts/stats/Stats_Secundary', ['print'=>false]) ?>
                    </div>
                    <div class="cell small-12 medium-12 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Beroep(en)', 'id'=>'profession', 'print'=>false]); ?>
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Basis vaardigheden', 'id'=>'skill_base', 'print'=>false]); ?>
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Gevechts vaardigheden', 'id'=>'skill_combat', 'print'=>false]); ?>
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Magische vaardigheden', 'id'=>'skill_magic', 'print'=>false]); ?>
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Goddelijke vaardigheden', 'id'=>'skill_divine', 'print'=>false]); ?>            
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Startuitrusting', 'id'=>'basekit', 'print'=>false]); ?>
                    </div>
                    <div class="cell small-12 medium-12 large-6 text-center">
                        <?= view('character/parts/Asset', ['title'=>'Voorwerpen', 'id'=>'item', 'print'=>false]); ?>
                    </div>
                </div>                
            </div>    
                        
            <div class="cell small-12 text-center">
                <?= view('character/parts/Adventures') ?>
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