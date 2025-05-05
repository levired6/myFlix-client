import { useState } from "react";

export const SignupView = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [email, setEmail] = useState("");
    const [birthdate, setBirthdate] = useState("");

    const handleSubmit = (event) => {
      event.preventDefault();
      //add signup api call here
      const userData = {
        Username: username,
        Password: password,
        Email: email,
        Birthday: birthdate,
      }; 

      
      fetch('https://oscars2025-f0070acec0c4.herokuapp.com/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      })
        .then((response) => {
          if (response.ok) {
            return response.json();
          } else {
            return response.json().then((data) => {
              throw new Error(data.errors ? JSON.stringify(data.errors) : `Signup failed with status: ${response.status}`);
            });
          }
        })
        .then((data) => {
          console.log('Signup successful:', data);
          alert('Signup successful! You can now log in.');
          // Optionally, you can redirect the user to the login view here
        })
        .catch((error) => {
          console.error('Signup error:', error);
          alert(`Signup failed: ${error.message}`);
        });
    };
    
    return(
        <form onSubmit={handleSubmit}>
        <label>
          Username:
          <input
            type="text"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            minLength="3"
          />
        </label>
        <label>
          Password:
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </label>
        <label>
          Email:
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </label>
        <label>
          Birthday:
          <input
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </label>
        <button type="submit">Submit</button>
      </form>
    );
};