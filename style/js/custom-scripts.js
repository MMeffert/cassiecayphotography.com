/**
 * Custom Scripts - Cassie Cay Photography
 * Extracted from scripts.js - only includes initializations used by the site
 *
 * Phase 7 JavaScript Cleanup - Created 2026-01-20
 */
$(document).ready(function() {
    'use strict';
    /*-----------------------------------------------------------------------------------*/
    /*	HERO SLIDER (Embla Carousel)
    /*-----------------------------------------------------------------------------------*/
    var heroSlider = document.querySelector('.hero-slider');
    if (heroSlider) {
        var viewportNode = heroSlider.querySelector('.embla__viewport');
        var slides = heroSlider.querySelectorAll('.embla__slide');

        // Initialize with autoplay
        var emblaApi = EmblaCarousel(
            viewportNode,
            {
                loop: true,
                draggable: false  // No manual navigation per requirements
            },
            [
                EmblaCarouselAutoplay({
                    delay: 6000,              // 6 seconds between slides
                    stopOnInteraction: false, // Don't stop on any interaction
                    stopOnMouseEnter: false,  // DON'T pause on hover (fixes BUG-03)
                    playOnInit: true          // Start automatically
                })
            ]
        );

        // Handle fade effect via CSS class
        function setSelectedClass() {
            var selected = emblaApi.selectedScrollSnap();
            slides.forEach(function(slide, index) {
                if (index === selected) {
                    slide.classList.add('is-selected');
                } else {
                    slide.classList.remove('is-selected');
                }
            });
        }

        emblaApi.on('select', setSelectedClass);
        setSelectedClass(); // Set initial state
    }
    /*-----------------------------------------------------------------------------------*/
    /*	STICKY HEADER
    /*-----------------------------------------------------------------------------------*/
    if ($(".navbar").length) {
        var options = {
            offset: 350,
            offsetSide: 'top',
            classes: {
                clone: 'banner--clone fixed',
                stick: 'banner--stick',
                unstick: 'banner--unstick'
            },
            onStick: function() {
                $($.SmartMenus.Bootstrap.init);
            },
            onUnstick: function() {
                $('.navbar .btn-group').removeClass('open');
            }
        };
        var banner = new Headhesive('.navbar', options);
    }
    /*-----------------------------------------------------------------------------------*/
    /*	HAMBURGER MENU ICON
    /*-----------------------------------------------------------------------------------*/
	$(".hamburger.animate").on( "click", function() {
        $(".hamburger.animate").toggleClass("active");
    });
    $('.onepage .navbar .nav li a').on('click', function() {
        $('.navbar .navbar-collapse.show').collapse('hide');
        $('.hamburger.animate').removeClass('active');
    });
    /*-----------------------------------------------------------------------------------*/
    /*	SWIPER
    /*-----------------------------------------------------------------------------------*/
    $(".basic-slider").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("basic-slider-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("basic-slider-pagination-" + index);
        var swiper1 = new Swiper(".basic-slider-" + index, {
            slidesPerView: 1,
            spaceBetween: 0,
            autoHeight: true,
            grabCursor: true,
            pagination: {
                el: ".basic-slider-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    /*-----------------------------------------------------------------------------------*/
    /*	IMAGE ICON HOVER
    /*-----------------------------------------------------------------------------------*/
    $('.overlay > a, .overlay > span').prepend('<span class="bg"></span>');
    /*-----------------------------------------------------------------------------------*/
    /*	GLIGHTBOX (replaced LightGallery - Phase 8)
    /*-----------------------------------------------------------------------------------*/
    var lightbox = GLightbox({
        selector: '.light-gallery a',
        touchNavigation: true,
        loop: true,
        closeOnOutsideClick: true,
        keyboardNavigation: true,
        slideEffect: 'fade'
    });
    /*-----------------------------------------------------------------------------------*/
    /*	CUBE PORTFOLIO (MOSAIC)
    /*-----------------------------------------------------------------------------------*/
    var $cubemosaic = $('#cube-grid-mosaic');
    $cubemosaic.cubeportfolio({
        filters: '#cube-grid-mosaic-filter',
        loadMore: '#cube-grid-mosaic-more',
        loadMoreAction: 'click',
        layoutMode: 'mosaic',
        mediaQueries: [{width: 1440, cols: 4}, {width: 1024, cols: 4}, {width: 768, cols: 3}, {width: 575, cols: 2}, {width: 320, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 0,
        gapVertical: 0,
        gridAdjustment: 'responsive',
        caption: 'fadeIn',
        displayType: 'bottomToTop',
        displayTypeSpeed: 100,
        plugins: {
            loadMore: {
                loadItems: 4
            }
        }

    });
    $cubemosaic.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
        // Reload GLightbox to pick up new images
        lightbox.reload();
    });
    $cubemosaic.on('onFilterComplete.cbp', function() {
        // Reload GLightbox after filtering to ensure all visible images are included
        lightbox.reload();
    });
    /*-----------------------------------------------------------------------------------*/
    /*	BACKGROUND IMAGE
    /*-----------------------------------------------------------------------------------*/
    $(".bg-image").css('background-image', function() {
        var bg = ('url(' + $(this).data("image-src") + ')');
        return bg;
    });
    /*-----------------------------------------------------------------------------------*/
    /*	GO TO TOP
    /*-----------------------------------------------------------------------------------*/
    $.scrollUp({
        scrollName: 'scrollUp',
        // Element ID
        scrollDistance: 300,
        // Distance from top/bottom before showing element (px)
        scrollFrom: 'top',
        // 'top' or 'bottom'
        scrollSpeed: 300,
        // Speed back to top (ms)
        easingType: 'linear',
        // Scroll to top easing (see http://easings.net/)
        animation: 'fade',
        // Fade, slide, none
        animationInSpeed: 200,
        // Animation in speed (ms)
        animationOutSpeed: 200,
        // Animation out speed (ms)
        scrollText: '<span style="background:#9A7A7D;" class="btn btn-square btn-full-rounded btn-icon"><i class="fa fa-chevron-up"></i></span>',
        // Text for element, can contain HTML
        scrollTitle: false,
        // Set a custom <a> title if required. Defaults to scrollText
        scrollImg: false,
        // Set true to use image
        activeOverlay: false,
        // Set CSS color to display scrollUp active point, e.g '#00FFFF'
        zIndex: 1001 // Z-Index for the overlay
    });
    /*-----------------------------------------------------------------------------------*/
    /*	PARALLAX MOBILE
    /*-----------------------------------------------------------------------------------*/
    if (navigator.userAgent.match(/Android/i) || navigator.userAgent.match(/webOS/i) || navigator.userAgent.match(/iPhone/i) || navigator.userAgent.match(/iPad/i) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1) || navigator.userAgent.match(/iPod/i) || navigator.userAgent.match(/BlackBerry/i)) {
		$('.image-wrapper').addClass('mobile');
	}
    /*-----------------------------------------------------------------------------------*/
    /*	ONEPAGE HEADER OFFSET
    /*-----------------------------------------------------------------------------------*/
    var header_height = $('.navbar:not(.banner--clone)').outerHeight();
    var shrinked_header_height = 68;
    var firstStyle = {
        'padding-top': '' + shrinked_header_height + 'px',
        'margin-top': '-' + shrinked_header_height + 'px'
    };
    $('.onepage section').css(firstStyle);
    var secondStyle = {
        'padding-top': '' + header_height + 'px',
        'margin-top': '-' + header_height + 'px'
    };
    $('.onepage section:first-of-type').css(secondStyle);
	/*-----------------------------------------------------------------------------------*/
    /*	ONEPAGE NAV LINKS
    /*-----------------------------------------------------------------------------------*/
	var empty_a = $('.onepage .navbar ul.navbar-nav a[href="#"]');
	empty_a.on('click', function(e) {
	    e.preventDefault();
	});
    /*-----------------------------------------------------------------------------------*/
	/*	ONEPAGE SMOOTH SCROLL
	/*-----------------------------------------------------------------------------------*/
	$(function() {
	  setTimeout(function() {
	    if (location.hash) {
	      window.scrollTo(0, 0);
	      var target = location.hash.split('#');
	      smoothScrollTo($('#'+target[1]));
	    }
	  }, 1);
	  $('a.scroll[href*=#]:not([href=#])').on('click', function() {
	    if (location.pathname.replace(/^\//,'') == this.pathname.replace(/^\//,'') && location.hostname == this.hostname) {
	      smoothScrollTo($(this.hash));
	      return false;
	    }
	  });
	  function smoothScrollTo(target) {
	    var target = target.length ? target : $('[name=' + this.hash.slice(1) +']');

	    if (target.length) {
	      $('html,body').animate({
	        scrollTop: target.offset().top
	      }, 1500, 'easeInOutExpo');
	    }
	  }
	});
});
