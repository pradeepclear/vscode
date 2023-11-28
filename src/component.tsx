// Create a React form component
import React from 'react';

function MyForm() {
    return (
        <form>
            <label htmlFor="name">Name:</label>
            <input type="text" id="name" name="name" />
            <button type="submit">Submit</button>
        </form>
    );
}

export default MyForm;
