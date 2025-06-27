<!DOCTYPE html>
<html lang="nl-Nl">
<head>
    <meta charset="UTF-8">
    <meta name="description" content="Chronicles of Dalaria - Charactor Generator">
    <meta name="keywords" content="larp, kvd, kvd-larp, chronicles of dalaria, chargen, character generator">
    <meta name="author" content="Geert Kamps">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    
    <title>Karakterblad | <?= $oCharacter->meta->name; ?></title>

    <link rel="shortcut icon" type="image/x-icon" href="https://chargen.dalaria.nl/assets/images/site/favicon.ico">
    
    <!-- Font Awesome -->
    <script src="https://kit.fontawesome.com/d3ced6c017.js" crossorigin="anonymous"></script>

    <!-- Foundation v6 -->
    <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/foundation.min.css'); ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/app.css'); ?>">
    
    <!-- Global Styling -->
    <link rel="stylesheet" href="<?php echo base_url('assets/css/print.css')?>">

</head>
<body>

    <!-- first-page -->    
    <div id="Charsheet" class="grid-x grid-padding-x no-padding-print">
        <div class="cell text-center"> 
            <h1>Karakterblad | <?= $oCharacter->meta->name; ?></h1>
        </div>  
        <!-- Notes and base information -->
        <div class="cell small-3">
            <div class="grid-x grid-padding-x grid-padding-y">
                <div class="cell small-12 text-left">
                    <?= view('character/parts/Profile') ?>   
                </div>
                <div class="cell small-12 text-center">
                    <?= view('character/parts/Baseinfo') ?>
                </div>
                <div class="cell small-12 text-center">
                    <?= view('character/parts/Notes') ?>
                </div>
            </div>
        </div>
        <!-- Stats and assets -->
        <div class="cell small-9">
            <div class="grid-x grid-padding-x grid-padding-y">
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/stats/Stats_Primary') ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/stats/Stats_Secundary') ?>
                </div>
                <div class="cell small-12 medium-12 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Beroep(en)','id' => 'profession','array' =>$oCharacter->profession,'print' => true]); ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Basis vaardigheden', 'id' => 'skill_base','array' =>$oCharacter->skill,'print' => true]); ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Gevechts vaardigheden','id' => 'skill_combat','array' =>$oCharacter->skill,'print' => true]); ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Magische vaardigheden','id' => 'skill_magic','array' =>$oCharacter->skill,'print' => true]); ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Goddelijke vaardigheden','id' => 'skill_divine','array' =>$oCharacter->skill,'print' => true]); ?>            
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Startuitrusting','id' => 'basekit','array' => [],'print' => true]); ?>
                </div>
                <div class="cell small-12 medium-12 large-6 text-center">
                    <?= view('character/parts/Asset', ['title' => 'Voorwerpen','id' => 'item','array' =>$oCharacter->item,'print' => true]); ?>
                </div>
            </div>                
        </div>
    </div>

    <!-- next-page -->
    <div class="page-break"></div>
    <div class="grid-x grid-padding-x no-padding-print">
        <div class="cell text-center">
            <h1>Vaardigheden</h1>
        </div>
        <div class="cell">
            <?php if(isset($arrSkill) && count($arrSkill) >= 1): ?>
                <?php foreach($arrSkill as $skill): ?>
                    <?= view('_templates/skill_tile', ['skill' => $skill]) ?>
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>

    <!-- next-page -->
    <div class="page-break"></div>
    <div class="grid-x grid-padding-x no-padding-print">
        <div class="cell text-center">
            <h1>Achtergrond & Avonturen</h1>
        </div>
        <div class="cell">
            <h2>Achtergrond</h2>
            <?= $oCharacter->meta->background ?>
            <?php if(count($oCharacter->stories) >= 1): ?>
                <h2>Avonturen</h2>
                <?php foreach($oCharacter->stories as $story): ?>
                    story
                <?php endforeach; ?>
            <?php endif; ?>
        </div>
    </div>
    
    <!-- print btn -->
    <div class="grid-x grid-padding-x no-padding-print">
        <div class="cell"> 
            <button class="button solid no-print" onclick="printCharSheet()"><i class="fa-solid fa-print"></i>&nbsp;Print enkel karakter</button>
            <button class="button clear no-print" onclick="window.print()"><i class="fa-solid fa-print"></i>&nbsp;Print volledige pagina</button>
        </div>
    </div>

    <script>
        function printCharSheet() {
            // Bewaar originele inhoud
            const originalContents = document.body.innerHTML;
            const printContents = document.getElementById('Charsheet').outerHTML;

            // Vervang body met Charsheet-inhoud
            document.body.innerHTML = printContents;

            // Start printen
            window.print();

            // Zet oorspronkelijke inhoud terug na een kleine delay
            setTimeout(() => {
                document.body.innerHTML = originalContents;
                location.reload(); // herlaad de pagina voor correcte heropbouw
            }, 100);
        }
    </script>

</body>
</html>