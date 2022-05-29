import React from 'react';
import './Another.css';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import data from '../data'
import Loading from '../Loading'


import senior from '../imgs/senior.png'
import senior_star from '../imgs/senior-star.png'

export default class Finished extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "loading",
            school: "",
            student_data: {},
            points: 0,
            course: "",
            total: 20,
            level: "Beginner"
        }
        let self = this
        firebase.auth().onAuthStateChanged(function (user) {
            if (user == null) {
                window.location.href = "/"
            } else {
                self.loadSchool(user.uid)
            }
        })
    }
    componentDidMount() {
        this.setState({course: this.props.match.params.course})
    }


    render() {
        if(this.state.user == "loading") {
            return <Loading/>
        } else if (this.state.user) {
            return (
                <div className="Finished">
                    <div className="FinishedView">
                        <div className="finished-view-main">
                                <div className="level-wrap">
                                     <img src={require("../imgs/" + this.state.level.toLowerCase() + ".png" )} className="level"/>
                                     <img src={require("../imgs/" + this.state.level.toLowerCase() + "-star.png" )} className="level-star"/>
                                     <div className="finished-des">
                                         <label>Поздравляем!!!</label>
                                         <label className="sub">Вы достигли уровень {this.state.level}</label>
                                     </div>
                                </div>
                        </div>
                        <div className="under-center">
                            <label>{this.state.points}/{this.state.total}</label>
                            <progress max={100} value={75}/>
                        </div>
                        <button className="home_btn" onClick={()=>window.location.href = "/account"}>Домой</button>
                    </div>
                </div>
            )
        }
    }

    checkFinishedCourses = () => {
        let self = this
        let state = self.state.student_data
        let course = this.props.match.params.course
        console.log(state)
        if (state["exam"][course] == "-1") {
            window.location.href = "/course/"+course
        } else {
            self.setState({
                user: true
            })
            self.setUpEnv()
        }

    }
    setUpEnv = () => {
        let state = this.state.student_data
        let examination = state["exam"][this.state.course]
        let tests = state["myscore"][this.state.course].split(", ").reduce((a,b)=>parseInt(a) + parseInt(b))

        let total = 20
        this.setState({
            points: tests + examination,
            total: total
        })
        this.setLevel(tests + examination , total)
    }

    setLevel = (points, total) => {
        // SENIOR >= 84.5, MIDDLE >= 64.5

        let percent = points * 100 / total
        var level = "Junior"

        if (percent >= 84.5) {
            // SENIOR
            level = "Senior"
        } else if (percent >= 64.5) {
            // MIDDLE
            level = "Middle"
        } else if (percent >= 25) {
            level = "Junior"
        }
        this.setState({level})
    }

    loadUserData = (uid, sch) => {
        let self = this
        let db = firebase.firestore().collection("students").doc(sch).collection("students").doc(uid)
        db.get().then(function (object) {
            if (object.exists) {
                self.setState({
                    student_data: object.data(),
                },()=>{
                    self.checkFinishedCourses()
                })
            } else {
                alert("Вас не корректно зарегистрировали, обратитесь в IT-службу своей школы")
                firebase.auth().signOut()
            }
        })
    }
    loadSchool = (uid) => {
        let self = this
        let db = firebase.firestore().collection("schools").doc(uid)
        db.get().then(function (data) {
            if (data.exists ) {
                self.setState({
                    school: data.data()["schoolName"]
                })
                self.loadUserData(uid, data.data()["schoolName"])
            } else {
                alert("Вас не корректно зарегистрировали, обратитесь в IT-службу своей школы")
                firebase.auth().signOut()
            }
        })
    }
}