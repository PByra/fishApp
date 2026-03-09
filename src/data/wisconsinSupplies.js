// Wisconsin-based fishing supplies and equipment
export const wisconsinSupplies = [
  {
    id: 1,
    name: 'Abu Garcia Fishing Reel',
    brand: 'Abu Garcia',
    category: 'Reels',
    price: '$79.99',
    link: 'https://abugarcia.com',
    wisconsinConnection: 'Headquartered in Madison, WI',
    rating: 4.8,
    forFish: ['All Species']
  },
  {
    id: 2,
    name: 'Northland Fishing Tackle',
    brand: 'Northland',
    category: 'Lures & Tackle',
    price: 'Varies',
    link: 'https://northlandfishing.com',
    wisconsinConnection: 'Based in Bemidji, Minnesota (close neighbor), specializes in Northern Lakes',
    rating: 4.7,
    forFish: ['Walleye', 'Pike', 'Bass']
  },
  {
    id: 3,
    name: 'Ugly Stik Rods',
    brand: 'Ugly Stik',
    category: 'Rods',
    price: '$99.99+',
    link: 'https://ugly-stik.com',
    wisconsinConnection: 'Widely available in Wisconsin retailers',
    rating: 4.9,
    forFish: ['All Species']
  },
  {
    id: 4,
    name: 'Wisconsin Local Tackle Box',
    brand: 'Local Wisconsin Makers',
    category: 'Tackle Organization',
    price: '$39.99',
    link: 'https://wisconsinfishing.gov',
    wisconsinConnection: 'Made by Wisconsin craftspeople',
    rating: 4.6,
    forFish: ['All Species']
  },
  {
    id: 5,
    name: 'Rapala Lures',
    brand: 'Rapala',
    category: 'Lures',
    price: '$4.99-$12.99',
    link: 'https://rapala.com',
    wisconsinConnection: 'Available throughout Wisconsin, classic Minnesota brand for Wisconsin waters',
    rating: 4.8,
    forFish: ['Pike', 'Musky', 'Bass']
  },
  {
    id: 6,
    name: 'Shimano Fishing Reels',
    brand: 'Shimano',
    category: 'Reels',
    price: '$49.99+',
    link: 'https://shimano.com',
    wisconsinConnection: 'Popular in Wisconsin tackle shops',
    rating: 4.7,
    forFish: ['All Species']
  },
  {
    id: 7,
    name: 'Wisconsin DNR Fishing Guide',
    brand: 'Wisconsin DNR',
    category: 'Resources',
    price: 'Free',
    link: 'https://dnr.wisconsin.gov/topic/fishing',
    wisconsinConnection: 'Official Wisconsin resource',
    rating: 4.9,
    forFish: ['All Species']
  },
  {
    id: 8,
    name: 'Berkley PowerBait Soft Plastics',
    brand: 'Berkley',
    category: 'Bait & Plastic',
    price: '$3.99+',
    link: 'https://berkley.com',
    wisconsinConnection: 'Available in Wisconsin',
    rating: 4.6,
    forFish: ['Bass', 'Walleye', 'Perch']
  },
  {
    id: 9,
    name: 'Lindy Fishing Lures',
    brand: 'Lindy',
    category: 'Lures',
    price: '$5.99-$14.99',
    link: 'https://lindyfish.com',
    wisconsinConnection: 'Based in Minnesota, perfect for Wisconsin walleye fishing',
    rating: 4.8,
    forFish: ['Walleye', 'Pike']
  },
  {
    id: 10,
    name: 'Wisconsin Fishing License',
    brand: 'Wisconsin DNR',
    category: 'License',
    price: '$20.00',
    link: 'https://dnr.wisconsin.gov/topic/fishing/licenses',
    wisconsinConnection: 'Required for all Wisconsin fishing',
    rating: 5.0,
    forFish: ['All Species']
  }
];

export const getSuppliesForFish = (fishSpecies) => {
  return wisconsinSupplies.filter(supply => 
    supply.forFish.includes(fishSpecies) || supply.forFish.includes('All Species')
  );
};
