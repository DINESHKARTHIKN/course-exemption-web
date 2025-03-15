import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import * as XLSX from 'xlsx';
import './AdminDashboard.css';
import Admin from './Admin';

const AdminDashboard = () => {

  return (
    <>
      <Admin />
      
    </>
  );
};

export default AdminDashboard;
