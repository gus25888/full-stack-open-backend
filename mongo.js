const mongoose = require('mongoose')

if (process.argv.length < 3) {
    console.log(`Usage:
        node mongo.js dbpassword
        or
        node mongo.js dbpassword "newUserName" "newPhoneNumber"`);
    process.exit(1)
}

const dbUser = 'gustavobaezaavello';
const password = process.argv[2];
const cluster = 'micluster.5gar3aw.mongodb.net';
const dbName = 'phonebookApp';

const connectionURL =
    `mongodb+srv://${dbUser}:${password}@${cluster}/${dbName}?retryWrites=true&w=majority`

mongoose.set('strictQuery', false);
mongoose.connect(connectionURL)

const personSchema = new mongoose.Schema({
    name: String,
    number: String,
})

const Person = mongoose.model('Person', personSchema)

if (process.argv.length === 5) {
    const name = process.argv[3];
    const number = process.argv[4];
    const person = new Person({
        name,
        number
    })

    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })
} else {

    Person
        .find({})
        .then((result) => {
            if (result.length > 0) {
                console.log('phonebook:')
                result.forEach(person => {
                    console.log(`   ${person.name} ${person.number}`);
                });
            }
            mongoose.connection.close()
        })
}