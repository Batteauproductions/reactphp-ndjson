<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="format-detection" content="telephone=no">
		<meta name="author" content="Stichting Dalaria">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">

		<!--[if (gte mso 9)|(IE)]>
			<xml>
				<o:OfficeDocumentSettings><o:AllowPNG/>
				<o:PixelsPerInch>96</o:PixelsPerInch>
				</o:OfficeDocumentSettings>
			</xml>
		<![endif]-->

		<!-- Google-font: Manuale -->
        <link rel="preconnect" href="https://fonts.googleapis.com">
        <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
        <link href="https://fonts.googleapis.com/css2?family=Manuale:ital,wght@0,300..800;1,300..800&display=swap" rel="stylesheet">

		<style>

    		body {
				padding: 0px;
				margin: 0px;
				background: #1E1E1E;
			}

            table {
                border-collapse: collapse; 
                mso-table-lspace: 0pt; 
                mso-table-rspace: 0pt;
            }

            .inner-container {
                width: 720px;
            }

			@media screen and (max-width: 660px) {
				.flex-image { 
					display: block !important;
					width:100% !important; 
				}
				.inner-container { 
					width: 330px !important; 
				}
			}

		</style>

	</head>
    <body>
        <table class="outer-container" width="100%" style="width:100%;" bgcolor="#1E1E1E" style="background-color: #1E1E1E;">
            <tr>
                <td align="center">

                    <!-- header -->
                    <table class="inner-container" width="720" bgcolor="#7D1717" style="background-color:#7D1717; width:720px">
                        <tr>
                            <td align="center" style="padding:20px;">
                                <a href="<?php echo base_url(); ?>" target="_blank">
                                    <img src="<?php echo image_path('elements/logo_nl.png');?>" alt="Kronieken van Dalaria" width="100" style="height:auto; width:100px;">
                                </a>
                            </td>
                        </tr>
                    </table>
                    <!-- /header -->

                    <!-- content -->
                    <table class="inner-container" width="720" style="width:720px">
                        <tr>
                            <td align="center">
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
                                <!-- copy+cta -->
                                <table width="100%" style="width: 100%;">
									<tr>
										<td style="padding: 0 20px 20px; color: #FFFFFF; font: normal 16px/18px 'Manuale', serif;">
                                            Beste <?php echo $sFirstname.' '.$sLastname; ?>,<br><br>
											Je hebt aangegeven dat je je wachtwoord bent vergeten, geen probleem. Volg de onderstaande button om je wachtwoord opnieuw in te stellen.<br>
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
													    <a href="<?php echo $sEmailLink ?>" target="_blank" style="color:#ffffff; text-decoration: none;">Wachtwoord instellen &rsaquo; </a>
													</td>
												</tr>							
											</table>
										</td>
									</tr>
                                </table>
                                <!-- /copy+cta -->
                            </td>
                        </tr>
                    </table>
                    <!-- /content -->

                    <!-- footer -->
                    <table class="inner-container" width="720" bgcolor="#7D1717" style="background-color:#7D1717; width:720px">
                        <tr>
                            <td align="center" style="padding:20px;">
                                <table width="100%" style="width:100%;">
                                    <tr>
                                        <td>
                                            <a href="<?php echo URL_DISCORD; ?>" target="_blank" style="color:#ffffff; text-decoration:underline;">Discord-Server</a> | 
                                            <a href="<?php echo URL_FACEBOOK; ?>" target="_blank" style="color:#ffffff; text-decoration:underline;">Facebook-groep</a> | 
                                            <a href="<?php echo URL_WORLD; ?>" target="_blank" style="color:#ffffff; text-decoration:underline;">Setting-informatie</a>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </table>
                    <!-- /footer -->

                </td>
            </tr>
        </table>        
    </body>
</html>