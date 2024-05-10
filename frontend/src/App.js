import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css';
import Header from './components/Header/Header'
import Login from './components/Authentication/Login'
import Register from './components/Authentication/Register'
import Tasks from './components/Tasks/Tasks'
import TasksCompleted from "./components/Tasks/TasksCompleted";
import TaskUncompleted from "./components/Tasks/TasksUncompleted";
import TaskForm from './components/Tasks/TaskForm';

function App() {
  return (
    <BrowserRouter>
      <div className='main-container'>
        <Header />
        <Routes>
          <Route path='/tasks' element={<Tasks />} />
          <Route path='/completed' element={<TasksCompleted />} />
          <Route path='/uncompleted' element={<TaskUncompleted />} />
          <Route path='/create-task' element={<TaskForm />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
