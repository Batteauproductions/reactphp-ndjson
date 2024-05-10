<section class="wrapper">
    <div class="content-wrapper content-wrapper--profile solid">               
        <form id="form-signup" method="post" action="<?php echo base_url('account/update-profile') ?>" enctype="multipart/form-data">
            <div class="grid-x grid-padding-x">
                <div class="cell small-4 text-center">
                    <div class="profile"> 
                        <div class="profile-avatar text-left">
                            <label class="profile-avatar-action">
                                <input id="avatar" type="file" name="avatar" value="<?php echo $oUser->avatar; ?>" placeholder="<?php echo $oUser->avatar; ?>" hidden>
                                <ul>
                                    <li>Enkel bestanden van maximaal 2mb</li>                                    
                                    <li>De extensies .jpg en .png zijn toegestaan</li>
                                    <li>Aspect ratio van 1:1 wordt aangeraden</li>
                                </ul>
                            </label>
                            <img src="<?php echo empty($oUser->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/user/'.$oUser->avatar) ?>"/>
                        </div>                        
                        <h1 class="profile-name"><?php echo $oUser->username; ?></h1>
                        <p class="profile-role"><?php echo $oUser->role_name; ?></p>
                    </div>
                </div>                
                <div class="cell small-8">                 
                    <?php if (session()->has('errors')) : ?>
                        <div class="alert alert-danger">
                            <ul>
                                <?php foreach (session('errors') as $error) : ?>
                                    <li><?= esc($error) ?></li>
                                <?php endforeach ?>
                            </ul>
                        </div>
                    <?php endif ?>
                    <div>
                        <label for="email">Email</label>
                        <input id="email" type="email" name="email" value="<?php echo $oUser->email; ?>" placeholder="<?php echo $oUser->email; ?>" disabled>
                    </div>
                    <div>
                        <label for="firstname">Voornaam</label>
                        <input id="firstname" type="text" name="firstname" value="<?php echo $oUser->firstname; ?>" placeholder="<?php echo $oUser->firstname; ?>">
                    </div>
                    <div>
                        <label for="lastname">Achternaam</label>
                        <input id="lastname" type="text" name="lastname" value="<?php echo $oUser->lastname; ?>" placeholder="<?php echo $oUser->lastname; ?>">
                    </div>
                    <div>
                        <label for="birthday">Geboortedatum</label>
                        <input id="birthday" type="date" name="birthday" value="<?php echo $oUser->birthday; ?>" placeholder="<?php echo $oUser->birthday; ?>">
                    </div>
                    <div>
                        <label for="discord">Discord Alias</label>
                        <input id="discord" type="text" name="discord" value="<?php echo $oUser->discord; ?>" placeholder="<?php echo $oUser->discord; ?>">
                    </div>            
                    <div>
                        <button class="button solid" type="submit">
                            <i class="fa-regular fa-address-card"></i>Opslaan
                        </button>
                    </div>
                </div> 
            </div>
        </form>
    </div>
</section>
