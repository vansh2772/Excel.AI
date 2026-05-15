import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text, Float, ContactShadows } from '@react-three/drei';
import { ChartConfig, DataRow } from '../../types';
import * as THREE from 'three';

interface Chart3DProps {
  data: DataRow[];
  config: ChartConfig;
}

interface BarProps {
  position: [number, number, number];
  height: number;
  color: string;
  label: string;
}

const Bar3D: React.FC<BarProps> = ({ position, height, color, label }) => {
  const meshRef = useRef<THREE.Mesh>(null);
  
  useFrame((state) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.05;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, Math.max(height, 0.1), 0.8]} />
        <meshPhysicalMaterial 
          color={color} 
          emissive={color}
          emissiveIntensity={0.2}
          roughness={0.1}
          metalness={0.8}
          transparent
          opacity={0.9}
        />
      </mesh>
      <Text
        position={[0, -0.6, 0]}
        fontSize={0.25}
        color="#94a3b8"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
        font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
      >
        {label}
      </Text>
    </group>
  );
};

const Scatter3D: React.FC<{ data: DataRow[]; config: ChartConfig }> = ({ data, config }) => {
  const points = useMemo(() => {
    return data.slice(0, 100).map((row, index) => {
      const x = Number(row[config.xAxis]) || 0;
      const y = Number(row[config.yAxis]) || 0;
      const z = Math.random() * 10;
      
      return {
        position: [
          Math.max(-10, Math.min(10, x / 10)), 
          Math.max(-10, Math.min(10, y / 10)), 
          Math.max(-10, Math.min(10, z / 10))
        ] as [number, number, number],
        color: config.colors[index % config.colors.length]
      };
    });
  }, [data, config]);

  return (
    <>
      {points.map((point, index) => (
        <Float key={index} speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
          <mesh position={point.position}>
            <sphereGeometry args={[0.15, 16, 16]} />
            <meshStandardMaterial 
              color={point.color} 
              emissive={point.color}
              emissiveIntensity={0.5}
            />
          </mesh>
        </Float>
      ))}
    </>
  );
};

const LoadingFallback: React.FC = () => (
  <div className="w-full h-96 glass rounded-xl flex items-center justify-center border border-indigo-500/20">
    <div className="text-center space-y-4">
      <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent mx-auto" />
      <p className="text-indigo-400 font-medium">Initializing 3D Engine...</p>
    </div>
  </div>
);

const ErrorFallback: React.FC<{ title: string }> = ({ title }) => (
  <div className="w-full h-96 glass rounded-xl flex items-center justify-center border border-rose-500/20">
    <div className="text-center p-6">
      <div className="bg-rose-500/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 border border-rose-500/30">
        <svg className="w-8 h-8 text-rose-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-bold text-white mb-2">Visualization Engine Error</h3>
      <p className="text-slate-400 text-sm max-w-xs mx-auto mb-4">Unable to render 3D chart: {title}. Your hardware or browser may not support WebGL fully.</p>
      <div className="text-xs text-indigo-400 font-medium uppercase tracking-wider">Try 2D visualization instead</div>
    </div>
  </div>
);

export const Chart3D: React.FC<Chart3DProps> = ({ data, config }) => {
  const chartData = useMemo(() => {
    if (!data || data.length === 0) return [];
    
    const valueCount: { [key: string]: number } = {};
    data.forEach(row => {
      const value = String(row[config.xAxis] || 'Unknown');
      valueCount[value] = (valueCount[value] || 0) + 1;
    });
    
    return Object.entries(valueCount)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 10)
      .map(([name, value], index) => ({
        name: name.length > 8 ? name.substring(0, 8) + '...' : name,
        value,
        position: [index * 2 - 9, 0, 0] as [number, number, number],
        color: config.colors[index % config.colors.length]
      }));
  }, [data, config]);

  const maxValue = Math.max(...chartData.map(d => d.value), 1);

  if (!data || data.length === 0) return <ErrorFallback title="No data provided" />;

  return (
    <div className="w-full h-[500px] bg-slate-950 rounded-xl overflow-hidden border border-indigo-500/20 relative shadow-2xl shadow-black">
      <div className="absolute top-4 left-4 z-10">
        <div className="flex items-center space-x-2 px-3 py-1 bg-indigo-500/10 border border-indigo-500/20 rounded-full">
          <div className="w-2 h-2 bg-indigo-500 rounded-full animate-pulse" />
          <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest">3D Real-time Engine</span>
        </div>
      </div>

      <Suspense fallback={<LoadingFallback />}>
        <Canvas 
          camera={{ position: [15, 10, 15], fov: 45 }}
          shadows
        >
          <color attach="background" args={['#020617']} />
          <fog attach="fog" args={['#020617', 10, 50]} />
          
          <ambientLight intensity={0.5} />
          <spotLight position={[20, 20, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
          <pointLight position={[-10, -10, -10]} color="#6366f1" intensity={0.5} />
          
          {config.type === '3d-bar' ? (
            <>
              {chartData.map((item, index) => (
                <Bar3D
                  key={`${item.name}-${index}`}
                  position={item.position}
                  height={Math.max((item.value / maxValue) * 6, 0.1)}
                  color={item.color}
                  label={item.name}
                />
              ))}
            </>
          ) : (
            <Scatter3D data={data} config={config} />
          )}
          
          <ContactShadows position={[0, -0.01, 0]} opacity={0.4} scale={20} blur={2} far={4.5} />
          <OrbitControls 
            enablePan={false} 
            maxDistance={30}
            minDistance={8}
            autoRotate
            autoRotateSpeed={0.5}
          />
          
          <gridHelper args={[30, 30, '#1e293b', '#0f172a']} />
          
          <Text
            position={[0, 9, -5]}
            fontSize={0.8}
            color="white"
            anchorX="center"
            anchorY="middle"
            maxWidth={20}
            font="https://fonts.gstatic.com/s/inter/v12/UcCO3FwrK3iLTeHuS_fvQtMwCp50KnMw2boKoduKmMEVuLyfAZ9hiA.woff"
          >
            {config.title}
          </Text>
        </Canvas>
      </Suspense>
    </div>
  );
};