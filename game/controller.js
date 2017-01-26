var app = angular.module('fiqueAzul', []);


app.controller('PerguntasController', function ($scope, $rootScope) {
    $scope.dados = {};
    $scope.dados.primeira = 'azul';
    $scope.dados.segunda = 'azul';
    $scope.dados.terceira = 'azul';
    $scope.dados.quarta = false;
    $scope.dados.quinta = false;
    $scope.dados.sexta = false;
    $scope.dados.setima = false;
    $scope.dados.oitava = false;
    $scope.dados.nona = false;
    $scope.dados.decima = false;
    $scope.dados.decimaPrimeira = false;

    $scope.teste = '';
    console.log($scope.teste);


 //    function getRandomArbitrary(min, max) {
	//     var rico = Math.random() * (max - min) + min;
	//     console.log(rico);
	//     var teste = Math.trunc(rico);
	//     console.log(teste);
	// 	return teste;
	// }


    $.get("https://ipinfo.io", function(response) {
			console.log(response);
    		$("#ip").val(response.ip);
    		$("#data").val(new Date().toLocaleString());

		}, "jsonp");

		function salvar(){
			var nome = $("#nome").val();
			var email = $("#email").val();
			var data = $("#data").val();
			var ip = $("#ip").val();

			$.post("https://sheetsu.com/apis/v1.0/3369238049e8",{
				Nome: nome,
				Email: email,
				Data: data,
				Ip: ip
			});

			alert("Cálculo feito! Aperte ver resultado.");

		}

    $scope.submeter = function () {
        $scope.resultado = [];
        if ($scope.dados.primeira == 'azul' && $scope.dados.terceira == 'azul' && !$scope.dados.quinta && !$scope.dados.oitava && $scope.dados.nona) {
            console.log("primeira resposta");
            $scope.teste = 1;
            console.log($scope.teste);
            salvar();
            return;
        }
        if ($scope.dados.primeira == 'azul' && $scope.dados.quarta && $scope.dados.quinta && $scope.dados.setima && !$scope.dados.oitava && !$scope.dados.decima) {
            console.log("segunda resposta");
            $scope.teste = 2;
            salvar();
            return;
        }
        if ($scope.dados.primeira == 'azul' && $scope.dados.quarta && $scope.dados.quinta && !$scope.dados.setima && $scope.dados.oitava && !$scope.dados.decimaPrimeira) {
            console.log("terceira resposta");
            $scope.teste = 3;
            salvar();
            return;
            
        }


        if ($scope.dados.primeira == 'vermelho' && $scope.dados.setima && !$scope.dados.oitava && $scope.dados.decima) {
            console.log("quarta resposta");
            $scope.teste = 4;
            salvar();
            return;
            
        }
        if ($scope.dados.primeira == 'vermelho' && $scope.dados.segunda == 'amarelo' && $scope.dados.terceira == 'amarelo' && !$scope.dados.nona && !$scope.dados.decima) {
            console.log("quinta resposta");
            $scope.teste = 5;
            salvar();
            return;
            
        }


        if ($scope.dados.primeira == 'cinza' && $scope.dados.segunda == 'cinza' && $scope.dados.sexta && $scope.dados.setima && $scope.dados.nona && $scope.dados.decimaPrimeira) {
            console.log("sexta resposta");
            $scope.teste = 6;
            salvar();
            return;
            
        }
        if ($scope.dados.primeira == 'cinza' && $scope.dados.segunda == 'amarelo' && $scope.dados.terceira == 'vermelho' && !$scope.dados.quarta && $scope.dados.nona) {
            console.log("setima resposta");
            $scope.teste = 7;
            salvar();
            return;
        }


        if ($scope.dados.primeira == 'amarelo' && $scope.dados.quinta && !$scope.dados.sexta && !$scope.dados.setima && !$scope.dados.decima) {
            console.log("oitava resposta");
            $scope.teste = 8;
            salvar();
            return;
            
        }
        if ($scope.dados.primeira == 'amarelo' && !$scope.dados.quarta && $scope.dados.quinta && $scope.dados.setima && !$scope.dados.oitava) {
            console.log("nona resposta");
            $scope.teste = 9;
            salvar();
            return;
            
        }
        else {

		    var rico = Math.random() * (4 - 1) + 1;
		    console.log(rico);
		    var random = Math.trunc(rico);
		    console.log(random);
            if (random == 1 || random == 2) {
            	var num = Math.random() * (11 - 1) + 1;
		    	console.log(num);
		    	var ano = Math.trunc(num);
		    	console.log(ano);
		    	$scope.teste = 'RICO-' + ano;
		    	console.log($scope.teste);
            }
            if (random == 3) {
            	var num = Math.random() * (11 - 1) + 1;
		    	console.log(num);
		    	var ano = Math.trunc(num);
		    	console.log(ano);
		    	$scope.teste = 'POBRE-' + ano;
		    	console.log($scope.teste);
		    }
        }
    	salvar();
    };
});

