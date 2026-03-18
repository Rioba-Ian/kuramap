
export interface RegistrationCenter {
  id: string;
  name: string;
  address: string;
  constituency: string;
  ward: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  operatingHours: string;
  reviews: string[];
}

export const REGISTRATION_CENTERS: RegistrationCenter[] = [
  {
    id: '1',
    name: 'IEBC Westlands Constituency Office',
    address: 'Rhapta Road, Westlands, Nairobi',
    constituency: 'Westlands',
    ward: 'Parklands/Highridge',
    coordinates: { lat: -1.2662, lng: 36.8043 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
    reviews: [
      "The staff were very helpful and the queue moved quickly.",
      "Bring your own pen, they sometimes run out.",
      "Very organized center compared to others I've been to."
    ]
  },
  {
    id: '2',
    name: 'Starehe CDF Hall',
    address: 'Kariokor, Nairobi',
    constituency: 'Starehe',
    ward: 'Pangani',
    coordinates: { lat: -1.2783, lng: 36.8333 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
    reviews: [
      "Wait times are long in the afternoon. Try coming at 8am.",
      "Helpful staff but the building is a bit hard to find."
    ]
  },
  {
    id: '3',
    name: 'Kasarani IEBC Office',
    address: 'Kasarani Sports Complex Area, Nairobi',
    constituency: 'Kasarani',
    ward: 'Kasarani',
    coordinates: { lat: -1.2222, lng: 36.8944 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
    reviews: [
      "Queue was okay, but the biometric machine was slow today.",
      "Clean facility."
    ]
  },
  {
    id: '4',
    name: 'Mvita Constituency Office',
    address: 'Mama Ngina Drive, Mombasa',
    constituency: 'Mvita',
    ward: 'Old Town',
    coordinates: { lat: -4.0667, lng: 39.6667 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
    reviews: [
      "Easily accessible with public transport.",
      "The environment is calm and the process is straightforward."
    ]
  },
  {
    id: '5',
    name: 'Kisumu Central Office',
    address: 'Prosperity House, Kisumu',
    constituency: 'Kisumu Central',
    ward: 'Market Milimani',
    coordinates: { lat: -0.1022, lng: 34.7617 },
    operatingHours: '08:00 AM - 05:00 PM (Mon-Fri)',
    reviews: [
      "Expect long queues during the last days of registration.",
      "The security team is quite disciplined."
    ]
  }
];

export const ELIGIBILITY_CRITERIA = [
  {
    title: "Age Requirement",
    description: "You must be 18 years of age or older at the time of registration."
  },
  {
    title: "Citizenship",
    description: "You must be a Kenyan citizen."
  },
  {
    title: "Legal Capacity",
    description: "You must not have been found by any law to be of unsound mind."
  },
  {
    title: "Document Requirements",
    description: "You must possess a valid National Identity Card (ID) or a valid Passport."
  }
];
