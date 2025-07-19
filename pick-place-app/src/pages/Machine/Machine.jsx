import React from 'react'
import { useState } from 'react'
import CanvasModel from '../../canvas/CanvasModel'
import axios from 'axios'
import './Machine.css'
import state from './../../store'
import { useSnapshot } from 'valtio'

const Machine = () => {

  const [shape, setShape] = useState("circle")
  const [colour, setColour] = useState("blue")
  const snap = useSnapshot(state);

  
  // Define the GET request
  const changeColor =(color)=>{
    setColour(color)
    console.log(color)
    console.log(color=='red')
      
    switch (color) {
      case 'red':
        state.color="#FF0000"; break;
      case 'blue':
        state.color="#0000FF"; break;
      case 'green':
        state.color="#008000"; break;
      default :
        state.color="#0000FF"; break;
      // fallback if no case matches
    }
    
  }

  const changeShape =(shape)=>{
    setShape(shape)
    
    state.name= shape
      
    
    
  }
  const pickObject = () => {
    console.log(shape)
    console.log(colour)
    var obj = colour + "_" + shape
    console.log(obj)
    var obj_json={
      "object_id":obj
    }
    
    axios.post('http://192.168.72.51:8000/objects/',obj_json)
      .then(response => {
        // Handle the response
        console.log(response.data)
      })
      .catch(error => {
        // Handle errors
      });
  }

  return (

    <div class="bg-gradient-to-br from-purple-300 via-pink-300 to-blue-300 min-h-screen flex  justify-between  items-center">

      <div class="w-full max-w-lg bg-white rounded-3xl shadow-xl p-8">
        <h1 class="text-3xl font-bold text-center text-blue-700 mb-6">Pick and Place Robot</h1>
        <form id="controlForm" class="space-y-6">
          <div>
            <label for="shape" class="block text-lg font-medium text-gray-700">Select Shape:</label>
            <select
              id="shape"
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              onChange={(e) => changeShape(e.target.value)}
            >
              <option value="circle">Circle</option>
              <option value="square">Square</option>
              <option value="hexagon">Hexagon</option>
            </select>
          </div>
          <div>
            <label for="color" class="block text-lg font-medium text-gray-700">Select Color:</label>
            <select
              id="color"
              onChange={(e) => changeColor(e.target.value)}
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500">
              <option value="blue">Blue</option>
              <option value="red">Red</option>
              <option value="green">Green</option>
            </select>
          </div>
          <button type="button" onClick={() => pickObject()} class="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 rounded-lg hover:opacity-90">
            Send Command
          </button>
        </form>
        <p id="responseMessage" class="mt-4 text-center text-green-700 font-semibold"></p>
      </div>
      {/* <div className="text-3xl font-bold underline text-blue-600">
        Hello Tailwind CSS!
      </div>
      <div className='m-3 col-12'>
        <div className="d-flex justify-content-center">
          <h1 className=''>Pick and Place Robot</h1>
        </div>

        <div>
          <button type="button" onClick={() => pickObject("blue_square")} className="btn btn-primary m-1">Blue Square <i class="bi bi-square"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("blue_circle")} className="btn btn-primary m-1">Blue Circle <i class="bi bi-circle"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("blue_hexagon")} className="btn btn-primary m-1">Blue Hexagon <i class="bi bi-hexagon"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("red_square")} className="btn btn-danger m-1">Red Square <i class="bi bi-square"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("red_circle")} className="btn btn-danger m-1">Red Circle <i class="bi bi-circle"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("red_hexagon")} className="btn btn-danger m-1">Red Hexagon <i class="bi bi-hexagon"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("yellow_square")} className="btn btn-warning m-1">Yellow Square <i class="bi bi-square"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("yellow_circle")} className="btn btn-warning m-1">Yellow Circle <i class="bi bi-circle"></i></button>
        </div>
        <div>
          <button type="button" onClick={() => pickObject("yellow_hexagon")} className="btn btn-warning m-1">Yellow Hexagon <i class="bi bi-hexagon"></i></button>
        </div>
      </div> */}
      <div className="w-[400px] h-[400px] p-8">
        <CanvasModel />
      </div>

    </div>

  )
}
export default Machine