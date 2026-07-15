"use client";

import { useTrainerStore } from "../store/trainer.store";
import { useEffect } from "react";

interface TrackViewedPokemonProps {
  id: number;
  name: string;
}

export function TrackViewedPokemon({ id, name }: TrackViewedPokemonProps) {
  const { viewedPokemonSet } = useTrainerStore.getState();

  useEffect(() => {
    if (!viewedPokemonSet.includes(id)) {
      import("../application/event-service").then(({ TrainerEventService }) => {
        TrainerEventService.emit({
          type: "POKEMON_VIEWED",
          id,
          name,
        });
      });
    }
  }, [id, name, viewedPokemonSet]);

  return null;
}
