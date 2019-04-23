function regCourse(email) {
  var element = document.activeElement;
  var courseName= element.getAttributeNode("course_name").value;
  var courseId= element.getAttributeNode("course_id").value;
  $.ajax({
      data:"course_name="+courseName+"&user_email="+email+"&status="+"pending",
      type:"post",
      url:"/courseRegister",
      success:function(data) {
        if(data){
          element.setAttribute("disabled","disabled");
        }
        else{
          Swal.fire({
          type: 'error',
          title: 'Can Not Register',
        });
        }
      }
  });
}


function chekAndForward() {
  var element = document.activeElement;
  var courseName= element.getAttributeNode("course_name").value;
  var email= element.getAttributeNode("userEmail").value;

  $.ajax({
    data:"courseName="+courseName+"&email="+email,
    type:'post',
    url:'/profile/chekCourse',
    success:function(respo) {
      if(respo){
        window.location.href = "/profile/course?courseName="+courseName;
      }
      else{

        Swal.fire({
        type: 'error',
        title: 'Your are not registred',
        });

        setTimeout(function () {
          location.reload();
        },1000);

      }
    }
  });
}
