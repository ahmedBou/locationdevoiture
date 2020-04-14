const fs = require('fs');
const crypto = require('crypto');
module.exports = class Repository{
    constructor(filename) {
        // ensuring that i have filename being provide 
        // and that file actually existe on our hardrive
        if (!filename) {
            throw new Error('Creer un nouveau repo require a filename');
        }
        this.filename = filename;
        try {
            fs.accessSync(this.filename);
        } catch (err) {
            fs.writeFileSync(this.filename, '[]');
        }
    }
    async create(attrs){
        attrs.id = this.randomId();
        const records = await this.getAll();
        records.push(attr);
        await this.writeAll(records);
    }
    async getAll() {
        // open the file called this.filename
        return JSON.parse(
            await fs.promises.readFile(this.filename, {
                encoding: 'utf8'
            })
        );
    }



    async writeAll(records) {
        await fs.promises.writeFile(
            this.filename, JSON.stringify(records, null, 2)
        );
    }
    randomId() {
        return crypto.randomBytes(4).toString('hex');
    }
    async getOne(id) {
        const records = await this.getAll();
        return records.find(record => record.id === id);
    }
    async delete(id) {
        const records = await this.getAll();
        const filteredRecords = records.filter(record => record.id !== id);
        await this.writeAll(filteredRecords);
    }
    async update(id, attrs) {
        const records = await this.getAll();
        const record = records.find(record => record.id === id);
        if (!record) {
            throw new Error(`Record with id ${id} not found`);
        }
        // record === {email: 'test@test.com}
        // attrs === {password: "password"}
        Object.assign(record, attrs)
        // record == {email: 'test@test.com',password: "password" }
        await this.writeAll(records);
    }
    async getOneBy(filters) {
        const records = await this.getAll();

        for (let record of records) {
            let found = true;
            for (let key in filters) {
                if (filters[key] !== record[key]) {
                    found = false
                }
            }
            if (found) {
                return record;
            }
        }
    }
}