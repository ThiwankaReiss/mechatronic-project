import React from 'react'
import {easing} from 'maath'
import { useSnapshot } from 'valtio'
import { useFrame } from '@react-three/fiber'
import { Decal, useGLTF, useTexture } from '@react-three/drei';
import state from '../store';

const Cylinder = () => {
    const snap = useSnapshot(state);
    const { nodes, materials } = useGLTF('/Cylinder.glb');
  
    useFrame((state, delta) => easing.dampC(materials.CylinderMaterial.color, snap.color, 0.25, delta));
    const stateString = JSON.stringify(snap);
  return (
    <group
        key={stateString}
    >
        <mesh
            castShadow
            geometry={nodes.Cylinder.geometry}
            material={materials.CylinderMaterial}
            material-roughness={1}
            dispose={null}
            scale ={[1,1,1]}
           
          >
        </mesh>
    </group>
  )
}

export default Cylinder