<?php if (!$skill): ?>
    <p>Skill data missing.</p>
<?php else: ?>
    <!-- <?php print_r($skill) ?> -->
    <div class="cell tile ">      
        <div class="tile-content">
            <table role="presentation">
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
                        <td>
                            <table role="presentation" style="width: auto;">
                                <?php if($skill->cost): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-brain"></i></td>
                                        <td valign="top"><?= $skill->cost ?> vaardigheidspunt(en)</td>
                                    </tr>
                                <?php endif; ?>
                                <?php if($skill->requirements): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-star-of-life"></i></td>
                                        <td valign="top">
                                            <ul class="no-spacing">
                                                <?php
                                                    $arrReq = explode('|',$skill->requirement_name);
                                                    foreach($arrReq as $requirement) {
                                                        echo '<li>'.$requirement.'</li>';
                                                    }
                                                ?>
                                            </ul>
                                        </td>
                                    </tr>
                                <?php endif; ?>
                                <?php if($skill->disclaimer): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-triangle-exclamation"></i></i></td>
                                        <td valign="top">
                                            <ul class="no-spacing">
                                                <?php
                                                    $arrDisc = explode('|',$skill->disclaimer);
                                                    foreach($arrDisc as $disclaimer) {
                                                        echo '<li>'.$disclaimer.'</li>';
                                                    }
                                                ?>
                                            </ul>
                                        </td>
                                    </tr>
                                <?php endif; ?>                    
                                <?php if($skill->multiplier): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-square-root-variable"></i></td>
                                        <td valign="top"><?= esc($skill->multiplier); ?></td>
                                    </tr>
                                <?php endif; ?>
                                <?php if($skill->loresheet==1): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-scroll"></i></td>
                                        <td valign="top">Je krijgt hiervoor een loresheet</td>
                                    </tr>
                                <?php endif; ?> 
                                <?php if($skill->ingame_call): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-comment"></i></td>
                                        <td valign="top"><?= esc($skill->ingame_call); ?> </td>
                                    </tr>
                                <?php endif; ?>  
                                <?php if($skill->power): ?>
                                    <tr>
                                        <td valign="top"><?= $skill->type == 3 || $skill->type == 10 ? '<i class="fa-solid fa-hands-praying"></i>' : '<i class="fa-solid fa-droplet"></i>' ?></td>
                                        <td valign="top"><?= esc($skill->power); ?> </td>
                                    </tr>
                                <?php endif; ?>
                                <?php if($skill->time): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-clock"></i></td>
                                        <td valign="top"><?= esc($skill->time); ?> </td>
                                    </tr>
                                <?php endif; ?>
                                <?php if($skill->atk_range): ?>
                                    <tr>
                                        <td valign="top"><i class="fa-solid fa-ruler"></i></td>
                                        <td valign="top"><?= esc($skill->atk_range); ?> </td>
                                    </tr>
                                <?php endif; ?>
                            </table>
                        </td>
                    </tr>                    
                </tbody>                                      
            </table> 
        </div>   
    </div>
<?php endif; ?>