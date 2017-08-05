import $ from 'jquery';
import page from 'page';
import template from './intro.jade';

page('/intro', intro);

function intro () {
    $('#main-container').html(template());

    $('.sign-up').on('click', function () {
        page('/sign-up');
    });

    $('.login').on('click', function () {
        page('/login');
    });
}
