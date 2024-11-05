<!-- MODAL FOR MAKING CHOICES -->
<div class="reveal large" id="selection-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="modal-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div id="selection-modal-dropdowns" class="cell small-12 medium-12 large-3">
            <select name="type" style="display:none;">
                <!-- dynamic filled -->
            </select>
            <select name="subtype" style="display:none;">
                <!-- dynamic filled -->
            </select>
            <input type="number" name="amount" value="1" style="display:none;"/>
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