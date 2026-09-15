let pets = JSON.parse(
    localStorage.getItem("petPassportPets")
) || [];

let selectedSpecies = "Dog";


// =============================
// PAGE NAVIGATION
// =============================

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

    const pet = pets.find(p => p.id === id);

    if (!pet) return;

    document.getElementById("homePage")
        .classList.add("hidden");

    document.getElementById("addPetPage")
        .classList.add("hidden");

    document.getElementById("petPage")
        .classList.remove("hidden");

    renderDashboard(pet);
}


function showComingSoon() {

    showToast(
        "✨ This section is coming next!"
    );
}


// =============================
// SPECIES
// =============================

function chooseSpecies(species) {

    selectedSpecies = species;

    document
        .getElementById("dogChoice")
        .classList.remove("active");

    document
        .getElementById("catChoice")
        .classList.remove("active");

    if (species === "Dog") {

        document
            .getElementById("dogChoice")
            .classList.add("active");

    } else {

        document
            .getElementById("catChoice")
            .classList.add("active");
    }
}


// =============================
// SAVE PET
// =============================

function savePet() {

    const name =
        document.getElementById("petName")
            .value.trim();

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

            species: selectedSpecies,

            name: name,

            breed:
                document.getElementById("petBreed")
                    .value,

            birthday:
                document.getElementById("petBirthday")
                    .value,

            sex:
                document.getElementById("petSex")
                    .value,

            weight:
                document.getElementById("petWeight")
                    .value,

            color:
                document.getElementById("petColor")
                    .value,

            allergies:
                document.getElementById("petAllergies")
                    .value,

            notes:
                document.getElementById("petNotes")
                    .value,

            photo: photo,

            personality: {

                energy:
                    document.getElementById("energy")
                        .value,

                social:
                    document.getElementById("social")
                        .value,

                talkative:
                    document.getElementById("talkative")
                        .value,

                affection:
                    document.getElementById("affection")
                        .value
            },

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


    if (photoInput.files.length > 0) {

        const reader = new FileReader();

        reader.onload = function(event) {

            createPet(event.target.result);

        };

        reader.readAsDataURL(
            photoInput.files[0]
        );

    } else {

        createPet("");

    }
}


// =============================
// PET CARDS
// =============================

function renderPets() {

    const container =
        document.getElementById("petList");

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
                            alt="${pet.name}"
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
                            ${escapeHTML(pet.name)}
                        </h3>

                        <p>
                            ${emoji}
                            ${escapeHTML(pet.breed || pet.species)}
                        </p>

                        <p>
                            ${getAge(pet.birthday)}
                        </p>

                    </div>

                </div>

            `;

        })
        .join("");
}


// =============================
// DASHBOARD
// =============================

function renderDashboard(pet) {

    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";


    const dashboard =
        document.getElementById(
            "petDashboard"
        );


    dashboard.innerHTML = `

        <div class="dashboard-header">

            ${
                pet.photo

                ?

                `<img
                    class="dashboard-photo"
                    src="${pet.photo}"
                >`

                :

                `<div class="dashboard-placeholder">
                    ${emoji}
                </div>`
            }


            <div>

                <p class="small-title">
                    PET PASSPORT
                </p>

                <h2>
                    ${escapeHTML(pet.name)}
                </h2>

                <p>
                    ${emoji}
                    ${escapeHTML(pet.breed || pet.species)}
                    · ${getAge(pet.birthday)}
                </p>

            </div>

        </div>


        <div class="dashboard-content">

            <div class="info-box">

                <h3>☀️ Today's Care</h3>

                <button
                    class="quick-button"
                    onclick="markCare(this)"
                >
                    🍗 Breakfast
                </button>

                <button
                    class="quick-button"
                    onclick="markCare(this)"
                >
                    💧 Water
                </button>

            </div>


            <div class="info-box">

                <h3>😸 Mood</h3>

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


            <div class="info-box">

                <h3>⚖️ Weight</h3>

                <strong>
                    ${pet.weight || "--"} kg
                </strong>

                <p>
                    Keep track of changes over time.
                </p>

            </div>


            <div class="info-box">

                <h3>💗 Health</h3>

                <p>
                    Allergies:
                    ${escapeHTML(pet.allergies || "None recorded")}
                </p>

                <button
                    class="quick-button"
                    onclick="showComingSoon()"
                >
                    🩺 Health Records
                </button>

            </div>


            <div class="info-box">

                <h3>📸 Memories</h3>

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


            <div class="info-box">

                <h3>🚨 Emergency</h3>

                <button
                    class="quick-button"
                    onclick="showEmergency(pet)"
                >
                    Open Emergency Mode
                </button>

            </div>

        </div>

    `;
}


// =============================
// AGE CALCULATOR
// =============================

function getAge(birthday) {

    if (!birthday) {
        return "Birthday unknown";
    }


    const birth =
        new Date(birthday);

    const now =
        new Date();


    let years =
        now.getFullYear()
        - birth.getFullYear();


    let months =
        now.getMonth()
        - birth.getMonth();


    if (
        months < 0 ||
        (
            months === 0 &&
            now.getDate() < birth.getDate()
        )
    ) {

        years--;

    }


    if (years > 0) {

        return `${years} year${years === 1 ? "" : "s"} old`;

    }


    const totalMonths =
        (
            now.getFullYear()
            - birth.getFullYear()
        ) * 12
        +
        (
            now.getMonth()
            - birth.getMonth()
        );


    return `${Math.max(0, totalMonths)} month${totalMonths === 1 ? "" : "s"} old`;
}


// =============================
// CARE
// =============================

function markCare(button) {

    button.innerHTML =
        "✓ " +
        button.innerHTML.replace(
            "🍗 ",
            ""
        ).replace(
            "💧 ",
            ""
        );

    button.style.background =
        "#ddfff2";

    showToast(
        "🐾 Care recorded!"
    );
}


function setMood(mood) {

    showToast(
        `${mood} Mood recorded!`
    );
}


// =============================
// EMERGENCY
// =============================

function showEmergency(pet) {

    alert(
        `🚨 PET EMERGENCY\n\n` +

        `${pet.name}\n` +

        `${pet.species}\n` +

        `Age: ${getAge(pet.birthday)}\n` +

        `Weight: ${pet.weight || "Unknown"} kg\n\n` +

        `Allergies: ${pet.allergies || "None recorded"}\n\n` +

        `Emergency veterinary contacts will be added in a future version.`
    );
}


// =============================
// FORM RESET
// =============================

function clearForm() {

    document.getElementById("petName").value = "";

    document.getElementById("petBreed").value = "";

    document.getElementById("petBirthday").value = "";

    document.getElementById("petSex").value = "";

    document.getElementById("petWeight").value = "";

    document.getElementById("petColor").value = "";

    document.getElementById("petAllergies").value = "";

    document.getElementById("petNotes").value = "";

    document.getElementById("petPhoto").value = "";

    document.getElementById("energy").value = 50;

    document.getElementById("social").value = 50;

    document.getElementById("talkative").value = 50;

    document.getElementById("affection").value = 50;
}


// =============================
// TOAST
// =============================

function showToast(message) {

    const toast =
        document.getElementById("toast");

    toast.textContent = message;

    toast.classList.add("show");


    setTimeout(() => {

        toast.classList.remove("show");

    }, 2200);
}


// =============================
// SECURITY / TEXT
// =============================

function escapeHTML(text) {

    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}


// =============================
// START APP
// =============================

renderPets();
