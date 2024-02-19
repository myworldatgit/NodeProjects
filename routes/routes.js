const express=require('express');
const router=express.Router();
const User=require('../models/users');
const registerUser=require('../models/registerUser');
const multer=require('multer');

//to upload image we are using multer
const fs=require("fs");

var storage=multer.diskStorage({
    destination:function(req,file,cb){
        cb(null,'./uploads');
    },
    filename:function(req,file,cb){
        cb(null,file.fieldname+"_"+Date.now()+"_"+file.originalname);
    },
//cb is short form for the call back
});
var upload=multer({
    storage:storage,
}).single("Image");
//name of the image attribute is Image


//to add the register user in the database
router.post('/register',(req,res)=>{
    const register=new registerUser({
        email:req.body.emailregister,
        password:req.body.passwordregister,
    });

    register.save()
    .then(()=>{
        
        req.session.message={
          type:success,
          message:"user register successfully",
        }
        res.redirect('/register');
        
    })
    .catch((error)=>{
       res.json({message:error.message,type:'danger'}); 
    });
});


//to add user into the database

    router.post('/adduser',upload,(req,res)=>{
        const user=new User({
            name:req.body.Name,
            email:req.body.Email,
            phone:req.body.Phnumber,
            address:req.body.Address,
            image:req.file.filename,
    
        });
        //old method
        // user.save((err)=>{
        //     if(err){
        //         res.json({message:err.message,type:'danger'});
        //     }
        //     else{
        //         req.session.message={
        //             type:'success',
        //             message:"User added Successfully",
        //         }
        //         res.redirect('/');
        //     }
            
        // });


        user.save()
        .then(()=>{
            req.session.message={
                            type:'success',
                            message:"User added Successfully",
                        };
                        res.redirect('/showuser');

        })
        .catch((err)=>{
            res.json({message:err.message,type:'danger'});
        })
    });
    

    ///get all users from the database





router.get('/',(req,res)=>{
// res.send("This is home page");

res.render("index",{title:"Home Page"});
})

router.get('/register',(req,res)=>{
    res.render('register',{title:"register page"})
});

router.get('/showuser',(req,res)=>{
    
    User.find().then((users)=>{
        res.render("showuser",{
                        title:"showuser",
                        users:users,
    })
}).catch((err)=>{
    res.json({message:err.message});
});

});




router.get('/adduser',(req,res)=>{
    res.render("adduser",{title:"userpage"});
})
router.get('/discussions',(req,res)=>{
    res.render("index");
})

router.get('/user',(req,res)=>{
    res.send("All users");
})


//edit the user route
router.get('/edit/:id',(req,res)=>{
    let id=req.params.id;

    User.findById(id)
    .then((user)=>{
        if(user==null){
                    res.redirect('/');
                }
                else{
                   res.render("edituser",{
                    title: "Edit User",
                    user:user,
                   });
                }

    }).catch((err)=>{
        console.log(err);
        res.redirect('/');
    })
});

//Update user route
router.post("/update/:id",upload,(req,res)=>{
    let id=req.params.id;
    let new_img='';
    // req.file check if any new file is choosen or not
    if(req.file){
     new_img=req.file.filename;
     try {
        fs.unlinkSync("./uploads/"+req.body.old_image)
        // removing the image from upload folder and in edit user page given hidden input tag to store old image and given name to it old_image 
     } catch (error) {
        console.log(error);
     }
    }
    else{
        new_img=req.body.old_image;
    }

    
    User.findByIdAndUpdate(id,{
        name:req.body.Name,
        email:req.body.Email,
        phone:req.body.Phnumber,
        address:req.body.Address,
        image:new_img,
}).then(()=>{
    req.session.message={
                type:'success',
                message:"Updated user successfully",
            };
            res.redirect('/showuser');
}).catch((err)=>{
    res.json({message:err.message,type:'danger'});
});

});

//now choosing new file while updating is necessary as we have add required in the input form so just remove it

//delete user route
router.get('/delete/:id',(req,res)=>{
    let id=req.params.id;
    User.fin
    
    User.findByIdAndDelete(id)
    .then((result)=>{
        if(result.image!=''){
                    try {
                        fs.unlinkSync("./uploads/" +result.image);
                    } catch (error) {
                        console.log(error);
                    }
                }
        else{
                    req.session.message={
                        type:'info',
                        message:"User Deleted  successfully!",
                    };
                    
                };
                res.redirect('/showuser');
    }).catch((err)=>{
        res.json({message:err.message});
    });
});





module.exports=router;