import L from "leaflet";

export const redIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
	iconSize: [25, 41], // size of the icon
	iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
	popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
	shadowSize: [41, 41], // size of the shadow
});

export const greenIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
	iconSize: [25, 41], // size of the icon
	iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
	popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
	shadowSize: [41, 41], // size of the shadow
});

export const blueIcon = new L.Icon({
	iconUrl:
		"https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
	iconSize: [25, 41], // size of the icon
	iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
	popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
	shadowUrl:
		"https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.3.4/images/marker-shadow.png",
	shadowSize: [41, 41], // size of the shadow
});

export function getIcon(status) {
	if (status === "Assigned (In Progress)") return blueIcon;
	else if (status === "Unassigned") return redIcon;
	else if (status === "Completed") return greenIcon;
}
