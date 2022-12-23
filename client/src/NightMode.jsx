import React, { useState } from 'react';

function NightMode() {
  const [isNightMode, setIsNightMode] = useState(false);

  const toggleNightMode = () => {
    setIsNightMode(!isNightMode);
  }

  return (
    <div className={`NightMode ${isNightMode ? 'night-mode' : ''}`}>
      <button onClick={toggleNightMode}>Toggle Night Mode</button>
      {/* other components go here */}
    </div>
  );
}

export default NightMode;
