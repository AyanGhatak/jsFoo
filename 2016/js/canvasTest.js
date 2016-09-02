var svgNS = "http://www.w3.org/2000/svg",
	container = document.getElementById("container"),
	wrapper = document.getElementById("wrapper"),
	buttonWrapper = document.getElementById("buttons"),
	result = document.getElementById('result'),
	ctx = container.getContext("2d"),
	chunkSize = document.getElementById('chunkSize'),
	dataGenerator = (function () {
		var data = [];
		return {
			add: function () {
				var obj = {
					x: Math.random() * 625,
					y: Math.random() * 325
				}
				data.push(obj);
				return obj;
			},
			get: function () {
				return data;
			},
			reset: function () {
				data.length = 0;
			}
		};
	})();

function createCircle(value){	
	var hoverFN = function (e) {
		var circle = this,
			isMouseOver = e.type === 'mouseover';
		circle.setAttributeNS(null,"fill", isMouseOver ? 'red': 'black');
    	circle.setAttributeNS(null,"r", isMouseOver ? 10 : 4);
	}
	return function () {
    	var i,
    		circle,
    		time1,
    		len = chunkSize.value;
    	if (len > value) {
    		return;
    	}
    	dispose();
    	dataGenerator.reset();
    	time1 = performance.now();
    	for (j = 0; j < len; j += 1) {
    		setTimeout((function (j) {
    			return function () {
    				ctx.beginPath();
					for (i = 0; i < value/len; i += 1) {
						obj = dataGenerator.add();
						x = obj.x;
						y = obj.y;
						ctx.moveTo(x + 3, y);
			    		ctx.arc(x, y, 3, 0, 2 * Math.PI);
			    	}
			    	ctx.stroke();
			    	ctx.closePath();
			    	if (j === len - 1) {
						updateResult.display(value, (performance.now() - time1).toFixed(2), len);	    		
			    	}
    			}
    		})(j), 50);
	    }
    }
}
var updateResult = (function () {
	var obj = {},
		JSONData = {
		    "chart": {
		        "caption": "Time taken to render the circles",
		        "xaxisname": "Number of circles",
		        "yaxisname": "Time taken in ms",
		        "showValues": "1",
		        "showLegend": "0",
				"transposeAxis": "1",
		        "theme": "fint"
		    },
		    "categories": [
		        {
		            "category": []
		        }
		    ],
		    "dataset": []
		},
		chartRef,
		disp = function () {
			var prop,
				dataset = JSONData.dataset,
				data,
				catObj = {};
				category = JSONData.categories[0].category,
				count = 0;
			dataset.length = 0;
			category.length = 0;
			for (prop in obj) {
				if (obj[prop]) {
					for (prop2 in obj[prop]) {
						if (!catObj[prop2]) {
							category.push({
								label: prop2
							});
							catObj[prop2] = true;
						}
					}
				}
			}


			for (prop in obj) {
				data = [];
				if (obj[prop]) {
					for (prop2 in catObj) {
						data.push({
							value: obj[prop][prop2]
						})
					}
				}
				dataset.push({
					//'seriesname': prop,
					data: data
				});
			}
			if (chartRef) {
				chartRef.setJSONData(JSONData);
			}
			else {
				chartRef = new FusionCharts({
			        type: 'mscolumn2d',
			        // type: 'logmsline',
			        renderAt: 'chartContainer',
			        width: '625',
			        height: '350',
			        dataFormat: 'json',
			        dataSource: JSONData
			    }).render();
			}
		},
		changeChartType = function (isLogarithmic) {
			if (isLogarithmic) {
				chartRef.chartType('logmscolumn2d');
			}
			else {
				chartRef.chartType('mscolumn2d');	
			}
		};
	return {
		display: function (key, value, chunkSize) {
			if (!obj[chunkSize]) {
				obj[chunkSize] = {};
			}
			obj[chunkSize][key] = value;
			disp();
		},
		changeChartType: changeChartType
	}
	return 
})();

(function () {
	var toogleButton = document.getElementsByName('type')[0];
	toogleButton.addEventListener('click', function () {
		updateResult.changeChartType(this.checked);
	})
})()

function createButton(value){
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Generate " + value + " circles";
    button.onclick = createCircle(value);
    buttonWrapper.appendChild(button);
}

function dispose() {
	ctx.clearRect(0,0,625,350);
}

function init(arr) {
	var i,
		len = arr.length;
	for (i = 0; i < len; i += 1) {
		createButton(arr[i]);
	}
}
init([10, 100, 1000, 10000, 100000, 500000, 1000000]);