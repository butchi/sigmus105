(function() {
    var $body;
    var $page;
    var $settings;
    var cur;
    var totalPage;

    $(function() {
        $(window).on('resize', function() {
            resize();
        });

        init();

        resize();
    });

    function init() {
        cur = parseInt(window.location.hash.slice(1 + 'page_'.length)) || 0;
        $page = $('.page');
        totalPage = $page.length;

        $blockOption = $('.block-nav');
        $settings = $blockOption.find('.settings');

        gotoPage(cur);

        $(window).on('keydown', function(evt) {
            if(false) {
            } else if(evt.keyCode === 39) { // →
                nextPage();
            } else if(evt.keyCode === 37) { // ←
                prevPage();
            }
        });

        $page.on('touchstart', function() {
            nextPage();
        });

        setPageId();

        initMenu();
    }

    function gotoPage(n) {
        $page.removeClass('active');
        $page.eq(n).addClass('active');

        window.location.hash = 'page_' + n;
    }

    function nextPage() {
        if(cur < totalPage - 1) {
            cur++;
        }

        gotoPage(cur);
    }

    function prevPage() {
        if(cur > 0) {
            cur--;
        }

        gotoPage(cur);
    }

    function resize() {
        var PAGE_W = 320;
        var PAGE_H = 200;
        $body = $('body');
        var screenW = $body.width();
        var screenH = $body.height();

        var scale = Math.min(screenW / PAGE_W, screenH / PAGE_H);

        $('.wrapper').css({
            '-webkit-transform': 'scale('+ scale +')',
            '-moz-transform': 'scale('+ scale +')',
            'msTransform': 'scale('+ scale +')',
            'transform': 'scale('+ scale +')'
        });
    }

    function setPageId() {
        $('.page').each(function(i, elm) {
            var $elm = $(elm);

            $elm.attr('id', 'page_' + i);
        });
    }

    function initMenu() {
        initPagelist();
        initViewMode();
        initPageControl();

        $blockOption.find('.btn-option').on({
            'click': function() {
                $settings.toggleClass('show')
            }
        });
    }

    function initPagelist() {
        var $select = $('<select class="list-page">');
        $settings.append($select);
        $('.page').each(function(i, elm) {
            var $elm = $(elm);

            var $option = $('<option>');
            $option.text($elm.find('h1').text());
            $option.val(i);
            $select.append($option);
        });

        $select.on('change', function(evt) {
            cur = evt.target.value;
            gotoPage(cur);
        });
    }

    function initViewMode() {
        $('.view-mode').on('change', function(evt) {
            var mode = evt.target.value;

            if(false) {
            } else if(mode === 'presentation') {
                $('.wrapper').removeClass('view-expand').addClass('view-presentation');
            } else if(mode === 'expand') {
                $('.wrapper').removeClass('view-presentation').addClass('view-expand');
                $('html, body').scrollTop($('#page_' + cur).offset().top);
            }
        });
    }

    function initPageControl() {
        var $ctrl = $('.page-control');
        $ctrl.find('.head').on('click', function() {
            cur = 0;
            gotoPage(0);
        });
        $ctrl.find('.prev').on('click', function() {
            prevPage();
        });
        $ctrl.find('.next').on('click', function() {
            nextPage();
        });
        $ctrl.find('.foot').on('click', function() {
            cur = totalPage - 1;
            gotoPage(cur);
        });
    }
}());