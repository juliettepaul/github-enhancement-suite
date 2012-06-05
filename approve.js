// ==UserScript==
// @name       GitHub Pull Request Approval Enhancement
// @namespace  jpi
// @version    0.2
// @description  
// @require        http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @match      https://github.etsycorp.com/*/pull/*
// @match      https://*github.com/*/pull/*
// @copyright  2012
// ==/UserScript==

(function($) {
    var comments = new Array();
    var write_bucket = null;
    var approval_regex = /(lgtm|approved)/i;
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
        'margin-top' : '4px',
        'float' : 'left',
        'height' : '22px',
    };
    var created_approval_container = false;
    var approvals = null;

    // Find the post comment form so we can approve/deny easily
    function findWriteBucket() {
        write_bucket = $('#pull_comment_form [id^=write_bucket_] textarea');
        $('button.primary').prop('id', 'post-comment');
    }

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

    // Add list of approvals/rejections to top of timeline
    function renderApprovalDiv() {
        $.each(comments, function (index, value) {
            if (value) { 
                prepareApprovalContainer();
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
        addApproveButtons();
    }

    // Create the container if necessary to show approvals
    function prepareApprovalContainer() {
        if (!created_approval_container) {
            var discussion_timeline = $('div.discussion-timeline');
            discussion_timeline.prepend('<div class="new-comments"><div class="comment starting-comment"><div id="approvals" class="bubble"></div></div></div><br/>');
            approvals = $('#approvals'); 
            approvals.css('background', 'white');
            created_approval_container = true;
        }
    }

    // Add quick approve/reject buttons
    function addApproveButtons() {
        var form_actions = $('form div.form-actions');
        $('form div.form-actions .tip').hide();
        form_actions.append('<button type="submit" class="classy primary approveit"><span>Approve</span></button> <button type="submit" class="classy primary rejectit"><span>Reject</span></button>');
        $('button.approveit').on('click', function (e) {
            e.preventDefault();
            if (write_bucket.val().search(approval_regex) == -1) {
                var new_comment = 'approved' + (write_bucket.val() ? ':' : '') + write_bucket.val();
                write_bucket.val(new_comment);
            }
            $('#pull_comment_form button#post-comment').click();
        });

        $('button.rejectit').on('click', function (e) {
            e.preventDefault();
            if (write_bucket.val().search(rejected_regex) == -1) {
                var new_comment = 'rejected' + (write_bucket.val() ? ':' : '') + write_bucket.val();
                write_bucket.val(new_comment);
            }
            $('#pull_comment_form button#post-comment').click();
        });
    }

    findWriteBucket();
    parseComments();
    renderApprovalDiv();
})(jQuery);



