// import React, { useState, useEffect } from 'react';
// import { getToken } from '../utils/auth'; 
// const Header = () => {
//   const [loggedInUser, setLoggedInUser] = useState(null);

//   useEffect(() => {
//     // Retrieve token from local storage
//     const token = localStorage.getItem('token');

//     if (token) {
//       // Decode token to extract user information
//       const user = getToken(token);
//       if (user) {
//         setLoggedInUser(user.username); 
//       }
//     }
//   }, []);

//   return (
//     <header className="App-header">
//       <h1>Picture Chat</h1>
//       <nav>
//         <ul>
//           <li>
//             <a href="#logout">logout</a>
//           </li>
//           <li>
//             <a href="#signup">signup</a>
//           </li>
//           <li>
//             <a href="#login">login</a>
//           </li>
//           {loggedInUser && (
//             <li>
//               <p>Currently logged in as {loggedInUser}</p>
//             </li>
//           )}
//         </ul>
//       </nav>
//     </header>
//   );
// };

// export default Header;

