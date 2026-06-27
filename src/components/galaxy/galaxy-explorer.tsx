'use client';

import { Canvas } from '@react-three/fiber';
import { OrbitControls, Stars, PerspectiveCamera } from '@react-three/drei';
import { Suspense } from 'react';
import { GalaxyStars } from './galaxy-stars';
import { usePokemonList } from '@/hooks/use-pokemon';

export default function GalaxyExplorer() {
  const { data, isLoading } = usePokemonList(1000);

  return (
    <div className="h-full w-full bg-black relative">
      <div className="absolute top-10 left-10 z-10 pointer-events-none">
        <h1 className="text-4xl font-black bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-teal-400 tracking-tighter">
          GALAXY EXPLORER
        </h1>
        <p className="text-white/40 text-sm mt-2 font-medium tracking-widest uppercase">Navigate the regional sectors of the universe</p>
      </div>

      <Canvas dpr={[1, 2]} gl={{ antialias: true }}>
        <PerspectiveCamera makeDefault position={[0, 40, 60]} fov={60} />
        <OrbitControls
          enablePan={true}
          maxDistance={100}
          minDistance={10}
          autoRotate
          autoRotateSpeed={0.2}
        />

        <ambientLight intensity={0.5} />
        <pointLight position={[0, 50, 0]} intensity={2} />
        <Stars radius={150} depth={50} count={7000} factor={4} saturation={0} fade speed={1} />

        <Suspense fallback={null}>
          {!isLoading && data?.pokemon && (
            <GalaxyStars pokemon={data.pokemon} />
          )}
        </Suspense>
      </Canvas>

      {isLoading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black/60 backdrop-blur-md z-20">
          <div className="text-white animate-pulse flex flex-col items-center">
            <div className="w-12 h-12 rounded-full border-2 border-t-blue-500 border-white/20 animate-spin mb-4" />
            <span className="font-bold tracking-widest uppercase text-xs">Scanning Star Systems...</span>
          </div>
        </div>
      )}

      <div className="absolute bottom-10 right-10 z-10 text-right pointer-events-none">
        <p className="text-white/20 text-xs font-bold tracking-[0.3em] uppercase">Rotation: Active</p>
        <p className="text-white/20 text-xs font-bold tracking-[0.3em] uppercase">Sensors: 100%</p>
      </div>
    </div>
  );
}
