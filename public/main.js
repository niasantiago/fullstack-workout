var thumbUp = document.getElementsByClassName("fa-thumbs-up");
var trash = document.getElementsByClassName("fa-trash");
const btn = document.querySelector(".clearAll");

btn.addEventListener("click", clearAll);

const workouts = [
  {
    name: "Cardio Blast",
    description:
      "A high-intensity cardio workout that will get your heart pumping and calories burning!",
    difficulty: "Intermediate",
    duration: "45 minutes",
    equipment: ["Treadmill", "Stationary bike", "Elliptical"],
  },
  {
    name: "Total Body Toning",
    description:
      "This full-body workout will tone and sculpt every muscle group for a lean and defined physique.",
    difficulty: "Advanced",
    duration: "60 minutes",
    equipment: ["Dumbbells", "Resistance bands", "Kettlebells"],
  },
  {
    name: "Yoga Flow",
    description:
      "A calming and rejuvenating yoga practice that will stretch and strengthen your body and mind.",
    difficulty: "Beginner",
    duration: "30 minutes",
    equipment: ["Yoga mat", "Yoga blocks", "Yoga strap"],
  },
  {
    name: "HIIT Bootcamp",
    description:
      "This high-intensity interval training workout will challenge your stamina, speed, and agility.",
    difficulty: "Advanced",
    duration: "60 minutes",
    equipment: ["Jump rope", "Kettlebells", "Boxing gloves"],
  },
  {
    name: "Pilates Sculpt",
    description:
      "This low-impact workout focuses on core strength, flexibility, and body alignment.",
    difficulty: "Intermediate",
    duration: "45 minutes",
    equipment: ["Pilates reformer", "Pilates ball", "Resistance bands"],
  },
  {
    name: "Powerlifting 101",
    description:
      'This strength-building workout focuses on the "big three" lifts: squat, bench press, and deadlift.',
    difficulty: "Advanced",
    duration: "90 minutes",
    equipment: ["Barbell", "Weight plates", "Power rack"],
  },
  {
    name: "Zumba Dance Party",
    description:
      "This high-energy dance workout features Latin-inspired music and moves for a fun and effective cardio workout.",
    difficulty: "Beginner",
    duration: "60 minutes",
    equipment: ["None"],
  },
  {
    name: "Bodyweight Burn",
    description:
      "This equipment-free workout uses your own body weight for resistance and cardio training.",
    difficulty: "Intermediate",
    duration: "30 minutes",
    equipment: ["None"],
  },
  {
    name: "Boxing Bootcamp",
    description:
      "This intense workout combines boxing drills with strength exercises for a total-body challenge.",
    difficulty: "Advanced",
    duration: "60 minutes",
    equipment: ["Boxing gloves", "Heavy bag", "Speed bag"],
  },
  {
    name: "Barre Fitness",
    description:
      "This low-impact workout combines ballet-inspired moves with Pilates and yoga for a full-body workout.",
    difficulty: "Intermediate",
    duration: "45 minutes",
    equipment: ["Barre", "Resistance bands", "Pilates ball"],
  },
];

Array.from(thumbUp).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    const thumbUp = parseFloat(
      this.parentNode.parentNode.childNodes[5].innerText
    );
    fetch("messages", {
      method: "put",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: name,
        msg: msg,
        thumbUp: thumbUp,
      }),
    })
      .then((response) => {
        if (response.ok) return response.json();
      })
      .then((data) => {
        console.log(data);
        window.location.reload(true);
      });
  });
});

Array.from(trash).forEach(function (element) {
  element.addEventListener("click", function () {
    const name = this.parentNode.parentNode.childNodes[1].innerText;
    const msg = this.parentNode.parentNode.childNodes[3].innerText;
    fetch("messages", {
      method: "delete",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name: name,
        msg: msg,
      }),
    }).then(function (response) {
      window.location.reload();
    });
  });
});

function clearAll() {
  fetch("/clearAll", {
    method: "delete",
    headers: {
      "Content-Type": "application/json",
    },
  });
  window.location.reload();
}
