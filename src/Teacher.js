import React from 'react';
import './Configure.css'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {Redirect} from 'react-router-dom'
import dataa from './data.json'
import lg from './language.json'
import Loading from './Loading'
import errors from './errors.json'
import Alert from 'react-s-alert';
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';
const teacher_gradients = ["linear-gradient(135deg,#B2F1D7,#75B655)", "linear-gradient(135deg,#FAD961,#F76B1C)", "linear-gradient(135deg,#EDB792,#F54B64)"]

export default class Teacher extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            user: "loading",language: "RU",error: "null",
            school: "",lastVisible: null,data: [],
            filteredData: [],search: "",more: true
        }
        let self = this
        firebase.auth().onAuthStateChanged(function(user) {
            console.log(user)
            if (user == null) {
                window.location.href = "/"
            } else {
                self.loadTeacherData()
            }
        })
    }
    loadTeacherData = () =>{
        let self = this
        let uid = firebase.auth().currentUser.uid
        firebase.firestore().collection("teacher").doc(uid).get().then(function(data) {
            self.setState({
                school: data.data()["schoolName"]
            },()=>{
                // load Students
                self.loadStudents()

            })
        }).catch(function (e) {
            self.errorShow(e.code)
        })
    }
    loadStudents = () => {
        let self = this
        let school = self.state.school
        var db = firebase.firestore().collection("students").doc(school).collection("students")

        var dbWithQuery = null
        if (self.state.lastVisible == null) {
            dbWithQuery = db.orderBy("name").limit(2)
        } else {
            dbWithQuery = db.orderBy("name").startAfter(self.state.lastVisible).limit(2)
        }
        dbWithQuery.get().then(function (snapshot) {

            if (snapshot.docs.length == 0) {
                self.setState({
                    more: false
                })
            }
            self.setState({
                lastVisible:snapshot.docs[snapshot.docs.length - 1],
                user: true
            })
            snapshot.docs.forEach(snap => {
                self.setState({
                    data: self.state.data.concat(snap.data()),
                },()=>{
                    self.setState({
                        filteredData: self.state.data
                    })
                })
            })
        })
    }


    onSearch = (e) => {
        this.setState({
            search: e.target.value
        },()=>{
            let search = this.state.search
           if (this.state.search.includes(" ")) {
                this.setState({
                    filteredData: this.state.data.filter(key => (key["name"][0] + " " + key["name"][1]).toLowerCase().includes(search.toLowerCase()) )
                })


           } else {
               this.setState({
                    filteredData: this.state.data.filter(key => key["name"][0].toLowerCase().includes(search.toLowerCase()) || key["name"][1].toLowerCase().includes(search.toLowerCase()))
               })
           }
        })
    }


    render() {
        if (this.state.user == "loading" ) {
            return <Loading/>
        } else if (this.state.user) {
            return (
                <div className="Teacher">
                    <Alert stack={{limit: 3}} />
                    <div className="teacher-nav">
                        <label>EnglishMaster</label>
                        <input type="search" results="5" autosave="some_unique_value" name="s" value={this.state.search} onChange={(e)=>this.onSearch(e)}
                               placeholder="Search" />
                        <img onClick={()=>{
                            firebase.auth().signOut()
                        }} src="https://image.flaticon.com/icons/svg/149/149071.svg"/>
                    </div>

                    <div className="teacher-intro">
                        <label>{lg[0][this.state.language]["students"]} <span>👨🏻‍🎓</span></label>
                    </div>


                    <div className="t-students">
                        {this.state.filteredData.map((data, key) =>
                            <div className="t-student">
                                <label className="t-student-name">{data["name"][0]} {data["name"][1]}</label>
                                <div className="t-progress">
                                    {Object.keys(data["progress"]).map((course_name, course_index) =>
                                        <div className="t-row">
                                            <label className="sample-width">{course_name}: </label>
                                            <div className="t-row-progress">
                                                <div className="t-row-main" style={{
                                                    width: Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length) + "%",
                                                    background: Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length) < 33 ? teacher_gradients[2]:Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length) < 66 ? teacher_gradients[1] : teacher_gradients[0]
                                                }}/>
                                                <div className="t-row-placeholder" style={{
                                                    background: Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length) < 33 ? teacher_gradients[2]:Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length) < 66 ? teacher_gradients[1] : teacher_gradients[0]
                                                }}/>
                                                <label>{Math.round(data["progress"][course_name].split(", ").reduce((a, b) => parseInt(a) + parseInt(b)) * 100 / data["progress"][course_name].split(", ").length )}%</label>
                                            </div>
                                            <div className="ad-row">
                                                <label className="">{data["myscore"][course_name].split(", ").reduce((a, b)=>parseInt(a)+parseInt(b))}/16</label>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className={this.state.filteredData[0] == undefined ? "not_found" : "none"}>
                            {lg[0][this.state.language]["not_found"]}
                        </div>
                        <div className={this.state.more ? "t-load_more" : "none"} onClick={()=>{
                            this.loadStudents()
                        }}>
                            {lg[0][this.state.language]["more"]}
                        </div>
                    </div>
                </div>
                )
        } 
    }


    // SHOW Errors
    errorShow = (e) => {
            let self = this
            self.setState({error: "null", loading: false});
            Alert.error(errors["auth/network-request-failed"], {
                position: 'bottom-right',
                effect: 'slide',
                timeout: 3000
            });
    }


}

