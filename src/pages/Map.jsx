import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'

function Map() {
    return (
        <MapContainer
            center={[5.3364, -4.0267]}
            zoom={13}
            style={{ height: '500px', width: '100%' }}>
            <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

            {/* Cocody */}
            <Marker position={[5.3582, -3.9832]}>
                <Popup>Cocody</Popup>
            </Marker>

            {/* Plateau */}
            <Marker position={[5.3214, -4.0178]}>
                <Popup maxWidth={300} minWidth={150}>
    
                </Popup>
            </Marker>

            {/* Yopougon */}
            <Marker position={[5.3501, -4.0734]}>
                <Popup>Yopougon</Popup>
            </Marker>

            {/* Marcory */}
            <Marker position={[5.3042, -3.9897]}>
                <Popup>Marcory</Popup>
            </Marker>

            {/* Treichville */}
            <Marker position={[5.3004, -4.0156]}>
                <Popup>Treichville</Popup>
            </Marker>

            {/* Koumassi */}
            <Marker position={[5.2928, -3.9535]}>
                <Popup>Koumassi</Popup>
            </Marker>

            {/* Port-Bouët */}
            <Marker position={[5.2604, -3.9392]}>
                <Popup>Port-Bouët</Popup>
            </Marker>

            {/* Adjamé */}
            <Marker position={[5.3524, -4.0221]}>
                <Popup>Adjamé</Popup>
            </Marker>
        </MapContainer>
    )
}

export default Map
