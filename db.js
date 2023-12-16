const mongoose = require('mongoose');

const mongoURI = 'mongodb://127.0.0.1:27017/iNoteBook'

const connectToMongo = async () => {
    await mongoose.connect(mongoURI).then(
        () => {
            console.log("success")
        },
        err => {
            console.log(err);
        }
    )
}


// mongoose.connect(uri, options).then(
//     () => { /** ready to use. The `mongoose.connect()` promise resolves to mongoose instance. */ },
//     err => { /** handle initial connection error */ }
//   );



module.exports = connectToMongo;

// // getting-started.js
// const mongoose = require('mongoose');

// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://localhost:27017/inotebook');

//   // use `await mongoose.connect('mongodb://user:password@127.0.0.1:27017/test');` if your database has auth enabled
// }