import React from 'react';
import './Another.css'
import DatePicker from 'react-date-picker';
import Loading from '../Loading'
import firebase from 'firebase'
export default class AddCalendar extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: new Date(),
            loading: false,
            title: "", des: "", text: "",
            course: "", date2: (new Date()).toISOString().substr(0,10) 
        }
    }
    onChange = (dat) => {
        var l =  dat.toISOString().substr(0,10) 
        console.log(l)
        this.setState({date: dat, date2: l})
    }

    send = () => {
        let t = this.state
        let self = this
        if (t.course != "" && t.title != "" && t.des != "" && t.text != "" && t.date2 != "") {
            self.setState({loading: true})
            firebase.database().ref("booking").push({
                title: t.title,
                date: t.date2,
                course: t.course,
                text: t.text,
                des: t.des
            }).then(function() {
                self.setState({loading: false})
                self.props.back()
            }).catch(function(e) {
                alert(e.message)
                self.setState({ loading: false })
            })
        } else {
            alert("Fill all the fields")
        }
    }

    render () {
        if (this.state.loading) {
            return <Loading/>
        } else {
            return (
                <div className="CalendarPlus">
                    <div className="row">
                        <h1>Add event</h1>
                        <img onClick={this.props.back} src="https://image.flaticon.com/icons/svg/149/149690.svg"/>
                    </div>
                    <div className="calendar">
                        <DatePicker
                            onChange={this.onChange}
                            value={this.state.date}
                        />
                        <div className="inputs">
                            <input placeholder="Name" value={this.state.title} onChange={(e)=>this.setState({title: e.target.value})}/>
                            <input placeholder="Short description" value={this.state.des} onChange={(e)=>this.setState({des: e.target.value})}/>
                            <input placeholder="Course" value={this.state.course} onChange={(e)=>this.setState({course: e.target.value})}/>
                            <div/>
                            <textarea placeholder="Full description" value={this.state.text} onChange={(e)=>this.setState({text: e.target.value})}/>
                        </div>
                    </div>
                    <button className="calendarbtn" onClick={this.send}>Send</button>
                </div>
            )
        }
    }
}