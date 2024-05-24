import axios from "axios"
import {format} from "date-fns"
import './App.css';
import React, {useState, useEffect} from 'react';

const baseUrl = "http://127.0.0.1:5000"

function App() {
  const [description, setDescription] = useState("");
  const [editDescription, setEditDescription] = useState("");
  const [eventsList, setEventsList] = useState([]);
  const [currentId, setCurrentId] = useState(null);

  const fetchEvents = async () => {
    const data = await axios.get('http://127.0.0.1:5000/events')
    const { events } = data.data
    setEventsList(events);

  }
  const handleChange = (e, field) => {
    if(field==='edit'){
      setEditDescription(e.target.value);
    }
    else{
      setDescription(e.target.value);
    }
  }
  const handleSubmit = async (e) => {
    e.preventDefault();
    try{
      if(editDescription){
        const data = await axios.put(`http://127.0.0.1:5000/events/${currentId}`,{description:editDescription});
        const updatedDescription = data.data.event;
        const updatedList = eventsList.map(event => {
          if(event.id===currentId){
            return event = updatedDescription
          }
          return event
        })
        setEventsList(updatedList);
      }
      else{
        const data = await axios.post('http://127.0.0.1:5000/events',{description});     
        setEventsList([...eventsList,data.data]);   
      }
      setDescription('');
      setEditDescription('');
      setCurrentId(null);      
    }catch(err){
      console.log(err.message)
    }

  }

  const handleDelete = async (id) => {
    try{
      console.log(`http://127.0.0.1:5000/events/${id}`);
      const data = await axios.delete(`http://127.0.0.1:5000/events/${id}`);
      const updatedList = eventsList.filter(event => event.id!==id);
      setEventsList(updatedList);

    }catch(err){
      console.log(err.message);

    }
  }

  const handleEdit = async (event) => {
    try{
      setCurrentId(event.id);
      setEditDescription(event.description);


    }
    catch(err){
      console.log(err.message);
    }
  }

  useEffect(() => {
    fetchEvents();
  })


  return (
    <div className="App">
      <section>
        <form onSubmit={handleSubmit}>
          <label htmlFor="description">Description</label>
          <input
          onChange={(e) => handleChange(e, 'description')} 
          type="text" 
          name="desciption" 
          id="description" 
          placeholder="Describe event"
          value={description}/>
          <button type="submit">Submit</button>
        </form>
        </section>
        <section>
          <ul>
            {eventsList.map(event => {
              if(currentId===event.id){
                return(
                  <li>
                  <form onSubmit={handleSubmit} key={event.id}>
                    <input
                    onChange={(e) => handleChange(e, 'edit')}
                    type="text"
                    name="editDescription"
                    id="editDescription"
                    value={editDescription}/>
                    <button type="submit">Submit</button>
                  </form>
                </li>
                )


              }
              else{
                return (
                  <li key={event.id}>{event.description}
                  <button onClick={() => handleEdit(event)}>Edit</button>
                  <button onClick={() => handleDelete(event.id)}>X</button>
                  </li>
                )
              }

            })}
          </ul>
        </section>
    </div>
  );
}

export default App;
