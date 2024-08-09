import React from "react";
import { Outlet } from "react-router-dom";
import Filters from "../components/Filters";
import TableComponent from "../components/TableComponent";

const Crypto = () => {
  return (
    <section className="w-[80%] h-full flex flex-col mt-16 mb-24 relative">
      <h1 style={{ color: 'white', fontWeight: 'bold', fontSize: '2.5rem', textAlign: 'center', margin: '20px 0', letterSpacing: '2px' }}>
  'Dashboard'
</h1>
      <Filters />
      <TableComponent />
      <Outlet />
    </section>
  );
};

export default Crypto;
