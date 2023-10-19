import { createContext, useMemo, useContext, useEffect, useState, useCallback } from "react";

const PeerContext = createContext(null)
export const usePeer = () => useContext(PeerContext)

export const PeerProvider = ({ children }) => {
    const [remoteStream, setRemoteStream] = useState(null)

    const peer = useMemo(() => {
        return new RTCPeerConnection({
            iceServers: [
                {
                    urls: [
                        'stun:stun.l.google.com:19302',
                        'stun:global.stun.twilio.com:3478'
                    ]
                }
            ]
        })
    }, [])

    const createOffer = async () => {
        const offer = await peer.createOffer()
        await peer.setLocalDescription(offer)
        return offer
    }

    const createAnswer = async (remoteOffer) => {
        await peer.setRemoteDescription(remoteOffer)
        const answer = await peer.createAnswer()
        await peer.setLocalDescription(answer)
        return answer
    }

    const setRemoteAnswer = async (remoteAnswer) => {
        await peer.setRemoteDescription(remoteAnswer)
    }

    const sendStream = async (stream) => {
        const tracks = stream.getTracks()
        // console.log(peer)
        for (const track of tracks) {
            peer.addTrack(track, stream)
        }
    }

    const handleTrackEvent = useCallback((event) => {
        const streams = event.streams
        console.log('STREAMS: ', streams)
        setRemoteStream(streams[0])
    }, [])


    useEffect(() => {
        peer.addEventListener('track', handleTrackEvent)
        return () => {
            peer.removeEventListener('track', handleTrackEvent)
        }
    }, [handleTrackEvent, peer])

    
    return(
        <PeerContext.Provider 
            value={{ 
                peer, 
                createOffer, 
                createAnswer, 
                setRemoteAnswer, 
                sendStream,
                remoteStream 
            }}
        >
            { children }
        </PeerContext.Provider>
    )
}