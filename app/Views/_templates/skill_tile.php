<?php if (!$skill): ?>
    <p>User data missing.</p>
<?php else: ?>
    <div 
        data-skill_id="<?= esc($skill->id) ?>"
        data-skill_name="<?= esc($skill->name) ?>"
        class="cell small-12 large-6 tile"> 
        <div class="grid-x">
            <div class="cell text-center">
                <h3><?php 
                        echo $skill->sl_only==1 ? '<i class="fa-solid fa-meteor"></i>' : ''; 
                        echo $skill->name 
                    ?>
                </h3>
            </div>
            <div class="cell">
                <h3><?= $skill->description ?></h3>
                <table>
                    <?php if($skill->xp_cost): ?>
                        <tr>
                            <td><i class="fa-solid fa-brain"></i></td>
                            <td><?= esc($skill->xp_cost) ?> vaardigheidspunt(en)</td>
                        </tr>
                    <?php endif; ?>
                    <?php if($skill->loresheet==1): ?>
                        <tr>
                            <td><i class="fa-solid fa-scroll"></i></td>
                            <td>Loresheet</td>
                        </tr>
                    <?php endif; ?>                    
                </table>    
            </div>
        </div>
    </div>
<?php endif; ?>