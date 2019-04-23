function actionCourseList(action) {
  var element = document.activeElement;
  var email= element.getAttributeNode("email").value;
  var courseName= element.getAttributeNode("courseName").value;
  var id= element.getAttributeNode("id").value;

    $.ajax({
      data:"course_name="+courseName+"&email="+email+"&setStatus="+action,
      type:"post",
      url:"/admin/actionCourse",
      success:function(data) {
        if(true){
          actionSuccess(action);
          setTimeout(function(){
            location.reload();
           }, 3000);

        }
        else{
            typeError('Can Not Perform Action');
        }
      }
    });

}


function actionSuccess(status){
  Swal.fire(
  'Action Performed',
  'Course ' + status,
  'success'
);
}

function typeError(value) {
  Swal.fire({
  type: 'error',
  title: value,
  });
}

function insertCourse() {
  var courseName = document.getElementById('cn').value;
  var courseDesc = document.getElementById('cd').value;
  if(courseName=="" && courseDesc==""){
    typeError("enter all details");
  }else{
  $.ajax({
      data:"course_name="+courseName+"&course_desc="+courseDesc,
      type:'post',
      url:'/admin/inCourseData',
      success:function(data) {
        if(data){
          Swal.fire(
          'New course created',
          '.',
          'success'
        );

        setTimeout(function () {
          location.reload();
        },1900);

        }
        else{
          typeError('Course can not be created');
        }
      }
  });

  }

}

function documentMangment() {

  var nowElemt = document.activeElement;
  var courseName= nowElemt.getAttributeNode("courseName").value;
  window.location.href = "/admin/dashbord/docManagment?courseName="+courseName;
}

function calanderMangment() {

  var nowElemt = document.activeElement;
  var courseName= nowElemt.getAttributeNode("courseName").value;
  window.location.href = "/admin/dashbord/calanderMangment?courseName="+courseName;
}
