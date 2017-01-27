var url = 'http://192.168.2.251:8080/TradeForce/administrador';
var nome ;
var login ;
var senha ;


function RESTinserir(usuario) {
return $.ajax({
		//async: false,
		global: true,
		type: 'POST',
		url: url,
		data: '{"nome": "' + usuario.nome + '","login": "'+ usuario.login + '","senha": "'+ usuario.senha + '"}',
		contentType: "application/json; charset=UTF-8",
		error: function (jqXHR, textStatus, errorThrown) {
			$.MessageBox({
				customClass: "custom_messagebox",
				message: "Não foi possível enviar sua requisição, o servidor retornou um erro. <br> Tente novamente!"
			});
		}
	});
}

function inserir() {
	usuarioForm = validacaoForm();
	if (usuario == false) { return; }
	//console.log(nome + " - " + razaoSocial + " - " + endereco + " - " + lat + " - " + lng);
	RESTinserir(usuarioForm).done(handleData);
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
					window.location="usuarios.html";
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

function validacaoForm() {
	if ($('#nome').val().length < 5 || $('#login').val().length < 5 || $('#senha').val().length < 5) {
		$.MessageBox({
			customClass: "custom_messagebox",
			message: "Entrada inválida, preencha todos os campos! As campos devem ser preenchidos com mais de 5 caracteres."
		});
		return false;
	}
	usuario = {};
	usuario.nome = $('#nome').val();
	usuario.login = $('#login').val();
	usuario.senha = $('#senha').val();
	return usuario;
}
