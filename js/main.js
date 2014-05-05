// Żeby nie srać globalnymi zmiennymi po glownym scopie
// zamykamy wszystko w funkcji którą od razu wykonujemy

// Elementu 'document' bedziemy zapewne uzywac w srodku wiec
// wrzucamy go jako argument, i przekazujemy w ostatniej linii
// pliku, wtedy ładnie sie zminimalizuje
var GAME = (function(document, undefined) {
var c=document.getElementById("gra");
var ctx=c.getContext("2d");
//TUTAJ KLASA GRACZA

// JavaScript ma cos takiego jak 'smart semicolon', to
// przypadlosc ktora stara sie zgadnac gdzie ma byc srednik
// nawet jak sie go nie postawi. Przez to gowno wszystkie
// otweirające klamerkowe nawiasy '{' muszą byc w tej samej
// linii co funkcja ktorej dotyczą, inaczej moze sie nieźle
// wszystko posrać
function Gamer(x,y,r) {
	this.x=x;
	this.y=y;
	this.r=r;
}
Gamer.prototype.x=0;
Gamer.prototype.y=0;
Gamer.prototype.r=0;
Gamer.prototype.gravity=function(){
		if(this.y+this.r<400)this.y+=0.8;
}
Gamer.prototype.moveUp=function(){
	if(this.y>10+this.r)this.y-=25;
}
Gamer.prototype.moveDown=function(){
	if(this.y+this.r+10<400)this.y+=10;
}
Gamer.prototype.draw=function(context){
	context.beginPath();
	context.arc(this.x,this.y,this.r,0,2*Math.PI);
	context.fillStyle = "#000000";
	context.stroke();
}
//TUTAJ ZROBIMY KLASĘ DLA PRZESKODY
function Obstacle(y,gap,x)//constructor
{
	this.y=y;
	this.gap=gap;
	this.x=x;
}
Obstacle.prototype.x=0;
Obstacle.prototype.y=0;
Obstacle.prototype.gap=40;
Obstacle.prototype.width=20;
Obstacle.prototype.chceckColision= function(obiekt)
{
	if(this.x+this.width>obiekt.x && obiekt.x>this.x)
	{
		if(obiekt.y-obiekt.r>this.y && obiekt.y+obiekt.r<this.y+this.gap) return false;
		else return true;
	}
	else return false;
}
Obstacle.prototype.draw= function(context)
{
	context.fillStyle = "#FF0000";
	context.fillRect(this.x,this.y+this.gap,this.width,400-this.y-this.gap);
	context.fillRect(this.x,0,this.width,this.y);
}
Obstacle.prototype.moveTo=function(moveToX){
	this.x=moveToX;
}
Obstacle.prototype.moveLeft=function(){
	if(this.x>-20)this.x--;
}
Obstacle.prototype.visible=function(){
	if(this.x>-20 && this.x<600) return true;
	else return false;
}
//=======================================================





var points=0;

//zamiast onkeydown lepiej uzyc funkcji addEventListener
//document.onkeydown = checkKey;
document.addEventListener('click', checkKey);
// to samo tutaj
c.addEventListener('click', function() {
	gracz.moveUp();
});

var imageObj = new Image();
imageObj.src = 'img/bg.jpg';
function checkKey(e) {
	// skad wziales ten window.event? Nigdy tego na oczy nie widzialem
		//e = e || window.event;
		if (e.keyCode == '38') {        // up arrow
			gracz.moveUp();
		} else if (e.keyCode == '40') {
			gracz.moveDown();
		}
}

function getRandomInt(min, max) {
	// Zamiast w pizde wolnego Math.floor lepiej uzywac bitowego
	// operatora do floorowania
	return ~~(Math.random() * (max - min + 1)) + min;
	//Math.floor(Math.random() * (max - min + 1)) + min;
}
var gracz=new Gamer(300,200,5);
var przeszkody = [];
przeszkody.push(new Obstacle(getRandomInt(80, 320),getRandomInt(60, 100),600));

// to samo z klamerką tutaj co w LOC 12
function menu() {
	ctx.clearRect(0,0,600,400);//wyczysc ekran
	ctx.drawImage(imageObj, 0, 0, 600, 400);//narysuj tło
	ctx.font = "40px Arial Black";
	ctx.fillStyle = "#000000";
	ctx.fillText("FLOPPY BALL",100,50);
}
function mainLoop()
{
	ctx.clearRect(0,0,600,400);//wyczysc ekran
	//ctx.drawImage(imageObj, 0, 0, 600, 400);//narysuj tło
	for(var i=0;i<przeszkody.length;i++) przeszkody[i].draw(ctx);
	points+=0.1;
	ctx.font = "20px Arial";
	ctx.strokeText("POINTS: "+Math.floor(points),10,50);
	if(przeszkody.length>1 && !przeszkody[0].visible())przeszkody.shift();
	if(przeszkody[przeszkody.length-1].visible()) przeszkody.push(new Obstacle(getRandomInt(80, 320),getRandomInt(60, 100),600+getRandomInt(150, 300)));
	gracz.gravity();
	gracz.draw(ctx);
	for(var i=0;i<przeszkody.length;i++){
		if(przeszkody[i].chceckColision(gracz))
		{
			clearInterval(myVar);
			alert("game over!");
		}
		przeszkody[i].moveLeft();
	}
}
//menu();
var myVar=setInterval(mainLoop,10);

})(document);
