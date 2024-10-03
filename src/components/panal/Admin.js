import React from 'react'
import AdminHeroSection from '../pages/admin/AdminHeroSection';
import AdminUser from '../pages/admin/AdminUser';
import AdminPlans from '../pages/admin/AdminPlans';
import AdminCard from '../pages/admin/AdminCard'; 
import AdminCardService from '../pages/admin/AdminCardService';
import AdminServices from '../pages/admin/AdminServices';
import AdminFAQ from '../pages/admin/AdminFAQ'; 

const Admin = () => {
  return (
    <div>
      <AdminHeroSection />
      <AdminCard />
      <AdminCardService />
      <AdminUser/>
      <AdminPlans />
      <AdminServices />
      <AdminFAQ />
    </div>
  )
}

export default Admin;