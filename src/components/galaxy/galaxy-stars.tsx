'use client';

import { useMemo, useState, useRef } from 'react';
import { Text, Billboard } from '@react-three/drei';
import { useRouter } from 'next/navigation';
import * as THREE from 'three';

interface SectorPokemon {
  id: number;
  name: string;
  pokemon_v2_pokemonspecy: {
    pokemon_v2_generation: {
      name: string;
    };
  };
}

const SECTOR_METADATA: Record<string, { color: string, angle: number, label: string }> = {
  'generation-i': { color: '#ef4444', angle: 0, label: 'Kanto Sector' },
  'generation-ii': { color: '#3b82f6', angle: (Math.PI * 2) / 9 * 1, label: 'Johto Sector' },
  'generation-iii': { color: '#10b981', angle: (Math.PI * 2) / 9 * 2, label: 'Hoenn Sector' },
  'generation-iv': { color: '#f59e0b', angle: (Math.PI * 2) / 9 * 3, label: 'Sinnoh Sector' },
  'generation-v': { color: '#8b5cf6', angle: (Math.PI * 2) / 9 * 4, label: 'Unova Sector' },
  'generation-vi': { color: '#ec4899', angle: (Math.PI * 2) / 9 * 5, label: 'Kalos Sector' },
  'generation-vii': { color: '#06b6d4', angle: (Math.PI * 2) / 9 * 6, label: 'Alola Sector' },
  'generation-viii': { color: '#f43f5e', angle: (Math.PI * 2) / 9 * 7, label: 'Galar Sector' },
  'generation-ix': { color: '#14b8a6', angle: (Math.PI * 2) / 9 * 8, label: 'Paldea Sector' },
};

export function GalaxyStars({ pokemon }: { pokemon: SectorPokemon[] }) {
  const router = useRouter();
  const [hovered, setHovered] = useState<number | null>(null);
  const groupRef = useRef<THREE.Group>(null);

  const stars = useMemo(() => {
    return pokemon.map((p) => {
      const gen = p.pokemon_v2_pokemonspecy.pokemon_v2_generation.name;
      const sector = SECTOR_METADATA[gen] || { color: '#ffffff', angle: 0, label: 'Unknown' };

      const radius = 15 + Math.random() * 15;
      const spread = 0.4;
      const angle = sector.angle + (Math.random() - 0.5) * spread;

      const x = radius * Math.cos(angle);
      const y = (Math.random() - 0.5) * 10;
      const z = radius * Math.sin(angle);

      return {
        id: p.id,
        name: p.name,
        position: [x, y, z] as [number, number, number],
        color: sector.color,
      };
    });
  }, [pokemon]);

  const sectors = useMemo(() => {
    return Object.entries(SECTOR_METADATA).map(([id, data]) => {
      const radius = 35;
      const x = radius * Math.cos(data.angle);
      const z = radius * Math.sin(data.angle);
      return { id, label: data.label, position: [x, 5, z] as [number, number, number], color: data.color };
    });
  }, []);

  return (
    <group ref={groupRef}>
      {/* Sector Labels */}
      {sectors.map((s) => (
        <Billboard key={s.id} position={s.position}>
          <Text
            fontSize={1.5}
            color={s.color}
            outlineWidth={0.1}
            outlineColor="#000000"
          >
            {s.label}
          </Text>
        </Billboard>
      ))}

      {stars.map((star) => (
        <group key={star.id} position={star.position}>
          <mesh
            onClick={() => router.push(`/pokemon/${star.name}`)}
            onPointerOver={(e) => {
              e.stopPropagation();
              setHovered(star.id);
            }}
            onPointerOut={() => setHovered(null)}
          >
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshStandardMaterial
              color={star.color}
              emissive={star.color}
              emissiveIntensity={hovered === star.id ? 10 : 2}
            />
          </mesh>
          {hovered === star.id && (
            <Billboard position={[0, 0.8, 0]}>
              <Text
                fontSize={0.4}
                color="white"
                anchorX="center"
                anchorY="middle"
              >
                {star.name.toUpperCase()}
              </Text>
            </Billboard>
          )}
        </group>
      ))}
    </group>
  );
}
