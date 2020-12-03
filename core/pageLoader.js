let body = document.getElementsByTagName('body')[0];
let spinner = document.createElement('i');
hideBody();
setupPageLoader();
document.hideLoader = hidePageLoader;

function hideBody() {
    body.style.display = 'none';
}

function setupPageLoader() {
    body.before(spinner);
    spinner.id = 'pageSpinner';
    let $spinner = $(spinner);
    $spinner.addClass('fa fa-circle-o-notch fa-spin fa-3x');
}

function hidePageLoader() {
    $(spinner).fadeOut();
    $(body).fadeIn();
}