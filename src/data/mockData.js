export function getAIResponse(userInput) {
  const input = userInput.toLowerCase();

  if (input.includes('score') || input.includes('set')) {
    return "Player A leads 6-0, 3-2 in the second set. Match heating up!";
  }

  if (input.includes('win prediction') || input.includes('who will win')) {
    return "Player B has a 53% chance to win — thanks to historic comebacks on grass after losing first two sets.";
  }

  if (input.includes('top moments')) {
    return "1. A's 225 km/h ace\n2. B saved 3 break points\n3. A won a 22-shot rally.";
  }

  if (input.includes('shot efficiency')) {
    return "Player A: 83%\nPlayer B: 74%. A has a clear edge in shot accuracy.";
  }

  return "Try asking about the current score, win prediction, or shot efficiency.";
}
