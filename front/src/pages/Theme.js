import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import socketIOClient from "socket.io-client";
import ENDPOINT from "../socket";

const socket = socketIOClient(ENDPOINT);

const Theme = () => {
    const navigate = useNavigate()
    const [themes , setThemes] = useState([])

    useEffect(()=> {
        socket.emit('themes',{}, (data)=> {
            setThemes(data)
        })

        socket.on("someone-choice" , data=>{
            socket.emit('themes',{}, (data)=> {
                setThemes(data)
            })
        })
    }, [])

    useEffect(()=> {
        const user = localStorage.getItem('name')
        socket.emit('verify-account' , {name : user})
        socket.on('verified'+user , data=>{
            if(!data.verified){
                navigate("/", {replace : true})
            }
        })
    }, [])


    function handleClick(e) {
        const name = localStorage.getItem("name")
        socket.emit("choisir-theme" , {name , theme : e})
        navigate("/answer", {replace:true})
    }

    return (
        <div className="">
            <p className="text-2xl text-center my-2"> CHOISIR THEME</p>
            <div className=' w-full flex flex-col'>
            {
                themes.map((el,index)=>(
                <button 
                    onClick={()=>{handleClick(el)}} 
                    key={index} 
                    className="font-bold my-2 py-2 flex justify-center items-center bg-sky-950 text-yellow-400 hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                    {el.theme.toUpperCase()}
                </button>
                ))
            }
            </div>
        </div>
    );
};

export default Theme;