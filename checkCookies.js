$(function () {
    if (Cookies.get('datatoken') == undefined) {
        Cookies.remove('datatoken');
        Cookies.remove('wacadmin');
        Cookies.remove('datauserId');
        Cookies.remove('datajwt');
        Cookies.remove('userappontment');
        Cookies.remove('allnotice');
        Cookies.remove('service');
        Cookies.remove('visitor');
       location.href = "index.html";
    }
});