import React, { useEffect, useState } from 'react';
import axios from 'axios';

function UsersListPage() {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        axios.get('http://localhost:5000/users')
            .then(res => setUsers(res.data))
            .catch(err => console.error('Error fetching users:', err));
    }, []);

    return (
        <div style={styles.container}>
            <h2 style={styles.heading}>All Registered Users</h2>
            <table style={styles.table}>
                <thead>
                    <tr>
                        {/* {JSON.stringify(users)} */}
                        <th style={styles.th}>Phone Number</th>
                        <th style={styles.th}>Email</th>
                    </tr>
                </thead>
                <tbody>
                    {users.map((user, index) => (
                        <tr key={index} style={{
        backgroundColor: index % 2 === 0 ? 'red' : 'blue' // light gray and white
      }}>
                            {user.Age !== undefined && user.Name !== undefined ? (
                                <>
                                    <td style={styles.td}>Name: {user.Name}</td>
                                    <td style={styles.td}>Age: {user.Age}</td>
                                </>
                            ) : (
                                <>
                                    <td style={styles.td}>Phone: {user.phone}</td>
                                    <td style={styles.td}>Email: {user.email}</td>
                                </>
                            )}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

const styles = {
    container: {
        padding: '20px',
        fontFamily: 'Arial, sans-serif',
    },
    heading: {
        fontSize: '30px',
        marginBottom: '20px',
    },
    table: {
        width: '100%',
        borderCollapse: 'collapse',
        borderSpacing: 0,               // ✅ Add this to eliminate spacing
    },
    th: {
        border: '1px solid #ccc',
        padding: '12px',
        backgroundColor: '#f2f2f2',
        textAlign: 'left',
        margin: 0,                      // ✅ Make sure margins/padding don't break layout
        height: 'auto',
    },
    td: {
        border: '1px solid #ccc',
        padding: '10px',
        margin: 0,                      // ✅ Ensure clean layout
        height: 'auto',
    }
};

export default UsersListPage;