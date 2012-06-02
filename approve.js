// ==UserScript==
// @name       GitHub Pull Request Approval Enhancement
// @namespace  jpi
// @version    0.1
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://*github.com/*/pull/*
// @copyright  2012
// ==/UserScript==

(function($) {
    var comments = new Array();
    var approval_regex = /lgtm/i;
    var rejected_regex = /rejected/i;
    var approved_style = {
        'float': 'left',
        'padding': '3px 10px',
        'margin-top': '-2px',
        'margin-right': '8px',
        'font-size': '12px',
        'font-weight': 'bold',
        'color': 'white',
        'background': '#6CC644',
        'border-radius': '3px'
    };
    var rejected_style = {
        'float': 'left',
        'padding': '3px 10px',
        'margin-top': '-2px',
        'margin-right': '8px',
        'font-size': '12px',
        'font-weight': 'bold',
        'color': 'white',
        'background': 'red',
        'border-radius': '3px'
    };
    var inner_approval_style = {
        'float' : 'left',
        'height' : '28px'
    };

    // First get a list of all approval comments on the page then parse them
    function parseComments() {
        $('[id^=issuecomment-]').each(function (index) {
            var div_id = $(this).attr('id'),
                author = $('#' + div_id + ' strong.author a').html(),
                comment_contents = $('#' + div_id + ' .body .content-body p').html(),
                approved = comment_contents.search(approval_regex) >= 0,
                rejected = comment_contents.search(rejected_regex) >= 0;
            // TODO: Time

            if (approved || rejected) {
                comments[index] = {
                    comment: comment_contents,
                    user: author,
                    id: div_id,
                    approval: approved
                };
                $(this).parent().parent().hide();
            }
        });
    }

    function renderApprovalDiv() {
        var discussion_timeline = $('div.discussion-timeline');
        discussion_timeline.prepend('<div class="new-comments"><div class="comment starting-comment"><div id="approvals" class="bubble"></div></div></div>');
        var approvals = $('#approvals');
        $.each(comments, function (index, value) {
            if (value) { 
                if (value.approval) {
                    approvals.append('<div id="inner-approval-' + index + '"><span class="approved">Approved</span> </div>');
                } else {
                    approvals.append('<div id="inner-approval-' + index + '"><span class="rejected">Rejected</span> </div>');
                }
                $('#inner-approval-' + index).css(inner_approval_style);
                $('#inner-approval-' + index).append('<strong>' + value.user + '</strong> with this comment: ' + value.comment);
                approvals.append('<div style="clear: left;" />');
            }
        });
        $('span.approved').css(approved_style);
        $('span.rejected').css(rejected_style);
    }

    parseComments();
    renderApprovalDiv();
})(jQuery);



