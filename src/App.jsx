import { useState } from 'react'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import MainLayout from './layout/MainLayout';
import Modal from './components/Modal';
import LoginForm from './components/LoginForm';
import SignUpForm from './components/SignUpForm';
import { useSelector } from 'react-redux';

function App() {
  const view = useSelector(state => state.modalForm)

  return (
    <>
      <MainLayout />
      {view &&
        <Modal>
          {view === "login" ?
            <LoginForm />
            :
            <SignUpForm />
          }
        </Modal>}
    </>
  )
}

export default App
