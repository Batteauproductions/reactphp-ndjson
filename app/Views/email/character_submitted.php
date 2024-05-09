<!-- banner -->
<table width="100%" style="width: 100%;">
    <tr>
        <td style="padding: 0 0 20px;">
            <a href="<?php echo $sEmailLink; ?>" target="_blank"> 
                <img class="flex-image" src="<?php echo image_path('email/character_approved/header.jpg') ?>" height="auto" width="100%" style="display:block; height:auto; width:100%;"> 							
            </a>
        </td>
    </tr>
</table>
<!-- /banner -->
<table width="100%" style="width: 100%;">
    <tr>
        <td style="padding: 0 20px 20px; color: #FFFFFF; font: normal 16px/18px 'Manuale', serif;">
            Beste Spelleiding,<br><br>
            Je ontvangt deze mail, omdat <strong><?php echo $player_name; ?></strong> zijn/haar personage <strong><?php echo $char_name; ?></strong> heeft ingediend ter controle. <br>
            <br>
            Met vriendelijke groet,<br>
            Stichting Dalaria
        </td>
    </tr>
    <tr>
        <td style="padding: 0 20px 60px;">
            <table align="left" bgcolor="#7D1717" style="background-color:#7D1717">						
                <tr>
                    <td style="font: normal 16px/18px 'Manuale', serif; text-align:center; padding:12px 28px;">
                        <a href="<?php echo $sEmailLink ?>" target="_blank" style="color:#ffffff; text-decoration: none;">Karakter bekijken &rsaquo; </a>
                    </td>
                </tr>							
            </table>
        </td>
    </tr>
</table>