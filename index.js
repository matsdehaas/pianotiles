// highscore pagina, verschillende namen

// commentlines bij nieuwe automatische dingen

// automatisch geselecteerd > tijd permanent op infinity

// nieuw uiterlijk





/**************************************************
 * Constanten
 *
 * Hieronder de variabelen die in het gehele
 * spel dezelfde waarden houden
 **************************************************/
// afmetingen van het canvas
var canvasWidth = 300;
var canvasHeight = 533.6;

/**************************************************
 * Globale variablen
 *
 * Dit zijn variabelen die in het
 * gehele spel beschikbaar zijn
 **************************************************/

/* deze variabelen geven aan op welk scherm de gebruiker zit, dus welk scherm gerenderd moet worden
en wat er moet gebeuren als iemand ergens op klikt. Dit word aangegeven door true/false en later
word dit gecheckt in if statements */
var thuisPagina = true
var spelscherm = false
var aanHetSpelen = false
var gameOver = false
var instellingen = false

/* dit zijn de scores, de variabelen 'score' houd bij wat de score van de speler is en later word
met een if statement gecheckt of deze hoger is dan de highscore */
var score = 0
/* er zijn verschillende highscores, dit is omdat er ook 3 verschillende tijdsinstellingen zijn, 15
seconden, 30 seconden en oneindig veel tijd. Deze highscores corresponderen met die tijden, omdat
het natuurlijk niet eerlijk is als de highscore van 15 seconden wordt overschreven door een
highscore van iemand die oneindig veel tijd had.
Ook is er een highscore voor wanneer het spel in automatische modus word gespeeld.*/
var highscore15 = 0
var highscore30 = 0
var highscoreoneindig = 0
var highscoreautomatisch = 0

/* de tijd, hier zijn twee variabelen voor, de variabel 'totaleTijd' is het totale aantal tijd dat
de speler heeft voordat hij gameOver is. Deze variabel veranderd alleen als de tijdsinstellingen
aangepast worden. */
var totaleTijd = 30
/* de variabel 'tijd' is er om bij te houden hoeveel tijd er nog over is. Zodra de spelen begint
met spelen, word er elke seconde 1 van de tijd afgetrokken. Zodra deze tijd op is, is de speler
gameOver */
var tijd = totaleTijd

/* de reden variabel is er om aan de speler te vertellen waarom het spel stopte. Als hij een
verkeerde tile heeft aangeklikt komt er gewoon 'game over' te staan, maar als de tijd op is komt
dat er te staan */
var reden = "GAME OVER"

/* fired is aangemaakt voor de functie die de toets checkt. Als fired=true word de waarde van de
toets niet verwerkt, omdat hij anders de waarde supersnel heel vaak verwerkt als de toets ingedrukt
is. Deze fired waarde word weer false zodra de toets is losgelaten*/
var fired = false

/* de gamemode variabel bepaalt hoe er gespeeld word, als gamemode=0 moet de muis gebruikt worden
om de tiles aan te klikken en als gamemode=1 moeten de toetsen worden gebruikt (1, 2, 3, 4) */
var gamemode = 0

/* de variabel timer zorgt ervoor dat er elke seconde 1 van de tijd af word getrokken. Later in
dit  document word timer gezet naar een setInterval */
var timer;

/* deze variabel keysDown slaat op welke toetsen ingedrukt zijn, zodra de toetsen worden losgelaten word deze variabel geleegd */
var keysDown = {};

/* ikKwamVan is gemaakt voor de terugknop op de instellingenpagina, als je vanaf het spel naar
instellingen gaat word deze variabel naar 'spel' gezet zodat je terug naar het spel gaat als je op
de terugknop klikt, hetzelfde geld voor als je via de thuisPagina naar de instellingen gaat */
var ikKwamVan = "home"

/* deze variabel word later gezet naar de zwarte tile in de derde rij, waar de speler op moet
klikken, als de klik van de speler niet overeen komt met de coordinaten van deze tile klikt hij dus
mis en is hij gameOver */
var klikopdeze;

var automatisch = false
var positie = 0
var factor = 2
var klikY;

/**************************************************
 * Event listeners
 *
 * Een event listener is een stukje programma dat
 * reageert op een gebeurtenis.1
 * Bijvoorbeeld het aanraken van een toets
 **************************************************/

// deze event listener voegt de waarden van de ingedrukte toets toe aan de keysDown variabel
window.addEventListener("keydown", function(event) {
  keysDown[event.keyCode] = true;
});

// deze event listener verwijderd deze waarde zodra deze toets word losgelaten
window.addEventListener("keyup", function(event) {
  delete keysDown[event.keyCode];
  fired = false
});

/**************************************************
 * Extra functies
 *
 * Hier staan extra functies die het spel helpen, zoals het maken van een willekeurig getal of de
 * de tijd starten en stoppen
 **************************************************/

/* deze functie reset het spel, zoals de naam al zegt. De tiles worden opnieuw random veranderd, de
gameOver word gezet naar false, de score naar 0 en als de totaleTijd niet oneindig is word de tijd
veranderd naar de totaleTijd, wat dus of 15 of 30 seconden is. */
function resetSpel() {
  if (!automatisch) {
    zwarteTiles = [
      new Tile(canvasHeight / 4 * 0, spelAchtergrond.color, "eerste"),
      new Tile(canvasHeight / 4 * 1, "black"),
      new Tile(canvasHeight / 4 * 2, "black"),
      new Tile(canvasHeight / 4 * 3, "black"),
    ]
    gameOver = false
    score = 0
  } else {
    automatischeTiles = [
      new Tile(canvasHeight / 4 * 0, spelAchtergrond.color, "eerste"),
      new Tile(canvasHeight / 4 * 1, "black"),
      new Tile(canvasHeight / 4 * 2, "black"),
      new Tile(canvasHeight / 4 * 3, "black"),
      new Tile(canvasHeight / 4 * 4, "black"),
      new Tile(canvasHeight / 4 * 5, "black"),
    ]
    klikopdeze = automatischeTiles[1]
    gameOver = false
    score = 0
  }
  positie = 0
  if (totaleTijd !== "Oneindig") {
    tijd = totaleTijd
    factor = 2
  }
}

/* deze functie vind een random getal tussen twee waarden, dit word gebruikt om de random positie
van een nieuwe tile te vinden */
function randomGetal(van, tot) {
  return Math.floor(Math.random() * tot) + van
}

/* hier word de interval gezet die elke seconde 1 van de tijd aftrekt en hierdoor start de tijd*/
function startTijd() {
  timer = setInterval(function() {
    tijd -= 1 / 100;
  }, 10);
}

/* deze functie stopt deze interval, en daarmee te tijd */
function stopTijd() {
  clearInterval(timer);
}

// zoals de naam al zegt checkt deze functie de klik van de spelen
function checkDeKlik(evt) {
  /* eerst word hier de mouseX en mouseY coordinaten opgeslagen, hierachter staat -201 en -82 omdat
  dit de margins zijn van het canvas in de htmlpagina */
  mouseX = evt.clientX - 201;
  mouseY = evt.clientY - 82;
  klikY = mouseY

  /* vanaf dit punt is het steeds hetzelfde in deze functie: eerst word er gekeken op welke pagina
  we zitten door te checken welke variabel true is, instellingen, thuispagina etc.
  Daarna komt de code die verschillend is per pagina, er word gekeken of de klik overeenkomt met
  een van de buttons. Deze zitten in een array die later word gemaakt. Hij kijkt dus of de klik
  ergens op een butten is, en als dat zo is word en code uitgevoerd die per button verschillend is.
  Bij 'aanhetspelen' is dat natuurlijk door naar de volgende tile of gameover, en bij de
  thuispagina is dat bijvoorbeeld naar het spel of naar de instellingen pagina.
  Bij het spel word natuurlijk ook gekeken of de gamemode gelijk is aan 0, anders moeten de toetsen
  namelijk worden gebruikt.*/
  if (instellingen) {
    if (mouseX >= instellingen1[0].x && mouseX <= instellingen1[0].x + instellingen1[0].width && mouseY >= instellingen1[0].y && mouseY <= instellingen1[0].y + instellingen1[0].height && gamemode !== 0) {
      instellingen1[0].color = "blue"
      instellingen1[1].color = "#cccccc"
      gamemode = 0
    } else if (mouseX >= instellingen1[1].x && mouseX <= instellingen1[1].x + instellingen1[1].width && mouseY >= instellingen1[1].y && mouseY <= instellingen1[1].y + instellingen1[1].height && gamemode !== 1) {
      instellingen1[1].color = "blue"
      instellingen1[0].color = "#cccccc"
      gamemode = 1
    } else if (mouseX >= instellingen1[2].x && mouseX <= instellingen1[2].x + instellingen1[2].width && mouseY >= instellingen1[2].y && mouseY <= instellingen1[2].y + instellingen1[2].height && totaleTijd !== 15) {
      instellingen1[2].color = "blue"
      instellingen1[3].color = "#cccccc"
      instellingen1[4].color = "#cccccc"
      totaleTijd = 15
    } else if (mouseX >= instellingen1[3].x && mouseX <= instellingen1[3].x + instellingen1[3].width && mouseY >= instellingen1[3].y && mouseY <= instellingen1[3].y + instellingen1[3].height && totaleTijd !== 30) {
      instellingen1[3].color = "blue"
      instellingen1[2].color = "#cccccc"
      instellingen1[4].color = "#cccccc"
      totaleTijd = 30
    } else if (mouseX >= instellingen1[4].x && mouseX <= instellingen1[4].x + instellingen1[4].width && mouseY >= instellingen1[4].y && mouseY <= instellingen1[4].y + instellingen1[4].height && totaleTijd !== "Oneindig") {
      instellingen1[4].color = "blue"
      instellingen1[2].color = "#cccccc"
      instellingen1[3].color = "#cccccc"
      totaleTijd = "Oneindig"
    } else if (mouseX >= instellingen1[5].x && mouseX <= instellingen1[5].x + instellingen1[5].width && mouseY >= instellingen1[5].y && mouseY <= instellingen1[5].y + instellingen1[5].height) {
      if (automatisch) {
        automatisch = false
        instellingen1[5].color = "#cccccc"
      } else {
        automatisch = true
        instellingen1[5].color = "blue"
      }
    } else if (mouseX >= instellingen1[6].x && mouseX <= instellingen1[6].x + instellingen1[6].width && mouseY >= instellingen1[6].y && mouseY <= instellingen1[6].y + instellingen1[6].height) {
      if (ikKwamVan == "home") {
        instellingen = false
        thuisPagina = true
      } else if (ikKwamVan == "spel") {
        instellingen = false
        spelscherm = true
        resetSpel()
      }
    }
  } else if (thuisPagina) {
    if (mouseX >= menu1[0].x && mouseX <= menu1[0].x + menu1[0].width && mouseY >= menu1[0].y && mouseY <= menu1[0].y + menu1[0].height) {
      thuisPagina = false
      spelscherm = true
      resetSpel()
    } else if (mouseX >= menu1[1].x && mouseX <= menu1[1].x + menu1[1].width && mouseY >= menu1[1].y && mouseY <= menu1[1].y + menu1[1].height) {
      thuisPagina = false
      instellingen = true
      ikKwamVan = "home"
    } else if (mouseX >= menu1[2].x && mouseX <= menu1[2].x + menu1[2].width && mouseY >= menu1[2].y && mouseY <= menu1[2].y + menu1[2].height) {
      console.log("test3")
    }
  } else if (gameOver) {
    if (mouseX >= gameOver1[1].x && mouseX <= gameOver1[1].x + gameOver1[1].width && mouseY >= gameOver1[1].y && mouseY <= gameOver1[1].y + gameOver1[1].height) {
      gameOver = false
      spelscherm = false
      thuisPagina = true
    } else if (mouseX >= gameOver1[2].x && mouseX <= gameOver1[2].x + gameOver1[2].width && mouseY >= gameOver1[2].y && mouseY <= gameOver1[2].y + gameOver1[2].height) {
      resetSpel()
    } else if (mouseX >= gameOver1[3].x && mouseX <= gameOver1[3].x + gameOver1[3].width && mouseY >= gameOver1[3].y && mouseY <= gameOver1[3].y + gameOver1[3].height) {
      gameOver = false
      spelscherm = false
      instellingen = true
      ikKwamVan = "spel"
    }
  } else if (aanHetSpelen && !automatisch) {
    if (gamemode == 0) {
      if (mouseX >= klikopdeze.x && mouseX <= klikopdeze.x + klikopdeze.width && mouseY >= klikopdeze.y && mouseY <= klikopdeze.y + klikopdeze.height) {
        goeieTile()
      } else {
        verkeerdeTile(mouseX, mouseY)
        reden = "GAME OVER"
      }
    }
  } else if (spelscherm && !aanHetSpelen) {
    /* als het spel nog niet is gestart maar de speler wel al op het spelscherm zit, kan hij niet
    gameover gaan. Er gebeurt dus alleen wat als de speler op de goede tile klikt. Dan word
    aanhetspelen naar true veranderd en kan hij nu wel af gaan als hij mis klikt. */
    if (gamemode == 0) {
      if (mouseX >= klikopdeze.x && mouseX <= klikopdeze.x + klikopdeze.width && mouseY >= klikopdeze.y && mouseY <= klikopdeze.y + klikopdeze.height) {
        goeieTile()
        if (totaleTijd !== "Oneindig" && !automatisch) {
          startTijd()
        }
        aanHetSpelen = true
      }
    }
  } else if (aanHetSpelen && automatisch) {
    if (gamemode == 0) {
      if (mouseX >= klikopdeze.x && mouseX <= klikopdeze.x + klikopdeze.width && mouseY >= klikopdeze.y + positie && mouseY <= klikopdeze.y + positie + klikopdeze.height) {
        goeieTile()
      } else {
        verkeerdeTile(mouseX, mouseY)
        reden = "GAME OVER"
      }
    }
  }
}

/* deze functie, zoals de naam al suggesteerd, checkt de toets die de speler heeft ingedrukt*/
function checkDeToets() {
  /* als de functie nog niet gerunt is terwijl er een toets is ingedrukt en de gamemode gelijk is
  aan 1 (wat betekent dat de toetsen worden gebruikt ipv de muis) en de speler is aanhetspelen en
  niet gameover word de variabel value gezet naar de waarde van de ingedrukte toets. Daarna word er
  gecheckt of er daar een tile zit, als dat zo is krijgt de speler een punt en mag hij verder
  spelen, als dit niet zo is is de speler game over*/
  if (!fired && !gameOver) {
    if (aanHetSpelen) {
      if (!automatisch) {
        for (var key in keysDown) {
          var value = Number(key);

          if (value == 49 && klikopdeze.x == 0 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 50 && klikopdeze.x == 1 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 51 && klikopdeze.x == 2 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 52 && klikopdeze.x == 3 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 49) {
            verkeerdeTile(canvasWidth / 4 * 0, canvasHeight / 4 * 2)
            reden = "GAME OVER"
          } else if (value == 50) {
            verkeerdeTile(canvasWidth / 4 * 1, canvasHeight / 4 * 2)
            reden = "GAME OVER"
          } else if (value == 51) {
            verkeerdeTile(canvasWidth / 4 * 2, canvasHeight / 4 * 2)
            reden = "GAME OVER"
          } else if (value == 52) {
            verkeerdeTile(canvasWidth / 4 * 3, canvasHeight / 4 * 2)
            reden = "GAME OVER"
          }

        }
      } else {
        for (var key in keysDown) {
          var value = Number(key);

          if (value == 49 && klikopdeze.x == 0 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 50 && klikopdeze.x == 1 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 51 && klikopdeze.x == 2 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 52 && klikopdeze.x == 3 * canvasWidth / 4) {
            goeieTile()
            fired = true
          } else if (value == 49) {
            verkeerdeTile(canvasWidth / 4 * 0, klikopdeze.y + canvasHeight / 4)
            reden = "GAME OVER"
          } else if (value == 50) {
            verkeerdeTile(canvasWidth / 4 * 1, klikopdeze.y + canvasHeight / 4)
            reden = "GAME OVER"
          } else if (value == 51) {
            verkeerdeTile(canvasWidth / 4 * 2, klikopdeze.y + canvasHeight / 4)
            reden = "GAME OVER"
          } else if (value == 52) {
            verkeerdeTile(canvasWidth / 4 * 3, klikopdeze.y + canvasHeight / 4)
            reden = "GAME OVER"
          }

        }
      }
    } else if (spelscherm) {
      /* ook hier, net als in de klikfunctie, kan de speler niet af gaan als het spel nog niet is
      begonnen, er word het spel hier dus gestart zodra de speler de goede toets indrukt */
      for (var key in keysDown) {
        var value = Number(key);
        if (value == 49 && klikopdeze.x == 0 * canvasWidth / 4) {
          goeieTile()
          if (totaleTijd !== "Oneindig") {
            startTijd()
          }
          fired = true
        } else if (value == 50 && klikopdeze.x == 1 * canvasWidth / 4) {
          goeieTile()
          if (totaleTijd !== "Oneindig") {
            startTijd()
          }
          fired = true
        } else if (value == 51 && klikopdeze.x == 2 * canvasWidth / 4) {
          goeieTile()
          if (totaleTijd !== "Oneindig") {
            startTijd()
          }
          fired = true
        } else if (value == 52 && klikopdeze.x == 3 * canvasWidth / 4) {
          goeieTile()
          if (totaleTijd !== "Oneindig") {
            startTijd()
          }
          fired = true
        }
      }
    }
  }
}

/* dit is de functie die word gerunt zodra de goede tile ingedurkt is. De array van tiles word dus
aangepast, er gaat er 1 uit en er komt een nieuwe bij. Als de variabel aanhetspelen nog niet true
was word die nu naar true gezet. En natuurlijk gaat de score ook met 1 punt omhoog */
function goeieTile() {
  if (!automatisch) {
    zwarteTiles = zwarteTiles.slice(1, 4);
    zwarteTiles.push(new Tile(canvasHeight / 4 * 0, "black"))
    score += 1
    if (!aanHetSpelen) {
      aanHetSpelen = true
    }
  } else {
    if (!aanHetSpelen) {
      aanHetSpelen = true
    }
    score += 1
    klikopdeze.color = "#e2e2e2"
    klikopdeze = automatischeTiles[4 - (klikopdeze.y / canvasHeight * 4 + 1) + 1]
  }
}

/* dit is dan de functie die word gebruikt wanneer de verkeerde tile is ingedrukt. Eerst wordt
er gekeken waar er is geklikt en dan word een tile genaamt, verlorenrechthoek, verplaatst naar deze
locatie om te laten zien waar de speler heeft misgeklikt. Deze rechthoek is rood.
In deze functie word ook bepaald of de score hoger is dan de highscore, de tijd word gestopt en de variabel gameover word naar true veranderd en de aanhetspelen naar false. */
function verkeerdeTile(x, y) {

  if (x / canvasWidth * 4 < 1) {
    dezex = 0
  } else if (x / canvasWidth * 4 < 2) {
    dezex = 1
  } else if (x / canvasWidth * 4 < 3) {
    dezex = 2
  } else if (x / canvasWidth * 4 < 4) {
    dezex = 3
  } else {
    dezex = null
  }

  if ((y - positie) / canvasHeight * 4 < 0) {
    dezey = -1
  } else if ((y - positie) / canvasHeight * 4 < 1) {
    dezey = 0
  } else if ((y - positie) / canvasHeight * 4 < 2) {
    dezey = 1
  } else if ((y - positie) / canvasHeight * 4 < 3) {
    dezey = 2
  } else if ((y - positie) / canvasHeight * 4 < 4) {
    dezey = 3
  }

  if (dezex !== null && dezey !== null) {
    verlorenrechthoek.x = dezex * canvasWidth / 4
    verlorenrechthoek.y = dezey * canvasHeight / 4
  }

  if (x == null && y == null) {
    verlorenrechthoek.x = canvasWidth
    verlorenrechthoek.y = canvasHeight
  }

  gameOver = true
  if (totaleTijd == 15 && !automatisch) {
    if (score > highscore15) {
      highscore15 = score
    }
  } else if (totaleTijd == 30 && !automatisch) {
    if (score > highscore30) {
      highscore30 = score
    }
  } else if (totaleTijd == "Oneindig" && !automatisch) {
    if (score > highscoreoneindig) {
      highscoreoneindig = score
    }
  } else if (automatisch) {
    if (score > highscoreautomatisch) {
      highscoreautomatisch = score
    }
  }

  if (totaleTijd !== "Oneindig" && !automatisch) {
    stopTijd()
  }

  /* hier wordt even de onclick van de canvas veranderd naar een lege function. Na 0.75 seconden
  word deze weer terugveranderd naar de checkdeklik functie. Dit is omdat je soms, als je snel aan
  het klikken bent in het spel en opeens afgaat, perongeluk op een van de opties van het gameover
  scherm klikt en meteen naar de thuispagina of instellingen gaat. Om dit te voorkomen is er dus
  een timout aangemaakt. */
  canvas.onclick = function() {}
  setTimeout(function() {
    canvas.onclick = checkDeKlik
  }, 750);

  aanHetSpelen = false
}

/* deze functie is heel simpel, het checkt de tijd. Als deze tijd nul is is de speler gameover met
de reden dat de tijd op is */
function checkDeTijd() {
  if (tijd <= 0) {
    verkeerdeTile()
    reden = "TIJD VOORBIJ"
  }
}

/**************************************************
 * Klassen
 *
 * Klassen zijn de bouwstenen van het spel
 * Bijvoorbeeld een achtergrond, poppetjes, blokjes
 * autootjes en wat je maar wilt
 * Hieronder een klasse om de achtergrond te tekenen
 **************************************************/

/* De eerste klasse is voor een rechthoek, deze word gebruikt voor de buttons op de verschillende
schermen, je kan zeggen waar je hem wil hebben met x en y, hoe groot hij moet zijn met width en
height, en welke kleur met color. Met this.render word hij getekent, dus deze moet je oproepen in
de renderfunctie*/
function Rechthoek(x, y, width, height, color) {
  this.x = x;
  this.y = y;
  this.color = color;
  this.width = width
  this.height = height

  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

// deze functie tekent de lijnen die het raster vormen in het spel
function grid() {
  this.render = function() {
    if (!automatisch) {
      ctx.fillStyle = "#333333"
      ctx.fillRect(0, canvasHeight / 4, canvasWidth, 0.5);
      ctx.fillRect(0, canvasHeight / 4 * 2, canvasWidth, 0.6);
      ctx.fillRect(0, canvasHeight / 4 * 3, canvasWidth, 0.45);
    } else {
      ctx.fillStyle = "#333333"
      ctx.fillRect(0, positie, canvasWidth, 0.5);
      ctx.fillRect(0, canvasHeight / 4 + positie, canvasWidth, 0.5);
      ctx.fillRect(0, canvasHeight / 4 * 2 + positie, canvasWidth, 0.6);
      ctx.fillRect(0, canvasHeight / 4 * 3 + positie, canvasWidth, 0.45);
    }

    ctx.fillRect(canvasWidth / 4, 0, 0.5, canvasHeight);
    ctx.fillRect(canvasWidth / 4 * 2, 0, 0.5, canvasHeight);
    ctx.fillRect(canvasWidth / 4 * 3, 0, 0.5, canvasHeight);
  }
}


/* deze functie maakt de tiles die aangeklikt moeten worden in het spel.
Hierbij kan je aangeven welke y de tile heeft, welke kleur, een een extra notitie.
X is random dus dat hoef je niet mee te geven. En de hoogde en breedte zijn altijd hetzelfde.*/
function Tile(y, color, note) {
  this.note = note
  this.position = randomGetal(0, 4);
  this.x = this.position * canvasWidth / 4;
  if (this.note == "eerste") {
    this.x = canvasWidth
  }
  this.y = y;
  this.color = color;
  this.width = canvasWidth / 4;
  this.height = canvasHeight / 4;


  this.update = function() {

  }

  /* Hier wordt de tile gerenderd. Het enige dat hier anders aan is dan een normale rechthoek is dat
  er een cijfer op komt te staan als gamemode=1. Dit is om aan te geven welke toets ingedrukt moet
  worden. */
  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y + positie, this.width, this.height);
    if (gamemode == 1 && this.note !== "eerste" && this.note !== "verloren" && this.y !== canvasHeight / 4 * 3 && this.color !== "#e2e2e2") {
      ctx.fillStyle = "white"
      ctx.textAlign = "center";
      ctx.font = "50px Assistant";
      ctx.fillText((this.position + 1).toString(), this.x + (this.width / 2), this.y + 84 + positie);
    }
  }
}

/* deze class if voor plaatjes, dit word vooral gebruikt voor icoontjes in ons spel */
function Plaatje(src, x, y, w, h) {
  this.x = x
  this.y = y
  this.width = w
  this.height = h
  this.plaatje = new Image();
  this.plaatje.src = src;
  this.render = function() {
    ctx.drawImage(this.plaatje, this.x, this.y, this.width, this.height);
  }
}
/**************************************************
 * Klasse: Achtergrond
 **************************************************/

// Deze klasse is voor de achtergrond en is erg vanzichtzelfsprekened.
function Achtergrond(color) {
  this.x = 0;
  this.y = 0;
  this.color = color;
  this.width = canvasWidth;
  this.height = canvasHeight;


  this.render = function() {
    ctx.fillStyle = this.color;
    ctx.fillRect(this.x, this.y, this.width, this.height);
  }
}

/**************************************************
 * Initialisatie
 *
 * Hier begint dan het eigenlijke programma
 **************************************************/

// Het canvas element aanmaken
var canvas = document.createElement("canvas");

// De canvas variablen vastleggen
canvas.width = canvasWidth;
canvas.height = canvasHeight;
canvas.id = "drawingArea"
canvas.onclick = checkDeKlik;

// De contex van het canvas opvragen zodat we het
// canvas steeds met ctx kunnen aanroepen
var ctx = canvas.getContext('2d');

// En hang nu het canvas maar in de body
window.onload = function() {
  // voeg canvas toe aan de body
  document.body.appendChild(canvas);
  // begin de animatie
  animatie(stap);
};


/**************************************************
 * De objectvariabelen
 *
 * De objectvariabelen gebruiken we door van een
 * klasse een object te maken met het woordje new
 **************************************************/

/*
HET SPEL
*/

// De achtergrond
var spelAchtergrond = new Achtergrond("white");

// De tiles
zwarteTiles = [
  new Tile(canvasHeight / 4 * 0, spelAchtergrond.color, "eerste"),
  new Tile(canvasHeight / 4 * 1, "black"),
  new Tile(canvasHeight / 4 * 2, "black"),
  new Tile(canvasHeight / 4 * 3, "black"),
]

automatischeTiles = [
  new Tile(canvasHeight / 4 * 0, spelAchtergrond.color, "eerste"),
  new Tile(canvasHeight / 4 * 1, "black"),
  new Tile(canvasHeight / 4 * 2, "black"),
  new Tile(canvasHeight / 4 * 3, "black"),
  new Tile(canvasHeight / 4 * 4, "black"),
  new Tile(canvasHeight / 4 * 5, "black"),
]

// De rode rechthoek die aangeeft waar mis is geklikt
var verlorenrechthoek = new Tile(canvasHeight, "red", "verloren")

// Het rooster
var grid = new grid()

/*
HET MENU
*/

// De achtergrond
var menuAchtergrond = new Achtergrond("grey");

// De menuknoppen
menu1 = [
  new Rechthoek(30, 160, 240, 85, "#cccccc"),
  new Rechthoek(30, 280, 240, 85, "#cccccc"),
  new Rechthoek(30, 400, 240, 85, "#cccccc")
]

/*
DE INSTELLINGEN
*/

// De achtergrond
var instellingenAchtergrond = new Achtergrond("grey");

// De instellingenknoppen
instellingen1 = [

  new Rechthoek(30, 160, 120, 60, "blue"),
  new Rechthoek(150, 160, 120, 60, "#cccccc"),

  new Rechthoek(30, 280, 80, 60, "#cccccc"),
  new Rechthoek(110, 280, 80, 60, "blue"),
  new Rechthoek(190, 280, 80, 60, "#cccccc"),

  new Rechthoek(30, 400, 80, 60, "#cccccc"),

  new Rechthoek(30, 30, 60, 60, "#cccccc"),
]

/*
HET GAMEOVERSCHERM
*/
// De gameoverknoppen en achergrond
gameOver1 = [
  new Rechthoek(5, 170, canvas.width - 10, 184, "rgb(250,128,114)"),
  new Rechthoek(20, 292, 75, 48, "rgb(255, 184, 175)"),
  new Rechthoek(111, 292, 75, 48, "rgb(255, 184, 175)"),
  new Rechthoek(197, 292, 75, 48, "rgb(255, 184, 175)")
]

var plaatjes = {
  terug1: new Plaatje('img/terug.png', 40, 303, 35, 26),
  terug2: new Plaatje('img/terug.png', 42, 47, 35, 26),
  reload: new Plaatje('img/reload.png', 133, 301, 31, 31),
  settings: new Plaatje('img/settings.png', 216, 298, 37, 37),
  mouse: new Plaatje('img/mouse.png', 67, 166, 45, 45),
  keyboard: new Plaatje('img/keyboard.png', 187, 167, 42, 42),
  infinity: new Plaatje('img/infinity.png', 206, 295, 60 * 3 / 4, 30)
}

var statusbalk = new Rechthoek(0, 0, canvasWidth * (tijd / totaleTijd), 3, "red")

/**************************************************
 * animatie
 *
 * Tenslotte starten we de animatie en begint
 * alles wat je maar wilt te bewegen
 **************************************************/

// animatieframe starten
var animatie = window.requestAnimationFrame;

// stap functie (herhaalt steeds het animatieproces)
var stap = function() {
  update();
  clearCanvas();
  render();
  animatie(stap);
};

// update functie (ververst de (waarden van de) objecten)
var update = function() {

  if (spelscherm && !automatisch) {
    // Hier worden de kleuren en positie geupdate van de tiles als spelscherm=true
    for (var i = zwarteTiles.length - 1; i >= 0; i--) {
      zwarteTiles[i].update()
      zwarteTiles[i].y = (3 - i) * canvasHeight / 4
      zwarteTiles[i].color = "black"
    }

    statusbalk.width = canvasWidth * (tijd / totaleTijd)
    // klikopdeze word gezet naar de tile in de derde rij van boven
    klikopdeze = zwarteTiles[1]
    // de onderste tile krijgt een andere kleur om te laten zien dat die is ingedrukt
    zwarteTiles[0].color = "#e2e2e2";
    // de toetsen worden gecheckt als gamemode=1
    if (gamemode == 1) {
      checkDeToets()
    }
    // en als de totaletijd niet oneindig is word de tijd gecheckt
    if (totaleTijd !== "Oneindig") {
      checkDeTijd()
    }
  }

  if (spelscherm && automatisch) {
    if (aanHetSpelen) {
      if (positie > (canvasHeight / 4)) {
        positie = 0
        automatischeTiles = automatischeTiles.slice(1, 6)
        automatischeTiles.push(new Tile(-canvasHeight / 4 * 2, "black"))
      }
      positie += factor
      factor += 0.0025
      if (klikopdeze.y + klikopdeze.height + positie >= canvasHeight) {
        verkeerdeTile()
        reden = "TILE GEMIST"
      }
    }
    for (var i = automatischeTiles.length - 1; i >= 0; i--) {
      automatischeTiles[i].update()
      automatischeTiles[i].y = (3 - i) * canvasHeight / 4
    }
    if (gamemode == 1) {
      checkDeToets()
    }
  }
};

// canvas schoonmaken
var clearCanvas = function() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// De renderfunctie tekent het canvas opnieuw
// met daarin de objecten
/* welke dingen worden gerenderd verschilt per pagina natuurlijk, hier word dus ook gecheckt welke
pagina gelijk is aan true, hier word dan alles van gerenderd, zoals tekst, objecten en icoontjes*/
var render = function() {
  if (thuisPagina) {
    menuAchtergrond.render()
    // Op internet las ik ooit ergens dat het sneller ging als je door een array ging achteruit.
    // vandaar dat ik dat nu op deze manier heb gedaan.
    for (var i = menu1.length - 1; i >= 0; i--) {
      menu1[i].render()
    }
    ctx.textAlign = "center";
    ctx.font = "700 35px Assistant";
    ctx.fillStyle = "black"
    ctx.fillText("SPELEN", canvasWidth / 2, 215);
    ctx.font = "700 27px Assistant";
    ctx.fillText("INSTELLINGEN", canvasWidth / 2, 332);
  }

  if (instellingen) {
    instellingenAchtergrond.render()
    for (var i = instellingen1.length - 1; i >= 0; i--) {
      instellingen1[i].render()
    }
    ctx.textAlign = "center";
    ctx.font = "700 30px Assistant";
    ctx.fillStyle = "black"
    ctx.fillText("15s", instellingen1[2].x+(instellingen1[2].width/2), 320);
    ctx.fillText("30s", instellingen1[3].x+(instellingen1[3].width/2), 320);
    ctx.font = "700 33px Assistant";
    ctx.fillText("BEDIENING", canvasWidth / 2, 150);
    ctx.fillText("TIJD", canvasWidth / 2, 270);

    plaatjes["terug2"].render()
    plaatjes["mouse"].render()
    plaatjes["keyboard"].render()
    plaatjes["infinity"].render()

  }

  if (!automatisch) {
    if (spelscherm) {
      spelAchtergrond.render();
      for (var i = zwarteTiles.length - 1; i >= 0; i--) {
        zwarteTiles[i].render()
      }
      grid.render()

      if (totaleTijd !== "Oneindig") {
        statusbalk.render()
      }
      ctx.font = "45px Assistant";
      ctx.textAlign = "center";
      ctx.fillStyle = "red";
      ctx.fillText(score, canvasWidth / 2, 45);

    }

    if (gameOver) {
      verlorenrechthoek.render()
      // hier ging het niet goed om de array achteruit door te gaan, dus is deze vooruit.
      for (var i = 0; i < gameOver1.length; i++) {
        gameOver1[i].render()
      }
      ctx.textAlign = "center";
      ctx.font = "700 45px Assistant";
      ctx.fillStyle = "black"
      ctx.fillText(reden, canvasWidth / 2, gameOver1[0].y + 48);
      ctx.font = "25px Assistant";
      ctx.fillText("SCORE: " + score, canvasWidth / 2, gameOver1[0].y + 78);

      plaatjes["terug1"].render()
      plaatjes["reload"].render()
      plaatjes["settings"].render()

      // hier word er gekeken welke totaletijd er word gebruikt om te de highscore die word laten
      // zien aan te passen
      if (totaleTijd == 30) {
        ctx.textAlign = "center";
        ctx.font = "25px Assistant";
        ctx.fillStyle = "black"
        ctx.fillText("HIGHSCORE: " + highscore30, canvasWidth / 2, gameOver1[0].y + 105);
      } else if (totaleTijd == 15) {
        ctx.textAlign = "center";
        ctx.font = "25px Assistant";
        ctx.fillStyle = "black"
        ctx.fillText("HIGHSCORE: " + highscore15, canvasWidth / 2, gameOver1[0].y + 105);
      } else if (totaleTijd == "Oneindig") {
        ctx.textAlign = "center";
        ctx.font = "25px Assistant";
        ctx.fillStyle = "black"
        ctx.fillText("HIGHSCORE: " + highscoreoneindig, canvasWidth / 2, gameOver1[0].y + 105);
      }
    }
  }

  if (spelscherm && automatisch) {
    spelAchtergrond.render();
    for (var i = automatischeTiles.length - 1; i >= 0; i--) {
      automatischeTiles[i].render()
    }
    grid.render()

    ctx.font = "45px Assistant";
    ctx.textAlign = "center";
    ctx.fillStyle = "red";
    ctx.fillText(score, canvasWidth / 2, 45);

    if (gameOver) {
      verlorenrechthoek.render()
      // hier ging het niet goed om de array achteruit door te gaan, dus is deze vooruit.
      for (var i = 0; i < gameOver1.length; i++) {
        gameOver1[i].render()
      }
      ctx.textAlign = "center";
      ctx.font = "700 45px Assistant";
      ctx.fillStyle = "black"
      ctx.fillText(reden, canvasWidth / 2, gameOver1[0].y + 48);
      ctx.font = "25px Assistant";
      ctx.fillText("SCORE: " + score, canvasWidth / 2, gameOver1[0].y + 78);

      plaatjes["terug1"].render()
      plaatjes["reload"].render()
      plaatjes["settings"].render()

      // hier word er gekeken welke totaletijd er word gebruikt om te de highscore die word laten
      // zien aan te passen
      ctx.textAlign = "center";
      ctx.font = "25px Assistant";
      ctx.fillStyle = "black"
      ctx.fillText("HIGHSCORE: " + highscoreautomatisch, canvasWidth / 2, gameOver1[0].y + 105);
    }
  }
};
