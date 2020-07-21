const mongoose = require('mongoose');
const assert = require('assert');

//database connection
const mongoDB = 'mongodb://localhost/playground';
mongoose.connect(mongoDB, { useUnifiedTopology: true, useNewUrlParser: true })
    .then(() => console.log('Connected to MongoDB!'))
    .catch(err => console.error('Could not connect to MongoDB Server : ', err));

//Create database schema
const courseSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true,
        minlength: 5, //no need to be explained you have alreday know the function of this line right?
        maxlength: 255
    }, //to set the data type to be String and required (not null)
    category: {
        type: String,
        required: true,
        enum: ['Web Dev', 'Mobile Dev', 'Desktop App'] //to make an enum
    },
    author: String,
    tags: {
        type: Array,
        // validate: {
        //     //Async validator here
        //     isAsync: true,
        //     validator: function(valueLength, panggil) {
        //         setTimeout( () => {
        //             const result = valueLength && valueLength.length > 0; //if tags has value and more than zero then true
        //             panggil(result);
        //         }, 3000);
        //     },
        //     message: 'Tags should not be empty!' //but if not return an error message
        // }

        //however, that method above is deprecated
        
        //read : https://mongoosejs.com/docs/validation.html#async-custom-validators
        //read : https://github.com/Automattic/mongoose/issues/7761
        //read : https://stackoverflow.com/questions/42877930/implicit-async-custom-validators-custom-validators-that-take-2-arguments-are-d
        //read : https://stackoverflow.com/questions/26061202/how-to-use-nodejs-assert
        
        //try this one instead

        // validate: {
        //     validator: (valueLength) => Promise.resolve(valueLength && valueLength.length > 0),
        //     message: 'Tags should not be an empty or null!'
        // }

        //or this

        validate: {
            validator: function(valueLength){
                return new Promise( (resolve, reject) => {
                    setTimeout(()=>{
                        if(valueLength && valueLength.length > 0){
                            resolve();
                        } else{
                            reject(new Error('Tags should not be an empty or null!'));
                        }
                    }, 3000); //3 seconds
                });
            }
        }
    },
    date: {type: Date, default: Date.now},
    isPublished: Boolean,
    price: {
        type: Number,
        required: function() { return this.isPublished; },
        min: 20,
        max: 200
    } //to set the price property to required if isPublished is true Note: you can't use arrow function in here, because arrow function don't have key "this"
}); 

const Course = mongoose.model('Course', courseSchema);

//this is how to insert data into the database
async function createCourse(){
    const course = new Course({
        name: 'A',
        category: 'Web Dev',
        author: 'Ouka',
        tags: [],
        isPublished: true,
        price: 40
    });

    try{
        const result = await course.save();
        console.log(result);
    } catch(err){
        var a=0;
        for(i in err.errors){
            a+=1;
            console.log(a,err.errors[i].message);
        }
        console.log('Total error count : ', a);
    }
}

createCourse();