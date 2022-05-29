import React from 'react';
import './Configure.css'
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import {Redirect} from 'react-router-dom'
import data from './data.json'
import lg from './language.json'
import Lottie from "lottie-react-web";
import correct from "./victory";
import error from "./error";
import { BulletList } from 'react-content-loader'
import Loading from './Loading'
import trash from './imgs/trash-10-128.png'
import errors from './errors.json'
import AddCalendar from './comp/AddCalendar'

import Alert from 'react-s-alert';
 
import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';



var fb = null

export default class Admin extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            user: "loading",
            name: "",
            email: "",
            password: "",
            
            available: "",
            school: "",

            surName: "",
            language: "RU",
            add: false,
            errors: [false, false, false, false, false],
            loading: false,
            addVideo: false,
            students: {},
            removeKey: "null",
            role: "student",
            filters: ["",""],
            filteredStudents: {},
            find: ""

        }
        let self = this
        firebase.auth().onAuthStateChanged(function(user) {
          if (user != null ){
              // CHECK FOR ROLE
              self.checkRole()
          } else {
              self.setState({user: false})
          }
        });
    }
    componentWillMount() {
        console.log("HELLOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOOO")
        var firebaseConfig = {
            apiKey: "AIzaSyBwLQZFA5z-WuOzqRZ7OUoLyRdclMRQEu0",
            authDomain: "tecedu-bd07a.firebaseapp.com",
            databaseURL: "https://tecedu-bd07a.firebaseio.com",
            projectId: "tecedu-bd07a",
            storageBucket: "tecedu-bd07a.appspot.com",
            messagingSenderId: "662915300119",
            appId: "1:662915300119:web:33b29c5350142e8ce31552",
            measurementId: "G-5B2X9QJ8NV"
        };
        if (firebase.apps.length < 2) {
            fb = firebase.initializeApp(firebaseConfig, "Secondary")
        } else {
            fb = firebase.apps[1]
            console.log(fb)
        }
    }


    checkRole = () =>{
        console.log("Going to check it")
        let uid = firebase.auth().currentUser.uid
        let db = firebase.firestore().collection("admin").doc(uid)
        let self = this
        db.get().then(function (data) {
            self.setState({user: data.exists})
            if (data.exists) {
                self.setState({
                    available: data.data()["available"],
                    school: data.data()["school"]
                },()=>{
                    // REMOVE IT
                    self.loadStudents()
                })
            }
        })
    }
    createUser = (email, role) => {
            let self = this
            if(self.state.name != "" && this.state.surName != "") {
                if (this.validatePasswod(this.state.password)) {
                    alert("Проверьте ваш пароль")
                    return;
                }

                self.setState({loading: true})
                fb.auth().createUserWithEmailAndPassword(email, this.state.password)
                 .then(function(newUser) {
                     if (role) {
                         self.setStudentSchool(newUser.user.uid)
                     } else {
                         self.serTeacher(newUser.user.uid)
                     }

                     fb.auth().signOut().then(function () {}, function (error) {
                         console.log('Error siging out of fbAdmin.');

                         console.log(error);
                     });


                    }, function (er) {
                         self.setState({loading: false})
                         // console.log(er.message)
                         self.errorShow(er.code, true)
                    })

            } else {
                alert("Введите данные")
            }
    }

    validatePasswod = (password) => {
        return (password.match("/^(?=.*\\d)(?=.*[a-z])(?=.*[A-Z])[0-9a-zA-Z]{8,}$/\n"));
    }


    setProgress = () => {
        var progress = {}
        var available = this.state.available
        var pr = []
        console.log(data[0][this.state.language])
        available.map((availableName, index) => {
            Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").map((keys, indexOfKyes) => {
                pr.push(0)
                if (Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").length - 1 == indexOfKyes) {
                    // LAST ELEMENT
                    progress[availableName] = pr.join(", ")
                    pr = []

                }
            })
        })
        return progress
    }
    setTest = () => {
        var test = {}
        var available = this.state.available
        var pr = []
        available.map((availableName, index) => {
            Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").map((keys, indexOfKyes) => {
                pr.push(0)
                if (Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").length - 1 == indexOfKyes) {
                    // LAST ELEMENT
                    test[availableName] = pr.join(", ")
                    pr = []

                }
            })
        })
        return test
    }
    setExamination = () => {
        var exam = {}
        var pr = -1
        var available = this.state.available
        available.map((availableName, index) => {
            pr = -1
            exam[availableName] = pr
        })

        return exam
    }
    setMyScore = () => {
        var score = {}
        var pr = []
        var available = this.state.available
        available.map((availableName, index) => {
            Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").map((keys, indexOfKyes) => {
                pr.push(0)
                if (Object.keys(data[0][this.state.language][availableName]).filter(key=>key != "description").length - 1 == indexOfKyes) {
                    // LAST ELEMENT
                    score[availableName] = pr.join(", ")
                    pr = []

                }
            })
        })
        return score
    }

    // LOADING DATA
    setStudentSchool = (uid) => {
        console.log(uid)
        let self = this
        console.log(self.state.school)

        firebase.firestore().collection("schools").doc(uid).set({
            schoolName: self.state.school
        }).then(function(){
            console.log("DONE")
            self.setStudentAvailable(uid)
        }).catch(function(er){
            console.log("ERROR ")
            self.errorShow(er.code)
        })
    }
    setStudentAvailable = (uid) => {
        let self = this
        fb.firestore().collection("students").doc(self.state.school).set({
            available: self.state.available
        }).then(function(){
            self.setStudentData(uid)
        }).catch(function(er){
            self.errorShow(er.code)
        })
    }
    setStudentData = (uid) => {
        let self = this
        fb.firestore().collection("students").doc(self.state.school).collection("students").doc(uid).set({
            name: [self.state.name, self.state.surName],
            progress: self.setProgress(),
            myscore: self.setMyScore(),
            exam: self.setExamination(),
            test: self.setTest()

        }).then(function () {
            var ar = self.state.students
            ar[uid] = {name: [self.state.name, self.state.surName], progress: self.setProgress()}
            self.setState({
                loading: false,
                students: ar,
                filteredStudents: ar
            })
        }).catch(function(er) {
            self.errorShow(er.code)
        })
    }
    loadStudents = () => {
        let self = this
        firebase.firestore().collection("students").doc(self.state.school).collection("students").get().then(function(data) {
            data.docs.map((doc)=> {
                var ar = self.state.students
                ar[doc.id] = doc.data()
                self.setState({
                    students: ar,
                    name: "",surname: "", email:"",
                    filteredStudents: ar
                })
            })
            self.loadTeachers()
        }).catch(function(e){
            self.errorShow(e.code)
        })
    }
    loadTeachers = () => { 
        let self = this
        firebase.firestore().collection("teacher").get().then(function(data) {
            var doc = self.setUpTeachers(data.docs)
            Object.keys(doc).map((uids, i) => {

                var ar = self.state.students
                ar[uids] = doc[uids]
                    console.log(ar)
                    self.setState({
                        students: ar,
                        name: "",surname: "",
                        
                        email:"",
                        filteredStudents: ar
                    })
                   
            })
                    
        }).catch(function(e){
            self.errorShow(e.code)
        })
    }
    setUpTeachers = (data) => {
        var object = {}
        
        data.map((uid, i) => {
            if (uid.data()["schoolName"] == this.state.school) {
                object[uid.id] = uid.data()
            }
        })
        return object
    }

    errorShow = (e, type = false) => {
        let self = this
        console.log(e)
        self.setState({loading: false});
        var key  = type == false ? "auth/network-request-failed" : e
        Alert.error(errors[key], {
            position: 'bottom-right',
            effect: 'slide',
            timeout: 3000
        });
    }
    serTeacher = (uid) => {
        let self = this
        firebase.firestore().collection("teacher").doc(uid).set({
            schoolName: self.state.school,
            name: [self.state.name, self.state.surName]
        }).then(function () {
            var ar = self.state.students
            ar[uid] = {name: [self.state.name, self.state.surName]}
            self.setState({
                loading: false,
                name: "",surName: "",email:"",
                students: ar,
                filteredStudents: ar
            })
        }).catch(function (e) {
            self.errorShow(e.message)
        })
    }
   
    // EDITING 
    removeStudent = (key) => {
       console.log("GONNA REMOVE " + key)
       if (this.state.students[key].progress == undefined) {
            // teacher
            let self = this
            firebase.firestore().collection("teacher").doc(key).delete().then(function() {
                self.removeUser(key)
            }).catch(function(e) {
                self.errorShow(e.message)
            })
       } else {
            this.removeSchool(key)
        }   
    }
    removeSchool = (key) => {
            let self = this
            firebase.firestore().collection("schools").doc(key).delete().then(function() {
                self.removeStudentData(key)
            }).catch(function (e) {
                self.errorShow(e.message)
            })
    }
    removeStudentData = (key) => {
            let self = this
            firebase.firestore().collection("students").doc(self.state.school).collection("students").doc(key).delete().then(function() {
                self.removeUser(key)
            }).catch(function(e) {
                self.errorShow(e.message)
            })
    }

    removeUser = (userId) => {
        let self = this
        firebase.database().ref("deleted").push({
            id: userId
        }).then(function(){
            var ar = self.state.students
            var f = self.state.filters
            f[0] = ""
            delete ar[userId]
            self.setState({
                removeKey: "null",
                students: ar,
                filteredStudents: ar,
                filters: f
            })
        }).catch(function (e) {
            self.errorShow(e.message)
        })
    }


    filters = () => {
        let filterData = [
            [{key: "",value: "Choose type"},{key: "teachers",value: "Teachers"},{key: "students",value: "Students"}]
        ]

        return (
            <div className="admin-row">
                {filterData.map((array, index) => 
                    <select className="dropdown" key={index} value={this.state.filters[index]} onChange={(e)=>{
                        var f = this.state.filters
                        f[index] = e.target.value
                        this.setState({filters: f},()=>{
                            this.handleFilters()
                        })
                    }}>
                        {array.map((object, i) => 
                            <option value={object["key"]}>{object["value"]}</option>
                        )}
                    </select>
                )}
                <button className={this.state.add? "none" : "admin-add-btn"} onClick={()=>{this.setState({add: true})}}>{lg[0][this.state.language]["add_btn"]}</button>
            </div>
            )
    }
    handleFilters = () => {
        this.setState({find: ""})
        let self = this
        let filters = this.state.filters
        let object = this.state.students
        var filteredObject = {}
        
        var sorting = filters[1]
        if (filters[0] != "") {
            Object.keys(object).map((obj, i) => {
                // console.log(object[obj])
                var type = object[obj]["schoolName"] != undefined ? "teachers" : "students"
                console.log(type)
                if (type == filters[0]) {
                    filteredObject[obj] = object[obj]
                } 
                if (i == Object.keys(object).length - 1) {
                    this.setState({
                        filteredStudents: filteredObject
                    })
                }
            })
        } else {
            this.searchText()
        }

    }
    searchText = () => {
        let text = this.state.find.toLowerCase()
        var object = this.state.students
        var filteredObject = {}
        Object.keys(object).map((obj, i) => {
            let name = object[obj]["name"].join(" ")
            if (name.toLowerCase().includes(text)) {
                filteredObject[obj] = object[obj]
            }
            if (i == Object.keys(object).length - 1) {
                this.setState({
                    filteredStudents: filteredObject
                })
            }
        })
    }
    sort = (keys) => {
        var obj = {}
        
        keys.map((uid, index) => {
            obj[uid] = this.state.filteredStudents[uid]
        })
        
        return obj
    }

    back = () => {
        this.setState({ addVideo: false})
    }



    render() {
        if (this.state.user == "loading") {
            return <Loading/>
        } else if (this.state.addVideo) {
            return <AddCalendar back={this.back}/>
        } else if (this.state.user) {
            return (
                <div className="admin">
                    <Alert stack={{limit: 3}} />
                    <div className="admin-nav">
                        <label>EnglishMaster</label>
                        <div className="admin-search">
                            <input value={this.state.find} onChange={(f)=>this.setState({find: f.target.value})} type="text" class="searchTerm" placeholder="Search"/>
                            <img onClick={()=>this.searchText()} src="https://image.flaticon.com/icons/svg/149/149309.svg"/>
                        </div>
                        <button style={{marginTop: 0}} className="admin-button" onClick={()=>{
                            firebase.auth().signOut().then((e) => {
                                window.location.reload();
                            })
                        }}>{lg[0][this.state.language]["out"]}</button>
                    </div>
                    

                    <div className="add_video" onClick={()=>this.setState({addVideo: true})}>Add</div>
                    <div className="admin-main">
                        <label className="admin-greet">{lg[0][this.state.language]["admin"]["hi"]}, <span>Admin</span></label>
                        <div className="admin-filters">
                            <label className="admin-bold">{lg[0][this.state.language]["admin"]["your_students"]}:</label>
                            {this.filters()}
                        </div>
                        
                        {(Object.keys(this.state.filteredStudents)[0] == undefined && this.state.filteredStudents === {}) ?
                            <BulletList width="100%" className={this.state.loading ? "code" : "none"}/> :
                            <div className="admin-students">
                                {Object.keys(this.state.filteredStudents).map((key, index) =>
                                    <div className="admin-student-element">
                                        <div className="first_row">
                                            <label className="admin-index">{index + 1}</label>
                                            <div>
                                                <label className="admin-student-name">{this.state.removeKey == index ? lg[0][this.state.language]["loading"] : this.state.filteredStudents[key]["name"][0]}</label>
                                                <label className="admin-student-surname">{this.state.removeKey == index ? "" : this.state.filteredStudents[key]["name"][1]}</label>
                                            </div>
                                            <img onClick={()=>{this.setState({removeKey: index},()=>{
                                                this.removeStudent(key)
                                            })}} src={trash} />
                                        </div>

                                    </div>
                                )}
                            </div>
                        }
                        <div className={(Object.keys(this.state.filteredStudents)[0] == undefined || this.state.filteredStudents === {}) && !this.state.loading ? "admin-no-student" : "none"}>
                            {lg[0][this.state.language]["admin"]["no_students"]}
                        </div>
                    </div>
                    
                    {!this.state.loading ?
                            <div className={this.state.add ? "add-student" : "none"}>
                                <div>
                                    <label>Add {this.state.role == "student" ? "Student":"Teacher"}</label>
                                    <button className="admin-button" onClick={()=>{
                                        this.setState({
                                            add: false
                                        })
                                    }}>Close</button>
                                </div>
                                <select value={this.state.role} onChange={(e)=>{
                                    this.setState({role: e.target.value})
                                }} className="dropdown">
                                    <option value="student">Student</option>
                                    <option value="teacher">Teacher</option>
                                </select>

                                <input style={{
                                    borderBottom: this.state.errors[0] ? "2px red solid" : "none"
                                }} value={this.state.name} onChange={(e)=>this.setState({name: e.target.value})} placeholder={lg[0][this.state.language]["student_data"]["name"]}/>
                                <input style={{
                                    borderBottom: this.state.errors[1] ? "2px red solid" : "none"
                                }} value={this.state.surName} onChange={(e)=>this.setState({surName: e.target.value})} placeholder={lg[0][this.state.language]["student_data"]["surname"]}/>
                                <input style={{
                                    borderBottom: this.state.errors[2] ? "2px red solid" : "none"
                                }} value={this.state.email} onChange={(e)=>this.setState({email: e.target.value})} placeholder="Email"/>
                                <input style={{
                                    borderBottom: this.state.errors[2] ? "2px red solid" : "none"
                                }} value={this.state.password} onChange={(e)=>this.setState({password: e.target.value})} placeholder="Password" type="password"/>
                                
                                <button className="admin-button" onClick={()=>{
                                    let s = this.state
                                    var role = this.state.role == "student"
                                    this.createUser(s.email, role)
                                }}>{lg[0][this.state.language]["add_btn"]}</button>

                                <div className="requirements">
                                    <li>there are small letters</li>
                                    <li>there are capital letters</li>
                                    <li>there are small letters</li>
                                    <li>there are capital letters</li>

                                </div>
                            </div> :
                        <div className="add-student-loading">
                            <div className="spinner"><h1>Englishmaster</h1></div>
                        </div>
                    }
                </div>
            )
        } else {
            return <Redirect to=""/>
        }
    }
}