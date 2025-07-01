import React, { useRef, useMemo, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Text } from '@react-three/drei';
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
      meshRef.current.rotation.y = Math.sin(state.clock.elapsedTime * 0.5) * 0.1;
    }
  });

  return (
    <group position={position}>
      <mesh ref={meshRef} position={[0, height / 2, 0]}>
        <boxGeometry args={[0.8, Math.max(height, 0.1), 0.8]} />
        <meshStandardMaterial color={color} />
      </mesh>
      <Text
        position={[0, -0.5, 0]}
        fontSize={0.3}
        color="black"
        anchorX="center"
        anchorY="middle"
        maxWidth={2}
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
      const z = Math.random() * 10; // Random Z for demo
      
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
        <mesh key={index} position={point.position}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshStandardMaterial color={point.color} />
        </mesh>
      ))}
    </>
  );
};

const LoadingFallback: React.FC = () => (
  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Loading 3D visualization...</p>
    </div>
  </div>
);

const ErrorFallback: React.FC<{ title: string }> = ({ title }) => (
  <div className="w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
    <div className="text-center">
      <div className="text-red-500 mb-4">
        <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">3D Visualization Error</h3>
      <p className="text-gray-600 mb-4">Unable to render 3D chart: {title}</p>
      <p className="text-sm text-gray-500">Try switching to a 2D chart type</p>
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

  if (!data || data.length === 0) {
    return <ErrorFallback title="No data available" />;
  }

  try {
    return (
      <div className="w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
        <Suspense fallback={<LoadingFallback />}>
          <Canvas 
            camera={{ position: [15, 10, 15], fov: 60 }}
            onError={(error) => {
              console.error('3D Canvas error:', error);
            }}
          >
            <ambientLight intensity={0.6} />
            <pointLight position={[10, 10, 10]} />
            <pointLight position={[-10, -10, -10]} color="blue" intensity={0.3} />
            
            {config.type === '3d-bar' ? (
              <>
                {chartData.map((item, index) => (
                  <Bar3D
                    key={`${item.name}-${index}`}
                    position={item.position}
                    height={Math.max((item.value / maxValue) * 5, 0.1)}
                    color={item.color}
                    label={item.name}
                  />
                ))}
              </>
            ) : (
              <Scatter3D data={data} config={config} />
            )}
            
            <OrbitControls 
              enablePan={true} 
              enableZoom={true} 
              enableRotate={true}
              maxDistance={50}
              minDistance={5}
            />
            
            {/* Grid */}
            <gridHelper args={[20, 20]} />
            
            {/* Title */}
            <Text
              position={[0, 8, 0]}
              fontSize={1}
              color="black"
              anchorX="center"
              anchorY="middle"
              maxWidth={20}
            >
              {config.title}
            </Text>
          </Canvas>
        </Suspense>
      </div>
    );
  } catch (error) {
    console.error('3D Chart rendering error:', error);
    return <ErrorFallback title={config.title} />;
  }
};