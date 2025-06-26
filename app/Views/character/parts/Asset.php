<div class="info-container">
    <h2><?= $title; ?></h2>
    <hr>
    <div data-id="<?= $id.'-list'; ?>">
        <!-- Dynamic filled -->
        <?php if(isset($array)): ?>
            <?php foreach($array as $item):?>                
                <div class="grid-x choice-row">
                    <div class="cell small-5 medium-4 text-left">
                        <?= $item->name ?>
                    </div>
                    <div class="cell small-5 medium-4 text-center">
                        <?= isset($item->sub_name) ? $item->sub_name : ''; ?>
                    </div>
                    <div class="cell small-2 medium-1 text-right">
                        <?= $item->racial ? 'ras' : $item->cost.'vp' ?>
                    </div>
                </div>
            <?php endforeach; ?>
        <?php endif; ?>
    </div>
    <?php if(!isset($print) || !$print): ?>
        <a data-action="<?= 'pick-'.$id; ?>" class="hide-for-print"><i class="fa-solid fa-plus"></i>toevoegen</a>
    <?php endif; ?>
</div>