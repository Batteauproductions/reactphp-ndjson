<div class="navigation-site">
    <div class="grid-container">        
        <nav class="grid-x">
            <div class="cell shrink dropdown">
                <a href="#"><i class="fa-solid fa-users"></i>Karakters</a>
                <div class="dropdown-content">
                    <a href="<?php echo base_url('user/character/create')?>"><i class="fa-solid fa-user-plus"></i>Aanmaken</a>
                    <a href="<?php echo base_url('user/character/database')?>"><i class="fa-solid fa-address-book"></i>Overzicht</a>
                </div>
            </div>
            <?php if(isset($isGameMaster) && $isGameMaster): ?>
                <div class="cell shrink dropdown">
                    <a href="#"><i class="fa-solid fa-book-atlas"></i>Spelleiding</a>
                    <div class="dropdown-content">
                        <a href="<?php echo base_url('gamemaster/character/database')?>"><i class="fa-solid fa-database"></i>Karakter Database</a>
                        <a href="<?php echo base_url('gamemaster/event/database')?>"><i class="fa-solid fa-calendar-days"></i>Evenementen</a>
                        <a href="<?php echo base_url('gamemaster/tools')?>"><i class="fa-solid fa-screwdriver-wrench"></i>Tools</a>                        
                        <a href="<?php echo base_url('gamemaster/settings')?>"><i class="fa-solid fa-sliders"></i>Instellingen</a>
                    </div>
                </div>
            <?php endif; ?>
            <?php if(isset($isAdmin) && $isAdmin): ?>
                <div class="cell shrink dropdown">
                    <a href="#"><i class="fa-solid fa-gears"></i>Admin</a>
                    <div class="dropdown-content">
                        <a href="<?php echo base_url('admin/user/database')?>"><i class="fa-solid fa-database"></i>Gebruiker Database</a>
                        <a href="<?php echo base_url('admin/settings')?>"><i class="fa-solid fa-sliders"></i>Instellingen</a>
                    </div>
                </div>
            <?php endif; ?>
            <div class="cell shrink dropdown">
                <a href="#"><i class="fa-solid fa-book"></i>Handleiding</a>
                <div class="dropdown-content">
                    <a href="<?php echo base_url('user/manual/help')?>"><i class="fa-solid fa-circle-question"></i>Help</a>
                    <a href="<?php echo base_url('user/manual/rulebooks')?>"><i class="fa-solid fa-book"></i>Regelboeken</a>
                    <a href="<?php echo base_url('user/manual/skills')?>"><i class="fa-solid fa-kitchen-set"></i>Vaardigheden</a>
                    <a href="<?php echo base_url('user/manual/faq')?>"><i class="fa-solid fa-book" aria-hidden="true"></i>F.A.Q.</a>
                    
                </div>
            </div>
            <div class="cell shrink">
                <a href="<?php echo base_url('user/profile')?>"><i class="fa-solid fa-user"></i>Profiel</a>
            </div>                
            <div class="cell shrink">
                <a data-logout href="<?php echo base_url('account/logout')?>"><i class="fa-solid fa-right-from-bracket"></i>Uitloggen</a>
            </div>
        </nav>
    </div>
</div>
