<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">
            <div class="cell sortable">
                <a class="button solid" href="<?php echo base_url('gamemaster/event/create');?>">
                    <i class="fa-regular fa-calendar-plus"></i>Evenement toevoegen
                </a>
                <hr>
            </div>            
        </section>
        <section class="grid-x grid-padding-x grid-padding-y">
            <div class="cell">
                <div class="grid-x grid-x grid-margin-x grid-margin-y" data-equalizer>
                    <?php foreach($arrEvents as $event):?>
                        <a class="cell small-6 medium-6 large-4 content-wrapper solid" href="<?php echo base_url('gamemaster/event/edit/'.$event->id)?>">
                            <div class="grid-x grid-margin-x align-middle">
                                <div class="cell small-12 medium-6">
                                    <img src="<?php echo image_path('events/event_'.strtolower(str_replace([' ', '.'], '_',$event->name)).'.png')?>"/>
                                </div>
                                <div class="cell small-12 medium-6">
                                    <h1><?php echo $event->name;?></h1>
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
        </section>
    </div>
</div>