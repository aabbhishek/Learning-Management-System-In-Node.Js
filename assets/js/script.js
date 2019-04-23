

function onChnage() { //for validating input values
  var element = document.activeElement;
  var value = element.value;

  if(notNULL(value)){
    element.classList.add("is-valid");
    element.classList.remove("is-invalid");


    //document.getElementById(element.id)[0].setAttribute("valid","true");
  }
  else{
    //document.getElementById(element.id)[0].setAttribute("valid","false");
    element.classList.add("is-invalid");
    element.classList.remove("is-valid");


    }

}

function login(){ //login func
  var email = document.getElementById('lemail');
  var password = document.getElementById('lpassword');


    $.ajax({
      data:"email="+email.value+"&password="+password.value,
      type:"post",
      url:"/logchek",
      success:function(data){
        console.log("data:"+data);
        if(data){

            window.location.href = "/profile";

        }
        else {
          Swal.fire({
          type: 'error',
          title: 'Wrong Email or Password',

        });
        }
      }

    });



}

function switchInput(){

  anime({
  targets: '.login_box',
  translateX: -1200,
  duration: 3000
});

  anime({
  targets: '.reg_in',
  translateX: -1050,
  duration: 3000
  });

}


function switchInputTwo(){

  anime({
  targets: '.login_box',
  translateX: 0,
  duration: 3000
});

  anime({
  targets: '.reg_in',
  translateX: 0,
  duration: 3000
  });

}

function sendRegi(){
  var email=document.getElementById('email').value;
  var password=document.getElementById('password').value;
  var cpassword=document.getElementById('cpassword').value;

  if(password==cpassword){

  $.ajax({
    data:"email="+email+"&password="+password,
    type:"post",
    url:"/reg",
    success:function(data){
      console.log("data:"+data);
      if(data){
        console.log("done");
        Swal.fire(
        'Thank You',
        'You Are Registred',
        'success'
      );

      }
      else {
        Swal.fire({
        type: 'error',
        title: 'DataBase Error',

      });
      }
    }

  });
  }else{
  Swal.fire({
  type: 'error',
  title: 'Password does not match',

});


  }


}

function notNULL(val) { //checking values NULL or NOT
  if(val!=""){
    return true;
  }
  else{
    return false;
  }
}
