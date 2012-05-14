// ==UserScript==
// @name       GitHub Enhancement Suite
// @namespace  jpi
// @version    0.2
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://github.etsycorp.com/*/commit/*
// @match      https://www.github.com/*/pull/*
// @match      https://www.github.com/*/commit/*
// @update_url https://raw.github.com/jayson/github-enhancement-suite/master/ges.js
// @copyright  2012
// ==/UserScript==

(function($) {
    var filelist = new Array();
    var current_index = 0;

    var parsePaths = function() {
        $('td.path a').each(function (index) {
            filelist[index] = $(this).attr('href');
        });
    }

    var movePaths = function () {
        $('#toc').wrapInner('<div style="position:fixed; width: 490px; top: 60px; left: 0px;" />');
    }

    var movePageRight = function () {
        $('.hentry').css('margin', '0px 0px 0px 500px');
    }

    var showPath = function (index) {
        $(filelist[current_index]).hide();
        current_index = index;
        $(filelist[index]).show();
    }

    var hideAllPaths = function() {
        $.each(filelist, function (index, value) {
            $(value).hide();
        });
    }

    var renderPaths = function() {
        movePageRight();
        movePaths();
        hideAllPaths();
        showPath(current_index);
    }

    var attachEvents = function() {
        $('td.path a').each(function (index) {
            filelist[index] = $(this).attr('href');
            $(this).click(function () { 
                showPath(index);
                window.scrollTo(0, 300);
                return false;
            });
        });
    }

    parsePaths();
    renderPaths();
    attachEvents();
})(jQuery);

