import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import L from 'leaflet'

function Map() {
    const iconeEmoji = new L.DivIcon({
        html: '<span style="font-size: 30px;">🏠</span>',
        className: 'custom-div-icon',
        iconSize: [30, 30],
        iconAnchor: [15, 30],
        popupAnchor: [0, -30],
    })

    return (
        <MapContainer
            center={[5.3364, -4.0267]}
            zoom={12}
            style={{ height: '500px', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
            />

            <Marker position={[5.3582, -3.9832]} icon={iconeEmoji}>
                <Popup>Cocody</Popup>
            </Marker>

            <Marker position={[5.3214, -4.0178]} icon={iconeEmoji}>
                <Popup maxWidth={300} minWidth={150}>
                    Le Plateau
                </Popup>
            </Marker>

            <Marker position={[5.3501, -4.0734]} icon={iconeEmoji}>
                <Popup>Yopougon</Popup>
            </Marker>

            <Marker position={[5.3042, -3.9897]} icon={iconeEmoji}>
                <Popup>Marcory</Popup>
            </Marker>

            <Marker position={[5.3004, -4.0156]} icon={iconeEmoji}>
                <Popup>Treichville</Popup>
            </Marker>

            <Marker position={[5.2928, -3.9535]} icon={iconeEmoji}>
                <Popup>Koumassi</Popup>
            </Marker>

            <Marker position={[5.2604, -3.9392]} icon={iconeEmoji}>
                <Popup>Port-Bouët</Popup>
            </Marker>

            <Marker position={[5.3524, -4.0221]} icon={iconeEmoji}>
                <Popup>Adjamé</Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
