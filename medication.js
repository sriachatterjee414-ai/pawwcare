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

    document.getElementById(
        "petName"
    ).textContent =
        pet.species === "Cat"
            ? `🐱 ${pet.name}`
            : `🐶 ${pet.name}`;

}


// =============================
// STORAGE
// =============================

const medicationKey =
    `medications_${petId}`;

const historyKey =
    `medicationHistory_${petId}`;


let medications = JSON.parse(
    localStorage.getItem(
        medicationKey
    )
) || [];


let medicationHistory = JSON.parse(
    localStorage.getItem(
        historyKey
    )
) || [];


// =============================
// ALARM VARIABLES
// =============================

let alarmAudio = null;

let alarmInterval = null;

let alarmMedicationId = null;

let lastTriggered = "";


// =============================
// ADD MEDICATION
// =============================

function addMedication() {

    const name =
        document.getElementById(
            "medicineName"
        ).value.trim();


    const dose =
        document.getElementById(
            "medicineDose"
        ).value.trim();


    const frequency =
        document.getElementById(
            "medicineFrequency"
        ).value;


    const startDate =
        document.getElementById(
            "startDate"
        ).value;


    const endDate =
        document.getElementById(
            "endDate"
        ).value;


    const time =
        document.getElementById(
            "medicineTime"
        ).value;


    if (!name) {

        showToast(
            "💊 Enter the medicine name!"
        );

        return;
    }


    if (!dose) {

        showToast(
            "💊 Enter the dose!"
        );

        return;
    }


    if (!frequency) {

        showToast(
            "⏰ Choose the frequency!"
        );

        return;
    }


    if (!startDate) {

        showToast(
            "📅 Choose a start date!"
        );

        return;
    }


    if (
        endDate &&
        endDate < startDate
    ) {

        showToast(
            "📅 End date cannot be before start date!"
        );

        return;
    }


    if (!time) {

        showToast(
            "⏰ Choose a reminder time!"
        );

        return;
    }


    const medication = {

        id: Date.now(),

        name: name,

        dose: dose,

        frequency: frequency,

        startDate: startDate,

        endDate: endDate,

        time: time,

        active: true,

        created:
            new Date().toISOString()

    };


    medications.push(
        medication
    );


    saveMedications();


    clearMedicationForm();


    showToast(
        `💊 ${name} added!`
    );


    renderMedications();
}


// =============================
// CLEAR FORM
// =============================

function clearMedicationForm() {

    document.getElementById(
        "medicineName"
    ).value = "";


    document.getElementById(
        "medicineDose"
    ).value = "";


    document.getElementById(
        "medicineFrequency"
    ).value = "";


    document.getElementById(
        "startDate"
    ).value = "";


    document.getElementById(
        "endDate"
    ).value = "";


    document.getElementById(
        "medicineTime"
    ).value = "";
}


// =============================
// CHECK ACTIVE
// =============================

function isMedicationActive(
    medication
) {

    const today =
        getLocalDateString();


    if (
        today <
        medication.startDate
    ) {

        return false;

    }


    if (
        medication.endDate &&
        today >
        medication.endDate
    ) {

        return false;

    }


    return medication.active !== false;
}


// =============================
// RENDER MEDICATIONS
// =============================

function renderMedications() {

    const list =
        document.getElementById(
            "medicationList"
        );


    const active =
        medications.filter(
            isMedicationActive
        );


    document.getElementById(
        "medicineCount"
    ).textContent =
        active.length;


    if (active.length === 0) {

        list.innerHTML = `
            <p
                style="
                    text-align:center;
                    color:#999;
                "
            >
                💊 No active medications.
            </p>
        `;

        renderHistory();

        return;
    }


    list.innerHTML =
        active
            .map(medication => `

                <div class="medication-item">

                    <div
                        class="medication-header"
                    >

                        <div>

                            <div
                                class="medication-name"
                            >
                                💊
                                ${escapeHTML(
                                    medication.name
                                )}
                            </div>

                        </div>

                        <span
                            class="active-pill"
                        >
                            ACTIVE
                        </span>

                    </div>


                    <div
                        class="medication-details"
                    >

                        💊 Dose:
                        ${escapeHTML(
                            medication.dose
                        )}

                        <br>

                        🔄 Frequency:
                        ${escapeHTML(
                            medication.frequency
                        )}

                        <br>

                        📅
                        ${medication.startDate}

                        ${
                            medication.endDate
                            ?
                            ` → ${medication.endDate}`
                            :
                            ""
                        }

                        <br>

                        ⏰ Reminder:
                        ${medication.time}

                    </div>


                    <button
                        class="taken-button"
                        onclick="
                            markMedicationTaken(
                                ${medication.id}
                            )
                        "
                    >
                        ✓ Mark as Taken
                    </button>


                    <button
                        class="delete-button"
                        onclick="
                            deleteMedication(
                                ${medication.id}
                            )
                        "
                    >
                        🗑️ Delete
                    </button>

                </div>

            `)
            .join("");


    renderHistory();
}


// =============================
// MARK TAKEN
// =============================

function markMedicationTaken(id) {

    const medication =
        medications.find(
            med =>
                med.id === id
        );


    if (!medication) return;


    medicationHistory.push({

        id: Date.now(),

        medicationId: id,

        name:
            medication.name,

        dose:
            medication.dose,

        time:
            new Date().toLocaleString(),

        date:
            getLocalDateString()

    });


    localStorage.setItem(
        historyKey,
        JSON.stringify(
            medicationHistory
        )
    );


    showToast(
        `✓ ${medication.name} recorded as taken!`
    );


    renderHistory();
}


// =============================
// DELETE
// =============================

function deleteMedication(id) {

    const medication =
        medications.find(
            med =>
                med.id === id
        );


    if (!medication) return;


    medications =
        medications.filter(
            med =>
                med.id !== id
        );


    saveMedications();


    if (
        alarmMedicationId === id
    ) {

        stopAlarm();

    }


    renderMedications();


    showToast(
        "🗑️ Medication removed."
    );
}


// =============================
// SAVE
// =============================

function saveMedications() {

    localStorage.setItem(
        medicationKey,
        JSON.stringify(
            medications
        )
    );
}


// =============================
// HISTORY
// =============================

function renderHistory() {

    const container =
        document.getElementById(
            "medicationHistory"
        );


    if (
        medicationHistory.length === 0
    ) {

        container.innerHTML = `
            <p
                style="
                    text-align:center;
                    color:#999;
                "
            >
                📋 No medication history yet.
            </p>
        `;

        return;
    }


    container.innerHTML =
        medicationHistory
            .slice()
            .reverse()
            .slice(0, 30)
            .map(entry => `

                <div class="history-item">

                    ✓
                    <strong>
                        ${escapeHTML(
                            entry.name
                        )}
                    </strong>

                    —
                    ${escapeHTML(
                        entry.dose
                    )}

                    <br>

                    🕐 ${entry.time}

                </div>

            `)
            .join("");
}


// =============================
// MEDICATION REMINDER
// =============================

setInterval(
    checkMedicationReminders,
    1000
);


function checkMedicationReminders() {

    const now =
        new Date();


    const currentTime =
        now.toTimeString()
            .slice(0, 5);


    const today =
        getLocalDateString();


    medications.forEach(
        medication => {

            if (
                !isMedicationActive(
                    medication
                )
            ) {

                return;

            }


            if (
                medication.time !==
                currentTime
            ) {

                return;

            }


            const triggerKey =
                `${today}_${medication.id}_${currentTime}`;


            if (
                lastTriggered ===
                triggerKey
            ) {

                return;

            }


            lastTriggered =
                triggerKey;


            startAlarm(
                medication
            );

        }
    );
}


// =============================
// START ALARM
// =============================

function startAlarm(
    medication
) {

    alarmMedicationId =
        medication.id;


    const alarmBox =
        document.getElementById(
            "alarmBox"
        );


    document.getElementById(
        "alarmMedicine"
    ).textContent =
        `${pet?.name || "Your pet"} needs ${medication.name} — ${medication.dose}`;


    alarmBox.classList.remove(
        "hidden"
    );


    stopCurrentAudio();


    try {

        alarmAudio =
            new AudioContext();


        playAlarmTone();

    } catch (error) {

        console.log(error);

    }


    showToast(
        `🔔 ${medication.name} time!`
    );
}


// =============================
// REPEATING ALARM SOUND
// =============================

function playAlarmTone() {

    if (!alarmAudio) return;


    const oscillator =
        alarmAudio.createOscillator();


    const gain =
        alarmAudio.createGain();


    oscillator.connect(gain);

    gain.connect(
        alarmAudio.destination
    );


    oscillator.frequency.value =
        800;

    oscillator.type =
        "sine";


    gain.gain.value =
        0.25;


    oscillator.start();


    oscillator.stop(
        alarmAudio.currentTime + 0.5
    );


    alarmInterval =
        setTimeout(
            playAlarmTone,
            800
        );
}


// =============================
// STOP ALARM
// =============================

function stopAlarm() {

    clearTimeout(
        alarmInterval
    );


    alarmInterval = null;


    stopCurrentAudio();


    alarmMedicationId =
        null;


    document.getElementById(
        "alarmBox"
    ).classList.add(
        "hidden"
    );


    showToast(
        "🔕 Alarm stopped."
    );
}


// =============================
// STOP AUDIO
// =============================

function stopCurrentAudio() {

    if (!alarmAudio) return;


    try {

        alarmAudio.close();

    } catch (error) {

        console.log(error);

    }


    alarmAudio = null;
}


// =============================
// LOCAL DATE
// =============================

function getLocalDateString() {

    const date =
        new Date();


    const year =
        date.getFullYear();


    const month =
        String(
            date.getMonth() + 1
        ).padStart(2, "0");


    const day =
        String(
            date.getDate()
        ).padStart(2, "0");


    return `${year}-${month}-${day}`;
}


// =============================
// BACK
// =============================

function goBack() {

    stopAlarm();

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


// =============================
// START
// =============================

renderMedications();
