var express=require('express');
var app=express();
var bodyParser=require('body-parser');
var mongo=require('mongodb');
var path=require('path');

app.use(express.static(path.join(__dirname,'/public')));
var url='mongodb://localhost:27017/contactdb';
var MongoClient=mongo.MongoClient;


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended:true}));

//creating database
MongoClient.connect(url,function(error,db){
    if(error){
        console.log('error in creating datatbase');
    }else{
    console.log('Database created!'); 
    var dbo=db.db('contactdb');
    }

    //creating contact
app.post('/details',function(req,res){
var user={
    name:req.body.name,
    phone:req.body.phone
}
dbo.collection('users').insertOne(user,function(error,result){
if(error){
    console.log('error in inserting values');
}else
console.log('Values inserted');
res.send("Name: "+ req.body.name + " , Phone: "+ req.body.phone);
});
});

//delete contact
app.post('/delete',function(req,res){
    var query={
        phone:req.body.phone
    };
    dbo.collection('users').find(query).toArray(function(error,row){
        if(error){
            console.log('error in finding');
        }else{
            if(row.length>0){
            dbo.collection('users').deleteOne(query,function(err,result){
                if(err){
                    console.log('error in deleting');
                }else
                {
                    console.log('contact deleted successfully');
                    res.send('CONTACT DELETED-- '+ req.body.phone);
                }
            });
        }else{
            console.log('no user with that number');
            res.send('NO USER WITH THAT NUMBER');
        }
        }
    });
});

//search contact
app.post('/search',function(req,res){
    var query={
        name:req.body.name
        
    };
    dbo.collection('users').find(query).toArray(function(err,row){
        if(row.length>0){
        if(err){
            console.log('error in searching contact');
        }else{
            console.log('search successful!');
            console.log(row);
            res.send(row);
        }
    }else{
            console.log('no contact with that name!');
            res.send('No contact with that name');
        }
    });
});
});

app.listen(5000);
