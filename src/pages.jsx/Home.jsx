import React, { useState } from "react";

//import { FaCheck } from "react-icons/fa";
import { MdCheck } from "react-icons/md";
import { MdDeleteForever } from "react-icons/md";
const Todo = () => {
    const[inputValue, setInputValue] = useState(" ");
    const [task, setTask] = useState([]);

    const handleInputChange = (value) => {
        setInputValue(value);
    };

    const handleFormSubmit = (event) => {
        event.preventDefault();
        if(!inputValue) return;

        if(task.includes(inputValue)){
            setInputValue("");
        } return;

        setTask((prevTask) => [...prevTask, inputValue]);

        setInputValue(" ");
        };
    return(
        <section>
            <header>
                <h1>Todo List</h1>
            </header>
            <section className="form">
                <form onSubmit={handleFormSubmit}>
                    <div>
                        <input type="text" className="todo-input" autoComplete="off" value={ inputValue}
                        onChange={(event) => handleInputChange(event.target.value)} />
                    </div>
                    <div>
                        <button type="submit" className="todo-btn">Add Task</button>
                    </div>
                </form>
    
            </section>
            <section className="myUnordList">
                <ul>
                    {task.map((curTask, index) => {
                        return(
                            <li key={index}>
                                <span>{curTask}</span>
                                <button className="check-btn">
                                    <MdCheck />
                                </button >
                                <button className="delete-btn">
                                    <MdDeleteForever />
                                </button>
                            </li> 
                        );
                    })}
                </ul>

            </section>
        </section>
    );
}
export default Todo;