export interface Helpline {
  id: string;
  name: string;
  number: string;
  description: string;
  category: "emergency" | "women" | "health" | "other";
}

export const helplines: Helpline[] = [
  {
    id: "1",
    name: "Women Helpline",
    number: "1091",
    description: "24/7 emergency helpline for women in distress",
    category: "women"
  },
  {
    id: "2",
    name: "Police",
    number: "100",
    description: "Emergency police services",
    category: "emergency"
  },
  {
    id: "3",
    name: "Ambulance",
    number: "102",
    description: "Medical emergency services",
    category: "health"
  },
  {
    id: "4",
    name: "Domestic Violence Helpline",
    number: "181",
    description: "Support for victims of domestic violence",
    category: "women"
  },
  {
    id: "5",
    name: "Women Helpline (Domestic Abuse)",
    number: "1090",
    description: "Dedicated helpline for domestic abuse cases",
    category: "women"
  },
  {
    id: "6",
    name: "National Commission for Women",
    number: "011-26942369",
    description: "Government body for women's rights and issues",
    category: "women"
  },
  {
    id: "7",
    name: "Emergency Disaster Management",
    number: "108",
    description: "Disaster management services",
    category: "emergency"
  },
  {
    id: "8",
    name: "Missing Child And Women",
    number: "1094",
    description: "Helpline for reporting missing persons",
    category: "women"
  },
  {
    id: "9",
    name: "Railway Protection",
    number: "1322",
    description: "Security helpline for railway travel",
    category: "other"
  },
  {
    id: "10",
    name: "Road Accident Emergency",
    number: "1073",
    description: "Emergency services for road accidents",
    category: "emergency"
  }
];