const { knexSqLite } = require('./options/sqlLite3');

class Mensaje{
    async createTable(knex){
        await knex.schema.hasTable('mensajes').then(ifExist =>{
             if(!ifExist){
                 return knex.schema.createTable('mensajes', table => {
                    table.increments('id').primary();
                    table.string('user');
                    table.string('message');
                  })
             }
         }) .catch((err) => {
            console.log(err);
        });
    }

    async save(knex, obj){
        await knex('mensajes').insert(obj)
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
            return result;
        });
    }

    async getAll(knex){
        try{
            const view = await knex('mensajes').select('*')
            return view;  
        }
        catch(err){
            console.log(err);
        }
    }
    async getById(knex, id){
        await knex('mensajes').select('*').where('id',id)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
            return result;
        });
    }
    async deleteById(id){
        await knex('mensajes').del('*').where('id',id)
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
            return result;
        });
    }
    async deleteAll(){
        await knex('mensajes').del('*')
        .then((result) => {
            console.log(result);
        }).catch((err) => {
            console.log(err);
            return result;
        });
    }
}
const msg = new Mensaje;
msg.createTable(knexSqLite)

module.exports = Mensaje;