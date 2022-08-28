(function() {
    const thisScript = document.currentScript;
    function getScriptHostname() {
        try {
            var match = thisScript.src.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                return thisScript.getAttribute('host') || match[2];
            }
        } catch (err) {
            return 'k2s.cc';
        }
        return 'k2s.cc';
    }
    document.addEventListener("DOMContentLoaded", function(event) {
        var previewScriptUrl = 'https://' + getScriptHostname() + '/js/preview.js';
        function previewExist(ufid, parent) {
            var otherScripts = parent ? parent.querySelectorAll('script') : null;
            for (var i in otherScripts) {
                if (otherScripts.hasOwnProperty(i)) {
                    if (otherScripts[i].dataset && otherScripts[i].dataset.url && otherScripts[i].dataset.url.indexOf('/' + ufid) !== -1) {
                        return true;
                    }
                }
            }
            var otherIframes = parent ? parent.querySelectorAll('iframe') : null;
            for (var a in otherIframes) {
                if (otherIframes.hasOwnProperty(a)) {
                    if (otherIframes[a].src && otherIframes[a].src.indexOf('/' + ufid) !== -1) {
                        return true;
                    }
                }
            }
            return false;
        }
        document.querySelectorAll('a').forEach(function(item) {
            var defaultContentOrderParams = ['link', 'preview'];
            var hrefRegExp = RegExp(/^https?:\/\/(?:k2s\.cc|keep2share\.cc|keep2s\.cc|fileboom\.me|fboom\.me|tezfiles\.com)\/file\/([\da-zA-Z\-]+)/i);
            var parent = item.parentNode.parentNode;
            if (hrefRegExp.test(item.href)) {
                var ufid = null;
                var ufidSearch = hrefRegExp.exec(item.href);
                if (ufidSearch !== null && ufidSearch[1] !== undefined) {
                    ufid = ufidSearch[1];
                }
                if (!ufid || !previewExist(ufid, parent)) {
                    var previewScriptTag = document.createElement('script');
                    previewScriptTag.src = previewScriptUrl;
                    if (thisScript.getAttribute('no-download') !== null) {
                        previewScriptTag.setAttribute('no-download', '');
                    }
                    for (var i in thisScript.dataset) {
                        previewScriptTag.dataset[i] = thisScript.dataset[i];
                    }
                    previewScriptTag.dataset.url = item.href;
                    var objects = {
                        "preview": previewScriptTag
                    };
                    var contentOrderParams;
                    if (previewScriptTag.dataset.contentOrder) {
                        contentOrderParams = previewScriptTag.dataset.contentOrder.toLowerCase().replace(' ', '').split(',');
                    } else {
                        contentOrderParams = defaultContentOrderParams;
                    }
                    var before = true;
                    for (var param in contentOrderParams) {
                        if (contentOrderParams[param] === 'link') {
                            before = false;
                        }
                        if (objects[contentOrderParams[param]]) {
                            item.parentNode.insertBefore(objects[contentOrderParams[param]], (before ? item : item.nextSibling));
                        }
                    }
                    if (contentOrderParams.indexOf('link') === -1) {
                        item.remove();
                    }
                }
            }
        });
    });
})(window);
