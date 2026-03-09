// Current seasonal info for Wisconsin fish (updated monthly)
export const seasonalFish = {
  'Walleye': {
    season: 'May - October',
    peak: ['June', 'September'],
    depth: '15-30 ft',
    difficulty: 'Intermediate',
    tips: 'Best during dawn and dusk. Use live bait or crankbaits.'
  },
  'Largemouth Bass': {
    season: 'May - October',
    peak: ['June', 'August'],
    depth: '5-15 ft',
    difficulty: 'Intermediate',
    tips: 'Look for weedy areas and lily pads. Early morning is best.'
  },
  'Smallmouth Bass': {
    season: 'May - October',
    peak: ['June', 'September'],
    depth: '10-25 ft',
    difficulty: 'Intermediate',
    tips: 'Found around rocks and drop-offs. Use small lures.'
  },
  'Pike': {
    season: 'May - October',
    peak: ['June', 'July'],
    depth: '10-20 ft',
    difficulty: 'Easy',
    tips: 'Aggressive fish. Use large lures and live bait.'
  },
  'Musky': {
    season: 'June - October',
    peak: ['July', 'August'],
    depth: '15-40 ft',
    difficulty: 'Hard',
    tips: 'Challenging fish. Requires patience and skill. Best in low light.'
  },
  'Lake Trout': {
    season: 'May - September',
    peak: ['June', 'September'],
    depth: '40-120 ft',
    difficulty: 'Hard',
    tips: 'Deep water fishing. Use trolling or jigging techniques.'
  },
  'Salmon': {
    season: 'May - October',
    peak: ['June', 'September'],
    depth: '30-60 ft',
    difficulty: 'Hard',
    tips: 'Migratory. Best off Lake Michigan coast. Use specific salmon lures.'
  },
  'Perch': {
    season: 'Year-round',
    peak: ['March-April', 'September-October'],
    depth: '15-40 ft',
    difficulty: 'Easy',
    tips: 'Small fish. Good for beginners. Often catch in groups.'
  },
  'Crappie': {
    season: 'April - October',
    peak: ['May', 'September'],
    depth: '10-25 ft',
    difficulty: 'Easy',
    tips: 'Spring spawning near shallow structures. Use minnows.'
  },
  'Catfish': {
    season: 'June - September',
    peak: ['July', 'August'],
    depth: '10-30 ft',
    difficulty: 'Easy',
    tips: 'Night fishing. Use strong-smelling bait like chicken liver.'
  }
};

export const getCurrentInSeasonFish = () => {
  const now = new Date();
  const month = now.getMonth() + 1;
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const currentMonth = monthNames[month - 1];
  
  return Object.entries(seasonalFish).filter(([fish, data]) => {
    return data.peak.some(m => m.includes(currentMonth));
  }).map(([fish, data]) => ({ fish, ...data }));
};
