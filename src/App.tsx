import './App.css';
import { TonConnectButton, useTonConnectUI } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import { lockEMDBike, unlockEMDBike } from './utils/api';
import { useState, useEffect } from 'react';
import Image from '../public/locobike-v5.png'

function App() {
  const { connected } = useTonConnect();
  const { value, address, sendIncrement } = useCounterContract();
  const { state, rideId, unlock } = unlockEMDBike('64');
  const { lock } = lockEMDBike('019450670')
  const [tonconnectUI] = useTonConnectUI();

  //setButtonState
  const [unlockConnected, setUnlockConnected] = useState(connected);
  const [lockConnected, setLockConnected] = useState(false);
  const [checkoutConnected, setCheckoutConnected] = useState(false);

  //lockState
  const [lockState, setLockState] = useState(state)    //state: true->open, false->lock
  const [unlockthenLock, setUnLockthenLock] = useState(false)

  //locking/unlocking
  const [unlocking, setUnlocking] = useState(false)
  const [locking, setLocking] = useState(false)

  //paymentSuccess
  const [paySuccess, setPaySuccess] = useState(false)

  //promise for completion
  // const paymentCompletion = async () => {
  //   try {
  //     await sendIncrement()
  //     setPaySuccess(true)
  //   } catch (error) {
  //     console.log(error)
  //   }
  // }

  const timeOutSetUnlockState = () => {
    setLockState(true)
    setUnlocking(false)
  }

  const timeOutSetLockState = () => {
    setLockState(false)
    setUnLockthenLock(true)
    setLocking(false)
  }

  useEffect(() => {

    if ((connected) && !(unlockthenLock)) {
      setUnlockConnected(true)
    } else {
      setUnlockConnected(false)
    }

    if ((lockState) && !(unlockthenLock)) {
      setLockConnected(true)
      setUnlockConnected(false)
    } else {
      setLockConnected(false)
    }

    if ((unlockthenLock) && !(paySuccess)) {
      setCheckoutConnected(true)
      setLockConnected(false)
      setUnlockConnected(false)
    } else if (paySuccess) {
      setCheckoutConnected(false)
      setUnLockthenLock(false)
      setLockState(false)
      setUnlockConnected(false)
    }

    if (unlocking) {
      setUnlockConnected(false)
    }

    if (locking) {
      setLockConnected(false)
    }

    if (!(connected) && !(paySuccess)) {
      setUnlockConnected(false)
      setLockConnected(false)
      setCheckoutConnected(false)
      setLockState(false)
      setUnLockthenLock(false)
    }

  }, [connected, unlockConnected, lockState, unlockthenLock, checkoutConnected, unlocking, locking, paySuccess]);
  
  return (
    <div className='App'>
      <div className='Container'>

        { (connected) &&
          <img src={Image} width="300"/>
        }

        { (!connected) &&
          <TonConnectButton />
        }

        {/* <div className='Card'>
          <b>Counter Address</b>
          <div className='Hint'>{address?.slice(0, 30) + '...'}</div>
        </div>

        <div className='Card'>
          <b>Counter Address</b>
          <div>{value ?? 'Loading...'}</div>
        </div> */}

        {unlockConnected &&
          <a 
            className={`Button ${'Active'}`}
            onClick={() => {
              unlock()
              setUnlocking(true)
              setTimeout(timeOutSetUnlockState, 20000)
            }}
          >
            開鎖
          </a>  
        }

        {unlocking && 
          <label>
            正在開鎖...
          </label>
        }


        {lockConnected &&
          <a 
            className={`Button ${'Active'}`}
            onClick={() => {
              if (rideId && state) {
                console.log('rideId:', rideId)
                lock(rideId)
                setLocking(true)
                setTimeout(timeOutSetLockState, 8000)
              }
            }}
          >
            鎖車
          </a>
        }

        {locking &&
          <label>
            正在鎖車...
          </label>
        }

        {checkoutConnected &&
          <a 
            className={`Button ${'Active'}`}
            onClick={() => {
                sendIncrement()?.then(() => {
                  setPaySuccess(true)
                }).catch((error) => {
                  console.log(error)
                })
              }
            }

          >
            付款
          </a>
        }

        {paySuccess &&
          <label>
            <div>
              交易完成
            </div>
            <div>
              交易金額： 0.002 Ton coins
            </div>
          </label>
        }

        {paySuccess &&
          <a 
          className={`Button ${'Active'}`}
          onClick={() => {
              tonconnectUI.disconnect().then(() => {
                setPaySuccess(false)
              }).catch((error) => {
                console.log(error)
              })
            } 
          }
        >
          OK
        </a>

        }
      </div>
    </div>
  );
}

export default App