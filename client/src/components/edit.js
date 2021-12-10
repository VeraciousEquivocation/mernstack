import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useNavigate, useParams } from "react-router-dom";

const Edit = (props) => {
	const [person_name,setName] = useState("")
	const [person_position,setPosition] = useState("")
	const [person_level,setLevel] = useState("")
	const [person_phone,setPhone] = useState("")
	 
  let navigate = useNavigate();

	// grab param :recordId
	let {recordId} = useParams();
	
	// This will get the record based on the id from the database.		
	useEffect(()=>{
		axios
			.get("http://localhost:5000/record/" + recordId)
			.then((response) => {
				setName(response.data.person_name)
				setPosition(response.data.person_position)
				setLevel(response.data.person_level)
				setPhone(response.data.person_phone)
			})
			.catch(function (error) {
				console.log(error);
			});
	},[])


  const onChangePersonName = (e) => {
    setName(e.target.value)
  }
 
  const onChangePersonPosition = (e) => {
    setPosition(e.target.value)
  }
 
  const onChangePersonLevel = (e) => {
    setLevel(e.target.value)
  }
  const onChangePersonPhone = (e) => {
    setLevel(e.target.value)
  }

	const onSubmit = (e) => {
		e.preventDefault()

		const updatedPerson = {
			person_name: person_name,
			person_position:person_position,
			person_level:person_level,
			person_phone:person_phone,
		}

		// send post request to backend
    axios
			.post(
				"http://localhost:5000/update/" + (recordId),
				updatedPerson
			)
			.then((res) => {
				console.log(res.data)
				navigate('/')
			})
			.catch(function (error) {
				if (error.response) {
					// Request made and server responded
					console.log(error.response.data);
					console.log(error.response.status);
					console.log(error.response.headers);
				} else if (error.request) {
					// The request was made but no response was received
					console.log(error.request);
				} else {
					// Something happened in setting up the request that triggered an Error
					console.log('Error', error.message);
				}
			
			});
	}

  return (
		<div>
			<h3 align="center">Update Record</h3>
			<form onSubmit={onSubmit}>
				<div className="form-group">
					<label>Person's Name: </label>
					<input
						type="text"
						className="form-control"
						value={person_name}
						onChange={onChangePersonName}
					/>
				</div>
				<div className="form-group">
					<label>Position: </label>
					<input
						type="text"
						className="form-control"
						value={person_position}
						onChange={onChangePersonPosition}
					/>
				</div>
				<div className="form-group">
					<label>Phone: </label>
					<input
						type="text"
						className="form-control"
						value={person_phone}
						onChange={onChangePersonPhone}
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
							onChange={onChangePersonLevel}
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
							onChange={onChangePersonLevel}
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
							onChange={onChangePersonLevel}
						/>
						<label className="form-check-label">Senior</label>
					</div>
				</div>
				<br />

				<div className="form-group">
					<input
						type="submit"
						value="Update Record"
						className="btn btn-primary"
					/>
				</div>
			</form>
		</div>
	)
}

export default Edit;