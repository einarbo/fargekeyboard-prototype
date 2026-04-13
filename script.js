let midiAccess = null;
let output = null;
let audio = null;

document.getElementById("status").innerText = "Status: Initialiserer…";

// ---------- INITIALISERER WEB MIDI ----------
if (navigator.requestMIDIAccess) {
    navigator.requestMIDIAccess()
        .then(onMIDISuccess, onMIDIFailure);
} else {
    document.getElementById("status").innerText =
        "WebMIDI støttes ikke i denne nettleseren.";
}

function onMIDISuccess(access) {
    midiAccess = access;

    // velg første tilgjengelige MIDI-output
    const outputs = Array.from(midiAccess.outputs.values());
    if (outputs.length > 0) {
        output = outputs[0];
        document.getElementById("status").innerText =
            "Status: MIDI klar – sender til " + output.name;
    } else {
        document.getElementById("status").innerText =
            "Ingen MIDI-utganger funnet.";
    }
}

function onMIDIFailure() {
    document.getElementById("status").innerText =
        "Kunne ikke få tilgang til MIDI.";
}

// ---------- SEND NOTE 60 ----------
document.getElementById("midiButton").addEventListener("click", () => {
    if (!output) return;

    // Note On (kanal 1): [0x90, note, velocity]
    output.send([0x90, 60, 100]);

    // Note Off etter 300 ms
    setTimeout(() => {
        output.send([0x80, 60, 0]);
    }, 300);
});

// ---------- LYDAVSPILLING ----------
document.getElementById("audioButton").addEventListener("click", () => {
    if (!audio) {
        audio = new Audio("test-tone.wav"); // må ligge i repoet!
    }
    audio.currentTime = 0;
    audio.play();
});