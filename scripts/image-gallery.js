// this script provides the functionality for the image gallery that I implemented.

$(document).ready(function() {
    var dir = '/res/screenshots/tatai/';
    var images = ['tatai-custom-quiz.png','tatai-gameplay.png','tatai-home.png','website.PNG'];

    for (var i = 0; i < images.length; i++) {

        var img = '<div class="image" style="background-image:url(' + dir + images[i] +');"></div>';

        $(".gallery").append(img);
    }

    // make the first image active
    var slides = $(".gallery .image");
    var slideIndex = 0;
    slides.eq(slideIndex).addClass("active");

    // define behaviour of buttons only when images have loaded.
    $("#nextImg").click(function(e) {
        e.preventDefault();
        plusSlides(1);
    });

    $("#prevImg").click(function(e) {
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
});
