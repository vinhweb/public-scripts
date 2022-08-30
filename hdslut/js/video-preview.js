(function() {
    var defaultParams = {
        url: '',
        width: '400px',
        height: '56.25%',
        align: 'auto',
        padding: 0,
        allowFullscreen: true,
        webkitAllowFullscreen: true,
        mozAllowFullscreen: true
    };
    function getScriptHostname(url) {
        try {
            var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
            if (match != null && match.length > 2 && typeof match[2] === 'string' && match[2].length > 0) {
                return thisScript.getAttribute('host') || match[2];
            }
        } catch (err) {
            return 'k2s.cc';
        }
        return 'k2s.cc';
    }
    var thisScript = document.currentScript;
    var thisScriptWrap = thisScript.parentElement;
    var incomeParams = thisScript.dataset;
    var params = Object.assign(defaultParams, incomeParams);
    var urlObj = new URL(params.url);
    var baseUrl = 'https://' + getScriptHostname(params.url);
    var apiBaseUrl = 'https://api.' + getScriptHostname(params.url);
    var noDownloadAttr = thisScript.getAttribute('no-download') === null ? 0 : 1;
    function checkFileAvailability(fileId, onSuccess) {
        var availabilityPixel = new Image();
        availabilityPixel.onload = onSuccess;
        availabilityPixel.src = apiBaseUrl + '/v1/files/' + fileId + '/is-embeddable?asImage=1';
    }
    function loadPoster(fileId, onSuccess) {
        var poster = new Image();
        poster.onload = onSuccess;
        poster.src = baseUrl + '/video/' + fileId + '/cover';
    }
    function init() {
        var id = getUserFileId(params.url);
        if (!id) {
            return null;
        }
        checkFileAvailability(id, function() {
            loadPoster(id, function() {
                addStyles();
                renderPoster(id, this);
            });
        });
    }
    function getUserFileId() {
        return urlObj.pathname.replace('/file/view/', '').replace('/file/preview/', '').replace('/preview/', '').replace('/file/', '').split('/')[0];
    }
    function renderPoster(id, image) {
        var wrap = document.createElement('div');
        wrap.className = 'k2s-preview wrap';
        wrap.style.maxWidth = params.width;
        wrap.style.padding = params.padding;
        if (params.align === 'auto') {
            var parentStyles = window.getComputedStyle(thisScriptWrap, null);
            params.align = parentStyles.textAlign;
        }
        if (params.align === 'left') {
            wrap.style.margin = '0';
        }
        var subWrap = document.createElement('div');
        subWrap.style.paddingBottom = params.height;
        subWrap.className = 'sub-wrap';
        var loader = document.createElement('div');
        loader.className = 'k2s-loading-spinner';
        subWrap.appendChild(loader);
        function playHandler(e) {
            e.preventDefault();
            play.style.display = 'none';
            loader.classList.add('active');
            addWithIframe(id, subWrap);
        }
        var poster = document.createElement('div');
        poster.className = 'poster';
        poster.style.background = '#000 url(' + image.src + ') 50% 50% no-repeat';
        poster.style.backgroundSize = 'contain';
        poster.style.cursor = 'pointer';
        subWrap.appendChild(poster);
        poster.onclick = playHandler;
        var play = document.createElement('a');
        play.href = '#';
        play.className = 'play-btn';
        play.onclick = playHandler;
        var playIcon = document.createElement('i');
        playIcon.style.backgroundImage = 'url(' + baseUrl + '/static/media/play-button.svg)';
        play.appendChild(playIcon);
        subWrap.appendChild(play);
        if (!noDownloadAttr) {
            var download = document.createElement('a');
            download.className = 'download-btn';
            download.style.background = 'url(' + baseUrl + '/static/media/cloud.svg) no-repeat';
            download.style.backgroundSize = 'contain';
            download.target = '_blank';
            download.href = `${baseUrl}/file/${id}?site=${window.location.origin}&utm_source=partner&utm_medium=referral&forceDownload=1&utm_campaign=preview_download`;
            subWrap.appendChild(download);
        }
        wrap.appendChild(subWrap);
        thisScriptWrap.insertBefore(wrap, thisScript);
    }
    function addWithIframe(id, subWrap) {
        var url = baseUrl + '/preview/' + id + '?autoplay=1&no-download=' + noDownloadAttr;
        var iframe = document.createElement('iframe');
        iframe.className = 'k2s-iframe';
        iframe.style.display = 'none';
        iframe.scrolling = 'no';
        iframe.frameborder = '0';
        iframe.allow = 'autoplay; fullscreen';
        iframe.allowFullscreen = params.allowFullscreen;
        iframe.webkitAllowFullscreen = params.webkitAllowFullscreen;
        iframe.mozAllowFullscreen = params.mozAllowFullscreen;
        iframe.src = url;
        iframe.onload = function(ev) {
            clearContent(subWrap);
            iframe.style.display = 'block';
        };
        iframe.sandbox = "allow-storage-access-by-user-activation allow-scripts allow-same-origin allow-popups allow-popups-to-escape-sandbox";
        subWrap.appendChild(iframe);
    }
    function clearContent(node) {
        var i = node.childNodes.length;
        while (i--) {
            if (node.firstChild.tagName !== 'IFRAME') {
                node.removeChild(node.firstChild);
            }
        }
    }
    function addStyles() {
        if (!document.querySelector('#k2s-preview-style')) {
            var style = document.createElement('link');
            style.id = 'k2s-preview-style';
            style.rel = 'stylesheet';
            style.href = baseUrl + '/static/css/preview.css';
            document.querySelector('body').appendChild(style);
        }
    }
    init();
}());
