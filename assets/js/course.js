function videoModel(url) {
  event.preventDefault();
  $('#video').modal('show');

  document.getElementById('videoCon').innerHTML= url;
}

function doumentDownload() {

    $("#download").submit(function () {
      $(this).ajaxSubmit({
        error: function(xhr) {
      console.error('Error: ' + xhr.status);
          },
          success:function(res) {
            if(res=="done"){
              location.reload();
            }
          }
      });

    });




}
