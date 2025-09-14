import { useState, useEffect } from "react";
import { LoaderCircle, MapPin } from "lucide-react";

import styles from "@/styles/Events.module.css";

const Events = () => {
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [eventsStatusMessage, setEventsStatusMessage] = useState(null);

  useEffect(() => {
    const fetchEvents = async () => {
      setIsLoading(true);
      try {
        const response = await fetch("/api/events");
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const fetchedEvents = await response.json();
        if (fetchedEvents.length > 0) {
          setEvents(fetchedEvents);
        } else {
          setEventsStatusMessage("No events found.");
        }
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch events:", error);
        setEventsStatusMessage("Error loading events. Is the backend running?");
      }
    };

    fetchEvents();
  }, []);
  return (
    <div className={styles.events}>
      <h2 className={styles.eventheader}>
        Upcoming Events{" "}
        {isLoading && <LoaderCircle className={styles.animatespin} />}
      </h2>

      {!isLoading && events.length > 0 ? (
        <ul>
          {events.map((event) => (
            <li key={event.id} className={styles.event}>
              <div className={styles.namedate}>
                <h3>{event.name}</h3>
                <p>{new Date(event.date).toLocaleDateString()}</p>
              </div>
              <div>
                <p className={styles.location}>
                  <MapPin size={20} />
                  {event.location}
                </p>
              </div>
            </li>
          ))}
        </ul>
      ) : (
        <p className="">No upcoming events found for this artist.</p>
      )}
    </div>
  );
};

export default Events;
