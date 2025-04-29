export interface SafetyTip {
  id: string;
  title: string;
  content: string;
  category: "general" | "travel" | "home" | "digital" | "public";
}

export const safetyTips: SafetyTip[] = [
  {
    id: "1",
    title: "Stay Aware of Surroundings",
    content: "Always be aware of your surroundings, especially in unfamiliar areas. Avoid using headphones or being distracted by your phone when walking alone.",
    category: "general"
  },
  {
    id: "2",
    title: "Share Your Location",
    content: "Let someone know where you are going and when you expect to return. Use location sharing apps with trusted contacts.",
    category: "general"
  },
  {
    id: "3",
    title: "Trust Your Instincts",
    content: "If something feels wrong, trust your gut and remove yourself from the situation. Your intuition is a powerful safety tool.",
    category: "general"
  },
  {
    id: "4",
    title: "Ride-Sharing Safety",
    content: "When using ride-sharing services, always verify the driver and car details before getting in. Share your trip details with a trusted contact.",
    category: "travel"
  },
  {
    id: "5",
    title: "Public Transportation",
    content: "When using public transportation, sit near the driver or in a populated car. Stay awake and alert during the journey.",
    category: "travel"
  },
  {
    id: "6",
    title: "Secure Your Home",
    content: "Keep doors and windows locked, even when you are home. Consider installing a security system or camera doorbell.",
    category: "home"
  },
  {
    id: "7",
    title: "Digital Privacy",
    content: "Be cautious about sharing personal information online. Adjust privacy settings on social media and avoid posting real-time location updates.",
    category: "digital"
  },
  {
    id: "8",
    title: "Walking at Night",
    content: "Stick to well-lit, populated areas when walking at night. Walk confidently and purposefully.",
    category: "public"
  },
  {
    id: "9",
    title: "Emergency Contacts",
    content: "Keep emergency contacts easily accessible on your phone. Consider setting up emergency SOS features on your smartphone.",
    category: "general"
  },
  {
    id: "10",
    title: "Self-Defense Basics",
    content: "Consider learning basic self-defense techniques. Even simple knowledge can boost confidence and preparedness.",
    category: "general"
  },
  {
    id: "11",
    title: "Parking Safety",
    content: "Park in well-lit areas and have your keys ready before approaching your car. Check the backseat before entering.",
    category: "travel"
  },
  {
    id: "12",
    title: "Hotel Safety",
    content: "When staying in hotels, use all additional locks. Never open the door without verifying who is there.",
    category: "travel"
  }
];