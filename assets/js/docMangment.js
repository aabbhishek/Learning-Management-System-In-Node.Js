

function uploadModal() {

  var elem = document.activeElement;
  var uploadId= elem.getAttributeNode("id").value;
  var courseName= elem.getAttributeNode("courseName").value;

  document.getElementById('idMain').value=uploadId;
  document.getElementById('CourseMain').value=courseName;
  document.getElementById('nameTag').innerHTML="File name Should be : "+courseName+"-"+uploadId;
  $("#upload").modal('show');
}

function updateDocInfo() {
    var elem = document.activeElement;
    var ival= elem.getAttributeNode("iVal").value;
    var id=elem.getAttributeNode("id").value;
    var courseName= elem.getAttributeNode("courseName").value;
    var lessonName = document.getElementById('ln-'+ival).value;
    var videoUrl = document.getElementById('vo-'+ival).value;
console.log(id);
    $.ajax({
      data:"mainId="+id+"&courseName="+courseName+"&lessonName="+lessonName+"&videoUrl="+videoUrl,
      type:'post',
      url:'/admin/dashbord/updatedValues',
      success:function(respo) {
        if(respo){
            Swal.fire(
            'Action Performed',
            'Updated',
            'success'
          );

          setTimeout(function () {
            location.reload();
          },1900);
        }else{
          Swal.fire({
          type: 'error',
          title: 'There was some error',
          });
        }
      }
    });

}
function deleteDoc() {
  var elem = document.activeElement;
  var courseName= elem.getAttributeNode("courseName").value;
  var id= elem.getAttributeNode("id").value;
  $.ajax({
      data:"mainId="+id+"&courseName="+courseName,
      type:'post',
      url:'/admin/dashbord/removeDoc',
      success:function (respo) {
        if(respo){
          Swal.fire(
          'Action Performed',
          'Removed',
          'success'
        );
        setTimeout(function () {
          location.reload();
        },1900);

        }
        else{
          Swal.fire({
          type: 'error',
          title: 'There was some error',
          });
        }
      }
  });

}

function newDocModel() {
    $("#insertNew").modal('show');
}


function insertNewDocument() {
  var elem = document.activeElement;
  var courseName= elem.getAttributeNode("courseName").value;
  var lesson = document.getElementById('lessonOne').value;
  var videoUrl = document.getElementById('videoUrl').value;
  // console.info(courseName);

  $.ajax({
    data:"courseName="+courseName+"&lesson="+lesson+"&videoUrl="+videoUrl,
    type:'post',
    url:'/admin/dashbord/newDocumentInsert',
    success:function(respo) {
        if(respo){

            Swal.fire(
            'Action Performed',
            'Removed',
            'success'
          );
          setTimeout(function () {
            location.reload();
          },1900);

        }
        else{
          Swal.fire({
        type: 'error',
        title: 'There was some error',
        });
      }
    }
  });


}

$(document).ready(function() {

  $('#formUpload').submit(function() {
      $(this).ajaxSubmit({
        error: function(xhr) {
      console.error('Error: ' + xhr.status);
          },
          success:function(res) {
            if(res=="done"){
              var courseName=document.getElementById('CourseMain').value;
              var id=document.getElementById('idMain').value;

              if(courseName!="" && id!=""){
                $.ajax({
                  data:"courseName="+courseName+"&idMain="+id,
                  type:'post',
                  url:'/admin/upload/updateInfo',
                  success:function(resp) {
                    console.log(resp);
                    location.reload();
                  }
                });
              }else{

              }

            }else {

            }
          }
      });
       return false;
  });

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
return false;
});
