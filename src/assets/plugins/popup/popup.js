/*!
 * popupプラグイン
 */
(function(root, factory) {
    'use strict';

    if (typeof module === 'object' && typeof exports === 'object') {
        module.exports = factory(require('jquery'));
    } else if (typeof define === 'function' && define.amd) {
        define(['jquery'], factory);
    } else {
        window.popup = factory(root.jQuery);
    }

}(this, function($) {
    'use strict';

    var $popupLayer,
        $mask,
        $doc = $(document),
        noop = function() {},
        globalOptions = {},
        // eventType = !!navigator.userAgent.match(/mobile/i) ? 'touchend' : 'click',
        eventType = 'click',
        initBeforeLoadCount = 0, // ローディング開始(0により大きいの場合開始)
        popupLayerIsShow = false, // popup表示フラグ
        maskIsShow = false, // mask表示フラグ
        maskHolder = null, // maskHolder
        showList = [], // 表示リスト
        alertQueue = [], // alert、confirmのpopupリスト
        loadQueue = [], // loading、done、failのpopupリスト
        msgQueue = [], // messageのpopupリスト
        boxPool = []; // box 対象プール

    setGlobalOptions({
        alert: {
            title: '提示',
            text: '', // テキスト内容
            html: '', // html 内容
            htmlFrom: null,
                           
            button: ['OK'],
            className: '', 
            globalClose: true,
                            
            queue: true,
            mask: true,
            showClose: false,
            open: noop,
            beforeClose: noop,
            close: noop,
            in: {
                start: {
                    'scale': 1.5,
                    'opacity': 0
                },
                end: {
                    'scale': 1,
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        confirm: {
            title: '提示',
            text: '',
            html: '',
            htmlFrom: null,
            button: ['取消', '确定'],
            className: '',
            globalClose: true,
            queue: true,
            mask: true,
            showClose: false,
            open: noop,
            beforeClose: noop,
            close: noop,
            in: {
                start: {
                    'scale': 1.5,
                    'opacity': 0
                },
                end: {
                    'scale': 1,
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        loading: {
            text: '',
            className: '',
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        done: {
            text: '',
            className: '',
            clickClose: true,
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 1000,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        fail: {
            text: '',
            className: '',
            clickClose: true,
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 1000,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        },

        message: {
            text: '',
            className: '',
            clickClose: true,
            globalClose: true,
            queue: true,
            mask: false,
            cover: false,
            delay: 2000,
            open: noop,
            close: noop,
            in: {
                start: {
                    'opacity': 0
                },
                end: {
                    'opacity': 1
                },
                duration: 200,
                easing: ''
            },
            out: {
                start: {
                    'opacity': 1
                },
                end: {
                    'opacity': 0
                },
                duration: 200,
                easing: ''
            }
        }
    });

    setGlobalOptions({
        container: {
            template: '<div id="popupLayer"></div>'
        },

        alert: {
            /**
             * popup-header
             * popup-header-text
             * popup-text
             * popup-html
             * popup-button
             * popup-button-text
             * popup-footer
             */
            template: '\
                <div class="popup-box popup-alert">\
                    <div class="popup-header popup-header-text"></div>\
                    <div class="popup-text"></div>\
                    <div class="popup-html"></div>\
                    <div class="popup-footer">\
                        <div class="popup-button">\
                            <span class="popup-button-text"></span>\
                        </div>\
                    </div>\
                    <div class="popup-close"></div>\
                </div>',
            factory: boxFactory
        },

        confirm: {
            /**
             * popup-header
             * popup-header-text
             * popup-text
             * popup-html
             * popup-button
             * popup-button-text
             * popup-footer
             */
            template: '\
                <div class="popup-box popup-confirm">\
                    <div class="popup-header popup-header-text"></div>\
                    <div class="popup-text"></div>\
                    <div class="popup-html"></div>\
                    <div class="popup-footer">\
                        <div class="popup-button popup-button-left">\
                            <span class="popup-button-text"></span>\
                        </div>\
                        <div class="popup-button popup-button-right">\
                            <span class="popup-button-text"></span>\
                        </div>\
                    </div>\
                    <div class="popup-close"></div>\
                </div>',
            factory: boxFactory
        },

        loading: {
            /**
             * popup-text
             */
            template: '\
                <div class="popup-box popup-loading">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        done: {
            /**
             * popup-text
             */
            template: '\
                <div class="popup-box popup-done">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        fail: {
            /**
             * popup-text
             */
            template: '\
                <div class="popup-box popup-fail">\
                    <div class="popup-icon"></div>\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        },

        message: {
            /**
             * popup-text
             */
            template: '\
                <div class="popup-box popup-message">\
                    <div class="popup-text"></div>\
                </div>',
            factory: boxFactory
        }
    });

    /**
     * デフォルト box 工場関数
     * @param  {String} template テンプレート
     * @return {Object}           DOMまはたjQuery対象
     */
    function boxFactory(template) {
        return $(template);
    }

    /**
     * グローバル配置を設定
     * @param {String|Object} type    タイプ：container、alert、confirm、loading、done、fail、message
     * @param {Object}        options 配置対象
     */
    function setGlobalOptions(type, options) {
        if (typeof type === 'string') {
            setOptions(type, options);
        } else if (typeof type === 'object') {
            options = type;
            for (type in options) {
                setOptions(type, options[type]);
            }
        }
    }

    function setOptions(type, options) {
        if (typeof options === 'object') {

            // テンプレート変更
            if (!globalOptions[type] || options.template !== globalOptions[type].template) {
                if (type === 'container') {
                    if ($popupLayer) {
                        $popupLayer.off();
                        $popupLayer.remove();
                    }

                    $popupLayer = $(options.template).hide().css({ 'position': 'relative', 'width': 0, 'height': 0 }).appendTo(document.body);
                    $mask = createWrap('popup-mask').css('pointer-events', 'none').hide().appendTo($popupLayer);

                    $popupLayer.on(eventType, '.popup-button', function() { // 確定
                        var $button = $(this),
                            box = $button.closest($popupLayer.children()).data('box');

                        if (box.closed) return;

                        var index = box.$box.find('.popup-button').index($button);

                        if (index >= 0) {
                            eventHandle(index + 1, this, box);
                        }
                    });

                    $popupLayer.on(eventType, '.popup-close', function() { // 閉じる
                        var box = $(this).closest($popupLayer.children()).data('box');
                        if (box.closed) return;
                        eventHandle(0, this, box);
                    });
                } else {
                    var i = boxPool.length;
                    while (i--) {
                        if (boxPool[i].type === type) boxPool[i].created = false;
                    }
                }
            }
        }

        if (globalOptions[type]) {
            var props = ['in', 'out'],
                animationProps = ['start', 'end'];

            props.forEach(function(prop) {
                if (options[prop]) {
                    animationProps.forEach(function(animationProp) {
                        if (options[prop][animationProp]) {
                            delete globalOptions[type][prop][animationProp];
                        }
                    });
                }
            });
        }

        globalOptions[type] = $.extend(true, globalOptions[type], options);
    }

    function eventHandle(num, elem, box) {
        if (isFunc(box.options.beforeClose)) {
            box.options.beforeClose.call(box, num, elem, box.close);
        } else {
            box.close();
        }
    }

    function isFunc(func) {
        return typeof func === 'function' && func !== noop
    }

    function createWrap(className) {
        return $('<div>')
            .addClass(className)
            .css({
                'position': 'fixed',
                'left': 0,
                'right': 0,
                'top': 0,
                'bottom': 0,
                'z-index': 0,
                'z': 0
            });
    }

    // DOMであるかどうかを判定
    function isDOM(dom) {
        return /^\[object HTML.*\]$/.test(Object.prototype.toString.call(dom));
    }

    // jQuery対象であるかどうかを判定
    function isJQ(jq) {
        return jq instanceof $;
    }

    // Boxを閉じる
    function clickClose() {
        var box,
            i = showList.length;
        while (i--) {
            box = showList[i];
            if (!box.closed && box.options.clickClose && box.type.match(/^(done|fail|message)$/)) {
                box.close();
                return;
            }
        }
    }

    // 表示リストに入れる
    function addShowList(box) {
        box.zIndex = showList.length;
        box.$wrap.css('z-index', box.zIndex);
        showList.push(box);
    }

    // 表示リストから削除
    function removeShowList(box) {
        showList.splice(box.zIndex, 1);

        $.each(showList, function(i, box) {
            box.zIndex = i;
            box.$wrap.css('z-index', i);

            if (box === maskHolder) {
                setMaskZIndex(i);
            }
        });
    }

    function maskControl(box) {
        var zIndex,
            options = box.options;

        if (options.mask) {

            if (!box.closed) {
                zIndex = box.zIndex;
                maskHolder = box;
            } else if (box === maskHolder) {
                zIndex = -1;
                var i = box.zIndex;
                while(i--) {
                    box = showList[i];
                    if (!box.closed && box.options.mask) {
                        zIndex = box.zIndex;
                        maskHolder = box;
                        break;
                    }
                }
            }
        }

        if (zIndex === undefined) {
            return;
        } else if (zIndex >= 0) {
            setMaskZIndex(zIndex);

            if (!maskIsShow) {
                maskIsShow = true;
                $mask.stop().fadeIn(options.in.duration);
                curEffect.addMaskEffect();
            }
        } else if (maskIsShow) {
            maskIsShow = false;
            $mask.stop().fadeOut(options.out.duration);
            curEffect.removeMaskEffect();
            maskHolder = null;
        }
    }

    function setMaskZIndex(zIndex) {
        $mask.css('z-index', zIndex);
    }

    function getQueue(type) {
        if (type.match(/^(alert|confirm)$/)) {
            return alertQueue;
        } else if (type.match(/^(loading|done|fail)$/)) {
            return loadQueue;
        } else if (type === 'message') {
            return msgQueue;
        }
    }

    // loadingBoxのインデックスを受ける
    function getLoadingBoxIndex(loadingBox) {
        var index = -1;

        if (loadingBox) {
            if (loadingBox.type === 'loading' && loadingBox.queue) {
                index = loadingBox.queue.indexOf(loadingBox);
            }
        } else {
            $.each(loadQueue, function(i, box) {
                if (box.type === 'loading') {
                    index = i;
                    return false;
                }
            });
        }

        return index;
    }

    function getBox(type, content, beforeClose) {
        var options = $.extend(true, {}, globalOptions[type]);
        delete options.open;
        delete options.close;

        if ($.isPlainObject(content)) {
            $.extend(true, options, content);
        } else if (content !== undefined) {
            options.text = content + '';
        }

        if (typeof beforeClose === 'function') {
            options.beforeClose = beforeClose;
        }

        if (typeof options.button === 'string') {
            options.button = $.map(options.button.split(','), function(n) {
                return $.trim(n);
            });
        }

        var box, b,
            i = boxPool.length;

        while (i--) {
            b = boxPool[i];
            if (b.type === type) {
                box = b;
                box.options = options;
                box.recycled = false;
                boxPool.splice(i, 1);
                break;
            }
        }

        if (!box) {
            box = new Box(type, options);
        }

        return box;
    }

    function Box(type, options) {
        this.type = type;
        this.options = options;

        for (var p in this) {
            if (typeof this[p] === 'function') {
                this[p] = $.proxy(this, p);
            }
        }
    }

    Box.prototype = {

        /**
         * 初期化
         * @param  {Number} index インデックス
         */
        _init: function(index) {
            if (this.inited || this.recycled) return;
            this.inited = true;

            if (this.options.queue) {
                this.queue = getQueue(this.type);
            }

            if (!this.queue || !this.queue.length) {
                this._open();
            }

            if (this.queue) {
                if (index >= 0) {
                    this.queue.splice(index, 0, this);
                } else {
                    this.queue.push(this);
                }
            }
        },

        _create: function() {
            if (this.created || this.recycled) return;
            this.created = true;

            var $box,
                options = this.options,
                $wrap = createWrap('popup-wrap'),
                boxOrigin = options.factory(options.template);

            if (isJQ(boxOrigin)) {
                $box = boxOrigin;
            } else if (isDOM(boxOrigin)) {
                $box = $(boxOrigin);
            } else {
                $box = $(boxOrigin.dom);
                $.extend(this, boxOrigin);
            }

            $box.hide().appendTo($wrap);

            this.$container = $popupLayer;
            this.$wrap = $wrap;
            this.$box = $box;
        },

        _dataFill: function() {
            if (this.dataFilled || this.recycled) return;
            this.dataFilled = true;

            var type = this.type,
                options = this.options,
                $wrap = this.$wrap,
                $box = this.$box;

            $wrap.data('box', this);

            if (options.className) {
                $box.addClass(options.className);
            }

            var $boxText = $box.find('.popup-text');
            if (options.text) $boxText.html(options.text).show();
            else $boxText.hide();

            if (type.match(/^(alert|confirm)$/)) {

                var $boxClose = $box.find('.popup-close'),
                    $boxHeader = $box.find('.popup-header'),
                    $boxHtml = $box.find('.popup-html'),
                    $boxFooter = $box.find('.popup-footer');

                if (options.showClose) $boxClose.show();
                else $boxClose.hide();

                if (options.html) $boxHtml.html(options.html).show();
                else $boxHtml.hide();

                if (options.title) {
                    $box.find('.popup-header-text').html(options.title);
                    $boxHeader.show();
                } else {
                    $boxHeader.hide();
                }

                if (options.button) {
                    $box.find('.popup-button').each(function(i, elem) {
                        $('.popup-button-text', elem).html(options.button[i]);
                    });
                    $boxFooter.show();
                } else {
                    $boxFooter.hide();
                }
            }
        },

        _open: function() {
            if (this.opened || this.recycled) return;
            this.opened = true;

            if (!popupLayerIsShow) {
                popupLayerIsShow = true;
                $popupLayer.show();
                $doc.on(eventType, clickClose);
            }

            this._create();
            this._dataFill();

            var self = this,
                type = this.type,
                gOptions = globalOptions[type],
                options = this.options,
                queue = this.queue;

            if (!options.cover && type.match(/^(loading|done|fail|message)$/)) {
                this.$wrap.css('pointer-events', 'none');
            } else {
                document.activeElement && document.activeElement.blur();
            }

            addShowList(this);
            maskControl(this);
            this.$wrap.appendTo($popupLayer);
            this.$box.css('z', 0).css(options.in.start).show();

            try {
                if (isFunc(gOptions.open)) {
                    gOptions.open.call(this);
                }
                if (isFunc(options.open)) {
                    options.open.call(this);
                }
            } catch(err) {
                throw err;
            }

            this.$box.animate(options.in.end, options.in.duration, options.in.easing, function() {
                if (type.match(/^(done|fail|message)$/)) {
                    self.$box.delay(options.delay).queue(function(next) {
                        next();
                        self._close();
                    });
                }
            });

            if (queue && queue.lastBox) {
                queue.lastBox.$box.finish();
            }
        },

        _close: function() {
            if (this.closed || this.recycled) return;
            this.closed = true;

            maskControl(this);

            var self = this,
                options = this.options,
                queue = this.queue;

            if (queue) {
                queue.shift();
                if (queue.length) {
                    this._remove();
                    queue[0]._open();
                    return;
                }
                queue.lastBox = this;
            }

            this.$box
                .stop().stop()
                .css('pointer-events', 'none')
                .css(options.out.start)
                .animate(options.out.end, options.out.duration, options.out.easing, function() {
                    if (queue && queue.lastBox) {
                        queue.lastBox = null;
                    }
                    self._remove();
                });
        },

        _remove: function() {
            if (this.removed || this.recycled) return;
            this.removed = true;

            var gOptions = globalOptions[this.type],
                options = this.options;

            try {
                if (isFunc(gOptions.close)) {
                    gOptions.close.call(this);
                }
                if (isFunc(options.close)) {
                    options.close.call(this);
                }
            } catch(err) {
                throw err;
            }

            if (options.htmlFrom && (isDOM(options.html) || isJQ(options.html))) {
                $(options.htmlFrom).append(options.html);
            }

            removeShowList(this);

            this.$wrap.remove();
            this.$wrap.css('pointer-events', '');
            this.$box.attr('style', '');
            if (options.className) {
                this.$box.removeClass(options.className);
            }

            this._recycle();

            if (!showList.length && !alertQueue.length && !loadQueue.length && !msgQueue.length) {
                popupLayerIsShow = false;
                $popupLayer.hide();
                $doc.off(eventType, clickClose);
            }
        },

        _recycle: function() {
            if (this.recycled) return;
            this.recycled = true;

            this.inited = false;
            this.opened = false;
            this.dataFilled = false;
            this.opened = false;
            this.closed = false;
            this.removed = false;
            this.queue = null;

            boxPool.push(this);
        },

        close: function() {
            if (this.closed || this.recycled) return;
            if (this.opened) {
                this._close();
            } else {
                if (this.queue) this.queue.splice(this.queue.indexOf(this), 1);
                this._recycle();
            }
        }
    }

    /**
     * boxを閉じる
     * @param  {Box|String} box box対象
     */
    function close(box) {
        if (box instanceof Box) {
            box.close();
            return;
        }

        var i,
            type = box;

        if (!type) {
            initBeforeLoadCount = 0;

            $.each([alertQueue, loadQueue, msgQueue], function(index, queue) {
                i = queue.length;
                while (i--) {
                    box = queue[i];
                    if (box.options.globalClose) {
                        box.close();
                    }
                }
            });

            i = showList.length;
            while (i--) {
                box = showList[i];
                if (box.options.globalClose) {
                    box.close();
                }
            }

            return;
        }

        if (type === 'loading' && initBeforeLoadCount > 0) {
            initBeforeLoadCount--;
            return;
        }

        var queue = getQueue(type);

        i = loadQueue.length;
        while (i--) {
            box = loadQueue[i];
            if (box.type === type && box.options.globalClose) {
                box.close();
                return;
            }
        }

        i = showList.length;
        while (i--) {
            box = showList[i];
            if (!box.closed && box.type === type && box.options.globalClose) {
                box.close();
                return;
            }
        }
    }

    /**
     * alert ポップアップ画面
     * @param  {String|Object} content
     * @param  {Function}      beforeClose
     * @return {Box}                       
     */
    function alert(content, beforeClose) {
        var box = getBox('alert', content, beforeClose);
        box._init();
        return box;
    }

    /**
     * confirm 選択画面
     * @param  {String|Object} content
     * @param  {Function}      beforeClose
     * @return {Box}
     */
    function confirm(content, beforeClose) {
        var box = getBox('confirm', content, beforeClose);
        box._init();
        return box;
    }

    /**
     * loading 起動
     * @param  {String|Object} content
     * @return {Box}
     */
    function loading(content) {
        var box = getBox('loading', content);

        initBeforeLoadCount++;
        setTimeout(function() {
            if (initBeforeLoadCount > 0) {
                initBeforeLoadCount--;
                box._init();
            }
        });

        return box;
    }

    /**
     * loading 終了
     * @param  {Box} loadingBox
     */
    function loaded(loadingBox) {
        if (loadingBox && loadingBox.type === 'loading') {
            loadingBox.close();
        } else {
            close('loading');
        }
    }

    /**
     * loading 完了
     * @param  {Box}           loadingBox
     * @param  {String|Object} content
     * @return {Box}
     */
    function done(loadingBox, content) {
        if (!(loadingBox instanceof Box)) {
            content = loadingBox;
            loadingBox = undefined;
        }

        var box = getBox('done', content);
        setTimeout(function() {
            var index = getLoadingBoxIndex(loadingBox);

            if (index < 0) {
                index = undefined;
            } else {
                index++;
            }

            box._init(index);
            loaded(loadingBox);
        });

        return box;
    }

    /**
     * loading 失敗
     * @param  {Box}           loadingBox
     * @param  {String|Object} content
     * @return {Box}
     */
    function fail(loadingBox, content) {
        if (!(loadingBox instanceof Box)) {
            content = loadingBox;
            loadingBox = undefined;
        }

        var box = getBox('fail', content);
        setTimeout(function() {
            var index = getLoadingBoxIndex(loadingBox);

            if (index < 0) {
                index = undefined;
            } else {
                index++;
            }

            box._init(index);
            loaded(loadingBox);
        });

        return box;
    }

    /**
     * message メッセージ
     * @param  {String|Object} content
     * @return {Box}
     */
    function message(content) {
        var box = getBox('message', content);
        setTimeout(box._init);
        return box;
    }

    /**
     * ポップアップ
     * @param  {Object} options
     * @return {Box}
     */
    function popup(options) {
        return popup[options.type](options);
    }

    var effect = {
        'NORMAL': function() {
            return {
                addMaskEffect: noop,
                removeMaskEffect: noop,
                destroy: noop
            }
        },

        'BLUR': function() {
            var $style = $('<style>')
                .text('\
                    body > :not(#popupLayer) {\
                        -webkit-filter: blur(4px);\
                    }\
                ');
            return {
                addMaskEffect: function() {
                    $style.appendTo(document.head);
                },
                removeMaskEffect: function() {
                    $style.detach();
                },
                destroy: function() {
                    $style.remove();
                    $style = null;
                }
            }
        }
    }

    setMaskEffect('NORMAL');

    var curEffect;
    function setMaskEffect(effectType) {
        if (!effect[effectType]) return;
        if (curEffect) curEffect.destroy();
        curEffect = effect[effectType]();
    }

    return $.extend(popup, {
        alert: alert,
        confirm: confirm,
        loading: loading,
        loaded: loaded,
        done: done,
        fail: fail,
        message: message,

        setGlobalOptions: setGlobalOptions,

        setMaskEffect: setMaskEffect,
        effect: effect,

        close: close
    });

}));