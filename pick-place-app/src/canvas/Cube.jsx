import React from 'react'
import {easing} from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';

const Cube = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/Cube.glb');
  
    useFrame((state, delta) => easing.dampC(materials.CubeMaterial.color, snap.color, 0.25, delta));
    const stateString = JSON.stringify(snap);
  return (
    <group
        key={stateString}
    >
        <mesh
            castShadow
            geometry={nodes.Cube.geometry}
            material={materials.CubeMaterial}
            material-roughness={1}
            dispose={null}
            scale ={[1,0.3,1]}
           
          >
            {/* {snap.isFullTexture && (
              <Decal 
                position={[0, 0, 0]}
                rotation={[0, 0, 0]}
                scale={1}
                map={fullTexture}
              />
            )}
    
            {snap.isLogoTexture && (
              <Decal 
                position={[0, 0.04, 0.15]}
                rotation={[0, 0, 0]}
                scale={0.15}
                map={logoTexture}
                // map-anisotropy={16}
                depthTest={false}
                depthWrite={true}
              />
            )}
            <Decal 
                position={[0.28, 0.05, -0.012]}
                rotation={[0, Math.PI / 2, 0]}
                scale={0.08}
                map={sideLogo}
                // map-anisotropy={16}
                depthTest={false}
                depthWrite={true}
              /> */}
        </mesh>
    </group>
  )
}

export default Cube