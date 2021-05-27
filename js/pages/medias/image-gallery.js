$(function () {
  $('#a_imageview').each(function (i, v) {
    $(v).lightGallery({
      thumbnail: false
    });
  });
  
  $('.thumbnail').lightGallery({
      selector: 'img',
  });

    // $('#a_imageview').each(function (i, v) {
    //   $(v).lightGallery({
    //     thumbnail: false
    //   });
    // });
  
});