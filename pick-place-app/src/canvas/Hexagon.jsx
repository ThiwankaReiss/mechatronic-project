import React from 'react'
import {easing} from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';

const Hexagon = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/Hexagon.glb');
  
    useFrame((state, delta) => easing.dampC(materials.HexagonMaterial.color, snap.color, 0.25, delta));
    const stateString = JSON.stringify(snap);
  return (
    <group
        key={stateString}
    >
        <mesh
            castShadow
            geometry={nodes.Hexagon.geometry}
            material={materials.HexagonMaterial}
            material-roughness={1}
            dispose={null}
            scale ={[1,1,1]}
           
          >
        </mesh>
    </group>
  )
}

export default Hexagon