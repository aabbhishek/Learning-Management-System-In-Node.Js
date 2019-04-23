function Login(){
  var email=document.getElementById('adminEmail').value;
  var password=document.getElementById('adminPassword').value;
  $.ajax({
      data:"email="+email+"&password="+password,
      type:'post',
      url:'/admin/check',
      success:function(data) {
        if(data){
          window.location.href = "/admin/dashbord";
        }
        else{
          Swal.fire({
          type: 'error',
          title: 'Check Email or Password',
        });
        }
      }
  });
}
