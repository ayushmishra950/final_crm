export const providers = [
  {
    id: 1,
    name: "Ramesh Sharma",
    category: "Electrician",
    rating: 4.8,
    reviews: 124,
    distance: "1.2 km",
    experience: "8 years",
    verified: true,
    image: "https://i.pravatar.cc/150?u=ramesh",
    about: "Expert in house wiring, appliance repair, and quick fixes.",
    services: ["House Wiring", "Fan Repair", "Switchboard Fixing"],
    serviceArea: "Civil Lines & Nearby (5km)"
  },
  {
    id: 2,
    name: "Suresh Plumbing",
    category: "Plumber",
    rating: 4.6,
    reviews: 89,
    distance: "2.5 km",
    experience: "5 years",
    verified: true,
    image: "https://i.pravatar.cc/150?u=suresh",
    about: "Professional plumbing services, leak fixes, and pipe installations.",
    services: ["Leak Repair", "Pipe Installation", "Water Heater Repair"],
    serviceArea: "City Center (10km)"
  },
  {
    id: 3,
    name: "Abdul Mechanics",
    category: "Mechanic",
    rating: 4.9,
    reviews: 210,
    distance: "3.0 km",
    experience: "12 years",
    verified: true,
    image: "https://i.pravatar.cc/150?u=abdul",
    about: "Bike and car mechanic on the go. Call me for quick roadside assistance.",
    services: ["Bike Repair", "Car Service", "Tyre Puncture"],
    serviceArea: "Highway & Urban Blocks"
  },
  {
    id: 4,
    name: "Aman Carpentry",
    category: "Carpenter",
    rating: 4.3,
    reviews: 45,
    distance: "4.1 km",
    experience: "3 years",
    verified: false,
    image: "https://i.pravatar.cc/150?u=aman",
    about: "Custom furniture, door repairs, and modular kitchen fixing.",
    services: ["Furniture Repair", "Door Fixing", "Wood Polishing"],
    serviceArea: "South Station Area"
  },
  {
    id: 5,
    name: "Priya Beauty Services",
    category: "Salon",
    rating: 4.7,
    reviews: 310,
    distance: "1.5 km",
    experience: "6 years",
    verified: true,
    image: "https://i.pravatar.cc/150?u=priya",
    about: "Professional at-home beauty and grooming services for women.",
    services: ["Bridal Makeup", "Haircut", "Facial & Spa"],
    serviceArea: "City Center & North Zones"
  },
  {
    id: 6,
    name: "Urban Cleaners",
    category: "Cleaning",
    rating: 4.5,
    reviews: 180,
    distance: "2.8 km",
    experience: "4 years",
    verified: true,
    image: "https://images.unsplash.com/photo-1581578731548-c64695cc6952?q=80&w=200",
    about: "Festive home deep cleaning, sofa dry cleaning, and bathroom washing.",
    services: ["Deep Cleaning", "Sofa Cleaning", "Bathroom Wash"],
    serviceArea: "All Areas (15km)"
  },
  {
    id: 7,
    name: "Raju Ac Repair",
    category: "AC Repair",
    rating: 4.8,
    reviews: 520,
    distance: "0.8 km",
    experience: "10 years",
    verified: true,
    image: "https://i.pravatar.cc/150?u=raju",
    about: "Guaranteed AC cooling fix, gas filling, and overall maintenance.",
    services: ["AC Servicing", "Gas Refill", "Installation"],
    serviceArea: "Civil Lines & Bypass"
  }
];

export const categories = [
  { id: 'elec', name: 'Electrician', icon: 'Zap' },
  { id: 'plum', name: 'Plumber', icon: 'Droplets' },
  { id: 'mech', name: 'Mechanic', icon: 'Wrench' },
  { id: 'carp', name: 'Carpenter', icon: 'Hammer' },
  { id: 'paint', name: 'Painter', icon: 'Paintbrush' },
  { id: 'clean', name: 'Cleaning', icon: 'Sparkles' },
  { id: 'salon', name: 'Salon', icon: 'Scissors' },
  { id: 'ac', name: 'AC Repair', icon: 'Wind' }
];

export const bookingHistory = [
  { id: 101, providerName: 'Ramesh Sharma', category: 'Electrician', date: '12 Oct 2025', status: 'Completed', amount: '₹450' },
  { id: 102, providerName: 'Abdul Mechanics', category: 'Mechanic', date: '02 Nov 2025', status: 'Completed', amount: '₹1200' },
  { id: 103, providerName: 'Suresh Plumbing', category: 'Plumber', date: 'Current', status: 'Pending', amount: 'Pending' }
];

export const initialLeads = [
  { id: 1, customer: 'Ravi Kumar', issue: 'AC cooling issue', location: 'Civil Lines, 2.5km', time: '2 hours ago', status: 'New' },
  { id: 2, customer: 'Neha Singh', issue: 'Pipe leakage in washroom', location: 'City Center, 4km', time: '5 hours ago', status: 'New' },
  { id: 3, customer: 'Amit Patel', issue: 'Main switchboard sparking', location: 'South Block, 1.2km', time: '1 day ago', status: 'Accepted' },
];

export const adminStats = {
  totalUsers: 12543,
  totalProviders: 845,
  activeListings: 810,
  revenue: "₹45,200",
  growth: "+14%"
};
