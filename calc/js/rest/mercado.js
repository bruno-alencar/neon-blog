//var url = 'https://private-5b99d-tradeplace.apiary-mock.com/mercados';
var url = 'http://192.168.2.251:8080/TradeForce/mercado';

var nome ;
var razaoSocial ;
var endereco ;
var lat ;
var lng ;
var mostrarMapa = false;


$(document).ready(function ($) {
	mostrarMapa = false;
	if (window.location.href.match("editar-mercado.html")) {
		var id = getUrlVars()["id"];
		if (id == null) {
			window.location="index.html";
		}
		listarPorId(id);
		$(".btnEnviar").attr("onclick","editar("+id+")");
	}
});


function CallbackListarPorID(data) {
	ajaxindicatorstop()
		mercado = data;
	console.log(mercado);
		// mercado.nome = data.nome;
		// mercado.endereco = data.endereco;
		// mercado.razaoSocial = data.razaoSocial;
		// mercado.latitude = data.localizacao.latitude;
		// mercado.longitude = data.localizacao.longitude;
		$('#nome').val(mercado.nome);
		$('#razaoSocial').val(mercado.razaoSocial);
		$('#userEndereco').val(mercado.endereco);
		$('#txtEndereco').val(mercado.endereco);
		$('#txtLatitude').val(mercado.localizacao.latitude);
		$('#txtLongitude').val(mercado.localizacao.longitude);
		setEditPointMap(mercado.localizacao.latitude,mercado.localizacao.longitude);
		clickMostrarMapa();
		//$("#btnEndereco").click();
  return mercado;
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
			var linhaMercado = '<div class="linha-dados table" id="listMercado">'
				+ '<div class="td lista-40">'
				+ data[i].nome
				+ '</div>'
				+ '<div class="td space"></div>'
				+ '<div class="td">'
				+ data[i].endereco
				+ '</div>'
				+ '<div class="td space"></div>'
				+ '<div class="td icons-edit">'
				+ '<a href="editar-mercado.html?id='+ data[i].id +'"><i class="fa fa-pencil" aria-hidden="true"></i></a>'
				+ '<a href="javascript: excluir('+ data[i].id +');"><i class="fa fa-trash" aria-hidden="true"></i></a>'
				+ '</div>'
				+ '</div>';
			$(".lista-dados").append(linhaMercado);
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

function RESTinserir(nome, razaoSocial, endereco, lat, lng) {
	//console.log(nome + ' ' + razaoSocial + ' ' + endereco + ' ' + lat + ' ' + lng);
//	console.log('{"endereco": "' + endereco + '","nome": "'+ nome + '","razaoSocial": "' + razaoSocial + '", "localizacao": {"latitude": ' + lat +  ',"longitude": ' + lng + '}}');
	return $.ajax({
		//async: false,
		global: true,
		type: 'POST',
		url: url,
		data: '{"endereco": "' + endereco + '","nome": "'+ nome + '","razaoSocial": "' + razaoSocial + '", "localizacao": {"latitude": ' + lat +  ',"longitude": ' + lng + '}}',
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

function RESTeditar(id, nome, razaoSocial, endereco, lat, lng) {
	return $.ajax({
		//async: false,
		global: true,
		type: 'PUT',
		url: url+'/'+id,
		data: '{"endereco": "' + endereco + '","nome": "'+ nome + '","razaoSocial": "' + razaoSocial + '", "localizacao": {"latitude": ' + lat +  ',"longitude": ' + lng + '}}',
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
					window.location="mercados.html";
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
		message     : "Você tem certeza que deseja EXCLUIR o mercado de ID " + id+"?"
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
	endereco = $('#txtEndereco').val();
	lat = $('#txtLatitude').val();
	lng = $('#txtLongitude').val();
	RESTeditar(id, nome, razaoSocial, endereco, lat, lng).done(function(data, textStatus, jqXHR) {
		handleData(data, textStatus, jqXHR, 'editar');
	});

}

function inserir() {
	if (validacaoForm() != true) { return; }
	//console.log(nome + " - " + razaoSocial + " - " + endereco + " - " + lat + " - " + lng);
	RESTinserir(nome, razaoSocial, endereco, lat, lng).done(handleData);
}

function clickMostrarMapa() {
	mostrarMapa = true;
}

function validacaoForm() {
	if ($('#nome').val().length < 5 || $('#razaoSocial').val().length < 5 || $('#userEndereco').val().length < 5) {
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
	razaoSocial = $('#razaoSocial').val();
	endereco = $('#txtEndereco').val();
	lat = $('#txtLatitude').val();
	lng = $('#txtLongitude').val();
	return true;
}
