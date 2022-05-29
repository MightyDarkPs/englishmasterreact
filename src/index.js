import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import Account from './Account';
import Admin from './Admin'
import Course from './Course';
import * as serviceWorker from './serviceWorker';
import * as firebase from 'firebase';
import Teacher from './Teacher'
import NotFound from './Notfound'
import Finished from './comp/Finished'
import Coming from './comp/Coming'
import Certificates from './code/Certificates'

import { BrowserRouter, Switch, Route } from 'react-router-dom';

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

    firebase.initializeApp(firebaseConfig);

ReactDOM.render(<BrowserRouter>
    <Switch>
       <Route exact path='/' component={App}/>
       <Route path='/account' component={Account}/>
       <Route path='/course/:item' component={Course}/>
       <Route path='/admin' component={Admin}/>
       <Route path='/teacher' component={Teacher}/>
       <Route path='/coming' component={Coming}/>
       <Route path='/certificates' component={Certificates}/>
       <Route path='/finished/:course' component={Finished}/>
       <Route path='*' component={NotFound}/>
    </Switch>
  </BrowserRouter>, document.getElementById('root'));
/*
<Switch>
       <Route exact path='/' component={App}/>
       <Route path='/account' component={Account}/>
       <Route path='/course/:item' component={Course}/>
       <Route path='/admin' component={Admin}/>
       <Route path='/teacher' component={Teacher}/>
       <Route path='/coming' component={Coming}/>
       <Route path='/certificates' component={Certificates}/>
       <Route path='/finished/:course' component={Finished}/>
       <Route path='*' component={NotFound}/>
    </Switch>
*/
// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
