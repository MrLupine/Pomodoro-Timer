document.querySelectorAll(".container__button").forEach(button => {
	button.addEventListener("click", (e) => {
		timerButtonsMap[`${e.target.id}`]();
	})
})

const domUpdate = (mins, secs) => {
	const domMinutes = document.getElementById("minutes")
	const domSeconds = document.getElementById("seconds");
	domMinutes.innerHTML = `${mins}`;
	domSeconds.innerHTML = `${secs}`;
	(timerFunctions.timerType === "pomodoro") ? 
		document.title = `Pomodoro | ${mins}:${secs}`: document.title = `Break | ${mins}:${secs}`;
}

const timerButtonsMap = {
	"pomodoro": () => {
		stopIfStarted();
		timerFunctions.timerType = "pomodoro";
		document.body.style.backgroundColor = "rgb(255, 148, 49)";
		domUpdate("25", "00");
		startStop(minToMil(25));
	},
	"short": () => {
		stopIfStarted();
		timerFunctions.timerType = "short";
		document.body.style.backgroundColor = "rgb(134, 223, 51)";
		domUpdate("05", "00");
		startStop(minToMil(5));
	},
	"long": () => {
		stopIfStarted();
		timerFunctions.pomodoroCount = 0;
		document.body.style.backgroundColor = "rgb(134, 223, 51)";
		timerFunctions.timerType = "long";
		domUpdate("15", "00");
		startStop(minToMil(15));
	},
	"start": () => {
		stopIfStarted();
		document.body.style.backgroundColor = "rgb(255, 148, 49)";
		startStop(timerFunctions.milliseconds);
	},
	"stop": () => {
		stopIfStarted();
		timerFunctions.timeReset();
		document.body.style.backgroundColor = "rgb(175, 175, 175)"
		domUpdate("00", "00")
		document.title = "Pomodoro-Timer";
		console.log("testing")
	},
	"pause": () => {
		stopIfStarted();
		document.body.style.backgroundColor = "rgb(175, 175, 175)"
		domColon.style.color = "white"; 
		document.title = "PAUSED";
	},
}

const stopIfStarted = () => {
	if (timerFunctions.timerType) {
		inactiveTimer(countdownTimer, activeTimer)
	}
}

/*
* Holds time left for countdown, allowing pause and stop functions.
*/
const timerFunctions = {
	milliseconds: 0,
	timerType: "",
	pomodoroCount: 0,
	workCount: 0,
	restCount: 0,
	timeReset: () => timerFunctions.milliseconds = 0,
}

function minToMil(minutes) {
	return minutes * 1000 * 60;
}

/*
* On start or stop, calculate new future time to count up to.
*/
const startStop = milliseconds => {
	const currentTime = new Date().getTime();
	const futureTime = currentTime + milliseconds;
	activeTimer = setInterval(colonFlash, 500);
	countdownTimer = setInterval(timerOutput, 1000, futureTime);
}

const inactiveTimer = (x,y) => {
	clearInterval(x);
	clearInterval(y);
}

const colonFlash = () => {
	const domColon = document.getElementById("colon");
	domColon.style.color === "transparent" ? domColon.style.color = "white" : domColon.style.color = "transparent";
}

let timerOutput = (futureTime) => {
	const timerType = (timerFunctions.timerType === "pomodoro") ? true : false
	let currentTime = new Date().getTime();
	let countdownMilliseconds = futureTime - currentTime
	const doubleDigitCheck = digit => digit < 10 ? `0${digit}` : digit < 0 ? "00" : `${digit}`; // if digit doesn't have a tenths place, place a zero before digit
	let minutes = Math.floor((countdownMilliseconds + 1000) / 60000); // add one second locally to minutes so that minutes change at correct time
	let seconds = ((countdownMilliseconds % 60000) / 1000).toFixed(0);
	const secondsCheck = (x) => (x === "60") ? 00 : Number(x); // on 60 seconds left, display "00" instead
	domUpdate(doubleDigitCheck(minutes), doubleDigitCheck(secondsCheck(seconds)))
	timerFunctions.milliseconds = countdownMilliseconds;
	if (countdownMilliseconds < 0 && timerType) {
		inactiveTimer(countdownTimer, activeTimer)
		timerFunctions.pomodoroCount += 1;
		timerFunctions.workCount += 1;
		document.getElementById("working").innerHTML = `Pomodoros: ${timerFunctions.workCount}`;
	 	if (timerFunctions.pomodoroCount < 5) {
	 		timerButtonsMap["short"]()
	 	} else {
		timerButtonsMap["long"]()
		}
	 } else if (countdownMilliseconds < 0 && !timerType){
	 	inactiveTimer(countdownTimer, activeTimer);
		timerFunctions.restCount += 1;
		timerButtonsMap["pomodoro"]();
		document.getElementById("break").innerHTML = `Breaks: ${timerFunctions.restCount}`;
	 }
};