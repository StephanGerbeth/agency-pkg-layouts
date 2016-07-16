"use strict";

var ContentManager = require('agency-pkg-base/Controller/ContentManager');
var browserHistory = require('agency-pkg-services/history');
var preventOverscroll = require('prevent-overscroll');

module.exports = ContentManager.extend({

    modelConstructor: ContentManager.prototype.modelConstructor.extend({
        session: {
            open: {
                type: 'boolean',
                required: true,
                default: false
            }
        }
    }),

    events: {
        'click': clickOutside
    },

    initialize: function() {
        ContentManager.prototype.initialize.apply(this, arguments);
        var cleanup = null;

        browserHistory.register(this.model.deep, function(value) {
            if(value !== null) {
                addBodyScrollbarOffset();
                $('html').addClass('js-modal-active');
                this.model.open = true;
                cleanup = preventOverscroll(this.el.querySelector('div.content'));
            } else {
                removeBodyScrollbarOffset();
                $('html').removeClass('js-modal-active');
                this.model.open = false;
                (cleanup || function(){})();
            }
        }.bind(this));
    },

    onContentAdded: function() {
        ContentManager.prototype.onContentAdded.apply(this, arguments);
    },

    onContentRemoved: function() {
        ContentManager.prototype.onContentRemoved.apply(this, arguments);
    }
});

//close modal when user clicks outside of modal content
function clickOutside(e) {
    e.preventDefault();

    if(!$(e.target).closest('.content', this.el).length) {
        $('>a.close', this.el).trigger('click');
    }
}

//prevent bouncing content by disabling scrollbar (overflow: hidden)
function addBodyScrollbarOffset() {
    $('html').css('margin-right', window.innerWidth - document.documentElement.clientWidth);
}

function removeBodyScrollbarOffset() {
    $('html').css('margin-right', '');
}
