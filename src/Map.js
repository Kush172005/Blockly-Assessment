import React, { useRef, useState, useEffect } from "react";
import {
    MapContainer,
    TileLayer,
    Marker,
    Polyline,
    useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import "leaflet-routing-machine";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: "https://static.thenounproject.com/png/456565-200.png",
    iconUrl: "https://static.thenounproject.com/png/456565-200.png",
    shadowUrl:
        "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

function RoutingMachine({ setRouteCoordinates }) {
    const map = useMap();
    const routingControlRef = useRef(null);

    useEffect(() => {
        if (!map) return;
        if (!routingControlRef.current) {
            routingControlRef.current = L.Routing.control({
                waypoints: [
                    L.latLng(23.2599, 77.4126),
                    L.latLng(23.2399, 77.3785),
                ],
                routeWhileDragging: false,
                addWaypoints: false,
                show: false,
                createMarker: () => null,
            }).addTo(map);

            routingControlRef.current.on("routesfound", (e) => {
                const routes = e.routes;
                const coords = routes[0].coordinates;
                setRouteCoordinates(coords);
                map.fitBounds(L.latLngBounds(coords));
            });

            routingControlRef.current.on("routingerror", (e) => {
                console.error("Routing Error: ", e.error);
            });
        }

        return () => {
            if (routingControlRef.current) {
                if (map.hasLayer(routingControlRef.current)) {
                    map.removeControl(routingControlRef.current);
                }
                routingControlRef.current = null;
            }
        };
    }, [map, setRouteCoordinates]);

    return null;
}

function ActualPathMap() {
    const [routeCoordinates, setRouteCoordinates] = useState([]);
    const [currentPosition, setCurrentPosition] = useState([23.2599, 77.4126]);
    const [isAnimating, setIsAnimating] = useState(false);
    const markerRef = useRef(null);
    const animationRef = useRef(null);

    const startAnimation = () => {
        if (isAnimating || routeCoordinates.length === 0) return;
        setIsAnimating(true);

        const totalDuration = 8000;
        const numberOfSteps = routeCoordinates.length;
        const stepDuration = totalDuration / numberOfSteps;

        let index = 0;

        const animate = () => {
            if (index >= routeCoordinates.length) {
                setIsAnimating(false);
                return;
            }
            const newPos = routeCoordinates[index];
            setCurrentPosition([newPos.lat, newPos.lng]);
            index++;
            animationRef.current = setTimeout(animate, stepDuration);
        };
        animate();
    };

    useEffect(() => {
        return () => {
            if (animationRef.current) {
                clearTimeout(animationRef.current);
            }
        };
    }, []);

    return (
        <div>
            <div className="flex justify-center mb-4 absolute z-[5000] top-[90%] left-[48%]">
                <button
                    className="px-4 py-2 bg-green-500 text-white font-bold rounded hover:bg-green-600"
                    onClick={startAnimation}
                    disabled={isAnimating || routeCoordinates.length === 0}
                >
                    {isAnimating ? "Navigating..." : "Start Navigating"}
                </button>
            </div>
            <MapContainer
                center={[23.2599, 77.4126]}
                zoom={14}
                scrollWheelZoom={false}
                style={{ height: "800px", width: "100%" }}
                zoomControl={false}
            >
                <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                <RoutingMachine setRouteCoordinates={setRouteCoordinates} />
                {routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" />
                )}
                <Marker
                    ref={markerRef}
                    position={currentPosition}
                    icon={
                        new L.Icon({
                            iconUrl:
                                "https://static.thenounproject.com/png/456565-200.png",
                            iconSize: [32, 32],
                            iconAnchor: [16, 16],
                        })
                    }
                />
            </MapContainer>
        </div>
    );
}

export default ActualPathMap;
