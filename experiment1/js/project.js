// project.js - purpose and description here
// Author: Zosia Trela
// Date:

// NOTE: This is how we might start a basic JavaaScript OOP project

// Constants - User-servicable parts
// In a longer project I like to put these in a separate file

// define a class
class MyProjectClass {
  // constructor function
  constructor(param1, param2) {
    // set properties using 'this' keyword
    this.property1 = param1;
    this.property2 = param2;
  }
  
  // define a method
  myMethod() {
    // code to run when method is called
  }
}

function main() {
  const fillers = {
    adventurer: ["Explorer", "Ranger", "Camper", "Backpacker", "Naturalist", "Park-goer", "Trailblazer", "You", "Tree-hugger", "Wild one", "Scout"],
    pre: ["Yose", "Sequo", "Red", "Ever", "Den", "Glac", "Zio", "Grizz"],
    post: ["mite", "stone", "leaf", "pine", "glow", "ridge", "meadow", "peak", "valley", "falls"],
    people: ["gentle", "migrating", "resilient", "hidden", "majestic", "drowsy", "nocturnal", "playful", "chill", "soft-footed"],
    item: ["map", "compass", "binoculars", "walking stick", "hydration pack", "sunhat", "field journal", "trail mix", "GPS watch", "pocketknife"],
    num: ["three", "seven", "a backpack full of", "a ranger’s worth of", "countless", "a secret number of", "too many to carry", "enough to fill your tent with"],
    looty: ["glimmering", "hand-carved", "eco-friendly", "wilderness-approved", "locally-sourced", "pine-scented", "surprisingly crunchy", "sun-kissed"],
    loots: ["badges", "acorns", "park stickers", "souvenir mugs", "trail secrets", "polaroids", "postcards", "beautiful rocks", "sunrises", "bird calls", "cairns"],
    baddies: ["wildfires", "litterbugs", "rowdy tourists", "storm clouds", "invasive species", "illegally parked RVs", "trail trolls", "loud drones", "campground chaos"],
    message: ["dispatch", "call", "ranger alert", "notice", "trail report", "wind-whisper", "tweet (from a bird)", "signal fire", "raccoon courier", "hiker gossip"],
  };
  
  
  const template = `$adventurer, your attention is needed!
  
  A $message just arrived from $pre$post National Park, where the $people creatures are struggling. The land is under threat from $baddies. You must head out with your trusty $item and answer nature's call.
  
  Word is, those who rise to the occasion will find $num $looty $loots scattered through the forest trails. A true reward for a nature-loving soul like you!`;
  
  
  
  // STUDENTS: You don't need to edit code below this line.
  
  const slotPattern = /\$(\w+)/;
  
  function replacer(match, name) {
    let options = fillers[name];
    if (options) {
      return options[Math.floor(Math.random() * options.length)];
    } else {
      return `<UNKNOWN:${name}>`;
    }
  }
  
  function generate() {
    let story = template;
    while (story.match(slotPattern)) {
      story = story.replace(slotPattern, replacer);
    }
  
    /* global box */
    $("#box").text(story);
  }
  
  /* global clicker */
  $("#clicker").click(generate);
  
  generate();
  
}

// let's get this party started - uncomment me
main();