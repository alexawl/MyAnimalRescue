// import logo from './logo.svg';
import React from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Splash from './Splash';
import MenuInverted from './menus/Header'
import AdminMainContainer from './admin/AdminMainContainer'
import AdopterMainContainer from './adopter/AdopterMainContainer'
import ApplicationContainer from './adopter/ApplicationContainer'
import DogsContainer from './dogs/DogsContainer'
import FavesContainer from './dogs/FavesContainer'
import DogShow from './dogs/DogShow'

//App is wrapped in Route path="/" so "/" is established as base url--unsure how that might affect auth
class App extends React.Component {
  //might be able to make this a functional component

  componentDidMount() {
    fetch("http://localhost:6969/api/v1/dogs")
    .then(resp => resp.json())
    // .then(dogs => {
    //   this.setState({stateDogs: dogs})
    // })
    .then(dogs => {
      //this is how this function talks to redux. It has access to the function we wrote in mdp that calls dispatch to change the state store with the reducer
      this.props.fetchDogs(dogs)
      //if you want to have this control loading render
      //this.setState({loading: false})
    })
  }

  adminLogin = () => {}

  adopterLogin = () => {}

  adopterSignUp = () => {}

  render() {
    // console.log("APP PROPS", this.props)
    return (
      <div className="App">
        {/* Since Menu header is on every page, it can be outside of routes */}
        <MenuInverted />
        
        <Switch>
          <Route exact path="/" component={Splash} />
      
          <Route exact path="/admin" render={(routerProps)=><AdminMainContainer {...routerProps}/>}/>
          <Route path="/adopter/dogs/:id" render={(routerProps) => <DogShow {...routerProps}/>}/>
          <Route path="/adopter/dogs" component={DogsContainer}/>
          <Route path="/adopter/faves" component={FavesContainer}/>
          <Route path="/adopter/application" component={ApplicationContainer}/>
          <Route exact path ="/adopter" render={(routerProps) => <AdopterMainContainer {...routerProps}/>}/>

          {/* 404 */}
          <Route render={() => <img alt="404 Not Found" src="https://httpstatusdogs.com/img/404.jpg"></img>} />
      </Switch>
      
         
    </div>
    );
  }
}

function msp(state){
  //whatever object is returned from msp will be combined with this component's props 
  //reader/getter for store of state
  return state
  //probably won't want to return the entire store of state, so extract what you need aka shopping at the state store
  //return { likes: state.likes, things: state.things}
}

function mdp(dispatch) {
  //writer/setter to state
  //return functions that will be added to props, and then you can call onClick or wherever you want to trigger them to setState via redux dispatch/reducer
  //THINKING AHEAD my handleLogin functions will call this.props.login (or whatever I call it in the mdp return) to setState in store once I get the user authed on the back end

  //dispatch calls the reducer, which setsState. For every time you need to set global state, you need to set up a function that calls dipatch in the mpd object here (1:24:00 react + redux 042219)
  return {
    //eventually these functions will be abstracted to a different file
    like: () => {
      dispatch({type: "INCREMENT_LIKES"})
      //call this in the onClick for the like button onClock={props.like} since mdp automatically updates props with whatever you use here
    },
    fetchDogs: (dogs) => {
      dispatch({type: "FETCH_ALL_DOGS", payload: dogs})
    }
    //example below is from a controlled form that implicitly passes the event, which we then use to set the payload
    //can also pass arguments just like in other eventlisteners
    // handleChange: (event) => {
    //   dispatch({type: "INPUT_CHANGE", payload: event.target.value})
    // }
  }

}


//connect connects this component to the store
//takes 2 arguments: mapStateToProps & mapDispatchToProps
export default connect(msp, mdp)(App);

//want to test double auth:
//need routes
//need auth


