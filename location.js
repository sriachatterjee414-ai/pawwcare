// ======================================================
// PET PASSPORT
// LIVE LOCATION
// ======================================================


// ======================================================
// GET PET
// ======================================================

const params =
    new URLSearchParams(
        window.location.search
    );


const petId =
    Number(
        params.get("pet")
    );


const pets =
    JSON.parse(
        localStorage.getItem(
            "petPassportPets"
        )
    ) || [];


const pet =
    pets.find(
        p => p.id === petId
    );


if (!pet) {

    alert("Pet not found!");

} else {

    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";

    document.getElementById(
        "petName"
    ).textContent =
        `${emoji} ${pet.name}`;

}


// ======================================================
// TRACKER CONFIGURATION
// ======================================================
//
// IMPORTANT:
//
// We do NOT put tracker API secrets here.
//
// The browser will eventually talk to
// YOUR backend.
//
// Your backend talks to the GPS server.
//
// Example:
//
// Pet Passport
//      ↓
// /api/pets/:id/location
//      ↓
// Backend
//      ↓
// Traccar / GPS provider
//
// ======================================================


const API_BASE_URL =
    "/api";


// ======================================================
// CURRENT TRACKER STATE
// ======================================================

let trackerConnected =
    false;


let currentLocation =
    null;


// ======================================================
// CONNECT TRACKER
// ======================================================

async function connectTracker() {

    showToast(
        "📡 Checking for GPS tracker..."
    );


    try {

        /*
         * FUTURE BACKEND REQUEST
         *
         * This will eventually call:
         *
         * GET /api/pets/:petId/tracker
         *
         * The backend will check whether
         * the pet has a registered GPS tracker.
         */


        const response =
            await fetch(
                `${API_BASE_URL}/pets/${petId}/tracker`
            );


        if (!response.ok) {

            throw new Error(
                "Tracker unavailable"
            );

        }


        const data =
            await response.json();


        if (!data.connected) {

            setTrackerOffline();

            showToast(
                "📡 No GPS tracker connected yet."
            );

            return;

        }


        setTrackerOnline(
            data
        );


    } catch (error) {

        /*
         * This is expected right now because
         * we haven't created the backend yet.
         *
         * We deliberately show the safe
         * "not connected" state instead of
         * pretending the pet has GPS.
         */

        console.log(
            "Tracker API not connected:",
            error
        );


        setTrackerOffline();

        showToast(
            "📡 GPS tracker is not connected yet."
        );

    }

}


// ======================================================
// OFFLINE STATE
// ======================================================

function setTrackerOffline() {

    trackerConnected =
        false;


    document.getElementById(
        "trackerStatusTitle"
    ).textContent =
        "Tracker not connected";


    document.getElementById(
        "statusDot"
    ).className =
        "status-dot offline";


    document.getElementById(
        "liveBadge"
    ).textContent =
        "OFFLINE";


    document.getElementById(
        "liveBadge"
    ).className =
        "live-badge offline-badge";


    document.getElementById(
        "trackerMessage"
    ).innerHTML = `

        📡 Your pet does not have a GPS
        tracker connected yet.

        <br><br>

        Connect a compatible 4G/GPS collar
        tracker to start receiving real
        location data.

    `;


    document.getElementById(
        "trackerId"
    ).textContent =
        "Not connected";


    document.getElementById(
        "connectionType"
    ).textContent =
        "—";


    document.getElementById(
        "latitude"
    ).textContent =
        "—";


    document.getElementById(
        "longitude"
    ).textContent =
        "—";


    document.getElementById(
        "battery"
    ).textContent =
        "—";


    document.getElementById(
        "lastUpdate"
    ).textContent =
        "—";


    document.getElementById(
        "accuracy"
    ).textContent =
        "—";


    document.getElementById(
        "speed"
    ).textContent =
        "—";


    resetMap();

}


// ======================================================
// ONLINE STATE
// ======================================================

function setTrackerOnline(
    tracker
) {

    trackerConnected =
        true;


    document.getElementById(
        "trackerStatusTitle"
    ).textContent =
        "Tracker connected";


    document.getElementById(
        "statusDot"
    ).className =
        "status-dot online";


    document.getElementById(
        "liveBadge"
    ).textContent =
        "LIVE";


    document.getElementById(
        "liveBadge"
    ).className =
        "live-badge online-badge";


    document.getElementById(
        "trackerMessage"
    ).innerHTML = `

        🟢 GPS tracker is connected.

        <br><br>

        Pet Passport is receiving location
        information from the tracker.

    `;


    document.getElementById(
        "trackerId"
    ).textContent =
        tracker.id || "Unknown";


    document.getElementById(
        "connectionType"
    ).textContent =
        tracker.connection ||
        "4G";


    if (tracker.position) {

        updateLocation(
            tracker.position
        );

    }

}


// ======================================================
// UPDATE LOCATION
// ======================================================

function updateLocation(
    position
) {

    if (!position) return;


    currentLocation =
        position;


    const latitude =
        Number(
            position.latitude
        );


    const longitude =
        Number(
            position.longitude
        );


    document.getElementById(
        "latitude"
    ).textContent =
        Number.isFinite(latitude)
            ? latitude.toFixed(6)
            : "—";


    document.getElementById(
        "longitude"
    ).textContent =
        Number.isFinite(longitude)
            ? longitude.toFixed(6)
            : "—";


    document.getElementById(
        "battery"
    ).textContent =
        position.battery != null
            ? `${position.battery}%`
            : "—";


    document.getElementById(
        "accuracy"
    ).textContent =
        position.accuracy != null
            ? `${position.accuracy} m`
            : "—";


    document.getElementById(
        "speed"
    ).textContent =
        position.speed != null
            ? `${position.speed} km/h`
            : "—";


    document.getElementById(
        "lastUpdate"
    ).textContent =
        formatDate(
            position.timestamp
        );


    updateMap(
        latitude,
        longitude
    );


    addLocationHistory(
        position
    );

}


// ======================================================
// MAP
// ======================================================
//
// We keep the map renderer separate.
//
// Later this can use Leaflet/MapLibre/etc.
//
// The actual GPS coordinates will come
// from the backend.
//
// ======================================================

function updateMap(
    latitude,
    longitude
) {

    const map =
        document.getElementById(
            "map"
        );


    map.innerHTML = `

        <div class="map-placeholder">

            <div class="map-paw">
                📍
            </div>

            <h3>
                GPS location received
            </h3>

            <p>
                Latitude:
                ${latitude.toFixed(6)}

                <br>

                Longitude:
                ${longitude.toFixed(6)}
            </p>

        </div>

    `;

}


// ======================================================
// RESET MAP
// ======================================================

function resetMap() {

    const map =
        document.getElementById(
            "map"
        );


    map.innerHTML = `

        <div class="map-placeholder">

            <div class="map-paw">
                📍
            </div>

            <h3>
                Waiting for GPS
            </h3>

            <p>
                Your pet's live location
                will appear here when a
                tracker is connected.
            </p>

        </div>

    `;

}


// ======================================================
// LOCATION HISTORY
// ======================================================

function addLocationHistory(
    position
) {

    const history =
        document.getElementById(
            "locationHistory"
        );


    if (!position) return;


    const item =
        document.createElement(
            "div"
        );


    item.style.cssText = `

        padding: 15px 0;

        border-bottom:
            1px solid #f0e8ef;

    `;


    item.innerHTML = `

        <strong>
            📍 GPS Position
        </strong>

        <br>

        <small>
            ${Number(position.latitude).toFixed(6)},
            ${Number(position.longitude).toFixed(6)}
        </small>

        <br>

        <small style="color:#999;">
            ${formatDate(position.timestamp)}
        </small>

    `;


    if (
        history.querySelector(
            ".empty-history"
        )
    ) {

        history.innerHTML = "";

    }


    history.prepend(
        item
    );

}


// ======================================================
// FORMAT DATE
// ======================================================

function formatDate(
    timestamp
) {

    if (!timestamp) {

        return "—";

    }


    const date =
        new Date(timestamp);


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {

        return "—";

    }


    return date.toLocaleString(
        [],
        {
            dateStyle: "medium",
            timeStyle: "short"
        }
    );

}


// ======================================================
// BACK
// ======================================================

function goBack() {

    window.location.href =
        `health.html?pet=${petId}`;

}


// ======================================================
// TOAST
// ======================================================

function showToast(
    message
) {

    const toast =
        document.getElementById(
            "toast"
        );


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(
        () => {

            toast.classList.remove(
                "show"
            );

        },
        2500
    );

}


// ======================================================
// START
// ======================================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        setTrackerOffline();

    }
);
