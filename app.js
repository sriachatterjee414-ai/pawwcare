// ============================================================
// PET PASSPORT - MAIN APP.JS
// ============================================================

// ============================================================
// PET DATA
// ============================================================

let pets = JSON.parse(
    localStorage.getItem("petPassportPets")
) || [];

let selectedSpecies = "Dog";
let currentPetId = null;


// ============================================================
// SAFE ELEMENT HELPER
// ============================================================

function $(id) {
    return document.getElementById(id);
}


// ============================================================
// PAGE NAVIGATION
// ============================================================

function hideAllPages() {

    const pages = [
        "homePage",
        "petPage",
        "addPetPage"
    ];

    pages.forEach(id => {

        const page = $(id);

        if (page) {
            page.classList.add("hidden");
        }

    });
}


function showHome() {

    hideAllPages();

    const home = $("homePage");

    if (home) {
        home.classList.remove("hidden");
    }

    currentPetId = null;

    renderPets();
}


function openAddPet() {

    hideAllPages();

    const addPage = $("addPetPage");

    if (addPage) {
        addPage.classList.remove("hidden");
    }

    // Make sure Dog is selected when opening
    // the form for the first time.
    chooseSpecies(selectedSpecies);
}


function showPet(id) {

    const pet = pets.find(
        p => Number(p.id) === Number(id)
    );

    if (!pet) {
        showToast("🐾 Pet not found!");
        return;
    }

    currentPetId = pet.id;

    hideAllPages();

    const petPage = $("petPage");

    if (petPage) {
        petPage.classList.remove("hidden");
    }

    renderDashboard(pet);
}


// ============================================================
// SPECIES
// ============================================================

function chooseSpecies(species) {

    selectedSpecies = species;

    const dog = $("dogChoice");
    const cat = $("catChoice");

    if (dog) {
        dog.classList.toggle(
            "active",
            species === "Dog"
        );
    }

    if (cat) {
        cat.classList.toggle(
            "active",
            species === "Cat"
        );
    }
}


// ============================================================
// SAVE PET
// ============================================================

function savePet() {

    const nameElement = $("petName");

    if (!nameElement) {
        showToast("⚠️ Pet form could not be found.");
        return;
    }

    const name = nameElement.value.trim();

    if (!name) {
        showToast("🐾 Please give your pet a name!");
        nameElement.focus();
        return;
    }


    const photoInput = $("petPhoto");


    // --------------------------------------------------------
    // CREATE PET
    // --------------------------------------------------------

    function createPet(photo) {

        const now = new Date();

        const pet = {

            id: Date.now(),

            species: selectedSpecies,

            name: name,

            breed: getValue("petBreed"),

            birthday: getValue("petBirthday"),

            sex: getValue("petSex"),

            weight: getValue("petWeight"),

            color: getValue("petColor"),

            allergies: getValue("petAllergies"),

            notes: getValue("petNotes"),

            photo: photo || "",

            personality: {

                energy: getValue("energy") || 50,

                social: getValue("social") || 50,

                talkative: getValue("talkative") || 50,

                affection: getValue("affection") || 50

            },

            // Day 1 starts on the date the passport
            // was created.
            created: now.toISOString(),

            timelineStartDate: getDateKey(now)

        };


        pets.push(pet);


        localStorage.setItem(
            "petPassportPets",
            JSON.stringify(pets)
        );


        // Create an empty timeline for this pet.
        saveTimelineLogs(
            pet.id,
            []
        );


        clearForm();


        currentPetId = pet.id;


        showToast(
            `💗 ${pet.name}'s passport was created!`
        );


        // Open the new pet dashboard.
        setTimeout(() => {

            showPet(pet.id);

        }, 500);

    }


    // --------------------------------------------------------
    // PHOTO
    // --------------------------------------------------------

    if (
        photoInput &&
        photoInput.files &&
        photoInput.files.length > 0
    ) {

        const reader = new FileReader();

        reader.onload = function(event) {

            createPet(
                event.target.result
            );

        };

        reader.onerror = function() {

            showToast(
                "⚠️ Couldn't load that photo."
            );

        };

        reader.readAsDataURL(
            photoInput.files[0]
        );

    } else {

        createPet("");

    }
}


// ============================================================
// GET FORM VALUE
// ============================================================

function getValue(id) {

    const element = $(id);

    if (!element) {
        return "";
    }

    return element.value;
}


// ============================================================
// PET LIST
// ============================================================

function renderPets() {

    const container = $("petList");

    if (!container) {
        return;
    }


    if (pets.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div class="empty-icon">
                    🐾
                </div>

                <h2>
                    Your pet family is empty!
                </h2>

                <p>
                    Add your first little friend
                    to create their passport.
                </p>

                <button
                    class="pink-button"
                    onclick="openAddPet()"
                >
                    ＋ Add Pet
                </button>

            </div>

        `;

        return;
    }


    container.innerHTML = pets
        .map(pet => {

            const emoji =
                pet.species === "Cat"
                    ? "🐱"
                    : "🐶";


            return `

                <div
                    class="pet-card"
                    onclick="showPet(${Number(pet.id)})"
                >

                    ${
                        pet.photo

                        ?

                        `
                        <img
                            class="pet-photo"
                            src="${escapeHTML(
                                pet.photo
                            )}"
                            alt="${escapeHTML(
                                pet.name
                            )}"
                        >
                        `

                        :

                        `
                        <div class="pet-placeholder">
                            ${emoji}
                        </div>
                        `
                    }


                    <div class="pet-info">

                        <h3>
                            ${escapeHTML(
                                pet.name
                            )}
                        </h3>

                        <p>
                            ${emoji}
                            ${escapeHTML(
                                pet.breed ||
                                pet.species
                            )}
                        </p>

                        <p>
                            ${getAge(
                                pet.birthday
                            )}
                        </p>

                    </div>

                </div>

            `;

        })
        .join("");
}


// ============================================================
// DASHBOARD
// ============================================================

function renderDashboard(pet) {

    const dashboard = $("petDashboard");

    if (!dashboard) {
        return;
    }


    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";


    dashboard.innerHTML = `

        <!-- PET HEADER -->

        <div class="dashboard-header">

            ${
                pet.photo

                ?

                `
                <img
                    class="dashboard-photo"
                    src="${escapeHTML(
                        pet.photo
                    )}"
                    alt="${escapeHTML(
                        pet.name
                    )}"
                >
                `

                :

                `
                <div class="dashboard-placeholder">
                    ${emoji}
                </div>
                `
            }


            <div>

                <p class="small-title">
                    PET PASSPORT
                </p>

                <h2>
                    ${escapeHTML(
                        pet.name
                    )}
                </h2>

                <p>
                    ${emoji}
                    ${escapeHTML(
                        pet.breed ||
                        pet.species
                    )}
                    ·
                    ${getAge(
                        pet.birthday
                    )}
                </p>

            </div>

        </div>


        <!-- DASHBOARD CONTENT -->

        <div class="dashboard-content">


            <!-- TODAY'S CARE -->

            <div class="info-box">

                <h3>
                    ☀️ Today's Care
                </h3>

                <button
                    class="quick-button"
                    onclick="openFood()"
                >
                    🍗 Food Tracker
                </button>

                <button
                    class="quick-button"
                    onclick="openWater()"
                >
                    💧 Water Tracker
                </button>

                <button
                    class="quick-button"
                    onclick="openMedication()"
                >
                    💊 Medication
                </button>

            </div>


            <!-- MOOD -->

            <div class="info-box">

                <h3>
                    😸 Mood
                </h3>

                <button
                    class="quick-button"
                    onclick="setMood('😸 Happy')"
                >
                    😸 Happy
                </button>

                <button
                    class="quick-button"
                    onclick="setMood('🤪 Playful')"
                >
                    🤪 Playful
                </button>

                <button
                    class="quick-button"
                    onclick="setMood('😴 Sleepy')"
                >
                    😴 Sleepy
                </button>

            </div>


            <!-- WEIGHT -->

            <div class="info-box">

                <h3>
                    ⚖️ Weight
                </h3>

                <strong>
                    ${escapeHTML(
                        pet.weight ||
                        "--"
                    )} kg
                </strong>

                <p>
                    Keep track of changes
                    over time.
                </p>

            </div>


            <!-- RECORDS -->

            <div class="info-box">

                <h3>
                    📋 Records
                </h3>

                <button
                    class="quick-button"
                    onclick="openHealth()"
                >
                    🩺 Health Records
                </button>

                <button
                    class="quick-button"
                    onclick="openBathroom()"
                >
                    🚽 Bathroom Tracker
                </button>

            </div>


            <!-- MEMORIES -->

            <div class="info-box">

                <h3>
                    📸 Memories
                </h3>

                <p>
                    Save the little moments
                    that make them special.
                </p>

                <button
                    class="quick-button"
                    onclick="showComingSoon()"
                >
                    ＋ Add Memory
                </button>

            </div>


            <!-- EMERGENCY -->

            <div class="info-box">

                <h3>
                    🚨 Emergency
                </h3>

                <button
                    class="quick-button"
                    onclick="showEmergency()"
                >
                    Open Emergency Mode
                </button>

            </div>


            <!-- LIFE TIMELINE -->

            <div class="info-box timeline-box">

                <h3>
                    📅 Life Timeline
                </h3>

                <p class="timeline-subtitle">
                    ${escapeHTML(
                        pet.name
                    )}'s daily records
                </p>

                <div id="petTimeline">

                    ${renderTimeline(
                        pet
                    )}

                </div>

            </div>

        </div>
    `;
}


// ============================================================
// TRACKER NAVIGATION
// ============================================================

function openFood() {

    if (!currentPetId) {
        showToast("🐾 Please select a pet first!");
        return;
    }

    window.location.href =
        `food.html?pet=${encodeURIComponent(
            currentPetId
        )}`;
}


function openWater() {

    if (!currentPetId) {
        showToast("🐾 Please select a pet first!");
        return;
    }

    window.location.href =
        `water.html?pet=${encodeURIComponent(
            currentPetId
        )}`;
}


function openMedication() {

    if (!currentPetId) {
        showToast("🐾 Please select a pet first!");
        return;
    }

    window.location.href =
        `medication.html?pet=${encodeURIComponent(
            currentPetId
        )}`;
}


function openBathroom() {

    if (!currentPetId) {
        showToast("🐾 Please select a pet first!");
        return;
    }

    window.location.href =
        `bathroom.html?pet=${encodeURIComponent(
            currentPetId
        )}`;
}


function openHealth() {

    if (!currentPetId) {
        showToast("🐾 Please select a pet first!");
        return;
    }

    window.location.href =
        `health.html?pet=${encodeURIComponent(
            currentPetId
        )}`;
}


// ============================================================
// TIMELINE
// ============================================================

function getTimelineKey(petId) {

    return `petPassportTimeline_${petId}`;
}


function getTimelineLogs(petId) {

    try {

        return JSON.parse(
            localStorage.getItem(
                getTimelineKey(petId)
            )
        ) || [];

    } catch (error) {

        console.error(
            "Timeline loading error:",
            error
        );

        return [];
    }
}


function saveTimelineLogs(
    petId,
    logs
) {

    localStorage.setItem(
        getTimelineKey(petId),
        JSON.stringify(logs)
    );
}


function addTimelineLog(
    petId,
    data = {}
) {

    if (!petId) {
        return;
    }


    const logs =
        getTimelineLogs(
            petId
        );


    logs.push({

        id:
            Date.now() +
            Math.random(),

        timestamp:
            new Date().toISOString(),

        type:
            data.type ||
            "activity",

        icon:
            data.icon ||
            "🐾",

        title:
            data.title ||
            "Activity",

        detail:
            data.detail ||
            ""

    });


    saveTimelineLogs(
        petId,
        logs
    );
}


// ============================================================
// DAY NUMBER
// ============================================================

function getPetDayNumber(
    pet,
    date = new Date()
) {

    if (!pet) {
        return 1;
    }


    // New system:
    // timelineStartDate is the calendar date
    // the pet passport was created.

    const startString =
        pet.timelineStartDate ||
        getDateKey(
            new Date(
                pet.created ||
                Date.now()
            )
        );


    const startDate =
        new Date(
            startString +
            "T00:00:00"
        );


    const currentDate =
        new Date(
            date.getFullYear(),
            date.getMonth(),
            date.getDate()
        );


    const difference =
        currentDate.getTime() -
        startDate.getTime();


    const days =
        Math.floor(
            difference /
            86400000
        );


    return Math.max(
        1,
        days + 1
    );
}


// ============================================================
// TIMELINE RENDER
// ============================================================

function renderTimeline(pet) {

    const logs =
        getTimelineLogs(
            pet.id
        );


    const today =
        new Date();


    const todayKey =
        getDateKey(
            today
        );


    // --------------------------------------------------------
    // Group saved records by date
    // --------------------------------------------------------

    const groups = {};


    logs.forEach(log => {

        const date =
            new Date(
                log.timestamp
            );


        const key =
            getDateKey(
                date
            );


        if (!groups[key]) {
            groups[key] = [];
        }


        groups[key].push(log);

    });


    // --------------------------------------------------------
    // Always show today.
    //
    // Therefore:
    // Day 1 appears immediately.
    // Tomorrow becomes Day 2 automatically.
    // --------------------------------------------------------

    if (!groups[todayKey]) {
        groups[todayKey] = [];
    }


    const dates =
        Object.keys(groups)
            .sort(
                (a, b) =>
                    new Date(b) -
                    new Date(a)
            );


    return dates
        .map(dateKey => {

            const date =
                new Date(
                    dateKey +
                    "T00:00:00"
                );


            const dayNumber =
                getPetDayNumber(
                    pet,
                    date
                );


            const dayLogs =
                groups[dateKey]
                    .sort(
                        (a, b) =>
                            new Date(b.timestamp) -
                            new Date(a.timestamp)
                    );


            return `

                <div class="timeline-day">

                    <div class="timeline-day-header">

                        <div>

                            <span class="timeline-day-number">
                                Day ${dayNumber}
                            </span>

                            <div class="timeline-date">
                                ${formatDate(date)}
                            </div>

                        </div>

                    </div>


                    <div class="timeline-items">

                        ${
                            dayLogs.length === 0

                            ?

                            `
                            <div class="timeline-empty">

                                <div class="empty-icon">
                                    🐾
                                </div>

                                <p>
                                    No records yet today.
                                </p>

                                <small>
                                    Food, water, medication,
                                    bathroom and mood records
                                    will appear here.
                                </small>

                            </div>
                            `

                            :

                            dayLogs
                                .map(
                                    log =>
                                        renderTimelineItem(
                                            log
                                        )
                                )
                                .join("")
                        }

                    </div>

                </div>

            `;

        })
        .join("");
}


// ============================================================
// TIMELINE ITEM
// ============================================================

function renderTimelineItem(log) {

    const date =
        new Date(
            log.timestamp
        );


    return `

        <div class="timeline-item">

            <div class="timeline-icon">
                ${escapeHTML(
                    log.icon
                )}
            </div>

            <div class="timeline-item-content">

                <div class="timeline-item-top">

                    <strong>
                        ${escapeHTML(
                            log.title
                        )}
                    </strong>

                    <span class="timeline-time">
                        ${formatTime(
                            date
                        )}
                    </span>

                </div>

                ${
                    log.detail

                    ?

                    `
                    <p>
                        ${escapeHTML(
                            log.detail
                        )}
                    </p>
                    `

                    :

                    ""
                }

            </div>

        </div>

    `;
}


// ============================================================
// DATE HELPERS
// ============================================================

function getDateKey(date) {

    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(
            2,
            "0"
        );


    const day =
        String(
            date.getDate()
        ).padStart(
            2,
            "0"
        );


    return `${year}-${month}-${day}`;
}


function formatDate(date) {

    return date.toLocaleDateString(
        undefined,
        {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric"
        }
    );
}


function formatTime(date) {

    return date.toLocaleTimeString(
        undefined,
        {
            hour: "numeric",
            minute: "2-digit"
        }
    );
}


// ============================================================
// MOOD
// ============================================================

function setMood(mood) {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }


    const parts =
        mood.split(" ");


    const icon =
        parts.shift();


    const moodName =
        parts.join(" ");


    addTimelineLog(
        currentPetId,
        {
            type: "mood",
            icon: icon,
            title: "Mood",
            detail: moodName
        }
    );


    showToast(
        `${mood} recorded!`
    );


    const pet =
        pets.find(
            p =>
                Number(p.id) ===
                Number(currentPetId)
        );


    if (pet) {
        renderDashboard(pet);
    }
}


// ============================================================
// EMERGENCY
// ============================================================

function showEmergency() {

    const pet =
        pets.find(
            p =>
                Number(p.id) ===
                Number(currentPetId)
        );


    if (!pet) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }


    alert(

        `🚨 PET EMERGENCY\n\n` +

        `${pet.name}\n` +

        `${pet.species}\n` +

        `Age: ${
            getAge(
                pet.birthday
            )
        }\n` +

        `Weight: ${
            pet.weight ||
            "Unknown"
        } kg\n\n` +

        `Allergies: ${
            pet.allergies ||
            "None recorded"
        }\n\n` +

        `Emergency contacts can be `
        +
        `added to the passport later.`

    );
}


// ============================================================
// AGE
// ============================================================

function getAge(birthday) {

    if (!birthday) {
        return "Birthday unknown";
    }


    const birth =
        new Date(
            birthday +
            "T00:00:00"
        );


    if (isNaN(birth.getTime())) {
        return "Birthday unknown";
    }


    const now =
        new Date();


    let years =
        now.getFullYear() -
        birth.getFullYear();


    let months =
        now.getMonth() -
        birth.getMonth();


    let dayDifference =
        now.getDate() -
        birth.getDate();


    if (
        months < 0 ||
        (
            months === 0 &&
            dayDifference < 0
        )
    ) {

        years--;

    }


    if (years > 0) {

        return `${years} year${
            years === 1
                ? ""
                : "s"
        } old`;
    }


    let totalMonths =
        (
            now.getFullYear() -
            birth.getFullYear()
        ) * 12
        +
        (
            now.getMonth() -
            birth.getMonth()
        );


    if (
        now.getDate() <
        birth.getDate()
    ) {

        totalMonths--;

    }


    totalMonths =
        Math.max(
            0,
            totalMonths
        );


    return `${totalMonths} month${
        totalMonths === 1
            ? ""
            : "s"
    } old`;
}


// ============================================================
// CLEAR FORM
// ============================================================

function clearForm() {

    const fields = [

        "petName",
        "petBreed",
        "petBirthday",
        "petSex",
        "petWeight",
        "petColor",
        "petAllergies",
        "petNotes"

    ];


    fields.forEach(id => {

        const element = $(id);

        if (element) {
            element.value = "";
        }

    });


    const photo =
        $("petPhoto");


    if (photo) {
        photo.value = "";
    }


    [
        "energy",
        "social",
        "talkative",
        "affection"

    ].forEach(id => {

        const element = $(id);

        if (element) {
            element.value = 50;
        }

    });


    selectedSpecies = "Dog";

    chooseSpecies("Dog");
}


// ============================================================
// COMING SOON
// ============================================================

function showComingSoon() {

    showToast(
        "✨ This section is coming next!"
    );
}


// ============================================================
// TOAST
// ============================================================

function showToast(message) {

    const toast =
        $("toast");


    if (!toast) {
        return;
    }


    toast.textContent =
        message;


    toast.classList.add(
        "show"
    );


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2200);
}


// ============================================================
// SECURITY
// ============================================================

function escapeHTML(text) {

    if (text === null || text === undefined) {
        return "";
    }


    return String(text)

        .replaceAll(
            "&",
            "&amp;"
        )

        .replaceAll(
            "<",
            "&lt;"
        )

        .replaceAll(
            ">",
            "&gt;"
        )

        .replaceAll(
            '"',
            "&quot;"
        )

        .replaceAll(
            "'",
            "&#039;"
        );
}


// ============================================================
// START APP
// ============================================================

document.addEventListener(
    "DOMContentLoaded",
    function() {

        // Make sure the home page is visible.
        hideAllPages();

        const home =
            $("homePage");

        if (home) {
            home.classList.remove(
                "hidden"
            );
        }


        renderPets();

    }
);
