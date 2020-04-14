const fs = require('fs');
const crypto = require('crypto');
const util = require('util');
const Repository = require('./repository');

const scrypt = util.promisify(crypto.scrypt);

class UserRepository extends Repository{
    async comparePasswords(saved, supplied) {
        // saved --> password saved in our database. 'hashed.salt'.
        // Supplied --> passwordgiven to us by a user trying sign in.   
        // const result = saved.split('.');
        // const hashed = result[0];
        // const salt = result[1];
        const [hashed, salt] = saved.split('.');
        const hashedSuppliedBuf = await scrypt(supplied, salt, 64);
        return hashed === hashedSuppliedBuf.toString('hex');
    }

    async create(attrs) {
        // attach an id property to every attributes object that i get .
        attrs.id = this.randomId();
        const salt = crypto.randomBytes(8).toString('hex');
        // scrypt(attrs.password, salt, 64, (err, buf)=>{
        //     const hashed = buff.toString('hex');
        // });
        const buf = await scrypt(attrs.password, salt, 64);
        const records = await this.getAll();
        // records.push(attrs);
        // records.push({
        //     ...attrs, 
        //     password: `${hashed.toString('hex')}.${salt}`
        // });
        const record = {
            ...attrs,
            password: `${buf.toString('hex')}.${salt}`
        };
        records.push(record);
        // write the updated 'records' array back to this.filename
        // await fs.promises.writeFile(this.filename, JSON.stringify(records));
        await this.writeAll(records)
        // return attrs;
        return record;
    }
}

// const test = async () => {
//     // access to our users repository
//     const repo = new UserRepository('users.json');
//     // save a new records 
//     await repo.create({email: 'test@test.com'});
// //     // // get all records we have saved 
//     // const users = await repo.getAll();
//     // const user = await repo.getOne("26cb3d68");
// //     // delete test
// //     // await repo.delete('6bd56df0');
// //     // update test
//     await repo.update('eb35dd7',{password: 'mypassword'});
// //     // getOneBy
//     const user = await repo.getOneBy({
//         "email": "test@test.com",
//         "id": "eb35dbdkk7"

//     });
// //     // print the amount
//     console.log(user);

// };

// test();

module.exports = new UserRepository('users.json')