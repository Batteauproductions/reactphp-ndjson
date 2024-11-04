<!-- MODAL FOR LOGGING BACKGROUND -->
<div class="reveal large" id="background-modal" data-reveal>
    
    <div data-id="modal-loading" class="text-center">
        <i class="fa-solid fa-spinner fa-spin"></i> Gegevens laden
    </div>

    <form id="background-form" class="grid-x grid-padding-x grid-padding-y" style="display:none;">
        <div class="cell small-12 text-left">
            <h1>Background</h1>
            <p>
                Om een nieuw personage te beginnen zijn er een aantal stappen die doorlopen moeten worden. 
                Uiteraard begint dit met de belangrijke vragen; “Wie ben ik?” en “Wat is mijn doel?”. 
                Een background voor een personage is niet alleen belangrijk voor jezelf om je personage diepgang te geven, maar ook voor de spelleiding om (potentieel) plot op je pad te brengen die jouw personage direct aangaan of een link hebben met het verleden van je
                personage.
            <p>
        </div>
        <div id="ck-count-wrapper" class="cell small-12 text-left">	
            <div id="ck-count-container" >                
                <textarea name="background" id="background" rows="30" maxlength="9000"><?php echo (isset($oCharacter->background) ? $oCharacter->background : ''); ?></textarea>								
                <div class="update__controls">
                    <span class="update__words"></span>
                    <svg class="update__chart" viewBox="0 0 40 40" width="40" height="40" xmlns="http://www.w3.org/2000/svg">
                        <circle stroke="hsl(0, 0%, 93%)" stroke-width="3" fill="none" cx="20" cy="20" r="17"></circle>
                        <circle class="update__chart__circle" stroke="hsl(202, 92%, 59%)" stroke-width="3" stroke-dasharray="106,106" stroke-linecap="round" fill="none" cx="20" cy="20" r="17"></circle>
                        <text class="update__chart__characters" x="50%" y="50%" dominant-baseline="central" text-anchor="middle">-3</text>
                    </svg>
                </div>							                
            </div>
        </div>
    </form>
    
    <button class="close-button" data-close aria-label="Close modal" type="button">
        <span aria-hidden="true">&times;</span>
    </button>
    
</div>