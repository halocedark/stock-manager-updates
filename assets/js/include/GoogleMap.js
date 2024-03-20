class GoogleMap 
{
    constructor(mapElement, points = []) 
    {
        const defaultPoints = [
            {
                coordinates: { lat: 28.0339, lng: 1.6596 }
            }
        ]

        if ( points.length == 0 ) points = defaultPoints

        this.map = new google.maps.Map(mapElement, {
            center: points[0].coordinates,
            zoom: 6,
        });

        this.markers = [];
        this.setPoints(points);
        // events
        this.events = {
            onMarkerSelected: new CustomEvent('marker-selected', {
                detail: {
                    marker: {}
                }
            })
        }
    }

    setPoints(points) 
    {
        // Clear existing markers
        this.clearMarkers();

        points.forEach((point) => {
            const marker = new google.maps.Marker({
            position: point.coordinates,
            map: this.map,
            });

            marker.addListener("click", () => {
                this.map.setCenter(point.coordinates);
                this.map.setZoom(10);
            });

            this.markers.push(marker);
        });
    }

    clearMarkers() {
        this.markers.forEach((marker) => {
            marker.setMap(null);
        });

        this.markers = [];
    }

    zoomToCoordinates(coordinates) 
    {
        const marker = this.markers.find((marker) => {
            const markerPosition = marker.getPosition();
            return (
                markerPosition.lat() === coordinates.lat &&
                markerPosition.lng() === coordinates.lng
            );
        });
    
        if (marker) 
        {
            this.map.setCenter(marker.getPosition());
            this.map.setZoom(10);
            this.events.onMarkerSelected.detail.marker = marker
            this.dispatchEvent('marker-selected',this.events.onMarkerSelected)
        }
    }

    addEventListener(eventType, callback)
    {
        document.addEventListener(eventType, callback)
    }

    removeEventListener(eventType, callback)
    {
        document.removeEventListener(eventType, callback)
    }

    dispatchEvent(eventType, event)
    {
        document.dispatchEvent(event)
    }
}
