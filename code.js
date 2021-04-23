//variable part story 
const textElement = document.getElementById('text')
const locationElement = document.getElementById('location')
const optionElement = document.getElementById('option-buttons')
//variable part menu objects
const objectElement = document.getElementById('menu-objects')
var btn = document.querySelector('.button-objects');
var nav = document.querySelector('.nav');
//variable part wallet 
var solde = document.getElementById('solde');
//variable part compass
var north = document.getElementById("north")
north.onclick = selectCompass;
var south = document.getElementById("south");
south.onclick = selectCompass;
var east = document.getElementById("east");
east.onclick = selectCompass;
var west = document.getElementById("west");
west.onclick = selectCompass;
var looper;
var degrees = 0;
var end = 0;
//variable part timer
var timerDiv = document.getElementById("timerNbr")
const startingHours = 2;
const stopGame = 5;
let time = 0;
//variable objects, dialog and end 
var state = {}



//function that initialise the beginning of the game 
function startGame() {
    //initialise var state 
    state = { orange: false, flyer: false, bag: false, pass: false, talk: false, talkEnd: false, talkEnd2: false, soldeWallet: 10, daughter: false, iceCreamSeller: false, timer: true, money: true }
    //timer starting at 2 p.m
    time = startingHours * 3600;
    //hidde the map
    document.getElementById('mapCastle').style.visibility = 'hidden';
    //hidden the ice cream menu 
    document.getElementById('IceCreamSeller').style.display = 'none';
    //display the first text 
    showTextNode(1)
}

//function that displays text and options according to a number in parameter 
function showTextNode(textNodeIndex) {
    //recover a textNode objects 
    const textNode = textNodes.find(textNode => textNode.id === textNodeIndex)
    //display the text following the situation 
    if (state.talk) {
        if (state.talkEnd) {

            if (state.talkEnd2) {
                textElement.innerText = textNode.text + textNode.dialog + textNode.dialogEnd + textNode.dialogEnd2
            } else {
                textElement.innerText = textNode.text + textNode.dialog + textNode.dialogEnd
            }
        }
        else {
            textElement.innerText = textNode.text + textNode.dialog
        }
    }

    else {
        textElement.innerText = textNode.text
        //turn compass to the angle end ,10 is the speed of the compass 
        end = textNode.north
        rotateAnimation("img1", 10);
    }
    //display location
    locationElement.innerText = textNode.location
    //display compass neighbors 
    var neighbors = textNode.neighbors;
    //if we are in the ice cream seller place, display the ice cream menu. Else we hide
    if (textNode.id == 2) {
        document.getElementById('IceCreamSeller').style.display = 'block';
    }
    else {
        document.getElementById('IceCreamSeller').style.display = 'none';
    }
    //display the neighbors name cirlce in the compass
    for (let i in neighbors) {


        if (i == "north") {
            if (neighbors[i] == false) {
                north.style.visibility = 'hidden';
            }
            else {
                north.style.visibility = 'visible';
                north.innerText = neighbors[i];
            }

        } else if (i == "south") {
            if (neighbors[i] == false) {
                south.style.visibility = 'hidden';
            }
            else {
                south.style.visibility = 'visible';
                south.innerText = neighbors[i];
            }

        } else if (i == "east") {
            if (neighbors[i] == false) {
                east.style.visibility = 'hidden';
            }
            else {
                east.style.visibility = 'visible';
                east.innerText = neighbors[i];
            }

        } else if (i == "west") {
            if (neighbors[i] == false) {
                west.style.visibility = 'hidden';
            }
            else {
                west.style.visibility = 'visible';
                west.innerText = neighbors[i];
            }

        }



    }

    //increase time
    time = time + textNode.time
    //remove all options 
    while (optionElement.firstChild) {
        optionElement.removeChild(optionElement.firstChild)
    }
    //remove all objects 
    while (objectElement.firstChild) {
        objectElement.removeChild(objectElement.firstChild)
    }
    //display the options/choices buttons 
    textNode.options.forEach(option => {
        //if the required state is true 
        if (showOption(option)) {
            const button = document.createElement('button')
            button.innerText = option.text
            button.classList.add('btn')
            button.addEventListener('click', () => selectOption(option))
            optionElement.appendChild(button)

        }

    });
    //display objects un the object nav if they are recovered by the user 
    for (let i in state) {

        if (state[i]) {
            if (i == "orange" || i == "flyer" || i == "bag" || i == "pass") {

                let attribut = document.createElement('a')
                let newContent = document.createTextNode(i)
                attribut.appendChild(newContent)
                objectElement.appendChild(attribut)
            }


        }
    }

    // display the solde
    document.getElementById("solde").innerHTML = state.soldeWallet;

    //call function mapLocation to display cursor and polygone in the map 
    mapLocation(textNode.location);


}
//function which controls the elements required to display a button 
function showOption(option) {
    return option.requiredState == null || option.requiredState(state)
}
//function call if a button option/choice is click 
function selectOption(option) {
    //recover the next location 
    let nextTextNodeId = option.nextText
    //end of the game 
    if (nextTextNodeId <= 0) {
        return startGame()
    }
    //edit var state
    state = Object.assign(state, option.setState)
    //display the map on the page 
    if (state.flyer) {
        document.getElementById('mapCastle').style.visibility = 'visible';
    }
    //decrease the solde var 
    if (option.buy) {
        state.soldeWallet -= option.buy;
    }
    //controle if the user has enough money and select the good format in the ice cream menu, 
    if (option.text == 'Buy') {

        var cheekBox = document.getElementsByName("icecream");


        let check = false;
        for (i = 0; i < cheekBox.length; i++) {
            if (cheekBox[i].checked) {
                check = true;
            }
        }
        if (check) {

            if (state.soldeWallet - totalPrice < 0) {
                document.getElementById("erreurSelect").innerHTML = "you don't have enough money";
                nextTextNodeId = 2;
            } else {

                state.soldeWallet -= totalPrice;
            }


        }
        else {
            document.getElementById("erreurSelect").innerHTML = "you need to select an ice cream format";
            nextTextNodeId = 2;
        }
    }
    //call function end 
    if (nextTextNodeId == 14) {

        endGame();
    }
    //start new location 
    showTextNode(nextTextNodeId)
}

//function if the user click on a compass button 
//all diolog is handed at false 
function selectCompass() {

    state.talk = false;
    state.talkEnd = false;
    state.talkEnd2 = false;
    const textNode = textNodes.find(textNode => textNode.location === this.innerHTML)

    showTextNode(textNode.id)
}

//constance which contains all information for a place 
const textNodes = [
    {
        id: 1,
        location: 'Latona fountain',
        neighbors: { north: 'Star Grove', south: 'Queen s Grove', east: 'Ice cream seller', west: 'Flyer' },
        north: 20,
        time: 0,
        text: 'After a morning visit inside the Palace, you and your daughter want to visit the gardens in the afternoon.\nA blazing sun dominates this afternoon.\n\nHowever, you decide to split up to meet again later.\n\nWhile your daughter is going to see a water fountain show at the Apollo s fountain, you choose to buy yourself an ice cream.\n\n',
        dialog: "",
        options: [
            {
                text: 'Go to the ice cream seller',
                setState: { iceCreamSeller: true },
                nextText: 2
            }
        ]
    },
    {
        id: 2,
        location: 'Ice cream seller',
        neighbors: { north: false, south: 'Queen s Grove', east: 'Orangery', west: 'Latona fountain' },
        north: 50,
        time: 500,
        text: '',
        dialog: "",
        options: [
            {
                text: 'Buy',
                setState: { iceCreamSeller: false },
                nextText: 3
            },
            {
                text: 'Do not buy',
                setState: { iceCreamSeller: false },
                nextText: 3
            }
        ]
    },
    {
        id: 3,
        location: 'Orangery',
        neighbors: { north: false, south: false, east: false, west: 'Ice cream seller' },
        north: 340,
        time: 500,
        text: 'Intrigued by trees in the Orangery garden, you approach them.\n\nA castle gardener is in the process of caring for trees.',
        dialog: '\n\n>Talk to him\n\n-Hello, I would like to know what these trees are called ?\n-They are orange trees. Have you never seen an orange tree before ?\n-No, it does not grow orange in Scotland.\n-Um ok, take an orange, it is really good and sweet',
        dialogEnd: '\n\n>Take orange\n\n-Thank you so much, I will eat it later.',
        options: [
            {
                text: 'Talk to him',

                requiredState: (currentState) => (currentState.talk == false),
                setState: { talk: true },
                nextText: 3
            },
            {
                text: 'Do not talk',

                requiredState: (currentState) => (currentState.talk == false),
                nextText: 4
            },
            {
                text: 'Take orange',

                requiredState: (currentState) => (currentState.talk && currentState.talkEnd == false && currentState.orange == false),
                setState: { talkEnd: true, orange: true },

                nextText: 3
            },
            {
                text: 'Do not take',

                requiredState: (currentState) => (currentState.talk && currentState.talkEnd == false && currentState.orange == false),
                setState: { talk: false, talkEnd: false },
                nextText: 4
            },
            {
                text: 'Next',

                requiredState: (currentState) => (currentState.talkEnd),
                setState: { talk: false, talkEnd: false },
                nextText: 4
            }

        ],
    },

    {
        id: 4,
        location: 'Flyer',
        neighbors: { north: false, south: false, east: 'Latona fountain', west: 'Apollo s fountain' },
        north: 30,
        time: 500,
        text: 'On the way to join your daughter, you see a castle flyer on the ground.\n\nThe flyer contains a map with the program of shows.',
        dialog: '',
        options: [
            {
                text: 'Pick up',
                requiredState: (currentState) => (currentState.flyer == false),
                setState: { flyer: true },
                nextText: 5
            },
            {
                text: 'Do not Pick up',
                requiredState: (currentState) => (currentState.flyer == false),
                nextText: 5
            }

        ]
    },



    {
        id: 5,
        location: 'Apollo s fountain',
        neighbors: { north: 'Star Grove', south: false, east: 'Flyer', west: 'Obelisk Grove' },
        north: 68,
        time: 500,
        text: 'Arriving at the Apollo s fountain, your daughter is gone.\nYou can interact with another visitor.',
        dialog: '\n\n>Talk to him\n\n-Hello, the show is over? I am looking for my daughter.\n-Yes,  the show is over. Your daughter probably went to the next show. But I do not have the program. You must look in the castle flyer.\n-Thanks you',
        options: [
            {
                text: 'Talk to him',

                requiredState: (currentState) => (currentState.talk == false),
                setState: { talk: true },
                nextText: 5
            },
            {
                text: 'Follow indication',

                requiredState: (currentState) => (currentState.talk),
                setState: { talk: false, talkEnd: false },
                nextText: 6
            }

        ],
    },


    {
        id: 6,
        location: 'Obelisk Grove',
        neighbors: { north: false, south: 'Apollo s fountain', east: 'Star Grove', west: false },
        north: 337,
        time: 500,
        text: 'You arrived too late at the show.\nHowever, you recognize your daughter s bag.\nInside there is her ID.',
        dialog: '\n\nNext to the bag, there is a photographer.',
        dialogEnd: '\n\n>Talk to him\n\n-Good afternoon, I am looking for my daughter. Have you seen a little girl ?\nMaybe, have you got a photo ?',
        dialogEnd2: '\n\n>Show ID\n\nI recognize her, she went to the Star Grove.',
        options: [
            {
                text: 'Pick up the bag',

                requiredState: (currentState) => (currentState.talk == false && currentState.bag == false),
                setState: { bag: true, talk: true },

                nextText: 6
            },
            {
                text: 'Do not pick up',

                requiredState: (currentState) => (currentState.talk == false && currentState.bag == false),
                setState: { talk: true },
                nextText: 6
            },
            {
                text: 'Talk to him',

                requiredState: (currentState) => (currentState.talk && currentState.talkEnd == false),
                setState: { talkEnd: true },
                nextText: 6
            },
            {
                text: 'Do not talk',

                requiredState: (currentState) => (currentState.talk && currentState.talkEnd == false),
                setState: { talk: false, talkEnd: false, talkEnd2: false },
                nextText: 6
            },
            {
                text: 'Show ID',

                requiredState: (currentState) => (currentState.bag && currentState.talk && currentState.talkEnd && currentState.talkEnd2 == false),

                setState: { talkEnd2: true },
                nextText: 6
            },
            {
                text: 'Go to the Star Grove',

                requiredState: (currentState) => (currentState.talkEnd2),
                setState: { talk: false, talkEnd: false, talkEnd2: false },
                nextText: 7
            }

        ],
    },

    {
        id: 7,
        location: 'Star Grove',
        neighbors: { north: 'Grove of the Three fountains', south: 'Apollo s fountain', east: 'Latona fountain', west: 'Obelisk Grove' },
        north: 10,
        time: 500,
        text: 'You are now in the front of the entrance to the Star Grove.\nYou see a poster where it is written:\n\n< It is a paying grove,\nIt is £10 to visit.\nIt is free for children.\nFor foreigners, discounts at the Queen s Grove.>',
        dialog: '',
        options: [
            {
                text: 'Buy ticket',
                buy: 10,
                requiredState: (currentState) => (currentState.pass == false && currentState.soldeWallet >= 10),
                setState: { pass: true },
                nextText: 9
            },
            {
                text: 'Show your pass',
                requiredState: (currentState) => (currentState.pass),
                nextText: 9
            },
            {
                text: 'Go to the Queen s Grove',
                nextText: 8
            }

        ]
    },

    {
        id: 8,
        location: 'Queen s Grove',
        neighbors: { north: 'Latona fountain', south: false, east: 'Ice cream seller', west: 'Mirror Pool' },
        north: 320,
        time: 500,
        text: 'On the side of the grove, there is a hut that sells passes to visit all the groves.\n\nSeller says, <for foreign visitors pass at $3 for the Star Groves, and the Grove of the Three fountains.>',
        dialog: '',
        options: [
            {
                text: 'Buy pass',
                requiredState: (currentState) => (currentState.soldeWallet >= 3 && currentState.pass == false),
                setState: { pass: true },
                buy: 3,
                nextText: 7
            },
            {
                text: 'Do not buy',
                requiredState: (currentState) => (currentState.soldeWallet >= 3 && currentState.pass == false),
                nextText: 7
            },
            {
                text: 'The game is over',
                requiredState: (currentState) => (currentState.pass == false && currentState.soldeWallet < 3),
                setState: { money: false },
                nextText: 14
            }

        ]
    },

    {
        id: 9,
        location: 'Grove of the Three fountains',
        neighbors: { north: false, south: 'Star Grove', east: false, west: false },
        north: 30,
        time: 500,
        text: 'After you have looked for your daughter in the Star Groves, you found your daughter in the next grove, Grove of the Three fountains.\n\nBut she will be unable to move to reach the exit because she has sunstroke.\n\nTo save her you have to give her some sweet things. ',
        dialog: '\n\n>Give her the orange\n\nYour daughter regained her strength. You can join the exit with her before the gardens close.\nThe exit from the gardens is at the Mirror Pool.',
        options: [
            {
                text: 'Give her the orange',

                requiredState: (currentState) => (currentState.orange && currentState.talk == false),

                setState: { talk: true, daughter: true },

                nextText: 9
            },
            {
                text: 'Go to the Mirror Pool',
                requiredState: (currentState) => (currentState.talk),
                setState: { talk: false },
                nextText: 10
            }


        ]
    },

    {
        id: 10,
        location: 'Mirror Pool',
        neighbors: { north: false, south: false, east: 'Queen s Grove', west: false },
        north: 340,
        time: 500,
        text: 'This is the exit from the gardens.\n\nDo you want to go out ?',
        dialog: '',
        options: [
            {
                text: 'Exit',
                nextText: 14
            }


        ]
    },



    {
        id: 14,
        location: 'end',
        //time: 0,
        neighbors: { north: false, south: false, east: false, west: false },
        north: 0,
        text: 'question 14.\n\n END GAME',
        options: [
            {
                text: 'Restart',
                nextText: -1
            }

        ]
    }

]

//click on the object menu 
btn.onclick = function () {
    nav.classList.toggle('nav_open');

}
//function which refresh the time 
var displaysTimer = function () {
    let hours = Math.floor(time / 3600)
    let minutes = Math.floor(time / 60 % 60)
    let seconds = time % 60;

    //need two number else add a 0 before
    hours = hours < 10 ? '0' + hours : hours;
    minutes = minutes < 10 ? '0' + minutes : minutes;
    seconds = seconds < 10 ? '0' + seconds : seconds;
    //display in Div 
    timerDiv.textContent = hours + " : " + minutes + " : " + seconds + " PM";
    //launch displaysTimer every 500ms, every half secondes
    setTimeout(displaysTimer, 500);
    //exceed the time of the game 
    if (time >= stopGame * 3600) {
        state.timer = false;
        endGame();
    }
    else {
        time++;
    }

}




////////////  COMPASS PART ///// 

//function which move the compass 
function rotateAnimation(el, speed) {
    var elem = document.getElementById(el);

    /*if(navigator.userAgent.match("Chrome")){
        elem.style.WebkitTransform = "rotate("+degrees+"deg)";
    } else if(navigator.userAgent.match("Firefox")){
        elem.style.MozTransform = "rotate("+degrees+"deg)";
    } else if(navigator.userAgent.match("MSIE")){
        elem.style.msTransform = "rotate("+degrees+"deg)";
    } else if(navigator.userAgent.match("Opera")){
        elem.style.OTransform = "rotate("+degrees+"deg)";
    } else {
        
    }
    */
    looper = setTimeout('rotateAnimation(\'' + el + '\',' + speed + ')', speed);

    elem.style.transform = "rotate(" + degrees + "deg)";
    north.style.transform = " rotate(" + degrees + "deg) translateY(-110px) rotate(" + -degrees + "deg)";
    south.style.transform = "rotate(" + (degrees + 180) + "deg) translateY(-110px) rotate(" + (-degrees - 180) + "deg)";
    east.style.transform = " rotate(" + (degrees + 90) + "deg) translateY(-110px) rotate(" + (-degrees - 90) + "deg)";
    west.style.transform = "rotate(" + (degrees - 90) + "deg) translateY(-110px) rotate(" + (-degrees + 90) + "deg)";


    degrees++;

    if (degrees > 359) {
        degrees = 0;

    }
    if (end == degrees) {

        clearInterval(looper)
    }

}


/////////////////  MAP PART ////////

var place = {
    "Latona fountain": { "lat": 48.805811, "lon": 2.116585, "iconPlace": 'drawlable/latona_fountain_icon.png', "show": "prochain spectacle" },
    "Ice cream seller": { "lat": 48.804475, "lon": 2.118645, "iconPlace": 'drawlable/ice_cream_icon.png', "show": "prochain spectacle" },
    "Orangery": { "lat": 48.802241, "lon": 2.118399, "iconPlace": 'drawlable/orangery_icon.png', "show": "prochain spectacle" },
    "Flyer": { "lat": 48.806618, "lon": 2.113625, "iconPlace": 'drawlable/flyer_icon.png', "show": "prochain spectacle" },
    "Apollo s fountain": { "lat": 48.807341, "lon": 2.109730, "iconPlace": 'drawlable/apollo_icon.png', "show": "prochain spectacle" },
    "Obelisk Grove": { "lat": 48.808468, "lon": 2.113951, "iconPlace": 'drawlable/obelisk_icon.png', "show": "prochain spectacle" },
    "Star Grove": { "lat": 48.807932, "lon": 2.116511, "iconPlace": 'drawlable/star_grove_icon.png', "show": "prochain spectacle" },
    "Grove of the Three fountains": { "lat": 48.807051, "lon": 2.120571, "iconPlace": 'drawlable/three_fountain_icon.png', "show": "prochain spectacle" },
    "Queen s Grove": { "lat": 48.803067, "lon": 2.116001, "iconPlace": 'drawlable/queens_grove_icon.png', "show": "prochain spectacle" },
    "Mirror Pool": { "lat": 48.803907, "lon": 2.111355, "iconPlace": 'drawlable/miroir_pool_icon.png', "show": "prochain spectacle" }

};

//initialise map
var mymap = L.map('mapCastle').setView([48.806618, 2.113625], 15);
var markerUser;
var grove;
mymap.setMaxBounds([
    [48.811544, 2.110533],
    [48.808435, 2.122281],
    [48.804224, 2.106327],
    [48.801793, 2.119319]
]);
//load layer
L.tileLayer('https://{s}.tile.openstreetmap.fr/osmfr/{z}/{x}/{y}.png', {
    attribution: 'données © <a href="//osm.org/copyright">OpenStreetMap</a>/ODbL - rendu <a href="//openstreetmap.fr">OSM FRANCE</a>',
    maxZoom: 19,
    minZoom: 15,
}).addTo(mymap);

//inisialise polygon and icon for each place 

//initialise icon user 
var iconUser = L.icon({
    iconUrl: 'drawlable/user.png',
    iconSize: [50, 50],
    iconAnchor: [25, 50],
    popupAnchor: [0, -50]
})
grove = "Latona fountain";
markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
function icone(grove) {
    let icon = L.icon({
        iconUrl: place[grove].iconPlace,
        iconSize: [50, 50],
        iconAnchor: [25, 50],
        popupAnchor: [0, -50]
    })
    return icon
}

//Latona fountain
grove = 'Latona fountain';
var iconElement = icone(grove);
var markerLatona = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerLatona.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);

//Ice cream seller
grove = 'Ice cream seller';
var iconElement = icone(grove);
var markerIce = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerIce.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);

//flyer
grove = 'Flyer';
var iconElement = icone(grove);
var markerFlyer = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerFlyer.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);


///Apolo s fountain 
grove = 'Apollo s fountain';
var iconElement = icone(grove);
var markerApolo = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerApolo.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);

var polygonApolo = L.polygon([
    [48.809022, 2.111584],
    [48.809601, 2.109299],
    [48.806365, 2.107400],
    [48.805701, 2.109910],

    [48.806697, 2.110468],
    [48.806761, 2.110790],
    [48.806881, 2.111090],

    [48.807319, 2.111445],
    [48.807559, 2.111445],
    [48.807319, 2.111445],
    [48.807877, 2.111198],
    [48.807997, 2.110962],


], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);

///Miroir 
grove = 'Mirror Pool';
var iconElement = icone(grove);
var markerMiroir = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerMiroir.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);

var polygonMiroir = L.polygon([

    [48.806365, 2.107400],
    [48.804278, 2.115184],
    [48.802913, 2.114382],
    [48.804258, 2.106158]

], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);


///Queens 
grove = 'Queen s Grove';
var iconElement = icone(grove);
var markerQueens = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerQueens.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);
var polygonQueens = L.polygon([

    [48.804278, 2.115184],

    [48.803579, 2.117670],
    [48.802433, 2.116994],

    [48.802913, 2.114382]
], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);



///Orangery 
grove = 'Orangery';
var iconElement = icone(grove);
var markerOrangery = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerOrangery.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);
var polygonOrangery = L.polygon([



    [48.803579, 2.117670],
    [48.802924, 2.120121],
    [48.801754, 2.119419],
    [48.802433, 2.116994]

], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);

///Obelisk 
grove = 'Obelisk Grove';
var iconElement = icone(grove);
var markerObelisk = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerObelisk.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);
var polygonObelisk = L.polygon([

    [48.809601, 2.109299],
    [48.811315, 2.110326],
    [48.809817, 2.115653],
    [48.808210, 2.114707]



], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);

///Star grove
grove = 'Star Grove';
var iconElement = icone(grove);
var markerStar = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerStar.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);
var polygonStar = L.polygon([

    [48.809817, 2.115653],
    [48.809103, 2.118224],
    [48.807530, 2.117271],

    [48.808210, 2.114707]

], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);

/// Grove of the Three fountains
grove = 'Grove of the Three fountains';
var iconElement = icone(grove);
var markerThree = L.marker([place[grove].lat, place[grove].lon], { icon: iconElement });
markerThree.bindPopup("<b>" + grove + "</b> <br>" + place[grove].show);
var polygonThree = L.polygon([

    [48.809103, 2.118224],
    [48.807829, 2.123167],
    [48.806186, 2.122239],
    [48.807530, 2.117271]

], {
    color: 'grey',
    fillOpacity: 1
}).addTo(mymap);


//function which display on the map 
function mapLocation(location) {
    markerApolo.addTo(mymap);
    markerMiroir.addTo(mymap);
    markerObelisk.addTo(mymap);
    markerOrangery.addTo(mymap);
    markerQueens.addTo(mymap);
    markerStar.addTo(mymap);
    markerThree.addTo(mymap);
    markerFlyer.addTo(mymap);
    markerIce.addTo(mymap);
    markerLatona.addTo(mymap);
    markerUser.remove();
    //display user icon according to the location 
    if (location == "Orangery") {
        grove = "Orangery";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        markerOrangery.remove();
        polygonOrangery.remove();
    } else if (location == "Apollo s fountain") {
        grove = "Apollo s fountain";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonApolo.remove();
        markerApolo.remove();
    } else if (location == "Obelisk Grove") {

        grove = "Obelisk Grove";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonObelisk.remove();
        markerObelisk.remove();

    } else if (location == "Star Grove") {
        grove = "Star Grove";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonStar.remove();
        markerStar.remove();
    } else if (location == "Queen s Grove") {
        grove = "Queen s Grove";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonQueens.remove();
        markerQueens.remove();
    } else if (location == "Grove of the Three fountains") {
        grove = "Grove of the Three fountains";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonThree.remove();
        markerThree.remove();
    } else if (location == "Mirror Pool") {
        grove = "Mirror Pool";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        polygonMiroir.remove();
        markerMiroir.remove();
    }
    else if (location == "Latona fountain") {
        grove = "Latona fountain";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        markerLatona.remove();
    } else if (location == "Flyer") {
        grove = "Flyer";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        markerFlyer.remove();
    } else if (location == "Ice cream seller") {
        grove = "Ice cream seller";
        markerUser = L.marker([place[grove].lat, place[grove].lon], { icon: iconUser }).addTo(mymap);
        markerUser.bindPopup("<b>" + grove + "</b> <br> You are here");
        markerIce.remove();
    }


}


///////// Ice cream seller
var totalPrice = 0;
//function which calculate and display the price 
function updateTotal() {
    var optionPrice = 0;
    var saucePrice = 0;
    var flavorsPrice = 0;
    var extrasPrice = 0;


    function checkIceCream() {
        if (document.getElementById('cone').checked) {
            // document.getElementById('imgshirt').src='flavor3.jpg';
            optionPrice += 1.5;
        }
        if (document.getElementById('cup').checked) {
            //  document.getElementById('imgshirt').src='flavor2.jpg';
            optionPrice += 1;
        }

    }


    function checkFlavors() {
        var cheekBoxFlavors = document.getElementsByName("flavors");

        for (i = 0; i < cheekBoxFlavors.length; i++) {
            if (cheekBoxFlavors[i].checked) {
                flavorsPrice += 1;
            }
        }

    }

    function checkSauce() {

        if (document.getElementById('sauce').value != 'none') {
            saucePrice += 0.5;
        }

    }


    function checkExtras() {
        var cheekBoxExtras = document.getElementsByName("extras");

        for (i = 0; i < cheekBoxExtras.length; i++) {
            if (cheekBoxExtras[i].checked) {
                extrasPrice += 0.25;
            }
        }

    }

    checkIceCream();
    checkFlavors();
    checkSauce();
    checkExtras();

    totalPrice = optionPrice + saucePrice + flavorsPrice + extrasPrice;
    document.getElementById('optionPrice').innerHTML = "£ " + optionPrice;
    document.getElementById('flavorsPrice').innerHTML = "£ " + flavorsPrice;
    document.getElementById('saucePrice').innerHTML = "£ " + saucePrice;
    document.getElementById('extrasPrice').innerHTML = "£ " + extrasPrice;
    document.getElementById('totalPrice').innerHTML = "£ " + totalPrice;


}


//function which send information and call the end.html page 
function endGame() {


    if (state.timer == false) {
        sessionStorage.setItem("gameResult", "GAME OVER");
        sessionStorage.setItem("explication", "You are not out of the gardens before closing !");
    }
    else if (state.daughter == false && state.money == true) {
        sessionStorage.setItem("gameResult", "GAME OVER");
        sessionStorage.setItem("explication", "You left the gardens without your daughter !");
    }
    else if (state.money == false) {
        sessionStorage.setItem("gameResult", "GAME OVER");
        sessionStorage.setItem("explication", "You have no more money to pay for a pass !");
    }
    else {
        sessionStorage.setItem("gameResult", "YOU WIN");
        sessionStorage.setItem("explication", "Congratulations you and your daughter came out of the Royal Grove unscathed !");
    }



    location.href = "end.html";
}



displaysTimer();
startGame()