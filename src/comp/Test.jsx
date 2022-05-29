import React from 'react';
import './Test.css';
import * as firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import data from '../data'
import language from '../language'
import Lottie from "lottie-react-web";
import correct from "../victory";
import error from "../error";
export default class Test extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            language: "RU",index: 0,check: false,
            correct: [],loading: false,error: "null",
            ready_btn: false,success: false
        }
    }
    componentDidMount(){
        console.log(this.props)
    }
    /*
        About: TEST CONTROLLED BUTTONS
    */
    next = () => {
        if (this.props.questions.length - 1 == this.state.index) {
            // FINISHED
        } else {
            this.setState({
                index: this.state.index + 1
            })
        }
    }
    previous = () => {
        if (this.state.index != 0) {
            this.setState({
                index: this.state.index - 1
            })

        }
    }
    
    
    /*
        What is it : Function to sum user's score
    */
    countMyScore = () => {
        var score = 0
        this.props.correct.map((correct, index) => {
            if (this.props.answers[index].indexOf(correct) == this.props.test[index]) {
                var r = this.state.correct
                r[index] = true
                this.setState({
                    correct: r
                })
                score += 1
            }
        })
        return score
    }


    /*
        User finished out test
    */
    ready = () => {
        var t = this.props.test
        if (this.props.type) {
            this.handleSoch()
        } else {
            this.sendToFirebase()
        }
    }

    /*
        Shoinw popup messages with text
    */
    achiveShow = (e) => {
        this.setState({error: e, success: true},()=>{
            setTimeout(
                function() {
                     this.setState({error: "nil"},()=>{
                         setTimeout(
                            function() {
                                this.setState({error: "null", success: false});
                            }
                            .bind(this),
                            1000
                        );
                     });
                }
                .bind(this),
                4000
            );
        })
    }


    /*
        Handling soch marks
    */
    handleSoch = () => {
        let self = this
        let uid = firebase.auth().currentUser.uid
        let db = firebase.firestore().collection("students").doc(self.props.school).collection("students").doc(uid)
        self.setState({ loading: true })
        var exam = ""
        
        if (this.props.exam != undefined) {
            exam = this.props.exam
            exam[this.props.course] = this.countMyScore()
        } else {
            exam = {
                [this.props.course]: this.countMyScore()
            }
        }
        
        db.set({
            "exam": exam
        },{merge: true}).then(function(){
            self.props.setExam(exam)
            self.setState({
                ready_btn: true
            })
            self.achiveShow("Соч закончился")
        }).catch(function(e) {
            self.errorShow(e.message)
        })
    }


    /*
        Отправить результаты в Firebase
    */
    sendToFirebase = () => {
            // variables 
        let self = this
        let uid = firebase.auth().currentUser.uid
        var testing = this.props.mytest
        var score = this.props.score
        
        if (testing[this.props.course] != undefined) {
            testing = testing[this.props.course].split(", ")
            testing[this.props.finishedSection] = "1"
            testing = {
                [this.props.course]: testing.join(", ")
            }
        } else {
           var array = []
           Object.keys(data[0][this.state.language][this.props.course]).filter(key => key != "description").map((element, index) => {
               array.push(0)
               if (Object.keys(data[0][this.state.language][this.props.course]).filter(key => key != "description").length - 1 == index) {
                   //THE LAST ELEMENT OF ARRAY
                   array[this.props.finishedSection] = 1
                   testing[this.props.course] = array.join(", ")
               }
           })
        }
        if (score[this.props.course] != undefined) {
            score = score[this.props.course].split(", ")
            score[this.props.finishedSection] = this.countMyScore() + ""
            score = {
                [this.props.course]: score.join(", ")
            }
        } else {
              var array2 = []
               Object.keys(data[0][this.state.language][this.props.course]).filter(key => key != "description").map((element, index) => {
                   array2.push(0)
                   if (Object.keys(data[0][this.state.language][this.props.course]).filter(key => key != "description").length - 1 == index) {
                       //THE LAST ELEMENT OF ARRAY
                       array2[this.props.finishedSection] = this.countMyScore()
                       score[this.props.course] = array2.join(", ")
                   }
               })
        }
        self.props.loadView()
        let db = firebase.firestore().collection("students").doc(self.props.school).collection("students").doc(uid)
        db.set({
            test: testing,
            myscore: score
        }, {merge: true}).then(function() {
            self.setState({check: true, loading: false})
            self.props.removeLoad()
            window.location.href = "/account"
            self.props.doIt(testing, score);



            
        }).catch(function (error) {
            self.errorShow(error.message)
            self.props.removeLoad()
            window.location.href = "/account"
        })
    }

    errorShow = (e) => {
        this.setState({error: e, success: false},()=>{
            setTimeout(
                function() {
                     this.setState({error: "nil"},()=>{
                         setTimeout(
                            function() {
                                this.setState({error: "null", loading: false});
                            }
                            .bind(this),
                            1000
                        );
                     });
                }
                .bind(this),
                4000
            );
        })
    }

    render() {
        return (
            <div className="Test">
                <div className="test-nav">
                    <label>{data[0][this.state.language][this.props.course][this.props.finishedSection]["name"]}</label>
                    <label>{this.props.type ? "Контрольная работа" : "Тест"}</label>
                    <div className="test-nav-progress">
                        <div style={{width: (this.state.index + 1) * 100 / this.props.questions.length + "%"}} className="test-nav-prg"></div>
                    </div>
                </div>
                <div className={this.state.error == "null" ? "none" : this.state.error == "nil" ? "alert-hide" : "alert"}>
                                <div className="alert-logo" style={{backgroundColor:this.state.success ? "#9ACB34" : "#fff"}}>
                                    {this.state.error != "null" ? <Lottie
                                            options={{
                                              animationData: this.state.success ? correct : error,
                                              loop: true,
                                            }}
                                    />:null}
                                </div>
                                <div style={{backgroundColor:this.state.success ? "#9ACB34" : "#ff3f2d"}} className="alert-msg">
                                    {this.state.error != "nil" && this.state.error != "null" ? this.state.error : ""}
                                </div>
                            </div>
                <div className="test">
                    <label className="test-number">{language[0][this.state.language]["question"]} {this.state.index + 1}<span>/{this.props.questions.length}</span></label>
                    <label className="test-question">{this.props.questions[this.state.index]}</label>
                    <img className={this.props.images != "null" && this.props.images[this.state.index + ""] != undefined?"image":"none"} src={this.props.images != "null" ? (this.props.images[this.state.index + ""] != undefined ?  this.props.images[this.state.index + ""] : "") : ""  } />
                    <div className="test-options">
                        {this.props.answers[this.state.index].map((option, key) =>
                            <div onClick={()=>{
                                this.props.onItemSelected(key, this.state.index)
                            }} className={this.props.test[this.state.index] == key ? "test-option-sel" : "test-option"}
                                 style={{
                                    background: this.state.check ? (this.props.answers[this.state.index].indexOf(this.props.correct[this.state.index]) == key ? 'linear-gradient( 110.9deg,  rgba(145,241,170,1) 22.3%, rgba(126,245,233,1) 98.8% )' : null ): null,
                                    color: this.state.check ? (this.props.answers[this.state.index].indexOf(this.props.correct[this.state.index]) == key ? 'white' : 'black' ): null
                                 }} key={key}>
                                <div className="test-radio"></div>
                                <label>{option}</label>
                            </div>
                        )}
                    </div>


                    <div className="test-bottom">
                            <img className={this.state.index == 0 ? "fadeout"  : "cn"} onClick={this.previous} src="https://image.flaticon.com/icons/svg/151/151846.svg"/>
                            <div className="control">
                                {this.props.questions.map((div, index) =>
                                    <div onClick={()=>{
                                        this.setState({
                                            index: index
                                        })
                                    }} key={index} style={{backgroundColor: this.state.check ? this.state.correct[index] ? "green" : "red" : (this.state.index == index ? "rgb(68,59,244)"  : "rgb(170,86, 244)")}}>
                                        {index + 1}
                                    </div>
                                )}
                            </div>
                            <img src="https://image.flaticon.com/icons/svg/64/64491.svg" onClick={this.next} className={this.props.questions.length - 1 != this.state.index ? "cn" : "fadeout"}/>
                        </div>
                        <div className="test-footer">

                            <button className="test-footer-cancel" onClick={()=>{
                                if (this.props.mytest[this.props.course] != undefined  && this.props.mytest[this.props.course].split(", ")[this.props.finishedSection] == "1" && this.props.isExam == false) {
                                    window.location.href = "/account"
                                } else {
                                    
                                }
                                if (this.props.type) {
                                   this.ready()
                                }else {
                                    if (this.props.mytest[this.props.course] != undefined ) {
                                        if (this.props.mytest[this.props.course].split(", ")[this.props.finishedSection] == "1") {
                                            this.setState({check: true})
                                        } else {
                                            this.ready()
                                        }
                                    } else {
                                        this.ready()
                                    }
                               }
                            }}
                            >{
                                this.props.mytest[this.props.course] != undefined ? (this.props.mytest[this.props.course].split(", ")[this.props.finishedSection] == "1" ? "Домой" : "Готово") : "Готово"
                            }</button>
                        </div>


                </div>

            </div>
        )
    }
}
/*
*  <div className="language-view">
                                  <label className="language" onClick={() => {
                                      this.setState({language: this.state.language == "KZ" ? "RU" : "KZ"}, () => {
                                          localStorage.setItem("language", this.state.language)
                                      })

                                  }}>{this.state.language == "KZ" ? "🇰🇿" : "🇷🇺"}</label>
                </div>
* */