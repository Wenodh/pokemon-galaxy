"use client";

import * as React from "react";
import { Heart, Loader2 } from "lucide-react";
import { motion, useReducedMotion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useIsFavorite } from "../../hooks/useIsFavorite";
import { useFavoriteActions } from "../../hooks/useFavoriteActions";
import { FavoriteButtonProps } from "./FavoriteButton.types";

const sizeStyles = {
  xs: "h-7 w-7 p-1",
  sm: "h-8 w-8 p-1.5",
  md: "h-10 w-10 p-2.5",
  lg: "h-12 w-12 p-3",
};

const iconSizes = {
  xs: 14,
  sm: 16,
  md: 20,
  lg: 24,
};

const variantStyles = {
  ghost: "bg-transparent hover:bg-accent hover:text-accent-foreground text-muted-foreground",
  subtle: "bg-muted/50 hover:bg-muted text-muted-foreground",
  filled: "bg-primary text-primary-foreground hover:bg-primary/90",
};

export const FavoriteButton: React.FC<FavoriteButtonProps> = ({
  pokemonId,
  pokemonName,
  size = "md",
  variant = "ghost",
  isLoading = false,
  disabled = false,
  className,
}) => {
  const isFavorite = useIsFavorite(pokemonId);
  const { toggle } = useFavoriteActions();
  const shouldReduceMotion = useReducedMotion();

  const handleToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isLoading && !disabled) {
      toggle(pokemonId, pokemonName);
    }
  };

  const label = isFavorite
    ? `Remove ${pokemonName} from favorites`
    : `Add ${pokemonName} to favorites`;

  return (
    <motion.button
      whileHover={shouldReduceMotion ? {} : { scale: 1.08 }}
      whileTap={shouldReduceMotion ? {} : { scale: 0.95 }}
      transition={{ duration: 0.18, ease: "easeOut" }}
      onClick={handleToggle}
      disabled={disabled || isLoading}
      aria-label={label}
      aria-pressed={isFavorite}
      title={label}
      className={cn(
        "inline-flex items-center justify-center rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
        sizeStyles[size],
        variantStyles[variant],
        isFavorite && variant === "ghost" && "text-primary",
        className
      )}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={iconSizes[size]} aria-hidden="true" />
      ) : (
        <Heart
          size={iconSizes[size]}
          aria-hidden="true"
          className={cn(
            "transition-all duration-200",
            isFavorite ? "fill-primary text-primary" : "fill-none"
          )}
        />
      )}
    </motion.button>
  );
};

FavoriteButton.displayName = "FavoriteButton";
