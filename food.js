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
    document.getElementById("petName").textContent =
        pet.species === "Cat"
            ? `🐱 ${pet.name}`
            : `🐶 ${pet.name}`;
}


// =============================
// FOOD DATA
// =============================

const storageKey =
    `foodRecords_${petId}`;

let foods = JSON.parse(
    localStorage.getItem(storageKey)
) || [];


// =============================
// ADD FOOD
// =============================

function addFood() {

    const amount =
        Number(
            document
                .getElementById("foodAmount")
                .value
        );

    const name =
        document
            .getElementById("foodName")
            .value
            .trim();

    const time =
        document
            .getElementById("foodTime")
            .value;

    if (!amount || amount <= 0) {
        showToast("🍗 Enter the food amount!");
        return;
    }

    const food = {
        id: Date.now(),

        amount: amount,

        name:
            name || "Food",

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

    foods.push(food);

    saveFoods();

    document.getElementById("foodAmount").value = "";
    document.getElementById("foodName").value = "";
    document.getElementById("foodTime").value = "";

    showToast("🍗 Food recorded!");

    renderFoods();
}


// =============================
// RENDER
// =============================

function renderFoods() {

    const list =
        document.getElementById("foodList");

    const today =
        new Date().toDateString();

    const todayFoods =
        foods.filter(
            food =>
                new Date(food.date)
                    .toDateString()
                === today
        );

    if (todayFoods.length === 0) {

        list.innerHTML = `
            <p style="text-align:center;color:#999;">
                🐾 No food recorded today.
            </p>
        `;

        document.getElementById(
            "totalFood"
        ).textContent = "0 g";

        return;
    }

    let total = 0;

    list.innerHTML =
        todayFoods
            .map(food => {

                total += Number(
                    food.amount
                );

                return `
                    <div class="food-item">

                        <div>
                            <strong>
                                🍗 ${escapeHTML(food.name)}
                            </strong>

                            <small>
                                ${food.amount} g
                                ·
                                ${food.time}
                            </small>
                        </div>

                        <button
                            class="delete-button"
                            onclick="deleteFood(${food.id})"
                        >
                            🗑️
                        </button>

                    </div>
                `;
            })
            .join("");

    document.getElementById(
        "totalFood"
    ).textContent =
        `${total} g`;
}


// =============================
// DELETE
// =============================

function deleteFood(id) {

    foods =
        foods.filter(
            food => food.id !== id
        );

    saveFoods();

    renderFoods();

    showToast("🗑️ Food entry removed.");
}


// =============================
// SAVE
// =============================

function saveFoods() {

    localStorage.setItem(
        storageKey,
        JSON.stringify(foods)
    );
}


// =============================
// REMINDER
// =============================

function saveFoodReminder() {

    const time =
        document
            .getElementById("foodReminder")
            .value;

    if (!time) {
        showToast(
            "⏰ Choose a reminder time!"
        );
        return;
    }

    localStorage.setItem(
        `foodReminder_${petId}`,
        time
    );

    document.getElementById(
        "foodReminderStatus"
    ).textContent =
        `🔔 Daily food reminder set for ${time}`;

    showToast(
        "🔔 Food reminder saved!"
    );
}


// Load reminder

const savedReminder =
    localStorage.getItem(
        `foodReminder_${petId}`
    );

if (savedReminder) {

    document.getElementById(
        "foodReminder"
    ).value = savedReminder;

    document.getElementById(
        "foodReminderStatus"
    ).textContent =
        `🔔 Daily food reminder set for ${savedReminder}`;
}


// =============================
// SIMPLE REMINDER CHECK
// =============================

setInterval(() => {

    const reminder =
        localStorage.getItem(
            `foodReminder_${petId}`
        );

    if (!reminder) return;

    const now =
        new Date();

    const current =
        now.toTimeString()
            .slice(0, 5);

    if (current === reminder) {

        showToast(
            `🍗 ${pet?.name || "Pet"}'s food time!`
        );

        playBell();

    }

}, 60000);


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
            700;

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
        document.getElementById("toast");

    toast.textContent =
        message;

    toast.classList.add("show");

    setTimeout(() => {

        toast.classList.remove("show");

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

renderFoods();
