import React from 'react';
import './Course.css';
import Lottie from 'lottie-react-web'
import spinner from './spinner.json'
export default class Loading extends React.Component {


    render () {
        return (
            <div className="Loading">
                <Lottie className="Lottie"
                        width={'50%'}
                    options={{
                        animationData: spinner,
                        loop: true,
                    }}
                            />
            </div>
        )
    }
}

