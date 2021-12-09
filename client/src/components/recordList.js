import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import scss from './recordList.module.scss'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { Link } from "react-router-dom";
import useForceUpdate from "../hooks/forceupdate";

// /updatemultiple
// Record Row
const Record = ({isSelected, selectRow, record, deleteRecord}) => {
  const handleToggle = () => {
    selectRow(record._id)
  }

  return (
    <tr className={[record.deleted ? scss.red : null]}>
      <td>
        <ToggleButton
          className="mb-2"
          id="toggle-check"
          type="checkbox"
          variant={isSelected ? "outline-primary" : "outline-secondary"}
          checked={isSelected}
          value="1"
          onClick={handleToggle}
        >
        </ToggleButton>
      </td>
      <td>{record.person_name}</td>
      <td>{record.person_position}</td>
      <td>{record.person_level}</td>
      <td>{record.person_phone}</td>
      <td>
        <Link to={"/edit/" + record._id}>
          <Button className={scss.shadow} variant="primary" size="sm">
            Edit
          </Button>
        </Link>
        
        <Button 
          className={scss.overrideBtn} 
          onClick={() => {
            deleteRecord(record._id);
          }}
          variant="outline-dark" size="sm"
        >
          Delete
        </Button>
      </td>
    </tr>
  )
}

// Record List

const RecordList = () => {
	const [records, setRecords] = useState([])
	const [selectedRows, setSelectedRows] = useState([])

	useEffect(()=>{
    axios
      .get("http://localhost:5000/record/")
      .then((response) => {
        setRecords(response.data)
      })
	},[])

	const selectRow = (recordId) => {
    if(selectedRows.includes(recordId)) {
      setSelectedRows(oldVals => {
        return oldVals.filter(e => e !== recordId)
      })
    } else {
      let updatedArr = [...selectedRows]
      updatedArr.push(recordId)
      setSelectedRows(updatedArr)
    }
  }

  // This method will delete a record
  const deleteRecord = (id) => {
    axios.delete("http://localhost:5000/" + id).then((response) => {
      console.log(response.data);
      setRecords(oldRecs => {
        return oldRecs.map(rec => {
          if(selectedRows.includes(rec._id)) {
            rec.deleted = true;
          }
          return rec;
        })
      })
    });
  }
  const deleteMultiple = () => {
    if(selectedRows.length > 0) {
      axios.post("http://localhost:5000/updatemultiple",{ids:selectedRows,delete:true}).then((response) => {
        setRecords(oldRecs => {
          return oldRecs.map(rec => {
            if(selectedRows.includes(rec._id)) {
              rec.deleted = true;
            }
            return rec;
          })
        })
        setSelectedRows([])
      });
    }
  }
  const undeleteMultiple = () => {
    if(selectedRows.length > 0) {
      axios.post("http://localhost:5000/updatemultiple",{ids:selectedRows,delete:false}).then((response) => {
        setRecords(oldRecs => {
          return oldRecs.map(rec => {
            if(selectedRows.includes(rec._id)) {
              rec.deleted = false;
            }
            return rec;
          })
        })
        setSelectedRows([])
      });
    }
  }
	// This method will map out the users on the table
  const buildRecordList = () => {
    return records.map((currentrecord) => {
      return (
        <Record
          isSelected={selectedRows.includes(currentrecord._id)}
          selectRow={selectRow}
          record={currentrecord}
          deleteRecord={deleteRecord}
          key={currentrecord._id}
        />
      );
    });
  }
	return (
		<div className={scss.root}>
			<h3>Record List</h3>
			<table className="table table-striped" style={{ marginTop: 20 }}>
				<thead>
					<tr>
            <th></th>
						<th>Name</th>
						<th>Position</th>
						<th>Level</th>
						<th>Phone</th>
						<th>Action</th>
					</tr>
				</thead>
				<tbody>{buildRecordList()}</tbody>
			</table>
      { selectedRows.length > 0 &&
        <div>
          <Button variant="primary" onClick={deleteMultiple}> Delete Selected </Button>
          <Button variant="primary" onClick={undeleteMultiple}> unDelete Selected </Button>
        </div>
      }
		</div>
	)
}

export default RecordList