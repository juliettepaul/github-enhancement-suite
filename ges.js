// ==UserScript==
// @name       GitHub Enhancement Suite
// @namespace  jpi
// @version    0.3
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

    function iteratePaths(func) {
        $.each(filelist, function (index, value) {
            func(index, value);
        });
    }

    function hideAllPaths() {
        iteratePaths(function (index, value) {
            $(value).hide();
        });
    }

    function addCommentCount() {
        iteratePaths(function (index, value) {
            var this_text = $("a[href=" + value + "]").first().html();
            var comment_count = $(value + " .comment.commit-comment").length;
            $("a[href=" + value + "]").first().html(this_text + " (" + comment_count +  ")");

        });
    }

    function renderPaths() {
        movePageRight();
        movePaths();
        addCommentCount();
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

