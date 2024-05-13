<div class="grid-container">
    <div class="page-wrapper transparent">
        <form id="form-character" method="POST" action="<?php echo base_url(''); ?>">
            <section class="grid-x grid-padding-x grid-padding-y">
                <div class="cell shrink">
                    <section>
                        <div class="profile"> 
                            <div class="profile-avatar text-left">
                                <label class="profile-avatar-action">
                                    <input id="avatar" type="file" name="avatar" value="" placeholder="" hidden>
                                    <ul>
                                        <li>Enkel bestanden van maximaal 2mb</li>                                    
                                        <li>De extensies .jpg en .png zijn toegestaan</li>
                                        <li>Aspect ratio van 1:1 wordt aangeraden</li>
                                    </ul>
                                </label>
                                <img src="<?php echo image_path('elements/anonymous_avatar.png') ?>" height="150"/>
                            </div>                        
                        </div>
                    </section>
                    <section class="text-center">
                        <h2>Basis</h2>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="input-group">
                            <label for="base-playername" class="input-group-label">
                                Naam
                            </label>
                            <input id="base-playername" class="input-group-field" name="base-playername" type="text" value="" disabled>
                        </div> 
                        <div class="input-group">
                            <label for="name" class="input-group-label">
                                Karakternaam
                            </label>
                            <input id="base-name" class="input-group-field" name="base-name" type="text" value="">
                        </div> 
                        <div class="input-group">
                            <label for="race" class="input-group-label">
                                Ras
                            </label>
                            <select id="race" class="input-group-field" name="race" type="text">
                                <option value="" selected disabled>Maak een keuze</option>
                                <?php foreach($arrRace as $race):?>
                                    <option value="<?php echo $race->id ?>"><?php echo $race->name ?></option>
                                <?php endforeach;?> 
                            </select>
                        </div>
                        <div class="input-group">
                            <label for="stat-mana" class="input-group-label">
                                Mana
                            </label>
                            <input id="stat-mana" class="input-group-field" name="stat-mana" type="number" value="0" disabled>
                        </div>                    
                        <div class="input-group">
                            <label for="stat-godpoints" class="input-group-label">
                                Godpunten
                            </label>
                            <input id="stat-godpoints" class="input-group-field" name="stat-godpoints" type="number" value="0" disabled>
                        </div>
                    </section>
                </div>
                <div class="cell shrink text-center"> 
                    <section>
                        <h2>Primair</h2>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="input-group">
                            <label for="stat-hitpoints" class="input-group-label">
                                Levenspunten
                            </label>
                            <input id="stat-hitpoints" class="input-group-field" name="stat-hitpoints" type="number" value="0" disabled>
                        </div> 
                        <div class="input-group">
                            <label for="stat-sanity" class="input-group-label">
                                Sanity
                            </label>
                            <input id="stat-sanity" class="input-group-field" name="stat-sanity" type="number" value="0" disabled>
                        </div>
                        <div class="input-group">
                            <label for="stat-mana" class="input-group-label">
                                Mana
                            </label>
                            <input id="stat-mana" class="input-group-field" name="stat-mana" type="number" value="0" disabled>
                        </div>                    
                        <div class="input-group">
                            <label for="stat-godpoints" class="input-group-label">
                                Godpunten
                            </label>
                            <input id="stat-godpoints" class="input-group-field" name="stat-godpoints" type="number" value="0" disabled>
                        </div> 
                    </section> 
                    <section>
                        <h2>Secundair</h2>
                        <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                        <div class="input-group">
                            <label for="stat-strength" class="input-group-label">
                                Kracht
                            </label>
                            <input id="stat-strength" class="input-group-field" name="stat-strength" type="number" value="0" disabled>
                        </div> 
                        <div class="input-group">
                            <label for="stat-dexteriy" class="input-group-label">
                                Behendigheid
                            </label>
                            <input id="stat-dexteriy" class="input-group-field" name="stat-dexteriy" type="number" value="0" disabled>
                        </div>
                        <div class="input-group">
                            <label for="stat-intelligence" class="input-group-label">
                                Intelligentie
                            </label>
                            <input id="stat-intelligence" class="input-group-field" name="stat-intelligence" type="number" value="0" disabled>
                        </div> 
                    </section>
                </div> 
            </section>
            <section class="grid-x grid-padding-x grid-padding-y">
            </section>
        </form>
    </div>
</div>