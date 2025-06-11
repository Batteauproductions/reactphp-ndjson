<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-padding-x grid-padding-y">
            <div class="cell small-12 medium-4 large-3">
                <a class="button solid" href="<?php echo base_url('gamemaster/event/create');?>">
                    <i class="fa-regular fa-calendar-plus"></i>Evenement toevoegen
                </a>
                <hr>
            </div>            
            <div class="cell small-12 medium-8 large-9">
                <div class="grid-x grid-x grid-margin-x grid-margin-y" data-equalizer>
                    <?php foreach($arrEvents as $event):?>
                        <a class="cell small-12 large-6 content-wrapper content-wrapper--event-card solid" href="<?php echo base_url('gamemaster/event/edit/'.$event->id)?>">
                            <div class="grid-x grid-margin-x align-middle">
                                <div class="cell small-6">
                                    <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->title)).'.png')?>"/>
                                </div>
                                <div class="cell small-6">
                                    <h1><?php echo $event->title;?></h1>
                                    <h2><?php echo $event->name;?></h2>
                                    <p>
                                        <strong>Ingame datum:</strong><br><?php echo $event->story_date;?><br>
                                    </p>
                                    <p>
                                    <strong>Outgame datum:</strong><br><?php echo date('d-m-y', strtotime($event->oc_start_time)) . ' t/m ' . date('d-m-y', strtotime($event->oc_end_time)); ?>
                                    </p>
                                </div>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>  
        </div>
    </section>
</div>