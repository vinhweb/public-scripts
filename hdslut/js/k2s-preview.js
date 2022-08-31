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
        var previewScriptUrl = 'https://' + getScriptHostname() + '/js/video-preview.js';
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
                    item.innerHTML = "<div class='link_preview_box'>" + item.innerHTML + "</div>"

                    let boxPricingDiv = document.createElement('div');
                    boxPricingDiv.className = 'buy-premium'
                    boxPricingDiv.innerHTML = '<div class="buy-premium-box"><label class="bp-label"><input type="radio" name="buy-prem" value="30" checked=""><span class="bp-item"><i class="bp-item-check"></i><span class="fw-bold">30 day membership</span><span class="muted">($21.95) month +10% days</span></span></label><label class="bp-label"><input type="radio" name="buy-prem" value="120"><span class="bp-item"><i class="bp-item-check"></i><span class="fw-bold">120 day membership</span><span class="muted">($17.32) month +10% days</span></span></label><label class="bp-label"><input type="radio" name="buy-prem" value="365"><span class="bp-item"><i class="bp-item-check"></i><span class="fw-bold">365 day membership</span><span class="muted">($11.75) month +10% days</span></span></label><div class="bp-submit"><a href="https://k2s.cc/promocode/40573389sexhdslut" target="_blank" class="btn">Buy Premium</a></div></div>'
                    item.parentNode.append(boxPricingDiv)

                    let heading = document.createElement('h4');
                    heading.innerHTML = '<div class="video_title_box">Watch online</div>'
                    item.parentNode.append(heading)


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
                    var before = false;
                    for (var param in contentOrderParams) {
                        if (contentOrderParams[param] === 'link') {
                            before = false;
                        }
                        if (objects[contentOrderParams[param]]) {
                            // item.parentNode.insertBefore(objects[contentOrderParams[param]], (before ? item : item.nextSibling));
                            item.parentNode.append(objects[contentOrderParams[param]])
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
