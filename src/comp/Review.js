import React from 'react';
import './Another.css'
import DatePicker from 'react-date-picker';
import Loading from '../Loading'
import firebase from 'firebase'

export default class Review extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            review: ""
        }
    }

    submit = async  () => {
        let self = this;
        if (this.state.review.trim() != "") {
            this.setState({
                loading: true,
            });

            await firebase.database().ref("review").push({
               "review": self.state.review,
                "date": Date.now(),
                "name": self.props.name
            });

            this.setState({
                loading: false,
                review: "",
            });
        } else {
            alert("Заполните все поля")
        }
    }

    render() {
        return <div className="review">
            <textarea placeholder="Review" value={this.state.review} onChange={(e) => this.setState({
                review: e.target.value
            })}/>
            <button onClick={this.submit}>Submit</button>
        </div>
    }
}