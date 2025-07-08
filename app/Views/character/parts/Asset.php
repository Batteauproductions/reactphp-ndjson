<div class="info-container">
    <h2><?= $title; ?></h2>
    <hr>
    <div data-id="<?= $id.'-list'; ?>">
        <?php if (isset($array)): ?>
            <?php foreach ($array as $item): ?>  
                <?php if (isset($skill_set) && isset($item->skill_type)): ?>
                    <?php if (in_array($item->skill_type, $skill_set)): ?>
                        <?= view('character/parts/AssetRow', ['item' => $item]); ?>
                    <?php endif; ?>
                <?php else: ?>
                    <?= view('character/parts/AssetRow', ['item' => $item]); ?>
                <?php endif; ?>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <?php if(!isset($print) || !$print): ?>
        <a data-action="<?= 'pick-'.$id; ?>" class="hide-for-print"><i class="fa-solid fa-plus"></i>toevoegen</a>
    <?php endif; ?>
</div>