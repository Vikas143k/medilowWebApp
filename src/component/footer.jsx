import React from "react";

const Footer = () => {
  return (
    <footer className="bg-teal-600 text-white text-center p-4 w-full mt-auto">
      <p className="text-sm">&copy; {new Date().getFullYear()} MediLow. All Rights Reserved.</p>
    </footer>
  );
};

export default Footer;
