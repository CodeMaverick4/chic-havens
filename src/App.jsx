import { useState } from 'react'
import Topbar from './components/Topbar'
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import Card from './components/Card';

function App() {
  return (
    <div>
      <Topbar />
      <div className='banner-height'>        
        <img src="bannerImage.svg" alt="" className='object-fit-cover' />
      </div>      

      <div className='container mt-3'>
        <div className='d-flex justify-content-between align-items-center'>
          <div className='d-flex align-items-center gap-4'>
            <div className='d-flex gap-2 align-items-center '><i class="bi bi-filter-left"></i> Filter</div>
            <div className='d-flex gap-2 align-items-center'><i class="bi bi-arrow-down-up"></i> Sort By</div>
          </div>

          <h4>Total Products: 20</h4>
          <div className='position-relative'>
            <input type="text" name="" id="" className='search-input' placeholder='Search by name...' />
            <i class="bi bi-search search-input-icon"></i>
          </div>
        </div>

        {/* products list */}
        <div className='d-flex gap-3 mt-3'>
          <Card />
          <Card />
          <Card />
          <Card />
        </div>

        {/* footer  */}
        <div className='p-5'>

        </div>
      </div>
    </div>
  )
}

export default App
