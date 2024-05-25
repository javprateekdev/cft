import React, { useState, useEffect } from 'react';
import axios from 'axios';
import moment from "moment";
const App = () => {
  const [data, setData] = useState([]);
  console.log(data)
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [newTodo, setNewTodo] = useState('');
  const[newTodoDesc,setNewTodoDesc] =useState('')
  const [editingTodo, setEditingTodo] = useState(null);
  const [editingText, setEditingText] = useState('');
  const [editingDesc, setEditingDesc] = useState('');
  const itemsPerPage = 3;
  const token = localStorage.getItem("token");



  const fetchData = async () => {
    try {
      const skip = (currentPage - 1) * itemsPerPage;
      const response = await axios.get(
        `http://localhost:8000/api/todos/getTodo/3/${skip}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setData(response.data.data.todos);
      console.log(response.data.data.total )
      setTotalPages(Math.ceil(response.data.data.all / itemsPerPage));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
   
    fetchData();
  }, [searchTerm, currentPage]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCreate = async () => {
    try {
      await axios.post(
        'http://localhost:8000/api/todos/createTodo',
        { name: newTodo ,
          description:newTodoDesc
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setNewTodo('');
      setNewTodoDesc('')
      setCurrentPage(1);
      setSearchTerm(''); 
    } catch (error) {
      console.error('Error creating todo:', error);
    }
  };

  const handleEdit = (todo) => {
    setEditingTodo(todo);
    setEditingText(todo.name);
  };

  const handleUpdate = async () => {
    try {
      await axios.post(
        `http://localhost:8000/api/todos/updateTodo`,
        {
          uuid: editingTodo.uuid,
          name: editingText,
          description: editingDesc,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEditingTodo(null);
      setEditingText('');
      setEditingDesc('');
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (uuid) => {
    try {
      await axios.delete(
        `http://localhost:8000/api/todos/deleteTodo/${uuid}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setSearchTerm(''); 
      fetchData();
    } catch (error) {
      console.error(error);
    }
  };

  const filteredData = data.filter(item => 
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const Pagination = ({ currentPage, totalPages, onPageChange }) => {
    const pages = [];

    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }

    return (
      <div style={{ margin: '20px 0' }}>
        {pages.map((page) => (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            style={{
              background: page === currentPage ? 'lightblue' : 'white',
              cursor: 'pointer',
            }}
          >
            {page}
          </button>
        ))}
      </div>
    );
  };

  return (
    <div>
      <h1>Todos</h1>
      <input
        type="text"
        value={searchTerm}
        onChange={handleSearchChange}
        placeholder="Search..."
      />
      <div>
        {filteredData.map((item) => (
          <div key={item.id}>
             {editingTodo && editingTodo.uuid === item.uuid ? (
              <div>
                <input
                  type="text"
                  value={editingText}
                  onChange={(e) => setEditingText(e.target.value)}
                />
                <input
                  type="text"
                  value={editingDesc}
                  onChange={(e) => setEditingDesc(e.target.value)}
                />
                <button onClick={handleUpdate}>Update</button>
                <button onClick={() => setEditingTodo(null)}>Cancel</button>
              </div>
            ) : (
              <div>
                <div>{item.name}</div>
                <div>{item.description}</div>
                <div>{moment(item.updatedAt).format('llll')}</div>
                <button onClick={() => handleEdit(item)}>Edit</button>
                <button onClick={() => handleDelete(item.uuid)}>Delete</button>
              </div>
            )}
          </div>
        ))}
      </div>
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
      <div>
        <input
          type="text"
          value={newTodo}
          onChange={(e) => setNewTodo(e.target.value)}
          placeholder="Todo Name"
        />
        <input
          type="text"
          value={newTodoDesc}
          onChange={(e) => setNewTodoDesc(e.target.value)}
          placeholder="Todo Description"
        />
        <button onClick={handleCreate}>Create</button>
      </div>
    </div>
  );
};

export default App;
