import React from 'react';
import './Course.css';
import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/auth';
import VideoPlayer from 'react-video-js-player';
import data from './data.json'
import Lottie from 'lottie-react-web'
import correct from './victory.json'
import lg from './language.json'
import {Redirect} from 'react-router-dom'
import error from "./error";
import {Drawer} from 'react-pretty-drawer'
import Loading from './Loading'
import scrollToComponent from 'react-scroll-to-component';
import Test from './comp/Test'
import Notfound from './Notfound'
import back from './imgs/back.png'
import yes from './imgs/yes.png'
import no from './imgs/no.png'
import errors from './errors.json'


import Alert from 'react-s-alert';

import 'react-s-alert/dist/s-alert-default.css';
import 'react-s-alert/dist/s-alert-css-effects/slide.css';


const homework_gradients = ["linear-gradient(135deg,#f7d459,#e4a94b)", "linear-gradient(135deg,#d4f9fe,#b4b0be)", "linear-gradient(135deg,#c95c46,#511414)"]
const homework_colors = ["rgba(247, 243, 56, 0.4)","rgba(212,249,254,0.52)","#c95c46"]

const section_gradient = ["linear-gradient(135deg,#CFB8FF,#6249AC)", "linear-gradient(135deg,#EDB792,#F54B64)", "linear-gradient(135deg,#B2F1D7,#75B655)", "linear-gradient(135deg,#B0F1FF,#449CCD)", "linear-gradient(135deg,#FAD961,#F76B1C)", "linear-gradient(135deg,#80FFC6,#C86DD7)", "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    "linear-gradient(135deg,#CFB8FF,#6249AC)", "linear-gradient(135deg,#EDB792,#F54B64)", "linear-gradient(135deg,#B2F1D7,#75B655)", "linear-gradient(135deg,#B0F1FF,#449CCD)", "linear-gradient(135deg,#FAD961,#F76B1C)", "linear-gradient(135deg,#80FFC6,#C86DD7)", "linear-gradient(135deg, #ff0844 0%, #ffb199 100%)",
    "linear-gradient(135deg,#CFB8FF,#6249AC)", "linear-gradient(135deg,#EDB792,#F54B64)"
]
const section_shadow = ["0px 3px 8px rgba(98, 73, 172, 0.7)", "0px 3px 8px rgba(245, 75, 100, 0.7)", "0px 3px 8px rgba(112, 182, 85, 0.7)", "0px 3px 8px rgba(68, 156, 205, 0.7)", "0px 3px 8px rgba(247,107,28, 0.7)", "0px 3px 8px rgba(200, 109, 215, 0.7)", "0px 3px 8px rgba(255, 177, 153, 0.7)",
    "0px 3px 8px rgba(98, 73, 172, 0.7)", "0px 3px 8px rgba(245, 75, 100, 0.7)", "0px 3px 8px rgba(112, 182, 85, 0.7)", "0px 3px 8px rgba(68, 156, 205, 0.7)", "0px 3px 8px rgba(247,107,28, 0.7)", "0px 3px 8px rgba(200, 109, 215, 0.7)", "0px 3px 8px rgba(255, 177, 153, 0.7)"
]
const header_imgs = {"english elementary":require("./imgs/first.png"),"JavaScript": require("./imgs/second.png"),"Python": require("./imgs/third.png")}

export default class Course extends  React.Component {
    constructor(props) {
        super(props);
        this.state = {
            course: "",
            section: 0,
            item: 0,
            user: 'loading',
            data: {},
            error: "null",
            courseData: null,
            language: "RU",
            test: [0, 0, 0],
            check: false,
            school: "",
            available: [],
            success: false,
            mistakeCount: 0,
            drawer: false,
            sectionTap: "null",
            myTest: {},
            score: {},
            showSor: false,
            last: false,
            finished: false,
            exam: 0
        }
        let self = this
        firebase.auth().onAuthStateChanged(function(user) {
            if (user != null) {
                self.loadStudentsSchool()
            } else {self.setState({user: false})}
        })
    }
    componentDidMount() {
        console.log("HI")
        console.log(data[2]["RU"]["JavaScript"]["0"]["answers"].length)
        console.log(data[2]["RU"]["JavaScript"]["1"]["answers"].length)
        console.log(data[2]["RU"]["JavaScript"]["2"]["answers"].length)
        console.log(data[2]["RU"]["JavaScript"]["3"]["answers"].length)
        console.log(data[2]["RU"]["JavaScript"]["4"]["answers"].length)
        console.log(typeof(String(4)))
        console.log(data[0][this.state.language][this.state.course][this.state.section + ""])
    }

    // DRAWER
    showDrawer = () => {
        this.setState({
            sectionShow: true,
        });
    };
    onClose = () => {
        this.setState({
            sectionShow: false,
        });
    };
    itemSelected = (i, s) => {

        var testt = this.state.test
        testt[s] = i
        this.setState({
            test: testt
        },()=>{
            console.log(this.state.test)
        })
    }


    setUp = () => {
        var test = []
        if (data[0][this.state.language][this.state.course] != undefined) {
            //console.log(data[2][this.state.language])
            data[2][this.state.language][this.state.course][this.state.section + ""]["questions"].map((q, i ) => {
                test.push(4)
            })
        } else {
        }

        return test
    }
    loadStudentsSchool = () => {
        let self = this
        let uid = firebase.auth().currentUser.uid
        firebase.firestore().collection("schools").doc(uid).get().then(function (data) {
            if (data.exists) {
                self.setState({school: data.data()["schoolName"]},()=>{
                    self.loadAvailabe(self.state.school)
                })
            } else {
                firebase.auth().signOut();
            }
        }).catch(function (a) {
            self.errorShow(a.message)
        })
    }
    loadAvailabe = (schoolName) => {
        let self = this
        let uid = firebase.auth().currentUser.uid
        firebase.firestore().collection("students").doc(schoolName).get().then(function (data) {
            self.setState({available: data.data()["available"]},()=>{
                self.loadStudentData(schoolName)
            })
        }).catch(function(er) {
            self.errorShow(er.message)
        })

    }

    closeTest = () => {
        this.setState({
            showSor: false
        })
    }
    loadStudentData = (schoolName) => {
        let self = this
        let uid = firebase.auth().currentUser.uid
        firebase.firestore().collection("students").doc(schoolName).collection("students").doc(uid).get().then(function (data) {
            self.setState({
                data: data.data(),
            })
            if (data.data()["exam"] != undefined ) {
                self.setState({
                    exam: data.data()["exam"]
                })
            } else {
                self.setState({
                    exam: {}
                })
            }
            self.setUpScore(data.data())
        }).then(function () {
            console.log(self.state)
            self.setState({user: true},()=>{
                self.setState({test: self.setUp()})
            },()=>{
                console.log(self.state.test)
            })

        }).catch(function (er) {
            self.errorShow(er.message)
        })
    }
    setUpScore = (data) => {

        if (data["myscore"] != undefined) {
            this.setState({
                score: data["myscore"]
            })
            this.setUpTest(data)
        }
    }
    setUpTest = (data) => {
        if (data["test"] != undefined) {
            this.setState({
                myTest: data["test"]
            })
        }
    }
    courseSelect = (section, item) => {
        this.setState({
            test: this.setUp, item: parseInt(item), section: section,
            drawer: false
        },()=>{
            console.log(this.state.section)
        })
    }
    last = (arr) => {
        return arr[arr.length - 1]
    }
    sendProgressToFirebase = (sectionId, bool) => {

        let self = this
        let uid = firebase.auth().currentUser.uid
        var progress = this.state.data["progress"]
        var progressByCourse = progress[this.state.course].split(", ") // ["1", "0", "1"]
        progressByCourse[sectionId] = "1"
        progress[this.state.course] = progressByCourse.join(", ")
        console.log(progress)
        self.setState({
            user: "loading"
        })

        firebase.firestore().collection("students").doc(self.state.school).collection("students").doc(uid).set({
            progress: progress
        }, {merge: true}).then(function() {
            self.setState({
                progress: progress,
                user: true
            })
            if (bool) {
                self.setState({test: self.setUp, item: 0, section: parseInt(this.state.section) + 1},()=>{
                    self.setState({
                        sectionTap: self.state.section
                    })
                })
            }

        }).catch(function(e) {
            self.setState({
                user: true
            })
            self.errorShow(e.message)
        })
    }
    back = () => {
        scrollToComponent(this.Video, { offset: 0, align: 'middle', duration: 500, ease:'inExpo'})
        // IS IT FIRST SECTION
        var firstSection = Object.keys(data[0][this.state.language][this.state.course]).filter(key => key != "description")[0] == this.state.section
        var firstItem = Object.keys(data[0][this.state.language][this.state.course][this.state.section]).filter(key2=>key2!="name")[0] == this.state.item

        if (firstSection && firstItem) {
            alert("NO WAY")
        } else if (firstItem) {
            var section = this.state.section
            this.setState({
                item: parseInt(this.last(Object.keys(data[0][this.state.language][this.state.course][section - 1]).filter(key2=>key2!="name"))),
                section: parseInt(section) - 1,
                sectionTap: parseInt(section) - 1,
            })
        } else {
            this.setState({
                item: this.state.item - 1
            })
        }

    }




    getMySectionData = () => {
        if (localStorage.getItem(this.state.course + "") != null) {
            console.log(localStorage.getItem(this.state.course))
            var progressInStr = localStorage.getItem(this.state.course)
            var section_item = progressInStr.split(",")
            this.setState({
                section: section_item[0],
                item: parseInt(section_item[1]),
                sectionTap: section_item[0]
            },()=>{
                console.log(this.state.section)
                console.log(this.state.item)
                console.log(this.state.sectionTap)
            })

        } else {

        }

    }

    saveMySectionAndItem = () => {
        var sectionData = ""
        sectionData = this.state.section + "," + this.state.item
        localStorage.setItem(this.state.course, sectionData)
    }





    next = () => {

        scrollToComponent(this.Video, { offset: 0, align: 'middle', duration: 500, ease:'inExpo'})

        var lastSection = (this.last(Object.keys(data[0][this.state.language][this.state.course]).filter(key => key != "description")) == this.state.section)
        var lastItem = this.last(Object.keys(data[0][this.state.language][this.state.course][this.state.section]).filter(key2=>key2!="name")) == this.state.item
        if (lastItem && lastSection) {
            // it was the last video
            this.setState({last: true})
            this.newSection(true)
        } else if (lastItem) {
            this.newSection(false)
            this.setState({last: false})
            /*
                if (this.state.data["progress"][this.state.course].split(", ")[this.state.section] == "1") {
            this.setState({
                    section: parseInt(this.state.section) + 1, test:this.setUp(), item: 0
                },()=>{
                    this.setState({sectionTap: this.state.section })
                    this.saveMySectionAndItem()
                })
            }
            */
        } else {
            this.setState({
                test: this.setUp(), item: parseInt(this.state.item )+1, last: false
            },()=>{
                this.saveMySectionAndItem()
            })
        }
    }



    upDateTest = (testing, scoree) => {
        this.setState({
            score:scoree,
            myTest: testing
        },()=>{
            this.progressLook()
        })

    }
    progressLook = () => {
        var lastSection = (this.last(Object.keys(data[0][this.state.language][this.state.course]).filter(key => key != "description")) == this.state.section)

        var lastItem = this.last(Object.keys(data[0][this.state.language][this.state.course][this.state.section]).filter(key2=>key2!="name")) == this.state.item

        if (lastItem && lastSection) {
            // ЕСЛИ ДО ЭТОГО ОТПРАВЛЯЛИ
            if (this.state.data["progress"][this.state.course].split(", ")[this.state.section] != "1") {
                this.sendProgressToFirebase(this.state.section, false)
            }

        } else if (lastItem) {
            if (this.state.data["progress"][this.state.course].split(", ")[this.state.section] != "1") {
                this.sendProgressToFirebase(this.state.section, false)
            }
        }

    }
    setExam = (e) =>{
        this.setState({
            exam: e
        })
        window.location.href = "/finished/" + this.state.course

    }

    showTest = (finished) => {
        var text = finished ? "Do you want to write a test for all sections now? You will not be able to retake this test" : "Do you want to write a test for this section now? You will not be able to retake this test"
        if (window.confirm(text)) {
            this.presentTest(finished)
        } else {
            if (!finished) {
                var lastSection = (this.last(Object.keys(data[0][this.state.language][this.state.course]).filter(key => key != "description")) == this.state.section)
                var lastItem = this.last(Object.keys(data[0][this.state.language][this.state.course][this.state.section]).filter(key2=>key2!="name")) == this.state.item
                if (!lastSection && lastItem) {
                    this.setState({
                        section: parseInt(this.state.section) + 1, test:this.setUp(), item: 0
                    },()=>{
                        this.setState({sectionTap: this.state.section })
                        this.saveMySectionAndItem()
                    })
                } else if (!lastItem && !lastItem || (lastItem && !lastItem)) {
                    this.setState({
                        test: this.setUp(), item: parseInt(this.state.item) + 1, last: false
                    },()=>{
                        this.saveMySectionAndItem()
                    })
                }
            }
        }
    }


    presentTest = (finished) => {
        if (finished) {
            this.setState({
                finished: true, showSor: true
            })
        } else {
            this.setState({
                finished: false, showSor: true
            })
        }
    }



    newSection = (last) => {
        // check have i done this test

        if (this.state.myTest[this.state.course] != undefined) {
            if (this.state.myTest[this.state.course].split(", ")[this.state.section] != undefined) {
                if (this.state.myTest[this.state.course].split(", ")[this.state.section] != 1) {
                    // show test here
                    this.showTest(false)
                } else {
                    if (last) {
                        if (this.state.exam != undefined) {
                            if (this.state.exam[this.state.course] == -1 || this.state.exam[this.state.course] == "-1" ) {
                                if (this.checkAllExamsAndTasks()) {
                                    this.showTest(true)
                                } else {
                                    alert("You must complete all tasks")
                                }
                            } else {
                                window.location.href = "/finished/" + this.state.course
                            }
                        } else {
                            if (this.checkAllExamsAndTasks()) {
                                this.showTest(true)
                            } else {
                                alert("You must complete all tasks")
                            }
                        }
                    } else {
                        if (this.state.data["progress"][this.state.course].split(", ")[this.state.section] == "1") {
                            this.setState({
                                section: parseInt(this.state.section) + 1, test:this.setUp(), item: 0
                            },()=>{
                                this.setState({sectionTap: this.state.section })
                                this.saveMySectionAndItem()
                            })
                        }
                    }
                }
            }  else {
                this.showTest(false)
            }
        } else {
            this.showTest(false)
        }
    }

    checkAllExamsAndTasks = () => {
        let arrayIneed = this.state.myTest[this.state.course]
        var isAllTestFinished = true
        arrayIneed.split(", ").forEach(test => {
            if (test === "0") {
                isAllTestFinished = false
            }
        })

        return isAllTestFinished
    }



    componentWillMount() {
        var c = this.props.match.params.item == "C" ? "C#" : this.props.match.params.item

        this.setState({
            course: c
        },()=>{
            this.getMySectionData()
        })

    }
    setLoading = () => {
        this.setState({
            user: "loading"
        })
    }
    removeLoading = () => {
        this.setState({
            user: true
        })
    }
    render() {
        var middle_data = {}
        var short_data = {}
        if (data[0][this.state.language][this.state.course] != undefined) {
            short_data = data[0][this.state.language][this.state.course][this.state.section + ""][this.state.item + ""]
            middle_data = data[0][this.state.language][this.state.course]
        }
        var points = 0; var examination = 0; var total = 20
        if (this.state.score[this.state.course] != undefined) {
            points = this.state.score[this.state.course].split(", ").reduce((a, b)=>parseInt(a) + parseInt(b))
        }
        if (this.state.exam[this.state.course] != -1 ) {
            examination = this.state.exam[this.state.course]
        }



        if (this.state.user == "loading") {
            return <Loading/>
        } else if (this.state.user == false) {
            return <Redirect to="/" />
        } else if (!this.state.available.includes(this.state.course))  {
            return <Notfound/>
        } else {
            return (
                <div className="Course-wrapper">
                    {!this.state.showSor ? <div className="Course">

                            <div className="course_nav">
                                <div className="nav__burger">
                                    <div className="b1" />
                                    <div className="b2" />
                                    <div className="b3" />
                                </div>
                                <img className="logo-nav" onClick={()=>{window.location.href = "/"}} src={require("./imgs/qazcode.png")}/>
                                <div className="vertical-divider"></div>
                                <label className="course_nav-course-name">{this.state.course}</label>
                                <div className="myscore" style={{background: (parseInt(points) + parseInt(examination)) / parseInt(total) > 0.8 ? section_gradient[2] : ((parseInt(points) + parseInt(examination)) / parseInt(total) > 0.4 ? section_gradient[1]  : section_gradient[6]) }}>
                                    <label>{parseInt(points) + parseInt(examination)}/{total}</label>
                                </div>

                                <img onClick={()=> window.location.href = "/account" } src="https://image.flaticon.com/icons/svg/149/149071.svg" className="course-acc"/>
                            </div>
                            <Drawer width={350} heigth={'100%'}
                                    className="drawer"
                                    visible={this.state.drawer}
                                    onClose={()=>this.setState({drawer: false})}>
                                <div className="dr-header">
                                    <div className="dr-header-img" style={{background: 'url(' + header_imgs[this.state.course] + ')'}}/>
                                    <div className="dr-header-row-1">
                                        <div className="dr-header-title">{this.state.course}</div>
                                        <img className="dr-back" src={back} onClick={()=>this.setState({drawer: false})}/>
                                    </div>
                                    <div className="dr-header-column-1">
                                        <span className="bhfjdbjhdf">{lg[0][this.state.language]["overall_progress"]}:</span>
                                        <div className="dr-progress">
                                            <div className="progress-placeholder">
                                                <div className="progress-main" style={{width: (this.state.data["progress"][this.state.course].split(", ").reduce((x, y) => parseInt(x) + parseInt(y))) * 100 / this.state.data["progress"][this.state.course].split(", ").length + "%"}}></div>
                                            </div>

                                            <span>
                                                {Math.round((this.state.data["progress"][this.state.course].split(", ").reduce((x, y) => parseInt(x) + parseInt(y))) * 100 / this.state.data["progress"][this.state.course].split(", ").length)}%
                                            </span>
                                        </div>
                                    </div>

                                </div>
                                <div className="dr-body">
                                    <div className="dr-body-header">
                                        {lg[0][this.state.language]["topics"]}
                                    </div>

                                    <div className="dr-sections">
                                        {Object.keys(data[0][this.state.language][this.state.course]).filter(key => key != "description").map((key, index) =>

                                            <div className="dr-section-view" key={index}>
                                                <div className="dr-section" style={{background: this.state.sectionTap == index ? section_gradient[index] :" unset"}} onClick={()=>{
                                                    if(this.state.sectionTap == index) {
                                                        this.setState({sectionTap: "null"})
                                                    }  else {this.setState({sectionTap: index})}
                                                }}>
                                                    <div style={{background: section_gradient[index],boxShadow: section_shadow[index] }} className="dr-section-icon">
                                                        <img className={this.state.data["progress"][this.state.course].split(", ")[parseInt(key)] == "1" ? "dr-icon-big" : "dr-icon"} src={this.state.data["progress"][this.state.course].split(", ")[parseInt(key)] == "1" ? yes : no}/>
                                                    </div>
                                                    <div className="dr-section-main">
                                                        <label style={{color: this.state.sectionTap == index ? "#fff" :"#171719"}} className="dr-section-title">{data[0][this.state.language][this.state.course][key]["name"]}</label>
                                                        <label style={{color: this.state.sectionTap == index ? "#e5e5e5" :"#818181"}} className="dr-section-status">{this.state.data["progress"][this.state.course].split(", ")[parseInt(key)] == "1" ? lg[0][this.state.language]["course_finished"]
                                                            : lg[0][this.state.language]["course_not_finished"] }</label>
                                                    </div>
                                                </div>
                                                {this.state.sectionTap == index ?
                                                    <div className="Expanded" style={{background: section_gradient[index] }}>
                                                        {Object.keys(data[0][this.state.language][this.state.course][key]).filter(key => key != "name").map((key2, index2) =>
                                                            <div
                                                                style={{background: this.state.sectionTap == this.state.section && this.state.item == key2 ? section_gradient[index] : null}}
                                                                onClick={()=>{
                                                                    this.courseSelect(this.state.sectionTap, key2)
                                                                }} className={this.state.sectionTap == this.state.section && this.state.item == key2 ? "expanded-item sel-it" : "expanded-item"}>
                                                                <label className="expanded-title">{data[0][this.state.language][this.state.course][key][key2]["name"]}</label>
                                                            </div>
                                                        )}
                                                    </div>

                                                    : null}
                                            </div>

                                        )}
                                    </div>
                                </div>
                            </Drawer>
                            <div onClick={()=>this.setState({drawer: true})} className="show-drawer">
                                {lg[0][this.state.language]["menu"]}
                            </div>

                            <div ref={(section) => { this.Video = section; }} className="video-player" key={short_data["url"]}>
                                <VideoPlayer key={short_data["url"]} className="video" controls={true}
                                             src={short_data["url"].replace("www.dropbox.com", "www.dl.dropboxusercontent.com")}
                                />
                                <div className="video-footer">
                                    <label className="section-name" onClick={()=>{
                                        console.log(short_data)
                                    }}>{lg[0][this.state.language]["section"]}: {short_data["name"]}</label>
                                    <label className="item-name">{short_data["name"]}</label>
                                    <label className="course-des"><span className="course-item-item">{lg[0][this.state.language]["about_course"]}: </span>{data[0][this.state.language][this.state.course]["description"]}</label>
                                    <label className="course-des"><span className="course-item-item">{lg[0][this.state.language]["all_sections"]}: </span>{Object.keys(data[0][this.state.language][this.state.course]).length - 1}</label>
                                </div>
                            </div>
                            {short_data["homework"] != false ? <div className="homework-section">

                                <div className="new-section">
                                    <label>{lg[0][this.state.language]["home_work"]}</label>
                                    <span>{lg[0][this.state.language]["practice_test_sub"]}</span>
                                </div>
                                <div className="grid">

                                    {short_data["homework"].map((homework,i) =>
                                        <div className="homework" style={{background:homework_gradients[i]}}>
                                            <span style={{color: homework_colors[i]}} className="homework-tag">{lg[0][this.state.language]["homework"][i]}</span>
                                            <span className="homework-title" onClick={()=>{
                                            }}>{lg[0][this.state.language]["title"]}:</span>
                                            <span className="homework-msg"
                                            >{short_data["homework"][i]}</span>

                                        </div>
                                    )}
                                </div>
                            </div> : null }
                            <div className="course-footer">
                                <button className={this.state.section == "0" && this.state.item == "0" ? "none" : "norm"} onClick={this.back}>{lg[0][this.state.language]["cancel"]}</button>
                                <button onClick={this.next}>{lg[0][this.state.language]["next_btn"]}</button>
                            </div>
                        </div>:
                        (this.state.finished ? <Test
                            test={this.state.test}
                            questions={data[3][this.state.language][this.state.course]["questions"]}
                            answers={data[3][this.state.language][this.state.course]["answers"]}
                            correct={data[3][this.state.language][this.state.course]["correct-answers"]}
                            course={this.state.course}
                            finishedSection={parseInt(this.state.section)}
                            finishedIten={this.state.item}
                            onItemSelected={this.itemSelected}
                            school={this.state.school}
                            doIt={this.upDateTest}
                            mytest={this.state.myTest}
                            score={this.state.score}
                            close={this.closeTest}
                            minus={this.state.last ? 0 : 1}
                            type={this.state.finished}
                            exam={this.state.exam}
                            setExam={this.setExam}
                            loadView={this.setLoading}
                            isExam={true}
                            removeLoad={this.removeLoading}
                            images={data[3][this.state.language][this.state.course]["images"] != undefined ? data[3][this.state.language][this.state.course]["images"] : "null"}
                        />: <Test
                            test={this.state.test}
                            questions={data[2][this.state.language][this.state.course][this.state.section]["questions"]}
                            answers={data[2][this.state.language][this.state.course][this.state.section]["answers"]}
                            correct={data[2][this.state.language][this.state.course][this.state.section]["correct-answers"]}
                            course={this.state.course}
                            isExam={false}
                            finishedSection={parseInt(this.state.section)}
                            finishedIten={this.state.item}
                            onItemSelected={this.itemSelected}
                            school={this.state.school}
                            doIt={this.upDateTest}
                            mytest={this.state.myTest}
                            score={this.state.score}
                            close={this.closeTest}
                            loadView={this.setLoading}
                            removeLoad={this.removeLoading}
                            minus={this.state.last ? 0 : 1}
                            type={this.state.finished}
                            images={data[2][this.state.language][this.state.course][this.state.section]["images"] != undefined ? data[2][this.state.language][this.state.course][this.state.section ]["images"] : "null"}
                        />)
                    }
                </div>
            )
        }
    }

    errorShow = (e) => {
        this.setState({error: "null"});
        Alert.error(errors["auth/network-request-failed"], {
            position: 'bottom-right',
            effect: 'slide',
            timeout: 3000
        });
    }
    achiveShow = (e) => {
        console.log("SHOWOWOOWOWO")
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

}
// style={{borderLeft: '10px solid ' + homework_gradients[i]}}