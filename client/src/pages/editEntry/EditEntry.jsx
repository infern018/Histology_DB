import React, { useEffect, useState } from 'react'
import EntryForm from '../../components/Form/EntryForm'
import Navbar from '../../components/Navbar/Navbar'
import { useLocation } from 'react-router-dom'
import axios from 'axios'

const EditEntry = () => {
    const location = useLocation()
    const entryId = location.pathname.split("/")[3];

  return (
    <>
    <Navbar/>
    <EntryForm entryId = {entryId} />
    </>
  )
}

export default EditEntry