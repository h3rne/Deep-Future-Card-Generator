//Deep Future Card Generator

//Environment Variables
var renderCardGo=document.getElementById('renderCardGo');
var message=document.getElementById('message');
var cardForm=document.getElementById('cardForm');
var era=document.getElementById('era');
var titles=document.getElementById('titles');
var techsButtonsForm=document.getElementById('techsButtonsForm');
var canvas=document.getElementById('canvas');
var ctx=canvas.getContext("2d");

//Environment listeners
window.addEventListener('load', onLoad, false);
renderCardGo.addEventListener("click", clickHandler, false);
cardForm.addEventListener('click', newCard, false);
techsButtonsForm.addEventListener('click', techSelect, false);

//Global Variables
var cardSize = "poker";
var cardBorderToggle = "on";
var cardNumber = 1;
var cardSuit = "sun";
var cardType = "blank";
var oldCardType = cardType;
var techSuitName ="";
var techSuitSelectorString = "";

//Graphics Variables
var xOffSet =10;
var yOffSet =10;
var boxSize = 100;
var ppi = 150;
var cardWidth = 2.5*ppi;
var cardHeight = 3.5*ppi;

//data arrays
var suitKeyPairValues = 
["none","sun","moon","heart","skull","hand","boot"];
var imgSrc =
[ "",
  "img/sun61x61px.png",
  "img/moon61x61px.png",
  "img/heart62x63px.png",
  "img/skull73x61px.png",
  "img/hand61x61px.png",
  "img/boot55x61px.png"
];

//[suit,oldSuit,techNumber,techText,selected]
var techsArray = 
[
  ["none","none",1,"",false],
  ["none","none",1,"",false],
  ["none","none",1,"",false]
]
var advancementsArray =  
[
  [
    ["Computation","START","draw 1 card; discard 1 card"],
    ["Engineering","ADVANCE","increase M by 1"],
    ["Communication","EXPAND","increase M by 1"],
    ["Weapons","BATTLE","increase M by 1"],
    ["Industry","POWER","discard 1 card; draw 2 cards"],
    ["Energy","POWER","draw 1 card"]
  ],
  [
    ["Art","START","increase C by 1"],
    ["Leisure","SETTLE","increase C by 2"], 
    ["Philosophy","ADVANCE","increase X by 1"], 
    ["Literature","ADVANCE","increase C by 2"], 
    ["Government","SETTLE ","add adv to world when settling"],  
    ["Society","SETTLE","may settle on a new world"] 
  ],
  [
    ["Infrastructure","START","reduce track by 1; place 1 upkeep cube"],  
    ["Labor","POWER","increase S by 1"], 
    ["Machinery","BATTLE","increase S by 1"], 
    ["Medicine","SETTLE","increase S by 1"], 
    ["Biology","GROW","add 1 extra cube in a different hex"],  
    ["Genetics","GROW","add 2 extra cubes"] 
  ],
  [
    ["History","START","look 1 more card down the deck"], 
    ["Education","GROW","increase X by 1"], 
    ["Ecology","SETTLE","increase X by 1"], 
    ["Astronomy","EXPAND","increase X by 1"], 
    ["Chemistry","ADVANCE","redraw when generating adv"], 
    ["Physics","ADVANCE","choose an extra adv on a tech"] 
  ],
  [
    ["Economy","START","reduce a track by 1; draw 2 cards"],  
    ["Diplomacy","BATTLE","increase C by 2"], 
    ["Agriculture","GROW","increase S by 1"], 
    ["Construction","GROW","increase C by 2"], 
    ["Military","BATTLE","battle between another pair of hexes"], 
    ["Defense","BATTLE","remove a rival cube from the battle"] 
  ],
  [
    ["Exploration","START","reduce a track by 1; move 1 of your cubes"],  
    ["Religion","EXPAND","increase C by 2"], 
    ["Empire","POWER","increase M by 1"], 
    ["Devices","POWER","increase C by 2"], 
    ["Spacecraft","EXPAND","move a cube to another hex"], 
    ["FTL","EXPAND","move an extra hex"]  
  ]
]

var victoryTypes = ["Territory", "Population", "Culture", "Might", "Stability", "Xeno"];

var civilisationVictoryBenefit = {"Territory": "Add 1 cube to an empty adjacent sector", Population: "Add 4 cubes to a sector you control", Culture: "Add 3 to Culture", Might: "Add 2 to Might", Stability: "Add 2 to Stability", Xeno:  "Add 2 to Xeno Relations"}; 

//Initializing code
function onLoad(e) {

message.innerHTML = "Success!";

  renderCard();
  updateRadioButtons();
}

function clickHandler() {
  renderCard();
  updateRadioButtons();
}

function newCard() {
  var cardTypeChanged = false;
  var cardTypeChangedFromBlank = false;

  cardSize=getRadioVal(cardForm,"cardSize");
  cardBorderToggle=getRadioVal(cardForm,"cardBorderToggle");
  cardNumber=getRadioVal(cardForm,"cardNumber");
  cardSuit=getRadioVal(cardForm,"suit");
  cardType=getRadioVal(cardForm,"cardType");

message.innerHTML = "Card: "+proper(cardType)+" "+cardNumber+" of "+proper(cardSuit)+"s";

  //check for the change
  if(cardType!=oldCardType) {cardTypeChanged = true;}
  if(oldCardType=="blank"&&cardType!=oldCardType) {
      cardTypeChangedFromBlank = true;}

  if(cardTypeChanged) {
      //era code
      //era.innerHTML = '<br>'+proper(cardType)+'\'s Creation Era: <input type="number" min="0" id="creationEra">';
      era.innerHTML = '<br>'+proper(cardType)+'\'s Creation Era: <input type="text" id="creationEra" placeholder="creation Era">';

      //titles code
      switch(cardType) {
        case "world":
          titles.innerHTML = '<br>World\'s Sector Number: <input type="text" id="sector" placeholder="Sector">';
          titles.innerHTML += '<br>World\'s Name: <input type="text" id="worldName" placeholder="World Name">';
          newTech();
          break;
        case "tech":
          titles.innerHTML = '<br>Technology\'s Name: <input type="text" id="techName" placeholder="Tech Name (if complete)">';
          newTech();
          break;
        case "civilisation":
          titles.innerHTML = '<br>Homeworld\'s Sector Number: <input type="text" id="sector" placeholder="Sector">';
          titles.innerHTML += '<br>Civilisation\'s Name: <input type="text" id="civName" placeholder="Civilisation Name">';
          newCiv();
          techsButtonsForm.innerHTML = "";
          break;
    }
    if(cardType == "blank") {
      era.innerHTML = "";
      titles.innerHTML = "";
      techsButtonsForm.innerHTML = "";
    }
  }
  oldCardType=cardType;
  updateRadioButtons();

}

function newCiv() {
  titles.innerHTML += '<br>Enter the Homeworld\'s Name: <input type="text" id="homeWorldName" placeholder="Homeworld Name">';
  titles.innerHTML += '<br>Enter the first Completed Tech\'s Name: <input type="text" id="tech1Name" placeholder="Tech1 Name">';
  titles.innerHTML += '<br>Enter the second Completed Tech\'s Name: <input type="text" id="tech2Name" placeholder="Tech2 Name">';
  titles.innerHTML += '<br>Enter the third Completed Tech\'s Name: <input type="text" id="tech3Name" placeholder="Tech3 Name">';
}

function newTech() {

  //techs code
  techsButtonsForm.innerHTML = "";
  techsArray = 
  [
    ["none","none",1,"",false],
    ["none","none",1,"",false],
    ["none","none",1,"",false]
  ]
  for (var i=1; i<=3; i++) {
    techSuitName="tech"+i+"Suit";
    techSuitSelectorString = '<br>Tech'+i+'Suit:<label><input type="radio" name="'+techSuitName+'" value="'+suitKeyPairValues[0]+'">None </label>';
    techsButtonsForm.innerHTML += techSuitSelectorString;
    for (var j=1; j<=6; j++) {
      techSuitSelectorString = '<label><input type="radio" name="'+techSuitName+'" value="'+suitKeyPairValues[j]+'"><img src='+imgSrc[j]+' width="20" height"20" align="bottom"> </label>';
      techsButtonsForm.innerHTML += techSuitSelectorString;
    }

    techsButtonsForm.innerHTML += '<label><input type="checkbox" id="tech'+i+'Selected" value="1">Selected</label><div id="tech'+i+'Number"></div>';
  }
}

function techSelect() {
  var newTechSelected = [false,false,false];
  
  //read the new information in the click, if any
  for (var i=1; i<=3; i++) {
    techsArray[i-1][0] = getRadioVal(techsButtonsForm,'tech'+i+'Suit');
    techsArray[i-1][4] = document.getElementById('tech'+i+'Selected').checked;
    
    //identify if a tech has moved to something else
    if(techsArray[i-1][1] != techsArray[i-1][0]) {
      newTechSelected[i-1]=true;
    }    
  }
  
  
  for (var i=1; i<=3; i++) {   

    //for each change build a dropdown based on the selection
    if(newTechSelected[i-1]&&techsArray[i-1][0] != "none") {
      newTechSelection(i);    
      techsArray[i-1][1] = techsArray[i-1][0];
    }
    
    //if and tech is none - blank the inner HTML
    if(techsArray[i-1][0]=="none") {
      var techNumber = document.getElementById('tech'+i+'Number');
      techNumber.innerHTML = '';
    }
    
    //update "old" tech suit
    techsArray[i-1][1] = techsArray[i-1][0];    
  }
}

function newTechSelection(i) {
  var techNumber = document.getElementById('tech'+i+'Number');
  var techDropDownListString = '<br>Tech'+i+'\'s Creation Era: <input type="text" id="tech'+i+'CreationEra" placeholder="Tech'+i+'\'s Creation Era">';
  var techSuitForDropDown = suitNumber(getRadioVal(techsButtonsForm,'tech'+i+'Suit'))-1;
  techDropDownListString += '<br><select id="tech'+i+'Selection"><option></option>';
  for (var j=1; j<=6; j++) {
    techDropDownListString += '<option value="'+j+'">'+j+'.'+advancementsArray[techSuitForDropDown][j-1]+'</option>';
  }
  techDropDownListString += '</select>';
  techNumber.innerHTML = techDropDownListString;
}

function suitNumber(suit) {
  for (var j=0; j<=6; j++) {
    if(suitKeyPairValues[j]==suit){break;}
  }
  return j;
}

function updateRadioButtons() {
  setRadioVal(cardForm,"cardSize", cardSize);
  setRadioVal(cardForm,"cardBorderToggle", cardBorderToggle);
  setRadioVal(cardForm,"cardNumber", cardNumber);
  setRadioVal(cardForm,"suit", cardSuit);
  setRadioVal(cardForm,"cardType", cardType);

  if(cardType=="world"||cardType=="tech"){
    for (var i=1; i<=3; i++) {
      techSuitName="tech"+i+"Suit";
      for (var j=0; j<=6; j++) {
        if(techsArray[i-1][0]==suitKeyPairValues[j]) {
          setRadioVal(techsButtonsForm,techSuitName,techsArray[i-1][0]);
        }
      }

      //check box code
      if(techsArray[i-1][4]) {
        document.getElementById('tech'+i+'Selected').checked = true;
      } else {
        document.getElementById('tech'+i+'Selected').checked = false;
      }
    }
  }  
}

function setRadioVal(form, name, val) {
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if (val == radios[i].value) { // correct value found?
            radios[i].checked = true; // if so, check it
            break; // and break out of for loop
        }
    }
}

//Boiler plate code from Stack Exchange - thanks guys!
function getRadioVal(form, name) {
    var val;
    // get list of radio buttons with specified name
    var radios = form.elements[name];
    
    // loop through list of radio buttons
    for (var i=0, len=radios.length; i<len; i++) {
        if ( radios[i].checked ) { // radio checked?
            val = radios[i].value; // if so, hold its value in val
            break; // and break out of for loop
        }
    }
    return val; // return value of checked radio or undefined if none checked
}

//Card Rendering Code
function renderCard() {

  switch(cardSize) {
    case "a7":
      cardWidth = 2.9*ppi;
      cardHeight = 4.1*ppi;
      break;
    case "index":
      cardWidth = 3*ppi;
      cardHeight = 4*ppi;
      break;
    default :
      cardWidth = 2.5*ppi;
      cardHeight = 3.5*ppi;
  }

  ctx.clearRect(0, 0, canvas.width, canvas.height);

  if(cardBorderToggle=="on"){
    cardBorder(xOffSet,yOffSet,cardWidth,cardHeight,25,2);
  }
  cardNumberAndSuit(xOffSet,yOffSet,boxSize,2);

  switch(cardType) {
    case "tech":
      techFeatures();
      commonBlockTitle(cardType);
      commonWorldTechFeatures(cardType);
      break;
    case "world":
      worldFeatures();
      commonBlockTitle(cardType);
      commonWorldTechFeatures(cardType);
      break;
    case "civilisation":
      commonBlockTitle(cardType);
      civFeatures();
      break;
  }
}

function civFeatures() {
  /*
  var titleFontSize = 44;
  var x = xOffSet+boxSize/2-titleFontSize/2-5;
  var y = yOffSet+boxSize*3/2+30;
  var bodyFontSize = 20;
  var eraNumber = document.getElementById('creationEra');

  ctx.font=titleFontSize+"px Arial";
  ctx.fillText(eraNumber.value+'. Civilisation',x,y);
  ctx.stroke();
  */

  //Sector and name
  var sector = document.getElementById("sector");
  var civName = document.getElementById("civName");
  var title = sector.value+". "+civName.value;
  var fontSize = 36;

  if(title.length>17) {
    fontSize = fontSize*17/title.length;
  }
  ctx.font=fontSize+"px Arial";
  //ctx.fillText(title,xOffSet+boxSize*2 + (7-title.length),yOffSet+boxSize/2+10);
  ctx.fillText(title,xOffSet+boxSize*1.5 + (7-title.length),yOffSet+boxSize/2+10);
}

function commonBlockTitle(cardType) {
  var titleFontSize = 44;
  var eraNumber = document.getElementById('creationEra');
  var x = xOffSet+boxSize/2-titleFontSize/2-5;
  var y = yOffSet+boxSize*3/2+30;

  ctx.font=titleFontSize+"px Arial";
  ctx.fillText(eraNumber.value+". "+proper(cardType),x,y);
}

function commonWorldTechFeatures(cardType) {
  var titleFontSize = 40;
  var subtitleFontSize = 30;
  var bodyFontSize = 18;
  //var eraNumber = document.getElementById('creationEra');
  var x = xOffSet+boxSize/2-titleFontSize/2-5;
  var y = yOffSet+boxSize*3/2+30;
  var iconSize = 40;
  var radius = iconSize*0.85;
  var weight = 6;
  
  //ctx.font=titleFontSize+"px Arial";
  //ctx.fillText(eraNumber.value+". "+proper(cardType),x,y);
  
  //x = xOffSet+boxSize/2;
  //x = xOffSet;
  y += titleFontSize/2;
  for (var i=1; i<=3; i++) {
    if(techsArray[i-1][0]!="none") {
      //if this tech is defined, draw its icon
      var icon=document.getElementById(techsArray[i-1][0]+"Icon");
      ctx.drawImage(icon,x,y,iconSize,iconSize);

      //Technology type and creation era text
      var techCreationEra = document.getElementById("tech"+i+"CreationEra");
      var techDropdown = document.getElementById("tech"+i+"Selection");

      techsArray[i-1][2]=Number(techDropdown.value.substr(0,1))-1;

      if(techsArray[i-1][2]>=0) {

        ctx.font=subtitleFontSize+"px Arial";
        ctx.fillText(" - "+ advancementsArray[suitNumber(techsArray[i-1][0])-1][techsArray[i-1][2]][0]+"." + techCreationEra.value,x+1.5*radius,y+iconSize);

        //Phase and effect text
        var effectText = advancementsArray[suitNumber(techsArray[i-1][0])-1][techsArray[i-1][2]][2].split(";");
        ctx.font=bodyFontSize+"px Arial";

        if(effectText.length>1){
          ctx.fillText(advancementsArray[suitNumber(techsArray[i-1][0])-1][techsArray[i-1][2]][1]+" - " + effectText[0] + ";",x,y+radius*2.5);
          ctx.fillText(effectText[1],x + boxSize,y + radius*2.5 + bodyFontSize);
        } else {
          ctx.fillText(advancementsArray[suitNumber(techsArray[i-1][0])-1][techsArray[i-1][2]][1]+" - " + effectText[0],x,y+radius*2.5);
        }
      }

      //if this tech was selected, circle the icon
      if(techsArray[i-1][4]){
        ctx.beginPath();
        ctx.arc(x+iconSize/2,y+iconSize/2,radius,0,2*Math.PI);
        ctx.lineWidth=weight;
        ctx.stroke();
      }
    }
    y += boxSize*1.4;
  }
}

function proper(improper) {
  var lowercaseLetters="";
  var firstLetter="";

  firstLetter=improper.substr(0,1);

  lowercaseLetters=improper.substr(1,improper.length-1);
  return firstLetter.toUpperCase()+lowercaseLetters.toLowerCase();
}

function techFeatures() {
  //name
  var techName = document.getElementById("techName");
  var title = techName.value;
  var fontSize = 32;

  if(title.length>15) {
    fontSize = fontsize*15/title.length;
  }
  ctx.font=fontSize+"px Arial";
  ctx.fillText(title,xOffSet+boxSize*1.5 + (7-title.length),yOffSet+boxSize/2+10);
}

function worldFeatures() {
  //World arc
  //var fudgeFactor = 4;//Trying to do away with these!
  var radius = cardWidth*0.8;
  var arcStart = 0.5*Math.PI;
  var arcEnd = 0.83*Math.PI;
  var x=cardWidth+xOffSet;
  var y=yOffSet-radius*Math.cos(arcEnd-arcStart);
  ctx.beginPath();
  ctx.arc(x,y,radius,arcStart,arcEnd);
  ctx.stroke();

  //Sector and name
  var sector = document.getElementById("sector");
  var worldName = document.getElementById("worldName");
  var title = sector.value+". "+worldName.value;
  var fontSize = 32;

  if(title.length>17) {
    fontSize = 32*17/title.length;
  }
  ctx.font=fontSize+"px Arial";
  ctx.fillText(title,xOffSet+boxSize*2 + (7-title.length),yOffSet+boxSize/2+10);
}

function cardNumberAndSuit(xOffSet,yOffSet,boxSize,weight) {
  ctx.beginPath();
  ctx.moveTo(xOffSet+boxSize,yOffSet);
  ctx.lineTo(xOffSet+boxSize,yOffSet+boxSize);
  ctx.lineTo(xOffSet,yOffSet+boxSize);
  ctx.lineWidth=weight;
  ctx.stroke();

//message.innerHTML = "Card: "+cardNumber+" of "+cardSuit+"s";

  var fontSize = 48;
  ctx.font=fontSize+"px Arial";
  ctx.fillText(cardNumber,xOffSet+boxSize/2-fontSize/2-10,yOffSet+boxSize/2+10);

  var icon=document.getElementById(cardSuit+"Icon");
  ctx.drawImage(icon,xOffSet+boxSize/2-5,yOffSet+boxSize/2-fontSize/2-4,40,40);
}

function cardBorder(xOffSet, yOffSet, width, height, radius, weight) {
  
  ctx.beginPath();
  ctx.moveTo(xOffSet+radius,yOffSet);
  ctx.lineTo(xOffSet+width-radius,yOffSet);
  ctx.arcTo(xOffSet+width,yOffSet,xOffSet+width,yOffSet+radius,radius);
  ctx.lineTo(xOffSet+width,yOffSet+height-radius);
  ctx.arcTo(xOffSet+width,yOffSet+height,xOffSet+width-radius,yOffSet+height,radius);
  ctx.lineTo(xOffSet+radius,yOffSet+height);
  ctx.arcTo(xOffSet,yOffSet+height,xOffSet,yOffSet+height-radius,radius);
  ctx.lineTo(xOffSet,yOffSet+radius);
  ctx.arcTo(xOffSet,yOffSet,xOffSet+radius,yOffSet,radius);
  ctx.lineWidth=weight;
  ctx.stroke();
}