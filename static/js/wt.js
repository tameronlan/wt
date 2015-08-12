var wt = new function(){
    var wt = this;

    wt.init = function(){
        wt.$window = $(window);
        wt.$body = $('body');
        wt.windowWidth = wt.$window.width();
        wt.windowHeight = wt.$window.height();

        wt.$window.bind('resize', wt.onResize);
    };

    wt.onResize = function(){
        wt.windowWidth = wt.$window.width();
        wt.windowHeight = wt.$window.height();

        if ( wt.slider.inited && wt.windowWidth < 720 ) {
            wt.slider.destroy();
        } else if ( !wt.slider.inited && wt.windowWidth >= 720 ){
            wt.slider.init();
        }
    };
};

wt.slider = new function(){
    var slider = this;

    slider.timeToNext = 10000; //

    slider.init = function(){
        if ( slider.inited ) return;

        slider.$wrapper = $('.wt-slider_wrapper');
        slider.$inner = $('.wt-slider_inner');
        slider.$pointers = {};
        slider.$pointers.right = $('.wt-slider_pointer_right')
        slider.$pointers.left = $('.wt-slider_pointer_left')
        slider.$items = $('.wt-slider_item');
        slider.$loaderInner = $('.wt-carousel_autoloader_inner');
        slider.$radios = $('.wt-slider_radios');

        slider.length = slider.$items.length;

        if ( !slider.length || wt.windowWidth < 720) return;

        slider.renderRadios();
        slider.$radioItems = $('.wt-slider_radio');
        slider.$items.removeClass('wt-slider_item_current');
        slider.$loaderInner.css('width' , 0);
        slider.inited = true;
        slider.autoList = true;
        slider.curI = 0;
        slider.startTimeout = setTimeout(wt.slider.start, 3000);
        slider.show(slider.curI);
    };

    slider.destroy = function(){
        clearTimeout(slider.startTimeout);
        clearTimeout(slider.nextTimeout);
        slider.inited = false;
    };

    slider.start = function(){
        slider.progressShow();
    };

    slider.renderRadios = function(){
        var _html = '';

        slider.$items.each(function(index){
            _html += '<div class="wt-slider_radio" onclick="wt.slider.show(' + index + ', true)"></div>';
        });

        slider.$radios.html(_html);
    };

    slider.progressShow = function(){
        slider.progressReset();

        slider.$loaderInner.animate({
            'width' : '100%',
            'opacity' : 1
        }, slider.timeToNext);

        slider.timeoutToNext = setTimeout(slider.next, slider.timeToNext);
    }

    slider.progressReset = function(){
        clearTimeout(slider.timeoutToNext);
        slider.$loaderInner.stop(true, true);
        slider.$loaderInner.css({
            'width' : 0,
            'opacity' : 0
        })
    }

    slider.checkPointers = function(){
        slider.$radios[( slider.curI == 0 ? 'hide' : 'show')]();
        slider.$pointers.left[( slider.curI == 0 ? 'hide' : 'show')]();
        slider.$pointers.right[( slider.curI == 0 ? 'add' : 'remove') + 'Class']('wt-slider_pointer_with_help');
        slider.$pointers.right[( slider.curI == slider.length - 1 ? 'hide' : 'show')]();
    };

    slider.next = function(fromPointer){
        var fromPointer = false || fromPointer;

        if ( slider.curI + 1 >= slider.length - 1 || fromPointer ) {
            slider.autoList = false;
        }

        if ( slider.autoList ) {
            slider.progressShow()
        } else {
            slider.progressReset();
        }

        slider.show(slider.curI + 1);
    };


    slider.prev = function(fromPointer){
        var fromPointer = false || fromPointer;

        if ( slider.curI - 1 < 0 || fromPointer ) {
            slider.autoList = false;
            slider.progressReset();
        }

        slider.show(slider.curI - 1);
    };

    slider.show = function(index, fromPointer){
        var fromPointer = false || fromPointer;

        if ( typeof index == 'undefined' ) return;
        if ( index > slider.length - 1 || index < 0 ) return;

        if ( fromPointer ) {
            slider.autoList = false;
            slider.progressReset();
        }

        if ( index == slider.curI ) {
           $(slider.$items.get(index)).addClass('wt-slider_item_current');
        } else {
            var $nextSlide = $(slider.$items.get(index));
            var $prevSlide = $(slider.$items.get(slider.curI));

            $prevSlide.removeClass('wt-slider_item_current');
            $nextSlide.addClass('wt-slider_item_current');

            slider.curI = index;
        }
        slider.$radioItems.removeClass('active');
        $(slider.$radioItems.get(index)).addClass('active');
        slider.checkPointers();
    };
};