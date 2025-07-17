<div class="grid-x choice-row">
    <div class="cell small-7 text-left">
        <?= $item->name ?><?= isset($item->rank) && $item->rank <= $item->max_rank && $item->max_rank > 1 ? ' (niveau '.$item->rank.')' : '' ?>
    </div>
    <div class="cell small-4 text-center">
        <?= isset($item->sub_name) ? $item->sub_name : ''; ?>
    </div>
    <div class="cell small-1 text-right">
        <?= isset($item->cost) ? getCost($item) : ''; ?> 
    </div>
</div>