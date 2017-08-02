// Class
// @param {google.maps.Map} map
// @param {[]} opts
// @param {int} max Maximum points in the polygon.
// @param {function} onChange The event that's triggered everything this control changes value.
function PolygonEditor(map, opts, max, imagePath, onChange, pcoords, label, labelOffsetX, labelOffsetY) {

    if (typeof label == 'undefined')
        this.label = "";
    else
        this.label = label;


    if (typeof labelOffsetX == 'undefined')
        this.labelOffsetX = 0;
    else
        this.labelOffsetX = labelOffsetX;


    if (typeof labelOffsetY == 'undefined')
        this.labelOffsetY = 0;
    else
        this.labelOffsetY = labelOffsetY;


    this.map = map;

    this.poly = null;

    this.coords = [];

    this.markers = [];

    this.operationHistoryIndex = null;

    this.operationHistory = [];

    this.polyOptions = opts;

    this.max = max;

    this.imagePath = imagePath;

    this.onChange = onChange;

    this.clickListener = null;

    this.dragIndex = -1;

    var that = this;

    this.keyDownHandler = function(e) {
        var evtobj = window.event? event : e
        if (evtobj.keyCode == 90 && evtobj.ctrlKey)
        {
            that.undo();
        } else if (evtobj.keyCode == 89 && evtobj.ctrlKey)
        {
            that.redo();
        }

    };

    $(document).keydown(this.keyDownHandler);

    this.clickListener = google.maps.event.addListener(this.map, 'click', function (event) {

        var insertIndex = that.add(event.latLng);

        that.logOperation({
            operationType: "Add",
            elementType: "Vertex",
            elementIndex: insertIndex,
            previousValue: event.latLng,
            nextValue: event.latLng
        })
    });

    this.map.setOptions({ draggableCursor: 'crosshair' });

    if(pcoords!=null) {
        for(var i=0;i < pcoords.length; i++) {
            var isDuplicate = false;
            for (var j=0; j < this.coords.length; j++) {
                if (this.coords[j].lat() == pcoords[i].lat && this.coords[j].lng() == pcoords[i].lng) {
                    isDuplicate = true;
                }
            }
            if (!isDuplicate) {
                this.coords.push(new google.maps.LatLng(pcoords[i].lat(),pcoords[i].lng()));
            }
        }
    }

    this.draw();
}

PolygonEditor.prototype.undo = function() {
    if (this.operationHistoryIndex == null)
        return;

    var operationToUndo = this.operationHistory[this.operationHistoryIndex];

    if (operationToUndo.operationType == "Move") {
        if (operationToUndo.elementType == "Vertex") {
            this.move(operationToUndo.previousValue, operationToUndo.elementIndex);
        } else if (operationToUndo.elementType == "Name") {
            this.labelOffsetX = operationToUndo.previousValue.lat;
            this.labelOffsetY = operationToUndo.previousValue.lng;
        } else {
            throw new Error("Invalid elementType");
        }
    } else if (operationToUndo.operationType == "Remove") {
        this.add(operationToUndo.previousValue);
    } else if (operationToUndo.operationType == "Add") {
        this.removeVertex(operationToUndo.elementIndex);
    } else if (operationToUndo.operationType == "Rename") {
        this.label = operationToUndo.previousValue;
    } else {
        throw new Error("Invalid operationType");
    }

    if (this.operationHistoryIndex == 0)
        this.operationHistoryIndex = null;
    else
        this.operationHistoryIndex--;

}

PolygonEditor.prototype.redo = function() {
    if ((this.operationHistoryIndex == null && this.operationHistory.length == 0) ||
        (this.operationHistoryIndex != null && this.operationHistoryIndex + 1 == this.operationHistory.length))
        return;

    if (this.operationHistoryIndex == null && this.operationHistory.length > 0)
        this.operationHistoryIndex = 0;
    else
        this.operationHistoryIndex++;


    var operationToRedo = this.operationHistory[this.operationHistoryIndex];

    if (operationToRedo.operationType == "Move") {
        if (operationToRedo.elementType == "Vertex") {
            this.move(operationToRedo.nextValue, operationToRedo.elementIndex);
        } else if (operationToRedo.elementType == "Name") {
            this.labelOffsetX = operationToRedo.nextValue.lat;
            this.labelOffsetY = operationToRedo.nextValue.lng;
        } else {
            throw new Error("Invalid elementType");
        }
    } else if (operationToRedo.operationType == "Remove") {
        this.removeVertex(operationToRedo.elementIndex);
    } else if (operationToRedo.operationType == "Add") {
        this.add(operationToRedo.nextValue, operationToRedo.elementIndex);
    } else if (operationToRedo.operationType == "Rename") {
        this.label = operationToRedo.nextValue;
    } else {
        throw new Error("Invalid operationType");
    }
}

PolygonEditor.prototype.logOperation = function(operation) {
    /*
     var operation = {
     operationType: operationType,
     elementType: elementType,
     elementIndex: elementIndex,
     nextValue: nextValue,
     previousValue: previousValue
     };
     */

    if (this.operationHistoryIndex == null)
        this.operationHistoryIndex = 0;
    else
        this.operationHistoryIndex++;

    this.operationHistory.splice(this.operationHistoryIndex, 0, operation);

    if (this.operationHistory.length > this.operationHistoryIndex + 1) {
        this.operationHistory = this.operationHistory.slice(0, this.operationHistoryIndex + 1);
    }

    this.operationHistoryIndex = this.operationHistory.length - 1;
}

PolygonEditor.prototype.getEditorLabelOffsetCoords = function () {

    var polyCenter = googleMapUtil.getPolygonCenter(this.poly);

    var divPosition = $(this.labelOverlay.div_).position();

    var point = new google.maps.Point(divPosition.left, divPosition.top);

    var overlayProjection = this.labelOverlay.getProjection();

    var latLng = overlayProjection.fromDivPixelToLatLng(point);

    var xOffset = latLng.lat() - polyCenter.lat();

    var yOffset = latLng.lng() - polyCenter.lng();

    return { lat: xOffset, lng: yOffset };
}

PolygonEditor.prototype.draw = function () {

    // draw Polygon
    this.poly = new google.maps.Polygon(this.polyOptions);

    this.poly.setPath(this.coords);

    this.poly.setMap(this.map);

    // draw Markers

    var that = this;

    for (i = 0; i < this.coords.length; i++) {

        var marker = this.addMarker(i);

        this.markers.push(marker);
    }

    if (this.labelOverlay != null) {

        this.labelOverlay.setMap(null);
    }

    var that = this;

    //this.labelOverlay = new TextOverlay(googleMapUtil.getPolygonCenter(this.poly, this.labelOffsetX, this.labelOffsetY), this.label, "map_ext_boundary_label", this.map, true);
}

PolygonEditor.prototype.onNameChangeHandler = function(ui, event) {

    this.label = $(ui).val();

    this.labelOverlay.txt_ = this.label;

    $(this.labelOverlay.div_).html(this.label);

}

PolygonEditor.prototype.add = function (latLng, insertIndex) {

    if (typeof insertIndex == 'undefined' || insertIndex == null || insertIndex < 0)
        insertIndex = this.findSide(latLng);

    if (insertIndex == this.coords.length)
        this.coords.push(latLng);
    else
        this.coords.splice(insertIndex, 0, latLng);

    if (this.poly == null) {

        this.poly = new google.maps.Polygon(this.polyOptions);

        this.poly.setPath(this.coords);

        this.poly.setMap(this.map);
    }
    else
        this.poly.setPath(this.coords);

    var marker = this.addMarker(insertIndex);

    if (insertIndex == this.markers.length)
        this.markers.push(marker);
    else
        this.markers.splice(insertIndex, 0, marker);

    if (this.coords.length > 2 && this.onChange) this.onChange();

    /*if (this.coords.length == 3) {

        this.labelOverlay.pos = googleMapUtil.getPolygonCenter(this.poly);

        this.labelOverlay.draw();
    }*/


    if (this.max > 0 && this.coords.length >= this.max) {

        google.maps.event.removeListener(this.clickListener);

        this.map.setOptions({ draggableCursor: 'move' });
    }

    return insertIndex;
}

PolygonEditor.prototype.addMarker = function (idx) {

    var marker = new google.maps.Marker({
        position: this.coords[idx],
        map: this.map,
        draggable: true,
        raiseOnDrag: false,
        title: 'Move me!',
        opacity: 1,
        icon: new google.maps.MarkerImage(this.imagePath + "/move.png", null, null, new google.maps.Point(12, 12)),
        zIndex: 200
    });

    marker.c_opacity = 1;

    var that = this;

    google.maps.event.addListener(marker, "dragstart", function (event) {


        that.dragIndex = that.nearestPos(event.latLng);

        that.dragStartLatLong = that.coords[that.dragIndex];

        that.previousDropHoverIndex = -1;
    });

    google.maps.event.addListener(marker, "drag", function (event) {

        if (that.coords.length > 3) {
            var collisionIndex = googleMapUtil.findAdjacentMarkerCollisionIndex(that.map, that.coords, that.dragIndex);

            if (collisionIndex >= 0) {
                that.markers[collisionIndex].setIcon({
                    'url': that.imagePath + "/movedelete.png",
                    'anchor': new google.maps.Point(12, 12)
                });
            }

            if (that.previousDropHoverIndex >= 0 && that.previousDropHoverIndex != collisionIndex) {
                that.markers[that.previousDropHoverIndex].setIcon({
                    'url': that.imagePath + "/move.png",
                    'anchor': new google.maps.Point(12, 12)
                });
            }

            that.previousDropHoverIndex = collisionIndex;

        }

        that.move(event.latLng, that.dragIndex);

    });

    google.maps.event.addListener(marker, "dragend", function (event) {

        if (that.coords.length > 3) {

            var collisionIndex = googleMapUtil.findAdjacentMarkerCollisionIndex(that.map, that.coords, that.dragIndex);

            if (collisionIndex >= 0) {

                that.logOperation({
                    operationType: "Remove",
                    elementType: "Vertex",
                    elementIndex: that.dragIndex,
                    previousValue: that.dragStartLatLong,
                    nextValue: that.dragStartLatLong
                })

                that.markers[collisionIndex].setIcon({
                    'url': that.imagePath + "/move.png",
                    'anchor': new google.maps.Point(12, 12)
                });

                that.removeVertex(that.dragIndex);

            } else {
                that.logOperation({
                    operationType: "Move",
                    elementType: "Vertex",
                    elementIndex: that.dragIndex,
                    previousValue: that.dragStartLatLong,
                    nextValue: that.coords[that.dragIndex]
                })
            }

            if (that.onChange && that.coords.length > 2) {
                that.onChange();
            }
        }
    });

    return marker;
}

PolygonEditor.prototype.move = function (latLng, elementIndex) {

    if (typeof elementIndex == 'undefined' || elementIndex == null) {
        elementIndex = this.dragIndex;
    }

    this.coords[elementIndex] = latLng;

    this.poly.setPath(this.coords);

    this.markers[elementIndex].setPosition(latLng);
}

PolygonEditor.prototype.removePoly = function () {

    if (this.poly == null) return;

    this.poly.setMap(null);

    this.poly = null;
}

PolygonEditor.prototype.removeMarkers = function () {

    for (i = 0; i < this.markers.length; i++) {

        this.markers[i].setMap(null);

        this.markers[i] = null;
    }

    this.markers.length = 0;
}

PolygonEditor.prototype.removeLabel = function () {
    if (this.labelOverlay == null) return;

    this.labelOverlay.setMap(null);

    this.labelOverlay = null;
}

PolygonEditor.prototype.removeVertex = function(index) {
    this.coords.splice(index, 1);
    this.markers[index].setMap(null);
    this.markers.splice(index, 1);
    this.poly.setPath(this.coords);
}

PolygonEditor.prototype.remove = function () {

    this.removePoly();

    this.removeMarkers();

    this.removeLabel();

    google.maps.event.removeListener(this.clickListener);

    $(document).unbind("keydown", this.keyDownHandler);

    this.map.setOptions({ draggableCursor: 'move' });


}

PolygonEditor.prototype.nearestPos = function (latLng) {

    var dist = googleMapUtil.radMiles;

    var idx = -1;

    for (var i = 0; i < this.coords.length; i++) {

        var d = googleMapUtil.distanceBetweenPoints(this.coords[i], latLng);

        if (d < dist) {

            dist = d;

            idx = i;
        }
    }
    return idx;
}

PolygonEditor.prototype.findSide = function (latLng) {

    if (this.coords.length <= 2) return this.coords.length;

    var dist = googleMapUtil.radMiles;

    var ratio = -1;

    var idx = -1;

    var j = this.coords.length - 1;

    for (var i = 0; i < this.coords.length; i++) {

        var r = googleMapUtil.ratioLinePoint(latLng, this.coords[j], this.coords[i]);

        var p = googleMapUtil.pointRatioLine(this.coords[j], this.coords[i], r);

        var d = googleMapUtil.distanceBetweenPoints(latLng, p);

        if (d < dist) {
            dist = d;
            ratio = r;
            idx = i;
        }

        j = i;
    }
    var k;

    j = (idx == 0) ? (this.coords.length - 1) : (idx - 1);

    if (ratio < 0) {

        k = (j == 0) ? (this.coords.length - 1) : (j - 1);

        if (googleMapUtil.distanceLinePoint(latLng, this.coords[k], this.coords[j]) <
            googleMapUtil.distanceLinePoint(latLng, this.coords[j], this.coords[idx]))
            return j;
        else
            return idx;
    }
    else if (ratio > 1) {

        k = (idx == this.coords.length - 1) ? 0 : (idx + 1);

        if (googleMapUtil.distanceLinePoint(latLng, this.coords[j], this.coords[idx]) <
            googleMapUtil.distanceLinePoint(latLng, this.coords[idx], this.coords[k]))
            return idx;
        else
            return k;
    }
    else return idx;
}

// Class
// @param {google.maps.Map} map
// @param {google.maps.LatLng} center
// @param {float} radius (in miles)
// @param {[]} circleOpts The options for the circle of the widget (google.maps.Circle)
// @param {function} onChange The event that's triggered everything this control changes value.
function RadiusEditor(map, center, radius, circleOpts, imagePath, onChange) {

    this.label = null;

    this.mileInMeters = 1609.344;

    this.map = map;

    this.imagePath = imagePath;

    //this.onChange = onChange;
    // center marker
    this.centerMarker = new google.maps.Marker({
        map: map,
        position: center,
        draggable: true,
        raiseOnDrag: false,
        title: 'Move me!',
        icon: new google.maps.MarkerImage(this.imagePath + "/move.png", null, null, new google.maps.Point(13, 15)),
        zIndex: 200
    });

    // circle
    this.circle = new google.maps.Circle(circleOpts);

    this.circle.setCenter(center);

    this.circle.setRadius(radius * this.mileInMeters); // in meters

    this.circle.setMap(map);

    // sizer marker
    this.sizerMarker = new google.maps.Marker({
        draggable: true,
        raiseOnDrag: false,
        title: 'Drag to resize!',
        icon: new google.maps.MarkerImage(this.imagePath + "/resize.png", null, null, new google.maps.Point(15, 15)),
        zIndex: 200
    });

    this.sizerMarker.setPosition(new google.maps.LatLng(this.getCenter().lat(), this.circle.getBounds().getNorthEast().lng()));

    this.sizerMarker.setMap(map);

    // radius label
    this.radiusLabel = new RadiusLabel(map, this.sizerMarker.getPosition(), this.getRadius());
    // events
    var that = this;
    google.maps.event.addListener(this.centerMarker, 'drag', function () {

        that.move();
    });
    google.maps.event.addListener(this.sizerMarker, 'drag', function () {

        that.resize();
    });
    if (onChange != null) {

        google.maps.event.addListener(this.centerMarker, 'dragend', function () {

            onChange();
        });
        google.maps.event.addListener(this.sizerMarker, 'dragend', function () {

            onChange();
        });
    }
}

RadiusEditor.prototype.move = function () {

    this.circle.setCenter(this.getCenter());

    this.sizerMarker.setPosition(new google.maps.LatLng(this.getCenter().lat(), this.circle.getBounds().getNorthEast().lng()));

    this.radiusLabel.move(this.sizerMarker.getPosition(), this.getRadius());
}

RadiusEditor.prototype.resize = function () {

    var radius = this.distanceBetweenPoints(this.centerMarker.getPosition(), this.sizerMarker.getPosition());

    this.circle.setRadius(radius);

    this.radiusLabel.move(this.sizerMarker.getPosition(), this.getRadius());
}

// @return {float} in miles
RadiusEditor.prototype.getRadius = function () {

    return this.circle.getRadius() / this.mileInMeters;
}

// @return {google.maps.LatLng}
RadiusEditor.prototype.getCenter = function () {

    return this.centerMarker.getPosition();
}

// @param {google.maps.LatLng} p1
// @param {google.maps.LatLng} p2
// @return {float} in meters
RadiusEditor.prototype.distanceBetweenPoints = function (p1, p2) {

    if (!p1 || !p2) {

        return 0;
    }

    var R = 6378100; // Radius of the Earth in meters

    var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;

    var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;

    var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2);

    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    var d = R * c;

    return d;
};

RadiusEditor.prototype.remove = function () {

    this.centerMarker.setMap(null);

    this.centerMarker = null;

    this.circle.setMap(null);

    this.circle = null;

    this.sizerMarker.setMap(null);

    this.sizerMarker = null;

    this.radiusLabel.setMap(null);

    this.radiusLabel = null;
}

// CLASS
// @param {google.maps.Map} map
// @param {google.maps.LatLng} position
// @param {float} radius in miles
function RadiusLabel(map, position, radius) {

    this.map = map;

    this.div = null;

    this.labelDiv = null;

    this.position = position;

    this.radius = radius;

    this.setMap(this.map);
}

RadiusLabel.prototype = new google.maps.OverlayView();

RadiusLabel.prototype.move = function (position, radius) {

    this.position = position;

    this.radius = radius;

    this.draw();
}

RadiusLabel.prototype.onAdd = function () {

    if (!this.div) {

        this.div = document.createElement('DIV');

        this.div.style.position = "absolute";

        this.div.style.zIndex = "250";

        this.div.style.padding = '5px';

        // Set CSS for Edit
        var labelBorder = document.createElement('DIV');

        labelBorder.style.backgroundColor = 'white';

        labelBorder.style.borderStyle = 'solid';

        labelBorder.style.borderWidth = '1px';

        labelBorder.style.cursor = 'pointer';

        labelBorder.style.cssFloat = "left";

        labelBorder.style.textAlign = 'center';

        labelBorder.title = "Radius of this circle in miles";
        this.div.appendChild(labelBorder);

        this.labelDiv = document.createElement('DIV');

        this.labelDiv.style.fontFamily = 'Arial,sans-serif';

        this.labelDiv.style.fontSize = '12px';

        this.labelDiv.style.paddingLeft = '4px';

        this.labelDiv.style.paddingRight = '4px';

        this.labelDiv.innerHTML = '';

        labelBorder.appendChild(this.labelDiv);

        var panes = this.getPanes();

        panes.overlayImage.appendChild(this.div);
    }
}

RadiusLabel.prototype.draw = function () {

    this.labelDiv.innerHTML = this.radius.toFixed(2) + "&nbsp;miles";

    var overlayProjection = this.getProjection();

    var loc = overlayProjection.fromLatLngToDivPixel(this.position);

    this.div.style.left = loc.x - 42 + 'px';

    this.div.style.top = loc.y - 35 + 'px';
}

RadiusLabel.prototype.onRemove = function () {

    if (this.div) {

        this.div.parentNode.removeChild(this.div);

        this.div = null;
    }
}

var googleMapUtil = {

    radMiles: 3956  // Radius of the Earth in miles

    // @param {google.maps.LatLng} p1
    // @param {google.maps.LatLng} p2
    // @return {float} in miles
    , distanceBetweenPoints: function (p1, p2) {
        if (!p1 || !p2) {
            return 0;
        }
        var dLat = (p2.lat() - p1.lat()) * Math.PI / 180;
        var dLon = (p2.lng() - p1.lng()) * Math.PI / 180;
        var a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
            Math.cos(p1.lat() * Math.PI / 180) * Math.cos(p2.lat() * Math.PI / 180) *
            Math.sin(dLon / 2) * Math.sin(dLon / 2);
        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return this.radMiles * c;
    }

    // @param {google.maps.LatLng} point
    // @param {google.maps.LatLng} lineEnd1
    // @param {google.maps.LatLng} lineEnd2
    // @return {float} in miles
    , distanceLinePoint: function (point, lineEnd1, lineEnd2) {
        var ratio = this.ratioLinePoint(point, lineEnd1, lineEnd2);
        var latLng = this.pointRatioLine(lineEnd1, lineEnd2, ratio);
        return this.distanceBetweenPoints(point, latLng);
    }

    // @param {google.maps.LatLng} point
    // @param {google.maps.LatLng} lineEnd1
    // @param {google.maps.LatLng} lineEnd2
    // @return {float}
    , ratioLinePoint: function (point, lineEnd1, lineEnd2) {
        var a = point.lng() - lineEnd1.lng();
        var b = point.lat() - lineEnd1.lat();
        var c = lineEnd2.lng() - lineEnd1.lng();
        var d = lineEnd2.lat() - lineEnd1.lat();

        var dot = a * c + b * d;
        var lenSq = c * c + d * d;
        return dot / lenSq;
    }

    // @param {google.maps.LatLng} lineEnd1
    // @param {google.maps.LatLng} lineEnd2
    // @param {float} ratio
    // @return {google.maps.LatLng}
    , pointRatioLine: function (lineEnd1, lineEnd2, ratio) {
        if (ratio < 0) return lineEnd1;
        else if (ratio > 1) return lineEnd2;
        else
            return new google.maps.LatLng(
                lineEnd1.lat() + (ratio * (lineEnd2.lat() - lineEnd1.lat())),
                lineEnd1.lng() + (ratio * (lineEnd2.lng() - lineEnd1.lng())));
    }

    , fromLatLngToPoint: function(map, latLng) {
        var topRight = map.getProjection().fromLatLngToPoint(map.getBounds().getNorthEast());

        var bottomLeft = map.getProjection().fromLatLngToPoint(map.getBounds().getSouthWest());

        var scale = Math.pow(2, map.getZoom());

        var worldPoint = map.getProjection().fromLatLngToPoint(latLng);

        return new google.maps.Point((worldPoint.x - bottomLeft.x) * scale, (worldPoint.y - topRight.y) * scale);
    }

    , fromPointToLatLng: function(map, point) {

        var projection = map.getProjection();

        var topRight = projection.fromLatLngToPoint(map.getBounds().getNorthEast());

        var bottomLeft = projection.fromLatLngToPoint(map.getBounds().getSouthWest());

        var scale = 1 << map.getZoom();

        var newLatlng = projection.fromPointToLatLng(new google.maps.Point(point.x / scale + bottomLeft.x, point.y / scale + topRight.y));

        return newLatlng;
    }

    , findAdjacentMarkerCollisionIndex: function(map, coords, currentIndex, markerWidth) {

        if (typeof markerWidth == 'undefined' || !markerWidth) {
            markerWidth = 12;
        }

        if (coords.length > 1) {
            var curCoord = coords[currentIndex];

            var projection = map.getProjection();
            var bounds = map.getBounds();

            var curPoint = googleMapUtil.fromLatLngToPoint(map, curCoord);

            var prevIndex = null;

            if (currentIndex == 0)
                prevIndex = coords.length - 1;
            else
                prevIndex = currentIndex - 1;

            var prevCoord = coords[prevIndex];

            var prevPoint = googleMapUtil.fromLatLngToPoint(map, prevCoord);

            var distance = Math.sqrt(Math.pow(curPoint.x - prevPoint.x, 2) + Math.pow(curPoint.y - prevPoint.y, 2));

            if (distance < markerWidth) {
                return prevIndex;
            } else {

                if (coords.length == 2)
                    return -1;

                var nextIndex = null;

                if (currentIndex == coords.length - 1)
                    nextIndex = 0;
                else
                    nextIndex = currentIndex + 1;

                nextCoord = coords[nextIndex];

                var nextPoint = googleMapUtil.fromLatLngToPoint(map, nextCoord);

                var distance = Math.sqrt(Math.pow(curPoint.x - nextPoint.x, 2) + Math.pow(curPoint.y - nextPoint.y, 2));

                if (distance < markerWidth) {
                    return nextIndex;
                }
            }
        }

        return -1;
    }

    , getPolygonCenter: function(polygon, xOffset, yOffset) {

        if (typeof(xOffset) == 'undefined' || xOffset == null)
            xOffset = 0;

        if (typeof(yOffset) == 'undefined' || yOffset == null)
            yOffset = 0;

        var boundsRect = new google.maps.LatLngBounds();

        polygon.getPath().forEach(function (element, index) {
            boundsRect.extend(element)
        });

        var center = boundsRect.getCenter();

        return new google.maps.LatLng(center.lat() + xOffset, center.lng() + yOffset);
    }
}
