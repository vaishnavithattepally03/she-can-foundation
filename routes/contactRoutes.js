const express = require("express");

const router = express.Router();

const multer = require("multer");

const path = require("path");

const Contact = require("../models/Contact");

/* STORAGE */

const storage = multer.diskStorage({

    destination:function(req,file,cb){

        cb(null,"uploads/");

    },

    filename:function(req,file,cb){

        cb(
            null,
            Date.now() + path.extname(file.originalname)
        );

    }

});

const upload = multer({ storage });

/* CREATE CONTACT */

router.post(
    "/create",
    upload.single("image"),
    async (req,res) => {

        try{

            const newContact = new Contact({

                name:req.body.name,

                email:req.body.email,

                message:req.body.message,

                image:req.file ? req.file.filename : ""

            });

            await newContact.save();

            res.status(201).json({

                message:"Message Sent Successfully"

            });

        }
        catch(error){

            console.log(error);

            res.status(500).json({

                message:"Server Error"

            });

        }

    }
);

/* GET ALL */

router.get("/all", async (req,res) => {

    try{

        const contacts = await Contact.find()
        .sort({ createdAt:-1 });

        res.json(contacts);

    }
    catch(error){

        res.status(500).json({

            message:"Server Error"

        });

    }

});

module.exports = router;