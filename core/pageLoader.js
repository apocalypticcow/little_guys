
let body = document.getElementsByTagName('body')[0];
let spinner = document.createElement('i');
body.style.display = 'none';
setupPageLoader();
document.hideLoader = hideLoader;

function setupPageLoader() {
    body.before(spinner);
    spinner.id = 'pageSpinner';
    let $spinner = $(spinner);
    $spinner.addClass('fa fa-circle-o-notch fa-spin fa-3x');
}


function hideLoader() {
    $(spinner).fadeOut();
    $(body).fadeIn();
}
