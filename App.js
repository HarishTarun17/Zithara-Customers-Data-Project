import React, { useState, useEffect } from 'react';
import './index.css'

function App() {
  const [customers, setCustomers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [customersPerPage] = useState(20);
  const [sortBy, setSortBy] = useState(null);
  const [sortDirection, setSortDirection] = useState('asc');


  useEffect(() => {
    // Fetch data from backend when component mounts
    fetchCustomers();
  }, []);


  const fetchCustomers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/customers'); 
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      const customersWithSerial = data.map((customer, index) => ({
        ...customer,
        serial: index + 1
      }));
      setCustomers(customersWithSerial);
    } catch (error) {
      console.error('Error fetching data:', error.message);
    }
  };


  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  const handleChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1); // Reset page to 1 when searching
  };

  const handleSort = (selectedSortBy) => {
    if (sortBy === selectedSortBy) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(selectedSortBy);
      setSortDirection('asc');
    }
  };


const sortedCustomers = [...customers]; // Copy the customers array
if (sortBy === 'date') {
  sortedCustomers.sort((a, b) => {
    const dateA = new Date(a.CREATED_AT.created_date);
    const dateB = new Date(b.CREATED_AT.created_date);
    return sortDirection === 'asc' ? dateA - dateB : dateB - dateA;
  });
} 
else if (sortBy === 'time') {
  sortedCustomers.sort((a, b) => {
    const timeA = a.CREATED_AT.created_time.split(':').map(Number);
    const timeB = b.CREATED_AT.created_time.split(':').map(Number);
    return sortDirection === 'asc' ? (timeA[0] * 3600 + timeA[1] * 60 + timeA[2]) - (timeB[0] * 3600 + timeB[1] * 60 + timeB[2]) : (timeB[0] * 3600 + timeB[1] * 60 + timeB[2]) - (timeA[0] * 3600 + timeA[1] * 60 + timeA[2]);
  });
}


  const filteredCustomers = sortedCustomers.filter(customer => {
    const customerName = customer.CUSTOMER_NAME ? customer.CUSTOMER_NAME.toLowerCase() : '';
    const location = customer.LOCATION ? customer.LOCATION.toLowerCase() : '';
    return customerName.includes(searchTerm.toLowerCase()) || location.includes(searchTerm.toLowerCase());
  });

  // Pagination
  const indexOfLastCustomer = currentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = filteredCustomers.slice(indexOfFirstCustomer, indexOfLastCustomer);


  return (
    <div className='container'>
      <h1>Customer's Data</h1>
      <input type="text" placeholder="Search by name or location" value={searchTerm} onChange={handleChange} />
      <div>
        <button onClick={() => handleSort('date')}>Sort by Date</button>
        <button onClick={() => handleSort('time')}>Sort by Time</button>
      </div>
      <table>
        <thead> 
          <tr>
            <th>SNO</th>
            <th>Name</th>
            <th>Age</th>
            <th>Phone</th>
            <th>Location</th>
            <th colSpan="2">Created_At </th>
          </tr>
          <tr>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th></th>
            <th>Date</th>
            <th>Time</th>
          </tr>
        </thead>
        <tbody>
          {currentCustomers.map(customer => (
            <tr key={customer.SNO}>
              <td>{customer.serial}</td>
              <td>{customer.CUSTOMER_NAME}</td>
              <td>{customer.AGE}</td>
              <td>{customer.PHONE_NO}</td>
              <td>{customer.LOCATION}</td>
              <td>{customer.CREATED_AT.created_date}</td> 
              <td>{customer.CREATED_AT.created_time}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Pagination
        customersPerPage={customersPerPage}
        totalCustomers={customers.length}
        paginate={paginate}
        currentPage={currentPage}
      />
    </div>
  );
}


function Pagination({ customersPerPage, totalCustomers, paginate, currentPage }) {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalCustomers / customersPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      <ul className='pagination'>
        {pageNumbers.map(number => (
          <li key={number} className={currentPage === number ? 'active' : ''}>
            <a onClick={() => paginate(number)} href='!#' className='page-link'>
              {number}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export default App;
