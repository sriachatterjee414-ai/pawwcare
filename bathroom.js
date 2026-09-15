const params = new URLSearchParams(
    window.location.search
);

const petId = Number(
    params.get("pet")
);

const pets = JSON.parse(
    localStorage.getItem("petPassportPets")
) || [];

const pet = pets.find(
    p => p.id === petId
);


if (!pet) {

    alert("Pet not found!");

} else {

    document.getElementById("petName")
        .textContent =
        pet.species === "Cat"
            ? `🐱 ${pet.name}`
            : `🐶 ${pet.name}`;
}


// =============================
// DATA
// =============================

const storageKey =
    `bathroomRecords_${petId}`;

let records = JSON.parse(
    localStorage.getItem(storageKey)
) || [];


let selectedType = null;

let selectedStatus = null;


// =============================
// SELECT TYPE
// =============================

function selectType(type, button) {

    selectedType = type;


    document
        .querySelectorAll(".type-button")
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );
}


// =============================
// SELECT STATUS
// =============================

function selectStatus(status, button) {

    selectedStatus = status;


    document
        .querySelectorAll(".status-button")
        .forEach(btn => {

            btn.classList.remove(
                "selected"
            );

        });


    button.classList.add(
        "selected"
    );
}


// =============================
// ADD RECORD
// =============================

function addBathroom() {

    if (!selectedType) {

        showToast(
            "🚽 Choose what happened!"
        );

        return;
    }


    if (!selectedStatus) {

        showToast(
            "🟢 Choose the status!"
        );

        return;
    }


    const time =
        document.getElementById(
            "bathroomTime"
        ).value;


    const notes =
        document.getElementById(
            "bathroomNotes"
        ).value.trim();


    const record = {

        id: Date.now(),

        type:
            selectedType,

        status:
            selectedStatus,

        time:
            time ||
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        notes:
            notes,

        date:
            new Date().toISOString()

    };


    records.push(record);

    saveRecords();


    document.getElementById(
        "bathroomTime"
    ).value = "";

    document.getElementById(
        "bathroomNotes"
    ).value = "";


    selectedType = null;

    selectedStatus = null;


    document
        .querySelectorAll(
            ".type-button, .status-button"
        )
        .forEach(button => {

            button.classList.remove(
                "selected"
            );

        });


    showToast(
        "🐾 Bathroom record saved!"
    );


    renderRecords();
}


// =============================
// RENDER
// =============================

function renderRecords() {

    const today =
        new Date().toDateString();


    const todayRecords =
        records.filter(
            record =>
                new Date(record.date)
                    .toDateString()
                === today
        );


    document.getElementById(
        "recordCount"
    ).textContent =
        todayRecords.length;


    const list =
        document.getElementById(
            "bathroomList"
        );


    if (todayRecords.length === 0) {

        list.innerHTML = `
            <p
                style="
                    text-align:center;
                    color:#999;
                "
            >
                🐾 No bathroom records today.
            </p>
        `;

        return;
    }


    list.innerHTML =
        todayRecords
            .slice()
            .reverse()
            .map(record => {

                const icon =
                    record.type === "Poop"
                        ? "💩"
                        : record.type === "Urine"
                            ? "💧"
                            : "🤢";


                const statusClass =
                    record.status === "Normal"
                        ? "status-normal"
                        : record.status === "Unusual"
                            ? "status-unusual"
                            : "status-concerning";


                return `

                    <div class="bathroom-item">

                        <div class="bathroom-top">

                            <strong>
                                ${icon}
                                ${record.type}
                            </strong>

                            <span
                                class="
                                    status-pill
                                    ${statusClass}
                                "
                            >
                                ${record.status}
                            </span>

                        </div>


                        <small>
                            🕐 ${record.time}
                        </small>


                        ${
                            record.notes
                            ?
                            `
                            <div
                                class="bathroom-notes"
                            >
                                📝
                                ${escapeHTML(
                                    record.notes
                                )}
                            </div>
                            `
                            :
                            ""
                        }


                        <button
                            class="delete-button"
                            onclick="
                                deleteRecord(
                                    ${record.id}
                                )
                            "
                        >
                            🗑️ Delete
                        </button>

                    </div>

                `;

            })
            .join("");
}


// =============================
// DELETE
// =============================

function deleteRecord(id) {

    records =
        records.filter(
            record =>
                record.id !== id
        );


    saveRecords();

    renderRecords();

    showToast(
        "🗑️ Record deleted."
    );
}


// =============================
// SAVE
// =============================

function saveRecords() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(records)
    );
}


// =============================
// BACK
// =============================

function goBack() {

    window.location.href =
        `health.html?pet=${petId}`;
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


    setTimeout(() => {

        toast.classList.remove(
            "show"
        );

    }, 2200);
}


// =============================
// SECURITY
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
// START
// =============================

renderRecords();
