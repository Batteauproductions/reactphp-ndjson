<!-- MODAL FOR LOGGING ADVENTURES -->
<div class="reveal large" id="adventure-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="adventure-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div class="cell small-12">
            <label for="question_1">Wat heb je dit evenement ondernomen?</label>
            <textarea id="question_1" name="question_1"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_2">Wat heeft dit met je personage gedaan?</label>
            <textarea id="question_2" name="question_2"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_3">Heb je relaties/contacten opgebouwd met npc’s?</label>
            <textarea id="question_3" name="question_3"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_4">Wat heb je bijgeleerd (info) en welke theorieën leid je er uit af?</label>
            <textarea id="question_4" name="question_4"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_5">Wat zijn je plannen komend evenement?</label>
            <textarea id="question_5" name="question_5"></textarea>
        </div>
        <div class="cell small-12">
            <label for="question_6">Overige toevoeging? (optioneel)</label>
            <textarea id="question_6" name="question_6"></textarea>
        </div>
        <div class="cell small-12">
            <button class="button solid"><i class="fa-regular fa-floppy-disk"></i> Opslaan</button>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
    
</div>