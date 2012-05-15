// ==UserScript==
// @name       GitHub Enhancement Suite
// @namespace  jpi
// @version    0.2
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://github.etsycorp.com/*/commit/*
// @match      https://*github.com/*/pull/*
// @match      https://*github.com/*/commit/*
// @copyright  2012
// ==/UserScript==

(function($) {
    var filelist = new Array();
    var current_index = 0;

    function parsePaths() {
        $('td.path a').each(function (index) {
            filelist[index] = $(this).attr('href');
        });
    }

    function movePaths() {
        $('#toc').wrapInner('<div style="position:fixed; width: 490px; top: 60px; left: 0px;" />');
    }

    function movePageRight() {
        $('.hentry').css('margin', '0px 0px 0px 500px');
    }

    function showPath(index) {
        $(filelist[current_index]).hide();
        $("a[href=" + filelist[current_index] + "]").css('font-weight', 'normal');
        current_index = index;
        $(filelist[index]).show();
        $("a[href=" + filelist[index] + "]").css('font-weight', 'bold');
    }

    function hideAllPaths() {
        $.each(filelist, function (index, value) {
            $(value).hide();
        });
    }

    function renderPaths() {
        movePageRight();
        movePaths();
        hideAllPaths();
        showPath(current_index);
    }

    function attachEvents() {
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

