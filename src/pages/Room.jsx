import React, { useCallback, useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { useSocket } from '../providers/Socket'
import peerService from '../services/peer'
import ReactPlayer from 'react-player'
import { Box, Button, Text } from '@chakra-ui/react'

const Room = () => {
    const { roomId } = useParams()
    const { socket } = useSocket()

    const [myStream, setMyStream] = useState(null)
    const [remoteStream, setRemoteStream] = useState(null)
    const [remoteSocketId, setRemoteSocketId] = useState(null)

    const handleNegotiation = useCallback(async () => {
        // console.log('negotiation needed')
        const offer = await peerService.getOffer()
        socket.emit('negotiation', { to: remoteSocketId, offer })
    }, [remoteSocketId, socket])

    const getRemoteStream = useCallback(async (e) => {
        setRemoteStream(e.streams[0])
    }, [])

    useEffect(() => {
        peerService.peer.addEventListener('track', getRemoteStream)
        peerService.peer.addEventListener('negotiationneeded', handleNegotiation)
        return () => {
            peerService.peer.addEventListener('track', getRemoteStream)
            peerService.peer.removeEventListener('negotiationneeded', handleNegotiation)
        }
    }, [getRemoteStream, handleNegotiation])

    const handleNewUserJoined = useCallback(async ({ socketId, username }) => {
        // console.log('new user joined: ', username)
        setRemoteSocketId(socketId)
    }, [])

    const handleCall = useCallback(async () => {
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        const offer = await peerService.getOffer()
        socket.emit('call-user-req', { to: remoteSocketId, offer })
        setMyStream(stream)
    }, [remoteSocketId, socket])

    const handleIncomingCall = useCallback(async ({ from, offer }) => {
        // console.log('incoming call from: ', from)
        const stream = await navigator.mediaDevices.getUserMedia({
            audio: true,
            video: true
        })
        setMyStream(stream)
        const answer = await peerService.getAnswer(offer)

        socket.emit('call-accepted', { to: from, answer })
        setRemoteSocketId(from)
    }, [socket])

    const handleCallAcceptedResponse = useCallback(async ({ answer }) => {
        console.log('call accepted');
        peerService.acceptAnswer(answer)
        for (const track of myStream.getTracks()) {
            peerService.peer.addTrack(track, myStream)
        }
    }, [myStream])

    const handleNegotiationResponse = useCallback(async({ from, offer }) => {
        const answer = await peerService.getAnswer(offer)
        socket.emit('negotiation-res-accepted', { to: from, answer })
    }, [socket])

    const handleNegotiationDone = useCallback(async ({ answer }) => {
        await peerService.acceptAnswer(answer)
    }, [])

    useEffect(() => {
        socket.on('new-user-joined', handleNewUserJoined)
        socket.on('incoming-call', handleIncomingCall)
        socket.on('call-accepted-res', handleCallAcceptedResponse)
        socket.on('negotiation-res', handleNegotiationResponse)
        socket.on('negotiation-done', handleNegotiationDone)
        
        return () => {
            socket.off('new-user-joined', handleNewUserJoined)
            socket.off('incoming-call', handleIncomingCall)
            socket.off('call-accepted-res', handleCallAcceptedResponse)
            socket.off('negotiation-res', handleNegotiationResponse)
            socket.off('negotiation-done', handleNegotiationDone)
        }

    }, [
        socket, 
        handleNewUserJoined, 
        handleIncomingCall, handleCallAcceptedResponse, 
        handleNegotiationResponse, handleNegotiationDone
    ])


    return (
        <div>
            <Text
                fontSize={'xl'}
                fontWeight={'semibold'}
                textAlign={'center'}
                py={'20px'}
            >
                Room - {roomId}
            </Text>
            <Box
                // border={'2px solid red'}
                width={'100%'}
                display={'flex'}
                justifyContent={'center'}
            >
                <Button
                    colorScheme='teal'
                    onClick={() => handleCall()}
                >
                    Join Call
                </Button>
            </Box>

            <Box
                // dir='vertical'
                border={'2px solid red'}
                width={'100%'}
                display={'flex'}
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                py={'20px'}
            >
                <Text
                    fontWeight={'semibold'}
                    textAlign={'center'}
                    py={'20px'}
                >
                    Me
                </Text>
                <ReactPlayer
                    url={myStream}
                    height={'300px'}
                    width={'500px'}
                    playing
                    muted
                />
            </Box>

            <Box
                // dir='vertical'
                border={'2px solid red'}
                width={'100%'}
                display={'flex'}
                flexDir={'column'}
                justifyContent={'center'}
                alignItems={'center'}
                py={'20px'}
            >
                <Text
                    fontWeight={'semibold'}
                    textAlign={'center'}
                    py={'20px'}
                >
                    Other Users
                </Text>
                <Box
                    display={'flex'}
                    flexWrap={'wrap'}
                    gap={4}
                >
                    {
                        remoteStream &&
                        <ReactPlayer
                            url={remoteStream}
                            height={'100px'}
                            width={'200px'}
                            playing
                            muted
                        />
                    }
                </Box>
            </Box>
        </div>
    )
}

export default Room
