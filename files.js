// ==UserScript==
// @name       GitHub Files View Enhancement 
// @namespace  jpi
// @version    0.4
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
    var filelist = new Array(),
        new_diff_data = new Array(),
        viewed_comments = {
            comments: new Array(),
            counts: new Array()
        },
        current_index = 0;
        files_url_regex = /(files|commit[^s])/;

    // constants
    var POLLING_TIME = 6000;

    function parseFiles() {
        $('#toc li a').each(function (index) {
            filelist[index] = {
                href: $(this).attr('href'),
                text: $(this).html(),
                elem: $(this)
            };
        });
    }

    function moveFiles() {
        $('#toc').wrapInner('<div style="position:fixed; width: 490px; top: 60px; left: 0px;" />');
    }

    function adjustPageMargins() {
        if (String(window.location).match(files_url_regex)) {
            $('.hentry').css('margin', '0px 0px 0px auto');
        } else {
            $('.hentry').css('margin', '0px auto');
        }
        $('.hentry').css('width', '60%');
    }

    function showFile(index) {
        var old_file_link = $("a[href=" + filelist[current_index].href + "]"),
            new_file_link = $("a[href=" + filelist[index].href + "]"),
            old_file = $(filelist[current_index].href),
            new_file = $(filelist[index].href);
        old_file.hide();
        old_file_link.css('font-weight', 'normal');
        new_file.show();
        new_file_link.css('font-weight', 'bold');
        current_index = index;
        window.scrollTo(0, new_file.offset().top);
    }

    function iterateFiles(func) {
        $.each(filelist, function (index, value) {
            func(index, value);
        });
    }

    function hideAllFiles() {
        iterateFiles(function (index, value) {
            $(value.href).hide();
        });
    }

    function updateCommentCount() {
        iterateFiles(function (index, value) {
            var comment_count = $(value.href + " .comment.commit-comment").length;
            if (comment_count > 0) {
                value.elem.html(
                    value.text + " (" + getReadCommentCount(index) + '/' + comment_count +  ")"
                );
            }
        });
    }

    function getReadCommentCount(index) {
        initReadComment(index);
        return viewed_comments.counts[index];
    }

    function initReadComment(index) {
        if (! viewed_comments.counts[index]) {
            viewed_comments.counts[index] = 0;
        }

        if (! viewed_comments.comments[index]) {
            viewed_comments.comments[index] = new Array();
        }
    }

    function setReadComment(index, comment_id) {
        initReadComment(index);
        if (! viewed_comments.comments[index][comment_id]) {
            viewed_comments.comments[index][comment_id] = true;
            viewed_comments.counts[index]++;
        }
    }

    function updateReadCommentCounts() {
        var docViewTop = $(window).scrollTop(),
            docViewBottom = docViewTop + $(window).height();
            
        iterateFiles(function (index, value) {
            $(value.href + ":visible .comment.commit-comment").filter(function () {
                var thisTop = $(this).offset().top,
                    thisBottom = thisTop + $(this).height();
                
                return (
                    thisTop >= docViewTop && 
                    thisBottom <= docViewBottom
                );
            }).each(function () {
                var comment_id = parseInt($(this).attr('id').substr(1));
                setReadComment(index, comment_id);
            });
        });
        updateCommentCount();
    }

    function renderFilesMod() {
        adjustPageMargins();
        moveFiles();
        hideAllFiles();
        showFile(current_index);
        updateReadCommentCounts();
    }

    function attachEvents() {
        iterateFiles(function (index, value) {
            value.elem.click(function () { 
                showFile(index);
                return false;
            });
        });

        $('ul.js-hard-tabs li a').click(adjustPageMargins);
        $(window).scroll(updateReadCommentCounts);
    }

    function pollForNewComments() {
        $.ajax({
            url: window.location,
            success: function(data) {
                var $data = $(data),
                    comment_count = $('.comment.commit-comment').length,
                    new_comment_count = $data.find('.comment.commit-comment').length;
                if (comment_count != new_comment_count || 1) {
                    storeDiffData($data);
                    alertForReload(comment_count, new_comment_count);
                }
            }
        });
    }

    function alertForReload(comment_count, new_comment_count) {
    }

    function storeDiffData(elem) {
        new_diff_data = new Array();
        elem.find('div[id^=diff-]').each(function (index) {
            new_diff_data[index] = {
                id: $(this).attr('id'),
                html: $(this).html(),
            };
        });
    }

    function reloadDiffData() {
        $.each(new_diff_data, function (index, value) {
            // This doesn't work yet
            //$('#' + value.id).html(value.html);
        });
        // TODO: invalidate comment counts properly
    }

    parseFiles();
    renderFilesMod();
    attachEvents();

})(jQuery);



