import React from 'react';

function RecipePage() {
  return (
    <div style={{ maxWidth: '800px', margin: '20px auto', padding: '20px', backgroundColor: 'white', boxShadow: '0 0 10px rgba(0, 0, 0, 0.1)', borderRadius: '5px' }}>
      <h2>My Recipes</h2>
      <div>
        <h3>Breakfast</h3>
        {/* Display breakfast recipes */}
      </div>
      <div>
        <h3>Lunch</h3>
        {/* Display lunch recipes */}
      </div>
      <div>
        <h3>Dinner</h3>
        {/* Display dinner recipes */}
      </div>
      <div>
        <h3>Desserts</h3>
        {/* Display dessert recipes */}
      </div>
    </div>
  );
}

export default RecipePage;
