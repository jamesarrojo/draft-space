const res = await fetch(
  `${process.env.NEXT_PUBLIC_HOST_URL}:3000/api/students?admin=admin`
);

const { id } = await res.json();

export const adminId = id;
