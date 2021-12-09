import React, { useState } from "react";
import axios from 'axios';

const Create = () => {
    const [person_name, setName] = useState('')
    const [person_position, setPosition] = useState('')
    const [person_level, setLevel] = useState('')
    const [person_phone, setPhone] = useState('')

    const onChangeName = (e) => {
        setName(e.target.value)
    }
    const onChangePosition = (e) => {
        setPosition(e.target.value)
    }
    const onChangeLevel = (e) => {
        setLevel(e.target.value)
    }
    const onChangePhone = (e) => {
        setPhone(e.target.value)
    }


    const onSubmit = (e) => {
        e.preventDefault()
        if(person_phone.length !== 10) return; 

        // When post request is sent to the create url, axios will add a new record(newperson) to the database.
        const newperson = {
            person_name: person_name,
            person_position: person_position,
            person_level: person_level,
            person_phone: person_phone,
        };
        
        axios
          .post("http://localhost:5000/record/add", newperson)
          .then((res) => {
              if(typeof(res.data) === 'string') alert(res.data)
              else clearFields()
          })
          .catch((err)=>console.log('SOMETHING WENT WRONG', err));
    }

    const clearFields = () => {
        setName('')
        setPosition('')
        setLevel('')
        setPhone('')
    }

    return(
        <div style={{ marginTop: 20 }}>
          <h3>Create New Record</h3>
          <form onSubmit={onSubmit}>
            <div className="form-group">
              <label>Name of the person: </label>
              <input
                type="text"
                className="form-control"
                value={person_name}
                onChange={onChangeName}
              />
            </div>
            <div className="form-group">
              <label>Person's position: </label>
              <input
                type="text"
                className="form-control"
                value={person_position}
                onChange={onChangePosition}
              />
            </div>
            <div className="form-group">
              <label>Person's phone: </label>
              <input
                type="text"
                className="form-control"
                value={person_phone}
                onChange={onChangePhone}
              />
            </div>
            <div className="form-group">
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priorityOptions"
                  id="priorityLow"
                  value="Intern"
                  checked={person_level === "Intern"}
                  onChange={onChangeLevel}
                />
                <label className="form-check-label">Intern</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priorityOptions"
                  id="priorityMedium"
                  value="Junior"
                  checked={person_level === "Junior"}
                  onChange={onChangeLevel}
                />
                <label className="form-check-label">Junior</label>
              </div>
              <div className="form-check form-check-inline">
                <input
                  className="form-check-input"
                  type="radio"
                  name="priorityOptions"
                  id="priorityHigh"
                  value="Senior"
                  checked={person_level === "Senior"}
                  onChange={onChangeLevel}
                />
                <label className="form-check-label">Senior</label>
              </div>
            </div>
            <div className="form-group">
              <input
                type="submit"
                value="Create person"
                className="btn btn-primary"
              />
            </div>
          </form>
        </div>
    )
}

export default Create;