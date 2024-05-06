<div class="navigation-site animate__animated animate__slideInDown">
    <div class="grid-container">        
        <nav class="grid-x">
            <div class="cell shrink dropdown">
                <a href="#"><i class="fa-solid fa-users"></i>Karakters</a>
                <div class="dropdown-content">
                    <a href="<?php echo base_url('user/create_character')?>"><i class="fa-solid fa-user-plus"></i>Aanmaken</a>
                    <a href="<?php echo base_url('user/character_database')?>"><i class="fa-solid fa-address-book"></i>Overzicht</a>
                </div>
            </div>
            <?php if(isset($isGameMaster) && $isGameMaster): ?>
                <div class="cell shrink dropdown">
                    <a href="#"><i class="fa-solid fa-book-atlas"></i>Spelleiding</a>
                    <div class="dropdown-content">
                        <a href="<?php echo base_url('gamemaster/character/database')?>"><i class="fa-solid fa-database"></i>Karakter Database</a>
                        <a href="<?php echo base_url('gamemaster/event/database')?>"><i class="fa-solid fa-calendar-days"></i>Evenementen</a>
                        <a href="<?php echo base_url('gamemaster/tools')?>"><i class="fa-solid fa-screwdriver-wrench"></i>Tools</a>
                        <a href="<?php echo base_url('gamemaster/search')?>"><i class="fa-solid fa-magnifying-glass"></i>Zoeken</a>
                    </div>
                </div>
            <?php endif; ?>
            <div class="cell shrink dropdown">
                <a href="#"><i class="fa-solid fa-book"></i>Handleiding</a>
                <div class="dropdown-content">
                    <a href="<?php echo base_url('manual/help')?>"><i class="fa-solid fa-circle-question"></i>Help</a>
                    <a href="<?php echo URL_RULES ?>" target="_blank"><i class="fa-solid fa-book"></i>Regelboeken</a>
                    <a href="<?php echo base_url('manual/skills')?>"><i class="fa-solid fa-kitchen-set"></i>Vaardigheden</a>
                    <a href="<?php echo base_url('manual/faq')?>"><i class="fa-solid fa-book" aria-hidden="true"></i>F.A.Q.</a>
                    
                </div>
            </div>
            <div class="cell shrink">
                <a href="<?php echo base_url('user/profile')?>"><i class="fa-solid fa-user"></i>Profiel</a>
            </div>            
            <?php if(isset($isAdmin) && $isAdmin): ?>
                <div class="cell shrink dropdown">
                    <a href="#"><i class="fa-solid fa-gears"></i>Admin</a>
                    <div class="dropdown-content">
                        <a href="<?php echo base_url('admin/user/database')?>"><i class="fa-solid fa-database"></i>Gebruiker Database</a>
                        <a href="<?php echo base_url('admin/settigs')?>"><i class="fa-solid fa-sliders"></i>Instellingen</a>
                    </div>
                </div>
            <?php endif; ?>
            <div class="cell shrink">
                <a href="<?php echo base_url('account/logout')?>"><i class="fa-solid fa-right-from-bracket"></i>Uitloggen</a>
            </div>
        </nav>
    </div>
</div>
