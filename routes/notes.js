const express = require('express');
const router = express.Router();
const fetchuser = require('../middleware/fetchuser');
const Note = require('../models/Note');
const { body, validationResult } = require('express-validator');


// Route-1 : Get all notes the using: GET /api/auth/fetchallnotes
router.get('/fetchallnotes', fetchuser, async (req, res) => {

    let success = false;

    try {
        const notes = await Note.find({ userId: req.user.id })
        success = true;
        res.status(200).json({success ,notes});

    } catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log(error)
    }

})

// Route-2 : Add a note using: POST "/api/auth/addnote" login requried 

router.post('/addnote',[
    body('title', 'title lenght must be greater than 3').isLength({ min: 3 }),
    body('description', 'Description must be greater than 8').isLength({ min: 8 })
], fetchuser, async (req, res) => {

    let success = false;

    // If errors exist return bad request
    const errors = validationResult(req);


    if (!errors.isEmpty()) {
        return res.status(404).json({success : success, errors: errors.array() });
    }

   try {

    const { title, description, tag } = req.body;

    //creating a note
    
    const note = new Note
    ({
        title, description, tag, userId: req.user.id
    })

    const savedNote = await note.save()
    success = true;
    res.json({success, savedNote});

    
   } catch (error) {
    res.status(500).json({ error: "Internal server error" })
    console.log(error)
}

})


// Route-3 : Update an existing note using: PUT "/api/auth/updatenote" login requried 
router.put('/updatenote/:id', fetchuser, async (req, res) => {

    let success = false;

    try {
        const { title, description, tag } = req.body;


    // Create a Updating the note

    let   newNote = {}
    if(title)newNote.title = title;
    if(description)newNote.description = description;
    if(tag)newNote.tag = tag;

    
    // Finding the note to be updated and update it.

    let  note = await Note.findById(req.params.id);

    if(!note){
        return res.status(404).json({success : success, error : "Not Found"});
    }


    if(req.user.id !== note.userId.toString() ){
        return res.status(401).json({success : success, error : "Not Allowed oyuee "})
    }

    note = await Note.findByIdAndUpdate(req.params.id, {$set :  newNote}, {new : true })
    
    res.json({success : true, note});
    }  catch (error) {
        res.status(500).json({ error: "Internal server error" })
        console.log(error)
    }



})

// Route-4 : Delete an existing note using: DELETE "/api/auth/deletenote" login requried 

router.delete('/deletenote/:id', fetchuser, async (req, res) => {

    let success = false;

    try {
        let note = await Note.findById(req.params.id);

        // Finding the note to be deleted and delete it.

        if(!note){
            return res.status(404).json({success : success ,error : "Not Found"});
        }

        
        if( req.user.id !== note.userId.toString() ){
            return res.status(501).send({success : success, error : "Not allowed"});
        }
    
        note = await Note.findByIdAndDelete(req.params.id)
    
        res.status(200).send({success : true, message : "Successfully deleted the note "})
    }catch (error) {
        res.status(500).json({success, error: "Internal server error fxf" })
        console.log(error)
    }

})



module.exports = router
