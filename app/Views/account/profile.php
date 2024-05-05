<section class="wrapper">
    <div class="content-wrapper content-wrapper--profile solid">               
        <form id="form-signup" method="post" action="<?php echo base_url('account/signup-process') ?>">
            <div class="column-wrapper">
                <div class="column col-4">
                    <div class="profile"> 
                        <img class="profile-avatar" src="<?php echo image_path('elements/anonymous_avatar.png')?>" alt=""/>
                        <span class="profile-name">##NAME##</span>
                        <span class="profile-role">##ROLE##</span>
                    </div>
                </div>
                <div class="column col-8">                  
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
                        <input id="email" type="email" name="email">
                    </div>
                    <div>
                        <label for="firstname">Voornaam</label>
                        <input id="firstname" type="text" name="firstname">
                    </div>
                    <div>
                        <label for="lastname">Achternaam</label>
                        <input id="lastname" type="text" name="lastname">
                    </div>
                    <div>
                        <label for="birthday">Geboortedatum</label>
                        <input id="birthday" type="date" name="birthday">
                    </div>
                    <div>
                        <label for="discord">Discord Alias</label>
                        <input id="discord" type="text" name="discord">
                    </div>            
                    <div>
                        <label for="password">Wachtwoord</label>
                        <input id="password" type="password" name="password">
                    </div>
                    <div>
                        <label for="password_repeat">Wachtwoord herhalen</label>
                        <input id="password_repeat" type="password" name="password_repeat">
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