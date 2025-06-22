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
    
    <!-- Foundation v6 -->
    <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/foundation.min.css'); ?>">
    <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/app.css'); ?>">
    <script type="text/javascript" src="<?php echo vendor_path('foundation/js/vendor/foundation.min.js'); ?>"></script>
    <script type="text/javascript" src="<?php echo vendor_path('foundation/js/vendor/what-input.js'); ?>"></script>
    
    <style>
        html {
            padding: 0;
            margin: 0;
            font-size: 12px;
        }
        body {
            font-size: 1rem;
        }
        h1 {
            font-size: 2rem;
        }
        h2 {
            font-size: 1.5rem;
        }
        h3 {
            font-size: 1.25rem;
        }

        .hide-for-print {
            display: none;
        }

        /* Forces new page */
        .page-break {
            page-break-before: always; 
        }

        /* Optional screen styles */
        @media screen {
            .page-break {
                border-top: 2px dashed #ccc;
                margin: 40px 0;
            }
        }

        /* Hide elements during printing */
        @media print {
            .no-padding-print {
                padding: 0;
            }
            .no-print {
                display: none; 
            }
        }
    </style>

</head>
<body>

    <!-- first-page -->    
    <div class="grid-x grid-padding-x no-padding-print">
        <div class="cell text-center"> 
            <h1>Karakterblad | <?= $oCharacter->meta->name; ?></h1>
        </div>  
        <?= $this->include('character/character_grid') ?>
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
            <button class="button solid no-print" onclick="window.print()">Print this page</button>
        </div>
    </div>

</body>
</html>