<?php
    $created_dt = isset($oCharacter) ? $oCharacter->meta->created_dt : null;
    $lastlocked_dt = isset($oCharacter) ? $oCharacter->meta->lastlocked_dt : null;
    $canEdit = !isset($oCharacter) || in_array($oCharacter->meta->status, CHARACTER_EDITABLE);
    $action = $canEdit ? 'edit-background' : 'view-background';
?>

<section>
    <h1>Avonturen</h1>
    <img class="spacer-image" src="<?= image_path('elements/header-img.png') ?>" alt="-"/>
    <div class="grid-x grid-margin-x grid-margin-y">
        <a class="cell small-4 medium-3 large-2" data-action="<?= $action ?>">
            <div class="event-container">
                <img src="<?= image_path('elements/anonymous_avatar.png') ?>"/>
                <span>Achtergrond</span>
            </div>                              
        </a>
        <?php foreach($arrEvents as $event):?>
            <?php 
                $passedLocked_dt = $lastlocked_dt !== null ? $lastlocked_dt < $event->oc_end_time : true;
                $missedAdventure = $created_dt !== null ? $created_dt > $event->oc_end_time : true;
                $eventPassed = $created_dt !== null ? $created_dt < $event->oc_start_time : true;
                $futureEvent = $event->oc_start_time > date('Y-m-d H:i:s');
                $canEditAdventure =  !$passedLocked_dt && !$missedAdventure && !$eventPassed && !$futureEvent;
                // --
                $actionAdventure = $canEditAdventure ? 'edit-adventure' : 'view-adventure';
                $disabled = $missedAdventure || $futureEvent ? 'disabled' : '';
            ?>
            <a class="cell small-4 medium-3 large-2 <?= $disabled ?>" data-action="<?= $actionAdventure ?>" data-id="<?= $event->id ?>">
                <div class="event-container">
                    <img src="<?= image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->title)).'.png')?>"/>
                    <span><?= $event->title.' - '.$event->name ?></span>
                </div>
            </a>    
        <?php endforeach; ?>
    </div>
</section>