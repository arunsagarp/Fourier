let x=[];
let fourierX=[];
let time=0;
let path=[];
let tmp = 4885;
class Complex {
	constructor(a,b){
		this.re = a;
		this.im = b;
	}
	multiply(c){
		const re = this.re * c.re - c.im * this.im;
		const im = this.re * c.im + this.im * c.re;
		return new Complex(re, im);
	}
	add(c){
		this.re +=c.re;
		this.im +=c.im;
	}

}


function dft(x){
	let X =[];
	const N = x.length;
	for (let k=0;k<N;k++){
		let sum = new Complex(0,0);
		for (let n=0;n<N;n++){
			let phi = (TWO_PI * k * n)/N;
			const c = new Complex(cos(phi),-sin(phi));
			sum.add(x[n].multiply(c))
		}
		sum.re = sum.re/N;
		sum.im = sum.im/N;
		let freq= k;

		let amp = sqrt( sum.re * sum.re + sum.im * sum.im);
		let phase = atan2(sum.im,sum.re);
		X[k] = {re: sum.re, im :sum.im, freq:freq, amp:amp, phase:phase};
	}
	return X;
}

function setup() {
	createCanvas(1900, 1900);
	//console.log(data);
	for(let i=0;i<nikhila.length;i+=12){
		let c = new Complex(nikhila[i].x/20,-nikhila[i].y/20);
		x.push(c)
	}
	fourierX = dft(x);
	console.log(fourierX);
	frameRate(30);
	fourierX.sort((a, b) => b.amp - a.amp);
	background(0);

}
function epicCycles(x,y,rotate, fourier){
	for(let i=1;i<fourier.length;i++){
		let freq = fourier[i].freq;
		let radius = fourier[i].amp;
		let phase = fourier[i].phase
		let prevx = x;
		let prevy = y;
		x += radius * cos( freq * time + phase + rotate);
		y += radius *  sin( freq * time + phase+ rotate);
		stroke(200);
		noFill();
		ellipse(prevx,prevy,radius * 2);
		stroke(100);
		line(prevx,prevy,x,y);
	}
	return createVector(x,y)
}
function draw() {
	background(0);
	translate(100, 430);
	let v = epicCycles(400,100,0, fourierX);
	path.unshift(v);
	console.log(path.length);
	beginShape();

	line(v.x,v.y , v.x,v.y-350);
	stroke(255);
	noFill();
	for ( let i=0;i<path.length;i+=1){
			vertex(path[i].x,path[i].y-350);	 	
	}


	endShape();
	const dt = TWO_PI /fourierX.length;
	
	time+=dt;
	if (time > 2*TWO_PI) {
    	time = 0;
    	path = [];
	}
}
function distance(x1,x2,y1,y2){
	return Math.sqrt(((x2-x1)*(x2-x1)) + ((y2-y1)*(y2-y1)));
}