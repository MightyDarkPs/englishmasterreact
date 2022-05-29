import React from 'react'
import './comp/Another.css'
import loginWall from './imgs/main_wall.png'

export default class NotFound extends React.Component {
    render () {
        return (
            <div className="Notfound">
                <img src={loginWall} className="wall"/>
                <div className="notfound-main">
                    <div className="notfound-wrap">
                            <label className="e1 errorsymbol">4</label>
                            <label className="e2 errorsymbol">0</label>
                            <label className="e3 errorsymbol">4</label>
                    </div>

                    <div className="error-info">
                        <label>Ошибка: нет такой страницы</label>
                        <button onClick={()=>{
                            window.location.href = "/"
                        }}>На главную</button>
                    </div>
                </div>
            </div>
        )
    }

}