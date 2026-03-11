// Wisconsin Fish seasonal data with date ranges (month numbers 1-12)
// Season status: 0='offseason' (red), 1='upcoming' (yellow, within 15 days), 2='inseason' (green)
export const seasonalFish = {
  'Walleye': {
    seasonMonths: [5, 6, 7, 8, 9, 10], // May-October
    peakMonths: [6, 9], // June, September
    depth: '15-30 ft',
    difficulty: 'Intermediate',
    tips: 'Best during dawn and dusk. Use live bait or crankbaits.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Sander_vitreus.jpg/1200px-Sander_vitreus.jpg',
    recommendedGear: ['Medium Spinning Rod', 'Crankbaits', 'Live Minnows', 'Jigs'],
    avgSize: '2-4 lbs',
    recordSize: '15+ lbs'
  },
  'Largemouth Bass': {
    seasonMonths: [5, 6, 7, 8, 9, 10],
    peakMonths: [6, 8],
    depth: '5-15 ft',
    difficulty: 'Intermediate',
    tips: 'Look for weedy areas and lily pads. Early morning is best.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/1/1b/Micropterus_salmoides.jpg/1200px-Micropterus_salmoides.jpg',
    recommendedGear: ['Medium-Heavy Casting Rod', 'Plastic Worms', 'Soft Plastics', 'Topwater Lures'],
    avgSize: '2-4 lbs',
    recordSize: '11+ lbs'
  },
  'Smallmouth Bass': {
    seasonMonths: [5, 6, 7, 8, 9, 10],
    peakMonths: [6, 9],
    depth: '10-25 ft',
    difficulty: 'Intermediate',
    tips: 'Found around rocks and drop-offs. Use small lures.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/a9/Micropterus_dolomieu.jpg/1200px-Micropterus_dolomieu.jpg',
    recommendedGear: ['Medium Spinning Rod', 'Small Crankbaits', 'Tubes', 'Jig & Craw'],
    avgSize: '1.5-3 lbs',
    recordSize: '9+ lbs'
  },
  'Pike': {
    seasonMonths: [5, 6, 7, 8, 9, 10],
    peakMonths: [6, 7],
    depth: '10-20 ft',
    difficulty: 'Easy',
    tips: 'Aggressive fish. Use large lures and live bait.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/d/d6/Esox_lucius.jpg/1200px-Esox_lucius.jpg',
    recommendedGear: ['Medium-Heavy Rod', 'Large Spinners', 'Large Soft Plastics', 'Live Shiners'],
    avgSize: '3-6 lbs',
    recordSize: '20+ lbs'
  },
  'Musky': {
    seasonMonths: [6, 7, 8, 9, 10],
    peakMonths: [7, 8],
    depth: '15-40 ft',
    difficulty: 'Hard',
    tips: 'Challenging fish. Requires patience and skill. Best in low light.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/Musky.jpg/1200px-Musky.jpg',
    recommendedGear: ['Heavy Casting Rod', 'Large Musky Baits', 'Figure-Eight Technique', 'Bucktails'],
    avgSize: '8-12 lbs',
    recordSize: '40+ lbs'
  },
  'Lake Trout': {
    seasonMonths: [5, 6, 7, 8, 9],
    peakMonths: [6, 9],
    depth: '40-120 ft',
    difficulty: 'Hard',
    tips: 'Deep water fishing. Use trolling or jigging techniques.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/9/93/Lake_trout.jpg/1200px-Lake_trout.jpg',
    recommendedGear: ['Deep Water Rod', 'Jigging Spoons', 'Trolling Baits', 'Downrigger'],
    avgSize: '3-8 lbs',
    recordSize: '20+ lbs'
  },
  'Salmon': {
    seasonMonths: [5, 6, 7, 8, 9, 10],
    peakMonths: [6, 9],
    depth: '30-60 ft',
    difficulty: 'Hard',
    tips: 'Migratory. Best off Lake Michigan coast. Use specific salmon lures.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/b/b3/Chinook_salmon.jpg/1200px-Chinook_salmon.jpg',
    recommendedGear: ['Heavy Saltwater Rod', 'Salmon Spoons', 'Trolling Gear', 'Downrigger'],
    avgSize: '8-15 lbs',
    recordSize: '40+ lbs'
  },
  'Perch': {
    seasonMonths: [1, 2, 3, 4, 9, 10, 11, 12],
    peakMonths: [3, 4, 10],
    depth: '15-40 ft',
    difficulty: 'Easy',
    tips: 'Small fish. Good for beginners. Often catch in groups.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/3d/Perca_fluviatilis.jpg/1200px-Perca_fluviatilis.jpg',
    recommendedGear: ['Light Spinning Rod', 'Small Jigs', 'Live Minnows', 'Tiny Spoons'],
    avgSize: '0.5-1.5 lbs',
    recordSize: '3+ lbs'
  },
  'Crappie': {
    seasonMonths: [4, 5, 6, 7, 8, 9, 10],
    peakMonths: [5, 9],
    depth: '10-25 ft',
    difficulty: 'Easy',
    tips: 'Spring spawning near shallow structures. Use minnows.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/a/ab/Black_crappie.jpg/1200px-Black_crappie.jpg',
    recommendedGear: ['Light Spinning Rod', 'Minnows', 'Small Jigs', 'Panfish Lures'],
    avgSize: '0.5-1 lb',
    recordSize: '2+ lbs'
  },
  'Catfish': {
    seasonMonths: [6, 7, 8, 9],
    peakMonths: [7, 8],
    depth: '10-30 ft',
    difficulty: 'Easy',
    tips: 'Night fishing. Use strong-smelling bait like chicken liver.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/8/81/Ictalurus_punctatus.jpg/1200px-Ictalurus_punctatus.jpg',
    recommendedGear: ['Medium Catfish Rod', 'Cut Bait', 'Chicken Liver', 'Stink Bait'],
    avgSize: '2-5 lbs',
    recordSize: '50+ lbs'
  },
  'Steelhead': {
    seasonMonths: [2, 3, 4, 9, 10, 11],
    peakMonths: [3, 4, 10],
    depth: '10-30 ft',
    difficulty: 'Hard',
    tips: 'Migratory rainbow trout. Spring run (Feb-Apr) and fall run (Sep-Nov). Use drift fishing with eggs or spinners.',
    image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c4/Salmo_gairdneri2.jpg/1200px-Salmo_gairdneri2.jpg',
    recommendedGear: ['Medium Spinning Rod', 'Drift Bobber', 'Salmon Eggs', 'Small Spinners', 'Fly Rod'],
    avgSize: '8-12 lbs',
    recordSize: '20+ lbs'
  }
};

// Helper to get season status (0=red/offseason, 1=yellow/upcoming, 2=green/inseason)
export const getSeasonStatus = (seasonMonths) => {
  const now = new Date();
  const currentMonth = now.getMonth() + 1; // 1-12
  const currentDate = now.getDate();
  
  if (seasonMonths.includes(currentMonth)) {
    return 2; // In season - green
  }
  
  // Check if within 15 days of season start
  if (seasonMonths.length > 0) {
    const closestStart = Math.min(...seasonMonths);
    const closestEnd = Math.max(...seasonMonths);
    
    // Check if within 15 days before start
    if (closestStart > currentMonth) {
      const daysUntil = (closestStart - currentMonth) * 30 - currentDate;
      if (daysUntil <= 15) return 1; // Upcoming - yellow
    }
    // Check if within 15 days after end
    else if (closestEnd < currentMonth) {
      const daysUntil = (currentMonth - closestEnd) * 30 + currentDate;
      if (daysUntil <= 15) return 1; // Upcoming - yellow
    }
  }
  
  return 0; // Off season - red
};

// Helper to get color based on season status
export const getSeasonColor = (seasonMonths) => {
  const status = getSeasonStatus(seasonMonths);
  if (status === 2) return '#2E7D32'; // Green - in season
  if (status === 1) return '#E65100'; // Yellow/Orange - upcoming
  return '#C62828'; // Red - off season
};

export const getCurrentInSeasonFish = () => {
  return Object.entries(seasonalFish)
    .map(([fish, data]) => ({
      fish,
      ...data,
      seasonStatus: getSeasonStatus(data.seasonMonths),
      colorStatus: getSeasonColor(data.seasonMonths)
    }))
    .sort((a, b) => b.seasonStatus - a.seasonStatus); // Prioritize in-season fish
};
