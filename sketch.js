var Werte = []; //Globale Variable für Zahlen
var FarbStatus = []; //Status des Balkens um die Farbe festzulegen
var sliderN = document.getElementById("numberOfElementsSlider");		
console.log(sliderN);
var w =  152 - sliderN.value; 



function setup() { //P5.js Funktion, die ausgeführt wird, wenn das Program startet
	createCanvas(windowWidth/1.2, windowHeight/1.2); //createCanvas(width, height);
	Werte = new Array(floor(width/w)); //Array mit so vielen Elementen, wie errechnet

	for(let i = 0; i < Werte.length; i++) { //Array wird mit zufälligen Zahlen gefüllt
		Werte[i] = float(random(height)); 
		FarbStatus[i] = -1; 				//alle weiß
	} 
} 

function draw() {  // Draw() ist eine zu P5.js gehörende Funktion, die nach  setUp() im loop läuft
	background(51); 
	
	for(let i = 0; i < Werte.length; i++) { 
		stroke(0); 
		strokeWeight(1);
		fill("#FFFFFF"); 
		
		if(FarbStatus[i] == 0) { 
			fill("#81F781"); 		//fertig zugeordnet, grün
		} 
		else if (FarbStatus[i] == 1) { 
			fill("#F7819F"); 		//grade sortiert, rosa
		} 
		else if (FarbStatus[i] == 2) { 
			fill("#F7BE81"); 		//grade sortiert, orange
		} 

		
		rect(i*w, height - Werte[i], w, Werte[i]);  //"zeichnen der Rechtecke"
	} 
} 

sliderN.oninput = async function() {
	w = 152 - this.value;
	await setup();
}


async function bubbleSort(arr, Anfang, Ende) { //Bubblesort algorithmus
	if(Anfang >= Ende) { 
		return; 
	} 
	
	for(var i = 0; i < Ende-1; i++) { 
		for(var h = 0; h < Ende-i-1; h++) { 
			if(arr[h] >= arr[h+1]) { 
				FarbStatus[h] = 1; 			//rot, (wird getauscht)
				await wartezeit();
				Tauschen(arr, h, h+1); 
				FarbStatus[h+1] = 0; 		//grün (Fertig sortiert)
			} 
			FarbStatus[h] = -1;
			FarbStatus[h+1] = 0; 
		} 
	} 
	FarbStatus[Anfang] = 0;
	return arr; 
} 


async function SelectionSort(arr, Anfang, Ende){ 
	if(Anfang >= Ende) { 
		return; 
	} 
	
	for(var i=0; i < Ende; i++){
		let indexMinimum = i;
		FarbStatus[i] = 1;
		for(var j = i; j<Ende; j++){
			FarbStatus[j] = 1;
			await wartezeit();
			if (arr[j] < arr[indexMinimum]){
				FarbStatus[indexMinimum] = -1;
				indexMinimum = j;
				FarbStatus[j] = 1;
			}
			else {
				FarbStatus[j] = -1;	
			} 
		}
		FarbStatus[indexMinimum] = -1;
		Tauschen(arr, i, indexMinimum);
		FarbStatus[i] = 0;
	}
	return arr;
}

async function InsertionSort(arr, Anfang, Ende) { 
	if(Anfang >= Ende) { 
		return; 
	} 
	
	for (var i = 1; i < Ende; i++){
		let einzusortieren = arr[i];
		let j = i;
		
		while ((j > 0) && (arr[j-1] > einzusortieren)){
			FarbStatus[j] = 1;
			FarbStatus[j-1] = 1;
			FarbStatus[i] = -1;
			FarbStatus[i+1] = 2;
			await wartezeit();
			FarbStatus[j] = -1;
			FarbStatus[j-1] = -1;
			Tauschen(arr, j, j-1);
			j = j-1;			
		}
		await wartezeit();
		arr[j] = einzusortieren;
		FarbStatus[i] = -1;
	}

	for (let i = 0; i < Ende; i++){
		FarbStatus[i] = 0;
	}
	return arr;
}


async function QuickSort(arr, Anfang, Ende) { 
	if(Anfang >= Ende) { 
		FarbStatus[Ende] = 0;
		return; 
	} 	

	let pivotWert = arr[Ende];
	let pivotIndex = Anfang;
	FarbStatus[Ende] = 1;	

	for (let i = Anfang; i < Ende; i++) { //Array wird sortiert in was kleiner und was größer als der Pivot ist
		if (arr[i] < pivotWert) {
			await wartezeit();
			Tauschen(arr, i, pivotIndex);
			pivotIndex++;			
		}
	}

			
	Tauschen(arr, pivotIndex, Ende); //Pivot wird in die Reihe gesetzt, ist sortiert
		
	FarbStatus[pivotIndex] = 0;
	FarbStatus[Ende] = -1;

	for (let i = pivotIndex + 1; i < Ende; i++) {
		FarbStatus[i] = 2;
	}

	for (let i = Anfang; i < pivotIndex - 1; i++) {
		FarbStatus[i] = -1;
	}

	await Promise.all([
		QuickSort(arr, Anfang, pivotIndex - 1),
		QuickSort(arr, pivotIndex + 1, Ende) ]);
} 

async function QuickSortHoare(arr, Anfang, Ende) { 
	if(Anfang >= Ende) { 
		FarbStatus[Ende] = 0;
		console.log("hi");
	} 	

	let i = Anfang;
	let j = Ende;
	let pivot = arr[Math.floor((Anfang + Ende)/2)];
	pivotIndex = Math.floor((Anfang + Ende)/2);
	if (FarbStatus[i] != 0){FarbStatus[pivotIndex] = 2;}

	do {
		while (pivot > arr[i] && i <= j) { i++; }
		while (pivot < arr[j]) { j--; }
		await wartezeit();
		if (i <= j){
			let colOne = FarbStatus[i];
			let colTwo = FarbStatus[j];
			if (FarbStatus[i] != 0) {FarbStatus[i] = 1;}
			if (FarbStatus[j] != 0) {FarbStatus[j] = 1;}
			Tauschen(arr, i, j)
			await wartezeit();
			if (FarbStatus[i] != 0) {FarbStatus[i] = colOne}
			if (FarbStatus[j] != 0) {FarbStatus[j] = colTwo}
			j--;
			i++;
		}
	} while (j > i); 

	if (Anfang < j) { 
		for (let m = Anfang; m < j; m++) {
			if (FarbStatus[m] != 0) {FarbStatus[m] = 2;}
		}
		QuickSortHoare(arr, Anfang, j);
	} else{
		for (let m = j; m <= Anfang; m++) {
			FarbStatus[m] = 0;
		}
	}

	if (i < Ende) { 
		for (let n = i; n < Ende; n++) {
			if (FarbStatus[n] != 0) {FarbStatus[n] = -1;}
		}	
		QuickSortHoare(arr, i, Ende);
	} else{		
		for (let n = Ende; n <= i; n++) {
			FarbStatus[n] = 0;
		}
	}

	
	return arr;
} 



async function wartezeit(){
	var sliderSpeed = document.getElementById("SpeedSlider");
	await sleep(200-sliderSpeed.value);  //SortierGeschwindigkeit
}

// Definition von sleep function 
function sleep(ms) { 
	return new Promise(resolve => setTimeout(resolve, ms)); 
} 

function Tauschen(arr, a, b){
	let t = arr[a];
		arr[a] = arr[b];
		arr[b] = t;	
}
