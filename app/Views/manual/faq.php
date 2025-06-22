<div class="grid-container">
    <section class="page-wrapper transparent">
        <div class="grid-x grid-margin-x grid-margin-y">
            <?php foreach($arrFaq as $index => $faq): ?>
                <div class="cell small-12 medium-6 tile">
                    <div class="grid-x grid-padding-x grid-padding-y">
                        <div class="cell">
                            <h2><?= ($index + 1) . '. ' . $faq->question ?></h2>
                            <p><?= $faq->answer ?></p>
                        </div>
                    </div>
                </div>                
            <?php endforeach; ?>
        </div>
    </div>
</div>