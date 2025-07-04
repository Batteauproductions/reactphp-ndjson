<?php if (!$skill): ?>
    <p>Skill data missing.</p>
<?php else: ?>
    <div class="cell tile ">      
        <div class="tile-content">
            <table>
                <thead>
                    <tr>
                        <td colspan="2" class="text-center">
                            <h3><?= isset($skill->sub_name) ? $skill->name.' ('.$skill->sub_name.') ' : $skill->name; ?></h3>
                        </td>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td colspan="2">
                            <p><?= $skill->description ?></p>
                        </td>
                    </tr>
                    <?php if($skill->cost): ?>
                        <tr>
                            <td><i class="fa-solid fa-brain"></i></td>
                            <td><?= $skill->cost ?> vaardigheidspunt(en)</td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->requirements): ?>
                        <tr>
                            <td><i class="fa-solid fa-star-of-life"></i></td>
                            <td><?= $skill->requirements ?></td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->disclaimer): ?>
                        <tr>
                            <td><i class="fa-solid fa-triangle-exclamation"></i></i></td>
                            <td><?= $skill->disclaimer ?></td>
                        </tr>
                    <?php endif; ?>                    
                    <?php if($skill->multiplier): ?>
                        <tr>
                            <td><i class="fa-solid fa-square-root-variable"></i></td>
                            <td><?= esc($skill->multiplier); ?></td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->loresheet==1): ?>
                        <tr>
                            <td><i class="fa-solid fa-scroll"></i></td>
                            <td>Je krijgt hiervoor een loresheet</td>
                        </tr>
                    <?php endif; ?> 
                    <?php if($skill->ingame_call): ?>
                        <tr>
                            <td><i class="fa-solid fa-comment"></i></td>
                            <td><?= esc($skill->ingame_call); ?> </td>
                        </tr>
                    <?php endif; ?>  
                    <?php if($skill->power): ?>
                        <tr>
                            <td>XXX</td>
                            <td><?= esc($skill->power); ?> </td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->time): ?>
                        <tr>
                            <td><i class="fa-solid fa-clock"></i></td>
                            <td><?= esc($skill->time); ?> </td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->atk_range): ?>
                        <tr>
                            <td><i class="fa-solid fa-ruler"></i></td>
                            <td><?= esc($skill->atk_range); ?> </td>
                        </tr>
                    <?php endif; ?>
                </tbody>                                      
            </table> 
        </div>   
    </div>
<?php endif; ?>