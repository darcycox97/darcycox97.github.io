// this script provides functions to load the partial html files.
// hopefully this will save a lot of duplicate code

// loads the navbar and sets the appropriate nav item to active
// loads into an element with id "nav"
function loadNavBar(activePage) {
    $("#nav").load("/partials/navigation.html", function() {
        // make the appropriate nav item active after loading
        $(".navbar .nav.navbar-nav ." + activePage).addClass("active");
    });
}

// loads the footer into an element with id "footer"
function loadFooter() {
    $("#footer").load("/partials/footer.html");
}

function loadPartials(pageName) {
    loadNavBar(pageName);
    loadFooter();
}
