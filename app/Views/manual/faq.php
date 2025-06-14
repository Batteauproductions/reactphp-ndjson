<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x">
            <?php foreach($arrFaq as $faq): ?>
                <div class="cell info-container">
                    <h2><?= $faq->question ?></h2>
                    <p><?= $faq->answer ?></p>
                </div>                
            <?php endforeach; ?>
        </div>
    </div>
</div>