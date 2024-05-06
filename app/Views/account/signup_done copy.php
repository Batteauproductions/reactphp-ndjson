<section class="wrapper">
    <div class="content-wrapper content-wrapper--signup_done solid text-center animate__animated animate__fadeIn">       
        <div class="text-center">
            <h1>Registratie compleet</h1>
            <img src="<?php echo image_path('elements/header-img.png') ?>" alt=""/>
            <p>
                Je registratie in de applicatie is afgerond <span class="form-data"><?php echo $username ?></span>.
                Je ontvangt binnen enkele minuten een e-mail op <span class="form-data"><?php echo $email ?></span> ter verificatie om je account te activeren.
            </p>
        </div> 
        <div>
            <a class="button solid" href="<?php echo base_url('account/login') ?>">
                <i class="fa-solid fa-right-to-bracket"></i>Naar inloggen
            </a>
        </div>
    </div>
</section>
