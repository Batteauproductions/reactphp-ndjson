<div class="grid-x choice-row animate__animated animate__fadeInLeft" 
        data-profession_id="<?php echo $row->id ?>" 
        data-profession_sub_id="<?php echo isset($row->sub_id) ? $row->sub_id : null ?>">
    <div data-column="name" class="cell small-5 medium-4 text-left">
        <i class="fa-regular fa-star" aria-hidden="true"></i>
        <?php echo $row->name.' (niveau'.$row->rank.')';?>
    </div>
    <div data-column="sub_name" class="cell small-5 medium-4 text-center">
        <?php echo $row->sub_name;?>
    </div>
    <div data-column="cost" class="cell small-2 medium-1 text-right">
        <?php echo $row->cost;?>
    </div>
    <div class="cell small-12 medium-3 text-right" data-column="action">
        <a data-action="<?php echo $attribute ?>-downgrade" data-id="<?php echo $row->id ?>" data-sub_id="<?php echo isset($row->sub_id) ? $row->sub_id : null ?>"><i class="fa-solid fa-chevron-down" aria-hidden="true"></i></a>    
        <a data-action="<?php echo $attribute ?>-upgrade" data-id="<?php echo $row->id ?>" data-sub_id="<?php echo isset($row->sub_id) ? $row->sub_id : null ?>"><i class="fa-solid fa-chevron-up" aria-hidden="true"></i></a>
        <a data-action="<?php echo $attribute ?>-remove" data-id="<?php echo $row->id ?>" data-sub_id="<?php echo isset($row->sub_id) ? $row->sub_id : null ?>"><i class="fa-solid fa-xmark" aria-hidden="true"></i></a>
    </div>
</div>

