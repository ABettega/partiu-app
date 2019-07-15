const mongoose = require('mongoose');
const Schema   = mongoose.Schema;

const userSchema = new Schema({
  username: {type: String, unique: true},
  password: String,
  status: Boolean,
  confirmationCode: {type: String, unique: true},
  email: {type: String, unique: true},
  budget: Number,
  interest: { type: Schema.Types.ObjectId, ref: 'Interesse' },
  roteiros: [{ type: Schema.Types.ObjectId, ref: 'Roteiro' }]
}, {
  timestamps: {
    createdAt: 'created_at',
    updatedAt: 'updated_at'
  }
});

const User = mongoose.model('User', userSchema);
module.exports = User;

/*
let unirest = require('unirest');

unirest.get("https://apidojo-hipmunk-v1.p.rapidapi.com/flights/create-session?infants_lap=0&children=0&seniors=0&country=US&from0=GRU&to0=SFO&date0=Sep+01+2019&pax=1&cabin=Coach")
.header("X-RapidAPI-Host", "apidojo-hipmunk-v1.p.rapidapi.com")
.header("X-RapidAPI-Key", "567d4ffd8emsha10628ab4435cd8p19dd88jsnd4a727819fcd")
.end(function (result) {
  let arrVoos = [];
  let {legs, routings, itins, airlines} = result.body;

  // Eliminar classes àcima de econômica
  for (let leg in legs) {
    if (legs[leg].cabin > 2) {
      delete legs[leg];
    } 
  }

  for (let itin in itins) {
    let invalid = false;
    let voo = {
      price: 0,
      legs: [],
      agony: 0
    };
    voo.price = itins[itin].price;
    let route = itins[itin].routing_idens[0];
    voo.agony = itins[itin].agony;
    for (let i = 0; i < routings[route].leg_idens.length; i+= 1) {
      let leg = routings[route].leg_idens[i];
      if (!legs[leg]){ 
        invalid = true;
      } else {
        invalid = false;
        let legObj = {};
        const airlineCode = legs[leg].operating_num[0];
        const airline = airlines[airlineCode].name;
        legObj.depart = legs[leg].depart_iso;
        legObj.arrive = legs[leg].arrive_iso;
        legObj.from = legs[leg].from_code;
        legObj.to = legs[leg].to_code;
        legObj.airline = airline;
        voo.legs.push(legObj);
      }
    }
    if (!invalid) {
      arrVoos.push(voo);
    }
  }
  arrVoos.sort((a, b) => {
    return a.agony - b.agony;
  })
  console.log(arrVoos[0])
});
*/

/*
Itin é um objeto, possui propriedade unrounded_price, e routing idens (array), que vincula com as routings
Routing é um objeto, possui propriedade leg_idens (array), que vincula com as escalas da viagem
Leg é um objeto, possui propriedade cabin (tipo de banco), from_code e to_code (códigos de aeroporto) e depart_iso e arrive_iso (datas formatadas)
*/
