import React, { useState, useEffect, useCallback } from "react";
import axios from 'axios';
import scss from './recordList.module.scss'
import Button from 'react-bootstrap/Button'
import ToggleButton from 'react-bootstrap/ToggleButton'
import { Link } from "react-router-dom";
import Pagination from 'react-bootstrap/Pagination'
import PageItem from 'react-bootstrap/PageItem'

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
	const [currentPage, setCurrentPage] = useState(1)

	useEffect(()=>{
    let options = {
      page_size:5,
    }
    axios
      .get("http://localhost:5000/record/",{params:options})
      .then((response) => {
        setRecords(response.data)
      })
	},[])

  const handlePrevClick = () => {
    if(currentPage === 1) return;
    getNewPage('prev')
  }
  const handleNextClick = () => {
    getNewPage('next')
  }
  //this method fetches previous or next page
  const getNewPage = (direction) => {
    // if(currentPage === 1) return;
    let last_id;
    if(direction === 'next') last_id = records[records.length - 1]._id 
    else last_id = records[0]._id
    
    let options = {
      page_size:5,
      last_id,
      direction
    }
    axios
      .get("http://localhost:5000/record/",{params:options})
      .then((response) => {
        if(response.data.length <= 0) return;
        setRecords(response.data)
        let newNum = currentPage;
        if(direction === 'next') newNum++
        else newNum--
        setCurrentPage(newNum)
      })
  }

  // This method selects rows
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
      <div className={scss.actionButtonsTop}>
        <span>{`Selected Rows: ${selectedRows.length}`}</span>
        { selectedRows.length > 0 &&
          <>
            <Button variant="primary" onClick={deleteMultiple} size={'sm'}> Delete Selected </Button>
            <Button variant="primary" onClick={undeleteMultiple} size={'sm'}> unDelete Selected </Button>
          </>
        }
      </div>
			<div className={scss.tableContainer}>
        <table className={`${scss.empTable} table table-striped`} style={{ marginBottom: 48, }}>
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
      </div>
      <div className={scss.pagination}>
        <Pagination>
          {/* <Pagination.First /> */}
          <Pagination.Prev onClick={handlePrevClick}/>
          {/* <Pagination.Item>{1}</Pagination.Item>
          <Pagination.Ellipsis />

          <Pagination.Item>{10}</Pagination.Item>
          <Pagination.Item>{11}</Pagination.Item> */}
          <Pagination.Item active>{currentPage}</Pagination.Item>
          {/* <Pagination.Item>{13}</Pagination.Item>
          <Pagination.Item disabled>{14}</Pagination.Item>

          <Pagination.Ellipsis />
          <Pagination.Item>{20}</Pagination.Item> */}
          <Pagination.Next onClick={handleNextClick}/>
          {/* <Pagination.Last /> */}
        </Pagination>
      </div>
		</div>
	)
}

export default RecordList