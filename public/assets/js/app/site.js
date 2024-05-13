$(document).ready(function() {

    $(document).foundation();

    // Check if the class has already been added during this session
    if (!sessionStorage.getItem('navigationAnimated')) {
        // Add the CSS class to the element
        $('.navigation-site').addClass('animate__animated animate__slideInDown');
        $('.navigation-footer').addClass('animate__animated animate__slideInUp');
        // Set the session storage flag to indicate that the class has been added
        sessionStorage.setItem('navigationAnimated', 'true');
    }

    $('a[data-logout]').on('click' , function() {
        sessionStorage.removeItem('navigationAnimated');
    });
    
    const background = $('body').css('background');
    const arrBackgrounds = ['bg_fishingvillage','bg_forestpatrol','bg_hauntedruines','bg_moutaincity','bg_mysticlibrary'];
    let currentIndex = 0;
    function changeBackground() {
        console.log('switch')
        $('body').css('background-image', `url('/assets/images/backgrounds/${arrBackgrounds[currentIndex]}.png')`);
        currentIndex = (currentIndex + 1) % arrBackgrounds.length;
    }
    setInterval(changeBackground, 10000);
    

});