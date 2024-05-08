<!-- banner -->
<table width="100%" style="width: 100%;">
    <tr>
        <td style="padding: 0 0 20px;">
            <a href="<?php echo $sEmailLink; ?>" target="_blank"> 
                <img class="flex-image" src="<?php echo image_path('email/password_forgot/header.jpg') ?>" height="auto" width="720" style="display:block; height:auto; width:720px;"> 							
            </a>
        </td>
    </tr>
</table>
<!-- /banner -->
<table width="100%" style="width: 100%;">
    <tr>
        <td style="padding: 0 20px 20px; color: #FFFFFF; font: normal 16px/18px 'Manuale', serif;">
            Beste <?php echo $sFirstname.' '.$sLastname; ?>,<br><br>
            Bedankt voor het aanmelden voor de Kronieken van Dalaria karakterbeheer applicatie.
            <ul>
                <li>Je activeert je account eenvoudig door op onderstaande button te klikken. </li>
                <li>Vervolgens vul je het door jouw gekozen gebruikersnaam en wachtwoord in. </li>  
                <li>Daarna heb je direct toegang tot jouw account.</li>              
            </ul> 
            <br>
            Heb je nog vragen? Neem contact op via ons <a href="<?php echo URL_DISCORD; ?>" target="_blank" style="text-decoration: underline; color:#E34646;">discord-kanaal</a>.<br>
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
                        <a href="<?php echo $sEmailLink ?>" target="_blank" style="color:#ffffff; text-decoration: none;">Account activeren &rsaquo; </a>
                    </td>
                </tr>							
            </table>
        </td>
    </tr>
</table>