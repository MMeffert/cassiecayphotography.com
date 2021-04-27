$(document).ready(function() {
    'use strict';
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
    $(".swiper-col3").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-col3-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-col3-pagination-" + index);
        var swiper2 = new Swiper(".swiper-col3-" + index, {
            slidesPerView: 1,
            breakpoints: {
				768: {
                    slidesPerView: 2 
                },
                992: {
                    slidesPerView: 3 
                },
            },
            spaceBetween: 30,
            grabCursor: true,
            pagination: {
                el: ".swiper-col3-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });    
    $(".swiper-col3-20").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-col3-20-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-col3-20-pagination-" + index);
        var swiper3 = new Swiper(".swiper-col3-20-" + index, {
            slidesPerView: 1,
            breakpoints: {
				768: {
                    slidesPerView: 2 
                },
                992: {
                    slidesPerView: 3 
                },
            },
            spaceBetween: 20,
            grabCursor: true,
            pagination: {
                el: ".swiper-col3-20-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    $(".swiper-col4").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-col4-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-col4-pagination-" + index);
        var swiper4 = new Swiper(".swiper-col4-" + index, {
            slidesPerView: 1,
            breakpoints: {
				768: {
                    slidesPerView: 2 
                },
                992: {
                    slidesPerView: 3 
                },
                1025: {
                    slidesPerView: 4 
                }
            },
            spaceBetween: 30,
            grabCursor: true,
            pagination: {
                el: ".swiper-col4-pagination-" + index,
                clickable: true,
            }
        });
    });
    $(".swiper-col6").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-col6-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-col6-pagination-" + index);
        var swiper5 = new Swiper(".swiper-col6-" + index, {
            slidesPerView: 2,
            breakpoints: {
				768: {
                    slidesPerView: 3 
                },
                992: {
                    slidesPerView: 4 
                },
                1025: {
                    slidesPerView: 5 
                }
            },
            spaceBetween: 30,
            grabCursor: true,
            pagination: {
                el: ".swiper-col6-pagination-" + index,
                clickable: true,
            }
        });
    });
    $(".swiper-auto").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-auto-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-auto-pagination-" + index);
        var swiper6 = new Swiper(".swiper-auto-" + index, {
            slidesPerView: "auto",
            spaceBetween: 10,
            grabCursor: true,
            loop: false,
            pagination: {
                el: ".swiper-auto-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });   
    $(".swiper-auto-tab").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-auto-tab-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-auto-tab-pagination-" + index);
        var swiper7 = new Swiper(".swiper-auto-tab-" + index, {
            slidesPerView: "auto",
            spaceBetween: 10,
            grabCursor: true,
            observer: true,
			observeParents: true,
            loop: false,
            pagination: {
                el: ".swiper-auto-tab-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });  
    $(".swiper-full").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-full-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-full-pagination-" + index);
        var swiper8 = new Swiper(".swiper-full-" + index, {
            slidesPerView: 1,
            breakpoints: {
                768: {
                    slidesPerView: 2 
                },
                1025: {
                    slidesPerView: 3 
                }
            },
            spaceBetween: 15,
            grabCursor: true,
			mousewheel: {
			    invert: false,
			  },
            pagination: {
                el: ".swiper-full-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    $(".swiper-full-single").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-full-single-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-full-single-pagination-" + index);
        var swiper9 = new Swiper(".swiper-full-single-" + index, {
            grabCursor: true,
			mousewheel: {
			    invert: false,
			},
            pagination: {
                el: ".swiper-full-single-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    $(".swiper-col3-full").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-col3-full-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-col3-full-pagination-" + index);
        var swiper10 = new Swiper(".swiper-col3-full-" + index, {
            slidesPerView: 1,
            breakpoints: {
				992: {
                    slidesPerView: 2 
                },

				1680: {
                    slidesPerView: 3 
                }
            },
            spaceBetween: 20,
            grabCursor: true,
            pagination: {
                el: ".swiper-col3-full-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    $(".swiper-auto-full").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-auto-full-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-auto-full-pagination-" + index);
        var swiper11 = new Swiper(".swiper-auto-full-" + index, {
            slidesPerView: "auto",
            spaceBetween: 15,
            grabCursor: true,
            mousewheel: {
			    invert: false,
			  },
            loop: false,
            pagination: {
                el: ".swiper-auto-full-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    }); 
    $(".swiper-auto-centered").each(function(index, element) {
        var $this = $(this);
        $this.find(".swiper-container").addClass("swiper-auto-centered-" + index);
        $this.find(".swiper-button-prev").addClass("btn-prev-" + index);
        $this.find(".swiper-button-next").addClass("btn-next-" + index);
        $this.find(".swiper-pagination").addClass("swiper-auto-centered-pagination-" + index);
        var swiper12 = new Swiper(".swiper-auto-centered-" + index, {
            slidesPerView: "auto",
            spaceBetween: 10,
            centeredSlides: true,
            grabCursor: true,
            loop: true,
            loopedSlides: 8,
            pagination: {
                el: ".swiper-auto-centered-pagination-" + index,
                clickable: true,
            },
            navigation: {
                nextEl: ".btn-next-" + index,
                prevEl: ".btn-prev-" + index
            }
        });
    });
    /*-----------------------------------------------------------------------------------*/
    /*	SLIDER REVOLUTION
    /*-----------------------------------------------------------------------------------*/
    $('#slider-carousel').revolution(
    {
        sliderType: "carousel",
        sliderLayout: "auto",
        spinner: "spinner2",
        delay: 1000,
        shadow: 0,
        responsiveLevels:[1240,1024,778,480],
		visibilityLevels:[1240,1024,778,480],
		gridwidth:[437,437,364,320],
		gridheight:[600,600,500,439],
		disableProgressBar:"on",
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                hide_under:1024,
                style: 'uranus',
                tmp: ''
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        },
        carousel: {
				horizontal_align: "center",
				vertical_align: "center",
				fadeout: "off",
				maxVisibleItems: 7,
				infinity: "on",
				space: 0,
				stretch: "off",
 				showLayersAllTime: "off",
 				easing: "Power3.easeInOut",
 				speed: "800"
		}   
    });
    $('#slider').revolution({
        sliderType: "standard",
        sliderLayout: "fullscreen",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth: [1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
				hide_under:1024,
                style: 'uranus',
                tmp: ''
            },
            touch: {
                touchenabled: 'on',
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: 'horizontal',
                drag_block_vertical: true
            },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: false,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        }
    });
    $('#slider2').revolution({
        sliderType: "standard",
        sliderLayout: "fullscreen",
        fullScreenOffsetContainer: ".navbar:not(.fixed)",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth: [1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                style: 'uranus',
                tmp: ''
            },
            touch: {
                touchenabled: 'on',
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: 'horizontal',
                drag_block_vertical: true
            },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: true,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        }
    });
    $('#slider3').revolution(
    {
        sliderType: "standard",
        sliderLayout: "fullscreen",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: false
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
	$('#slider4').revolution(
    {
        sliderType: "standard",
        sliderLayout: "auto",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
		gridheight:[600, 525, 400, 400],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                hide_under:1024,
                style: 'uranus',
                tmp: ''
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: true,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        }   
    });
    $('#slider5').revolution(
    {
        sliderType: "carousel",
        sliderLayout: "fullscreen",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        carousel: {
                    horizontal_align: 'center',
                    vertical_align: 'center',
                    fadeout: 'on',
                    vary_fade: 'on',
                    maxVisibleItems: 3,
                    infinity: 'on',
                    space: 0,
                    stretch: 'on'
                },
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                hide_under:1024,
                style: 'uranus',
                tmp: ''
            },
            tabs: {
                        style: 'zeus',
                        enable: true,
                        width: 150,
                        height: 90,
                        min_width: 150,
                        wrapper_padding: 0,
                        wrapper_color: 'none',
                        wrapper_opacity: '0.5',
                        tmp: '<span class="tp-tab-image"></span>',
                        visibleAmount: 20,
                        hide_onmobile: true,
                        hide_onleave: false,
                        hide_delay: 200,
                        // direction: "vertical",
                        direction: 'horizontal',
                        span: true,
                        position: 'inner',
                        space: 0,
                        // h_align: "right",
                        h_align: 'center',
                        v_align: 'bottom',
                        h_offset: 0,
                        v_offset: 0
                    },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
    $('#slider6').revolution(
    {
        sliderType: "carousel",
        sliderLayout: "auto",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
		gridheight:[600, 525, 400, 400],
        responsiveLevels: [1240, 1024, 778, 480],
        carousel: {
                    horizontal_align: 'center',
                    vertical_align: 'center',
                    fadeout: 'on',
                    vary_fade: 'on',
                    maxVisibleItems: 3,
                    infinity: 'on',
                    space: 0,
                    stretch: 'on'
                },
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                style: 'uranus',
                tmp: ''
            },
            tabs: {
                        style: 'zeus',
                        enable: true,
                        width: 150,
                        height: 90,
                        min_width: 150,
                        wrapper_padding: 0,
                        wrapper_color: 'none',
                        wrapper_opacity: '0.5',
                        tmp: '<span class="tp-tab-image"></span>',
                        visibleAmount: 20,
                        hide_onmobile: true,
                        hide_onleave: false,
                        hide_delay: 200,
                        // direction: "vertical",
                        direction: 'horizontal',
                        span: true,
                        position:"outer-bottom",
                        space: 5,
                        // h_align: "right",
                        h_align: 'center',
                        v_align: 'bottom',
                        h_offset: 0,
                        v_offset: 0
                    },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
    $('#slider7').revolution({
        sliderType: "standard",
        sliderLayout: "fullscreen",
        fullScreenOffsetContainer: ".navbar:not(.fixed)",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth: [1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
				keyboardNavigation:"on",
				keyboard_direction: "vertical",
				mouseScrollNavigation:"on",
 							mouseScrollReverse:"default",
				onHoverStop:"off",
				touch:{
					touchenabled:"on",
					touchOnDesktop:"off",
					swipe_threshold: 75,
					swipe_min_touches: 1,
					swipe_direction: "vertical",
					drag_block_vertical: false
				}
			}
    });
    
    $('#slider8').revolution(
    {
        sliderType: "standard",
        sliderLayout: "fullscreen",
        fullScreenOffsetContainer: ".navbar:not(.fixed)",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: false
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
    $('#slider9').revolution(
    {
        sliderType: "carousel",
        sliderLayout: "auto",
        spinner: "spinner2",
        delay: 9000,
        stopLoop: "on",
	    stopAfterLoops: 0,
	    stopAtSlide: 1,
        shadow: 0,
        gridwidth: 1140,
		gridheight: 641,
        carousel: {
                    horizontal_align: 'center',
                    vertical_align: 'center',
                    fadeout: 'on',
                    vary_fade: 'on',
                    maxVisibleItems: 3,
                    infinity: 'on',
                    space: 0,
                    stretch: 'on'
                },
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                style: 'uranus',
                tmp: ''
            },
            tabs: {
                        style: 'zeus',
                        enable: true,
                        width: 150,
                        height: 90,
                        min_width: 150,
                        wrapper_padding: 0,
                        wrapper_color: 'none',
                        wrapper_opacity: '0.5',
                        tmp: '<span class="tp-tab-image"></span>',
                        visibleAmount: 20,
                        hide_onmobile: true,
                        hide_onleave: false,
                        hide_delay: 200,
                        // direction: "vertical",
                        direction: 'horizontal',
                        span: true,
                        position:"outer-bottom",
                        space: 5,
                        // h_align: "right",
                        h_align: 'center',
                        v_align: 'bottom',
                        h_offset: 0,
                        v_offset: 0
                    },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
    $('#slider10').revolution(
    {
        sliderType: "standard",
        sliderLayout:"fullscreen",
						dottedOverlay:"none",
						delay:9000,
						navigation: {
							keyboardNavigation:"on",
							keyboard_direction: "horizontal",
							mouseScrollNavigation:"off",
 							mouseScrollReverse:"default",
							onHoverStop:"on",
							touch:{
								touchenabled:"on",
								swipe_threshold: 75,
								swipe_min_touches: 1,
								swipe_direction: "horizontal",
								drag_block_vertical: false
							}
							,
							arrows: {
								style:"gyges",
								enable:true,
								hide_onmobile:false,
								hide_over:778,
								hide_onleave:false,
								tmp:'',
								left: {
									h_align:"right",
									v_align:"bottom",
									h_offset:40,
									v_offset:0
								},
								right: {
									h_align:"right",
									v_align:"bottom",
									h_offset:0,
									v_offset:0
								}
							}
							,
							tabs: {
								style:"erinyen",
								enable:true,
								width:250,
								height:50,
								min_width:250,
								wrapper_padding:0,
								wrapper_color:"transparent",
								wrapper_opacity:"0",
								tmp:'<div class="tp-tab-title">{{title}}</div>',
								visibleAmount: 4,
								hide_onmobile: true,
								hide_under:778,
								hide_onleave:false,
								hide_delay:200,
								direction:"vertical",
								span:false,
								position:"inner",
								space:10,
								h_align:"right",
								v_align:"center",
								h_offset:30,
								v_offset:0
							}
						},
						viewPort: {
							enable:true,
							outof:"pause",
							visible_area:"80%",
							presize:false
						},
						responsiveLevels:[1240,1024,778,480],
						visibilityLevels:[1240,1024,778,480],
						gridwidth:[1240,1024,778,480],
						gridheight:[500,450,400,350],
						lazyType:"none",
						shadow:0,
						spinner: "spinner2",
						stopLoop:"off",
						stopAfterLoops:-1,
						stopAtSlide:-1,
						shuffle:"off",
						autoHeight:"off",
						hideThumbsOnMobile:"off",
						hideSliderAtLimit:0,
						hideCaptionAtLimit:0,
						hideAllCaptionAtLilmit:0,
						debugMode:false,
						fallbacks: {
							simplifyAll:"off",
							nextSlideOnWindowFocus:"off",
							disableFocusListener:false,
						}    
    });
    $('#slider11').revolution({
        sliderType:"carousel",
        sliderLayout: "fullscreen",
        fullScreenOffsetContainer: ".navbar:not(.fixed)",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth: [1024, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                style: 'uranus',
                tmp: ''
            },
            touch: {
                touchenabled: 'on',
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: 'horizontal',
                drag_block_vertical: true
            },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: true,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        },
        carousel: {
							border_radius: "0",
							padding_top: "0",
							padding_bottom: "0",
							maxRotation: 10,
							vary_rotation: "on",
							minScale: 25,
							vary_scale: "on",
							horizontal_align: "center",
							vertical_align: "center",
							fadeout: "on",
							vary_fade: "on",
							maxVisibleItems: 3,
							infinity: "on",
							space: -150,
							stretch: "off"
						}
    });
    
    if ($("#slider12").length) {
        var tpj = jQuery;
		var slider12 = jQuery('#slider12').show().revolution({
	 
	    sliderType: "standard",
        sliderLayout: "fullwidth",
        spinner:"off",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
        gridheight:[600,600,500,400],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: false
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        } 
	 
	});
	RsFilmstripAddOn(tpj, slider12, "style/revolution/revolution-addons/filmstrip", false);
    }
    $('#slider13').revolution(
    {
        sliderType: "standard",
        sliderLayout:"auto",
			dottedOverlay:"none",
			delay:9000,
			navigation: {
				keyboardNavigation:"off",
				keyboard_direction: "horizontal",
				mouseScrollNavigation:"off",
 							mouseScrollReverse:"default",
				onHoverStop:"off",
				touch:{
					touchenabled:"on",
					touchOnDesktop:"off",
					swipe_threshold: 75,
					swipe_min_touches: 1,
					swipe_direction: "horizontal",
					drag_block_vertical: false
				}
				,
				arrows: {
					style:"metis",
					enable:true,
					hide_onmobile:true,
					hide_onleave:false,
					tmp:'',
					left: {
						h_align:"left",
						v_align:"center",
						h_offset:0,
						v_offset:0
					},
					right: {
						h_align:"right",
						v_align:"center",
						h_offset:0,
						v_offset:0
					}
				}
			},
			responsiveLevels:[1240,1024,778,480],
			visibilityLevels:[1240,1024,778,480],
			gridwidth: [1140,1200,1000,480], 
			gridheight: [700,900,700,700],
			spinner: "spinner2",
			autoHeight:"off",
			disableProgressBar:"on",
			hideThumbsOnMobile:"off",
			hideSliderAtLimit:0,
			hideCaptionAtLimit:0,
			hideAllCaptionAtLilmit:0,
			debugMode:false 
    });
    if ($("#slider14").length) {
        var tpj = jQuery;
		var slider14 = jQuery('#slider14').show().revolution({
	 
	    sliderType: "standard",
        sliderLayout: "fullscreen",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth: [1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                style: 'uranus',
                tmp: ''
            },
            touch: {
                touchenabled: 'on',
                swipe_threshold: 75,
                swipe_min_touches: 1,
                swipe_direction: 'horizontal',
                drag_block_vertical: true
            },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: true,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        }
	 
	});
	RsTypewriterAddOn(tpj, slider14);
	}	
    $('#slider15').revolution(
    {
        sliderType: "standard",
        sliderLayout: "auto",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
		gridheight:[600, 525, 400, 400],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: false
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        }    
    });
    if ($("#slider16").length) {
        var tpj = jQuery;
		var slider16 = jQuery('#slider16').show().revolution({
	 
	    sliderType: "standard",
        sliderLayout: "fullscreen",
        spinner:"off",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: false
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: false
            }
        } 
	 
	});
	RsFilmstripAddOn(tpj, slider16, "style/revolution/revolution-addons/filmstrip", false);
    }
    if ($("#slider17").length) {
        var tpj = jQuery;
		var slider17 = jQuery('#slider17').show().revolution({
	 
	    sliderType: "standard",
        sliderLayout: "fullscreen",
        fullScreenOffsetContainer: ".navbar:not(.fixed)",
        spinner: "spinner2",
        delay: 9000,
        shadow: 0,
        gridwidth:[1140, 1024, 778, 480],
		gridheight:[600, 525, 400, 400],
        responsiveLevels: [1240, 1024, 778, 480],
        navigation: {
            arrows: {
                enable: true,
                hide_onleave: true,
                hide_under:1024,
                style: 'uranus',
                tmp: ''
            },
            touch: { 
		        touchenabled: 'on',
		        swipe_threshold: 75,
		        swipe_min_touches: 1,
		        swipe_direction: 'horizontal',
		        drag_block_vertical: true		 
		    },
            bullets: {
                enable: true,
                style: 'zeus',
                tmp: '<span class="tp-bullet-image"></span><span class="tp-bullet-imageoverlay"></span>',
                hide_onleave: true,
                hide_onmobile: true,
                h_align: "center",
                v_align: "bottom",
                space: 8,
                h_offset: 0,
                v_offset: 20
            }
        }
	 
	});
	RsTypewriterAddOn(tpj, slider17);
	}
    /*-----------------------------------------------------------------------------------*/
    /*	FLICKR
    /*-----------------------------------------------------------------------------------*/
    $('#flickrfeed').jflickrfeed({
        limit: 10,
        qstrings: {
            id: '51789731@N07'
        },
        itemTemplate: '<div class="item col-1-5"><figure class="overlay overlay3"><a href="{{image_b}}" target="_blank"><span class="bg"></span><img src="{{image_q}}" alt="{{title}}" /><figcaption class="d-flex"><div class="align-self-center mx-auto"><i class="fa fa-flickr"></i></div></figcaption></figure></div>',
    });
    $('#flickrfeed2').jflickrfeed({
        limit: 6,
        qstrings: {
            id: '51789731@N07'
        },
        itemTemplate: '<div class="item col-6 col-sm-4 col-md-2"><figure class="overlay overlay3"><a href="{{image_b}}" target="_blank"><span class="bg"></span><img src="{{image_q}}" alt="{{title}}" /><figcaption class="d-flex"><div class="align-self-center mx-auto"><i class="fa fa-flickr"></i></div></figcaption></figure></div>',
    });
    $('#flickrfeed3').jflickrfeed({
        limit: 14,
        qstrings: {
            id: '51789731@N07'
        },
        itemTemplate: '<div class="swiper-slide"><figure class="overlay overlay3"><a href="{{image_b}}" target="_blank"><span class="bg"></span><img src="{{image_q}}" alt="{{title}}" /><figcaption class="d-flex"><div class="align-self-center mx-auto"><i class="fa fa-flickr"></i></div></figcaption></figure></div>'
    }, function(data) {
        var swiperflickr = new Swiper('.swiper-flickr', {
            slidesPerView: 2,
            breakpoints: {
                768: {
                    slidesPerView: 3 
                },
				992: {
                    slidesPerView: 4 
                },
                1025: {
                    slidesPerView: 5 
                },
				1200: {
                    slidesPerView: 6 
                },
            },
            spaceBetween: 10,
            grabCursor: true,
            pagination: {
                el: '.swiper-flickr-pagination',
                clickable: true,
            },
        });
    });
    $('#flickrfeed4').jflickrfeed({
        limit: 6,
        qstrings: {
            id: '51789731@N07'
        },
        itemTemplate: '<div class="item col-6 col-sm-4"><figure class="overlay overlay3"><a href="{{image_b}}" target="_blank"><span class="bg"></span><img src="{{image_q}}" alt="{{title}}" /><figcaption class="d-flex"><div class="align-self-center mx-auto"><i class="fa fa-flickr"></i></div></figcaption></figure></div>',
    });
    /*-----------------------------------------------------------------------------------*/
    /*	IMAGE ICON HOVER
    /*-----------------------------------------------------------------------------------*/
    $('.overlay > a, .overlay > span').prepend('<span class="bg"></span>');
    /*-----------------------------------------------------------------------------------*/
    /*	COUNTDOWN
	/*-----------------------------------------------------------------------------------*/
    $(".countdown").countdown();
    /*-----------------------------------------------------------------------------------*/
    /*	COUNTER UP
    /*-----------------------------------------------------------------------------------*/
    $('.counter .value').counterUp({
        delay: 50,
        time: 1000
    });
    /*-----------------------------------------------------------------------------------*/
    /*	AOS
    /*-----------------------------------------------------------------------------------*/
    AOS.init({
        easing: 'ease-in-out-sine',
        duration: 800,
        once: true
    });
    /*-----------------------------------------------------------------------------------*/
    /*	COCOEN
    /*-----------------------------------------------------------------------------------*/
	$('.cocoen').cocoen();
    /*-----------------------------------------------------------------------------------*/
    /*	PLYR
    /*-----------------------------------------------------------------------------------*/
    plyr.setup('.js-player');
    /*-----------------------------------------------------------------------------------*/
    /*	PROGRESSBAR
	/*-----------------------------------------------------------------------------------*/
    var $pcircle = $('.progressbar.full-circle');
    var $pline = $('.progressbar.line');

    $pcircle.each(function(i) {
        var circle = new ProgressBar.Circle(this, {
            strokeWidth: 4,
            trailWidth: 4,
            duration: 2000,
            easing: 'easeInOut',
            step: function(state, circle, attachment) {
                circle.setText(Math.round(circle.value() * 100));
            }
        });

        var value = ($(this).attr('data-value') / 100);
        $pcircle.waypoint(function() {
            circle.animate(value);
        }, {
            offset: "100%"
        })
    });
    $pline.each(function(i) {
        var line = new ProgressBar.Line(this, {
            strokeWidth: 3,
            trailWidth: 3,
            duration: 3000,
            easing: 'easeInOut',
            text: {
                style: {
                    color: 'inherit',
                    position: 'absolute',
                    right: '0',
                    top: '-30px',
                    padding: 0,
                    margin: 0,
                    transform: null
                },
                autoStyleContainer: false
            },
            step: function(state, line, attachment) {
                line.setText(Math.round(line.value() * 100) + ' %');
            }
        });
        var value = ($(this).attr('data-value') / 100);
        $pline.waypoint(function() {
            line.animate(value);
        }, {
            offset: "100%"
        })
    });
    /*-----------------------------------------------------------------------------------*/
    /*	VIDEO WRAPPER
    /*-----------------------------------------------------------------------------------*/
    $('.video-wrapper video').backgroundVideo({
        $outerWrap: $('.video-wrapper'),
        pauseVideoOnViewLoss: false,
        parallaxOptions: {
            effect: 3
        }
    });
    /*-----------------------------------------------------------------------------------*/
    /*	TOOLTIP
    /*-----------------------------------------------------------------------------------*/
    $('.has-tooltip').tooltip();
    $('.has-popover').popover({
        trigger: 'focus'
    });
    /*-----------------------------------------------------------------------------------*/
    /*	LIGHTGALLERY
    /*-----------------------------------------------------------------------------------*/
    var $lg = $('.light-gallery');
    $lg.lightGallery({
        thumbnail: false,
        selector: 'a',
        mode: 'lg-fade',
        download: false,
        autoplayControls: false,
        zoom: false,
        fullScreen: false,
        videoMaxWidth: '1000px',
        loop: false,
        hash: true,
        mousewheel: true,
        videojs: true,
        share: false
    });
    /*-----------------------------------------------------------------------------------*/
    /*	CUBE
    /*-----------------------------------------------------------------------------------*/
    var $cubegrid = $('#cube-grid');
    $cubegrid.cubeportfolio({
        filters: '#cube-grid-filter',
        loadMore: '#cube-grid-more',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        mediaQueries: [{width: 1440, cols: 3}, {width: 1024, cols: 3}, {width: 768, cols: 3}, {width: 575, cols: 2}, {width: 480, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 15,
        gapVertical: 15,
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
    $cubegrid.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        
    });
    var $cubegridlarge = $('#cube-grid-large');
    $cubegridlarge.cubeportfolio({
        filters: '#cube-grid-large-filter',
        loadMore: '#cube-grid-large-more',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        mediaQueries: [{width: 1440, cols: 2}, {width: 1024, cols: 2}, {width: 768, cols: 2}, {width: 575, cols: 2}, {width: 320, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 20,
        gapVertical: 20,
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
    $cubegridlarge.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
    });
    var $cubegridfull = $('#cube-grid-full');
    $cubegridfull.cubeportfolio({
        filters: '#cube-grid-full-filter',
        loadMore: '#cube-grid-full-more',
        loadMoreAction: 'click',
        layoutMode: 'masonry',
        mediaQueries: [{width: 1440, cols: 3}, {width: 1024, cols: 3}, {width: 768, cols: 2}, {width: 480, cols: 1}, {width: 320, cols: 1}],
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
    $cubegridfull.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        
    });
    var $cubegridfulllarge = $('#cube-grid-full-large');
    $cubegridfulllarge.cubeportfolio({
        filters: '#cube-grid-full-large-filter',
        loadMore: '#cube-grid-full-large-more',
        loadMoreAction: 'click',
        layoutMode: 'masonry',
        mediaQueries: [{width: 1440, cols: 3}, {width: 980, cols: 3}, {width: 720, cols: 2}, {width: 480, cols: 1}, {width: 320, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 15,
        gapVertical: 15,
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
    $cubegridfulllarge.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        
    });
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
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        
    });
    var $cubegrid2 = $('#cube-grid2');
    $cubegrid2.cubeportfolio({
        filters: '#cube-grid2-filter',
        loadMore: '#cube-grid2-more',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        mediaQueries: [{width: 1440, cols: 3}, {width: 1024, cols: 3}, {width: 768, cols: 3}, {width: 575, cols: 2}, {width: 320, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 45,
        gapVertical: 15,
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
    $cubegrid2.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        
    });
    var $cubegridlarge2 = $('#cube-grid-large2');
    $cubegridlarge2.cubeportfolio({
        filters: '#cube-grid-large2-filter',
        loadMore: '#cube-grid-large2-more',
        loadMoreAction: 'click',
        layoutMode: 'grid',
        mediaQueries: [{width: 1440, cols: 2}, {width: 1024, cols: 2}, {width: 768, cols: 2}, {width: 575, cols: 2}, {width: 320, cols: 1}],
        defaultFilter: '*',
        animationType: 'quicksand',
        gapHorizontal: 55,
        gapVertical: 20,
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
    $cubegridlarge2.on('onAfterLoadMore.cbp', function(event, newItemsAddedToGrid) {
        // first destroy the gallery
        $lg.data('lightGallery').destroy(true);
        // reinit the gallery
        $lg.lightGallery({
	        thumbnail: false,
	        selector: 'a',
	        mode: 'lg-fade',
	        download: false,
	        autoplayControls: false,
	        zoom: false,
	        fullScreen: false,
	        videoMaxWidth: '1000px',
	        loop: false,
	        hash: true,
	        mousewheel: true,
	        videojs: true,
	        share: false
	    });
        $('.cbp-item-load-more .overlay > a, .cbp-item-load-more .overlay > span').prepend('<span class="bg"></span>');
    });

    /*-----------------------------------------------------------------------------------*/
    /*	ISOTOPE GRID
	/*-----------------------------------------------------------------------------------*/
    var $bloggrid = $('.grid .isotope');
    $bloggrid.isotope({
        itemSelector: '.item',
        percentPosition: true,
        transitionDuration: '0.7s',
        masonry: {
            columnWidth: $bloggrid.width() / 12
        },
        layoutMode: 'masonry'
    });
    $(window).resize(function() {
        $bloggrid.isotope({
            masonry: {
                columnWidth: $bloggrid.width() / 12
            }
        });
    });
    $(window).on("load", function() {
        $bloggrid.isotope({
            masonry: {
                columnWidth: $bloggrid.width() / 12
            }
        });
    });
    $bloggrid.imagesLoaded(function() {
        $bloggrid.isotope('layout');
    });
    /*-----------------------------------------------------------------------------------*/
    /*	PRETTIFY
    /*-----------------------------------------------------------------------------------*/
    window.prettyPrint && prettyPrint();

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
    /*	COLLAGEPLUS
    /*-----------------------------------------------------------------------------------*/
    collage();

    function collage() {
        $('#collage-large').removeWhitespace().collagePlus({
            'fadeSpeed': 5000,
            'targetHeight': 450,
            'direction': 'vertical',
            'allowPartialLastRow': true
        });
        $('#collage-medium').removeWhitespace().collagePlus({
            'fadeSpeed': 5000,
            'targetHeight': 350,
            'direction': 'vertical',
            'allowPartialLastRow': true
        });
    };
    var resizeTimer = null;
    $(window).on('resize', function() {
        $('.collage .collage-image-wrapper').css("opacity", 0);
        if (resizeTimer) clearTimeout(resizeTimer);
        resizeTimer = setTimeout(collage, 200);
    });
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
	/*-----------------------------------------------------------------------------------*/
    /*	FOOTER REVEAL
    /*-----------------------------------------------------------------------------------*/
	if ( $('.footer-reveal').length ) {
		$('.footer-reveal').footerReveal({
			shadow: false
		});
	}
    /*-----------------------------------------------------------------------------------*/
    /*	PAGE LOADING
    /*-----------------------------------------------------------------------------------*/
	$('.page-loading').delay(350).fadeOut('slow');
    $('.page-loading .status').fadeOut('slow');  
    /*-----------------------------------------------------------------------------------*/
    /*	VANILLA
    /*-----------------------------------------------------------------------------------*/
    var myForm;
    myForm = new VanillaForm($("form.vanilla-form")); 
});