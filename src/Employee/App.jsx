import React, { useState, useEffect } from 'react';
import { FaDownload } from 'react-icons/fa';
import jsPDF from 'jspdf';
import 'jspdf-autotable';
import './App.css';
import AlertComponent from './AlertComponent';

const App = () => {
  const [data, setData] = useState([]);
  const [filterdata, setfilterdata] = useState([]);
  const [employeeName, setEmployeeName] = useState("");
  const [employeeNumber, setEmployeeNumber] = useState("");
  const [employeeAge, setEmployeeAge] = useState("");
  const [employeegender, setemployeegender] = useState("");
  const [displayStyle, setDisplayStyle] = useState("list");
  const [currentPage, setCurrentPage] = useState(1);
  const [recordsPerPage] = useState(10);
  const [searching, setsearching] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: "" });

  useEffect(() => {
    const storedData = localStorage.getItem("uploadedJson");
    if (storedData) {
      const parsedData = JSON.parse(storedData);
      setData(parsedData);
      setfilterdata(parsedData);
    }
  }, []);

  // const FileUpload = (event) => {
  //   const file = event.target.files[0];
  //   if (file) {
  //     const fileSizeMB = file.size / (1024 * 1024);
  //     if (fileSizeMB > 5) {
  //       setAlert({ show: true, message: "File size should be less than 5 MB" });
  //       return;
  //     }

  //     const fileExtension = file.name.split(".").pop().toLowerCase();
  //     if (fileExtension !== "json") {
  //       setAlert({ show: true, message: "Please upload a valid JSON file" });
  //       return;
  //     }

  //     const reader = new FileReader();
  //     reader.onload = (e) => {
  //       try {
  //         const jsonData = JSON.parse(e.target.result);
  //         setData(jsonData);
  //         setfilterdata(jsonData);
  //         localStorage.setItem("uploadedJson", JSON.stringify(jsonData));
  //         setAlert({ show: true, message: "File uploaded and data loaded successfully" });
  //       } catch (error) {
  //         setAlert({ show: true, message: "Invalid JSON file" });
  //       }
  //     };
  //     reader.readAsText(file);
  //   }
  // };

  const FileUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const fileSizeMB = file.size / (1024 * 1024);
      if (fileSizeMB >=  5) {
        setAlert({ show: true, message: "File size should be less than 5 MB" });
        return;
      }
  
      const fileExtension = file.name.split(".").pop().toLowerCase();
      if (fileExtension !== "json") {
        setAlert({ show: true, message: "Please upload a valid JSON file" });
        return;
      }
  
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const jsonData = JSON.parse(e.target.result);
          setData(jsonData);
          setfilterdata(jsonData);
          localStorage.setItem("uploadedJson", JSON.stringify(jsonData)); // This will overwrite the existing local storage data
          setAlert({ show: true, message: "File uploaded and data loaded successfully" });
        } catch (error) {
          setAlert({ show: true, message: "Invalid JSON file" });
        }
      };
      reader.readAsText(file);
    }
  };
  

  const search = () => {
    if (!employeeName && !employeeNumber && !employeeAge && !employeegender) {
      setfilterdata([]);
      setsearching(true);
      setCurrentPage(1);
      return;
    }
    const filtered = data.filter((record) => {
      return (
        (employeeName === "" || record.name.toLowerCase().includes(employeeName.toLowerCase())) &&
        (employeeNumber === "" || record.number.toLowerCase().includes(employeeNumber.toLowerCase())) &&
        (employeegender === "" || record.gender.toLowerCase() === employeegender.toLowerCase()) &&
        (employeeAge === "" || record.age.toString().includes(employeeAge))
      );
    });
    setfilterdata(filtered);
    setsearching(true);
    setCurrentPage(1);
  };

  const ChangeName = (event) => setEmployeeName(event.target.value);
  const ChangeNumber = (event) => setEmployeeNumber(event.target.value);
  const ChangeAge = (event) => setEmployeeAge(event.target.value);
  const Changegender = (event) => setemployeegender(event.target.value);

  const toggleDisplayStyle = () => setDisplayStyle(displayStyle === "list" ? "card" : "list");

  function KeyDown(event) {
    if (event.keyCode === 13) 
    search();
  }

  const clearAll = () => {
    setEmployeeName("");
    setEmployeeNumber("");
    setEmployeeAge("");
    setemployeegender("");
    setfilterdata(data);
    setsearching(false);
    setCurrentPage(1);
  };

  const indexOfLastRecord = currentPage * recordsPerPage;
  const indexOfFirstRecord = indexOfLastRecord - recordsPerPage;
  const currentRecords = filterdata.slice(indexOfFirstRecord, indexOfLastRecord);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(filterdata.length / recordsPerPage); i++) {
    pageNumbers.push(i);
  }

  const downloadPDF = () => {
    const doc = new jsPDF();
    doc.text("Employee Records", 14, 16);
    doc.autoTable({
      head: [['ID', 'Name', 'Number', 'State', 'Gender', 'Age']],
      body: filterdata.map(record => [
        record.id,
        record.name,
        record.number,
        record.state,
        record.gender,
        record.age
      ]),
      startY: 22
    });
    doc.save('employee_records.pdf');
  };

  return (
    <div>
      <AlertComponent
        show={alert.show}
        message={alert.message}
        onHide={() => setAlert({ ...alert, show: false })}
      />

      <h1>Employee Records</h1>
      <hr
        style={{
          background: "black",
          color: "black",
          borderColor: "black",
          height: "2px",
        }}
      />
      <div style={{ border: "1px solid black", padding: "10px", width: "80%" }}>
        <h3>Browse JSON Files</h3>
        <div className="upload-section" >
          <input type="file" accept=".json" onChange={FileUpload} />
        </div>
      </div>
      
      <div className="search-bar">
        <div className="search-input">
          <label htmlFor="name">Name:</label>
          <input
            type="text"
            value={employeeName}
            onChange={ChangeName}
            placeholder="Employee Name"
            onKeyDown={KeyDown}
          />
        </div>
        <div className="search-input">
          <label htmlFor="number">Number:</label>
          <input
            type="text"
            value={employeeNumber}
            onChange={ChangeNumber}
            placeholder="Employee Number"
            onKeyDown={KeyDown}
          />
        </div>
        <div className="search-input">
          <label htmlFor="age">Age:</label>
          <input
            type="text"
            value={employeeAge}
            onChange={ChangeAge}
            placeholder="Employee Age"
            onKeyDown={KeyDown}
          />
        </div>
        <div className="search-input">
          <label htmlFor="gender">Gender:</label>
          <select value={employeegender} onChange={Changegender}>
            <option value="">Select Gender</option>
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>
        <div className="search-buttons">
          <button className="btn btn-outline-primary" onClick={search}>
            Search
          </button>
          <button className="btn btn-outline-danger" onClick={clearAll}>
            Clear All
          </button>
          {searching && (
            <button className="btn btn-outline-success" onClick={downloadPDF} title="Download PDF">
            <FaDownload />
          </button>
            // <button className="btn btn-outline-success" onClick={downloadPDF}>
            //   Download PDF
            // </button>
          )}
        </div>
      </div>
      <button className="btn btn-outline-secondary" onClick={toggleDisplayStyle}>
        Toggle to {displayStyle === "list" ? "Card" : "List"} View
      </button>
      {searching && (
        <>
          {displayStyle === "list" ? (
            <table className="list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Number</th>
                  <th>State</th>
                  <th>Gender</th>
                  <th>Age</th>
                </tr>
              </thead>
              <tbody>
                {currentRecords.length > 0 ? (
                  currentRecords.map((record) => (
                    <tr key={record.id}>
                      <td>{record.id}</td>
                      <td>{record.name}</td>
                      <td>{record.number}</td>
                      <td>{record.state}</td>
                      <td>{record.gender}</td>
                      <td>{record.age}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6">No Available Data</td>
                  </tr>
                )}
              </tbody>
            </table>
          ) : (
            <div className="card-container">
              {currentRecords.length > 0 ? (
                currentRecords.map((record) => (
                  <div key={record.id} className="card">
                    <h3>{record.name}</h3>
                    <p>ID: {record.id}</p>
                    <p>Number: {record.number}</p>
                    <p>State: {record.state}</p>
                    <p>Gender: {record.gender}</p>
                    <p>Age: {record.age}</p>
                  </div>
                ))
              ) : (
                <p>No Available Data</p>
              )}
            </div>
          )}
          <div className="pagination">
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={currentPage === number ? "active" : ""}
              >
                {number}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default App;

