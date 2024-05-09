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
            Beste <?php echo $sFirstname.' '.$sLastname; ?>,<br><br>
            Je personage <?php echo $char_name?> is door ons gecontroleerd en goed gekeurd!<br><br>
            <?php if(isset($public_note) && !empty($public_note)): ?>
                <div style="background-color:#B4B4B4; color:#000000; padding:10px; margin-bottom:10px;">
                    <?php echo $public_note; ?>
                </div>
            <?php endif; ?>	 
            <br>
            Mocht je nog vragen of opmerkingen hebben m.b.t. je personage neem dan contact op met SL-team via ons <a href="<?php echo URL_DISCORD; ?>" target="_blank" style="text-decoration: underline; color:#840500;">discord-kanaal</a>,
            of door middel van de tag @Spelleiding of stuur een mail naar ons <a href="mailto:<?php echo EMAIL_REPLY; ?>" target="_blank" style="text-decoration: underline; color:#840500;">e&#8209;mail</a> adres.
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
                        <a href="<?php echo $sEmailLink ?>" target="_blank" style="color:#ffffff; text-decoration: none;">Print karakter &rsaquo; </a>
                    </td>
                </tr>							
            </table>
        </td>
    </tr>
</table>