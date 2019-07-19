let moedas = document.getElementsByClassName('currencySelector');

function k(i) {
	var v = i.value.replace(/\D/g,'');
	v = (v/100).toFixed(2) + '';
	// v = v.replace(".", ",");
	v = v.replace(/(\d)(\d{3})(\d{3}),/g, "$1.$2.$3,");
	v = v.replace(/(\d)(\d{3}),/g, "$1.$2,");
	i.value = v;
}

for(let i = 0; i < moedas.length; i += 1) {
  let campoMoeda = moedas[i];
  let valor = k(campoMoeda.getAttribute('value'));
  campoMoeda.setAttribute('value', valor);
}

