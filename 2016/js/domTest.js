var svgNS = "http://www.w3.org/2000/svg",
	container = document.getElementById("container"),
	wrapper = document.getElementById("wrapper"),
	buttonWrapper = document.getElementById("buttons"),
	result = document.getElementById('result');  

function createCircle(value)
{	
	var hoverFN = function (e) {
		var circle = this,
			isMouseOver = e.type === 'mouseover';
		circle.setAttributeNS(null,"fill", isMouseOver ? 'red': 'black');
    	circle.setAttributeNS(null,"r", isMouseOver ? 10 : 4);
	}
	return function () {
    	var i,
    		circle,
    		time1;
    	dispose();
    	time1 = performance.now();
    	for (i = 0; i < value; i += 1) {
    		circle = document.createElementNS(svgNS,"circle");
		    circle.setAttributeNS(null,"cx", Math.random() * 500);
		    circle.setAttributeNS(null,"cy", Math.random() * 500);
		    circle.setAttributeNS(null,"r", 4);
		    circle.addEventListener("mouseover", hoverFN);
		    circle.addEventListener("mouseout", hoverFN);
		    container.appendChild(circle);
    	}
    	result.innerHTML += 'It took ' + (performance.now() - time1).toFixed(2) + 'ms to create ' + value + ' no. of circles.<br />';
    }
} 

function createButton(value){
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Generate " + value + " circles";
    button.onclick = createCircle(value);
    buttonWrapper.appendChild(button);
}

function dispose() {
	while (container.lastChild) {
	    container.removeChild(container.lastChild);
	}
}

function init(arr) {
	var i,
		len = arr.length;
	for (i = 0; i < len; i += 1) {
		createButton(arr[i]);
	}
}
init([10, 100, 1000, 10000, 100000, 200000]);