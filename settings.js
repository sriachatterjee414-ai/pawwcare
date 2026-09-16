// ==========================================
// PET PASSPORT - PET SETTINGS
// ==========================================


// =============================
// GET PET
// =============================

const params =
    new URLSearchParams(
        window.location.search
    );


const petId =
    Number(
        params.get("pet")
    );


let pets =
    JSON.parse(
        localStorage.getItem(
            "petPassportPets"
        )
    ) || [];


let pet =
    pets.find(
        p => Number(p.id) === petId
    );


// Keep track of the photo separately

let newPhoto = null;

let photoRemoved = false;


// =============================
// START
// =============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!pet) {

            alert(
                "🐾 Pet not found!"
            );

            window.location.href =
                "index.html";

            return;
        }


        loadPetData();

    }
);


// =============================
// LOAD PET DATA
// =============================

function loadPetData() {

    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";


    // Preview

    document.getElementById(
        "previewName"
    ).textContent =
        pet.name || "My Pet";


    document.getElementById(
        "previewSpecies"
    ).textContent =
        `${emoji} ${pet.species || "Pet"}`;


    // Basic information

    document.getElementById(
        "petName"
    ).value =
        pet.name || "";


    document.getElementById(
        "petBreed"
    ).value =
        pet.breed || "";


    document.getElementById(
        "petBirthday"
    ).value =
        pet.birthday || "";


    document.getElementById(
        "petSex"
    ).value =
        pet.sex || "";


    document.getElementById(
        "petWeight"
    ).value =
        pet.weight || "";


    document.getElementById(
        "petColor"
    ).value =
        pet.color || "";


    // Health

    document.getElementById(
        "petAllergies"
    ).value =
        pet.allergies || "";


    document.getElementById(
        "petNotes"
    ).value =
        pet.notes || "";


    // Personality

    const personality =
        pet.personality || {};


    document.getElementById(
        "energy"
    ).value =
        personality.energy ?? 50;


    document.getElementById(
        "social"
    ).value =
        personality.social ?? 50;


    document.getElementById(
        "talkative"
    ).value =
        personality.talkative ?? 50;


    document.getElementById(
        "affection"
    ).value =
        personality.affection ?? 50;


    // Photo

    updatePhotoPreview();

}


// =============================
// PHOTO UPLOAD
// =============================

document.getElementById(
    "petPhoto"
).addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            function (event) {

                newPhoto =
                    event.target.result;

                photoRemoved =
                    false;

                updatePhotoPreview();

            };


        reader.readAsDataURL(file);

    }
);


// =============================
// PHOTO PREVIEW
// =============================

function updatePhotoPreview() {

    const preview =
        document.getElementById(
            "largePhotoPreview"
        );


    const smallPreview =
        document.getElementById(
            "previewPhoto"
        );


    let photo = "";


    if (newPhoto) {

        photo = newPhoto;

    } else if (
        !photoRemoved &&
        pet.photo
    ) {

        photo = pet.photo;

    }


    if (photo) {

        const image =
            `<img
                src="${escapeHTML(photo)}"
                alt="Pet photo"
            >`;


        preview.innerHTML =
            image;


        smallPreview.innerHTML =
            image;

    } else {

        const emoji =
            pet.species === "Cat"
                ? "🐱"
                : "🐶";


        preview.textContent =
            emoji;


        smallPreview.textContent =
            emoji;

    }

}


// =============================
// REMOVE PHOTO
// =============================

function removePhoto() {

    newPhoto = null;

    photoRemoved = true;

    document.getElementById(
        "petPhoto"
    ).value = "";


    updatePhotoPreview();

    showToast(
        "📸 Photo will be removed when you save."
    );

}


// =============================
// SAVE CHANGES
// =============================

function saveChanges() {

    const name =
        document.getElementById(
            "petName"
        ).value.trim();


    if (!name) {

        showToast(
            "🐾 Your pet needs a name!"
        );

        return;
    }


    // Update the EXISTING pet

    pet.name =
        name;


    pet.breed =
        document.getElementById(
            "petBreed"
        ).value.trim();


    pet.birthday =
        document.getElementById(
            "petBirthday"
        ).value;


    pet.sex =
        document.getElementById(
            "petSex"
        ).value;


    pet.weight =
        document.getElementById(
            "petWeight"
        ).value;


    pet.color =
        document.getElementById(
            "petColor"
        ).value.trim();


    pet.allergies =
        document.getElementById(
            "petAllergies"
        ).value.trim();


    pet.notes =
        document.getElementById(
            "petNotes"
        ).value.trim();


    // Personality

    pet.personality = {

        energy:
            document.getElementById(
                "energy"
            ).value,

        social:
            document.getElementById(
                "social"
            ).value,

        talkative:
            document.getElementById(
                "talkative"
            ).value,

        affection:
            document.getElementById(
                "affection"
            ).value

    };


    // Photo

    if (newPhoto) {

        pet.photo =
            newPhoto;

    } else if (photoRemoved) {

        pet.photo =
            "";

    }


    // Save entire pet list

    localStorage.setItem(
        "petPassportPets",
        JSON.stringify(pets)
    );


    showToast(
        `💗 ${pet.name}'s passport was updated!`
    );


    setTimeout(
        () => {

            goBack();

        },
        900
    );

}


// =============================
// DELETE PET
// =============================

function deletePet() {

    const confirmed =
        confirm(
            `⚠️ Are you sure you want to delete ${pet.name}'s passport?\n\nThis cannot be undone.`
        );


    if (!confirmed) return;


    pets =
        pets.filter(
            p => Number(p.id) !== petId
        );


    localStorage.setItem(
        "petPassportPets",
        JSON.stringify(pets)
    );


    // Remove this pet's tracker data too

    localStorage.removeItem(
        `foodRecords_${petId}`
    );

    localStorage.removeItem(
        `waterRecords_${petId}`
    );

    localStorage.removeItem(
        `bathroomRecords_${petId}`
    );

    localStorage.removeItem(
        `medicationRecords_${petId}`
    );

    localStorage.removeItem(
        `foodReminder_${petId}`
    );


    alert(
        "🐾 Pet passport deleted."
    );


    window.location.href =
        "index.html";

}


// =============================
// BACK
// =============================

function goBack() {

    window.location.href =
        `index.html?pet=${petId}`;

}


// =============================
// TOAST
// =============================

function showToast(message) {

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


// =============================
// SECURITY
// =============================

function escapeHTML(text) {

    return String(text ?? "")

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
