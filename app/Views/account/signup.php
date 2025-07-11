<section class="wrapper">
    <div class="content-wrapper content-wrapper--signup_start solid animate__animated animate__fadeIn">               
        <form id="form-signup" class="grid-x grid-margin-x grid-margin-y" method="post" action="<?php echo base_url('account/signup-process') ?>">
            <div class="cell text-center">
                <h1>Account registreren</h1>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
                <p>
                    Wij als organisatie zouden nieuwe gebruikers willen vragen om, voor de registratie binnen de applicatie, 
                    gebruik te maken van dezelfde voornaam, achternaam en emailadres als voor de event registratie. 
                </p>
                <p>
                    Op deze manier zijn deelnemers binnen de applicatie direct herkenbaar voor onze spelleiding. 
                </p>
                <span class="small-paragraph">
                    Velden gemarkeerd met een (*) zijn verplicht om in te vullen.
                </span>
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
            <div class="cell">                
                <div class="grid-x grid-margin-x">
                    <div class="cell small-12">
                        <label for="username">Gebruikersnaam *</label>
                        <input id="username" type="text" name="username">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="register_code">Register-code <span data-tooltip tabindex="1" title="Na aanmelding voor een evenement ontvang je van de organisatie een code om je te registreren in de app."><i class="fa-solid fa-circle-info" style="margin:0;"></i></span></label>
                        <input id="register_code" type="text" name="register_code">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="email">Email *</label>
                        <input id="email" type="email" name="email">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="firstname">Voornaam *</label>
                        <input id="firstname" type="text" name="firstname">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="lastname">Achternaam *</label>
                        <input id="lastname" type="text" name="lastname">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="birthday">Geboortedatum *  <span data-tooltip tabindex="1" title="Omdat onze evenementen een minimumleeftijd van 16 jaar vereisen, vragen we deze hier ter controle op."><i class="fa-solid fa-circle-info" style="margin:0;"></i></span></label>
                        <input id="birthday" type="date" name="birthday">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="discord">Discord Alias</label>
                        <input id="discord" type="text" name="discord">
                    </div>            
                    <div class="cell small-12 medium-6">
                        <label for="password">Wachtwoord *</label>
                        <input id="password" type="password" name="password">
                    </div>
                    <div class="cell small-12 medium-6">
                        <label for="password_repeat">Wachtwoord herhalen *</label>
                        <input id="password_repeat" type="password" name="password_repeat">
                    </div>
                </div>
            </div>             
            <div class="cell small-12">
                <button class="button solid fullwidth">
                    <i class="fa-regular fa-address-card"></i>Inschrijven
                </button>
                <hr>
                <div class="text-center">
                    <span class="small-paragraph">Ben je al ingeschreven, dan kan je via <a href="<?php echo base_url('user/login') ?>">deze pagina</a> inloggen.</span>
                </div>
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
