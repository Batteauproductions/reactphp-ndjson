<section class="wrapper">
    <div class="content-wrapper content-wrapper--login solid animate__animated animate__fadeIn">               
        <form id="form-login" class="grid-x" method="post" action="<?php echo base_url('account/signin-process') ?>">
            <div class="cell text-center">
                <h1>Account Inloggen</h1>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
            </div> 
            <?php if (session()->has('errors')) : ?>
                <div class="cell alert alert-danger">
                    <ul>
                        <?php foreach (session('errors') as $error) : ?>
                            <li><?= esc($error) ?></li>
                        <?php endforeach ?>
                    </ul>
                </div>
            <?php endif ?>
            <div class="cell">
                <label for="username">Gebruikersnaam</label>
                <input id="username" type="text" name="username">
            </div>
            <div class="cell">
                <label for="password">Wachtwoord</label>
                <input id="password" type="password" name="password">
                <span class="small-paragraph text-right spacing-bottom">
                    <a href="<?php echo base_url('account/password_forget') ?>">
                        <i class="fa-solid fa-key"></i>Wachtwoord vergeten?
                    </a>
                </span>
            </div>   
            <div class="cell">
                <button class="button solid fullwidth" type="submit">
                    <i class="fa-solid fa-right-to-bracket"></i>Inloggen
                </button>
            </div>
            <div class="cell text-center">
                <hr>
                <span class="small-paragraph">Of als je nog geen account hebt, kan je deze <a href="<?php echo base_url('account/signup') ?>">hier registreren</a>.</span>
            </div>
        </form>
    </div>
</section>