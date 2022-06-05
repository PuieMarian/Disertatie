import { Cancel, Room } from "@material-ui/icons";
import { axiosInstance } from "../config";
import { useRef, useState } from "react";
import "./login.css";


 export default function Login({ setShowLogin, setCurrentUser,myStorage }) {
   const [error, setError] = useState(false);
   const usernameRef = useRef();
   const passwordRef = useRef();

 const handleSubmit = async (e) => {
     e.preventDefault();
     const user = {
       username: usernameRef.current.value,
       password: passwordRef.current.value,
     };

             try {
                 const res = await axiosInstance.post("/users/login", user);
                 setCurrentUser(res.data.username);
                 myStorage.setItem('user', res.data.username);
                 setShowLogin(false)
                 setError(false);
                 } catch (err) {
                 setError(true);
                 }
             };
     return(
         <div className="loginContainer">
            <div className="logo"></div>
            <Room className="logoIcon"/>
            <span>Oradea Bikepark Pin</span>
                <form onSubmit={handleSubmit}>
                   <input autoFocus placeholder="username" ref={usernameRef} />
                   <input type="password" min="6" placeholder="password" ref={passwordRef} />
                     <button className="loginBtn" type="submit">Autentificare</button>

           {error &&
           <span className="failure">Ceva este greșit!</span>}
                </form>
                  <Cancel
                         className="loginCancel"
                         onClick={() => setShowLogin(false)}
                 />
         </div>
    );
}