import './App.css';
import { TonConnectButton, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';
import { useTonConnect } from './hooks/useTonConnect';
import { useCounterContract } from './hooks/useCounterContract';
import { lockEMDBike, UnlockEMDBike } from './utils/api';
import React, { useState } from 'react';
import Image from '../public/EMD.png'
import ScanImage from '../public/scan_qrcode@3x.png'
import Stepper from './components/Stepper'

const DEMO_USER = import.meta.env.VITE_DEMO_USER;

function App() {
  const userFriendlyAddress = useTonAddress();
  const { connected } = useTonConnect();
  const { sendIncrement } = useCounterContract();
  const { /*state,*/ rideId, unlock } = UnlockEMDBike('64');
  const { lock } = lockEMDBike('019450670')
  const [tonconnectUI] = useTonConnectUI();

  //setButtonState
  // const [unlockConnected, setUnlockConnected] = useState(connected);
  // const [lockConnected, setLockConnected] = useState(false);
  // const [checkoutConnected, setCheckoutConnected] = useState(false);

  //lockState
  // const [lockState, setLockState] = useState(state)    //state: true->open, false->lock
  // const [unlockthenLock, setUnLockthenLock] = useState(false)

  //locking/unlocking
  // const [unlocking, setUnlocking] = useState(false)
  // const [locking, setLocking] = useState(false)

  //paymentSuccess
  const [paySuccess, setPaySuccess] = useState(false)

  // const timeOutSetUnlockState = () => {
  //   setUnlocking(false)
  // }

  // const timeOutSetLockState = () => {
  //   setLocking(false)
  // }

  // useEffect(() => {

  //   if ((connected) && !(unlockthenLock)) {
  //     setUnlockConnected(true)
  //   } else {
  //     setUnlockConnected(false)
  //   }

  //   if ((lockState) && !(unlockthenLock)) {
  //     setLockConnected(true)
  //     setUnlockConnected(false)
  //   } else {
  //     setLockConnected(false)
  //   }

  //   if ((unlockthenLock) && !(paySuccess)) {
  //     setCheckoutConnected(true)
  //     setLockConnected(false)
  //     setUnlockConnected(false)
  //   } else if (paySuccess) {
  //     setCheckoutConnected(false)
  //     setUnLockthenLock(false)
  //     setLockState(false)
  //     setUnlockConnected(false)
  //   }

  //   if (unlocking) {
  //     setUnlockConnected(false)
  //   }

  //   if (locking) {
  //     setLockConnected(false)
  //   }

  //   if (!(connected) && !(paySuccess)) {
  //     setUnlockConnected(false)
  //     setLockConnected(false)
  //     setCheckoutConnected(false)
  //     setLockState(false)
  //     setUnLockthenLock(false)
  //   }

  // }, [connected, unlockConnected, lockState, unlockthenLock, checkoutConnected, unlocking, locking, paySuccess]);

  const unlockAction = React.useMemo(() => ({
    name: 'Unlock',
    disabled: userFriendlyAddress !== DEMO_USER,
    action: () => {
      unlock()
      //setUnlocking(true)
      //setTimeout(timeOutSetUnlockState, 15000)
    }
  }), [userFriendlyAddress]);

  const confirmUnlockAction = {
    name: 'Confirm Unlock',
    action: () => {}
  }

  const lockAction = {
    name: 'Lock',
    action: () => {
      if (rideId) {
        lock(rideId)
        //setTimeout(timeOutSetLockState, 8000)
      }
    }
  }

  const confirmLockAction = {
    name: 'Confirm Lock',
    action: () => {}
  }

  const paymentAction = {
    name: 'Payment',
    action: () => {
      sendIncrement()?.then(() => {
        setPaySuccess(true)
      }).catch((error) => {
        console.log(error)
      })
    }
  }

  // const doneAction = {
  //   name: 'Done',
  //   action: () => {
  //     tonconnectUI.disconnect().then(() => {
  //       setPaySuccess(false)
  //     }).catch((error) => {
  //       console.log(error)
  //     })
  //   }
  // }

  const actionArray = [unlockAction, confirmUnlockAction, lockAction, confirmLockAction, paymentAction]

  
  return (
    <div className='App'>
      <div className='Container'>
        <div className='scanBtnContainer'>
          <button className='scanBtn'><img src={ScanImage} width = "50"></img></button>
        </div>

        { (connected) &&
          <img src={Image} width="350"/>

        }

        { (connected) && 
          <label>Bike No: PAPC-64</label>
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

        {/* {unlockConnected &&
          <a 
            className={`Button ${'Active'}`}
            onClick={() => {
              unlock()
              setUnlocking(true)
              setTimeout(timeOutSetUnlockState, 15000)
            }}
          >
            開鎖
          </a>  
        }

        {unlockConnected &&
          <button onClick={() => {
            setLockState(true)
          }}>
            確認開鎖
          </button>
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

        {lockConnected &&
          <button onClick={() => {
            setLockState(false)
            setUnLockthenLock(true)
          }}>
            確認鎖車
          </button>
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
        } */}

        {connected && (!paySuccess) &&
          <Stepper buttonsArray={actionArray} paymentState={paySuccess}/>
        }

        {paySuccess &&
          <label>
            <div>
              Payment Success
            </div>
            <div>
              Amount： 0.002 Ton coins
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