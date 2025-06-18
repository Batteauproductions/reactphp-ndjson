<section class="wrapper">
    <div class="content-wrapper content-wrapper--signup_start solid animate__animated animate__fadeIn">               
        <form id="form-signup" method="post" action="<?php echo base_url('account/signup-process') ?>">
            <div class="text-center">
                <h1>Account Inloggen</h1>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                <p>
                    Wij als organisatie zouden nieuwe gebruikers willen vragen om, voor de  registratie binnen de applicatie, 
                    gebruik te maken van dezelfde  voornaam, achternaam en emailadres als voor de event registratie. 
                </p>
                <p>
                    Op deze manier zijn deelnemers binnen de applicatie direct  herkenbaar voor onze spelleiding. 
                </p>
                <?php if (session()->has('errors')) : ?>
                    <div class="alert alert-danger">
                        <ul>
                            <?php foreach (session('errors') as $error) : ?>
                                <li><?= esc($error) ?></li>
                            <?php endforeach ?>
                        </ul>
                    </div>
                <?php endif ?>
            </div> 
            <div>
                <label for="username">Gebruikersnaam *</label>
                <input id="username" type="text" name="username">
            </div>
            <div>
                <label for="register_code">Register-code <span data-tooltip tabindex="1" title="Bij registratie voor een evenement ontvang je van ons een code om je account aan te maken."><i class="fa-solid fa-circle-info" style="margin:0;"></i></span></label>
                <input id="register_code" type="text" name="register_code">
            </div>
            <div>
                <label for="email">Email *</label>
                <input id="email" type="email" name="email">
            </div>
            <div>
                <label for="firstname">Voornaam *</label>
                <input id="firstname" type="text" name="firstname">
            </div>
            <div>
                <label for="lastname">Achternaam *</label>
                <input id="lastname" type="text" name="lastname">
            </div>
            <div>
                <label for="birthday">Geboortedatum *</label>
                <input id="birthday" type="date" name="birthday">
            </div>
            <div>
                <label for="discord">Discord Alias</label>
                <input id="discord" type="text" name="discord">
            </div>            
            <div>
                <label for="password">Wachtwoord *</label>
                <input id="password" type="password" name="password">
            </div>
            <div>
                <label for="password_repeat">Wachtwoord herhalen *</label>
                <input id="password_repeat" type="password" name="password_repeat">
            </div>
            <div>
                <button class="button solid">
                    <i class="fa-regular fa-address-card"></i>Inschrijven
                </button>
                <a class="button clear" href="<?php echo base_url() ?>">
                    <i class="fa-solid fa-backward-step"></i>Terug
                </a>
            </div>
        </form>
    </div>
</section>

<!-- Google recaptcha V3 -->
<script src="https://www.google.com/recaptcha/api.js?render=6LfcGjcqAAAAAJwBxP9dC7fsc55pxd1Ww51gE8lA"></script>
<script>
    grecaptcha.ready(function() {
        grecaptcha.execute('6LfcGjcqAAAAAJwBxP9dC7fsc55pxd1Ww51gE8lA', {action: 'homepage'}).then(function(token) {
            document.getElementById('GRECAPTCHARESPONSE').value=token;
        });
    });
</script>
<!-- End Google recaptcha V3 -->
