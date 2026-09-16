// ==========================================
// PET PASSPORT - MEMORIES
// ==========================================


// =============================
// PET
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


const pet =
    pets.find(
        p => Number(p.id) === petId
    );


if (!pet) {

    alert("🐾 Pet not found!");

    window.location.href =
        "index.html";

}


// =============================
// MEMORY DATA
// =============================

const memoryKey =
    `petMemories_${petId}`;


let memories =
    JSON.parse(
        localStorage.getItem(
            memoryKey
        )
    ) || [];


// =============================
// TEMPORARY DATA
// =============================

let mainPhoto = "";

let extraPhotos = [];

let stickers = [];

let audioData = null;


// =============================
// DRAWING
// =============================

let canvas;

let ctx;

let drawing = false;

let currentTool = "pen";


// =============================
// RECORDING
// =============================

let mediaRecorder = null;

let audioChunks = [];


// =============================
// START
// =============================

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (!pet) return;


        displayPet();

        setupCanvas();

        setToday();

        renderMemories();

    }
);


// =============================
// DISPLAY PET
// =============================

function displayPet() {

    const emoji =
        pet.species === "Cat"
            ? "🐱"
            : "🐶";


    document.getElementById(
        "petName"
    ).textContent =
        pet.name;


    document.getElementById(
        "petSubtitle"
    ).textContent =
        `${pet.name}'s little scrapbook`;


    const photo =
        document.getElementById(
            "petPhoto"
        );


    if (pet.photo) {

        photo.innerHTML =
            `<img
                src="${escapeHTML(pet.photo)}"
                alt="${escapeHTML(pet.name)}"
            >`;

    } else {

        photo.textContent =
            emoji;

    }

}


// =============================
// TODAY
// =============================

function setToday() {

    const today =
        new Date();


    const date =
        today.toISOString()
            .split("T")[0];


    document.getElementById(
        "memoryDate"
    ).value =
        date;

}


// =============================
// MAIN PHOTO
// =============================

document.getElementById(
    "mainPhoto"
).addEventListener(
    "change",
    function () {

        const file =
            this.files[0];


        if (!file) return;


        const reader =
            new FileReader();


        reader.onload =
            event => {

                mainPhoto =
                    event.target.result;


                document.getElementById(
                    "mainPhotoPreview"
                ).innerHTML =
                    `<img
                        src="${mainPhoto}"
                        alt="Memory photo"
                    >`;

            };


        reader.readAsDataURL(file);

    }
);


// =============================
// EXTRA PHOTOS
// =============================

document.getElementById(
    "extraPhoto"
).addEventListener(
    "change",
    function () {

        const files =
            Array.from(this.files);


        files.forEach(file => {

            const reader =
                new FileReader();


            reader.onload =
                event => {

                    extraPhotos.push(
                        event.target.result
                    );


                    renderExtraPhotos();

                };


            reader.readAsDataURL(file);

        });


        this.value = "";

    }
);


function renderExtraPhotos() {

    const container =
        document.getElementById(
            "extraPhotoPreview"
        );


    container.innerHTML =
        extraPhotos
            .map(
                photo =>
                    `<img
                        src="${escapeHTML(photo)}"
                        alt="Extra memory photo"
                    >`
            )
            .join("");

}


// =============================
// CANVAS
// =============================

function setupCanvas() {

    canvas =
        document.getElementById(
            "drawingCanvas"
        );


    ctx =
        canvas.getContext("2d");


    resizeCanvas();


    window.addEventListener(
        "resize",
        resizeCanvas
    );


    canvas.addEventListener(
        "pointerdown",
        startDrawing
    );


    canvas.addEventListener(
        "pointermove",
        draw
    );


    canvas.addEventListener(
        "pointerup",
        stopDrawing
    );


    canvas.addEventListener(
        "pointerleave",
        stopDrawing
    );

}


function resizeCanvas() {

    if (!canvas) return;


    const oldImage =
        canvas.width > 0
            ? canvas.toDataURL()
            : null;


    const rect =
        canvas.getBoundingClientRect();


    canvas.width =
        rect.width;


    canvas.height =
        rect.height;


    if (oldImage) {

        const image =
            new Image();


        image.onload =
            () => {

                ctx.drawImage(
                    image,
                    0,
                    0,
                    canvas.width,
                    canvas.height
                );

            };


        image.src =
            oldImage;

    }

}


function getCanvasPosition(event) {

    const rect =
        canvas.getBoundingClientRect();


    return {

        x:
            event.clientX -
            rect.left,

        y:
            event.clientY -
            rect.top

    };

}


function startDrawing(event) {

    drawing = true;


    const position =
        getCanvasPosition(event);


    ctx.beginPath();

    ctx.moveTo(
        position.x,
        position.y
    );

}


function draw(event) {

    if (!drawing) return;


    const position =
        getCanvasPosition(event);


    ctx.lineWidth =
        Number(
            document.getElementById(
                "brushSize"
            ).value
        );


    ctx.lineCap =
        "round";


    if (currentTool === "eraser") {

        ctx.globalCompositeOperation =
            "destination-out";

    } else {

        ctx.globalCompositeOperation =
            "source-over";

        ctx.strokeStyle =
            "#432d45";

    }


    ctx.lineTo(
        position.x,
        position.y
    );


    ctx.stroke();

}


function stopDrawing() {

    drawing = false;

    ctx.beginPath();

    ctx.globalCompositeOperation =
        "source-over";

}


function setTool(tool) {

    currentTool =
        tool;


    document.getElementById(
        "penTool"
    ).classList.remove("active");


    document.getElementById(
        "eraserTool"
    ).classList.remove("active");


    if (tool === "pen") {

        document.getElementById(
            "penTool"
        ).classList.add("active");

    } else {

        document.getElementById(
            "eraserTool"
        ).classList.add("active");

    }

}


function clearCanvas() {

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

}


// =============================
// STICKERS
// =============================

function addSticker(sticker) {

    stickers.push(sticker);


    renderStickers();

}


function renderStickers() {

    const container =
        document.getElementById(
            "stickerCanvas"
        );


    container.innerHTML =
        stickers
            .map(
                sticker =>
                    `<span class="memory-sticker">
                        ${sticker}
                    </span>`
            )
            .join("");

}


// =============================
// SOUND RECORDING
// =============================

async function toggleRecording() {

    if (
        mediaRecorder &&
        mediaRecorder.state === "recording"
    ) {

        mediaRecorder.stop();

        return;

    }


    if (
        !navigator.mediaDevices ||
        !navigator.mediaDevices.getUserMedia
    ) {

        showToast(
            "🎙️ Audio recording isn't supported here."
        );

        return;

    }


    try {

        const stream =
            await navigator.mediaDevices.getUserMedia(
                {
                    audio: true
                }
            );


        audioChunks = [];


        mediaRecorder =
            new MediaRecorder(stream);


        mediaRecorder.ondataavailable =
            event => {

                if (event.data.size > 0) {

                    audioChunks.push(
                        event.data
                    );

                }

            };


        mediaRecorder.onstop =
            () => {

                const blob =
                    new Blob(
                        audioChunks,
                        {
                            type:
                                mediaRecorder.mimeType ||
                                "audio/webm"
                        }
                    );


                const reader =
                    new FileReader();


                reader.onload =
                    event => {

                        audioData =
                            event.target.result;


                        const audio =
                            document.getElementById(
                                "audioPreview"
                            );


                        audio.src =
                            audioData;


                        audio.hidden =
                            false;

                    };


                reader.readAsDataURL(blob);


                stream
                    .getTracks()
                    .forEach(
                        track =>
                            track.stop()
                    );


                document.getElementById(
                    "recordButton"
                ).textContent =
                    "🔴 Start Recording";


                document.getElementById(
                    "recordButton"
                ).classList.remove(
                    "recording"
                );


                document.getElementById(
                    "recordStatus"
                ).textContent =
                    "Recording saved";

            };


        mediaRecorder.start();


        document.getElementById(
            "recordButton"
        ).textContent =
            "⏹️ Stop Recording";


        document.getElementById(
            "recordButton"
        ).classList.add(
            "recording"
        );


        document.getElementById(
            "recordStatus"
        ).textContent =
            "Recording...";

    } catch (error) {

        console.error(error);

        showToast(
            "🎙️ Microphone permission was not granted."
        );

    }

}


// =============================
// SAVE MEMORY
// =============================

function saveMemory() {

    const title =
        document.getElementById(
            "memoryTitle"
        ).value.trim();


    const type =
        document.getElementById(
            "memoryType"
        ).value;


    const date =
        document.getElementById(
            "memoryDate"
        ).value;


    const note =
        document.getElementById(
            "memoryNote"
        ).value.trim();


    if (!title && !note && !mainPhoto) {

        showToast(
            "💗 Add something to your memory first!"
        );

        return;

    }


    const memory = {

        id:
            Date.now(),

        title:
            title || "Untitled Memory",

        type:
            type,

        date:
            date ||
            new Date()
                .toISOString()
                .split("T")[0],

        note:
            note,

        mainPhoto:
            mainPhoto,

        extraPhotos:
            [...extraPhotos],

        drawing:
            canvas.toDataURL(
                "image/png"
            ),

        stickers:
            [...stickers],

        audio:
            audioData,

        created:
            new Date().toISOString()

    };


    memories.unshift(
        memory
    );


    localStorage.setItem(
        memoryKey,
        JSON.stringify(memories)
    );


    showToast(
        "💗 Memory saved!"
    );


    resetMemoryForm();


    renderMemories();

}


// =============================
// RESET FORM
// =============================

function resetMemoryForm() {

    document.getElementById(
        "memoryTitle"
    ).value = "";


    document.getElementById(
        "memoryNote"
    ).value = "";


    document.getElementById(
        "mainPhoto"
    ).value = "";


    mainPhoto = "";


    extraPhotos = [];


    stickers = [];


    audioData = null;


    document.getElementById(
        "mainPhotoPreview"
    ).innerHTML = "";


    document.getElementById(
        "extraPhotoPreview"
    ).innerHTML = "";


    document.getElementById(
        "stickerCanvas"
    ).innerHTML = "";


    document.getElementById(
        "audioPreview"
    ).hidden = true;


    document.getElementById(
        "audioPreview"
    ).src = "";


    document.getElementById(
        "recordStatus"
    ).textContent =
        "Not recording";


    clearCanvas();


    setToday();

}


// =============================
// RENDER MEMORIES
// =============================

function renderMemories() {

    const container =
        document.getElementById(
            "memoryList"
        );


    document.getElementById(
        "memoryCount"
    ).textContent =
        memories.length;


    if (memories.length === 0) {

        container.innerHTML = `

            <div class="empty-memories">

                📖

                <h3>
                    No memories yet
                </h3>

                <p>
                    Create your first little
                    memory above. 💗
                </p>

            </div>

        `;

        return;

    }


    container.innerHTML =
        memories
            .map(
                memory =>
                    createMemoryHTML(
                        memory
                    )
            )
            .join("");

}


// =============================
// MEMORY HTML
// =============================

function createMemoryHTML(memory) {

    const extraImages =
        (memory.extraPhotos || [])
            .map(
                photo =>
                    `<img
                        src="${escapeHTML(photo)}"
                        alt="Memory picture"
                    >`
            )
            .join("");


    const stickersHTML =
        (memory.stickers || [])
            .map(
                sticker =>
                    `<span>
                        ${escapeHTML(sticker)}
                    </span>`
            )
            .join("");


    return `

        <article class="saved-memory">

            <h3>
                ${escapeHTML(
                    memory.title
                )}
            </h3>


            <div class="memory-meta">

                ${escapeHTML(
                    memory.type
                )}

                ·

                📅 ${formatDate(
                    memory.date
                )}

            </div>


            ${
                memory.mainPhoto
                    ?

                `<img
                    class="memory-main-photo"
                    src="${escapeHTML(
                        memory.mainPhoto
                    )}"
                    alt="Memory"
                >`

                    :

                ""
            }


            ${
                memory.note
                    ?

                `<div class="memory-note">
                    ${escapeHTML(
                        memory.note
                    )}
                </div>`

                    :

                ""
            }


            ${
                memory.drawing &&
                memory.drawing.length > 100
                    ?

                `<img
                    class="memory-drawing"
                    src="${escapeHTML(
                        memory.drawing
                    )}"
                    alt="Memory drawing"
                >`

                    :

                ""
            }


            ${
                extraImages
                    ?

                `<div class="memory-extra-images">
                    ${extraImages}
                </div>`

                    :

                ""
            }


            ${
                stickersHTML
                    ?

                `<div class="saved-stickers">
                    ${stickersHTML}
                </div>`

                    :

                ""
            }


            ${
                memory.audio
                    ?

                `<audio
                    class="memory-audio"
                    controls
                    src="${escapeHTML(
                        memory.audio
                    )}"
                ></audio>`

                    :

                ""
            }


            <button
                class="delete-memory"
                onclick="deleteMemory(${memory.id})"
            >
                🗑️ Delete Memory
            </button>

        </article>

    `;

}


// =============================
// DELETE MEMORY
// =============================

function deleteMemory(id) {

    const memory =
        memories.find(
            item =>
                item.id === id
        );


    if (!memory) return;


    const confirmed =
        confirm(
            `Delete "${memory.title}"?`
        );


    if (!confirmed) return;


    memories =
        memories.filter(
            item =>
                item.id !== id
        );


    localStorage.setItem(
        memoryKey,
        JSON.stringify(memories)
    );


    renderMemories();


    showToast(
        "🗑️ Memory deleted."
    );

}


// =============================
// DATE FORMAT
// =============================

function formatDate(dateString) {

    if (!dateString) {

        return "Date unknown";

    }


    const date =
        new Date(
            dateString + "T00:00:00"
        );


    return date.toLocaleDateString(
        undefined,
        {
            day: "numeric",
            month: "long",
            year: "numeric"
        }
    );

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

    return String(
        text ?? ""
    )

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
