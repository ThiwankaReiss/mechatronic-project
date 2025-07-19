import React from 'react'
import { Canvas } from '@react-three/fiber'
import { Environment, Center, RandomizedLight } from '@react-three/drei'
import CameraRig from './CameraRig'


import Cube from './Cube.jsx'
import Cylinder  from './Cylinder.jsx'
import Hexagon from './Hexagon.jsx'
import state from '../store/index.js'
import { useSnapshot } from 'valtio'


const CanvasModel = () => {
    const snap = useSnapshot(state);
    return (

        <Canvas
            shadows
            camera={{ position: [0, 0, 0], fov: 20 }}
            gl={{ preserveDrawingBuffer: true }}

        >
            <ambientLight intensity={1} position={[0, 0, 10]} />

           

            <Environment preset='city' />

            <CameraRig cameraCordinates={[0, 0, 10]}>

                
                <Center>
                    {snap.name=="circle" && <Cylinder></Cylinder>  }

                    {snap.name=="hexagon" && <Hexagon></Hexagon>  }                    
                    
                    {snap.name=="square" && <Cube></Cube>  } 
                    {/* */}
                    {/* <Cube></Cube> */}
                </Center>
         
                
            </CameraRig>

        </Canvas>


    )
}

export default CanvasModel