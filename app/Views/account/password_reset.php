<section class="wrapper">
    <div class="content-wrapper content-wrapper--login solid animate__animated animate__fadeIn">               
        <form id="form-password_forget" method="post" action="<?php echo base_url('account/password-reset') ?>">
            <div class="text-center">
                <h1>Wachtwoord resetten</h1>
                <p>Vul hieronder een nieuw wachtwoord in</p>
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
            <input type="hidden" name="username" value="<?php echo $username ?>"/>
            <input type="hidden" name="hash" value="<?php echo $hash ?>"/>
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
                    <i class="fa-solid fa-share-from-square"></i>Wachtwoord resetten
                </button>
            </div>
        </form>
    </div>
</section>
