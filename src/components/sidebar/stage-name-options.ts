const stageNameOptions = [
  "Stages",
  "States",
  "Phases",
  "Boards",
  "Channels",
  "Sales Pipeline", // Feels wrong
  "Tags",
  "Buckets",
  "Folders",
];

// Generate a random index and then return the item
function getRandomStageNameOption() {
  const randomIndex = Math.floor(Math.random() * stageNameOptions.length);
  return stageNameOptions[randomIndex];
}

export default getRandomStageNameOption;
