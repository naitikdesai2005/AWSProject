import React, { useState } from "react";
import BakerRegister from "../BakerRegister/BakerRegister";

function ParentComponent() {
  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const handleOpen = () => {
    setShowRegisterForm(true);
  };

  const handleClose = () => {
    setShowRegisterForm(false);
  };

  return (
    <div>
      <button onClick={handleOpen} className="open-button">
        Register as a Baker
      </button>
      {showRegisterForm && <BakerRegister onClose={handleClose} />}
    </div>
  );
}

export default ParentComponent;
