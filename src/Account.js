import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import './Account.css';
import {Redirect} from 'react-router-dom'
import Loading from './Loading'
import language from './language'
import Circle from 'react-circle';
import Alert from 'react-s-alert';
import empty from './imgs/empty.png'
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
import Certificated from './code/Certificates'
import htmlToImage from 'html-to-image';
import Calendar from './comp/Calendar'
import Review from "./comp/Review";


var obj = []

export default class Account extends React.Component {
        constructor(props) {
        super(props);
        this.state = {
            language: "RU",
            error: "null",
            user: "loading",
            data: {},
            alert: null,
            school: "",
            available: [],
            loading: false,
            currentIndex: 0
        }
        let self = this

        firebase.auth().onAuthStateChanged(function(user) {
              if (user != null ){
                  self.loadStudentsSchool();
              } else {self.setState({user: false}) }
        });

      }

    loadStudentsSchool = () => {
        let self = this
        let uid = firebase.auth().currentUser.uid
        console.log(uid)
        firebase.firestore().collection("schools").doc(uid).get().then(function (data) {
            if (data.exists) {
                self.setState({school: data.data()["schoolName"]},()=>{
                    self.loadStudentData(self.state.school)
                })
            } else {
                firebase.auth().signOut();
            }
        }).catch(function (a) {
            Alert.error('Произошла ошибка', {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 'none'
            });
        })
    }
    loadStudentData = (schoolName) => {
        let self = this
        let uid = firebase.auth().currentUser.uid

        firebase.firestore().collection("students").doc(schoolName).collection("students").doc(uid).get().then(function (data) {
            self.setState({
                data: data.data()
            })
        }).then(function () {
            obj = []
            if (self.state.data.exam != undefined && obj[0] == undefined) {
                Object.keys(self.state.data.exam).map((course, index) => {
                    if (self.state.data.exam.course != - 1) {
                        var score = parseInt(self.state.data.exam[course]) + parseInt(self.state.data.myscore[course].split(", ").reduce((a,b)=>parseInt(a) + parseInt(b)))
                        var percent = score * 0.833
                        var string = percent < 25 ? "Beginner" : percent < 65 ? "Junior" : percent < 85 ? "Middle" : "Senior"
                        var object = {
                            "course": course,
                            "level" : string
                        }
                        obj.push(object)
                        console.log(object)
                    }
                })
            } else {
                console.log(self.state.data.exam != undefined)
                console.log(obj[0] != undefined)
            }
            self.setState({user: true})
            console.log(self.state)
        }).catch(function (er) {
            Alert.error('Произошла ошибка', {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 'none'
            });
        })
    }

    statistics = () => {
        console.log(this.state.data);

        return (
                <div className="statistics-main">
                    {Object.keys(this.state.data["progress"]).map((subject, index) =>
                        {
                        var p = Math.round(this.state.data["myscore"][subject].split(", ").reduce((a,b)=>parseInt(a)+parseInt(b)) * 100/16)
                        p = p >= 85?"Senior":p>=65?"Medium":p>=25?"Junior":"Beginner"
                        return (
                            <div className="st-subject">
                                <div className="st-fill">
                                    <Circle
                                        progress={Math.round(this.state.data["myscore"][subject].split(", ").reduce((a,b)=>parseInt(a)+parseInt(b)) * 100/16)} animated={true} lineWidth="35"
                                        bgColor="#f0ecf9" progressColor="#4C7CEB"
                                        textStyle={{
                                            fontFamily: "Montserrat-Bold",
                                            fontSize: 75
                                        }}
                                    />
                                    <div className="st-subject-info">
                                        <label>{subject}</label>
                                        <div className="st-row">
                                            <div className="s">
                                                <div className="st-icon1">
                                                    <img className="img1" src="/imgs/flask.png"/>
                                                </div>
                                                <label className="st-big">
                                                    {Math.round(this.state.data["myscore"][subject].split(", ").reduce((a,b)=>parseInt(a)+parseInt(b)))}
                                                </label>
                                                <label className="st-medium">Test</label>
                                            </div>
                                            <div className="s">
                                                <div className="st-icon2">
                                                    <img className="img2" src={require("./imgs/flask.png")}/>
                                                </div>
                                                <label className="st-big">
                                                    {this.state.data["exam"][subject] != -1 ? this.state.data["exam"][subject] : 0}
                                                </label>
                                                <label className="st-medium">Exam</label>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="st-fill">
                                    <div className="st-first">
                                        <img src="https://image.flaticon.com/icons/svg/70/70035.svg"/>
                                    </div>
                                    <div className="st-second">
                                        <label>Your level: {p}</label>
                                    </div>
                                </div>
                            </div>
                        )}

                    )}
                </div>
            )
    }
    componentDidMount() {
        this.node()
    }
    node = () => {
        var img = <div></div>

        var node = document.getElementById("haha");
        console.log(node)

        /*
            domtoimage.toPng(node)
        .then(function (dataUrl) {
            var imga = new Image();
            imga.src = dataUrl;
            console.log(imga)
            img = imga
        })
        .catch(function (error) {
            console.error('oops, something went wrong!', error);
        });
        */
        return img
    }
    downloadNode = () => {
        var node = document.getElementById("haha")

        var student_name = document.getElementById("canvas-name").textContent = this.state.data.name[0] + " " + this.state.data.name[1]
        var course_name = document.getElementById("canvas-course").textContent = "Course " + obj[this.state.currentIndex]["course"]
        var course_level = document.getElementById("canvas-level").textContent = "Level " + obj[this.state.currentIndex]["level"]
        console.log(node)
        setTimeout(() => {
            htmlToImage.toJpeg(node,{ quality: 0.9, style:{margin: 0}})
                .then(function (dataUrl) {


                    var link = document.createElement('a');
                    link.download = 'certificate.jpeg';
                    link.href = dataUrl;
                    link.click();
                })
                .catch(function (error) {
                    alert(error.message)
                    Alert.warning("Произошла ошибка" , {
                        position: 'top-right',
                        effect: 'slide',
                        beep: false,
                        timeout: 3000,
                    })
                });
        }, 500);
    }


    render() {
        if (this.state.user == "loading") {
            return <Loading />
        } else if (this.state.user == false){
            return <Redirect to="/"/>
        } else {
            return (
                <div className="Account">
                    <Alert stack={{limit: 3}} />
                    <div className="account-nav">
                            <label key={language[0][this.state.language]["account"]} className="account-title">{language[0][this.state.language]["account"]}</label>
                            <div className="account-nav-first">
                                <img src="pp.jpg" className="account_profile_picture"/>
                                <div className="account-nav-first-control">
                                    <label>Student</label>
                                    <span onClick={() => {
                                        firebase.auth().signOut().then((e) => {
                                            window.location.reload();
                                        });
                                    }}>{language[0][this.state.language]["out"]}</span>
                                </div>
                            </div>
                    </div>

                    <div className="account_main">
                            <h1>{language[0][this.state.language]["your_course"]}:</h1>
                            <div className="account-courses">
                                <div className="courses-column-1">
                                    {Object.keys(this.state.data["progress"]).map((course, index) =>
                                        <div className={index % 2 == 1 ? "none": "my-course-item"} onClick={()=>{
                                            window.location.href = "/course/" + course
                                        }}>
                                           <label className="my-course-item-index">{index + 1}</label>
                                            <label className="my-course-item-name">{course}</label>
                                            {Object.keys(this.state.data["progress"]).length != 0 ?
                                                <label className="my-course-item-progress">
                                                    {Math.round((this.state.data["progress"][course].split(", ").reduce((x, y) => parseInt(x) + parseInt(y))) * 100 / this.state.data["progress"][course].split(", ").length)}%
                                                </label> :
                                                <label className="my-course-item-progress">
                                                    0%
                                                </label>
                                            }
                                        </div>
                                    )}
                                </div>
                                <div className="courses-column-2">
                                    {Object.keys(this.state.data["progress"]).map((course, index) =>
                                        <div className={index % 2 == 0 ? "none": "my-course-item"} onClick={()=>{
                                            window.location.href = "/course/" + course
                                        }}>
                                            <label className="my-course-item-index">{index + 1}</label>
                                            <label className="my-course-item-name">{course}</label>
                                            {Object.keys(this.state.data["progress"]).length != 0 ?
                                                <label className="my-course-item-progress">
                                                        {Math.round((this.state.data["progress"][course].split(", ").reduce((x, y) => parseInt(x) + parseInt(y))) * 100 / this.state.data["progress"][course].split(", ").length)}%
                                                </label> :
                                                <label className="my-course-item-progress">
                                                    0%
                                                </label>
                                            }
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="account-footer">
                            <div className="account-write-us">
                                <div>
                                    <label className="account-contact-title">EnglishMaster</label>
                                    <label className="account-contact-subtitle">{language[0][this.state.language]["write_us"]}</label>
                                     <a className="post" target="_blank" aria-label="Our Email" rel="noopener noreferrer" href="mailto:tecedu@gmail.com">
                                        <label className="post">englishmaster@gmail.com</label>
                                    </a>
                                </div>
                            </div>
                            <div className="account-settings">
                                <div>
                                    <label className="acc-settings-title">{language[0][this.state.language]["settings"]}</label>
                                    <label className="acc-settings-subtitle">Your information</label>
                                    <label className="acc-settings-element">Email: {firebase.auth().currentUser.email}</label>
                                    <label className="acc-settings-element phio">Name: {this.state.data.name != undefined ? this.state.data.name[0] + " " + this.state.data.name[1] : "Не указано"}</label>
                                    <button className="acc-change-psw" onClick={()=>{
                                        let self = this
                                        self.setState({
                                            loading: true
                                        })
                                        firebase.auth().sendPasswordResetEmail(firebase.auth().currentUser.email).then(function () {
                                            self.setState({loading: false})
                                            Alert.warning("New password has send to email" , {
                                                position: 'top-right',
                                                effect: 'slide',
                                                beep: false,
                                                timeout: 3000,
                                                offset: 0
                                            });
                                        }).catch(function(e) {
                                            self.setState({loading: false})
                                            Alert.error('Error', {
                                                position: 'bottom-right',
                                                effect: 'slide',
                                                timeout: 'none'
                                            });
                                        })
                                    }}>{this.state.loading ? "Загрузка..." : language[0][this.state.language]["change_psw"]}</button>
                                </div>
                            </div>
                        </div>
                        <Calendar/>
                        <div className="Statistics">
                            <label className="title">Your Statistics</label>
                            {this.statistics()}
                        </div>
                        {
                            obj[0] == undefined ?
                                <div className="certificates">
                                    <label className="title">My certificates</label>
                                    <img className="certificate" src={empty} onClick={()=>console.log(obj)}/>
                                </div>
                            :
                                <div className="none">
                                    <label className="title">My certificates</label>
                                    <div className="certificate">
                                         <Certificated key={this.state.currentIndex} course={obj[this.state.currentIndex]["course"]} level={obj[this.state.currentIndex]["level"]} img="empty" name={this.state.data.name}/>
                                    </div>
                                    <div className="control-bottom">
                                        <button className={obj.length == 1 ? "none" : null}>⬆</button>
                                        <img onClick={this.downloadNode} src="https://image.flaticon.com/icons/svg/149/149754.svg"/>
                                        <button className={obj.length == 1 ? "none" : null} onClick={()=>{
                                            if (this.state.currentIndex == obj.length - 1) {
                                                this.setState({currentIndex: 0})
                                            } else {
                                                this.setState({currentIndex: this.state.currentIndex + 1})
                                            }
                                        }}>⬇</button>
                                    </div>
                                </div>
                        }
                        <Review name={this.state.data.name}/>
                </div>
            )
        }
    }
}