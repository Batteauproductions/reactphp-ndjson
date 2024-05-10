
<div class="grid-container">
    <div class="page-wrapper transparent">
        <section class="grid-x grid-padding-x grid-padding-y">  
            <div id="encoder-wrapper" class="cell small-12">
                <h1>Text coderen</h1>
                <form id="encoder-container" class="grid-x grid-padding-x grid-padding-y" data-equalizer data-equalize-on="medium">
                    <div class="cell small-12 medium-2" data-equalizer-watch>
                        <label for="shift-amount">Shift amount</label>
                        <select id="shift-amount">					
                            <option value="5">LALA</option>
                            <option value="8">CICI</option>
                            <option value="12">DRDR</option>
                            <option value="19">ZOZO</option>
                            <option value="23">KEKE</option>					
                        </select>
                    </div>
                    <div class="cell small-12 medium-5" data-equalizer-watch>
                        <label id="input-text">Originele Text</label>
                        <textarea type="text" id="input-text" rows="10"></textarea>
                    </div>
                    <div class="cell small-12 medium-5" data-equalizer-watch>
                        <label>Codex
                            <div id="result-codex">
                            <!-- DYNAMIC CONTENT-->
                            </div>
                        </label>
                    </div>
                    <div class="cell small-12">
                        <a id="shift-letters" class="button solid" onclick="shiftLetters()"><i class="fa-solid fa-code"></i> Shift Letters</a>
                        <a id="copy-letters" class="button clear" onclick="copyToClipboard()" disabled><i class="fa-solid fa-copy"></i> Resultaat kopieren</a>
                    </div>
                </form>
            </div> 
        </section>
    </div>  
</div>


