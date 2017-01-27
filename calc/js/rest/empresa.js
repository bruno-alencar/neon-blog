//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/empresas';
var url = 'http://192.168.2.251:8080/TradeForce/empresa';

var nome ;
var razaoSocial ;
var cnpj;
var empresa = new Object();

$(document).ready(function ($) {
	if (window.location.href.match("editar-empresa.html")) {
		var id = getUrlVars()["id"];
		if (id == null) {
			window.location="index.html";
		}
		listarPorId(id);
		$(".btnEnviar").attr("onclick","editar("+id+")");
	}
});


function CallbackListarPorID(data) {
	ajaxindicatorstop();
	empresa = {};
	empresa.nome = data.nome;
	empresa.razaoSocial = data.razaoSocial;
	empresa.cnpj = data.cnpj;
	$('#nome').val(empresa.nome);
	$('#razaoSocial').val(empresa.razaoSocial);
	$('#cnpj').val(empresa.cnpj);
	return empresa;
}

function RESTlistarPorID(id){
	var result;
	ajaxindicatorstart('Aguarde');
	$.getJSON(url+'/'+id,  CallbackListarPorID)
	.fail(function() {
		ajaxindicatorstop() //fail,always,error
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Ocorreu um erro, tente novamente!"
		});
	});
}

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
		for (var i = 0; i < data.length; i++) {

			var linhaEmpresa =
			'<div class="linha-dados table" id="listEmpresa">'
			+'<div class="td lista-40">	'+data[i].nome+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].razaoSocial+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].cnpj+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td icons-edit">'
			+'<a href="editar-empresa.html?id='+data[i].id+'"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
			+'<a href="javascript: excluir('+data[i].id+')"><i class="fa fa-trash" aria-hidden="true"></i></a>'
			+'</div>'
			+'</div>'
			console.log(linhaEmpresa);
			$(".lista-dados").append(linhaEmpresa);
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

function RESTinserir(nome, razaoSocial, cnpj) {
	//console.log(nome + ' ' + razaoSocial + ' ' + cnpj);
	return $.ajax({
		//async: false,
		global: true,
		type: 'POST',
		url: url,
		data: '{"nome":"' + nome + '","razaoSocial": "' + razaoSocial + '","cnpj": "' + cnpj + '"}}',
		contentType: "application/json; charset=UTF-8",
		error: function (jqXHR, textStatus, errorThrown) {
			/*if(textStatus==="timeout") {
			//do something on timeout
		}
		*/
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Não foi possível enviar sua requisição, o servidor retornou um erro. <br> Tente novamente!"
		});
	}
});
}

function RESTeditar(id, nome, razaoSocial, cnpj) {
	return $.ajax({
		//async: false,
		global: true,
		type: 'PUT',
		url: url+'/'+id,
		data: '{"nome":"' + nome + '","razaoSocial": "' + razaoSocial + '","cnpj": "' + cnpj + '"}}',
		contentType: "application/json; charset=UTF-8",
		error: function (jqXHR, textStatus, errorThrown) {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Não foi possível enviar sua requisição, o servidor retornou um erro. <br> Tente novamente!"
			});
		}
	});
}

function handleData(data, textStatus, jqXHR,acao) {
	//console.log(JSON.stringify(textStatus));
	//console.log(JSON.stringify(data));
	//console.log(JSON.stringify(jqXHR));

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

function listarPorId(id) {
	RESTlistarPorID(id);
}

function listar(){
	RESTEmpresa = RESTlistar();
	console.log(RESTEmpresa);
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

function editar(id) {
	if (validacaoForm() != true) { return; }
	nome = $('#nome').val();
	razaoSocial = $('#razaoSocial').val();
	cnpj = $('#cnpj').val();
	RESTeditar(id, nome, razaoSocial, cnpj).done(function(data, textStatus, jqXHR) {
		handleData(data, textStatus, jqXHR, 'editar');
	});

}

function inserir() {
	if (validacaoForm() != true) { return; }
	//console.log(nome + " - " + razaoSocial + " - " + endereco + " - " + lat + " - " + lng);
	RESTinserir(nome, razaoSocial, cnpj).done(handleData);
}

function validacaoForm() {
	if ($('#nome').val().length < 5 || $('#razaoSocial').val().length < 5 || $('#cnpj').val().length < 5) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Entrada inválida, preencha todos os campos!"
		});
		return false;
	}

	nome = $('#nome').val();
	razaoSocial = $('#razaoSocial').val();
	cnpj = $('#cnpj').val();
	return true;
}
