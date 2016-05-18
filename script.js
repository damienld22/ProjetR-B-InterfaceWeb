var url                 = "ws://192.168.1.114:8080/ControleMaison-RB/server";
var socket              = new WebSocket(url);
var etatChenillard      = false;
var etatConnexion       = false;
var etatKNX             = false;

/*
 *	Fonction  pour définir le websocket à chaque nouvelle instance
 */
function defineWebSocket(){

	/*
	 *	Ouverture de connexion
	 *	Si la connexion est bien ouverte, affichage avec l'afficheur approprié
	 *	L'état de la connexion passe à 'vrai'
	 */
	socket.onopen = function()
	{
		if(socket.readyState == 1){
			document.getElementById("btn_connexion_serveur").className ="btn btn-success";
			document.getElementById("btn_connexion_serveur").innerHTML = "Déconnexion du serveur";
			etatConnexion                                              = true;
		}
	}

	/*
	 *	Fermeture de la connexion
	 *	Affichage de la fermeture avec l'afficheur approprié
	 *	L'état de la connexion passe à 'faux'
	 */
	socket.onclose = function()
	{
		document.getElementById("btn_connexion_serveur").className = "btn btn-warning";
		document.getElementById("btn_connexion_serveur").innerHTML = "Connexion au serveur";
		etatConnexion                                              = false;
	}

	/*
	 *	Gestion de tous les messages reçus par socket
	 *		knx 		   : etat de la connexion avec KNX
	 *		motif 		   : etat du motif
	 *		vitesse 	   : vitesse du chenillard
	 *		lampe	       : "value",  etat de chaque lampe
	 *		etatChenillard : Etat du fonction du chenillard (en route ou non)
	 */
	socket.onmessage = function(event)
	{
		// Split de la chaine de caractère reçue
		var reg  = new RegExp('[,;:]+','g');
		var data = event.data.split(reg);

		// Dans le cas où c'est la chaine d'initialisation, on fait appel à la fonction 'initData()'
		if(data[0] == "alldatas") {
			initData(data);
		}
		else {
			switch(data[0])
			{
				// Changement de l'état de la variable de l'état de la connexion à la maquette et
				// changement du texte du bouton pour activer/désactiver la connexion à la maquette
				case "knx":
					if(data[1] == "true") {
						etatKNX                = true;
						document.getElementById("btn_connexion_knx").className = "btn btn-success";
						document.getElementById("btn_connexion_knx").innerHTML = "Déconnexion de la maquette";
					}
					else {
						etatKNX                = false;
						document.getElementById("btn_connexion_knx").className = "btn btn-warning";
						document.getElementById("btn_connexion_knx").innerHTML = "Connexion à la maquette";
					}
					break;

				// Affichage du type de KNX choisi
				case "motif":
					var el = document.getElementById("motif");
					if(data[1] == "4"){
						el.innerHTML = "Motif : Aléatoire";
					}
					el.innerHTML = "Motif : "+data[1];
					break;

				// Affichage de la vitesse de défilement du chenillard
				case "vitesse":
					var el  = document.getElementById("vitesse");
					var val = 100-(data[1]/50)+10;									// Pourcentage sur une plage de 500 à 5000 ms
					// Mise à jour de la barre de progression
					el.innerHTML = val+"%";
					el.style     = "width:"+val+"%;";
					break;

				// Affichage de l'état de chaque lampe (modification de l'image en conséquence)	
				case "lampe":
					switch(data[1])
					{
						case "1":
							var el = document.getElementById("lampe1");
							if(data[2] == "on") {
								el.src = "images/lampe2.png";
							}
							else {
								el.src = "images/lampe1.png";
							}
							break;

						case "2":
							var el = document.getElementById("lampe2");
							if(data[2] == "on") {
								el.src = "images/lampe2.png";
							}
							else {
								el.src = "images/lampe1.png";
							}
							break;

						case "3":
							var el = document.getElementById("lampe3");
							if(data[2] == "on") {
								el.src = "images/lampe2.png";
							}
							else {
								el.src = "images/lampe1.png";
							}
							break;

						case "4":
							var el = document.getElementById("lampe4");
							if(data[2] == "on") {
								el.src = "images/lampe2.png";
							}
							else {
								el.src = "images/lampe1.png";
							}
							break;
					}

				// Affichage du bon label d'alerte en fonction de l'état d'activation du chenillard
				// et modification de l'état d'activation du chenillard et du texte du le bouton de commande
				case "etatChenillard":
					if(data[1] == "on") {
						document.getElementById("btn_activation_chenillard").className = "btn btn-success";
						document.getElementById("btn_activation_chenillard").innerHTML = "Désactivation du chenillard";
						etatChenillard                                                 = true;
					} else if(data[1] == "off"){
						document.getElementById("btn_activation_chenillard").className = "btn btn-warning";
						document.getElementById("btn_activation_chenillard").innerHTML = "Activation du chenillard";
						etatChenillard                                                 = false;
					}
			}
		}
	}
}

/*
 *	Fonction d'initialisation des datas
 *	A le même principe de fonctionnement que 'onMessage'
 *		knx 		   : etat de la connexion avec KNX
 *		motif 		   : etat du motif
 *		vitesse 	   : vitesse du chenillard
 *		lampe	       : "value",  etat de chaque lampe
 *		etatChenillard : Etat du fonction du chenillard (en route ou non)
 */
function initData(data) {
	for(var i=0; i<data.length; i++){
		switch(data[i])
		{
			// Changement de l'état de la variable de l'état de la connexion à la maquette et
			// changement du texte du bouton pour activer/désactiver la connexion à la maquette
			case "knx":
				if(data[i+1] == "true") {
					etatKNX                = true;
					document.getElementById("btn_connexion_knx").className = "btn btn-success";
					document.getElementById("btn_connexion_knx").innerHTML = "Déconnexion de la maquette";
				}
				else {
					etatKNX                = false;
					document.getElementById("btn_connexion_knx").className = "btn btn-warning";
					document.getElementById("btn_connexion_knx").innerHTML = "Connexion à la maquette";
				}
				break;

			// Affichage du type de KNX choisi
			case "motif":
				var el = document.getElementById("motif");
				if(data[i+1] == "4"){
					el.innerHTML = "Motif : Aléatoire";
				} else {
					el.innerHTML = "Motif : "+data[i+1];
				}
				break;

			// Affichage de la vitesse de défilement du chenillard
			case "vitesse":
				var el       = document.getElementById("vitesse");
				var val      = 100-(data[i+1]/50)+10;							// Pourcentage sur une plage de 500 à 5000 ms
				
				el.innerHTML = val+"%";
				el.style     = "width:"+val+"%;";
				break;

			// Affichage de l'état de chaque lampe (modification de l'image en conséquence)
			case "lampe":
				switch(data[i+1])
				{
					case "1":
						var el = document.getElementById("lampe1");
						if(data[i+2] == "on") {
							el.src = "images/lampe2.png";
						}
						else {
							el.src = "images/lampe1.png";
						}
						break;
					case "2":
						var el = document.getElementById("lampe2");
						if(data[i+2] == "on") {
							el.src = "images/lampe2.png";
						}
						else {
							el.src = "images/lampe1.png";
						}
						break;
					case "3":
						var el = document.getElementById("lampe3");
						if(data[i+2] == "on") {
							el.src = "images/lampe2.png";
						}
						else {
							el.src = "images/lampe1.png";
						}
						break;
					case "4":
						var el = document.getElementById("lampe4");
						if(data[i+2] == "on") {
							el.src = "images/lampe2.png";
						}
						else {
							el.src = "images/lampe1.png";
						}
						break;
				}

			// Affichage du bon label d'alerte en fonction de l'état d'activation du chenillard
			// et modification de l'état d'activation du chenillard et du texte du le bouton de commande
			case "etatChenillard":
				if(data[i+1] == "on") {
					document.getElementById("btn_activation_chenillard").className = "btn btn-success";
					document.getElementById("btn_activation_chenillard").innerHTML = "Désactivation du chenillard";
					etatChenillard                                                 = true;
				} else if(data[i+1] == "off"){
					document.getElementById("btn_activation_chenillard").className = "btn btn-warning";
					document.getElementById("btn_activation_chenillard").innerHTML = "Activation du chenillard";
					etatChenillard                                                 = true;
				}
		}
	}
}


/* 
 *	Fonction pour envoyer le motif
 *		Motif 1,2,3 et 4 pour un motif aléatoire entre les 3 premiers
 */
function sendMotif(choix){
	if(choix == 4){	
		var motif = Math.floor((3)*Math.random()+1);
		socket.send("motif:"+motif);
	}
	else{
		socket.send("motif:"+choix);
	}
}

/* 
 *	Fonction pour augmenter la vitesse
 */
function vitessePlus(){
	socket.send("vitesse:plus");
}	

/* 
 *	Fonction pour augmenter la vitesse
 */
function vitesseMoins(){
	socket.send("vitesse:moins");
}

/*
 *	 Fonction pour activer/désactiver le chenillard
 */
function chenillard() {
	if(etatChenillard){
		socket.send("chenillard:off");
	}
	else if(!etatChenillard){
		socket.send("chenillard:on");
	}
}

/*
 *	Fonction pour activer/désactiver la connexion avec le serveur
 */
function connexion() {
 	if(etatConnexion){
 		socket.close();
 	} 
 	else if (!etatConnexion){
 		socket = new WebSocket(url);
 		// Nouvelle création du socket avec toutes les fonctions nécessaires
 		defineWebSocket();
	}
}


/*
 *	Fonction pour activer/désactiver la connexion à la maquette knx
 */
function connexionKNX() {
 	if(etatKNX){
 		socket.send("knx:deconnect");
 	}
 	else if(!etatKNX){
 		socket.send("knx:connect");
 	}
}

/*
 *	Configuration du premier WebSocket
 */
defineWebSocket();