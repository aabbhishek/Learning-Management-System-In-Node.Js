  function updateData() {
    var element = document.activeElement;
    var id = element.getAttributeNode("id").value;
    var i = element.getAttributeNode("ival").value;
    var courseName = element.getAttributeNode("courseName").value;
    var date = document.getElementById('date-'+i).value;
    var about = document.getElementById('about-'+i).value;
    var dateform = new Date(date);
      // var month = dateform.getMonth()-1;
      // var date = dateform.getDate();
      // var year = dateform.getFullYear();

    console.log(date);
    var nowTime = new Date();
    if(dateform >= nowTime){

        $.ajax({
            data:"mainId="+id+"&dateUpdate="+dateform+"&about="+about+"&courseName="+courseName,
            type:'post',
            url:'/admin/dashbord/updateNew',
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
              }
              else{
                Swal.fire({
                type: 'error',
                title: 'Sorry! please retry later ',
              });
              }

            }
        });

    }
    else{
      Swal.fire({
      type: 'error',
      title: 'Sorry No time travel authorized check date ',
    });
    }
  }

  function deleteDate() {
    var element = document.activeElement;
    var id = element.getAttributeNode("id").value;
    var courseName = element.getAttributeNode("courseName").value;

    $.ajax({
      data:"mainId="+id+"&courseName="+courseName,
      type:'post',
      url:'/admin/dashbord/removeDate',
      success:function(respo) {
        if(respo){
          Swal.fire(
          'Action Performed',
          'Updated',
          'success'
        );
        setTimeout(function() {
          location.reload();
        },1900);

        }
        else{

          Swal.fire({
          type: 'error',
          title: 'Sorry! please retry later ',
        });
        }
      }
    });

  }

  function newOpen() {
    $("#insertNewDate").modal('show');
  }

  function insertNewDocument(){
      var element = document.activeElement;
      var courseName = element.getAttributeNode("courseName").value;
      var date = document.getElementById('dateOne').value;
      var about = document.getElementById('about').value;
      var dateform = new Date(date);
      var nowTime = new Date();

      if(dateform >= nowTime){

          $.ajax({
              data:"courseName="+courseName+"&dateUpdate="+dateform+"&about="+about,
              type:'post',
              url:'/admin/dashbord/insertNewDate',
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
                }
                else{
                  Swal.fire({
                  type: 'error',
                  title: 'Sorry! please retry later ',
                });
                }

              }
          });

      }
      else{
        Swal.fire({
        type: 'error',
        title: 'Sorry No time travel authorized check date ',
      });
      }
  }
