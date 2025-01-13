<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">        
            <form   id="event-create" 
                    class="cell sortable" 
                    method="post" 
                    action="<?php echo isset($oEvent) ? base_url('event/update-form') : base_url('event/submit-form'); ?>"
                >
                <input type="hidden" name="form_id" value="<?php echo isset($oEvent) ? $oEvent->id : ''?>"/>
                <div class="grid-x grid-margin-x grid-margin-y">
                    <div class="cell small-12 medium-6">
                        <div class="input-wrapper">
                            <label for="name">
                                Naam
                            </label>
                            <input 
                                required
                                type="text" 
                                name="name" 
                                value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : (isset($oEvent) ? $oEvent->name : ''); ?>"
                                placeholder="Bv. Dalaria I.IV">
                        </div>
                    </div>
                    <div class="cell small-12 medium-6">
                        <div class="input-wrapper">
                            <label for="name">
                                Subtitel
                            </label>
                            <input 
                                required
                                type="text" 
                                name="subname" 
                                value="<?php echo isset($_POST['subname']) ? htmlspecialchars($_POST['subname']) : (isset($oEvent) ? $oEvent->subname : ''); ?>"
                                placeholder="Bv. Het midzomerfeest">
                        </div>
                    </div>
                    <div class="cell small-12 medium-4">
                        <div class="input-wrapper">
                            <label for="story_date">
                                IC datum
                            </label>
                            <input 
                                required
                                type="text" 
                                name="story_date" 
                                value="<?php echo isset($_POST['story_date']) ? htmlspecialchars($_POST['story_date']) : (isset($oEvent) ? $oEvent->story_date : ''); ?>"
                                placeholder="Bv. 15 t/m 17 Ammonat (895:2)">
                        </div>
                    </div>
                    <div class="cell small-12 medium-4">
                        <div class="input-wrapper">
                            <label for="oc_start_time">
                                OC start-datum
                            </label>
                            <input 
                                required
                                type="datetime-local"
                                name="oc_start_time" 
                                value="<?php echo isset($_POST['oc_start_time']) ? htmlspecialchars($_POST['oc_start_time']) : (isset($oEvent) ? $oEvent->oc_start_time : ''); ?>">
                        </div>
                    </div>
                    <div class="cell small-12 medium-4">
                        <div class="input-wrapper">
                            <label for="oc_end_time">
                                OC eind-datum
                            </label>
                            <input 
                                required
                                type="datetime-local" 
                                name="oc_end_time" 
                                value="<?php echo isset($_POST['oc_end_time']) ? htmlspecialchars($_POST['oc_end_time']) : (isset($oEvent) ? $oEvent->oc_end_time : ''); ?>">
                        </div>
                    </div>
                    <div class="cell small-12">
                        <div class="input-wrapper">
                            <label for="description">
                                Beschrijving
                            </label>
                            <textarea name="description" rows="10"><?php echo isset($_POST['description']) ? htmlspecialchars($_POST['description']) : (isset($oEvent) ? $oEvent->description : ''); ?></textarea>
                        </div>
                    </div>
                    <div class="cell small-12 input-group">
                        <button class="button solid" type="submit">
                            <?php
                                echo !isset($oEvent) 
                                    ? '<i class="fa-regular fa-floppy-disk"></i>Evenement opslaan' 
                                    : '<i class="fa-regular fa-floppy-disk"></i>Evenement updaten';
                                ?>
                        </button>
                        <a class="button clear" href="<?php echo base_url('gamemaster/event/database') ?>">
                            <i class="fa-solid fa-backward-step"></i>Terug
                        </a>
                    </div>
                </div>
            </form>
        </section>
    </div>
</div>
