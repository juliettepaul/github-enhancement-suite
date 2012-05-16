// ==UserScript==
// @name       GitHub Enhancement Suite
// @namespace  jpi
// @version    0.3
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://github.etsycorp.com/*/commit/*
// @match      https://github.etsycorp.com/*/compare/*
// @match      https://*github.com/*/pull/*
// @match      https://*github.com/*/commit/*
// @match      https://*github.com/*/compare/*
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
        $('.hentry').css('margin', '0px 0px 0px auto');
    }

    function showPath(index) {
        var old_file_link = $("a[href=" + filelist[current_index] + "]"),
            new_file_link = $("a[href=" + filelist[index] + "]"),
            old_file = $(filelist[current_index]),
            new_file = $(filelist[index]);
        old_file.hide();
        old_file_link.css('font-weight', 'normal');
        new_file.show();
        new_file_link.css('font-weight', 'bold');
        current_index = index;
        window.scrollTo(0, new_file.offset().top);
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
            if (comment_count > 0) {
                $("a[href=" + value + "]").first().html(this_text + " (" + comment_count +  ")");
            }
        });
    }

    function addCommentScrollingEvent() {
    }

    function renderPaths() {
        movePageRight();
        movePaths();
        addCommentCount();
        hideAllPaths();
        showPath(current_index);
        addCommentScrollingEvent();
    }

    function attachEvents() {
        $('td.path a').each(function (index) {
            filelist[index] = $(this).attr('href');
            $(this).click(function () { 
                showPath(index);
                return false;
            });
        });
    }

    parsePaths();
    renderPaths();
    attachEvents();
})(jQuery);

