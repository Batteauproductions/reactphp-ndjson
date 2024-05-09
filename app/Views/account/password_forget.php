<section class="wrapper">
    <div class="content-wrapper content-wrapper--login solid animate__animated animate__fadeIn">               
        <form id="form-password_forget" method="post" action="<?php echo base_url('account/password-forgot') ?>">
            <div class="text-center">
                <h1>Wachtwoord vergeten</h1>
                <p>Vul hieronder het email adres in dat bij je account hoort. Je ontvangt daarna een email met daarin een link om je wachtwoord opnieuw in te stellen.</p>
                <img class="spacer-image" src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
            </div> 
            <div>
                <label for="email">Email</label>
                <input id="email" type="email" name="email">
            </div>
            <div>
                <button class="button solid" type="submit">
                    <i class="fa-solid fa-share-from-square"></i>Wachtwoord resetten
                </button>
                <a class="button clear" href="<?php echo base_url() ?>">
                    <i class="fa-solid fa-backward-step"></i>Terug
                </a>
            </div>
        </form>
    </div>
</section>
