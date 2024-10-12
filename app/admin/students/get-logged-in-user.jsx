const res = await fetch(`http://localhost:3000/api/students?admin=admin`);

const { id } = await res.json();

export const adminId = id;
