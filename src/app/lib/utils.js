//Continue to write the login logic

export async function  getuser(email){
    const user = await fetch(`http://localhost:3001/users?email=${email}`)
          .then(response => response.json())
          .then(data => data)
          .catch(error => console.error('Error:', error));
          return user
}