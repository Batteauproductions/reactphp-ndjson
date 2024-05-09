<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
	<head>

		<meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
		<meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<meta name="format-detection" content="telephone=no">
		<meta name="author" content="Stichting Dalaria">
		<meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title><?php echo $title ?></title>

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
        <table class="outer-container" bgcolor="#F1F1F1" width="100%" style="width:100%; background-color: #F1F1F1;">
            <tr>
                <td align="center">
                    <div style="background-color:#F1F1F1;">
                    <!--[if gte mso 9]>
                    <v:background xmlns:v="urn:schemas-microsoft-com:vml" fill="t">
                    <v:fill type="tile" src="<?php base_url('/assets/images/backgrounds/bg_moutaincity.png'); ?>" color="#F1F1F1"/>
                    </v:background>
                    <![endif]-->
                        <table height="100%" width="100%">
                            <tr>
                                <td valign="top" align="center" style="background-image: <?php base_url('/assets/images/backgrounds/bg_moutaincity.png'); ?>">
                                    <!-- header -->
                                    <table class="inner-container" bgcolor="#7D1717" width="480" style="width:480px; background-color:#7D1717;">
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
                                    <table class="outer-container" bgcolor="#1E1E1E" width="480" style="width:480; background-color: #1E1E1E;">
                                        <tr>
                                            <td align="center">                                
                                                <?php echo $content ?>
                                            </td>
                                        </tr>
                                    </table>
                                    <!-- /content -->

                                    <!-- footer -->
                                    <table class="inner-container" bgcolor="#7D1717" width="480" style="width:480px; background-color:#7D1717;">
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
                    </div>
                </td>
            </tr>
        </table>        
    </body>
</html>