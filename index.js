//imports
var express = require('express');
const bodyParser = require('body-parser');
var session = require('express-session');
var app=express();
ObjectID = require('mongodb').ObjectID;
var urlencoderParser = bodyParser.urlencoded({extended:false});
var MongoClient = require('mongodb').MongoClient; // mongo Connection
var url="mongodb+srv://ad:admin@oncluster0-yqalk.mongodb.net/test?retryWrites=true"; //connection string
var waterfall = require('async-waterfall');
var multer =require('multer');

//main
app.set('view engine','ejs');
app.use('/assets',express.static('assets'));
app.use(session({secret: "user"}));

app.get('/',function(req,res) {
  res.render('reg');
});

app.get('/home',function(req,res) {
  res.render('reg');
});

app.get('/profile',function(req,res) {
  var email = req.session.email;
  if(email!=null){

    MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection
    if (err) throw err;
    var dbo = db.db("abc_crop"); //database name
    dbo.collection("course_list").find({}).toArray(function(err,result) {
        if (err) throw err;

        res.render('profile',{"email":email,"data":result});

        db.close();
      });

    });





  }else{
    res.writeHead(404,{Location: '/'});
  }
});

app.post('/profile/chekCourse',urlencoderParser,function(req,res) {
try {
  MongoClient.connect(url, { useNewUrlParser: true } , function(err, db) {
  if (err) console.error(err);
  var dbo = db.db("abc_crop");
  var query = { course_name:req.body.courseName,user_email:req.body.email};
  dbo.collection("course_request").find(query).toArray(function(err, result) {
    if (err){
       res.send(false);
       return;
    }
    process.on('uncaughtException', function (err) {
        res.send(false);
        res.end();
    });


    if(result[0].status=="approved"){
      res.send(true);
    }else{
      res.send(false);
    }

    db.close();
  });

});
} catch (e) {
  res.send(false);
} finally {

}

});
//admin-start



app.get('/admin',function (req,res) {
  res.render("admin");
});


app.get('/profile/course',function (req,res) {

  var courseName = req.query.courseName;

  waterfall([
    function getCourse(callback) {

      MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection

        var dbo = db.db("abc_crop"); //database name

        dbo.collection(courseName).find({}).toArray(function(err,result){
          if(err){
          callback(err,null)
          return;
          }
          for (var i = 0; i < result.length; i++) {
            if(result[i].DocumentUrl == ""){
              result[i].DocumentUrl="no";
            }
          }
          course=result;
          callback(null,course);
          db.close();
        });

      });
    },
    function getCourseCalander(course,callback) {
      MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection

        var dbo = db.db("abc_crop"); //database name
        var collectionName=courseName.trim() +"-Calender";
        dbo.collection(collectionName).find({}).toArray(function(err,result){
          if(err){
          callback(err,null)
          return;
          }
          for (var i = 0; i < result.length; i++) {
            var dateCh = new Date(result[i].Date);
            var stringDate = dateCh.getDay()+"\\"+(dateCh.getMonth() + 1 )+"\\"+dateCh.getFullYear();
            result[i].Date =stringDate;
          }

          finalResult={"course":course,"courseCalander":result};
          callback(null,finalResult);
          db.close();
        });

      });
    }
  ],
  function functionName(err,result){
      if(err){
        console.error(err);
      }

      res.render('course',{"courseName":courseName,"data":result});
  });


});


app.get('/admin/dashbord',function(req,res){
  var email = req.session.adminEmail;
  if(email==null){
    res.writeHead(404,{Location: '/'});
  }
  waterfall([
    function getCourseRequest(callback) {

      MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection

        var dbo = db.db("abc_crop"); //database name

        dbo.collection("course_request").find({}).toArray(function(err,result){
          if(err){
          callback(err,null)
          return;
          }
          courseRequest=result;
          callback(null,courseRequest);
          db.close();
        });

      });
    },
    function getCourseList(courseRequest,callback) {
      MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection

        var dbo = db.db("abc_crop"); //database name

        dbo.collection("course_list").find({}).toArray(function(err,result){
          if(err){
          callback(err,null)
          return;
          }

          finalResult={"courseRequest":courseRequest,"courseList":result};
          callback(null,finalResult);
          db.close();
        });

      });
    }
  ],
  function functionName(err,result){
      if(err){
        console.error(err);
      }

      res.render('dashbord',{"email":email,"data":result});
  });



});

app.post('/admin/actionCourse',urlencoderParser,function(req,res) {
  console.log("actionCourse");
    MongoClient.connect(url, { useNewUrlParser: true } ,function(err,db) {
      var dbo =db.db("abc_crop");
      var myquery = {course_name:req.body.course_name,user_email: req.body.email};
      var newvalues ={$set : {status:req.body.setStatus}};
      dbo.collection("course_request").updateOne(myquery,newvalues,function(err,result){
        if(err){ console.error(err);}
        if(result){
          res.send(true);
        }else{
          res.send(false);
        }
      });

    });


});

app.post('/admin/inCourseData',urlencoderParser,function(req,res) {

  console.log("inCourseData");
    MongoClient.connect(url,{ useNewUrlParser: true } ,function(err,db) {
        if (err) throw err;
        var dbo = db.db("abc_crop");
        dbo.collection("course_list").insertOne(req.body,function(err,result) {
          if(err){
            console.error(err);
          }
          if(result){
            res.send(true);
          }else{
            res.send(false);
          }
        });
    });

});


app.post('/admin/check',urlencoderParser,function(req,res) {
  console.log("checking Admin");
  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection
    if (err) console.error(err);
    var dbo = db.db("abc_crop"); //database name

    dbo.collection("adminInfo").findOne({email:req.body.email,password:req.body.password}, function(err,result) {
      if(result){
        req.session.adminEmail=req.body.email;
        res.send(true);
      }
      else{
        res.send(false);
      }
    });
    db.close();
  });

});

//admin-end
app.post('/courseRegister',urlencoderParser, function(req,res) {
  console.log("User registred course wating......");

  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection
    if (err) throw err;
    var dbo = db.db("abc_crop");
    dbo.collection("course_request").insertOne(req.body,function(err,resp) {
        if(resp){
        res.send(true);

      }
      else{
        res.send(false);
      }
      db.close();

    });
  });
});



app.post('/logchek',urlencoderParser,function(req,res) {
console.log("User Requsted Login");



  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection
    if (err) throw err;
    var dbo = db.db("abc_crop"); //database name

    dbo.collection("user_data").findOne({email:req.body.email , password:req.body.password} ,function(err,result) {

      if(result){
        req.session.email=req.body.email;
        res.send(true);

      }
      else{
        res.send(false);
      }

    });
    db.close();
  });
});

app.post('/reg',urlencoderParser,function(req,res){
  console.log("User Requsted REG");


  var user_info = req.body; //geting post Data

  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db) {//collection
    if (err) throw err;
    var dbo = db.db("abc_crop"); //database name
    dbo.collection("user_data").insertOne(user_info,function(err,resp) {
        if(resp){
        res.send(true);
      }
      else{
        res.send(false);
      }
      db.close();

    });

  });



});



app.get('/admin/dashbord/docManagment',function(req,res){


  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection

    var dbo = db.db("abc_crop"); //database name

    dbo.collection(req.query.courseName).find({}).toArray(function(err,result) {
      if(result){
        for(var i=0;i<result.length;i++){
          if(result[i].DocumentUrl!=""){
            result[i].button="<form method='post' action='/admin/dashbord/download' id='download'><button title='View document' id='"+result[i]._id+"' courseName='"+ req.query.courseName +"' name='filename' value='"+req.query.courseName+"-"+result[i]._id+"' class='btn btn-calander' ><i class='far fa-eye'></i></button></form>";
          }
          else{
            result[i].button="<button title='Upload document'   id='"+result[i]._id+"' courseName='"+ req.query.courseName +"' class='btn btn-update' onclick='uploadModal();'><i class='fas fa-upload'></i></button>";
          }
        }
      }else{
        result=null;
      }

      res.render('docMangment',{'data':result,'courseName':req.query.courseName});
    });


  });

});//end

app.get('/admin/dashbord/calanderMangment',function(req,res) {


    MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//collection
      if(err){console.error(err);}
      var dbo = db.db("abc_crop"); //database name
      dbo.collection(req.query.courseName+"-Calender").find({}).toArray(function(err,result) {
        if(err){console.error(err);}
        if(result){
          for (var i = 0; i < result.length; i++) {
            var date = new Date(result[i].Date);
            var newDateView =  date.getFullYear()+"-"+ ( date.getMonth() + 1) +"-"+date.getDate();
            result[i].Date = newDateView;
          }
        }
        res.render('calendar',{'data':result,'courseName':req.query.courseName});
      });
      db.close();

    });

});

var storage =   multer.diskStorage({
  destination: function (req, file, callback) {
    callback(null, './uploads');
  },
  filename: function (req, file, callback) {

    callback(null, file.originalname );
  }
});

var upload = multer({ storage : storage  }).single('document');


app.post('/admin/docUpload',urlencoderParser,function(req,res){

    upload(req,res,function(err) {
        if(err) {
            return res.end("Error uploading file.");
        }
        res.end("done");
    });
});



app.post('/admin/upload/updateInfo',urlencoderParser,function(req,res) {

  MongoClient.connect(url, { useNewUrlParser: true } ,function(err, db){//connection

    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');
    var id = new mongo.ObjectID(req.body.idMain );

    // var id = "ObjectId(" +req.body.idMain +")";
    var myquery = {_id: id};
    var docURL=req.body.courseName+"-"+req.body.idMain;
    var newvalues = {$set: {DocumentUrl:docURL} };


    dbo.collection(req.body.courseName).updateOne(myquery,newvalues,function(err,result) {
      if(err){  console.error(err);}
      if(result){
        res.send(true);
      }else{
        res.send(false);
      }
      db.close();
    });
  });

});

app.post('/admin/dashbord/download',urlencoderParser,function(req,res){
  const fs = require('fs')
  try{
    var filename =__dirname+"\\uploads\\"+req.body.filename+".pdf";

    if(fs.existsSync(filename)){
      res.download(filename);
    }else{
      var filename =__dirname+"\\uploads\\"+req.body.filename+".png";
      res.download(filename);
    }
  }catch(err){
    console.error(err);
  }
});

app.post('/profile/download',urlencoderParser,function(req,res){
  const fs = require('fs')
  try{
    var filename =__dirname+"\\uploads\\"+req.body.filename+".pdf";

    if(fs.existsSync(filename)){
      res.download(filename);
    }else{
      var filename =__dirname+"\\uploads\\"+req.body.filename+".png";
      res.download(filename);
    }
  }catch(err){
    console.error(err);
  }
});


app.post('/admin/dashbord/updatedValues',urlencoderParser,function(req,res){

  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');
    var id = new mongo.ObjectID(req.body.mainId);
    var myquery = {_id: id};

    var newvalues = {$set : {Lesson:req.body.lessonName,VideoUrl:req.body.videoUrl}};
    dbo.collection(req.body.courseName).updateOne(myquery,newvalues,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});


app.post('/admin/dashbord/removeDoc',urlencoderParser,function(req,res){


  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');
    var id = new mongo.ObjectID(req.body.mainId);
    var myquery = {_id: id};
    dbo.collection(req.body.courseName).deleteOne(myquery,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});

app.post('/admin/dashbord/newDocumentInsert',urlencoderParser,function(req,res){
  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');

    var data={Lesson:req.body.lesson,VideoUrl:req.body.videoUrl,DocumentUrl:"",button:"" };

    dbo.collection(req.body.courseName).insertOne(data,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});

app.post('/admin/dashbord/updateNew',urlencoderParser,function(req,res){

  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');
    var id = new mongo.ObjectID(req.body.mainId);
    var myquery = {_id: id};
    var newvalues = {$set : {Date:req.body.dateUpdate,About:req.body.about}};
    var cName=req.body.courseName;
    cName = cName.trim()+"-Calender";
    dbo.collection(cName).updateOne(myquery,newvalues,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});


app.post('/admin/dashbord/removeDate',urlencoderParser,function(req,res){


  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');
    var id = new mongo.ObjectID(req.body.mainId);
    var myquery = {_id: id};
    var cName=req.body.courseName;
    cName = cName.trim()+"-Calender";
    dbo.collection(cName).deleteOne(myquery,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});

app.post('/admin/dashbord/insertNewDate',urlencoderParser,function(req,res){
  MongoClient.connect(url, { useNewUrlParser: true } , function(err,db){
    var dbo = db.db("abc_crop"); //database name
    var mongo = require('mongodb');

    var cName=req.body.courseName;
    cName = cName.trim()+"-Calender";

    var data={Date:req.body.dateUpdate,About:req.body.about};

    dbo.collection(cName).insertOne(data,function(req,result) {
        if(err){console.error(err);}
        if(result){res.send(true);}
        else{res.send(false);}
    });
    db.close();
  });
});


app.listen(3000);
