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
    /*	STICKY HEADER (Vanilla JS - replaces Headhesive)
    /*-----------------------------------------------------------------------------------*/
    (function() {
        var navbar = document.querySelector('.navbar');
        if (!navbar) return;

        // Create sentinel at activation point (350px from top)
        var sentinel = document.createElement('div');
        sentinel.id = 'sticky-sentinel';
        sentinel.style.cssText = 'position:absolute;top:350px;height:1px;width:100%;pointer-events:none;';
        document.body.insertBefore(sentinel, document.body.firstChild);

        // Clone navbar for sticky version
        var clone = navbar.cloneNode(true);
        clone.classList.add('banner--clone', 'fixed');
        clone.classList.remove('absolute');
        document.body.insertBefore(clone, document.body.firstChild);

        // Initialize Bootstrap Collapse on cloned navbar (required for hamburger menu)
        var cloneCollapse = clone.querySelector('.navbar-collapse');
        if (cloneCollapse) {
            new bootstrap.Collapse(cloneCollapse, { toggle: false });
        }

        // Observe sentinel for sticky activation
        var stickyObserver = new IntersectionObserver(function(entries) {
            var entry = entries[0];
            if (!entry.isIntersecting) {
                clone.classList.add('banner--stick');
                clone.classList.remove('banner--unstick');
            } else {
                clone.classList.remove('banner--stick');
                clone.classList.add('banner--unstick');
            }
        }, { threshold: 0 });

        stickyObserver.observe(sentinel);

        // Scroll direction detection for show/hide (NAV-03)
        var lastScrollY = 0;
        var ticking = false;

        function onScroll() {
            var currentScrollY = window.pageYOffset;

            if (clone.classList.contains('banner--stick')) {
                if (currentScrollY > lastScrollY && currentScrollY > 400) {
                    clone.classList.add('banner--hidden');
                } else {
                    clone.classList.remove('banner--hidden');
                }
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', function() {
            if (!ticking) {
                requestAnimationFrame(onScroll);
                ticking = true;
            }
        }, { passive: true });
    })();
    /*-----------------------------------------------------------------------------------*/
    /*	HAMBURGER MENU ICON (Vanilla JS - works on original and cloned navbar)
    /*-----------------------------------------------------------------------------------*/
    document.addEventListener('click', function(e) {
        // Toggle hamburger animation on both navbars
        if (e.target.closest('.hamburger.animate')) {
            document.querySelectorAll('.hamburger.animate').forEach(function(btn) {
                btn.classList.toggle('active');
            });
        }

        // Close mobile nav on link click (one-page sites)
        if (e.target.closest('.onepage .navbar .nav li a')) {
            document.querySelectorAll('.navbar .navbar-collapse.show').forEach(function(openNav) {
                var collapse = bootstrap.Collapse.getInstance(openNav);
                if (collapse) collapse.hide();
            });
            document.querySelectorAll('.hamburger.animate').forEach(function(btn) {
                btn.classList.remove('active');
            });
        }
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

        // Wait for images to load, then refresh layout
        // This ensures Muuri calculates correct heights for masonry
        var images = portfolioGrid.querySelectorAll('img');
        var loadedCount = 0;
        var totalImages = images.length;

        function onImageLoad() {
            loadedCount++;
            // Refresh layout after each batch of images loads
            if (loadedCount === totalImages || loadedCount % 10 === 0) {
                grid.refreshItems().layout();
            }
        }

        images.forEach(function(img) {
            if (img.complete) {
                onImageLoad();
            } else {
                img.addEventListener('load', onImageLoad);
                img.addEventListener('error', onImageLoad); // Count errors too
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
    var empty_a = document.querySelectorAll('.onepage .navbar ul.navbar-nav a[href="#"]');
    empty_a.forEach(function(a) {
        a.addEventListener('click', function(e) {
            e.preventDefault();
        });
    });
    /*-----------------------------------------------------------------------------------*/
    /*  SCROLL TO TOP (Vanilla JS - replaces scrollUp jQuery plugin)
    /*-----------------------------------------------------------------------------------*/
    (function() {
        // Create scroll-to-top button element
        var scrollUpBtn = document.createElement('div');
        scrollUpBtn.id = 'scrollUp';
        scrollUpBtn.innerHTML = '<a href="#" class="btn btn-circle btn-dark"><i class="fa fa-arrow-up"></i></a>';

        // Set initial hidden state (positioning handled by CSS)
        scrollUpBtn.style.opacity = '0';
        scrollUpBtn.style.visibility = 'hidden';
        scrollUpBtn.style.position = 'fixed';
        scrollUpBtn.style.transition = 'opacity 300ms ease, visibility 300ms ease';
        scrollUpBtn.style.zIndex = '9999';

        // Create sentinel element for IntersectionObserver at 300px from top
        var sentinel = document.createElement('div');
        sentinel.id = 'scroll-up-sentinel';
        sentinel.style.cssText = 'position:absolute;top:300px;height:1px;width:100%;pointer-events:none;';
        document.body.insertBefore(sentinel, document.body.firstChild);

        // Use IntersectionObserver to show/hide button
        var scrollObserver = new IntersectionObserver(function(entries) {
            var entry = entries[0];
            if (!entry.isIntersecting) {
                // Scrolled past 300px - show button
                scrollUpBtn.style.opacity = '1';
                scrollUpBtn.style.visibility = 'visible';
            } else {
                // Near top - hide button
                scrollUpBtn.style.opacity = '0';
                scrollUpBtn.style.visibility = 'hidden';
            }
        }, { threshold: 0 });

        scrollObserver.observe(sentinel);

        // Add click handler with accessibility support
        scrollUpBtn.addEventListener('click', function(e) {
            e.preventDefault();
            var prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
            window.scrollTo({
                top: 0,
                behavior: prefersReducedMotion ? 'instant' : 'smooth'
            });
        });

        // Append button to body
        document.body.appendChild(scrollUpBtn);
    })();
});
