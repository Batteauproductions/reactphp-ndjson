

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
                                <a data-open="selection-modal" data-type="race">
                                    <span id="race"><i class="fa-solid fa-plus"></i>toevoegen</span>
                                </a>
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
                                <span id="stat-spend_xp"><?php echo $jsonBaseChar['spend_xp']?></span>/<span id="stat-max_xp"><?php echo $jsonBaseChar['max_xp'] ?></span>pt.
                            </div>
                            <div class="cell small-6 text-left">
                                Geld
                            </div>
                            <div class="cell small-6">
                                <span id="stat-currency"><?php echo $jsonBaseChar['currency'] ?></span>
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
                            <?php if (1==2): ?>
                                <div class="cell small-6 text-left">
                                    Patron gunst
                                </div>
                                <div class="cell small-6">
                                    <span id="stat-favour">0</span>
                                </div>
                            <?php endif; ?>
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
                        <div class="info-container">
                            <div id="profession-list">
                                <!-- Dynamic filled -->
                            </div>
                            <a data-open="selection-modal" data-type="profession"><i class="fa-solid fa-plus"></i>toevoegen</a>
                        </div>                        
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Beroeps vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="info-container">
                            <div id="skill_base-list">
                                <!-- Dynamic filled -->
                            </div>
                            <a data-open="selection-modal" data-type="skill_base"><i class="fa-solid fa-plus"></i>toevoegen</a>
                        </div>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Gevechts vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="info-container">
                            <div id="skill_combat-list">
                                <!-- Dynamic filled -->
                            </div>
                            <a data-open="selection-modal" data-type="skill_combat"><i class="fa-solid fa-plus"></i>toevoegen</a>
                        </div>
                    </div>
                    <div class="cell small-12 large-6 text-center">
                        <h1>Magische vaardigheden</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="info-container">
                            <div id="skill_magic-list">
                                <!-- Dynamic filled -->
                            </div>
                            <a data-open="selection-modal" data-type="skill_magic"><i class="fa-solid fa-plus"></i>toevoegen</a>
                        </div>
                    </div>
                </div>
                <div class="grid-x grid-padding-x grid-padding-y show-for-large">
                    <div class="cell small-12 text-center">
                        <h1>Avonturen</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="grid-x grid-margin-x grid-margin-y">
                            <a class="cell small-4 medium-3 large-2" data-open="background-modal">
                                <div class="event-container">
                                    <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>"/>
                                    <span>Achtergrond</span>
                                </div>                              
                            </a>
                            <?php foreach($arrEvents as $event):?>
                                <a class="cell small-4 medium-3 large-2" data-open="adventure-modal" data-id="<?php echo $event->id ?>">
                                    <div class="event-container">
                                        <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->name)).'.png')?>"/>
                                        <span><?php echo $event->name ?></span>
                                    </div>
                                </a>    
                            <?php endforeach; ?>
                        </div>
                    </div>
                </div>
                <div class="grid-x grid-padding-x grid-padding-y show-for-large">
                    <div class="cell small-12 text-center">
                        <h1>Uitrusting</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="grid-x grid-padding-x grid-padding-y">
                            <div class="cell small-4">
                                <div class="info-container">
                                    <div data-id="base_kit-list">
                                        <!-- Dynamic filled -->
                                    </div>
                                    <a data-open="selection-modal" data-type="base_kit"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                            <div class="cell small-8">
                                <div class="info-container">
                                    <div data-id="item-list">
                                        <!-- Dynamic filled -->
                                    </div>
                                    <a data-open="selection-modal" data-type="item_add"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cell small-12 hide-for-large">
                <div class="grid-x grid-padding-x grid-padding-y">
                    <div class="cell small-12 text-center">
                        <h1>Avonturen</h1>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="grid-x grid-margin-x grid-margin-y">
                            <a class="cell small-4 medium-3 large-2" data-open="background-modal">
                                <div class="event-container">
                                    <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>"/>
                                    <span>Achtergrond</span>
                                </div>                              
                            </a>
                            <?php foreach($arrEvents as $event):?>
                                <a class="cell small-4 medium-3 large-2" data-open="adventure-modal" data-id="<?php echo $event->id ?>">
                                    <div class="event-container">
                                        <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->name)).'.png')?>"/>
                                        <span><?php echo $event->name.' - '.$event->description ?></span>
                                    </div>
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
                            <div class="cell small-12 medium-6">
                                <div class="info-container">
                                    <div data-id="base_kit-list">
                                        <!-- Dynamic filled -->
                                    </div>
                                    <a data-open="selection-modal" data-type="base_kit"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                            <div class="cell small-12 medium-6">
                                <div class="info-container">
                                    <div data-id="item-list">
                                        <!-- Dynamic filled -->
                                    </div>
                                    <a data-open="selection-modal" data-type="item_add"><i class="fa-solid fa-plus"></i>toevoegen</a>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="cell small-12">
                <button class="button solid" formaction="<?php echo base_url('action/save-character'); ?>"><i class="fa-regular fa-floppy-disk"></i> Opslaan</button>
                <button class="button clear" formaction="<?php echo base_url('action/submit-character'); ?>"><i class="fa-regular fa-share-from-square"></i> Opslaan en indienen</button>
            </div>
        </form>
    </div>
</div>

<div class="reveal large" id="selection-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="modal-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div id="selection-modal-dropdowns" class="cell small-12 medium-4 large-3">
            <select name="type" data-name="" data-action="collect" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <select name="subtype" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <section id="choice-details">
                <!-- dynamic filled -->
            </section>
        </div>
        <div class="cell small-12 medium-8 large-9">
            <div id="choice-description">
                <!-- dynamic filled -->
            </div>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>

</div>

<div class="reveal large" id="background-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="background-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
    
</div>

<div class="reveal large" id="adventure-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="adventure-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div class="cell small-12">
            <label for="question_1">Wat heb je dit evenement ondernomen?</label>
            <textarea id="question_1" name="question_1"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_2">Wat heeft dit met je personage gedaan?</label>
            <textarea id="question_2" name="question_2"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_3">Heb je relaties/contacten opgebouwd met npc’s?</label>
            <textarea id="question_3" name="question_3"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_4">Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?</label>
            <textarea id="question_4" name="question_4"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_5">Wat zijn je plannen komend evenement?</label>
            <textarea id="question_5" name="question_5"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_6">Overige toevoeging? (optioneel)</label>
            <textarea id="question_6" name="question_6"></textarea>
        </div>
        <div class="cell small-12">
            <button class="button solid"><i class="fa-regular fa-floppy-disk"></i> Opslaan</button>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
    
</div>