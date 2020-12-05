//drawing from  moz canvas docs at:
//https://developer.mozilla.org/en-US/docs/Web/API/CanvasRenderingContext2D/rotate
//https://developer.mozilla.org/en-US/docs/Web/API/Window/requestAnimationFrame
//What we thought was oopsies was unintended preserved state.
//Need to test for preserved global state probably

console.log("we in it uh");
const canv = document.getElementById('drawzone');
const ctx = canv.getContext('2d');
const sheet = document.getElementById("hivis"); 
let start;
let last = Date.now();
canv.width = canv.offsetWidth;
canv.height = canv.offsetHeight;

function Frame(img, sx, sy, swidth, sheight) {	//pulled from frotwad.js
this.img = img;
this.sx = sx;
this.sy = sy;
this.swidth = swidth;
this.sheight = sheight;
this.width = swidth; //scaling factor width
this.height = sheight; //scaling factor height
}

function draw(frame, xpos, ypos) { //draw updated to logos-funk spec
ctx.drawImage(frame.img, frame.sx, frame.sy, frame.swidth, frame.sheight, xpos-(frame.width/2), ypos-(frame.sheight/2), frame.swidth, frame.height);
//console.log("drawn at "+xpos+","+ypos+".");
}

function plotRot(frame, targetxpos, targetypos, theta){	//plot rotation haha!
	ctx.translate(targetxpos, targetypos);
	ctx.rotate(theta);	//do state
	draw(frame, 0, 0);
	ctx.rotate(-theta);	//undo state
	ctx.translate(-targetxpos, -targetypos);//undo state
}

function orbiter(frame, targetx, targety, theta, distance, veltheta,){	//orbiter constructor -- mobile objects that do a heccin spin
	this.frame = frame;
	this.targetx = targetx;	//in proportions of canvas width
	this.targety = targety;	//in proportions of canvas height 
	this.theta = theta;
	this.distance = distance;	//in proportions of max(canvas height, canvas width)
	this.xpos = Math.ceil(this.targetx*canv.width+this.distance*canv.height*Math.cos(this.theta));
	this.ypos = Math.ceil(this.targety*canv.height+this.distance*canv.height*Math.sin(this.theta));
	this.veltheta = veltheta;
	//this.birth = timer;
}

orbiter.prototype.update = function(delta)	{	//set theta by angular velocity 
	this.theta = parseFloat(this.theta)+parseFloat(this.veltheta)*parseFloat(delta);
	this.xpos = this.targetx*canv.width+this.distance*canv.height*Math.cos(this.theta);
	this.ypos = this.targety*canv.height+this.distance*canv.height*Math.sin(this.theta);
}

//once-offs
const alph = "ABCDEFGHIJKLMNOPQRSTUVWXYZ .";	//charmap logic pulled from frotwad.js
var charMap = new Map();
for (let i=0; i<alph.length; i++){	//key:pair of letter:spritesheet coordinates.
const frameWidth = 32;
charMap.set(alph.charAt(i), new Frame(sheet, (i%13)*frameWidth, Math.floor(i/13)*frameWidth, frameWidth, frameWidth));
}
const schwayFrame = charMap.get(".");

let dorkorbit = []; 
let title = ".QCU";
let carry =0;
title.split('').forEach(letter => {
	dorkorbit.push(new orbiter(charMap.get(letter), 1/2, 1/2, carry, 1/3, 1/700));
	carry=carry+2*Math.PI/7;
}
);

console.log(dorkorbit[0]);
console.log(dorkorbit[1]);
console.log(dorkorbit[2]);
console.log(dorkorbit[3]);
/*
title.split('').reduce((accum , curr )	=>	{
	if (accum === undefined)
		accum =0;
	thetadiff=2*Math.PI/7;
	thub = new orbiter(charMap.get(curr), Math.floor(canv.width/2), Math.floor(canv.height/2), accum, Math.ceil(canv.width/7), 1/700);
	dorkorbit.push(thub);
	return accum+thetadiff;
},
[]
);
*/



function step(timestamp)	{
	//timing
	if(start === undefined)
		start = timestamp;
	const elapsed = timestamp - start;
	const current = timestamp;
	const delta = current - last;
	//console.log("dt = "+delta);	//werks, some frames take 6ms and others 12ms (how tf is it so slow?)
	
	//dimensioning
	canv.width = canv.offsetWidth;
	canv.height = canv.offsetHeight;
	const center = [Math.floor(canv.width/2), Math.floor(canv.height/2)];	//why arrays? I thought I had a matrix-add in the standard library.  Actually math and Math are two different libraries, silly me!
	var displacement = Math.ceil(canv.width/8);
	
	let theta = elapsed/500;		//2 radians per second. 1 rot per 3 secondsish?
	let finna = elapsed/1300*Math.log(elapsed/1300);	//1 radian per 1.3s, dradians/dt of Nlog(1.3 seconds)
	//nlogn is funnier than any other numerical progression, look it up, it's the bedrock of comp complexity theory.
	let target = [displacement*Math.cos(theta), displacement*Math.sin(theta)];
	
	draw(schwayFrame, center[0], center[1]);	//centered schway
	plotRot(schwayFrame, center[0]+target[0], center[1]+target[1], finna);
	
	//console.log(dorkorbit[1]);
	
	dorkorbit.forEach(thub => {
		thub.update(delta);
	}
	);
	
	dorkorbit.forEach(thub => {
		draw(thub.frame, thub.xpos, thub.ypos);
	}
	);
	
	//dorkorbit[0].update();
	//draw(dorkorbit[1].frame, dorkorbit[1].xpos, dorkorbit[1].ypos);
	//console.log("xpos :"+dorkorbit[0].xpos);
	//console.log("theta :"+dorkorbit[0].theta);
	//console.log("veltheta :"+dorkorbit[0].veltheta);
	
	//cleanup
	last = timestamp;	// set global state for last timestamp
	ctx.setTransform(1, 0, 0, 1, 0, 0);		//JUST IN CASE, reset transformation matrix for context.
	window.requestAnimationFrame(step);		//next frame call
}

//first invocation of reqanifra callback
window.requestAnimationFrame(step);
