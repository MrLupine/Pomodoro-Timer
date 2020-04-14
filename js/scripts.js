document.querySelectorAll(".clock__button").forEach(button => {
	button.addEventListener("click", (e) => {
		stopIfStarted();
		if (buttonCheck(e.target.id)){
            buttonAction(e.target.id);
        } else {
			timerButtonsMap[e.target.id]()
		}
	})
})

document.querySelectorAll(".clock__timer-setting--arrow").forEach(button => {
	button.addEventListener("click", (e) => {
		inputVariations[e.target.id]();
	})
})

document.querySelectorAll(".clock__timer-setting--input").forEach(input => {
	input.addEventListener("input", (e) => {
		stopIfStarted;
		let inputValue = document.getElementById(`${e.target.id}`).value
		if (inputValue < 1) {
			inputValue = "";
		} else if (inputValue > 60) {
			inputValue = "60"
		} else if (inputValue.match(/[^\d]/g)) {
			inputValue = "25";
		}
		document.getElementById(`${e.target.id}`).value = inputValue
		if (e.target.id === "pomodoroMinutes") {
			domUpdate(doubleDigitCheck(inputValue), "00");
		}
   })
})

const timerButtonsMap = {
	"start": () => timerFunctions.milliseconds ? startStop(timerFunctions.milliseconds) : buttonAction("pomodoro"),
	"stop": () => {
		timerFunctions.timeReset();
		bodyColourUpdate("175, 175, 175");
		domUpdate("00", "00")
		document.title = "Pomodoro-Timer";
	},
	"pause": () => {
		bodyColourUpdate("175, 175, 175");
		document.getElementById("colon").style.color = "white"; 
		document.title = "PAUSED";
	},
}

//* Adds functionality to up & down arrows
const inputVariations = {
	"pomodoroPlus": () => changeInputValue("pomodoroMinutes", "+"),
	"pomodoroMinus": () => changeInputValue("pomodoroMinutes", "-"),
	"shortPlus": () => changeInputValue("shortMinutes", "+"),
	"shortMinus": () => changeInputValue("shortMinutes", "-"),
	"longPlus": () => changeInputValue("longMinutes", "+"),
	"longMinus": () => changeInputValue("longMinutes", "-"),
}

//* Object literal used for tracking countdown and time spent on timer.
const timerFunctions = {
	milliseconds: 0,
	colourInputs: "",
	type: "",
	pomodoroCount: 0,
	timeWorking: 0,
	timeResting: 0,
	timeWorked: 0,
	timeRested: 0,
	timeSpent: (action) => { //display time worked or rested accordingly.
		const hours = x => Math.floor((x % 356400000) / 3600000);
		const mins = x => Math.floor((x % 3600000) / 60000);
		document.getElementById(`${action}ed`).innerHTML = 
			`${doubleDigitCheck(hours((timerFunctions[`${action}ed`] + timerFunctions[`${action}ing`])))}H 
			 ${doubleDigitCheck(mins((timerFunctions[`${action}ed`] + timerFunctions[`${action}ing`])))}M`; 
	},
	timeReset: () => {
		this.milliseconds = 0;
		this.timeWorked = 0;
		this.timeRested = 0;
		document.querySelectorAll(".timer__count").forEach(x => x.innerHTML = "00H 00M");
	},
}

const bodyColourUpdate = x => document.body.style.backgroundColor = `rgb(${x})`;

const buttonAction = (x) => {
	stopIfStarted();
	timerFunctions.type = `${x}`;
	timerFunctions.milliseconds = `${minsToMilli(inputValueGetter(x))}`
	domUpdate(`${doubleDigitCheck(inputValueGetter(x))}`, "00");
	if (x === "pomodoro") {
		timerFunctions.colourInputs = () => `255, ${colourGetter(50)}, 25`;
	} else {
		timerFunctions.colourInputs = () => `19, 191, ${colourGetter(120)}`;
	}
	if (timerFunctions.type === "long") {
		timerFunctions.pomodoroCount = 0;
	}
	startStop(minsToMilli(`${inputValueGetter(x)}`));
}

const buttonCheck = type => ["pomodoro", "short", "long"].includes(type)

const changeInputValue = (id, operand) => {
	let num = Number(document.getElementById(`${id}`).value);
	stopIfStarted();
	(operand === '+') ? num += 1 : num -= 1;
	if (num === 0) {
		num = 60 
	} else if (num === 61) {
		num = 1
	};
	document.getElementById(`${id}`).value = `${num}`
	if (id === "pomodoroMinutes") {
		domUpdate(doubleDigitCheck(num), "00");
	}
}

const colourGetter = x => `${timerFunctions.milliseconds / colourAdjust(timerFunctions.type, x) + 70}`

const colourAdjust = (x, y) => {
	return minsToMilli(inputValueGetter(x)) / y
}

const colonFlash = () => {
	const domColon = document.getElementById("colon");
	domColon.style.color === "transparent" ? domColon.style.color = "white" : domColon.style.color = "transparent";
}

const domUpdate = (mins, secs) => {
	document.getElementById("minutes").innerHTML = `${mins}`;
	document.getElementById("seconds").innerHTML = `${secs}`;
	(timerFunctions.type === "pomodoro") ? 
		document.title = `Pomodoro | ${mins}:${secs}`: document.title = `Break | ${mins}:${secs}`;
}

const doubleDigitCheck = digit => digit < 10 ? `0${digit}` : digit < 0 ? "00" : `${digit}`; // if digit doesn't have a tenths place, place a zero before digit

const inputValueGetter = x => Number(document.getElementById(`${x}Minutes`).value);

function minsToMilli(minutes) {
	return minutes * 1000 * 60;
}

//* On start or stop, calculate new future time to count up to and activate timer function.
const startStop = milliseconds => {
	const startTime = new Date().getTime();
	const futureTime = startTime + milliseconds;
	activeTimer = setInterval(colonFlash, 500);
	countdownTimer = setInterval(timerOutput, 1000, futureTime, startTime);
}

const stopIfStarted = () => {
	if (timerFunctions.type) {
		clearInterval(countdownTimer);
		clearInterval(activeTimer);
	}
	/* Save amount of time spent during interval before timer stopped. */
	if (timerFunctions.type === "pomodoro") {
		timerFunctions.timeWorked += timerFunctions.timeWorking;
	} else {
		timerFunctions.timeRested += timerFunctions.timeResting;
	}
}

let timerOutput = (futureTime, startTime) => {
	let currentTime = new Date().getTime();
	let countdownMilliseconds = futureTime - currentTime;
	timerFunctions.milliseconds = countdownMilliseconds;
	bodyColourUpdate(`${timerFunctions.colourInputs()}`);
	const type = (timerFunctions.type === "pomodoro");
	/* calculate and track time elapsed since interval start. */
	const addTime = () => (currentTime - startTime);
	if (type) {
		timerFunctions.timeWorking = addTime();
		timerFunctions.timeSpent("timeWork") 
	} else {
		timerFunctions.timeResting = addTime();
		timerFunctions.timeSpent("timeRest");
	};
	let minutes = Math.floor((countdownMilliseconds + 1000) / 60000); // add one second locally to minutes so that minutes change at correct time
	let seconds = ((countdownMilliseconds % 60000) / 1000).toFixed(0);
	const secondsCheck = (x) => (x === "60") ? 00 : Number(x); // on 60 seconds left, display "00" instead
	domUpdate(doubleDigitCheck(minutes), doubleDigitCheck(secondsCheck(seconds)))
	if (countdownMilliseconds < 0 && type) {
		document.getElementById('wolf').play();
	 	if (timerFunctions.pomodoroCount < 5) {
			buttonAction("short");
	 	} else {
			buttonAction("long");
		}
	} else if (countdownMilliseconds < 0 && !type){
		document.getElementById('rooster').play();
		buttonAction("pomodoro");
	}
};