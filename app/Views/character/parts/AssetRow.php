<div class="grid-x choice-row">
    <!-- <?php print_r($item) ?> -->
    <div class="cell small-5 text-left">
        <?= $item->name ?><?= isset($item->rank) && $item->rank <= $item->max_rank && $item->max_rank > 1 ? ' (niveau '.$item->rank.')' : '' ?>
    </div>
    <div class="cell small-5 text-center">
        <?= isset($item->sub_name) ? $item->sub_name : ''; ?>
    </div>
    <div class="cell small-2 text-right">
        <?= isset($item->cost) ? getCost($item->cost) : ''; ?> 
    </div>
</div>