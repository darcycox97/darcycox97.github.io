// this script provides the functionality for the image gallery that I implemented.


$(document).ready(function() {
    loadGallery({
        dir: '/res/screenshots/tatai/',
        imgs: ['tatai-home.png', 'tatai-gameplay.png', 'mid-game.PNG', 'tatai-custom-quiz.png', 'user-progress-1.PNG', 'user-progress-2.PNG'],
        galleryId: 'tatai-gallery'
    });
    loadGallery({
        dir: '/res/screenshots/website/',
        imgs: ['website-desktop.png','website-mobile.png', 'mobile-nav.PNG'],
        galleryId: 'website-gallery'
    });
    loadGallery({
        dir: '/res/screenshots/arduino/',
        imgs: ['phone-1.jpg','phone-2.jpg'],
        galleryId: 'arduino-gallery'
    });
});


// function to populate the image galleries, takes an object with the following properties:
// dir: the directory containing the images (string)
// imgs : an array of the names of the images to be displayed (strings)
// galleryId : the id of the image gallery to populate (string)
// make one call per image gallery
function loadGallery(config) {
    //var dir = '/res/screenshots/tatai/';
    var dir = config.dir;
    var images = config.imgs;
    var gallery = config.galleryId;
    //var images = ['tatai-custom-quiz.png','tatai-gameplay.png','tatai-home.png','website.PNG'];

    for (var i = 0; i < images.length; i++) {

        var img = '<div class="image" style="background-image:url(' + dir + images[i] +');"></div>';

        $("#" + gallery).append(img);
    }

    // make the first image active
    var slides = $("#" + gallery + " .image");
    var slideIndex = 0;
    slides.eq(slideIndex).addClass("active");

    // define behaviour of buttons only when images have loaded.
    $("#" + gallery + " .nextImg").click(function(e) {
        e.preventDefault();
        plusSlides(1);
    });

    $("#" + gallery + " .prevImg").click(function(e) {
        e.preventDefault();
        plusSlides(-1);
    });

    function plusSlides(direction) {
        slides.removeClass();
        slides.addClass('image'); // re add the image class becasue it got removed on the previous line
        if (direction >= 0) {
            slides.eq(slideIndex).addClass('out from-right');
            slideIndex++;
            if (slideIndex >= slides.length) {
                slideIndex = 0;
            }
            slides.eq(slideIndex).addClass('in from-right active')
        } else {
            slides.eq(slideIndex).addClass('out from-left')
            slideIndex--;
            if (slideIndex < 0) {
                slideIndex = slides.length - 1;
            }
            slides.eq(slideIndex).addClass('in from-left active');
        }
    }
}
