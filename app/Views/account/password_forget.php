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
                <button class="button solid fullwidth" type="submit">
                    <i class="fa-solid fa-share-from-square"></i>Wachtwoord-link aanvragen
                </button>
                <div class="text-center">
                    <hr>
                    <span class="small-paragraph">Ben je per ongeluk op deze pagina terecht gekomen? Dan kan je dan kan je via <a href="<?php echo base_url('/user/login') ?>">deze pagina</a> inloggen.</span>
                </div>
            </div>
        </form>
    </div>
</section>
