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
// PAGE NAVIGATION
// ============================================================

function showHome() {

    document.getElementById("homePage")
        .classList.remove("hidden");

    document.getElementById("petPage")
        .classList.add("hidden");

    document.getElementById("addPetPage")
        .classList.add("hidden");

    renderPets();
}


function openAddPet() {

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("petPage")
        .classList.add("hidden");

    document.getElementById("addPetPage")
        .classList.remove("hidden");
}


function showPet(id) {

    currentPetId = id;

    const pet = pets.find(
        p => p.id === id
    );

    if (!pet) return;

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("addPetPage")
        .classList.add("hidden");

    document.getElementById("petPage")
        .classList.remove("hidden");

    renderDashboard(pet);
}


// ============================================================
// TRACKER NAVIGATION
// ============================================================

function openFood() {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }

    window.location.href =
        `food.html?pet=${currentPetId}`;
}


function openWater() {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }

    window.location.href =
        `water.html?pet=${currentPetId}`;
}


function openMedication() {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }

    window.location.href =
        `medication.html?pet=${currentPetId}`;
}


function openBathroom() {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }

    window.location.href =
        `bathroom.html?pet=${currentPetId}`;
}


function openHealth() {

    if (!currentPetId) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;
    }

    window.location.href =
        `health.html?pet=${currentPetId}`;
}


// ============================================================
// SPECIES
// ============================================================

function chooseSpecies(species) {

    selectedSpecies = species;

    const dogChoice =
        document.getElementById("dogChoice");

    const catChoice =
        document.getElementById("catChoice");


    if (dogChoice) {

        dogChoice.classList.remove("active");

    }


    if (catChoice) {

        catChoice.classList.remove("active");

    }


    if (species === "Dog") {

        if (dogChoice) {

            dogChoice.classList.add("active");

        }

    } else {

        if (catChoice) {

            catChoice.classList.add("active");

        }

    }
}


// ============================================================
// SAVE PET
// ============================================================

function savePet() {

    const nameElement =
        document.getElementById("petName");

    if (!nameElement) return;


    const name =
        nameElement.value.trim();


    if (!name) {

        showToast(
            "🐾 Please give your pet a name!"
        );

        return;
    }


    const photoInput =
        document.getElementById("petPhoto");


    const createPet = (photo) => {

        const pet = {

            id: Date.now(),

            species:
                selectedSpecies,

            name:
                name,

            breed:
                document
                    .getElementById("petBreed")
                    .value,

            birthday:
                document
                    .getElementById("petBirthday")
                    .value,

            sex:
                document
                    .getElementById("petSex")
                    .value,

            weight:
                document
                    .getElementById("petWeight")
                    .value,

            color:
                document
                    .getElementById("petColor")
                    .value,

            allergies:
                document
                    .getElementById("petAllergies")
                    .value,

            notes:
                document
                    .getElementById("petNotes")
                    .value,

            photo:
                photo,


            personality: {

                energy:
                    document
                        .getElementById("energy")
                        .value,

                social:
                    document
                        .getElementById("social")
                        .value,

                talkative:
                    document
                        .getElementById("talkative")
                        .value,

                affection:
                    document
                        .getElementById("affection")
                        .value
            },


            // IMPORTANT:
            // This is used for Day 1 / Day 2 / Day 3
            // and is automatically saved.

            created:
                new Date().toISOString()

        };


        pets.push(pet);


        localStorage.setItem(
            "petPassportPets",
            JSON.stringify(pets)
        );


        clearForm();


        showToast(
            `💗 ${pet.name}'s passport was created!`
        );


        setTimeout(() => {

            showHome();

        }, 800);

    };


    if (
        photoInput &&
        photoInput.files.length > 0
    ) {

        const reader =
            new FileReader();


        reader.onload = function(event) {

            createPet(
                event.target.result
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
// PET CARDS
// ============================================================

function renderPets() {

    const container =
        document.getElementById("petList");

    if (!container) return;


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
                    onclick="showPet(${pet.id})"
                >

                    ${
                        pet.photo

                        ?

                        `<img
                            class="pet-photo"
                            src="${pet.photo}"
                            alt="${escapeHTML(
                                pet.name
                            )}"
                        >`

                        :

                        `<div
                            class="pet-placeholder"
                        >
                            ${emoji}
                        </div>`
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
// MAIN DASHBOARD
// ============================================================

function renderDashboard(pet) {

    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";


    const dashboard =
        document.getElementById(
            "petDashboard"
        );

    if (!dashboard) return;


    dashboard.innerHTML = `

        <!-- ================================================= -->
        <!-- PET HEADER -->
        <!-- ================================================= -->

        <div class="dashboard-header">

            ${
                pet.photo

                ?

                `<img
                    class="dashboard-photo"
                    src="${pet.photo}"
                    alt="${escapeHTML(
                        pet.name
                    )}"
                >`

                :

                `<div
                    class="dashboard-placeholder"
                >
                    ${emoji}
                </div>`
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


        <!-- ================================================= -->
        <!-- TODAY'S CARE -->
        <!-- ================================================= -->

        <div class="dashboard-content">


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


            <!-- ================================================= -->
            <!-- MOOD -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- WEIGHT -->
            <!-- ================================================= -->

            <div class="info-box">

                <h3>
                    ⚖️ Weight
                </h3>


                <strong>
                    ${pet.weight || "--"} kg
                </strong>


                <p>
                    Keep track of changes
                    over time.
                </p>

            </div>


            <!-- ================================================= -->
            <!-- RECORDS -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- MEMORIES -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- EMERGENCY -->
            <!-- ================================================= -->

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


            <!-- ================================================= -->
            <!-- TIMELINE -->
            <!-- ================================================= -->

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
// DAY NUMBER
// ============================================================
//
// The pet's creation date = Day 1.
//
// Example:
//
// Pet created September 15
// September 15 = Day 1
// September 16 = Day 2
// September 17 = Day 3
//
// It changes automatically based on the calendar date.
// ============================================================

function getPetDayNumber(
    pet,
    date = new Date()
) {

    if (!pet.created) {

        return 1;

    }


    const created =
        new Date(
            pet.created
        );


    const startDate =
        new Date(
            created.getFullYear(),
            created.getMonth(),
            created.getDate()
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
            (
                1000 *
                60 *
                60 *
                24
            )
        );


    return Math.max(
        1,
        days + 1
    );
}


// ============================================================
// TIMELINE STORAGE
// ============================================================

function getTimelineKey(
    petId
) {

    return `petPassportTimeline_${petId}`;
}


function getTimelineLogs(
    petId
) {

    if (!petId) return [];


    return JSON.parse(
        localStorage.getItem(
            getTimelineKey(
                petId
            )
        )
    ) || [];
}


function saveTimelineLogs(
    petId,
    logs
) {

    localStorage.setItem(

        getTimelineKey(
            petId
        ),

        JSON.stringify(
            logs
        )
    );
}


// ============================================================
// ADD TIMELINE RECORD
// ============================================================

function addTimelineLog(
    petId,
    data
) {

    if (!petId) return;


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
            data.type || "activity",

        icon:
            data.icon || "🐾",

        title:
            data.title || "Activity",

        detail:
            data.detail || ""

    });


    saveTimelineLogs(
        petId,
        logs
    );
}


// ============================================================
// TIMELINE RENDER
// ============================================================

function renderTimeline(
    pet
) {

    const logs =
        getTimelineLogs(
            pet.id
        );


    // No records yet
    if (logs.length === 0) {

        return `

            <div class="timeline-empty">

                <div class="empty-icon">
                    🐾
                </div>

                <p>
                    No activities recorded yet.
                </p>

                <small>
                    Food, water, medication,
                    bathroom and other records
                    will appear here.
                </small>

            </div>

        `;
    }


    // Sort newest first
    const sorted =
        [...logs].sort(
            (a, b) =>
                new Date(b.timestamp) -
                new Date(a.timestamp)
        );


    // Group by calendar date
    const groups = {};


    sorted.forEach(log => {

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


        groups[key].push(
            log
        );

    });


    return Object.keys(groups)

        .sort(
            (a, b) =>
                new Date(b) -
                new Date(a)
        )

        .map(dateKey => {

            const date =
                new Date(
                    dateKey +
                    "T00:00:00"
                );


            const dayNumber =
                getPetDayNumber(
                    pet,
