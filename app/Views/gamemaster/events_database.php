<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">
        </section>
        <section class="grid-x grid-padding-x grid-padding-y">
            <div class="cell">
                <div class="grid-x grid-x grid-margin-x grid-margin-y" data-equalizer>
                    <?php foreach($arrEvents as $event):?>
                        <a class="cell small-6 content-wrapper solid" href="<?php echo base_url('gamemaster/event/edit/'.$event->id)?>">
                            <div class="grid-x grid-margin-x align-middle">
                                <div class="cell small-12 medium-6 large-4">
                                    <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->name)).'.png')?>"/>
                                </div>
                                <div class="cell small-12 medium-6 large-8">
                                    <h1><?php echo $event->name;?></h1>
                                    <p>
                                        <strong>Ingame datum:</strong> <?php echo $event->story_date;?><br>
                                        <strong>Outgame datum:</strong> <?php echo date('d-m-y', strtotime($event->oc_start_time)) . ' t/m ' . date('d-m-y', strtotime($event->oc_end_time)); ?>
                                    </p>
                                </div>
                            </div>
                        </a>
                    <?php endforeach; ?>
                </div>
            </div>  
        </section>
    </div>
</div>