<!-- MODAL FOR MAKING CHOICES -->
<div class="reveal large" id="selection-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="modal-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div id="selection-modal-dropdowns" class="cell small-12 medium-12 large-3">
            <div class="grid-x">
                <label id="lbl-type" for="type" class="cell" style="display:none;">Type
                    <select id="type" name="type" class="chosen-select">
                        <!-- dynamic filled -->
                    </select>
                </label>
                <label id="lbl-subtype" for="subtype" class="cell" style="display:none;">Sub-type
                    <select id="subtype" name="subtype" class="chosen-select">
                        <!-- dynamic filled -->
                    </select>
                </label>
                <label id="lbl-amount" for="amount" class="cell" style="display:none;">
                    Hoeveelheid
                    <input id="amount" type="number" name="amount" value="1" />
                </label>
            </div>
        </div>
        <div id="choice-image-container" class="cell small-12 medium-6 large-3" style="display:none;">
            <img id="choice-image" src="" alt="" />
        </div>        
        <div class="cell auto">
            <section id="choice-description">
                <!-- dynamic filled -->
            </section>
            <section id="choice-details">
                <!-- dynamic filled -->
            </section>
            <section id="choice-actions">
                <!-- dynamic filled -->
            </section>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>

</div>