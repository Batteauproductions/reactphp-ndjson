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