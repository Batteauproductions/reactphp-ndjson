<section id="professions">
    <div class="info-container">
        <h2>Beroep(en)</h2>
        <hr>
        <div data-id="profession-list">
            <!-- Dynamic filled -->
            <?php if(isset($arrSkills)): ?>
                <?php foreach($arrEvents as $event):?>                
                    <?= view('character/parts/Profile', ['attribute' => 'profession']) ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
        <a data-action="pick-profession"><i class="fa-solid fa-plus"></i>toevoegen</a>
    </div>
</section>