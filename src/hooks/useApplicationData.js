import { useEffect, useState } from "react";
import axios from "axios";

export default function useApplicationData() {

  const [state, setState] = useState({
    day:"Monday",
    days: [],
    appointments: {},
    interviewers: {}
  });

  const setDay = day => setState({ ...state, day });
  
  useEffect(() => {
    Promise.all([
      //get requests
      axios.get("/api/days"),
      axios.get("/api/appointments"),
      axios.get("/api/interviewers")
    ])
    .then((response) => {
      setState(prev => ({ ...prev, days:response[0].data, appointments: response[1].data, interviewers: response[2].data}))
    })
    .catch(err => console.log(err.message))
  },[])
  //to find the spots remaining to update in the page
  const spotsRemaining = (state, appointments) => {
    let theAppointments = [];
    //filtering through the days
    const theDays = state.days.filter(day => day.name === state.day);
    //looping through the appointments
    theDays[0].appointments.forEach((elm) => {
      theAppointments.push(appointments[elm])
    })
    let availableSpots = 0;
    theAppointments.forEach((obj) => {
      if(!obj.interview) {
      //increasing number of spots
        availableSpots++;
      }
      return availableSpots;
    })
    let newDays = [];
    state.days.forEach((obj) => {
      if(obj.name === state.day) {
        obj.spots = availableSpots;
        newDays.push(obj)
      } else {
      newDays.push(obj)
      }
    })
    return newDays;
  }
  //booking interview and updating appointment details as well as available spots
  const bookInterview = (id, interview) => {
    const appointment = {
      ...state.appointments[id],
      interview: { ...interview }
    };
    const appointments = {
      ...state.appointments,
      [id]: appointment
    };
   
    return axios.put(`/api/appointments/${id}`, appointment).then(()=>{
      setState({
        ...state, appointments,
        days:  spotsRemaining(state,appointments)
      })
    }) 
  };
  //cancelling interview and updating state as well as spots
  const cancelInterview = (id) => {
    const appointment = {
      ...state.appointments[id],
      interview : null
    }
    const appointments = {
      ...state.appointments,
      [id]: appointment
    }
 
    return axios.delete(`/api/appointments/${id}`,appointment)
    .then((res) => {
      setState({
        ...state, appointments, days: spotsRemaining(state, appointments)
      })
    })
  }

  return {
    state,
    setDay,
    bookInterview,
    cancelInterview
  }

}