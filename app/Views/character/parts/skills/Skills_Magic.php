<div class="info-container">
    <h2>Magische vaardigheden</h2>
    <hr>
    <div data-id="skill_magic-list">
        <!-- Dynamic filled -->
        <?php if(isset($arrSkills)): ?>
            <?php foreach($arrEvents as $event):?>                
                <?= view('character/parts/Profile', ['attribute' => 'skill']) ?>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <a data-action="pick-skill-magic"><i class="fa-solid fa-plus"></i>toevoegen</a>
</div>