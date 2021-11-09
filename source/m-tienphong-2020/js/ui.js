/*
 * TOC
 *
 * addClass sticky-top
 * tab-box
 * photoswipe
 * show / hide elements
 * slick slider
 */
// >  addClass sticky-top
$(window).scroll(function() {
    if ($(this).scrollTop() > 0) {
        $('.mobile-menu').addClass("no-padding-top");
        $('.latest-sticky').addClass("no-padding-top");
    } else {
        $('.mobile-menu').removeClass("no-padding-top");
        $('.latest-sticky').removeClass("no-padding-top");
    }
});
// > photoswipe
$(".article__body img").wrap(function(index) {
    var _this = $(this);
    var src = $(this).attr("src");
    src = src.replace("w460x", "");
    var box_desc = $(this).parent().find(".image_caption");
    if (box_desc == null) {
        box_desc = $(this).find("em");
    }
    var desc = box_desc == null ? document.title.replace("\"", "&quot;").replace("“", "&quot;").replace("”", "&quot;") : box_desc.text();
    return "<a class='photo' href='" + src + "' data-desc='" + (desc == undefined ? "" : desc) + "' data-index='" + index + "' />";
});
$('.article__body').each(function() {
    var $pic = $(this),
        getItems = function() {
            var items = [];
            $pic.find('a.photo').each(function() {
                var item = { src: $(this).attr("href"), w: 0, h: 0, title: $(this).attr("data-desc") }
                items.push(item);
            });
            return items;
        }
    var items = getItems();
    var $pswp = $('.pswp')[0];
    $pic.on('click', 'a.photo', function(event) {
        event.preventDefault();
        var $index = $(this).data('index');
        var options = {
            index: $index,
            showAnimationDuration: 0,
            hideAnimationDuration: 0,
            tapToClose: true,
            shareEl: false,
            captionEl: true
        }
        // Initialize PhotoSwipe
        var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
        lightBox.init();
    });
});
// > show / hide elements
$("button.bars").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("is-active");
    $('.mobile-menu').toggleClass("show");
});

$(".footer-pin .text").click(function(e) {
    e.preventDefault();
    $(this).toggleClass("is-active");
    $('.latest-sticky').toggleClass("show");
});
// > box-trending
$('.box-trending .wrap').slick({
    infinite: true,
    variableWidth: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: false,
    autoplay: true
});

$('.box-style-3 .wrap').slick({
    infinite: true,
    slidesToShow: 2,
    slidesToScroll: 2,
    arrows: false,
    dots: true,
    appendDots: $(".box-style-3 .dots-container-1"),
    autoplay: true
});
// > slick slider 
$('.slider-style-1 .wrap').slick({
    infinite: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    appendDots: $(".slider-style-1 .dots-container-1"),
    autoplay: true,
});
$('.slider-style-2 .wrap').slick({
    infinite: true,
    // variableWidth: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    dots: true,
    appendDots: $(".dots-container-2"),
    autoplay: true
});
$('.slider-style-3 .wrap').slick({
    infinite: true,
    // variableWidth: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: true,
    autoplay: true,
    prevArrow: '.slider-style-3 .btn-prev',
    nextArrow: '.slider-style-3 .btn-next'
});

$('.topic-title .wrap').slick({
    infinite: true,
    // variableWidth: true,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
    autoplay: true,
});

// active nav-tab
const $navTabLink = $('.box-soccer .nav a');
const $navTabContent = $('.box-soccer .nav-tab ');

$(".box-soccer .nav a").click(function (e) {
    // INFO: prevent hash-jumping from anchor element
    e.preventDefault();
    const $this = $(e.target);
    const chosenTab = $this.attr('data-link');
    $navTabLink.removeClass('active');
    $this.addClass('active');
    $navTabContent.find('.tab-pane')
        .removeClass('active')
    $('.box-soccer .nav-tab .' + chosenTab).addClass('active');
});

// accordion
$('.js-accordion-title').on('click', function () {
    $(this).next().slideToggle(200);
    $(this).toggleClass('open', 200);
});
