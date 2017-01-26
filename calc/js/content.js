
		// $(function(){
 	// 		 $("#valor").maskMoney({prefix:'R$ ', thousands:'.'});
		// });

		window.onload = retirarInput("igualmente");

		function getType(){
			var tipoCalc = $("input[name='tipoCalc']:checked").val();

			switch(tipoCalc){
				case "igualmente":
					limparTabela();
					calcIgualgumente();
					break;
				case "progressivo":
					limparTabela();
					calcProgressivo();
					break;
				case "randomico":
					limparTabela();
					calcRandomico();
					break;
			}
		}

		function retirarInput(tipo){

			if(tipo == "progressivo"){
				$("#semanas").prop("disabled",true);
				$("#semanas").val("");
			}else if(tipo == "igualmente"){
				$("#semanas").prop("disabled",false);
				$("#semanas").val("");
			}
		}

		function limparTabela(){
			$("#respostas tr").remove();
		}


		function calcIgualgumente(){
			var valor = $("#valor").val();

			var semanas = $("#semanas").val();

			var resultado = valor / semanas;


			var acumulado = 0;

			for( var i = 1; i <= semanas; i++){

				acumulado += resultado;

				var newRow = $("<tr>");
				var cols =  "";

				cols += "<td>"+i+"</td>"
				cols += "<td>"+resultado.toFixed(2)+"</td>"
				cols += "<td>"+acumulado.toFixed(2)+"</td>"

				newRow.append(cols);
				$("#respostas").append(newRow);
				$("#valorEconomizado").html("R$:"+acumulado.toFixed(2));

				
			}
		}

		function calcProgressivo(){

			var valor = $("#valor").val();
			var semanas = $("#semanas").val();

			var resultado = 0;
			var contador = 1;

			
			do{
				var newRow = $("<tr>");
				var cols =  "";

				resultado += contador;

				cols += "<td>"+contador+"</td>"
				cols += "<td>"+contador+"</td>"
				cols += "<td>"+resultado.toFixed(2)+"</td>"

				newRow.append(cols);
				$("#respostas").append(newRow);
				$("#valorEconomizado").html("R$:"+resultado.toFixed(2));

				contador++;
	
			}while(resultado < valor);

		}

		function calcRandomico(){

			var valor = $("#valor").val();

			var resultado = 0;
			var contador = 1;

			do{
				var calc = Math.random() * 1000;

				resultado += calc;

				var newRow = $("<tr>");
				var cols =  "";

				cols += "<td>"+contador+"</td>"
				cols += "<td>"+calc.toFixed(2)+"</td>"
				cols += "<td>"+resultado.toFixed(2)+"</td>"


				// $("<p/>").text("Semana "+contador+": R$"+ calc).appendTo(".resultado");
				
				newRow.append(cols);
				$("#respostas").append(newRow);
				$("#valorEconomizado").html("R$:"+resultado.toFixed(2));

				contador++;

			}while(resultado < valor);
		}


		function exportar(){
			var nome = $("#paraQue").val();
		}