const axios = require('axios');

class API {
  constructor() {
    this.axiosCall = axios.create({});
  }

  get(destino, dataIda) {
    let dataArr = dataIda.split('-');
    let dia = dataArr[2];
    let mes = parseInt(dataArr[1]) - 1;
    let ano = dataArr[0];
    const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
      "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
    ];
  
    let dataFormatada = `${monthNames[mes]}+${dia}+${ano}`;
  
    return this.axiosCall.get(`https://apidojo-hipmunk-v1.p.rapidapi.com/flights/create-session?infants_lap=0&children=0&seniors=0&country=US&from0=GRU&to0=${destino}&date0=${dataFormatada}&pax=1&cabin=Coach`, {headers:{'X-RapidAPI-Host': 'apidojo-hipmunk-v1.p.rapidapi.com', 'X-RapidAPI-Key': '567d4ffd8emsha10628ab4435cd8p19dd88jsnd4a727819fcd'}})
    .then(result => {
      let arrVoos = [];
      let {legs, routings, itins, airlines} = result.data;
        
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
      let selectedFlight = arrVoos[0];
      return selectedFlight;
    })
    .catch(err => console.log(err));
  }
}

module.exports = API;

/*
  api.get(`https://apidojo-hipmunk-v1.p.rapidapi.com/flights/create-session?infants_lap=0&children=0&seniors=0&country=US&from0=GRU&to0=SFO&date0=${dataFormatada}&pax=1&cabin=Coach`, {headers:{'X-RapidAPI-Host': 'apidojo-hipmunk-v1.p.rapidapi.com', 'X-RapidAPI-Key': '567d4ffd8emsha10628ab4435cd8p19dd88jsnd4a727819fcd'}})
  .then(result => {
    let arrVoos = [];
    let {legs, routings, itins, airlines} = result.data;

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
    selectedFlight = arrVoos[0];
    console.log(selectedFlight);
    res.redirect('/main');
  })
  .catch(err => console.log(err));

*/