let buttons = document.getElementsByClassName('btnEventoSalvar');
for(let i = 0; i < buttons.length; i += 1) {
  let button = buttons[i];
  button.addEventListener('click', function() {
    let id = button.id.slice(button.id.length-1, button.id.length);
    let hotelLink = document.getElementById(`hotelLink${id}`).getAttribute('value');
    let hotelFoto = document.getElementById(`hotelFoto${id}`).getAttribute('value');
    let hotelNome = document.getElementById(`hotelNome${id}`).getAttribute('value');
    let hotelCidade = document.getElementById(`hotelCidade${id}`).getAttribute('value');
    let hotelPreco = document.getElementById(`hotelPreco${id}`).getAttribute('value');
    let hotelEstrelas = document.getElementById(`hotelEstrelas${id}`).getAttribute('value');
    let hotelRating = document.getElementById(`hotelRating${id}`).getAttribute('value');
    let hotelReviews = document.getElementById(`hotelReviews${id}`).getAttribute('value');
    let itinCusto = document.getElementById(`itinCusto${id}`).getAttribute('value');
    let itinDiaIda = document.getElementById(`itinDiaIda${id}`).getAttribute('value');
    let itinDiaVolta = document.getElementById(`itinDiaVolta${id}`).getAttribute('value');
    let itinOrigem = document.getElementById(`itinOrigem${id}`).getAttribute('value');
    let itinDestino = document.getElementById(`itinDestino${id}`).getAttribute('value');

    let hotel = {
      hotelNome,
      hotelCidade,
      hotelPreco,
      hotelEstrelas,
      hotelRating,
      hotelReviews,
      hotelFoto,
      hotelLink
    };
    let post = {
      itinCusto,
      itinDiaIda,
      itinDiaVolta,
      itinOrigem,
      itinDestino,
      hotel
    }
    
    axios.post('/main/favorite', post)
      .then(() => {})
      .catch(err => console.log(err))

  })
}