// delete this
export default async function StudentsList() {
  async function getStudents() {
    const data = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/students`); // there should be no trailing `/`

    // const students = await data.json();

    // return students;

    return data.json();
  }

  const { data, error } = await getStudents();
  console.log(data);
  return (
    <div>
      <p>Students</p>
      {data.map((student) => student.first_name)}
    </div>
  );
}
