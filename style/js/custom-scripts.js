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
    /*	PORTFOLIO GRID (Muuri - replaced Cubeportfolio in Phase 11)
    /*-----------------------------------------------------------------------------------*/
    var portfolioGrid = document.getElementById('portfolio-grid');
    var grid = null;

    if (portfolioGrid) {
        // Remove lazy loading from portfolio images before Muuri init
        // to ensure accurate dimensions for masonry layout
        portfolioGrid.querySelectorAll('img[loading="lazy"]').forEach(function(img) {
            img.removeAttribute('loading');
        });

        // Initialize Muuri grid
        grid = new Muuri('#portfolio-grid', {
            items: '.portfolio-item',
            layout: {
                fillGaps: true,      // Enable masonry-style packing (PORT-06)
                horizontal: false,
                alignRight: false,
                alignBottom: false
            },
            showDuration: 300,
            hideDuration: 200,
            layoutDuration: 300,
            visibleStyles: {
                opacity: 1,
                transform: 'scale(1)'
            },
            hiddenStyles: {
                opacity: 0,
                transform: 'scale(0.5)'
            }
        });

        // Filter function with GLightbox integration (PORT-02, PORT-04)
        function filterPortfolio(category) {
            grid.filter(function(item) {
                if (category === '*') return true;
                var categoryClass = category.replace('.', '');
                return item.getElement().classList.contains(categoryClass);
            }, {
                onFinish: function() {
                    // Delay lightbox reload to ensure DOM updates complete
                    setTimeout(function() {
                        lightbox.reload();
                    }, 50);
                }
            });
        }

        // Bind filter button click handlers (PORT-02)
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
            btn.addEventListener('click', function() {
                var category = this.getAttribute('data-filter');

                // Update active state
                document.querySelectorAll('.filter-btn').forEach(function(b) {
                    b.classList.remove('active');
                });
                this.classList.add('active');

                // Apply filter with optional View Transitions enhancement (PORT-05)
                if (document.startViewTransition) {
                    document.startViewTransition(function() {
                        filterPortfolio(category);
                    });
                } else {
                    filterPortfolio(category);
                }
            });
        });

        // Debounced resize handler for responsive layout
        var resizeTimer;
        window.addEventListener('resize', function() {
            clearTimeout(resizeTimer);
            resizeTimer = setTimeout(function() {
                grid.refreshItems().layout();
            }, 200);
        });
    }
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
