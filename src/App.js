import { useState, useEffect } from "react";
import { db } from './firebase-config';
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore';
import 'bootstrap/dist/css/bootstrap.min.css';

function App() {
  const [users, setUsers] = useState([]);
  const [newName, setNewName] = useState("");
  const [newAge, setNewAge] = useState("");
  const [editingUserId, setEditingUserId] = useState(null);
  const [error, setError] = useState(""); 
  const userCollectionRef = collection(db, "users");

  useEffect(() => {
    const getUsers = async () => {
      const data = await getDocs(userCollectionRef);
      setUsers(data.docs.map((doc) => ({ ...doc.data(), id: doc.id })));
    };

    getUsers();
  }, []);

  // Function to create or update a user
  const createUser = async () => {
    if (!newName || !newAge || newAge <= 0) {
      setError("Please enter a valid name and age.");
      return;
    }
    setError(""); 

    if (editingUserId) {
      updateUser(editingUserId); 
    } else {
      const newUserDoc = await addDoc(userCollectionRef, { name: newName, age: Number(newAge) });
      setUsers([...users, { id: newUserDoc.id, name: newName, age: Number(newAge) }]); // Update state without page reload
    }

    setNewName("");
    setNewAge("");
    setEditingUserId(null); 
  };

  // Function to delete a user
  const deleteUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await deleteDoc(userDoc);
    setUsers(users.filter((user) => user.id !== id)); // Update the state
  };

  // Function to update a user
  const updateUser = async (id) => {
    const userDoc = doc(db, "users", id);
    await updateDoc(userDoc, { name: newName, age: Number(newAge) });
    setUsers(users.map((user) => (user.id === id ? { ...user, name: newName, age: newAge } : user))); // Update state
    setNewName("");
    setNewAge("");
    setEditingUserId(null); 
  };

  // Function to populate form with selected user's data for editing
  const editUser = (user) => {
    setNewName(user.name);
    setNewAge(user.age);
    setEditingUserId(user.id); 
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">User Management</h2>

      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-4"
      >
        <div className="row mb-3">
          <div className="col">
            <input
              type="text"
              className="form-control"
              placeholder="Enter name"
              value={newName}
              onChange={(event) => setNewName(event.target.value)}
              required
            />
          </div>
          <div className="col">
            <input
              type="number"
              className="form-control"
              placeholder="Enter age"
              value={newAge}
              onChange={(event) => setNewAge(event.target.value)}
              required
            />
          </div>
          <div className="col">
            <button className="btn btn-primary" onClick={createUser}>
              {editingUserId ? "Update User" : "Create User"}
            </button>
          </div>
        </div>

        {error && <p className="text-danger">{error}</p>}
      </form>

      <table className="table table-striped">
        <thead>
          <tr>
            <th>Name</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.id}>
              <td>{user.name}</td>
              <td>{user.age}</td>
              <td>
                <button className="btn btn-warning me-2" onClick={() => editUser(user)}>
                  Update
                </button>
                <button className="btn btn-danger" onClick={() => deleteUser(user.id)}>
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
