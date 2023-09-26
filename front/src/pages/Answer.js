import { useEffect, useRef, useState } from "react";
import { CountdownCircleTimer } from "react-countdown-circle-timer";
import { useNavigate } from "react-router-dom";
import socketIOClient from "socket.io-client";
import ENDPOINT from "../socket";
const socket = socketIOClient(ENDPOINT);


function Answer() {
    const buttonRef = useRef()
    const nom  = localStorage.getItem("name")
    const [isAnswering , setIsAnswering] = useState(false)
    const navigate = useNavigate()

    useEffect(()=> {
        socket.emit('data',{}, (data)=> {
        })
        const user = localStorage.getItem('name')
        socket.emit('verify-account' , {name : user})
        socket.on('verified'+user , data=>{
            if(!data.verified){
                navigate("/", {replace : true})
            }
        })
    }, [])

    useEffect(() => {
        const handleBeforeUnload = (event) => {
          event.preventDefault();
          event.returnValue = ''; // Nécessaire pour la prise en charge de Chrome
        };
    
        window.addEventListener('beforeunload', handleBeforeUnload);
    
        return () => {
          window.removeEventListener('beforeunload', handleBeforeUnload);
        };
      }, []);

    function envoyerAnswer() {
        const res = { name : localStorage.getItem('name')}
        socket.emit('answer', res )
        socket.on("answering" + res.name , (data)=>{
            setIsAnswering(data.success)
        })
    }

    return (
    <div className="h-screen  flex justify-center items-center">
    <div className="absolute top-2 left-0 flex justify-center w-screen">
        <span 
            className="inline-flex items-center rounded-md bg-purple-50 px-4 py-2 text-xl font-medium text-purple-700 ring-1 ring-inset ring-purple-700/10">
            {nom}
        </span>
        
    </div>
       {
        !isAnswering ? 
        <button ref={buttonRef} onClick={envoyerAnswer} type="button" 
        style={{boxShadow: "5px 5px 11px 1px rgba(0,0,0,0.81)"}}
        className="w-52 h-52 focus:rounded-full hover:rounded-full rounded-full inline-flex items-center justify-center border-8 border-yellow-400 bg-sky-950 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-sky-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-900">
            Répondre
        </button>
        : 
        <CountdownCircleTimer
            isPlaying
            duration={20}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60, 40, 20, 0]}
            size={200}
            strokeWidth={20}
            onComplete={()=>setIsAnswering(false)}
            >
                {({ remainingTime }) => (<div className='flex flex-col items-center'>
                    <span className="text-4xl  font-bold tracking-tight text-gray-900 ">{
                        remainingTime
                    }</span>
                    
                </div>)}
            </CountdownCircleTimer>

       }
      </div>
    );
  }
  
  export default Answer;
  