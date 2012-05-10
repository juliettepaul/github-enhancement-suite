// ==UserScript==
// @name       GitHub Pull Request Enhancement Suite
// @namespace  jpi
// @version    0.1
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://github.etsycorp.com/*/commit/*
// @match      https://www.github.com/*/pull/*
// @match      https://www.github.com/*/commit/*
// @copyright  2012
// ==/UserScript==

(function($) {
    var filelist = new Array();

    var parsePaths = function() {
        $('td.path a').each(function (index) {
            filelist[index] = new Array($(this).attr('href'), $(this).html());
        });
    }

    var movePaths = function () {
        $('#toc').wrapInner('<div style="position:fixed; width: 490px; top: 60px; left: 0px;" />');
    }

    var movePageRight = function () {
        $('.hentry').css('margin', '0px 0px 0px 500px');
    }

    var renderPaths = function() {
        parsePaths();
        movePageRight();
        movePaths();
    }

    var attachEvents = function() {
        $.each(filelist, function (index, value) {
        });
    }

    renderPaths();
    attachEvents();
})(jQuery);

