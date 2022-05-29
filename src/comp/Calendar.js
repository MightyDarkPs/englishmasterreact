import React from 'react'
import './Another.css'
import firebase from 'firebase'

export default class Calendar extends React.Component {
    constructor(props){
        super(props);
        this.state = {
            loading: true,
            data: {}, item: null
        }
    }
    componentDidMount() {
        this.loadData()
    }
    loadData = () => {
        let self = this
        firebase.database().ref("booking").once("value", function(d) {
            if (d.hasChildren()) {
                console.log(self.state.data)
                self.setState({data: d.val()})
            }
        })
        self.setState({loading: false})
    }
    warn = () => {
        return <div className="loading">Loading ...</div>
    }
    content = () => {
        console.log(this.state.data)
        return (
            <div className="calendar-content">
                {Object.keys(this.state.data).map((id, index) => 
                    <div className="calendar-element">
                        <div className="calendar-date">
                            <caption>{this.state.data[id]["date"].split("-")[2]}</caption>
                            <label>{<label>{this.state.data[id]["date"].split("-")[1]}-{this.state.data[id]["date"].split("-")[0]}</label>}</label>
                        </div>
                        <div className="calendar-content">
                            <label className="c-title">{this.state.data[id]["title"]}</label>
                            <label className="c-des">{this.state.data[id]["des"]}</label>
                            <button className={this.state.item != id ? null : "none"} onClick={()=>this.setState({item: id})}>View description</button>
                            <p className={this.state.item == id ? null : "none"}>
                                {this.state.data[id]["text"]}
                            </p>
                        </div>
                    </div>    
                )}
            </div>
        )
    }
    render() {
        return (
            <div className="Calendar">
                <h1>Posts</h1>
                {this.state.loading ? this.warn() : this.content() }
            </div>
        )
    }
}