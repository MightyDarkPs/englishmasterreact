import React from 'react';
import './Another.css';
import Bounce from 'react-reveal/Bounce';
import ScrollTrigger from "react-scroll-trigger";
import data from '../data.json'
const container = {
	"01": {
		"info": "Big library. In order to have best educational process we use only those sources that were tested and can be the most helpful and practical. Our big library can be accessed for everyone who bought our course.",
		"img": "https://www.etopian.com/wp-content/uploads/icon_python.png",
		"count": "1",
		"gradient": "linear-gradient(135deg, #B0FFC2, #80BB75)"
	},
	"02": {
		"info": "Flexibility. We can easily fit into your timetable due to the fact that we try to create our schedule according to the wishes of our students. Our students can have both morning or evening lessons at each day except Sunday.",
		"img" : "https://static1.squarespace.com/static/555b7fd5e4b0c7c58cfd6cf4/555cad58e4b0c3a1eda38033/5703d2d601dbae6afe70c2bd/1492701794101/c-img.png?format=1000w",
		"count": "1",
		"gradient": "linear-gradient(135deg, #C18AFC, #D6B3FC)"
	},
	"03": { 
		"info" : "Exciting lessons. Teachers of English Master educational center created there new educational program which includes entertaining excercises and has higher ability to catch students attention.",
		"img": "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQWVRb1YeSx9MxmTiW-plxUCvwS8SwmNLJkJw0x37iv2QKEFvf7",
		"count": "1",
		"gradient": "linear-gradient(135deg, #F0CAA1, #FFD154)"
	}
}




export default class Mycourse extends React.Component {
  
	constructor (props) {
		super(props);
		this.state = {
			index: 0,
			offset: 0, animate: false
		}
	}

	  componentDidMount() {
	    window.addEventListener('scroll', this.parallaxShift);
	  }
	  componentWillUnmount() {
	    window.removeEventListener('scroll', this.parallaxShift);
	  }
	 parallaxShift = () => {
	    this.setState({
	    	offset: window.pageYOffset
	    })
  	 };

	render() {
		return (

				<div className="my_course">
					<label className="my_course_title">Our <br/><br/><span>features</span></label>
					<ScrollTrigger onEnter={()=>this.setState({animate: true})}>
						<div className="course_container">
							{Object.keys(container).map((key, index) => 
								<div style={{background: container[key]["gradient"]}} className={this.state.animate ? "mycourse" : "none"} key={index}>
									<div className="course_row">
										<label>{key}</label>
									</div>
									<p>{container[key]["info"]}</p>
								</div>
							)}
						</div>
					</ScrollTrigger>
				</div>

		)
	}
}