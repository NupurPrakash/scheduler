import React from "react";
import axios from "axios";
import { render, cleanup, waitForElement, getByText, prettyDOM, getAllByTestId, getByAltText, getByPlaceholderText, queryByText, queryByAltText, getAllByText, getByDisplayValue, wait } from "@testing-library/react";
import { fireEvent } from "@testing-library/react/dist";
import Application from "components/Application";

afterEach(cleanup);

describe("Application", () => {
  it("defaults to Monday and changes the schedule when a new day is selected", async() => {
    const { getByText } = render(<Application />);
    await waitForElement(() => getByText("Monday"))
    fireEvent.click(getByText("Tuesday"));
    expect(getByText("Leopold Silvers")).toBeInTheDocument();  
  });

  it("loads data, books an interview and reduces the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointments = getAllByTestId(container, "appointment");
    const appointment = appointments[0];

    fireEvent.click(getByAltText(appointment, "Add"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Lydia Miller-Jones" }
    });
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    
    fireEvent.click(getByText(appointment, "Save"));
    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() => getByText(appointment, "Lydia Miller-Jones"));

    const day =  getAllByTestId(container, "day").find(day =>
      queryByText(day, "Monday")
    );
    expect(getByText(day, "no spots remaining")).toBeInTheDocument();
    debug();
  });

  it("loads data, cancels an interview and increases the spots remaining for Monday by 1", async () => {
    const { container, debug } = render(<Application />);
    await waitForElement(() => getByText(container, "Archie Cohen"));
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"))

    fireEvent.click(queryByAltText(appointment, "Delete"))

   expect(getByText(appointment, "Delete the appointment?")).toBeInTheDocument();

    fireEvent.click(queryByText(appointment, "Confirm"));
    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() => getByAltText(appointment, "Add"));

    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday"))
    expect(getByText(day, "2 spots remaining")).toBeInTheDocument()
   debug();
    console.log(prettyDOM(appointment))

  });

  it("loads data, edits an interview and keeps the spots remaining for Monday the same", async() => {
    //1. Render the application
    const { container, debug } = render(<Application />)
    //2. Wait until the text "Archie Cohen is displayed
    await waitForElement(() => getByText(container, "Archie Cohen"));
    //3. Click the edit button on the booked appointment
    const appointment = getAllByTestId(container, "appointment").find(appointment => queryByText(appointment, "Archie Cohen"))
    fireEvent.click(queryByAltText(appointment, "Edit"));
    //4. Show the page
    expect(getByDisplayValue(appointment, "Archie Cohen"))
    //5. Change student name
    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Nupur"}
    })
    //6. Change/Click interviewer name 
    fireEvent.click(getByAltText(appointment, "Sylvia Palmer"));
    //7. Click save button
    fireEvent.click(getByText(appointment, "Save"));
    //8. Check that the element with the text Saving is displayed
    expect(getByText(appointment, "Saving")).toBeInTheDocument();
    //9. Wait until the application is loaded
    await waitForElement(() => getByText(appointment, "Nupur"));
    //10. Check that the spot number has not changed
    const day = getAllByTestId(container, "day").find(day => queryByText(day, "Monday")) 
    expect(getByText(day, "1 spot remaining")).toBeInTheDocument();
    debug();

  })

  it("shows the save error when failing to save an appointment", async () => {
    axios.put.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Edit"));

    expect(getByDisplayValue(appointment, "Archie Cohen"));

    fireEvent.change(getByPlaceholderText(appointment, /enter student name/i), {
      target: { value: "Nupur" }
    });

    fireEvent.click(getByText(appointment, "Save"));

    expect(getByText(appointment, "Saving")).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, "Error while saving the Appointment")
    );

    expect(
      getByText(appointment, "Error while saving the Appointment")
    ).toBeInTheDocument();

    debug();
  });



  it("shows the delete error when failing to delete an existing appointment", async () => {
    axios.delete.mockRejectedValueOnce();
    const { container, debug } = render(<Application />);

    await waitForElement(() => getByText(container, "Archie Cohen"));

    const appointment = getAllByTestId(
      container,
      "appointment"
    ).find(appointment => queryByText(appointment, "Archie Cohen"));

    fireEvent.click(queryByAltText(appointment, "Delete"));

    fireEvent.click(getByText(appointment, "Confirm"));

    expect(getByText(appointment, "Deleting")).toBeInTheDocument();

    await waitForElement(() =>
      getByText(appointment, "Error while deleting Appointment")
    );

    expect(
      getByText(appointment, "Error while deleting Appointment")
    ).toBeInTheDocument();

    debug();
  }); 
})

 


