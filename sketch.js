
let data;  //serve per il csv
let logo;  //serve per png champions

//oggetto che servirà ad abbinare i colori alle nazioni
let coloreNazione = {
  "Italy" : "#2e90e1",
  "England" : "#E44A53",
  "Spain" : "#facf0f",
  "Germany" : "#9f86e5",
  "West Germany" : "#9f86e5",
  "France" : "#164ec6",
  "Netherlands" : "#F08338",
  "Portugal" : "#45A977",
  "Scotland" : "#82bfdd",
  "Romania" : "#fb94ba",
  "Yugoslavia" : "#7d7d7d",
  "Belgium": "#ea73f3",
  "Sweden": "#68d3cf",
  "Greece": "#95a343"
}

async function setup() {
  createCanvas(windowWidth, windowHeight);

  data = await loadTable("assets/UCL_Finals_1955-2023.csv", ",", "header");
  logo = await loadImage("assets/logo_champions.jpg");

  textAlign(CENTER, CENTER);
}


function draw() {
  background("rgba(0, 0, 0, 0.6)");

  let centerX = width / 2 + 150;
  let centerY = height / 2 - 60;

  let radius = 85;
  let angle = 0;

  let campoW = 42;
  let campoH = 26;

  //Serve a conservare i nomi delle squadre da mostrare con l'hover
  let label = "";

  //titolo champions league
  noStroke();
  fill("rgb(255, 255, 253)");
  textAlign(LEFT, TOP);
  textSize(29);
  text("CHAMPIONS LEAGUE", 60, 45);

  //sottotitolo 
  fill("#aab3c8");
  textSize(13);
  text("The finals from 1955 to 2023", 60, 85);

  //legenda
  fill(255);
  textSize(17);
  text("LEGEND", 60, 155);

  const legenda =
    "1 pitch = 1 final\nPitch's left half = winner country\nPitch's right half = loser country\n1 dot = 1 goal";

  textSize(13);
  fill("#c5cbda");
  text(legenda, 60, 195);

  text(
    "If no dots appear in either half of the pitch, the final ended 0-0 and was decided on penalties.",
    60, 290, 245, 80
  );

  fill(255);
  textSize(14);
  text("COUNTRIES", 60, 405);

  // Array contenente i Paesi che vengono richiamati nella legenda
  let paesi = [
    "Spain", "Italy", "England",
    "Germany", "Netherlands",
    "Portugal", "France",
    "Scotland", "Romania",
    "Yugoslavia", "Sweden",
    "Belgium", "Greece"
  ];

  // Pallini colorati con i nomi dei Paesi abbinati 
  for (let i = 0; i < paesi.length; i++) {    //.length restituisce il numero di elementi dell'array

    let x;
    let y;
    
    //mi serve un if else per disporre poi i Paesi lungo due colonne
    if (i < 7) {
      x = 62;
      y = 445 + i * 25; //aumenta di 25px a ogni interazione
    } else {
      x = 193;
      y = 445 + (i - 7) * 25; //bisogna far ripartire la posizione verticale dall'inizio
    }

    noStroke();
    fill(coloreNazione[paesi[i]]); //assegna al cerchietto il colore della nazione corrispondente
    circle(x, y, 10);

    fill("#c5cbda");
    textAlign(LEFT, CENTER);
    textSize(12);
    text(paesi[i], x + 13, y);
  }

  // Istruzione finale per l'interazione
  noStroke();
  fill("#aab3c8");
  textAlign(LEFT, TOP);
  textSize(13);

  text(
    "Hover over the pitches to read the names of the two teams that played the final.",
    60, 660, 245, 70
  );


  //ciclo for permette di esplorare riga per riga il dataset
  for(let i = 0; i < data.getRowCount(); i++){

    //leggo nel CSV i nomi delle nazioni, delle due squadre e il numero di goal
    let paeseVincitore = data.getString(i, "WinnerCountry");
    let paeseSconfitto = data.getString(i, "RunnerCountry");
    let squadraVincitrice = data.getString(i, "Winners");
    let squadraSconfitta = data.getString(i, "Runners-up");
    let golVincitore = data.getNum(i, "WinnerGoals");
    let golSconfitto = data.getNum(i, "RunnerGoals");

    //calcolare la posizione sulla spirale (esempio parole visto a lezione)
    //però non uso un incremento dell'angolo costante, ma lo faccio variare in base al raggio
    radius += 4.5;
    angle += 48 / radius;

    let x = centerX + radius * cos(angle);
    let y = centerY + radius * sin(angle);

    //metà campo sx: squadra vincitrice
    noStroke();
    fill(coloreNazione[paeseVincitore]);
    rect(x - campoW/2, y - campoH/2, campoW / 2, campoH);
    //metà dx: squadra perdente
    fill(coloreNazione[paeseSconfitto]);
    rect(x, y - campoH/2, campoW/2, campoH);

    //linee bianche e cerchio centrale per far capire che è un campo
    noFill();
    stroke(255);
    strokeWeight(1);

    rect(x - campoW/2, y - campoH/2, campoW, campoH);
    line(x, y - campoH/2, x, y + campoH/2);
    circle(x, y, 7);

    //aree di rigore
    rect(x - campoW/2, y - 7, 8, 14);
    rect(x + campoW/2 - 8, y - 7, 8, 14);

    //disegno cerchi per i goal
    noStroke();
    fill(0);

    //gol squadra vincitrice sx
    for(let i = 0; i < golVincitore; i++){
      circle(x - 15 + (i % 2) * 7, y - 8 + floor(i / 2) * 6, 4); //mi serviva disporre i goal lungo due colonne
    }

    //gol squadra perdente dx
    for(let i = 0; i < golSconfitto; i++){
      circle(x + 6 + (i % 2) * 7, y - 8 + floor(i / 2) * 6, 4);
    }

    //primo anno
    if (i == 0){
      fill("rgb(249, 250, 249)");
      noStroke();
      textSize(13);
      text("1955", x, y + campoH/2 - 50); //compare sopra il primo campo
    }

    //ultimo anno
    if(i == data.getRowCount() - 1){
      fill("rgb(249, 250, 249)");
      noStroke();
      textSize(13);
      text("2023", x, y + campoH/2 - 50);
    }

    //controllo se il mouse si trova sul campo (esempio visto a lezione)
    if (
      mouseX >= x - campoW/2 &&
      mouseX <= x + campoW/2 &&
      mouseY >= y - campoH/2 &&
      mouseY <= y + campoH/2
    ) {
      label = squadraVincitrice + " - " + squadraSconfitta;
    }
  }

  
  //il logo lo posiziono al centro del canvas, per fare ciò posso utilizzare
  //imageMode che si basa sullo stesso principio di rectMode
  imageMode(CENTER);
  image(logo, centerX, centerY - 10, 110, 95);

  //mostro nomi delle squadre se il mouse passa sul campo
  if(label != ""){
    noStroke();
    
    fill("#252936");
    rect(mouseX + 15, mouseY + 15, 280, 40);

    fill(255);
    textSize(12);
    textAlign(CENTER, CENTER);
    text(label, mouseX + 155, mouseY + 35);
  }
}