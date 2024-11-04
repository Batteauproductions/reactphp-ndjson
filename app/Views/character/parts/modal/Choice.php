<!-- MODAL FOR MAKING CHOICES -->
<div class="reveal large" id="selection-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="modal-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div id="selection-modal-dropdowns" class="cell small-12 medium-12 large-3">
            <select name="type" data-name="" data-action="collect" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <select name="subtype" style="display:none;">
                <option value="" disabled selected>Geen voorkeur</option>
            </select>
            <input type="number" name="amount" value="1" style="display:none;"/>
        </div>
        <img id="choice-image" src="" alt="" class="cell small-6 medium-4 large-3" style="display:none;"/>
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