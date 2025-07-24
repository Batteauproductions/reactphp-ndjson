<section class="profile"> 
    <div class="profile-avatar text-left">
        <label class="profile-avatar-action hide-for-print">
            <input id="avatar" type="file" name="avatar" value="" placeholder="" hidden>
            <ul>
                <li>Enkel bestanden van maximaal 2mb</li>                                    
                <li>De extensies .jpg en .png zijn toegestaan</li>
                <li>Aspect ratio van 1:1 wordt aangeraden</li>
            </ul>
        </label>
        <img id="avatarPreview" src="<?= !isset($oCharacter) || empty($oCharacter->meta->avatar) ? image_path('elements/anonymous_avatar.png') : image_path('avatars/hero/'.$oCharacter->meta->avatar) ?>"/>
    </div>                        
</section>