const params = new URLSearchParams(
    window.location.search
);

const petId = Number(
    params.get("pet")
);

let pets = JSON.parse(
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
// STORAGE
// =============================

const waterKey =
    `waterRecords_${petId}`;

const goalKey =
    `waterGoal_${petId}`;

const reminderKey =
    `waterReminder_${petId}`;

let waters = JSON.parse(
    localStorage.getItem(waterKey)
) || [];


// =============================
// ADD WATER
// =============================

function addWater() {

    const amount =
        Number(
            document.getElementById(
                "waterAmount"
            ).value
        );

    const time =
        document.getElementById(
            "waterTime"
        ).value;


    if (!amount || amount <= 0) {

        showToast(
            "💧 Enter the water amount!"
        );

        return;
    }


    const water = {

        id: Date.now(),

        amount: amount,

        time:
            time ||
            new Date().toLocaleTimeString(
                [],
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            ),

        date:
            new Date().toISOString()

    };


    waters.push(water);

    saveWaters();

    document.getElementById(
        "waterAmount"
    ).value = "";

    document.getElementById(
        "waterTime"
    ).value = "";


    showToast(
        "💧 Water recorded!"
    );

    renderWaters();
}


// =============================
// RENDER WATER
// =============================

function renderWaters() {

    const today =
        new Date().toDateString();


    const todayWaters =
        waters.filter(
            water =>
                new Date(water.date)
                    .toDateString()
                === today
        );


    let total = 0;

    todayWaters.forEach(
        water => {
            total += Number(
                water.amount
            );
        }
    );


    document.getElementById(
        "waterTotal"
    ).textContent = total;


    document.getElementById(
        "totalBadge"
    ).textContent =
        `${total} ml`;


    const goal =
        Number(
            localStorage.getItem(
                goalKey
            )
        ) || 0;


    if (goal > 0) {

        const percentage =
            Math.min(
                100,
                (total / goal) * 100
            );


        document.getElementById(
            "waterProgress"
        ).style.width =
            `${percentage}%`;


        document.getElementById(
            "waterProgressText"
        ).textContent =
            `${total} / ${goal} ml`;


        document.getElementById(
            "waterGoalText"
        ).textContent =
            `Daily goal: ${goal} ml`;

    } else {

        document.getElementById(
            "waterProgress"
        ).style.width =
            "0%";


        document.getElementById(
            "waterProgressText"
        ).textContent =
            `${total} ml recorded`;


        document.getElementById(
            "waterGoalText"
        ).textContent =
            "Daily goal: Not set";
    }


    const list =
        document.getElementById(
            "waterList"
        );


    if (todayWaters.length === 0) {

        list.innerHTML = `
            <p style="text-align:center;color:#999;">
                🐾 No water recorded today.
            </p>
        `;

        return;
    }


    list.innerHTML =
        todayWaters
            .map(water => `

                <div class="water-item">

                    <div>

                        <strong>
                            💧 ${water.amount} ml
                        </strong>

                        <small>
                            ${water.time}
                        </small>

                    </div>

                    <button
                        class="delete-button"
                        onclick="deleteWater(${water.id})"
                    >
                        🗑️
                    </button>

                </div>

            `)
            .join("");
}


// =============================
// DELETE
// =============================

function deleteWater(id) {

    waters =
        waters.filter(
            water =>
                water.id !== id
        );

    saveWaters();

    renderWaters();

    showToast(
        "🗑️ Water entry removed."
    );
}


// =============================
// SAVE
// =============================

function saveWaters() {

    localStorage.setItem(
        waterKey,
        JSON.stringify(waters)
    );
}


// =============================
// GOAL
// =============================

function saveWaterGoal() {

    const goal =
        Number(
            document.getElementById(
                "waterGoal"
            ).value
        );


    if (!goal || goal <= 0) {

        showToast(
            "🎯 Enter a valid goal!"
        );

        return;
    }


    localStorage.setItem(
        goalKey,
        goal
    );


    showToast(
        "🎯 Water goal saved!"
    );


    renderWaters();
}


// Load goal

const savedGoal =
    localStorage.getItem(
        goalKey
    );

if (savedGoal) {

    document.getElementById(
        "waterGoal"
    ).value = savedGoal;
}


// =============================
// REMINDER
// =============================

function saveWaterReminder() {

    const time =
        document.getElementById(
            "waterReminder"
        ).value;


    if (!time) {

        showToast(
            "⏰ Choose a reminder time!"
        );

        return;
    }


    localStorage.setItem(
        reminderKey,
        time
    );


    document.getElementById(
        "waterReminderStatus"
    ).textContent =
        `🔔 Daily water reminder set for ${time}`;


    showToast(
        "🔔 Water reminder saved!"
    );
}


// Load reminder

const savedReminder =
    localStorage.getItem(
        reminderKey
    );

if (savedReminder) {

    document.getElementById(
        "waterReminder"
    ).value =
        savedReminder;

    document.getElementById(
        "waterReminderStatus"
    ).textContent =
        `🔔 Daily water reminder set for ${savedReminder}`;
}


// =============================
// REMINDER CHECK
// =============================

let lastReminderDate = "";


setInterval(() => {

    const reminder =
        localStorage.getItem(
            reminderKey
        );

    if (!reminder) return;


    const now =
        new Date();

    const current =
        now.toTimeString()
            .slice(0, 5);

    const today =
        now.toDateString();


    if (
        current === reminder &&
        lastReminderDate !== today
    ) {

        lastReminderDate =
            today;

        showToast(
            `💧 ${pet?.name || "Pet"}'s water time!`
        );

        playBell();
    }

}, 1000);


// =============================
// BELL
// =============================

function playBell() {

    try {

        const audio =
            new AudioContext();

        const oscillator =
            audio.createOscillator();

        const gain =
            audio.createGain();


        oscillator.connect(gain);

        gain.connect(
            audio.destination
        );


        oscillator.frequency.value =
            750;

        oscillator.type =
            "sine";


        gain.gain.value =
            0.2;


        oscillator.start();

        oscillator.stop(
            audio.currentTime + 0.7
        );

    } catch (error) {

        console.log(error);

    }
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
// START
// =============================

renderWaters();
