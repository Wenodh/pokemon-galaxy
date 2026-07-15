import { TrainerEvent } from "../types";

type EventListener = (event: TrainerEvent) => void;

class TrainerEventServiceClass {
  private listeners: Set<EventListener> = new Set();

  public subscribe(listener: EventListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  public emit(event: TrainerEvent): void {
    setTimeout(() => {
      this.listeners.forEach((listener) => {
        try {
          listener(event);
        } catch (error) {
          console.error("Error in TrainerEventService listener:", error);
        }
      });
    }, 0);
  }
}

export const TrainerEventService = new TrainerEventServiceClass();
