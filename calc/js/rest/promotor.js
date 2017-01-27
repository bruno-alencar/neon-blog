//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/promotors';
var url = 'http://192.168.2.251:8080/TradeForce/promotor';
var urlEmpresa = 'http://192.168.2.251:8080/TradeForce/empresa';
var nome ;
var razaoSocial ;
var endereco ;
var lat ;
var lng ;
var mostrarMapa = false;



$(document).ready(function ($) {
	mostrarMapa = false;

	loadSelectEmpresa();
	if (window.location.href.match("editar-promotor.html")) {
		var id = getUrlVars()["id"];
		if (id == null) {
			window.location="index.html";
		}
		listarPorId(id);
		$(".btnEnviar").attr("onclick","editar("+id+")");
	}
});
function loadSelectEmpresa(){
	console.log('teste');
	ajaxindicatorstart('Aguarde');
	$.getJSON(urlEmpresa, function (data) {
		$.each(data, function (i, data) {
    $('#empresa').append(
        $('<option value="" data-support=""></option>')
          .attr('value', data.id)
					.attr('data-support', '["'+data.nome+'","'+data.razaoSocial+'",'+data.cnpj+']')
          .text(data.nome +' - Razão Social: '+ data.razaoSocial +' - CNPJ: '+ data.cnpj)
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

function CallbackListarPorID(data) {
	ajaxindicatorstop()
	promotor = data;
	console.log(promotor);
	$('#nome').val(promotor.nome);
	$('#login').val(promotor.login);
	$('#senha').val(promotor.senha);
	$('#idade').val(promotor.idade);
	$('#empresa option[value='+promotor.empresa.id+']').attr('selected','selected');
	$('#userEndereco').val(promotor.endereco);
	$('#txtEndereco').val(promotor.endereco);
	$('#txtLatitude').val(promotor.localizacao.latitude);
	$('#txtLongitude').val(promotor.localizacao.longitude);
	setEditPointMap(promotor.localizacao.latitude,promotor.localizacao.longitude);
	clickMostrarMapa();
	//$("#btnEndereco").click();
	return promotor;
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

			var linhaPromotor =
			'<div class="linha-dados table" id="listPromotor">'
			+'<div class="td lista-40">	'+data[i].nome+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].login+'						</div>'
			+'<div class="td space"></div>'
			+'<div class="td">					'+data[i].empresa.nome+'					</div>'
			+'<div class="td space"></div>'
			+'<div class="td icons-edit">'
			+'<a href="editar-promotor.html?id='+data[i].id+'"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
			+'<a href="javascript: excluir('+data[i].id+')"><i class="fa fa-trash" aria-hidden="true"></i></a>'
			+'</div>'
			+'</div>'
			console.log(linhaPromotor);
			$(".lista-dados").append(linhaPromotor);
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

function RESTinserir(nome,login,senha,idade,endereco,empid, lat, lng) {
	console.log(nome + ' ' + razaoSocial + ' ' + endereco + ' ' + lat + ' ' + lng);

	return $.ajax({
		//async: false,
		global: true,
		type: 'POST',
		url: url,
		data: '{"nome": "' + nome + '","login":"' + login + '","senha": "' + senha + '", "idade": ' + idade + ', "endereco": "' + endereco + '",'+
		'"empresa": {"id": "' + empid + '"},'+
		'"localizacao": {"latitude": "' + lat + '","longitude": "' + lng + '"}}',
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

function RESTeditar(id,nome,login,senha,idade,endereco,empid, lat, lng) {
	//console.log(lat +' - '+ lng);
	console.log('{"nome": "' + nome + '","login":"' + login + '","senha": "' + senha + '", "idade": ' + idade + ', "endereco": "' + endereco + '",'+
	'"empresa": {"id": "' + empid + '"},'+
	'"localizacao": {"latitude": "' + lat + '","longitude": "' + lng + '"}}');
	return $.ajax({
		//async: false,
		global: true,
		type: 'PUT',
		url: url+'/'+id,
		data: '{"nome": "' + nome + '","login":"' + login + '","senha": "' + senha + '", "idade": ' + idade + ', "endereco": "' + endereco + '",'+
		'"empresa": {"id": "' + empid + '"},'+
		'"localizacao": {"latitude": "' + lat + '","longitude": "' + lng + '"}}',
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
				window.location.reload(true);
		});
	}else if (jqXHR.status == 204) {
		if (acao == 'editar') {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Atualizado com sucesso!"
			}).done(function(data, button){
				window.location="promotores.html";
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

function excluir(id) {
	$.MessageBox({
		customClass: "custom_messagebox",
		buttonDone  : "Sim",
		buttonFail  : "Não",
		message     : "Você tem certeza que deseja EXCLUIR o promotor de ID " + id+"?"
	}).done(function(){
		RESTdeletar(id).done(function(data, textStatus, jqXHR) {
			handleData(data, textStatus, jqXHR, 'excluir');
		});
	});
}

function editar(id) {
	if (validacaoForm() != true) { return; }
	nome = $('#nome').val();
	login = $('#login').val();
	senha = $('#senha').val();
	idade = $('#idade').val();
	endereco = $('#txtEndereco').val();
	empid =$('#empresa').val();
	lat = $('#txtLatitude').val();
	lng = $('#txtLongitude').val();

	RESTeditar(id,nome,login,senha,idade,endereco,empid, lat, lng).done(function(data, textStatus, jqXHR) {
		handleData(data, textStatus, jqXHR, 'editar');
	});
}

function inserir() {
	if (validacaoForm() != true) { return; }
	RESTinserir(nome,login,senha,idade,endereco,empid, lat, lng).done(handleData);
}

function clickMostrarMapa() {
	mostrarMapa = true;
}

function validacaoForm() {
	if ($('#nome').val().length < 5 || $('#login').val().length < 5 ||  $('#senha').val().length < 5 ||
	 		$('#idade').val().length < 1 || $('#userEndereco').val().length < 5) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Entrada inválida, preencha todos os campos!"
		});
		return false;
	}

	if (mostrarMapa == false) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Você não validou o endereço com o Google, para isso, clique em <br /> <span>'Mostrar no mapa'</span>"
		});
		return false;
	}
	nome = $('#nome').val();
	login = $('#login').val();
	senha = $('#senha').val();
	idade = $('#idade').val();
	endereco = $('#txtEndereco').val();
	empid =$('#empresa').val();
	lat = $('#txtLatitude').val();
	lng = $('#txtLongitude').val();

		//empresa = JSON.parse($('#empresa option:selected').attr('data-support'));
	// emprazaoSocial = empresa[1];
	// empcnpj  = empresa[2];
	return true;
}
