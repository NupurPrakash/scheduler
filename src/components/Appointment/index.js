import React from 'react';
import "components/Appointment/styles.scss";
import Header from "./Header";
import Show from "./Show";
import Empty from "./Empty";
import { useVisualMode } from "hooks/useVisualMode";
import Form from './Form';
import Status from "./Status";
import Confirm from './Confirm';
import Error from './Error';

const EMPTY = "EMPTY";
const SHOW = "SHOW";
const CREATE = "CREATE";
const SAVING = "SAVING";
const DELETING = "DELETING";
const CONFIRM = "CONFIRM";
const EDIT = "EDIT";
const ERROR_DELETE = "ERROR_DELETE";
const ERROR_SAVE = "ERROR_SAVE";

export default function Appointment(props) {
  const { mode, transition, back } = useVisualMode(
    props.interview ? SHOW : EMPTY
  )
  //save function that would transition to saving and if booked an interview transition to show page
  const save  = (name, interviewer) => {
    const interview = {
      student: name,
      interviewer : interviewer
    };
    transition(SAVING)
       
    props.bookInterview(props.id, interview)
    .then((res)=>
      transition(SHOW)
    )
    .catch((err) => transition(ERROR_SAVE, true))
  };
  //delete function that would transition to Empty page after deleting an interview
  const deletingInterview = () => {
    transition(DELETING, true)
    props.cancelInterview(props.id)
    .then((res) =>
      transition(EMPTY)
    )
    .catch((err) => transition(ERROR_DELETE, true)) 
  }

  return (
    <article className="appointment" data-testid="appointment">
      <Header time={props.time} />
      {mode === EMPTY && <Empty onAdd={() => transition(CREATE)} />}
      {mode === SHOW && (
        <Show 
          student = {props.interview.student}
          interviewer = {props.interview.interviewer}
          onDelete={() => transition(CONFIRM)}
          onEdit={() => transition(EDIT)}
        />
    
      )}
      {mode === CREATE && (
        <Form
          interviewers={props.interviewers}
          onCancel = {back}
          onSave = {save}
        />
      )}
      {mode === SAVING && (
        <Status
          message="Saving"
        />
      )}
      {mode === DELETING && (
        <Status
          message="Deleting"
        />
      )}
      
      {mode === CONFIRM && (
        <Confirm
          message="Are you sure you want to delete?"
          onCancel={back}
          onConfirm={deletingInterview}
        />  
        )     
      }

      {mode === EDIT && (
        <Form
          name={props.interview.student}
          interviewer={props.interview.interviewer.id}
          interviewers={props.interviewers}
          onCancel={back}
          onSave={save}
        />
      )
      }

      {mode === ERROR_DELETE && (
        <Error
          message="Error while deleting Appointment"
          onClose={back}
        />
      )
      }
      {mode === ERROR_SAVE && (
        <Error
          message="Error while saving the Appointment"
          onClose={back}
        />
      )
      }         
    </article>
  )
}