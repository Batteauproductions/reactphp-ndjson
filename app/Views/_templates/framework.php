<!DOCTYPE html>
<html lang="nl">
    <head>
        <meta charset="UTF-8">
        <meta name="description" content="Chronicles of Dalaria - Charactor Generator">
        <meta name="keywords" content="larp, kvd, kvd-larp, chronicles of dalaria, chargen, character generator">
        <meta name="author" content="Geert Kamps">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">

        <title><?php echo TITLE ?></title>

        <link rel="shortcut icon" type="image/x-icon" href="https://chargen.dalaria.nl/assets/images/site/favicon.ico">

        <!-- jQuery -->
        <script type="text/javascript" src="<?php echo vendor_path('jquery/jquery-3.7.1.min.js')?>"></script>

        <!-- Animate -->
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/animate.css/4.1.1/animate.min.css"></script>
        
        <!-- Google-font: Manuale -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manuale:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

        <!-- Foundation v6 -->
        <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/foundation.min.css'); ?>">
	    <link rel="stylesheet" type="text/css" href="<?php echo vendor_path('foundation/css/app.css'); ?>">
    	<script type="text/javascript" src="<?php echo vendor_path('foundation/js/vendor/foundation.min.js'); ?>"></script>
	    <script type="text/javascript" src="<?php echo vendor_path('foundation/js/vendor/what-input.js'); ?>"></script>

        <!-- Font Awesome -->
        <script src="https://kit.fontawesome.com/d3ced6c017.js" crossorigin="anonymous"></script>

        <!-- JS Validation -->
        <script type="text/javascript" src="<?php echo vendor_path('validation/jquery.validate.min.js')?>"></script>
        <script type="text/javascript" src="<?php echo vendor_path('validation/additional-methods.min.js')?>"></script>
        <script type="text/javascript" src="<?php echo vendor_path('validation/localization/messages_nl.js')?>"></script>

        <!-- CKEditor -->
        <script type="text/javascript" src="<?php echo vendor_path('CKEditor/ckeditor.js')?>"></script>
        
        <!-- Global Styling -->
        <link rel="stylesheet" href="<?php echo base_url('assets/css/index.css')?>">

    </head>
    <body>
        
        <?php echo isset($header) && !empty($header) ? '<header>'.$header.'</header>' : ''; ?>
        <main><?php echo isset($content) && !empty($content) ? $content : ''; ?></main>
        <?php echo isset($footer) && !empty($footer) ? '<footer>'.$footer.'</footer>' : ''; ?>

        <script type="text/javascript" src="<?php echo js_path('app/site.js'); ?>"></script>

        <script>
            window.AppConfig = window.AppConfig || {};
            window.AppConfig.userRights = {
                isGameMaster: <?php echo isset($viewAsGamemaster) ? json_encode($viewAsGamemaster) : 'false'; ?>,
            };
        </script>

        <?php if(isset($arrJS)): ?>
            <?php foreach($arrJS as $iKey => $sValue) :?>
                <script type="module" src="<?php echo js_path($sValue)?>"></script>
            <?php endforeach;?>
        <?php endif; ?>

        
        <!-- MODAL FOR POPUPS -->
        <div class="reveal small" id="popup-modal" data-reveal>
            
            <div class="grid-x grid-padding-y">
                <div class="cell small-4">
                    <img id="popup-image" src="#" alt=""/>
                </div> 
                <div class="cell small-8">                    
                    <div id="popup-message">
                        <!-- DYNAMIC -->
                    </div>
                    <div>
                        <a data-action="confirm-action" class="button solid"></a>
                        <a data-action="cancel-action" class="button clear"></a>
                    </div> 
                </div> 
                              
            </div>

            <button class="close-button" data-close aria-label="Close modal" type="button">
                <span aria-hidden="true">&times;</span>
            </button>
            
        </div>

    </body>

</html>