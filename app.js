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
      "advice",
      "airport",
      "balloon",
      "bottle",
      "bowl"
      "bugler",
      "button",
      "coffee",
      "tomato",
      "carrot",
      "chess",
      "comet",
      "database",
      "cycle",
      "earth",
      "electricity",
      "identify",
      "journal",
      "eraser",
      "festival",
      "future",
      "steam",
      "garden",
      "guitar",
      "gemstone",
      "leather",
      "magnet",
      "meteor",
      "monster",
      "needle",
      "onion",
      "passport",
      "pebble",
      "pepper",
      "perfume",
      "pillow",
      "plane",
      "pocket",
      "potato",
      "printer",
      "radar",
      "rainbow",
      "record",
      "robot",
      "rocket",
      "satellite",
      "skeleton",
      "snail",
      "software",
      "space",
      "sphere",
      "square",
      "survey",
      "telescope",
      "torpedo",
      "train",
      "triangle",
      "umbrella",
      "vampire",
      "window",
      "panic",
      "obsolete",
      "beagle",
      "husky",
      "bubble",
      "develop",
      "super",
      "chill",
      "lion",
      "tinker",
      "salty",
      "squid",
      "octopus",
      "scatter",
      "brain",
      "memory",
      "machine",
      "complex",
      "colour",
      "slope",
      "chalk",
      "sponge",
      "giraffe",
      "monkey",
      "signal",
      "error",
      "thunder",
      "lazy",
      "soup",
      "drone",
      "miniature",
      "spoil",
      "banjo",
      "nostalgic",
      "delete",
      "fluffy",
      "flood",
      "butter",
      "start",
      "enter",
      "home",
      "return",
      "invite",
      "bug",
      "sneaky",
      "snow",
      "event",
      "silly",
      "dust"
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
    timer: null,
    isErrorChar: false
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
      if(!this.checkInputError(e)){
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
      }
      else {
        //Don't go to the next word
        e.preventDefault();
      }
      
    },
    checkInputError(e) {
      var currIndex;
      var isSameChar;
      var isEndChar;

      currIndex = this.userInput.length - 1;
      isSameChar = currIndex >= 0 && this.randomWord.length > currIndex && this.userInput.charAt(currIndex) == this.randomWord.charAt(currIndex);
      isEndOfWord = e.key !== 'Enter' || currIndex == this.randomWord.length - 1;

      if (!isSameChar || !isEndOfWord){
        this.isErrorChar = true;

        setTimeout(() => {
          this.isErrorChar = false;
        }, 300);

        //Record error and then reset test
        this.addResults();
        this.userInput = "";
      }

      return !isSameChar || !isEndOfWord;
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
