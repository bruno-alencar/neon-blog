var url = 'http://192.168.2.251:8080/TradeForce/tarefa';


$(document).ready(function ($) {
	RESTlistar();
});


function RESTdeletar(id) {
	return $.ajax({
		global: true,
		type: 'DELETE',
		url: url+'/'+id,
		error: function (jqXHR, textStatus, errorThrown) {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Não foi possível enviar sua requisição, o servidor retornou um erro. <br> Tente novamente!"
			});
		}
	});
}

function RESTlistar() {

	ajaxindicatorstart('Aguarde');
	$.getJSON(url, function (data) {
		console.log(data);
		for (var i = 0; i < data.length; i++) {
			var viagens = '';
			var preco = 0;
			for (var j =0; j < data[i].mercados.length -1; j++) {

				viagens = viagens +  data[i].mercados[j].nome+ ' <br> ';


			}



			for (var j =0; j < data[i].rotas.length; j++) {
				preco = preco +  data[i].rotas[j].preco;
			}

			try {
				dataObj  = new Date(data[i].dataCriacao);
			} catch (e) {
				dataObj = new Date();
			}
			var linhaTarefa =
			'<div class="linha-dados table" id="listTarefa-'+data[i].id+'">'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].promotor.nome+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td ">					'+viagens+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+dataObj.toLocaleDateString()+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+currencyFormatted(preco,"R$")+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+ (data[i].realizada == false ? "Não": "Sim" )+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td icons-edit">'
			+'<a href="javascript: excluir('+data[i].id+')"><i class="fa fa-trash" aria-hidden="true"></i></a>'
			+'</div>'
			+'</div>'
			$(".lista-dados").append(linhaTarefa);
		}
		loadPaginacao();
		ajaxindicatorstop();
	})
	.fail(function() { //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}


function handleData(data, textStatus, jqXHR,acao) {
	if (jqXHR.status == 201) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Cadastrado com sucesso!"
		}).done(function(data, button){
			location.reload(true);
		});
	}else if (jqXHR.status == 204) {
		if (acao == 'editar') {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Atualizado com sucesso!"
			}).done(function(data, button){
				window.location="empresas.html";
			});
		}else	if (acao == 'excluir') {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Excluido com sucesso!"
			}).done(function(data, button){
				location.reload(true);
			});
		}
	}else {
		$.MessageBox({
			message: "Ocorreu um erro, tente novamente!"
		});
	}
}

function excluir(id) {
	$.MessageBox({
		customClass: "custom_messagebox",
		buttonDone  : "Sim",
		buttonFail  : "Não",
		message     : "Você tem certeza que deseja EXCLUIR a empresa de ID " + id+"?"
	}).done(function(){
		RESTdeletar(id).done(function(data, textStatus, jqXHR) {
			handleData(data, textStatus, jqXHR, 'excluir');
		});
	});
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
