import React, {useState} from 'react'

function LoginPage() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const submit = async () => {   
        const user = {  email, password };    
        try {
            const response = await fetch('http://localhost:5000/user/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(user),
            });
            const data = await response.json();
            if (data.token) localStorage.setItem('token', data.token);
            if (data.message) {
                alert(data.message);
            }
        } catch (error) {
            return alert(`Error: ${error}`);
        }
    }

  return (
    <div>
        <h1>Login</h1>
        <input type="text" placeholder='Enter email' value={email} onChange={event => setEmail(event.target.value)}/>
        <input type="password" placeholder='Enter password' value={password} onChange={event => setPassword(event.target.value)}/>
        <button onClick={submit}>Login</button>
      
    </div>
  )
}

export default LoginPage;
