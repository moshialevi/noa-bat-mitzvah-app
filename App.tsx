import React, { useState } from 'react';
import { EventDetails } from './types';
import GuestView from './views/GuestView';
import { Loader2 } from 'lucide-react';

// Default Data
const DEFAULT_EVENT_DETAILS: EventDetails = {
  name: 'נועה',
  eventType: 'בת מצווה',
  date: '2026-03-17T19:00',
  locationName: 'אולם בית כנסת זכור לאברהם',
  address: 'גבעת שמואל רחוב זבולון המר 2',
  wazeLink: 'https://waze.com/ul?q=Zvulun+Hammer+2+Givat+Shmuel&navigate=yes',
  heroImage: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=1000&auto=format&fit=crop', // Abstract Purple Party
  // שימוש בנתיב יחסי (.) ובפרמטר v=2 כדי לנקות זיכרון מטמון (Cache)
  celebrantImage: './noa.png?v=2', 
  hostPhone: '972526302266'
};

const App: React.FC = () => {
  const [eventDetails] = useState<EventDetails>(DEFAULT_EVENT_DETAILS);
  const [isLoading, setIsLoading] = useState(false);

  if (isLoading) {
    return <div className="min-h-screen flex items-center justify-center bg-[#020205]"><Loader2 className="animate-spin text-cyber-accent" size={48} /></div>;
  }

  return (
    <div className="font-sans text-gray-800 antialiased min-h-screen bg-transparent">
      <GuestView eventDetails={eventDetails} />
    </div>
  );
};

export default App;