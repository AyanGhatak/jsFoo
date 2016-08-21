var svgNS = "http://www.w3.org/2000/svg",
    wrapper = document.getElementById("wrapper"),
    buttonWrapper = document.getElementById("buttons"),
    result = document.getElementById('result'),
    toolText = document.getElementById("tooltip"),
    dataGenerator = (function () {
        var data = [];
        return {
            add: function () {
                var obj = {
                    x: Math.random() * 100,
                    y: Math.random() * 100
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
            chartRef;
        dispose();
        dataGenerator.reset();
        // data generation.
        for (i = 0; i < value; i += 1) {
            dataGenerator.add();
        }
        window.time1 = performance.now();
        chartRef = new Chart().render();
        console.log(performance.now() - window.time1);
    }
}

var updateResult = (function () {
    var obj = {},
        JSONData = {
            "chart": {
                "caption": "Time taken to render the circles",
                "xaxisname": "Number of circles",
                "yaxisname": "Time taken in ms",
                "theme": "fint"
            },
            "categories": [
                {
                    "category": []
                }
            ],
            "dataset": [
                {
                    "data": []
                }
            ]
        },
        chartRef,
        disp = function () {
            var prop,
                data = JSONData.dataset[0].data,
                category = JSONData.categories[0].category;
            data.length = 0;
            category.length = 0;
            for (prop in obj) {
                category.push({
                    label: prop
                });
                data.push({
                    value: obj[prop]
                });
            }
            if (chartRef) {
                chartRef.setJSONData(JSONData);
            }
            else {
                chartRef = new FusionCharts({
                    type: 'msline',
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
                chartRef.chartType('logmsline');
            }
            else {
                chartRef.chartType('msline');   
            }
        };
    return {
        display: function (key, value) {
            obj[key] = value;
            disp();
        },
        changeChartType: changeChartType
    }
    return 
})();

function showToolTip(text, add) {
    if (add) {
        toolText.innerHTML += text;    
    }
    else {
        toolText.innerHTML = text;
    }
}

(function () {
    var toogleButton = document.getElementsByName('type')[0];
    toogleButton.addEventListener('click', function () {
        updateResult.changeChartType(this.checked);
    })
})();

function createButton(value){
    var button = document.createElement("input");
    button.type = "button";
    button.value = "Generate " + value + " circles";
    button.onclick = createCircle(value);
    buttonWrapper.appendChild(button);
}

function dispose() {
    // TODO.
}

function init(arr) {
    var i,
        len = arr.length;
    for (i = 0; i < len; i += 1) {
        createButton(arr[i]);
    }
}
init([10, 100, 1000, 10000, 100000, 500000, 1000000]);






var math = Math,
    mathMin = math.min,
    mathMax = math.max,
    ceil = math.ceil,
    mathAbs = math.abs,
    mathRound = math.round,
    mathFloor = math.floor,
    win = window,
    pi = math.PI,
    pi2 = 2 * pi,
    BLANKSTRING = '',
    fireMouseEvent = function (eventName, domElement, mouseEventInit) {
        var event;
        if (!domElement || !eventName) {
            return;
        }

        if(!mouseEventInit){
            mouseEventInit = {};
        }
        if (mouseEventInit.originalEvent) {
            mouseEventInit = mouseEventInit.originalEvent;
        }
        // map touch event for touch devices
        if (mouseEventInit.touches) {
            mouseEventInit = mouseEventInit.touches[0];
        }


        if (domElement.dispatchEvent) {
            if (MouseEvent) {
                //for FireFox, chrome and opera. NOT confirmed in Safari
                // Creates a MouseEvent object.
                event = new MouseEvent(eventName, {
                    bubbles: !!mouseEventInit.bubbles,
                    cancelable: !!mouseEventInit.cancelable,
                    clientX: mouseEventInit.clientX || ( mouseEventInit.pageX && (mouseEventInit.pageX -
                        doc.body.scrollLeft - doc.documentElement.scrollLeft)) || 0,
                    clientY: mouseEventInit.clientY || ( mouseEventInit.pageY && (mouseEventInit.pageY -
                        doc.body.scrollTop - doc.documentElement.scrollTop)) || 0,
                    screenX: mouseEventInit.screenX || 0,
                    screenY: mouseEventInit.screenY || 0,
                    pageX: mouseEventInit.pageX || 0,
                    pageY: mouseEventInit.pageY || 0
                });
            }
            else if (doc.createEvent) {
                //for IE support.
                event = doc.createEvent('HTMLEvents');
                event.initEvent(eventName, !!mouseEventInit.bubbles, !!mouseEventInit.cancelable);
            }
            event.eventName = eventName;
            event && domElement.dispatchEvent(event);
        }
        else if(doc.createEventObject && domElement.fireEvent){
            event = doc.createEventObject();
            event.eventType = eventName;
            event.eventName = eventName;
            //trigger the event forcefully.
            domElement.fireEvent('on' + eventName, event);
        }
    },
    STR_DEF = 'default',
    TRACKER_FILL = 'rgba(192,192,192,0.000001)';

if (typeof Object.create !== 'function') {
    Object.create = function (o) {
        function F() {}
        F.prototype = o;
        return new F();
    };
}



function Axes () {}

Axes.prototype.getPVR = function () {
    var axis = this,
        axisConfig = axis.config;
    return ((axisConfig.width * axis._getScale()) / axisConfig.span);
};

Axes.prototype.setLimits = function (max, min) {
    var axis = this,
        axisConfig = axis.config;
    
    axisConfig.max = max;
    axisConfig.min = min;
    axisConfig.span = max - min;
};

Axes.prototype.setExtremes = function (startPixel, endPixel) {
    var axis = this,
        axisConfig = axis.config;
    
    axisConfig.startPixel = startPixel;
    axisConfig.endPixel = endPixel;
    axisConfig.width = endPixel - startPixel;
};

Axes.prototype.configure = function (chart, endPixel, startPixel = 0) {
    var axis = this;
    axis.config = {};
    axis.setExtremes(startPixel, endPixel);
    axis.linkedItems = {
        chart: chart
    };
    return axis;
};




function xAxis () {}

xAxis.prototype = Object.create(Axes.prototype);

xAxis.prototype._getScale = function () {
    return this.linkedItems.chart.config.viewPortConfig.scaleX;
}

xAxis.prototype.getValue = function (value) {
    var axis = this,
        axisConfig = axis.config,
        chartConfig = axis.linkedItems.chart.config,
        viewPortConfig = chartConfig.viewPortConfig,
        pvr =  ((chartConfig.canvasWidth * viewPortConfig.scaleX) / axisConfig.span);
    return axisConfig.min + ((viewPortConfig.x * viewPortConfig.scaleX + Number(value)) / pvr);
}

xAxis.prototype.getPixel = function (value) {
    var axis = this,
        axisConfig = axis.config,
        chart = axis.linkedItems.chart,
        chartConfig = chart.config,
        viewPortConfig = chartConfig.viewPortConfig;
    // calculate the relative pixel value
    return chartConfig.canvasLeft + (((value - axisConfig.min) * axis.getPVR()) - (viewPortConfig.x * viewPortConfig.scaleX));
}




function yAxis() {}

yAxis.prototype = Object.create(Axes.prototype);

yAxis.prototype.getPixel = function (value) {
    var axis = this,
        axisConfig = axis.config,
        chart = axis.linkedItems.chart,
        chartConfig = chart.config,
        viewPortConfig = chartConfig.viewPortConfig;
    // calculate the relative pixel value
    return chartConfig.canvasTop + (((value - axisConfig.min) * (-axis.getPVR())) + (chartConfig.canvasHeight * viewPortConfig.scaleY -
        viewPortConfig.y * viewPortConfig.scaleY)); 
}

yAxis.prototype._getScale = function () {
    return this.linkedItems.chart.config.viewPortConfig.scaleY;
}

yAxis.prototype.getValue = function (value) {
    var axis = this,
        axisConfig = axis.config,
        chartConfig = axis.linkedItems.chart.config,
        viewPortConfig = chartConfig.viewPortConfig,
        pvr =  ((chartConfig.canvasHeight * viewPortConfig.scaleY) / axisConfig.span);
    return axisConfig.max - ((viewPortConfig.y * viewPortConfig.scaleY + Number(value)) / pvr);
}




function Chart() {
    var width = 625,
        height = 350,
        iapi = this,
        data = dataGenerator.get(),
        container = document.getElementById("chart");

    iapi.config = {
        canvasLeft: 0,
        animation: {
            enabled: true
        },
        canvasTop: 0,
        canvasWidth: width,
        canvasHeight: height,
        updateAnimDuration: 500,
        maxZoomLimit: 1000,
        status: 'zoom',
        _staticRadius: 0,
        radius: 2,
        viewPortConfig: {
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0
        },
        viewPortHistory: [{
            scaleX: 1,
            scaleY: 1,
            x: 0,
            y: 0
        }],
        plotCosmetics: {
            lineWidth: 2,
            borderWidth: 1,
            strokeStyle: '#ffad33',
            fillStyle: '#ffad33'
        },
        hoverCosmetics: {
            fill: '#ffffff',
            borderColor: '#00ff00',
            borderThickness: 1
        },
        tooltip: {
            toolTipSepChar: ','
        },
        showToolTip: 1,
        showHoverEffect: 1,
        chunkSize: mathFloor(mathMin(((data || []).length)/5,50000))
    };
    iapi.graphics = {};
    iapi.linkedItems = {
        container: container,
        buttonContainer: document.getElementById('chartButtons')
    };
    iapi.components = {
        paper: new Raphael(container, container.offsetWidth, container.offsetHeight),
        xAxis: new xAxis().configure(iapi, width),
        yAxis: new yAxis().configure(iapi, height),
        kDTree: new KdTree(),
        data: data
    }
    return iapi;
}

Chart.prototype._createLayers = function () {
    var iapi = this,
        iapiConfig = iapi.config,
        iapiGraphics = iapi.graphics,
        paper = iapi.components.paper;

    iapiGraphics.imageContainer = paper.group('container');
    iapiGraphics.trackerGroup = paper.group('tracker');
    iapi.__preDraw();

    iapi.addButtons([{
        name: 'zoomOut',
        clickFN : function () {
            var viewPortHistory = iapiConfig.viewPortHistory,
                previousViewPortHist;
            //zoom out is possible only if it is not the initial unzoomed configurations.
            if (viewPortHistory.length > 1) {
                previousViewPortHist = viewPortHistory.slice(-2,-1)[0];
                iapi.updateVisual(previousViewPortHist.x, previousViewPortHist.y,
                    previousViewPortHist.scaleX, previousViewPortHist.scaleY);
            }
        }
    }, {
        name: 'reset',
        clickFN : function () {
            var viewPortConfig = iapiConfig.viewPortConfig,
                iapiGraphics = iapi.graphics;

            if (iapiConfig.viewPortHistory.length > 1) {
                viewPortConfig.isReset = true;
                iapi.zoomSelection(0, 0, iapiConfig.canvasWidth, iapiConfig.canvasHeight);
                //deletes all the configurations except the initial one.
                iapiConfig.viewPortHistory.splice(1);
                iapiGraphics.trackerGroup.attr({
                    cursor: 'default'
                });
                //reset the selection box after the chart is reset.
                iapi.updateSelectionBox(0,0,0,0);
            }
        }
    }, {
        name: 'Switch to pan mode',
        clickFN: function () {
            if (iapiConfig.status === 'zoom') {
                this.value = 'Switch to zoom mode';
                iapiConfig.status = 'pan';
            }
            else {
                this.value = 'Switch to pan mode';
                iapiConfig.status = 'zoom';
            }
        }
    }], iapi.linkedItems.buttonContainer);
};

Chart.prototype.__preDraw = function () {
    var iapi = this,
        iapiGraphics = iapi.graphics,
        imageContainer = iapiGraphics.imageContainer,
        iapiConfig = iapi.config,
        canvasLeft = iapiConfig.canvasLeft,
        canvasTop = iapiConfig.canvasTop,
        canvasWidth = iapiConfig.canvasWidth,
        canvasHeight = iapiConfig.canvasHeight,
        containerElem = iapi.linkedItems.container,
        paper = iapi.components.paper;
    //the origin of the container element should coincide with the origin(top-left) of the canvas area.
    imageContainer.transform('t' + canvasLeft + ',' + canvasTop);
    //apply clipping to the container element.
    imageContainer.attr({
        'clip-rect': canvasLeft + ',' + canvasTop + ',' + canvasWidth + ',' + canvasHeight
    });

    /*create a hot element of same size as that of the canvas area which is used to draw the tracker element
    for trendzone in axis module and also apply the cursor properties.*/
    !iapiGraphics.trackerElem && (iapiGraphics.trackerElem = paper.rect(canvasLeft, canvasTop, canvasWidth,
        canvasHeight, 0, iapiGraphics.trackerGroup).attr({
        'fill': TRACKER_FILL,
        'stroke': TRACKER_FILL
    }));
    
    containerElem.addEventListener("mousemove", iapi.searchMouseMove.bind(iapi), false);
    containerElem.addEventListener("touchstart", iapi.searchMouseMove.bind(iapi), false);

    containerElem.setAttribute('iapi', iapi);

    //callbacks for the image is set
    iapi.zoomPanManager(imageContainer);
};

Chart.prototype.configure = function () {
    var i,
        xMax = -Infinity,
        yMax = -Infinity,
        xMin = Infinity,
        yMin = Infinity,
        dataObj,
        iapi = this,
        iapiComponents = iapi.components,
        data = iapiComponents.data,
        len = data.length,
        xAxis = iapiComponents.xAxis,
        yAxis = iapiComponents.yAxis;

    for (i = 0; i < len; i += 1) {
        dataObj = data[i];
        if (dataObj.x > xMax) {
            xMax = dataObj.x;
        }
        if (dataObj.x < xMin) {
            xMin = dataObj.x;
        }
        if (dataObj.y > yMax) {
            yMax = dataObj.y;
        }
        if (dataObj.y < yMin) {
            yMin = dataObj.y;
        }
    }

    xAxis.setLimits(xMax, xMin);
    yAxis.setLimits(yMax, yMin);
}

Chart.prototype.render = function () {
    var iapi = this;
    iapi.configure();
    iapi._createLayers();

    // redraw the plots
    iapi._deleteGridImages();
    iapi.graphics._grid = {};

    iapi.updateVisual();
};

Chart.prototype.zoomPanManager = function () {
    var touchPoint,
        //stroes the start event
        startEvent = [],
        current = [],
        iapi = this,
        iapiConfig = iapi.config,
        iapiGraphics = iapi.graphics,
        iapiComponents = iapi.components,
        viewPortConfig = iapiConfig.viewPortConfig,
        isMultiTouch = false, // flag for number of touches if its a single or multi touch.
        dblClick = 0, // to distinguish double and single click.
        firstClickIsMouse,
        initialViewPortConfig = {},
        flag = 0,
        containerElem = iapi.linkedItems.container,
        /*
         * Imposes restrictions on the chartX and chartY as it cannot exceed the canvas area dimensions
         * @param event {Object} - Fetches the event
        */
        forceLimit = function (event) {
            var chartX = event.clientX,
                chartY = event.clientY,
                left = iapiConfig.canvasLeft,
                top = iapiConfig.canvasTop,
                right = iapiConfig.canvasRight,
                bottom = iapiConfig.canvasBottom;

            (chartX < left) && (event.clientX = mathMax(chartX, left));
            (chartX > right) && (event.clientX = mathMin(chartX, right));

            (chartY < top) && (event.clientY = mathMax(chartY, top));
            (chartY > bottom) && (event.clientY = mathMin(chartY, bottom));
        },
        dragCallbacks = {
            /*
             * @param event {Object} - Events for touchStart and dragStart events.
            */
            start: function (event) {
                //update the viewPort configurations.
                viewPortConfig = iapiConfig.viewPortConfig;
                //for mouseEvent event.
                startEvent[0] = event;

                // todo remove this fix once the drag-move is applied on page body (outside chart)
                // hide the zoom-selection box
                iapi.updateSelectionBox(0,0,0,0);

                // reset the dragging flag
                iapiConfig.isDragging = false;

                // if in pan mode
                if (iapiConfig.status === 'pan') {
                    iapiConfig.panStartX = viewPortConfig.x;
                    iapiConfig.panStartY = viewPortConfig.y;
                    //update the cursor.
                    iapiGraphics.trackerGroup.attr({
                        cursor: 'move'
                    });
                }
            },
            /*
             * @param event {Object} - Events for touchMove and dragMove events.
            */
            on: function (event){

                var maxX,
                    maxY,
                    newHeight,
                    newOriginX,
                    newOriginY,
                    newViewPortConfig,

                    dx,
                    dy,

                    panStartX = iapiConfig.panStartX,
                    panStartY = iapiConfig.panStartY,
                    scaleX = viewPortConfig.scaleX,
                    scaleY = viewPortConfig.scaleY,
                    xAxis = iapiComponents.xAxis,
                    yAxis =  iapiComponents.yAxis;
                //for single touch or drag events
                current[0] = event;

                (iapiConfig.status === 'pan') && iapiGraphics.trackerGroup.attr({
                    cursor: 'move'
                });
                
                /*for touch devices, the mouse move may get called during non-moved tap
                if dragging flag is not enabled
                Not to detect that as a drag, don't count the mouse move untill it moves significently*/
                if(!iapiConfig.isDragging && (mathAbs(current[0].clientX - startEvent[0].clientX) > 2 ||
                    mathAbs(current[0].clientY - startEvent[0].clientY) > 2)) {
                    // reset the dragging flag
                    iapiConfig.isDragging = true;

                    //hide the tracker element.
                    iapi.highlightPoint(false);

                    if (iapiConfig.status === 'zoom') {
                        //convert to axis value
                        startEvent[0].pointValue = iapi.getValue({
                            x: startEvent[0].chartX,
                            y: startEvent[0].chartY
                        });
                    }
                }
                // if this is dragging then do the drag end
                if (iapiConfig.isDragging) {

                    if (iapiConfig.status === 'zoom'){ // do the zooming
                        //update the size of the rectangle
                        iapi.updateSelectionBox(startEvent[0].clientX, startEvent[0].clientY, current[0].clientX,
                            current[0].clientY);
                    }
                    else if (iapiConfig.status === 'pan' && (scaleX !== 1 || scaleY !== 1)){ // do the paning
                        maxX = iapiConfig.canvasRight;
                        maxY = iapiConfig.canvasBottom;
                        //calculate the incremental change.
                        dx = startEvent && (current[0].clientX - startEvent[0].clientX);
                        dy = startEvent && (current[0].clientY - startEvent[0].clientY);


                        panStartX -= dx / scaleX;
                        panStartY -= dy / scaleY;

                        maxX = (iapiConfig.canvasWidth * (scaleX - 1))/scaleX;
                        maxY = (iapiConfig.canvasHeight * (scaleY - 1))/scaleY;

                        panStartX  = panStartX > maxX ? maxX: (panStartX < 0 ? 0 : panStartX);
                        panStartY = panStartY > maxY ? maxY : (panStartY < 0 ? 0 : panStartY);

                        viewPortConfig.x = panStartX;
                        viewPortConfig.y = panStartY;

                        //updates(redraw) the plot as per panning interactions.
                        iapi.draw();

                        newHeight = iapiConfig.canvasHeight * scaleY;
                        newOriginX = viewPortConfig.x * scaleX;
                        newOriginY = viewPortConfig.y * scaleY;
                    }
                }
            },
            /*
             * @param event {Object} - Events for touchEnd and dragEnd events.
            */
            end: function (event) {
                var mousePos = event,
                    left = iapiConfig.canvasLeft,
                    top = iapiConfig.canvasTop,
                    canvasWidth = iapiConfig.canvasWidth,
                    canvasHeight = iapiConfig.canvasHeight,
                    oriPositions,
                    selectionEnd,
                    selectionStart,
                    newViewPortConfig,
                    quaterCanvasW = canvasWidth / 4,
                    quaterCanvasH = canvasHeight / 4,
                    mouseX,
                    mouseY,
                    searchEvent;

                // if the mouse pointer is not valid, retrive the mouse pointer from last mousemove.
                mousePos  = (isNaN(mousePos.chartX) || isNaN(mousePos.chartY)) ? (current[0] ||
                    startEvent[0]) : mousePos;

                // if this is dragging then do the drag end
                if (iapiConfig.isDragging) {

                    // for single point drag in select zoom state
                    if (iapiConfig.status === 'zoom'){
                        //delete the selection box and call for update plot
                        selectionEnd  = mousePos;
                        selectionStart = startEvent[0];

                        // limit the actions within the canvas area only
                        forceLimit(selectionStart);
                        forceLimit(selectionEnd);

                        //get the original positions of the selection events wrt original unzoomed canvas area.
                        oriPositions = iapi.getOriginalPositions(
                            selectionStart.clientX - left, selectionStart.clientY - top,
                            selectionEnd.clientX - left, selectionEnd.clientY - top);

                        //reset only if it was a drag mouse event
                        if (oriPositions){
                            // get the axis values of the end event.
                            selectionEnd.pointValue = iapi.getValue({
                                x: selectionEnd.clientX,
                                y: selectionEnd.clientY
                            });

                            //when the drag start and end both happens outside the canvas area.
                            if (selectionStart.clientX !== selectionEnd.clientX &&
                                selectionStart.clientY !== selectionEnd.clientY){
                                iapi.zoomSelection(oriPositions[0], oriPositions[1], oriPositions[2],
                                    oriPositions[3]);
                            }
                            // hide the zoom-selection box
                            iapi.updateSelectionBox(0,0,0,0);
                        }
                    }
                    // reset the is dragging flag
                    iapiConfig.isDragging = false;
                    // call the mouse move point search function at the drag end
                    searchEvent = current[0] || startEvent[0];
                    //store the reference of the rendering API in the event itself
                    searchEvent.data = chart;
                    iapi.searchMouseMove(searchEvent);
                }

                // reset the coursor if any applied
                iapiGraphics.trackerGroup.attr({
                    cursor: STR_DEF
                });
            }
        };

    containerElem.addEventListener("mousedown", function(e){
        dragCallbacks.start.apply(this, arguments);
        flag = 1;
    }, false);
    containerElem.addEventListener("mousemove", function(e){
        if (flag) {
            dragCallbacks.on.apply(this, arguments);
        }
    }, false);
    containerElem.addEventListener("mouseup", function(e){
        dragCallbacks.end.apply(this, arguments);
        flag = 0;
    }, false);
};

Chart.prototype.updateVisual = function (zoomX, zoomY, scaleX, scaleY, pixelatedDraw) {
    var xVisibleMin,
        xVisibleMax,
        yVisibleMin,
        yVisibleMax,
        i,
        clipRect,
        chart = this,
        chartConfig = chart.config,
        chartComponents = chart.components,
        viewPortConfig = chartConfig.viewPortConfig,
        oldCanvasWidth = chartConfig.canvasWidth,
        oldCanvasHeight = chartConfig.canvasHeight,
        newCanvasWidth = oldCanvasWidth,
        newCanvasHeight = oldCanvasHeight,
        viewPortHistory = chartConfig.viewPortHistory,
        lastViewPortConfig = viewPortHistory.slice(-1)[0],
        viewPortStatus = chartConfig.status,
        chartGraphics = chart.graphics,
        maxZoomLimit = chartConfig.maxZoomLimit; //restrictions in the zooming limit.
    //check for validity for the input arguments provided.
    //Incase invalid, revert to the last viewPort configurations, that is visually there remains no change.
    viewPortConfig.x = isNaN(zoomX) ? (zoomX = lastViewPortConfig.x) : zoomX;
    viewPortConfig.y = isNaN(zoomY) ? (zoomY = lastViewPortConfig.y) : zoomY;
    viewPortConfig.scaleX = scaleX || (scaleX = lastViewPortConfig.scaleX);
    viewPortConfig.scaleY = scaleY || (scaleY = lastViewPortConfig.scaleY);

    // apply the limit
    if (scaleX > maxZoomLimit) {
        viewPortConfig.x = zoomX = mathMin(zoomX, (oldCanvasWidth - oldCanvasWidth/maxZoomLimit));
        viewPortConfig.scaleX = scaleX = maxZoomLimit;
    }
    if (scaleY > maxZoomLimit) {
        viewPortConfig.y = zoomY = mathMin(zoomY, (oldCanvasHeight - oldCanvasHeight/maxZoomLimit));
        viewPortConfig.scaleY = scaleY = maxZoomLimit;
    }

    if (pixelatedDraw) {
        //only applicable in case of pinch zoom interaction.
        chart.updateManager(pixelatedDraw);
    }
    else {

        //update the viewPortConfig.status to pan mode after every zoom, only if it is not an initial view.
        if (scaleX > 1 || scaleY > 1) {
            //incase the status is zoom after zooming in, then toogle it.
            if (viewPortStatus === 'zoom') {
                //updates the button visuals as well as the status is toogled.
                chart.toogleDragPan(true);
            }
            //it is a situation of zoomIn
            if (scaleX >= lastViewPortConfig.scaleX || scaleY >= lastViewPortConfig.scaleY) {
                //the new configuration is stored for future use.
                viewPortHistory.push({
                    scaleX: scaleX,
                    scaleY: scaleY,
                    x: zoomX,
                    y: zoomY
                });
            }
            //situation of zoomOut.
            else {
                //pops the latest configuration from the viewPortHistory
                viewPortHistory.pop();
                //overwrite the viewPortConfigurations with the latest stored configs and update them.
                lastViewPortConfig = viewPortHistory.slice(-1)[0];
                viewPortConfig.x = lastViewPortConfig.x;
                viewPortConfig.y = lastViewPortConfig.y;
                viewPortConfig.scaleX = lastViewPortConfig.scaleX;
                viewPortConfig.scaleY = lastViewPortConfig.scaleY;
            }
        }
        else {
            if (viewPortHistory.length > 1) {
                //atleast once the zooming has occured.
                viewPortHistory.pop();
            }

            //In the initial view, it will be in zoom state, so in case in pan, toogling is required.
            if (viewPortStatus === 'pan') {
                chart.toogleDragPan(true);
            }
        }
        //todo reduce the redaundancy. Updates the button visual only.
        chart.toogleDragPan();

        newCanvasWidth = chartConfig.canvasWidth;
        newCanvasHeight = chartConfig.canvasHeight;

        // update the viewPortConfig x and y with the new canvas dimension
        if (zoomX) {
            zoomX = viewPortConfig.x =  viewPortConfig.x  * (newCanvasWidth / oldCanvasWidth);
        }
        if (zoomY) {
            viewPortConfig.y = viewPortConfig.y * (newCanvasHeight / oldCanvasHeight);
        }

        chart.draw();

        clipRect = {
            'clip-rect' : chartConfig.canvasLeft + ',' + chartConfig.canvasTop + ',' +
            chartConfig.canvasWidth + ',' + chartConfig.canvasHeight
        };
        if (chartConfig.viewPortConfig) {
            chartGraphics.imageContainer.attr({
                x : chartConfig.canvasLeft,
                y : chartConfig.canvasRight
            });
        }
        //update the image container wrt modified canvas dimension after resizing.
        chartGraphics.imageContainer.attr(clipRect)
        .transform('T' + chartConfig.canvasLeft + ',' + chartConfig.canvasTop);
        /*Clipping on the tracker is required when a single plot covers more than the screen and one hover on
        it, the hovering circle goes out of the canvas, which needs to be prevented and hence needs to be
        clipped. This clipping again needs to be updated with every resizing.*/
        chartGraphics.tracker && chartGraphics.tracker.attr(clipRect);
    }
    //hide the tracker element.
    chart.highlightPoint(false);
    //reset the isReset flag.
    viewPortConfig.isReset = false;
}

Chart.prototype._deleteGridImages = function () {
    var imageElem,
        lineImage,
        lineCanvas,
        canvasElem,
        gridElem,
        rowIndex,
        colIndex,
        row,
        iapi = this,
        iapiConfig = iapi.config,
        iapiGraphics = iapi.graphics,
        imagePool =iapiGraphics._imagePool || (iapiGraphics._imagePool = []),
        canvasPool = iapiGraphics._canvasPool || (iapiGraphics._canvasPool = []),
        lineImagePool =iapiGraphics._lineImagePool || (iapiGraphics._lineImagePool = []),
        lineCanvasPool = iapiGraphics._lineCanvasPool || (iapiGraphics._lineCanvasPool = []),
        grid = iapiGraphics._grid || [],
        batchDarwTimers = iapiConfig._batchDarwTimers;

    // delete previous drawing threads
    if (batchDarwTimers && batchDarwTimers.length) {
        while (batchDarwTimers.length) {
            clearTimeout(batchDarwTimers.shift());
        }
    }

    for ( rowIndex in grid) {
        row = grid[rowIndex];
        if (row) {
            for (colIndex in row) {
                gridElem = row[colIndex];
                if (gridElem && gridElem.drawState) {
                    // unlink the image element
                    imageElem = gridElem.image;
                    //blanks the src of the image element.
                    imageElem.attr({
                        'src': '',
                        'width': 0,
                        'height': 0
                    });
                    imagePool.push(imageElem); //push the already drawn image in the image pool
                    delete gridElem.image;
                    // unlink the canvas element
                    canvasElem = gridElem.canvas;
                    canvasPool.push(canvasElem); //push the already drawn canvas in the canvas pool
                    delete gridElem.canvas;
                    delete gridElem.ctx;

                    if ((lineImage = gridElem.lineImage)) {
                        //blanks the src of the line image element.
                        lineImage.attr({
                            'src': '',
                            'width': 0,
                            'height': 0
                        });
                        lineImagePool.push(lineImage); //push the already drawn image in the image pool
                        delete gridElem.lineImage;
                        // unlink the canvas element
                        lineCanvas = gridElem.lineCanvas;
                        lineCanvasPool.push(lineCanvas); //push the already drawn canvas in the canvas pool
                        delete gridElem.lineCanvas;
                        delete gridElem.lineCtx;
                    }
                }
            }
        }
    }
    // delete the grid store
    delete iapiGraphics._grid;
};

Chart.prototype.searchMouseMove = function (e) {
    var mousePos,
        top,
        left,
        point,
        chart = this,
        chartConfig = chart.config,
        viewPortConfig = chartConfig.viewPortConfig,
        chartComponents = chart.components,
        xAxis = chartComponents.xAxis,
        yAxis = chartComponents.yAxis;

    if (!chart.linkedItems.container || chartConfig.isDragging) {
        return ;
    }

    //Convert the event coordinates into chart coordinates
    top = chartConfig.canvasTop;
    left = chartConfig.canvasLeft;
    //Get the coordinates of the point wrt inital unzoomed canvas origin(in pixels)
    //convert to x, y-values.
    point = viewPortConfig.lastMouseCoordinate = {
        'x': Number(xAxis.getValue(e.clientX - left)),
        'y': Number(yAxis.getValue(e.clientY - top))
    };
    // clear previous search timer
    clearTimeout(viewPortConfig.neighbourSearchTimer);
    //store the evnt object. This will be used to generate event on same coordinate
    chartConfig.lastMouseEvent = e;

    // for performance do the search in a seperate thread
    viewPortConfig.neighbourSearchTimer = setTimeout(function () {
        // this checking prevent the state where the timeout was called when the chart was not in idDragging
        // state. But when the when the timer is getting executed, the chart is in isDragging state
        if (!chartConfig.isDragging){
            //search the best neighbouring point of the mouse moved point.
            chart._bestNeighbour(viewPortConfig.lastMouseCoordinate);
        }
    }, 100);
    /*else {
        //hide the tracker element.
        chart.highlightPoint(false);
    }*/
}

Chart.prototype.toogleDragPan = function () {
    // todo.
};

Chart.prototype.draw = function () {
    var xAxis,
        yAxis,
        xPVR,
        yPVR,
        zoomedRadius,
        iapi = this,
        iapiGraphics = iapi.graphics,
        iapiComponents = iapi.components,
        imageContainer = iapiGraphics.imageContainer,
        paper = iapiComponents.paper,
        iapiConfig = iapi.config,
        imageGroup = iapiGraphics.container,
        viewPortConfig = iapiConfig.viewPortConfig,
        lastViewPort = iapiConfig.lastViewPort || {}, // store the latest viewPort Configurations
        quickInitialDraw = false; /*a flag to check if there is a modification in the lastViewPort and determine
         if the action is supposedly zoom or paning one.*/
    //create the image group if not being created
    if (!imageGroup) {
        // This grid-container is the container element for all the images required for that dataset itself.
        imageGroup = (iapiGraphics.container = paper.group('grid-container',imageContainer));
    }
    //modifications in viewPortConfig indicates it is a zoom effect and not pan.
    if (lastViewPort.scaleX !== viewPortConfig.scaleX || lastViewPort.scaleY !== viewPortConfig.scaleY) {
        //This is a zoom action as the viewPortConfigurations are modified.

        // update the lastViewPort Configurations
        lastViewPort.scaleX = viewPortConfig.scaleX;
        lastViewPort.scaleY = viewPortConfig.scaleY;
        //sets the x and y limit for search implementation.
        xAxis = iapiComponents.xAxis;
        yAxis = iapiComponents.yAxis;
        // Get the latest PixelValueRatio from the axis modules.
        xPVR = xAxis.getPVR();
        yPVR = yAxis.getPVR();

        /*For zoomedRadius below 2 pixels, it becomes tough for tooltip display, hence minimum 2 pixels is
        the lower cut-off.Similarily, zoomedDiameter can not be expected to be more than the canvasWidth or
        canvasHeight becuase there is no point of letting the user zoom beyond a level where only a single
        plot covers the entire canvas area*/
        zoomedRadius = mathMax((iapiConfig.zoomedRadius = mathMin((iapiConfig.staticRadius ?
            iapiConfig.radius : (iapiConfig.radius * mathMin(viewPortConfig.scaleX,
                viewPortConfig.scaleY))), iapiConfig.canvasWidth / 2, iapiConfig.canvasHeight / 2)), 2);
        // reset the configurations which are dependent on zoom level
        iapiComponents.kDTree._setSearchLimit(zoomedRadius/xPVR, zoomedRadius/yPVR);
        iapi._deleteGridImages(); // delete the old grids.
        iapi.graphics._grid = {}; //initialise the _grid Object.
        quickInitialDraw = true; // in case of zoom do not create a seperate thread for the first drawing
    }
    // now draw the grid image
    iapi._gridDraw(quickInitialDraw);
};

Chart.prototype.highlightPoint = function () {

};

Chart.prototype._gridDraw = function (quickInitialDraw) {
    var iapi = this,
        iapiGraphics = iapi.graphics,
        iapiConfig = iapi.config,
        viewPortConfig = iapiConfig.viewPortConfig;

    // clear previous drading thread if any
    clearTimeout(iapiConfig.timer);

    /*Pan the image group to the latest viewPortConfigurations taking the scaling factors(due to zooming) in
    account*/
    iapiGraphics.container.transform('t'+mathRound(-viewPortConfig.x * viewPortConfig.scaleX)+',' +
        mathRound(-viewPortConfig.y * viewPortConfig.scaleY));

    if (quickInitialDraw) { //Zoom actions
        // draw grid members if required
        iapi._gridManager();
    }
    else { //Pan(/Drag) actions.
        //_gridManager() is called in setTimeout() to avoid frezzed mousemove as the drawing is heavy
        iapiConfig.timer = setTimeout (function () {
            // draw grid members if required
            iapi._gridManager();
        }, 10);
    }
};

Chart.prototype._gridManager = function () {
    var rowGrid,
        element,
        xMinValue,
        xMaxValue,
        yMinValue,
        yMaxValue,
        gridIndex,
        centerRowNo,
        centerColNo,
        returnObj,
        startRow,
        startCol,
        endRow,
        endCol,
        i,
        j,
        rowObj,
        callBack,
        iapi = this,
        iapiGraphics = iapi.graphics,
        iapiConfig = iapi.config,
        grid = iapiGraphics._grid,
        drawGrid = iapiConfig._drawGrid || (iapiConfig._drawGrid = []),
        iapiComponents = iapi.components,
        viewPortConfig = iapiConfig.viewPortConfig,
        scaleX = viewPortConfig.scaleX,
        scaleY = viewPortConfig.scaleY,
        noRow = ceil(scaleY),
        noCol = ceil(scaleX),
        cellWidth = iapiConfig.canvasWidth,
        cellHeight = iapiConfig.canvasHeight,
        xAxis = iapiComponents.xAxis,
        yAxis = iapiComponents.yAxis,
        xAxisConfig = xAxis.config,
        yAxisConfig = yAxis.config,
        xMin = xAxisConfig.min,
        xMax = xAxisConfig.max,
        yMin = yAxisConfig.min,
        yMax = yAxisConfig.max,
        cellXlength = (xMax - xMin) / scaleX,
        cellYlength = (yMax - yMin) / scaleY,

        radius =  iapiConfig.radius * mathMin(viewPortConfig.scaleX,viewPortConfig.scaleY),
        borderWidth = iapiConfig.plotCosmetics.borderWidth,
        padPx = radius + borderWidth,
        xRadiusPad = mathAbs(padPx / (cellWidth * viewPortConfig.scaleX/ xAxisConfig.span)),
        yRadiusPad = mathAbs(padPx / (cellHeight * viewPortConfig.scaleY/ yAxisConfig.span)),

        viewPortOrigW = cellWidth / scaleX,
        viewPortOrigH = cellHeight / scaleY,
        // distance of the sample 4 corner point from the view-port border
        gridPadding = mathMin(1, viewPortOrigW / 10, viewPortOrigH / 10),

        p1GridStore = {}, // grids that will be drawn in phase-1
        // grids that will be added later.
        //Use Array as this will be directly passed to `_drawGridArr`
        p2GridStore = [],

        // get the 4 corner pixel
        leftX = viewPortConfig.x + gridPadding,
        rightX = viewPortConfig.x - gridPadding + viewPortOrigW,
        topY = viewPortConfig.y + gridPadding,
        bottomY = viewPortConfig.y + viewPortOrigH - gridPadding;

    // initially draw max 4 grid (grid of the 4 sample corner point) which are visisble
    // grid of the top-left corner
    gridIndex = iapi._getFocusedGrid(leftX, topY);
    rowObj = p1GridStore[gridIndex.row] || (p1GridStore[gridIndex.row] = {});
    rowObj[gridIndex.col] = true;

    // grid of the top-right corner
    gridIndex = iapi._getFocusedGrid(rightX, topY);
    rowObj = p1GridStore[gridIndex.row] || (p1GridStore[gridIndex.row] = {});
    rowObj[gridIndex.col] = true;

    // grid of the bottom-right corner
    gridIndex = iapi._getFocusedGrid(rightX, bottomY);
    rowObj = p1GridStore[gridIndex.row] || (p1GridStore[gridIndex.row] = {});
    rowObj[gridIndex.col] = true;

    // grid of the bottom-left corner
    gridIndex = iapi._getFocusedGrid(leftX, bottomY);
    rowObj = p1GridStore[gridIndex.row] || (p1GridStore[gridIndex.row] = {});
    rowObj[gridIndex.col] = true;

    /* @todo: support animation*/
    // get the center grid
    returnObj = iapi._getFocusedGrid();

    centerRowNo = returnObj.row;// the center row index
    centerColNo = returnObj.col; // the center column index
    //configurations required to traverse across the center image.
    startRow = mathMax(centerRowNo - 1, 0);
    endRow = mathMin(centerRowNo + 1, noRow - 1);
    startCol = mathMax(centerColNo - 1, 0);
    endCol = mathMin(centerColNo + 1, noCol - 1);


    yMaxValue = yMax - (startRow * cellYlength);
    /*keeping the center grid, get the neighbouring images if present and create the drawGrid to store the grids
     to be drawn*/
    for (i = startRow; i <= endRow; i += 1) {
        rowGrid = grid[i] || (grid[i] = {});
        xMinValue = xMin + (startCol * cellXlength);
        for (j = startCol; j <= endCol; j+=1) {

            element = grid[i][j];

            if (!element) {
                yMinValue = mathMax(yMaxValue - cellYlength, yMin);
                xMaxValue = mathMin(xMinValue + cellXlength, xMax);
                //update the grid element configurations.
                element = grid[i][j] = {
                    xPixel: j * cellWidth,
                    yPixel: i * cellHeight,
                    xMinValue: xMinValue,
                    yMinValue: yMinValue,
                    xMaxValue: xMaxValue,
                    yMaxValue: yMaxValue,
                    drawState: 0, // 0=> not drawn, 1=> drawn, 2=> is drawing

                    // padding to accomodate the partial drawing of the elements of neighbouring grid
                    xMinWPad: mathMax(xMinValue - xRadiusPad, xMin),
                    yMinWPad: mathMax(yMinValue - yRadiusPad, yMin),
                    xMaxWPad: mathMin(xMaxValue + xRadiusPad, xMax),
                    yMaxWPad: mathMin(yMaxValue + yRadiusPad, yMax)

                };
            }

            if (!element.drawState) {
                if (p1GridStore[i] && p1GridStore[i][j]) {
                    //build the stack of the images needed to be drawn in the first phase.
                    drawGrid.push({
                        row : i,
                        col : j
                    });
                }
                else {
                    p2GridStore.push({
                    //build the stack of the images needed to be drawn in the next phase.
                        row : i,
                        col : j
                    });
                }
            }
            xMinValue += cellXlength; //increment the xMinValue after every image is drawn horizontally.
        }
        yMaxValue -= cellYlength; //decrement the yMaxValue after every image is drawn vertically.
    }
    //The visible images are drawn first and the rest images are drawn as a callback of the rest.
    if (drawGrid.length || p2GridStore.length) {
        // create the call back function that will be called once these grids are created
        callBack = function () {
            iapiConfig._drawGrid = p2GridStore;
            // No callback after the 2nd phase
            iapi._drawGridArr();
        };
        // draw the images for 1st phase
        iapi._drawGridArr(callBack);
    }
};

Chart.prototype._getFocusedGrid = function (x, y) {
    // get the focused grid based on the grid center and not the left top.
    var iapi = this,
    iapiConfig = iapi.config,
    viewPortConfig = iapiConfig.viewPortConfig,

    scaleX = viewPortConfig.scaleX,
    scaleY = viewPortConfig.scaleY,
    canvasWidth = iapiConfig.canvasWidth,
    canvasHeight = iapiConfig.canvasHeight,
    //the width and height wrt original unzoomed initial level.
    canOrigW = canvasWidth / scaleX,
    canOrigH = canvasHeight / scaleY,
    //In case the x,y is not defined, the canvas center in its current zoom level is choosen.
    xPixel = isNaN(x) ? viewPortConfig.x + (canOrigW / 2) : x,
    yPixel = isNaN(y) ? viewPortConfig.y + (canOrigH / 2) : y;

    return {
        'row': mathFloor(yPixel / canOrigH),
        'col': mathFloor(xPixel / canOrigW)
    };
};
        
Chart.prototype._drawGridArr = function (callBack) {
    // draw grids and delete them from the drawGridarr once completed
    var gridIndexElem,
        gridElem,
        canvasElem,
        ctx,
        iapi = this,
        iapiConfig = iapi.config,
        iapiComponents = iapi.components,
        viewPortConfig = iapiConfig.viewPortConfig,
        gridIndexArr = iapiConfig._drawGrid, // list of images to be drawn.
        gridSubArr = [],
        iapiGraphics = iapi.graphics,
        gridContainer = iapiGraphics.container,
        paper = iapiComponents.paper,
        width = iapiConfig.canvasWidth,
        height = iapiConfig.canvasHeight,
        grid = iapiGraphics._grid,
        imagePool = iapiGraphics._imagePool || [],
        canvasPool = iapiGraphics._canvasPool || [],
        plotCosmetics = iapiConfig.plotCosmetics,
        data = iapiComponents.data,
        //update the radius with every zoom configurations.
        radius =  iapiConfig.radius * mathMin(viewPortConfig.scaleX, viewPortConfig.scaleY);

    if (gridIndexArr.length) {
        while (gridIndexArr.length) {
            gridIndexElem = gridIndexArr.shift();
            gridElem = grid[gridIndexElem.row][gridIndexElem.col];


            if (gridElem.drawState === 2) {
                continue;
            }
            gridElem.drawState = 2;
            // add the image from the pool
            if (imagePool.length) {
                gridElem.image = imagePool.shift();
            }
            else {
                // create the image element.
                gridElem.image = paper.image('', gridContainer);
            }

            // set the image dimensions.
            gridElem.image.attr({
                x : gridElem.xPixel,
                y : gridElem.yPixel,
                width : width,
                height : height
            });

            // add the canvas element from the pool
            if (canvasPool.length) {
                gridElem.canvas = canvasElem = canvasPool.shift();
            }
            else {
                // create the canvas if it doesnot exist.
                gridElem.canvas = canvasElem = win.document.createElement('canvas');
            }

            // set the canvas dimensions
            canvasElem.setAttribute('width', width);
            canvasElem.setAttribute('height', height);
            ctx = gridElem.ctx = canvasElem.getContext('2d'); // cache the context of the canvas element.

            // apply the cosmetics of the anchors.
            if (radius < 1) {
                /* incase of very small radius, set the fill as stroke-style and draw a dot. This is acts as a
                leverage on performance.*/
                ctx.strokeStyle= plotCosmetics.fillStyle;
                ctx.lineWidth = 0.5;
            }
            else {
                ctx.fillStyle = plotCosmetics.fillStyle;
                ctx.strokeStyle = plotCosmetics.strokeStyle;
                ctx.lineWidth = plotCosmetics.borderWidth;
            }
            gridSubArr.push(gridElem);
        }

        // reset the batch drawing index
        iapiConfig._batchDrawindex = (data && data.length - 1) || 0;
        //start drawing the images in batches.
        iapi._drawGridArrBatch(gridSubArr, callBack, !iapiConfig.animation.enabled);
    }
    else { // if there is nothing to draw then call the callBack
        callBack && callBack();
    }
};
        
Chart.prototype._drawGridArrBatch = function (gridArr, callBack, doNotUpdateImage) {
    var cx,
        cy,
        cx1,
        cx2,
        cy1,
        cy2,
        y1,
        y2,
        storeX,
        j,
        gridElem,
        ctx,
        lineCtx,
        element,
        minX,
        xMinValue,
        yMaxValue,
        leftElement,
        lineImage,
        lineCanvas,
        minY,
        maxX,
        maxY,
        image,
        canvas,
        regresionPoints,
        iapi = this,
        iapiConfig = iapi.config,
        iapiComponents = iapi.components,
        width = iapiConfig.canvasWidth,
        plotCosmetics = iapiConfig.plotCosmetics,
        i = iapiConfig._batchDrawindex,
        arr = iapiComponents.data,
        chunkSize = iapiConfig.chunkSize,
        endIndex = i - chunkSize,
        xAxis = iapiComponents.xAxis,
        yAxis = iapiComponents.yAxis,

        radius =  iapiConfig.zoomedRadius,
        xPVR = xAxis.getPVR(),
        yPVR = yAxis.getPVR(),

        //stores the already plotted pixels for caching and performance improvement.
        _store = iapiConfig._store || [],
        // doStroke for the plot is set to TRUE only if there exists a lineWidth or radius is less than 1 pixel
        doStroke = (plotCosmetics.lineWidth || (radius < 1));

    //clear all the previous visual for the canvas grid and update its cosmetics.
    for (j = 0; j < gridArr.length; j += 1) {
        gridArr[j].ctx.beginPath();
    }

    endIndex = endIndex <= 0 ? 0 : endIndex; // lower limit is 0

    for (; i >= endIndex; i-=1) {
        element = arr[i];
        //Check for NaN value.
        if (!element || isNaN(element.x) || isNaN(element.y)) {
            continue;
        }
        //Check which grid is the element lying and draw it in that grid.
        for (j = 0; j < gridArr.length; j += 1) {
            gridElem = gridArr[j];

            xMinValue = gridElem.xMinValue;
            yMaxValue = gridElem.yMaxValue;
            if ((element.x < gridElem.xMinWPad || element.x > gridElem.xMaxWPad) ||
                (element.y < gridElem.yMinWPad  || element.y > gridElem.yMaxWPad)) {
                continue;
            }

            ctx = gridElem.ctx;

            cx = mathRound((element.x - xMinValue) * xPVR); // value to pixel conversions
            cy = mathRound((yMaxValue - element.y) * yPVR); // value to pixel conversions

            /* Incase there is already a point being drawn with exact same center pixelwise, there is no need to
             draw again. This can happen when two data points are very closely placed. This caching is done in
             _store */
            storeX = _store[cx];

            if (!storeX) {
                storeX = _store[cx] = {};
            }

            if (!storeX[cy]) {

                storeX[cy] = true; //set the flag of a circle being drawn at that pixel to TRUE
                if (radius < 1){
                    /* Drawing a dot seemed to have a performance preference to drawing an arc. So if radius
                    turns less than 1 pixel, drawing a dot is prefered. */
                    ctx.moveTo(cx, cy);
                    ctx.lineTo(cx+1, cy);
                }
                else {
                    ctx.moveTo(cx+radius, cy);
                    ctx.arc(cx,cy,radius,0,pi2);
                }
            }
        }
    }

    //clear all the previous visual for the canvas grid and update its cosmetics.
    for (j = 0; j < gridArr.length; j += 1) {
        gridElem = gridArr[j];
        ctx = gridElem.ctx;
        ctx.fill();
        doStroke && ctx.stroke();
        ctx.closePath();
    }
    // reset the _batchDrawindex
    iapiConfig._batchDrawindex = i;

    // if there is any remaning drawing to be drawn
    if (i >= 0) {

        if (!doNotUpdateImage) {
            //update all the grid images for the visual clue.
            for (j = 0; j < gridArr.length; j += 1){
                image = gridArr[j].image;
                canvas = gridArr[j].canvas;
                // update the src of the images.
                image.attr({
                    'src': canvas.toDataURL('image/png')
                });
            }
        }

        // store the timers to future cancellation
        (iapiConfig._batchDarwTimers || (iapiConfig._batchDarwTimers = [])).push(
            setTimeout(function () {
                iapi && iapi._drawGridArrBatch(gridArr, callBack, doNotUpdateImage);
            }, 0));
    }

    // drawing completed
    else {
        // remove the temp store arr
        delete iapiConfig._store;
        
        //update all the grid images for the visual clue.
        for (j = 0; j < gridArr.length; j += 1) {

            gridElem = gridArr[j];

            image = gridElem.image;
            canvas = gridElem.canvas;
            gridElem.drawState = 1; // set the drawState flag as drawn.

            image.attr({
                'src': canvas.toDataURL('image/png')
            });
        }
        console.log(performance.now() - time1);
        if (!iapi.tree) {
            // create the kdtree in a seperate thread
            setTimeout(function (){
                iapi._buildKdTree();
            },250);
        }

        // invoke the completion callBack
        callBack && callBack();
    }
};
Chart.prototype.zoomSelection = function (x, y, w, h) {
    var iapi = this,
        iapiConfig = iapi.config,
        scaleX,
        scaleY,
        newWidth,
        newHeight,
        maxX,
        maxY,
        newOriginX,
        newOriginY;


    // if the width or height is 0 return it
    if (!w || !h) {
        return;
    }
    //scale factors cannnot be negatives.
    scaleX = Math.abs(iapiConfig.canvasWidth / w);
    scaleY = Math.abs(iapiConfig.canvasHeight / h);
    //total dimensions it would look alike when zoomed with these scale factors
    newWidth = iapiConfig.canvasWidth * scaleX;
    newHeight = iapiConfig.canvasHeight * scaleY;
    //the amount to be shifted so that the zoom portion falls in the visible area.
    newOriginX = x * scaleX;
    newOriginY = y * scaleY;
    //impose restrictions on the boundaries.
    maxX = (newWidth - iapiConfig.canvasWidth);
    maxY = (newHeight - iapiConfig.canvasHeight);

    //left top restricition
    newOriginX = (newOriginX < 0) ? 0 : newOriginX;
    newOriginY = (newOriginY < 0) ? 0 : newOriginY;

    //right bottom restriction
    newOriginX = (newOriginX > maxX) ? maxX : newOriginX;
    newOriginY = (newOriginY > maxY) ? maxY : newOriginY;
    //update the final visual(drawing) part.
    iapi.updateVisual(x, y, scaleX, scaleY);
}

Chart.prototype.updateSelectionBox = function (x1,y1,x2,y2) {
    var iapi = this,
        iapiComponents = iapi.components,
        iapiConfig = iapi.config,
        iapiGraphics = iapi.graphics,
        paper = iapiComponents.paper,
        viewPortConfig = iapiConfig.viewPortConfig,
        cursor = iapiConfig.cursor,
        selectionBox = iapiGraphics.selectionBox,
        canvasRight = iapiConfig.canvasRight,
        canvasLeft = iapiConfig.canvasLeft,
        canvasTop = iapiConfig.canvasTop,
        canvasBottom = iapiConfig.canvasBottom,
        smallerX = (x1 < x2) ? x1: x2,
        smallerY = (y1 < y2) ? y1 : y2,
        largerX = (x1 > x2) ? x1 : x2,
        largerY = (y1 > y2) ? y1 : y2,

        /*Width and Height are temporary used in determining the cursor mode and updated later*/
        width = x2-x1,
        height = y1-y2;

    //change the cursor modes according to the width and height
    if (cursor) {
        if (width > 0 && height > 0) {
            cursor = 'ne-resize';
        }
        else if (width < 0 && height > 0) {
            cursor = 'nw-resize';
        }
        else if (width < 0 && height < 0){
            cursor = 'sw-resize';
        }
        else if (width > 0 && height < 0) {
            cursor = 'se-resize';
        }
        //reset the cursor to default once the selection box is removed(atleast visually)
        //i.e. width and height = 0
        else {
            cursor = STR_DEF; //default cursor.
        }
    }
    else{
        cursor = STR_DEF;
    }
    //dimension for the selectionBox cannot be exceeded than the canvas area dimensions.
    largerX = (largerX > canvasRight) ? canvasRight : ((largerX < canvasLeft) ? canvasLeft : largerX);
    largerY = (largerY > canvasBottom) ? canvasBottom : ((largerY < canvasTop) ? canvasTop : largerY);
    smallerX = (smallerX < canvasLeft) ? canvasLeft : ((smallerX > canvasRight) ? canvasRight : smallerX);
    smallerY = (smallerY < canvasTop) ? canvasTop : ((smallerY > canvasBottom) ? canvasBottom : smallerY);

    width = (x1 === x2 && y1 === y2) ? 0 : (largerX - smallerX);
    height = (x1 === x2 && y1 === y2) ? 0 : (largerY - smallerY);

    if (selectionBox){
        //update the dimensions and posiitons of the selection Box.
        selectionBox.attr({
            x: smallerX,
            y: smallerY,
            width: width,
            height: height,
            cursor: cursor
        });
        iapiGraphics.trackerGroup.attr({ //update the cursor shape.
            cursor: cursor
        });
    }
    //Create the selection Box.
    else{
        //shouldnot be hardcoded.
        selectionBox = iapiGraphics.selectionBox =  paper.rect(smallerX,smallerY,width,height).attr({
            'stroke-width': 1,
            'stroke': 'red',
            'fill': '#00FF00',
            'opacity': 0.2,
            'cursor': cursor
        });
        iapiGraphics.trackerGroup.attr({ //update the cursor shape.
            cursor: cursor
        });
    }

    iapiConfig.cursor = cursor;
    //store the selection Box dimensions for future reference.
    if (!viewPortConfig.selectionDimensions) {
        viewPortConfig.selectionDimensions = {
            startX: 0,
            endX: 0,
            startY: 0,
            endY: 0
        };
    }
    //update the dimensions.
    viewPortConfig.selectionDimensions.startX = x1;
    viewPortConfig.selectionDimensions.endX = y1;
    viewPortConfig.selectionDimensions.startY = x2;
    viewPortConfig.selectionDimensions.endY = y2;
};

Chart.prototype.getValue = function (point) {
    var iapi = this,
        iapiConfig = iapi.config,
        iapiComponents = iapi.components,
        viewPortConfig = iapiConfig.viewPortConfig,
        //the pixel wrt original canvas size
        origpixel = iapi.getOriginalPositions(point.x,point.y,point.x,point.y),
        origX = origpixel[0],
        origY = origpixel[1],
        xAxis = iapiComponents.xAxis,
        yAxis = iapiComponents.yAxis,
        xaxisRange = xAxis.config.axisRange,
        yaxisRange = yAxis.config.axisRange,
        minX = xAxis.min,
        maxX = xAxis.max,
        maxY = yAxis.max,
        minY = yAxis.min,
        //calcualte the Pixel to Value Ratios.
        xPVR = iapiConfig.canvasWidth * viewPortConfig.scaleX / (maxX - minX),
        yPVR = iapiConfig.canvasHeight * viewPortConfig.scaleY / (maxY - minY);

    return {
        x: minX + ((origX - iapiConfig.canvasLeft) / xPVR),
        y: maxY - ((origY - iapiConfig.canvasTop) / yPVR)
    };
};

Chart.prototype.getOriginalPositions = function (x1,y1,x2,y2) {
    var newW,
        newH,
        newX,
        newY,
        iapi = this,
        iapiConfig = iapi.config,
        viewPortConfig = iapiConfig.viewPortConfig,
        oldScaleX = viewPortConfig.scaleX,
        oldScaleY = viewPortConfig.scaleY,
        //coodinates of the visual canvas origin wrt to original canvas.
        oldX = viewPortConfig.x,
        oldY = viewPortConfig.y,

        xMin = mathMin(x1, x2),
        xMax = mathMax(x1, x2),
        yMin = mathMin(y1, y2),
        yMax = mathMax(y1, y2);

    //Right Bottom limit boundary
    xMax = xMax > iapiConfig.canvasWidth ? iapiConfig.canvasWidth : xMax;
    yMax = yMax > iapiConfig.canvasHeight ? iapiConfig.canvasHeight : yMax;
    //Left Top Limit Boundary
    xMin = xMin < 0 ? 0 : xMin;
    yMin = yMin < 0 ? 0 : yMin;
    // update the dimensions wrt to initial viewPort configurations.
    newW = (xMax - xMin ) / oldScaleX;
    newH = (yMax - yMin ) / oldScaleY;
    newX = oldX + (xMin / oldScaleX);
    newY = oldY + (yMin / oldScaleY);
    //converts to the coordinates wrt original image
    return [newX, newY, newW, newH];
};





        
Chart.prototype._buildKdTree = function () {
    var iapi = this,
        iapiConfig = iapi.config,
        iapiComponents = iapi.components,
        JSONData = iapi.components.data;
    /* Create a replica of the original JSON data to avoid manipulations in the original array. This replica is
    created and destroyed only for the sole purpose of making the tree. Once the tree is made, its deleted and
    is no more required.*/
    iapiConfig._kdPoints = (JSONData || []).slice();

    if (!iapiComponents.kDTree) {
        //Create a new instance of the KdTree class and store its reference in the current instance.
        iapiComponents.kDTree = new KdTree();
    }

    iapiComponents.kDTree.buildKdTree(iapiConfig._kdPoints); // Build the tree structure.
    delete iapiConfig._kdPoints; // delete the replicated array.
};
Chart.prototype._bestNeighbour = function (point) {
    var iapi = this,
        iapiComponents = iapi.components,
        iapiConfig = iapi.config,
        xAxis = iapiComponents.xAxis,
        yAxis = iapiComponents.yAxis,
        canvasLeft = iapiConfig.canvasLeft,
        canvasTop = iapiConfig.canvasTop,
        cx,
        cy,
        i,
        dist,
        showHoverEffect,
        pos,
        datasetObj,
        kdPoint,
        hoverPoint,
        hoverDistance,
        hoveredRadius,

        setTooltext,
        toolTipSepChar,
        x,
        y,
        formatedVal,
        datasetConfig,
        label,
        toolText;

    showHoverEffect = iapiConfig.showHoverEffect;
    if (!iapiComponents.kDTree) {
        /*the search is not required either the tree is not build and mouse move occurs or that dataset is
        cuurently hidden after some legend interaction*/
        return;
    }
    //searches the nearest neighbouring point of the input point.
    kdPoint = iapi.getElement(point);
    //calculates the distance of the fetched neighbouring point and the recieved point.
    dist = iapi._dist(point,kdPoint);

    if (!hoverPoint || dist < hoverDistance) {
        //if within a permissible distance the neighbouring point is found.
        pos = i;
        hoverPoint = kdPoint;
        //update the minimum of the distance among the other dataset.
        hoverDistance = dist;
        //zoomedRadius is the radius of the plot in a particular zoom level.
        hoveredRadius = iapiConfig.zoomedRadius || 0;
    }
    
    // if nearest point is within distance range highlight the tooltip
    if (hoverDistance <= mathMax((hoveredRadius + 2), 5)) {
        //convert to pixels for the center of the plot.
        /*cx = Math.round(startX + ((hoverPoint.x - minX) * xPVR));
        cy = Math.round(startY + ((maxY - hoverPoint.y) * yPVR));*/
        cx = xAxis.getPixel(hoverPoint.x) - canvasLeft;
        cy = yAxis.getPixel(hoverPoint.y) - canvasTop;
        setTooltext = hoverPoint.tooltext || iapiConfig.plotToolText;
        toolTipSepChar = iapiConfig.tooltip.toolTipSepChar;
        x = hoverPoint.x;
        y = hoverPoint.y;
        if (hoverPoint) {
            //applying the axis specific number formatter required in tooltip
            if (Number(iapiConfig.showToolTip)) {
                if (setTooltext !== undefined) {
                    toolText = setTooltext;
                }
                else {
                    //determine the tooltext then.
                    toolText =  'x:' + mathRound(x * 100)/100  + toolTipSepChar + ' y:' + mathRound(y * 100)/100;
                }
            }
            else {
                toolText = BLANKSTRING;
            }
        }
        //highlightPoint() is not called if the recent found point is same as the last hovered point.
        if (iapiConfig.lastHoveredPoint !== hoverPoint) {
            //update the tracker circle and display the tooltext if required.
            iapi.highlightPoint(showHoverEffect, cx, cy, hoverPoint, pos, toolText);
        }

    }
    else { // else hide the tooltip
        iapi.highlightPoint(false);
    }
};

Chart.prototype.getElement = function (point) {
    var iapi = this,
        kDTree = iapi.components.kDTree;
    if (kDTree) {
        // searches the neighbouring points using the kdtree instance.
        return kDTree.getNeighbour(point);
    }
};

Chart.prototype._dist = function (point1, point2) {
    var chart = this,
        chartComponents = chart.components,
        dx,
        dy,
        xAxis = chartComponents.xAxis,
        yAxis = chartComponents.yAxis;

    if (point1 && point2) {
        dx = (point1.x - point2.x) * xAxis.getPVR();
        dy = (point1.y - point2.y) * yAxis.getPVR();
        //point to point distance.
        return Math.sqrt(Math.pow(dx,2)+Math.pow(dy,2));
    }
}

Chart.prototype.highlightPoint = function (showHover,cx,cy,point,index, toolText) {
    var iapi = this,
        iapiConfig = iapi.config,
        iapiComponents = iapi.components,
        iapiGraphics = iapi.graphics,
        paper = iapiComponents.paper,
        tracker = iapiGraphics.tracker,
        radius = iapiConfig.zoomedRadius || 0,
        hoverCosmetics = iapiConfig.hoverCosmetics,
        fill = hoverCosmetics && hoverCosmetics.fill,
        borderColor = hoverCosmetics && hoverCosmetics.borderColor,
        borderThickness = hoverCosmetics && hoverCosmetics.borderThickness,
        attrObj = {},
        //attach the callbacks for the click and hover interactions for the hovering element.
        plotEventHandlerCallback = {
            'click': function (e){
                showToolTip('<br>Clicked on it', true);
                console.log('Clicked on it');
            },
            'hoverIn': function (e){
                var obj = this.data('eventArgs').tooltip;
                showToolTip('<b>Hovered on</b>: ' + obj);
            },
            'hoverOut': function (e) {
                showToolTip(BLANKSTRING);
            }
        },
        setLink = point && point.link;

    if (!tracker) {
        // in case the tracker element is not created. Attach the callbacks for click and hovering effects.
        tracker = iapiGraphics.tracker = paper.circle(0, 0, 0, iapiGraphics.trackerGroup)
        .attr({
            'clip-rect': iapiConfig.canvasLeft + ',' + (iapiConfig.canvasTop) + ',' +
                iapiConfig.canvasWidth + ',' + iapiConfig.canvasHeight
        })
        .click(plotEventHandlerCallback.click)
        .hover(plotEventHandlerCallback.hoverIn, plotEventHandlerCallback.hoverOut);
    }
    //Attach the required information for the hovering element.
    point && tracker.data('eventArgs', {
        x: point.x,
        y: point.y,
        tooltip: toolText,
        link: setLink
    });

    /* store the hovered point as last visible point. This is required to avoid redaundant calls if the same
    point is hovered. */
    iapiConfig.lastHoveredPoint = point;

    // if hover cosmetics then add that in the attrObj
    if (Number(showHover)) {
        attrObj = {
            r: radius,
            fill: fill,
            stroke: borderColor,
            'stroke-width': borderThickness
        };
    }
    else { // make transparent configuration
        attrObj = {
            r: radius,
            fill: TRACKER_FILL,
            stroke: TRACKER_FILL,
            'stroke-width': 0
        };
    }
    attrObj.cursor = setLink ? POINTER : '',
    tracker
    .attr(attrObj)
    .transform('t' + (cx + iapiConfig.canvasLeft) + ',' + (cy + iapiConfig.canvasTop));
    /*on first mouse move the element is created and on the next mouse move the tooltip is shown. In order give
    the effect of displaying the tooltip once hovered, another mouseMove event is fired forcefully */
    point && fireMouseEvent('mouseover', tracker && tracker.node, iapiConfig.lastMouseEvent);
}





Chart.prototype.addButtons = function (buttonArr, container) {
    var i,
        len,
        elem,
        button;
    for (i = 0, len = buttonArr.length; i < len; i += 1) {
        elem = buttonArr[i];
        button = document.createElement("input");
        button.type = "button";
        button.value = elem.name;
        button.onclick = elem.clickFN;
        container.appendChild(button);
    }
}

