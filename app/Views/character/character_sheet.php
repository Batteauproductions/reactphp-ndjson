

<div class="grid-container">
    <div class="page-wrapper transparent">
        <form id="form-character" class="grid-x grid-padding-x grid-padding-y form-character" method="POST" action="<?php echo base_url(''); ?>">

            <!-- Tool information -->
            <input type="hidden" name="jsonBaseChar" value='<?php echo json_encode($jsonBaseChar) ?>'/>
            <input type="hidden" name="jsonStat" value='<?php echo json_encode($jsonStat) ?>'/>
            <input type="hidden" name="arrXP" value='<?php echo $arrXP ?>'/>
            <input type="hidden" name="arrProfLevel" value='<?php echo $arrProfLevel ?>'/>
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
                                sssss
                            </div>
                            <div class="cell small-6 text-left">
                                Raskeuze
                            </div>
                            <div class="cell small-6">
                                <a data-open="selection-modal" data-type="race">
                                    <span id="race"><i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
                            </div>
                            <div class="cell small-6 text-left">
                                Vaardigheid
                            </div>
                            <div class="cell small-6">
                                <span id="spend_xp"><?php echo $jsonBaseChar['spend_xp']?></span>/<span id="max_xp"><?php echo $jsonBaseChar['max_xp'] ?></span>pt.
                            </div>
                            <div class="cell small-6 text-left">
                                Geld
                            </div>
                            <div class="cell small-6">
                                <span id="stat-currency"><?php echo $jsonBaseChar['currency'] ?></span> goud
                            </div>
                        </div>
                    </div>
                    <div class="cell small-12">
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
                                Favour
                            </div>
                            <div class="cell small-6">
                                <span id="stat-favour">0</span>
                            </div>
                        </div>
                    </div>
                    <div class="cell small-12">
                        <div class="grid-x align-middle info-container">
                            <div class="cell small-6 text-left">
                                Kracht
                            </div>
                            <div class="cell small-6">
                                <span id="stat-str"><?php echo $jsonBaseChar['str'] ?></span>
                            </div>
                            <div class="cell small-6 text-left">
                                Behendingheid
                            </div>
                            <div class="cell small-6">
                                <span id="stat-dex"><?php echo $jsonBaseChar['dex'] ?></span>
                            </div>
                            <div class="cell small-6 text-left">
                                Intelligentie
                            </div>
                            <div class="cell small-6">
                                <span id="stat-intel"><?php echo $jsonBaseChar['intel'] ?></span>
                            </div>
                            <div class="cell small-6 text-left">
                                Clues
                            </div>
                            <div class="cell small-6">
                                <span id="stat-clues">0</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cell small-12 medium-8 large-9">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 large-6 text-center">
                        <h1>Beroep(en)</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div id="profession-list" class="grid-x align-middle info-container">
                            <div class="cell small-12 text-center">
                                <a data-open="selection-modal" data-type="profession"><i class="fa-solid fa-plus"></i>toevoegen</a>
                            </div>
                        </div>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Beroeps vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div id="skill_base-list" class="grid-x align-middle info-container">                          
                            <div class="cell small-12 text-center">
                                <a data-open="selection-modal" data-type="skill_base"><i class="fa-solid fa-plus"></i>toevoegen</a>
                            </div>
                        </div>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Gevechts vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div id="skill_combat-list" class="grid-x align-middle info-container">
                            <div class="cell small-12 text-center">
                                <a data-open="selection-modal" data-type="skill_combat"><i class="fa-solid fa-plus"></i>toevoegen</a>
                            </div>
                        </div>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Magische vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div id="skill_magic-list" class="grid-x align-middle info-container">
                            <div class="cell small-12 text-center">
                                <a data-open="selection-modal" data-type="skill_magic"><i class="fa-solid fa-plus"></i>toevoegen</a>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 text-center">
                        <h1>Avonturen</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="grid-x grid-margin-x grid-margin-y">
                            <a class="cell small-4 medium-3 large-2">
                                <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>"/>
                            </a>
                            <?php foreach($arrEvents as $event):?>
                                <a class="cell small-4 medium-3 large-2">
                                    <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->name)).'.png')?>"/>
                                </a>    
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 text-center">
                        <h1>Uitrusting</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="grid-x grid-padding-x grid-padding-y">
                            <div class="cell small-4">
                                <div class="info-container">
                                    <a data-open="selection-modal" data-type="skill_magic"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                            <div class="cell small-8">
                                <div class="info-container">
                                    <a data-open="selection-modal" data-type="skill_magic"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cell small-12">
            </div>
            <div class="cell small-12">
                <button class="button solid"><i class="fa-regular fa-floppy-disk"></i> Opslaan</button>
                <button class="button clear"><i class="fa-regular fa-share-from-square"></i> Opslaan en indienen</button>
            </div>
        </form>
    </div>
</div>

<div class="reveal large" id="selection-modal" data-reveal>
    
    <div id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>
    <form id="modal-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div id="selection-modal-dropdowns" class="cell small-3">
            <select name="type" data-name="" data-action="collect" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <select name="subtype" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <section id="rank-options" style="display:none;">
                <!-- dynamic filled -->
            </section>
        </div>
        <div id="description" class="cell small-9" style="display:none;">
            <h1 data-title></h1>
            <p data-description></p>
            <p class="" style="display:none" choice-message></p>
            <a data-action="race-choose" class="button solid"><i class="fa-regular fa-square-check"></i>kiezen</a>
            <a data-link href="" class="button clear" target="_blank" ><i class="fa-solid fa-circle-info"></i>meer informatie</a>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
</div>
