hideBody();
setupPageLoader();
document.hideLoader = hidePageLoader;
let spinner = document.createElement('i');

function hideBody() {
    let body = document.getElementsByTagName('body')[0];
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