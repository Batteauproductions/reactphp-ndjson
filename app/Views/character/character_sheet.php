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
            <input type="hidden" name="character" value='<?php echo isset($oCharacter) ? $oCharacter: '' ?>'/>
            <!-- /Tool information -->

            <div class="cell small-12 medium-4 large-3 text-center">
                <h1>Basis informatie</h1>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                <div class="grid-x grid-margin-x grid-margin-y">
                    <div class="cell small-12">                        
                        <div class="profile"> 
                            <div class="profile-avatar text-left">
                                <label class="profile-avatar-action">
                                    <input id="avatar" type="file" name="avatar" value="" placeholder="" hidden>
                                    <ul>
                                        <li>Enkel bestanden van maximaal 2mb</li>                                    
                                        <li>De extensies .jpg en .png zijn toegestaan</li>
                                        <li>Aspect ratio van 1:1 wordt aangeraden</li>
                                    </ul>
                                </label>
                                <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>"/>
                            </div>                        
                        </div>
                    </div>
                    <div class="cell small-12">
                        <div class="grid-x align-middle info-container">
                            <div class="cell small-6 text-left">
                                Spelernaam
                            </div>
                            <div class="cell small-6">
                                <?php print_r($oSession->get('name')) ?>
                            </div>
                            <div class="cell small-6 text-left">
                                Karakternaam
                            </div>
                            <div class="cell small-6">
                                <a data-action="pick-name">
                                    <span id="charactername"><i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                                <!--! hidden field for validation -->
                                <input type="hidden" name="char_name" value=""/>
                            </div>
                            <div class="cell small-6 text-left">
                                Raskeuze
                            </div>
                            <div class="cell small-6">
                                <a data-action="pick-race">
                                    <span id="race"><i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                                <!--! hidden field for validation -->
                                <input type="hidden" name="char_race" value=""/>
                            </div>
                            <div class="cell small-6 text-left">
                                Vaardigheid
                            </div>
                            <div class="cell small-6">
                                <span id="stat-spend_xp"><?php echo $jsonBaseChar['spend_xp']?></span>/<span id="stat-max_xp"><?php echo $jsonBaseChar['max_xp'] ?></span>pt.
                            </div>
                            <div class="cell small-6 text-left">
                                Geld
                            </div>
                            <div class="cell small-6">
                                <span id="stat-currency"><?php echo $jsonBaseChar['currency'] ?></span>
                            </div>   
                            <div class="cell small-6 text-left">
                                Type
                            </div>
                            <div class="cell small-6">
                                <select id="type" class="input-group-field" name="char_type" type="text">
                                    <option value="">Geen voorkeur</option>
                                    <?php foreach($arrType as $type):?>
                                        <option value="<?php echo $type->id ?>"><?php echo $type->name ?></option>
                                    <?php endforeach;?> 
                                </select>
                            </div>                            
                            <div class="cell small-6 text-left">
                                Status
                            </div>                            
                            <div class="cell small-6">
                                <?php if($viewAsAdmin): ?>
                                    <select id="status" class="input-group-field" name="char_status" type="text">
                                        <option value="">Geen voorkeur</option>
                                        <?php foreach($arrStatus as $status):?>
                                            <option value="<?php echo $status->id ?>"><?php echo $status->name ?></option>
                                        <?php endforeach;?> 
                                    </select>
                                <?php else: ?>
                                    <?php echo isset($oCharacter->status_id) ? $oCharacter->status_name : 'Nieuw'; ?>
                                <?php endif; ?>                                
                            </div>                           
                            <div class="cell small-12 text-center">      
                                <hr>                    
                                <h2>Notities</h2>                                
                            </div>
                            <div class="cell small-6 text-left">
                                Speler
                            </div>
                            <div class="cell small-6">
                                <a data-open="notes-modal" data-type="player_notes">
                                    <i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                            </div>
                            <div class="cell small-6 text-left">
                                Spelleiding
                            </div>
                            <div class="cell small-6">
                                <a data-open="notes-modal" data-type="sl_notes">
                                    <i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                            </div>
                            <div class="cell small-6 text-left">
                                Privé spelleiding
                            </div>
                            <div class="cell small-6">
                                <a data-open="notes-modal" data-type="sl_private_notes">
                                    <i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cell small-12 medium-8 large-9">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 large-6 text-center">
                    <?= $this->include('character/parts/stats/Stats_Primary') ?>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <?= $this->include('character/parts/stats/Stats_Secundary') ?>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <?= $this->include('character/parts/Professions') ?>                      
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <?= $this->include('character/parts/skills/Skills_Proffesion') ?> 
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <?= $this->include('character/parts/skills/Skills_Combat') ?>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <?= $this->include('character/parts/skills/Skills_Magic') ?>
                    </div>
                </div>                
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 text-center">
                        <?= $this->include('character/parts/Equipment') ?>
                    </div>
                </div>
            </div>
            <div class="cell small-12">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 text-center">
                        <?= $this->include('character/parts/Adventures') ?>
                    </div>
                </div>
            </div>
            <div class="cell small-12">
                <a class="button solid" data-action="character-save"><i class="fa-regular fa-floppy-disk"></i> Opslaan</a>
                <a class="button clear" data-action="character-submit"><i class="fa-regular fa-share-from-square"></i> Opslaan en indienen</a>
            </div>
        </form>
    </div>
</div>
