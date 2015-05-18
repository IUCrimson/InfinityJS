(function (container) {
    var infinityjs = BBUI.ns('InfinityJS'),
        html = infinityjs.getFormValue(container, 'HTML');

    if (infinityjs.isValidUrl(html))
        $.get(html).success(initApp);
    else
        initApp(html);

    function initApp(html) {
        $("#" + container.containerContentEl.id + " .UIModelAppContainer")
            .html(html)
            .promise().done(function () {
                var css = infinityjs.getFormValue(container, 'CSS'),
                    js = infinityjs.getFormValue(container, 'JS');

                if (css) infinityjs.addCss(css);
                if (js) infinityjs.addJs(js);
            });
    }
})();
