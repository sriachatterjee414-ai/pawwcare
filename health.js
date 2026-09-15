// ======================================
// PET PASSPORT — HEALTH MODULE
// ======================================


let pets =
    JSON.parse(
        localStorage.getItem(
            "petPassportPets"
        )
    ) || [];


let medicalRecords =
    JSON.parse(
        localStorage.getItem(
            "petPassportMedical"
        )
    ) || [];


// ======================================
// FIND CURRENT PET
// ======================================


const params =
    new URLSearchParams(
        window.location.search
    );


const petId =
    Number(
        params.get("pet")
    );


let currentPet =
    pets.find(
        pet => pet.id === petId
    );


// ======================================
// LOAD PET
// ======================================


function loadPet() {

    if (!currentPet) {

        document.getElementById(
            "petName"
        ).textContent = "Pet";

        document.getElementById(
            "petSummaryName"
        ).textContent =
            "No pet selected";

        return;
    }


    document.getElementById(
        "petName"
    ).textContent =
        currentPet.name;


    document.getElementById(
        "petSummaryName"
    ).textContent =
        currentPet.name;


    document.getElementById(
        "petSummaryInfo"
    ).textContent =

        `${currentPet.species} · ` +

        `${currentPet.breed || "Breed unknown"} · ` +

        `${getAge(currentPet.birthday)}`;


    if (currentPet.photo) {

        document.getElementById(
            "petPhoto"
        ).innerHTML = `

            <img
                src="${currentPet.photo}"
                alt="${currentPet.name}"
            >

        `;

    }

}


// ======================================
// AGE
// ======================================


function getAge(birthday) {

    if (!birthday) {

        return "Age unknown";

    }


    const birth =
        new Date(birthday);

    const now =
        new Date();


    let years =
        now.getFullYear()
        -
        birth.getFullYear();


    const birthdayPassed =
        (
            now.getMonth()
            >
            birth.getMonth()
        )
        ||
        (
            now.getMonth()
            ===
            birth.getMonth()
            &&
            now.getDate()
            >=
            birth.getDate()
        );


    if (!birthdayPassed) {

        years--;

    }


    if (years >= 1) {

        return `${years} year${years === 1 ? "" : "s"} old`;

    }


    const months =
        (
            now.getFullYear()
            -
            birth.getFullYear()
        ) * 12
        +
        (
            now.getMonth()
            -
            birth.getMonth()
        );


    return `${Math.max(0, months)} month${months === 1 ? "" : "s"} old`;

}


// ======================================
// FORM CONTROLS
// ======================================


function openMedicalForm() {

    closeForms();

    document
        .getElementById(
            "medicalForm"
        )
        .classList.remove("hidden");

}


function openVaccinationForm() {

    closeForms();

    document
        .getElementById(
            "vaccinationForm"
        )
        .classList.remove("hidden");

}


function closeForms() {

    document
        .getElementById(
            "medicalForm"
        )
        .classList.add("hidden");


    document
        .getElementById(
            "vaccinationForm"
        )
        .classList.add("hidden");

}


// ======================================
// FILE → DATA URL
// ======================================


function readFile(file) {

    return new Promise(
        (resolve) => {

            if (!file) {

                resolve(null);

                return;

            }


            const reader =
                new FileReader();


            reader.onload =
                event => {

                    resolve({

                        name:
                            file.name,

                        type:
                            file.type,

                        data:
                            event.target.result

                    });

                };


            reader.readAsDataURL(file);

        }
    );

}


// ======================================
// SAVE MEDICAL RECORD
// ======================================


async function saveMedicalRecord() {

    if (!currentPet) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;

    }


    const date =
        document
            .getElementById(
                "visitDate"
            )
            .value;


    if (!date) {

        showToast(
            "📅 Please add the visit date!"
        );

        return;

    }


    const bloodFile =
        document
            .getElementById(
                "bloodTest"
            )
            .files[0];


    const prescriptionFile =
        document
            .getElementById(
                "prescription"
            )
            .files[0];


    const previousFile =
        document
            .getElementById(
                "previousReport"
            )
            .files[0];


    const blood =
        await readFile(
            bloodFile
        );


    const prescription =
        await readFile(
            prescriptionFile
        );


    const previous =
        await readFile(
            previousFile
        );


    const record = {

        id: Date.now(),

        petId:
            currentPet.id,

        type:
            "Vet Visit",

        date:
            date,

        vet:
            document
                .getElementById(
                    "vetName"
                )
                .value,

        reason:
            document
                .getElementById(
                    "visitReason"
                )
                .value,

        notes:
            document
                .getElementById(
                    "visitNotes"
                )
                .value,

        bloodTest:
            blood,

        prescription:
            prescription,

        previousReport:
            previous

    };


    medicalRecords.push(
        record
    );


    saveMedicalData();


    clearMedicalForm();

    closeForms();

    renderTimeline();


    showToast(
        "🩺 Medical record saved!"
    );

}


// ======================================
// SAVE VACCINATION
// ======================================


function saveVaccination() {

    if (!currentPet) {

        showToast(
            "🐾 Please select a pet first!"
        );

        return;

    }


    const vaccine =
        document
            .getElementById(
                "vaccineName"
            )
            .value.trim();


    const date =
        document
            .getElementById(
                "vaccineDate"
            )
            .value;


    if (!vaccine || !date) {

        showToast(
            "💉 Add the vaccine and date!"
        );

        return;

    }


    const record = {

        id: Date.now(),

        petId:
            currentPet.id,

        type:
            "Vaccination",

        vaccine:
            vaccine,

        date:
            date,

        nextDate:
            document
                .getElementById(
                    "nextVaccineDate"
                )
                .value,

        vet:
            document
                .getElementById(
                    "vaccineVet"
                )
                .value,

        notes:
            document
                .getElementById(
                    "vaccineNotes"
                )
                .value

    };


    medicalRecords.push(
        record
    );


    saveMedicalData();


    clearVaccinationForm();

    closeForms();

    renderTimeline();


    showToast(
        "💉 Vaccination saved!"
    );

}


// ======================================
// SAVE DATABASE
// ======================================


function saveMedicalData() {

    localStorage.setItem(

        "petPassportMedical",

        JSON.stringify(
            medicalRecords
        )

    );

}


// ======================================
// TIMELINE
// ======================================


function renderTimeline() {

    const container =
        document
            .getElementById(
                "medicalTimeline"
            );


    const records =
        medicalRecords

            .filter(
                record =>
                    record.petId
                    ===
                    petId
            )

            .sort(
                (a,b) =>
                    new Date(b.date)
                    -
                    new Date(a.date)
            );


    if (records.length === 0) {

        container.innerHTML = `

            <div class="empty">

                <div>
                    🩺
                </div>

                <h3>
                    No medical records yet
                </h3>

                <p>
                    Your pet's health journey
                    will appear here.
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML = `

        <div class="timeline">

            ${
                records
                    .map(
                        record =>
                            createTimelineCard(
                                record
                            )
                    )
                    .join("")
            }

        </div>

    `;

}


// ======================================
// TIMELINE CARD
// ======================================


function createTimelineCard(record) {

    if (
        record.type
        ===
        "Vaccination"
    ) {

        return `

            <div
                class="timeline-card vaccine-card"
            >

                <div class="timeline-date">

                    ${formatDate(record.date)}

                </div>


                <h3>
                    💉 ${escapeHTML(record.vaccine)}
                </h3>


                <div class="record-details">

                    <div class="detail">

                        <strong>
                            GIVEN
                        </strong>

                        ${formatDate(record.date)}

                    </div>


                    ${
                        record.nextDate

                        ?

                        `

                        <div class="detail">

                            <strong>
                                NEXT DUE
                            </strong>

                            ${formatDate(
                                record.nextDate
                            )}

                        </div>

                        `

                        :

                        ""

                    }


                    ${
                        record.vet

                        ?

                        `

                        <div class="detail">

                            <strong>
                                VETERINARIAN
                            </strong>

                            ${escapeHTML(
                                record.vet
                            )}

                        </div>

                        `

                        :

                        ""

                    }

                </div>


                ${
                    record.notes

                    ?

                    `<p>
                        ${escapeHTML(record.notes)}
                    </p>`

                    :

                    ""

                }

            </div>

        `;

    }


    return `

        <div class="timeline-card">

            <div class="timeline-date">

                ${formatDate(record.date)}

            </div>


            <h3>
                🩺 Vet Visit
            </h3>


            <div class="record-details">

                ${
                    record.vet

                    ?

                    `

                    <div class="detail">

                        <strong>
                            VETERINARIAN
                        </strong>

                        ${escapeHTML(record.vet)}

                    </div>

                    `

                    :

                    ""

                }


                ${
                    record.reason

                    ?

                    `

                    <div class="detail">

                        <strong>
                            REASON
                        </strong>

                        ${escapeHTML(record.reason)}

                    </div>

                    `

                    :

                    ""

                }

            </div>


            ${
                record.notes

                ?

                `<p>
                    ${escapeHTML(record.notes)}
                </p>`

                :

                ""

            }


            <div>

                ${
                    createDocument(
                        record.bloodTest,
                        "🩸 Blood Test"
                    )
                }

                ${
                    createDocument(
                        record.prescription,
                        "💊 Prescription"
                    )
                }

                ${
                    createDocument(
                        record.previousReport,
                        "📄 Previous Report"
                    )
                }

            </div>

        </div>

    `;

}


// ======================================
// DOCUMENT LINK
// ======================================


function createDocument(
    file,
    label
) {

    if (!file) {

        return "";

    }


    return `

        <a
            class="document"
            href="${file.data}"
            download="${escapeHTML(file.name)}"
            target="_blank"
        >
            ${label} · ${escapeHTML(file.name)}
        </a>

    `;

}


// ======================================
// CLEAR FORMS
// ======================================


function clearMedicalForm() {

    document
        .getElementById(
            "visitDate"
        ).value = "";


    document
        .getElementById(
            "vetName"
        ).value = "";


    document
        .getElementById(
            "visitReason"
        ).value = "";


    document
        .getElementById(
            "visitNotes"
        ).value = "";


    document
        .getElementById(
            "bloodTest"
        ).value = "";


    document
        .getElementById(
            "prescription"
        ).value = "";


    document
        .getElementById(
            "previousReport"
        ).value = "";

}


function clearVaccinationForm() {

    document
        .getElementById(
            "vaccineName"
        ).value = "";


    document
        .getElementById(
            "vaccineDate"
        ).value = "";


    document
        .getElementById(
            "nextVaccineDate"
        ).value = "";


    document
        .getElementById(
            "vaccineVet"
        ).value = "";


    document
        .getElementById(
            "vaccineNotes"
        ).value = "";

}


// ======================================
// FORMAT DATE
// ======================================


function formatDate(date) {

    if (!date) {

        return "";

    }


    return new Date(
        date + "T00:00:00"
    ).toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

}


// ======================================
// ESCAPE TEXT
// ======================================


function escapeHTML(text) {

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


// ======================================
// TOAST
// ======================================


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


// ======================================
// BACK
// ======================================


function goBack() {

    window.location.href =
        `index.html`;

}


// ======================================
// START
// ======================================


loadPet();

renderTimeline();
