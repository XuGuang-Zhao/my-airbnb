import React, { useReducer } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import reducer from './store/reducer';
import { context } from './store/context';
import AppHeader from './components/Header';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import ListingList from './pages/ListingList';
import ListingCreate from './pages/ListingCreate';
import ListingEdit from './pages/ListingEdit';
import Booking from './pages/Booking';
import BookingRequestCheckForUser from './pages/BookingRequestCheckForUser';
import BookingRequestManagementForHost from './pages/BookingRequestManagementForHost';
import ListingFileUpload from './pages/ListingFileUpload';
import ProfileGraph from './pages/ProfileGraph';

const initValue = {
  token: localStorage.getItem('token'),
};

const AppRouter = () => {
  const [state, dispatch] = useReducer(reducer, initValue);
  return (
    <context.Provider value={{ state, dispatch }}>
      <Router>
        <AppHeader/>
        <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>
            <Route exact path="/listing-list" component={ListingList}/>
            <Route exact path="/listing-file-upload" component={ListingFileUpload}/>
            <Route exact path="/listing-create" component={ListingCreate}/>
            <Route exact path="/listing-edit/:listId?" component={ListingEdit}/>
            <Route exact path="/listing-profit-graph" component={ProfileGraph}/>
            <Route exact path="/booking/:listId?" component={Booking}/>
            <Route exact path="/booking-request-check" component={BookingRequestCheckForUser}/>
            <Route exact path="/booking-request-management" component={BookingRequestManagementForHost}/>
        </Switch>
      </Router>
    </context.Provider>
  );
}

export default AppRouter;
