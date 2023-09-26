import { useEffect, useState } from "react";
import socketIOClient from "socket.io-client";
import ENDPOINT from "../socket";
import { useNavigate } from "react-router-dom";
import { url } from "../lien";
const socket = socketIOClient(ENDPOINT);

function List() {
  const navigate = useNavigate()
    const [users, setUsers]= useState([])
    useEffect(()=> {
      socket.emit('data',{}, (data)=> {
        setUsers(data)
      })

      socket.on('joined_other',(data)=> {
        setUsers(data)
      })
    }, [])

    function handleLancer() {
      socket.emit("rem-current")
      navigate(url)
    }


    return (
      <div className="m-14">
          <header className="relative bg-white">
              <p className="flex h-20 items-center rounded justify-center bg-indigo-600 px-4 text-2xl font-medium text-white sm:px-6 lg:px-8">APP GAME</p>
          </header>
          <div className="my-5 flex justify-end">
              <button 
                onClick={handleLancer}
                type="button" className="inline-flex items-center rounded-md bg-orange-600 px-6 py-4 text-sm font-semibold text-white shadow-sm hover:bg-orange-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">
                  Lancer
              </button>
          </div>
          <ul role="list" className="divide-y divide-gray-100">
        {
            users.map((u)=>   <li className="flex justify-between gap-x-6 py-5">
            <div className="flex min-w-0 gap-x-4">
              <div className="min-w-0 flex-auto">
                <p className="text-sm font-semibold leading-6 text-gray-900">{u.name} </p>
              </div>
            </div>
            <div className="shrink-0 sm:flex sm:flex-col sm:items-end">
            <span onClick={(e)=> {
                socket.emit('remove', u.name)
                setUsers(users.filter(e=> e.name !== u.name))
            }} className="inline-flex items-center rounded-md bg-red-50 px-2 py-1 text-xs font-medium text-red-700 ring-1 ring-inset ring-red-600/10 cursor-pointer">Retirer</span>
            </div>
          </li>)
        }
</ul>
      </div>
    );
  }
  
  export default List;
  