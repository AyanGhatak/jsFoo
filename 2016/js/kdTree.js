var sortXFn,
    sortYFn, 
    UNDEFINED;
/*
 * compareFunction : An optional argument for Array.Prototype.sort(). Used to change the default sorting order.
 * @param a {Object} and @param b {Object} - two elements being compared during the sort.
*/
// sorts the Array w.r.t to 'x' property of the array elements in an ascending order.
sortXFn = function (a, b) {
    return a.x - b.x;
};
// sorts the Array w.r.t to 'y' property of the array elements in an ascending order.
sortYFn = function (a, b) {
    return a.y - b.y;
};
/*
 * The entire data of the dataset is converted to a tree like structure(namely kdTree).
 * This is very useful to traverse and extract details(e.g. for a tooltip) from a million array elements especially
 * to extract information of the hovered plot on each mouseMove.
 * @constructor
 */
function KdTree () {

}

KdTree.prototype = {
    /*
     * Builds the tree structure from the data points provided.
     * @param points {Array} - The set level elements belonging to a particular dataset
     * Updates the tree structure in the tree property of the current instance.
     */
    buildKdTree: function (points) {
        /*
         * _buildKdTree is for the internal use to build the tree recursively.
         * @param points {Array} - The set level elements.
         * @param isX {Boolean} - isX determines the sorting order. Initially setting the isX = false ensures that
         * the initial sorting order of the array is w.r.t to y - axis
        */
        this.tree = this._buildKdTree(points, false);
    },
    /*
     * Returns the nearest point to the point given.
     * @param point {Object} - the point of reference in whose neighbour the point required is to be returned
     * @return {Object} - The neighbouring point w.r.t to the point is hunted and returned once within limits
    */
    getNeighbour : function (point) {
        var kDTreeObj = this, // Instance of the kdTree class specific to indivual dataset instance.
            tree = kDTreeObj.tree, // refer to the created tree like structure for that dataset instance.
            // limitBox - set the limiting boundaries for the neighbour hunt of the given point.
            limitBox = {
                x1: point.x - kDTreeObj.xLimit,
                x2: point.x + kDTreeObj.xLimit,
                y1: point.y - kDTreeObj.yLimit,
                y2: point.y + kDTreeObj.yLimit
            },
            //function specific to a paricular point that retruns Boolean if the neighbour searched is within limits
            validatorFn = kDTreeObj._getIsWithinLimitFn(point);
        //When the renderring turns heavy, probably then the tree is not yet build.
        // Proceed further only if the tree exists.
        if (tree) {
            // search the nearest points within limits and return it.
            return kDTreeObj._searchBtwnLimit(limitBox, tree, false, validatorFn);
        }
    },

    /*
     * Check Function: To determine if the mouseMove Point and the point to be searched are within limits
     * @param mousePoint {Object} - point extracted from the mouseMove.
     * @return {Function} - Returns if the setElem is in limit wrt the mouseMoved point.
    */
    _getIsWithinLimitFn: function (mousePoint) {
        var kdTreeObj = this;
        return function(setElem) {
            //Refer to the 2-D distance formula for two points
            // @returns {Boolean} - If the calculated distances are within the limits.
            return setElem && (Math.pow((setElem.x - mousePoint.x) / kdTreeObj.xLimit, 2) +
             Math.pow((setElem.y - mousePoint.y) / kdTreeObj.yLimit, 2) <= 1) ? true : false;
        };

    },
    /*
     * If two points are very closely spreaded, the point that was parsed later is given preference and returned
     hence.
     * This is important when two plots are very near, the tooltip and hover effects of the one that comes avobe is
     being displayed
     * @param p1 {Object} - The first point being compared.
     * @param p2 {Object} - The second point being compared in close vicinity of the first point (p1).
     * @return {Object} - The point that occurs later in the JSON data gets the preference.
    */
    _compair2closest: function (p1, p2) {
        if (p1){
            if(p2) {
                //i property shows the posiition of that particular element in input data
                return p2.i > p1.i ? p2 : p1;
            }
        }
        else {
            return p2; //incase first point is undefined.
        }
        return p1;
    },
    /*
     * Search and return the nearest neighbouring point in the pre defined limits.
     * @param limitBox {Object} - Boundary conditions for the tolerance for the neighbourhood search.
     * @param tree {Object} - The tree within which the point is needed to be searched,
     * @param isX {Boolean} - Flag representative of the axis. This gets swapped everytime the function is called
     recursively
     * @param validatorFn {Function} - Returns if the point is within the limits.
     * @return returnPoint {Object} - neighbouring point.
    */
    _searchBtwnLimit : function(limitBox, tree, isX, validatorFn) {
        var point1,
            point2,
            point3,
            returnPoint,
            kdTreeObj = this,
            axis = isX? 'x': 'y',
            // get the lower and upper limits in accordance to the axis being referenced.
            lowerLimit = isX ? limitBox.x1 : limitBox.y1,
            upperLimit = isX ? limitBox.x2 : limitBox.y2;

        if (tree) { //Proceed further only when tree is defined.
            // when the point is not valid, set the upper limit as the value
            point1 = tree.point1 ? tree.point1[axis] : upperLimit;
            point2 = tree.point2 ? tree.point2[axis] : upperLimit;
            point3 = tree.point3 ? tree.point3[axis] : upperLimit;

            // point1 is within limit;
            if (validatorFn(tree.point1)) {
                //In case of two closely spaced points, they are chosen preferably using _compair2closest()
                returnPoint = kdTreeObj._compair2closest(returnPoint, tree.point1);
            }
            // search the left side if required
            if (point1 >= lowerLimit) {
                if (tree.left) { // if left is available then search on left
                    returnPoint = kdTreeObj._compair2closest(returnPoint,
                        kdTreeObj._searchBtwnLimit(limitBox, tree.left, !isX, validatorFn));
                }
            }
            // search the right side if required
            if (point1 <= upperLimit) {
                if (tree.middle1) {
                    // point2 is within limit;
                    if (validatorFn(tree.point2)) {
                        returnPoint = kdTreeObj._compair2closest(returnPoint, tree.point2);
                    }
                    // search the left side if required
                    if (point2 >= lowerLimit) {
                        // if middle1 is available then search on middle1
                        returnPoint = kdTreeObj._compair2closest(returnPoint,
                            kdTreeObj._searchBtwnLimit(limitBox, tree.middle1, !isX, validatorFn));
                    }
                    // search the right side if required
                    if (point2 <= upperLimit) {
                        if (tree.middle2) {
                            // point2 is within limit;
                            if (validatorFn(tree.point3)) {
                                returnPoint = kdTreeObj._compair2closest(returnPoint, tree.point3);
                            }
                            // search the left side if required
                            if (point3 >= lowerLimit) {
                                // if middle1 is available then search on middle1
                                returnPoint = kdTreeObj._compair2closest(returnPoint,
                                    kdTreeObj._searchBtwnLimit(limitBox, tree.middle2, !isX, validatorFn));
                            }
                            // search the right side if required
                            if (point3 <= upperLimit) {
                                if (tree.right) {
                                    // if middle1 is available then search on middle1
                                    returnPoint = kdTreeObj._compair2closest(returnPoint,
                                        kdTreeObj._searchBtwnLimit(limitBox, tree.right, !isX, validatorFn));
                                }
                            }
                        }
                    }
                }
            }
            return returnPoint;
        }
    },

    /*
     * Builds a tree structure from a given list of array elements.
     * Divide the entire array in four parts with a single elements in seperating them.
     * In case of leaf nodes, any of the point remains defined and the rest portions and points as undefined.
     * @param points {Object} - The array of elements which needs to be transformed into a tree structure.
     * @param isX {Boolean} - Flag to represent the axis, which gets altered on every recursive call.
     * @return {Object} - {
        left {Object} - The first and the leftmost part of the four division
        point1 {Object} - The element seperating the first and sencond divisions
        middle1 {Object} - The middle division out of the four divisions
        point2 {Object} - The element seperating second and third divisions
        middle2 {Object} - The second last division
        point3 {Object} - The element seperating the middle2 and the right portion
        right {Object} - The rightmost or the last division of the array
     } - This is the tree like format being build out of a array structure.
    */
    _buildKdTree: function (points, isX) {
        var index1,
            index2,
            index3,
            length = points && points.length,
            datasetObj = this;
        if (length) {
            // sort point array where compare Functions are dependent on the isX Boolean flag
            points.sort(isX ? sortXFn : sortYFn);

            if (length > 7) {
                index1 = Math.floor(length / 4); // divide the entire array in quaters
                // indexes used for determining middle1, and middle2 portions and point2
                index2 = ((index1 + 1) * 2) - 1;
                // indexes used for determining right, and middle2 portions and point3
                index3 = ((index1 + 1) * 3) - 1;
                return {
                    left: datasetObj._buildKdTree(points.slice(0, index1), !isX),
                    point1: points[index1],
                    middle1: datasetObj._buildKdTree(points.slice(index1 + 1, index2), !isX),
                    point2: points[index2],
                    middle2: datasetObj._buildKdTree(points.slice(index2 + 1, index3), !isX),
                    point3: points[index3],
                    right: datasetObj._buildKdTree(points.slice(index3 + 1), !isX)
                };
            }
            /* if the array length is less than 7, we hardcodedly set the properties to avoid the excess
            _buildKdTree calls.*/
            else {
                return {
                    /*Length can be thus 1,2,3,4,5,6 or 7
                    Left portion do not exist if there are less than 3 elements and hence made UNDEFINED*/
                    left: (length >= 2) ? {
                        point1: points[0]
                    } : UNDEFINED,
                    //in case length = 1, it is points[0], or if length === 2, it is points[1], orelse undefined.
                    point1: (length >= 1) ? (length === 1 ? points[0] : points[1]) : UNDEFINED,
                    middle1: (length >= 3) ? {
                        point1: points[2]
                    } : UNDEFINED,
                    point2: (length >= 4) ? points[3] : UNDEFINED,
                    middle2: (length >= 5) ? {
                        point1: points[4]
                    } : UNDEFINED,
                    point3: (length >= 6) ? points[5] : UNDEFINED,
                    right: (length == 7) ? {
                        point1: points[6]
                    } : UNDEFINED
                };
            }
        }
    },

    /*
     * Sets the tolerance limit for kdTree search after every zoom level
     * @param xLimit {Number} - The limiting tolerance in the x-axis
     * @param yLimit {Number} - The limiting tolerance in the y-axis
     */
    _setSearchLimit : function (xLimit,yLimit) {
        var kdTree = this;
        //sets the x and y limits.
        kdTree.xLimit = xLimit;
        kdTree.yLimit = yLimit;
    }
};
//reset the constructor
KdTree.prototype.constructor = KdTree;