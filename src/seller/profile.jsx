import React from 'react';
import { useState } from 'react';
const Profile = () => {
    const [profile, setProfile] = useState({
        name: '',
        email: '',
        password: ''
    });
    return ( 
        <div className="seller">
            <h1>Seller Profile</h1>
            <form action="">
                <input type="text" placeholder="Name" />
                <input type="email" placeholder="Email" />
                <input type="password" placeholder="Password" />
                <button type="submit">Update Profile</button>
            </form>
        </div>
     );
}
 
export default Profile;