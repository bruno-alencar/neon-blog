//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/promotors';
var url = 'http://192.168.2.251:8080/TradeForce/relatorio';
var urlPromotor = 'http://192.168.2.251:8080/TradeForce/promotor';
var idPromotor;
var rowsPDF = [];
var header ='';
$(document).ready(function ($) {
	loadSelectPromotor();
});
function loadSelectPromotor(){
	ajaxindicatorstart('Aguarde');
	$.getJSON(urlPromotor, function (data) {
		$.each(data, function (i, data) {
			$('#promotor').append(
				$('<option value="" data-support=""></option>')
				.attr('value', data.id)
				.attr('data-support', '["'+data.id+'","'+data.nome+'","'+data.login+'"]')
				.text(data.nome +' - ID: '+ data.id +' - Login: '+ data.login)
			);
		});
		ajaxindicatorstop()
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
		window.location="index.html";
	});
}

function RESTlistar(id) {
	rowsPDF = [];
	ajaxindicatorstart('Aguarde');
	$.getJSON(url+'/'+id, function (data) {
		for (var i = 0; i < data.length; i++) {
			try {
				dataObj  = new Date(data[i].data);
			} catch (e) {
				dataObj = new Date();
			}

			rowsPDF.push({"id" : data[i].idTarefa, "data": dataObj.toLocaleDateString(), "mercados": data[i].quantidadeMercados, "valor" : currencyFormatted(data[i].valorTotal,"R$")});
			var linhaRelatorio =
			'<div class="linha-dados table" id="listTarefa'+data[i].idTarefa+'">'
			+'<div class="td space"></div>'
			+'<div class="td">	'+dataObj.toLocaleDateString()+'				</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].quantidadeMercados+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+currencyFormatted(data[i].valorTotal,"R$")+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].idTarefa+'					</div>'
			+'<div class="td space"></div>'
			+'</div>'
			$(".lista-dados").append(linhaRelatorio);
		}
		ajaxindicatorstop();
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}

function listar() {
	header ='';
	idPromotor = $("#promotor").val();
	if(idPromotor >= 1){
		promotorData = JSON.parse($('#promotor option:selected').attr('data-support'));
		header = promotorData[1] +' - ID: '+promotorData[0];
		RESTlistar(idPromotor);
		zerarGrid();
		$(".export").prop("disabled", false);
	}
	else{
		$.MessageBox({
			message: "Selecione um promotor!"
		});
	}
}
var elementHandler = {
	'#ignoreElement': function (element, renderer) {
		return true;
	},
	'#anotherIdToBeIgnored': function (element, renderer) {
		return true;
	}
};

function exportPDF(){
	var columns = [
		{title: "Tarefa ID", dataKey: "id"},
		{title: "Data Criação", dataKey: "data"},
		{title: "Qtd. Viagem", dataKey: "mercados"},
		{title: "Valor Total", dataKey: "valor"}

	];
	var doc = new jsPDF('p', 'pt');
	doc.autoTable(columns, rowsPDF, {
		margin: {top: 60},
		addPageContent: function(data) {
			doc.text("Relatório Tarefas - " + header, 40, 30);
		}
	});
	doc.save('TradePlaceRelatorio.pdf');
}

function zerarGrid(){
	var newGrid ='<div class="linha-dados table" id="listTarefa">'
	+'<div class="td space"></div>'
	+'<div class="td">	Data				</div>'
	+'<div class="td space"></div>'
	+'<div class="td">					Qtd. Viagem						</div>'
	+'<div class="td space"></div>'
	+'<div class="td">					Valor Total					</div>'
	+'<div class="td space"></div>'
	+'<div class="td">					Tarefa ID					</div>'
	+'<div class="td space"></div>'
	+'</div>';
	$(".lista-dados").html(newGrid);
}


function currencyFormatted(value, str_cifrao) {
	return str_cifrao + ' ' + value.formatMoney(2, ',', '.');
}

Number.prototype.formatMoney = function (c, d, t) {
	var n = this,
	c = isNaN(c = Math.abs(c)) ? 2 : c,
	d = d == undefined ? "." : d,
	t = t == undefined ? "," : t,
	s = n < 0 ? "-" : "",
	i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
	j = (j = i.length) > 3 ? j % 3 : 0;
	return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
};
