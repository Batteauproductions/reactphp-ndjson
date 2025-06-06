<section>
    <h1>Avonturen</h1>
    <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
    <div class="grid-x grid-margin-x grid-margin-y">
        <a class="cell small-4 medium-3" data-action="edit-background">
            <div class="event-container">
                <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>"/>
                <span>Achtergrond</span>
            </div>                              
        </a>
        <?php foreach($arrEvents as $event):?>
            <a class="cell small-4 medium-3" data-action="edit-adventure" data-id="<?php echo $event->id ?>" data-date="<?php echo $event->oc_end_time ?>">
                <div class="event-container">
                    <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->title)).'.png')?>"/>
                    <span><?php echo $event->title.' - '.$event->name ?></span>
                </div>
            </a>    
        <?php endforeach; ?>
    </div>
</section>