import { useSocket } from "@/context/socket"
import { useRouter } from "next/router"

const { useState, useEffect, useRef } = require("react")

const usePeer = () => {
    const socket = useSocket()
    const roomId = useRouter().query.roomId;
    const [peer, setPeer] = useState(null)
    const [myId, setMyId] = useState('')
    // ESTO ES PARA QUE SE OBTENGA EL ID DE UNA SOLA CONEXION PEER Y NO DOS
    const isPeerSet = useRef(false)

    useEffect(() => {
        // EESTO NOS DEVUELVE UN UNICA CONEXION DE PEER
        if (isPeerSet.current || !roomId || !socket) return;
        isPeerSet.current = true;
        let myPeer;
        // INICIALIZAMOS UN NUEVO PEER
        (async function initPeer() {
            // IMPORTAMOS PEERJS Y LO USAMOS POR DEFAULT
            myPeer = new (await import('peerjs')).default()
            //ALMAENAMOS ESE PEER EN EL ESTADO
            setPeer(myPeer)

            // UTILIZAMOS OPEN Y OBTENEMOS EL ID
            myPeer.on('open', (id) => {
                console.log(`your peer id is ${id}`)
                setMyId(id)
                socket?.emit('join-room', roomId, id)
            })
        })()
    }, [roomId, socket])

    return {
        peer,
        myId
    }
}

export default usePeer;