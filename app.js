Vue.directive("focus", {
  inserted: function(el) {
    el.focus();
  }
});

new Vue({
  el: "#app",
  data: {
    MAX_NUM_TRIALS: 10,
    keyboardType: "standard",
    keyboardHeight: "small",
    words: [],
    results: [],
    temp: [],
    userInput: "",
    numTrials: 0,
    hasExperimentStarted: false,
    hasExperimentEnded: false,
    hasTrialStarted: false,
    hasTimerStarted: false,
    hasTypedWrong: false,
    numErrors: 0,
    time: { prev: 0, curr: 0 },
    timer: null,
    errorMessageCountdown: 3,
    errorMessageTimer: null,
  },
  created() {
     fetch("words.txt")
       .then(res => res.text())
       .then(text => (this.words = text.split("\n").filter(Boolean)));
  },
  methods: {
    startExperiment() {
      this.hasExperimentStarted = true;
      this.startTrial();
    },
    startTrial() {
      if (this.temp.length > 0) {
        this.words = this.temp;
        this.temp = [];
      }
      this.numTrials++;
      this.hasTrialStarted = true;
      this.getRandomWord();
      this.startTimer();
    },
    endExperiment() {
      this.hasExperimentEnded = true;
      this.hasExperimentStarted = false;
      this.hasTrialStarted = false;
    },
    saveInput(e) {
      this.addResults();
      this.userInput = "";
      e.target.value = "";
      this.numErrors = 0;

      if (this.words.length > 0) {
        this.getRandomWord();
      } else {
        this.stopTimer();
        if (this.numTrials < this.MAX_NUM_TRIALS) {
          this.hasTrialStarted = false;
        } else {
          this.endExperiment();
        }
      }
    },
    isFinished(e) {
      if (this.userInput.toLowerCase() === this.randomWord) {
        this.saveInput(e);
      }
    },
    isCorrectChar(e) {
      console.log(e);
      this.userInput = e.target.value;
      let currIndex = this.userInput.length - 1;
      let key = "";
      let currChar = this.userInput.charAt(this.userInput.length-1);
      if (/[a-zA-z]/.test(currChar)) {
        key = currChar.toLowerCase();
      }

      if (!this.hasTypedWrong && (!key || key !== this.randomWord[currIndex])) {
        e.preventDefault();
        this.numErrors++;
        this.hasTypedWrong = true;
        this.userInput = "";
        e.target.value = "";
        
        this.errorMessageTimer = setInterval(() => {
          this.errorMessageCountdown--;
          this.resetTimer();
        }, 1000);
      }
      else{
        this.isFinished(e);
      }
    },
    addResults() {
      const curr = this.time.curr;
      this.results.push([
        this.numTrials,
        this.randomWord,
        curr - this.time.prev,
        this.numErrors
      ]);
      this.time.prev = curr;
    },
    getRandomWord() {
      this.temp.push(
        this.words.splice(Math.floor(Math.random() * this.words.length), 1)[0]
      );
    },
    startTimer() {
      this.hasTimerStarted = true;
      this.timer = setInterval(() => this.time.curr++, 1);
    },
    stopTimer() {
      this.hasTimerStarted = false;
      this.time = { prev: 0, curr: 0 };
      clearInterval(this.timer);
    },
    resetTimer(){
      const curr = this.time.curr;
      this.time.prev = curr;
    }
  },
  computed: {
    randomWord() {
      return this.temp[this.temp.length - 1];
    },
    downloadLink() {
      const csv =
        "data:text/csv;charset=utf-8," +
        this.results.map(result => result.join(",")).join("\n");
      return encodeURI(csv);
    },
    downloadFileName() {
      return `${this.keyboardHeight}_${this.keyboardType}_results.csv`;
    },
    errorMessage(){
        if(this.errorMessageCountdown == 0){
          this.errorMessageCountdown = 3;
          this.hasTypedWrong = false;
          clearInterval(this.errorMessageTimer);
          this.$nextTick(() => {
            this.$refs.inputField.focus();
          })
        }

      return `Please try again in ${this.errorMessageCountdown}...`;
    }
  }
});

