import React, { useContext, useEffect, useState } from 'react';
import { SocketContext } from '../components';

export const useSocketSubscribe = (eventName, eventHandler) => {
  // Get the socket instance
  const { socket } = useContext(SocketContext);

  // when the component, *which uses this hook* mounts,
  // add a listener.
  useEffect(() => {
    // console.log('SocketIO: adding listener', eventName);
    socket.on(eventName, eventHandler);

    // Remove when it unmounts
    return () => {
      // console.log('SocketIO: removing listener', eventName);
      socket?.off(eventName, eventHandler);
    };

    // Sometimes the handler function gets redefined
    // when the component using this hook updates (or rerenders)
    // So adding a dependency makes sure the handler is
    // up to date!
  }, [eventHandler]);
};

//Example use sokcet
// import { useSocketSubscribe } from './SocketProvder';

export function ExampleComponentUseSocket() {
  const [someState, setSomeState] = useState('');

  const handleSocketUpdate = (message) => {
    setSomeState(message);
    console.log(message);
  };

  useSocketSubscribe('update', handleSocketUpdate);

  return <div>{someState}</div>;
}

export function AlertNotification() {
  const [someState, setSomeState] = useState('');

  const handleSocketUpdate = (message) => {
    alert(message);
  };

  useSocketSubscribe('update', handleSocketUpdate);

  return <div>{someState}</div>;
}
