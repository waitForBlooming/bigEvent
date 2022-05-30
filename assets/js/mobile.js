$(function () {
    $(".menu").on("click", function () {
        $(".left_navTree").toggleClass("left_navTreeClick")
        $(".menu i").toggleClass("layui-icon-shrink-right")
        $(".menu i").toggleClass("layui-icon-spread-left")
        $(".left_navCover").fadeToggle()
    })
    $(".left_navTree dd a").on("click", function () {
        $(".left_navTree").toggleClass("left_navTreeClick")
        $(".menu i").toggleClass("layui-icon-shrink-right")
        $(".menu i").toggleClass("layui-icon-spread-left")
        $(".left_navCover").fadeToggle()
    })
})