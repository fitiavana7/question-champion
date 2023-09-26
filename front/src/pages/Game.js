import { CountdownCircleTimer } from 'react-countdown-circle-timer'
import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import ENDPOINT from "../socket";
const socket = socketIOClient(ENDPOINT);

function Game() {

    const [users, setUsers]= useState([])
    const [isRunning, setIsRunning]= useState(false)
    const [showTimer, setShowTimer]= useState(true)
    const [current, setCurrent]= useState()
    useEffect(()=> {
        socket.emit('can-answer', {canAnswer : false})        
        remData()
        socket.emit('data',{}, (data)=> {
            setUsers(data)
        })
        socket.on('answered', (data)=> {
            setCurrent(data)
            setIsRunning(false)
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


    function envoyerScore(time) {
        const res = { name : current.name , point : time}
        socket.emit('true-answer',res)
        socket.on('new-data', (data)=> {
            setUsers(data)
        })
    }

    function canAnswer(res) {
        socket.emit('can-answer', {canAnswer : res})        
    }

    function remData() {
        socket.emit('rem-current')        
    }

    function FauxHandler() {
        setIsRunning(true);
        setCurrent();
        remData()
    }

  return (
    <div className="m-14 mt-8">
        <header className="relative bg-white">
            <p className="flex h-20 items-center rounded justify-center bg-sky-950 px-4 text-2xl font-medium text-yellow-400 sm:px-6 lg:px-8">APP GAME</p>
        </header>

        <div className="h-96 flex justify-between items-start pt-3">
        <div className="flex flex-col mt-4 justify-center gap-4">
        {
            users.map((u,index)=><span key={index} className="inline-flex items-center rounded-md bg-yellow-400 px-4 py-2 text-xl font-medium text-sky-950 ring-1 ring-inset ring-sky-900/10">{u.name.toUpperCase()} : {u.score}</span>)
        }
        </div>
        <div className='flex justify-between items-start'>
        {
        showTimer &&
        <CountdownCircleTimer
            isPlaying={isRunning}
            duration={60}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60, 40, 20, 0]}
            size={350}
            strokeWidth={50}
            onComplete={()=>{canAnswer(false); setShowTimer(false)}}
            >
                {({ remainingTime }) => (<div className='flex flex-col items-center'>
                    <span 
                    className= { !current ?
                        "text-9xl  font-bold tracking-tight text-gray-900 "
                        :
                        "text-4xl  font-bold tracking-tight text-gray-900 "}
                        >{
                        Math.ceil(remainingTime / 15)
                    }</span>
                    {
                        current &&
                        <span className="text-3xl mt-3 font-bold tracking-tight text-gray-900 ">{current.name.toUpperCase()}</span>
                    }
                    {
                        current && !isRunning && 
                    <div className='w-full mt-3 flex justify-between items-center'>
                        <button onClick={FauxHandler}  className="rounded-md border border-transparent bg-red-600 p-3 py-2 text-base text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2">F</button>
                        <button onClick={()=>{
                            envoyerScore(Math.ceil(remainingTime / 15));
                            setShowTimer(false);
                            setCurrent();
                            canAnswer(false)
                            remData()
                            }} className="rounded-md border border-transparent bg-green-500 p-3 py-2 text-base text-white hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2">V</button>
                    </div>
                    }
                </div>)}
            </CountdownCircleTimer>
       }
       {
        current && 
        <CountdownCircleTimer
            isPlaying
            duration={10}
            colors={['#004777', '#F7B801', '#A30000', '#A30000']}
            colorsTime={[60, 40, 20, 0]}
            size={90}
            strokeWidth={10}
            onComplete={()=>{FauxHandler()}}
            >
                {({ remainingTime }) => (<div className='flex flex-col items-center'>
                    <span className="text-4xl  font-bold tracking-tight text-gray-900 ">{
                        remainingTime
                    }</span>
                    
                </div>)}
            </CountdownCircleTimer>

       }
        </div>
      
        </div>
        <div className="flex justify-center">
            <button 
            onClick={()=>{canAnswer(true); remData(); setShowTimer(true); setIsRunning(true)}} 
            className="mt-5 flex items-center justify-center rounded-md border border-transparent bg-yellow-400 px-8 py-3 text-base font-medium text-white hover:bg-yellow-500 focus:outline-none focus:ring-2 focus:bg-yellow-500 focus:ring-offset-2"
            >demarrer</button>
        </div>
    </div>
  );
}

export default Game;
