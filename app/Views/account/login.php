<section class="wrapper">
    <div class="content-wrapper content-wrapper--login solid animate__animated animate__fadeIn">               
        <form id="form-login" method="post" action="<?php echo base_url('account/signin-process') ?>">
            <div class="text-center">
                <h1>Account Inloggen</h1>
                <img src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
            </div> 
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
                <label for="username">Gebruikersnaam</label>
                <input id="username" type="text" name="username">
            </div>
            <div>
                <label for="password">Wachtwoord</label>
                <input id="password" type="password" name="password">
            </div>
            <div>
                <button class="button solid" type="submit">
                    <i class="fa-solid fa-right-to-bracket"></i>Inloggen
                </button>
                <a class="button clear" href="<?php echo base_url('account/signup') ?>">
                    <i class="fa-solid fa-user-plus"></i>Inschrijven
                </a>
            </div>
            <div>
                <a href="<?php echo base_url('account/password_forget') ?>">
                    <i class="fa-solid fa-key"></i>Wachtwoord vergeten
                </a>
            </div>
        </form>
    </div>
</section>