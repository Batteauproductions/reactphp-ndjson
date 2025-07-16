<?php if (!$skill): ?>
    <p>Skill data missing.</p>
<?php else: ?>
    <div class="cell tile">      
        <div class="tile-content">
            <table role="presentation" class="no-spacing">
                <thead>
                    <tr>
                        <td class="text-center">
                            <h3><?= isset($skill->sub_name) ? $skill->name.' ('.$skill->sub_name.') ' : $skill->name; ?></h3>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>
                            <p><?= $skill->description ?></p>
                        </td>
                    </tr>
                    <tr>
                        <td class="no-spacing">
                            <?php if($skill->cost): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-brain"></i>
                                    </div>
                                    <div class="cell auto">
                                        <?= $skill->cost ?> vaardigheidspunt(en)
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->requirements): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-star-of-life"></i>
                                    </div>
                                    <div class="cell auto">
                                        <?php
                                            $arrReq = explode('|',$skill->requirement_name);
                                            foreach($arrReq as $requirement) {
                                                echo '<li>'.$requirement.'</li>';
                                            }
                                        ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->disclaimer): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-triangle-exclamation"></i>
                                    </div>
                                    <div class="cell auto">
                                        <ul class="no-spacing">
                                            <?php
                                                $arrDisc = explode('|',$skill->disclaimer);
                                                foreach($arrDisc as $disclaimer) {
                                                    echo '<li>'.$disclaimer.'</li>';
                                                }
                                            ?>
                                        </ul>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->multiplier): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-square-root-variable"></i>
                                    </div>
                                    <div class="cell auto">
                                        <ul class="no-spacing">
                                            <?php
                                                $arrDisc = explode('|',$skill->multiplier);
                                                foreach($arrDisc as $multiplier) {
                                                    echo '<li>'.$multiplier.'</li>';
                                                }
                                            ?>
                                        </ul>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->loresheet==1): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-scroll"></i>
                                    </div>
                                    <div class="cell auto">
                                        Je krijgt hiervoor een loresheet
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->ingame_call): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-comment"></i>
                                    </div>
                                    <div class="cell auto">
                                        <?= esc($skill->ingame_call); ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->power): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <?= $skill->type == 3 || $skill->type == 10 ? '<i class="fa-solid fa-hands-praying"></i>' : '<i class="fa-solid fa-droplet"></i>' ?>
                                    </div>
                                    <div class="cell auto">
                                        <?= esc($skill->power); ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->time): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-clock"></i>
                                    </div>
                                    <div class="cell auto">
                                        <ul class="no-spacing">
                                            <?php
                                                $arrDisc = explode('|',$skill->time);
                                                foreach($arrDisc as $time) {
                                                    echo '<li>'.$time.'</li>';
                                                }
                                            ?>
                                        </ul>
                                    </div>
                                </div>
                            <?php endif; ?>
                            <?php if($skill->atk_range): ?>
                                <div class="grid-x info-row">
                                    <div class="cell shrink">
                                        <i class="fa-solid fa-ruler"></i>
                                    </div>
                                    <div class="cell auto">
                                        <?= esc($skill->atk_range); ?>
                                    </div>
                                </div>
                            <?php endif; ?>
                        </td>
                    </tr>                    
                </tbody>                                      
            </table> 
        </div>   
    </div>
<?php endif; ?>