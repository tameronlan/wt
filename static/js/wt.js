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

    slider.timeToNext = 10000; //время до пролистывания

    slider.init = function(){
        if ( slider.inited ) return;

        slider.$wrapper = $('.wt-slider_wrapper');
        slider.$inner = $('.wt-slider_inner');
        slider.$pointers = {};
        slider.$pointers.right = $('.wt-slider_pointer_right')
        slider.$pointers.left = $('.wt-slider_pointer_left')
        slider.$items = $('.wt-slider_item');
        slider.$loaderInner = $('.wt-carousel_autoloader_inner');

        slider.length = slider.$items.length;

        if ( !slider.length || wt.windowWidth < 720) return;

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
        slider.$loaderInner.animate({
            'width' : '100%',
            'opacity' : 1
        }, slider.timeToNext);

        slider.timeoutToNext = setTimeout(slider.next, slider.timeToNext);
    };

    slider.checkPointers = function(){
        slider.$pointers.left[( slider.curI == 0 ? 'hide' : 'show')]();
        slider.$pointers.right[( slider.curI == slider.length - 1 ? 'hide' : 'show')]();
    };

    slider.next = function(fromPointer){
        var fromPointer = false || fromPointer;

        slider.show(slider.curI + 1);
    };


    slider.prev = function(fromPointer){
        var fromPointer = false || fromPointer;

        slider.show(slider.curI - 1);
    };

    slider.show = function(index){
        if ( typeof index == 'undefined' ) return;
        if ( index > slider.length - 1 || index < 0 ) return;

        if ( index == slider.curI ) {
           $(slider.$items.get(index)).addClass('wt-slider_item_current');
        } else {
            var $nextSlide = $(slider.$items.get(slider.curI));
            var $prevSlide = $(slider.$items.get(index));

            $prevSlide.removeClass('wt-slider_item_current');
            $nextSlide.addClass('wt-slider_item_current');

            slider.curI = index;
        }

        slider.checkPointers();
    };
};