// ==========================================
// PET PASSPORT - LIFE TIMELINE
// ==========================================


// Get pet ID from URL

const params = new URLSearchParams(window.location.search);

const petId = Number(params.get("pet"));


// Get pets

const pets =
    JSON.parse(
        localStorage.getItem("petPassportPets")
    ) || [];


// Find current pet

const pet =
    pets.find(p => Number(p.id) === petId);


// ==========================================
// START
// ==========================================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!pet) {

            document.getElementById("timeline").innerHTML =
                `
                <div class="empty-timeline">
                    🐾 Pet not found.
                </div>
                `;

            return;
        }


        displayPetInfo();

        buildTimeline();

    }
);


// ==========================================
// PET INFORMATION
// ==========================================

function displayPetInfo() {

    document.getElementById("petName").textContent =
        pet.name || "Pet";


    document.getElementById("petSubtitle").textContent =
        `${pet.name || "Pet"}'s journey`;


    document.getElementById("petInfo").textContent =
        `${pet.species || ""} ${pet.breed ? "• " + pet.breed : ""}`;


    const photo =
        document.getElementById("petPhoto");


    if (pet.photo) {

        photo.innerHTML =
            `<img src="${escapeHTML(pet.photo)}" alt="Pet">`;

    } else {

        photo.textContent =
            pet.species === "Cat"
                ? "🐱"
                : "🐶";
    }
}


// ==========================================
// BUILD TIMELINE
// ==========================================

function buildTimeline() {

    const events = [];


    // --------------------------------------
    // FOOD
    // --------------------------------------

    const foods =
        getRecords(`foodRecords_${petId}`);


    foods.forEach(food => {

        if (!food.date) return;


        events.push({

            type: "Food",

            icon: "🍗",

            date: food.date,

            details:
                `${food.name || "Food"}${food.amount ? " • " + food.amount : ""}`

        });

    });


    // --------------------------------------
    // WATER
    // --------------------------------------

    const waters =
        getRecords(`waterRecords_${petId}`);


    waters.forEach(water => {

        if (!water.date) return;


        events.push({

            type: "Water",

            icon: "💧",

            date: water.date,

            details:
                `${water.amount || water.quantity || ""} ${
                    water.unit || "ml"
                }`

        });

    });


    // --------------------------------------
    // BATHROOM
    // --------------------------------------

    const bathroom =
        getRecords(`bathroomRecords_${petId}`);


    bathroom.forEach(record => {

        if (!record.date) return;


        events.push({

            type: "Bathroom",

            icon: "🚽",

            date: record.date,

            details:
                record.type ||
                record.status ||
                record.notes ||
                "Bathroom recorded"

        });

    });


    // --------------------------------------
    // MEDICATION
    // --------------------------------------

    const medications =
        getRecords(`medicationRecords_${petId}`);


    medications.forEach(medication => {

        const date =
            medication.date ||
            medication.datetime ||
            medication.created;


        if (!date) return;


        events.push({

            type: "Medication",

            icon: "💊",

            date: date,

            details:
                medication.name ||
                medication.medicine ||
                medication.notes ||
                "Medication recorded"

        });

    });


    // ======================================
    // SORT EVENTS
    // ======================================

    events.sort(
        (a, b) =>
            new Date(a.date) -
            new Date(b.date)
    );


    // ======================================
    // DISPLAY
    // ======================================

    renderTimeline(events);

}


// ==========================================
// RENDER TIMELINE
// ==========================================

function renderTimeline(events) {

    const container =
        document.getElementById("timeline");


    if (events.length === 0) {

        container.innerHTML =
            `
            <div class="empty-timeline">

                🐾 No timeline events yet.

                <br><br>

                Start recording your pet's
                food, water, bathroom,
                or medication.

            </div>
            `;

        return;
    }


    // Group events by Day number

    const days = {};


    events.forEach(event => {

        const dayNumber =
            calculatePetDay(
                pet.created,
                event.date
            );


        if (!days[dayNumber]) {

            days[dayNumber] = [];

        }


        days[dayNumber].push(event);

    });


    let html = "";


    Object.keys(days)
        .sort((a, b) => Number(a) - Number(b))
        .forEach(dayNumber => {

            const dayEvents =
                days[dayNumber];


            const firstEvent =
                dayEvents[0];


            const date =
                new Date(firstEvent.date);


            html += `

                <div class="timeline-day">

                    <div class="day-title">

                        DAY ${dayNumber}

                        <br>

                        <small>
                            ${formatDate(date)}
                        </small>

                    </div>
            `;


            dayEvents.forEach(event => {

                html += `

                    <div class="timeline-event">

                        <div class="event-top">

                            <span class="event-icon">
                                ${event.icon}
                            </span>

                            <span class="event-title">
                                ${escapeHTML(event.type)}
                            </span>

                            <span class="event-time">
                                ${formatTime(
                                    new Date(event.date)
                                )}
                            </span>

                        </div>


                        <div class="event-details">

                            ${escapeHTML(
                                event.details || ""
                            )}

                        </div>

                    </div>

                `;

            });


            html += `</div>`;

        });


    container.innerHTML = html;

}


// ==========================================
// CALCULATE DAY NUMBER
// ==========================================

function calculatePetDay(
    createdDate,
    eventDate
) {

    const created =
        new Date(createdDate);


    const event =
        new Date(eventDate);


    // Compare calendar dates,
    // not exact hours.

    const createdDay =
        new Date(
            created.getFullYear(),
            created.getMonth(),
            created.getDate()
        );


    const eventDay =
        new Date(
            event.getFullYear(),
            event.getMonth(),
            event.getDate()
        );


    const difference =
        Math.floor(
            (
                eventDay -
                createdDay
            ) /
            (1000 * 60 * 60 * 24)
        );


    return Math.max(
        1,
        difference + 1
    );

}


// ==========================================
// GET RECORDS
// ==========================================

function getRecords(key) {

    try {

        const records =
            JSON.parse(
                localStorage.getItem(key)
            );


        return Array.isArray(records)
            ? records
            : [];

    } catch (error) {

        console.error(
            "Could not read:",
            key,
            error
        );

        return [];

    }

}


// ==========================================
// DATE
// ==========================================

function formatDate(date) {

    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ==========================================
// TIME
// ==========================================

function formatTime(date) {

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );

}


// ==========================================
// BACK BUTTON
// ==========================================

function goBack() {

    window.location.href =
        `index.html?pet=${petId}`;

}


// ==========================================
// SECURITY
// ==========================================

function escapeHTML(value) {

    return String(value ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}
