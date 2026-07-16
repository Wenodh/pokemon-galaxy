"use client";

import { useTrainerStore } from "../store/trainer.store";
import { ACHIEVEMENTS_REGISTRY } from "../constants/achievements";
import { AVATAR_COLORS, AVATAR_STYLES } from "../constants";
import { useQuery } from "@tanstack/react-query";
import { PokedexRepository } from "@/features/pokedex/services/pokedex-repository";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { useState } from "react";
import { Edit2 } from "lucide-react";

export function TrainerCard() {
  const { profile, updateProfile } = useTrainerStore();

  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(profile.name);
  const [avatarStyle, setAvatarStyle] = useState(profile.avatarStyle);
  const [avatarColor, setAvatarColor] = useState(profile.avatarColor);
  const [favoritePokemonId, setFavoritePokemonId] = useState<number | undefined>(profile.favoritePokemonId);
  const [favoriteType, setFavoriteType] = useState(profile.favoriteType || "");

  // Fetch full 151 Kanto pokemon to let user easily search and select their favorite
  const { data: pokemonList = [] } = useQuery({
    queryKey: ["pokedex-kantolist-trainer"],
    queryFn: () => PokedexRepository.getPokemonList(151, 0),
  });

  const getInitials = (text: string) => {
    return text.trim().slice(0, 2).toUpperCase() || "TR";
  };

  const handleSave = () => {
    updateProfile({
      name: name.trim() || "Red",
      avatarStyle,
      avatarColor,
      favoritePokemonId: favoritePokemonId ? Number(favoritePokemonId) : undefined,
      favoriteType: favoriteType || undefined,
    });
    setIsOpen(false);
  };

  const selectedPokemon = pokemonList.find((p) => p.id === profile.favoritePokemonId);

  // Simple visual generator for profile initials / avatars based on selections
  const renderAvatar = (style: typeof profile.avatarStyle, color: string, nameText: string) => {
    const initials = getInitials(nameText);
    const baseClass = `w-20 h-20 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-md transition-all ${color}`;

    if (style === "pixel") {
      return (
        <div className={`${baseClass} border-4 border-black/20 font-mono tracking-widest`}>
          👾 {initials}
        </div>
      );
    }
    if (style === "retro") {
      return (
        <div className={`${baseClass} rounded-full border-4 border-dashed border-white/40 ring-4 ring-black/10`}>
          🏅 {initials}
        </div>
      );
    }
    if (style === "abstract") {
      return (
        <div className={`${baseClass} bg-gradient-to-tr from-indigo-600 to-pink-500 rounded-3xl animate-pulse`}>
          🌀 {initials}
        </div>
      );
    }
    return (
      <div className={baseClass}>
        {initials}
      </div>
    );
  };

  const typeOptions = [
    "Normal", "Fire", "Water", "Grass", "Electric", "Ice", "Fighting", "Poison",
    "Ground", "Flying", "Psychic", "Bug", "Rock", "Ghost", "Dragon", "Steel", "Dark", "Fairy"
  ];

  const unlockedCount = Object.keys(profile.completedAchievements).length;
  const totalAchievements = ACHIEVEMENTS_REGISTRY.length;
  const achievementProgress = Math.round((unlockedCount / totalAchievements) * 100);

  return (
    <div className="relative overflow-hidden rounded-3xl border border-border bg-gradient-to-br from-card to-muted/20 p-8 shadow-lg md:p-10">
      {/* Background visual detail */}
      <div className="absolute -right-12 -top-12 h-44 w-44 rounded-full bg-primary/5 blur-3xl pointer-events-none" />

      <div className="flex flex-col gap-8 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-col items-center gap-6 text-center md:flex-row md:text-left">
          {renderAvatar(profile.avatarStyle, profile.avatarColor, profile.name)}

          <div className="space-y-2">
            <div className="flex items-center justify-center gap-3 md:justify-start">
              <h2 className="text-3xl font-black tracking-tight">{profile.name}</h2>
              <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 rounded-full border border-border bg-card shadow-sm hover:text-primary"
                    aria-label="Edit Profile"
                  >
                    <Edit2 className="h-3.5 w-3.5" />
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-md">
                  <DialogHeader>
                    <DialogTitle>Customize Trainer Profile</DialogTitle>
                  </DialogHeader>
                  <div className="space-y-6 py-4">
                    <div className="space-y-2">
                      <Label htmlFor="trainer-name">Trainer Name</Label>
                      <Input
                        id="trainer-name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter name..."
                        maxLength={20}
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="avatar-style">Avatar Badge Style</Label>
                        <select
                          id="avatar-style"
                          value={avatarStyle}
                          onChange={(e) => setAvatarStyle(e.target.value as any)}
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {AVATAR_STYLES.map((st) => (
                            <option key={st.value} value={st.value}>
                              {st.label}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="avatar-color">Avatar Color Theme</Label>
                        <select
                          id="avatar-color"
                          value={avatarColor}
                          onChange={(e) => setAvatarColor(e.target.value)}
                          className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        >
                          {AVATAR_COLORS.map((col) => (
                            <option key={col} value={col}>
                              {col.replace("bg-", "").replace("-500", "").toUpperCase()}
                            </option>
                          ))}
                        </select>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fav-pokemon">Favorite Pokémon</Label>
                      <select
                        id="fav-pokemon"
                        value={favoritePokemonId ? String(favoritePokemonId) : "none"}
                        onChange={(e) => setFavoritePokemonId(e.target.value === "none" ? undefined : Number(e.target.value))}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring max-h-60 overflow-y-auto"
                      >
                        <option value="none">None Selected</option>
                        {pokemonList.map((p) => (
                          <option key={p.id} value={String(p.id)}>
                            #{String(p.id).padStart(4, "0")} - {p.name.charAt(0).toUpperCase() + p.name.slice(1)}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="fav-type">Favorite Type Affinity</Label>
                      <select
                        id="fav-type"
                        value={favoriteType || "none"}
                        onChange={(e) => setFavoriteType(e.target.value === "none" ? "" : e.target.value)}
                        className="w-full h-9 rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      >
                        <option value="none">None Selected</option>
                        {typeOptions.map((t) => (
                          <option key={t} value={t}>
                            {t}
                          </option>
                        ))}
                      </select>
                    </div>

                    <Button className="w-full" onClick={handleSave}>
                      Save Changes
                    </Button>
                  </div>
                </DialogContent>
              </Dialog>
            </div>

            <p className="text-sm text-muted-foreground">
              Member since: {new Date(profile.createdAt).toLocaleDateString()}
            </p>

            <div className="flex flex-wrap justify-center gap-3 pt-1 md:justify-start">
              {profile.favoriteType && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/20 bg-primary/5 px-3 py-1 text-xs font-bold text-primary">
                  ⭐ Favorite Type: {profile.favoriteType}
                </span>
              )}
              {selectedPokemon && (
                <span className="inline-flex items-center gap-1.5 rounded-full border border-indigo-500/20 bg-indigo-500/5 px-3 py-1 text-xs font-bold text-indigo-500">
                  💖 Companion: {selectedPokemon.name.charAt(0).toUpperCase() + selectedPokemon.name.slice(1)}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Level / Achievement unlocking overview */}
        <div className="flex flex-col items-center gap-2 rounded-2xl border border-border bg-card p-6 shadow-sm md:w-64">
          <div className="text-xs font-black uppercase tracking-widest text-muted-foreground">
            Trainer Progress
          </div>
          <div className="text-4xl font-black text-primary">
            {achievementProgress}%
          </div>
          <div className="text-xs text-muted-foreground">
            {unlockedCount} of {totalAchievements} Achievements
          </div>
          <div className="mt-4 h-2 w-full rounded-full bg-muted overflow-hidden">
            <div
              className="h-full bg-primary transition-all duration-500"
              style={{ width: `${achievementProgress}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
