Vue.directive("focus", {
  inserted: function(el) {
    el.focus();
  }
});

new Vue({
  el: "#app",
  data: {
    MAX_NUM_TRIALS: 2,
    keyboardType: "standard",
    keyboardHeight: "small",
    words: [
      "used",
      "ocean",
      "noiseless",
      "sea",
      "stocking",
      "communicate",
      "reaction",
      "canvas",
      "sprout",
      "lamp",
      "time",
      "advice"
    ],
    results: [],
    temp: [],
    userInput: "",
    numTrials: 0,
    hasExperimentStarted: false,
    hasExperimentEnded: false,
    hasTrialStarted: false,
    hasTimerStarted: false,
    time: { prev: 0, curr: 0 },
    timer: null
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
    saveInput() {
      this.addResults();
      this.userInput = "";

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
    addResults() {
      const curr = this.time.curr;
      this.results.push([
        this.randomWord,
        curr - this.time.prev,
        this.randomWord !== this.userInput
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
    }
  }
});
