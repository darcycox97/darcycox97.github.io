// this script provides functions to load the partial html files.
// hopefully this will save a lot of duplicate code

// loads the navbar and sets the appropriate nav item to active
// loads into an element with id "nav"
function loadNavBar(activePage) {
    $("#nav").load("/_partials/_navigation.html", function() {
        // make the appropriate nav item active after loading
        $(".navbar ." + activePage).addClass("active-nav-item");
    });
}

// loads the footer into an element with id "footer"
function loadFooter() {
    $("#footer").load("/_partials/_footer.html");
}

function loadPartials(pageName) {
    loadNavBar(pageName);
    loadFooter();
}
