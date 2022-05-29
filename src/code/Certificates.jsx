import React from 'react';
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import 'firebase/auth';
import '../comp/Another.css'
//import domtoimage from 'dom-to-image';

export default class Certificated extends React.Component {
	constructor(props) {
	    super(props);
	   // this.canvasRef = React.createRef();
	}
	
	
	render () {
		return (
			<div className="my_canva" id="haha">
				<div className="canvas-inner">
        			<label className="canvas-name" id="canvas-name">{this.props.name[0] + " " + this.props.name[1]}</label>
        			<label className="canvas-course" id="canvas-course">Курс "{this.props.course}"</label>
        			<label className="canvas-level" id="canvas-level">уровень "{this.props.level}"</label>
        		</div>
        		<img className="certifateImg" src={require("../imgs/" + this.props.img + ".png")}/>
      		</div>
		)
	}
}