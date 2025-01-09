<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">        
            <form id="event-create" class="cell sortable">
                <div class="grid-x grid-margin-x grid-margin-y align-bottom">
                    <div class="cell small-6 input-group">
                        <label for="name" class="input-group-label">
                            Naam
                        </label>
                        <input 
                            required
                            type="text" 
                            class="input-group-field" 
                            name="name" 
                            placeholder="Bv. Dalaria I.IV"
                            value="<?php echo isset($_POST['name']) ? htmlspecialchars($_POST['name']) : ''; ?>">
                    </div>
                    
                    <div class="cell small-6 input-group">
                        <label for="name" class="input-group-label">
                            IC datum
                        </label>
                        <input 
                            required
                            type="text" 
                            class="input-group-field" 
                            name="story_date" 
                            placeholder="Bv. 15 t/m 17 Ammonat (895:2)">
                    </div>
                    <div class="cell small-6 input-group">
                        <label for="name" class="input-group-label">
                            IC datum
                        </label>
                        <input 
                            required
                            type="datetime-local"
                            class="input-group-field" 
                            name="oc_start_time" 
                            placeholder="Bv. 15 t/m 17 Ammonat (895:2)"
                            value="<?php echo isset($_POST['oc_start_time']) ? htmlspecialchars($_POST['oc_start_time']) : ''; ?>">
                    </div>
                    <div class="cell small-6 input-group">
                        <label for="name" class="input-group-label">
                            IC datum
                        </label>
                        <input 
                            required
                            type="datetime-local" 
                            class="input-group-field" 
                            name="oc_end_time" 
                            value="<?php echo isset($_POST['oc_end_time']) ? htmlspecialchars($_POST['oc_end_time']) : ''; ?>">
                    </div>
                    <div class="cell small-12 input-group">
                        <label for="name" class="input-group-label">
                            Beschrijving
                        </label>
                        <textarea 
                            required
                            class="input-group-field" 
                            name="description"
                            rows="10">
                            <?php echo isset($_POST['description']) ? htmlspecialchars($_POST['description']) : ''; ?>
                        </textarea>
                    </div>
                    <div class="cell small-12 input-group">
                        <button class="button solid" type="submit">
                            <i class="fa-regular fa-floppy-disk"></i>Evenement opslaan
                        </button>
                    </div>
                </div>
            </form>
        </section>
    </div>
</div>
