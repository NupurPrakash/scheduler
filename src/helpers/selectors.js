export function getAppointmentsForDay(state, day) {
  //filter through the days
  const interviewDay = state.days.filter(providedDay => 
    providedDay.name === day
  )
  if(interviewDay.length === 0) {
    return [];
  }
  //loop through the appointments
  let appointmentBooked = interviewDay[0].appointments.map(id => 
    state.appointments[id]
  )
  return appointmentBooked;
}

export function getInterview(state, interview) {
  
  if(!interview) {
    return null;
  }
  let newInterview = {
    student: interview.student,
    interviewer : state.interviewers[interview.interviewer]
   }
  return newInterview;
}

export function getInterviewersForDay(state, day) {
  const interviewDay = state.days.filter(providedDay => 
    providedDay.name === day
  )
  if(interviewDay.length === 0 || state.days.length === 0) {
    return [];
  }
  let interviewersBooked = interviewDay[0].interviewers.map(id => 
    state.interviewers[id]
  )
  return interviewersBooked;
}
  
  
