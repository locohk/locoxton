import React, { useState, useEffect } from 'react';
import './stepper.css';
import { TiTick } from 'react-icons/ti';

interface ButtonProps {
    name: string;
    disabled?: boolean;
    action: () => void;
}

interface ButtonsAndState {
    buttonsArray: ButtonProps[],
    paymentState: boolean
}


const Stepper: React.FC<ButtonsAndState> = ({buttonsArray, paymentState}) => {
    const steps = React.useMemo(() => (['Connect Wallet', 'Unlock', 'Confirm Unlock', 'Lock', 'Confirm Lock', 'Payment']), [])
    const [currentStep, setCurretnStep] = useState(2)
    const [complete, setComplete] = useState(false)

    const currentStepButton = React.useMemo(() => {
        return buttonsArray.filter(button => button.name === steps[currentStep - 1])[0]
    }, [buttonsArray, currentStep, steps]);

    useEffect(() => {
        if (paymentState) {
            setCurretnStep(2)
        }

        if ((currentStep === steps.length + 1) && (!paymentState)) {
            setCurretnStep((prev) => prev - 1)
        }
    }, [currentStep, paymentState, steps])

    return (
        <>
            <div className='flex justify-between'>
                {steps?.map((step, i) => (
                    <div key={i} className={`step-item ${currentStep === i + 1 && 'active'} ${ (i + 1 < currentStep || complete) && 'complete'}`}>
                        <div className='step'>{i + 1 < currentStep || complete ? <TiTick size={24} /> : i + 1}</div>
                        <p className='text-gray-500'>{step}</p>
                    </div>
                ))}
            </div>

            <button disabled={currentStepButton.disabled || false} className='btn' onClick={()=>{
                currentStep === steps.length + 1 ? setComplete(true) : setCurretnStep((prev) => prev + 1)
                const action = buttonsArray.filter(button => button.name === steps[currentStep - 1])
                action.forEach( (element) => {
                    element.action()
                })
            }}>
                {currentStep === steps.length + 1 ? 'Done' : (currentStepButton.disabled && currentStep===2) ? 'Coming Soon' : steps[currentStep - 1]}
            </button>

            { currentStep > 2 && currentStep < steps.length + 1 &&
                <button className='btn' onClick={()=> {
                    setCurretnStep((prev) => prev - 1)
                }}>
                    Back
                </button>
            }
            
        </>
    )
}

export default Stepper