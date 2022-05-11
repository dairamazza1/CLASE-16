// const fs = require('fs');
const { knexMysql } = require('./options/mariaDB');

class Contenedor{
    async createTable(knex){
        await knex.schema.hasTable('productos').then(ifExist =>{
             if(!ifExist){
                 return knex.schema.createTable('productos', table => {
                    table.increments('id').primary();
                    table.string('name');
                    table.float('price');
                    table.string('thumbnail');
                  })
             }
         }).catch((err) => {
            console.log(err);
        });
         
    }

    async save(knex, obj){
        await knex('productos').insert(obj)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }

    async getAll(knex){
        try{
            const view = await knex('productos').select('*')
            console.log(view);
            return view;  
        }
        catch(err){
            console.log(err);
        }
    }
    async getById(knex, id){
        await knex('productos').select('*').where('id',id)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
    async deleteById(knex,id){
        await knex('productos').del('*').where('id',id)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
    async deleteAll(knex){
        await knex('productos').del('*')
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
    async updateByID(knex,id,req){
        const obj = {title: req.title,
                    price: req.price,
                    thumbnail: req.thumbnail,
                    id: id}
        await knex('productos').where('id',id).update(obj)
        .then((result) => {
            console.log(result);
            return result;
        }).catch((err) => {
            console.log(err);
        });
    }
}

const prod = new Contenedor;
prod.createTable(knexMysql)

module.exports = Contenedor;