var Poll = {
    ids: [],
    url: '/polls',
    allowVote: false,
    voteUrl: '/poll/vote/',

    votedPolls: function() {
        var nameEQ = "_cms-poll-";
        var ca = document.cookie.split(';');
        var ret = [], id;

        for(var i=0;i < ca.length;i++) {
            var c = ca[i].replace(/^\s+|\s+$/g, '');
            if (c.indexOf(nameEQ) == 0) {
                c = c.split('=');
                id = c[0].match(/_cms-poll-(\d+)/)[1];

                ret.push({id: id, vote: c[1]});
            }
        }

        return ret;
    }(),

    init: function(){
        $('body')
        .on('click', '.poll a.link', function(){
            $(this).parents('.poll')
                .find('.poll-form').toggle().end()
                .find('.poll-results').toggle();
        })
        .on('submit', '.poll-form', {poll:this}, this.formSubmit);

        $(window).on('cms:user:logged-in', function(ev, user) {
            Poll.allowVote = true;
        });
    },

    addId: function(id){
        this.ids.push(id);
    },

    disablePoll: function(pollId) {
        $('body').off('submit', '#poll-' + pollId, this.formSubmit);
    },

    alertLogin: function(){
        $('#header-login-link').click();
    },

    loadAll: function(){
        var poll = this, ids = [];

        $('.poll').each(function() {
            var id = $(this).attr('id');
            if (id && id.match(/^poll/)) {
                ids.push(id.replace(/[^0-9]+/g, ''));
            }
        });
        if (!ids.length && this.ids.length) {
            ids = this.ids;
        }
        if (!ids.length) {
            return;
        }

        $.ajax({
            url: this.url,
            data: {
                ids: ids
            },
            success: function(data){
                for (id in data) {
                    var $pollHtml = $('#poll-' + id)
                        .html(
                            poll.processVotes(data[id])
                        )
                        .trigger('poll-load', {pollId: id});
                }

                poll.disableVotedPolls();
            },
            error: function(){},
            dataType: 'json'
        });
    },

    processVotes: function(data){
        var $data = $(data);
        var spans = $data.next('.poll-results').find('span');

        var total = 0, votes = [], vote;
        spans.each(function(s){
            $span = $(spans[s]);
            vote = $span.text().replace(/^\s*|\s*$/g, '');
            vote = parseInt(vote);

            votes.push({
                id: $span.parent().data('option'),
                vote: vote
            });

            total += vote;
        });

        for (v in votes) {
            vote = (votes[v].vote * 100)/total;
            vote = Math.round(vote * 100) / 100;

            if (isNaN(vote)) {
                vote = 0;
            };

            $data
                .find('div[data-option=' + votes[v].id + ']')
                .find('span').text(vote).end()
                .find('div div').css('width', vote + '%');
        }

        return $data;
    },

    formSubmit: function(event){
        event.preventDefault();

        var $this = $(this)
            poll = event.data.poll;

        // if user is not logged in display login popup
        if (!poll.allowVote) {
            poll.alertLogin();
            return;
        }

        if (!$this.serialize()) {
            return;
        }

        $.post($this.attr('action'), $this.serialize(), function(data){
            $this
                 //trigger form/results toggle
                .find('a.link').click().end()
                .find('button')
                    .addClass('disabled')
                    .attr('disabled', 'disabled');

            // set cookie with poll id
            poll.markPollVoted($this.data('poll'), $this.find('input[name=vote]').attr('id'));

        });
    },

    markPollVoted: function(id, vote) {
        expDate = new Date();
        expDate.setHours(expDate.getHours() + 3);

        document.cookie = '_cms-poll-' + id + '=' + vote +
            ';domain=' + document.location.hostname +
            ';path=/' +
            ';expires=' + expDate.toGMTString();
    },

    disableVotedPolls: function(){
        var id, vote;

        for(poll in this.votedPolls) {
            id = this.votedPolls[poll].id;
            vote = this.votedPolls[poll].vote;

            $('#poll-' + id)
                .find('button[type=submit]')
                    .addClass('disabled')
                    .attr('disabled', 'disabled').end()
                .find('#' + vote)
                    .attr('checked', 'checked').end()
                .find('a.see-results').click();
        }
    }
}

jQuery(function($) {
    Poll.init();
    Poll.loadAll();
});

if (!'Poll' in window || !window.Poll) {
    window.Poll = Poll;
}