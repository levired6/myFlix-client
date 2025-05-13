import { useState } from "react";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

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
        <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="signUpFormUsername">
                <Form.Label>Username:</Form.Label>
                <Form.Control
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  minLength="3"
                  className="bg-white text-dark"
                />
                </Form.Group>

        <Form.Group className="mb-3" controlId="signUpFormPassword">
            <Form.Label>Password:</Form.Label>
              <Form.Control
               type="password"
               value={password}
               onChange={(e) => setPassword(e.target.value)}
               required
               className="bg-white text-dark"
             />
           </Form.Group>

        <Form.Group className="mb-3" controlId="signUpFormEmail">
            <Form.Label>Email:</Form.Label>
              <Form.Control
               type="email"
               value={email}
               onChange={(e) => setEmail(e.target.value)}
               required
               className="bg-white text-dark"
             />
           </Form.Group>

        <Form.Group className="mb-3" controlId="signUpFormBirthday">
            <Form.Label>Birthday:</Form.Label>
              <Form.Control
               type="date"
               value={birthdate}
               onChange={(e) => setBirthdate(e.target.value)}
               required
               className="bg-white text-dark"
             />
           </Form.Group>

        <Button variant="primary" type="submit" className="metallic-blue-button">
            Submit
      </Button>
      </Form>
    );
};