// import React, { useEffect } from 'react';
// import { Modal } from 'react-bootstrap';

// const AlertModal = ({ show, message, onHide }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => {
//         onHide();
//       }, 3000); // Hide modal after 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [show, onHide]);

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Body>
//         <p>{message}</p>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AlertModal;

// import React, { useEffect } from 'react';
// import { Modal } from 'react-bootstrap';

// const AlertModal = ({ show, message, onHide }) => {
//   useEffect(() => {
//     if (show) {
//       const timer = setTimeout(() => {
//         onHide();
//       }, 3000); // Hide modal after 3 seconds

//       return () => clearTimeout(timer);
//     }
//   }, [show, onHide]);

//   return (
//     <Modal show={show} onHide={onHide} centered>
//       <Modal.Body>
//         <p>{message}</p>
//       </Modal.Body>
//     </Modal>
//   );
// };

// export default AlertModal;

import React, { useEffect, useState } from "react";
import { Alert } from "react-bootstrap";

const AlertComponent = ({ show, message, onHide }) => {
  const [showAlert, setShowAlert] = useState(show);

  useEffect(() => {
    if (show) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        onHide();
      }, 3000); // Hide alert after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onHide]);

  return (
    <>
      {showAlert && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            zIndex: 1050,
          }}
        >
          <Alert variant="info" onClose={() => setShowAlert(false)} dismissible>
            {message}
          </Alert>
        </div>
      )}
    </>
  );
};

export default AlertComponent;
