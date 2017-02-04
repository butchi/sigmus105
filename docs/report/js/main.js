(function() {
    init();

    function init() {
        initFigureNo();
        initSectionRef();
        initFigureRef();
        initCiteRef();
    }

    /*
     *  CSSカウンターでうまく番号を振れなかったのでスクリプト制御
     */
    function initFigureNo() {
        var $figure = $('section > figure');

        $figure.each(function(i, elm) {
            $elm = $(elm);

            var $jCaption = $elm.find('> figcaption p').eq(0);
            var jText = $jCaption.html();
            $jCaption.html('<span class="fig-no">図' + (i + 1) + ' </span>' + jText);

            var $eCaption = $elm.find('> figcaption p:lang(en)');
            var eText = $eCaption.html();
            $eCaption.html('<span class="fig-no">Fig. ' + (i + 1) + ' </span>' + eText);
        });
    }

    function initSectionRef() {
        // 小小節未対応
        var $sec = $('article > section');
        var $ref = $('.ref');

        $sec.each(function(i, elm) {
            var $elm = $(elm);
            var id = elm.id;
            $ref.filter('[href="#' + id + '"]').text((i + 1) + '節');

            var $subSec = $elm.find('> section');
            $subSec.each(function(iSub, elmSub) {
                var $elmSub = $(elmSub);
                var idSub = elmSub.id;
                $ref.filter('[href="#' + idSub + '"]').text((i + 1) + '.' + (iSub + 1) + '節');
            });
        });
    }

    function initFigureRef() {
        var $figure = $('section > figure');
        var $ref = $('.figref');

        $figure.each(function(i, elm) {
            var id = elm.id;
            $ref.filter('[href="#' + id + '"]').text('図' + (i + 1));
        });
    }

    function initCiteRef() {
        var $cite = $('.cite');
        var $bib = $('.thebibliography .bibitem');

        $bib.each(function(i, elm) {
            var id = elm.id;
            $cite.filter('[href="#' + id + '"]').text('[' + (i + 1) + ']');
        });
    }
}());