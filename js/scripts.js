document.querySelectorAll(".clock__button").forEach(button => {
	button.addEventListener("click", (e) => {
		timerButtonsMap[`${e.target.id}`]();
	})
})

const domUpdate = (mins, secs) => {
	const domMinutes = document.getElementById("minutes");
	const domSeconds = document.getElementById("seconds");
	domMinutes.innerHTML = `${mins}`;
	domSeconds.innerHTML = `${secs}`;
	(timerFunctions.type === "pomodoro") ? 
		document.title = `Pomodoro | ${mins}:${secs}`: document.title = `Break | ${mins}:${secs}`;
}

const bodyColourUpdate = x => document.body.style.backgroundColor = `rgb(${x})`;

const colourAdjust = (x, y) => {
	return minsToMilli(inputValueGetter(x)) / y
}

const inputValueGetter = x => Number(document.getElementById(`${x}Minutes`).value);

const colourGetter = x => `${timerFunctions.milliseconds / colourAdjust(timerFunctions.type, x) + 70}`

const timerButtonsMap = {
	"pomodoro": () => {
		stopIfStarted();
		timerFunctions.type = "pomodoro";
		timerFunctions.colourInputs = () => `255, ${colourGetter(50)}, 25`;
		domUpdate(`${inputValueGetter(timerFunctions.type)}`, "00");
		startStop(minsToMilli(`${inputValueGetter(timerFunctions.type)}`));
	},
	"short": () => {
		stopIfStarted();
		timerFunctions.type = "short";
		timerFunctions.colourInputs = () => `19, 191, ${colourGetter(120)}`;
		domUpdate(`${inputValueGetter(timerFunctions.type)}`, "00");
		startStop(minsToMilli(`${inputValueGetter(timerFunctions.type)}`));
	},
	"long": () => {
		stopIfStarted();
		timerFunctions.pomodoroCount = 0;
		timerFunctions.type = "long";
		timerFunctions.colourInputs = () => `19, 191, ${colourGetter(120)}}`;
		domUpdate(`${inputValueGetter(timerFunctions.type)}`, "00");
		startStop(minsToMilli(`${inputValueGetter(timerFunctions.type)}`));
	},
	"start": () => {
		stopIfStarted();
		bodyColourUpdate("255, 114, 49");
		startStop(timerFunctions.milliseconds);
	},
	"stop": () => {
		stopIfStarted();
		timerFunctions.timeReset();
		bodyColourUpdate("175, 175, 175");
		domUpdate("00", "00")
		document.title = "Pomodoro-Timer";
		console.log("testing")
	},
	"pause": () => {
		stopIfStarted();
		bodyColourUpdate("175, 175, 175");
		document.getElementById("colon").style.color = "white"; 
		document.title = "PAUSED";
	},
}

document.querySelectorAll(".clock__timer-setting--arrow").forEach(button => {
	button.addEventListener("click", (e) => {
		inputVariations[`${e.target.id}`]();
	})
})

const changeInputValue = (id, operand) => {
	const num = Number(document.getElementById(`${id}`).value);
	(operand === '+') ? 
		(document.getElementById(`${id}`).value = num + 1) : (document.getElementById(`${id}`).value = num - 1);
}

const inputVariations = {
	"pomodoroPlus": () => changeInputValue("pomodoroMinutes", "+"),
	"pomodoroMinus": () => changeInputValue("pomodoroMinutes", "-"),
	"shortPlus": () => changeInputValue("shortMinutes", "+"),
	"shortMinus": () => changeInputValue("shortMinutes", "-"),
	"longPlus": () => changeInputValue("longMinutes", "+"),
	"longMinus": () => changeInputValue("longMinutes", "-"),
}

const stopIfStarted = () => {
	if (timerFunctions.type) {
		inactiveTimer(countdownTimer, activeTimer)
	}
}

const timerFunctions = {
	milliseconds: 0,
	colourInputs: "",
	type: "",
	pomodoroCount: 0,
	timeWorked: 0,
	timeRested: 0,
	timeSpent: () => {
		document.getElementById("working").innerHTML = `${timerFunctions.timeWorked}`
		document.getElementById("resting").innerHTML = `${timerFunctions.timeRested}`
	},
	timeReset: () => {
		timerFunctions.milliseconds = 0;
	},
}

function minsToMilli(minutes) {
	return minutes * 1000 * 60;
}

/*
* On start or stop, calculate new future time to count up to and activate timer function.
*/
const startStop = milliseconds => {
	const startTime = new Date().getTime();
	const futureTime = startTime + milliseconds;
	activeTimer = setInterval(colonFlash, 500);
	countdownTimer = setInterval(timerOutput, 1000, futureTime, startTime);
}

const inactiveTimer = (x,y) => {
	clearInterval(x);
	clearInterval(y);
}

const colonFlash = () => {
	const domColon = document.getElementById("colon");
	domColon.style.color === "transparent" ? domColon.style.color = "white" : domColon.style.color = "transparent";
}

let timerOutput = (futureTime, startTime) => {
	const type = (timerFunctions.type === "pomodoro") ? true : false;
	let currentTime = new Date().getTime();
	let countdownMilliseconds = futureTime - currentTime;
	(timerFunctions.type === 'pomodoro') ? 
		timerFunctions.timeWorked += (currentTime - startTime) : timerFunctions.timeRested += (currentTime - startTime);
	timerFunctions.timeSpent();
	const doubleDigitCheck = digit => digit < 10 ? `0${digit}` : digit < 0 ? "00" : `${digit}`; // if digit doesn't have a tenths place, place a zero before digit
	let minutes = Math.floor((countdownMilliseconds + 1000) / 60000); // add one second locally to minutes so that minutes change at correct time
	let seconds = ((countdownMilliseconds % 60000) / 1000).toFixed(0);
	const secondsCheck = (x) => (x === "60") ? 00 : Number(x); // on 60 seconds left, display "00" instead
	domUpdate(doubleDigitCheck(minutes), doubleDigitCheck(secondsCheck(seconds)))
	timerFunctions.milliseconds = countdownMilliseconds;
	bodyColourUpdate(`${timerFunctions.colourInputs()}`);
	if (countdownMilliseconds < 0 && type) {
		inactiveTimer(countdownTimer, activeTimer)
	 	if (timerFunctions.pomodoroCount < 5) {
	 		timerButtonsMap["short"]()
	 	} else {
		timerButtonsMap["long"]()
		}
	 } else if (countdownMilliseconds < 0 && !type){
	 	inactiveTimer(countdownTimer, activeTimer);
		timerButtonsMap["pomodoro"]();
	 }
};
