<nav aria-label="breadcrumb">
    <div class="grid-container">
        <ul class="breadcrumbs">
            <li><a href="<?= base_url('home'); ?>"><i class="fa-solid fa-house"></i></a></li>
            <?php foreach ($breadcrumbs as $crumb): ?>
                <?php if (!empty($crumb['url'])): ?>
                    <li>
                        <?= esc($crumb['label']) ?>
                    </li>
                <?php else: ?>
                    <li aria-current="page">
                        <?= esc($crumb['label']) ?>
                    </li>
                <?php endif; ?>
            <?php endforeach; ?>
        </ul>
    </div>
</nav>
